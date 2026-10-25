import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, FolderOpen, File, ChevronRight, Globe, Briefcase } from 'lucide-react';

interface TreeNode {
  name: string; type: 'file' | 'folder'; children?: TreeNode[]; icon?: typeof File; description?: string;
}

const globalTree: TreeNode[] = [
  { name: 'settings.json', type: 'file', icon: File, description: 'Personal defaults across all projects' },
  { name: 'CLAUDE.md', type: 'file', icon: File, description: 'Personal memory loaded in every session' },
  { name: 'agents/', type: 'folder', children: [], description: 'Global custom subagents' },
  { name: 'skills/', type: 'folder', children: [], description: 'Global custom skills (slash commands)' },
];

const workspaceTree: TreeNode[] = [
  { name: 'settings.json', type: 'file', icon: File, description: 'Team settings for this project' },
  { name: 'CLAUDE.md', type: 'file', icon: File, description: 'Project context and conventions' },
  {
    name: 'rules/', type: 'folder', description: 'Context-aware rules', children: [
      { name: 'typescript/', type: 'folder', children: [
        { name: 'RULES.md', type: 'file', icon: File, description: 'TypeScript conventions for this project' },
      ], description: 'TypeScript rules' },
    ],
  },
  { name: '.mcp.json', type: 'file', icon: File, description: 'MCP server definitions' },
];

function TreeNodeComponent({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [open, setOpen] = useState(depth < 1);
  const isFolder = node.type === 'folder';

  return (
    <div>
      <button onClick={() => isFolder && setOpen(!open)}
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg w-full text-left transition-colors text-xs ${depth > 0 ? 'ml-5' : ''} ${
          isFolder ? 'hover:bg-white/[0.04]' : 'hover:bg-white/[0.02]'
        }`}>
        {isFolder ? (
          <>
            <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.15 }}>
              <ChevronRight size={12} className="text-gray-600" />
            </motion.div>
            {open ? <FolderOpen size={14} className="text-purple-400" /> : <Folder size={14} className="text-yellow-500/80" />}
          </>
        ) : (
          <>
            <span className="w-3" />
            {node.icon ? <node.icon size={14} className="text-gray-500" /> : <File size={14} className="text-gray-500" />}
          </>
        )}
        <span className="text-gray-300 font-mono text-xs">{node.name}</span>
      </button>
      {node.description && depth > 0 && (
        <p className="text-[10px] text-gray-600 ml-[4.2rem] -mt-0.5 mb-0.5">{node.description}</p>
      )}
      <AnimatePresence>
        {isFolder && open && node.children && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            {node.children.map(child => (
              <TreeNodeComponent key={child.name} node={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TreeExplorer() {
  const [tab, setTab] = useState<'global' | 'workspace'>('global');

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setTab('global')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all border ${
            tab === 'global' ? 'bg-purple-500/15 text-purple-300 border-purple-500/30 shadow-sm' : 'bg-white/[0.04] text-gray-400 border-white/[0.06] hover:bg-white/[0.06]'
          }`}>
          <Globe size={14} /> ~/.claude/
        </button>
        <button onClick={() => setTab('workspace')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all border ${
            tab === 'workspace' ? 'bg-purple-500/15 text-purple-300 border-purple-500/30 shadow-sm' : 'bg-white/[0.04] text-gray-400 border-white/[0.06] hover:bg-white/[0.06]'
          }`}>
          <Briefcase size={14} /> .claude/ (project)
        </button>
      </div>
      <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.06] p-3">
        <div className="text-[10px] text-gray-600 font-mono mb-2 px-2.5 tracking-wide">
          {tab === 'global' ? '~/.claude/' : '.claude/'}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}>
            {(tab === 'global' ? globalTree : workspaceTree).map(node => (
              <TreeNodeComponent key={node.name} node={node} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
