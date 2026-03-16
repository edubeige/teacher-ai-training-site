import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base = process.env.GITHUB_ACTIONS && repoName ? `/${repoName}/` : '/'

export default defineConfig({
  plugins: [react()],
  base,
  test: {
    environment: 'jsdom',
    setupFiles: [fileURLToPath(new URL('./src/test/setup.ts', import.meta.url))],
    css: true,
    globals: true,
  },
})
