interface Props {
  totalReceipts: number
  approvedCount: number
  totalItems: number
  streak: number
}

export function ContributionStats({
  totalReceipts,
  approvedCount,
  totalItems,
  streak,
}: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {/* Total Uploads */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-4 text-white">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">📤</span>
        </div>
        <p className="text-3xl font-bold">{totalReceipts}</p>
        <p className="text-sm text-emerald-100">Total Upload</p>
      </div>

      {/* Approved */}
      <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl p-4 text-white">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">✅</span>
        </div>
        <p className="text-3xl font-bold">{approvedCount}</p>
        <p className="text-sm text-indigo-100">Diterima</p>
      </div>

      {/* Items Contributed */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-4 text-white">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🏷️</span>
        </div>
        <p className="text-3xl font-bold">{totalItems}</p>
        <p className="text-sm text-amber-100">Item Data</p>
      </div>

      {/* Streak */}
      <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-4 text-white">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🔥</span>
        </div>
        <p className="text-3xl font-bold">{streak}</p>
        <p className="text-sm text-rose-100">Hari Berturut</p>
      </div>
    </div>
  )
}
