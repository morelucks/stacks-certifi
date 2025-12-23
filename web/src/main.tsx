import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConnectProvider } from '@stacks/connect-react'
import App from './App.tsx'
import './index.css'
import { AppKitProvider } from './appkit/AppKitProvider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConnectProvider>
      <AppKitProvider>
        <App />
      </AppKitProvider>
    </ConnectProvider>
  </React.StrictMode>,
)
