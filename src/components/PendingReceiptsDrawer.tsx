import { useNavigate } from 'react-router-dom'
import type { ReceiptResult, ReceiptStatus, TrackedJob } from '@/types/receipt'
import { DrawerShell } from '@/components/ui/DrawerShell'

interface ValidationIssue {
  field: string
  message: string
}

function validateReceipt(result: ReceiptResult): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  if (!result.storeName?.trim()) issues.push({ field: 'store', message: 'Nama toko kosong' })
  if (!result.date) issues.push({ field: 'date', message: 'Tanggal struk kosong' })
  if (!result.totalAmount || result.totalAmount <= 0) issues.push({ field: 'total', message: 'Total pembayaran kosong' })
  if (!result.items?.length) {
    issues.push({ field: 'items', message: 'Tidak ada barang ditemukan' })
  } else {
    const missingPrice = result.items.filter((i) => !i.unitPrice || i.unitPrice <= 0)
    if (missingPrice.length > 0) {
      issues.push({
        field: 'prices',
        message: `${missingPrice.length} barang tanpa harga: ${missingPrice.map((i) => i.productName).join(', ')}`,
      })
    }
    const missingQty = result.items.filter((i) => !i.quantity || i.quantity <= 0)
    if (missingQty.length > 0) {
      issues.push({ field: 'qty', message: `${missingQty.length} barang dengan jumlah 0` })
    }
  }
  return issues
}

const STATUS_LABEL: Partial<Record<ReceiptStatus, string>> = {
  PENDING:          'Mengunggah…',
  PENDING_REVIEW:   'Memproses…',
  INGESTING:        'Sedang diproses…',
  APPROVED:         'Disetujui',
  REJECTED:         'Ditolak',
  COMPLETED:        'Selesai diproses',
  FAILED:           'Gagal diproses',
  INGESTION_FAILED: 'Gagal menyimpan',
}

interface Props {
  jobs: TrackedJob[]
  onRemove: (receiptId: string) => void
  onClearCompleted: () => void
  onClose: () => void
  onApprove?: (receiptId: string) => Promise<void>
  onReject?: (receiptId: string) => Promise<void>
}

function fmt(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
}

function JobCard({ job, onRemove, onNavigate, onApprove, onReject }: {
  job: TrackedJob
  onRemove: (id: string) => void
  onNavigate: (id: string) => void
  onApprove?: (id: string) => Promise<void>
  onReject?: (id: string) => Promise<void>
}) {
  const isCompleted = job.status === 'APPROVED'
  const isFailed = job.status === 'FAILED' || job.status === 'INGESTION_FAILED' || job.status === 'REJECTED'
  const isPendingReview = job.status === 'PENDING_REVIEW'
  const isLlmReady = job.status === 'COMPLETED' && job.result
  const isProcessing = !isCompleted && !isFailed && !isPendingReview && !isLlmReady
  const hasItems = job.result && job.result.items.length > 0
  const validationIssues = job.result ? validateReceipt(job.result) : []
  const canApprove = validationIssues.length === 0

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 backdrop-blur-sm ${
            isPendingReview ? 'bg-amber-50' : isLlmReady ? 'bg-emerald-50' : isProcessing ? 'bg-indigo-50' : isCompleted ? 'bg-emerald-50' : 'bg-red-50'
          }`}
        >
          {isPendingReview ? '⏳' : isLlmReady ? '📋' : isProcessing ? '⏳' : isCompleted ? '✅' : '❌'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">
            {job.fileName ?? 'struk.jpg'}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            {isLlmReady && (
              <span className="text-xs text-emerald-600 font-medium">
                {job.result?.items?.length ?? 0} barang ditemukan
              </span>
            )}
            {isPendingReview && (
              <span className="text-xs text-amber-600 font-medium">
                Memproses…
              </span>
            )}
            {isProcessing && (
              <span className="inline-flex items-center gap-1 text-xs text-indigo-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                {STATUS_LABEL[job.status] ?? 'Sedang diproses…'}
              </span>
            )}
            {isCompleted && (
              <span className="text-xs text-emerald-600 font-medium">
                Disetujui
              </span>
            )}
            {isFailed && (
              <span className="text-xs text-red-500 font-medium">
                {STATUS_LABEL[job.status] ?? 'Gagal diproses'}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => onRemove(job.receiptId)}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* PENDING_REVIEW / COMPLETED — show items preview + actions */}
      {(isPendingReview || isLlmReady) && (
        <div className="border-t border-white/20 px-4 py-3 space-y-3">
          {job.result && (
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-500 uppercase">{job.result.storeName}</span>
              <span className="font-bold text-indigo-600">{fmt(job.result.totalAmount)}</span>
            </div>
          )}
          
          {/* Items preview - just first 3 */}
          {hasItems && job.result && (
            <div className="space-y-1 bg-white/50 backdrop-blur-sm rounded-lg p-2">
              {job.result.items.slice(0, 3).map((item, i) => (
                <div key={i} className="flex items-start justify-between gap-2 text-xs">
                  <span className="text-gray-600 truncate flex-1">{item.productName}</span>
                  <span className="text-gray-400 flex-shrink-0">{item.quantity}× {fmt(item.unitPrice)}</span>
                </div>
              ))}
              {job.result.items.length > 3 && (
                <button
                  onClick={() => onNavigate(job.receiptId)}
                  className="w-full text-xs text-indigo-500 font-medium py-1 hover:text-indigo-600 transition text-left"
                >
                  +{job.result.items.length - 3} item lainnya → Lihat detail
                </button>
              )}
            </div>
          )}
          
          {/* Validation warnings */}
          {validationIssues.length > 0 && (
            <div className="bg-amber-50/80 backdrop-blur-sm border border-amber-200 rounded-xl px-3 py-2.5 space-y-1">
              <p className="text-xs font-semibold text-amber-700 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                Data perlu dikoreksi sebelum disetujui
              </p>
              <ul className="space-y-0.5">
                {validationIssues.map((issue) => (
                  <li key={issue.field} className="text-xs text-amber-600 pl-5">• {issue.message}</li>
                ))}
              </ul>
            </div>
          )}

          {/* View detail button for all items */}
          <button
            onClick={() => onNavigate(job.receiptId)}
            className="w-full py-2 text-xs font-medium text-indigo-600 bg-indigo-50/80 backdrop-blur-sm hover:bg-indigo-100 rounded-lg transition"
          >
            Lihat Detail Struk
          </button>

          <button
            onClick={() => onNavigate(`${job.receiptId}/correct`)}
            className={`w-full py-2 text-xs font-semibold rounded-lg transition ${
              !canApprove
                ? 'text-white bg-amber-500 hover:bg-amber-600 animate-pulse'
                : 'text-amber-600 bg-amber-50/80 backdrop-blur-sm hover:bg-amber-100'
            }`}
          >
            {!canApprove ? '⚠️ Koreksi Data Sekarang' : 'Koreksi Data'}
          </button>

          <div className="flex gap-2">
            <button
              disabled={!canApprove}
              onClick={() => onApprove?.(job.receiptId)}
              title={!canApprove ? 'Selesaikan koreksi data terlebih dahulu' : undefined}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl font-semibold text-xs text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Setujui
            </button>
            <button
              onClick={() => onReject?.(job.receiptId)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl font-semibold text-xs text-white bg-red-500 hover:bg-red-600 transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Tolak
            </button>
          </div>
        </div>
      )}

      {/* Result detail for APPROVED - navigate to detail page */}
      {isCompleted && job.result && (
        <button
          onClick={() => onNavigate(job.receiptId)}
          className="w-full text-left border-t border-white/20 px-4 py-3 hover:bg-white/40 transition group"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {job.result.storeName}
              </span>
              <p className="text-xs text-gray-400 mt-0.5">{job.result.items.length} item • Klik untuk detail</p>
            </div>
            <span className="flex items-center gap-1 text-sm font-bold text-indigo-600 group-hover:gap-2 transition-all">
              {fmt(job.result.totalAmount)}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </button>
      )}
    </div>
  )
}

export function PendingReceiptsDrawer({ jobs, onRemove, onClearCompleted, onClose, onApprove, onReject }: Props) {
  const navigate = useNavigate()
  const hasCompleted = jobs.some((j) => j.status === 'COMPLETED' || j.status === 'FAILED' || j.status === 'INGESTION_FAILED' || j.status === 'APPROVED' || j.status === 'REJECTED')

  return (
    <DrawerShell open={true} onClose={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-white/60 backdrop-blur-sm border-b border-white/20">
        <div>
          <h2 className="text-base font-bold text-gray-900">Proses Struk</h2>
          <p className="text-xs text-gray-400 mt-0.5">{jobs.length} struk</p>
        </div>
        <div className="flex items-center gap-2">
          {hasCompleted && (
            <button
              onClick={onClearCompleted}
              className="text-xs text-indigo-600 font-semibold hover:underline"
            >
              Hapus selesai
            </button>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:bg-white/40 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Job list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center pb-10">
            <div className="w-16 h-16 bg-indigo-50/80 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl mb-3">🧾</div>
            <p className="text-sm font-semibold text-gray-700">Belum ada struk</p>
            <p className="text-xs text-gray-400 mt-1">Upload struk untuk memulai</p>
          </div>
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job.receiptId}
              job={job}
              onRemove={onRemove}
              onApprove={onApprove}
              onReject={onReject}
              onNavigate={(id) => { onClose(); navigate(`/receipts/${id}`) }}
            />
          ))
        )}
      </div>
    </DrawerShell>
  )
}
