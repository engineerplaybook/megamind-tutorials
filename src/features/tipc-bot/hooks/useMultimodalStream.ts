import { useCallback, useEffect, useRef, useState } from 'react';
import { parseSSEBuffer } from '../utils/sseParser';
import { authHeaders } from '../utils/auth';
import { API_BASE } from '../utils/apiBase';

interface MultimodalCallbacks {
  onLLMDelta?: (delta: string, provider: string) => void;
  onWriterDelta?: (delta: string, fullCurated: string) => void;
  onAudioChunk?: (chunk: string) => void;
  onDone?: (finalCurated: string) => void;
  onError?: (err: string) => void;
}

interface MultimodalParams {
  username: string;
  message: string;
  systemPrompt: string;
  voiceProvider?: string;
}

interface UseMultimodalStreamReturn {
  streamMultimodal: (params: MultimodalParams, callbacks: MultimodalCallbacks) => Promise<void>;
  stop: () => void;
  clearAudioQueue: () => void;
  isStreaming: boolean;
  isPlayingAudio: boolean;
  audioQueueLength: number;
  getWriterContent: () => string;
}

export type { UseMultimodalStreamReturn };

export function useMultimodalStream(): UseMultimodalStreamReturn {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioQueueLength, setAudioQueueLength] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<string[]>([]);
  const isPlayingRef = useRef(false);
  const writerContentRef = useRef('');
  const audioPlayerLoopRef = useRef<() => Promise<void>>(null);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioContextConstructor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContextRef.current = new AudioContextConstructor();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  const playAudioChunk = useCallback(async (base64Audio: string) => {
    const ctx = initAudioContext();
    try {
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const arrayBuffer = bytes.buffer;
      
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.start(0);
      
      return new Promise<void>((resolve) => {
        source.onended = () => resolve();
      });
    } catch (err) {
      console.error('Audio playback error:', err);
      try {
        const binaryString = atob(base64Audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const audioBuffer = ctx.createBuffer(1, bytes.length, 22050);
        const channelData = audioBuffer.getChannelData(0);
        for (let i = 0; i < bytes.length; i++) {
          channelData[i] = (bytes[i] - 128) / 128;
        }
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start(0);
        return new Promise<void>((resolve) => { source.onended = () => resolve(); });
      } catch (e) {
        console.error('Fallback audio playback also failed:', e);
      }
    }
  }, [initAudioContext]);

  const audioPlayerLoop = useCallback(async () => {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      setIsPlayingAudio(false);
      return;
    }
    
    isPlayingRef.current = true;
    setIsPlayingAudio(true);
    
    const chunk = audioQueueRef.current.shift();
    if (chunk) {
      setAudioQueueLength(audioQueueRef.current.length);
      try {
        await playAudioChunk(chunk);
      } catch (err) {
        console.error('Error playing audio chunk:', err);
      }
    }
    
    if (audioQueueRef.current.length > 0) {
      audioPlayerLoopRef.current?.();
    } else {
      isPlayingRef.current = false;
      setIsPlayingAudio(false);
    }
  }, [playAudioChunk]);

  // Update ref after audioPlayerLoop is defined
  useEffect(() => {
    audioPlayerLoopRef.current = audioPlayerLoop;
  }, [audioPlayerLoop]);

  const streamMultimodal = useCallback(async (
    { username, message, systemPrompt, voiceProvider = 'piper' }: MultimodalParams,
    callbacks: MultimodalCallbacks = {}
  ) => {
    const { onLLMDelta, onWriterDelta, onAudioChunk, onDone, onError } = callbacks;
    
    setIsStreaming(true);
    audioQueueRef.current = [];
    setAudioQueueLength(0);
    writerContentRef.current = '';
    isPlayingRef.current = false;

    try {
      const response = await fetch(`${API_BASE}/api/chat/stream-multimodal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ username, message, systemPrompt, voiceProvider }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Stream request failed: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const { events, remainder } = parseSSEBuffer(buffer);
        buffer = remainder;

        for (const raw of events) {
          if (raw === '[DONE]') {
            setIsStreaming(false);
            if (onDone) onDone(writerContentRef.current);
            return;
          }

          let parsed;
          try {
            parsed = JSON.parse(raw);
          } catch {
            continue;
          }

          switch (parsed.type) {
            case 'llm':
              if (onLLMDelta) onLLMDelta(parsed.delta, parsed.provider);
              break;
            case 'writer':
              if (parsed.delta) {
                writerContentRef.current += parsed.delta;
                if (onWriterDelta) onWriterDelta(parsed.delta, writerContentRef.current);
              }
              if (parsed.error && onError) onError(`Writer: ${parsed.error}`);
              break;
            case 'audio':
              if (parsed.chunk) {
                audioQueueRef.current.push(parsed.chunk);
                setAudioQueueLength(audioQueueRef.current.length);
                if (onAudioChunk) onAudioChunk(parsed.chunk);
                if (!isPlayingRef.current) {
                  audioPlayerLoopRef.current?.();
                }
              }
              if (parsed.error && onError) onError(`TTS: ${parsed.error}`);
              break;
          }
        }
      }
    } catch (err) {
      setIsStreaming(false);
      if (onError) onError(err instanceof Error ? err.message : String(err));
    }
  }, [audioPlayerLoop]);

  const stop = useCallback(() => {
    audioQueueRef.current = [];
    setAudioQueueLength(0);
    isPlayingRef.current = false;
    setIsPlayingAudio(false);
    setIsStreaming(false);
    writerContentRef.current = '';
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  }, []);

  const clearAudioQueue = useCallback(() => {
    audioQueueRef.current = [];
    setAudioQueueLength(0);
  }, []);

  return { 
    streamMultimodal, 
    stop, 
    clearAudioQueue,
    isStreaming, 
    isPlayingAudio, 
    audioQueueLength,
    getWriterContent: () => writerContentRef.current,
  };
}

interface UseLocalTTSReturn {
  speak: (text: string, options?: { onDone?: () => void }) => Promise<void>;
  stop: () => void;
  init: () => Promise<void | null>;
  isReady: boolean;
  isSpeaking: boolean;
  error: string | null;
}

export type { UseLocalTTSReturn };

// Local TTS using Piper WASM (runs in browser, no API key needed)
export function useLocalTTS(): UseLocalTTSReturn {
  const [isReady, setIsReady] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const piperRef = useRef<unknown>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const initPromiseRef = useRef<Promise<void> | null>(null);

  const init = useCallback(async () => {
    if (isReady || initPromiseRef.current) return initPromiseRef.current;
    
    initPromiseRef.current = (async () => {
      try {
        setError(null);
        // Dynamic import from CDN - using Function constructor to avoid TS errors
        const loadPiper = new Function(`
          return import('https://cdn.jsdelivr.net/npm/piper-wasm@1.2.0/dist/index.js');
        `);
        const mod = await loadPiper() as { Piper: unknown };
        const { Piper } = mod;
        
        piperRef.current = await (Piper as { create: (options: { model: string; config: string }) => Promise<unknown> }).create({
          model: 'https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx',
          config: 'https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx.json',
        });
        
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        setIsReady(true);
      } catch (err) {
        console.error('Failed to load local TTS:', err);
        setError(err instanceof Error ? err.message : String(err));
        setIsReady(false);
      }
    })();
    
    return initPromiseRef.current;
  }, [isReady]);

  const speak = useCallback(async (text: string, { onDone }: { onDone?: () => void } = {}) => {
    if (!piperRef.current) {
      await init();
    }
    if (!piperRef.current) { 
      onDone?.(); 
      return; 
    }

    setIsSpeaking(true);
    setError(null);
    
    try {
      const audioData = await (piperRef.current as { synthesize: (text: string) => Promise<Float32Array> }).synthesize(text);
      const ctx = audioContextRef.current;
      
      if (!ctx) throw new Error('Audio context not initialized');
      
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      
      const audioBuffer = ctx.createBuffer(1, audioData.length, 22050);
      audioBuffer.getChannelData(0).set(audioData);
      
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.start(0);
      
      source.onended = () => { 
        setIsSpeaking(false); 
        onDone?.(); 
      };
    } catch (err) {
      console.error('Local TTS error:', err);
      setError(err instanceof Error ? err.message : String(err));
      setIsSpeaking(false);
      onDone?.();
    }
  }, [init]);

  const stop = useCallback(() => {
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    setIsSpeaking(false);
  }, []);

  return { speak, stop, init, isReady, isSpeaking, error };
}