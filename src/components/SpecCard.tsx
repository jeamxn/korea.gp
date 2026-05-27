import { motion, AnimatePresence } from 'framer-motion'
import type { Team } from '../data/teams'

export function SpecCard({ team }: { team: Team }) {
  const rows: { label: string; value: string }[] = [
    { label: 'TOP SPEED', value: `${team.spec.topSpeed} KM/H` },
    { label: 'MIN. WEIGHT', value: `${team.spec.weight} KG` },
    { label: 'POWER UNIT', value: team.spec.powerUnit.toUpperCase() },
    { label: 'CHASSIS', value: team.spec.chassis.toUpperCase() },
  ]
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={team.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.35 }}
        className="rounded-sm border border-white/10 bg-black/55 px-3 py-2.5 backdrop-blur-sm"
        style={{ boxShadow: `inset 0 0 0 1px ${team.color}15` }}
      >
        <div className="mb-1.5 flex items-center justify-between">
          <span className="font-mono text-[9px] tracking-[0.3em] text-white/40">SPEC SHEET</span>
          <span className="font-mono text-[9px] tracking-[0.25em]" style={{ color: team.color }}>
            {team.short}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
          {rows.map((r) => (
            <div key={r.label} className="flex flex-col">
              <span className="font-mono text-[8px] tracking-[0.25em] text-white/35">
                {r.label}
              </span>
              <span className="font-mono text-[10px] tracking-[0.05em] text-white/90">
                {r.value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
