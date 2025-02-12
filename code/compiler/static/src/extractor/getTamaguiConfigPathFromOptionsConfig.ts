import { isAbsolute, join, resolve } from 'node:path'

import type { TamaguiOptions } from '../types'

export function getTamaguiConfigPathFromOptionsConfig(
  config: NonNullable<TamaguiOptions['config']>
) {
  if (isAbsolute(config)) {
    return config
  }

  return require.resolve(config)
}
