import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // The workflow provides the repository subpath for GitHub Pages. Locally
  // this stays at the root, so `npm run dev` works as usual.
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
  test: { environment: 'node' },
})
