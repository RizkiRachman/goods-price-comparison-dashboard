import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReceiptCreate } from '@/hooks/useReceiptCreate'
import type { ReceiptResultItem } from '@/types/receipt'

const UNIT_OPTIONS = [
  { value: 'pcs', label: 'Buah' },
  { value: 'kg', label: 'Kg' },
  { value: 'gr', label: 'Gram' },
  { value: 'liter', label: 'Liter' },
  { value: 'ml', label: 'Ml' },
]

function emptyItem(): ReceiptResultItem {
  return { productName: '', quantity: 0, unitPrice: 0, totalPrice: 0, unit: 'pcs' }
}

function fmt(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
}

export default function ReceiptCreatePage() {
  const navigate = useNavigate()
  const create = useReceiptCreate()

  const [storeName, setStoreName] = useState('')
  const [storeLocation, setStoreLocation] = useState('')
  const [date, setDate] = useState('')
  const [items, setItems] = useState<ReceiptResultItem[]>([emptyItem()])
  const [saved, setSaved] = useState(false)

  const totalAmount = useMemo(() => items.reduce((sum, i) => sum + i.totalPrice, 0), [items])

  const issues = useMemo(() => ({
    store: !storeName?.trim(),
    date: !date,
    total: totalAmount <= 0,
    noItems: items.length === 0,
    itemsMissingName: items.map((it) => !it.productName?.trim()),
    itemsMissingPrice: items.map((it) => !it.unitPrice || it.unitPrice <= 0),
    itemsMissingQty: items.map((it) => !it.quantity || it.quantity <= 0),
  }), [storeName, date, totalAmount, items])

  const issueCount = useMemo(() => {
    let count = [issues.store, issues.date, issues.total, issues.noItems].filter(Boolean).length
    count += issues.itemsMissingName.filter(Boolean).length
    count += issues.itemsMissingPrice.filter(Boolean).length
    count += issues.itemsMissingQty.filter(Boolean).length
    return count
  }, [issues])

  function updateItem(index: number, field: 'productName' | 'quantity' | 'unitPrice' | 'unit', value: string | number) {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item
        const updated = { ...item, [field]: value }
        if (field === 'quantity' || field === 'unitPrice') {
          updated.totalPrice = updated.quantity * updated.unitPrice
        }
        return updated
      }),
    )
  }

  function addItem() {
    setItems((prev) => [...prev, emptyItem()])
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  function handleSave() {
    const body = {
      storeName: storeName.trim(),
      storeLocation: storeLocation.trim() || undefined,
      date: date || undefined,
      items,
      totalAmount,
    }

    create.mutate(body, {
      onSuccess: (response) => {
        setSaved(true)
        setTimeout(() => navigate(`/receipts/${response.receiptId}`), 600)
      },
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700">
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
              <p className="text-white/60 text-xs font-medium uppercase tracking-wide mb-1">Buat Struk Baru</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {storeName || 'Input Manual'}
              </h1>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-white/60 text-xs mb-1">Total</p>
              <p className="text-2xl font-extrabold text-white">{fmt(totalAmount)}</p>
              <p className="text-teal-200 text-xs mt-1">{items.length} barang</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 -mt-4 pb-12 space-y-4">
        {create.isError && (
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
              <p className="text-xs text-emerald-600 mt-0.5">Mengalihkan…</p>
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

        {/* Store Name */}
        <div className={`bg-white rounded-2xl shadow-sm border px-5 py-4 ${issues.store ? 'border-red-300 ring-1 ring-red-200' : 'border-gray-100'}`}>
          <label className={`text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5 ${issues.store ? 'text-red-500' : 'text-gray-500'}`}>
            Nama Toko
            {issues.store && <span className="text-red-500 text-xs font-normal">(wajib diisi)</span>}
          </label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="Nama toko…"
            className={`mt-1.5 w-full rounded-xl border px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition ${
              issues.store ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-emerald-500'
            }`}
          />
        </div>

        {/* Store Location */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Lokasi Toko</label>
          <input
            type="text"
            value={storeLocation}
            onChange={(e) => setStoreLocation(e.target.value)}
            placeholder="Jl. Contoh No. 123, Kota…"
            className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
          />
        </div>

        {/* Date */}
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
              issues.date ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-emerald-500'
            }`}
          />
        </div>

        {/* Items */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-50 flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Daftar Barang</p>
            {issues.noItems && (
              <span className="text-xs font-medium text-red-500">Minimal 1 barang</span>
            )}
          </div>
          <div className="divide-y divide-gray-50">
            {items.map((item, i) => {
              const badName = issues.itemsMissingName[i]
              const badPrice = issues.itemsMissingPrice[i]
              const badQty = issues.itemsMissingQty[i]
              const hasIssue = badName || badPrice || badQty
              return (
                <div key={i} className={`px-5 py-4 ${hasIssue ? 'bg-red-50/40' : ''}`}>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1">
                      <label className={`text-xs font-medium flex items-center gap-1 ${badName ? 'text-red-500' : 'text-gray-400'}`}>
                        Nama Barang
                        {badName && <span className="text-red-400">*</span>}
                      </label>
                      <input
                        type="text"
                        value={item.productName}
                        onChange={(e) => updateItem(i, 'productName', e.target.value)}
                        placeholder="Nama barang…"
                        className={`mt-1 w-full rounded-xl border px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition ${
                          badName ? 'border-red-300 focus:ring-red-400 bg-red-50' : 'border-gray-200 focus:ring-emerald-500'
                        }`}
                      />
                    </div>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(i)}
                        className="mt-6 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition flex-shrink-0"
                        aria-label="Hapus barang"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className={`text-xs font-medium flex items-center gap-1 ${badQty ? 'text-red-500' : 'text-gray-400'}`}>
                        Jumlah
                        {badQty && <span className="text-red-400">*</span>}
                      </label>
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={item.quantity || ''}
                        onChange={(e) => updateItem(i, 'quantity', Math.max(0, Number(e.target.value)))}
                        placeholder="0"
                        className={`mt-1 w-full rounded-xl border px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition ${
                          badQty ? 'border-red-300 focus:ring-red-400 bg-red-50' : 'border-gray-200 focus:ring-emerald-500'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-400">Satuan</label>
                      <div className="relative mt-1">
                        <select
                          value={item.unit ?? 'pcs'}
                          onChange={(e) => updateItem(i, 'unit', e.target.value)}
                          className="w-full appearance-none rounded-xl border border-gray-200 px-3 py-2 pr-8 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-white"
                        >
                          {UNIT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
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
                        value={item.unitPrice || ''}
                        onChange={(e) => updateItem(i, 'unitPrice', Math.max(0, Number(e.target.value)))}
                        placeholder="0"
                        className={`mt-1 w-full rounded-xl border px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition ${
                          badPrice ? 'border-red-300 focus:ring-red-400 bg-red-50' : 'border-gray-200 focus:ring-emerald-500'
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

          {/* Add item button */}
          <div className="px-5 py-3 border-t border-gray-50">
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Barang
            </button>
          </div>

          {/* Total row */}
          <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
            <div className="flex justify-between text-base font-extrabold text-gray-900">
              <span>Total ({items.length} barang)</span>
              <span className="text-emerald-600">{fmt(totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saved || create.isPending}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {create.isPending ? (
            <>⏳ Menyimpan…</>
          ) : saved ? (
            <>✅ Tersimpan</>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Simpan Struk
            </>
          )}
        </button>
      </main>
    </div>
  )
}
