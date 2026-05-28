import { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'

const CarScene = lazy(() => import('../components/CarScene'))

export default function Landing() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#f5f3ef] text-[#0a0a0a]">
      {/* subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* radial vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,transparent_0%,transparent_45%,rgba(255,255,255,0.85)_88%)]" />

      {/* 3D — cars orbiting behind the wordmark */}
      <div className="absolute inset-0 z-[1]">
        <Suspense fallback={null}>
          <CarScene />
        </Suspense>
      </div>

      {/* CENTER WORDMARK — color invert in the shape of KOREA.GP */}
      <div className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.15 }}
          className="relative w-[92vw] md:w-[80vw]"
          style={{ aspectRatio: '1000 / 280' }}
        >
          <div
            className="absolute inset-0"
            style={{
              backdropFilter: 'invert(1) hue-rotate(180deg)',
              WebkitBackdropFilter: 'invert(1) hue-rotate(180deg)',
              WebkitMaskImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 280'><text x='500' y='225' text-anchor='middle' font-family='Impact, Haettenschweiler, Arial Narrow Bold, sans-serif' font-size='260' letter-spacing='-4' font-weight='400' fill='white'>KOREA.GP</text></svg>\")",
              maskImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 280'><text x='500' y='225' text-anchor='middle' font-family='Impact, Haettenschweiler, Arial Narrow Bold, sans-serif' font-size='260' letter-spacing='-4' font-weight='400' fill='white'>KOREA.GP</text></svg>\")",
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
            }}
          />
        </motion.div>
      </div>
    </div>
  )
}
