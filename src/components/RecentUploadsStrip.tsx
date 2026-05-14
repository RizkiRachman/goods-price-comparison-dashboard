import { motion } from 'motion/react'
import type { CompletedReceipt } from '@/hooks/useReceiptHistory'

interface Props {
  receipts: CompletedReceipt[]
  onShowMore: () => void
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60_000)
  const diffHours = Math.floor(diffMs / 3_600_000)
  const diffDays = Math.floor(diffMs / 86_400_000)

  if (diffMins < 1) return 'baru saja'
  if (diffMins < 60) return `${diffMins}m`
  if (diffHours < 24) return `${diffHours}j`
  if (diffDays === 1) return 'kemarin'
  return `${diffDays}h`
}

export function RecentUploadsStrip({ receipts, onShowMore }: Props) {
  const recent = receipts.slice(0, 5)

  if (recent.length === 0) return null

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-white/80">Upload Terbaru Kamu</p>
        {receipts.length > 5 && (
          <button
            onClick={onShowMore}
            className="text-xs text-white/70 hover:text-white underline"
          >
            Lihat semua ({receipts.length})
          </button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {recent.map((receipt, index) => (
          <motion.div
            key={receipt.receiptId}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, type: 'spring', stiffness: 250, damping: 20 }}
            className={`flex-shrink-0 p-3 rounded-xl min-w-[140px] backdrop-blur-sm border ${
              receipt.status === 'APPROVED' || receipt.status === 'COMPLETED'
                ? 'bg-white/20 border-white/30'
                : 'bg-red-500/20 border-red-400/30'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {receipt.status === 'APPROVED' || receipt.status === 'COMPLETED'
                  ? '✅'
                  : '❌'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {receipt.fileName?.slice(0, 15) ?? 'Struk'}...
                </p>
                <p className="text-xs text-white/60">
                  {formatDate(receipt.completedAt)} • {receipt.totalItems} item
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
