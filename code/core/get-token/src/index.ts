import type { Variable, VariableValGeneric } from '@tamagui/web'
import { resolveSize } from '@tamagui/size'
import { getConfig, getTokens } from '@tamagui/web'

// technically number | undefined just for compat with the generic VariableVal
type GetTokenBase = Variable | string | number | boolean | undefined | VariableValGeneric

// same-key token resolver: token in, Variable out. `true` and a named size
// read the size recipe (its control height, horizontal padding, or radius);
// numbers and unknown keys pass through unchanged.
const resolveToken = (
  type: 'size' | 'space' | 'radius',
  input: GetTokenBase
): Variable<number> => {
  if (input == null || typeof input === 'number') return input as any
  const tokens = getTokens()[type] as Record<string, Variable>
  const key = typeof input === 'object' ? (input as Variable).key : String(input)
  if (input === true || getConfig().sizes?.[key] != null) {
    const resolved = resolveSize(input as any)
    if (type === 'size') return resolved.controlHeight as any
    return (
      type === 'space' ? resolved.frame.paddingHorizontal : resolved.frame.borderRadius
    ) as any
  }
  return (tokens[key] ?? input) as any
}

export const getSize = (size: GetTokenBase) => resolveToken('size', size)

export const getSpace = (space: GetTokenBase) => resolveToken('space', space)

export const getRadius = (radius: GetTokenBase) => resolveToken('radius', radius)
