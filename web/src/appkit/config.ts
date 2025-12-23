import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum } from '@reown/appkit/networks'

// Vite env var: define VITE_REOWN_PROJECT_ID in your .env file
export const projectId = import.meta.env.VITE_REOWN_PROJECT_ID as string | undefined

if (!projectId) {
  throw new Error('VITE_REOWN_PROJECT_ID is not defined')
}

export const networks = [mainnet, arbitrum]

export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks
})

export const wagmiConfig = wagmiAdapter.wagmiConfig


