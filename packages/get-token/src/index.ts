import type { Variable } from '@tamagui/web'
import { getTokens } from '@tamagui/web'

type GetTokenOptions = {
  shift?: number
  bounds?: [number] | [number, number]
}

const defaultOptions: GetTokenOptions = {
  shift: 0,
  bounds: [0],
}

export const getSize = (size: Variable, options?: GetTokenOptions) => {
  return getTokenRelative('size', size, options)
}

export const getSpace = (space: Variable, options?: GetTokenOptions) => {
  return getTokenRelative('space', space, options)
}

const cache: Record<string, Variable[]> = {}

/** @deprecated use getSize, getSpace, or getTokenRelative instead */
export const stepTokenUpOrDown = (
  type: 'size' | 'space' | 'zIndex' | 'radius',
  token: Variable,
  options: GetTokenOptions = defaultOptions
): Variable<number> => {
  const tokens = getTokens({ prefixed: true })[type]
  const tokensOrdered = (cache[type] ??= Object.values(tokens) as any)

  const min = options.bounds?.[0] ?? 0
  const max = options.bounds?.[1] ?? tokensOrdered.length - 1
  const currentIndex = tokensOrdered.indexOf(token)
  let shift = options.shift || 0
  if (token.name === '$true') {
    shift = !shift ? 0 : shift > 0 ? 1 : -1
  }
  const index = Math.min(max, Math.max(min, currentIndex + shift))
  const key = tokensOrdered[index]
  // @ts-ignore
  return tokens[key] || tokens['$true']
}

export const getTokenRelative = stepTokenUpOrDown
