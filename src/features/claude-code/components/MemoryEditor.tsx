import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Sparkles } from 'lucide-react';

const examples = {
  personal: `# Personal Claude Preferences

## Style
- Be concise. Skip preamble
- Show only diffs, not full rewrites

## Git conventions
- Commit: conventional commits
  (feat:, fix:, chore:)`,

  project: `# Project Context

## Tech Stack
- React 19 + TypeScript (strict)
- Vite, Tailwind CSS
- Jest + React Testing Library

## Conventions
- Arrow functions, no classes
- Functions < 40 lines
- No console.log in production`,

  rules: `# TypeScript Rules

- Prefer \`interface\` over \`type\`
- Never use \`any\` \u2014 use \`unknown\`
- Always type return values explicitly
- Use branded types for IDs`,
};

type ExampleKey = keyof typeof examples;

export default function MemoryEditor() {
  const [active, setActive] = useState<ExampleKey>('personal');
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(examples.personal);

  const switchExample = (key: ExampleKey) => {
    setActive(key);
    setContent(examples[key]);
    setEditing(false);
  };

  const copyContent = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {(['personal', 'project', 'rules'] as ExampleKey[]).map((key) => (
          <button key={key} onClick={() => switchExample(key)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium capitalize transition-all border ${
              active === key
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-sm'
                : 'bg-white/[0.04] text-gray-400 border-white/[0.06] hover:bg-white/[0.06]'
            }`}>
            <Sparkles size={11} />
            {key === 'personal' ? '~/.claude/CLAUDE.md' : key === 'project' ? './CLAUDE.md' : './rules/typescript/RULES.md'}
          </button>
        ))}
      </div>
      <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.06] overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06] bg-white/[0.02]">
          <span className="text-[10px] text-gray-500 font-mono tracking-wide">{active === 'personal' ? '~/.claude/CLAUDE.md' : active === 'project' ? './CLAUDE.md' : './rules/typescript/RULES.md'}</span>
          <div className="flex gap-1.5">
            <button onClick={() => setEditing(!editing)}
              className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all border ${
                editing ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : 'bg-white/[0.04] text-gray-400 border-white/[0.06] hover:bg-white/[0.06]'
              }`}>
              {editing ? 'Preview' : 'Edit'}
            </button>
            <button onClick={copyContent}
              className="p-1.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-gray-400 hover:bg-white/[0.06] transition-all">
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            </button>
          </div>
        </div>
        <div className="flex">
          <div className="text-gray-600 text-[11px] font-mono py-3 px-2.5 text-right select-none leading-[1.65] min-w-[2.2rem] border-r border-white/[0.06] bg-white/[0.015]">
            {content.split('\n').map((_, i) => (<div key={i}>{i + 1}</div>))}
          </div>
          {editing ? (
            <textarea value={content} onChange={e => setContent(e.target.value)}
              className="flex-1 bg-transparent text-gray-200 font-mono text-xs p-3 outline-none resize-none leading-[1.65] min-h-[180px]"
              spellCheck={false} />
          ) : (
            <motion.div key={active + content} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex-1 text-gray-200 font-mono text-xs p-3 leading-[1.65] whitespace-pre overflow-x-auto min-h-[180px]">
              {content.split('\n').map((line, i) => (
                <div key={i} className={
                  line.startsWith('#') ? 'text-amber-300 font-semibold' :
                  line.startsWith('-') ? 'text-gray-300' :
                  line.includes('`') ? 'text-gray-200' : ''
                }>
                  {line || '\u00A0'}
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
      <p className="text-[10px] text-gray-600 mt-2 text-center">
        {editing ? 'Edit the file \u2014 changes are local to this demo.' : 'Claude auto-loads these files as context every session.'}
      </p>
    </div>
  );
}
