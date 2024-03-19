// this allows us to swap between core native and web in the same process:

import type { TamaguiPlatform } from '../types'

export function requireTamaguiCore(
  platform: TamaguiPlatform,
  ogRequire: Function = require
): typeof import('@tamagui/core') {
  if (!platform) {
    throw new Error(`No platform given to requireTamaguiCore`)
  }
  return ogRequire(platform === 'native' ? '@tamagui/core/native' : '@tamagui/core')
}
