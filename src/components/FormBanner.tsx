import { motion, AnimatePresence } from 'motion/react'

type BannerType = 'error' | 'success' | 'warning'

interface FormBannerProps {
  type: BannerType
  message: string
  visible: boolean
}

const styles: Record<BannerType, { bg: string; border: string; icon: string; text: string }> = {
  error: { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-500', text: 'text-red-700' },
  success: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'text-emerald-500', text: 'text-emerald-700' },
  warning: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-500', text: 'text-amber-700' },
}

const icons: Record<BannerType, string> = {
  error: '\u2717',
  success: '\u2705',
  warning: '\u26A0\uFE0F',
}

export function FormBanner({ type, message, visible }: FormBannerProps) {
  const s = styles[type]
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={`flex items-center gap-2 ${s.bg} border ${s.border} rounded-xl px-4 py-3 overflow-hidden`}
        >
          <span className={s.icon}>{icons[type]}</span>
          <p className={`text-sm font-medium ${s.text}`}>{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
