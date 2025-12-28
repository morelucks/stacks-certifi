/**
 * Contract addresses configuration
 * Update these with your deployed contract addresses
 */

export const CONTRACTS = {
  // EVM contract addresses (update after deployment)
  CREDENTIALS: {
    MAINNET: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    ARBITRUM: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    TESTNET: '0x0000000000000000000000000000000000000000' as `0x${string}`,
  },
  INSTITUTIONS: {
    MAINNET: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    ARBITRUM: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    TESTNET: '0x0000000000000000000000000000000000000000' as `0x${string}`,
  },
  // Stacks contract addresses
  STACKS: {
    CREDENTIALS: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.certifi-credentials',
    INSTITUTIONS: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.certifi-institutions',
  },
} as const

/**
 * Get contract address based on current chain
 */
export function getContractAddress(chainId?: number): `0x${string}` {
  // Default to testnet for now
  return CONTRACTS.CREDENTIALS.TESTNET
}

