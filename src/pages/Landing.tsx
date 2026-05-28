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

      {/* CENTER WORDMARK — glassmorphism on the text shape */}
      <div className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center px-6">
        <motion.svg
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.15 }}
          viewBox="0 0 1000 280"
          className="w-[92vw] md:w-[80vw]"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <mask id="koreagp-mask">
              <rect width="1000" height="280" fill="black" />
              <text
                x="500"
                y="232"
                textAnchor="middle"
                fontFamily="Bebas Neue, sans-serif"
                fontSize="260"
                fill="white"
                letterSpacing="-6"
              >
                KOREA.GP
              </text>
            </mask>
          </defs>

          {/* Frosted-glass fill — visible only inside the letterforms */}
          <foreignObject width="1000" height="280" mask="url(#koreagp-mask)">
            <div
              // @ts-expect-error xmlns required for foreignObject html content
              xmlns="http://www.w3.org/1999/xhtml"
              style={{
                width: '100%',
                height: '100%',
                backdropFilter: 'blur(18px) saturate(1.4)',
                WebkitBackdropFilter: 'blur(18px) saturate(1.4)',
                background: 'rgba(255,255,255,0.08)',
              }}
            />
          </foreignObject>

          {/* Thin outline so the glass edges read */}
          <text
            x="500"
            y="232"
            textAnchor="middle"
            fontFamily="Bebas Neue, sans-serif"
            fontSize="260"
            fill="none"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1"
            letterSpacing="-6"
          >
            KOREA.GP
          </text>

          {/* Red accent — only the dot is filled, rest stays glass */}
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
        </motion.svg>
      </div>
    </div>
  )
}
