import { defaultConfig } from '@tamagui/config/v6'
import { createTamagui } from 'tamagui'

// v6 = the Tailwind-compatible config (w/h shorthands; scale/palette to follow).
// pure tailwind mode: className-only — the path the harness measures against real Tailwind.
export default createTamagui({
  ...defaultConfig,
  settings: {
    ...defaultConfig.settings,
    styleMode: 'tailwind',
  },
})
