import { NextResponse } from 'next/server';
import { requireAuth } from '@/src/lib/auth';
import { getConversation, updateConversation, getSystemPrompt } from '@/src/lib/datastore';
import { streamLLMResponse, DEFAULT_SYSTEM_PROMPT } from '@/src/lib/llmProviders';

// Non-streaming chat — same conversation semantics as /api/chat/stream,
// but collects the provider stream into a single reply.
export async function POST(req: Request) {
  const auth = requireAuth(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { username, message, systemPrompt: clientSystemPrompt } = await req.json();
    if (!username || !message) {
      return NextResponse.json({ error: 'username and message required' }, { status: 400 });
    }

    const history = getConversation(username);
    const systemPrompt = clientSystemPrompt || getSystemPrompt(username) || DEFAULT_SYSTEM_PROMPT;
    const messagesForLlm = [{ role: 'system', content: systemPrompt }, ...history, { role: 'user', content: message }];

    let reply = '';
    let provider = 'unknown';
    let offline = false;
    for await (const { delta, provider: p } of streamLLMResponse(messagesForLlm)) {
      reply += delta;
      provider = p;
    }
    if (provider === 'guardrail' || provider === 'offline-fallback') {
      offline = true;
    }
    if (!reply) {
      reply = 'Sorry, I got an empty response.';
      provider = 'offline-fallback';
      offline = true;
    }

    history.push({ role: 'user', content: message }, { role: 'assistant', content: reply });
    while (history.length > 20) history.shift();
    updateConversation(username, history);

    return NextResponse.json({ response: reply, username, provider, offline });
  } catch (error) {
    console.error('Error generating LLM response:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
