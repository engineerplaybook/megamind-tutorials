import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Showcase from './pages/Showcase';
import StateManagementPage from './pages/StateManagementPage';
import EffectPage from './pages/EffectPage';
import TransitionPage from './pages/TransitionPage';
import ContextPage from './pages/ContextPage';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Showcase />} />
        <Route path="/state" element={<StateManagementPage />} />
        <Route path="/effect" element={<EffectPage />} />
        <Route path="/transition" element={<TransitionPage />} />
        <Route path="/context" element={<ContextPage />} />
      </Routes>
    </MainLayout>
  )
}

export default App
