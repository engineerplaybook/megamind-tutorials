import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, HelpCircle, AlertCircle } from 'lucide-react';
import EffectDemo from '../concepts/demos/EffectDemo';

const EffectPage: React.FC = () => {
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
            <div className="p-5 rounded-xl bg-slate-50 border border-borderColor/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-700 text-xs font-bold font-mono">
                    Dependency Array
                  </span>
                  <span className="text-xs text-textColor-secondary/60">Trigger mechanism</span>
                </div>
                <p className="text-textColor-secondary text-xs leading-relaxed mb-4">
                  Controls when the side effect is executed:
                </p>
                <ul className="space-y-3">
                  <li className="text-xs text-textColor-secondary">
                    <code className="text-brand-red mr-1 bg-white border border-borderColor/60">undefined</code> 
                    <span className="text-[11px]">No array. Runs after <strong>every single render</strong>.</span>
                  </li>
                  <li className="text-xs text-textColor-secondary">
                    <code className="text-brand-blue mr-1 bg-white border border-borderColor/60">[]</code> 
                    <span className="text-[11px]">Empty array. Runs <strong>only on mount</strong> (initial render).</span>
                  </li>
                  <li className="text-xs text-textColor-secondary">
                    <code className="text-brand-green mr-1 bg-white border border-borderColor/60">[value]</code> 
                    <span className="text-[11px]">Dependencies. Runs on mount + when <strong>value changes</strong>.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Cleanup Functions */}
            <div className="p-5 rounded-xl bg-slate-50 border border-borderColor/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-700 text-xs font-bold font-mono">
                    Cleanup Function
                  </span>
                  <span className="text-xs text-textColor-secondary/60">Tear down handler</span>
                </div>
                <p className="text-textColor-secondary text-xs leading-relaxed mb-4">
                  If your effect returns a function, React will invoke it:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-xs text-textColor-secondary">
                    <AlertCircle size={14} className="text-brand-gold mt-0.5 shrink-0" />
                    <span className="text-[11px]">Before re-running the effect (to clean up the previous run's resources).</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-textColor-secondary">
                    <AlertCircle size={14} className="text-brand-gold mt-0.5 shrink-0" />
                    <span className="text-[11px]">When the component unmounts (destroy phase). Essential for subscriptions and listeners.</span>
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
    </div>
  );
};

export default EffectPage;
