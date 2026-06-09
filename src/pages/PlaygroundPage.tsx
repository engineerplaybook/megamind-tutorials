import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cpu, ShieldAlert, Eye, List, Milestone } from 'lucide-react';
import { JankSimulator, VirtualList, RenderVisualizer, MemoizationLab } from '@engineerplaybook/design-system';
import '@engineerplaybook/design-system/dist/style.css';

const PlaygroundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-bgdefault py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm text-textColor-secondary hover:text-primary transition-colors duration-200 mb-6 group"
        >
          <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
          Back to Catalog
        </Link>

        {/* Title */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary">
              <Cpu size={20} />
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-textColor-primary leading-tight">
            Component Playground
          </h1>
          <p className="text-textColor-secondary text-sm md:text-base mt-2">
            Inspect frontend rendering bottlenecks and optimization techniques in a live performance sandbox.
          </p>
        </div>

        <div className="space-y-12">
          {/* Rendering Issues Section */}
          <div>
            <h2 className="text-xl font-heading font-extrabold text-textColor-primary mb-6 flex items-center gap-2">
              <ShieldAlert size={18} className="text-brand-red animate-pulse" />
              1. Rendering Performance Bottlenecks
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Jank Simulator Card */}
              <div className="bg-white rounded-2xl border border-borderColor/60 shadow-premium overflow-hidden border-t-4 border-t-brand-red">
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center text-brand-red">
                      <ShieldAlert size={18} />
                    </div>
                    <div>
                      <h3 className="text-base font-heading font-extrabold text-textColor-primary">Jank Simulator</h3>
                      <p className="text-[11px] text-textColor-secondary">Simulate Main Thread blocking work</p>
                    </div>
                  </div>
                  <JankSimulator />
                </div>
              </div>

              {/* Render Visualizer Card */}
              <div className="bg-white rounded-2xl border border-borderColor/60 shadow-premium overflow-hidden border-t-4 border-t-brand-blue">
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue">
                      <Eye size={18} />
                    </div>
                    <div>
                      <h3 className="text-base font-heading font-extrabold text-textColor-primary">Render Visualizer</h3>
                      <p className="text-[11px] text-textColor-secondary">Visualize React update batches</p>
                    </div>
                  </div>
                  <RenderVisualizer />
                </div>
              </div>

            </div>
          </div>

          {/* Optimization Section */}
          <div>
            <h2 className="text-xl font-heading font-extrabold text-textColor-primary mb-6 flex items-center gap-2">
              <Milestone size={18} className="text-brand-green" />
              2. Optimization Solutions
            </h2>
            <div className="space-y-8">
              
              {/* Virtual List Card */}
              <div className="bg-white rounded-2xl border border-borderColor/60 shadow-premium overflow-hidden border-l-4 border-l-brand-green">
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-brand-green/10 border border-brand-green/20 flex items-center justify-center text-brand-green">
                      <List size={22} />
                    </div>
                    <div>
                      <h3 className="text-lg font-heading font-extrabold text-textColor-primary">Virtual List</h3>
                      <p className="text-xs text-textColor-secondary">Efficiently render massive datasets by drawing only what fits on screen.</p>
                    </div>
                  </div>
                  <VirtualList />
                </div>
              </div>

              {/* Memoization Lab Card */}
              <div className="bg-white rounded-2xl border border-borderColor/60 shadow-premium overflow-hidden border-l-4 border-l-brand-gold">
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold">
                      <Cpu size={22} />
                    </div>
                    <div>
                      <h3 className="text-lg font-heading font-extrabold text-textColor-primary">Memoization Lab</h3>
                      <p className="text-xs text-textColor-secondary">Compare caching with useMemo vs running calculations repeatedly.</p>
                    </div>
                  </div>
                  <MemoizationLab />
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PlaygroundPage;
