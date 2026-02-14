import React from 'react';
import { JankSimulator, VirtualList, RenderVisualizer, MemoizationLab } from '@engineerplaybook/design-system';
import '@engineerplaybook/design-system/dist/style.css';

const PlaygroundPage: React.FC = () => {
    return (
        <div className="section">
            <div className="container" style={{ maxWidth: '1000px' }}>
                <div className="text-center mb-20">
                    <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Component Playground</h1>
                    <p className="hero-subtitle text-secondary" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        A collection of interactive performance demonstrations from the <code className="tag">@engineerplaybook/design-system</code> package.
                    </p>
                </div>

                <div className="grid gap-12">
                    {/* Rendering Section */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="card" style={{ borderTop: '4px solid var(--accent-red)' }}>
                            <div className="p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                                        <i className="fas fa-exclamation-triangle"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-primary">Jank Simulator</h3>
                                        <p className="text-sm text-secondary m-0">Simulate Main Thread blocking</p>
                                    </div>
                                </div>
                                <JankSimulator />
                            </div>
                        </div>

                        <div className="card" style={{ borderTop: '4px solid var(--accent-color)' }}>
                            <div className="p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center text-sky-500">
                                        <i className="fas fa-eye"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-primary">Render Visualizer</h3>
                                        <p className="text-sm text-secondary m-0">Visualize React updates</p>
                                    </div>
                                </div>
                                <RenderVisualizer />
                            </div>
                        </div>
                    </div>

                    {/* Optimization Section */}
                    <div>
                        <h2 className="section-title text-left mb-8" style={{ fontSize: '1.75rem' }}>Optimization Techniques</h2>
                        <div className="grid gap-8">
                            <div className="card" style={{ borderLeft: '4px solid var(--accent-green)' }}>
                                <div className="p-8">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 text-xl">
                                            <i className="fas fa-list"></i>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-primary">Virtual List</h3>
                                            <p className="text-secondary m-0">Efficiently render large datasets by only drawing visible items.</p>
                                        </div>
                                    </div>
                                    <VirtualList />
                                </div>
                            </div>

                            <div className="card" style={{ borderLeft: '4px solid var(--accent-gold)' }}>
                                <div className="p-8">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 text-xl">
                                            <i className="fas fa-memory"></i>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-primary">Memoization Lab</h3>
                                            <p className="text-secondary m-0">Compare <code>useMemo</code> vs raw computation costs.</p>
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
