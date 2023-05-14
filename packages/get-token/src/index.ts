import type { SizeTokens, SpaceTokens, Variable } from '@tamagui/web'
import { getTokens, tokensKeysOrdered } from '@tamagui/web'

export const getSize = (size?: SizeTokens | undefined, shift = 0, bounds = [0]) => {
  return getTokenRelative('size', size, shift, bounds)
}

export const getSpace = (space?: SpaceTokens | undefined, shift = 0, bounds = [0]) => {
  return getTokenRelative('space', space, shift, bounds)
}

const cache: Record<string, string[]> = {}

/** @deprecated use getSize, getSpace, or getTokenRelative instead */
export const stepTokenUpOrDown = (
  type: 'size' | 'space' | 'zIndex' | 'radius',
  name: SizeTokens | SpaceTokens | string = '$true',
  shift = 0,
  bounds = [0]
): Variable<number> => {
  const tokens = getTokens({ prefixed: true })[type]

  const keysOrdered = (cache[type] ??= (() => {
    const maybeTokenizedKeysOrdered = tokensKeysOrdered.get(tokens) || Object.keys(tokens)
    return maybeTokenizedKeysOrdered.map((maybeTokenizedKey) =>
      maybeTokenizedKey.charAt(0) === '$' ? maybeTokenizedKey : `$${maybeTokenizedKey}`
    )
  })())

  const min = bounds[0] ?? 0
  const max = bounds[1] ?? keysOrdered.length - 1
  const currentIndex = keysOrdered.indexOf(name as string)
  if (name === '$true') {
    shift += shift === 0 ? 0 : shift > 0 ? 1 : -1
  }
  const index = Math.min(max, Math.max(min, currentIndex + shift))
  const key = keysOrdered[index]
  // @ts-ignore
  return tokens[key] || tokens['$true']
}

export const getTokenRelative = stepTokenUpOrDown
