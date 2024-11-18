import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LogsProvider } from './Context/LogsContext.tsx'
import { SettingsProvider } from './Context/SettingsContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <LogsProvider>
        <App />
      </LogsProvider>
    </SettingsProvider>
  </StrictMode>,
)
