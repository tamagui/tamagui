import type { TamaguiInternalConfig } from './types'

let hasLogged = false

export function loadDuplicatedConfig(): TamaguiInternalConfig | null {
  if (process.env.NODE_ENV !== 'production') {
    if (globalThis.__tamaguiConfig) {
      hasLogged = true
      if (!hasLogged) {
        console.warn(
          `Warning: You have duplicate Tamagui dependencies which can cause major, confusing issues.
    In dev/test, we're working around this by loading a previously loaded config.
    In production, this will error.`
        )
      }
      return globalThis.__tamaguiConfig
    }
  }
  return null
}
