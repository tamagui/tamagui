import { getConfig } from '../config'

export function getExpandedShorthand(propKey: string, props: object) {
  const shorthands = getConfig().inverseShorthands
  return props[propKey] ?? props[shorthands[propKey]]
}
