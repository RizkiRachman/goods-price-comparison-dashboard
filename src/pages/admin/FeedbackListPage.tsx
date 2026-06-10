import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useFeedbackList } from '@/hooks/useFeedbackList'
import { DataTable, type Column } from '@/components/DataTable'
import type { FeedbackQuestion, FeedbackType } from '@/types/api'

const typePill: Record<FeedbackType, { bg: string; text: string; label: string }> = {
  feedback: { bg: 'bg-retro-brand/15', text: 'text-retro-brand', label: 'Feedback' },
  question: { bg: 'bg-retro-success/15', text: 'text-retro-success', label: 'Pertanyaan' },
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
          <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${t.bg} ${t.text}`}>
            {t.label}
          </span>
        )
      },
    },
    {
      key: 'userName',
      header: 'Nama',
      render: (f) => <span className="font-semibold text-retro-body">{f.userName}</span>,
    },
    {
      key: 'userEmail',
      header: 'Email',
      render: (f) => <span className="text-retro-muted text-sm">{f.userEmail}</span>,
    },
    {
      key: 'message',
      header: 'Pesan',
      render: (f) => <span className="text-retro-muted text-sm line-clamp-2">{f.message}</span>,
    },
    {
      key: 'createdAt',
      header: 'Tanggal',
      sortable: true,
      render: (f) => <span className="text-retro-muted text-sm">{formatDate(f.createdAt)}</span>,
    },
  ]

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <span className="text-4xl">{'\u26A0\uFE0F'}</span>
        <p className="text-lg font-semibold text-retro-body">Gagal memuat feedback</p>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-retro-text">Feedback & Pertanyaan</h1>
          <p className="text-sm text-retro-muted mt-0.5">Kelola masukan dari pengguna</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/feedback')}
          className="flex items-center gap-2 px-4 py-2.5 bg-retro-primary text-retro-text rounded-none text-sm font-semibold hover:brightness-110 transition border-[3px] border-retro-primary [border-style:outset] shadow-[0_4px_0_#2a4a68] active:shadow-none active:translate-y-1 focus-visible:ring-2 focus-visible:ring-retro-gold/50 focus-visible:outline-none"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Buat Baru
        </motion.button>
      </div>

      {/* Table */}
      <DataTable          columns={columns}
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