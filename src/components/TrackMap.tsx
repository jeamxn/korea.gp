import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

// Stylised representation of Korea International Circuit (KIC) at Yeongam.
// Not a survey path — drawn for visual rhythm; 18 turns marked along
// the route. Pit straight at the south, long back straight at the north.
const TRACK =
  'M 60 200 L 280 200 Q 320 200 320 170 L 320 130 Q 320 100 350 100 L 460 100 Q 510 100 510 60 L 510 50 Q 510 30 530 30 L 580 30 Q 620 30 630 60 L 660 130 Q 670 150 660 170 L 620 230 Q 600 260 560 260 L 480 260 Q 450 260 440 240 L 410 200 Q 400 180 380 180 L 220 180 Q 180 180 170 210 L 140 250 Q 120 280 90 280 L 70 280 Q 50 280 50 260 L 50 220 Q 50 200 60 200 Z'

const TURNS = [
  { x: 250, y: 200, n: 1 },
  { x: 320, y: 150, n: 2 },
  { x: 350, y: 100, n: 3 },
  { x: 460, y: 100, n: 4 },
  { x: 510, y: 50, n: 5 },
  { x: 580, y: 30, n: 6 },
  { x: 630, y: 60, n: 7 },
  { x: 660, y: 130, n: 8 },
  { x: 660, y: 170, n: 9 },
  { x: 620, y: 230, n: 10 },
  { x: 560, y: 260, n: 11 },
  { x: 440, y: 240, n: 12 },
  { x: 410, y: 200, n: 13 },
  { x: 220, y: 180, n: 14 },
  { x: 170, y: 210, n: 15 },
  { x: 140, y: 250, n: 16 },
  { x: 70, y: 280, n: 17 },
  { x: 60, y: 230, n: 18 },
]

const fmtSector = (ms: number) => {
  const s = ms / 1000
  return s.toFixed(3)
}

export function TrackMap({ color, lapMs = 95000 }: { color: string; lapMs?: number }) {
  const [progress, setProgress] = useState(0)
  const [length, setLength] = useState(0)
  const [pathRef, setPathRef] = useState<SVGPathElement | null>(null)
  const [hoverTurn, setHoverTurn] = useState<number | null>(null)
  const [sectorTimes, setSectorTimes] = useState<[number, number, number]>([
    lapMs * 0.34,
    lapMs * 0.33,
    lapMs * 0.33,
  ])
  const [bestSectors, setBestSectors] = useState<[number, number, number]>([
    lapMs * 0.34,
    lapMs * 0.33,
    lapMs * 0.33,
  ])
  const sectorStartRef = useRef(performance.now())
  const prevSectorRef = useRef(1)

  // measure path length once node mounts
  useEffect(() => {
    if (pathRef) setLength(pathRef.getTotalLength())
  }, [pathRef])

  useEffect(() => {
    let raf = 0
    const start = performance.now()
    sectorStartRef.current = start
    prevSectorRef.current = 1
    const tick = () => {
      const now = performance.now()
      const t = ((now - start) / lapMs) % 1
      setProgress(t)
      const sec = t < 0.34 ? 1 : t < 0.67 ? 2 : 3
      if (sec !== prevSectorRef.current) {
        const elapsed = now - sectorStartRef.current
        const completed = prevSectorRef.current
        setSectorTimes((prev) => {
          const next = [...prev] as [number, number, number]
          next[completed - 1] = elapsed
          return next
        })
        setBestSectors((prev) => {
          const next = [...prev] as [number, number, number]
          if (elapsed < next[completed - 1]) next[completed - 1] = elapsed
          return next
        })
        sectorStartRef.current = now
        prevSectorRef.current = sec
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [lapMs])

  let dotX = 0
  let dotY = 0
  if (pathRef && length > 0) {
    const p = pathRef.getPointAtLength(length * progress)
    dotX = p.x
    dotY = p.y
  }

  const sector = progress < 0.34 ? 1 : progress < 0.67 ? 2 : 3
  const sectorColor = sector === 1 ? '#ff2d2d' : sector === 2 ? '#fada00' : '#23d160'
  const totalBest = bestSectors[0] + bestSectors[1] + bestSectors[2]
  const bestLap = `${Math.floor(totalBest / 60000)}:${String(
    Math.floor((totalBest % 60000) / 1000),
  ).padStart(2, '0')}.${String(Math.floor(totalBest % 1000)).padStart(3, '0')}`

  return (
    <div className="rounded-md border border-white/10 bg-black/55 p-3 backdrop-blur-md">
      <div className="mb-2 flex items-center justify-between">
        <div className="font-mono text-[9px] tracking-[0.3em] text-white/35">
          KOREA INT'L CIRCUIT
        </div>
        <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.2em]">
          <span className="text-white/35">S{sector}</span>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: sectorColor }} />
          <span style={{ color }}>{Math.round(progress * 100)}%</span>
        </div>
      </div>

      <svg viewBox="0 0 720 320" className="h-44 w-full">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ghost outline */}
        <path
          d={TRACK}
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={6}
          strokeLinejoin="round"
        />

        {/* live coloured track */}
        <path
          ref={setPathRef}
          d={TRACK}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeDasharray={`${length * 0.06} ${length * 0.94}`}
          strokeDashoffset={-(length * progress) + length * 0.03}
          strokeLinecap="round"
          filter="url(#glow)"
        />

        {/* start/finish */}
        <line x1="170" y1="195" x2="170" y2="220" stroke="#fff" strokeWidth="2" strokeDasharray="2 2" />
        <text x="178" y="218" className="fill-white/60" style={{ font: '8px monospace' }}>
          START
        </text>

        {/* turn markers */}
        {TURNS.map((t) => (
          <g
            key={t.n}
            onMouseEnter={() => setHoverTurn(t.n)}
            onMouseLeave={() => setHoverTurn(null)}
            className="cursor-pointer"
          >
            <circle
              cx={t.x}
              cy={t.y}
              r={hoverTurn === t.n ? 7 : 3.5}
              fill={hoverTurn === t.n ? color : 'rgba(255,255,255,0.4)'}
              stroke={hoverTurn === t.n ? '#fff' : 'transparent'}
              strokeWidth={1}
              style={{ transition: 'all 0.18s' }}
            />
            {hoverTurn === t.n && (
              <text
                x={t.x + 10}
                y={t.y - 8}
                fill="#fff"
                style={{ font: 'bold 11px Inter' }}
              >
                T{t.n}
              </text>
            )}
          </g>
        ))}

        {/* live dot */}
        <motion.circle
          cx={dotX}
          cy={dotY}
          r={6}
          fill={color}
          filter="url(#glow)"
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      </svg>

      <div className="mt-1 grid grid-cols-3 gap-1">
        {([1, 2, 3] as const).map((i) => {
          const live = sectorTimes[i - 1]
          const best = bestSectors[i - 1]
          const isPB = live <= best + 1
          const active = sector === i
          return (
            <div
              key={i}
              className="rounded-sm border border-white/10 px-1.5 py-1"
              style={{
                background: active ? `${color}1a` : 'transparent',
                borderColor: active ? color : 'rgba(255,255,255,0.08)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[8px] tracking-[0.2em] text-white/40">S{i}</span>
                <span
                  className="h-1 w-1 rounded-full"
                  style={{
                    background: isPB ? '#a855f7' : '#23d160',
                    boxShadow: `0 0 4px ${isPB ? '#a855f7' : '#23d160'}`,
                  }}
                />
              </div>
              <div className="font-mono text-[10px] tabular-nums tracking-wider text-white/90">
                {fmtSector(live)}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-1.5 grid grid-cols-3 gap-2 border-t border-white/5 pt-1.5 text-center">
        <Stat label="BEST" v={bestLap} />
        <Stat label="TURNS" v="18" />
        <Stat label="LENGTH" v="5.615 KM" />
      </div>
    </div>
  )
}

function Stat({ label, v }: { label: string; v: string }) {
  return (
    <div>
      <div className="font-mono text-[8px] tracking-[0.2em] text-white/35">{label}</div>
      <div className="font-mono text-[10px] tracking-wider text-white">{v}</div>
    </div>
  )
}
