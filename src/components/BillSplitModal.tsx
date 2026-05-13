import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { FormModal } from '@/components/FormModal'
import { FormBanner } from '@/components/FormBanner'
import { useBillSplit } from '@/hooks/useBillSplit'
import { formatPrice } from '@/lib/utils'
import type { ReceiptResultItem } from '@/types/api'

interface BillSplitModalProps {
  open: boolean
  onClose: () => void
  receiptId: string
  items: ReceiptResultItem[]
}

interface OrderDetail {
  id: string
  name: string
  selections: { productIndex: number; quantity: number }[]
}

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  )
}

let nextId = 1
function createId() {
  return `od-${nextId++}`
}

export function BillSplitModal({ open, onClose, receiptId, items }: BillSplitModalProps) {
  // ── Views ──
  const [view, setView] = useState<'mode' | 'max' | 'list' | 'result'>('mode')

  // ── Mode ──
  const [mode, setMode] = useState<'RATIO' | 'SELECTION'>('SELECTION')

  // ── Max participants ──
  const [maxParticipants, setMaxParticipants] = useState(2)

  // ── Order details ──
  const [details, setDetails] = useState<OrderDetail[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [expandedResultIdx, setExpandedResultIdx] = useState<number | null>(null)

  // ── Form state (add/edit detail) ──
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formName, setFormName] = useState('')
  const [formQty, setFormQty] = useState<number[]>(() => items.map(() => 0))

  const splitMutation = useBillSplit()

  // ── Helpers ──

  /** How many of item[i] are still available (not claimed by any saved detail) */
  function getAvailable(productIndex: number, excludeId?: string): number {
    const total = Math.ceil(items[productIndex]?.quantity ?? 0)
    const claimed = details.reduce((sum, d) => {
      if (d.id === excludeId) return sum
      const sel = d.selections.find((s) => s.productIndex === productIndex)
      return sum + (sel?.quantity ?? 0)
    }, 0)
    return Math.max(0, total - claimed)
  }

  /** Subtotal for one detail (proportional from receipt totalPrice) */
  function detailSubtotal(detail: OrderDetail): number {
    return detail.selections.reduce((sum, s) => {
      const item = items[s.productIndex]
      if (!item) return sum
      const total = Math.ceil(item.quantity)
      return sum + (s.quantity / total) * (item.totalPrice ?? item.quantity * item.unitPrice)
    }, 0)
  }

  /** Items not fully assigned across all details */
  function unassignedItems(): { productIndex: number; remaining: number; total: number; subtotal: number }[] {
    return items.map((item, i) => {
      const total = Math.ceil(item.quantity)
      const claimed = details.reduce((sum, d) => {
        const sel = d.selections.find((s) => s.productIndex === i)
        return sum + (sel?.quantity ?? 0)
      }, 0)
      const remaining = total - claimed
      const subtotal = remaining > 0 ? (remaining / total) * (item.totalPrice ?? item.quantity * item.unitPrice) : 0
      return { productIndex: i, remaining, total, subtotal }
    }).filter((u) => u.remaining > 0)
  }

  const totalAmount = items.reduce((sum, i) => sum + (i.totalPrice ?? i.quantity * i.unitPrice), 0)
  const canProcess = details.length >= 2 && details.every((d) => d.name.trim().length > 0)

  // ── Reset ──
  function reset() {
    setView('mode')
    setMode('SELECTION')
    setMaxParticipants(2)
    setDetails([])
    closeForm()
    splitMutation.reset()
  }

  function handleClose() {
    reset()
    onClose()
  }

  // ── Form actions ──

  function openAddForm() {
    setEditingId(null)
    setFormName('')
    setFormQty(items.map(() => 0))
    setFormOpen(true)
  }

  function openEditForm(id: string) {
    const detail = details.find((d) => d.id === id)
    if (!detail) return
    setEditingId(id)
    setFormName(detail.name)
    setFormQty(items.map((_, i) => {
      const sel = detail.selections.find((s) => s.productIndex === i)
      return sel?.quantity ?? 0
    }))
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setEditingId(null)
    setFormName('')
    setFormQty(items.map(() => 0))
  }

  function handleFormQtyChange(productIndex: number, delta: number) {
    setFormQty((prev) => {
      const next = [...prev]
      const current = next[productIndex]
      const newQty = current + delta
      const available = getAvailable(productIndex, editingId ?? undefined)
      if (newQty < 0) return prev
      if (newQty > available) return prev
      next[productIndex] = newQty
      return next
    })
  }

  function handleSaveForm() {
    const name = formName.trim()
    if (!name) return

    const selections = formQty
      .map((qty, i) => ({ productIndex: i, quantity: qty }))
      .filter((s) => s.quantity > 0)

    if (editingId) {
      setDetails((prev) => prev.map((d) =>
        d.id === editingId ? { ...d, name, selections } : d
      ))
    } else {
      setDetails((prev) => [...prev, { id: createId(), name, selections }])
    }
    closeForm()
  }

  function handleDeleteDetail(id: string) {
    setDetails((prev) => prev.filter((d) => d.id !== id))
  }

  // ── Compute split ──

  function handleCompute() {
    if (mode === 'RATIO') {
      splitMutation.mutate({
        receiptId,
        body: { type: 'RATIO', numberOfParticipants: maxParticipants },
      }, {
        onSuccess: () => setView('result'),
      })
    } else {
      const orders = details.map((d) => ({
        name: d.name,
        details: d.selections
          .filter((s) => s.quantity > 0)
          .map((s) => ({ name: items[s.productIndex]?.productName ?? '', productId: 0, quantity: s.quantity })),
      }))
      splitMutation.mutate({
        receiptId,
        body: { type: 'SELECTION', numberOfParticipants: maxParticipants, orders },
      }, {
        onSuccess: () => setView('result'),
      })
    }
  }

  const result = splitMutation.data

  // ── Render ──

  return (
    <FormModal
      open={open}
      onClose={handleClose}
      title="Split Bill"
      subtitle={view === 'mode' ? 'Pilih metode pembagian' : view === 'max' ? 'Atur jumlah peserta' : view === 'list' ? 'Pilih barang per peserta' : 'Hasil pembagian'}
    >
      <AnimatePresence mode="wait">
        {/* ═══════ MODE VIEW ═══════ */}
        {view === 'mode' && (
          <motion.div key="mode" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3 mt-2">
            <button
              onClick={() => { setMode('SELECTION'); setView('max') }}
              className={`w-full text-left p-4 rounded-2xl border-2 transition ${mode === 'SELECTION' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}
            >
              <p className="font-bold text-gray-900">Pilih Barang</p>
              <p className="text-sm text-gray-500 mt-1">Setiap peserta memilih barang yang dibeli. Cocok untuk belanja bersama dimana tiap orang belanja berbeda.</p>
            </button>
            <button
              onClick={() => { setMode('RATIO'); setView('max') }}
              className={`w-full text-left p-4 rounded-2xl border-2 transition ${mode === 'RATIO' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}
            >
              <p className="font-bold text-gray-900">Bagi Rata</p>
              <p className="text-sm text-gray-500 mt-1">Total dibagi sama rata ke seluruh peserta. Cocok untuk biaya bersama seperti traktiran atau patungan.</p>
            </button>
          </motion.div>
        )}

        {/* ═══════ MAX VIEW ═══════ */}
        {view === 'max' && (
          <motion.div key="max" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 mt-2">
            <button
              onClick={() => setView('mode')}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition"
              aria-label="Kembali ke pilih mode"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">{'\uD83D\uDC65'}</div>
              <p className="text-lg font-bold text-gray-900 mb-1">Berapa orang?</p>
              <p className="text-sm text-gray-500">Masukkan jumlah maksimal peserta</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-5 space-y-4">
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setMaxParticipants(Math.max(2, maxParticipants - 1))}
                  className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition text-xl font-bold"
                >
                  {'\u2212'}
                </button>
                <span className="w-16 text-center text-4xl font-extrabold text-gray-900">{maxParticipants}</span>
                <button
                  onClick={() => setMaxParticipants(maxParticipants + 1)}
                  className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition text-xl font-bold"
                >
                  +
                </button>
              </div>
              <p className="text-center text-xs text-gray-400">Minimal 2 orang</p>
            </div>

            <button
              onClick={() => mode === 'RATIO' ? handleCompute() : setView('list')}
              className="w-full py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition"
            >
              {mode === 'RATIO' ? 'Hitung' : 'Lanjut'}
            </button>
          </motion.div>
        )}

        {/* ═══════ LIST VIEW ═══════ */}
        {view === 'list' && (
          <motion.div key="list" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 mt-2">
            <FormBanner type="error" message={splitMutation.error?.message ?? 'Gagal menghitung split'} visible={splitMutation.isError} />

            {/* Navbar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setView('max')}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition"
                  aria-label="Ubah jumlah peserta"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <p className="text-sm font-bold text-gray-900">Peserta ({details.length}/{maxParticipants})</p>
              </div>
              <button
                onClick={openAddForm}
                disabled={details.length >= maxParticipants}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tambah
              </button>
            </div>

            {/* Empty state */}
            {details.length === 0 && (
              <div className="py-8 text-center">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3">{'\uD83D\uDC65'}</div>
                <p className="text-sm font-medium text-gray-500">Belum ada peserta</p>
                <p className="text-xs text-gray-400 mt-1">Maksimal {maxParticipants} peserta</p>
              </div>
            )}

            {/* Detail cards */}
            <div className="space-y-2">
              {details.map((detail) => {
                const subtotal = detailSubtotal(detail)
                const itemCount = detail.selections.reduce((s, sel) => s + sel.quantity, 0)
                const isExpanded = expandedId === detail.id
                return (
                  <motion.div
                    key={detail.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 rounded-xl overflow-hidden"
                  >
                    {/* Collapsed header — clickable */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : detail.id)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-100/50 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-xs font-bold text-indigo-600 flex-shrink-0">
                          {detail.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{detail.name}</p>
                          <p className="text-xs text-gray-400">{itemCount} barang</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-sm font-bold text-gray-900">{formatPrice(subtotal)}</span>
                        <button onClick={(e) => { e.stopPropagation(); openEditForm(detail.id) }} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteDetail(detail.id) }} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </button>

                    {/* Expanded item details */}
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-200 px-4 py-2 space-y-1"
                      >
                        {detail.selections.length === 0 ? (
                          <p className="text-xs text-gray-400 italic py-1">Belum memilih barang</p>
                        ) : (
                          detail.selections.map((s, j) => {
                            const item = items[s.productIndex]
                            if (!item) return null
                            const total = Math.ceil(item.quantity)
                            const lineTotal = (s.quantity / total) * (item.totalPrice ?? item.quantity * item.unitPrice)
                            return (
                              <div key={j} className="flex justify-between text-xs text-gray-500">
                                <span>{item.productName} {'\u00D7'}{s.quantity}</span>
                                <span>{formatPrice(lineTotal)}</span>
                              </div>
                            )
                          })
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* Unassigned summary */}
            {details.length > 0 && unassignedItems().length > 0 && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-amber-700">{'\u26A0\uFE0F'}</span>
                  <p className="text-sm font-medium text-amber-800">
                    {unassignedItems().reduce((s, u) => s + u.remaining, 0)} barang belum dibagi
                  </p>
                </div>
                <span className="text-sm font-bold text-amber-700">
                  {formatPrice(unassignedItems().reduce((s, u) => s + u.subtotal, 0))}
                </span>
              </div>
            )}

            {/* Summary */}
            {details.length > 0 && (
              <div className="bg-indigo-50 rounded-xl px-4 py-3 flex justify-between items-center">
                <span className="text-sm font-semibold text-indigo-800">Total Struk</span>
                <span className="text-lg font-extrabold text-indigo-700">{formatPrice(totalAmount)}</span>
              </div>
            )}

            {/* Process button */}
            <button
              onClick={handleCompute}
              disabled={!canProcess || splitMutation.isPending}
              className="w-full py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {splitMutation.isPending ? <Spinner /> : null}
              {splitMutation.isPending ? 'Memproses\u2026' : 'Proses Split Bill'}
            </button>
            {!canProcess && details.length > 0 && (
              <p className="text-xs text-center text-gray-400">Minimal 2 peserta dengan nama untuk memproses</p>
            )}

            {/* ═══════ FORM OVERLAY (add/edit detail) ═══════ */}
            <AnimatePresence>
              {formOpen && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4"
                >
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeForm} />
                  <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 60 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[80vh] flex flex-col"
                  >
                    {/* Drag handle */}
                    <div className="flex justify-center pt-3 pb-1 sm:hidden">
                      <div className="w-10 h-1 bg-gray-300 rounded-full" />
                    </div>

                    {/* Form header */}
                    <div className="flex items-center justify-between px-5 pt-3 pb-2">
                      <h3 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Peserta' : 'Tambah Peserta'}</h3>
                      <button onClick={closeForm} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Form content */}
                    <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-4">
                      {/* Name + Save (sticky top) */}
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Nama</label>
                          <input
                            type="text"
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            placeholder="Nama peserta"
                            autoFocus
                            className="w-full h-10 rounded-xl border border-gray-200 px-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                          />
                        </div>
                        <div className="flex flex-col justify-end">
                          <button
                            onClick={handleSaveForm}
                            disabled={!formName.trim() || !formQty.some((q) => q > 0)}
                            className="h-10 px-5 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition whitespace-nowrap"
                          >
                            Simpan
                          </button>
                        </div>
                      </div>

                      {/* Items */}
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Pilih Barang</p>
                        <div className="border border-gray-100 rounded-xl divide-y divide-gray-100">
                          {items.length === 0 ? (
                            <div className="py-6 text-center text-sm text-gray-400">Tidak ada barang</div>
                          ) : (
                            items
                              .map((item, i) => ({ item, i, available: getAvailable(i, editingId ?? undefined), myQty: formQty[i] }))
                              .filter(({ available, myQty }) => available > 0 || myQty > 0)
                              .map(({ item, i: origIndex, available, myQty }) => {
                              const totalQty = Math.ceil(item.quantity)
                              const isFullyTaken = available <= 0 && myQty === 0
                              return (
                                <div key={origIndex} className={`px-4 py-3 ${isFullyTaken ? 'opacity-40' : ''}`}>
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0 mr-3">
                                      <p className={`text-sm font-medium truncate ${isFullyTaken ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                        {item.productName}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                      <button
                                        onClick={() => handleFormQtyChange(origIndex, -1)}
                                        disabled={myQty <= 0}
                                        className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition text-xs font-bold"
                                      >
                                        {'\u2212'}
                                      </button>
                                      <span className="w-8 text-center text-sm font-bold text-gray-900">{myQty}</span>
                                      <button
                                        onClick={() => handleFormQtyChange(origIndex, 1)}
                                        disabled={myQty >= available}
                                        className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition text-xs font-bold"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>

                                  {/* Quantity bar */}
                                  {totalQty > 0 && (
                                    <div className="flex items-center gap-2 mt-1.5">
                                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-indigo-500 rounded-full transition-all duration-200"
                                          style={{ width: `${Math.min(((myQty + (totalQty - available)) / totalQty) * 100, 100)}%` }}
                                        />
                                      </div>
                                      <span className={`text-xs font-medium flex-shrink-0 w-14 text-right ${available <= 0 ? 'text-red-400' : 'text-gray-400'}`}>
                                        {available <= 0 && myQty === 0 ? 'habis' : `sisa ${available}`}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )
                            })
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ═══════ RESULT VIEW ═══════ */}
        {view === 'result' && result && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4 mt-2">
            {/* Summary */}
            <div className="bg-indigo-50 rounded-2xl px-4 py-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-indigo-800">Total</p>
                <p className="text-xl font-extrabold text-indigo-700">{formatPrice(result.totalAmount)}</p>
              </div>
              {result.unassignedTotal > 0 && (
                <div className="flex justify-between items-center mt-1.5">
                  <p className="text-xs text-indigo-500">Tidak terbagi</p>
                  <p className="text-sm font-semibold text-indigo-600">{formatPrice(result.unassignedTotal)}</p>
                </div>
              )}
            </div>

            {/* Per-participant breakdown */}
            <div className="space-y-2">
              {result.participants.map((p, i) => {
                const itemCount = p.items.reduce((s, item) => s + item.quantity, 0)
                const isExpanded = expandedResultIdx === i
                return (
                  <div key={i} className="bg-gray-50 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedResultIdx(isExpanded ? null : i)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-100/50 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-xs font-bold text-indigo-600 flex-shrink-0">
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{p.name}</p>
                          <p className="text-xs text-gray-400">{itemCount} barang</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{formatPrice(p.subtotal)}</span>
                    </button>

                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="border-t border-gray-200 px-4 py-2 space-y-1"
                      >
                        {p.items.length > 0 ? (
                          p.items.map((item, j) => (
                            <div key={j} className="flex justify-between text-xs text-gray-500">
                              <span>{item.productName} {'\u00D7'}{item.quantity}</span>
                              <span>{formatPrice(item.subtotal)}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-gray-400 italic py-1">Tidak memilih barang</p>
                        )}
                      </motion.div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={reset} className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition">
                Hitung Ulang
              </button>
              <button onClick={handleClose} className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition">
                Selesai
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </FormModal>
  )
}
