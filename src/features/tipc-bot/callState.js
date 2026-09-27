// Hands-free call state machine. The mic is only ever open in LISTENING;
// callers must hard-stop recognition when leaving that state so the app
// never transcribes its own TTS output.
export const CALL_STATES = {
  IDLE: 'idle',
  LISTENING: 'listening',
  THINKING: 'thinking',
  SPEAKING: 'speaking',
};

export const initialCallState = { status: CALL_STATES.IDLE, muted: false };

export function callReducer(state, action) {
  switch (action.type) {
    case 'START_CALL':
      return { ...state, status: CALL_STATES.LISTENING };
    case 'UTTERANCE_FINAL':
      if (state.status !== CALL_STATES.LISTENING) return state;
      return { ...state, status: CALL_STATES.THINKING };
    case 'REPLY_COMPLETE':
      if (state.status !== CALL_STATES.THINKING) return state;
      return { ...state, status: CALL_STATES.SPEAKING };
    case 'SPEECH_DRAINED':
      if (state.status !== CALL_STATES.SPEAKING) return state;
      return { ...state, status: CALL_STATES.LISTENING };
    case 'HANG_UP':
      return { ...state, status: CALL_STATES.IDLE };
    case 'TOGGLE_MUTE':
      return { ...state, muted: !state.muted };
    default:
      return state;
  }
}
