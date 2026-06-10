import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'

interface AboutDrawerProps {
  open: boolean
  onClose: () => void
}

const REPOS = [
  {
    name: 'goods-price-comparison-api',
    url: 'https://github.com/RizkiRachman/goods-price-comparison-api',
    desc: 'OpenAPI Specification',
  },
  {
    name: 'goods-price-comparison-service',
    url: 'https://github.com/RizkiRachman/goods-price-comparison-service',
    desc: 'Backend Service',
  },
  {
    name: 'goods-price-comparison-dashboard',
    url: 'https://github.com/RizkiRachman/goods-price-comparison-dashboard',
    desc: 'Frontend Dashboard',
  },
]

export function AboutDrawer({ open, onClose }: AboutDrawerProps) {
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
        >
          {/* Transparent backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Full-page content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-2xl max-h-[90vh] bg-retro-surface/80 backdrop-blur-xl border border-retro-border/30 rounded-none flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-retro-border/20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-none flex items-center justify-center">
                  <svg className="w-4.5 h-4.5 text-retro-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="font-black text-retro-text text-lg tracking-tight">HargaKu</span>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center bg-retro-surface/50 hover:bg-retro-surface/70 rounded-none transition-colors"
                aria-label="Tutup"
              >
                <svg className="w-4.5 h-4.5 text-retro-body" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {/* Hero card */}
              <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-none p-6 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-32 h-24 bg-amber-400/10 rounded-full blur-xl" />
                <div className="relative">
                  <p className="text-retro-text/50 text-xs font-semibold uppercase tracking-widest mb-2">Versi 0.2.0</p>
                  <h2 className="text-2xl font-black text-retro-text tracking-tight mb-4">HargaKu</h2>
                  <ul className="space-y-2">
                    {[
                      'Pantau harga belanjaan sehari-hari',
                      'Bandingkan harga antar toko',
                      'Temukan rute belanja paling hemat',
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-retro-text/80 text-sm">
                        <span className="w-1 h-1 rounded-full bg-amber-300 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Features */}
              <section>
                <h3 className="text-xs font-bold text-retro-muted uppercase tracking-widest mb-3">Fitur</h3>
                <div className="space-y-2">
                  {[
                    { icon: '\uD83D\uDCC3', title: 'Upload Struk', desc: 'Foto struk belanja, data harga otomatis tercatat' },
                    { icon: '\uD83D\uDD0D', title: 'Cari Barang & Toko', desc: 'Cari harga barang atau toko favoritmu' },
                    { icon: '\uD83D\uDCCB', title: 'Riwayat Struk', desc: 'Lihat riwayat struk & bagi tagihan dengan fitur split bill' },
                    { icon: '\uD83D\uDECD\uFE0F', title: 'Optimasi Belanja', desc: 'Pilih barang, temukan kombinasi toko paling hemat' },
                  ].map((f) => (
                    <div key={f.title} className="flex items-start gap-3 px-3.5 py-3 bg-retro-surface/40 backdrop-blur-sm border border-retro-border/20 rounded-none">
                      <span className="text-base mt-0.5">{f.icon}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-retro-text">{f.title}</p>
                        <p className="text-xs text-retro-muted mt-0.5 leading-relaxed">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Admin Preview */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xs font-bold text-retro-muted uppercase tracking-widest">Admin</h3>
                  <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase tracking-wider">Preview</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { icon: '\uD83C\uDFF7\uFE0F', title: 'Kategori', desc: 'Kelola kategori produk', to: '/admin/categories' },
                    { icon: '\u2696\uFE0F', title: 'Satuan', desc: 'Kelola satuan pengukuran', to: '/admin/units' },
                  ].map((f) => (
                    <button
                      key={f.title}
                      onClick={() => { onClose(); navigate(f.to) }}
                      className="flex items-start gap-3 px-3.5 py-3 bg-retro-surface/40 backdrop-blur-sm border border-retro-border/20 rounded-none hover:bg-retro-surface/60 transition-colors text-left"
                    >
                      <span className="text-base mt-0.5">{f.icon}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-retro-text">{f.title}</p>
                        <p className="text-xs text-retro-muted mt-0.5 leading-relaxed">{f.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Source Code */}
              <section>
                <h3 className="text-xs font-bold text-retro-muted uppercase tracking-widest mb-3">Source Code</h3>
                <div className="space-y-2">
                  {REPOS.map((repo) => (
                    <a
                      key={repo.url}
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 bg-retro-surface/50 backdrop-blur-sm hover:bg-retro-surface/70 border border-retro-border/30 rounded-none transition-colors group"
                    >
                      <svg className="w-4.5 h-4.5 text-retro-body flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-retro-text group-hover:text-retro-gold transition-colors truncate">{repo.name}</p>
                        <p className="text-[11px] text-retro-muted">{repo.desc}</p>
                      </div>
                      <svg className="w-3.5 h-3.5 text-retro-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ))}
                </div>
              </section>

              {/* Feedback CTA */}
              <section>
                <button
                  onClick={() => { onClose(); navigate('/feedback') }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-retro-text rounded-none transition-all active:scale-[0.98]"
                >
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-sm font-bold">Kirim Feedback atau Pertanyaan</p>
                    <p className="text-xs text-retro-text/70">Bantu kami meningkatkan HargaKu</p>
                  </div>
                </button>
              </section>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-retro-border/20">
              <p className="text-xs text-retro-muted text-center">
                Dibuat dengan &#x2764;&#xFE0F; oleh Rizki Rachman
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
