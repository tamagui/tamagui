import { createTamagui } from '@tamagui/web'
import { shorthands } from '@tamagui/shorthands'

export const config = createTamagui({
  shorthands,
  themes: {
    light: { background: '#fff', color: '#000' },
    dark: { background: '#000', color: '#fff' },
  },
  tokens: {
    color: { white: '#fff', black: '#000', red: '#f00', blue: '#00f' },
    space: { 1: 4, 2: 8, 3: 12, 4: 16 },
    size: { 1: 20, 2: 40, 3: 60 },
    radius: { 1: 4, 2: 8 },
    zIndex: { 1: 100 },
  },
  media: {
    sm: { maxWidth: 640 },
    md: { maxWidth: 768 },
    lg: { maxWidth: 1024 },
  },
  settings: {
    // flat ONLY - no classic tamagui style props
    styleMode: 'flat',
  },
})

export type AppConfig = typeof config

declare module '@tamagui/web' {
  interface TamaguiCustomConfig extends AppConfig {}
}
