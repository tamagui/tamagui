import { config } from '@tamagui/config'
import { createFont, createTamagui } from 'tamagui'

const body_cn = createFont({
  family: 'noto_cn',
  letterSpacing: {
    1: 10,
  },
  lineHeight: {},
  size: config.fonts.body.size,
  weight: {
    4: 800,
  },
  color: {
    4: 'red',
  },
  style: {},
  transform: {},
})

const { shorthands, ...configRest } = config

const tamaConf = createTamagui({
  ...configRest,
  fonts: {
    ...configRest.fonts,
    body_cn,
    alternative: body_cn,
  },
  themeClassNameOnRoot: false,

  // test out type narrowing
  shorthands: {
    ...shorthands,
    b2b2: 'backgroundColor',
  },
})

type test = Conf['shorthands']['b2b2']

export type Conf = typeof tamaConf

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaConf
