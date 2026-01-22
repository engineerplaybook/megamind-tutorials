import React from 'react';
import TransitionDemo from '../concepts/demos/TransitionDemo';

const TransitionPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">Transitions</h1>
        <p className="text-xl text-gray-600 mb-8">
          Optimizing performance by marking updates as non-urgent with <code className="bg-gray-100 px-2 py-1 rounded text-pink-600 font-mono text-base">useTransition</code>.
        </p>

        <section className="mb-8 p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
          <h2 className="text-2xl font-bold mb-4 text-indigo-900">Concept Notes</h2>
          <div className="prose prose-indigo text-gray-700">
            <h3 className="text-lg font-semibold text-gray-900">Urgent vs. Non-Urgent Updates</h3>
            <p className="mb-4">
              React 18 introduced the concept of Concurrency.
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li><strong>Urgent updates:</strong> Direct interaction like typing, clicking, hover. Needs immediate feedback.</li>
              <li><strong>Transitions:</strong> UI views, large renders. Can be interrupted by urgent updates.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900">How useTransition helps</h3>
            <p className="mb-4">
              By wrapping the state update that triggers the heavy render in `startTransition`, you tell React: "You can interrupt this work if the user types again." This keeps the UI responsive (e.g., the input field doesn't freeze).
            </p>
          </div>
        </section>
      </div>

      <h2 className="text-2xl font-bold mb-6 border-b pb-2">Interactive Demo</h2>
      <TransitionDemo />
    </div>
  );
};

export default TransitionPage;
