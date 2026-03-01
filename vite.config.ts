import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/glazedatabase/',
  // @ts-ignore - Vitest config
  test: {
    globals: true,
    environment: 'happy-dom',
  },
})
