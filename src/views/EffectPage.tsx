import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, HelpCircle, AlertCircle, BookOpen } from 'lucide-react';
import EffectDemo from '../concepts/demos/EffectDemo';
import { TheoryModal } from '../components/ui/TheoryModal';

const EffectPage: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'deps' | 'cleanup' | null>(null);

  const depsTheory = (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-textColor-secondary">
        <h4 className="text-xs font-bold text-textColor-primary mb-1 uppercase tracking-wider">Dependency Array</h4>
        <p>
          Determines when the `useEffect` body runs. React performs a shallow comparison (using `Object.is`) of all dependency values after every render.
        </p>
      </div>
      <div>
        <h5 className="font-bold text-textColor-primary mb-1">The Three Trigger Modes</h5>
        <ul className="space-y-2 text-textColor-secondary">
          <li>
            <strong className="text-textColor-primary">1. No Dependency Array (`undefined`):</strong>
            <p className="pl-4">Runs after <strong>every single render</strong>. Avoid heavy tasks or setting state here (creates infinite render loops!).</p>
          </li>
          <li>
            <strong className="text-textColor-primary">2. Empty Array (`[]`):</strong>
            <p className="pl-4">Runs <strong>only once on mount</strong>. Ideal for initial API fetches, establishing event listeners, or initializing third-party libraries.</p>
          </li>
          <li>
            <strong className="text-textColor-primary">3. Array with Dependencies (`[a, b]`):</strong>
            <p className="pl-4">Runs on mount and whenever <strong>either `a` or `b` changes</strong> since the last render.</p>
          </li>
        </ul>
      </div>
      <div>
        <h5 className="font-bold text-textColor-primary mb-1">Rule of Exhaustive Dependencies</h5>
        <p className="text-[11px] mb-2 text-textColor-secondary">
          Any variable referenced in the effect body (props, state, or derived variables) <strong>must</strong> be declared inside the dependency array. Skipping them leads to stale closures:
        </p>
        <pre className="p-3 bg-slate-950 text-emerald-300 rounded-xl font-mono text-[10px] leading-relaxed">
{`useEffect(() => {
  console.log(user.name); // 'user' must be in the dependency array!
}, [user]);`}
        </pre>
      </div>
    </div>
  );

  const cleanupTheory = (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-textColor-secondary">
        <h4 className="text-xs font-bold text-textColor-primary mb-1 uppercase tracking-wider">Cleanup Function</h4>
        <p>
          If the effect returns a function, React handles it as a "teardown" block. This prevents memory leaks and stale event handlers in active applications.
        </p>
      </div>
      <div>
        <h5 className="font-bold text-textColor-primary mb-1">When does the cleanup run?</h5>
        <ol className="list-decimal pl-5 space-y-1.5 text-textColor-secondary">
          <li><strong>On subsequent renders:</strong> Runs <i>before</i> executing the effect callback again to clear out resources of the previous run.</li>
          <li><strong>On unmount:</strong> Runs when the component is being removed from the DOM.</li>
        </ol>
      </div>
      <div>
        <h5 className="font-bold text-textColor-primary mb-1 font-mono">Example: Safe WebSockets & Timers</h5>
        <pre className="p-3 bg-slate-950 text-amber-300 rounded-xl font-mono text-[10px] leading-relaxed">
{`useEffect(() => {
  const socket = connectToChat(room);

  // Return teardown function:
  return () => {
    socket.disconnect();
  };
}, [room]);`}
        </pre>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bgdefault py-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Link */}
        <Link 
          href="/tutorials/" 
          className="inline-flex items-center gap-2 text-sm text-textColor-secondary hover:text-primary transition-colors duration-200 mb-6 group"
        >
          <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
          Back to Catalog
        </Link>

        {/* Title */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-brand-green">
              <RefreshCw size={20} />
            </span>
            <span className="text-xs font-bold text-textColor-secondary/60 uppercase tracking-wide">React Hooks Lab</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-textColor-primary leading-tight">
            Side Effects (useEffect)
          </h1>
          <p className="text-textColor-secondary text-sm md:text-base mt-2">
            Synchronize your components with external systems, manage life cycles, and prevent memory leaks.
          </p>
        </div>

        {/* Concept Notes Card */}
        <div className="bg-white rounded-2xl border border-borderColor/60 shadow-premium p-8 mb-10">
          <h2 className="text-xl font-heading font-extrabold text-textColor-primary mb-6 flex items-center gap-2">
            <HelpCircle size={18} className="text-brand-green" />
            Concept Handbook: useEffect Lifecycle
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Dependency Arrays */}
            <div 
              onClick={() => setActiveModal('deps')}
              className="p-5 rounded-xl bg-slate-50 hover:bg-emerald-50/20 border border-borderColor/40 hover:border-emerald-500/20 shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-700 text-xs font-bold font-mono">
                      Dependency Array
                    </span>
                    <span className="text-xs text-textColor-secondary/60">Trigger mechanism</span>
                  </div>
                  <BookOpen size={14} className="text-textColor-secondary/40 group-hover:text-emerald-500 transition-colors" />
                </div>
                <p className="text-textColor-secondary text-xs leading-relaxed mb-4">
                  Controls when the side effect is executed. Click to read more about Object.is comparisons and exhaustive dependencies rules.
                </p>
                <ul className="space-y-3">
                  <li className="text-xs text-textColor-secondary">
                    <code className="text-brand-red mr-1 bg-white border border-borderColor/60">undefined</code> 
                    <span className="text-[11px]">No array. Runs after <strong>every single render</strong>.</span>
                  </li>
                  <li className="text-xs text-textColor-secondary">
                    <code className="text-brand-blue mr-1 bg-white border border-borderColor/60">[]</code> 
                    <span className="text-[11px]">Empty array. Runs <strong>only on mount</strong>.</span>
                  </li>
                  <li className="text-xs text-textColor-secondary">
                    <code className="text-brand-green mr-1 bg-white border border-borderColor/60">[value]</code> 
                    <span className="text-[11px]">Runs on mount + when <strong>value changes</strong>.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Cleanup Functions */}
            <div 
              onClick={() => setActiveModal('cleanup')}
              className="p-5 rounded-xl bg-slate-50 hover:bg-amber-50/20 border border-borderColor/40 hover:border-amber-500/20 shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-700 text-xs font-bold font-mono">
                      Cleanup Function
                    </span>
                    <span className="text-xs text-textColor-secondary/60">Tear down handler</span>
                  </div>
                  <BookOpen size={14} className="text-textColor-secondary/40 group-hover:text-brand-gold transition-colors" />
                </div>
                <p className="text-textColor-secondary text-xs leading-relaxed mb-4">
                  If your effect returns a function, React will invoke it before re-running the effect and when the component unmounts. Click to view teardown rules.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-xs text-textColor-secondary">
                    <AlertCircle size={14} className="text-brand-gold mt-0.5 shrink-0" />
                    <span className="text-[11px]">Before re-running the effect (clearing previous resources).</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-textColor-secondary">
                    <AlertCircle size={14} className="text-brand-gold mt-0.5 shrink-0" />
                    <span className="text-[11px]">When the component unmounts. Essential for subscriptions.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Demo Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-heading font-extrabold text-textColor-primary">
              Interactive Laboratories
            </h2>
            <p className="text-textColor-secondary text-xs">Interact with each lab below to inspect useEffect rendering and cleanup phases.</p>
          </div>
          
          <div className="bg-white rounded-2xl border border-borderColor/60 shadow-premium p-6 md:p-8">
            <EffectDemo />
          </div>
        </div>

      </div>

      <TheoryModal
        isOpen={activeModal === 'deps'}
        onClose={() => setActiveModal(null)}
        title="Dependency Array Handbook"
        subtitle="Controlling the rendering trigger updates inside useEffect."
        badge="Effect Triggers"
        badgeColor="bg-emerald-100 text-emerald-700"
        content={depsTheory}
      />

      <TheoryModal
        isOpen={activeModal === 'cleanup'}
        onClose={() => setActiveModal(null)}
        title="Cleanup Teardown Handbook"
        subtitle="Preventing memory leaks and invalid state listeners."
        badge="Teardown Handling"
        badgeColor="bg-amber-100 text-amber-700"
        content={cleanupTheory}
      />
    </div>
  );
};

export default EffectPage;
