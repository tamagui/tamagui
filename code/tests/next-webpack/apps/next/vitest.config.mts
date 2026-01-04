import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
})
