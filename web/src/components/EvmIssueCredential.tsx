import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import { useEvmCredential } from '../hooks/useEvmCredential'
import { generateCredentialHash } from '../utils/credentialHash'
import './IssueCredential.css'

interface EvmIssueCredentialProps {
  contractAddress: `0x${string}`
}

export function EvmIssueCredential({ contractAddress }: EvmIssueCredentialProps) {
  const { isConnected, address } = useAccount()
  const [formData, setFormData] = useState({
    studentAddress: '',
    institutionId: '0',
    credentialType: '',
    credentialData: '',
    metadataUri: '',
  })
  const [expiryDate, setExpiryDate] = useState('')
  
  const { 
    issueCredential, 
    isPending, 
    isSuccess, 
    isError, 
    error,
    transactionHash 
  } = useEvmCredential(contractAddress)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected) {
      alert('Please connect your EVM wallet first')
      return
    }

    try {
      const credentialHash = await generateCredentialHash(formData.credentialData)
      const expiry = expiryDate ? BigInt(Math.floor(new Date(expiryDate).getTime() / 1000)) : BigInt(0)

      await issueCredential(
        formData.studentAddress,
        parseInt(formData.institutionId),
        formData.credentialType,
        credentialHash,
        expiry,
        formData.metadataUri || 'https://metadata.example.com'
      )
    } catch (err) {
      console.error('Error issuing credential:', err)
    }
  }

  if (!isConnected) {
    return (
      <div className="issue-credential">
        <p>⚠️ Please connect your EVM wallet to issue credentials</p>
      </div>
    )
  }

  return (
    <div className="issue-credential">
      <h2>Issue Credential (EVM)</h2>
      <p className="subtitle">Create a new credential using your EVM wallet</p>
      <p style={{ fontSize: '12px', color: '#666' }}>
        Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
      </p>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="evm-student-address">Student Address *</label>
          <input
            type="text"
            id="evm-student-address"
            name="studentAddress"
            placeholder="0x..."
            value={formData.studentAddress}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="evm-institution-id">Institution ID *</label>
          <input
            type="number"
            id="evm-institution-id"
            name="institutionId"
            value={formData.institutionId}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="evm-credential-type">Credential Type *</label>
          <input
            type="text"
            id="evm-credential-type"
            name="credentialType"
            placeholder="Bachelor of Science"
            value={formData.credentialType}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="evm-credential-data">Credential Data *</label>
          <textarea
            id="evm-credential-data"
            name="credentialData"
            placeholder="Student: John Doe, Program: BSc CS, Year: 2024"
            value={formData.credentialData}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="evm-expiry-date">Expiry Date (optional)</label>
          <input
            type="date"
            id="evm-expiry-date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="evm-metadata-uri">Metadata URI</label>
          <input
            type="url"
            id="evm-metadata-uri"
            name="metadataUri"
            placeholder="https://metadata.example.com/credential-001"
            value={formData.metadataUri}
            onChange={handleChange}
          />
        </div>

        {isSuccess && transactionHash && (
          <div className="message success">
            ✅ Credential issued! Transaction: {transactionHash}
          </div>
        )}

        {isError && (
          <div className="message error">
            ❌ Transaction failed: {error?.message || 'Unknown error'}
          </div>
        )}

        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={isPending}
        >
          {isPending ? 'Processing...' : '🎓 Issue Credential'}
        </button>
      </form>
    </div>
  )
}

export default EvmIssueCredential

