import { useCallback } from 'react';
import { parseSSEBuffer } from '../utils/sseParser';
import { authHeaders } from '../utils/auth';
import { API_BASE } from '../utils/apiBase';

// POSTs to /api/chat/stream and reads the SSE body via fetch's ReadableStream
// (not EventSource, which can't send a POST body). Calls onDelta as each
// chunk arrives and resolves with the full accumulated text + last-seen
// provider once the stream ends.
export function useChatStream() {
  const streamChat = useCallback(async ({ username, message, systemPrompt }, onDelta) => {
    const response = await fetch(`${API_BASE}/api/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ username, message, systemPrompt }),
    });
    if (!response.ok || !response.body) {
      throw new Error(`Stream request failed: ${response.status}`);
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullText = '';
    let provider = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const { events, remainder } = parseSSEBuffer(buffer);
      buffer = remainder;
      for (const raw of events) {
        if (raw === '[DONE]') {
          return { fullText, provider };
        }
        let parsed;
        try {
          parsed = JSON.parse(raw);
        } catch (e) {
          continue;
        }
        if (parsed.delta) {
          fullText += parsed.delta;
          provider = parsed.provider || provider;
          if (onDelta) onDelta(parsed.delta, fullText);
        }
      }
    }
    return { fullText, provider };
  }, []);

  return { streamChat };
}
