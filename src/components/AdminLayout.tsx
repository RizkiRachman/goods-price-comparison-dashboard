import { useState, useEffect } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useProductPricesCalculate } from '@/hooks/useProductPricesCalculate'

const navItems = [
  {
    to: '/admin/categories',
    label: 'Kategori',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
  {
    to: '/admin/units',
    label: 'Satuan',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
  },
  {
    to: '/admin/feedback',
    label: 'Feedback',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    to: '/admin/activity-logs',
    label: 'Aktivitas',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export function AdminLayout() {
  const sync = useProductPricesCalculate()
  const [syncMsg, setSyncMsg] = useState<string | null>(null)

  function handleSync() {
    sync.mutate(undefined, {
      onSuccess: () => setSyncMsg('Harga berhasil disinkronisasi'),
      onError: () => setSyncMsg('Gagal sinkronisasi harga'),
    })
  }

  useEffect(() => {
    if (syncMsg) {
      const t = setTimeout(() => setSyncMsg(null), 3000)
      return () => clearTimeout(t)
    }
  }, [syncMsg])

  return (
    <div className="retro-admin min-h-screen bg-retro-bg text-retro-body flex flex-col">
      {/* Top bar */}
      <header className="bg-retro-surface border-b-[3px] border-retro-border [border-style:ridge] px-4 py-3 flex items-center gap-3">
        <NavLink
          to="/goods"
          className="flex items-center gap-2 text-sm font-semibold text-retro-body hover:text-retro-text transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Beranda
        </NavLink>
        <span className="text-xs text-retro-muted">{'/'}</span>
        <span className="text-sm font-bold text-retro-text">Admin</span>
        <div className="ml-auto flex items-center gap-2">
          {syncMsg && (
            <span className="text-xs text-retro-success font-medium">{syncMsg}</span>
          )}
          <button
            onClick={handleSync}
            disabled={sync.isPending}
            className="flex items-center justify-center w-8 h-8 bg-retro-surface-alt hover:bg-retro-border text-retro-body rounded-none border-[3px] border-retro-border [border-style:outset] transition-colors disabled:opacity-50"
            aria-label="Sinkronisasi harga"
          >
            <svg className={`w-4 h-4 ${sync.isPending ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </header>

      {/* Nav pills */}
      <div className="bg-retro-surface border-b-[3px] border-retro-border [border-style:ridge] px-4 py-2 flex gap-2 overflow-x-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-1.5 rounded-none text-xs font-semibold whitespace-nowrap transition ${
                isActive
                  ? 'bg-retro-primary/30 text-retro-gold border-[3px] border-retro-gold/40 [border-style:inset]'
                  : 'bg-retro-surface-alt text-retro-body border-[3px] border-retro-border [border-style:ridge]'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* Page content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto">
        <Outlet />
      </main>
    </div>
  )
}
