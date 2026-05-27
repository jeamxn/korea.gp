import { useEffect, useState } from 'react'

// 2026 Australian GP — season opener under new regulations.
// Date is approximate (early March 2026); only the rough D-H-M-S display matters.
const TARGET = new Date('2026-03-08T05:00:00Z').getTime()

function diff(now: number) {
  const ms = Math.max(0, TARGET - now)
  const s = Math.floor(ms / 1000)
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    mins: Math.floor((s % 3600) / 60),
    secs: s % 60,
  }
}

export function RegsCountdown({ color }: { color: string }) {
  const [t, setT] = useState(() => diff(Date.now()))
  useEffect(() => {
    const id = setInterval(() => setT(diff(Date.now())), 1000)
    return () => clearInterval(id)
  }, [])
  const past = TARGET - Date.now() <= 0
  const cells: { v: number; l: string }[] = [
    { v: t.days, l: 'D' },
    { v: t.hours, l: 'H' },
    { v: t.mins, l: 'M' },
    { v: t.secs, l: 'S' },
  ]
  return (
    <div
      className="rounded-sm border border-white/10 bg-black/55 px-3 py-2 backdrop-blur-sm"
      aria-label="F1 2026 regulations countdown"
    >
      <div className="mb-1 flex items-center justify-between">
        <span className="font-mono text-[9px] tracking-[0.3em] text-white/40">
          {past ? 'NEW ERA' : 'F1 2026 REGS · T-MINUS'}
        </span>
        <span className="font-mono text-[9px] tracking-[0.25em]" style={{ color }}>
          MELBOURNE
        </span>
      </div>
      <div className="flex items-end gap-2 font-mono">
        {cells.map((c, i) => (
          <div key={c.l} className="flex items-baseline gap-1">
            <span
              className="text-base font-bold tabular-nums tracking-tight text-white/90"
              style={{ minWidth: c.l === 'D' ? '2.5ch' : '2ch', textAlign: 'right' }}
            >
              {String(c.v).padStart(2, '0')}
            </span>
            <span className="text-[9px] tracking-[0.2em] text-white/40">{c.l}</span>
            {i < cells.length - 1 && <span className="ml-1 text-white/15">·</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
