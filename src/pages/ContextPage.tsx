import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Code, HelpCircle, AlertTriangle } from 'lucide-react';
import ContextDemo from '../concepts/demos/ContextDemo';

const ContextPage: React.FC = () => {
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
            <span className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-brand-blue">
              <Code size={20} />
            </span>
            <span className="text-xs font-bold text-textColor-secondary/60 uppercase tracking-wide">React Hooks Lab</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-textColor-primary leading-tight">
            Context API (createContext)
          </h1>
          <p className="text-textColor-secondary text-sm md:text-base mt-2">
            Share global application state like themes, user authentication, or language preferences without prop-drilling.
          </p>
        </div>

        {/* Concept Notes Card */}
        <div className="bg-white rounded-2xl border border-borderColor/60 shadow-premium p-8 mb-10">
          <h2 className="text-xl font-heading font-extrabold text-textColor-primary mb-6 flex items-center gap-2">
            <HelpCircle size={18} className="text-brand-blue" />
            Concept Handbook: Sharing Global State
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* The Prop Drilling Problem */}
            <div className="p-5 rounded-xl bg-slate-50 border border-borderColor/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded bg-rose-100 text-rose-700 text-xs font-bold font-mono">
                    Prop Drilling
                  </span>
                  <span className="text-xs text-textColor-secondary/60">Problem</span>
                </div>
                <p className="text-textColor-secondary text-xs leading-relaxed mb-4">
                  Passing props through many intermediate levels of components just to reach a deeply nested child is tedious, brittle, and introduces unnecessary code coupling.
                </p>
              </div>
            </div>

            {/* When to use Context */}
            <div className="p-5 rounded-xl bg-slate-50 border border-borderColor/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded bg-pink-100 text-pink-700 text-xs font-bold font-mono">
                    Provider Pattern
                  </span>
                  <span className="text-xs text-textColor-secondary/60">Solution</span>
                </div>
                <p className="text-textColor-secondary text-xs leading-relaxed mb-4">
                  Context lets you "teleport" values directly from a top-level provider component to any child component in the tree, bypassing intermediate components completely.
                </p>
              </div>
            </div>
          </div>

          {/* Performance warning callout */}
          <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200/60 flex gap-3">
            <AlertTriangle size={18} className="text-brand-gold shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-textColor-primary">Performance Gotcha: Re-rendering</p>
              <p className="text-[11px] text-textColor-secondary mt-1 leading-normal">
                Every component that consumes the context will re-render whenever the provider's value object changes. Avoid using context for high-frequency state updates (e.g. cursor positions, keystrokes).
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Demo Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-heading font-extrabold text-textColor-primary">
              Interactive Laboratories
            </h2>
            <p className="text-textColor-secondary text-xs">Interact with the mock app laboratory below to see Context consumption in action.</p>
          </div>
          
          <div className="bg-white rounded-2xl border border-borderColor/60 shadow-premium p-6 md:p-8">
            <ContextDemo />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContextPage;
