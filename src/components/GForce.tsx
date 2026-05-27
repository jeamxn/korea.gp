// G-force meter — derived from mouse acceleration
import { useEffect, useState } from 'react'
import { useMouse } from '../hooks/useMouse'

export function GForce({ color }: { color: string }) {
  const m = useMouse()
  const [g, setG] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setG((prev) => {
      const targetX = Math.max(-3, Math.min(3, m.vx * 0.6))
      const targetY = Math.max(-3, Math.min(3, m.vy * 0.6))
      return {
        x: prev.x + (targetX - prev.x) * 0.15,
        y: prev.y + (targetY - prev.y) * 0.15,
      }
    })
  }, [m.vx, m.vy])

  const mag = Math.min(3, Math.sqrt(g.x * g.x + g.y * g.y))

  return (
    <div className="rounded-md border border-white/10 bg-black/55 p-3 backdrop-blur-md">
      <div className="mb-2 flex items-center justify-between">
        <div className="font-mono text-[9px] tracking-[0.3em] text-white/35">G-FORCE</div>
        <div className="font-mono text-[10px] tracking-wider" style={{ color }}>
          {mag.toFixed(2)} G
        </div>
      </div>
      <svg viewBox="-50 -50 100 100" className="h-28 w-28">
        {/* concentric rings */}
        {[1, 2, 3].map((r) => (
          <circle
            key={r}
            cx="0"
            cy="0"
            r={r * 14}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={0.5}
            strokeDasharray="2 2"
          />
        ))}
        {/* crosshair */}
        <line x1="-45" y1="0" x2="45" y2="0" stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
        <line x1="0" y1="-45" x2="0" y2="45" stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
        <text x="46" y="3" fill="rgba(255,255,255,0.3)" style={{ font: '6px monospace' }}>
          R
        </text>
        <text x="-3" y="-46" fill="rgba(255,255,255,0.3)" style={{ font: '6px monospace' }}>
          BR
        </text>
        {/* dot */}
        <circle
          cx={g.x * 14}
          cy={g.y * 14}
          r={3.5}
          fill={color}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
    </div>
  )
}
