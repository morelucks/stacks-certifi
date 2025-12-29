/**
 * Validate Ethereum address format
 */
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Validate Stacks address format
 */
export function isValidStacksAddress(address: string): boolean {
  return /^[SP][0-9A-Z]{38}$/.test(address)
}

/**
 * Format address for display
 */
export function formatAddress(address: string, start = 6, end = 4): string {
  if (!address) return ''
  if (address.length <= start + end) return address
  return `${address.slice(0, start)}...${address.slice(-end)}`
}

