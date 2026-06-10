import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  Terminal, Slash, FolderTree, FileText, Users2, Settings,
  ChevronLeft, ChevronRight, Sparkles, Code2, Cpu, Library, Bot,
  Lightbulb, Star, Zap, GraduationCap, CheckCircle2, ArrowRight,
  Quote, X, Menu, BookOpen, Globe, Briefcase
} from 'lucide-react';
import { useParticleNetwork } from './hooks/useParticleNetwork';
import TerminalComponent from './components/Terminal';
import CommandExplorer from './components/CommandExplorer';
import TreeExplorer from './components/TreeExplorer';
import MemoryEditor from './components/MemoryEditor';
import SettingsBuilder from './components/SettingsBuilder';

const ease = [0.16, 1, 0.3, 1] as const;
const spring = { type: 'spring' as const, stiffness: 300, damping: 30 };

const slideVariants = {
  enter: (d: number) => ({ x: d > 0 ? 400 : -400, opacity: 0, rotateY: d > 0 ? 8 : -8 }),
  center: { x: 0, opacity: 1, rotateY: 0 },
  exit: (d: number) => ({ x: d < 0 ? 400 : -400, opacity: 0, rotateY: d < 0 ? 8 : -8 }),
};

interface Slide { id: string; label: string; icon: LucideIcon; accent: string; content: React.ReactNode }

const slideIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease } };

const slideAccents: Record<string, { from: string; to: string; badge: string }> = {
  intro: { from: 'from-purple-900/30', to: 'to-blue-900/20', badge: 'from-purple-500 to-blue-500' },
  terminal: { from: 'from-emerald-900/25', to: 'to-teal-900/15', badge: 'from-emerald-500 to-teal-500' },
  commands: { from: 'from-violet-900/30', to: 'to-purple-900/20', badge: 'from-violet-500 to-purple-500' },
  structure: { from: 'from-blue-900/25', to: 'to-indigo-900/15', badge: 'from-blue-500 to-indigo-500' },
  memory: { from: 'from-amber-900/20', to: 'to-orange-900/10', badge: 'from-amber-500 to-orange-500' },
  agents: { from: 'from-pink-900/25', to: 'to-rose-900/15', badge: 'from-pink-500 to-rose-500' },
  settings: { from: 'from-cyan-900/25', to: 'to-sky-900/15', badge: 'from-cyan-500 to-sky-500' },
  'pro-tips': { from: 'from-purple-900/30', to: 'to-fuchsia-900/20', badge: 'from-purple-500 to-fuchsia-500' },
  summary: { from: 'from-emerald-900/25', to: 'to-green-900/15', badge: 'from-emerald-500 to-green-500' },
};

function SlideHeader({ icon: Icon, title, subtitle, slide, total, accent, onReadHandbook }: {
  icon: LucideIcon; title: string; subtitle?: string; slide: number; total: number; accent: string;
  onReadHandbook?: () => void;
}) {
  return (
    <motion.div className="text-center mb-5" {...slideIn}>
      <div className="flex items-center justify-center gap-2 mb-3">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${accent} text-white text-[11px] font-semibold tracking-wide uppercase shadow-lg`}>
          <GraduationCap size={12} />
          <span>{slide} / {total}</span>
        </div>
        {onReadHandbook && (
          <button
            onClick={onReadHandbook}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold tracking-wide transition-all border border-white/10 hover:border-white/25 active:scale-95 cursor-pointer shadow-md"
          >
            <BookOpen size={11} className="text-purple-300 animate-pulse" />
            <span>Read Handbook</span>
          </button>
        )}
      </div>
      <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto mb-3 shadow-xl">
        <Icon size={22} className="text-white" />
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-1 tracking-tight">{title}</h2>
      {subtitle && <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">{subtitle}</p>}
      <div className="flex justify-center mt-3">
        <div className={`h-0.5 w-16 rounded-full bg-gradient-to-r ${accent} opacity-60`} />
      </div>
    </motion.div>
  );
}

function GridOverlay() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
      style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
  );
}

function IntroSlide({ onReadHandbook }: { onReadHandbook?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full px-4 text-center">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-purple-300 text-xs font-medium mb-8 shadow-lg">
          <Bot size={14} />
          Engineer Playbook · Interactive Tutorial
        </div>
        <h1 className="text-4xl md:text-7xl font-extrabold text-white leading-[1.1] mb-5 tracking-tight">
          Introduction to{' '}
          <span className="bg-gradient-to-r from-purple-400 via-violet-300 to-blue-400 bg-clip-text text-transparent">
            Claude Code
          </span>
        </h1>
        <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-6">
          Anthropic&apos;s agentic coding tool lives in your terminal, reads your files,
          runs commands, and understands your entire codebase.
        </p>
        {onReadHandbook && (
          <div className="mb-8 flex justify-center">
            <button
              onClick={onReadHandbook}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 font-bold text-xs border border-purple-500/20 hover:border-purple-500/35 transition-all shadow-lg shadow-purple-950/20 active:scale-95 cursor-pointer"
            >
              <BookOpen size={14} />
              <span>Read Architecture Handbook</span>
            </button>
          </div>
        )}
        <div className="flex items-center justify-center gap-6 text-xs text-gray-500 mb-10">
          <span className="flex items-center gap-1.5"><Code2 size={14} className="text-purple-400" /> Agentic</span>
          <span className="flex items-center gap-1.5"><Cpu size={14} className="text-blue-400" /> Terminal-native</span>
          <span className="flex items-center gap-1.5"><Library size={14} className="text-violet-400" /> Full context</span>
        </div>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-500 text-xs">
            Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-gray-300 font-mono text-[11px]">&rarr;</kbd> to begin
            <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
              <ArrowRight size={14} className="text-purple-400" />
            </motion.span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function SubAgentBuilder() {
  const [name, setName] = useState('code-reviewer');
  const [description, setDescription] = useState('Expert code reviewer checking security, quality & conventions.');
  const [tools, setTools] = useState(['Read', 'Grep', 'Glob', 'Bash']);
  const [generated, setGenerated] = useState(false);
  const toolOptions = ['Read', 'Write', 'Edit', 'Bash', 'Grep', 'Glob', 'WebFetch', 'WebSearch'];
  const toggleTool = (t: string) => setTools(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-3 bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.06] p-4">
        <div>
          <label className="text-[11px] text-gray-400 tracking-wide uppercase font-semibold block mb-1.5">Agent Name</label>
          <input value={name} onChange={e => setName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-gray-200 outline-none focus:border-purple-500/50 focus:bg-white/[0.06] transition-all" />
        </div>
        <div>
          <label className="text-[11px] text-gray-400 tracking-wide uppercase font-semibold block mb-1.5">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 outline-none focus:border-purple-500/50 focus:bg-white/[0.06] transition-all resize-none" />
        </div>
        <div>
          <label className="text-[11px] text-gray-400 tracking-wide uppercase font-semibold block mb-1.5">Allowed Tools ({tools.length})</label>
          <div className="flex flex-wrap gap-1.5">
            {toolOptions.map(tool => (
              <button key={tool} onClick={() => toggleTool(tool)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all border ${
                  tools.includes(tool)
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm'
                    : 'bg-white/[0.04] text-gray-500 border-white/[0.06] hover:bg-white/[0.08]'
                }`}>{tool}</button>
            ))}
          </div>
        </div>
        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
          onClick={() => setGenerated(true)}
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40 transition-all">
          Generate Agent Config
        </motion.button>
      </div>
      <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.06] p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] text-gray-500 font-mono tracking-wide">agent.yaml</span>
          {generated && <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium"><Star size={10} /> Ready</span>}
        </div>
        <AnimatePresence mode="wait">
          <motion.pre key={generated ? 'active' : 'empty'} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-[11px] font-mono text-gray-300 leading-relaxed overflow-x-auto">
{`---
name: ${name || 'unnamed-agent'}
description: ${description || 'description'}
tools:${tools.length > 0 ? '' : ' []'}
${tools.map(t => `  - ${t}`).join('\n')}
${generated ? `model: sonnet\n---\n\nYou are a senior engineer performing ${name}.\n1. Read relevant files and check conventions.\n2. Output a structured report.` : '\n# Click "Generate Agent Config" to preview'}
`}
          </motion.pre>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ProTipsCards() {
  const tips = [
    { icon: Code2, title: 'Use @filename', desc: 'Reference specific files inline in your prompt for precise context.', color: 'from-purple-600 to-purple-400' },
    { icon: Terminal, title: 'Direct Shell Access', desc: 'Use the ! prefix (e.g. !npm run test) to run terminal commands without conversational processing.', color: 'from-blue-600 to-cyan-400' },
    { icon: Zap, title: '/auto Mode', desc: 'Toggle auto-edit mode to let Claude iterate faster without constant permission prompts.', color: 'from-amber-600 to-orange-400' },
  ];
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {tips.map((tip, i) => (
        <motion.div key={tip.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.12, duration: 0.5 }} whileHover={{ y: -4, scale: 1.01 }}
          className="group relative bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.06] p-5 overflow-hidden cursor-default">
          <div className={`absolute inset-0 bg-gradient-to-br ${tip.color} opacity-0 group-hover:opacity-[0.07] transition-opacity duration-500`} />
          <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full bg-gradient-to-br ${tip.color} opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-500 blur-xl`} />
          <div className="relative z-10">
            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${tip.color} flex items-center justify-center mb-3 shadow-lg`}>
              <tip.icon size={18} className="text-white" />
            </div>
            <h3 className="text-gray-100 font-semibold mb-1 text-sm">{tip.title}</h3>
            <p className="text-gray-400 text-xs leading-relaxed">{tip.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function SummarySlide({ onReadHandbook }: { onReadHandbook?: () => void }) {
  const items = [
    { icon: Slash, text: '11 built-in slash commands', color: 'text-purple-400' },
    { icon: FolderTree, text: 'Global ~/.claude/ & workspace .claude/', color: 'text-blue-400' },
    { icon: FileText, text: 'CLAUDE.md memory files auto-loaded', color: 'text-emerald-400' },
    { icon: Bot, text: 'Custom subagents with defined tools', color: 'text-amber-400' },
    { icon: Settings, text: 'Hooks for lint, format & test automation', color: 'text-pink-400' },
    { icon: Lightbulb, text: '@filename, !shell, /auto mode', color: 'text-cyan-400' },
  ];
  return (
    <div className="flex flex-col items-center justify-center min-h-full px-4 text-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={36} className="text-emerald-400" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">Lesson Complete</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
          Claude Code represents a shift from coding assistants to coding partners.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-lg mx-auto text-left mb-6">
          {items.map((item, i) => (
            <motion.div key={item.text} initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
              className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <item.icon size={14} className={item.color} />
              <span className="text-gray-300 text-xs">{item.text}</span>
            </motion.div>
          ))}
        </div>
        {onReadHandbook && (
          <div className="mb-6 flex justify-center">
            <button
              onClick={onReadHandbook}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 font-bold text-xs border border-emerald-500/20 hover:border-emerald-500/35 transition-all shadow-lg active:scale-95 cursor-pointer"
            >
              <BookOpen size={14} />
              <span>Read Summary Handbook</span>
            </button>
          </div>
        )}
        <div className="text-gray-500 text-xs italic flex items-center justify-center gap-2">
          <Quote size={12} /> From coding assistant to coding partner
        </div>
      </motion.div>
    </div>
  );
}

const handbookContents: Record<string, { title: string; subtitle: string; content: React.ReactNode }> = {
  intro: {
    title: "Claude Code Core Architecture",
    subtitle: "Under the hood of Anthropic's agentic command-line developer.",
    content: (
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
          <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
            <Bot size={16} className="text-purple-400" /> What is Claude Code?
          </h4>
          <p className="text-gray-400">
            Claude Code is Anthropic's agentic developer tool that runs directly inside your terminal environment. It goes beyond autocomplete by thinking in a loop, writing files, executing builds, making git commits, and iterating on codebases autonomously.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-bold text-white mb-2">The Execution Loop</h4>
          <ol className="list-decimal pl-5 space-y-2 text-gray-400">
            <li><strong className="text-gray-200">Receive Goal:</strong> The user gives a natural language task.</li>
            <li><strong className="text-gray-200">Analyze & Plan:</strong> Claude reads relevant directories and files to understand constraints.</li>
            <li><strong className="text-gray-200">Execute Tools:</strong> Claude proposes and runs commands, edits files, and processes outputs.</li>
            <li><strong className="text-gray-200">Self-Correct:</strong> If a build fails or tests break, the agent reviews errors and revises the code in a loop until it compiles.</li>
          </ol>
        </div>
        <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15">
          <span className="text-[10px] font-bold text-purple-400 uppercase block mb-1">Getting Started CLI Command</span>
          <code className="text-xs font-mono text-purple-300">claude</code>
          <p className="text-[11px] text-gray-500 mt-1.5">Starts a persistent interactive shell session inside your workspace directory.</p>
        </div>
      </div>
    )
  },
  terminal: {
    title: "Terminal pseudo-TTY Integration",
    subtitle: "Interactivity, shortcut controls, and direct system calls.",
    content: (
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
          <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
            <Terminal size={16} className="text-emerald-400" /> CLI Keyboard Controls
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-slate-950 p-2.5 rounded-lg border border-white/5">
              <span className="text-emerald-400 block mb-0.5">Ctrl + C</span>
              <span className="text-[10px] text-gray-500">Interrupt execution / stop AI generation</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-white/5">
              <span className="text-emerald-400 block mb-0.5">Tab</span>
              <span className="text-[10px] text-gray-500">Auto-complete files and directories</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-white/5">
              <span className="text-emerald-400 block mb-0.5">Up / Down</span>
              <span className="text-[10px] text-gray-500">Scroll through prompt command history</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-white/5">
              <span className="text-emerald-400 block mb-0.5">Ctrl + L</span>
              <span className="text-[10px] text-gray-500">Clear terminal view output buffer</span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold text-white mb-1 animate-pulse">Direct Host Commands</h4>
          <p className="text-gray-400 mb-2">
            You can bypass conversational processing by prefixing command strings with <code className="text-emerald-400 font-mono">!</code> to run them directly:
          </p>
          <pre className="p-3 bg-slate-950 rounded-xl border border-white/5 text-[11px] font-mono text-emerald-300">
{`$ !git status
$ !npm run build`}
          </pre>
        </div>
        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
          <span className="text-[10px] font-bold text-emerald-400 uppercase block mb-1">Prompt Safety Permissions</span>
          <p className="text-[11px] text-gray-400 leading-normal">
            For critical actions (e.g. running write commands or calling curl), Claude prompts for confirmation. You can whitelist safe prefixes to streamline execution.
          </p>
        </div>
      </div>
    )
  },
  commands: {
    title: "Built-in Slash Commands",
    subtitle: "Direct directives to adjust model parameters and manage memory.",
    content: (
      <div className="space-y-4">
        <div className="overflow-x-auto border border-white/10 rounded-xl bg-white/[0.02]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.04] text-gray-300 font-bold">
                <th className="p-2.5">Command</th>
                <th className="p-2.5">Category</th>
                <th className="p-2.5">Action & Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-400 font-mono text-[11px]">
              <tr>
                <td className="p-2.5 text-white font-bold">/help</td>
                <td className="p-2.5 text-blue-400">Utility</td>
                <td className="p-2.5">Lists all available commands and basic guidelines.</td>
              </tr>
              <tr>
                <td className="p-2.5 text-white font-bold">/clear</td>
                <td className="p-2.5 text-red-400">Memory</td>
                <td className="p-2.5">Clears active session history to start fresh.</td>
              </tr>
              <tr>
                <td className="p-2.5 text-white font-bold">/compact</td>
                <td className="p-2.5 text-emerald-400">Context</td>
                <td className="p-2.5">Summarizes the history to save tokens on long chat logs.</td>
              </tr>
              <tr>
                <td className="p-2.5 text-white font-bold">/cost</td>
                <td className="p-2.5 text-yellow-400">Billing</td>
                <td className="p-2.5">Calculates API token cost metrics and session pricing.</td>
              </tr>
              <tr>
                <td className="p-2.5 text-white font-bold">/checkpoint</td>
                <td className="p-2.5 text-purple-400">VCS</td>
                <td className="p-2.5">Creates a snapshot of the workspace files to restore later.</td>
              </tr>
              <tr>
                <td className="p-2.5 text-white font-bold">/commit</td>
                <td className="p-2.5 text-pink-400">Git</td>
                <td className="p-2.5">Initiates automatic generation of a semantic git commit.</td>
              </tr>
              <tr>
                <td className="p-2.5 text-white font-bold">/config</td>
                <td className="p-2.5 text-indigo-400">Setup</td>
                <td className="p-2.5">Launches interactive settings dashboard.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/15">
          <span className="text-[10px] font-bold text-violet-400 uppercase block mb-1">Optimization tip: /compact</span>
          <p className="text-[11px] text-gray-400 leading-normal">
            If you notice responses slowing down, running <code className="text-violet-300 font-mono">/compact</code> condenses previous chat history into a short summary. This cuts token weight by up to 80% while keeping context.
          </p>
        </div>
      </div>
    )
  },
  structure: {
    title: "Global vs Workspace Config",
    subtitle: "Understanding settings, custom subagents, and guidelines files.",
    content: (
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1">
              <Globe size={14} className="text-purple-400" /> Global Directory (~/.claude/)
            </h4>
            <ul className="space-y-2 text-gray-400 text-[11px]">
              <li><strong className="text-gray-300 font-mono">settings.json:</strong> Global user settings, theme, model preference.</li>
              <li><strong className="text-gray-300 font-mono">agents/:</strong> Globally defined AI personas for any project context.</li>
              <li><strong className="text-gray-300 font-mono">skills/:</strong> Executable custom command scripts.</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1">
              <Briefcase size={14} className="text-blue-400" /> Project Directory (.claude/)
            </h4>
            <ul className="space-y-2 text-gray-400 text-[11px]">
              <li><strong className="text-gray-300 font-mono">settings.json:</strong> Repo-specific settings (overrides global preferences).</li>
              <li><strong className="text-gray-300 font-mono">rules/:</strong> Modular markdown lists of coding style rules.</li>
              <li><strong className="text-gray-300 font-mono">.mcp.json:</strong> Model Context Protocol servers config.</li>
            </ul>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
          <h4 className="text-xs font-bold text-white mb-1">Rules Resolution Flow</h4>
          <p className="text-[11px] text-gray-400 leading-normal">
            When you prompt Claude Code, it automatically searches the current directory and parent directories to find <code className="text-blue-300 font-mono">.claude/rules/</code>. It matches active languages in files you've opened and appends rules to the system context.
          </p>
        </div>
      </div>
    )
  },
  memory: {
    title: "Memory Files: CLAUDE.md",
    subtitle: "Persistent briefing files that Claude reads at the start of every session.",
    content: (
      <div className="space-y-4">
        <p className="text-gray-400">
          A <code className="text-amber-400 font-mono">CLAUDE.md</code> file acts as a localized context injection. Instead of explaining your workspace structure or dev scripts in every prompt, save them in CLAUDE.md.
        </p>
        <div className="p-4 rounded-xl bg-slate-950 border border-white/5 font-mono text-[11px] text-gray-400 space-y-3">
          <div className="text-white border-b border-white/10 pb-1.5 font-bold"># Recommended CLAUDE.md Schema</div>
          <div>
            <span className="text-amber-400 font-bold">## Build & Run Commands</span>
            <p className="text-[10px] text-gray-500 mt-0.5">Commands to run builds, local development servers, and checks:</p>
            <p className="text-[10px] text-gray-300 mt-1">- Build: `npm run build`</p>
            <p className="text-[10px] text-gray-300">- Dev: `npm run dev`</p>
          </div>
          <div>
            <span className="text-amber-400 font-bold">## Code Style Guidelines</span>
            <p className="text-[10px] text-gray-500 mt-0.5">Coding style requirements:</p>
            <p className="text-[10px] text-gray-300 mt-1">- Use TypeScript, functional components, React 19.</p>
            <p className="text-[10px] text-gray-300">- Tailwind CSS utility variables, HSL Tailwind gradients.</p>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
          <span className="text-[10px] font-bold text-amber-400 uppercase block mb-1">CLAUDE.md Pro Tip</span>
          <p className="text-[11px] text-gray-400 leading-normal">
            Update your <code className="text-amber-300 font-mono">CLAUDE.md</code> regularly with completed features or architectural updates. It prevents Claude from attempting to rewrite modules that have already been refactored.
          </p>
        </div>
      </div>
    )
  },
  agents: {
    title: "Custom AI Subagents",
    subtitle: "Creating isolated sub-processes for automated code reviews and diagnostics.",
    content: (
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
          <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
            <Users2 size={16} className="text-pink-400" /> Multi-Agent Orchestration
          </h4>
          <p className="text-gray-400">
            Claude Code can spin up subagents to solve subtasks in parallel. For instance, while Claude is writing a feature, a subagent can be created to review files for security leaks or conventions.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-bold text-white mb-2">YAML Configuration Specification</h4>
          <pre className="p-3 bg-slate-950 rounded-xl border border-white/5 text-[11px] font-mono text-pink-300">
{`# .claude/agents/reviewer.yaml
name: code-reviewer
description: Run PR checks for coding guidelines
tools:
  - Read
  - Grep
  - Glob
systemPrompt: |
  You are an strict code reviewer. Focus on:
  1. Performance bottlenecks.
  2. Memory leaks inside useEffect.
  3. Proper type definitions.`}
          </pre>
        </div>
      </div>
    )
  },
  settings: {
    title: "Settings & Action Hooks",
    subtitle: "Interactive configuration overrides and automated git hooks.",
    content: (
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
          <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
            <Settings size={16} className="text-cyan-400" /> Settings Overrides
          </h4>
          <p className="text-gray-400">
            Control model parameters, token budgets, temperature values, API endpoints, and system behaviors. Overrides are written inside workspace or global settings JSON.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-bold text-white mb-1.5">Automating with Pre-Hooks</h4>
          <p className="text-gray-400 mb-2">
            Automate actions before writing commits or completing code writes. You can hook custom CLI scripts to run validation checks:
          </p>
          <pre className="p-3 bg-slate-950 rounded-xl border border-white/5 text-[11px] font-mono text-cyan-300">
{`// Example settings override for automation hooks
{
  "hooks": {
    "preCommit": "npm run lint",
    "preWrite": "npm run build"
  }
}`}
          </pre>
        </div>
      </div>
    )
  },
  "pro-tips": {
    title: "Power-User Productivity Hacks",
    subtitle: "Advanced prompts, auto mode, context pinning, and safety configs.",
    content: (
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
              <Code2 size={16} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-0.5">Context Pinning with @</h4>
              <p className="text-gray-400 text-[11px]">
                Explicitly attach files or directory schemas to your prompt by typing <code className="text-purple-300 font-mono">@src/pages/Catalog.tsx</code>. This skips tool calls and saves execution time.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
              <Terminal size={16} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-0.5">Shell Bypassing with !</h4>
              <p className="text-gray-400 text-[11px]">
                Execute commands in your local system terminal instantly using the <code className="text-blue-300 font-mono">!</code> prefix (e.g. <code className="text-blue-300 font-mono">!git diff</code>).
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
              <Zap size={16} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-0.5">Autonomous Auto Mode</h4>
              <p className="text-gray-400 text-[11px]">
                Toggle auto-mode on or off. When active, Claude carries out edits, writes, and commands sequentially without waiting for interactive permission prompts.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  summary: {
    title: "Lesson Complete & Key Takeaways",
    subtitle: "Transitioning from simple AI assistance to collaborative engineering.",
    content: (
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
          <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-emerald-400" /> Collaborative Agentic Loop
          </h4>
          <p className="text-gray-400">
            You've completed the playbook introduction to Claude Code! Remember that agentic AI is not just a code generator, but a collaborative shell partner that executes and tests code.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-bold text-white mb-1.5">Action Checklist for New Repos</h4>
          <ul className="list-disc pl-5 space-y-1 text-gray-400 text-[11px]">
            <li>Run <code className="text-emerald-300 font-mono">claude</code> inside the terminal in your repository root folder.</li>
            <li>Create a detailed <code className="text-emerald-300 font-mono">CLAUDE.md</code> defining build, test, dev commands, and styling conventions.</li>
            <li>Define workspace guidelines inside <code className="text-emerald-300 font-mono">.claude/rules/</code> to maintain consistent styling.</li>
            <li>Utilize subagents and hooks to automate quality checks.</li>
          </ul>
        </div>
      </div>
    )
  }
};

function HandbookModal({ topic, isOpen, onClose }: { topic: string | null; isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen || !topic) return null;

  const data = handbookContents[topic];
  if (!data) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl max-h-[85vh] bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10"
        >
          <div className="p-6 border-b border-white/10 flex justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BookOpen size={16} className="text-purple-400" />
                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Playbook Handbook</span>
              </div>
              <h3 className="text-xl font-bold text-white leading-tight">{data.title}</h3>
              <p className="text-xs text-gray-400 mt-1">{data.subtitle}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-gray-400 hover:text-white transition-all active:scale-95 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-grow space-y-5 text-gray-300 text-xs leading-relaxed custom-scrollbar">
            {data.content}
          </div>

          <div className="p-4 bg-slate-950/45 border-t border-white/5 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-semibold text-gray-300 hover:text-white transition-all active:scale-95 cursor-pointer"
            >
              Got it
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default function ClaudeCodeDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [[slide, direction], setSlide] = useState([0, 0]);
  const [activeHandbook, setActiveHandbook] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useParticleNetwork(canvasRef);

  const slides: Slide[] = [
    { id: 'intro', label: 'Overview', icon: Sparkles, accent: 'from-purple-500 to-blue-500', content: <IntroSlide onReadHandbook={() => setActiveHandbook('intro')} /> },
    { id: 'terminal', label: 'Terminal', icon: Terminal, accent: 'from-emerald-500 to-teal-500', content: (
      <div>
        <SlideHeader icon={Terminal} title="Interactive Terminal" subtitle="Type commands and see Claude Code respond in real-time." slide={2} total={9} accent="from-emerald-500 to-teal-500" onReadHandbook={() => setActiveHandbook('terminal')} />
        <motion.div {...slideIn}><TerminalComponent /></motion.div>
      </div>
    )},
    { id: 'commands', label: 'Commands', icon: Slash, accent: 'from-violet-500 to-purple-500', content: (
      <div>
        <SlideHeader icon={Slash} title="Slash Commands" subtitle="Type / to see the full list. Every command is built-in." slide={3} total={9} accent="from-violet-500 to-purple-500" onReadHandbook={() => setActiveHandbook('commands')} />
        <motion.div {...slideIn}><CommandExplorer /></motion.div>
      </div>
    )},
    { id: 'structure', label: 'Structure', icon: FolderTree, accent: 'from-blue-500 to-indigo-500', content: (
      <div>
        <SlideHeader icon={FolderTree} title="Directory Structure" subtitle="Global vs Workspace \u2014 config lives in .claude/" slide={4} total={9} accent="from-blue-500 to-indigo-500" onReadHandbook={() => setActiveHandbook('structure')} />
        <motion.div {...slideIn}><TreeExplorer /></motion.div>
      </div>
    )},
    { id: 'memory', label: 'CLAUDE.md', icon: FileText, accent: 'from-amber-500 to-orange-500', content: (
      <div>
        <SlideHeader icon={FileText} title="CLAUDE.md \u2014 Memory Files" subtitle="Auto-loaded every session. Your briefing documents." slide={5} total={9} accent="from-amber-500 to-orange-500" onReadHandbook={() => setActiveHandbook('memory')} />
        <motion.div {...slideIn}><MemoryEditor /></motion.div>
      </div>
    )},
    { id: 'agents', label: 'Subagents', icon: Users2, accent: 'from-pink-500 to-rose-500', content: (
      <div>
        <SlideHeader icon={Users2} title="Custom Subagents" subtitle="Specialized AI workers for delegated tasks." slide={6} total={9} accent="from-pink-500 to-rose-500" onReadHandbook={() => setActiveHandbook('agents')} />
        <motion.div {...slideIn}><SubAgentBuilder /></motion.div>
      </div>
    )},
    { id: 'settings', label: 'Settings', icon: Settings, accent: 'from-cyan-500 to-sky-500', content: (
      <div>
        <SlideHeader icon={Settings} title="Settings &amp; Hooks" subtitle="Control behavior and automate tasks with hooks." slide={7} total={9} accent="from-cyan-500 to-sky-500" onReadHandbook={() => setActiveHandbook('settings')} />
        <motion.div {...slideIn}><SettingsBuilder /></motion.div>
      </div>
    )},
    { id: 'pro-tips', label: 'Tips', icon: Lightbulb, accent: 'from-purple-500 to-fuchsia-500', content: (
      <div>
        <SlideHeader icon={Lightbulb} title="Pro Tips" subtitle="From coding assistant to coding partner." slide={8} total={9} accent="from-purple-500 to-fuchsia-500" onReadHandbook={() => setActiveHandbook('pro-tips')} />
        <motion.div {...slideIn}><ProTipsCards /></motion.div>
      </div>
    )},
    { id: 'summary', label: 'Summary', icon: CheckCircle2, accent: 'from-emerald-500 to-green-500', content: <SummarySlide onReadHandbook={() => setActiveHandbook('summary')} /> },
  ];

  const totalSlides = slides.length;
  const current = slides[slide];
  const accent = slideAccents[current.id];

  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= totalSlides) return;
    setSlide([index, index > slide ? 1 : -1]);
  }, [slide, totalSlides]);

  const next = useCallback(() => goTo(slide + 1), [goTo, slide]);
  const prev = useCallback(() => goTo(slide - 1), [goTo, slide]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); prev(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden text-gray-100 flex">
      {/* Animated Background Layer */}
      <div className="absolute inset-0 bg-gray-950" />
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-[1]" />

      {/* Slide-specific ambient gradient */}
      <motion.div
        key={current.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`absolute inset-0 z-[1] bg-gradient-to-br ${accent.from} ${accent.to}`}
      />

      <GridOverlay />

      {/* Mobile Sidebar Backdrop overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden fixed inset-0 z-30 bg-slate-950/65 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Mobile Header Toggle */}
      <div className="lg:hidden absolute top-4 left-4 z-30 flex items-center gap-3">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2.5 rounded-xl bg-gray-900/80 backdrop-blur-md border border-white/10 hover:border-white/20 text-gray-300 hover:text-white transition-all active:scale-95 shadow-lg flex items-center justify-center cursor-pointer"
        >
          <Menu size={16} />
        </button>
        <span className="text-xs font-extrabold text-white tracking-widest uppercase bg-slate-950/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl shadow-lg">
          Claude Code
        </span>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed lg:sticky top-0 bottom-0 left-0 z-40 w-72 bg-slate-900/60 backdrop-blur-xl border-r border-white/10 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 h-full ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col flex-grow overflow-y-auto">
          {/* Header */}
          <div className="h-16 border-b border-white/10 px-6 flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              <Bot size={18} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white tracking-wider uppercase">Claude Code</h3>
              <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest mt-0.5">Interactive Lab</p>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden ml-auto p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-gray-400 hover:text-white transition-all active:scale-95 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 flex-grow">
            {slides.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === slide;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    goTo(i);
                    setIsSidebarOpen(false); // Auto close mobile drawer
                  }}
                  className={`w-full relative flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all cursor-pointer ${
                    isActive
                      ? 'text-white font-bold'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-side-nav"
                      className={`absolute inset-0 bg-gradient-to-r ${s.accent} opacity-15 rounded-xl border border-white/10`}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="active-side-bar-indicator"
                      className={`absolute left-0 top-3 bottom-3 w-1 bg-gradient-to-b ${s.accent} rounded-full`}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon size={16} className={`shrink-0 z-10 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  <div className="z-10">
                    <span className="text-xs block">{s.label}</span>
                    <span className="text-[9px] text-gray-500 font-medium block mt-0.5 uppercase tracking-wider">Module 0{i + 1}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info card */}
        <div className="p-4 border-t border-white/10 bg-slate-950/40 shrink-0">
          <div className="flex items-center gap-2 text-gray-500">
            <GraduationCap size={14} className="text-purple-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Megamind Playbooks</span>
          </div>
        </div>
      </aside>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 lg:left-72 right-0 z-30 h-[2px] bg-white/[0.06]">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 via-violet-400 to-blue-500"
          animate={{ width: `${((slide + 1) / totalSlides) * 100}%` }}
          transition={{ duration: 0.5, ease }}
        />
      </div>

      {/* Slide Content Area */}
      <div className="flex-grow flex items-center justify-center pt-16 pb-24 px-4 relative z-10 lg:pl-6 overflow-hidden">
        <div className="w-full max-w-4xl perspective-[1000px] lg:px-4">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={slide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ ...spring, opacity: { duration: 0.3 } }}
              className="w-full"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {current.content}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="absolute bottom-0 left-0 lg:left-72 right-0 z-30 bg-gray-950/80 backdrop-blur-xl border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={prev} disabled={slide === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-20 disabled:cursor-not-allowed enabled:hover:bg-white/5 text-gray-400 hover:text-gray-200 cursor-pointer">
            <ChevronLeft size={14} /> Back
          </button>

          <div className="flex items-center gap-2">
            {slides.map((s, i) => (
              <button key={s.id} onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  i === slide ? 'w-7 h-1.5 bg-gradient-to-r ' + s.accent : 'w-1.5 h-1.5 bg-white/[0.12] hover:bg-white/30'
                }`} />
            ))}
          </div>

          {slide < totalSlides - 1 ? (
            <motion.button onClick={next} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-white shadow-lg bg-gradient-to-r ${accent.badge} hover:shadow-xl transition-all cursor-pointer`}>
              Next <ChevronRight size={14} />
            </motion.button>
          ) : (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              onClick={() => goTo(0)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-white bg-gradient-to-r from-emerald-600 to-green-600 shadow-lg cursor-pointer">
              <CheckCircle2 size={14} /> Restart
            </motion.button>
          )}
        </div>
        <div className="text-center pb-2 text-[10px] text-gray-600 select-none">
          <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 font-mono">&larr;</kbd>
          {' '}<kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 font-mono">&rarr;</kbd>
          {' '}or <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 font-mono">Space</kbd>
        </div>
      </div>

      {/* Detailed Handbook Modal */}
      <HandbookModal
        topic={activeHandbook}
        isOpen={activeHandbook !== null}
        onClose={() => setActiveHandbook(null)}
      />
    </div>
  );
}
