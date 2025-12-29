import React from 'react'
import { useTransactionHistory } from '../hooks/useTransactionHistory'
import { formatAddress } from '../utils/addressValidation'

export function TransactionHistory() {
  const { transactions } = useTransactionHistory()

  if (transactions.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
        No transactions yet
      </div>
    )
  }

  return (
    <div style={{ padding: '15px' }}>
      <h3 style={{ marginTop: 0 }}>Transaction History</h3>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {transactions.map((tx, index) => (
          <div
            key={index}
            style={{
              padding: '10px',
              marginBottom: '10px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              borderLeft: `4px solid ${
                tx.status === 'success' ? '#4CAF50' :
                tx.status === 'failed' ? '#f44336' : '#FFC107'
              }`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                  {tx.type.toUpperCase()}
                </div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  {formatAddress(tx.hash)}
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {new Date(tx.timestamp).toLocaleTimeString()}
              </div>
            </div>
            <div style={{ 
              fontSize: '11px', 
              marginTop: '5px',
              color: tx.status === 'success' ? '#4CAF50' : tx.status === 'failed' ? '#f44336' : '#FFC107'
            }}>
              {tx.status === 'pending' ? '⏳ Pending' : tx.status === 'success' ? '✅ Success' : '❌ Failed'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TransactionHistory

