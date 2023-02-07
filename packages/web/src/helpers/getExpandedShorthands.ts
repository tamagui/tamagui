import { getConfig } from '../config'
import { Shorthands } from '../types'

export function getExpandedShorthands<A extends Object>(
  props: A
): Omit<A, keyof Shorthands> {
  const shorthands = getConfig().shorthands
  if (!shorthands) {
    return props
  }
  const res: A = {} as any
  for (const key in props) {
    // @ts-ignore
    res[shorthands[key] || key] = props[key]
  }
  return res
}
