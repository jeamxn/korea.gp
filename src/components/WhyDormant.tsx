import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const REASONS = [
  { k: 'FINANCIAL', v: 'Hosting fees that the regional government could not sustain.' },
  { k: 'LOCATION', v: 'Built on reclaimed land far from a major city — low foot traffic.' },
  { k: 'CALENDAR', v: 'Squeezed between Japan and India, often in monsoon-edge weather.' },
  { k: 'ATTENDANCE', v: 'Attendance dropped each year; broadcast-only after 2012.' },
  { k: 'POLITICS', v: 'Contract disputes; race dropped from the 2014 calendar entirely.' },
]

export function WhyDormant({ color }: { color: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="pointer-events-auto">
      <button
        onClick={() => setOpen((v) => !v)}
        className="group flex w-full items-center justify-between rounded-sm border border-white/10 bg-black/55 px-3 py-2 text-left backdrop-blur-sm transition hover:border-white/20"
        aria-expanded={open}
      >
        <span className="flex flex-col">
          <span className="font-mono text-[9px] tracking-[0.3em] text-white/40">
            WHY DORMANT?
          </span>
          <span className="font-mono text-[10px] tracking-[0.15em] text-white/85">
            5 REASONS YEONGAM WENT QUIET
          </span>
        </span>
        <span
          className="font-mono text-[10px] transition"
          style={{ color, transform: open ? 'rotate(180deg)' : 'none' }}
        >
          ▾
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-1.5 space-y-1 overflow-hidden rounded-sm border border-white/10 bg-black/55 px-3 py-2 backdrop-blur-sm"
          >
            {REASONS.map((r) => (
              <li key={r.k} className="border-b border-white/5 py-1 last:border-0">
                <div
                  className="font-mono text-[9px] tracking-[0.25em]"
                  style={{ color }}
                >
                  {r.k}
                </div>
                <div className="font-mono text-[10px] leading-relaxed text-white/70">
                  {r.v}
                </div>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
