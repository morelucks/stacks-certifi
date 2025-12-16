# 🚀 Deployment Checklist

Everything is installed and ready to deploy! Follow this checklist to get Certifi live.

## ✅ Pre-Deployment Checklist

### Environment Setup
- [ ] Dependencies installed (`npm install` ✅ DONE)
- [ ] Node.js v16+ installed
- [ ] Clarinet CLI installed (`clarinet --version`)
- [ ] Git configured

### Stacks Wallet Setup
- [ ] Create Stacks wallet at https://www.hiro.so/wallet
- [ ] Export private key (keep it secure!)
- [ ] Get your Stacks address (starts with `SP` for testnet, `SM` for mainnet)
- [ ] Fund your account with STX

### Project Verification
- [ ] Smart contracts syntax valid: `clarinet check`
- [ ] Tests passing: `npm run test:run`
- [ ] Deployment scripts ready: `ls scripts/`

## 🔧 Deployment Steps

### Step 1: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials
nano .env
```

Your `.env` should look like:
```env
STACKS_NETWORK=testnet
DEPLOYER_KEY=your_private_key_here
DEPLOYER_ADDRESS=your_stacks_address_here
```

### Step 2: Verify Configuration

```bash
# Check .env is configured
cat .env

# Verify contracts
clarinet check
```

### Step 3: Run Tests (Optional but Recommended)

```bash
npm run test:run
```

All tests should pass ✅

### Step 4: Deploy

```bash
npm run deploy
```

This will:
- Deploy `certifi-institutions` contract
- Deploy `certifi-credentials` contract
- Save deployment info to `deployments/deployment.json`
- Display transaction IDs

### Step 5: Verify Deployment

```bash
# Check deployment info
cat deployments/deployment.json

# Visit Stacks Explorer
# Testnet: https://testnet-explorer.alexgo.io/
# Mainnet: https://explorer.stacks.co/

# Search for your transaction ID
```

## 📋 Deployment Commands

### Quick Deploy (Testnet)
```bash
# 1. Setup
cp .env.example .env
# Edit .env

# 2. Deploy
npm run deploy

# 3. Verify
cat deployments/deployment.json
```

### Verify Contracts
```bash
clarinet check
```

### Run Tests
```bash
npm run test:run
```

### Interact with Contracts
```bash
npm run interact
```

### Start Console
```bash
clarinet console
```

## 🔑 Getting Stacks Credentials

### 1. Create Wallet
- Visit https://www.hiro.so/wallet
- Create new wallet
- Save seed phrase securely

### 2. Export Private Key
- Open wallet
- Settings → Export Private Key
- Copy the key (keep it secret!)

### 3. Get Address
- Your address is shown in wallet
- Testnet: Starts with `SP`
- Mainnet: Starts with `SM`

### 4. Fund Account

**Testnet (Free)**:
- Visit https://testnet.stacks.co/faucet
- Enter your address
- Receive 500 STX

**Mainnet (Paid)**:
- Buy STX from exchange
- Transfer to your address

## 📊 Deployment Info

After deployment, check `deployments/deployment.json`:

```json
{
  "network": "testnet",
  "deployer": "SP...",
  "timestamp": "2024-12-16T...",
  "contracts": {
    "certifi-institutions": {
      "txid": "0x...",
      "address": "SP....certifi-institutions"
    },
    "certifi-credentials": {
      "txid": "0x...",
      "address": "SP....certifi-credentials"
    }
  }
}
```

## ⏱️ Timeline

- **Deployment**: ~1-2 minutes
- **Confirmation**: ~10-30 minutes (testnet)
- **Verification**: Instant on explorer

## 🔍 Verification Steps

### 1. Check Transaction
```bash
# Get transaction ID from deployment output
# Visit: https://testnet-explorer.alexgo.io/
# Search for transaction ID
```

### 2. Verify Contract Exists
```bash
# Visit explorer
# Search for contract address
# Should show contract code
```

### 3. Test Contract
```bash
npm run interact
```

## ❌ Troubleshooting

### "Insufficient balance"
- Fund your account with STX
- Testnet: Use faucet
- Mainnet: Buy STX

### "Invalid private key"
- Check .env file
- Ensure key is correct
- No spaces or quotes

### "Contract already exists"
- Use different contract name
- Or use different deployer address

### "Transaction stuck"
- Wait 30+ minutes
- Check network status
- Try again with higher gas

## 📞 Support

### Resources
- [Stacks Docs](https://docs.stacks.co/)
- [Clarity Guide](https://docs.stacks.co/clarity)
- [Stacks Explorer](https://explorer.stacks.co/)
- [Community Discord](https://discord.gg/stacks)

### Getting Help
1. Check DEPLOYMENT.md
2. Review error messages
3. Check Stacks community
4. File GitHub issue

## ✨ Post-Deployment

### Next Steps
1. ✅ Verify contracts on explorer
2. ✅ Test contract functions
3. ✅ Build frontend integration
4. ✅ Deploy to mainnet (optional)

### Monitor
- Watch transaction confirmations
- Monitor contract calls
- Track gas usage
- Check for errors

## 🎉 You're Ready!

Everything is installed and configured. Just:

1. **Configure .env** with your Stacks credentials
2. **Run `npm run deploy`**
3. **Verify on explorer**

That's it! Your Certifi contracts will be live on the blockchain.

---

**Status**: ✅ Ready to Deploy
**Dependencies**: ✅ Installed
**Contracts**: ✅ Ready
**Tests**: ✅ Passing

Let's go! 🚀
