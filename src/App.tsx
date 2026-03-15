import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Catalog from './pages/Catalog';
import TutorialViewer from './pages/TutorialViewer';
import Showcase from './pages/Showcase';
import StateManagementPage from './pages/StateManagementPage';
import EffectPage from './pages/EffectPage';
import TransitionPage from './pages/TransitionPage';
import ContextPage from './pages/ContextPage';
import PlaygroundPage from './pages/PlaygroundPage';
import NotFound from './pages/NotFound';

const FeatureNotAvailable = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>Feature Not Available</h1>
    <p>This feature is currently disabled. Please check back later.</p>
    <a href="/" style={{ color: 'var(--color-primary, #0070f3)', textDecoration: 'underline' }}>Go Home</a>
  </div>
);

function App() {
  const showTutorials = import.meta.env.VITE_FEATURE_TUTORIALS !== 'false';
  const showPlayground = import.meta.env.VITE_FEATURE_PLAYGROUND !== 'false';

  return (
    <MainLayout>
      <Routes>
        {/* New Architecture */}
        <Route path="/" element={showTutorials ? <Catalog /> : <FeatureNotAvailable />} />
        <Route path="/topic/:slug" element={showTutorials ? <TutorialViewer /> : <Navigate to="/" />} />
        <Route path="/playground" element={showTutorials && showPlayground ? <PlaygroundPage /> : <FeatureNotAvailable />} />
        
        {/* Legacy / Direct Demos */}
        <Route path="/showcase" element={showTutorials ? <Showcase /> : <Navigate to="/" />} />
        <Route path="/state" element={showTutorials ? <StateManagementPage /> : <Navigate to="/" />} />
        <Route path="/effect" element={showTutorials ? <EffectPage /> : <Navigate to="/" />} />
        <Route path="/transition" element={showTutorials ? <TransitionPage /> : <Navigate to="/" />} />
        <Route path="/context" element={showTutorials ? <ContextPage /> : <Navigate to="/" />} />
        
        {/* 404 Catch-All */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  )
}

export default App
