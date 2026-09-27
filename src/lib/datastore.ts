// Conversation history + per-conversation system prompt, keyed by a
// free-text conversation label (no longer a per-user account — see
// src/lib/auth.ts for the single shared login). In-memory rather than the
// old .tipc-data.json file store: Vercel Functions have an ephemeral
// filesystem that isn't reliably shared across invocations/instances, so the
// file store was already not durable in production despite looking like it
// was in local dev.
interface ChatTurn {
  role: string;
  content: string;
}

const conversations = new Map<string, ChatTurn[]>();
const systemPrompts = new Map<string, string>();

export function getConversation(username: string): ChatTurn[] {
  return conversations.get(username) || [];
}

export function updateConversation(username: string, history: ChatTurn[]) {
  conversations.set(username, history);
}

export function getSystemPrompt(username: string): string | undefined {
  return systemPrompts.get(username);
}

export function setSystemPrompt(username: string, systemPrompt: string) {
  systemPrompts.set(username, systemPrompt);
}
