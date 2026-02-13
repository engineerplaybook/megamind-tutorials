import React from 'react';
import StateDemo from '../concepts/demos/StateDemo';

const StateManagementPage: React.FC = () => {
  return (
    <div className="section">
      <div className="text-center mb-12">
        <h1 className="hero-title">State Management</h1>
        <p className="hero-subtitle">
          Understanding when to use <code className="tag bg-white">useState</code> vs <code className="tag bg-white">useReducer</code> is key to React development.
        </p>
      </div>

      <section className="card mb-8">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4 text-primary">Concept Notes</h2>
          <div className="prose prose-indigo text-gray-700">
            <h3 className="text-lg font-semibold text-gray-900">useState</h3>
            <p className="mb-4">
              The `useState` hook is perfect for simple, atomic pieces of state that update independently. Think form inputs, toggle flags (isOpen), or simple counters.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900">useReducer</h3>
            <p className="mb-4">
              The `useReducer` hook excels when:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>State logic is complex.</li>
              <li>Multiple sub-values need to update together.</li>
              <li>The next state depends on the previous one.</li>
              <li>You want to decouple state updates from event handlers.</li>
            </ul>
          </div>
        </div>
      </section>

      <h2 className="section-title">Interactive Demos</h2>
      <StateDemo />
    </div>
  );
};

export default StateManagementPage;
