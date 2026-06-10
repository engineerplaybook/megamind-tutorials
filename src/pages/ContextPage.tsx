import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Code, HelpCircle, AlertTriangle, BookOpen } from 'lucide-react';
import ContextDemo from '../concepts/demos/ContextDemo';
import { TheoryModal } from '../components/ui/TheoryModal';

const ContextPage: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'drilling' | 'provider' | 'perf' | null>(null);

  const drillingTheory = (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-textColor-secondary">
        <h4 className="text-xs font-bold text-textColor-primary mb-1 uppercase tracking-wider">The Prop Drilling Issue</h4>
        <p>
          Prop drilling occurs when you have to pass data through multiple layers of intermediate components in order to reach a deeply nested consumer component.
        </p>
      </div>
      <div>
        <h5 className="font-bold text-textColor-primary mb-1">Why Prop Drilling is Detrimental</h5>
        <ul className="list-disc pl-5 space-y-1.5 text-textColor-secondary">
          <li><strong>Brittle Contracts:</strong> If you rename a prop, you must manually rename it in 5 different files down the tree.</li>
          <li><strong>Bloated Intermediaries:</strong> Intermediate components are forced to declare props they don't use, solely to pass them down.</li>
          <li><strong>Poor Component Reusability:</strong> Makes intermediate components tightly coupled to global context.</li>
        </ul>
      </div>
      <div>
        <h5 className="font-bold text-textColor-primary mb-1 font-mono">Example of Drilled Props</h5>
        <pre className="p-3 bg-slate-950 text-rose-300 rounded-xl font-mono text-[10px] leading-relaxed">
{`function App() {
  const [theme, setTheme] = useState('dark');
  return <Layout theme={theme} />; // Drilling Level 1
}

function Layout({ theme }) {
  return <Sidebar theme={theme} />; // Drilling Level 2
}

function Sidebar({ theme }) {
  return <MenuLink theme={theme} />; // Drilling Level 3 (Final Destination)
}`}
        </pre>
      </div>
    </div>
  );

  const providerTheory = (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-pink-50 border border-pink-100 text-textColor-secondary">
        <h4 className="text-xs font-bold text-textColor-primary mb-1 uppercase tracking-wider">The Provider Pattern</h4>
        <p>
          React Context provides a way to pass data down the component tree without having to pass props manually at every level. It uses a Provider-Consumer interface.
        </p>
      </div>
      <div>
        <h5 className="font-bold text-textColor-primary mb-1">How Context Works</h5>
        <ul className="list-disc pl-5 space-y-1 text-textColor-secondary">
          <li><strong>1. Creation:</strong> Create context using `createContext(defaultValue)`.</li>
          <li><strong>2. Provision:</strong> Wrap subtrees with <code>&lt;Context.Provider value={'{...}'}&gt;</code> to feed values to the tree.</li>
          <li><strong>3. Consumption:</strong> Subscribing children consume the value using the `useContext(Context)` hook.</li>
        </ul>
      </div>
      <div>
        <h5 className="font-bold text-textColor-primary mb-1">Standard Provider Code Setup</h5>
        <pre className="p-3 bg-slate-950 text-pink-300 rounded-xl font-mono text-[10px] leading-relaxed">
{`// 1. Create context
export const UserContext = createContext(null);

// 2. Wrap tree in Provider
export function App() {
  return (
    <UserContext.Provider value={{ name: 'Anmol' }}>
      <Dashboard />
    </UserContext.Provider>
  );
}

// 3. Consume context anywhere in sub-tree
function UserProfile() {
  const user = useContext(UserContext);
  return <h1>{user.name}</h1>;
}`}
        </pre>
      </div>
    </div>
  );

  const perfTheory = (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-textColor-secondary">
        <h4 className="text-xs font-bold text-textColor-primary mb-1 uppercase tracking-wider">Context Re-rendering Gotchas</h4>
        <p>
          Every component that consumes context (via `useContext`) will re-render whenever the Provider's `value` changes. This happens even if the component only uses a part of the value that didn't change!
        </p>
      </div>
      <div>
        <h5 className="font-bold text-textColor-primary mb-1">Mitigation & Optimization Strategies</h5>
        <ul className="space-y-3 text-textColor-secondary">
          <li>
            <strong className="text-textColor-primary">1. Split Contexts:</strong>
            <p className="pl-4">Keep state and updater functions in separate providers (e.g. `ThemeStateContext` and `ThemeDispatchContext`) so components that only trigger actions never re-render when state changes.</p>
          </li>
          <li>
            <strong className="text-textColor-primary">2. Memoize Context Value:</strong>
            <p className="pl-4">Use `useMemo` to construct the provider value so that reference identities remain identical unless actual parameters change.</p>
          </li>
          <li>
            <strong className="text-textColor-primary">3. Atomic State Management:</strong>
            <p className="pl-4">For fast-updating global state (e.g. cursor positions, scroll coordinates), use atomic state libraries like Zustand or Recoil instead of Context.</p>
          </li>
        </ul>
      </div>
      <div>
        <h5 className="font-bold text-textColor-primary mb-1">Memoized Context Value Example</h5>
        <pre className="p-3 bg-slate-950 text-amber-300 rounded-xl font-mono text-[10px] leading-relaxed">
{`const contextValue = useMemo(() => ({
  user,
  login
}), [user]); // Only recreates value reference when user object changes

return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;`}
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
            <div 
              onClick={() => setActiveModal('drilling')}
              className="p-5 rounded-xl bg-slate-50 hover:bg-rose-50/20 border border-borderColor/40 hover:border-rose-500/20 shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-rose-100 text-rose-700 text-xs font-bold font-mono">
                      Prop Drilling
                    </span>
                    <span className="text-xs text-textColor-secondary/60">Problem</span>
                  </div>
                  <BookOpen size={14} className="text-textColor-secondary/40 group-hover:text-rose-500 transition-colors" />
                </div>
                <p className="text-textColor-secondary text-xs leading-relaxed mb-4">
                  Passing props through many intermediate levels of components just to reach a deeply nested child is tedious, brittle, and introduces unnecessary code coupling. Click to view guide.
                </p>
              </div>
            </div>

            {/* When to use Context */}
            <div 
              onClick={() => setActiveModal('provider')}
              className="p-5 rounded-xl bg-slate-50 hover:bg-pink-50/20 border border-borderColor/40 hover:border-pink-500/20 shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-pink-100 text-pink-700 text-xs font-bold font-mono">
                      Provider Pattern
                    </span>
                    <span className="text-xs text-textColor-secondary/60">Solution</span>
                  </div>
                  <BookOpen size={14} className="text-textColor-secondary/40 group-hover:text-pink-500 transition-colors" />
                </div>
                <p className="text-textColor-secondary text-xs leading-relaxed mb-4">
                  Context lets you "teleport" values directly from a top-level provider component to any child component in the tree, bypassing intermediate components completely. Click to view setup details.
                </p>
              </div>
            </div>
          </div>

          {/* Performance warning callout */}
          <div 
            onClick={() => setActiveModal('perf')}
            className="mt-6 p-4 rounded-xl bg-amber-50 hover:bg-amber-50/80 border border-amber-200/60 hover:border-amber-400/40 shadow-sm transition-all cursor-pointer flex gap-3 group"
          >
            <AlertTriangle size={18} className="text-brand-gold shrink-0 mt-0.5" />
            <div className="flex-grow">
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold text-textColor-primary">Performance Gotcha: Re-rendering</p>
                <span className="inline-flex items-center gap-1 text-[10px] text-textColor-secondary/50 font-bold uppercase group-hover:text-brand-gold transition-colors">
                  <BookOpen size={10} /> Read Guide
                </span>
              </div>
              <p className="text-[11px] text-textColor-secondary mt-1 leading-normal">
                Every component that consumes the context will re-render whenever the provider's value object changes. Avoid using context for high-frequency state updates (e.g. cursor positions, keystrokes). Click for optimization techniques.
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

      <TheoryModal
        isOpen={activeModal === 'drilling'}
        onClose={() => setActiveModal(null)}
        title="Prop Drilling Issues"
        subtitle="Understanding coupling and maintenance overhead in deep UI trees."
        badge="Prop Drilling"
        badgeColor="bg-rose-100 text-rose-700"
        content={drillingTheory}
      />

      <TheoryModal
        isOpen={activeModal === 'provider'}
        onClose={() => setActiveModal(null)}
        title="The Context Provider Pattern"
        subtitle="Decoupled state sharing down the react virtual DOM tree."
        badge="Provider Pattern"
        badgeColor="bg-pink-100 text-pink-700"
        content={providerTheory}
      />

      <TheoryModal
        isOpen={activeModal === 'perf'}
        onClose={() => setActiveModal(null)}
        title="Context Performance & Optimization"
        subtitle="Strategies to bypass redundant re-renders on context consumers."
        badge="Performance Gotchas"
        badgeColor="bg-amber-100 text-amber-700"
        content={perfTheory}
      />
    </div>
  );
};

export default ContextPage;
