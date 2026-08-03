import { createFont, createTamagui, createTokens } from 'tamagui'
import { createNativeBenchConfig } from '../shared/native-tamagui-config'

const tamaguiConfig = createNativeBenchConfig({ createFont, createTamagui, createTokens })

export type Conf = typeof tamaguiConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig
