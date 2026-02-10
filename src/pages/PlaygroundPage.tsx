import React from 'react';
import { JankSimulator, VirtualList, RenderVisualizer, MemoizationLab } from '@anmolthukral/performance-ui';
import '@anmolthukral/performance-ui/dist/style.css';

const PlaygroundPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-8 pt-24">
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Performance UI Playground</h1>
                    <p className="text-gray-500 mt-2">Reusable components from <code className="bg-gray-200 px-1 rounded text-sm text-gray-700">@anmolthukral/performance-ui</code></p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Jank Simulator */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Jank Simulator</h2>
                        <JankSimulator />
                    </div>

                    {/* Render Visualizer */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Render Visualizer</h2>
                        <RenderVisualizer />
                    </div>
                </div>

                {/* Virtual List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Virtual List Demo</h2>
                    <VirtualList />
                </div>

                {/* Memoization Lab */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Memoization Lab</h2>
                    <MemoizationLab />
                </div>
            </div>
        </div>
    );
};

export default PlaygroundPage;
