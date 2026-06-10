import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useActivityLogsList } from '@/hooks/useActivityLogs'
import { DataTable, type Column } from '@/components/DataTable'
import type { ActivityLog } from '@/types/api'

const typeBadge: Record<string, { bg: string; text: string; label: string }> = {
  RECEIPT: { bg: 'bg-retro-brand/15', text: 'text-retro-brand', label: 'Struk' },
  PRODUCT: { bg: 'bg-retro-success/15', text: 'text-retro-success', label: 'Produk' },
  STORE: { bg: 'bg-retro-warning/15', text: 'text-retro-warning', label: 'Toko' },
  PRICE_RECORD: { bg: 'bg-retro-muted/15', text: 'text-retro-muted', label: 'Harga' },
  CATEGORY: { bg: 'bg-retro-danger/15', text: 'text-retro-danger', label: 'Kategori' },
  UNIT: { bg: 'bg-retro-gold/15', text: 'text-retro-gold', label: 'Satuan' },
  FEEDBACK_QUESTION: { bg: 'bg-retro-brand/15', text: 'text-retro-brand', label: 'Feedback' },
  ALERT: { bg: 'bg-retro-danger/15', text: 'text-retro-danger', label: 'Alert' },
}

const actionBadge: Record<string, { bg: string; text: string; label: string }> = {
  CREATE: { bg: 'bg-retro-success/15', text: 'text-retro-success', label: 'Buat' },
  UPDATE: { bg: 'bg-retro-brand/15', text: 'text-retro-brand', label: 'Ubah' },
  DELETE: { bg: 'bg-retro-danger/15', text: 'text-retro-danger', label: 'Hapus' },
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function ActivityLogListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<'createdAt' | 'type' | 'action'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const { data, isLoading, isError } = useActivityLogsList({
    page,
    pageSize: 20,
    sortBy,
    sortOrder,
  })

  const columns: Column<ActivityLog>[] = [
    {
      key: 'type',
      header: 'Tipe',
      sortable: true,
      render: (log) => {
        const badge = typeBadge[log.type] ?? { bg: 'bg-retro-surface-alt', text: 'text-retro-muted', label: log.type }
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${badge.bg} ${badge.text}`}>
            {badge.label}
          </span>
        )
      },
    },
    {
      key: 'action',
      header: 'Aksi',
      sortable: true,
      render: (log) => {
        const badge = actionBadge[log.action] ?? { bg: 'bg-retro-surface-alt', text: 'text-retro-muted', label: log.action }
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${badge.bg} ${badge.text}`}>
            {badge.label}
          </span>
        )
      },
    },
    {
      key: 'description',
      header: 'Deskripsi',
      render: (log) => <span className="text-retro-body text-sm">{log.description}</span>,
    },
    {
      key: 'createdAt',
      header: 'Waktu',
      sortable: true,
      render: (log) => <span className="text-retro-muted text-sm whitespace-nowrap">{formatDate(log.createdAt)}</span>,
    },
  ]

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <span className="text-4xl">{'\u26A0\uFE0F'}</span>
        <p className="text-lg font-semibold text-retro-body">Gagal memuat log aktivitas</p>
        <button onClick={() => navigate('/goods')} className="text-sm text-retro-brand font-semibold hover:underline">
          Kembali
        </button>
      </div>
    )
  }

  const items = data?.data ?? []
  const pagination = data?.pagination ?? { page: 1, pageSize: 20, totalItems: 0, totalPages: 1, hasNext: false, hasPrevious: false }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-retro-text">Log Aktivitas</h1>
        <p className="text-sm text-retro-muted mt-0.5">Riwayat aktivitas pengguna</p>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 bg-retro-surface-alt rounded-none animate-pulse" />
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={items}
          pagination={pagination}
          onPageChange={setPage}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={(s, o) => { setSortBy(s as typeof sortBy); setSortOrder(o) }}
          emptyMessage="Belum ada log aktivitas"
          emptyIcon={'\uD83D\uDCCB'}
        />
      )}
    </div>
  )
}
