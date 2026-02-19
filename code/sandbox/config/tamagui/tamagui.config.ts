import { defaultConfig } from '@tamagui/config/v5'
import { animationsMotion } from '@tamagui/config/v5-motion'
import { createTamagui } from 'tamagui'

const customColors = {
  testColor: '#00ff00',
  testColor2: '#0000ff',
  testColor3: '#82209B',
  testColor4: '#fff1ff',
  testColor5: '#CA741E',
  testColor6: '#134C4C',
  testColor7: '#471E1E',
  testColor8: '#ff3fff',
  testColor9: '#99CA1D',
}

const customTokens = {
  ...defaultConfig.tokens,
  color: customColors,
}

export const config = createTamagui({
  ...defaultConfig,
  animations: animationsMotion,
  tokens: customTokens,
})

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}

  interface TypeOverride {
    groupNames(): 'card' | 'other'
  }
}

export default config
