import { getTokens } from '@tamagui/core'
import type { SizeTokens, SpaceTokens } from '@tamagui/core'

export const getSize = (size?: SizeTokens | undefined, shift = 0, bounds = [0]) => {
  return stepTokenUpOrDown(getTokens(true).size, size, shift, bounds)
}

const cache = new WeakMap()

export const stepTokenUpOrDown = (
  tokens: Object,
  current?: SizeTokens | SpaceTokens | string,
  shift = 0,
  bounds = [0]
) => {
  if (!cache.has(tokens)) {
    cache.set(tokens, Object.keys(tokens))
  }
  const sizeNames = cache.get(tokens)!
  const currentKey = current || '$true'
  const min = bounds[0] ?? 0
  const max = bounds[1] ?? sizeNames.length - 1
  const currentIndex = sizeNames.indexOf(currentKey)
  const index = Math.min(max, Math.max(min, currentIndex + shift))
  const key = sizeNames[index]
  return tokens[key] || tokens['$true']
}
