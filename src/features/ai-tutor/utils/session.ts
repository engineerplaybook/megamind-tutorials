// A stable, per-browser conversation id so two visitors don't share the
// backend's in-memory history (the backend keys conversations by username).
const SESSION_KEY = 'engineer_playbook_tutor_session';

export function getTutorSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem(SESSION_KEY, id);
  return id;
}
