import { useNavigate } from 'react-router-dom'
import type { CompletedReceipt } from '@/hooks/useReceiptHistory'
import { DrawerShell } from '@/components/ui/DrawerShell'

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
      className={`w-full rounded-xl overflow-hidden transition hover:shadow-md ${
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
              <p className="font-semibold text-gray-900 truncate">
                {receipt.fileName ?? 'Struk'}
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {formatDate(receipt.completedAt)}
            </p>
            {receipt.result && (
              <div className="mt-2 text-sm text-gray-600">
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
                  <span className={`font-medium ${isApproved ? 'text-emerald-600' : 'text-red-600'}`}>
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
          <div className="mt-3 pt-3 border-t border-gray-200/50">
            <div className="space-y-1">
              {receipt.result.items.slice(0, 3).map((item, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 truncate flex-1">{item.productName}</span>
                  <span className="text-gray-400 flex-shrink-0">
                    {item.quantity}× {formatPrice(item.unitPrice)}
                  </span>
                </div>
              ))}
              {receipt.result.items.length > 3 && (
                <p className="text-xs text-indigo-500 font-medium">
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
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-indigo-600 bg-indigo-50/80 backdrop-blur-sm hover:bg-indigo-100 border border-indigo-100 transition"
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

  const handleReceiptClick = (receiptId: string) => {
    onClose()
    navigate(`/receipts/${receiptId}`)
  }

  const handleCorrect = (receiptId: string) => {
    onClose()
    navigate(`/receipts/${receiptId}/correct?source=history`)
  }

  return (
    <DrawerShell open={true} onClose={onClose}>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Riwayat Struk</h2>
            <p className="text-indigo-100 text-sm mt-1">{receipts.length} struk tersimpan</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white/60 backdrop-blur-sm">
        {receipts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100/80 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">📄</div>
            <p className="text-gray-500 font-medium">Belum ada riwayat</p>
            <p className="text-sm text-gray-400 mt-1">Upload struk pertama</p>
          </div>
        ) : (
          <>
            {approved.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Diterima</h3>
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
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Ditolak</h3>
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
    </DrawerShell>
  )
}
