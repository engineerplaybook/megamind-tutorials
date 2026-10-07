import React, { useState } from 'react';
import { Send, Mic, Square, Volume2, VolumeX, RotateCcw, Phone, TriangleAlert } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useChatStream } from '../hooks/useChatStream';
import TranscriptList from './TranscriptList';

interface ChatTurn {
  role: string;
  content: string;
}

interface TextChatViewProps {
  username: string;
  systemPrompt: string;
  history: ChatTurn[];
  onHistoryUpdate: (nextHistory: ChatTurn[], usedProvider: string) => void;
  onSwitchToCall: () => void;
}

export default function TextChatView({ username, systemPrompt, history, onHistoryUpdate, onSwitchToCall }: TextChatViewProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [liveAssistantText, setLiveAssistantText] = useState('');
  const [voiceOn, setVoiceOn] = useState(true);

  const tts = useSpeechSynthesis();
  const { streamChat } = useChatStream();
  const recognition = useSpeechRecognition({
    onFinal: (transcript: string) => {
      setMessage(transcript);
      send(transcript);
    },
  });

  const send = async (text: string) => {
    const trimmed = (text || '').trim();
    if (!username || !trimmed || isLoading) return;
    if (trimmed.length > 2000) {
      setLiveAssistantText('Please keep messages under 2000 characters.');
      return;
    }
    setIsLoading(true);
    setLiveAssistantText('');
    tts.stop();
    tts.prime();

    const userTurn = { role: 'user', content: trimmed };
    let partial = '';
    let finalText = '';
    let usedProvider = '';
    try {
      const result = await streamChat({ username, message: trimmed, systemPrompt }, (delta: string, acc: string) => {
        partial = acc;
        setLiveAssistantText(acc);
      });
      finalText = result.fullText || partial || 'Sorry, I got an empty response.';
      usedProvider = result.provider;
    } catch {
      finalText = 'Error contacting server. Is the backend running?';
    }

    setLiveAssistantText('');
    onHistoryUpdate([...history, userTurn, { role: 'assistant', content: finalText }], usedProvider);
    setMessage('');
    setIsLoading(false);
    if (voiceOn) tts.speak(finalText);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(message);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-bgdefault/60 border border-borderColor/60 rounded-xl p-4 shadow-sm min-h-[300px] max-h-[400px] overflow-y-auto">
        <TranscriptList turns={history} liveAssistant={liveAssistantText} />
        {isLoading && !liveAssistantText && (
          <p className="text-sm text-textColor-secondary italic mt-2 animate-pulse">Bot is thinking…</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a topic to learn, or use the mic…"
          required
          className="flex-1 px-4 py-3 bg-white border border-borderColor/60 rounded-xl text-sm text-textColor-primary placeholder:text-textColor-secondary/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold shadow-sm transition active:scale-[0.98] ${
            isLoading ? 'bg-bgdefault border border-borderColor/60 text-textColor-secondary/60 cursor-not-allowed' : 'bg-primary hover:bg-primary-hover text-white shadow-md'
          }`}
        >
          <Send size={14} />
          {isLoading ? 'Sending…' : 'Send'}
        </button>
      </form>

      <div className="flex flex-wrap gap-2.5 items-center mt-1 p-3 bg-bgdefault/60 rounded-xl border border-borderColor/60">
        {!recognition.supported ? (
          <span className="text-[11px] text-red-700">
            Voice input not supported in this browser. Use Chrome + HTTPS or localhost.
          </span>
) : recognition.isListening ? (
          <button
            onClick={recognition.stopListening}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-red hover:brightness-110 text-white text-xs font-bold rounded-xl shadow-sm transition active:scale-95"
          >
            <Square size={12} fill="currentColor" />
            Stop & Send
          </button>
        ) : (
          <button
            onClick={() => {
              tts.prime();
              recognition.startListening();
            }}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-textColor-primary hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition active:scale-95 disabled:opacity-50"
          >
            <Mic size={13} /> Speak to AI
          </button>
        )}

        {recognition.isListening && <span className="text-[11px] text-brand-red font-bold animate-pulse">Listening… speak now</span>}

        <div className="h-6 w-px bg-borderColor/60 mx-1"></div>

        {tts.isSpeaking && (
          <button onClick={tts.stop} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-borderColor/60 text-textColor-secondary hover:text-brand-red hover:border-brand-red/30 text-xs font-bold rounded-xl transition">
            <VolumeX size={13} /> Stop voice
          </button>
        )}

        <button
          onClick={() => {
            const next = !voiceOn;
            setVoiceOn(next);
            if (!next) tts.stop();
            else tts.replay();
          }}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 border text-xs font-bold rounded-xl transition active:scale-95 ${
            voiceOn ? 'bg-primary-light border-primary/25 text-primary' : 'bg-white border-borderColor/60 text-textColor-secondary hover:text-primary'
          }`}
        >
          {voiceOn ? <Volume2 size={13} /> : <VolumeX size={13} />}
          {voiceOn ? 'Voice on' : 'Voice off'}
        </button>

        {tts.hasReply() && !tts.isSpeaking && (
          <button onClick={tts.replay} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-borderColor/60 text-textColor-secondary hover:text-primary hover:border-primary/40 text-xs font-bold rounded-xl transition">
            <RotateCcw size={13} /> Replay
          </button>
        )}
      </div>

      {tts.voiceError && (
        <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm border border-red-200/60">
          {tts.voiceError}
        </div>
      )}
      {tts.engineUnavailable && (
        <div className="flex items-start gap-2 bg-amber-50 text-amber-800 p-3 rounded-xl text-sm border border-amber-200/60">
          <TriangleAlert size={15} className="shrink-0 mt-0.5" />
          <span>Voice unavailable in this browser — the text reply above is still complete and accurate.</span>
        </div>
      )}
      {tts.isSpeaking && (
        <div className="text-[11px] text-primary italic font-medium">
          Bot is speaking…
        </div>
      )}

      <div className="text-center mt-2">
        <button onClick={onSwitchToCall} className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-textColor-secondary bg-white hover:text-primary hover:border-primary/40 border border-borderColor/60 rounded-xl shadow-sm transition">
          <Phone size={13} /> Switch to Call view
        </button>
      </div>
    </div>
  );
}
