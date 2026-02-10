import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Catalog from './pages/Catalog';
import TutorialViewer from './pages/TutorialViewer';
import Showcase from './pages/Showcase';
import StateManagementPage from './pages/StateManagementPage';
import EffectPage from './pages/EffectPage';
import TransitionPage from './pages/TransitionPage';
import ContextPage from './pages/ContextPage';
import PlaygroundPage from './pages/PlaygroundPage';

function App() {
  return (
    <MainLayout>
      <Routes>
        {/* New Architecture */}
        <Route path="/" element={<Catalog />} />
        <Route path="/topic/:slug" element={<TutorialViewer />} />
        <Route path="/playground" element={<PlaygroundPage />} />
        
        {/* Legacy / Direct Demos */}
        <Route path="/showcase" element={<Showcase />} />
        <Route path="/state" element={<StateManagementPage />} />
        <Route path="/effect" element={<EffectPage />} />
        <Route path="/transition" element={<TransitionPage />} />
        <Route path="/context" element={<ContextPage />} />
      </Routes>
    </MainLayout>
  )
}

export default App
