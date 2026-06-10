import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useCategoriesList } from '@/hooks/useCategories'
import { useDeleteCategory } from '@/hooks/useCategories'
import { DataTable, type Column } from '@/components/DataTable'
import type { Category, EntityStatus } from '@/types/api'

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

export default function CategoryListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'id' | 'name' | 'createdAt'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const { data, isError } = useCategoriesList({
    page,
    pageSize: 20,
    search: search || undefined,
    sortBy,
    sortOrder,
  })

  const deleteMutation = useDeleteCategory()

  const columns: Column<Category>[] = [
    {
      key: 'id',
      header: 'ID',
      render: (c) => <span className="font-mono text-xs bg-retro-surface-alt text-retro-gold px-2 py-0.5 rounded-none">{c.id}</span>,
    },
    {
      key: 'name',
      header: 'Nama',
      sortable: true,
      render: (c) => <span className="font-semibold text-retro-body">{c.name}</span>,
    },
    {
      key: 'description',
      header: 'Deskripsi',
      render: (c) => (
        <span className="text-retro-muted text-sm line-clamp-2">{c.description ?? '-'}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (c) => {
        const s = statusPill[c.status] ?? { bg: 'bg-retro-muted/15', text: 'text-retro-muted' }
        const label = statusLabel[c.status] ?? c.status
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${s.bg} ${s.text}`}>
            {label}
          </span>
        )
      },
    },
    {
      key: 'createdAt',
      header: 'Dibuat',
      sortable: true,
      render: (c) => <span className="text-retro-muted text-sm">{new Date(c.createdAt).toLocaleDateString('id-ID')}</span>,
    },
  ]

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <span className="text-4xl">{'\u26A0\uFE0F'}</span>
        <p className="text-lg font-semibold text-retro-body">Gagal memuat kategori</p>
        <button onClick={() => navigate('/goods')} className="text-sm text-retro-brand font-semibold hover:underline">
          Kembali
        </button>
      </div>
    )
  }

  const categories = data?.data ?? []
  const pagination = data?.pagination ?? { page: 1, pageSize: 20, totalItems: 0, totalPages: 1, hasNext: false, hasPrevious: false }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-retro-text">Kategori</h1>
          <p className="text-sm text-retro-muted mt-0.5">Kelola kategori produk</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/admin/categories/new')}
          className="flex items-center gap-2 px-4 py-2.5 bg-retro-primary text-retro-text rounded-none text-sm font-semibold hover:brightness-110 transition border-[3px] border-retro-primary [border-style:outset] shadow-[0_4px_0_#2a4a68] active:shadow-none active:translate-y-1 focus-visible:ring-2 focus-visible:ring-retro-gold/50 focus-visible:outline-none"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Kategori
        </motion.button>
      </div>

      {/* Table */}
      <DataTable
          columns={columns}
          data={categories}
          pagination={pagination}
          onPageChange={setPage}
          onSearch={setSearch}
          searchPlaceholder={'Cari kategori\u2026'}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={(s, o) => { setSortBy(s as typeof sortBy); setSortOrder(o) }}
          onRowClick={(c) => navigate(`/admin/categories/${c.id}`)}
          actions={(c) => (
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/admin/categories/${c.id}`) }}
                className="text-xs text-retro-brand hover:brightness-110 font-medium"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (confirm(`Hapus kategori "${c.name}"?`)) {
                    deleteMutation.mutate(c.id)
                  }
                }}
                className="text-xs text-retro-danger hover:brightness-110 font-medium"
              >
                Hapus
              </button>
            </div>
          )}
          emptyMessage="Belum ada kategori"
          emptyIcon={'\uD83C\uDFF7\uFE0F'}
        />
    </div>
  )
}