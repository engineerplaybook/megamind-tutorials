// Splits text into speakable sentence-ish chunks. Chrome's speechSynthesis
// drops very long single utterances, so replies are spoken sentence-by-sentence.
export function chunkIntoSentences(text) {
  return (
    (text || '').replace(/\n+/g, ' ').match(/[^.!?;]+[.!?;]+["']?|\S.*$/g) || [
      text || '',
    ]
  )
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 40);
}
