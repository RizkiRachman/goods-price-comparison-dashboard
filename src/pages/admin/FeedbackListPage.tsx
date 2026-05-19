import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useFeedbackList } from '@/hooks/useFeedbackList'
import { DataTable, type Column } from '@/components/DataTable'
import type { FeedbackQuestion, FeedbackType } from '@/types/api'

const typePill: Record<FeedbackType, { bg: string; text: string; label: string }> = {
  feedback: { bg: 'bg-indigo-50', text: 'text-indigo-600', label: 'Feedback' },
  question: { bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'Pertanyaan' },
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

export default function FeedbackListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<'createdAt' | 'type'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const { data, isError } = useFeedbackList({
    page,
    pageSize: 20,
    sortBy,
    sortOrder,
  })

  const columns: Column<FeedbackQuestion>[] = [
    {
      key: 'type',
      header: 'Tipe',
      sortable: true,
      render: (f) => {
        const t = typePill[f.type]
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${t.bg} ${t.text}`}>
            {t.label}
          </span>
        )
      },
    },
    {
      key: 'userName',
      header: 'Nama',
      render: (f) => <span className="font-semibold text-gray-900">{f.userName}</span>,
    },
    {
      key: 'userEmail',
      header: 'Email',
      render: (f) => <span className="text-gray-500 text-sm">{f.userEmail}</span>,
    },
    {
      key: 'message',
      header: 'Pesan',
      render: (f) => <span className="text-gray-500 text-sm line-clamp-2">{f.message}</span>,
    },
    {
      key: 'createdAt',
      header: 'Tanggal',
      sortable: true,
      render: (f) => <span className="text-gray-400 text-sm">{formatDate(f.createdAt)}</span>,
    },
  ]

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <span className="text-4xl">{'\u26A0\uFE0F'}</span>
        <p className="text-lg font-semibold text-gray-700">Gagal memuat feedback</p>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Feedback & Pertanyaan</h1>
          <p className="text-sm text-gray-500 mt-0.5">Kelola masukan dari pengguna</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/feedback')}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Buat Baru
        </motion.button>
      </div>

      {/* Table */}
      <DataTable
          columns={columns}
          data={items}
          pagination={pagination}
          onPageChange={setPage}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={(s, o) => { setSortBy(s as typeof sortBy); setSortOrder(o) }}
          emptyMessage="Belum ada feedback"
          emptyIcon={'\uD83D\uDCDD'}
        />
    </div>
  )
}