import { NextResponse } from 'next/server';
import { requireAuth } from '@/src/lib/auth';
import { getConversation, updateConversation, getSystemPrompt } from '@/src/lib/datastore';
import { streamLLMResponse, DEFAULT_SYSTEM_PROMPT } from '@/src/lib/llmProviders';

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

    history.push({ role: 'user', content: message });
    updateConversation(username, history);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let providerUsed = '';
        const messagesForLlm = [
          { role: 'system', content: systemPrompt },
          ...history
        ];

        let fullReply = '';
        try {
          const generator = streamLLMResponse(messagesForLlm);
          for await (const { delta, provider } of generator) {
            fullReply += delta;
            if (!providerUsed) providerUsed = provider;

            const sseData = JSON.stringify({ delta, provider });
            controller.enqueue(encoder.encode(`data: ${sseData}\n\n`));
          }

          history.push({ role: 'assistant', content: fullReply });
          updateConversation(username, history);

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      }
    });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
