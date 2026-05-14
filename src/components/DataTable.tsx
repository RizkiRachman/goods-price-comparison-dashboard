import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Pagination } from './Pagination'
import type { Pagination as PaginationType } from '@/types/api'

export interface Column<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  sortable?: boolean
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  pagination: PaginationType
  onPageChange: (page: number) => void
  onSearch?: (query: string) => void
  searchPlaceholder?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  onSort?: (sortBy: string, sortOrder: 'asc' | 'desc') => void
  onRowClick?: (row: T) => void
  actions?: (row: T) => ReactNode
  emptyMessage?: string
  emptyIcon?: string
  searchValue?: string
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  pagination,
  onPageChange,
  onSearch,
  searchPlaceholder = 'Cari\u2026',
  sortBy,
  sortOrder,
  onSort,
  onRowClick,
  actions,
  emptyMessage = 'Tidak ada data',
  emptyIcon = '\uD83D\uDCCB',
  searchValue,
}: DataTableProps<T>) {
  const [internalSearch, setInternalSearch] = useState('')
  const search = searchValue ?? internalSearch

  function handleSearchChange(value: string) {
    setInternalSearch(value)
    onSearch?.(value)
  }

  function handleSort(key: string) {
    if (!onSort) return
    const next = sortBy === key && sortOrder === 'asc' ? 'desc' : 'asc'
    onSort(key, next)
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      {onSearch && (
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    {col.sortable && onSort ? (
                      <button
                        onClick={() => handleSort(col.key)}
                        className="flex items-center gap-1 hover:text-gray-700 transition"
                      >
                        {col.header}
                        {sortBy === col.key && (
                          <span className="text-indigo-500">{sortOrder === 'asc' ? '\u2191' : '\u2193'}</span>
                        )}
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                ))}
                {actions && (
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + (actions ? 1 : 0)} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-3xl">{emptyIcon}</span>
                        <p className="text-sm font-medium text-gray-500">{emptyMessage}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.map((row, i) => (
                    <motion.tr
                      key={String(row.id)}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => onRowClick?.(row)}
                      className={`border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition ${onRowClick ? 'cursor-pointer' : ''}`}
                    >
                      {columns.map((col) => (
                        <td key={col.key} className="px-4 py-3">
                          {col.render(row)}
                        </td>
                      ))}
                      {actions && (
                        <td className="px-4 py-3 text-right">
                          {actions(row)}
                        </td>
                      )}
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={onPageChange}
      />
    </div>
  )
}
