import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Zap, HelpCircle, CheckCircle } from 'lucide-react';
import TransitionDemo from '../concepts/demos/TransitionDemo';

const TransitionPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-bgdefault py-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Link */}
        <Link 
          to="/" 
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
            <div className="p-5 rounded-xl bg-slate-50 border border-borderColor/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded bg-purple-100 text-purple-700 text-xs font-bold font-mono">
                    Task Urgency
                  </span>
                  <span className="text-xs text-textColor-secondary/60">Prioritization</span>
                </div>
                <p className="text-textColor-secondary text-xs leading-relaxed mb-4">
                  React categorizes state updates into two groups:
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
            <div className="p-5 rounded-xl bg-slate-50 border border-borderColor/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded bg-fuchsia-100 text-fuchsia-700 text-xs font-bold font-mono">
                    useTransition
                  </span>
                  <span className="text-xs text-textColor-secondary/60">Non-blocking state</span>
                </div>
                <p className="text-textColor-secondary text-xs leading-relaxed mb-4">
                  By wrapping state setters inside `startTransition`, you instruct React to prioritize urgent inputs (like keystrokes) over the heavy rendering tree.
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
    </div>
  );
};

export default TransitionPage;
