import { config } from '@tamagui/config/v3'
import { createTamagui } from 'tamagui'

export default createTamagui({
  ...config,
  settings: {
    ...config.settings,
    styleMode: ['flat', 'tailwind'],
  },
})
