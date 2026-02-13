import React, { useEffect } from 'react';
import { JankSimulator, VirtualList, RenderVisualizer, MemoizationLab } from '@anmolthukral/performance-ui';
import '@anmolthukral/performance-ui/dist/style.css';

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
                <section className="grid md:grid-cols-2 gap-8 my-16">
                     <div className="card" style={{ background: '#1e1b4b', color: 'white', borderColor: '#312e81' }}>
                        <div className="p-8">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <i className="fas fa-chart-line"></i> Measure Before You Optimize
                            </h3>
                            <p className="text-indigo-200 mb-6 text-sm leading-relaxed">
                                Don't guess. Use the tools available in your browser.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3 mb-4">
                                    <span className="p-2 rounded-lg bg-indigo-800"><i className="fab fa-chrome"></i></span>
                                    <div>
                                        <strong className="block text-white">Chrome Performance Tab</strong>
                                        <span className="text-indigo-300 text-xs">Visualize the Main Thread & rendering tasks.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 mb-4">
                                    <span className="p-2 rounded-lg bg-indigo-800"><i className="fab fa-react"></i></span>
                                    <div>
                                        <strong className="block text-white">React Profiler</strong>
                                        <span className="text-indigo-300 text-xs">See which components rendered and why.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="p-2 rounded-lg bg-indigo-800"><i className="fas fa-lighthouse"></i></span>
                                    <div>
                                        <strong className="block text-white">Lighthouse != UX</strong>
                                        <span className="text-indigo-300 text-xs">Scores help, but <strong>INP</strong> matter more.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                     </div>

                     <div className="card justify-center">
                        <div className="p-8">
                            <h3 className="text-xl font-bold text-primary mb-6">Performance Budgets</h3>
                            <div className="space-y-6">
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm font-bold mb-1">
                                        <span>JS Bundle Size</span>
                                        <span className="text-success">&lt; 100 KB</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 w-1/3"></div>
                                    </div>
                                </div>
                                 <div className="mb-4">
                                    <div className="flex justify-between text-sm font-bold mb-1">
                                        <span>Main Thread Task</span>
                                        <span className="text-accent-gold">&lt; 50 ms</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-400 w-1/2"></div>
                                    </div>
                                </div>
                                 <div>
                                    <div className="flex justify-between text-sm font-bold mb-1">
                                        <span>INP (Responsiveness)</span>
                                        <span className="text-primary">&lt; 200 ms</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-sky-500 w-2/3"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                     </div>
                </section>

                 {/* 4. STRATEGIES */}
                <section className="card">
                    <div className="p-8">
                        <h3 className="text-2xl font-bold text-primary mb-8 text-center">How to Actually Fix It</h3>
                        
                        <div className="space-y-12">
                            {/* Strategy 1: Delete Code */}
                            <div className="grid md:grid-cols-[250px_1fr] gap-8">
                                <div className="bg-purple-50 p-6 rounded-xl h-fit border border-purple-100">
                                    <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4 text-lg">
                                        <i className="fas fa-trash-alt"></i>
                                    </div>
                                    <h4 className="font-bold text-purple-900">1. Delete Code</h4>
                                    <p className="text-xs text-purple-700 mt-2">The fastest code is the code you never ship.</p>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="border border-gray-100 p-4 rounded-lg hover:border-purple-200 transition-colors">
                                        <strong className="block text-primary mb-1">Remove Dead Code</strong>
                                        <span className="text-sm text-secondary">Use coverage tools. If it doesn't run, kill it.</span>
                                    </div>
                                    <div className="border border-gray-100 p-4 rounded-lg hover:border-purple-200 transition-colors">
                                        <strong className="block text-primary mb-1">Lazy Load</strong>
                                        <span className="text-sm text-secondary">Don't load the Settings page until the user clicks Settings.</span>
                                    </div>
                                    <div className="border border-gray-100 p-4 rounded-lg hover:border-purple-200 transition-colors">
                                        <strong className="block text-primary mb-1">Browser APIs</strong>
                                        <span className="text-sm text-secondary">Use `IntersectionObserver` instead of heavy scroll libraries.</span>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-100"></div>

                            {/* Strategy 2: Reduce > Cache (Virtualization) */}
                            <div className="py-4">
                                 <VirtualList />
                            </div>

                            <div className="border-t border-gray-100"></div>

                            {/* Strategy 3: Network */}
                            <div className="grid md:grid-cols-[250px_1fr] gap-8">
                                <div className="bg-green-50 p-6 rounded-xl h-fit border border-green-100">
                                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4 text-lg">
                                        <i className="fas fa-network-wired"></i>
                                    </div>
                                    <h4 className="font-bold text-green-900">3. Network Strategy</h4>
                                    <p className="text-xs text-green-700 mt-2">Avoid Waterfalls. Parallelize.</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-4">
                                            <div className="w-24 text-xs font-bold text-danger text-right">Waterfall</div>
                                            <div className="flex-1 flex gap-1">
                                                <div className="h-2 w-1/3 bg-red-400 rounded"></div>
                                                <div className="h-2 w-1/4 bg-red-400 rounded opacity-50"></div>
                                                <div className="h-2 w-1/3 bg-red-400 rounded opacity-25"></div>
                                            </div>
                                            <div className="text-xs text-secondary">3s Total</div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-24 text-xs font-bold text-success text-right">Parallel</div>
                                            <div className="flex-1 relative h-6">
                                                 <div className="absolute top-0 left-0 h-2 w-1/3 bg-green-500 rounded"></div>
                                                 <div className="absolute top-2 left-0 h-2 w-1/4 bg-green-500 rounded opacity-70"></div>
                                                 <div className="absolute top-4 left-0 h-2 w-1/3 bg-green-500 rounded opacity-40"></div>
                                            </div>
                                            <div className="text-xs text-secondary">1s Total</div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-secondary">
                                        Fetch data <strong>parallelly</strong> using `Promise.all` or Request Waterfalls (fetching data inside a component that renders after another fetch).
                                    </p>
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
