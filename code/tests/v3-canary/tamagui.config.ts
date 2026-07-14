import { animations } from '@tamagui/config/v3'
import { defaultConfig as v6 } from '@tamagui/config/v6'
import { createTamagui } from 'tamagui'

const config = createTamagui({
  ...v6,
  animations,
  settings: {
    ...v6.settings,
    styleMode: 'tamagui-and-tailwind',
  },
  themes: {
    ...v6.themes,
    light: {
      ...v6.themes.light,
      canaryTheme: '#0f766e',
    },
    dark: {
      ...v6.themes.dark,
      canaryTheme: '#5eead4',
    },
  },
  tokens: {
    ...v6.tokens,
    color: {
      ...v6.tokens.color,
      '$canary-token': '#7c3aed',
    },
    space: {
      ...v6.tokens.space,
      $4: 18,
    },
  },
})

export type CanaryConfig = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends CanaryConfig {}
}

export default config
