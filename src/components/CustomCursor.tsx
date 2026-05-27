import { useEffect, useRef, useState } from 'react'
import { useMouse } from '../hooks/useMouse'

export default function CustomCursor({ color }: { color: string }) {
  const m = useMouse()
  const [hover, setHover] = useState<'none' | 'button' | 'car'>('none')
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      if (!el) return
      if (el.closest('[data-cursor="car"]')) setHover('car')
      else if (el.closest('button, a, [data-cursor="button"]')) setHover('button')
      else setHover('none')
    }
    window.addEventListener('mouseover', onOver)
    return () => window.removeEventListener('mouseover', onOver)
  }, [])

  const x = m.x * window.innerWidth
  const y = m.y * window.innerHeight
  const size = hover === 'car' ? 64 : hover === 'button' ? 44 : 24

  return (
    <>
      <div
        className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference"
        style={{
          transform: `translate(${x - 2}px, ${y - 2}px)`,
        }}
      >
        <div className="h-1 w-1 rounded-full bg-white" />
      </div>
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[99] transition-all duration-200 ease-out"
        style={{
          width: size,
          height: size,
          transform: `translate(${x - size / 2}px, ${y - size / 2}px)`,
          border: `1px solid ${color}`,
          borderRadius: '999px',
          boxShadow: `0 0 18px ${color}55`,
          opacity: hover === 'none' ? 0.5 : 0.9,
        }}
      >
        {hover === 'car' && (
          <div
            className="absolute inset-0 flex items-center justify-center font-mono text-[8px] tracking-[0.2em]"
            style={{ color }}
          >
            DRAG
          </div>
        )}
      </div>
    </>
  )
}
