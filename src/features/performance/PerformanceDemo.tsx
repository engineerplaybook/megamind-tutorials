import React, { useEffect } from 'react';
import { JankSimulator, VirtualList, RenderVisualizer, MemoizationLab } from '@engineerplaybook/design-system';
import '@engineerplaybook/design-system/dist/style.css';

const PerformanceDemo: React.FC = () => {
    // Debug Log
    useEffect(() => {
        console.log("PerformanceDemo Mounted - Refactored v3");
    }, []);

    return (
        <div className="section">
            <div className="container">
                {/* 0. INTRO */}
                <div className="text-center mb-16">
                    <div className="flex justify-center mb-4">
                        <span className="tag">
                            ENGINEER PLAYBOOK · EPISODE 1
                        </span>
                    </div>
                    <h1 className="hero-title">
                        Poor Frontend Performance?<br />
                        <span className="text-accent">It's Not a React Problem!</span>
                    </h1>
                    <p className="hero-subtitle">
                        Why your app feels slow, why "renders" aren't the enemy, and how to actually fix it.
                    </p>
                </div>

                {/* 1. THE BIG LIE */}
                <RenderVisualizer />

                {/* 2. THE REAL CULPRIT */}
                <JankSimulator />

                {/* 3. MEASURE BEFORE OPTIMIZE */}
                {/* 3. MEASURE BEFORE OPTIMIZE */}
                <section className="my-20">
                    <h2 className="section-title mb-12">Measure First, Optimize Second</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                         <div className="card" style={{ borderTop: '4px solid var(--accent-color)' }}>
                            <div className="p-8">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center text-sky-500">
                                        <i className="fas fa-chart-line"></i>
                                    </div>
                                    Browser Tools
                                </h3>
                                <ul className="space-y-6">
                                    <li className="flex items-start gap-4">
                                        <i className="fab fa-chrome text-xl text-secondary mt-1"></i>
                                        <div>
                                            <strong className="block text-primary">Chrome Performance Tab</strong>
                                            <span className="text-secondary text-sm">Visualize the Main Thread & rendering tasks.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <i className="fab fa-react text-xl text-secondary mt-1"></i>
                                        <div>
                                            <strong className="block text-primary">React Profiler</strong>
                                            <span className="text-secondary text-sm">See which components rendered and why.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <i className="fas fa-lighthouse text-xl text-secondary mt-1"></i>
                                        <div>
                                            <strong className="block text-primary">Lighthouse != UX</strong>
                                            <span className="text-secondary text-sm">Scores help, but <strong>INP</strong> (Interaction to Next Paint) matters more.</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                         </div>

                         <div className="card">
                            <div className="p-8">
                                <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                                        <i className="fas fa-balance-scale"></i>
                                    </div>
                                    Performance Budgets
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between text-sm font-bold mb-2">
                                            <span>JS Bundle Size</span>
                                            <span className="text-success">&lt; 100 KB</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 w-1/3"></div>
                                        </div>
                                    </div>
                                     <div>
                                        <div className="flex justify-between text-sm font-bold mb-2">
                                            <span>Main Thread Task</span>
                                            <span className="text-amber-500">&lt; 50 ms</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-400 w-1/2"></div>
                                        </div>
                                    </div>
                                     <div>
                                        <div className="flex justify-between text-sm font-bold mb-2">
                                            <span>INP (Responsiveness)</span>
                                            <span className="text-sky-500">&lt; 200 ms</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-sky-500 w-2/3"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                         </div>
                    </div>
                </section>

                 {/* 4. STRATEGIES */}
                <section className="mb-20">
                    <h3 className="section-title mb-12">Optimization Strategies</h3>
                    
                    <div className="space-y-12">
                        {/* Strategy 1: Delete Code */}
                        <div className="card">
                            <div className="p-8">
                                <div className="grid md:grid-cols-[280px_1fr] gap-12">
                                    <div>
                                        <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 text-2xl">
                                            <i className="fas fa-trash-alt"></i>
                                        </div>
                                        <h4 className="text-2xl font-bold text-primary mb-2">1. Delete Code</h4>
                                        <p className="text-secondary leading-relaxed">The fastest code is the code you never ship. Aggressively remove unused logic.</p>
                                    </div>
                                    
                                    <div className="grid sm:grid-cols-2 gap-6 content-center">
                                        <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                                            <strong className="block text-primary mb-1">Remove Dead Code</strong>
                                            <span className="text-sm text-secondary">Use coverage tools. If it doesn't run, kill it.</span>
                                        </div>
                                        <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                                            <strong className="block text-primary mb-1">Lazy Load</strong>
                                            <span className="text-sm text-secondary">Don't load the Settings page until the user clicks Settings.</span>
                                        </div>
                                        <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 sm:col-span-2">
                                            <strong className="block text-primary mb-1">Browser APIs</strong>
                                            <span className="text-sm text-secondary">Use `IntersectionObserver` instead of heavy scroll libraries.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Strategy 2: Reduce > Cache (Virtualization) */}
                        <div className="card overflow-hidden">
                            <div className="p-8 border-b border-gray-100">
                                <div className="flex items-center gap-4">
                                     <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xl">
                                        <i className="fas fa-layer-group"></i>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-primary">2. Virtualization</h4>
                                        <p className="text-secondary text-sm">Render only what is visible.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50/50 p-8">
                                 <VirtualList />
                            </div>
                        </div>

                        {/* Strategy 3: Network */}
                        <div className="card">
                            <div className="p-8">
                                <div className="grid md:grid-cols-[280px_1fr] gap-12">
                                    <div>
                                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 text-2xl">
                                            <i className="fas fa-network-wired"></i>
                                        </div>
                                        <h4 className="text-2xl font-bold text-primary mb-2">3. Network Strategy</h4>
                                        <p className="text-secondary leading-relaxed">Avoid Waterfalls. Parallelize requests to maximize bandwidth.</p>
                                    </div>
                                    <div className="space-y-6 content-center">
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center gap-4">
                                                <div className="w-24 text-xs font-bold text-danger text-right">Waterfall</div>
                                                <div className="flex-1 flex gap-1">
                                                    <div className="h-2 w-1/3 bg-red-400 rounded"></div>
                                                    <div className="h-2 w-1/4 bg-red-400 rounded opacity-50"></div>
                                                    <div className="h-2 w-1/3 bg-red-400 rounded opacity-25"></div>
                                                </div>
                                                <div className="text-xs text-secondary font-mono">3s Total</div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-24 text-xs font-bold text-success text-right">Parallel</div>
                                                <div className="flex-1 relative h-6">
                                                     <div className="absolute top-0 left-0 h-2 w-1/3 bg-emerald-500 rounded"></div>
                                                     <div className="absolute top-2 left-0 h-2 w-1/4 bg-emerald-500 rounded opacity-70"></div>
                                                     <div className="absolute top-4 left-0 h-2 w-1/3 bg-emerald-500 rounded opacity-40"></div>
                                                </div>
                                                <div className="text-xs text-secondary font-mono">1s Total</div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-secondary bg-gray-50 p-4 rounded-lg border border-gray-100">
                                            Fetching data <strong>parallelly</strong> via <code>Promise.all</code> is often 3x faster than sequential dependent fetches.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. MEMOIZATION */}
                <MemoizationLab />

                {/* 6. TAKEAWAY */}
                <div className="text-center py-12 bg-gradient-to-b from-transparent to-blue-50 rounded-3xl">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Final Takeaway</h3>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto italic">
                        "Performance is about perception. Optimize for <strong className="text-gray-900">humans</strong>, not tools."
                    </p>
                </div>

            </div>
        </div>
    );
};

export default PerformanceDemo;
