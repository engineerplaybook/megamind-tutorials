import { Client } from 'pg';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
const POLLINATIONS_API_KEY = process.env.POLLINATIONS_API_KEY || '';
const LLM_MODEL = process.env.LLM_MODEL || 'openai';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
// Hard cost guardrail: OpenRouter bills for any model without a ":free" suffix.
// Rather than trusting OPENROUTER_MODEL to always be set correctly, reject any
// override that isn't a free-tier model and fall back to the known-free
// default — so a bad/stale env var can never silently turn into real spend.
const OPENROUTER_FREE_DEFAULT = 'meta-llama/llama-3.1-8b-instruct:free';
const OPENROUTER_MODEL_REQUESTED = process.env.OPENROUTER_MODEL || '';
if (OPENROUTER_MODEL_REQUESTED && !OPENROUTER_MODEL_REQUESTED.endsWith(':free')) {
  console.warn(
    `OPENROUTER_MODEL="${OPENROUTER_MODEL_REQUESTED}" is not a free-tier model (must end with ":free") ` +
    `— ignoring it and using "${OPENROUTER_FREE_DEFAULT}" instead to avoid unexpected billing.`
  );
}
const OPENROUTER_MODEL = OPENROUTER_MODEL_REQUESTED.endsWith(':free')
  ? OPENROUTER_MODEL_REQUESTED
  : OPENROUTER_FREE_DEFAULT;

export const DEFAULT_SYSTEM_PROMPT =
  'You are a friendly TiPC learning assistant. Help the user learn about topics they ask. ' +
  'Keep answers concise, educational, and safe. Refuse disallowed content (wrongdoing, self-harm, hate, sexual content involving minors).';

const BLOCKED_PATTERNS = [
  /how to (make|build).*(bomb|weapon|explosive)/i,
  /self[\s-]?harm|kill myself|suicide/i,
  /sexual.*(child|minor|kid)/i,
  /hate (speech|group).*kill/i,
];

export function guardrailCheck(text: string): string | null {
  if (!text || typeof text !== 'string') return null;
  if (text.length > 2000) {
    return 'Your message is too long. Please keep it under 2000 characters.';
  }
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(text)) {
      return 'I can\'t help with that request. I\'m a TiPC learning assistant — ask me about a topic you\'d like to learn instead.';
    }
  }
  return null;
}

export function localFallbackReply(userMessage: string): string {
  const content = (userMessage || '').toLowerCase();
  if (content.includes('hello') || content.includes('hi ')) {
    return 'Hello! I am your TiPC assistant. Ask me about any topic you want to learn — e.g. "Explain photosynthesis simply".';
  }
  if (content.includes('tip')) {
    return 'TiPC is a platform for sharing and discovering tips. Tell me a topic and I\'ll explain it step by step.';
  }
  if (content.includes('thank')) {
    return "You're welcome! What would you like to learn next?";
  }
  if (content.includes('bye') || content.includes('goodbye')) {
    return 'Goodbye! Come back anytime to keep learning.';
  }
  return `I heard you say: "${userMessage}". (Offline fallback — the free LLM is temporarily unreachable. Please try again in a few seconds.)`;
}

export function llmProvider(): string {
  if (OPENAI_API_KEY) return `openai:${OPENAI_MODEL}`;
  if (GEMINI_API_KEY) return `gemini:${GEMINI_MODEL}`;
  if (GROQ_API_KEY) return `groq:${GROQ_MODEL}`;
  if (OPENROUTER_API_KEY) return `openrouter:${OPENROUTER_MODEL}`;
  if (POLLINATIONS_API_KEY) return `pollinations-auth:${LLM_MODEL}`;
  return `pollinations-anon:${LLM_MODEL}`;
}

// RAG: no embedding model is available in this serverless environment, so
// this retrieves by Postgres full-text search over `content` instead of
// vector similarity — same Neon database the RAG chunks were restored into,
// no extra embedding API or account needed. Degrades to no retrieval (plain
// chat) rather than failing the request if RAG_DATABASE_URL is unset or the
// query errors, since doc grounding is a nice-to-have, not a requirement.
async function fullTextRetrieve(question: string, topK = 5) {
  if (!process.env.RAG_DATABASE_URL) return [];
  const client = new Client({ connectionString: process.env.RAG_DATABASE_URL });
  try {
    await client.connect();
    const result = await client.query(
      `SELECT source, file_path, heading_trail, content
       FROM chunks
       WHERE to_tsvector('english', content) @@ plainto_tsquery('english', $1)
       ORDER BY ts_rank(to_tsvector('english', content), plainto_tsquery('english', $1)) DESC
       LIMIT $2`,
      [question, topK]
    );
    return result.rows;
  } catch (err) {
    console.error('RAG full-text retrieval failed, continuing without it:', (err as Error).message);
    return [];
  } finally {
    await client.end().catch(() => {});
  }
}

export async function ragAugmentMessages(messages: any[]) {
  const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
  const question = lastUserMsg ? lastUserMsg.content : '';
  const chunks = await fullTextRetrieve(question);
  if (chunks.length === 0) return messages;

  const contextBlock = chunks
    .map((c) => `[${c.source} — ${c.heading_trail}]\n${c.content}`)
    .join('\n\n');
  const augmentedContent =
    `Use the following documentation excerpts to help answer the question, if relevant. ` +
    `If they don't cover it, answer from general knowledge instead of guessing.\n\n` +
    `${contextBlock}\n\nQuestion: ${question}`;

  const lastUserIndex = messages.length - 1 - [...messages].reverse().findIndex((m) => m.role === 'user');
  return messages.map((m, i) => (i === lastUserIndex ? { ...m, content: augmentedContent } : m));
}

async function* streamOpenRouter(messages: any[]) {
  const augmented = await ragAugmentMessages(messages);
  yield* relayOpenAICompatibleStream(
    'https://openrouter.ai/api/v1/chat/completions',
    { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENROUTER_API_KEY}` },
    { model: OPENROUTER_MODEL, messages: augmented, temperature: 0.7, max_tokens: 600 }
  );
}

export function parseSSEBuffer(buffer: string): { events: string[], remainder: string } {
  // Normalizes CRLF (Gemini streams \r\n) and reassembles JSON payloads that
  // providers split across multiple SSE frames — including continuation
  // blocks that arrive without a `data:` prefix. Complete JSON objects (and
  // [DONE] markers) are emitted; partial tails are returned as remainder.
  const normalized = buffer.replace(/\r\n/g, '\n');
  const parts = normalized.split('\n\n');
  const tail = parts.pop() || '';
  const events: string[] = [];
  let pending = '';

  const flush = (text: string) => {
    const t = (text || '').trim();
    if (!t) return;
    if (t === '[DONE]') {
      pending = '';
      events.push('[DONE]');
      return;
    }
    try {
      JSON.parse(t);
      events.push(t);
      return;
    } catch {
      // Possibly a JSON object split across frames — accumulate and retry.
    }
    const candidate = pending + t;
    try {
      JSON.parse(candidate);
      events.push(candidate);
      pending = '';
    } catch {
      pending = candidate;
    }
  };

  for (const block of parts) {
    const dataLines: string[] = [];
    const other: string[] = [];
    for (const line of block.split('\n')) {
      if (line.startsWith('data:')) dataLines.push(line.slice(5).trim());
      else if (line.trim() && !line.startsWith(':')) other.push(line.trim());
    }
    if (dataLines.length) flush(dataLines.join('\n'));
    else if (other.length) flush(other.join(''));
  }

  return { events, remainder: pending ? pending + '\n\n' + tail : tail };
}

async function safeText(response: Response): Promise<string> {
  try {
    return await response.text();
  } catch (e) {
    return '';
  }
}

async function* relayOpenAICompatibleStream(url: string, headers: Record<string, string>, body: any) {
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ ...body, stream: true }),
  });
  if (!response.ok || !response.body) {
    throw new Error(`Stream request failed: ${response.status} ${await safeText(response)}`);
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const { events, remainder } = parseSSEBuffer(buffer);
    buffer = remainder;
    for (const raw of events) {
      if (raw === '[DONE]') return;
      let parsed: any;
      try {
        parsed = JSON.parse(raw);
      } catch (e) {
        continue;
      }
      const delta = parsed?.choices?.[0]?.delta?.content;
      if (delta) yield delta;
    }
  }
}

function streamOpenAI(messages: any[]) {
  return relayOpenAICompatibleStream(
    'https://api.openai.com/v1/chat/completions',
    { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_API_KEY}` },
    { model: OPENAI_MODEL, messages, temperature: 0.7, max_tokens: 600 }
  );
}

function streamGroq(messages: any[]) {
  return relayOpenAICompatibleStream(
    'https://api.groq.com/openai/v1/chat/completions',
    { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_API_KEY}` },
    { model: GROQ_MODEL, messages, temperature: 0.7, max_tokens: 600 }
  );
}

function streamPollinationsAuthed(messages: any[]) {
  return relayOpenAICompatibleStream(
    'https://gen.pollinations.ai/v1/chat/completions',
    { 'Content-Type': 'application/json', Authorization: `Bearer ${POLLINATIONS_API_KEY}` },
    { model: LLM_MODEL, messages, temperature: 0.7, max_tokens: 600 }
  );
}

function streamPollinationsAnon(messages: any[]) {
  return relayOpenAICompatibleStream(
    'https://text.pollinations.ai/openai',
    { 'Content-Type': 'application/json' },
    { model: LLM_MODEL, messages, temperature: 0.7, max_tokens: 600 }
  );
}

async function* streamGemini(messages: any[]) {
  const system = messages.find((m) => m.role === 'system')?.content || '';
  const contents = messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
  const body: any = { contents, generationConfig: { temperature: 0.7, maxOutputTokens: 600 } };
  if (system) body.systemInstruction = { parts: [{ text: system }] };
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok || !response.body) {
    throw new Error(`Gemini stream failed: ${response.status} ${await safeText(response)}`);
  }
  // TEMP-DEBUG
  console.error(`[tipc-debug] gemini model=${GEMINI_MODEL} keyLen=${(GEMINI_API_KEY || '').length} status=${response.status}`);
  console.error(`[tipc-debug] headers=${JSON.stringify(Object.fromEntries(response.headers.entries())).slice(0,300)}`);
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  // TEMP-DEBUG
  let rawAll = '';
  let eventCount = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    rawAll += buffer.slice(-500);
    const { events, remainder } = parseSSEBuffer(buffer);
    buffer = remainder;
    eventCount += events.length;
    for (const raw of events) {
      let parsed: any;
      try {
        parsed = JSON.parse(raw);
      } catch (e) {
        continue;
      }
      const text = parsed?.candidates?.[0]?.content?.parts?.map((p: any) => p.text || '').join('');
      if (text) yield text;
    }
  }
  // TEMP-DEBUG
  console.error(`[tipc-debug] events=${eventCount} rawEscaped=${JSON.stringify(rawAll.slice(0, 700))}`);
}

function buildCandidateStreams(messages: any[]) {
  const candidates = [];
  if (OPENAI_API_KEY) candidates.push({ provider: `openai:${OPENAI_MODEL}`, makeGenerator: () => streamOpenAI(messages) });
  if (GEMINI_API_KEY) candidates.push({ provider: `gemini:${GEMINI_MODEL}`, makeGenerator: () => streamGemini(messages) });
  if (GROQ_API_KEY) candidates.push({ provider: `groq:${GROQ_MODEL}`, makeGenerator: () => streamGroq(messages) });
  if (OPENROUTER_API_KEY) candidates.push({ provider: `openrouter:${OPENROUTER_MODEL}`, makeGenerator: () => streamOpenRouter(messages) });
  if (POLLINATIONS_API_KEY) candidates.push({ provider: `pollinations-auth:${LLM_MODEL}`, makeGenerator: () => streamPollinationsAuthed(messages) });
  candidates.push({ provider: `pollinations-anon:${LLM_MODEL}`, makeGenerator: () => streamPollinationsAnon(messages) });
  return candidates;
}

// Pollinations sometimes answers with HTTP 200 whose *content* is an error
// string (e.g. an exhausted key budget) instead of a model reply. Serving
// that as the assistant's answer is always wrong, so treat it as a provider
// failure and fall through to the next candidate. Checked on the first chunk
// so streaming clients never display it either.
function isProviderErrorText(text: string): boolean {
  return /has reached its budget|raise the key budget/i.test(text || '');
}

export async function* streamLLMResponse(messages: any[]) {
  const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
  const userText = lastUserMsg ? lastUserMsg.content : '';

  const blocked = guardrailCheck(userText);
  if (blocked) {
    yield { delta: blocked, provider: 'guardrail' };
    return;
  }

  const errors = [];
  for (const { provider, makeGenerator } of buildCandidateStreams(messages)) {
    let gen;
    try {
      gen = makeGenerator();
      const first = await gen.next();
      if (first.done) continue;
      if (isProviderErrorText(first.value)) {
        errors.push(`${provider}: served an error string as content, skipped`);
        continue;
      }
      yield { delta: first.value, provider };
    } catch (err: any) {
      errors.push(`${provider}: ${err.message}`);
      continue;
    }
    for await (const delta of gen) {
      yield { delta, provider };
    }
    return;
  }

  console.error('All streaming LLM providers failed:', errors.join(' | '));
  yield { delta: localFallbackReply(userText), provider: 'offline-fallback' };
}
