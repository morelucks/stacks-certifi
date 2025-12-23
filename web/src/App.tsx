import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import IssueCredential from './components/IssueCredential';
import VerifyCredential from './components/VerifyCredential';
import Statistics from './components/Statistics';
import ConnectEvmButton from './components/ConnectEvmButton';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>🎓 Certifi</h1>
          <p>Blockchain-Powered Credential Verification</p>
        </div>
        <div className="header-status">
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
          {activeTab === 'dashboard' && <Dashboard userAddress={''} />}
          {activeTab === 'issue' && <IssueCredential userAddress={''} />}
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
