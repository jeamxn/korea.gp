import { motion, AnimatePresence } from 'framer-motion'
import { Suspense, lazy, useEffect, useState } from 'react'
import { TEAMS } from '../data/teams'

const CarScene = lazy(() => import('../components/CarScene'))

const FACTS = [
  'KOREA INTERNATIONAL CIRCUIT',
  'YEONGAM · SOUTH JEOLLA',
  '5.615 KM · 18 TURNS',
  '2010 — 2013',
  '4 RACES HOSTED',
  'SEBASTIAN VETTEL · 3 WINS',
  'FERNANDO ALONSO · 1 WIN',
  'DESIGN — HERMANN TILKE',
  'KOREAN GRAND PRIX',
]

function Clock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const fmt = (d: Date, tz: string) =>
    new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: tz,
    }).format(d)
  return (
    <div className="flex gap-6 font-mono text-[11px] tracking-widest text-white/60">
      <div>
        <span className="text-white/40">SEOUL </span>
        <span className="text-white">{fmt(now, 'Asia/Seoul')}</span>
      </div>
      <div className="hidden sm:block">
        <span className="text-white/40">MONACO </span>
        <span className="text-white">{fmt(now, 'Europe/Monaco')}</span>
      </div>
    </div>
  )
}

export default function Landing() {
  const [teamIdx, setTeamIdx] = useState(0)
  const [autoRotate, setAutoRotate] = useState(true)
  const [loaded, setLoaded] = useState(false)
  const team = TEAMS[teamIdx]

  // Keyboard: arrow keys cycle teams, space toggles rotation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setTeamIdx((i) => (i + 1) % TEAMS.length)
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setTeamIdx((i) => (i - 1 + TEAMS.length) % TEAMS.length)
      } else if (e.key === ' ') {
        e.preventDefault()
        setAutoRotate((v) => !v)
      } else if (/^[1-5]$/.test(e.key)) {
        setTeamIdx(parseInt(e.key, 10) - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-[#0a0a0a] text-[#f5f3ef]"
      style={
        {
          '--accent': team.color,
          '--accent-rgb': team.colorRgb,
        } as React.CSSProperties
      }
    >
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Animated radial bloom that follows accent color */}
      <motion.div
        key={team.id + '-bloom'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 0.8 }}
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 60%, rgba(${team.colorRgb},0.22) 0%, transparent 55%)`,
        }}
      />

      {/* Speed lines (color follows accent) */}
      <div className="pointer-events-none absolute inset-0 z-[1]">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="speed-line absolute h-px"
            style={{
              top: `${8 + i * 10}%`,
              width: `${10 + (i % 3) * 6}rem`,
              animationDuration: `${2.2 + (i % 3) * 0.6}s`,
              animationDelay: `${i * 0.35}s`,
              opacity: 0.55,
              background: `linear-gradient(to right, transparent, ${team.color}, transparent)`,
            }}
          />
        ))}
      </div>

      {/* MEGA WORDMARK behind car */}
      <div className="pointer-events-none absolute inset-0 z-[3] flex flex-col items-center justify-center">
        <motion.h1
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          className="font-['Bebas_Neue'] text-[28vw] leading-[0.82] tracking-tight text-white/[0.06] md:text-[20vw]"
        >
          KOREA
        </motion.h1>
      </div>

      {/* 3D CAR — center stage */}
      <div className="absolute inset-0 z-[4]">
        <Suspense fallback={null}>
          <CarScene
            teamId={team.id}
            autoRotate={autoRotate}
            rimColor={team.color}
            onLoaded={() => setLoaded(true)}
          />
        </Suspense>
      </div>

      {/* Vignette over car */}
      <div className="pointer-events-none absolute inset-0 z-[5] bg-[radial-gradient(ellipse_at_50%_60%,transparent_0%,transparent_40%,rgba(0,0,0,0.7)_85%)]" />

      {/* HEADER */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-8 pt-6 md:px-14 md:pt-8">
        <div className="flex items-center gap-3">
          <motion.div
            className="flex h-7 w-7 items-center justify-center rounded-full"
            animate={{ backgroundColor: team.color }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-1.5 w-1.5 rounded-full bg-white" />
          </motion.div>
          <div className="font-mono text-[11px] tracking-[0.3em] text-white/80">
            KOREA<span style={{ color: team.color }}>.</span>GP
          </div>
        </div>
        <Clock />
      </header>

      {/* LIVE pill */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="absolute left-8 top-20 z-20 flex items-center gap-2 md:left-14 md:top-24"
      >
        <div
          className="ticker-dot h-1.5 w-1.5 rounded-full"
          style={{ background: team.color }}
        />
        <span className="font-mono text-[10px] tracking-[0.3em] text-white/55">
          ARCHIVE — DORMANT SINCE 2013
        </span>
      </motion.div>

      {/* TEAM PANEL — top right under clock */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute right-8 top-20 z-20 md:right-14 md:top-24"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={team.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="text-right"
          >
            <div className="font-mono text-[9px] tracking-[0.3em] text-white/35">
              NOW VIEWING
            </div>
            <div className="font-['Bebas_Neue'] text-2xl tracking-wide" style={{ color: team.color }}>
              {team.name.toUpperCase()}
            </div>
            <div className="font-mono text-[10px] tracking-[0.25em] text-white/55">
              {team.driverLine}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* CENTER TAGLINE (bottom) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-32 left-1/2 z-20 -translate-x-1/2 px-6 text-center"
      >
        <h2 className="font-['Bebas_Neue'] text-3xl leading-[0.95] tracking-tight md:text-5xl">
          THE LAND OF THE MORNING CALM
          <br />
          <span style={{ color: team.color }}>MEETS</span> THE WORLD'S FASTEST SPORT
        </h2>
      </motion.div>

      {/* TEAM SWITCHER — bottom dock */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-14 left-1/2 z-20 -translate-x-1/2"
      >
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-2 py-2 backdrop-blur-md">
          {TEAMS.map((t, i) => {
            const active = i === teamIdx
            return (
              <button
                key={t.id}
                onClick={() => setTeamIdx(i)}
                className="group relative flex items-center gap-2 rounded-full px-3 py-1.5 transition"
                style={{
                  background: active ? t.color : 'transparent',
                  color: active ? '#000' : 'rgba(255,255,255,0.7)',
                }}
                aria-label={t.name}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    background: active ? '#000' : t.color,
                    boxShadow: active ? 'none' : `0 0 8px ${t.color}`,
                  }}
                />
                <span className="font-mono text-[10px] font-bold tracking-[0.2em]">{t.short}</span>
              </button>
            )
          })}
        </div>
        <div className="mt-2 text-center font-mono text-[9px] tracking-[0.3em] text-white/30">
          ← → KEYS · 1-5 · SPACE TO PAUSE
        </div>
      </motion.div>

      {/* Loading overlay */}
      <AnimatePresence>
        {!loaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-black"
          >
            <div className="font-mono text-[10px] tracking-[0.4em] text-white/60">
              STARTING ENGINES…
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MARQUEE */}
      <div className="absolute inset-x-0 bottom-0 z-20 border-t border-white/10 bg-black/70 backdrop-blur-sm">
        <div className="flex overflow-hidden py-3">
          <div className="marquee-track flex shrink-0 items-center gap-10 whitespace-nowrap font-mono text-[11px] tracking-[0.35em] text-white/55">
            {[...FACTS, ...FACTS].map((f, i) => (
              <span key={i} className="flex items-center gap-10">
                <span>{f}</span>
                <span style={{ color: team.color }}>●</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
