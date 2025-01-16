import { mergeConfig } from 'vitest/config'
import config from '../../packages/vite-plugin-internal/src/vite.config'

export default mergeConfig(config, {
  test: {
    include: ['**/*.test.tsx'],
  },
})
