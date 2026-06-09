import React, { createContext, useContext, useState } from 'react';
import { User, LogIn, LogOut, CheckCircle, Radio } from 'lucide-react';

// 1. Create the Context
interface AuthContextType {
  user: string | null;
  login: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Create the Provider
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);

  const login = (username: string) => setUser(username);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom Hook for easy consumption
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- Consumers ---

const UserProfile = () => {
  const { user, logout } = useAuth();

  if (!user) return (
    <div className="p-4 bg-slate-50 border border-borderColor/60 rounded-xl text-center">
      <p className="text-xs text-textColor-secondary/40 italic m-0">Awaiting user session...</p>
    </div>
  );

  return (
    <div className="p-5 bg-emerald-500/[0.04] border border-brand-green/20 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-3 w-full">
        <div className="w-10 h-10 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center shrink-0">
          <User size={18} />
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-textColor-secondary/50">Logged In Session</p>
          <p className="text-sm font-semibold text-textColor-primary flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
            {user}
          </p>
        </div>
      </div>
      <button
        onClick={logout}
        className="px-4 py-1.5 bg-brand-red text-white text-xs font-bold rounded-lg hover:bg-red-700 hover:shadow-sm active:scale-95 transition-all w-full md:w-auto flex items-center justify-center gap-1.5"
      >
        <LogOut size={12} /> Logout
      </button>
    </div>
  );
};

const LoginForm = () => {
  const { user, login } = useAuth();
  const [input, setInput] = useState('');

  if (user) return null;

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="relative flex-grow">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter username (e.g. anmol)"
          className="w-full px-4 py-2 border border-borderColor/60 bg-white rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-xs font-semibold"
        />
      </div>
      <button
        onClick={() => {
          if (input.trim()) {
            login(input);
            setInput('');
          }
        }}
        className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0"
      >
        <LogIn size={12} /> Login Session
      </button>
    </div>
  );
};

const MockNavbar = () => {
  const { user } = useAuth();
  return (
    <nav className="bg-slate-950 text-white p-4 rounded-t-xl flex justify-between items-center border-b border-white/[0.08]">
      <span className="font-heading font-extrabold text-xs tracking-wider uppercase flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
        SaaS Dashboard
      </span>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-slate-400 font-medium">
          {user ? `Session: ${user}` : 'No Session'}
        </span>
        <div className={`w-2 h-2 rounded-full ${user ? 'bg-brand-green animate-pulse' : 'bg-slate-700'}`} />
      </div>
    </nav>
  );
};

// --- Consumer visual feedback tracker widget ---
const ActiveConsumers = () => {
  const { user } = useAuth();
  const consumers = [
    { name: 'MockNavbar', desc: 'Displays global session header' },
    { name: 'LoginForm', desc: 'Handles credentials intake' },
    { name: 'UserProfile', desc: 'Renders logged in settings panel' },
  ];
  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-borderColor/60">
      <div className="flex items-center justify-between pb-2 border-b border-borderColor/40 mb-3">
        <h5 className="text-[10px] uppercase font-bold text-textColor-secondary/70 flex items-center gap-1.5 m-0">
          <Radio size={12} className="text-brand-blue" />
          Active Context Consumers (3 listeners)
        </h5>
        <span className="text-[9px] font-bold bg-primary-light text-primary px-1.5 py-0.5 rounded">
          Active Provider
        </span>
      </div>
      <div className="space-y-2">
        {consumers.map((comp) => (
          <div key={comp.name} className="flex justify-between items-center p-2.5 bg-white border border-borderColor/45 rounded-lg shadow-sm">
            <div>
              <p className="text-[11px] font-bold text-textColor-primary">{comp.name}</p>
              <p className="text-[10px] text-textColor-secondary/70 m-0">{comp.desc}</p>
            </div>
            <span className="text-[9px] font-mono font-bold text-brand-green flex items-center gap-1">
              <CheckCircle size={10} /> Listening
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main Demo Component ---
const ContextDemo = () => {
  return (
    <AuthProvider>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* Mock Application Frame */}
        <div className="md:col-span-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-textColor-secondary/70 mb-3">
            Mock Application Shell
          </h4>
          <div className="bg-white rounded-xl shadow-premium border border-borderColor/60 overflow-hidden flex flex-col justify-between min-h-[300px]">
            <MockNavbar />
            <div className="p-5 flex-grow space-y-6">
              <div>
                <h5 className="text-[10px] uppercase font-bold text-textColor-secondary/50 mb-2">Auth Handler</h5>
                <LoginForm />
              </div>
              <div>
                <h5 className="text-[10px] uppercase font-bold text-textColor-secondary/50 mb-2">User Profile Settings</h5>
                <UserProfile />
              </div>
            </div>
            <div className="bg-slate-50 p-4 border-t border-borderColor/40 text-[10px] text-textColor-secondary leading-normal">
              <strong>Architecture Note:</strong> When you login, the state is set inside the Provider. All three components automatically receive the update from Context without passing any props.
            </div>
          </div>
        </div>

        {/* Consumer State Monitor */}
        <div className="md:col-span-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-textColor-secondary/70 mb-3">
            Consumer State Monitor
          </h4>
          <ActiveConsumers />
        </div>

      </div>
    </AuthProvider>
  );
};

export default ContextDemo;
