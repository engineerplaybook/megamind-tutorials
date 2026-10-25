import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TerminalLine {
  text: string; isCommand?: boolean; isOutput?: boolean; delay?: number;
}

const commands: Record<string, TerminalLine[]> = {
  help: [
    { text: '/help', isCommand: true },
    { text: 'Available commands:', isOutput: true },
    { text: '  /help      Show all available commands', isOutput: true },
    { text: '  /clear     Wipe conversation history', isOutput: true },
    { text: '  /compact   Summarize history to free context', isOutput: true },
    { text: '  /cost      Show token usage and session cost', isOutput: true },
    { text: '  /checkpoint Save current state', isOutput: true },
    { text: '  /commit    AI-assisted git commit', isOutput: true },
    { text: '  /review    Review code or a PR', isOutput: true },
    { text: '  /config    Open interactive settings', isOutput: true },
    { text: '  /agents    Browse and create subagents', isOutput: true },
    { text: '  /fast      Toggle fast response mode', isOutput: true },
  ],
  compact: [
    { text: '/compact', isCommand: true },
    { text: 'Summarizing session history...', isOutput: true },
    { text: '\u2713 Context window freed: 12,847 tokens', isOutput: true },
    { text: '\u2713 Session summary created', isOutput: true },
  ],
  cost: [
    { text: '/cost', isCommand: true },
    { text: 'Session Cost Report:', isOutput: true },
    { text: '  Input tokens:  45,231  ($0.68)', isOutput: true },
    { text: '  Output tokens: 12,847  ($0.51)', isOutput: true },
    { text: '  Total cost:           $1.19', isOutput: true },
  ],
  checkpoint: [
    { text: '/checkpoint', isCommand: true },
    { text: 'Creating checkpoint...', isOutput: true },
    { text: '\u2713 Checkpoint "v3-refactor" saved', isOutput: true },
    { text: '  Use /rewind to restore this state', isOutput: true },
  ],
  commit: [
    { text: '/commit', isCommand: true },
    { text: 'Analyzing git changes...', isOutput: true },
    { text: '  3 files changed, +142/-38', isOutput: true },
    { text: 'Suggested message:', isOutput: true },
    { text: '  feat(auth): add OAuth login flow', isOutput: true },
    { text: 'Accept? (y/n):', isOutput: true },
  ],
};

const suggestions = ['/help', '/compact', '/cost', '/checkpoint', '/commit'];

const TerminalLineComponent = ({ line, index }: { line: TerminalLine; index: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -8 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: (line.delay ?? 0.3) + index * 0.06, duration: 0.15 }}
    className={`font-mono text-xs leading-relaxed ${
      line.isCommand ? 'text-emerald-300' : line.isOutput ? 'text-gray-300' : 'text-gray-500'
    }`}
  >
    {line.isCommand && <span className="text-purple-400 mr-1.5 select-none">$</span>}
    {line.text}
    {line.isCommand && <span className="inline-block w-1.5 h-3.5 bg-emerald-400 ml-0.5 align-middle animate-pulse" />}
  </motion.div>
);

export default function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { text: 'Claude Code Terminal v2.0', isOutput: true },
    { text: 'Type a command or click one below', isOutput: true },
    { text: '', isOutput: true },
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  const [activeSuggestion, setActiveSuggestion] = useState<number>(-1);

  const runCommand = (cmd: string) => {
    const trimmed = cmd.toLowerCase().replace(/^\//, '');
    setLines(prev => [...prev, { text: cmd, isCommand: true }, ...(commands[trimmed]?.slice(1) || [{ text: `Command not found: ${cmd}`, isOutput: true, delay: 0.1 }])]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    runCommand(input.trim());
    setInput('');
  };

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [lines]);

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden shadow-2xl shadow-black/30 bg-gray-950/80 backdrop-blur-sm">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border-b border-white/[0.06]">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        <span className="text-gray-500 text-[10px] ml-2 font-mono tracking-wide">claude-code-terminal</span>
      </div>
      <div className="p-3 h-60 overflow-y-auto space-y-0.5 scrollbar-thin">
        <AnimatePresence>
          {lines.map((line, i) => (
            <TerminalLineComponent key={`${i}-${line.text}`} line={line} index={i} />
          ))}
        </AnimatePresence>
        <div ref={endRef} />
      </div>
      <form onSubmit={handleSubmit} className="border-t border-white/[0.06] p-2.5 flex gap-2">
        <span className="text-purple-400 font-mono text-xs self-center select-none">$</span>
        <input value={input} onChange={e => setInput(e.target.value)}
          className="flex-1 bg-transparent text-gray-200 font-mono text-xs outline-none placeholder-gray-600"
          placeholder="Type /help to start..." />
      </form>
      <div className="flex flex-wrap gap-1 px-2.5 pb-2.5">
        {suggestions.map((s, i) => (
          <button key={s} onClick={() => runCommand(s)}
            onMouseEnter={() => setActiveSuggestion(i)} onMouseLeave={() => setActiveSuggestion(-1)}
            className={`px-2 py-1 text-[10px] font-mono rounded-lg transition-all border ${
              activeSuggestion === i
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-white/[0.04] text-gray-500 border-white/[0.06] hover:bg-white/[0.08] hover:text-gray-300'
            }`}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
