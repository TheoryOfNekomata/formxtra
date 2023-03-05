import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/cypress/**/*.test.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
    ],
    globals: true,
    environment: 'jsdom',
    globalSetup: './test-globals.js',
  },
})
