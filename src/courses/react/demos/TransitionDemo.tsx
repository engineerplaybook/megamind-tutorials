import React, { useState, useTransition } from 'react';
import { ToggleLeft, ToggleRight, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';

const TransitionDemo = () => {
  const [useConcurrent, setUseConcurrent] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [input, setInput] = useState('');
  const [list, setList] = useState<string[]>([]);

  // Large list size to simulate heavy rendering
  const LIST_SIZE = 15000;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (useConcurrent) {
      // Mark state update as non-urgent
      startTransition(() => {
        const l = [];
        for (let i = 0; i < LIST_SIZE; i++) {
          l.push(`${value} Module Item ${i + 1}`);
        }
        setList(l);
      });
    } else {
      // Standard blocking update (runs synchronously)
      const l = [];
      for (let i = 0; i < LIST_SIZE; i++) {
        l.push(`${value} Module Item ${i + 1}`);
      }
      setList(l);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toggle comparison header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 border border-borderColor/60 rounded-xl gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            useConcurrent 
              ? 'bg-brand-green/10 text-brand-green border border-brand-green/20' 
              : 'bg-brand-red/10 text-brand-red border border-brand-red/20'
          }`}>
            {useConcurrent ? <ShieldCheck size={18} /> : <AlertTriangle size={18} />}
          </div>
          <div>
            <p className="text-xs font-bold text-textColor-primary">
              Rendering Mode: {useConcurrent ? 'Concurrent (useTransition)' : 'Synchronous (Blocking)'}
            </p>
            <p className="text-[10px] text-textColor-secondary">
              {useConcurrent 
                ? 'Main thread is interruptible. Input remains responsive.' 
                : 'Main thread is locked during render. Keystrokes will lag.'
              }
            </p>
          </div>
        </div>

        <button 
          onClick={() => {
            setUseConcurrent(!useConcurrent);
            setInput('');
            setList([]);
          }}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
            useConcurrent 
              ? 'bg-primary text-white shadow-sm' 
              : 'bg-white text-textColor-secondary border-borderColor'
          }`}
        >
          {useConcurrent ? (
            <>
              <ToggleRight size={16} /> Concurrent Enabled
            </>
          ) : (
            <>
              <ToggleLeft size={16} /> Concurrent Disabled
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Input Card */}
        <div className="p-6 bg-slate-50 border border-borderColor/65 rounded-2xl h-fit">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-brand-blue" />
            <h3 className="text-base font-heading font-extrabold text-textColor-primary m-0">
              Interactive Input
            </h3>
          </div>
          
          <p className="text-xs text-textColor-secondary mb-4 leading-relaxed">
            Type quickly in the input box. Compare responsiveness. When concurrent mode is disabled, the input lags behind your keystrokes because the browser is rendering {LIST_SIZE.toLocaleString()} list items synchronously.
          </p>

          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-borderColor/60 bg-white rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-semibold"
              placeholder="Type rapidly to test rendering lag..."
            />
            {isPending && (
              <span className="absolute right-3 top-3 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
            )}
          </div>
          
          {isPending && (
            <div className="mt-2.5 text-[11px] text-primary font-bold flex items-center gap-1 animate-pulse">
              <Sparkles size={12} /> React rendering {LIST_SIZE.toLocaleString()} items concurrently...
            </div>
          )}
        </div>

        {/* Heavy List Container */}
        <div className="p-6 bg-slate-900 text-white rounded-2xl border border-white/5 max-h-[350px] overflow-y-auto relative shadow-inner">
          <div className="sticky top-0 bg-slate-900 border-b border-white/10 pb-2 mb-3 flex items-center justify-between z-10">
            <h3 className="text-sm font-mono font-bold text-slate-300 m-0">
              Virtual Log Outputs ({list.length})
            </h3>
            <span className="text-[9px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-400">
              {useConcurrent ? 'CONCURRENT_TREE' : 'SYNC_BLOCKED'}
            </span>
          </div>

          {list.length === 0 ? (
            <div className="py-20 text-center text-xs text-slate-500 italic">
              Type in the left input to generate tree entries
            </div>
          ) : (
            <ul className="space-y-1.5 font-mono text-[11px]">
              {list.slice(0, 100).map((item, index) => (
                <li key={index} className="px-3 py-1.5 rounded bg-white/[0.02] border border-white/5 text-slate-300 hover:text-white transition-colors">
                  <span className="text-slate-600 mr-2 select-none">{String(index + 1).padStart(4, '0')}</span>
                  {item}
                </li>
              ))}
              {list.length > 100 && (
                <li className="text-center text-[10px] text-slate-500 italic py-2 border-t border-white/5 mt-2">
                  ... truncated {list.length - 100} items for performance ...
                </li>
              )}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
};

export default TransitionDemo;
