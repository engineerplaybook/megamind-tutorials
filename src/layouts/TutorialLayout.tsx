import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, PlayCircle, BookOpen, Terminal, CheckCircle } from 'lucide-react';

interface TutorialLayoutProps {
  title: string;
  videoId?: string;
  children: React.ReactNode;
}

const TutorialLayout: React.FC<TutorialLayoutProps> = ({ title, videoId, children }) => {
  return (
    <div className="min-h-screen bg-bgdefault flex flex-col">
      {/* Top Section: Video Player & Context */}
      <div className="bg-slate-950 text-white w-full border-b border-white/[0.08] relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 left-10 w-[300px] h-[300px] bg-brand-green/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
          {/* Breadcrumb / Back button */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-textColor-secondary hover:text-white transition-colors duration-200 mb-6 group"
          >
            <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
            Back to Tutorials Library
          </Link>

          <h1 className="text-3xl md:text-4xl font-heading font-extrabold tracking-tight mb-8 bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            {title}
          </h1>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Video Area */}
            <div className="lg:col-span-2">
              <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative group">
                {videoId ? (
                  <iframe 
                    src={`https://www.youtube.com/embed/${videoId}`} 
                    title={title}
                    className="w-full h-full absolute inset-0"
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-500 gap-4">
                    <div className="w-16 h-16 rounded-full bg-slate-800/80 border border-white/5 flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform duration-300">
                      <PlayCircle size={32} />
                    </div>
                    <span className="text-sm font-semibold tracking-wide uppercase text-slate-400">
                      Interactive Tutorial Workspace
                    </span>
                    <span className="text-xs text-slate-500">Video tutorial coming soon</span>
                  </div>
                )}
              </div>
            </div>

            {/* Info / Quick Links */}
            <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-heading font-bold mb-3 text-primary-light flex items-center gap-2">
                  <BookOpen size={18} className="text-brand-blue" />
                  About this Lesson
                </h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Watch the concept walk-through on the left, then jump into the **Interactive Playground** below to test and visualize the behavior directly in your browser.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl text-sm text-slate-300">
                  <span className="w-8 h-8 rounded-lg bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue">
                    <Terminal size={16} />
                  </span>
                  <div>
                    <p className="font-semibold text-xs text-white">Interactive Demo</p>
                    <p className="text-[11px] text-slate-400">Play with parameters below</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl text-sm text-slate-300">
                  <span className="w-8 h-8 rounded-lg bg-brand-green/10 border border-brand-green/20 flex items-center justify-center text-brand-green">
                    <CheckCircle size={16} />
                  </span>
                  <div>
                    <p className="font-semibold text-xs text-white">Full Playbook Guide</p>
                    <p className="text-[11px] text-slate-400">Read step-by-step notes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Interactive Playground (The Feature) */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl shadow-premium border border-borderColor/50 p-8 min-h-[500px]">
          <div className="mb-8 border-b border-borderColor/60 pb-5 flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-heading font-bold text-textColor-primary flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary">
                <Terminal size={20} />
              </span>
              Interactive Playground
            </h2>
            <span className="text-xs font-semibold text-brand-green bg-brand-green/10 border border-brand-green/20 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
              Sandbox Environment
            </span>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
};

export default TutorialLayout;
