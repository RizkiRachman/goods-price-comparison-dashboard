interface SubmitButtonProps {
  loading?: boolean
  done?: boolean
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit'
  label?: string
  loadingLabel?: string
  doneLabel?: string
  className?: string
}

export function SubmitButton({
  loading = false,
  done = false,
  disabled = false,
  onClick,
  type = 'submit',
  label = 'Simpan',
  loadingLabel = 'Menyimpan\u2026',
  doneLabel = 'Tersimpan',
  className = '',
}: SubmitButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading || done}
      className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-[0.98] ${className}`}
    >
      {loading ? (
        <>
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          {loadingLabel}
        </>
      ) : done ? (
        <><span>{'\u2705'}</span> {doneLabel}</>
      ) : (
        <>{label}</>
      )}
    </button>
  )
}
