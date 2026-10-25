'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Bot,
  Loader2,
  Lock,
  LogOut,
  Mic,
  Phone,
  PhoneOff,
  RefreshCw,
  Send,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useChatStream } from '../hooks/useChatStream';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useStreamingSpeech } from '../hooks/useStreamingSpeech';
import { useTutorAuth } from '../hooks/useTutorAuth';
import { API_BASE } from '../utils/apiBase';
import { authHeaders, getToken } from '../utils/auth';
import { getTutorSessionId } from '../utils/session';
import { MarkdownRenderer } from './MarkdownRenderer';

type Phase = 'idle' | 'listening' | 'thinking' | 'speaking';

interface TutorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface LiveTutorPanelProps {
  courseSlug: string;
  courseTitle: string;
  moduleLabel: string;
  moduleContext: string;
}

const buildSystemPrompt = (courseTitle: string, moduleLabel: string, moduleContext: string) =>
  `You are a friendly, concise live tutor inside the "${courseTitle}" course on Engineer Playbook.
The student is currently on the module "${moduleLabel}".
Module notes: ${moduleContext}

Answer the student's question directly and conversationally. Keep replies under 120 words.
Write for text-to-speech: short sentences, plain language, no code fences, no tables, no emojis.
If code is essential, describe it briefly instead of dumping it. Stay on the course topic; if the
student asks something unrelated, answer in one sentence and steer back.`;

const phaseLabel: Record<Phase, string> = {
  idle: 'Ready',
  listening: 'Listening',
  thinking: 'Thinking',
  speaking: 'Speaking',
};

function LoginForm({
  checking,
  error,
  onSubmit,
}: {
  checking: boolean;
  error: string;
  onSubmit: (email: string, password: string) => Promise<boolean>;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form
      className="mx-4 rounded-xl border border-white/10 bg-white/[0.03] p-3"
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit(email.trim(), password);
      }}
    >
      <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-gray-300">
        <Lock size={12} /> Sign in to talk to the tutor
      </p>
      <input
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email"
        className="mb-2 w-full rounded-lg border border-white/10 bg-slate-900 px-2.5 py-1.5 text-xs text-white placeholder:text-gray-500 focus:border-purple-500/60 focus:outline-none"
      />
      <input
        type="password"
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Password"
        className="mb-2 w-full rounded-lg border border-white/10 bg-slate-900 px-2.5 py-1.5 text-xs text-white placeholder:text-gray-500 focus:border-purple-500/60 focus:outline-none"
      />
      {error && <p className="mb-2 text-[11px] text-rose-400">{error}</p>}
      <button
        type="submit"
        disabled={checking}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-purple-500 disabled:opacity-50"
      >
        {checking ? <Loader2 size={12} className="animate-spin" /> : <Lock size={12} />}
        Sign in
      </button>
    </form>
  );
}

export function LiveTutorPanel({ courseSlug, courseTitle, moduleLabel, moduleContext }: LiveTutorPanelProps) {
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [input, setInput] = useState('');
  const [interim, setInterim] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [callActive, setCallActive] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [micCycles, setMicCycles] = useState(0);
  const [sessionId] = useState(getTutorSessionId);

  const { streamChat } = useChatStream();
  const auth = useTutorAuth();
  const { logout } = auth;
  const {
    append: appendSpeech,
    start: startSpeech,
    finish: finishSpeech,
    cancel: cancelSpeech,
    prime: primeSpeech,
    supported: speechSupported,
  } = useStreamingSpeech();

  const busyRef = useRef(false);
  const callActiveRef = useRef(false);
  const voiceOnRef = useRef(true);
  const skipSpeechRef = useRef(false);
  const sendRef = useRef<(text: string) => void>(() => {});
  const abortRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const endCallRef = useRef<() => void>(() => {});

  const {
    startListening,
    stopListening,
    supported: recognitionSupported,
  } = useSpeechRecognition({
    onInterim: setInterim,
    onFinal: (text: string) => {
      if (text.trim()) sendRef.current(text.trim());
    },
    onEnd: () => setMicCycles((cycles) => cycles + 1),
    onError: (error: string) => {
      if (!error || error === 'no-speech' || error === 'aborted') return;
      setNotice('Microphone could not start. Check browser permissions, or type instead.');
      if (callActiveRef.current) endCallRef.current();
    },
  });

  const username = `course-${courseSlug}-${sessionId}`;

  const finishTurn = useCallback(() => {
    busyRef.current = false;
    setBusy(false);
    setPhase(callActiveRef.current ? 'listening' : 'idle');
  }, []);

  const updateAssistant = useCallback((id: string, content: string) => {
    setMessages((prev) => prev.map((message) => (message.id === id ? { ...message, content } : message)));
  }, []);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || busyRef.current) return;
      if (!getToken()) {
        setError('Sign in to ask the tutor a question.');
        return;
      }

      const assistantId = crypto.randomUUID();
      const willSpeak = voiceOnRef.current && speechSupported;
      skipSpeechRef.current = false;
      busyRef.current = true;
      setBusy(true);
      setPhase('thinking');
      setInput('');
      setInterim('');
      setError('');
      setNotice('');
      stopListening();
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'user', content: text },
        { id: assistantId, role: 'assistant', content: '' },
      ]);

      if (willSpeak) {
        primeSpeech();
        startSpeech();
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        await streamChat(
          {
            username,
            message: text,
            systemPrompt: buildSystemPrompt(courseTitle, moduleLabel, moduleContext),
            signal: controller.signal,
          },
          (_delta: string, full: string) => {
            updateAssistant(assistantId, full);
            if (willSpeak && !skipSpeechRef.current) appendSpeech(full);
          }
        );

        if (willSpeak && !skipSpeechRef.current) {
          setPhase('speaking');
          finishSpeech(finishTurn);
        } else {
          finishTurn();
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        const status = err instanceof Error ? (err as Error & { status?: number }).status : undefined;
        if (status === 401) {
          logout();
          setError('Your tutor session expired. Sign in again.');
        } else {
          setError(err instanceof Error ? err.message : 'The tutor could not answer. Try again.');
        }
        cancelSpeech();
        updateAssistant(assistantId, '_No response._');
        finishTurn();
      }
    },
    [
      appendSpeech,
      cancelSpeech,
      courseTitle,
      finishSpeech,
      finishTurn,
      moduleContext,
      logout,
      moduleLabel,
      primeSpeech,
      speechSupported,
      startSpeech,
      stopListening,
      streamChat,
      updateAssistant,
      username,
    ]
  );

  useEffect(() => {
    sendRef.current = send;
  }, [send]);

  useEffect(() => {
    if (!auth.token) return;
    const controller = new AbortController();
    fetch(`${API_BASE}/api/history/${encodeURIComponent(username)}`, {
      headers: authHeaders(),
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { history?: { role: string; content: string }[] } | null) => {
        if (!data?.history) return;
        const history: TutorMessage[] = data.history
          .filter((message) => message.role === 'user' || message.role === 'assistant')
          .slice(-12)
          .map((message) => ({
            id: crypto.randomUUID(),
            role: message.role as 'user' | 'assistant',
            content: message.content,
          }));
        setMessages((prev) => (prev.length ? prev : history));
      })
      .catch(() => {
        // history is a nicety; a fresh conversation still works
      });
    return () => controller.abort();
  }, [auth.token, username]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  useEffect(() => {
    if (!callActive || !auth.token || phase !== 'listening') return;
    const timer = window.setTimeout(() => startListening(), 300);
    return () => {
      window.clearTimeout(timer);
      stopListening();
    };
  }, [auth.token, callActive, micCycles, phase, startListening, stopListening]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      cancelSpeech();
      stopListening();
    };
  }, [cancelSpeech, stopListening]);

  const startCall = () => {
    if (!auth.token) {
      setError('Sign in to start a call.');
      return;
    }
    if (!recognitionSupported) {
      setNotice('Voice input is not supported in this browser. You can still type.');
      return;
    }
    callActiveRef.current = true;
    setCallActive(true);
    setError('');
    setNotice('');
    setPhase('listening');
    primeSpeech();
  };

  const endCall = useCallback(() => {
    abortRef.current?.abort();
    cancelSpeech();
    stopListening();
    callActiveRef.current = false;
    busyRef.current = false;
    setCallActive(false);
    setBusy(false);
    setPhase('idle');
    setInterim('');
  }, [cancelSpeech, stopListening]);

  useEffect(() => {
    endCallRef.current = endCall;
  }, [endCall]);

  const toggleVoice = () => {
    const next = !voiceOn;
    voiceOnRef.current = next;
    setVoiceOn(next);
    if (!next) {
      skipSpeechRef.current = busyRef.current;
      cancelSpeech();
      if (!busyRef.current) setPhase(callActiveRef.current ? 'listening' : 'idle');
    }
  };

  const resetConversation = async () => {
    if (busyRef.current) return;
    cancelSpeech();
    setMessages([]);
    setError('');
    setInterim('');
    setNotice('New conversation started.');
    if (callActiveRef.current) setPhase('listening');
    try {
      const response = await fetch(`${API_BASE}/api/history/${encodeURIComponent(username)}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (response.status === 401) logout();
    } catch {
      // local reset still succeeded; stale server history will age out
    }
  };

  return (
    <div className="flex h-full flex-col bg-slate-950/95">
      <header className="border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/15 text-purple-300">
              <Bot size={16} />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-950 bg-emerald-400" />
            </span>
            <div>
              <p className="text-sm font-bold text-white">Live Tutor</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-500">{phaseLabel[phase]}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleVoice}
              className="rounded-lg p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
              aria-label={voiceOn ? 'Mute tutor voice' : 'Unmute tutor voice'}
              title={voiceOn ? 'Mute tutor voice' : 'Unmute tutor voice'}
            >
              {voiceOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
            </button>
            <button
              onClick={resetConversation}
              className="rounded-lg p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Start a new conversation"
              title="New conversation"
            >
              <RefreshCw size={14} />
            </button>
            {auth.token && (
              <button
                onClick={() => {
                  endCall();
                  auth.logout();
                }}
                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={callActive ? endCall : startCall}
            disabled={!auth.token || auth.checking}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
              callActive
                ? 'bg-rose-600 text-white hover:bg-rose-500'
                : 'bg-purple-600 text-white hover:bg-purple-500'
            }`}
          >
            {callActive ? <PhoneOff size={14} /> : <Phone size={14} />}
            {callActive ? 'End call' : 'Call tutor'}
          </button>
          <span className="rounded-md border border-white/10 px-2 py-1 text-[10px] text-gray-400" title="Current module">
            {moduleLabel}
          </span>
        </div>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {messages.length === 0 && (
          <div className="mt-6 rounded-xl border border-dashed border-white/10 p-4 text-center">
            <Bot className="mx-auto mb-2 text-purple-400" size={20} />
            <p className="text-xs font-semibold text-gray-300">Ask about this module</p>
            <p className="mt-1 text-[11px] leading-relaxed text-gray-500">
              Type a question, or start a call and speak. The tutor sees the module you are on.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            <div
              className={
                message.role === 'user'
                  ? 'max-w-[85%] rounded-2xl rounded-br-sm bg-purple-600 px-3 py-2 text-xs text-white'
                  : 'max-w-full rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.04] px-3 py-2'
              }
            >
              {message.role === 'assistant' ? (
                message.content ? (
                  <MarkdownRenderer content={message.content} />
                ) : (
                  <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
                    <Loader2 size={11} className="animate-spin" /> Thinking
                  </span>
                )
              ) : (
                message.content
              )}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {(error || notice) && (
        <div className="mx-4 mb-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px]">
          {error ? <span className="text-rose-400">{error}</span> : <span className="text-gray-400">{notice}</span>}
        </div>
      )}

      {auth.needsLogin && (
        <LoginForm checking={auth.checking} error={auth.error} onSubmit={auth.login} />
      )}

      <form
        className="border-t border-white/10 p-3"
        onSubmit={(event) => {
          event.preventDefault();
          send(input);
        }}
      >
        {interim && (
          <p className="mb-1.5 flex items-center gap-1.5 text-[11px] italic text-purple-300">
            <Mic size={11} className="animate-pulse" /> {interim}
          </p>
        )}
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                send(input);
              }
            }}
            rows={1}
            disabled={busy || !auth.token}
            placeholder={auth.token ? 'Ask the tutor anything...' : 'Sign in to chat'}
            className="max-h-28 min-h-[38px] flex-1 resize-none rounded-lg border border-white/10 bg-slate-900 px-2.5 py-2 text-xs text-white placeholder:text-gray-500 focus:border-purple-500/60 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || busy || !auth.token}
            className="mb-0.5 rounded-lg bg-purple-600 p-2 text-white transition hover:bg-purple-500 disabled:opacity-40"
            aria-label="Send message"
          >
            {busy ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          </button>
        </div>
        <p className="mt-1.5 text-[10px] text-gray-600">
          {recognitionSupported ? 'Use Call tutor for hands-free voice.' : 'Voice input needs Chrome, Edge, or Safari.'}
        </p>
      </form>
    </div>
  );
}
