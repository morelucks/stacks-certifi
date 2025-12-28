import React from 'react'
import { useAccount, useSwitchChain } from 'wagmi'
import { mainnet, arbitrum } from '@reown/appkit/networks'

export function NetworkSwitcher() {
  const { chain, isConnected } = useAccount()
  const { switchChain } = useSwitchChain()

  if (!isConnected) {
    return null
  }

  return (
    <div style={{
      padding: '10px',
      backgroundColor: '#f5f5f5',
      borderRadius: '4px',
      marginBottom: '10px'
    }}>
      <label style={{ fontSize: '12px', marginRight: '10px' }}>Network:</label>
      <select
        value={chain?.id || mainnet.id}
        onChange={(e) => {
          const chainId = parseInt(e.target.value)
          switchChain({ chainId })
        }}
        style={{
          padding: '5px 10px',
          borderRadius: '4px',
          border: '1px solid #ddd',
          fontSize: '12px'
        }}
      >
        <option value={mainnet.id}>{mainnet.name}</option>
        <option value={arbitrum.id}>{arbitrum.name}</option>
      </select>
    </div>
  )
}

export default NetworkSwitcher

