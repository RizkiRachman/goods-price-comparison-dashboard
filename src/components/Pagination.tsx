import { useMemo } from 'react'

interface Props {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: Props) {
  const pages = useMemo(() => {
    if (totalPages <= 1) return []
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    const result: (number | 'ellipsis-start' | 'ellipsis-end')[] = [1]
    if (page > 3) result.push('ellipsis-start')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      result.push(i)
    }
    if (page < totalPages - 2) result.push('ellipsis-end')
    result.push(totalPages)
    return result
  }, [page, totalPages])

  if (totalPages <= 1) return null

  const btnBase = 'w-9 h-9 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed'

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-8" aria-label="Pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={`${btnBase} bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 active:scale-95`}
        aria-label="Previous page"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {pages.map((p) =>
        p === 'ellipsis-start' || p === 'ellipsis-end' ? (
          <span key={p} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`${btnBase} ${
              p === page
                ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 active:scale-95'
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className={`${btnBase} bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 active:scale-95`}
        aria-label="Next page"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  )
}
