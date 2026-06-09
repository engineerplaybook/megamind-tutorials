import { useState } from 'react';
import { motion } from 'framer-motion';
import { ToggleLeft, ToggleRight, Play } from 'lucide-react';

export default function SettingsBuilder() {
  const [autoLint, setAutoLint] = useState(true);
  const [fastMode, setFastMode] = useState(false);
  const [autoApprove, setAutoApprove] = useState(false);
  const [lintCommand, setLintCommand] = useState('npm run lint --fix');
  const [showHook, setShowHook] = useState(false);

  const hookConfig = { matcher: 'Write|Edit', command: lintCommand };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-3">
        {[
          { label: 'Auto-lint on edit', value: autoLint, set: setAutoLint, desc: 'Run linter after every file change' },
          { label: 'Fast response mode', value: fastMode, set: setFastMode, desc: 'Skip verbose explanations' },
          { label: 'Auto-approve edits', value: autoApprove, set: setAutoApprove, desc: 'Apply edits without confirmation' },
        ].map(item => (
          <motion.button key={item.label} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            onClick={() => item.set(!item.value)}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              item.value
                ? 'bg-cyan-500/10 border-cyan-500/30 shadow-sm'
                : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06]'
            }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-gray-200 text-xs font-medium">{item.label}</span>
              {item.value
                ? <ToggleRight size={18} className="text-cyan-400" />
                : <ToggleLeft size={18} className="text-gray-600" />
              }
            </div>
            <p className="text-[11px] text-gray-500">{item.desc}</p>
          </motion.button>
        ))}
      </div>

      {autoLint && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
          className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.06] overflow-hidden">
          <div className="p-4">
            <h4 className="text-xs font-medium text-gray-200 mb-3 flex items-center gap-2">
              <Play size={12} className="text-cyan-400" />
              Post-Tool-Use Hook Configuration
            </h4>
            <div className="grid md:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-[10px] text-gray-500 tracking-wide uppercase font-semibold block mb-1">Matcher Pattern</label>
                <input value={hookConfig.matcher} readOnly
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-gray-300 outline-none cursor-default" />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 tracking-wide uppercase font-semibold block mb-1">Lint Command</label>
                <input value={lintCommand} onChange={e => setLintCommand(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-gray-200 outline-none focus:border-cyan-500/50 focus:bg-white/[0.06] transition-all" />
              </div>
            </div>
            <div className="bg-gray-950/80 rounded-lg p-3 border border-white/[0.04]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-gray-500 font-mono">settings.json</span>
                <button onClick={() => setShowHook(!showHook)}
                  className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 transition-colors">
                  <Play size={10} />
                  {showHook ? 'Hide config' : 'Show config'}
                </button>
              </div>
              {showHook && (
                <motion.pre initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-[11px] font-mono text-gray-300 leading-relaxed overflow-x-auto">
{`{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "${hookConfig.matcher}",
        "hooks": [
          { "type": "command", "command": "${hookConfig.command}" }
        ]
      }
    ]
  }
}`}
                </motion.pre>
              )}
            </div>
          </div>
        </motion.div>
      )}

      <div className="bg-gradient-to-r from-cyan-500/[0.06] to-sky-500/[0.06] rounded-xl border border-cyan-500/10 p-3.5 text-center">
        <p className="text-xs text-gray-400">
          {autoLint
            ? 'Auto-lint active: every edit triggers the linter automatically.'
            : 'Settings are local to this demo. Toggle options above to see how hooks work.'}
        </p>
      </div>
    </div>
  );
}
