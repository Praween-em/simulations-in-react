import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Change '/trig-simulations/' to match your GitHub repo name exactly.
// If the repo is at github.com/yourname/trig-simulations, keep this as-is.
export default defineConfig({
  base: '/simulations-in-react/',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('three')) return 'three'
          if (id.includes('react')) return 'react'
        },
      },
    },
  },
})
