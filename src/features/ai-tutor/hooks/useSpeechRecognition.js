import { useCallback, useEffect, useRef, useState } from 'react';

// Wraps the Web Speech API's SpeechRecognition. Non-continuous with interim
// results: the browser's own silence-detection ends each utterance and fires
// a final result automatically, which is what makes hands-free turn-taking
// possible without a separate voice-activity-detection implementation.
export function useSpeechRecognition({ onInterim, onFinal, onEnd, onError } = {}) {
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);
  const lastErrorRef = useRef('');
  const onInterimRef = useRef(onInterim);
  const onFinalRef = useRef(onFinal);
  const onEndRef = useRef(onEnd);
  const onErrorRef = useRef(onError);
  onInterimRef.current = onInterim;
  onFinalRef.current = onFinal;
  onEndRef.current = onEnd;
  onErrorRef.current = onError;

  useEffect(() => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setSupported(false);
      return;
    }
    const recognition = new Recognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      lastErrorRef.current = '';
      if (result.isFinal) {
        if (onFinalRef.current) onFinalRef.current(transcript);
      } else if (onInterimRef.current) {
        onInterimRef.current(transcript);
      }
    };

    recognition.onerror = (event) => {
      lastErrorRef.current = event.error;
      if (onErrorRef.current) onErrorRef.current(event.error);
    };

    recognition.onend = () => {
      const retryable = !lastErrorRef.current || lastErrorRef.current === 'no-speech' || lastErrorRef.current === 'aborted';
      if (retryable && onEndRef.current) onEndRef.current();
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.abort();
      } catch (e) {
        // ignore
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      lastErrorRef.current = '';
      recognitionRef.current.start();
    } catch (e) {
      // start() throws when a recognition cycle is already active
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
  }, []);

  return { startListening, stopListening, supported };
}
