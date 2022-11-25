import { config } from '@bench/config'

export type Conf = typeof config

declare module '@bench/ui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default config
