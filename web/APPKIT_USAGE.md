# Reown AppKit Usage Guide

## Overview

Your Certifi app uses **Reown AppKit** (formerly WalletConnect AppKit) for EVM wallet connections. This guide shows you how to use it effectively.

## Current Setup

✅ **Already Configured:**
- AppKit initialized with Wagmi adapter
- Project ID configured: `c1dc4b0362e2b28bb3c6940377e76c81`
- Networks: Mainnet, Arbitrum
- Provider wrapped around your app

## Basic Usage

### 1. Connect Button (Already Implemented)

```tsx
import { AppKitButton } from '@reown/appkit/react'

// Simple usage - opens the wallet connection modal
<AppKitButton />
```

### 2. Check Wallet Connection Status

```tsx
import { useAccount, useDisconnect } from 'wagmi'

function MyComponent() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <div>
        <p>Connected: {address}</p>
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    )
  }

  return <p>Not connected</p>
}
```

### 3. Get Connected Wallet Info

```tsx
import { useAccount, useBalance } from 'wagmi'

function WalletInfo() {
  const { address, isConnected, chain } = useAccount()
  const { data: balance } = useBalance({ address })

  if (!isConnected) return <p>Please connect your wallet</p>

  return (
    <div>
      <p>Address: {address}</p>
      <p>Chain: {chain?.name}</p>
      <p>Balance: {balance?.formatted} {balance?.symbol}</p>
    </div>
  )
}
```

## Smart Contract Interactions

### Reading from Contracts

```tsx
import { useReadContract } from 'wagmi'
import { parseAbi } from 'viem'

// Example: Read total credentials issued
const CREDENTIALS_CONTRACT = '0x...' // Your contract address

const abi = parseAbi([
  'function getTotalIssued() view returns (uint256)',
  'function getCredential(uint256) view returns (tuple)',
])

function CredentialStats() {
  const { data: totalIssued } = useReadContract({
    address: CREDENTIALS_CONTRACT,
    abi: abi,
    functionName: 'getTotalIssued',
  })

  return <p>Total Credentials: {totalIssued?.toString()}</p>
}
```

### Writing to Contracts (Transactions)

```tsx
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseAbi } from 'viem'

const abi = parseAbi([
  'function issueCredential(address, uint256, string, bytes32, uint256, string) returns (uint256)',
])

function IssueCredentialForm() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash })

  const handleIssue = async () => {
    writeContract({
      address: CREDENTIALS_CONTRACT,
      abi: abi,
      functionName: 'issueCredential',
      args: [
        studentAddress,
        institutionId,
        credentialType,
        credentialHash,
        expiryDate,
        metadataUri,
      ],
    })
  }

  return (
    <div>
      <button onClick={handleIssue} disabled={isPending}>
        {isPending ? 'Issuing...' : 'Issue Credential'}
      </button>
      {isSuccess && <p>✅ Credential issued successfully!</p>}
    </div>
  )
}
```

## Advanced Usage

### Switch Networks

```tsx
import { useSwitchChain } from 'wagmi'
import { arbitrum } from '@reown/appkit/networks'

function NetworkSwitcher() {
  const { switchChain } = useSwitchChain()

  return (
    <button onClick={() => switchChain({ chainId: arbitrum.id })}>
      Switch to Arbitrum
    </button>
  )
}
```

### Sign Messages

```tsx
import { useSignMessage } from 'wagmi'

function SignMessageButton() {
  const { signMessage, isPending } = useSignMessage()

  const handleSign = () => {
    signMessage({
      message: 'I verify this credential',
    })
  }

  return (
    <button onClick={handleSign} disabled={isPending}>
      Sign Message
    </button>
  )
}
```

### Custom Modal Control

```tsx
import { useAppKit } from '@reown/appkit/react'

function CustomConnectButton() {
  const { open } = useAppKit()

  return (
    <button onClick={() => open()}>
      Connect Wallet
    </button>
  )
}
```

## Integration Examples for Certifi

### Example 1: Enhanced Connect Button with Status

```tsx
// web/src/components/EnhancedEvmButton.tsx
import React from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { AppKitButton } from '@reown/appkit/react'

export function EnhancedEvmButton() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  if (isConnected && address) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '12px' }}>
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <button onClick={() => disconnect()}>
          Disconnect
        </button>
      </div>
    )
  }

  return <AppKitButton />
}
```

### Example 2: Read Credential Stats

```tsx
// web/src/components/EvmCredentialStats.tsx
import { useReadContract } from 'wagmi'
import { parseAbi } from 'viem'

const CREDENTIALS_ABI = parseAbi([
  'function getTotalIssued() view returns (uint256)',
  'function getTotalRevoked() view returns (uint256)',
  'function getTotalActive() view returns (uint256)',
])

export function EvmCredentialStats({ contractAddress }: { contractAddress: `0x${string}` }) {
  const { data: totalIssued } = useReadContract({
    address: contractAddress,
    abi: CREDENTIALS_ABI,
    functionName: 'getTotalIssued',
  })

  const { data: totalRevoked } = useReadContract({
    address: contractAddress,
    abi: CREDENTIALS_ABI,
    functionName: 'getTotalRevoked',
  })

  const { data: totalActive } = useReadContract({
    address: contractAddress,
    abi: CREDENTIALS_ABI,
    functionName: 'getTotalActive',
  })

  return (
    <div>
      <h3>Credential Statistics</h3>
      <p>Total Issued: {totalIssued?.toString() || '0'}</p>
      <p>Total Revoked: {totalRevoked?.toString() || '0'}</p>
      <p>Total Active: {totalActive?.toString() || '0'}</p>
    </div>
  )
}
```

### Example 3: Issue Credential with EVM Wallet

```tsx
// web/src/components/EvmIssueCredential.tsx
import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseAbi } from 'viem'

const CREDENTIALS_ABI = parseAbi([
  'function issueCredential(address, uint256, string, bytes32, uint256, string) returns (uint256)',
])

export function EvmIssueCredential({ contractAddress }: { contractAddress: `0x${string}` }) {
  const { address, isConnected } = useAccount()
  const [studentAddress, setStudentAddress] = useState('')
  const [institutionId, setInstitutionId] = useState('')
  const [credentialType, setCredentialType] = useState('')

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({ hash })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected) {
      alert('Please connect your wallet first')
      return
    }

    // Generate credential hash (simplified - use proper hashing in production)
    const credentialHash = new Uint8Array(32) // Replace with actual hash

    writeContract({
      address: contractAddress,
      abi: CREDENTIALS_ABI,
      functionName: 'issueCredential',
      args: [
        studentAddress as `0x${string}`,
        BigInt(institutionId),
        credentialType,
        credentialHash,
        BigInt(0), // expiry date (0 = none)
        'https://metadata.example.com',
      ],
    })
  }

  if (!isConnected) {
    return <p>Please connect your EVM wallet to issue credentials</p>
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Student Address"
        value={studentAddress}
        onChange={(e) => setStudentAddress(e.target.value)}
      />
      <input
        type="number"
        placeholder="Institution ID"
        value={institutionId}
        onChange={(e) => setInstitutionId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Credential Type"
        value={credentialType}
        onChange={(e) => setCredentialType(e.target.value)}
      />
      <button type="submit" disabled={isPending || isLoading}>
        {isPending || isLoading ? 'Processing...' : 'Issue Credential'}
      </button>
      {isSuccess && <p>✅ Credential issued! Transaction: {hash}</p>}
      {isError && <p>❌ Transaction failed</p>}
    </form>
  )
}
```

## Available Wagmi Hooks

### Connection Hooks
- `useAccount()` - Get connected account info
- `useConnect()` - Connect to wallet
- `useDisconnect()` - Disconnect wallet
- `useSwitchChain()` - Switch networks

### Contract Hooks
- `useReadContract()` - Read from contracts
- `useWriteContract()` - Write to contracts
- `useWaitForTransactionReceipt()` - Wait for transaction confirmation
- `useWatchContractEvent()` - Watch contract events

### Utility Hooks
- `useBalance()` - Get account balance
- `useBlockNumber()` - Get current block number
- `useSignMessage()` - Sign messages
- `useSignTypedData()` - Sign typed data (EIP-712)

## Best Practices

1. **Always check connection status** before contract interactions
2. **Handle errors gracefully** - wallet operations can fail
3. **Show loading states** during transactions
4. **Wait for confirmations** before updating UI
5. **Use TypeScript** for type safety with contract ABIs
6. **Validate addresses** before using them
7. **Handle network mismatches** - check if user is on correct network

## Resources

- [Reown AppKit Docs](https://docs.reown.com/appkit)
- [Wagmi Docs](https://wagmi.sh)
- [Viem Docs](https://viem.sh)
- [Your Project Dashboard](https://dashboard.reown.com)

## Next Steps

1. Add contract ABIs for your Certifi contracts
2. Implement credential issuance with EVM wallets
3. Add network switching for testnet/mainnet
4. Implement credential verification with EVM wallets
5. Add transaction history/status tracking

