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

      {/* CENTER WORDMARK — glass via CSS mask-image (reliable across browsers) */}
      <div className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.15 }}
          className="relative w-[92vw] md:w-[80vw]"
          style={{ aspectRatio: '1000 / 280' }}
        >
          {/* Backdrop-blur layer, clipped to the letterforms */}
          <div
            className="absolute inset-0"
            style={{
              backdropFilter: 'blur(20px) saturate(1.4)',
              WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
              background: 'rgba(255,255,255,0.06)',
              WebkitMaskImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 280'><text x='500' y='232' text-anchor='middle' font-family='Bebas Neue, sans-serif' font-size='260' letter-spacing='-6' fill='white'>KOREA.GP</text></svg>\")",
              maskImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 280'><text x='500' y='232' text-anchor='middle' font-family='Bebas Neue, sans-serif' font-size='260' letter-spacing='-6' fill='white'>KOREA.GP</text></svg>\")",
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
            }}
          />

          {/* Outline + red dot via SVG on top */}
          <svg
            viewBox="0 0 1000 280"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <text
              x="500"
              y="232"
              textAnchor="middle"
              fontFamily="Bebas Neue, sans-serif"
              fontSize="260"
              letterSpacing="-6"
              fill="none"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth="1.2"
            >
              KOREA.GP
            </text>
            <text
              x="500"
              y="232"
              textAnchor="middle"
              fontFamily="Bebas Neue, sans-serif"
              fontSize="260"
              letterSpacing="-6"
              fill="#CD2E3A"
            >
              <tspan fillOpacity="0">KOREA</tspan>
              <tspan>.</tspan>
              <tspan fillOpacity="0">GP</tspan>
            </text>
          </svg>
        </motion.div>
      </div>
    </div>
  )
}
