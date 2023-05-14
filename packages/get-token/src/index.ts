import type { Variable } from '@tamagui/web'
import { getTokens } from '@tamagui/web'

export const getSize = (size: Variable, shift = 0, bounds = [0]) => {
  return getTokenRelative('size', size, shift, bounds)
}

export const getSpace = (space: Variable, shift = 0, bounds = [0]) => {
  return getTokenRelative('space', space, shift, bounds)
}

const cache: Record<string, Variable[]> = {}

/** @deprecated use getSize, getSpace, or getTokenRelative instead */
export const stepTokenUpOrDown = (
  type: 'size' | 'space' | 'zIndex' | 'radius',
  token: Variable,
  shift = 0,
  bounds = [0]
): Variable<number> => {
  const tokens = getTokens({ prefixed: true })[type]
  const tokensOrdered = (cache[type] ??= Object.values(tokens) as any)

  const min = bounds[0] ?? 0
  const max = bounds[1] ?? tokensOrdered.length - 1
  const currentIndex = tokensOrdered.indexOf(token)
  if (token.name === '$true') {
    shift += shift === 0 ? 0 : shift > 0 ? 1 : -1
  }
  const index = Math.min(max, Math.max(min, currentIndex + shift))
  const key = tokensOrdered[index]
  // @ts-ignore
  return tokens[key] || tokens['$true']
}

export const getTokenRelative = stepTokenUpOrDown
