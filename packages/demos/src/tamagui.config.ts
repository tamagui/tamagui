import { config } from '@tamagui/config'

export { config } from '@tamagui/config'
export default config

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
