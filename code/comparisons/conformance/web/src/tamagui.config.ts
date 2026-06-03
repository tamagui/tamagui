import { defaultConfig } from '@tamagui/config/v5'
import { createTamagui } from 'tamagui'

// v5 is the target config for the tailwind work. pure tailwind mode: className-only —
// the path the harness measures against real Tailwind.
export default createTamagui({
  ...defaultConfig,
  settings: {
    ...defaultConfig.settings,
    styleMode: 'tailwind',
  },
})
