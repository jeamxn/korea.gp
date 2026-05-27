import { useEffect, useState, useRef } from 'react'

export function useMouse() {
  const [m, setM] = useState({ x: 0.5, y: 0.5, vx: 0, vy: 0, speed: 0 })
  const last = useRef({ x: 0.5, y: 0.5, t: performance.now() })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth
      const y = e.clientY / window.innerHeight
      const t = performance.now()
      const dt = Math.max(1, t - last.current.t)
      const vx = (x - last.current.x) / (dt / 1000)
      const vy = (y - last.current.y) / (dt / 1000)
      const speed = Math.sqrt(vx * vx + vy * vy)
      last.current = { x, y, t }
      setM({ x, y, vx, vy, speed })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return m
}

// Returns smoothed [0..1] value that decays toward 0
export function useDecay(target: number, decay = 4) {
  const [v, setV] = useState(0)
  const raf = useRef<number | null>(null)
  const last = useRef(performance.now())
  const targetRef = useRef(target)
  targetRef.current = target

  useEffect(() => {
    const tick = () => {
      const t = performance.now()
      const dt = (t - last.current) / 1000
      last.current = t
      setV((prev) => {
        const goal = targetRef.current
        const next = prev + (goal - prev) * Math.min(1, dt * decay)
        return next
      })
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [decay])

  return v
}
