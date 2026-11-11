// this allows us to swap between core native and web in the same process:

import type { TamaguiPlatform } from '../types'
import { writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const nodeRequire = createRequire(
  typeof __filename === 'string' ? __filename : import.meta.url
)

function getTamaguiCoreSpecifier(platform: TamaguiPlatform) {
  if (!platform) {
    throw new Error(`No platform given to requireTamaguiCore`)
  }
  return platform === 'native' ? '@tamagui/core/native' : '@tamagui/core'
}

// avoid tree shaking out themes; returns restore
function enterTamaguiCoreEnv() {
  const og1 = process.env.TAMAGUI_IS_SERVER
  const og2 = process.env.TAMAGUI_KEEP_THEMES
  process.env.TAMAGUI_IS_SERVER ||= '1'
  process.env.TAMAGUI_KEEP_THEMES ||= '1'
  return () => {
    process.env.TAMAGUI_IS_SERVER = og1
    process.env.TAMAGUI_KEEP_THEMES = og2
  }
}

export function requireTamaguiCore(
  platform: TamaguiPlatform,
  ogRequire: Function = nodeRequire
): typeof import('@tamagui/core') {
  const specifier = getTamaguiCoreSpecifier(platform)
  const restore = enterTamaguiCoreEnv()
  const exported = ogRequire(specifier)
  restore()
  return exported
}

/**
 * ESM build of @tamagui/core, resolved as an ESM bundle in `dir` resolves it.
 * A separate instance from `requireTamaguiCore`'s CJS build.
 */
export async function importTamaguiCoreFrom(
  dir: string,
  platform: TamaguiPlatform
): Promise<typeof import('@tamagui/core')> {
  const specifier = getTamaguiCoreSpecifier(platform)
  const entry = join(dir, `tamagui-core.${platform}.mjs`)
  writeFileSync(entry, `export * from '${specifier}'\n`)
  const restore = enterTamaguiCoreEnv()
  try {
    return await import(pathToFileURL(entry).href)
  } finally {
    restore()
  }
}
