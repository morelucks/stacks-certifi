import React from 'react'
import { useReadContract } from 'wagmi'
import { parseAbi } from 'viem'

const CREDENTIALS_ABI = parseAbi([
  'function getCredential(uint256) view returns (tuple)',
])

interface EvmCredentialDetailsProps {
  contractAddress: `0x${string}`
  credentialId: number
}

export function EvmCredentialDetails({ contractAddress, credentialId }: EvmCredentialDetailsProps) {
  const { data: credential, isLoading, isError } = useReadContract({
    address: contractAddress,
    abi: CREDENTIALS_ABI,
    functionName: 'getCredential',
    args: [BigInt(credentialId)],
  })

  if (isLoading) {
    return <div>Loading credential details...</div>
  }

  if (isError || !credential) {
    return <div>Credential not found</div>
  }

  return (
    <div style={{
      padding: '15px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      marginTop: '10px'
    }}>
      <h4>Credential Details</h4>
      <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
        <div><strong>ID:</strong> {credentialId}</div>
        <div><strong>Type:</strong> {credential[2]}</div>
        <div><strong>Status:</strong> {credential[6] === 0 ? 'Active' : credential[6] === 1 ? 'Revoked' : 'Expired'}</div>
      </div>
    </div>
  )
}

export default EvmCredentialDetails

