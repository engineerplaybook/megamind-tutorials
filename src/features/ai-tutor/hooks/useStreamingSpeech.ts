import { useCallback, useEffect, useRef, useState } from 'react';

const MAX_CHUNK_CHARS = 220;

function cleanForSpeech(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_~#>{|}-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitLongSentence(sentence: string): string[] {
  if (sentence.length <= MAX_CHUNK_CHARS) return [sentence];
  const words = sentence.split(' ');
  const chunks: string[] = [];
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length > MAX_CHUNK_CHARS && current) {
      chunks.push(current.trim());
      current = word;
    } else {
      current = `${current} ${word}`.trim();
    }
  }
  if (current) chunks.push(current.trim());
  return chunks;
}

// Streaming text arrives in fragments, so only speak complete sentences and
// keep the tail buffered until the next delta closes it.
function takeCompleteSentences(buffer: string): { sentences: string[]; remainder: string } {
  const boundary = /[.!?](?=\s|$)|\n\n/g;
  let end = -1;
  let match: RegExpExecArray | null;
  while ((match = boundary.exec(buffer)) !== null) {
    end = match.index + match[0].length;
  }
  if (end === -1) return { sentences: [], remainder: buffer };

  const sentences = buffer
    .slice(0, end)
    .split(/(?<=[.!?])\s+|\n+/)
    .map(cleanForSpeech)
    .filter(Boolean)
    .flatMap(splitLongSentence);

  return { sentences, remainder: buffer.slice(end) };
}

export function useStreamingSpeech() {
  const [supported, setSupported] = useState(true);

  const synthRef = useRef<SpeechSynthesis | null>(
    typeof window !== 'undefined' ? window.speechSynthesis : null
  );
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const queueRef = useRef<string[]>([]);
  const bufferRef = useRef('');
  const spokenCharsRef = useRef(0);
  const finishingRef = useRef(false);
  const speakingRef = useRef(false);
  const onEndRef = useRef<(() => void) | null>(null);
  const speakNextRef = useRef<() => void>(() => {});

  useEffect(() => {
    const synth = synthRef.current;
    if (!synth) {
      setSupported(false);
      return;
    }
    const pickVoice = () => {
      const voices = synth.getVoices();
      if (voices.length) {
        voiceRef.current = voices.find((v) => v.lang.startsWith('en')) || voices[0];
      }
    };
    pickVoice();
    synth.onvoiceschanged = pickVoice;
    return () => {
      synth.onvoiceschanged = null;
      synth.cancel();
    };
  }, []);

  const speakNext = useCallback(() => {
    const synth = synthRef.current;
    if (!synth) return;

    if (queueRef.current.length === 0) {
      speakingRef.current = false;
      if (finishingRef.current) {
        finishingRef.current = false;
        const onEnd = onEndRef.current;
        onEndRef.current = null;
        onEnd?.();
      }
      return;
    }

    const text = queueRef.current.shift();
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voiceRef.current;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onend = () => speakNextRef.current();
    utterance.onerror = () => speakNextRef.current();

    speakingRef.current = true;
    synth.speak(utterance);
  }, []);

  useEffect(() => {
    speakNextRef.current = speakNext;
  }, [speakNext]);

  const enqueue = useCallback((sentences: string[]) => {
    if (!sentences.length) return;
    queueRef.current.push(...sentences);
    if (!speakingRef.current) speakNextRef.current();
  }, []);

  const start = useCallback(() => {
    queueRef.current = [];
    bufferRef.current = '';
    spokenCharsRef.current = 0;
    finishingRef.current = false;
    onEndRef.current = null;
  }, []);

  const append = useCallback((fullText: string) => {
    const newText = fullText.slice(spokenCharsRef.current);
    spokenCharsRef.current = fullText.length;
    if (!newText) return;
    bufferRef.current += newText;
    const { sentences, remainder } = takeCompleteSentences(bufferRef.current);
    bufferRef.current = remainder;
    enqueue(sentences);
  }, [enqueue]);

  const finish = useCallback((onEnd?: () => void) => {
    onEndRef.current = onEnd || null;
    finishingRef.current = true;
    const tail = cleanForSpeech(bufferRef.current);
    bufferRef.current = '';
    if (tail) enqueue(splitLongSentence(tail));
    if (!speakingRef.current && queueRef.current.length === 0) {
      finishingRef.current = false;
      onEndRef.current = null;
      onEnd?.();
    }
  }, [enqueue]);

  const cancel = useCallback(() => {
    synthRef.current?.cancel();
    queueRef.current = [];
    bufferRef.current = '';
    spokenCharsRef.current = 0;
    finishingRef.current = false;
    speakingRef.current = false;
    onEndRef.current = null;
  }, []);

  // Chrome needs at least one speak() call inside a real click before it will
  // play speech triggered later by an async stream.
  const prime = useCallback(() => {
    try {
      synthRef.current?.speak(new SpeechSynthesisUtterance(''));
    } catch {
      // ignore — priming is best effort
    }
  }, []);

  return { append, start, finish, cancel, prime, supported };
}
