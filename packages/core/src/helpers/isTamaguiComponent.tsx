import { StaticConfig, StaticConfigParsed } from '../types'

export function isTamaguiComponent<A>(
  comp: A,
  name?: string
): comp is A & {
  staticConfig: StaticConfig
} {
  const config = comp?.['staticConfig'] as StaticConfigParsed | undefined
  return (config?.parsed && (name ? name === config.componentName : true)) || false
}
