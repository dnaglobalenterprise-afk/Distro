import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { GlobalStateProvider } from './context/GlobalState'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalStateProvider>
      <App />
    </GlobalStateProvider>
  </StrictMode>,
)
