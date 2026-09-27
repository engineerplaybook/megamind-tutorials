import React, { useEffect, useRef } from 'react';

interface ChatTurn {
  role: string;
  content: string;
}

interface TranscriptListProps {
  turns: ChatTurn[];
  liveUser?: string;
  liveAssistant?: string;
}

export default function TranscriptList({ turns, liveUser, liveAssistant }: TranscriptListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [turns, liveUser, liveAssistant]);

  return (
    <div ref={containerRef} className="h-full overflow-y-auto space-y-3">
      {turns.length === 0 && !liveUser && !liveAssistant && (
        <p className="text-sm text-textColor-secondary italic text-center py-4">
          No messages yet. Type below, or start a call and speak.
        </p>
      )}

      {turns.map((msg, i) => (
        <div
          key={i}
          className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-textColor-secondary/60 mb-1 ml-1 mr-1 capitalize">{msg.role}</div>
          <div
            className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm shadow-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-primary text-white rounded-tr-sm'
                : 'bg-white border border-borderColor/60 text-textColor-primary rounded-tl-sm'
            }`}
          >
            {msg.content}
          </div>
        </div>
      ))}

      {liveUser && (
        <div className="flex flex-col items-end opacity-70 transition-opacity">
          <div className="text-[10px] font-bold uppercase tracking-wider text-textColor-secondary/60 mb-1 mr-1">User</div>
          <div className="px-4 py-2 rounded-2xl bg-primary/80 text-white max-w-[85%] text-sm rounded-tr-sm shadow-sm">
            {liveUser}…
          </div>
        </div>
      )}

      {liveAssistant && (
        <div className="flex flex-col items-start opacity-90 transition-opacity">
          <div className="text-[10px] font-bold uppercase tracking-wider text-textColor-secondary/60 mb-1 ml-1">Assistant</div>
          <div className="px-4 py-2 rounded-2xl bg-white border border-primary/30 text-textColor-primary max-w-[85%] text-sm rounded-tl-sm shadow-sm">
            {liveAssistant}
          </div>
        </div>
      )}
    </div>
  );
}
