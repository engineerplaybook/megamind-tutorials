'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Volume2, Bot, Sparkles, Copy, Mic, MicOff, Settings, ChevronDown, AlertTriangle, Info, BookOpen, Key } from 'lucide-react';
import { useMultimodalStream, useLocalTTS } from '../hooks/useMultimodalStream';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { createHighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import themeGitHubDark from 'shiki/themes/github-dark.mjs';
import themeGitHubLight from 'shiki/themes/github-light.mjs';
import langTypeScript from 'shiki/langs/typescript.mjs';
import langJavaScript from 'shiki/langs/javascript.mjs';
import langPython from 'shiki/langs/python.mjs';
import langRust from 'shiki/langs/rust.mjs';
import langGo from 'shiki/langs/go.mjs';
import langJson from 'shiki/langs/json.mjs';
import langHtml from 'shiki/langs/html.mjs';
import langCss from 'shiki/langs/css.mjs';
import langBash from 'shiki/langs/bash.mjs';
import langYaml from 'shiki/langs/yaml.mjs';
import langMarkdown from 'shiki/langs/markdown.mjs';
import langDockerfile from 'shiki/langs/dockerfile.mjs';

interface ChatTurn {
  role: string;
  content: string;
}

interface MultimodalChatViewProps {
  username: string;
  systemPrompt: string;
  history: ChatTurn[];
  onHistoryUpdate: (history: ChatTurn[], provider: string) => void;
  onSwitchToText: () => void;
}

export function MultimodalChatView({ 
  username, 
  systemPrompt, 
  history, 
  onHistoryUpdate,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for interface compatibility
  onSwitchToText
}: MultimodalChatViewProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [voiceProvider, setVoiceProvider] = useState('elevenlabs');
  const [showRawTranscript, setShowRawTranscript] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [useLocalTTSMode, setUseLocalTTSMode] = useState(false);
  const [ttsFallback, setTtsFallback] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const writerContentRef = useRef('');

const { 
    streamMultimodal, 
    stop, 
    isStreaming, 
    isPlayingAudio, 
    audioQueueLength,
  } = useMultimodalStream();
   
  const localTTS = useLocalTTS();
  const { 
    isSpeaking: localTTSSpeaking,
    error: localTTSError 
  } = localTTS;

  const { transcript, isListening, startListening, stopListening } = useSpeechRecognition();

  // Ref to hold the latest handleSend for recursive calls
  const handleSendRef = useRef<((text: string) => Promise<void>) | null>(null);

  // Sync history from parent
  useEffect(() => {
    const syncedMessages = history.map((m, i) => ({
      id: i,
      role: m.role as 'user' | 'assistant',
      rawContent: m.content,
      curatedContent: m.role === 'assistant' ? m.content : undefined,
      isCurated: m.role === 'assistant',
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing prop-derived state
    setMessages(syncedMessages);
  }, [history]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  
  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming) return;
    const userMsg = text.trim();
    setInput('');
    stopListening();

    // Add user message immediately
    const tempId = Date.now();
    setMessages(prev => [...prev, { 
      id: tempId, 
      role: 'user', 
      rawContent: userMsg, 
      curatedContent: userMsg 
    }]);

    // Assistant placeholder
    const asstId = Date.now() + 1;
    setMessages(prev => [...prev, { 
      id: asstId, 
      role: 'assistant', 
      rawContent: '', 
      curatedContent: '',
      isStreaming: true 
    }]);

    let fullRaw = '';
    let fullCurated = '';

    // "Local" now maps to server-side Piper (queued)
    // Client WASM is used only as fallback when server queue is full
    const provider = useLocalTTSMode ? 'piper' : voiceProvider;

    await streamMultimodal(
      { username, message: userMsg, systemPrompt, voiceProvider: provider },
      {
        onLLMDelta: (delta) => {
          fullRaw += delta;
          setMessages(prev => prev.map(m => 
            m.id === asstId ? { ...m, rawContent: fullRaw } : m
          ));
        },
        onWriterDelta: (delta, curatedSoFar) => {
          fullCurated = curatedSoFar;
          writerContentRef.current = curatedSoFar;
          setMessages(prev => prev.map(m => 
            m.id === asstId ? { ...m, curatedContent: fullCurated } : m
          ));
        },
        onAudioChunk: () => {
          // Audio plays automatically via hook
        },
        onDone: (finalCurated) => {
          // Persist to server history (store raw LLM response)
          onHistoryUpdate(
            [...history, { role: 'user', content: userMsg }, { role: 'assistant', content: fullRaw }],
            'multimodal'
          );
          setMessages(prev => prev.map(m => 
            m.id === asstId ? { ...m, isStreaming: false, curatedContent: finalCurated || fullCurated } : m
          ));
        },
        onError: (err) => {
          console.error('Stream error:', err);
          // Check for server queue full/timeout - fallback to client WASM
          if ((err.includes('TTS_QUEUE_FULL') || err.includes('TTS_TIMEOUT')) && !ttsFallback) {
            console.log('[TTS] Server queue full/timed out, falling back to client Piper WASM');
            setTtsFallback(true);
            setUseLocalTTSMode(true);
            // Re-trigger with local mode (client WASM)
            setTimeout(() => handleSendRef.current?.(userMsg), 100);
            return;
          }
          setMessages(prev => prev.map(m => 
            m.id === asstId ? { ...m, isStreaming: false, error: err } : m
          ));
        }
      }
    );
  }, [isStreaming, username, systemPrompt, voiceProvider, useLocalTTSMode, history, onHistoryUpdate, streamMultimodal, stopListening, ttsFallback]);

  // Update ref after handleSend is defined
  useEffect(() => {
    handleSendRef.current = handleSend;
  }, [handleSend]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  }, [input, handleSend]);

  const handleVoiceInput = useCallback(() => {
    if (isListening) {
      stopListening();
      const text = transcript;
      if (text?.trim()) handleSend(text);
    } else {
      startListening();
    }
  }, [isListening, transcript, startListening, stopListening, handleSend]);

  const copyCurated = useCallback((content: string) => {
    navigator.clipboard.writeText(content);
  }, []);

  const getDisplayContent = useCallback((msg: ChatMessage) => {
    if (msg.role === 'user') return msg.rawContent;
    return showRawTranscript ? msg.rawContent : (msg.curatedContent || msg.rawContent);
  }, [showRawTranscript]);

  return (
    <div className="flex flex-col h-[calc(100vh-400px)] min-h-[400px] max-h-[600px] bg-white rounded-2xl border border-borderColor/60 shadow-premium overflow-hidden">
      {/* Header with Voice Controls */}
      <div className="p-4 border-b border-borderColor/60 bg-bgdefault/30">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <div className="flex items-center gap-2 bg-bgdefault/60 rounded-xl p-1 border border-borderColor/60">
            {['elevenlabs', 'cartesia', 'piper'].map(provider => (
              <button
                key={provider}
                onClick={() => { setVoiceProvider(provider); setUseLocalTTSMode(false); setTtsFallback(false); }}
                disabled={isStreaming}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  voiceProvider === provider && !useLocalTTSMode
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-textColor-secondary hover:text-primary disabled:opacity-50'
                }`}
              >
                {provider.charAt(0).toUpperCase() + provider.slice(1)}
              </button>
            ))}
            <button
              onClick={() => { setUseLocalTTSMode(true); setTtsFallback(false); }}
              disabled={isStreaming}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                useLocalTTSMode
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-textColor-secondary hover:text-primary'
              }`}
              title="Server-side Piper TTS (queued, no API key)"
            >
              <Mic size={10} /> Piper
            </button>
          </div>

          <button
            onClick={() => setShowVoiceSettings(!showVoiceSettings)}
            className="px-3 py-1.5 text-xs font-bold rounded-lg transition-all border text-textColor-secondary border-borderColor/60 hover:bg-primary-light/40"
          >
            <Settings size={12} className="mr-1" />
            Voice Settings
            <ChevronDown size={10} className={showVoiceSettings ? 'rotate-180' : ''} />
          </button>

          <button
            onClick={() => setShowRawTranscript(!showRawTranscript)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border ${
              showRawTranscript
                ? 'bg-primary text-white border-primary'
                : 'text-textColor-secondary border-borderColor/60 hover:bg-primary-light/40'
            }`}
            title="Toggle raw transcript vs curated view"
          >
            {showRawTranscript ? <Bot size={12} /> : <Sparkles size={12} />}
            {showRawTranscript ? ' Raw LLM' : ' Curated'}
          </button>
        </div>

        {/* Voice Settings Panel */}
        {showVoiceSettings && (
          <div className="mt-3 p-3 bg-white rounded-xl border border-borderColor/60 animate-fade-in-down">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <label className="block text-xs font-medium text-textColor-secondary mb-1">Stability</label>
                <input type="range" min="0" max="1" step="0.1" value={0.5} className="w-full" />
              </div>
              <div>
                <label className="block text-xs font-medium text-textColor-secondary mb-1">Similarity</label>
                <input type="range" min="0" max="1" step="0.1" value={0.75} className="w-full" />
              </div>
              <div>
                <label className="block text-xs font-medium text-textColor-secondary mb-1">Speed</label>
                <input type="range" min="0.5" max="1.5" step="0.1" value={1.0} className="w-full" />
              </div>
              <div>
                <label className="block text-xs font-medium text-textColor-secondary mb-1">Format</label>
                <select className="w-full px-2 py-1 bg-bgdefault/60 border border-borderColor/60 rounded text-xs">
                  <option>MP3 44.1kHz</option>
                  <option>MP3 22.05kHz</option>
                  <option>PCM 22.05kHz</option>
                </select>
              </div>
            </div>
            {localTTSError && (
              <div className="mt-2 text-xs text-brand-red bg-brand-red/5 px-2 py-1 rounded">
                Local TTS: {localTTSError}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 pb-6" role="log" aria-live="polite">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            showRaw={showRawTranscript}
            isLast={msg.id === messages[messages.length - 1]?.id}
            onCopy={copyCurated}
            getDisplayContent={getDisplayContent}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Status Bar */}
      {(isStreaming || isPlayingAudio || localTTSSpeaking) && (
        <div className="px-4 py-2 bg-bgdefault/50 border-t border-borderColor/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            {isStreaming && (
              <span className="flex items-center gap-1 text-primary">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Streaming LLM…
              </span>
            )}
            {(isPlayingAudio || localTTSSpeaking) && (
              <span className="flex items-center gap-1 text-brand-green">
                <Volume2 size={10} className={isPlayingAudio || localTTSSpeaking ? 'animate-pulse' : ''} />
                Playing audio ({audioQueueLength} queued)
              </span>
            )}
            {ttsFallback && (
              <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                <AlertTriangle size={10} /> Using client Piper WASM (server queue busy)
              </span>
            )}
          </div>
          <button
            onClick={stop}
            className="px-3 py-1 text-xs font-bold text-brand-red hover:bg-brand-red/10 rounded-lg transition"
          >
            Stop
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-borderColor/60 p-4 bg-bgdefault/30">
        <div className="flex gap-3">
          <button
            onClick={handleVoiceInput}
            disabled={isStreaming}
            className={`p-3 rounded-xl transition-all flex-shrink-0 ${
              isListening
                ? 'bg-brand-red/10 text-brand-red border border-brand-red/30 animate-pulse'
                : 'bg-primary text-white hover:bg-primary-hover border border-primary/20'
            } disabled:opacity-50`}
            aria-label={isListening ? 'Stop listening' : 'Start voice input'}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isStreaming ? 'AI is responding...' : 'Type or tap microphone...'}
            disabled={isStreaming}
            className="flex-1 px-4 py-3 bg-white border border-borderColor/60 rounded-xl text-sm text-textColor-primary placeholder:text-textColor-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition disabled:opacity-50"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isStreaming}
            className="px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-hover transition-all active:scale-[0.98] disabled:opacity-50 flex-shrink-0"
          >
            {isStreaming ? 'Streaming…' : 'Send'}
          </button>
        </div>
        {isListening && transcript && (
          <p className="mt-2 text-xs text-primary-light italic">"{transcript}"</p>
        )}
      </div>
    </div>
  );
}

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  rawContent: string;
  curatedContent?: string;
  isStreaming?: boolean;
  error?: string;
  isCurated?: boolean;
}

function MessageBubble({ 
  message, 
  showRaw, 
  isLast, 
  onCopy, 
  getDisplayContent 
}: {
  message: ChatMessage;
  showRaw: boolean;
  isLast: boolean;
  onCopy: (content: string) => void;
  getDisplayContent: (msg: ChatMessage) => string;
}) {
  const isUser = message.role === 'user';
  const content = getDisplayContent(message);
  
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''} animate-fade-in-up`}>
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
        isUser 
          ? 'bg-primary-light border border-primary/20 text-primary' 
          : 'bg-brand-green/10 border border-brand-green/20 text-brand-green'
      }`}>
        {isUser ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        ) : (
          <Bot size={16} />
        )}
      </div>
      <div className={`flex-1 max-w-[85%] ${isUser ? 'text-right' : ''}`}>
        <div className={`inline-block px-4 py-3 rounded-2xl ${
          isUser 
            ? 'bg-primary text-white rounded-tr-sm' 
            : 'bg-white border border-borderColor/60 rounded-tl-sm shadow-sm'
        }`}>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {content ? (
              <MarkdownRenderer content={content} />
            ) : (
              <div className="flex items-center gap-2 text-textColor-secondary/60">
                <div className="w-4 h-4 rounded-full bg-primary/30 animate-pulse" />
                <div className="w-6 h-4 rounded bg-primary/20 animate-pulse" />
                <div className="w-8 h-4 rounded bg-primary/20 animate-pulse" />
              </div>
            )}
          </div>
          {message.error && (
            <div className="mt-2 text-xs text-brand-red bg-brand-red/5 px-2 py-1 rounded">
              ⚠️ {message.error}
            </div>
          )}
        </div>
        {isLast && message.role === 'assistant' && !showRaw && message.curatedContent && (
          <button 
            onClick={() => onCopy(message.curatedContent!)}
            className="mt-1.5 text-[10px] text-textColor-secondary/60 hover:text-primary flex items-center gap-1"
          >
            <Copy size={10} /> Copy curated
          </button>
        )}
      </div>
    </div>
  );
}

// Proper markdown renderer with GFM, Shiki syntax highlighting, and callouts
function MarkdownRenderer({ content }: { content: string }) {
  const [highlighter, setHighlighter] = useState<Awaited<ReturnType<typeof createHighlighterCore>> | null>(null);
  
  useEffect(() => {
    createHighlighterCore({
      themes: [themeGitHubDark, themeGitHubLight],
      langs: [
        langTypeScript, langJavaScript, langPython, langRust, langGo,
        langJson, langHtml, langCss, langBash, langYaml, langMarkdown,
        langDockerfile,
      ],
      engine: createJavaScriptRegexEngine(),
    }).then(setHighlighter);
  }, []);
  
  const components = useMemo(() => ({
    pre: ({ children, className, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
      const language = className?.replace('language-', '') || 'text';
      const code = typeof children === 'string' ? children : '';
      
      if (!highlighter) {
        return (
          <pre className="bg-slate-900 p-3 rounded-lg overflow-x-auto my-2" {...props}>
            <code className={`language-${language}`}>{code}</code>
          </pre>
        );
      }
      
      const html = highlighter.codeToHtml(code, {
        lang: language,
        themes: { light: 'github-light', dark: 'github-dark' },
      });
      
      return <div dangerouslySetInnerHTML={{ __html: html }} className="my-2" />;
    },
    code: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => {
      if (className?.startsWith('language-')) return <code {...props} className={className}>{children}</code>;
      return <code className="px-1.5 py-0.5 bg-bgdefault/60 rounded text-sm font-mono" {...props}>{children}</code>;
    },
    blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => {
      const content = React.Children.toArray(children);
      const firstChild = content[0];
      const text = typeof firstChild === 'string' ? firstChild : '';
      
      if (text.startsWith('💡') || text.startsWith('**💡') || text.includes('**💡 Note')) {
        return (
          <div className="border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20 p-3 my-3 rounded-r-lg">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="prose prose-sm max-w-none dark:prose-invert text-amber-800 dark:text-amber-200">{children}</div>
            </div>
          </div>
        );
      }
      if (text.startsWith('⚠️') || text.startsWith('**⚠️') || text.includes('**⚠️ Warning')) {
        return (
          <div className="border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20 p-3 my-3 rounded-r-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <div className="prose prose-sm max-w-none dark:prose-invert text-orange-800 dark:text-orange-200">{children}</div>
            </div>
          </div>
        );
      }
      if (text.startsWith('📝') || text.startsWith('**📝') || text.includes('**📝 Example')) {
        return (
          <div className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-3 my-3 rounded-r-lg">
            <div className="flex items-start gap-2">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="prose prose-sm max-w-none dark:prose-invert text-blue-800 dark:text-blue-200">{children}</div>
            </div>
          </div>
        );
      }
      if (text.startsWith('🔑') || text.startsWith('**🔑') || text.includes('**🔑 Key Term')) {
        return (
          <div className="border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20 p-3 my-3 rounded-r-lg">
            <div className="flex items-start gap-2">
              <Key className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <div className="prose prose-sm max-w-none dark:prose-invert text-purple-800 dark:text-purple-200">{children}</div>
            </div>
          </div>
        );
      }
      return <blockquote className="border-l-4 border-borderColor/60 pl-4 italic text-textColor-secondary my-3" {...props}>{children}</blockquote>;
    },
    table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
      <div className="overflow-x-auto my-3">
        <table className="min-w-full divide-y divide-borderColor/60" {...props}>
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
      <th className="px-3 py-2 bg-bgdefault/60 text-left text-xs font-bold text-textColor-secondary uppercase tracking-wider" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
      <td className="px-3 py-2 text-sm border-t border-borderColor/60" {...props}>
        {children}
      </td>
    ),
    h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 className="text-2xl font-bold mt-4 mb-2" {...props}>{children}</h1>
    ),
    h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2 className="text-xl font-bold mt-4 mb-2" {...props}>{children}</h2>
    ),
    h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3 className="text-lg font-bold mt-3 mb-1" {...props}>{children}</h3>
    ),
    ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
      <ul className="list-disc pl-5 space-y-1 my-2" {...props}>{children}</ul>
    ),
    ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
      <ol className="list-decimal pl-5 space-y-1 my-2" {...props}>{children}</ol>
    ),
    li: ({ children, ...props }: React.LiHTMLAttributes<HTMLLIElement>) => (
      <li className="ml-2" {...props}>{children}</li>
    ),
    p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className="my-2" {...props}>{children}</p>
    ),
    a: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    ),
    strong: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <strong className="font-bold" {...props}>{children}</strong>
    ),
    em: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <em className="italic" {...props}>{children}</em>
    ),
  }), [highlighter]);

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
}