import { vi } from 'vitest'

// reanimated's upstream mock uses the js module even under native resolution.
// initialize that module through its js entry instead of native css registration.
vi.mock(
  'react-native-reanimated/src/initializers.native.ts',
  async () => import('react-native-reanimated/src/initializers.ts')
)
