import React from 'react'
import { useAccount, useBalance, useChainId } from 'wagmi'
import { useConnect } from '@stacks/connect-react'

export function WalletStatus() {
  const { address: evmAddress, isConnected: isEvmConnected, chain } = useAccount()
  const { data: evmBalance } = useBalance({ address: evmAddress })
  const { isAuthenticated: isStacksConnected, userData } = useConnect()
  const chainId = useChainId()

  const stacksAddress = isStacksConnected && userData?.profile?.stxAddress
    ? (userData.profile.stxAddress.testnet || userData.profile.stxAddress.mainnet || '')
    : ''

  return (
    <div style={{
      padding: '15px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      marginBottom: '20px',
      fontSize: '14px'
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '15px' }}>🔗 Wallet Status</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div style={{ 
          padding: '10px', 
          backgroundColor: 'white', 
          borderRadius: '4px',
          border: isStacksConnected ? '2px solid #4CAF50' : '2px solid #ddd'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Stacks</div>
          {isStacksConnected ? (
            <>
              <div style={{ fontSize: '12px', color: '#666', wordBreak: 'break-all' }}>
                {stacksAddress.slice(0, 10)}...{stacksAddress.slice(-6)}
              </div>
              <div style={{ fontSize: '10px', color: '#4CAF50', marginTop: '5px' }}>
                ✅ Connected
              </div>
            </>
          ) : (
            <div style={{ fontSize: '12px', color: '#999' }}>Not connected</div>
          )}
        </div>

        <div style={{ 
          padding: '10px', 
          backgroundColor: 'white', 
          borderRadius: '4px',
          border: isEvmConnected ? '2px solid #4CAF50' : '2px solid #ddd'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>EVM</div>
          {isEvmConnected && evmAddress ? (
            <>
              <div style={{ fontSize: '12px', color: '#666', wordBreak: 'break-all' }}>
                {evmAddress.slice(0, 10)}...{evmAddress.slice(-6)}
              </div>
              {chain && (
                <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
                  {chain.name}
                </div>
              )}
              {evmBalance && (
                <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
                  {parseFloat(evmBalance.formatted).toFixed(4)} {evmBalance.symbol}
                </div>
              )}
              <div style={{ fontSize: '10px', color: '#4CAF50', marginTop: '5px' }}>
                ✅ Connected
              </div>
            </>
          ) : (
            <div style={{ fontSize: '12px', color: '#999' }}>Not connected</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WalletStatus

