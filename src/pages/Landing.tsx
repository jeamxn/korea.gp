import { motion, AnimatePresence } from 'framer-motion'
import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX, Pause, Play, Maximize2 } from 'lucide-react'
import { TEAMS } from '../data/teams'
import { useMouse } from '../hooks/useMouse'
import { useTelemetry } from '../hooks/useTelemetry'
import { useReducedMotion, useTabVisible, useIsMobile } from '../hooks/useEnvironment'
import { engineRev, tick, boost as boostSfx, setMuted } from '../lib/sfx'
import CustomCursor from '../components/CustomCursor'
import { TelemetryHUD } from '../components/TelemetryHUD'
import { TrackMap } from '../components/TrackMap'
import { WinnersTimeline } from '../components/WinnersTimeline'
import { GForce } from '../components/GForce'
import { HelpOverlay } from '../components/HelpOverlay'
import { SpecCard } from '../components/SpecCard'
import { RegsCountdown } from '../components/RegsCountdown'

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
  const [teamIdx, setTeamIdx] = useState(() => {
    if (typeof window === 'undefined') return 0
    try {
      const stored = localStorage.getItem('koreaGp.teamId')
      const idx = TEAMS.findIndex((t) => t.id === stored)
      return idx >= 0 ? idx : 0
    } catch {
      return 0
    }
  })
  const [autoRotate, setAutoRotate] = useState(true)
  const [loaded, setLoaded] = useState(false)
  const [muted, setMutedState] = useState(true)
  const [keyHint, setKeyHint] = useState<string | null>(null)
  const [seenTeams, setSeenTeams] = useState<Set<string>>(new Set([TEAMS[0].id]))
  const [showFirstHint, setShowFirstHint] = useState(false)
  const [allSeen, setAllSeen] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const team = TEAMS[teamIdx]

  const reducedMotion = useReducedMotion()
  const tabVisible = useTabVisible()
  const isMobile = useIsMobile()

  // refs passed into Canvas — avoids re-renders for animation values
  const boostRef = useRef(0)
  const parallaxRef = useRef({ x: 0, y: 0 })

  const m = useMouse()
  // Activity for telemetry — mouse speed (normalised) decays naturally
  const activity = Math.min(1, m.speed / 2.5)
  const tele = useTelemetry(activity)

  // Update parallax ref from mouse position
  useEffect(() => {
    parallaxRef.current.x = (m.x - 0.5) * 2 // -1..1
    parallaxRef.current.y = (m.y - 0.5) * 2
  }, [m.x, m.y])

  // Keyboard
  useEffect(() => {
    const showHint = (s: string) => {
      setKeyHint(s)
      setTimeout(() => setKeyHint(null), 900)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        next()
        showHint('NEXT TEAM →')
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        prev()
        showHint('← PREV TEAM')
      } else if (e.key === ' ') {
        e.preventDefault()
        setAutoRotate((v) => !v)
        tick()
        showHint(autoRotate ? 'PAUSE' : 'PLAY')
      } else if (/^[1-5]$/.test(e.key)) {
        const i = parseInt(e.key, 10) - 1
        if (i !== teamIdx) {
          setTeamIdx(i)
          engineRev()
          showHint(`SELECT ${TEAMS[i].short}`)
        }
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute()
        showHint(muted ? 'SOUND ON' : 'MUTED')
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen()
        showHint('FULLSCREEN')
      } else if (e.key === 'r' || e.key === 'R') {
        boostRef.current = 1.5
        boostSfx()
        showHint('BOOST')
      } else if (e.key === '?' || e.key === '/') {
        e.preventDefault()
        setShowHelp((v) => !v)
      } else if (e.key === 'Escape') {
        setShowHelp(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamIdx, autoRotate, muted])

  const next = () => {
    setTeamIdx((i) => (i + 1) % TEAMS.length)
    engineRev()
  }
  const prev = () => {
    setTeamIdx((i) => (i - 1 + TEAMS.length) % TEAMS.length)
    engineRev()
  }
  const pickTeam = (i: number) => {
    if (i === teamIdx) return
    setTeamIdx(i)
    engineRev()
  }
  const toggleMute = () => {
    const next = !muted
    setMutedState(next)
    setMuted(next)
    if (!next) tick()
  }
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.()
    else document.exitFullscreen?.()
  }
  const handleStageClick = () => {
    boostRef.current = 1.2
    boostSfx()
  }

  // Mobile swipe: left/right to switch teams
  useEffect(() => {
    if (!isMobile) return
    let startX = 0
    let startY = 0
    let active = false
    const onStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
      active = true
    }
    const onEnd = (e: TouchEvent) => {
      if (!active) return
      active = false
      const t = e.changedTouches[0]
      if (!t) return
      const dx = t.clientX - startX
      const dy = t.clientY - startY
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        if (dx < 0) next()
        else prev()
        if ('vibrate' in navigator) {
          try {
            navigator.vibrate(15)
          } catch {
            /* ignore */
          }
        }
      }
    }
    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchend', onEnd)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile])

  // Persist team selection
  useEffect(() => {
    try {
      localStorage.setItem('koreaGp.teamId', team.id)
    } catch {
      /* ignore */
    }
  }, [team.id])

  // Track which teams have been viewed
  useEffect(() => {
    setSeenTeams((prev) => {
      if (prev.has(team.id)) return prev
      const next = new Set(prev)
      next.add(team.id)
      if (next.size === TEAMS.length && !allSeen) {
        setAllSeen(true)
        boostSfx()
      }
      return next
    })
  }, [team.id, allSeen])

  // First-time hint after a few seconds of idle
  useEffect(() => {
    if (loaded && seenTeams.size === 1) {
      const t = setTimeout(() => {
        if (seenTeams.size === 1) setShowFirstHint(true)
      }, 4500)
      return () => clearTimeout(t)
    }
    if (seenTeams.size > 1) setShowFirstHint(false)
  }, [loaded, seenTeams])

  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-[#0a0a0a] text-[#f5f3ef]"
      style={
        {
          '--accent': team.color,
          '--accent-rgb': team.colorRgb,
          cursor: isMobile ? 'auto' : 'none',
        } as React.CSSProperties
      }
    >
      {!isMobile && <CustomCursor color={team.color} />}

      {/* Background grid with parallax */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
        animate={{
          x: (m.x - 0.5) * -16,
          y: (m.y - 0.5) * -16,
        }}
        transition={{ type: 'spring', stiffness: 60, damping: 20 }}
      />

      {/* Radial bloom */}
      <motion.div
        key={team.id + '-bloom'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 0.8 }}
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at ${m.x * 100}% ${m.y * 100}%, rgba(${team.colorRgb},0.22) 0%, transparent 55%)`,
        }}
      />

      {/* Speed lines */}
      <div className="pointer-events-none absolute inset-0 z-[1]">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="speed-line absolute h-px"
            style={{
              top: `${8 + i * 10}%`,
              width: `${10 + (i % 3) * 6}rem`,
              animationDuration: `${(2.2 + (i % 3) * 0.6) / (1 + activity * 1.5)}s`,
              animationDelay: `${i * 0.35}s`,
              opacity: 0.5 + activity * 0.5,
              background: `linear-gradient(to right, transparent, ${team.color}, transparent)`,
            }}
          />
        ))}
      </div>

      {/* MEGA WORDMARK with parallax */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[3] flex flex-col items-center justify-center"
        animate={{
          x: (m.x - 0.5) * -32,
          y: (m.y - 0.5) * -16,
        }}
        transition={{ type: 'spring', stiffness: 40, damping: 18 }}
      >
        <h1 className="font-['Bebas_Neue'] text-[28vw] leading-[0.82] tracking-tight text-white/[0.06] md:text-[20vw]">
          KOREA
        </h1>
      </motion.div>

      {/* 3D CAR */}
      <div
        className="absolute inset-0 z-[4]"
        data-cursor="car"
        onClick={handleStageClick}
      >
        <Suspense fallback={null}>
          <CarScene
            teamId={team.id}
            autoRotate={autoRotate && tabVisible}
            rimColor={team.color}
            boostRef={boostRef}
            parallaxRef={parallaxRef}
            reducedMotion={reducedMotion}
            onLoaded={() => setLoaded(true)}
          />
        </Suspense>
      </div>

      {/* Vignette */}
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
        <div className="ticker-dot h-1.5 w-1.5 rounded-full" style={{ background: team.color }} />
        <span className="font-mono text-[10px] tracking-[0.3em] text-white/55">
          ARCHIVE — DORMANT SINCE 2013
        </span>
      </motion.div>

      {/* TEAM NAME PANEL — top right */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute left-8 top-32 z-20 md:left-14"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={team.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <div className="font-mono text-[9px] tracking-[0.3em] text-white/35">NOW VIEWING</div>
            <div className="font-['Bebas_Neue'] text-3xl tracking-wide" style={{ color: team.color }}>
              {team.name.toUpperCase()}
            </div>
            <div className="font-mono text-[10px] tracking-[0.25em] text-white/55">{team.driverLine}</div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* TELEMETRY HUD */}
      <TelemetryHUD
        speed={tele.speed}
        rpm={tele.rpm}
        gear={tele.gear}
        throttle={tele.throttle}
        brake={tele.brake}
        drs={tele.drs}
        color={team.color}
      />

      {/* LEFT BOTTOM — winners timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-32 left-8 z-20 hidden w-[18rem] space-y-2 md:left-14 md:block"
      >
        <WinnersTimeline />
        <SpecCard team={team} />
      </motion.div>

      {/* RIGHT — Track map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="absolute right-8 top-1/2 z-20 hidden w-[20rem] -translate-y-1/2 space-y-2 md:right-14 md:block"
      >
        <TrackMap color={team.color} />
        <RegsCountdown color={team.color} />
        <div className="flex justify-end">
          <GForce color={team.color} />
        </div>
      </motion.div>

      {/* CENTER TAGLINE */}
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

      {/* TEAM SWITCHER + CONTROLS DOCK */}
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
                onClick={() => pickTeam(i)}
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

          <span className="mx-1 h-5 w-px bg-white/10" />

          <button
            onClick={() => {
              setAutoRotate((v) => !v)
              tick()
            }}
            className="flex h-7 w-7 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
            aria-label="Toggle rotation"
          >
            {autoRotate ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={toggleMute}
            className="flex h-7 w-7 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
            aria-label="Toggle sound"
          >
            {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={toggleFullscreen}
            className="flex h-7 w-7 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
            aria-label="Fullscreen"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setShowHelp((v) => !v)}
            className="flex h-7 w-7 items-center justify-center rounded-full font-mono text-[12px] font-bold text-white/60 transition hover:bg-white/10 hover:text-white"
            aria-label="Keyboard shortcuts"
            title="Keyboard shortcuts (?)"
          >
            ?
          </button>
        </div>
        <div className="mt-2 text-center font-mono text-[9px] tracking-[0.3em] text-white/30">
          ← → / 1-5 SWITCH · SPACE PAUSE · R BOOST · M SOUND · F FULLSCREEN · ? HELP
        </div>
      </motion.div>

      {/* Loading */}
      <AnimatePresence>
        {!loaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center bg-black"
          >
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="font-['Bebas_Neue'] text-6xl tracking-tight md:text-7xl"
            >
              KOREA<span style={{ color: team.color }}>.</span>GP
            </motion.div>
            <div className="mt-3 font-mono text-[10px] tracking-[0.4em] text-white/40">
              STARTING ENGINES…
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Key hint flash */}
      <AnimatePresence>
        {keyHint && (
          <motion.div
            key={keyHint}
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="pointer-events-none absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-32 rounded-full border border-white/20 bg-black/70 px-4 py-1.5 font-mono text-[11px] tracking-[0.3em] text-white backdrop-blur-md"
            style={{ boxShadow: `0 0 24px ${team.color}40` }}
          >
            {keyHint}
          </motion.div>
        )}
      </AnimatePresence>

      {/* First-time hint */}
      <AnimatePresence>
        {showFirstHint && !isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="pointer-events-none absolute left-1/2 top-1/3 z-25 -translate-x-1/2 text-center"
          >
            <div
              className="rounded-full border bg-black/70 px-4 py-1.5 font-mono text-[10px] tracking-[0.3em] backdrop-blur-md"
              style={{ borderColor: team.color, color: team.color, boxShadow: `0 0 20px ${team.color}40` }}
            >
              ← → TO SWITCH TEAMS · CLICK CAR TO BOOST
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* All teams seen — celebration ribbon */}
      <AnimatePresence>
        {allSeen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="pointer-events-none absolute left-1/2 top-44 z-25 -translate-x-1/2"
          >
            <div
              className="rounded-sm border px-3 py-1.5 font-mono text-[10px] tracking-[0.3em] backdrop-blur-md"
              style={{
                borderColor: team.color,
                color: team.color,
                background: `${team.color}1a`,
              }}
            >
              ALL TEAMS VIEWED · GRID COMPLETE
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <HelpOverlay open={showHelp} onClose={() => setShowHelp(false)} color={team.color} />

      {/* MARQUEE */}
      <div className="absolute inset-x-0 bottom-0 z-20 border-t border-white/10 bg-black/70 backdrop-blur-sm">
        <div className="flex overflow-hidden py-3">
          <div
            className="marquee-track flex shrink-0 items-center gap-10 whitespace-nowrap font-mono text-[11px] tracking-[0.35em] text-white/55"
            style={{ animationDuration: `${40 / (1 + activity)}s` }}
          >
            {[...FACTS, ...FACTS].map((f, i) => (
              <span key={i} className="flex items-center gap-10">
                <span>{f}</span>
                <span style={{ color: team.color }}>●</span>
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-white/5 px-6 py-1.5 font-mono text-[9px] tracking-[0.3em] text-white/30 md:px-14">
          <span>KOREA.GP · ARCHIVE EXHIBIT · NOT AFFILIATED WITH FIA / FOM</span>
          <a
            href="https://github.com/jeamxn/korea.gp"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-white/70"
            style={{ pointerEvents: 'auto' }}
          >
            SOURCE ↗
          </a>
        </div>
      </div>
    </div>
  )
}
