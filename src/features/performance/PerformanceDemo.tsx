import React, { useState, useEffect } from 'react';

const PerformanceDemo: React.FC = () => {
    // 1. Fast Renders Demo State
    const [count, setCount] = useState(0);
    const [isFastRendering, setIsFastRendering] = useState(false);

    // 2. Jank Demo State
    const [isBlocked, setIsBlocked] = useState(false);

    // Fast Render Logic (60fps updates)
    useEffect(() => {
        if (!isFastRendering) return;
        let animationFrameId: number;

        const animate = () => {
            setCount(c => c + 1);
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        return () => cancelAnimationFrame(animationFrameId);
    }, [isFastRendering]);

    // Blocking Logic (Simulate Jank)
    const blockMainThread = () => {
        setIsBlocked(true);
        setTimeout(() => {
            const start = Date.now();
            while (Date.now() - start < 2000) {
                // Occupy CPU for 2000ms
            }
            setIsBlocked(false);
        }, 50);
    };

    return (
        <div className="space-y-16 max-w-5xl mx-auto">
            
            {/* 0. INTRO */}
            <div className="text-center space-y-4">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold tracking-wide">
                    ENGINEER PLAYBOOK · EPISODE 1
                </span>
                <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                    Poor Frontend Performance?<br />
                    <span className="text-blue-600">It's Not a React Problem!</span>
                </h2>
                <p className="max-w-2xl mx-auto text-xl text-gray-500">
                    Why your app feels slow, why "renders" aren't the enemy, and how to actually fix it.
                </p>
            </div>

            {/* 1. THE BIG LIE */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-8 border-b border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">1. The Big Lie: "My React App is Slow"</h3>
                    <p className="text-gray-600">
                        We blame React for freezing. But React didn't freeze—<strong>JavaScript froze</strong>.
                        React is just the renderer (the paintbrush), but the System (JS) does the damage.
                        Let's prove that 300+ renders per second is <span className="text-green-600 font-bold">FINE</span>.
                    </p>
                </div>
                <div className="bg-gray-50 p-8 grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                        <div className="flex items-baseline gap-2">
                             <div className="text-7xl font-mono font-bold text-blue-600 tabular-nums tracking-tighter">
                                {count}
                            </div>
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Renders</span>
                        </div>
                       
                        <button 
                            onClick={() => setIsFastRendering(!isFastRendering)}
                            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all shadow-lg transform hover:-translate-y-1 ${
                                isFastRendering 
                                ? 'bg-red-500 text-white shadow-red-500/30' 
                                : 'bg-blue-600 text-white shadow-blue-500/30'
                            }`}
                        >
                            {isFastRendering ? '✋ Stop The Madness' : '🚀 Start Fast Renders'}
                        </button>
                        <p className="text-xs text-gray-500 text-center">
                            Updating state 60 times/sec (Every 16ms)
                        </p>
                    </div>
                    <div className="bg-gray-900 rounded-xl p-6 text-sm text-gray-300 font-mono shadow-inner">
{`// Renders aren't the enemy.
// BLOCKED threads are.

useEffect(() => {
  const animate = () => {
    setCount(c => c + 1); 
    // This runs 60x per second
    requestAnimationFrame(animate);
  };
  animate(); 
}, []);`}
                    </div>
                </div>
            </section>

            {/* 2. THE REAL CULPRIT */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-8 border-b border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">2. What Actually Hurts: The Main Thread</h3>
                    <p className="text-gray-600 mb-4">
                        JavaScript is <strong>Single Threaded</strong>. Think of it like a <strong>Starbucks Queue</strong>.
                        If one person (a Long Task) takes 2 minutes to order, <em>nobody else gets coffee</em>.
                        The entire UI freezes.
                    </p>
                    <ul className="flex flex-wrap gap-2">
                        {['Extended Main Thread Tasks', 'Huge JS Bundles', 'Delayed Network Request'].map(tag => (
                            <span key={tag} className="px-3 py-1 bg-red-50 text-red-700 text-xs font-bold uppercase rounded-md border border-red-100">
                                {tag}
                            </span>
                        ))}
                    </ul>
                </div>
                
                <div className="bg-amber-50 p-8">
                    <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
                         <div className="flex-1">
                            <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                                <i className="fas fa-coffee"></i> The "Starbucks Queue" Simulator
                            </h4>
                            <p className="text-amber-700 text-sm mb-6">
                                The spinner represents the UI thread serving customers. 
                                Clicking the button inserts a "Indecisive Customer" (Long Task) who blocks the line for 2 seconds.
                            </p>
                            <button 
                                onClick={blockMainThread}
                                disabled={isBlocked}
                                className="w-full py-4 px-6 bg-amber-600 text-white font-bold rounded-xl shadow-lg hover:bg-amber-700 transition-all disabled:opacity-50 disabled:grayscale"
                            >
                                {isBlocked ? '🚫 QUEUE BLOCKED...' : '🛑 Simulate Long Task (2s)'}
                            </button>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100 flex flex-col items-center gap-4 w-full md:w-auto min-w-[200px]">
                            <div className="relative">
                                {/* Visual indicating frozen state */}
                                <div className={`w-20 h-20 border-8 border-gray-200 border-t-amber-500 rounded-full ${isBlocked ? '' : 'animate-spin'}`}></div>
                                {isBlocked && (
                                    <div className="absolute inset-0 flex items-center justify-center text-red-500 text-2xl animate-pulse">
                                        <i className="fas fa-ban"></i>
                                    </div>
                                )}
                            </div>
                            <div className={`text-center font-mono font-bold ${isBlocked ? 'text-red-500' : 'text-green-500'}`}>
                                {isBlocked ? 'FROZEN (JANK)' : 'FLUID (60FPS)'}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. MEASURE BEFORE OPTIMIZE */}
            <section className="grid md:grid-cols-2 gap-6">
                 <div className="bg-indigo-900 text-white p-8 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <i className="fas fa-chart-line"></i> Measure Before You Optimize
                    </h3>
                    <p className="text-indigo-200 mb-6 text-sm leading-relaxed">
                        Don't guess. Use the tools available in your browser.
                    </p>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <span className="bg-indigo-700 p-2 rounded-lg"><i className="fab fa-chrome"></i></span>
                            <div>
                                <strong className="block text-white">Chrome Performance Tab</strong>
                                <span className="text-indigo-300 text-xs">Visualize the Main Thread & rendering tasks.</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="bg-indigo-700 p-2 rounded-lg"><i className="fab fa-react"></i></span>
                            <div>
                                <strong className="block text-white">React Profiler</strong>
                                <span className="text-indigo-300 text-xs">See which components rendered and why (Did it render 500 times?).</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="bg-indigo-700 p-2 rounded-lg"><i className="fas fa-lighthouse"></i></span>
                            <div>
                                <strong className="block text-white">Lighthouse != UX</strong>
                                <span className="text-indigo-300 text-xs">Scores help, but <strong>INP</strong> (Interactivity) & <strong>TTI</strong> matter more for humans.</span>
                            </div>
                        </li>
                    </ul>
                 </div>

                 <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Performance Budgets</h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm font-semibold mb-1">
                                <span>JS Bundle Size</span>
                                <span className="text-green-600">&lt; 100 KB</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-1/3"></div>
                            </div>
                        </div>
                         <div>
                            <div className="flex justify-between text-sm font-semibold mb-1">
                                <span>Main Thread Task</span>
                                <span className="text-yellow-600">&lt; 50 ms</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-yellow-400 w-1/2"></div>
                            </div>
                        </div>
                         <div>
                            <div className="flex justify-between text-sm font-semibold mb-1">
                                <span>INP (Responsiveness)</span>
                                <span className="text-blue-600">&lt; 200 ms</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-2/3"></div>
                            </div>
                        </div>
                    </div>
                 </div>
            </section>

             {/* 4. STRATEGIES */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">How to Actually Fix It</h3>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4 text-lg">
                            <i className="fas fa-trash-alt"></i>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">1. Delete Code</h4>
                        <p className="text-sm text-gray-600">
                            The fastest code is the code you never ship. Remove unused features, kill legacy scripts, and use native Browser APIs.
                        </p>
                    </div>
                     <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 text-lg">
                            <i className="fas fa-layer-group"></i>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">2. Reduce {'>'} Cache</h4>
                        <p className="text-sm text-gray-600">
                            Don't memoize heavy work—<strong>avoid the work</strong>. Virtualize lists, split components, and use Web Workers.
                        </p>
                    </div>
                     <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4 text-lg">
                            <i className="fas fa-network-wired"></i>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">3. Network Strategy</h4>
                        <p className="text-sm text-gray-600">
                            Avoid Waterfall requests. Cache aggressively. Load fonts/images early to improve perception.
                        </p>
                    </div>
                </div>
            </section>

            {/* 5. TAKEAWAY */}
            <div className="text-center py-12 bg-gradient-to-b from-transparent to-blue-50 rounded-3xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Final Takeaway</h3>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto italic">
                    "Performance is about perception. Optimize for <strong className="text-gray-900">humans</strong>, not tools."
                </p>
            </div>

        </div>
    );
};

export default PerformanceDemo;
