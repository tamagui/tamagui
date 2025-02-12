import { isAbsolute, join } from 'node:path'

import { statSync } from 'node:fs'
import type { TamaguiOptions } from '../types'

export function getTamaguiConfigPathFromOptionsConfig(
  config: NonNullable<TamaguiOptions['config']>
) {
  if (isAbsolute(config)) {
    return config
  }

  const fullPath = join(process.cwd(), config)

  try {
    if (statSync(fullPath).isFile()) {
      return fullPath
    }
  } catch {
    //
  }

  return config
}
