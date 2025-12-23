import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum } from '@reown/appkit/networks'

// Vite env var: define VITE_REOWN_PROJECT_ID in your .env file
// Fallback to a placeholder so the UI can still render if it's missing.
export const projectId =
  (import.meta.env.VITE_REOWN_PROJECT_ID as string | undefined) ?? 'demo-appkit-project-id'

export const networks = [mainnet, arbitrum]

export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks
})

export const wagmiConfig = wagmiAdapter.wagmiConfig


