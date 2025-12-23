import React, { useState, useEffect } from 'react';
import { useConnect } from '@stacks/connect-react';
import Dashboard from './components/Dashboard';
import IssueCredential from './components/IssueCredential';
import VerifyCredential from './components/VerifyCredential';
import Statistics from './components/Statistics';
import ConnectEvmButton from './components/ConnectEvmButton';
import ConnectStacksButton from './components/ConnectStacksButton';
import './App.css';

function App() {
  const { isAuthenticated, userData } = useConnect();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stacksAddress, setStacksAddress] = useState<string>('');

  useEffect(() => {
    if (isAuthenticated && userData?.profile?.stxAddress) {
      setStacksAddress(userData.profile.stxAddress.testnet || userData.profile.stxAddress.mainnet || '');
    } else {
      setStacksAddress('');
    }
  }, [isAuthenticated, userData]);

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>🎓 Certifi</h1>
          <p>Blockchain-Powered Credential Verification</p>
        </div>
        <div className="header-status" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <ConnectStacksButton />
          <ConnectEvmButton />
        </div>
      </header>

      <nav className="nav">
        <button
          className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button
          className={`nav-btn ${activeTab === 'issue' ? 'active' : ''}`}
          onClick={() => setActiveTab('issue')}
        >
          🎓 Issue Credential
        </button>
        <button
          className={`nav-btn ${activeTab === 'verify' ? 'active' : ''}`}
          onClick={() => setActiveTab('verify')}
        >
          ✔️ Verify Credential
        </button>
        <button
          className={`nav-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📈 Statistics
        </button>
      </nav>

      <main className="main">
        <>
          {activeTab === 'dashboard' && <Dashboard userAddress={stacksAddress} />}
          {activeTab === 'issue' && <IssueCredential userAddress={stacksAddress} />}
          {activeTab === 'verify' && <VerifyCredential />}
          {activeTab === 'stats' && <Statistics />}
        </>
      </main>

      <footer className="footer">
        <p>Certifi © 2024 | Restoring Global Trust in Academic Credentials</p>
      </footer>
    </div>
  );
}

export default App;
