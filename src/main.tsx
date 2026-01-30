import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

type ImportMetaEnvShape = { BASE_URL?: string };
const BASE = (import.meta as unknown as { env?: ImportMetaEnvShape }).env?.BASE_URL ?? '/tutorials/';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={BASE}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
