import { useState, useMemo } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useReceiptJobs } from '@/hooks/useReceiptJobs'
import { useReceiptHistory } from '@/hooks/useReceiptHistory'
import { useReceiptCorrection } from '@/hooks/useReceiptCorrection'
import type { ReceiptResultItem } from '@/types/receipt'

function fmt(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
}

export default function ReceiptCorrectionPage() {
  const { receiptId } = useParams<{ receiptId: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isHistory = searchParams.get('source') === 'history'

  const { jobs, updateJobResult } = useReceiptJobs()
  const { history, updateHistory } = useReceiptHistory()
  const correction = useReceiptCorrection()

  const job = isHistory
    ? history.find((r) => r.receiptId === receiptId)
    : jobs.find((j) => j.receiptId === receiptId)

  const [storeName, setStoreName] = useState(job?.result?.storeName ?? '')
  const [date, setDate] = useState(job?.result?.date ?? '')
  const [items, setItems] = useState<ReceiptResultItem[]>(
    () => job?.result?.items ?? [],
  )
  const [saved, setSaved] = useState(false)

  const jobResult = job?.result
  const totalAmount = items.reduce((sum, i) => sum + i.totalPrice, 0)
  const issues = useMemo(() => ({
    store: !storeName?.trim(),
    date: !date,
    total: totalAmount <= 0,
    noItems: items.length === 0,
    itemsMissingPrice: items.map((it) => !it.unitPrice || it.unitPrice <= 0),
    itemsMissingQty: items.map((it) => !it.quantity || it.quantity <= 0),
  }), [storeName, date, totalAmount, items])

  if (!job || !jobResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center text-4xl">🔍</div>
        <p className="text-lg font-semibold text-gray-700">Struk tidak ditemukan</p>
        <button onClick={() => navigate(-1)} className="text-sm text-indigo-600 font-semibold hover:underline">Kembali</button>
      </div>
    )
  }

  function updateItem(index: number, field: 'quantity' | 'unitPrice', value: number) {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item
        const updated = { ...item, [field]: value }
        updated.totalPrice = updated.quantity * updated.unitPrice
        return updated
      }),
    )
  }

  function handleSave() {
    const body = {
      storeName: storeName || jobResult!.storeName,
      storeLocation: jobResult!.storeLocation,
      date: date || undefined,
      items,
      totalAmount: items.reduce((sum, i) => sum + i.totalPrice, 0),
    }

    correction.mutate(
      { receiptId: receiptId!, body },
      {
        onSuccess: () => {
          const corrected = { ...jobResult!, ...body }
          if (isHistory) {
            updateHistory(receiptId!, corrected)
          } else {
            updateJobResult(receiptId!, corrected)
          }
          setSaved(true)
          setTimeout(() => navigate(-1), 600)
        },
      },
    )
  }

  const issueCount = [issues.store, issues.date, issues.total, issues.noItems]
    .filter(Boolean).length
    + issues.itemsMissingPrice.filter(Boolean).length
    + issues.itemsMissingQty.filter(Boolean).length

  return (
    <div className="min-h-screen bg-gray-50">
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
              <p className="text-white/60 text-xs font-medium uppercase tracking-wide mb-1">Koreksi Struk</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">{storeName || jobResult.storeName}</h1>
              {job.fileName && <p className="text-indigo-200 text-sm mt-1">{job.fileName}</p>}
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-white/60 text-xs mb-1">Total</p>
              <p className="text-2xl font-extrabold text-white">{fmt(totalAmount)}</p>
              <p className="text-indigo-200 text-xs mt-1">{items.length} barang</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 -mt-4 pb-12 space-y-4">
        {correction.isError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center text-lg">✗</div>
            <div>
              <p className="text-sm font-semibold text-red-800">Gagal menyimpan</p>
              <p className="text-xs text-red-600 mt-0.5">Coba lagi atau hubungi admin</p>
            </div>
          </div>
        )}

        {saved && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center text-lg">✅</div>
            <div>
              <p className="text-sm font-semibold text-emerald-800">Data tersimpan</p>
              <p className="text-xs text-emerald-600 mt-0.5">Kembali…</p>
            </div>
          </div>
        )}

        {issueCount > 0 && !saved && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-3">
            <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">⚠️</div>
            <div>
              <p className="text-sm font-semibold text-amber-800">{issueCount} masalah perlu diperbaiki</p>
              <p className="text-xs text-amber-600 mt-0.5">Perbaiki data yang ditandai merah sebelum menyimpan</p>
            </div>
          </div>
        )}

        <div className={`bg-white rounded-2xl shadow-sm border px-5 py-4 ${issues.store ? 'border-red-300 ring-1 ring-red-200' : 'border-gray-100'}`}>
          <label className="text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5 ${issues.store ? 'text-red-500' : 'text-gray-500'}">
            Nama Toko
            {issues.store && <span className="text-red-500 text-xs font-normal">(wajib diisi)</span>}
          </label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="Nama toko…"
            className={`mt-1.5 w-full rounded-xl border px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition ${
              issues.store ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-indigo-500'
            }`}
          />
        </div>

        <div className={`bg-white rounded-2xl shadow-sm border px-5 py-4 ${issues.date ? 'border-red-300 ring-1 ring-red-200' : 'border-gray-100'}`}>
          <label className="text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5">
            <span className={issues.date ? 'text-red-500' : 'text-gray-500'}>Tanggal Struk</span>
            {issues.date && <span className="text-red-500 text-xs font-normal">(wajib diisi)</span>}
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`mt-1.5 w-full rounded-xl border px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition ${
              issues.date ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-indigo-500'
            }`}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Daftar Barang</p>
          </div>
          <div className="divide-y divide-gray-50">
            {items.map((item, i) => {
              const badPrice = issues.itemsMissingPrice[i]
              const badQty = issues.itemsMissingQty[i]
              const hasIssue = badPrice || badQty
              return (
                <div key={i} className={`px-5 py-4 ${hasIssue ? 'bg-red-50/40' : ''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-800 mb-2">{item.productName}</p>
                    {hasIssue && (
                      <span className="text-xs font-medium text-red-500 bg-red-100 px-2 py-0.5 rounded-full flex-shrink-0">
                        Data kurang
                      </span>
                    )}
                  </div>
                  {item.category && item.category.toLowerCase() !== 'unknown' && (
                    <span className="inline-block text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-medium mb-2">
                      {item.category}
                    </span>
                  )}
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div>
                      <label className={`text-xs font-medium flex items-center gap-1 ${badQty ? 'text-red-500' : 'text-gray-400'}`}>
                        Jumlah ({item.unit ?? 'pcs'})
                        {badQty && <span className="text-red-400">*</span>}
                      </label>
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={item.quantity}
                        onChange={(e) => updateItem(i, 'quantity', Math.max(0, Number(e.target.value)))}
                        className={`mt-1 w-full rounded-xl border px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition ${
                          badQty ? 'border-red-300 focus:ring-red-400 bg-red-50' : 'border-gray-200 focus:ring-indigo-500'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`text-xs font-medium flex items-center gap-1 ${badPrice ? 'text-red-500' : 'text-gray-400'}`}>
                        Harga Satuan
                        {badPrice && <span className="text-red-400">*</span>}
                      </label>
                      <input
                        type="number"
                        min={0}
                        step={100}
                        value={item.unitPrice}
                        onChange={(e) => updateItem(i, 'unitPrice', Math.max(0, Number(e.target.value)))}
                        className={`mt-1 w-full rounded-xl border px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition ${
                          badPrice ? 'border-red-300 focus:ring-red-400 bg-red-50' : 'border-gray-200 focus:ring-indigo-500'
                        }`}
                      />
                    </div>
                  </div>
                  <p className="text-right text-sm font-bold text-gray-900 mt-2">
                    {fmt(item.totalPrice)}
                  </p>
                </div>
              )
            })}
          </div>

          <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
            <div className="flex justify-between text-base font-extrabold text-gray-900">
              <span>Total ({items.length} barang)</span>
              <span className="text-indigo-600">{fmt(totalAmount)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saved || correction.isPending}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {correction.isPending ? (
            <>⏳ Menyimpan…</>
          ) : saved ? (
            <>✅ Tersimpan</>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Simpan Perubahan
            </>
          )}
        </button>
      </main>
    </div>
  )
}
