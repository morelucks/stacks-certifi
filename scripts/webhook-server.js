#!/usr/bin/env node

/**
 * Certifi Webhook Server
 * Handles Hiro Chainhooks events for credential tracking
 * Tracks: credential issuance, verification, revocation, institution registration
 */

const http = require('http');
const fs = require('fs');
require('dotenv').config();

const PORT = process.env.WEBHOOK_PORT || 3000;
const SECRET_KEY = process.env.WEBHOOK_SECRET || 'your-secret-key';

// Event tracking
const events = {
  credentialIssued: [],
  credentialVerified: [],
  credentialRevoked: [],
  institutionRegistered: [],
};

// Create HTTP server
const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Health check
  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    return;
  }

  // Stats endpoint
  if (req.url === '/stats' && req.method === 'GET') {
    const stats = {
      credentialsIssued: events.credentialIssued.length,
      credentialsVerified: events.credentialVerified.length,
      credentialsRevoked: events.credentialRevoked.length,
      institutionsRegistered: events.institutionRegistered.length,
      totalEvents: Object.values(events).reduce((sum, arr) => sum + arr.length, 0),
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(stats, null, 2));
    return;
  }

  // Webhook endpoints
  if (req.method === 'POST') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        // Verify authorization
        const authHeader = req.headers.authorization || '';
        if (!authHeader.includes(SECRET_KEY)) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Unauthorized' }));
          return;
        }

        const data = JSON.parse(body);

        // Route to appropriate handler
        if (req.url === '/webhooks/credential-issued') {
          handleCredentialIssued(data);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, event: 'credential-issued' }));
        } else if (req.url === '/webhooks/credential-verified') {
          handleCredentialVerified(data);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, event: 'credential-verified' }));
        } else if (req.url === '/webhooks/credential-revoked') {
          handleCredentialRevoked(data);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, event: 'credential-revoked' }));
        } else if (req.url === '/webhooks/institution-registered') {
          handleInstitutionRegistered(data);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, event: 'institution-registered' }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Not found' }));
        }
      } catch (error) {
        console.error('Error processing webhook:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request' }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

// Event handlers
function handleCredentialIssued(data) {
  const event = {
    timestamp: new Date().toISOString(),
    txid: data.txid,
    credentialId: data.credentialId,
    student: data.student,
    institution: data.institution,
  };
  events.credentialIssued.push(event);
  console.log(`✅ Credential Issued:`, event);
  saveEvents();
}

function handleCredentialVerified(data) {
  const event = {
    timestamp: new Date().toISOString(),
    txid: data.txid,
    credentialId: data.credentialId,
    verifier: data.verifier,
  };
  events.credentialVerified.push(event);
  console.log(`✔️ Credential Verified:`, event);
  saveEvents();
}

function handleCredentialRevoked(data) {
  const event = {
    timestamp: new Date().toISOString(),
    txid: data.txid,
    credentialId: data.credentialId,
    reason: data.reason,
  };
  events.credentialRevoked.push(event);
  console.log(`🚫 Credential Revoked:`, event);
  saveEvents();
}

function handleInstitutionRegistered(data) {
  const event = {
    timestamp: new Date().toISOString(),
    txid: data.txid,
    institutionId: data.institutionId,
    name: data.name,
    country: data.country,
  };
  events.institutionRegistered.push(event);
  console.log(`🏫 Institution Registered:`, event);
  saveEvents();
}

// Save events to file
function saveEvents() {
  fs.writeFileSync(
    './deployments/events.json',
    JSON.stringify(events, null, 2)
  );
}

// Load events from file
function loadEvents() {
  try {
    const data = fs.readFileSync('./deployments/events.json', 'utf8');
    const loaded = JSON.parse(data);
    Object.assign(events, loaded);
    console.log('✅ Events loaded from file');
  } catch (error) {
    console.log('📝 Starting with empty events');
  }
}

// Start server
loadEvents();
server.listen(PORT, () => {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`🚀 CERTIFI WEBHOOK SERVER`);
  console.log(`${'='.repeat(70)}`);
  console.log(`\n📡 Server running on: http://localhost:${PORT}`);
  console.log(`\n📊 Endpoints:`);
  console.log(`  • GET  /health - Health check`);
  console.log(`  • GET  /stats - View statistics`);
  console.log(`  • POST /webhooks/credential-issued`);
  console.log(`  • POST /webhooks/credential-verified`);
  console.log(`  • POST /webhooks/credential-revoked`);
  console.log(`  • POST /webhooks/institution-registered`);
  console.log(`\n🔐 Authorization: Bearer ${SECRET_KEY}`);
  console.log(`\n${'='.repeat(70)}\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n✅ Saving events and shutting down...');
  saveEvents();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
