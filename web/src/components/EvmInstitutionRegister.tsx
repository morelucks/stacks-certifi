import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import { useEvmInstitution } from '../hooks/useEvmInstitution'
import { getContractAddress } from '../config/contracts'
import TransactionStatus from './TransactionStatus'

export function EvmInstitutionRegister() {
  const { isConnected } = useAccount()
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    registrationNumber: '',
    metadataUri: '',
  })
  
  const { 
    registerInstitution, 
    isPending, 
    transactionHash 
  } = useEvmInstitution(getContractAddress())

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      await registerInstitution(
        formData.name,
        formData.country,
        formData.registrationNumber,
        formData.metadataUri || 'https://metadata.example.com'
      )
    } catch (err) {
      console.error('Error registering institution:', err)
    }
  }

  if (!isConnected) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>⚠️ Please connect your EVM wallet to register an institution</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
      <h3>Register Institution (EVM)</h3>
      <form onSubmit={handleSubmit} style={{ marginTop: '15px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
            Institution Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
            Country *
          </label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
            Registration Number *
          </label>
          <input
            type="text"
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
            Metadata URI
          </label>
          <input
            type="url"
            name="metadataUri"
            value={formData.metadataUri}
            onChange={handleChange}
            placeholder="https://metadata.example.com"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>

        <TransactionStatus 
          hash={transactionHash}
          onSuccess={() => {
            setFormData({
              name: '',
              country: '',
              registrationNumber: '',
              metadataUri: '',
            })
          }}
        />

        <button
          type="submit"
          disabled={isPending}
          style={{
            padding: '10px 20px',
            backgroundColor: isPending ? '#ccc' : '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isPending ? 'not-allowed' : 'pointer',
            fontSize: '14px'
          }}
        >
          {isPending ? 'Registering...' : 'Register Institution'}
        </button>
      </form>
    </div>
  )
}

export default EvmInstitutionRegister

