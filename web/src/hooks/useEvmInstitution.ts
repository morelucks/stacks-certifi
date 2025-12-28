import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { parseAbi } from 'viem'

const INSTITUTIONS_ABI = parseAbi([
  'function registerInstitution(string, string, string, string) returns (uint256)',
  'function getInstitution(uint256) view returns (tuple)',
  'function isInstitutionVerified(uint256) view returns (bool)',
  'function getInstitutionCount() view returns (uint256)',
])

export function useEvmInstitution(contractAddress: `0x${string}`) {
  const { address, isConnected } = useAccount()
  const { writeContract, data: hash, isPending } = useWriteContract()

  const registerInstitution = async (
    name: string,
    country: string,
    registrationNumber: string,
    metadataUri: string
  ) => {
    if (!isConnected) {
      throw new Error('Wallet not connected')
    }

    writeContract({
      address: contractAddress,
      abi: INSTITUTIONS_ABI,
      functionName: 'registerInstitution',
      args: [name, country, registrationNumber, metadataUri],
    })
  }

  const getInstitution = (institutionId: number) => {
    return useReadContract({
      address: contractAddress,
      abi: INSTITUTIONS_ABI,
      functionName: 'getInstitution',
      args: [BigInt(institutionId)],
    })
  }

  const isInstitutionVerified = (institutionId: number) => {
    return useReadContract({
      address: contractAddress,
      abi: INSTITUTIONS_ABI,
      functionName: 'isInstitutionVerified',
      args: [BigInt(institutionId)],
    })
  }

  return {
    registerInstitution,
    getInstitution,
    isInstitutionVerified,
    isPending,
    transactionHash: hash,
  }
}

