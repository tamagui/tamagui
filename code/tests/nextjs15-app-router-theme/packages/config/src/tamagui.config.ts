import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui } from '@tamagui/ui'
import { bodyFont, headingFont } from './fonts'
import { animations } from './animations'

export const config = createTamagui({
  ...defaultConfig,
  animations,
  fonts: {
    body: bodyFont,
    heading: headingFont,
  },
})
