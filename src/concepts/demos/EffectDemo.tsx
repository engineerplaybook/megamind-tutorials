import { useState, useEffect } from 'react';
import { User, Monitor, ToggleLeft, ToggleRight, ListCollapse } from 'lucide-react';

// --- Global Lifecycle Logger to demonstrate side effects ---
interface LogEntry {
  id: number;
  message: string;
  type: 'mount' | 'cleanup' | 'effect';
  time: string;
}

// --- Example 1: Data Fetching ---
const UserFetcher = ({ onLog }: { onLog: (msg: string, type: 'mount' | 'cleanup' | 'effect') => void }) => {
  const [userId, setUserId] = useState(1);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    onLog(`useEffect TRIGGERED: Fetching data for User ID ${userId}`, 'effect');
    
    // Simulate API call
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!ignore) {
        setData({ 
          id: userId, 
          name: userId === 1 ? 'Alice Vance' : userId === 2 ? 'Bob Miller' : 'Charlie Stone',
          role: userId === 1 ? 'Administrator' : userId === 2 ? 'Security Engineer' : 'Developer Specialist',
          email: userId === 1 ? 'alice@playbook.io' : userId === 2 ? 'bob@playbook.io' : 'charlie@playbook.io'
        });
        setLoading(false);
        onLog(`useEffect RESOLVED: Loaded user data for ID ${userId}`, 'effect');
      }
    };

    fetchData();

    return () => {
      ignore = true;
      onLog(`useEffect CLEANUP: Cancelled pending fetch for User ID ${userId}`, 'cleanup');
    };
  }, [userId]); // Re-run when userId changes

  return (
    <div className="p-6 rounded-2xl bg-slate-50 border border-borderColor/60 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-brand-blue" />
        <h3 className="text-base font-heading font-extrabold text-textColor-primary m-0">
          useEffect Lab: Data Syncer
        </h3>
      </div>
      
      <p className="text-xs text-textColor-secondary mb-4 leading-relaxed">
        Select a user profile. Changing the dependency <code className="bg-white border border-borderColor/60">userId</code> triggers a new side effect, cleaning up the previous unresolved request first.
      </p>

      <div className="flex gap-2 mb-5">
        {[1, 2, 3].map(id => (
          <button
            key={id}
            onClick={() => setUserId(id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              userId === id 
                ? 'bg-primary text-white shadow-md' 
                : 'bg-white text-textColor-secondary border border-borderColor/65 hover:bg-slate-50 hover:text-primary'
            }`}
          >
            User #{id}
          </button>
        ))}
      </div>
      
      <div className="bg-white p-5 rounded-xl border border-borderColor/40 shadow-sm min-h-[140px] flex items-center justify-center relative overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-borderColor border-t-primary"></div>
            <span className="text-[11px] font-bold text-textColor-secondary/60 animate-pulse">Syncing Database...</span>
          </div>
        ) : (
          <div className="w-full flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-primary shrink-0">
              <User size={20} />
            </div>
            <div className="w-full">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4">
                <div>
                  <p className="text-[10px] uppercase font-bold text-textColor-secondary/50">Full Name</p>
                  <p className="text-sm font-semibold text-textColor-primary">{data?.name}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-textColor-secondary/50">Role</p>
                  <p className="text-sm font-semibold text-textColor-primary">{data?.role}</p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="text-[10px] uppercase font-bold text-textColor-secondary/50">Email Address</p>
                  <p className="text-sm font-semibold text-textColor-primary font-mono text-xs mt-0.5">{data?.email}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Example 2: Event Listeners & Cleanup ---
const WindowTracker = ({ onLog }: { onLog: (msg: string, type: 'mount' | 'cleanup' | 'effect') => void }) => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    onLog("useEffect TRIGGERED (WindowTracker MOUNT): window.addEventListener('resize')", "mount");
    
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      onLog("useEffect CLEANUP (WindowTracker UNMOUNT): window.removeEventListener('resize')", "cleanup");
    };
  }, []); // Empty array = run once on mount

  return (
    <div className="p-6 rounded-2xl bg-slate-50 border border-borderColor/60">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-brand-green" />
        <h3 className="text-base font-heading font-extrabold text-textColor-primary m-0">
          useEffect Lab: Event Listener
        </h3>
      </div>
      
      <p className="text-xs text-textColor-secondary mb-5 leading-relaxed">
        This tracker is subscribed to window dimensions. Resize your browser window. Note that the event listener is bound only once on mount.
      </p>

      <div className="bg-white p-5 rounded-xl border border-borderColor/40 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-green/10 border border-brand-green/20 flex items-center justify-center text-brand-green">
            <Monitor size={18} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-textColor-secondary/50">Event State</p>
            <p className="text-xs font-semibold text-brand-green flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-ping" />
              Listening to Resize
            </p>
          </div>
        </div>
        
        <span className="text-3xl font-mono font-extrabold text-textColor-primary">
          {width}px
        </span>
      </div>
    </div>
  );
};

// --- Main Demo wrapper with real-time logging terminal ---
const EffectDemo = () => {
  const [showTracker, setShowTracker] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = (message: string, type: 'mount' | 'cleanup' | 'effect') => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [
      { id: Date.now() + Math.random(), message, type, time },
      ...prev.slice(0, 19) // Keep last 20 logs
    ]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Interactive Labs Columns */}
      <div className="lg:col-span-3 space-y-4">
        <UserFetcher onLog={addLog} />
        
        <div className="p-6 rounded-2xl bg-slate-50 border border-borderColor/60">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-gold" />
              <h4 className="text-base font-heading font-extrabold text-textColor-primary m-0">
                Cleanup Simulation
              </h4>
            </div>
            
            <button 
              onClick={() => {
                const state = !showTracker;
                setShowTracker(state);
                addLog(state ? 'WindowTracker mounted' : 'WindowTracker unmounted', 'effect');
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                showTracker 
                  ? 'bg-textColor-primary text-white hover:bg-slate-800' 
                  : 'bg-white text-primary border-primary/20 hover:bg-primary-light/30'
              }`}
            >
              {showTracker ? (
                <>
                  <ToggleRight size={16} /> Unmount Tracker
                </>
              ) : (
                <>
                  <ToggleLeft size={16} /> Mount Tracker
                </>
              )}
            </button>
          </div>
          
          {showTracker ? (
            <WindowTracker onLog={addLog} />
          ) : (
            <div className="border border-dashed border-borderColor/60 rounded-xl p-8 text-center text-textColor-secondary/40 italic text-xs">
              WindowTracker is currently destroyed. The event listener has been clean-purged from the browser process.
            </div>
          )}
        </div>
      </div>

      {/* Terminal Log Console */}
      <div className="lg:col-span-2 flex flex-col bg-slate-950 rounded-2xl border border-white/[0.08] p-5 shadow-2xl h-[450px] lg:sticky lg:top-24">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4 shrink-0">
          <h4 className="text-xs font-mono font-bold text-white flex items-center gap-2">
            <ListCollapse size={14} className="text-primary-light" />
            Hook Lifecycle Terminal
          </h4>
          <button 
            onClick={() => setLogs([])}
            className="text-[10px] font-mono text-slate-500 hover:text-white px-2 py-0.5 rounded border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-colors"
          >
            Clear
          </button>
        </div>

        <div className="flex-grow overflow-y-auto font-mono text-[10px] space-y-2.5 pr-1">
          {logs.map((log) => (
            <div key={log.id} className="flex gap-2 items-start leading-relaxed animate-fade-in-up">
              <span className="text-slate-600 select-none shrink-0">[{log.time}]</span>
              <span className={`shrink-0 font-bold uppercase text-[8px] px-1 py-0.5 rounded-md ${
                log.type === 'mount' 
                  ? 'bg-brand-green/20 text-brand-green border border-brand-green/10' 
                  : log.type === 'cleanup' 
                  ? 'bg-brand-red/20 text-brand-red border border-brand-red/10' 
                  : 'bg-brand-blue/20 text-brand-blue border border-brand-blue/10'
              }`}>
                {log.type}
              </span>
              <span className="text-slate-300 break-words">{log.message}</span>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 italic gap-2 py-20">
              <span>Terminal awaiting hook triggers...</span>
              <span className="text-[9px] uppercase font-bold text-slate-700 font-sans tracking-widest">Awaiting interaction</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EffectDemo;
