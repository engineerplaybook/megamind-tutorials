import React from 'react';
import EffectDemo from '../concepts/demos/EffectDemo';

const EffectPage: React.FC = () => {
  return (
    <div className="section">
      <div className="text-center mb-12">
        <h1 className="hero-title">Side Effects</h1>
        <p className="hero-subtitle">
          Synchronizing with external systems using <code className="tag bg-white">useEffect</code>.
        </p>
      </div>

      <section className="card mb-8">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4 text-primary">Concept Notes</h2>
          <div className="prose prose-indigo text-gray-700">
            <h3 className="text-lg font-semibold text-gray-900">The Dependency Array</h3>
            <p className="mb-4">
              The second argument to `useEffect` controls when it runs:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li><code className="bg-white px-1 rounded">undefined</code> (no array): Runs after every render.</li>
              <li><code className="bg-white px-1 rounded">[]</code> (empty array): Runs only on mount (and unmount cleanup).</li>
              <li><code className="bg-white px-1 rounded">[prop, state]</code>: Runs on mount + when dependencies change.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900">Cleanup Function</h3>
            <p className="mb-4">
              If your effect returns a function, React runs it before re-running the effect (to clean up previous run) and when the component unmounts. Essential for subscriptions, timers, and event listeners.
            </p>
          </div>
        </div>
      </section>

      <h2 className="section-title">Interactive Demos</h2>
      <EffectDemo />
    </div>
  );
};

export default EffectPage;
