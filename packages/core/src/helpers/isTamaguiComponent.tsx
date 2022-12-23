import { StaticConfig, StaticConfigParsed } from '../types'

export function isTamaguiComponent<A>(
  comp: A,
  name?: string
): comp is A & {
  staticConfig: StaticConfig
} {
  const config = comp && (comp['staticConfig'] as StaticConfigParsed | undefined)
  if (!config?.parsed) return false
  if (name) {
    return name === config.componentName
  }
  return true
}
