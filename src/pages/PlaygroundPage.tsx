import React from 'react';
import { JankSimulator, VirtualList, RenderVisualizer, MemoizationLab } from '@engineerplaybook/design-system';
import '@engineerplaybook/design-system/dist/style.css';

const PlaygroundPage: React.FC = () => {
    return (
        <div className="section">
            <div className="container">
                <div className="text-center mb-16">
                    <h1 className="hero-title">Performance UI Playground</h1>
                    <p className="hero-subtitle">
                        Reusable components from <code className="tag" style={{fontSize: '1em'}}>@anmolthukral/performance-ui</code>
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Jank Simulator */}
                    <div className="card">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold">Jank Simulator</h3>
                        </div>
                        <div className="p-6">
                            <JankSimulator />
                        </div>
                    </div>

                    {/* Render Visualizer */}
                    <div className="card">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold">Render Visualizer</h3>
                        </div>
                        <div className="p-6">
                            <RenderVisualizer />
                        </div>
                    </div>
                </div>

                <div className="grid gap-8 mt-8">
                    {/* Virtual List */}
                    <div className="card">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold">Virtual List Demo</h3>
                        </div>
                        <div className="p-6">
                            <VirtualList />
                        </div>
                    </div>

                    {/* Memoization Lab */}
                    <div className="card">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold">Memoization Lab</h3>
                        </div>
                        <div className="p-6">
                            <MemoizationLab />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaygroundPage;
