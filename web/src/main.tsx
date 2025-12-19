import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConnectProvider } from '@stacks/connect-react'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConnectProvider>
      <App />
    </ConnectProvider>
  </React.StrictMode>,
)
