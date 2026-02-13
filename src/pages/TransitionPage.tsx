import React from 'react';
import TransitionDemo from '../concepts/demos/TransitionDemo';

const TransitionPage: React.FC = () => {
  return (
    <div className="section">
      <div className="text-center mb-12">
        <h1 className="hero-title">Transitions</h1>
        <p className="hero-subtitle">
          Optimizing performance by marking updates as non-urgent with <code className="tag bg-white">useTransition</code>.
        </p>
      </div>

      <section className="card mb-8">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4 text-primary">Concept Notes</h2>
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
        </div>
      </section>

      <h2 className="section-title">Interactive Demo</h2>
      <TransitionDemo />
    </div>
  );
};

export default TransitionPage;
