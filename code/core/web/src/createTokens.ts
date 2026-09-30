import { isWeb } from '@tamagui/constants'
import { createVariable, isVariable } from './createVariable'
import type { CreateTokens, Variable, VariableVal } from './types'

/**
 * Tokens are flat and mirror css custom properties: `space-1`, `radius-sm`,
 * `color-red`. The leading segment is the category, which is how a style prop
 * finds its default token: `borderRadius="sm"` resolves `radius-sm`, because
 * borderRadius maps to the radius category. Any other name resolves literally,
 * so `borderRadius="brand-card"` just works with no category registration.
 */
export function createTokens<T extends CreateTokens>(tokens: T): MakeTokens<T> {
  if (process.env.NODE_ENV !== 'production') {
    validateTokens(tokens)
  }
  return createTokenVariables(tokens) as any
}

/**
 * The css variable name for a token. Colors get the short `--c-` prefix because
 * they are by far the most numerous; everything else is `--t-`.
 */
export function tokenVariableName(key: string) {
  return key.startsWith('color-') ? `c-${key.slice(6)}` : `t-${key}`
}

const cache = new WeakMap<object, Record<string, Variable>>()

export function createTokenVariables(
  tokens: Record<string, VariableVal | Variable>
): Record<string, Variable> {
  const cached = cache.get(tokens)
  if (cached) return cached

  const res: Record<string, Variable> = {}
  for (const key in tokens) {
    const val = tokens[key] as any

    if (isVariable(val)) {
      res[key] = val
      continue
    }

    const name = tokenVariableName(key)

    // px() helper objects
    if (val && typeof val === 'object' && 'needsPx' in val && 'val' in val) {
      const variable = createVariable({ val: val.val, name, key })
      // only web keeps the px unit
      if (isWeb) {
        variable.needsPx = val.needsPx
      }
      res[key] = variable
      continue
    }

    res[key] = createVariable({ val, name, key })
  }

  cache.set(tokens, res)
  return res
}

function validateTokens(tokens: CreateTokens) {
  for (const key in tokens) {
    const val = tokens[key] as any

    if (val && typeof val === 'object' && !isVariable(val) && !('val' in val)) {
      throw new Error(
        `tokens.${key} is a nested group. Tokens are flat in v3: write \`'${key}-sm': 4\` instead of \`${key}: { sm: 4 }\`.`
      )
    }

    if (key.endsWith('-true') || key === 'true') {
      throw new Error(
        `tokens.${key} is reserved because boolean values select component defaults. Use an explicit token name instead.`
      )
    }
  }
}

type MakeTokens<T extends CreateTokens> = {
  [Key in keyof T as Key extends number ? `${Key}` : Key]: Variable<T[Key]>
}

const categoryCache = new WeakMap<object, Record<string, Record<string, Variable>>>()

/**
 * The tokens in one category, keyed without the prefix. For the few places that
 * genuinely iterate a single category: the font-size fallback, the config
 * revision snapshot, and css variable output.
 */
export function getTokensInCategory(
  tokens: Record<string, Variable>,
  category: string
): Record<string, Variable> {
  let byCategory = categoryCache.get(tokens)
  if (!byCategory) categoryCache.set(tokens, (byCategory = {}))
  const cached = byCategory[category]
  if (cached) return cached
  const found: Record<string, Variable> = (byCategory[category] = {})
  const prefix = `${category}-`
  for (const key in tokens) {
    if (key.startsWith(prefix)) found[key.slice(prefix.length)] = tokens[key]
  }
  return found
}

/**
 * Prefixes a scale into flat token names: `prefixTokens('space', { 1: 4 })` gives
 * `{ 'space-1': 4 }`. The inverse of `getTokensInCategory`, for composing a flat
 * token record out of a scale you already have.
 */
export type PrefixedTokens<Prefix extends string, Scale> = {
  [Key in keyof Scale & string as `${Prefix}-${Key}`]: Scale[Key]
}

export function prefixTokens<Prefix extends string, Scale extends Record<string, any>>(
  prefix: Prefix,
  scale: Scale
): PrefixedTokens<Prefix, Scale> {
  const res: any = {}
  for (const key in scale) {
    res[`${prefix}-${key}`] = scale[key]
  }
  return res
}
