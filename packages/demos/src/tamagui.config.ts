import { config } from '@tamagui/site-config'

export { config } from '@tamagui/site-config'
export default config

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
