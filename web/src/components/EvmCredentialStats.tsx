import React from 'react'
import { useReadContract } from 'wagmi'
import { parseAbi } from 'viem'

const CREDENTIALS_ABI = parseAbi([
  'function getTotalIssued() view returns (uint256)',
  'function getTotalRevoked() view returns (uint256)',
  'function getTotalActive() view returns (uint256)',
])

interface EvmCredentialStatsProps {
  contractAddress: `0x${string}`
}

export function EvmCredentialStats({ contractAddress }: EvmCredentialStatsProps) {
  const { data: totalIssued, isLoading: loadingIssued } = useReadContract({
    address: contractAddress,
    abi: CREDENTIALS_ABI,
    functionName: 'getTotalIssued',
  })

  const { data: totalRevoked, isLoading: loadingRevoked } = useReadContract({
    address: contractAddress,
    abi: CREDENTIALS_ABI,
    functionName: 'getTotalRevoked',
  })

  const { data: totalActive, isLoading: loadingActive } = useReadContract({
    address: contractAddress,
    abi: CREDENTIALS_ABI,
    functionName: 'getTotalActive',
  })

  if (loadingIssued || loadingRevoked || loadingActive) {
    return <div>Loading credential statistics...</div>
  }

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f5f5f5', 
      borderRadius: '8px',
      margin: '20px 0'
    }}>
      <h3 style={{ marginTop: 0 }}>📊 EVM Credential Statistics</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
        <div style={{ 
          padding: '15px', 
          backgroundColor: 'white', 
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196F3' }}>
            {totalIssued?.toString() || '0'}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            Total Issued
          </div>
        </div>
        <div style={{ 
          padding: '15px', 
          backgroundColor: 'white', 
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f44336' }}>
            {totalRevoked?.toString() || '0'}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            Total Revoked
          </div>
        </div>
        <div style={{ 
          padding: '15px', 
          backgroundColor: 'white', 
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>
            {totalActive?.toString() || '0'}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            Total Active
          </div>
        </div>
      </div>
    </div>
  )
}

export default EvmCredentialStats

