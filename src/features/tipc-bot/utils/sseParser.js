// Parses a growing text buffer of Server-Sent Events into complete "data:" lines
// plus whatever incomplete tail hasn't arrived yet. Caller keeps feeding
// remainder back in as more chunks arrive over the stream.
export function parseSSEBuffer(buffer) {
  const parts = buffer.split('\n\n');
  const remainder = parts.pop() || '';
  const events = parts
    .map((chunk) =>
      chunk
        .split('\n')
        .filter((line) => line.startsWith('data:'))
        .map((line) => line.slice(5).trim())
        .join('')
    )
    .filter(Boolean);
  return { events, remainder };
}
