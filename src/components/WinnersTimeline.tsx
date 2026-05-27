import { motion } from 'framer-motion'

const WINNERS = [
  { year: 2010, driver: 'F. ALONSO', team: 'Ferrari', color: '#DC0000' },
  { year: 2011, driver: 'S. VETTEL', team: 'Red Bull', color: '#3671C6' },
  { year: 2012, driver: 'S. VETTEL', team: 'Red Bull', color: '#3671C6' },
  { year: 2013, driver: 'S. VETTEL', team: 'Red Bull', color: '#3671C6' },
]

export function WinnersTimeline() {
  return (
    <div className="rounded-md border border-white/10 bg-black/55 p-3 backdrop-blur-md">
      <div className="mb-2 font-mono text-[9px] tracking-[0.3em] text-white/35">
        WINNERS — 4 RACES
      </div>
      <div className="flex items-end gap-3">
        {WINNERS.map((w, i) => (
          <motion.div
            key={w.year}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i, duration: 0.4 }}
            className="flex-1"
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
          </motion.div>
        ))}
      </div>
    </div>
  )
}
