import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Layers, HelpCircle, CheckCircle } from 'lucide-react';
import StateDemo from '../concepts/demos/StateDemo';

const StateManagementPage: React.FC = () => {
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
            <span className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-brand-blue">
              <Layers size={20} />
            </span>
            <span className="text-xs font-bold text-textColor-secondary/60 uppercase tracking-wide">React Hooks Lab</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-textColor-primary leading-tight">
            State Management
          </h1>
          <p className="text-textColor-secondary text-sm md:text-base mt-2">
            Master React state synchronization: understanding when to leverage simple state vs reducer architectures.
          </p>
        </div>

        {/* Concept Notes Card */}
        <div className="bg-white rounded-2xl border border-borderColor/60 shadow-premium p-8 mb-10">
          <h2 className="text-xl font-heading font-extrabold text-textColor-primary mb-6 flex items-center gap-2">
            <HelpCircle size={18} className="text-brand-blue" />
            Concept Handbook: useState vs. useReducer
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* useState Notes */}
            <div className="p-5 rounded-xl bg-slate-50 border border-borderColor/40">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-700 text-xs font-bold font-mono">
                  useState
                </span>
                <span className="text-xs text-textColor-secondary/60">Atomic updates</span>
              </div>
              <p className="text-textColor-secondary text-xs leading-relaxed mb-4">
                Perfect for simple, independent state variables. Best for forms, flags, and UI toggles where updates are direct.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-xs text-textColor-secondary">
                  <CheckCircle size={14} className="text-brand-blue mt-0.5 shrink-0" />
                  <span>Simple states (counters, toggle flags)</span>
                </li>
                <li className="flex items-start gap-2 text-xs text-textColor-secondary">
                  <CheckCircle size={14} className="text-brand-blue mt-0.5 shrink-0" />
                  <span>Independent inputs or forms</span>
                </li>
              </ul>
            </div>

            {/* useReducer Notes */}
            <div className="p-5 rounded-xl bg-slate-50 border border-borderColor/40">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-700 text-xs font-bold font-mono">
                  useReducer
                </span>
                <span className="text-xs text-textColor-secondary/60">Transactional updates</span>
              </div>
              <p className="text-textColor-secondary text-xs leading-relaxed mb-4">
                Excels in complex state structures where multiple variables depend on one another, or when state logic is decoupled from UI event handlers.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-xs text-textColor-secondary">
                  <CheckCircle size={14} className="text-brand-green mt-0.5 shrink-0" />
                  <span>Complex schemas (nested arrays, objects)</span>
                </li>
                <li className="flex items-start gap-2 text-xs text-textColor-secondary">
                  <CheckCircle size={14} className="text-brand-green mt-0.5 shrink-0" />
                  <span>State transitions depending on previous state</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Interactive Demo Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-heading font-extrabold text-textColor-primary">
              Interactive Laboratories
            </h2>
            <p className="text-textColor-secondary text-xs">Interact with each lab below to inspect component state behavior.</p>
          </div>
          
          <div className="bg-white rounded-2xl border border-borderColor/60 shadow-premium p-6 md:p-8">
            <StateDemo />
          </div>
        </div>

      </div>
    </div>
  );
};

export default StateManagementPage;
