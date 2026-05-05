import { SearchBar } from '@/components/SearchBar'
import { SearchModeToggle } from '@/components/SearchModeToggle'
import { GoodCard } from '@/components/GoodCard'
import { StoreCard } from '@/components/StoreCard'
import { Pagination } from '@/components/Pagination'
import { ReceiptUploadModal } from '@/components/ReceiptUploadModal'
import { PendingReceiptsDrawer } from '@/components/PendingReceiptsDrawer'
import { ReceiptHistoryDrawer } from '@/components/ReceiptHistoryDrawer'
import { SkeletonCard, StoreSkeletonCard } from '@/components/SkeletonCard'
import { useReceiptManager } from '@/hooks/useReceiptManager'
import { useSearchLogic } from './GoodsListPage.logic'
import { useState } from 'react'

export default function GoodsListPage() {
  const {
    jobs,
    addJob,
    removeJob,
    clearCompleted,
    approveJob,
    rejectJob,
    history,
    stats,
  } = useReceiptManager()

  const [showUpload, setShowUpload] = useState(false)
  const [showDrawer, setShowDrawer] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const {
    searchMode,
    productSearch,
    storeSearch,
    page,
    setPage,
    goods,
    storesData,
    isLoading,
    isError,
    pagination,
    totalItems,
    handleModeChange,
    handleProductSearchChange,
    handleStoreSearchChange,
  } = useSearchLogic()

  const itemLabel = searchMode === 'product' ? 'barang' : 'toko'
  const isEmpty = searchMode === 'product' ? goods.length === 0 : (storesData?.data.length ?? 0) === 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100/50">
      <header className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute top-20 -left-20 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center py-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-white font-bold text-lg tracking-tight">HargaKu</span>
            </div>
          </nav>

          <div className="pb-12 sm:pb-14">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur text-white/95 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Pantau harga belanjaan harian
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-2">
              {searchMode === 'product' ? (
                <>
                  Pantau Harga{' '}
                  <span className="text-amber-200">Belanjaanmu</span>
                </>
              ) : (
                <>
                  Cari Toko{' '}
                  <span className="text-amber-200">Favoritmu</span>
                </>
              )}
            </h1>

            <p className="text-white/60 text-sm max-w-md mb-5">
              {searchMode === 'product'
                ? 'Catat dan pantau harga barang kebutuhan sehari-hari.'
                : 'Pantau harga di toko-toko favoritmu.'}
            </p>

            <div>
              <SearchBar
                value={searchMode === 'product' ? productSearch.search : storeSearch.search}
                onChange={searchMode === 'product' ? handleProductSearchChange : handleStoreSearchChange}
                placeholder={searchMode === 'product' ? 'Cari barang...' : 'Cari toko...'}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-5">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur text-white px-4 py-2 rounded-xl">
                <span className="text-xl font-bold">{totalItems}</span>
                <span className="text-xs text-white/70">{itemLabel}</span>
              </div>

              <button
                onClick={() => setShowUpload(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload Struk
              </button>

              <button
                onClick={() => setShowHistory(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur hover:bg-white/20 text-white text-sm font-medium rounded-xl transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Riwayat
                {stats.total > 0 && (
                  <span className="bg-white text-amber-600 text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {stats.total}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-12">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
          <SearchModeToggle mode={searchMode} onModeChange={handleModeChange} />
        </div>

        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, i) =>
              searchMode === 'product' ? <SkeletonCard key={i} /> : <StoreSkeletonCard key={i} />
            )}
          </div>
        )}

        {isError && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">Gagal memuat data</p>
            <p className="text-gray-400 text-sm mt-1">Periksa koneksi atau coba lagi</p>
          </div>
        )}

        {!isLoading && !isError && isEmpty && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">
              {searchMode === 'product' ? 'Barang tidak ditemukan' : 'Toko tidak ditemukan'}
            </p>
            <p className="text-gray-400 text-sm mt-1">Coba kata kunci yang berbeda</p>
            <button
              onClick={() => searchMode === 'product' ? productSearch.setSearch('') : storeSearch.setSearch('')}
              className="mt-4 px-5 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition"
            >
              Reset
            </button>
          </div>
        )}

        {!isLoading && !isError && !isEmpty && (
          <>
            <div className="flex items-center justify-between mb-4">
              {pagination && (
                <p className="text-sm text-gray-400">
                  Menampilkan{' '}
                  <span className="font-semibold text-gray-700">
                    {(page - 1) * 10 + 1}-{Math.min(page * 10, totalItems)}
                  </span>{' '}
                  dari{' '}
                  <span className="font-semibold text-gray-700">{totalItems}</span> {itemLabel}
                  {(productSearch.search || storeSearch.search) && (
                    <> untuk "<span className="text-indigo-600 font-semibold">{searchMode === 'product' ? productSearch.search : storeSearch.search}</span>"</>
                  )}
                </p>
              )}
            </div>

            {searchMode === 'product' && goods.length > 0 && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {goods.map((good, index) => (
                    <div
                      key={good.goodId}
                      style={{
                        animation: `fade-in-up 0.3s ease-out ${index * 40}ms both`,
                      }}
                    >
                      <GoodCard good={good} />
                    </div>
                  ))}
                </div>
                {pagination && <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />}
              </>
            )}

            {searchMode === 'store' && storesData?.data && storesData.data.length > 0 && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {storesData.data.map((store, index) => (
                    <div
                      key={store.id}
                      style={{
                        animation: `fade-in-up 0.3s ease-out ${index * 40}ms both`,
                      }}
                    >
                      <StoreCard store={store} />
                    </div>
                  ))}
                </div>
                {pagination && <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />}
              </>
            )}
          </>
        )}
      </main>

      <button
        onClick={() => setShowUpload(true)}
        className="fixed bottom-4 right-4 sm:hidden w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl shadow-lg shadow-emerald-500/30 flex items-center justify-center active:scale-90 transition-transform z-40"
        aria-label="Upload struk"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      </button>

      {showUpload && (
        <ReceiptUploadModal
          onClose={() => setShowUpload(false)}
          onJobCreated={(receiptId, fileName) => {
            addJob(receiptId, fileName)
            setShowDrawer(true)
          }}
        />
      )}
      {showDrawer && (
        <PendingReceiptsDrawer
          jobs={jobs}
          onRemove={removeJob}
          onClearCompleted={clearCompleted}
          onApprove={approveJob}
          onReject={rejectJob}
          onClose={() => setShowDrawer(false)}
        />
      )}
      {showHistory && (
        <ReceiptHistoryDrawer receipts={history} onClose={() => setShowHistory(false)} />
      )}
    </div>
  )
}
