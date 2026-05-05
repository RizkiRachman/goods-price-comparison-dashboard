import { useCallback, useEffect, useRef, useState } from 'react'
import { receiptsApi } from '@/api/receipts'
import type { ReceiptStatus, ReceiptResult, TrackedJob } from '@/types/receipt'

const STORAGE_KEY = 'pricemate_receipt_jobs'

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

function load(): TrackedJob[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

export function useReceiptJobs() {
  const [jobs, setJobs] = useState<TrackedJob[]>(load)
  const jobsRef = useRef(jobs)
  useEffect(() => { jobsRef.current = jobs }, [jobs])

  const persist = useCallback((updater: (prev: TrackedJob[]) => TrackedJob[]) => {
    setJobs((prev) => {
      const next = updater(prev)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const addJob = useCallback(
    (receiptId: string, fileName?: string) => {
      persist((prev) => [
        { receiptId, status: 'PENDING' as ReceiptStatus, fileName, addedAt: Date.now() },
        ...prev,
      ])
    },
    [persist],
  )

  const removeJob = useCallback(
    (receiptId: string) => {
      persist((prev) => prev.filter((j) => j.receiptId !== receiptId))
    },
    [persist],
  )

  const clearCompleted = useCallback(() => {
    persist((prev) => prev.filter((j) => !isTerminal(j.status)))
  }, [persist])

  const approveJob = useCallback(
    async (receiptId: string) => {
      await receiptsApi.approve(receiptId)
      persist((prev) =>
        prev.map((j) => (j.receiptId === receiptId ? { ...j, status: 'APPROVED' as ReceiptStatus } : j)),
      )
    },
    [persist],
  )

  const rejectJob = useCallback(
    async (receiptId: string) => {
      await receiptsApi.reject(receiptId)
      persist((prev) =>
        prev.map((j) => (j.receiptId === receiptId ? { ...j, status: 'REJECTED' as ReceiptStatus } : j)),
      )
    },
    [persist],
  )

  useEffect(() => {
    const hasPolling = jobs.some((j) => !isTerminal(j.status))
    if (!hasPolling) return

    const id = setInterval(async () => {
      const polling = jobsRef.current.filter((j) => !isTerminal(j.status))
      for (const job of polling) {
        try {
          const { status } = await receiptsApi.getStatus(job.receiptId)
          if (status === job.status) continue

          if (status === 'PENDING_REVIEW'
              || status === 'COMPLETED'
              || status === 'APPROVED'
              || status === 'REJECTED'
          ) {
            const result: ReceiptResult = await receiptsApi.getResults(job.receiptId)
            persist((prev) =>
              prev.map((j) => (j.receiptId === job.receiptId ? { ...j, status, result } : j)),
            )
          } else {
            persist((prev) =>
              prev.map((j) => (j.receiptId === job.receiptId ? { ...j, status } : j)),
            )
          }
        } catch {
          // transient — retry next tick
        }
      }
    }, 4000)

    return () => clearInterval(id)
  }, [jobs, persist])

  const refreshJob = useCallback(
    async (receiptId: string) => {
      const result: ReceiptResult = await receiptsApi.getResults(receiptId)
      persist((prev) =>
        prev.map((j) => (j.receiptId === receiptId ? { ...j, result } : j)),
      )
    },
    [persist],
  )

  const updateJobResult = useCallback(
    (receiptId: string, result: ReceiptResult) => {
      persist((prev) =>
        prev.map((j) => (j.receiptId === receiptId ? { ...j, result } : j)),
      )
    },
    [persist],
  )

  return {
    jobs,
    addJob,
    removeJob,
    clearCompleted,
    approveJob,
    rejectJob,
    refreshJob,
    updateJobResult,
    processingCount: jobs.filter((j) => !isTerminal(j.status)).length,
  }
}
