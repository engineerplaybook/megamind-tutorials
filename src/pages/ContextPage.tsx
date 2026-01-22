import React from 'react';
import ContextDemo from '../concepts/demos/ContextDemo';

const ContextPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">Context API</h1>
        <p className="text-xl text-gray-600 mb-8">
          Sharing global data (like themes, auth user, or language) without prop drilling using <code className="bg-gray-100 px-2 py-1 rounded text-pink-600 font-mono text-base">createContext</code>.
        </p>

        <section className="mb-8 p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
          <h2 className="text-2xl font-bold mb-4 text-indigo-900">Concept Notes</h2>
          <div className="prose prose-indigo text-gray-700">
            <h3 className="text-lg font-semibold text-gray-900">Prop Drilling Problem</h3>
            <p className="mb-4">
              Passing data through many layers of components just to reach a deep child is cumbersome. Context lets you "teleport" data to any component in the tree.
            </p>

            <h3 className="text-lg font-semibold text-gray-900">When to use Context</h3>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Global state (Theme, Auth, Language).</li>
              <li>Complex composite components using compound pattern.</li>
              <li>Low-frequency updates (avoid using for high-frequency updates like mouse position).</li>
            </ul>
          </div>
        </section>
      </div>

      <h2 className="text-2xl font-bold mb-6 border-b pb-2">Interactive Demo</h2>
      <ContextDemo />
    </div>
  );
};

export default ContextPage;
