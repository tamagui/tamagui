import type { TokensParsed, Variable } from '../types'
import { warnOnce } from './warnOnce'

const unitlessSuffixes = [
  'opacity',
  'scale',
  'zindex',
  'weight',
  'flex',
  'grow',
  'shrink',
  'ratio',
  'elevation',
]

export const isUnitlessVariableKey = (key: string): boolean => {
  const lower = key.toLowerCase()
  return unitlessSuffixes.some((suffix) => lower.endsWith(suffix))
}

// token names are flat and globally unique, so a theme inline value is one lookup
export const findVariableToken = (
  tokensParsed: TokensParsed,
  name: string
): Variable | undefined => tokensParsed[name] as Variable | undefined
