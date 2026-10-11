import type { Variable, VariableValGeneric } from '@tamagui/web'
import { getTokens } from '@tamagui/web'

// technically number | undefined just for compat with the generic VariableVal
type GetTokenBase = Variable | string | number | boolean | undefined | VariableValGeneric

// same-key token resolver: token in, Variable out. Numbers and unknown keys
// (including booleans) pass through unchanged.
const resolveToken = (
  type: 'size' | 'space' | 'radius',
  input: GetTokenBase
): Variable<number> => {
  if (input == null || typeof input === 'number' || typeof input === 'boolean')
    return input as any
  const tokens = getTokens()[type] as Record<string, Variable>
  const key = typeof input === 'object' ? (input as Variable).key : String(input)
  return (tokens[key] ?? input) as any
}

export const getSize = (size: GetTokenBase) => resolveToken('size', size)

export const getSpace = (space: GetTokenBase) => resolveToken('space', space)

export const getRadius = (radius: GetTokenBase) => resolveToken('radius', radius)
