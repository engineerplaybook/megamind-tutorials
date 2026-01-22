import React from 'react';
import EffectDemo from '../concepts/demos/EffectDemo';

const EffectPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">Side Effects</h1>
        <p className="text-xl text-gray-600 mb-8">
          Synchronizing with external systems using <code className="bg-gray-100 px-2 py-1 rounded text-pink-600 font-mono text-base">useEffect</code>.
        </p>

        <section className="mb-8 p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
          <h2 className="text-2xl font-bold mb-4 text-indigo-900">Concept Notes</h2>
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
        </section>
      </div>

      <h2 className="text-2xl font-bold mb-6 border-b pb-2">Interactive Demos</h2>
      <EffectDemo />
    </div>
  );
};

export default EffectPage;
