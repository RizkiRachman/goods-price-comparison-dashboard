import { useCallback, useEffect } from 'react'
import { useReceiptJobs } from './useReceiptJobs'
import { useReceiptHistory } from './useReceiptHistory'
import type { ReceiptStatus } from '@/types/receipt'

const TERMINAL_STATUSES: ReceiptStatus[] = [
  'COMPLETED',
  'APPROVED',
  'REJECTED',
  'FAILED',
  'INGESTION_FAILED',
]

function isTerminal(status: ReceiptStatus) {
  return TERMINAL_STATUSES.includes(status)
}

export function useReceiptManager() {
  const {
    jobs,
    addJob,
    removeJob,
    clearCompleted,
    approveJob,
    rejectJob,
    refreshJob,
    processingCount,
  } = useReceiptJobs()

  const { history, addToHistory, removeFromHistory, clearHistory, stats } =
    useReceiptHistory()

  // Sync completed jobs to history
  useEffect(() => {
    jobs.forEach((job) => {
      if (isTerminal(job.status)) {
        // Check if already in history
        const alreadyInHistory = history.some(
          (h) => h.receiptId === job.receiptId
        )
        if (!alreadyInHistory) {
          addToHistory(
            job.receiptId,
            job.fileName,
            job.status as 'APPROVED' | 'REJECTED' | 'COMPLETED',
            job.result
          )
        }
      }
    })
  }, [jobs, history, addToHistory])

  const enhancedApproveJob = useCallback(
    async (receiptId: string) => {
      await approveJob(receiptId)
      // Will be synced to history via useEffect
    },
    [approveJob]
  )

  const enhancedRejectJob = useCallback(
    async (receiptId: string) => {
      await rejectJob(receiptId)
      // Will be synced to history via useEffect
    },
    [rejectJob]
  )

  const clearCompletedJobs = useCallback(() => {
    // First sync any completed jobs to history
    jobs.forEach((job) => {
      if (isTerminal(job.status)) {
        addToHistory(
          job.receiptId,
          job.fileName,
          job.status as 'APPROVED' | 'REJECTED' | 'COMPLETED',
          job.result
        )
      }
    })
    // Then clear from jobs
    clearCompleted()
  }, [jobs, clearCompleted, addToHistory])

  return {
    // Jobs (pending + terminal)
    jobs,
    addJob,
    removeJob,
    clearCompleted: clearCompletedJobs,
    approveJob: enhancedApproveJob,
    rejectJob: enhancedRejectJob,
    refreshJob,
    processingCount,

    // History (only approved/rejected)
    history,
    removeFromHistory,
    clearHistory,
    stats,
  }
}
