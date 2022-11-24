import { config } from '@starter/config'

export type Conf = typeof config

declare module '@starter/ui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default config
