import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Bot, Phone, Keyboard, ShieldCheck, BookOpen,
  LogOut, UserRound, KeyRound, Sparkles, Cpu, MessageSquarePlus,
} from 'lucide-react';
import CallView from './components/CallView';
import TextChatView from './components/TextChatView';
import { TheoryModal } from '../../components/ui/TheoryModal';
import { setToken, clearToken, authHeaders } from './utils/auth';

const DEFAULT_SYSTEM_PROMPT =
  'You are a friendly TiPC learning assistant. Help the user learn about topics they ask. Keep answers concise, educational, and safe.';

interface ChatTurn {
  role: string;
  content: string;
}

type ChatView = 'call' | 'text';

const guardrailsTheory = (
  <div className="space-y-4">
    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-textColor-secondary">
      <h4 className="text-xs font-bold text-textColor-primary mb-1 uppercase tracking-wider">System Prompt as Guardrail</h4>
      <p>
        Every request is prefixed with a system prompt that steers the model: stay educational,
        stay concise, and refuse disallowed content. Editing it below changes the assistant&apos;s
        behavior for your whole conversation.
      </p>
    </div>
    <div>
      <h5 className="font-bold text-textColor-primary mb-1">Defense in Depth</h5>
      <ul className="list-disc pl-5 space-y-1.5 text-textColor-secondary">
        <li><strong>Input guardrail:</strong> the server screens messages for blocked patterns and length before calling any LLM.</li>
        <li><strong>System prompt:</strong> the model itself is instructed to refuse wrongdoing, self-harm, hate, and sexual content involving minors.</li>
        <li><strong>Offline fallback:</strong> if every provider is unreachable, the server replies with a safe local fallback instead of failing silently.</li>
      </ul>
    </div>
    <div>
      <h5 className="font-bold text-textColor-primary mb-1">Provider Chain</h5>
      <p className="text-[11px] text-textColor-secondary leading-relaxed">
        The server tries OpenAI, then Gemini, then Groq, then authenticated Pollinations, and finally
        the free anonymous Pollinations tier. The active provider is shown as a badge next to the title.
      </p>
    </div>
  </div>
);

export default function TiPCBotDemo() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [history, setHistory] = useState<ChatTurn[]>([]);
  const [provider, setProvider] = useState('');
  const [view, setView] = useState<ChatView>('call');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [guardrailNote, setGuardrailNote] = useState('');
  const [guideOpen, setGuideOpen] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/tutorials/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      setToken(data.token);
      setLogin(true);

      const histRes = await fetch(`/tutorials/api/history/${username}`, { headers: authHeaders() });
      const histData = await histRes.json();
      setHistory(histData.history || []);

      const statusRes = await fetch('/tutorials/api/llm-status');
      const statusData = await statusRes.json();
      setProvider(statusData.provider || '');
    } catch {
      setAuthError('Login failed — check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearToken();
    setLogin(false);
    setPassword('');
    setHistory([]);
    setProvider('');
    setAuthError('');
    setGuardrailNote('');
    setView('call');
  };

  const updateSystemPrompt = async () => {
    try {
      await fetch('/tutorials/api/system-prompt', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ username, systemPrompt }),
      });
      setGuardrailNote('Guardrails updated for this conversation.');
    } catch {
      setGuardrailNote('Failed to update guardrails. Please try again.');
    }
  };

  const loadSystemPrompt = async () => {
    try {
      const res = await fetch(`/tutorials/api/system-prompt/${username}`, { headers: authHeaders() });
      const data = await res.json();
      if (data.systemPrompt) setSystemPrompt(data.systemPrompt);
    } catch {
      // ignore — default prompt stays in place
    }
  };

  useEffect(() => {
    if (username && login) {
      loadSystemPrompt();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, login]);

  const handleHistoryUpdate = (nextHistory: ChatTurn[], usedProvider: string) => {
    setHistory(nextHistory);
    if (usedProvider) setProvider(`server:${usedProvider}`);
  };

  const handleNewChat = async () => {
    try {
      await fetch(`/tutorials/api/history/${username}`, { method: 'DELETE', headers: authHeaders() });
    } catch {
      // server wipe is best-effort; local state still resets below
    }
    setHistory([]);
    setGuardrailNote('Started a fresh conversation — history cleared.');
  };

  return (
    <div className="min-h-screen bg-bgdefault py-12 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Back Link */}
        <Link
          href="/tutorials/"
          className="inline-flex items-center gap-2 text-sm text-textColor-secondary hover:text-primary transition-colors duration-200 mb-6 group"
        >
          <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
          Back to Catalog
        </Link>

        {/* Hero Banner */}
        <div className="relative rounded-3xl bg-slate-950 text-white overflow-hidden p-8 md:p-12 mb-10 border border-white/[0.08] shadow-2xl">
          <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-20 left-1/3 w-[300px] h-[300px] bg-brand-green/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-primary-light text-xs font-semibold tracking-wide uppercase mb-5 shadow-sm">
              <Sparkles size={12} className="text-brand-gold" />
              <span>Interactive Tutorial · Full-Stack AI</span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <span className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl">
                <Bot size={22} className="text-white" />
              </span>
              <h1 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight leading-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                TiPC Voice &amp; Chat Bot
              </h1>
            </div>

            <p className="text-slate-400 text-base md:text-lg leading-relaxed mb-0">
              A full-stack Next.js app with streaming AI chat, hands-free voice calls, and
              server-side guardrails. Sign in below, then talk or type.
            </p>
          </div>
        </div>

        {!login ? (
          /* Auth Card */
          <div className="bg-white rounded-2xl border border-borderColor/60 shadow-premium overflow-hidden border-t-4 border-t-primary animate-fade-in-up">
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary-light border border-primary/20 flex items-center justify-center text-primary">
                  <UserRound size={18} />
                </div>
                <div>
                  <h2 className="text-base font-heading font-extrabold text-textColor-primary">Sign in to start learning</h2>
                  <p className="text-[11px] text-textColor-secondary">Conversations are scoped to the name you choose below.</p>
                </div>
              </div>

              {authError && (
                <div className="mt-4 bg-red-50 border border-red-200/60 text-red-700 px-4 py-2.5 rounded-xl text-xs font-medium">
                  {authError}
                </div>
              )}

              <div className="mt-6 max-w-md mx-auto">
                <form onSubmit={handleLogin} className="rounded-xl border border-primary/25 bg-primary-light/30 p-5">
                  <h3 className="text-sm font-heading font-bold text-textColor-primary mb-1 flex items-center gap-2">
                    <KeyRound size={14} className="text-primary" /> Log in
                  </h3>
                  <p className="text-[11px] text-textColor-secondary mb-4">Pick up right where your history left off.</p>
                  <div className="space-y-3">
                    <input
                      className="w-full px-4 py-2.5 bg-white border border-borderColor/60 rounded-xl text-sm text-textColor-primary placeholder:text-textColor-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
                      placeholder="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <div className="relative">
                      <KeyRound size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textColor-secondary/50" />
                      <input
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-borderColor/60 rounded-xl text-sm text-textColor-primary placeholder:text-textColor-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <input
                      className="w-full px-4 py-2.5 bg-white border border-borderColor/60 rounded-xl text-sm text-textColor-primary placeholder:text-textColor-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
                      placeholder="Conversation name (e.g. your name)"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-hover transition-all active:scale-[0.98] disabled:opacity-50 shadow-md"
                    >
                      {loading ? 'Signing in…' : 'Log in & start chatting'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in-up">
            {/* Session Header */}
            <div className="bg-white rounded-2xl border border-borderColor/60 shadow-premium p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center gap-3 flex-grow">
                <div className="w-10 h-10 rounded-xl bg-brand-green/10 border border-brand-green/20 flex items-center justify-center text-brand-green shrink-0">
                  <UserRound size={18} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-heading font-extrabold text-textColor-primary truncate">
                    Chatting as <span className="text-primary">{username}</span>
                  </h2>
                  {provider && (
                    <p className="text-[11px] text-textColor-secondary font-mono mt-0.5 truncate">
                      <Cpu size={11} className="inline mr-1 -mt-0.5" />
                      {provider}
                    </p>
                  )}
                </div>
              </div>

              {/* View Tabs */}
              <div className="flex items-center gap-2">
                <div className="flex p-1 rounded-xl bg-bgdefault border border-borderColor/60">
                  <button
                    onClick={() => setView('call')}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      view === 'call'
                        ? 'bg-white text-primary shadow-sm border border-borderColor/60'
                        : 'text-textColor-secondary hover:text-primary'
                    }`}
                  >
                    <Phone size={13} /> Call
                  </button>
                  <button
                    onClick={() => setView('text')}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      view === 'text'
                        ? 'bg-white text-primary shadow-sm border border-borderColor/60'
                        : 'text-textColor-secondary hover:text-primary'
                    }`}
                  >
                    <Keyboard size={13} /> Text
                  </button>
                </div>
                <button
                  onClick={handleNewChat}
                  title="Clear history and start a fresh conversation"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-textColor-secondary hover:text-primary border border-transparent hover:border-primary/30 hover:bg-primary-light/40 transition-all active:scale-95"
                >
                  <MessageSquarePlus size={13} /> New chat
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-textColor-secondary hover:text-brand-red border border-transparent hover:border-brand-red/30 hover:bg-brand-red/5 transition-all"
                >
                  <LogOut size={13} /> Log out
                </button>
              </div>
            </div>

            {/* Guardrails Card */}
            <div className="bg-white rounded-2xl border border-borderColor/60 shadow-premium overflow-hidden border-l-4 border-l-brand-green">
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-green/10 border border-brand-green/20 flex items-center justify-center text-brand-green shrink-0">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <h3 className="text-base font-heading font-extrabold text-textColor-primary">Guardrails / System Prompt</h3>
                      <p className="text-[11px] text-textColor-secondary">Steer the assistant — updates apply to this conversation.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setGuideOpen(true)}
                    className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 rounded px-2 py-1 text-brand-green font-bold uppercase cursor-pointer transition-colors shrink-0"
                  >
                    <BookOpen size={10} /> Guide
                  </button>
                </div>
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  rows={3}
                  placeholder="Enter system prompt (guardrails)"
                  className="w-full p-3 bg-bgdefault/60 border border-borderColor/60 rounded-xl text-sm text-textColor-primary placeholder:text-textColor-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
                />
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={updateSystemPrompt}
                    className="px-5 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover transition-all active:scale-[0.98] shadow-md"
                  >
                    Update Guardrails
                  </button>
                  {guardrailNote && (
                    <span className="text-[11px] text-textColor-secondary italic">{guardrailNote}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Chat Card */}
            <div className="bg-white rounded-2xl border border-borderColor/60 shadow-premium overflow-hidden border-t-4 border-t-brand-blue">
              <div className="p-6 md:p-8">
                {view === 'call' ? (
                  <CallView
                    username={username}
                    systemPrompt={systemPrompt}
                    history={history}
                    onHistoryUpdate={handleHistoryUpdate}
                    onSwitchToText={() => setView('text')}
                  />
                ) : (
                  <TextChatView
                    username={username}
                    systemPrompt={systemPrompt}
                    history={history}
                    onHistoryUpdate={handleHistoryUpdate}
                    onSwitchToCall={() => setView('call')}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <TheoryModal
        isOpen={guideOpen}
        onClose={() => setGuideOpen(false)}
        title="Guardrails & Provider Chain"
        subtitle="How the server keeps the assistant safe and online."
        badge="AI Safety"
        badgeColor="bg-emerald-100 text-emerald-700"
        content={guardrailsTheory}
      />
    </div>
  );
}
