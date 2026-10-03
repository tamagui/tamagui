import { createTamagui } from '@tamagui/core'
export default createTamagui({
  themes: process.env.TAMAGUI_ENVIRONMENT === 'client' ? {} : {
    light: { background: '#ffffff', color: '#000000' },
    dark: { background: '#111111', color: '#eeeeee' },
  },
  tokens: { color: {}, radius: {}, size: {}, space: {}, zIndex: {} },
  media: {}, shorthands: {},
})
