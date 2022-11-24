import { config } from '@my/config'

export type Conf = typeof config

declare module '@bench/ui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default config
