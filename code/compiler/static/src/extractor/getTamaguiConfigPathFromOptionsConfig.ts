import { createRequire } from 'node:module'
import { statSync } from 'node:fs'
import { isAbsolute, join, resolve } from 'node:path'
import type { TamaguiOptions } from '../types'

export function getTamaguiConfigPathFromOptionsConfig(
  config: NonNullable<TamaguiOptions['config']>,
  root = process.cwd()
) {
  if (isAbsolute(config)) {
    return config
  }

  const fullPath = join(root, config)

  try {
    if (statSync(fullPath).isFile()) {
      return fullPath
    }
  } catch {
    //
  }

  try {
    const customRequire = createRequire(join(root, 'package.json'))
    return customRequire.resolve(config)
  } catch {
    //
  }

  return resolve(config)
}
