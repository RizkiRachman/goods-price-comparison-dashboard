import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import type { CompletedReceipt } from '@/hooks/useReceiptHistory'

interface Props {
  receipts: CompletedReceipt[]
  onClose: () => void
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price)
}

function ReceiptCard({
  receipt,
  onClick,
  onCorrect,
}: {
  receipt: CompletedReceipt
  onClick: () => void
  onCorrect?: () => void
}) {
  const isApproved = receipt.status === 'APPROVED' || receipt.status === 'COMPLETED'

  return (
    <div
      className={`w-full rounded-none overflow-hidden transition ${
        isApproved
          ? 'bg-emerald-50/80 backdrop-blur-sm border border-emerald-100 hover:border-emerald-200'
          : 'bg-red-50/80 backdrop-blur-sm border border-red-100 hover:border-red-200 opacity-75'
      }`}
    >
      <button onClick={onClick} className="w-full text-left p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-lg">{isApproved ? '✅' : '❌'}</span>
              <p className="font-semibold text-retro-text truncate">
                {receipt.fileName ?? 'Struk'}
              </p>
            </div>
            <p className="text-xs text-retro-muted mt-1">
              {formatDate(receipt.completedAt)}
            </p>
            {receipt.result && (
              <div className="mt-2 text-sm text-retro-body">
                <p className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {receipt.result.storeName}
                </p>
                <p className="flex items-center gap-2 mt-1">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    {receipt.totalItems} item
                  </span>
                  <span>•</span>
                  <span className={`font-medium ${isApproved ? 'text-retro-success' : 'text-retro-danger'}`}>
                    {formatPrice(receipt.totalAmount)}
                  </span>
                </p>
              </div>
            )}
          </div>
          <svg className="w-5 h-5 text-gray-300 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Items preview */}
        {receipt.result && receipt.result.items.length > 0 && (
          <div className="mt-3 pt-3 border-t border-retro-border/50">
            <div className="space-y-1">
              {receipt.result.items.slice(0, 3).map((item, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="text-retro-body truncate flex-1">{item.productName}</span>
                  <span className="text-retro-muted flex-shrink-0">
                    {item.quantity}× {formatPrice(item.unitPrice)}
                  </span>
                </div>
              ))}
              {receipt.result.items.length > 3 && (
                <p className="text-xs text-retro-gold font-medium">
                  +{receipt.result.items.length - 3} item lainnya →
                </p>
              )}
            </div>
          </div>
        )}
      </button>

      {/* Koreksi button — only for approved receipts with result */}
      {isApproved && receipt.result && onCorrect && (
        <div className="px-4 pb-3">
          <button
            onClick={(e) => { e.stopPropagation(); onCorrect() }}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-none text-xs font-semibold text-retro-brand bg-amber-50/30/80 backdrop-blur-sm hover:bg-amber-100/30 border border-retro-gold/30 transition"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Koreksi Data
          </button>
        </div>
      )}
    </div>
  )
}

export function ReceiptHistoryDrawer({ receipts, onClose }: Props) {
  const navigate = useNavigate()
  const approved = receipts.filter((r) => r.status === 'APPROVED' || r.status === 'COMPLETED')
  const rejected = receipts.filter((r) => r.status === 'REJECTED')

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleReceiptClick = (receiptId: string) => {
    onClose()
    navigate(`/receipts/${receiptId}`)
  }

  const handleCorrect = (receiptId: string) => {
    onClose()
    navigate(`/receipts/${receiptId}/correct?source=history`)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      >
        {/* Transparent backdrop with blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-black/30 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Full-page content */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-2xl max-h-[90vh] bg-retro-surface/80 backdrop-blur-xl border border-retro-border/30 rounded-none flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 to-retro-gold p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-retro-text">Riwayat Struk</h2>
                <p className="text-retro-body text-sm mt-1">{receipts.length} struk tersimpan</p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-none bg-retro-surface/20 hover:bg-retro-surface/30 flex items-center justify-center text-retro-text transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-retro-surface/60 backdrop-blur-sm">
            {receipts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-retro-surface/80 backdrop-blur-sm rounded-none flex items-center justify-center mx-auto mb-4">📄</div>
                <p className="text-retro-muted font-medium">Belum ada riwayat</p>
                <p className="text-sm text-retro-muted mt-1">Upload struk pertama</p>
              </div>
            ) : (
              <>
                {approved.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-retro-muted uppercase tracking-wide mb-3">Diterima</h3>
                    <div className="space-y-3">
                      {approved.map((receipt) => (
                        <ReceiptCard
                          key={receipt.receiptId}
                          receipt={receipt}
                          onClick={() => handleReceiptClick(receipt.receiptId)}
                          onCorrect={() => handleCorrect(receipt.receiptId)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {rejected.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-retro-muted uppercase tracking-wide mb-3">Ditolak</h3>
                    <div className="space-y-3">
                      {rejected.map((receipt) => (
                        <ReceiptCard
                          key={receipt.receiptId}
                          receipt={receipt}
                          onClick={() => handleReceiptClick(receipt.receiptId)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
