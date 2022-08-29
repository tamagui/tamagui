import { config } from '@tamagui/config-base'
import { Longhands, createFont, createTamagui } from 'tamagui'

type x = Longhands

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

const tamaConf = createTamagui({
  ...config,
  fonts: {
    ...config.fonts,
    body_cn,
    alternative: body_cn,
  },
  themeClassNameOnRoot: false,
  onlyAllowShorthands: true,
})

export type Conf = typeof tamaConf

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaConf
