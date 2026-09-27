import { useCallback, useEffect, useRef, useState } from 'react';
import { chunkIntoSentences } from '../utils/sentenceChunker';

// Chrome pauses long speech after ~15s; resuming keeps it going.
const KEEP_ALIVE_MS = 5000;
// Widened from the original 100ms: cancel()->speak() too close together is a
// known trigger for Chrome's speech engine getting wedged.
const CANCEL_TO_SPEAK_GAP_MS = 250;
// If `start` never fires within this window, Chrome's engine is likely stuck
// (a known long-standing bug where it drops speak() calls with *no* error
// event at all) — surface that instead of staying silently dead.
const START_TIMEOUT_MS = 2000;

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const [engineUnavailable, setEngineUnavailable] = useState(false);
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const voiceRef = useRef(null);
  const keepAliveRef = useRef(null);
  const startTimeoutRef = useRef(null);
  const lastReplyRef = useRef('');
  const primedRef = useRef(false);

  useEffect(() => {
    const synth = synthRef.current;
    if (!synth) return;
    const pickVoice = () => {
      try {
        const vs = synth.getVoices();
        if (vs && vs.length) {
          voiceRef.current = vs.find((v) => v.lang && v.lang.startsWith('en')) || vs[0];
        }
      } catch (e) {
        // ignore
      }
    };
    pickVoice();
    synth.onvoiceschanged = pickVoice;
    return () => {
      clearKeepAlive();
      clearStartTimeout();
    };
  }, []);

  const clearKeepAlive = () => {
    if (keepAliveRef.current) {
      clearInterval(keepAliveRef.current);
      keepAliveRef.current = null;
    }
  };

  const clearStartTimeout = () => {
    if (startTimeoutRef.current) {
      clearTimeout(startTimeoutRef.current);
      startTimeoutRef.current = null;
    }
  };

  // Call once on the very first user click on the page. Some Chrome builds
  // need a synthesis call inside a real gesture to "unlock" the engine
  // before any later, async-triggered speak() calls will work at all.
  const prime = useCallback(() => {
    const synth = synthRef.current;
    if (!synth || primedRef.current) return;
    primedRef.current = true;
    try {
      synth.speak(new SpeechSynthesisUtterance(''));
    } catch (e) {
      // ignore
    }
  }, []);

  const stop = useCallback(() => {
    const synth = synthRef.current;
    if (synth) {
      try {
        synth.cancel();
      } catch (e) {
        // ignore
      }
    }
    clearKeepAlive();
    clearStartTimeout();
    setIsSpeaking(false);
  }, []);

  const speak = useCallback((text, { onDone } = {}) => {
    lastReplyRef.current = text || '';
    const synth = synthRef.current;
    if (!text || !synth) {
      if (onDone) onDone();
      return;
    }
    try {
      synth.cancel();
      clearKeepAlive();
      clearStartTimeout();
      setVoiceError('');
      setEngineUnavailable(false);
      try {
        synth.resume();
      } catch (e) {
        // ignore
      }
      const chunks = chunkIntoSentences(text);
      let idx = 0;
      let gotStart = false;

      const speakNext = () => {
        if (idx >= chunks.length) {
          setIsSpeaking(false);
          clearKeepAlive();
          if (onDone) onDone();
          return;
        }
        const u = new SpeechSynthesisUtterance(chunks[idx]);
        u.rate = 1;
        u.pitch = 1;
        // Re-check getVoices() here, not only at mount, in case voices
        // finished loading after mount but before voiceRef was populated.
        u.voice = voiceRef.current || synth.getVoices().find((v) => v.lang && v.lang.startsWith('en'));
        u.onstart = () => {
          gotStart = true;
          clearStartTimeout();
        };
        u.onend = () => {
          idx += 1;
          speakNext();
        };
        u.onerror = (ev) => {
          if (ev && (ev.error === 'canceled' || ev.error === 'interrupted')) return;
          clearKeepAlive();
          clearStartTimeout();
          setIsSpeaking(false);
          setVoiceError(
            `Voice playback was blocked (${(ev && ev.error) || 'unknown error'}). Tap Replay to hear the answer.`
          );
          if (onDone) onDone();
        };
        setIsSpeaking(true);
        synth.speak(u);

        clearStartTimeout();
        startTimeoutRef.current = setTimeout(() => {
          if (!gotStart) {
            clearKeepAlive();
            setIsSpeaking(false);
            setEngineUnavailable(true);
            if (onDone) onDone();
          }
        }, START_TIMEOUT_MS);
      };

      clearKeepAlive();
      keepAliveRef.current = setInterval(() => {
        try {
          if (synth.speaking) synth.resume();
        } catch (e) {
          // ignore
        }
      }, KEEP_ALIVE_MS);
      setTimeout(speakNext, CANCEL_TO_SPEAK_GAP_MS);
    } catch (e) {
      clearKeepAlive();
      clearStartTimeout();
      setIsSpeaking(false);
      setVoiceError('Voice playback failed. Tap Replay to hear the answer.');
      if (onDone) onDone();
    }
  }, []);

  const replay = useCallback(() => {
    if (lastReplyRef.current) speak(lastReplyRef.current);
  }, [speak]);

  return {
    speak,
    stop,
    replay,
    prime,
    isSpeaking,
    voiceError,
    engineUnavailable,
    hasReply: () => Boolean(lastReplyRef.current),
  };
}
