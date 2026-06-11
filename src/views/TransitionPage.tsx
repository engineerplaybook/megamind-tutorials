import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Zap, HelpCircle, CheckCircle, BookOpen } from 'lucide-react';
import TransitionDemo from '../concepts/demos/TransitionDemo';
import { TheoryModal } from '../components/ui/TheoryModal';

const TransitionPage: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'urgency' | 'transition' | null>(null);

  const urgencyTheory = (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 text-textColor-secondary">
        <h4 className="text-xs font-bold text-textColor-primary mb-1 uppercase tracking-wider">State Priority & Urgency</h4>
        <p>
          React 18 introduced Concurrent features that allow state updates to be prioritized. Previously, all state updates were urgent and block-evaluated.
        </p>
      </div>
      <div>
        <h5 className="font-bold text-textColor-primary mb-1">Urgent vs Non-Urgent Actions</h5>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-100">
            <span className="text-rose-700 font-bold block text-[11px] uppercase">Urgent Updates</span>
            <p className="text-[10px] text-textColor-secondary mt-1">Keystrokes, selections, button clicks, and hover triggers. Requires instantaneous response.</p>
          </div>
          <div className="p-3 rounded-lg bg-purple-50 border border-purple-100">
            <span className="text-purple-700 font-bold block text-[11px] uppercase">Transitions</span>
            <p className="text-[10px] text-textColor-secondary mt-1">Filtering lists, sorting tables, rendering graphs. Can afford a sub-second delay.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const transitionTheory = (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-fuchsia-50 border border-fuchsia-100 text-textColor-secondary">
        <h4 className="text-xs font-bold text-textColor-primary mb-1 uppercase tracking-wider">The useTransition Hook</h4>
        <p>
          Enables state updates to be designated as non-blocking. It yields a boolean `isPending` state and a `startTransition` coordinator function.
        </p>
      </div>
      <div>
        <h5 className="font-bold text-textColor-primary mb-1">Interruptible Rendering Loop</h5>
        <p className="text-[11px] text-textColor-secondary leading-relaxed mb-2">
          When an update is wrapped in `startTransition`, React evaluates it concurrently in memory. If a new urgent action occurs (e.g. typing another character), React discards the in-progress transition rendering work, processes the keystroke, and restarts the transition.
        </p>
      </div>
      <div>
        <h5 className="font-bold text-textColor-primary mb-1 font-mono">Usage Example</h5>
        <pre className="p-3 bg-slate-950 text-fuchsia-300 rounded-xl font-mono text-[10px] leading-relaxed">
{`const [isPending, startTransition] = useTransition();

const handleFilter = (e) => {
  // Urgent update: Keep keystroke input responsive
  setInputValue(e.target.value);

  // Non-Urgent transition: Run heavy search query in background
  startTransition(() => {
    setSearchQuery(e.target.value);
  });
};`}
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
            <span className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-brand-blue">
              <Zap size={20} />
            </span>
            <span className="text-xs font-bold text-textColor-secondary/60 uppercase tracking-wide">React Hooks Lab</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-textColor-primary leading-tight">
            Transitions &amp; Concurrency (useTransition)
          </h1>
          <p className="text-textColor-secondary text-sm md:text-base mt-2">
            Keep your user interface responsive during heavy component renders by marking updates as interruptible.
          </p>
        </div>

        {/* Concept Notes Card */}
        <div className="bg-white rounded-2xl border border-borderColor/60 shadow-premium p-8 mb-10">
          <h2 className="text-xl font-heading font-extrabold text-textColor-primary mb-6 flex items-center gap-2">
            <HelpCircle size={18} className="text-brand-blue" />
            Concept Handbook: Concurrency in React
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Urgent vs Non-Urgent */}
            <div 
              onClick={() => setActiveModal('urgency')}
              className="p-5 rounded-xl bg-slate-50 hover:bg-purple-50/20 border border-borderColor/40 hover:border-purple-500/20 shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-purple-100 text-purple-700 text-xs font-bold font-mono">
                      Task Urgency
                    </span>
                    <span className="text-xs text-textColor-secondary/60">Prioritization</span>
                  </div>
                  <BookOpen size={14} className="text-textColor-secondary/40 group-hover:text-purple-500 transition-colors" />
                </div>
                <p className="text-textColor-secondary text-xs leading-relaxed mb-4">
                  React categorizes state updates into Urgent interactions (mouse clicks, keyboard entry) and Non-Urgent transitions (filtering dashboards). Click to view details.
                </p>
                <ul className="space-y-2">
                  <li className="text-xs text-textColor-secondary">
                    <strong className="text-textColor-primary block mb-0.5">Urgent updates:</strong>
                    <span>Direct interactions like keystrokes or button clicks that must render immediately.</span>
                  </li>
                  <li className="text-xs text-textColor-secondary mt-3">
                    <strong className="text-textColor-primary block mb-0.5">Non-Urgent transitions:</strong>
                    <span>Complex data views or list filters that can afford a tiny, sub-second delay.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* How useTransition helps */}
            <div 
              onClick={() => setActiveModal('transition')}
              className="p-5 rounded-xl bg-slate-50 hover:bg-fuchsia-50/20 border border-borderColor/40 hover:border-fuchsia-500/20 shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-fuchsia-100 text-fuchsia-700 text-xs font-bold font-mono">
                      useTransition
                    </span>
                    <span className="text-xs text-textColor-secondary/60">Non-blocking state</span>
                  </div>
                  <BookOpen size={14} className="text-textColor-secondary/40 group-hover:text-fuchsia-500 transition-colors" />
                </div>
                <p className="text-textColor-secondary text-xs leading-relaxed mb-4">
                  By wrapping state setters inside `startTransition`, you instruct React to prioritize urgent inputs (like keystrokes) over the heavy rendering tree. Click to view code.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-xs text-textColor-secondary">
                    <CheckCircle size={14} className="text-brand-blue mt-0.5 shrink-0" />
                    <span>User inputs remain 100% responsive.</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-textColor-secondary">
                    <CheckCircle size={14} className="text-brand-blue mt-0.5 shrink-0" />
                    <span>Heavy list updates are rendered concurrently.</span>
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
            <p className="text-textColor-secondary text-xs">Interact with the laboratory below to see how useTransition prevents keyboard input freeze.</p>
          </div>
          
          <div className="bg-white rounded-2xl border border-borderColor/60 shadow-premium p-6 md:p-8">
            <TransitionDemo />
          </div>
        </div>

      </div>

      <TheoryModal
        isOpen={activeModal === 'urgency'}
        onClose={() => setActiveModal(null)}
        title="Task Urgency & Concurrency"
        subtitle="Priority lanes scheduling inside React virtual engine."
        badge="Task Priorities"
        badgeColor="bg-purple-100 text-purple-700"
        content={urgencyTheory}
      />

      <TheoryModal
        isOpen={activeModal === 'transition'}
        onClose={() => setActiveModal(null)}
        title="Non-blocking state with useTransition"
        subtitle="Deferring heavy updates to safeguard page interactivity."
        badge="useTransition Hook"
        badgeColor="bg-fuchsia-100 text-fuchsia-700"
        content={transitionTheory}
      />
    </div>
  );
};

export default TransitionPage;
