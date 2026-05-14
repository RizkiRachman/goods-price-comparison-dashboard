import { SearchBar } from '@/components/SearchBar'
import { SearchModeToggle } from '@/components/SearchModeToggle'
import { GoodCard } from '@/components/GoodCard'
import { StoreCard } from '@/components/StoreCard'
import { Pagination } from '@/components/Pagination'
import { ReceiptUploadModal } from '@/components/ReceiptUploadModal'
import { PendingReceiptsDrawer } from '@/components/PendingReceiptsDrawer'
import { ReceiptHistoryDrawer } from '@/components/ReceiptHistoryDrawer'
import { SkeletonCard, StoreSkeletonCard } from '@/components/SkeletonCard'
import { StaggerGrid, StaggerItem } from '@/components/ui/StaggerGrid'
import { useReceiptManager } from '@/hooks/useReceiptManager'
import { useSearchLogic } from './GoodsListPage.logic'

import { useState, useEffect, useRef } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'

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
    processingCount,
  } = useReceiptManager()

  const [showUpload, setShowUpload] = useState(false)
  const [showDrawer, setShowDrawer] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [showMobileAddMenu, setShowMobileAddMenu] = useState(false)
  const addMenuRef = useRef<HTMLDivElement>(null)

  const navigate = useNavigate()

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

  useEffect(() => {
    if (!showAddMenu) return
    function handleClick(e: MouseEvent) {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target as Node)) {
        setShowAddMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showAddMenu])

  const itemLabel = searchMode === 'product' ? 'barang' : 'toko'
  const isEmpty = searchMode === 'product' ? goods.length === 0 : (storesData?.data.length ?? 0) === 0

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Sticky Navbar ── */}
      <header className="sticky top-0 z-30 h-14 flex items-center bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-black text-slate-900 text-lg tracking-tight">HargaKu</span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 bg-slate-100 text-slate-500 text-xs font-semibold rounded-full">
              {totalItems.toLocaleString()} {searchMode === 'product' ? 'barang' : 'toko'}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Tambah Struk dropdown */}
            <div className="relative hidden sm:block" ref={addMenuRef}>
              <button
                onClick={() => setShowAddMenu((v) => !v)}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold rounded-xl shadow shadow-emerald-300/40 hover:shadow-md hover:shadow-emerald-400/40 transition-all active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tambah Struk
                <svg className={`w-3.5 h-3.5 ml-0.5 transition-transform ${showAddMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showAddMenu && (
                <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50">
                  <button
                    onClick={() => { setShowAddMenu(false); navigate('/receipts/create') }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition text-left"
                  >
                    <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <div>
                      <p className="font-medium">Input Manual</p>
                      <p className="text-xs text-slate-400">Isi data struk langsung</p>
                    </div>
                  </button>
                  <div className="border-t border-slate-100" />
                  <button
                    onClick={() => { setShowAddMenu(false); setShowUpload(true) }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition text-left"
                  >
                    <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <div>
                      <p className="font-medium">Upload Foto</p>
                      <p className="text-xs text-slate-400">Foto struk untuk diproses</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowHistory(true)}
              className="relative flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="hidden sm:inline">Riwayat</span>
              {stats.total > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-rose-500 text-white text-[10px] font-bold rounded-full px-1">
                  {stats.total}
                </span>
              )}
            </button>

            <button
              onClick={() => navigate('/tracker')}
              className="relative flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-medium rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19V5m4 14v-6m4 6v-8m4 8v-4" />
              </svg>
              <span className="hidden sm:inline">Tracker</span>
            </button>

            <button
              onClick={() => navigate('/receipts/pending')}
              className="relative flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span className="hidden sm:inline">Proses</span>
              {processingCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-amber-500 text-white text-[10px] font-bold rounded-full px-1">
                  {processingCount}
                </span>
              )}
            </button>

            <NavLink
              to="/admin/categories"
              className="flex items-center justify-center w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl transition-colors"
              aria-label="Admin Panel"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </NavLink>


          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 relative overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute top-16 -left-16 w-56 h-56 bg-purple-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-80 h-48 bg-amber-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14">
          {/* Live pill */}
          <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur text-white/90 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Pantau harga belanjaan harian
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white leading-tight mb-2">
            {searchMode === 'product' ? (
              <>Pantau Harga <span className="text-amber-200">Belanjaanmu</span></>
            ) : (
              <>Cari Toko <span className="text-amber-200">Favoritmu</span></>
            )}
          </h1>
          <p className="text-white/60 text-sm max-w-md mb-6">
            {searchMode === 'product'
              ? 'Catat dan pantau harga barang kebutuhan sehari-hari di berbagai toko.'
              : 'Pantau harga di toko-toko favoritmu.'}
          </p>

          {/* Search bar */}
          <SearchBar
            value={searchMode === 'product' ? productSearch.search : storeSearch.search}
            onChange={searchMode === 'product' ? handleProductSearchChange : handleStoreSearchChange}
            placeholder={searchMode === 'product' ? 'Cari barang...' : 'Cari toko...'}
          />

          {/* Mode toggle pill tabs */}
          <div className="mt-5">
            <SearchModeToggle mode={searchMode} onModeChange={handleModeChange} />
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pb-24">
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 overflow-visible">
            {Array.from({ length: 10 }).map((_, i) =>
              searchMode === 'product' ? <SkeletonCard key={i} /> : <StoreSkeletonCard key={i} />
            )}
          </div>
        )}

        {isError && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-slate-600 font-semibold">Gagal memuat data</p>
            <p className="text-slate-400 text-sm mt-1">Periksa koneksi atau coba lagi</p>
          </div>
        )}

        {!isLoading && !isError && isEmpty && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-slate-600 font-semibold">
              {searchMode === 'product' ? 'Barang tidak ditemukan' : 'Toko tidak ditemukan'}
            </p>
            <p className="text-slate-400 text-sm mt-1">Coba kata kunci yang berbeda</p>
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
            {pagination && (
              <p className="text-sm text-slate-400 mb-4">
                Menampilkan{' '}
                <span className="font-semibold text-slate-700">
                  {(page - 1) * 10 + 1}–{Math.min(page * 10, totalItems)}
                </span>{' '}
                dari{' '}
                <span className="font-semibold text-slate-700">{totalItems}</span> {itemLabel}
                {(productSearch.search || storeSearch.search) && (
                  <> untuk &ldquo;<span className="text-indigo-600 font-semibold">{searchMode === 'product' ? productSearch.search : storeSearch.search}</span>&rdquo;</>
                )}
              </p>
            )}

            {searchMode === 'product' && goods.length > 0 && (
              <>
                <StaggerGrid className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 overflow-visible">
                  {goods.map((good) => (
                    <StaggerItem key={good.goodId}>
                      <GoodCard good={good} />
                    </StaggerItem>
                  ))}
                </StaggerGrid>
                {pagination && <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />}
              </>
            )}

            {searchMode === 'store' && storesData?.data && storesData.data.length > 0 && (
              <>
                <StaggerGrid className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 overflow-visible">
                  {storesData.data.map((store) => (
                    <StaggerItem key={store.id}>
                      <StoreCard store={store} />
                    </StaggerItem>
                  ))}
                </StaggerGrid>
                {pagination && <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />}
              </>
            )}
          </>
        )}
      </main>

      {/* ── Mobile FAB ── */}
      {showMobileAddMenu && (
        <div className="fixed inset-0 z-40 sm:hidden" onClick={() => setShowMobileAddMenu(false)} />
      )}
      <div className="fixed bottom-6 right-5 sm:hidden z-40 flex flex-col items-center gap-3">
        {showMobileAddMenu && (
          <div className="flex flex-col items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <button
              onClick={() => { setShowMobileAddMenu(false); navigate('/receipts/create') }}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-700 text-sm font-semibold rounded-xl shadow-lg border border-slate-200 active:scale-95 transition-transform"
            >
              <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Input Manual
            </button>
            <button
              onClick={() => { setShowMobileAddMenu(false); setShowUpload(true) }}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-700 text-sm font-semibold rounded-xl shadow-lg border border-slate-200 active:scale-95 transition-transform"
            >
              <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload Foto
            </button>
          </div>
        )}
        <button
          onClick={() => setShowMobileAddMenu((v) => !v)}
          className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl shadow-lg shadow-emerald-400/40 flex items-center justify-center active:scale-90 transition-transform"
          aria-label="Tambah struk"
        >
          <svg
            className={`w-6 h-6 transition-transform ${showMobileAddMenu ? 'rotate-45' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

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
