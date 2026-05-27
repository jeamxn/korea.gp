import { useEffect, useRef, useState } from 'react'

// Synthetic running history of lap-time deltas.
// Each new entry pushes left and a new spark bar appears on the right.
function rand(seed: number) {
  return Math.sin(seed * 12.9898) * 43758.5453 % 1
}

const LEN = 22

export function AnalyticsPanel({ color, activity }: { color: string; activity: number }) {
  const [history, setHistory] = useState<number[]>(() =>
    Array.from({ length: LEN }, (_, i) => (rand(i + 1) - 0.5) * 0.4),
  )
  const [best, setBest] = useState(-0.42)
  const lastRef = useRef(0)

  useEffect(() => {
    let id = 0
    const tick = () => {
      // Bias delta by current activity — more activity = faster (negative delta)
      const drift = (Math.random() - 0.5) * 0.18
      const next = -activity * 0.35 + drift + (Math.random() - 0.5) * 0.05
      lastRef.current = next
      setHistory((h) => {
        const out = [...h.slice(1), next]
        return out
      })
      setBest((b) => Math.min(b, next))
      id = window.setTimeout(tick, 1100)
    }
    id = window.setTimeout(tick, 1100)
    return () => clearTimeout(id)
  }, [activity])

  const last = history[history.length - 1] ?? 0
  const lastSign = last < 0 ? '-' : '+'
  const lastAbs = Math.abs(last).toFixed(3)

  return (
    <div className="rounded-sm border border-white/10 bg-black/55 px-3 py-2 backdrop-blur-sm">
      <div className="mb-1 flex items-center justify-between">
        <span className="font-mono text-[9px] tracking-[0.3em] text-white/40">DELTA · LAST 22</span>
        <span
          className="font-mono text-[10px] tabular-nums tracking-[0.15em]"
          style={{ color: last < 0 ? '#23d160' : '#ff6262' }}
        >
          {lastSign}
          {lastAbs}s
        </span>
      </div>
      <div className="flex h-10 items-end gap-[2px]">
        {history.map((v, i) => {
          const height = Math.min(100, Math.max(6, Math.abs(v) * 180))
          const positive = v >= 0
          return (
            <div key={i} className="relative flex h-full flex-1 items-center">
              <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
              <div
                className="relative w-full rounded-sm"
                style={{
                  height: `${height}%`,
                  marginTop: positive ? 0 : 'auto',
                  marginBottom: positive ? 'auto' : 0,
                  background: positive ? '#ff6262' : color,
                  alignSelf: positive ? 'flex-start' : 'flex-end',
                  opacity: 0.35 + (i / history.length) * 0.65,
                }}
              />
            </div>
          )
        })}
      </div>
      <div className="mt-1 flex justify-between font-mono text-[9px] tracking-[0.2em] text-white/40">
        <span>BEST {best.toFixed(3)}s</span>
        <span style={{ color }}>SECTOR PACE</span>
      </div>
    </div>
  )
}
