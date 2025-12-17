#!/usr/bin/env node

/**
 * Certifi Chainhooks Client
 * Uses @hirosystems/chainhooks-client to register and manage hooks
 * Tracks credential events for Builder Challenge leaderboard
 */

const {
  ChainhooksClient,
  StacksChainEvent,
  StacksContractCallFilter,
} = require('@hirosystems/chainhooks-client');
const fs = require('fs');
require('dotenv').config();

const NETWORK = process.env.STACKS_NETWORK || 'testnet';
const DEPLOYER_ADDRESS = process.env.DEPLOYER_ADDRESS;
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'http://localhost:3000';
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'your-secret-key';

if (!DEPLOYER_ADDRESS) {
  console.error('Error: DEPLOYER_ADDRESS must be set in .env');
  process.exit(1);
}

// Initialize Chainhooks client
const client = new ChainhooksClient({
  baseUrl: NETWORK === 'mainnet' 
    ? 'https://api.hiro.so/chainhooks'
    : 'https://api.testnet.hiro.so/chainhooks',
});

// Contract addresses
const INSTITUTIONS_CONTRACT = `${DEPLOYER_ADDRESS}.certifi-institutions`;
const CREDENTIALS_CONTRACT = `${DEPLOYER_ADDRESS}.certifi-credentials`;

console.log(`\n${'='.repeat(70)}`);
console.log(`CERTIFI CHAINHOOKS CLIENT`);
console.log(`${'='.repeat(70)}`);
console.log(`Network: ${NETWORK.toUpperCase()}`);
console.log(`Deployer: ${DEPLOYER_ADDRESS}`);
console.log(`Webhook URL: ${WEBHOOK_URL}\n`);

// Define hooks
const hooks = [
  {
    uuid: 'certifi-credential-issued',
    name: 'Credential Issued',
    predicate: {
      scope: 'txs',
      operation: 'contract_call',
      contract_identifier: CREDENTIALS_CONTRACT,
      method: 'issue-credential',
    },
    action: {
      type: 'http_post',
      url: `${WEBHOOK_URL}/webhooks/credential-issued`,
      authorization_header: `Bearer ${WEBHOOK_SECRET}`,
    },
  },
  {
    uuid: 'certifi-credential-verified',
    name: 'Credential Verified',
    predicate: {
      scope: 'txs',
      operation: 'contract_call',
      contract_identifier: CREDENTIALS_CONTRACT,
      method: 'verify-credential',
    },
    action: {
      type: 'http_post',
      url: `${WEBHOOK_URL}/webhooks/credential-verified`,
      authorization_header: `Bearer ${WEBHOOK_SECRET}`,
    },
  },
  {
    uuid: 'certifi-credential-revoked',
    name: 'Credential Revoked',
    predicate: {
      scope: 'txs',
      operation: 'contract_call',
      contract_identifier: CREDENTIALS_CONTRACT,
      method: 'revoke-credential',
    },
    action: {
      type: 'http_post',
      url: `${WEBHOOK_URL}/webhooks/credential-revoked`,
      authorization_header: `Bearer ${WEBHOOK_SECRET}`,
    },
  },
  {
    uuid: 'certifi-institution-registered',
    name: 'Institution Registered',
    predicate: {
      scope: 'txs',
      operation: 'contract_call',
      contract_identifier: INSTITUTIONS_CONTRACT,
      method: 'register-institution',
    },
    action: {
      type: 'http_post',
      url: `${WEBHOOK_URL}/webhooks/institution-registered`,
      authorization_header: `Bearer ${WEBHOOK_SECRET}`,
    },
  },
];

// Register hooks
async function registerHooks() {
  try {
    console.log(`📡 Registering ${hooks.length} chainhooks...\n`);

    for (const hook of hooks) {
      try {
        console.log(`⏳ Registering: ${hook.name}`);
        
        const response = await client.registerHook({
          uuid: hook.uuid,
          name: hook.name,
          network: NETWORK,
          predicate: hook.predicate,
          action: hook.action,
        });

        console.log(`✅ ${hook.name} registered`);
        console.log(`   UUID: ${hook.uuid}`);
        console.log(`   Webhook: ${hook.action.url}\n`);
      } catch (error) {
        console.error(`❌ Error registering ${hook.name}:`, error.message);
      }
    }

    console.log(`${'='.repeat(70)}`);
    console.log(`✅ CHAINHOOKS REGISTRATION COMPLETE`);
    console.log(`${'='.repeat(70)}\n`);

    // Save hook configuration
    saveHookConfig();
  } catch (error) {
    console.error('Error registering hooks:', error);
    process.exit(1);
  }
}

// List registered hooks
async function listHooks() {
  try {
    console.log(`\n📋 Listing registered hooks...\n`);

    const response = await client.listHooks({
      network: NETWORK,
    });

    if (response.hooks && response.hooks.length > 0) {
      response.hooks.forEach((hook) => {
        console.log(`✅ ${hook.name}`);
        console.log(`   UUID: ${hook.uuid}`);
        console.log(`   Status: ${hook.status}`);
        console.log(`   Created: ${hook.created_at}\n`);
      });
    } else {
      console.log('No hooks registered yet\n');
    }
  } catch (error) {
    console.error('Error listing hooks:', error);
  }
}

// Get hook details
async function getHookDetails(uuid) {
  try {
    console.log(`\n📊 Hook Details: ${uuid}\n`);

    const response = await client.getHook({
      uuid,
      network: NETWORK,
    });

    console.log(JSON.stringify(response, null, 2));
  } catch (error) {
    console.error('Error getting hook details:', error);
  }
}

// Delete hook
async function deleteHook(uuid) {
  try {
    console.log(`\n🗑️ Deleting hook: ${uuid}\n`);

    await client.deleteHook({
      uuid,
      network: NETWORK,
    });

    console.log(`✅ Hook deleted: ${uuid}\n`);
  } catch (error) {
    console.error('Error deleting hook:', error);
  }
}

// Save hook configuration
function saveHookConfig() {
  const config = {
    network: NETWORK,
    deployer: DEPLOYER_ADDRESS,
    webhookUrl: WEBHOOK_URL,
    hooks: hooks.map((h) => ({
      uuid: h.uuid,
      name: h.name,
      method: h.predicate.method,
      contract: h.predicate.contract_identifier,
    })),
    registeredAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    './deployments/chainhooks-config.json',
    JSON.stringify(config, null, 2)
  );

  console.log('📝 Configuration saved to: deployments/chainhooks-config.json');
}

// CLI commands
const command = process.argv[2];

switch (command) {
  case 'register':
    registerHooks();
    break;
  case 'list':
    listHooks();
    break;
  case 'get':
    if (process.argv[3]) {
      getHookDetails(process.argv[3]);
    } else {
      console.error('Usage: npm run chainhooks get <uuid>');
    }
    break;
  case 'delete':
    if (process.argv[3]) {
      deleteHook(process.argv[3]);
    } else {
      console.error('Usage: npm run chainhooks delete <uuid>');
    }
    break;
  default:
    console.log(`\n${'='.repeat(70)}`);
    console.log(`CERTIFI CHAINHOOKS CLIENT`);
    console.log(`${'='.repeat(70)}\n`);
    console.log('Usage:\n');
    console.log('  npm run chainhooks register    - Register all hooks');
    console.log('  npm run chainhooks list        - List registered hooks');
    console.log('  npm run chainhooks get <uuid>  - Get hook details');
    console.log('  npm run chainhooks delete <uuid> - Delete hook\n');
    console.log(`${'='.repeat(70)}\n`);
}
