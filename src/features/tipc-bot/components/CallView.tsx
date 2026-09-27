import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Keyboard, TriangleAlert } from 'lucide-react';
import { CALL_STATES, callReducer, initialCallState } from '../callState';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useChatStream } from '../hooks/useChatStream';
import TranscriptList from './TranscriptList';

const STATE_LABEL = {
  [CALL_STATES.IDLE]: 'Tap Start Call to begin',
  [CALL_STATES.LISTENING]: 'Listening…',
  [CALL_STATES.THINKING]: 'Thinking…',
  [CALL_STATES.SPEAKING]: 'Speaking…',
};

const STATE_COLOR = {
  [CALL_STATES.IDLE]: 'bg-textColor-secondary/60',
  [CALL_STATES.LISTENING]: 'bg-brand-green',
  [CALL_STATES.THINKING]: 'bg-brand-gold',
  [CALL_STATES.SPEAKING]: 'bg-primary',
};

interface ChatTurn {
  role: string;
  content: string;
}

interface CallViewProps {
  username: string;
  systemPrompt: string;
  history: ChatTurn[];
  onHistoryUpdate: (nextHistory: ChatTurn[], usedProvider: string) => void;
  onSwitchToText: () => void;
}

export default function CallView({ username, systemPrompt, history, onHistoryUpdate, onSwitchToText }: CallViewProps) {
  const [state, dispatch] = useReducer(callReducer, initialCallState);
  const [liveUserText, setLiveUserText] = useState('');
  const [liveAssistantText, setLiveAssistantText] = useState('');
  const historyRef = useRef(history);
  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  const tts = useSpeechSynthesis();
  const { streamChat } = useChatStream();

  const handleFinal = useCallback(
    async (transcript: string) => {
      const trimmed = (transcript || '').trim();
      setLiveUserText('');
      if (!trimmed) return;
      dispatch({ type: 'UTTERANCE_FINAL' });
      setLiveAssistantText('');

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
        finalText = partial || 'Sorry, I had trouble reaching the server.';
      }

      setLiveAssistantText('');
      onHistoryUpdate(
        [...historyRef.current, userTurn, { role: 'assistant', content: finalText }],
        usedProvider
      );
      dispatch({ type: 'REPLY_COMPLETE' });
      tts.speak(finalText, {
        onDone: () => dispatch({ type: 'SPEECH_DRAINED' }),
      });
    },
    [username, systemPrompt, streamChat, onHistoryUpdate, tts]
  );

  const recognition = useSpeechRecognition({
    onInterim: setLiveUserText,
    onFinal: handleFinal,
  });

  useEffect(() => {
    if (state.status === CALL_STATES.LISTENING && !state.muted) {
      recognition.start();
    } else {
      recognition.stop();
    }
  }, [state.status, state.muted, recognition]);

  const startCall = () => {
    tts.prime();
    dispatch({ type: 'START_CALL' });
  };

  const hangUp = () => {
    recognition.stop();
    tts.stop();
    setLiveUserText('');
    setLiveAssistantText('');
    dispatch({ type: 'HANG_UP' });
  };

  const toggleMute = () => dispatch({ type: 'TOGGLE_MUTE' });

  const isActive = state.status !== CALL_STATES.IDLE;
  const orbAnimated = state.status === CALL_STATES.LISTENING || state.status === CALL_STATES.SPEAKING;

  if (!recognition.supported) {
    return (
      <div className="text-center p-6 bg-red-50 rounded-xl border border-red-200/60">
        <p className="text-red-700 text-sm mb-4">
          Voice calls need browser speech recognition, which isn&apos;t supported here.
          Use Chrome on desktop, or switch to Text chat below.
        </p>
        <button onClick={onSwitchToText} className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-borderColor/60 rounded-xl text-sm font-bold text-textColor-primary shadow-sm hover:border-primary/40 hover:text-primary transition">
          <Keyboard size={14} /> Switch to Text chat
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center py-6">
        <div className="relative w-24 h-24 mx-auto mb-4">
          {orbAnimated && (
            <div className={`absolute inset-0 rounded-full animate-pulse-glow ${STATE_COLOR[state.status]} opacity-50`} />
          )}
          <div className={`relative w-24 h-24 rounded-full transition-colors duration-300 ${STATE_COLOR[state.status]} shadow-lg`} />
        </div>
        <p className="text-textColor-primary font-heading font-bold mb-4">{STATE_LABEL[state.status]}</p>

        {!isActive && (
          <button
            onClick={startCall}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-green text-white text-sm font-bold rounded-full shadow-md hover:brightness-110 transition transform hover:scale-105 active:scale-95"
          >
            <Phone size={15} /> Start Call
          </button>
        )}

        {isActive && (
          <div className="flex justify-center gap-3 mt-4">
            <button
              onClick={toggleMute}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold transition active:scale-95 ${
                state.muted
                  ? 'bg-bgdefault border-borderColor/60 text-textColor-secondary'
                  : 'bg-white border-borderColor/60 text-textColor-primary shadow-sm hover:border-primary/40 hover:text-primary'
              }`}
            >
              {state.muted ? <MicOff size={14} /> : <Mic size={14} />}
              {state.muted ? 'Muted' : 'Mute'}
            </button>
            <button
              onClick={hangUp}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-red text-white text-xs font-bold rounded-full shadow-md hover:brightness-110 transition active:scale-95"
            >
              <PhoneOff size={14} /> Hang up
            </button>
          </div>
        )}
      </div>

      {tts.voiceError && (
        <div className="bg-red-50 border border-red-200/60 text-red-700 p-3 rounded-xl text-sm">
          {tts.voiceError}
        </div>
      )}
      {tts.engineUnavailable && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200/60 text-amber-800 p-3 rounded-xl text-sm">
          <TriangleAlert size={15} className="shrink-0 mt-0.5" />
          <span>Voice unavailable in this browser — showing text only. Try Safari, or continue by reading the transcript below.</span>
        </div>
      )}

      <div className="bg-bgdefault/60 border border-borderColor/60 rounded-xl p-4 shadow-sm min-h-[200px] max-h-[400px] overflow-y-auto">
        <TranscriptList turns={history} liveUser={liveUserText} liveAssistant={liveAssistantText} />
      </div>

      <div className="text-center mt-2">
        <button onClick={onSwitchToText} className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-textColor-secondary bg-white hover:text-primary hover:border-primary/40 border border-borderColor/60 rounded-xl shadow-sm transition">
          <Keyboard size={13} /> Switch to Text chat
        </button>
      </div>
    </div>
  );
}
