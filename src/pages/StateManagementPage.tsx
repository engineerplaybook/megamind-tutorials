import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Layers, HelpCircle, CheckCircle, BookOpen } from 'lucide-react';
import StateDemo from '../concepts/demos/StateDemo';
import { TheoryModal } from '../components/ui/TheoryModal';

const StateManagementPage: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'useState' | 'useReducer' | null>(null);

  const useStateTheory = (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-textColor-secondary">
        <h4 className="text-xs font-bold text-textColor-primary mb-1 uppercase tracking-wider">useState Hook</h4>
        <p>
          React's fundamental hook for storing local state variables. It returns a stateful value and a dispatch function to update it.
        </p>
      </div>
      <div>
        <h5 className="font-bold text-textColor-primary mb-1">State Batching & Asynchronous Updates</h5>
        <p className="text-[11px] mb-2 text-textColor-secondary">
          React batches multiple updates inside event handlers to perform a single re-render. Thus, reading state immediately after calling its set function will still yield the old value:
        </p>
        <pre className="p-3 bg-slate-950 text-blue-300 rounded-xl font-mono text-[10px] leading-relaxed">
{`const [count, setCount] = useState(0);

const handleClick = () => {
  setCount(count + 1);
  console.log(count); // Still prints 0!
};`}
        </pre>
      </div>
      <div>
        <h5 className="font-bold text-textColor-primary mb-1">Functional Updates Pattern</h5>
        <p className="text-[11px] mb-2 text-textColor-secondary">
          To calculate the next state based on the previous state, always pass a callback function to the state setter. This ensures you avoid stale closure references:
        </p>
        <pre className="p-3 bg-slate-950 text-blue-300 rounded-xl font-mono text-[10px] leading-relaxed">
{`setCount(prevCount => prevCount + 1);`}
        </pre>
      </div>
    </div>
  );

  const useReducerTheory = (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-textColor-secondary">
        <h4 className="text-xs font-bold text-textColor-primary mb-1 uppercase tracking-wider">useReducer Hook</h4>
        <p>
          An alternative hook to manage complex state transitions in React. It accepts a reducer function of type <code>(state, action) =&gt; newState</code> and returns the current state paired with a dispatch method.
        </p>
      </div>
      <div>
        <h5 className="font-bold text-textColor-primary mb-1">When to Use useReducer over useState</h5>
        <ul className="list-disc pl-5 space-y-1.5 text-textColor-secondary">
          <li><strong>Co-dependent State:</strong> When multiple states change together in response to a single action.</li>
          <li><strong>Complex Structures:</strong> Nested objects, list arrays, or state graphs.</li>
          <li><strong>Decoupling Logic:</strong> Extract state computation out of components for easier unit testing.</li>
        </ul>
      </div>
      <div>
        <h5 className="font-bold text-textColor-primary mb-1">Standard Action Dispatch Pattern</h5>
        <pre className="p-3 bg-slate-950 text-emerald-300 rounded-xl font-mono text-[10px] leading-relaxed">
{`function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, { id: Date.now(), text: action.payload }];
    case 'REMOVE_TODO':
      return state.filter(todo => todo.id !== action.id);
    default:
      return state;
  }
}

const [state, dispatch] = useReducer(reducer, []);
dispatch({ type: 'ADD_TODO', payload: 'Learn React Hooks' });`}
        </pre>
      </div>
    </div>
  );

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
            <div 
              onClick={() => setActiveModal('useState')}
              className="p-5 rounded-xl bg-slate-50 hover:bg-blue-50/20 border border-borderColor/40 hover:border-blue-500/20 shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-700 text-xs font-bold font-mono">
                      useState
                    </span>
                    <span className="text-xs text-textColor-secondary/60">Atomic updates</span>
                  </div>
                  <BookOpen size={14} className="text-textColor-secondary/40 group-hover:text-blue-500 transition-colors" />
                </div>
                <p className="text-textColor-secondary text-xs leading-relaxed mb-4">
                  Perfect for simple, independent state variables. Best for forms, flags, and UI toggles where updates are direct. Click to view detailed guide.
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
            </div>

            {/* useReducer Notes */}
            <div 
              onClick={() => setActiveModal('useReducer')}
              className="p-5 rounded-xl bg-slate-50 hover:bg-emerald-50/20 border border-borderColor/40 hover:border-emerald-500/20 shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-700 text-xs font-bold font-mono">
                      useReducer
                    </span>
                    <span className="text-xs text-textColor-secondary/60">Transactional updates</span>
                  </div>
                  <BookOpen size={14} className="text-textColor-secondary/40 group-hover:text-emerald-500 transition-colors" />
                </div>
                <p className="text-textColor-secondary text-xs leading-relaxed mb-4">
                  Excels in complex state structures where multiple variables depend on one another, or when state logic is decoupled from UI event handlers. Click to view detailed guide.
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

      <TheoryModal
        isOpen={activeModal === 'useState'}
        onClose={() => setActiveModal(null)}
        title="useState Hook Deep Dive"
        subtitle="Atomic, independent local states in React functional components."
        badge="Atomic State"
        badgeColor="bg-blue-100 text-blue-700"
        content={useStateTheory}
      />

      <TheoryModal
        isOpen={activeModal === 'useReducer'}
        onClose={() => setActiveModal(null)}
        title="useReducer Hook Deep Dive"
        subtitle="Redux-like action/reducer architecture for state transitions."
        badge="Reducer State"
        badgeColor="bg-emerald-100 text-emerald-700"
        content={useReducerTheory}
      />
    </div>
  );
};

export default StateManagementPage;
