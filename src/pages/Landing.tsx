import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ArrowUpRight, Radio } from 'lucide-react'

const FACTS = [
  'KOREA INTERNATIONAL CIRCUIT',
  'YEONGAM · SOUTH JEOLLA',
  '5.615 KM · 18 TURNS',
  '2010 — 2013',
  '4 RACES HOSTED',
  'POLE LAP 1:35.585',
  'SEBASTIAN VETTEL · 3 WINS',
  'FERNANDO ALONSO · 1 WIN',
  'NIGHT — DAY HYBRID DESIGN',
  'HERMANN TILKE',
  '대한민국 그랑프리',
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
      <div>
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
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Radial vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,transparent_0%,rgba(0,0,0,0.85)_85%)]" />

      {/* Speed lines */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="speed-line absolute h-px w-32 bg-gradient-to-r from-transparent via-[#CD2E3A] to-transparent"
            style={{
              top: `${10 + i * 12}%`,
              animationDuration: `${2.4 + (i % 3) * 0.6}s`,
              animationDelay: `${i * 0.4}s`,
              opacity: 0.5,
            }}
          />
        ))}
      </div>

      {/* Korean character watermark */}
      <div className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 select-none text-[34vw] font-black leading-none text-white/[0.025]">
        韓
      </div>

      {/* HEADER */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-8 pt-6 md:px-14 md:pt-8">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#CD2E3A]">
            <div className="h-1.5 w-1.5 rounded-full bg-white" />
          </div>
          <div className="font-mono text-[11px] tracking-[0.3em] text-white/80">
            KOREA<span className="text-[#CD2E3A]">.</span>GP
          </div>
        </div>

        <nav className="hidden items-center gap-8 font-mono text-[11px] tracking-[0.25em] text-white/50 md:flex">
          <a href="#circuit" className="transition hover:text-white">CIRCUIT</a>
          <a href="#history" className="transition hover:text-white">HISTORY</a>
          <a href="#archive" className="transition hover:text-white">ARCHIVE</a>
          <a href="#future" className="transition hover:text-white">FUTURE</a>
        </nav>

        <Clock />
      </header>

      {/* LIVE ticker pill */}
      <div className="absolute left-8 top-20 z-20 flex items-center gap-2 md:left-14 md:top-24">
        <div className="ticker-dot h-1.5 w-1.5 rounded-full bg-[#CD2E3A]" />
        <span className="font-mono text-[10px] tracking-[0.3em] text-white/50">
          ARCHIVE — DORMANT SINCE 2013
        </span>
      </div>

      {/* CENTER HERO */}
      <main className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6">
        {/* small overline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 flex items-center gap-3 font-mono text-[10px] tracking-[0.4em] text-white/40"
        >
          <span className="h-px w-8 bg-white/30" />
          <span>FORMULA 1 · 大韓民國</span>
          <span className="h-px w-8 bg-white/30" />
        </motion.div>

        {/* main title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="text-center font-['Bebas_Neue'] text-[20vw] leading-[0.85] tracking-tight md:text-[14vw]"
        >
          <span className="block">
            KOREA<span className="text-[#CD2E3A]">.</span>
          </span>
          <span className="block -mt-[2vw] text-white/80">GRAND PRIX</span>
        </motion.h1>

        {/* subline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-4 max-w-2xl text-center text-sm leading-relaxed text-white/55 md:text-base"
        >
          Where Formula 1 met the land of the morning calm.
          A four-year story between Yeongam and the world's fastest sport — and the road back.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#circuit"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-mono text-[11px] tracking-[0.25em] text-black transition hover:bg-[#CD2E3A] hover:text-white"
          >
            ENTER ARCHIVE
            <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a
            href="#future"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 font-mono text-[11px] tracking-[0.25em] text-white/70 transition hover:border-white hover:text-white"
          >
            <Radio className="h-3.5 w-3.5" />
            CAN F1 RETURN?
          </a>
        </motion.div>
      </main>

      {/* LEFT BOTTOM — stats */}
      <div className="absolute bottom-20 left-8 z-20 hidden md:left-14 md:block">
        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
          {STATS.map((s) => (
            <div key={s.k}>
              <div className="font-mono text-[9px] tracking-[0.3em] text-white/35">{s.k}</div>
              <div className="font-mono text-sm tracking-wider text-white">{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT BOTTOM — coordinates */}
      <div className="absolute bottom-20 right-8 z-20 hidden text-right md:right-14 md:block">
        <div className="font-mono text-[9px] tracking-[0.3em] text-white/35">COORDINATES</div>
        <div className="font-mono text-sm tracking-wider text-white">34.7333° N</div>
        <div className="font-mono text-sm tracking-wider text-white">126.4167° E</div>
        <div className="mt-3 font-mono text-[9px] tracking-[0.3em] text-white/35">DESIGN BY</div>
        <div className="font-mono text-sm tracking-wider text-white">H. TILKE</div>
      </div>

      {/* MARQUEE */}
      <div className="absolute inset-x-0 bottom-0 z-20 border-t border-white/10 bg-black/60 backdrop-blur-sm">
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
