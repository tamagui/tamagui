import { config } from '@tamagui/config'
import { Longhands, createFont, createTamagui } from 'tamagui'

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

config.themes['light_green_Button'] = {
  ...config.themes['light_green_Button'],
  background: 'green',
}

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

export type Conf = typeof tamaConf

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaConf
