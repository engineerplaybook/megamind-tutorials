import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { tutorials } from '../data/tutorials';
import { 
  Play, BookOpen, Layers, Cpu, Code, Zap, RefreshCw, Compass, ArrowRight, Sparkles 
} from 'lucide-react';

const Catalog: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string>('All');

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    tutorials.forEach(t => t.tags.forEach(tag => tags.add(tag)));
    return ['All', ...Array.from(tags)];
  }, []);

  // Filter tutorials based on selected tag
  const filteredTutorials = useMemo(() => {
    if (selectedTag === 'All') return tutorials;
    return tutorials.filter(t => t.tags.includes(selectedTag));
  }, [selectedTag]);

  // Concept labs configuration
  const conceptLabs = [
    {
      path: '/playground',
      title: 'Performance Playground',
      desc: 'Simulate main-thread blocking jank, test virtual lists, and explore memoization render costs.',
      icon: Cpu,
      color: 'from-amber-500 to-orange-500',
      badge: 'Interactive Lab'
    },
    {
      path: '/state',
      title: 'State Management',
      desc: 'Compare atomic useState vs transactional useReducer using an interactive Shopping Cart.',
      icon: Layers,
      color: 'from-blue-500 to-indigo-500',
      badge: 'React Hooks'
    },
    {
      path: '/effect',
      title: 'Side Effects (useEffect)',
      desc: 'Learn cleanup mechanics and window tracking with dynamic mount/unmount simulation.',
      icon: RefreshCw,
      color: 'from-emerald-500 to-teal-500',
      badge: 'Lifecycle'
    },
    {
      path: '/transition',
      title: 'Transitions (Concurrency)',
      desc: 'Optimize heavy renders and inputs using concurrent useTransition rendering.',
      icon: Zap,
      color: 'from-purple-500 to-fuchsia-500',
      badge: 'Performance'
    },
    {
      path: '/context',
      title: 'Context API',
      desc: 'Teleport state across nested components without prop-drilling in a mock auth system.',
      icon: Code,
      color: 'from-pink-500 to-rose-500',
      badge: 'State Sharing'
    },
    {
      path: '/showcase',
      title: 'UI Component Showcase',
      desc: 'Browse design patterns and basic elements like Carousels, Dropdowns, and Accordions.',
      icon: Compass,
      color: 'from-cyan-500 to-sky-500',
      badge: 'UI Gallery'
    }
  ];

  return (
    <div className="min-h-screen bg-bgdefault py-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Animated Hero Banner */}
        <div className="relative rounded-3xl bg-slate-950 text-white overflow-hidden p-8 md:p-16 mb-16 border border-white/[0.08] shadow-2xl">
          {/* Accent Glow Backdrops */}
          <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-20 left-1/3 w-[300px] h-[300px] bg-brand-green/10 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-primary-light text-xs font-semibold tracking-wide uppercase mb-6 shadow-sm">
              <Sparkles size={12} className="text-brand-gold" />
              <span>Interactive Learning</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-heading font-extrabold tracking-tight leading-tight mb-6 bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Engineer Playbook <br />
              <span className="bg-gradient-to-r from-brand-blue via-indigo-300 to-brand-green bg-clip-text text-transparent">
                Tutorials Library
              </span>
            </h1>
            
            <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-0">
              Deep dives into React execution, performance profiling, and modern web tooling. 
              Select a module or lab below to start learning.
            </p>
          </div>
        </div>

        {/* Section 1: Main Tutorial Projects */}
        <div className="mb-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h2 className="text-2xl font-heading font-extrabold text-textColor-primary flex items-center gap-2">
                <BookOpen size={22} className="text-brand-blue" />
                Featured Modules
              </h2>
              <p className="text-textColor-secondary text-sm">Comprehensive multi-step interactive courses.</p>
            </div>

            {/* Filter Tags */}
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                    selectedTag === tag
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white text-textColor-secondary border border-borderColor/60 hover:bg-slate-50 hover:text-primary'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTutorials.map((tutorial) => (
              <Link 
                key={tutorial.slug} 
                to={`/topic/${tutorial.slug}`}
                className="group bg-white rounded-2xl border border-borderColor/60 overflow-hidden shadow-premium hover:shadow-premium-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col premium-card-gradient"
              >
                {/* Visual Thumbnail Frame */}
                <div className="relative h-48 bg-slate-900 overflow-hidden flex items-center justify-center border-b border-borderColor/40">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-emerald-950/30 opacity-70 group-hover:scale-105 transition-transform duration-500" />
                  
                  {/* Decorative terminal outline */}
                  <div className="absolute w-[85%] h-[70%] border border-white/10 rounded-lg bg-black/60 backdrop-blur-sm p-3 flex flex-col font-mono text-[10px] text-slate-500 shadow-xl">
                    <div className="flex items-center gap-1.5 mb-2 border-b border-white/5 pb-1">
                      <div className="w-2 h-2 rounded-full bg-brand-red/70" />
                      <div className="w-2 h-2 rounded-full bg-brand-gold/70" />
                      <div className="w-2 h-2 rounded-full bg-brand-green/70" />
                      <span className="text-[8px] text-slate-600 ml-auto">claude-code</span>
                    </div>
                    <span className="text-brand-blue">&gt; claude run tutorial</span>
                    <span className="text-brand-green mt-1">✓ Initializing Claude Code agent...</span>
                    <span className="text-slate-400">✓ Loading workspace files</span>
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 backdrop-blur-[2px] transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300">
                      <Play size={20} fill="currentColor" className="ml-1" />
                    </div>
                  </div>
                </div>

                {/* Content details */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {tutorial.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold tracking-wider uppercase bg-primary-light text-primary px-2.5 py-0.5 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-lg font-heading font-extrabold text-textColor-primary group-hover:text-primary transition-colors duration-200 mb-2 leading-snug">
                    {tutorial.title}
                  </h3>

                  <p className="text-textColor-secondary text-xs leading-relaxed mb-6 flex-grow">
                    {tutorial.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-borderColor/40 flex items-center justify-between text-xs font-bold text-primary">
                    <span>Start Module</span>
                    <ArrowRight size={14} className="transform group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}

            {filteredTutorials.length === 0 && (
              <div className="col-span-full py-16 text-center text-textColor-secondary bg-white rounded-2xl border border-borderColor/50">
                <p className="italic text-sm">No tutorials found matching the selected category.</p>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Interactive Hook & Performance Labs */}
        <div>
          <div className="mb-8">
            <h2 className="text-2xl font-heading font-extrabold text-textColor-primary flex items-center gap-2">
              <Cpu size={22} className="text-brand-green" />
              Interactive Concept Labs
            </h2>
            <p className="text-textColor-secondary text-sm">Hands-on micro-environments to dissect specific concepts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conceptLabs.map((lab) => {
              const IconComp = lab.icon;
              return (
                <Link 
                  key={lab.path} 
                  to={lab.path}
                  className="group bg-white rounded-2xl border border-borderColor/60 p-6 shadow-premium hover:shadow-premium-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${lab.color} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
                      <IconComp size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-textColor-secondary/60 bg-bgdefault border border-borderColor/40 px-2 py-0.5 rounded">
                      {lab.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-heading font-bold text-textColor-primary group-hover:text-primary transition-colors duration-200 mb-2">
                    {lab.title}
                  </h3>

                  <p className="text-textColor-secondary text-xs leading-relaxed mb-6 flex-grow">
                    {lab.desc}
                  </p>

                  <div className="mt-auto flex items-center justify-between text-xs font-bold text-textColor-secondary/80 group-hover:text-primary transition-colors">
                    <span>Open Lab</span>
                    <ArrowRight size={14} className="transform group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Catalog;
