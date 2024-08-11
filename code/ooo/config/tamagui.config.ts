import { config as configOptions } from '@tamagui/config/v3'
import { createTamagui } from 'tamagui'

export const config = createTamagui({
  ...configOptions,
  themeClassNameOnRoot: false,
  shouldAddPrefersColorThemes: false,
})

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default config
