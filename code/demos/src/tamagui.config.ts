import { config } from '@tamagui/config/v3'
import { createTamagui } from '@tamagui/web'

export { config } from '@tamagui/config/v3'
export default config

const createdConfig = createTamagui(config)
export type Conf = typeof createdConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
