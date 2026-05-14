import { motion, AnimatePresence } from 'motion/react'

type BannerType = 'error' | 'success' | 'warning'

interface FormBannerProps {
  type: BannerType
  message: string
  visible: boolean
}

const styles: Record<BannerType, { bg: string; border: string; icon: string; text: string }> = {
  error: { bg: 'bg-red-50/80 backdrop-blur-sm', border: 'border-red-200', icon: 'text-red-500', text: 'text-red-700' },
  success: { bg: 'bg-emerald-50/80 backdrop-blur-sm', border: 'border-emerald-200', icon: 'text-emerald-500', text: 'text-emerald-700' },
  warning: { bg: 'bg-amber-50/80 backdrop-blur-sm', border: 'border-amber-200', icon: 'text-amber-500', text: 'text-amber-700' },
}

const icons: Record<BannerType, string> = {
  error: '\u2716',
  success: '\u2714',
  warning: '\u26A0',
}

export function FormBanner({ type, message, visible }: FormBannerProps) {
  const s = styles[type]

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -8, height: 0 }}
          className={`${s.bg} ${s.border} border rounded-2xl px-4 py-3 flex items-center gap-3 overflow-hidden`}
        >
          <span className={`text-lg ${s.icon}`}>{icons[type]}</span>
          <p className={`text-sm font-semibold ${s.text}`}>{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
