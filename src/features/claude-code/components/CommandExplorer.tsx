import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Terminal, BookOpen, DollarSign, Camera, Undo2, GitCommit, Eye, Settings, Users, Zap, HelpCircle } from 'lucide-react';

interface SlashCommand {
  cmd: string; desc: string; icon: typeof Terminal; color: string;
}

const slashCommands: SlashCommand[] = [
  { cmd: '/help', desc: 'Show all available commands', icon: HelpCircle, color: 'text-blue-400' },
  { cmd: '/clear', desc: 'Wipe conversation history', icon: BookOpen, color: 'text-red-400' },
  { cmd: '/compact', desc: 'Summarize history to free context', icon: Search, color: 'text-emerald-400' },
  { cmd: '/cost', desc: 'Show token usage and session cost', icon: DollarSign, color: 'text-yellow-400' },
  { cmd: '/checkpoint', desc: 'Save current state to rewind to later', icon: Camera, color: 'text-purple-400' },
  { cmd: '/rewind', desc: 'Roll back to a previous checkpoint', icon: Undo2, color: 'text-orange-400' },
  { cmd: '/commit', desc: 'AI-assisted git commit', icon: GitCommit, color: 'text-pink-400' },
  { cmd: '/review', desc: 'Review code or a PR', icon: Eye, color: 'text-cyan-400' },
  { cmd: '/config', desc: 'Open interactive settings', icon: Settings, color: 'text-indigo-400' },
  { cmd: '/agents', desc: 'Browse and create subagents', icon: Users, color: 'text-teal-400' },
  { cmd: '/fast', desc: 'Toggle fast response mode', icon: Zap, color: 'text-amber-400' },
];

export default function CommandExplorer() {
  const [selected, setSelected] = useState<SlashCommand>(slashCommands[0]);
  const [search, setSearch] = useState('');

  const filtered = slashCommands.filter(
    s => s.cmd.includes(search) || s.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.06] p-3">
        <div className="relative mb-3">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search commands..."
            className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-200 text-xs outline-none focus:border-purple-500/50 transition-all placeholder-gray-600" />
        </div>
        <div className="space-y-1 max-h-72 overflow-y-auto pr-0.5">
          {filtered.map((cmd, i) => (
            <motion.button key={cmd.cmd} initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
              onClick={() => setSelected(cmd)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all text-xs ${
                selected.cmd === cmd.cmd
                  ? 'bg-purple-500/15 border border-purple-500/30'
                  : 'bg-transparent border border-transparent hover:bg-white/[0.04]'
              }`}>
              <cmd.icon size={16} className={cmd.color} />
              <div>
                <span className="text-gray-200 font-mono font-medium text-xs">{cmd.cmd}</span>
                <p className="text-gray-500 text-[10px] mt-0.5">{cmd.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
      <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.06] p-5 flex items-center">
        <AnimatePresence mode="wait">
          <motion.div key={selected.cmd} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} className="text-center w-full">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3 shadow-lg">
              <selected.icon size={28} className={selected.color} />
            </div>
            <code className="text-2xl font-mono font-bold text-gray-100">{selected.cmd}</code>
            <p className="text-gray-400 mt-2 text-sm">{selected.desc}</p>
            <div className="mt-4 flex gap-2 justify-center">
              <span className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] text-purple-300 font-mono">
                Slash Command
              </span>
              <span className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] text-blue-300 font-mono">
                Built-in
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
