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

const tokenCategoryOrder = ['color', 'space', 'size', 'radius', 'zIndex'] as const

export const findVariableToken = (
  tokensParsed: TokensParsed,
  name: string
): Variable | undefined => {
  let found: Variable | undefined
  let foundCategory: string | undefined
  for (const category of tokenCategoryOrder) {
    const token = tokensParsed[category]?.[name] as Variable | undefined
    if (!token) continue
    if (!found) {
      found = token
      foundCategory = category
      if (process.env.NODE_ENV !== 'development') break
    } else {
      warnOnce(
        `ambiguous:${name}`,
        `Theme inline value: "${name}" exists in multiple token categories; using "${foundCategory}". Rename one of the colliding tokens.`
      )
      break
    }
  }
  return found
}
