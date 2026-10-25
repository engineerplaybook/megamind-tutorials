import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight, BookOpen, Bot, Briefcase, CheckCircle2, Code2, Cpu, FileText,
  FolderTree, Globe, Library, Lightbulb, Quote, Settings, Slash,
  Sparkles, Star, Terminal, Users2, X, Zap,
} from 'lucide-react';
import { CoursePlayer } from '@/src/components/course/CoursePlayer';
import { SlideHeader, ease, slideIn } from '@/src/components/course/SlideHeader';
import type { Course, CourseModule } from '@/src/courses/types';
import TerminalComponent from './components/Terminal';
import CommandExplorer from './components/CommandExplorer';
import TreeExplorer from './components/TreeExplorer';
import MemoryEditor from './components/MemoryEditor';
import SettingsBuilder from './components/SettingsBuilder';

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
            Claude Code is Anthropic&apos;s agentic developer tool that runs directly inside your terminal environment. It goes beyond autocomplete by thinking in a loop, writing files, executing builds, making git commits, and iterating on codebases autonomously.
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
          <code className="bg-transparent p-0 text-xs font-mono text-purple-300">claude</code>
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
            You can bypass conversational processing by prefixing command strings with <code className="bg-transparent p-0 text-emerald-400 font-mono">!</code> to run them directly:
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
            If you notice responses slowing down, running <code className="bg-transparent p-0 text-violet-300 font-mono">/compact</code> condenses previous chat history into a short summary. This cuts token weight by up to 80% while keeping context.
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
            When you prompt Claude Code, it automatically searches the current directory and parent directories to find <code className="bg-transparent p-0 text-blue-300 font-mono">.claude/rules/</code>. It matches active languages in files you&apos;ve opened and appends rules to the system context.
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
          A <code className="bg-transparent p-0 text-amber-400 font-mono">CLAUDE.md</code> file acts as a localized context injection. Instead of explaining your workspace structure or dev scripts in every prompt, save them in CLAUDE.md.
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
            Update your <code className="bg-transparent p-0 text-amber-300 font-mono">CLAUDE.md</code> regularly with completed features or architectural updates. It prevents Claude from attempting to rewrite modules that have already been refactored.
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
                Explicitly attach files or directory schemas to your prompt by typing <code className="bg-transparent p-0 text-purple-300 font-mono">@src/pages/Catalog.tsx</code>. This skips tool calls and saves execution time.
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
                Execute commands in your local system terminal instantly using the <code className="bg-transparent p-0 text-blue-300 font-mono">!</code> prefix (e.g. <code className="bg-transparent p-0 text-blue-300 font-mono">!git diff</code>).
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
            You&apos;ve completed the playbook introduction to Claude Code! Remember that agentic AI is not just a code generator, but a collaborative shell partner that executes and tests code.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-bold text-white mb-1.5">Action Checklist for New Repos</h4>
          <ul className="list-disc pl-5 space-y-1 text-gray-400 text-[11px]">
            <li>Run <code className="bg-transparent p-0 text-emerald-300 font-mono">claude</code> inside the terminal in your repository root folder.</li>
            <li>Create a detailed <code className="bg-transparent p-0 text-emerald-300 font-mono">CLAUDE.md</code> defining build, test, dev commands, and styling conventions.</li>
            <li>Define workspace guidelines inside <code className="bg-transparent p-0 text-emerald-300 font-mono">.claude/rules/</code> to maintain consistent styling.</li>
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

const slideAccents = {
  intro: { badge: 'from-purple-500 to-indigo-500', from: 'from-purple-950/40', to: 'to-indigo-950/30' },
  terminal: { badge: 'from-emerald-500 to-teal-500', from: 'from-emerald-950/40', to: 'to-teal-950/30' },
  commands: { badge: 'from-violet-500 to-purple-500', from: 'from-violet-950/40', to: 'to-purple-950/30' },
  structure: { badge: 'from-blue-500 to-indigo-500', from: 'from-blue-950/40', to: 'to-indigo-950/30' },
  memory: { badge: 'from-amber-500 to-orange-500', from: 'from-amber-950/40', to: 'to-orange-950/30' },
  agents: { badge: 'from-pink-500 to-rose-500', from: 'from-pink-950/40', to: 'to-rose-950/30' },
  settings: { badge: 'from-cyan-500 to-blue-500', from: 'from-cyan-950/40', to: 'to-blue-950/30' },
  'pro-tips': { badge: 'from-yellow-500 to-amber-500', from: 'from-yellow-950/40', to: 'to-amber-950/30' },
  summary: { badge: 'from-green-500 to-emerald-500', from: 'from-green-950/40', to: 'to-emerald-950/30' },
} as const;

export default function ClaudeCourse() {
  const [activeHandbook, setActiveHandbook] = useState<string | null>(null);
  const openHandbook = (topic: string) => setActiveHandbook(topic);

  const modules: CourseModule[] = [
    {
      id: 'intro',
      label: 'Overview',
      icon: Sparkles,
      accent: slideAccents.intro.badge,
      ambientFrom: slideAccents.intro.from,
      ambientTo: slideAccents.intro.to,
      tutorContext:
        "Claude Code is Anthropic's agentic coding tool that runs in the terminal. It reads files, runs commands, edits code, and iterates until the task compiles. Install it with npm and start it by running 'claude' in a project directory.",
      content: <IntroSlide onReadHandbook={() => openHandbook('intro')} />,
    },
    {
      id: 'terminal',
      label: 'Terminal',
      icon: Terminal,
      accent: slideAccents.terminal.badge,
      ambientFrom: slideAccents.terminal.from,
      ambientTo: slideAccents.terminal.to,
      tutorContext:
        'The interactive terminal supports Ctrl+C to interrupt a response, Tab completion, Up/Down history, and Ctrl+L to clear. Prefix a prompt with ! to run a shell command directly.',
      content: (
        <div>
          <SlideHeader icon={Terminal} title="Interactive Terminal" subtitle="Type commands and see Claude Code respond in real-time." slide={2} total={9} accent="from-emerald-500 to-teal-500" onReadHandbook={() => openHandbook('terminal')} />
          <motion.div {...slideIn}><TerminalComponent /></motion.div>
        </div>
      ),
    },
    {
      id: 'commands',
      label: 'Commands',
      icon: Slash,
      accent: slideAccents.commands.badge,
      ambientFrom: slideAccents.commands.from,
      ambientTo: slideAccents.commands.to,
      tutorContext:
        'Slash commands include /help, /clear, /compact, /cost, /checkpoint, /commit, and /config. /compact summarizes conversation history to save tokens.',
      content: (
        <div>
          <SlideHeader icon={Slash} title="Slash Commands" subtitle="Type / to see the full list. Every command is built-in." slide={3} total={9} accent="from-violet-500 to-purple-500" onReadHandbook={() => openHandbook('commands')} />
          <motion.div {...slideIn}><CommandExplorer /></motion.div>
        </div>
      ),
    },
    {
      id: 'structure',
      label: 'Structure',
      icon: FolderTree,
      accent: slideAccents.structure.badge,
      ambientFrom: slideAccents.structure.from,
      ambientTo: slideAccents.structure.to,
      tutorContext:
        'Global config lives in ~/.claude/ (settings, agents, skills). Project config lives in .claude/ (settings, rules, .mcp.json). Rules are discovered from the current and parent directories.',
      content: (
        <div>
          <SlideHeader icon={FolderTree} title="Directory Structure" subtitle="Global vs Workspace — config lives in .claude/" slide={4} total={9} accent="from-blue-500 to-indigo-500" onReadHandbook={() => openHandbook('structure')} />
          <motion.div {...slideIn}><TreeExplorer /></motion.div>
        </div>
      ),
    },
    {
      id: 'memory',
      label: 'CLAUDE.md',
      icon: FileText,
      accent: slideAccents.memory.badge,
      ambientFrom: slideAccents.memory.from,
      ambientTo: slideAccents.memory.to,
      tutorContext:
        'CLAUDE.md is a persistent memory file auto-loaded each session. Include build and run commands, code style, architecture, and gotchas. It prevents repeated explanations and stale rewrites.',
      content: (
        <div>
          <SlideHeader icon={FileText} title="CLAUDE.md — Memory Files" subtitle="Auto-loaded every session. Your briefing documents." slide={5} total={9} accent="from-amber-500 to-orange-500" onReadHandbook={() => openHandbook('memory')} />
          <motion.div {...slideIn}><MemoryEditor /></motion.div>
        </div>
      ),
    },
    {
      id: 'agents',
      label: 'Subagents',
      icon: Users2,
      accent: slideAccents.agents.badge,
      ambientFrom: slideAccents.agents.from,
      ambientTo: slideAccents.agents.to,
      tutorContext:
        'Subagents are YAML-defined personas in .claude/agents/ with a name, description, allowed tools, and system prompt. They handle delegated tasks such as code review in parallel.',
      content: (
        <div>
          <SlideHeader icon={Users2} title="Custom Subagents" subtitle="Specialized AI workers for delegated tasks." slide={6} total={9} accent="from-pink-500 to-rose-500" onReadHandbook={() => openHandbook('agents')} />
          <motion.div {...slideIn}><SubAgentBuilder /></motion.div>
        </div>
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      accent: slideAccents.settings.badge,
      ambientFrom: slideAccents.settings.from,
      ambientTo: slideAccents.settings.to,
      tutorContext:
        'settings.json can override the model, token budgets, temperature, and hooks. Hooks automate lint, formatting, and tests before commits or file writes.',
      content: (
        <div>
          <SlideHeader icon={Settings} title="Settings & Hooks" subtitle="Control behavior and automate tasks with hooks." slide={7} total={9} accent="from-cyan-500 to-sky-500" onReadHandbook={() => openHandbook('settings')} />
          <motion.div {...slideIn}><SettingsBuilder /></motion.div>
        </div>
      ),
    },
    {
      id: 'pro-tips',
      label: 'Tips',
      icon: Lightbulb,
      accent: slideAccents['pro-tips'].badge,
      ambientFrom: slideAccents['pro-tips'].from,
      ambientTo: slideAccents['pro-tips'].to,
      tutorContext:
        'Use @filename to pin context, !command to run shell commands directly, and auto mode for uninterrupted edits. Whitelist safe commands for a smoother flow.',
      content: (
        <div>
          <SlideHeader icon={Lightbulb} title="Pro Tips" subtitle="From coding assistant to coding partner." slide={8} total={9} accent="from-purple-500 to-fuchsia-500" onReadHandbook={() => openHandbook('pro-tips')} />
          <motion.div {...slideIn}><ProTipsCards /></motion.div>
        </div>
      ),
    },
    {
      id: 'summary',
      label: 'Summary',
      icon: CheckCircle2,
      accent: slideAccents.summary.badge,
      ambientFrom: slideAccents.summary.from,
      ambientTo: slideAccents.summary.to,
      tutorContext:
        'Recap: slash commands, global vs workspace .claude/, CLAUDE.md memory, subagents, hooks, @file, !shell, and auto mode. The agentic loop is plan, act, observe, self-correct.',
      content: <SummarySlide onReadHandbook={() => openHandbook('summary')} />,
    },
  ];

  const course: Course = {
    slug: 'claude-code',
    title: 'Introduction to Claude Code',
    shortTitle: 'Claude Code',
    description:
      "An interactive course on Anthropic's agentic coding tool — slash commands, memory files, subagents, and more.",
    tags: ['Claude Code', 'AI', 'Tooling', 'Terminal'],
    icon: Bot,
    modules,
  };

  return (
    <>
      <CoursePlayer course={course} />
      <HandbookModal
        topic={activeHandbook}
        isOpen={activeHandbook !== null}
        onClose={() => setActiveHandbook(null)}
      />
    </>
  );
}
