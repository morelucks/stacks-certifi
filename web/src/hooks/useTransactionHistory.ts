import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'

interface Transaction {
  hash: string
  timestamp: number
  type: 'issue' | 'verify' | 'revoke'
  status: 'pending' | 'success' | 'failed'
}

export function useTransactionHistory() {
  const { address } = useAccount()
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    if (!address) {
      setTransactions([])
      return
    }

    const stored = localStorage.getItem(`transactions_${address}`)
    if (stored) {
      setTransactions(JSON.parse(stored))
    }
  }, [address])

  const addTransaction = (tx: Transaction) => {
    const updated = [tx, ...transactions].slice(0, 50) // Keep last 50
    setTransactions(updated)
    if (address) {
      localStorage.setItem(`transactions_${address}`, JSON.stringify(updated))
    }
  }

  const updateTransaction = (hash: string, status: 'success' | 'failed') => {
    const updated = transactions.map(tx =>
      tx.hash === hash ? { ...tx, status } : tx
    )
    setTransactions(updated)
    if (address) {
      localStorage.setItem(`transactions_${address}`, JSON.stringify(updated))
    }
  }

  return { transactions, addTransaction, updateTransaction }
}

