import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useUnitsList } from '@/hooks/useUnits'
import { useDeleteUnit } from '@/hooks/useUnits'
import { DataTable, type Column } from '@/components/DataTable'
import type { Unit, UnitType, EntityStatus } from '@/types/api'

const unitTypeBadge: Record<UnitType, { bg: string; text: string; label: string }> = {
  WEIGHT: { bg: 'bg-blue-50', text: 'text-blue-600', label: 'Berat' },
  VOLUME: { bg: 'bg-cyan-50', text: 'text-cyan-600', label: 'Volume' },
  QUANTITY: { bg: 'bg-purple-50', text: 'text-purple-600', label: 'Jumlah' },
}

const statusPill: Record<EntityStatus, { bg: string; text: string }> = {
  pending: { bg: 'bg-gray-100', text: 'text-gray-600' },
  pending_review: { bg: 'bg-blue-50', text: 'text-blue-600' },
  pending_approval: { bg: 'bg-amber-50', text: 'text-amber-600' },
  approved: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  rejected: { bg: 'bg-red-50', text: 'text-red-600' },
  ingestion: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
  ingestion_failed: { bg: 'bg-orange-50', text: 'text-orange-600' },
  completed: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
}

const statusLabel: Record<EntityStatus, string> = {
  pending: 'Tertunda',
  pending_review: 'Perlu Review',
  pending_approval: 'Perlu Persetujuan',
  approved: 'Disetujui',
  rejected: 'Ditolak',
  ingestion: 'Diproses',
  ingestion_failed: 'Gagal Diproses',
  completed: 'Selesai',
}

export default function UnitListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<UnitType | ''>('')
  const [sortBy, setSortBy] = useState<'id' | 'name' | 'type' | 'createdAt'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const { data, isLoading, isError } = useUnitsList({
    page,
    pageSize: 20,
    search: search || undefined,
    type: typeFilter || undefined,
    sortBy,
    sortOrder,
  })

  const deleteMutation = useDeleteUnit()

  const columns: Column<Unit>[] = [
    {
      key: 'id',
      header: 'ID',
      render: (u) => <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{u.id}</span>,
    },
    {
      key: 'name',
      header: 'Nama',
      sortable: true,
      render: (u) => <span className="font-semibold text-gray-900">{u.name}</span>,
    },
    {
      key: 'symbol',
      header: 'Simbol',
      render: (u) => <span className="text-gray-500 text-sm">{u.symbol ?? '-'}</span>,
    },
    {
      key: 'type',
      header: 'Tipe',
      sortable: true,
      render: (u) => {
        const badge = unitTypeBadge[u.type]
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
            {badge.label}
          </span>
        )
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (u) => {
        const s = statusPill[u.status]
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
            {statusLabel[u.status]}
          </span>
        )
      },
    },
    {
      key: 'createdAt',
      header: 'Dibuat',
      sortable: true,
      render: (u) => <span className="text-gray-400 text-sm">{new Date(u.createdAt).toLocaleDateString('id-ID')}</span>,
    },
  ]

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <span className="text-4xl">{'\u26A0\uFE0F'}</span>
        <p className="text-lg font-semibold text-gray-700">Gagal memuat satuan</p>
        <button onClick={() => navigate('/goods')} className="text-sm text-indigo-600 font-semibold hover:underline">
          Kembali
        </button>
      </div>
    )
  }

  const units = data?.data ?? []
  const pagination = data?.pagination ?? { page: 1, pageSize: 20, totalItems: 0, totalPages: 1, hasNext: false, hasPrevious: false }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Satuan</h1>
          <p className="text-sm text-gray-500 mt-0.5">Kelola satuan ukuran produk</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/admin/units/new')}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Satuan
        </motion.button>
      </div>

      {/* Type filter */}
      <div className="flex items-center gap-2">
        {(['', 'WEIGHT', 'VOLUME', 'QUANTITY'] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTypeFilter(t); setPage(1) }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              typeFilter === t
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {t === '' ? 'Semua' : unitTypeBadge[t].label}
          </button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 bg-white rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={units}
          pagination={pagination}
          onPageChange={setPage}
          onSearch={(q) => { setSearch(q); setPage(1) }}
          searchPlaceholder={'Cari satuan\u2026'}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={(s, o) => { setSortBy(s as typeof sortBy); setSortOrder(o) }}
          onRowClick={(u) => navigate(`/admin/units/${u.id}`)}
          actions={(u) => (
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/admin/units/${u.id}`) }}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (confirm(`Hapus satuan "${u.name}"?`)) {
                    deleteMutation.mutate(u.id)
                  }
                }}
                className="text-xs text-red-500 hover:text-red-700 font-medium"
              >
                Hapus
              </button>
            </div>
          )}
          emptyMessage="Belum ada satuan"
          emptyIcon={'\u2696\uFE0F'}
        />
      )}
    </div>
  )
}