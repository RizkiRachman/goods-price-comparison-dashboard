import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReceiptJobs } from '@/hooks/useReceiptJobs'
import { ReceiptUploadModal } from '@/components/ReceiptUploadModal'

const STATUS_LABEL: Record<string, string> = {
  PENDING:          'Mengunggah…',
  PENDING_REVIEW:   'Menunggu Persetujuan',
  INGESTING:        'Sedang diproses…',
  COMPLETED:        'Siap Disetujui',
  APPROVED:         'Disetujui',
  REJECTED:         'Ditolak',
  FAILED:           'Gagal diproses',
  INGESTION_FAILED: 'Gagal menyimpan',
}

const STATUS_ICON: Record<string, string> = {
  PENDING:          '⏳',
  PENDING_REVIEW:   '⏳',
  INGESTING:        '⏳',
  COMPLETED:        '📋',
  APPROVED:         '✅',
  REJECTED:         '❌',
  FAILED:           '❌',
  INGESTION_FAILED: '⚠️',
}

function fmt(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
}

export default function PendingReceiptsPage() {
  const navigate = useNavigate()
  const { jobs, addJob, approveJob, rejectJob, removeJob } = useReceiptJobs()
  const [showUpload, setShowUpload] = useState(false)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const addMenuRef = useRef<HTMLDivElement>(null)

  const pendingJobs = jobs.filter(
    (j) => j.status === 'PENDING_REVIEW' || j.status === 'COMPLETED'
  )
  const activeJobs = jobs.filter(
    (j) => j.status === 'PENDING' || j.status === 'INGESTING'
  )
  const terminalJobs = jobs.filter(
    (j) => j.status === 'APPROVED' || j.status === 'REJECTED' || j.status === 'FAILED' || j.status === 'INGESTION_FAILED'
  )

  async function handleApprove(receiptId: string) {
    try { await approveJob(receiptId) } catch { /* ignore */ }
  }

  async function handleReject(receiptId: string) {
    try { await rejectJob(receiptId) } catch { /* ignore */ }
  }

  useEffect(() => {
    if (!showAddMenu) return
    function handleClick(e: MouseEvent) {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target as Node)) {
        setShowAddMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showAddMenu])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-4 pb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/goods')}
              className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Kembali
            </button>
          <div className="flex items-center gap-2">
            <div className="relative" ref={addMenuRef}>
              <button
                onClick={() => setShowAddMenu((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white text-sm font-medium rounded-xl transition backdrop-blur"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tambah
                <svg className={`w-3 h-3 transition-transform ${showAddMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showAddMenu && (
                <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50">
                  <button
                    onClick={() => { setShowAddMenu(false); navigate('/receipts/create') }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition text-left"
                  >
                    <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <div>
                      <p className="font-medium">Input Manual</p>
                      <p className="text-xs text-slate-400">Isi data struk langsung</p>
                    </div>
                  </button>
                  <div className="border-t border-slate-100" />
                  <button
                    onClick={() => { setShowAddMenu(false); setShowUpload(true) }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition text-left"
                  >
                    <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <div>
                      <p className="font-medium">Upload Foto</p>
                      <p className="text-xs text-slate-400">Foto struk untuk diproses</p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Proses Struk</h1>
          <p className="text-indigo-200 text-sm mt-1">{jobs.length} struk diproses</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 -mt-4 pb-12 space-y-4">

        {/* ── PENDING APPROVAL ── */}
        {pendingJobs.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider px-1 mb-3">
              Menunggu Persetujuan ({pendingJobs.length})
            </h2>
            <div className="space-y-3">
              {pendingJobs.map((job) => (
                <div key={job.receiptId} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg bg-amber-50">
                      {STATUS_ICON[job.status] ?? '📄'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {job.fileName ?? 'struk.jpg'}
                      </p>
                      <p className="text-xs font-medium text-amber-600">{STATUS_LABEL[job.status]}</p>
                    </div>
                  </div>

                  {job.result && (
                    <div className="border-t border-gray-50 px-4 py-3 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-gray-500 uppercase">{job.result.storeName}</span>
                        <span className="font-bold text-indigo-600">{fmt(job.result.totalAmount)}</span>
                      </div>

                      {job.result.items.length > 0 && (
                        <div className="space-y-1 bg-gray-50 rounded-lg p-2">
                          {job.result.items.slice(0, 3).map((item, i) => (
                            <div key={i} className="flex items-start justify-between gap-2 text-xs">
                              <span className="text-gray-600 truncate flex-1">{item.productName}</span>
                              <span className="text-gray-400 flex-shrink-0">{item.quantity}× {fmt(item.unitPrice)}</span>
                            </div>
                          ))}
                          {job.result.items.length > 3 && (
                            <button
                              onClick={() => { navigate(`/receipts/${job.receiptId}`) }}
                              className="w-full text-xs text-indigo-500 font-medium py-1 hover:text-indigo-600 transition text-left"
                            >
                              +{job.result.items.length - 3} item lainnya → Lihat detail
                            </button>
                          )}
                        </div>
                      )}

                      <button
                        onClick={() => { navigate(`/receipts/${job.receiptId}`) }}
                        className="w-full py-2 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
                      >
                        Lihat Detail Struk
                      </button>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(job.receiptId)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl font-semibold text-xs text-white bg-emerald-500 hover:bg-emerald-600 transition"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Setujui
                        </button>
                        <button
                          onClick={() => handleReject(job.receiptId)}
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
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── ACTIVE ── */}
        {activeJobs.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider px-1 mb-3">
              Sedang Diproses ({activeJobs.length})
            </h2>
            <div className="space-y-3">
              {activeJobs.map((job) => (
                <div key={job.receiptId} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg bg-indigo-50">
                      {STATUS_ICON[job.status] ?? '⏳'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {job.fileName ?? 'struk.jpg'}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                        <span className="text-xs font-medium text-indigo-600">{STATUS_LABEL[job.status]}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeJob(job.receiptId)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition flex-shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── EMPTY STATE ── */}
        {pendingJobs.length === 0 && activeJobs.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">🧾</div>
            <p className="text-lg font-semibold text-gray-700">Tidak ada struk yang perlu diproses</p>
            <p className="text-sm text-gray-400 mt-1">Upload struk untuk memulai</p>
            <button
              onClick={() => setShowUpload(true)}
              className="mt-6 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-sm hover:shadow-md transition"
            >
              Upload Struk
            </button>
          </div>
        )}

        {/* ── TERMINAL (COMPLETED) ── */}
        {terminalJobs.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider px-1 mb-3">
              Selesai ({terminalJobs.length})
            </h2>
            <div className="space-y-2">
              {terminalJobs.map((job) => (
                <div
                  key={job.receiptId}
                  className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center gap-3 shadow-sm cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => navigate(`/receipts/${job.receiptId}`)}
                >
                  <span className="text-base">{STATUS_ICON[job.status] ?? '📄'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{job.fileName ?? 'struk.jpg'}</p>
                    <p className="text-xs text-gray-400">{STATUS_LABEL[job.status]}</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {showUpload && (
        <ReceiptUploadModal
          onClose={() => setShowUpload(false)}
          onJobCreated={(receiptId, fileName) => {
            addJob(receiptId, fileName)
            setShowUpload(false)
          }}
        />
      )}
    </div>
  )
}
