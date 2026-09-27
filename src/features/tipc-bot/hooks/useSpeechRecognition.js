import { useCallback, useEffect, useRef, useState } from 'react';

// Wraps the Web Speech API's SpeechRecognition. Non-continuous with interim
// results: the browser's own silence-detection ends each utterance and fires
// a final result automatically, which is what makes hands-free turn-taking
// possible without a separate voice-activity-detection implementation.
export function useSpeechRecognition({ onInterim, onFinal } = {}) {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);
  const onInterimRef = useRef(onInterim);
  const onFinalRef = useRef(onFinal);
  onInterimRef.current = onInterim;
  onFinalRef.current = onFinal;

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
      if (result.isFinal) {
        if (onFinalRef.current) onFinalRef.current(transcript);
      } else if (onInterimRef.current) {
        onInterimRef.current(transcript);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
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

  const start = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      setIsListening(true);
      recognitionRef.current.start();
    } catch (e) {
      setIsListening(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setIsListening(false);
  }, []);

  return { start, stop, isListening, supported };
}
