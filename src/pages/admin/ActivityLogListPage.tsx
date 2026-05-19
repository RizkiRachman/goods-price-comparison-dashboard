import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useActivityLogsList } from '@/hooks/useActivityLogs'
import { DataTable, type Column } from '@/components/DataTable'
import type { ActivityLog } from '@/types/api'

const typeBadge: Record<string, { bg: string; text: string; label: string }> = {
  RECEIPT: { bg: 'bg-blue-50', text: 'text-blue-600', label: 'Struk' },
  PRODUCT: { bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'Produk' },
  STORE: { bg: 'bg-amber-50', text: 'text-amber-600', label: 'Toko' },
  PRICE_RECORD: { bg: 'bg-purple-50', text: 'text-purple-600', label: 'Harga' },
  CATEGORY: { bg: 'bg-pink-50', text: 'text-pink-600', label: 'Kategori' },
  UNIT: { bg: 'bg-cyan-50', text: 'text-cyan-600', label: 'Satuan' },
  FEEDBACK_QUESTION: { bg: 'bg-indigo-50', text: 'text-indigo-600', label: 'Feedback' },
  ALERT: { bg: 'bg-red-50', text: 'text-red-600', label: 'Alert' },
}

const actionBadge: Record<string, { bg: string; text: string; label: string }> = {
  CREATE: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Buat' },
  UPDATE: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Ubah' },
  DELETE: { bg: 'bg-red-50', text: 'text-red-700', label: 'Hapus' },
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
        const badge = typeBadge[log.type] ?? { bg: 'bg-gray-100', text: 'text-gray-600', label: log.type }
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
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
        const badge = actionBadge[log.action] ?? { bg: 'bg-gray-100', text: 'text-gray-600', label: log.action }
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
            {badge.label}
          </span>
        )
      },
    },
    {
      key: 'description',
      header: 'Deskripsi',
      render: (log) => <span className="text-gray-700 text-sm">{log.description}</span>,
    },
    {
      key: 'createdAt',
      header: 'Waktu',
      sortable: true,
      render: (log) => <span className="text-gray-400 text-sm whitespace-nowrap">{formatDate(log.createdAt)}</span>,
    },
  ]

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <span className="text-4xl">{'\u26A0\uFE0F'}</span>
        <p className="text-lg font-semibold text-gray-700">Gagal memuat log aktivitas</p>
        <button onClick={() => navigate('/goods')} className="text-sm text-indigo-600 font-semibold hover:underline">
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
        <h1 className="text-2xl font-extrabold text-gray-900">Log Aktivitas</h1>
        <p className="text-sm text-gray-500 mt-0.5">Riwayat aktivitas pengguna</p>
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
