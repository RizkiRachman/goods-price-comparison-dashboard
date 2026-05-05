export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="h-1.5 bg-gray-200" />
      <div className="p-3 animate-pulse">
        <div className="flex items-start gap-2.5">
          <div className="w-9 h-9 bg-gray-200 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 bg-gray-200 rounded w-3/4" />
            <div className="h-2.5 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
        <div className="mt-3 h-5 bg-gray-100 rounded w-24" />
        <div className="mt-2 flex items-center gap-3">
          <div className="h-3 bg-gray-100 rounded w-16" />
          <div className="h-3 bg-gray-100 rounded w-16" />
        </div>
      </div>
    </div>
  )
}

export function StoreSkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="h-1.5 bg-gray-200" />
      <div className="p-3 animate-pulse">
        <div className="flex items-start gap-2.5">
          <div className="w-9 h-9 bg-gray-200 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 bg-gray-200 rounded w-3/4" />
            <div className="h-2.5 bg-gray-100 rounded w-1/3" />
          </div>
        </div>
        <div className="mt-2.5 h-3 bg-gray-100 rounded w-20" />
      </div>
    </div>
  )
}
