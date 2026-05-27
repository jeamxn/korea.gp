import { motion, AnimatePresence } from 'framer-motion'

const SHORTCUTS: { keys: string; desc: string }[] = [
  { keys: '← →', desc: 'Switch team' },
  { keys: '1 – 5', desc: 'Jump to team' },
  { keys: 'SPACE', desc: 'Pause / play rotation' },
  { keys: 'R', desc: 'Boost' },
  { keys: 'M', desc: 'Toggle sound' },
  { keys: 'F', desc: 'Fullscreen' },
  { keys: '?', desc: 'Show / hide this panel' },
  { keys: 'ESC', desc: 'Close panel' },
]

export function HelpOverlay({
  open,
  onClose,
  color,
}: {
  open: boolean
  onClose: () => void
  color: string
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-md"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Keyboard shortcuts"
        >
          <motion.div
            initial={{ scale: 0.96, y: 8 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 8 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-[min(90vw,28rem)] rounded-sm border border-white/15 bg-[#0a0a0a]/95 p-6"
            style={{ boxShadow: `0 0 80px ${color}30` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-[9px] tracking-[0.3em] text-white/40">REFERENCE</div>
                <div className="font-['Bebas_Neue'] text-2xl tracking-wide" style={{ color }}>
                  KEYBOARD SHORTCUTS
                </div>
              </div>
              <button
                onClick={onClose}
                className="font-mono text-[10px] tracking-[0.25em] text-white/50 transition hover:text-white"
                aria-label="Close"
              >
                ESC ✕
              </button>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-2">
              {SHORTCUTS.map((s) => (
                <div
                  key={s.keys}
                  className="flex items-center justify-between border-b border-white/5 py-1.5"
                >
                  <span className="font-mono text-[10px] tracking-[0.2em] text-white/80">
                    {s.desc}
                  </span>
                  <kbd
                    className="rounded-sm border border-white/15 bg-white/5 px-2 py-0.5 font-mono text-[10px] tracking-[0.15em] text-white/90"
                  >
                    {s.keys}
                  </kbd>
                </div>
              ))}
            </div>
            <div className="mt-5 font-mono text-[9px] tracking-[0.25em] text-white/30">
              CLICK STAGE TO BOOST · DRAG TO ORBIT
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
