import React from 'react';
import { JankSimulator, VirtualList, RenderVisualizer, MemoizationLab } from '@anmolthukral/performance-ui';
import '@anmolthukral/performance-ui/dist/style.css';

const PlaygroundPage: React.FC = () => {
    return (
        <div style={{ minHeight: '100vh', padding: 'var(--space-6) 0' }}>
            <div className="container vstack gap-4">
                <div className="text-center">
                    <h1>Performance UI Playground</h1>
                    <p className="text-light">Reusable components from <code style={{ backgroundColor: 'var(--muted)', padding: '0.2rem 0.4rem', borderRadius: 'var(--radius-small)' }}>@anmolthukral/performance-ui</code></p>
                </div>

                <div className="row">
                    {/* Jank Simulator */}
                    <div className="col-6 vstack gap-2">
                        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                            <h3>Jank Simulator</h3>
                        </div>
                        <JankSimulator />
                    </div>

                    {/* Render Visualizer */}
                    <div className="col-6 vstack gap-2">
                        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                            <h3>Render Visualizer</h3>
                        </div>
                        <RenderVisualizer />
                    </div>
                </div>

                {/* Virtual List */}
                <div className="vstack gap-2">
                    <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                        <h3>Virtual List Demo</h3>
                    </div>
                    <VirtualList />
                </div>

                {/* Memoization Lab */}
                <div className="vstack gap-2">
                    <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                        <h3>Memoization Lab</h3>
                    </div>
                    <MemoizationLab />
                </div>
            </div>
        </div>
    );
};

export default PlaygroundPage;
