import { createAnimations } from '@tamagui/animations-css'
import { createTamagui } from 'tamagui'

const animations = createAnimations({
  bouncy: '350ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
})

export default createTamagui({
  animations,
  themes: {
    light: {
      background: '#fff',
      color: '#000',
    },
  },
  tokens: {
    color: {},
    radius: {},
    size: {},
    space: {},
    zIndex: {},
  },
  media: {},
  shorthands: {},
})
