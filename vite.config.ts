import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { host: '0.0.0.0', port: 5173 },
  preview: { host: '0.0.0.0', port: 4173, allowedHosts: true },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        // Split heavy 3D libs into their own long-cacheable chunks so the main
        // entry stays small and the 3D bundle benefits from cache hits across
        // unrelated app deploys.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('three/') || /[/\\]three[/\\]/.test(id)) return 'three'
          if (id.includes('@react-three/fiber')) return 'r3f'
          if (id.includes('@react-three/drei')) return 'drei'
          if (id.includes('@react-three/postprocessing') || id.includes('/postprocessing/')) return 'postfx'
          if (id.includes('framer-motion')) return 'motion'
          if (id.includes('lucide-react')) return 'icons'
        },
      },
    },
  },
})
