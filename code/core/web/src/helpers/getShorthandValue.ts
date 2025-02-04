import { getConfig } from '../config'
import type { GenericShorthands } from '../types'

let inverseShorthands: GenericShorthands | null = null

export const getShorthandValue = (props: Record<string, any>, key: string) => {
  inverseShorthands ||= getConfig().inverseShorthands
  return props[key] ?? (inverseShorthands ? props[inverseShorthands[key]] : undefined)
}
