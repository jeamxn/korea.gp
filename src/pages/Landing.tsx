import { motion } from 'framer-motion'
import { Suspense, lazy, useEffect, useState } from 'react'

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

const STATS = [
  { k: 'FIRST RACE', v: '24.10.2010' },
  { k: 'LAST RACE', v: '06.10.2013' },
  { k: 'LAP RECORD', v: '1:39.605' },
  { k: 'RECORD HOLDER', v: 'M. WEBBER' },
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
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#0a0a0a] text-[#f5f3ef]">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Speed lines */}
      <div className="pointer-events-none absolute inset-0 z-[1]">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="speed-line absolute h-px bg-gradient-to-r from-transparent via-[#CD2E3A] to-transparent"
            style={{
              top: `${8 + i * 10}%`,
              width: `${10 + (i % 3) * 6}rem`,
              animationDuration: `${2.2 + (i % 3) * 0.6}s`,
              animationDelay: `${i * 0.35}s`,
              opacity: 0.55,
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
          <CarScene />
        </Suspense>
      </div>

      {/* Radial vignette OVER the car for cinematic feel */}
      <div className="pointer-events-none absolute inset-0 z-[5] bg-[radial-gradient(ellipse_at_50%_60%,transparent_0%,transparent_40%,rgba(0,0,0,0.7)_85%)]" />

      {/* HEADER — minimal */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-8 pt-6 md:px-14 md:pt-8">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#CD2E3A]">
            <div className="h-1.5 w-1.5 rounded-full bg-white" />
          </div>
          <div className="font-mono text-[11px] tracking-[0.3em] text-white/80">
            KOREA<span className="text-[#CD2E3A]">.</span>GP
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
        <div className="ticker-dot h-1.5 w-1.5 rounded-full bg-[#CD2E3A]" />
        <span className="font-mono text-[10px] tracking-[0.3em] text-white/55">
          ARCHIVE — DORMANT SINCE 2013
        </span>
      </motion.div>

      {/* TOP center overline */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.4 }}
        className="absolute left-1/2 top-24 z-20 flex -translate-x-1/2 items-center gap-3 font-mono text-[10px] tracking-[0.4em] text-white/40"
      >
        <span className="h-px w-8 bg-white/30" />
        <span>FORMULA 1 · REPUBLIC OF KOREA</span>
        <span className="h-px w-8 bg-white/30" />
      </motion.div>

      {/* BOTTOM CENTER — tagline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-24 left-1/2 z-20 -translate-x-1/2 px-6 text-center"
      >
        <h2 className="font-['Bebas_Neue'] text-4xl leading-[0.95] tracking-tight md:text-6xl">
          THE LAND OF THE MORNING CALM
          <br />
          <span className="text-[#CD2E3A]">MEETS</span> THE WORLD'S FASTEST SPORT
        </h2>
        <p className="mx-auto mt-3 max-w-xl font-mono text-[10px] tracking-[0.25em] text-white/45">
          A FOUR-YEAR STORY BETWEEN YEONGAM AND FORMULA 1 — AND THE ROAD BACK.
        </p>
      </motion.div>

      {/* LEFT BOTTOM — stats */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute bottom-20 left-8 z-20 hidden md:left-14 md:block"
      >
        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
          {STATS.map((s) => (
            <div key={s.k}>
              <div className="font-mono text-[9px] tracking-[0.3em] text-white/35">{s.k}</div>
              <div className="font-mono text-sm tracking-wider text-white">{s.v}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* RIGHT BOTTOM — coordinates */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute bottom-20 right-8 z-20 hidden text-right md:right-14 md:block"
      >
        <div className="font-mono text-[9px] tracking-[0.3em] text-white/35">COORDINATES</div>
        <div className="font-mono text-sm tracking-wider text-white">34.7333° N</div>
        <div className="font-mono text-sm tracking-wider text-white">126.4167° E</div>
        <div className="mt-3 font-mono text-[9px] tracking-[0.3em] text-white/35">CIRCUIT</div>
        <div className="font-mono text-sm tracking-wider text-white">5.615 KM</div>
      </motion.div>

      {/* MARQUEE */}
      <div className="absolute inset-x-0 bottom-0 z-20 border-t border-white/10 bg-black/70 backdrop-blur-sm">
        <div className="flex overflow-hidden py-3">
          <div className="marquee-track flex shrink-0 items-center gap-10 whitespace-nowrap font-mono text-[11px] tracking-[0.35em] text-white/55">
            {[...FACTS, ...FACTS].map((f, i) => (
              <span key={i} className="flex items-center gap-10">
                <span>{f}</span>
                <span className="text-[#CD2E3A]">●</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
