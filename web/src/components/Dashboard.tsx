import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WalletStatus from './WalletStatus';
import './Dashboard.css';

interface DashboardProps {
  userAddress: string;
}

interface Stats {
  credentialsIssued: number;
  credentialsVerified: number;
  credentialsRevoked: number;
  institutionsRegistered: number;
  totalEvents: number;
  uptime: number;
}

function Dashboard({ userAddress }: DashboardProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:3000/stats');
      setStats(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch statistics. Make sure webhook server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard loading">Loading statistics...</div>;
  }

  if (error) {
    return (
      <div className="dashboard error">
        <p>⚠️ {error}</p>
        <p className="hint">Start webhook server: npm run webhook</p>
      </div>
    );
  }

  if (!stats) {
    return <div className="dashboard">No data available</div>;
  }

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <p className="subtitle">Real-time Certifi Statistics</p>
      
      <WalletStatus />

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎓</div>
          <div className="stat-content">
            <h3>Credentials Issued</h3>
            <p className="stat-value">{stats.credentialsIssued}</p>
            <p className="stat-label">Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✔️</div>
          <div className="stat-content">
            <h3>Verified</h3>
            <p className="stat-value">{stats.credentialsVerified}</p>
            <p className="stat-label">Verifications</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🚫</div>
          <div className="stat-content">
            <h3>Revoked</h3>
            <p className="stat-value">{stats.credentialsRevoked}</p>
            <p className="stat-label">Revocations</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏫</div>
          <div className="stat-content">
            <h3>Institutions</h3>
            <p className="stat-value">{stats.institutionsRegistered}</p>
            <p className="stat-label">Registered</p>
          </div>
        </div>
      </div>

      <div className="summary">
        <div className="summary-item">
          <span>Total Events:</span>
          <strong>{stats.totalEvents}</strong>
        </div>
        <div className="summary-item">
          <span>Server Uptime:</span>
          <strong>{Math.floor(stats.uptime / 60)}m {Math.floor(stats.uptime % 60)}s</strong>
        </div>
      </div>

      <div className="actions">
        <button className="btn btn-primary" onClick={fetchStats}>
          🔄 Refresh
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
