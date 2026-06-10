import { motion, AnimatePresence } from 'motion/react'

type BannerType = 'error' | 'success' | 'warning'

interface FormBannerProps {
  type: BannerType
  message: string
  visible: boolean
}

const styles: Record<BannerType, { bg: string; border: string; icon: string; text: string }> = {
  error: { bg: 'bg-retro-danger/15', border: 'border-retro-danger/50', icon: 'text-retro-danger', text: 'text-retro-danger' },
  success: { bg: 'bg-retro-success/15', border: 'border-retro-success/50', icon: 'text-retro-success', text: 'text-retro-success' },
  warning: { bg: 'bg-retro-warning/15', border: 'border-retro-warning/50', icon: 'text-retro-warning', text: 'text-retro-warning' },
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
          className={`flex items-center gap-2 ${s.bg} border-[3px] ${s.border} [border-style:inset] rounded-none px-4 py-3 overflow-hidden`}
        >
          <span className={s.icon}>{icons[type]}</span>
          <p className={`text-sm font-medium ${s.text}`}>{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
