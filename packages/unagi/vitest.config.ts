import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  // @ts-expect-error maybe a version mismatch?
  plugins: [react()],
  test: {
    include: ['**/*.vitest.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    environment: 'happy-dom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    restoreMocks: true,
  },
  define: {
    __UNAGI_DEV__: true,
    __UNAGI_TEST__: true,
  },
})
