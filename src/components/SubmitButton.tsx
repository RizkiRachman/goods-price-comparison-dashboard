import { motion } from 'motion/react'

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

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  )
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
  const isDisabled = disabled || loading || done

  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.01 } : undefined}
      whileTap={!isDisabled ? { scale: 0.98 } : undefined}
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white transition disabled:opacity-50 disabled:cursor-not-allowed ${done ? 'bg-emerald-500' : 'bg-indigo-600 hover:bg-indigo-700'} ${className}`}
    >
      {loading ? <Spinner /> : null}
      {loading ? loadingLabel : done ? doneLabel : label}
    </motion.button>
  )
}
