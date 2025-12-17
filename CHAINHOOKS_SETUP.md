# Hiro Chainhooks Integration

Track Certifi events using Hiro Chainhooks for the Builder Challenge.

Uses: `@hirosystems/chainhooks-client` (official package)

## 🎯 What This Does

Chainhooks monitors blockchain events and sends webhooks when:
- ✅ Credentials are issued
- ✅ Credentials are verified
- ✅ Credentials are revoked
- ✅ Institutions are registered

This helps you score on the leaderboard by tracking:
- Users (credential issuance)
- Fees (transaction costs)
- Activity (GitHub + Chainhooks)

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```env
STACKS_NETWORK=testnet
DEPLOYER_ADDRESS=your_address
WEBHOOK_URL=http://localhost:3000
WEBHOOK_SECRET=your-secret-key
```

### 3. Start Webhook Server
```bash
npm run webhook
```

Server runs on: `http://localhost:3000`

### 4. Register Chainhooks
```bash
npm run chainhooks register
```

This registers 4 hooks:
- Credential Issued
- Credential Verified
- Credential Revoked
- Institution Registered

### 5. Monitor Events

```bash
# View statistics
curl http://localhost:3000/stats

# Health check
curl http://localhost:3000/health

# List registered hooks
npm run chainhooks list
```

## 🎯 Commands

### Register Hooks
```bash
npm run chainhooks register
```

Registers all 4 hooks with Hiro Chainhooks service.

### List Hooks
```bash
npm run chainhooks list
```

Shows all registered hooks and their status.

### Get Hook Details
```bash
npm run chainhooks get <uuid>
```

Example:
```bash
npm run chainhooks get certifi-credential-issued
```

### Delete Hook
```bash
npm run chainhooks delete <uuid>
```

Example:
```bash
npm run chainhooks delete certifi-credential-issued
```

## 📊 Webhook Endpoints

### Health Check
```bash
GET /health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-12-16T..."
}
```

### Statistics
```bash
GET /stats
```

Response:
```json
{
  "credentialsIssued": 5,
  "credentialsVerified": 3,
  "credentialsRevoked": 1,
  "institutionsRegistered": 2,
  "totalEvents": 11,
  "uptime": 3600,
  "timestamp": "2024-12-16T..."
}
```

### Webhook Events

**Credential Issued:**
```bash
POST /webhooks/credential-issued
Authorization: Bearer your-secret-key
Content-Type: application/json

{
  "txid": "0x...",
  "credentialId": 0,
  "student": "SP2...",
  "institution": 0
}
```

**Credential Verified:**
```bash
POST /webhooks/credential-verified
Authorization: Bearer your-secret-key

{
  "txid": "0x...",
  "credentialId": 0,
  "verifier": "SP2..."
}
```

**Credential Revoked:**
```bash
POST /webhooks/credential-revoked
Authorization: Bearer your-secret-key

{
  "txid": "0x...",
  "credentialId": 0,
  "reason": "Fraudulent"
}
```

**Institution Registered:**
```bash
POST /webhooks/institution-registered
Authorization: Bearer your-secret-key

{
  "txid": "0x...",
  "institutionId": 0,
  "name": "University of Lagos",
  "country": "Nigeria"
}
```

## 🔐 Security

### Set Authorization Secret
```env
WEBHOOK_SECRET=your-secure-secret-key
WEBHOOK_PORT=3000
```

### Verify Requests
All webhook requests include:
```
Authorization: Bearer your-secret-key
```

## 📈 Leaderboard Scoring

This integration helps you score on:

1. **Hiro Chainhooks Usage**
   - ✅ Configured chainhooks
   - ✅ Webhook handlers
   - ✅ Event tracking

2. **Users & Fees**
   - ✅ Track credential issuance (users)
   - ✅ Monitor transaction fees
   - ✅ Count verified credentials

3. **GitHub Contributions**
   - ✅ Public repo with Chainhooks
   - ✅ Webhook server code
   - ✅ Event tracking

## 🧪 Testing

### Test Webhook Locally
```bash
# Start webhook server
npm run webhook

# In another terminal, send test event
curl -X POST http://localhost:3000/webhooks/credential-issued \
  -H "Authorization: Bearer your-secret-key" \
  -H "Content-Type: application/json" \
  -d '{
    "txid": "0x123...",
    "credentialId": 0,
    "student": "SP2...",
    "institution": 0
  }'
```

### View Events
```bash
# Check statistics
curl http://localhost:3000/stats

# View saved events
cat deployments/events.json
```

## 📁 Files

- `scripts/chainhooks-config.json` - Chainhooks configuration
- `scripts/webhook-server.js` - Webhook handler server
- `deployments/events.json` - Saved events (auto-generated)

## 🔗 Resources

- [Hiro Chainhooks](https://docs.hiro.so/chainhooks)
- [Chainhooks CLI](https://github.com/hirosystems/chainhooks)
- [Stacks Builder Challenge](https://www.stacks.co/builders)

## 🎯 Next Steps

1. ✅ Start webhook server: `npm run webhook`
2. ✅ Configure chainhooks
3. ✅ Register hooks with Hiro
4. ✅ Monitor events
5. ✅ Track leaderboard score

## 📊 Example Stats

```json
{
  "credentialsIssued": 10,
  "credentialsVerified": 8,
  "credentialsRevoked": 1,
  "institutionsRegistered": 3,
  "totalEvents": 22,
  "uptime": 7200,
  "timestamp": "2024-12-16T12:00:00Z"
}
```

This shows:
- 10 users (credential issuance)
- Multiple transactions (fees)
- Active usage (leaderboard points)

---

**Ready to track events?** Start with `npm run webhook`!
