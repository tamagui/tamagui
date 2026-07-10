import type { Variable, VariableValGeneric } from '@tamagui/web'
import { getDefaultSizeToken, getTokens } from '@tamagui/web'

// technically number | undefined just for compat with the generic VariableVal
type GetTokenBase = Variable | string | number | boolean | undefined | VariableValGeneric

// trivial same-key token resolver: token in, Variable out.
// resolves `true` to the config's default size token, looks the key up in the
// requested scale, and passes through numbers / unknown keys unchanged.
const resolveToken = (
  type: 'size' | 'space' | 'radius',
  input: GetTokenBase
): Variable<number> => {
  const tokens = getTokens({ prefixed: true })[type] as Record<string, Variable>
  const resolved = input === true ? getDefaultSizeToken() : input
  if (resolved == null) return resolved as any
  const key = typeof resolved === 'object' ? (resolved as Variable).key : String(resolved)
  return (tokens[key] ?? resolved) as any
}

export const getSize = (size: GetTokenBase) => resolveToken('size', size)

export const getSpace = (space: GetTokenBase) => resolveToken('space', space)

export const getRadius = (radius: GetTokenBase) => resolveToken('radius', radius)

// returns the token key one whole step smaller (e.g. `$4` -> `$3`), clamped at
// `$1`. used where a component wants a slightly smaller size/font token (list
// item subtitle, tooltip default size) without stepping through a sorted scale.
export const oneSizeTokenSmaller = (token: GetTokenBase): string => {
  const key = token === true ? getDefaultSizeToken() : token
  const n = Number(String(key).replace('$', ''))
  if (Number.isNaN(n)) return String(key)
  return `$${Math.max(1, Math.round(n) - 1)}`
}
