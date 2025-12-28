import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAccount } from 'wagmi';
import EvmCredentialStats from './EvmCredentialStats';
import './Statistics.css';

interface EventData {
  timestamp: string;
  type: string;
  details: string;
}

function Statistics() {
  const { isConnected } = useAccount();
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // TODO: Replace with actual contract address
  const EVM_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000' as `0x${string}`;

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:3000/stats');
      const mockEvents: EventData[] = [
        {
          timestamp: new Date().toISOString(),
          type: 'credential-issued',
          details: `Credential #${response.data.credentialsIssued} issued`,
        },
        {
          timestamp: new Date(Date.now() - 60000).toISOString(),
          type: 'credential-verified',
          details: `Credential verified by employer`,
        },
        {
          timestamp: new Date(Date.now() - 120000).toISOString(),
          type: 'institution-registered',
          details: `Institution #${response.data.institutionsRegistered} registered`,
        },
      ];
      setEvents(mockEvents);
      setError(null);
    } catch (err) {
      setError('Failed to fetch events. Make sure webhook server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'credential-issued':
        return '🎓';
      case 'credential-verified':
        return '✔️';
      case 'credential-revoked':
        return '🚫';
      case 'institution-registered':
        return '🏫';
      default:
        return '📝';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'credential-issued':
        return 'blue';
      case 'credential-verified':
        return 'green';
      case 'credential-revoked':
        return 'red';
      case 'institution-registered':
        return 'purple';
      default:
        return 'gray';
    }
  };

  if (loading) {
    return <div className="statistics loading">Loading events...</div>;
  }

  if (error) {
    return (
      <div className="statistics error">
        <p>⚠️ {error}</p>
      </div>
    );
  }

  return (
    <div className="statistics">
      <h2>Event Timeline</h2>
      <p className="subtitle">Recent Certifi activity</p>

      {isConnected && (
        <EvmCredentialStats contractAddress={EVM_CONTRACT_ADDRESS} />
      )}

      <div className="timeline">
        {events.length > 0 ? (
          events.map((event, index) => (
            <div key={index} className={`timeline-item ${getEventColor(event.type)}`}>
              <div className="timeline-marker">
                <span className="timeline-icon">{getEventIcon(event.type)}</span>
              </div>
              <div className="timeline-content">
                <p className="event-type">{event.type.replace('-', ' ').toUpperCase()}</p>
                <p className="event-details">{event.details}</p>
                <p className="event-time">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-events">No events yet. Start issuing credentials!</p>
        )}
      </div>

      <div className="stats-summary">
        <h3>📊 Summary</h3>
        <div className="summary-grid">
          <div className="summary-card">
            <span className="icon">🎓</span>
            <span className="label">Credentials Issued</span>
            <span className="value">-</span>
          </div>
          <div className="summary-card">
            <span className="icon">✔️</span>
            <span className="label">Verified</span>
            <span className="value">-</span>
          </div>
          <div className="summary-card">
            <span className="icon">🚫</span>
            <span className="label">Revoked</span>
            <span className="value">-</span>
          </div>
          <div className="summary-card">
            <span className="icon">🏫</span>
            <span className="label">Institutions</span>
            <span className="value">-</span>
          </div>
        </div>
      </div>

      <div className="actions">
        <button className="btn btn-primary" onClick={fetchEvents}>
          🔄 Refresh Events
        </button>
      </div>
    </div>
  );
}

export default Statistics;
