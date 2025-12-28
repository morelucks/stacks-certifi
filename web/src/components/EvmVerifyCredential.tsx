import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import { useEvmCredential } from '../hooks/useEvmCredential'
import './VerifyCredential.css'

interface EvmVerifyCredentialProps {
  contractAddress: `0x${string}`
}

export function EvmVerifyCredential({ contractAddress }: EvmVerifyCredentialProps) {
  const { isConnected } = useAccount()
  const [credentialId, setCredentialId] = useState('')
  
  const { 
    verifyCredential, 
    isPending, 
    isSuccess, 
    isError, 
    error,
    transactionHash 
  } = useEvmCredential(contractAddress)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected) {
      alert('Please connect your EVM wallet first')
      return
    }

    try {
      await verifyCredential(parseInt(credentialId))
    } catch (err) {
      console.error('Error verifying credential:', err)
    }
  }

  if (!isConnected) {
    return (
      <div className="verify-credential">
        <p>⚠️ Please connect your EVM wallet to verify credentials</p>
      </div>
    )
  }

  return (
    <div className="verify-credential">
      <h2>Verify Credential (EVM)</h2>
      <p className="subtitle">Verify a credential using your EVM wallet</p>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="evm-credential-id">Credential ID *</label>
          <input
            type="number"
            id="evm-credential-id"
            value={credentialId}
            onChange={(e) => setCredentialId(e.target.value)}
            placeholder="0"
            min="0"
            required
          />
          <small>Enter the credential ID to verify</small>
        </div>

        {isSuccess && transactionHash && (
          <div className="message success">
            ✅ Credential verified! Transaction: {transactionHash}
          </div>
        )}

        {isError && (
          <div className="message error">
            ❌ Verification failed: {error?.message || 'Unknown error'}
          </div>
        )}

        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={isPending}
        >
          {isPending ? 'Verifying...' : '✔️ Verify Credential'}
        </button>
      </form>
    </div>
  )
}

export default EvmVerifyCredential

