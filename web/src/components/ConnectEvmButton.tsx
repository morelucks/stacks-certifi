import React from 'react'
import { useAccount, useDisconnect, useBalance } from 'wagmi'
import { AppKitButton } from '@reown/appkit/react'

export function ConnectEvmButton() {
  const { address, isConnected, chain } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({ address })

  if (isConnected && address) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px',
        flexWrap: 'wrap'
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'flex-end',
          fontSize: '12px',
          color: '#666'
        }}>
          <span style={{ fontWeight: 'bold', color: '#333' }}>
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          {chain && (
            <span style={{ fontSize: '10px' }}>
              {chain.name}
            </span>
          )}
          {balance && (
            <span style={{ fontSize: '10px' }}>
              {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
            </span>
          )}
        </div>
        <button
          onClick={() => disconnect()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            whiteSpace: 'nowrap'
          }}
        >
          Disconnect
        </button>
      </div>
    )
  }

  return <AppKitButton />
}

export default ConnectEvmButton


