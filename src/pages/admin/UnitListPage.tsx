import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useUnitsList } from '@/hooks/useUnits'
import { useDeleteUnit } from '@/hooks/useUnits'
import { DataTable, type Column } from '@/components/DataTable'
import type { Unit, UnitType, EntityStatus } from '@/types/api'

const unitTypeBadge: Record<UnitType, { bg: string; text: string; label: string }> = {
  WEIGHT: { bg: 'bg-retro-brand/15', text: 'text-retro-brand', label: 'Berat' },
  VOLUME: { bg: 'bg-retro-gold/15', text: 'text-retro-gold', label: 'Volume' },
  QUANTITY: { bg: 'bg-retro-muted/15', text: 'text-retro-muted', label: 'Jumlah' },
}

const statusPill: Record<EntityStatus, { bg: string; text: string }> = {
  pending: { bg: 'bg-retro-muted/15', text: 'text-retro-muted' },
  pending_review: { bg: 'bg-retro-brand/15', text: 'text-retro-brand' },
  pending_approval: { bg: 'bg-retro-warning/15', text: 'text-retro-warning' },
  approved: { bg: 'bg-retro-success/15', text: 'text-retro-success' },
  rejected: { bg: 'bg-retro-danger/15', text: 'text-retro-danger' },
  ingestion: { bg: 'bg-retro-brand/15', text: 'text-retro-brand' },
  ingestion_failed: { bg: 'bg-retro-warning/15', text: 'text-retro-warning' },
  completed: { bg: 'bg-retro-success/15', text: 'text-retro-success' },
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

  const { data, isError } = useUnitsList({
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
      render: (u) => <span className="font-mono text-xs bg-retro-surface-alt text-retro-gold px-2 py-0.5 rounded-none">{u.id}</span>,
    },
    {
      key: 'name',
      header: 'Nama',
      sortable: true,
      render: (u) => <span className="font-semibold text-retro-body">{u.name}</span>,
    },
    {
      key: 'symbol',
      header: 'Simbol',
      render: (u) => <span className="text-retro-muted text-sm">{u.symbol ?? '-'}</span>,
    },
    {
      key: 'type',
      header: 'Tipe',
      sortable: true,
      render: (u) => {
        const badge = unitTypeBadge[u.type]
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-none text-xs font-medium ${badge.bg} ${badge.text}`}>
            {badge.label}
          </span>
        )
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (u) => {
        const s = statusPill[u.status] ?? { bg: 'bg-retro-muted/15', text: 'text-retro-muted' }
        const label = statusLabel[u.status] ?? u.status
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-none text-xs font-medium ${s.bg} ${s.text}`}>
            {label}
          </span>
        )
      },
    },
    {
      key: 'createdAt',
      header: 'Dibuat',
      sortable: true,
      render: (u) => <span className="text-retro-muted text-sm">{new Date(u.createdAt).toLocaleDateString('id-ID')}</span>,
    },
  ]

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <span className="text-4xl">{'\u26A0\uFE0F'}</span>
        <p className="text-lg font-semibold text-retro-body">Gagal memuat satuan</p>
        <button onClick={() => navigate('/goods')} className="text-sm text-retro-brand font-semibold hover:underline">
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
          <h1 className="text-2xl font-extrabold text-retro-text">Satuan</h1>
          <p className="text-sm text-retro-muted mt-0.5">Kelola satuan ukuran produk</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/admin/units/new')}
          className="flex items-center gap-2 px-4 py-2.5 bg-retro-primary text-retro-text rounded-none text-sm font-semibold hover:brightness-110 transition border-[3px] border-retro-primary [border-style:outset] shadow-[0_4px_0_#2a4a68] active:shadow-none active:translate-y-1 focus-visible:ring-2 focus-visible:ring-retro-gold/50 focus-visible:outline-none"
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
            className={`px-3 py-1.5 rounded-none text-xs font-semibold transition ${
              typeFilter === t
                ? 'bg-retro-gold/20 text-retro-gold border-[3px] border-retro-gold/40 [border-style:inset]'
                : 'bg-retro-surface text-retro-muted border-[3px] border-retro-border [border-style:ridge] hover:bg-retro-surface-alt'
            }`}
          >
            {t === '' ? 'Semua' : unitTypeBadge[t].label}
          </button>
        ))}
      </div>

      {/* Table */}
      <DataTable          columns={columns}
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
                className="text-xs text-retro-brand hover:brightness-110 font-medium"
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
                className="text-xs text-retro-danger hover:brightness-110 font-medium"
              >
                Hapus
              </button>
            </div>
          )}
          emptyMessage="Belum ada satuan"
          emptyIcon={'\u2696\uFE0F'}
        />
    </div>
  )
}