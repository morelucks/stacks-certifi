import React from 'react'
import { useWaitForTransactionReceipt } from 'wagmi'

interface TransactionStatusProps {
  hash: `0x${string}` | undefined
  onSuccess?: () => void
  onError?: () => void
}

export function TransactionStatus({ hash, onSuccess, onError }: TransactionStatusProps) {
  const { isLoading, isSuccess, isError, error } = useWaitForTransactionReceipt({ hash })

  React.useEffect(() => {
    if (isSuccess && onSuccess) {
      onSuccess()
    }
    if (isError && onError) {
      onError()
    }
  }, [isSuccess, isError, onSuccess, onError])

  if (!hash) return null

  if (isLoading) {
    return (
      <div style={{
        padding: '10px',
        backgroundColor: '#e3f2fd',
        borderRadius: '4px',
        marginTop: '10px'
      }}>
        ⏳ Transaction pending... <a 
          href={`https://etherscan.io/tx/${hash}`} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ fontSize: '12px', marginLeft: '10px' }}
        >
          View on Etherscan
        </a>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div style={{
        padding: '10px',
        backgroundColor: '#e8f5e9',
        borderRadius: '4px',
        marginTop: '10px'
      }}>
        ✅ Transaction confirmed! <a 
          href={`https://etherscan.io/tx/${hash}`} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ fontSize: '12px', marginLeft: '10px' }}
        >
          View on Etherscan
        </a>
      </div>
    )
  }

  if (isError) {
    return (
      <div style={{
        padding: '10px',
        backgroundColor: '#ffebee',
        borderRadius: '4px',
        marginTop: '10px'
      }}>
        ❌ Transaction failed: {error?.message || 'Unknown error'}
      </div>
    )
  }

  return null
}

export default TransactionStatus

