import { useCallback, useMemo, useState } from 'react'
import type { ReceiptResult, ReceiptStatus } from '@/types/receipt'

interface CompletedReceipt {
  receiptId: string
  fileName?: string
  status: Extract<ReceiptStatus, 'APPROVED' | 'REJECTED' | 'COMPLETED'>
  result?: ReceiptResult
  completedAt: number
  totalItems: number
  totalAmount: number
}

const STORAGE_KEY = 'pricemate_receipt_history'
const MAX_HISTORY = 50

function load(): CompletedReceipt[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

export function useReceiptHistory() {
  const [history, setHistory] = useState<CompletedReceipt[]>(load)

  const addToHistory = useCallback(
    (
      receiptId: string,
      fileName: string | undefined,
      status: CompletedReceipt['status'],
      result?: ReceiptResult
    ) => {
      const completedReceipt: CompletedReceipt = {
        receiptId,
        fileName,
        status,
        result,
        completedAt: Date.now(),
        totalItems: result?.items?.length ?? 0,
        totalAmount: result?.totalAmount ?? 0,
      }

      setHistory((prev) => {
        const filtered = prev.filter((r) => r.receiptId !== receiptId)
        const newHistory = [completedReceipt, ...filtered]
        const trimmed = newHistory.slice(0, MAX_HISTORY)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
        return trimmed
      })
    },
    []
  )

  const updateHistory = useCallback(
    (receiptId: string, result: ReceiptResult) => {
      setHistory((prev) => {
        const next = prev.map((r) =>
          r.receiptId === receiptId
            ? { ...r, result, totalItems: result.items.length, totalAmount: result.totalAmount }
            : r
        )
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        return next
      })
    },
    []
  )

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setHistory([])
  }, [])

  const removeFromHistory = useCallback(
    (receiptId: string) => {
      setHistory((prev) => {
        const filtered = prev.filter((r) => r.receiptId !== receiptId)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
        return filtered
      })
    },
    []
  )

  // Calculate statistics
  const stats = useMemo(() => {
    const approved = history.filter((r) => r.status === 'APPROVED' || r.status === 'COMPLETED')
    const rejected = history.filter((r) => r.status === 'REJECTED')

    return {
      total: history.length,
      approved: approved.length,
      rejected: rejected.length,
      totalItemsSubmitted: approved.reduce((sum, r) => sum + r.totalItems, 0),
      totalAmountTracked: approved.reduce((sum, r) => sum + r.totalAmount, 0),
      contributionStreak: calculateStreak(approved),
      recentApproved: approved.slice(0, 5),
    }
  }, [history])

  return {
    history,
    addToHistory,
    updateHistory,
    removeFromHistory,
    clearHistory,
    stats,
  }
}

function calculateStreak(approved: CompletedReceipt[]): number {
  if (approved.length === 0) return 0

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let streak = 0
  let checkDate = today

  for (let i = 0; i < 365; i++) {
    const hasReceiptOnDate = approved.some((r) => {
      const receiptDate = new Date(r.completedAt)
      receiptDate.setHours(0, 0, 0, 0)
      return receiptDate.getTime() === checkDate.getTime()
    })

    if (hasReceiptOnDate) {
      streak++
      checkDate = new Date(checkDate.getTime() - 24 * 60 * 60 * 1000)
    } else if (i === 0) {
      // No receipt today, check yesterday
      checkDate = new Date(checkDate.getTime() - 24 * 60 * 60 * 1000)
    } else {
      break
    }
  }

  return streak
}

export type { CompletedReceipt }
