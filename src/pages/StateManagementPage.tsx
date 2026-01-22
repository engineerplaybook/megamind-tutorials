import React from 'react';
import StateDemo from '../concepts/demos/StateDemo';

const StateManagementPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">State Management</h1>
        <p className="text-xl text-gray-600 mb-8">
          Understanding when to use <code className="bg-gray-100 px-2 py-1 rounded text-pink-600 font-mono text-base">useState</code> vs <code className="bg-gray-100 px-2 py-1 rounded text-pink-600 font-mono text-base">useReducer</code> is key to React development.
        </p>

        <section className="mb-8 p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
          <h2 className="text-2xl font-bold mb-4 text-indigo-900">Concept Notes</h2>
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
        </section>
      </div>

      <h2 className="text-2xl font-bold mb-6 border-b pb-2">Interactive Demos</h2>
      <StateDemo />
    </div>
  );
};

export default StateManagementPage;
