import { motion } from 'framer-motion'

export function TelemetryHUD({
  speed,
  rpm,
  gear,
  throttle,
  brake,
  drs,
  color,
}: {
  speed: number
  rpm: number
  gear: number
  throttle: number
  brake: number
  drs: boolean
  color: string
}) {
  const rpmPct = Math.min(1, (rpm - 4000) / 9000)
  return (
    <div className="absolute right-8 top-1/2 z-20 hidden -translate-y-1/2 md:right-14 md:block">
      <div className="rounded-md border border-white/10 bg-black/40 p-4 backdrop-blur-md">
        <div className="font-mono text-[9px] tracking-[0.3em] text-white/35">TELEMETRY</div>

        {/* Speed */}
        <div className="mt-2">
          <div className="flex items-baseline gap-1">
            <span className="font-['Bebas_Neue'] text-5xl leading-none" style={{ color }}>
              {Math.round(speed).toString().padStart(3, '0')}
            </span>
            <span className="font-mono text-[9px] tracking-[0.2em] text-white/40">KM/H</span>
          </div>
        </div>

        {/* RPM bar */}
        <div className="mt-3 w-44">
          <div className="flex items-center justify-between font-mono text-[8px] tracking-[0.2em] text-white/35">
            <span>RPM</span>
            <span>{Math.round(rpm).toLocaleString()}</span>
          </div>
          <div className="mt-1 flex h-2 gap-[2px]">
            {Array.from({ length: 24 }).map((_, i) => {
              const on = i / 24 < rpmPct
              const danger = i >= 19 && on
              return (
                <div
                  key={i}
                  className="flex-1 transition-colors"
                  style={{
                    background: on
                      ? danger
                        ? '#ff2d2d'
                        : color
                      : 'rgba(255,255,255,0.08)',
                  }}
                />
              )
            })}
          </div>
        </div>

        {/* Throttle / Brake */}
        <div className="mt-3 w-44 space-y-1.5">
          <Bar label="THR" value={throttle} color={color} />
          <Bar label="BRK" value={brake} color="#ff2d2d" />
        </div>

        <div className="mt-3 flex w-44 items-center justify-between font-mono text-[10px] tracking-[0.2em]">
          <div>
            <span className="text-white/35">GEAR </span>
            <span className="text-white">{gear}</span>
          </div>
          <motion.div
            animate={{ opacity: drs ? 1 : 0.25 }}
            className="rounded px-1.5 py-0.5 font-bold"
            style={{
              background: drs ? color : 'transparent',
              color: drs ? '#000' : 'rgba(255,255,255,0.4)',
              border: `1px solid ${drs ? color : 'rgba(255,255,255,0.2)'}`,
            }}
          >
            DRS
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between font-mono text-[8px] tracking-[0.2em] text-white/35">
        <span>{label}</span>
        <span>{Math.round(value * 100)}%</span>
      </div>
      <div className="mt-0.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          animate={{ width: `${value * 100}%` }}
          transition={{ duration: 0.1 }}
          style={{ background: color }}
        />
      </div>
    </div>
  )
}
