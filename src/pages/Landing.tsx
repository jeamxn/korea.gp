import { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'

const CarScene = lazy(() => import('../components/CarScene'))

export default function Landing() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#0a0a0a] text-[#f5f3ef]">
      {/* subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* radial vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,transparent_0%,transparent_45%,rgba(0,0,0,0.78)_88%)]" />

      {/* 3D — cars orbiting behind the wordmark */}
      <div className="absolute inset-0 z-[1]">
        <Suspense fallback={null}>
          <CarScene />
        </Suspense>
      </div>

      {/* CENTER WORDMARK — sits on top of the orbiting cars */}
      <div className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center px-6">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, letterSpacing: '0.2em' }}
            animate={{ opacity: 1, letterSpacing: '0em' }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="font-mono text-[10px] tracking-[0.5em] text-white/40 md:text-xs"
          >
            EST · KOREA INTERNATIONAL CIRCUIT · 2010
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.15 }}
            className="mt-3 font-['Bebas_Neue'] leading-[0.82] tracking-tight"
          >
            <span className="block text-[16vw] md:text-[12vw]">FORMULA 1</span>
            <span
              className="block text-[24vw] md:text-[18vw]"
              style={{ color: '#CD2E3A' }}
            >
              KOREA
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.9 }}
            className="mt-4 font-mono text-[10px] tracking-[0.4em] text-white/45 md:text-xs"
          >
            — DORMANT SINCE 2013 —
          </motion.div>
        </div>
      </div>
    </div>
  )
}
