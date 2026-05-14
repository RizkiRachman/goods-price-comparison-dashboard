import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import type { PriceRecord } from '@/types/api'
import { useProductPrices, useUpdatePriceRecord, useDeletePriceRecord } from '@/hooks/usePrices'
import { useProduct } from '@/hooks/useGoods'
import { ReceiptRow } from '@/components/PriceComponents'
import { formatPrice } from '@/lib/utils'
import { GlassCard } from '@/components/ui/GlassCard'
import { StaggerGrid, StaggerItem } from '@/components/ui/StaggerGrid'

function PriceSummary({ min, max, latest, unit }: { min: number; max: number; latest: number; unit?: string }) {
  const unitLabel = unit ? `/${unit}` : ''

  const cards = [
    { label: 'Terendah', value: min, color: 'text-emerald-600', bar: 'bg-emerald-500', accent: 'border-l-emerald-400' },
    { label: 'Terbaru',  value: latest, color: 'text-indigo-600', bar: 'bg-indigo-500', accent: 'border-l-indigo-400' },
    { label: 'Tertinggi',value: max, color: 'text-rose-500', bar: 'bg-rose-400', accent: 'border-l-rose-400' },
  ]

  return (
    <motion.div
      className="flex gap-3 mb-8 overflow-x-auto pb-1 no-scrollbar"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 250 }}
    >
      {cards.map((c) => (
        <GlassCard key={c.label} className={`flex-shrink-0 flex-1 min-w-[120px] border-l-4 ${c.accent} p-4`}>
          <p className={`text-xs font-semibold uppercase tracking-widest ${c.color} mb-1`}>{c.label}</p>
          <p className="text-xl font-black tracking-tight text-slate-900">{formatPrice(c.value)}</p>
          {unitLabel && <p className="text-slate-400 text-xs mt-0.5">{unitLabel}</p>}
        </GlassCard>
      ))}
    </motion.div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="grid grid-cols-3 gap-3 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-gray-200 h-24" />
        ))}
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex justify-between">
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32" />
              <div className="h-3 bg-gray-100 rounded w-24" />
            </div>
            <div className="h-6 bg-gray-200 rounded w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}

function ErrorState() {
  return (
    <div className="text-center py-20">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <p className="text-gray-500 font-medium">Gagal memuat data harga</p>
      <p className="text-gray-400 text-sm mt-1">Coba muat ulang halaman</p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <p className="text-gray-500 font-medium">Belum ada data harga</p>
      <p className="text-gray-400 text-sm mt-1">Belum ada catatan harga untuk barang ini</p>
    </div>
  )
}

export default function GoodsDetailPage() {
  const { id } = useParams<{ id: string }>()
  const productId = id ? Number(id) : null
  const { data: product } = useProduct(productId)
  const { data: pricesData, isLoading, isError } = useProductPrices(productId, {
    sortBy: 'price',
    sortOrder: 'asc',
  })

  const rawData = pricesData?.data ?? []
  const goodName = product?.name ?? 'Barang'
  const unit = product?.unit ?? ''

  const isWeightUnit = !!(unit && ['kg', 'kilogram', 'gr', 'gram'].includes(unit.toLowerCase()))
  const getPrice = (item: PriceRecord) =>
    isWeightUnit ? (item.unitPrice ?? item.price) : item.price

  const sorted = isWeightUnit
    ? [...rawData].sort((a, b) => getPrice(a) - getPrice(b))
    : rawData

  const summaryMin = rawData.length > 0 ? Math.min(...rawData.map(getPrice)) : 0
  const summaryMax = rawData.length > 0 ? Math.max(...rawData.map(getPrice)) : 0
  const summaryLatest = rawData.length > 0
    ? getPrice(
        rawData.reduce((latest, item) =>
          new Date(item.dateRecorded) > new Date(latest.dateRecorded) ? item : latest
        ))
    : 0

  const priceMin = rawData.length > 0 ? Math.min(...rawData.map(i => i.price)) : 0
  const priceMax = rawData.length > 0 ? Math.max(...rawData.map(i => i.price)) : 0
  const unitMin = rawData.length > 0 ? Math.min(...rawData.map(i => i.unitPrice ?? i.price)) : 0
  const unitMax = rawData.length > 0 ? Math.max(...rawData.map(i => i.unitPrice ?? i.price)) : 0

  const [editingId, setEditingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [editPrice, setEditPrice] = useState(0)
  const [editUnitPrice, setEditUnitPrice] = useState<number | undefined>(undefined)
  const [editDate, setEditDate] = useState('')

  const { mutate: doUpdate, isPending: isUpdating } = useUpdatePriceRecord(editingId ?? 0, productId)
  const { mutate: doDelete, isPending: isDeletingMutation } = useDeletePriceRecord(productId)

  function startEdit(item: PriceRecord) {
    setEditingId(item.id)
    setEditPrice(item.price)
    setEditUnitPrice(item.unitPrice)
    setEditDate(item.dateRecorded.slice(0, 10))
  }

  function cancelEdit() {
    setEditingId(null)
  }

  function saveEdit() {
    if (editingId == null) return
    doUpdate(
      { price: editPrice, unitPrice: editUnitPrice ?? null, dateRecorded: `${editDate}T00:00:00+07:00` },
      { onSuccess: () => setEditingId(null) },
    )
  }

  function confirmDelete(item: PriceRecord) {
    setDeletingId(item.id)
  }

  function cancelDelete() {
    setDeletingId(null)
  }

  function executeDelete() {
    if (deletingId == null) return
    doDelete(deletingId, { onSuccess: () => setDeletingId(null) })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sticky header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <Link
            to="/goods"
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-slate-900 tracking-tight truncate">{goodName}</h1>
          </div>
          {product?.category && (
            <span className="flex-shrink-0 text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              {product.category}
            </span>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-12">
        {isLoading && <LoadingSkeleton />}

        {isError && <ErrorState />}

        {!isLoading && !isError && sorted.length === 0 && <EmptyState />}

        {!isLoading && !isError && sorted.length > 0 && (
          <>
            <PriceSummary min={summaryMin} max={summaryMax} latest={summaryLatest} unit={unit} />

            <div className="flex items-center justify-between mb-4 px-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                {isWeightUnit ? 'Harga per unit terendah' : 'Harga terendah'}
              </p>
              <p className="text-xs text-slate-400">{sorted.length} hasil</p>
            </div>

            <StaggerGrid className="flex flex-col gap-3">
              {sorted.map((item) => {
                const isEditing = editingId === item.id
                const isDeleting = deletingId === item.id

                if (isDeleting) {
                  return (
                    <StaggerItem key={item.id}>
                      <GlassCard className="border-l-4 border-l-rose-400 p-4">
                        <p className="text-sm font-semibold text-slate-800">Hapus harga dari <span className="text-rose-600">{item.storeName}</span>?</p>
                        <p className="text-xs text-slate-400 mt-1">{formatPrice(item.price)} — {item.dateRecorded.slice(0, 10)}</p>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={executeDelete}
                            disabled={isDeletingMutation}
                            className="flex-1 py-2 rounded-xl text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 disabled:opacity-50 transition"
                          >
                            {isDeletingMutation ? 'Menghapus…' : 'Ya, Hapus'}
                          </button>
                          <button
                            onClick={cancelDelete}
                            disabled={isDeletingMutation}
                            className="flex-1 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 transition"
                          >
                            Batal
                          </button>
                        </div>
                      </GlassCard>
                    </StaggerItem>
                  )
                }

                if (isEditing) {
                  return (
                    <StaggerItem key={item.id}>
                      <GlassCard className="border-l-4 border-l-indigo-400 p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {item.storeName.charAt(0).toUpperCase()}
                          </div>
                          <p className="font-semibold text-slate-900 text-sm">{item.storeName}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="text-xs text-slate-400 font-medium">Harga</label>
                            <input
                              type="number"
                              min={0}
                              step={100}
                              value={editPrice}
                              onChange={(e) => setEditPrice(Math.max(0, Number(e.target.value)))}
                              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            />
                          </div>
                          {isWeightUnit && (
                            <div>
                              <label className="text-xs text-slate-400 font-medium">Harga/unit</label>
                              <input
                                type="number"
                                min={0}
                                step={100}
                                value={editUnitPrice ?? ''}
                                onChange={(e) => setEditUnitPrice(e.target.value ? Number(e.target.value) : undefined)}
                                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                              />
                            </div>
                          )}
                          <div>
                            <label className="text-xs text-slate-400 font-medium">Tanggal</label>
                            <input
                              type="date"
                              value={editDate}
                              onChange={(e) => setEditDate(e.target.value)}
                              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={saveEdit}
                            disabled={isUpdating}
                            className="flex-1 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition"
                          >
                            {isUpdating ? 'Menyimpan…' : 'Simpan'}
                          </button>
                          <button
                            onClick={cancelEdit}
                            disabled={isUpdating}
                            className="flex-1 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 transition"
                          >
                            Batal
                          </button>
                        </div>
                      </GlassCard>
                    </StaggerItem>
                  )
                }

                return (
                  <StaggerItem key={item.id}>
                    <ReceiptRow
                      item={item}
                      min={isWeightUnit ? unitMin : priceMin}
                      max={isWeightUnit ? unitMax : priceMax}
                      isLowest={getPrice(item) === summaryMin}
                      showUnitPrice={isWeightUnit}
                      onEdit={startEdit}
                      onDelete={confirmDelete}
                    />
                  </StaggerItem>
                )
              })}
            </StaggerGrid>
          </>
        )}
      </main>
    </div>
  )
}
