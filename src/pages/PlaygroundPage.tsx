import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cpu, ShieldAlert, Eye, List, Milestone, BookOpen } from 'lucide-react';
import { JankSimulator, VirtualList, RenderVisualizer, MemoizationLab } from '@engineerplaybook/design-system';
import { TheoryModal } from '../components/ui/TheoryModal';
import '@engineerplaybook/design-system/dist/style.css';

const PlaygroundPage: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'jank' | 'visualizer' | 'virtual' | 'memo' | null>(null);

  const jankTheory = (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-textColor-secondary">
        <h4 className="text-xs font-bold text-textColor-primary mb-1 uppercase tracking-wider">Main Thread Blocking (Jank)</h4>
        <p>
          Browsers execute JavaScript on a single thread. If a computation blocks this thread for more than 16ms, the browser drops rendering frames, causing visual "jank" or freezes.
        </p>
      </div>
      <div>
        <h5 className="font-bold text-textColor-primary mb-1">Causes & Mitigations</h5>
        <ul className="list-disc pl-5 space-y-1.5 text-textColor-secondary">
          <li><strong>Heavy Math:</strong> Prime factorization, cryptography, sorting huge arrays. Defer these to Web Workers or use chunking.</li>
          <li><strong>Layout Thrashing:</strong> Reading layout properties (like `offsetHeight`) immediately after writing them forces synchronous layouts.</li>
          <li><strong>Task Chunking:</strong> Break long scripts into sub-tasks using `setTimeout(fn, 0)` or `requestIdleCallback`.</li>
        </ul>
      </div>
    </div>
  );

  const visualizerTheory = (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-textColor-secondary">
        <h4 className="text-xs font-bold text-textColor-primary mb-1 uppercase tracking-wider">React Reconciliation & Updates</h4>
        <p>
          Reconciliation is React's diffing algorithm to update the DOM. The Render Visualizer displays how frequently components recalculate their virtual trees.
        </p>
      </div>
      <div>
        <h5 className="font-bold text-textColor-primary mb-1">Sub-tree Re-renders</h5>
        <p className="text-[11px] text-textColor-secondary leading-relaxed">
          When a component updates state, React automatically re-renders it and all of its nested children recursively, unless optimized using `React.memo` or children passing techniques. Visualizing updates exposes unexpected cascade renders.
        </p>
      </div>
    </div>
  );

  const virtualTheory = (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-textColor-secondary">
        <h4 className="text-xs font-bold text-textColor-primary mb-1 uppercase tracking-wider">Virtual Lists (Windowing)</h4>
        <p>
          Rendering 10,000 DOM nodes degrades browser performance. Virtualization solves this by drawing only the rows visible inside the viewport window.
        </p>
      </div>
      <div>
        <h5 className="font-bold text-textColor-primary mb-1">DOM Recycling & Offsets</h5>
        <p className="text-[11px] text-textColor-secondary leading-relaxed">
          A scroll container calculates the viewport boundaries and absolute positioning offsets. Only 10-20 items are kept in the DOM at any time. As rows slide out of view, they are repurposed with new database indexes, keeping DOM node count flat.
        </p>
      </div>
    </div>
  );

  const memoTheory = (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-textColor-secondary">
        <h4 className="text-xs font-bold text-textColor-primary mb-1 uppercase tracking-wider">Memoization (useMemo & React.memo)</h4>
        <p>
          Memoization is caching computation results. In React, it's used to bypass expensive operations or maintain referential identity across renders.
        </p>
      </div>
      <div>
        <h5 className="font-bold text-textColor-primary mb-1">Caching vs Comparison Costs</h5>
        <p className="text-[11px] text-textColor-secondary leading-relaxed mb-2">
          Do not memoize everything! Shallow comparisons and caching parameters carry overhead. Use `useMemo` only for heavy algorithms (e.g. data grouping, matrix filters) or when passing objects as dependencies to other hooks like `useEffect`.
        </p>
        <pre className="p-3 bg-slate-950 text-amber-300 rounded-xl font-mono text-[10px] leading-relaxed">
{`const processedData = useMemo(() => {
  return runExpensiveFilter(data);
}, [data]); // Only runs again if 'data' array changes`}
        </pre>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bgdefault py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm text-textColor-secondary hover:text-primary transition-colors duration-200 mb-6 group"
        >
          <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
          Back to Catalog
        </Link>

        {/* Title */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary">
              <Cpu size={20} />
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-textColor-primary leading-tight">
            Component Playground
          </h1>
          <p className="text-textColor-secondary text-sm md:text-base mt-2">
            Inspect frontend rendering bottlenecks and optimization techniques in a live performance sandbox.
          </p>
        </div>

        <div className="space-y-12">
          {/* Rendering Issues Section */}
          <div>
            <h2 className="text-xl font-heading font-extrabold text-textColor-primary mb-6 flex items-center gap-2">
              <ShieldAlert size={18} className="text-brand-red animate-pulse" />
              1. Rendering Performance Bottlenecks
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Jank Simulator Card */}
              <div className="bg-white rounded-2xl border border-borderColor/60 shadow-premium overflow-hidden border-t-4 border-t-brand-red">
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center text-brand-red">
                        <ShieldAlert size={18} />
                      </div>
                      <div>
                        <h3 className="text-base font-heading font-extrabold text-textColor-primary">Jank Simulator</h3>
                        <p className="text-[11px] text-textColor-secondary">Simulate Main Thread blocking work</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveModal('jank')}
                      className="inline-flex items-center gap-1 text-[10px] bg-red-50 hover:bg-red-100 border border-red-200/60 rounded px-2 py-1 text-red-700 font-bold uppercase cursor-pointer transition-colors"
                    >
                      <BookOpen size={10} /> Guide
                    </button>
                  </div>
                  <JankSimulator />
                </div>
              </div>

              {/* Render Visualizer Card */}
              <div className="bg-white rounded-2xl border border-borderColor/60 shadow-premium overflow-hidden border-t-4 border-t-brand-blue">
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue">
                        <Eye size={18} />
                      </div>
                      <div>
                        <h3 className="text-base font-heading font-extrabold text-textColor-primary">Render Visualizer</h3>
                        <p className="text-[11px] text-textColor-secondary">Visualize React update batches</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveModal('visualizer')}
                      className="inline-flex items-center gap-1 text-[10px] bg-blue-50 hover:bg-blue-100 border border-blue-200/60 rounded px-2 py-1 text-brand-blue font-bold uppercase cursor-pointer transition-colors"
                    >
                      <BookOpen size={10} /> Guide
                    </button>
                  </div>
                  <RenderVisualizer />
                </div>
              </div>

            </div>
          </div>

          {/* Optimization Section */}
          <div>
            <h2 className="text-xl font-heading font-extrabold text-textColor-primary mb-6 flex items-center gap-2">
              <Milestone size={18} className="text-brand-green" />
              2. Optimization Solutions
            </h2>
            <div className="space-y-8">
              
              {/* Virtual List Card */}
              <div className="bg-white rounded-2xl border border-borderColor/60 shadow-premium overflow-hidden border-l-4 border-l-brand-green">
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-brand-green/10 border border-brand-green/20 flex items-center justify-center text-brand-green shrink-0">
                        <List size={22} />
                      </div>
                      <div>
                        <h3 className="text-lg font-heading font-extrabold text-textColor-primary">Virtual List</h3>
                        <p className="text-xs text-textColor-secondary">Efficiently render massive datasets by drawing only what fits on screen.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveModal('virtual')}
                      className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 rounded px-2 py-1 text-brand-green font-bold uppercase cursor-pointer transition-colors shrink-0"
                    >
                      <BookOpen size={10} /> Guide
                    </button>
                  </div>
                  <VirtualList />
                </div>
              </div>

              {/* Memoization Lab Card */}
              <div className="bg-white rounded-2xl border border-borderColor/60 shadow-premium overflow-hidden border-l-4 border-l-brand-gold">
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold shrink-0">
                        <Cpu size={22} />
                      </div>
                      <div>
                        <h3 className="text-lg font-heading font-extrabold text-textColor-primary">Memoization Lab</h3>
                        <p className="text-xs text-textColor-secondary">Compare caching with useMemo vs running calculations repeatedly.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveModal('memo')}
                      className="inline-flex items-center gap-1 text-[10px] bg-amber-50 hover:bg-amber-100 border border-amber-200/60 rounded px-2 py-1 text-brand-gold font-bold uppercase cursor-pointer transition-colors shrink-0"
                    >
                      <BookOpen size={10} /> Guide
                    </button>
                  </div>
                  <MemoizationLab />
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      <TheoryModal
        isOpen={activeModal === 'jank'}
        onClose={() => setActiveModal(null)}
        title="Jank & Performance Simulator"
        subtitle="Analyzing single-thread bottlenecks and UI freeze events."
        badge="Main Thread Jank"
        badgeColor="bg-red-100 text-red-700"
        content={jankTheory}
      />

      <TheoryModal
        isOpen={activeModal === 'visualizer'}
        onClose={() => setActiveModal(null)}
        title="Reconciliation & Rendering Cycles"
        subtitle="Tracking React update batches and children cascades."
        badge="Reconciliation"
        badgeColor="bg-blue-100 text-blue-700"
        content={visualizerTheory}
      />

      <TheoryModal
        isOpen={activeModal === 'virtual'}
        onClose={() => setActiveModal(null)}
        title="Virtual List Recycling"
        subtitle="Improving viewport efficiency via index recycling windowing."
        badge="Virtual List"
        badgeColor="bg-emerald-100 text-emerald-700"
        content={virtualTheory}
      />

      <TheoryModal
        isOpen={activeModal === 'memo'}
        onClose={() => setActiveModal(null)}
        title="Memoization Caching Guide"
        subtitle="When to cache computational resources vs comparing dependencies."
        badge="Memoization Lab"
        badgeColor="bg-amber-100 text-amber-700"
        content={memoTheory}
      />
    </div>
  );
};

export default PlaygroundPage;
