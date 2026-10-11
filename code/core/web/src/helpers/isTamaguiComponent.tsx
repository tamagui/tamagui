import type { StaticConfig } from '../types'

export function isTamaguiComponent<A>(comp: A): comp is A & {
  staticConfig: StaticConfig
} {
  const config = comp?.['staticConfig'] as StaticConfig | undefined
  return Boolean(config)
}
