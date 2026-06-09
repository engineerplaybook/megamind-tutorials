import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  Terminal, Slash, FolderTree, FileText, Users2, Settings,
  ChevronLeft, ChevronRight, Sparkles, Code2, Cpu, Library, Bot,
  Lightbulb, Star, Zap, GraduationCap, CheckCircle2, ArrowRight,
  Quote
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

function SlideHeader({ icon: Icon, title, subtitle, slide, total, accent }: {
  icon: LucideIcon; title: string; subtitle?: string; slide: number; total: number; accent: string;
}) {
  return (
    <motion.div className="text-center mb-5" {...slideIn}>
      <div className="flex items-center justify-center gap-2 mb-3">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${accent} text-white text-[11px] font-semibold tracking-wide uppercase shadow-lg`}>
          <GraduationCap size={12} />
          <span>{slide} / {total}</span>
        </div>
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

function IntroSlide() {
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
        <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">
          Anthropic&apos;s agentic coding tool lives in your terminal, reads your files,
          runs commands, and understands your entire codebase.
        </p>
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

function SummarySlide() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-lg mx-auto text-left">
          {items.map((item, i) => (
            <motion.div key={item.text} initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
              className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <item.icon size={14} className={item.color} />
              <span className="text-gray-300 text-xs">{item.text}</span>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 text-gray-500 text-xs italic flex items-center justify-center gap-2">
          <Quote size={12} /> From coding assistant to coding partner
        </div>
      </motion.div>
    </div>
  );
}

export default function ClaudeCodeDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [[slide, direction], setSlide] = useState([0, 0]);
  useParticleNetwork(canvasRef);

  const slides: Slide[] = [
    { id: 'intro', label: 'Overview', icon: Sparkles, accent: 'from-purple-500 to-blue-500', content: <IntroSlide /> },
    { id: 'terminal', label: 'Terminal', icon: Terminal, accent: 'from-emerald-500 to-teal-500', content: (
      <div>
        <SlideHeader icon={Terminal} title="Interactive Terminal" subtitle="Type commands and see Claude Code respond in real-time." slide={2} total={9} accent="from-emerald-500 to-teal-500" />
        <motion.div {...slideIn}><TerminalComponent /></motion.div>
      </div>
    )},
    { id: 'commands', label: 'Commands', icon: Slash, accent: 'from-violet-500 to-purple-500', content: (
      <div>
        <SlideHeader icon={Slash} title="Slash Commands" subtitle="Type / to see the full list. Every command is built-in." slide={3} total={9} accent="from-violet-500 to-purple-500" />
        <motion.div {...slideIn}><CommandExplorer /></motion.div>
      </div>
    )},
    { id: 'structure', label: 'Structure', icon: FolderTree, accent: 'from-blue-500 to-indigo-500', content: (
      <div>
        <SlideHeader icon={FolderTree} title="Directory Structure" subtitle="Global vs Workspace \u2014 config lives in .claude/" slide={4} total={9} accent="from-blue-500 to-indigo-500" />
        <motion.div {...slideIn}><TreeExplorer /></motion.div>
      </div>
    )},
    { id: 'memory', label: 'CLAUDE.md', icon: FileText, accent: 'from-amber-500 to-orange-500', content: (
      <div>
        <SlideHeader icon={FileText} title="CLAUDE.md \u2014 Memory Files" subtitle="Auto-loaded every session. Your briefing documents." slide={5} total={9} accent="from-amber-500 to-orange-500" />
        <motion.div {...slideIn}><MemoryEditor /></motion.div>
      </div>
    )},
    { id: 'agents', label: 'Subagents', icon: Users2, accent: 'from-pink-500 to-rose-500', content: (
      <div>
        <SlideHeader icon={Users2} title="Custom Subagents" subtitle="Specialized AI workers for delegated tasks." slide={6} total={9} accent="from-pink-500 to-rose-500" />
        <motion.div {...slideIn}><SubAgentBuilder /></motion.div>
      </div>
    )},
    { id: 'settings', label: 'Settings', icon: Settings, accent: 'from-cyan-500 to-sky-500', content: (
      <div>
        <SlideHeader icon={Settings} title="Settings &amp; Hooks" subtitle="Control behavior and automate tasks with hooks." slide={7} total={9} accent="from-cyan-500 to-sky-500" />
        <motion.div {...slideIn}><SettingsBuilder /></motion.div>
      </div>
    )},
    { id: 'pro-tips', label: 'Tips', icon: Lightbulb, accent: 'from-purple-500 to-fuchsia-500', content: (
      <div>
        <SlideHeader icon={Lightbulb} title="Pro Tips" subtitle="From coding assistant to coding partner." slide={8} total={9} accent="from-purple-500 to-fuchsia-500" />
        <motion.div {...slideIn}><ProTipsCards /></motion.div>
      </div>
    )},
    { id: 'summary', label: 'Summary', icon: CheckCircle2, accent: 'from-emerald-500 to-green-500', content: <SummarySlide /> },
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
    <div className="fixed inset-0 z-50 overflow-hidden text-gray-100">
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

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 z-30 h-[2px] bg-white/[0.06]">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 via-violet-400 to-blue-500"
          animate={{ width: `${((slide + 1) / totalSlides) * 100}%` }}
          transition={{ duration: 0.5, ease }}
        />
      </div>

      {/* Top Nav dots */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1">
        {slides.map((s, i) => (
          <button key={s.id} onClick={() => goTo(i)}
            className={`group relative flex items-center justify-center transition-all ${
              i === slide ? 'w-6' : 'w-2'
            }`}>
            <div className={`h-2 rounded-full transition-all duration-300 ${
              i === slide ? 'w-6 bg-white/40' :
              i < slide ? 'w-2 bg-white/20' : 'w-2 bg-white/[0.08]'
            }`} />
            <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-gray-900 border border-white/10 text-[10px] text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
              {s.label}
            </span>
          </button>
        ))}
      </div>

      {/* Slide Content */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pt-14 pb-20 px-4">
        <div className="w-full max-w-4xl mx-auto perspective-[1000px]">
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
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-gray-950/80 backdrop-blur-xl border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={prev} disabled={slide === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-20 disabled:cursor-not-allowed enabled:hover:bg-white/5 text-gray-400 hover:text-gray-200">
            <ChevronLeft size={14} /> Back
          </button>

          <div className="flex items-center gap-2">
            {slides.map((s, i) => (
              <button key={s.id} onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === slide ? 'w-7 h-1.5 bg-gradient-to-r ' + s.accent : 'w-1.5 h-1.5 bg-white/[0.12] hover:bg-white/30'
                }`} />
            ))}
          </div>

          {slide < totalSlides - 1 ? (
            <motion.button onClick={next} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-white shadow-lg bg-gradient-to-r ${accent.badge} hover:shadow-xl transition-all`}>
              Next <ChevronRight size={14} />
            </motion.button>
          ) : (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              onClick={() => goTo(0)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-white bg-gradient-to-r from-emerald-600 to-green-600 shadow-lg">
              <CheckCircle2 size={14} /> Restart
            </motion.button>
          )}
        </div>
        <div className="text-center pb-2 text-[10px] text-gray-600">
          <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 font-mono">&larr;</kbd>
          {' '}<kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 font-mono">&rarr;</kbd>
          {' '}or <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 font-mono">Space</kbd>
        </div>
      </div>
    </div>
  );
}
