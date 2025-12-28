import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseAbi } from 'viem'

const CREDENTIALS_ABI = parseAbi([
  'function issueCredential(address, uint256, string, bytes32, uint256, string) returns (uint256)',
  'function verifyCredential(uint256) returns (bool)',
  'function revokeCredential(uint256, string) returns (bool)',
])

export function useEvmCredential(contractAddress: `0x${string}`) {
  const { address, isConnected } = useAccount()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({ hash })

  const issueCredential = async (
    studentAddress: string,
    institutionId: number,
    credentialType: string,
    credentialHash: Uint8Array,
    expiryDate: bigint,
    metadataUri: string
  ) => {
    if (!isConnected) {
      throw new Error('Wallet not connected')
    }

    writeContract({
      address: contractAddress,
      abi: CREDENTIALS_ABI,
      functionName: 'issueCredential',
      args: [
        studentAddress as `0x${string}`,
        BigInt(institutionId),
        credentialType,
        credentialHash,
        expiryDate,
        metadataUri,
      ],
    })
  }

  const verifyCredential = async (credentialId: number) => {
    if (!isConnected) {
      throw new Error('Wallet not connected')
    }

    writeContract({
      address: contractAddress,
      abi: CREDENTIALS_ABI,
      functionName: 'verifyCredential',
      args: [BigInt(credentialId)],
    })
  }

  const revokeCredential = async (credentialId: number, reason: string) => {
    if (!isConnected) {
      throw new Error('Wallet not connected')
    }

    writeContract({
      address: contractAddress,
      abi: CREDENTIALS_ABI,
      functionName: 'revokeCredential',
      args: [BigInt(credentialId), reason],
    })
  }

  return {
    issueCredential,
    verifyCredential,
    revokeCredential,
    isPending: isPending || isLoading,
    isSuccess,
    isError,
    error,
    transactionHash: hash,
  }
}

