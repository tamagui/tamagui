import { config } from '@tamagui/config'
import { createTamagui } from 'tamagui'

// custom themes test
config.themes.light_green_Button = {
  ...config.themes.light_green_Button,
  background: 'rgb(255,0,0)',
}

const tamaConf = createTamagui(config)

export type Conf = typeof tamaConf

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaConf
