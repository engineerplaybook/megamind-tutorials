import React from 'react';
import ContextDemo from '../concepts/demos/ContextDemo';

const ContextPage: React.FC = () => {
  return (
    <div className="section">
      <div className="text-center mb-12">
        <h1 className="hero-title">Context API</h1>
        <p className="hero-subtitle">
          Sharing global data (like themes, auth user, or language) without prop drilling using <code className="tag bg-white">createContext</code>.
        </p>
      </div>

      <section className="card mb-8">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4 text-primary">Concept Notes</h2>
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
        </div>
      </section>

      <h2 className="section-title">Interactive Demo</h2>
      <ContextDemo />
    </div>
  );
};

export default ContextPage;
