import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Winner = {
  year: number
  driver: string
  team: string
  color: string
  pole: string
  fastestLap: string
  notes: string
}

const WINNERS: Winner[] = [
  {
    year: 2010,
    driver: 'F. ALONSO',
    team: 'Ferrari',
    color: '#DC0000',
    pole: 'S. VETTEL',
    fastestLap: 'F. ALONSO — 1:50.257',
    notes:
      'Inaugural race held on a half-finished circuit; heavy rain delayed the start by 55 minutes. Vettel retired with engine failure, handing Alonso the lead.',
  },
  {
    year: 2011,
    driver: 'S. VETTEL',
    team: 'Red Bull',
    color: '#3671C6',
    pole: 'L. HAMILTON',
    fastestLap: 'M. SCHUMACHER — 1:39.605',
    notes:
      'Vettel passed pole-sitter Hamilton into Turn 4 and never looked back. He clinched his second drivers’ title here.',
  },
  {
    year: 2012,
    driver: 'S. VETTEL',
    team: 'Red Bull',
    color: '#3671C6',
    pole: 'M. WEBBER',
    fastestLap: 'M. WEBBER — 1:42.037',
    notes:
      'A Red Bull 1-2 with Webber on pole but Vettel storming through. Vettel’s third straight Korean win.',
  },
  {
    year: 2013,
    driver: 'S. VETTEL',
    team: 'Red Bull',
    color: '#3671C6',
    pole: 'S. VETTEL',
    fastestLap: 'M. WEBBER — 1:41.380',
    notes:
      'Vettel’s fourth Korean GP, his fourth consecutive win at Yeongam. A fire truck on the track behind a Safety Car became one of the season’s strangest images. The last F1 race at Korea.',
  },
]

export function WinnersTimeline() {
  const [active, setActive] = useState<Winner | null>(null)
  return (
    <>
      <div className="rounded-md border border-white/10 bg-black/55 p-3 backdrop-blur-md">
        <div className="mb-2 font-mono text-[9px] tracking-[0.3em] text-white/35">
          WINNERS — 4 RACES · CLICK
        </div>
        <div className="flex items-end gap-3">
          {WINNERS.map((w, i) => (
            <motion.button
              key={w.year}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.4 }}
              whileHover={{ y: -2 }}
              onClick={() => setActive(w)}
              className="flex-1 cursor-pointer text-left transition"
              aria-label={`${w.year} Korean GP details`}
            >
              <div
                className="h-1.5 w-full rounded-sm"
                style={{ background: w.color, boxShadow: `0 0 12px ${w.color}80` }}
              />
              <div className="mt-2 font-['Bebas_Neue'] text-lg leading-none">{w.year}</div>
              <div className="font-mono text-[9px] tracking-wider text-white/80">{w.driver}</div>
              <div className="font-mono text-[8px] tracking-[0.2em] text-white/35">
                {w.team.toUpperCase()}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-md"
            onClick={() => setActive(null)}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-[min(90vw,28rem)] rounded-sm border border-white/15 bg-[#0a0a0a]/95 p-6"
              style={{ boxShadow: `0 0 80px ${active.color}40` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-mono text-[9px] tracking-[0.3em] text-white/40">
                    KOREAN GP
                  </div>
                  <div
                    className="font-['Bebas_Neue'] text-5xl leading-none tracking-tight"
                    style={{ color: active.color }}
                  >
                    {active.year}
                  </div>
                  <div className="mt-1 font-mono text-[11px] tracking-[0.2em] text-white/85">
                    {active.driver} · {active.team.toUpperCase()}
                  </div>
                </div>
                <button
                  onClick={() => setActive(null)}
                  className="font-mono text-[10px] tracking-[0.25em] text-white/50 transition hover:text-white"
                  aria-label="Close"
                >
                  ESC ✕
                </button>
              </div>
              <dl className="mt-4 space-y-1.5 border-t border-white/10 pt-3">
                <div className="flex justify-between gap-4">
                  <dt className="font-mono text-[9px] tracking-[0.25em] text-white/40">POLE</dt>
                  <dd className="font-mono text-[10px] tracking-[0.15em] text-white/85">
                    {active.pole}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="font-mono text-[9px] tracking-[0.25em] text-white/40">
                    FASTEST LAP
                  </dt>
                  <dd className="font-mono text-[10px] tracking-[0.15em] text-white/85">
                    {active.fastestLap}
                  </dd>
                </div>
              </dl>
              <p className="mt-4 border-t border-white/10 pt-3 font-mono text-[11px] leading-relaxed text-white/70">
                {active.notes}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
