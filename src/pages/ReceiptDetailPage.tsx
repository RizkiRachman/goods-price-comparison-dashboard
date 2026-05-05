import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useReceiptJobs } from '@/hooks/useReceiptJobs'

function fmt(n: number | null | undefined) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n ?? 0)
}

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  )
}

export default function ReceiptDetailPage() {
  const { receiptId } = useParams<{ receiptId: string }>()
  const navigate = useNavigate()
  const { jobs, approveJob, rejectJob, refreshJob } = useReceiptJobs()
  const [actionLoading, setActionLoading] = useState<'approve' | 'reject' | null>(null)

  useEffect(() => {
    if (!receiptId) return
    refreshJob(receiptId)
  }, [receiptId, refreshJob])

  const job = jobs.find((j) => j.receiptId === receiptId)

  // ── Not found ────────────────────────────────────────────────────────────────
  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center text-4xl">🔍</div>
        <p className="text-lg font-semibold text-gray-700">Struk tidak ditemukan</p>
        <button onClick={() => navigate(-1)} className="text-sm text-indigo-600 font-semibold hover:underline">Kembali</button>
      </div>
    )
  }

  // ── PENDING — waiting for upload/analysis result ──────────────────────────
  if (job.status === 'PENDING') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-4xl animate-pulse">📤</div>
        <p className="text-lg font-semibold text-gray-700">Mengunggah struk…</p>
        <p className="text-sm text-gray-400">Struk sedang diupload dan dianalisis</p>
        <button onClick={() => navigate(-1)} className="text-sm text-indigo-600 font-semibold hover:underline">Kembali</button>
      </div>
    )
  }

  // ── FAILED — analysis failed, no result available ─────────────────────────
  if (job.status === 'FAILED') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-4xl">❌</div>
        <p className="text-lg font-semibold text-gray-700">Gagal memproses struk</p>
        <p className="text-sm text-gray-400">Terjadi kesalahan saat menganalisis struk</p>
        <button onClick={() => navigate(-1)} className="text-sm text-indigo-600 font-semibold hover:underline">Kembali</button>
      </div>
    )
  }

  // ── All remaining statuses should have a result ──────────────────────────
  const result = job.result
  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center text-4xl">⏳</div>
        <p className="text-lg font-semibold text-gray-700">Memuat data struk…</p>
        <p className="text-sm text-gray-400">Data struk sedang dimuat</p>
        <button onClick={() => navigate(-1)} className="text-sm text-indigo-600 font-semibold hover:underline">Kembali</button>
      </div>
    )
  }
  const items = result.items ?? []
  const subtotal = items.reduce((sum, i) => sum + (i.totalPrice ?? 0), 0)

  async function handleApprove() {
    if (!receiptId) return
    setActionLoading('approve')
    try { await approveJob(receiptId) } finally { setActionLoading(null) }
  }

  async function handleReject() {
    if (!receiptId) return
    setActionLoading('reject')
    try { await rejectJob(receiptId) } finally { setActionLoading(null) }
  }

  const showApproveReject =
    job.status === 'COMPLETED' || job.status === 'INGESTION_FAILED'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-4 pb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium mb-6 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali
          </button>

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-white/60 text-xs font-medium uppercase tracking-wide mb-1">Struk Belanja</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">{result.storeName}</h1>
              {result.storeLocation && <p className="text-indigo-200 text-sm mt-1">{result.storeLocation}</p>}
              {result.date && <p className="text-indigo-200 text-sm mt-0.5">{result.date}</p>}
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-white/60 text-xs mb-1">Total</p>
              <p className="text-2xl font-extrabold text-white">{fmt(result.totalAmount)}</p>
              <p className="text-indigo-200 text-xs mt-1">{items.length} barang</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 -mt-4 pb-12 space-y-3">

        {/* PENDING_REVIEW — approve / reject */}
        {showApproveReject && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4">
            {job.status === 'INGESTION_FAILED' && (
              <div className="flex items-center gap-2 mb-3 text-amber-600 bg-amber-50 rounded-xl px-3 py-2">
                <span className="text-base">⚠️</span>
                <p className="text-xs font-semibold">Gagal menyimpan data. Coba setujui atau tolak kembali.</p>
              </div>
            )}
            <p className="text-sm font-semibold text-gray-700 mb-3">
              {job.status === 'INGESTION_FAILED' ? 'Verifikasi ulang struk ini?' : 'Setujui data struk ini?'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleApprove}
                disabled={actionLoading !== null}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {actionLoading === 'approve' ? <Spinner /> : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                Setujui
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading !== null}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {actionLoading === 'reject' ? <Spinner /> : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                Tolak
              </button>
            </div>
          </div>
        )}

        {/* INGESTING — ingestion in progress banner */}
        {job.status === 'INGESTING' && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-indigo-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-indigo-800">Sedang menyimpan data…</p>
              <p className="text-xs text-indigo-500 mt-0.5">Data struk sedang diproses ke sistem</p>
            </div>
          </div>
        )}

        {/* COMPLETED — LLM response ready, waiting for approval */}
        {job.status === 'COMPLETED' && !showApproveReject && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">✅</div>
            <div>
              <p className="text-sm font-semibold text-emerald-800">Data berhasil disimpan</p>
              <p className="text-xs text-emerald-600 mt-0.5">Semua data struk sudah tersimpan di sistem</p>
            </div>
          </div>
        )}

        {/* REJECTED — rejected banner */}
        {job.status === 'REJECTED' && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">🚫</div>
            <div>
              <p className="text-sm font-semibold text-red-800">Struk ditolak</p>
              <p className="text-xs text-red-500 mt-0.5">Struk ini tidak disetujui untuk disimpan</p>
            </div>
          </div>
        )}

        {/* Receipt detail card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* File info */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50">
            <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-lg">🧾</div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{job.fileName ?? 'struk.jpg'}</p>
              <p className="text-xs text-gray-400">
                {new Date(job.addedAt).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'long', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="divide-y divide-gray-50">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl mb-3">📦</div>
                <p className="text-sm font-semibold text-gray-500">Tidak ada barang</p>
                <p className="text-xs text-gray-400 mt-1">Tidak ada barang yang ditemukan di struk ini</p>
              </div>
            ) : items.map((item, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-4">
                <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-xs font-bold text-gray-400 flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 leading-snug">{item.productName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {item.category && (
                      <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-medium">
                        {item.category}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {item.quantity} {item.unit ?? 'pcs'} × {fmt(item.unitPrice)}
                    </span>
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-900 flex-shrink-0">{fmt(item.totalPrice)}</p>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="border-t border-gray-100 px-5 py-4 bg-gray-50 space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal ({items.length} barang)</span>
              <span>{fmt(subtotal)}</span>
            </div>
            {result.totalAmount !== subtotal && (
              <div className="flex justify-between text-sm text-gray-500">
                <span>Pajak / Lainnya</span>
                <span>{fmt(result.totalAmount - subtotal)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-extrabold text-gray-900 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span className="text-indigo-600">{fmt(result.totalAmount)}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
