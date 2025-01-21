import { config } from '@tamagui/config/v3'
import { createTamagui } from 'tamagui'

export { config } from '@tamagui/config/v3'

const conf = createTamagui(config)

export default conf

export type Conf = typeof conf

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
