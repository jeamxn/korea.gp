import { useEffect, useState } from 'react'

// Synth telemetry — derived from mouse activity but constrained to realistic ranges
export function useTelemetry(activity: number) {
  // activity in [0..1]
  const [t, setT] = useState({
    speed: 0,
    rpm: 5400,
    gear: 2,
    throttle: 0,
    brake: 0,
    drs: false,
  })

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const tick = () => {
      const now = performance.now()
      const dt = (now - last) / 1000
      last = now
      setT((prev) => {
        const targetSpeed = 80 + activity * 240 // 80..320 km/h
        const speed = prev.speed + (targetSpeed - prev.speed) * Math.min(1, dt * 2.4)
        const targetRpm = 7000 + activity * 5500 // 7000..12500
        const rpm = prev.rpm + (targetRpm - prev.rpm) * Math.min(1, dt * 3.2)
        const gear = Math.max(2, Math.min(8, Math.round(2 + (speed / 320) * 6)))
        const throttle = Math.min(1, activity * 1.4 + 0.05)
        const brake = activity < 0.05 ? Math.max(0, prev.brake - dt) : 0
        const drs = speed > 250 && activity > 0.6
        return { speed, rpm, gear, throttle, brake, drs }
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [activity])

  return t
}
