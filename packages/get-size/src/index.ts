import { Variable, getTokens } from '@tamagui/core'
import type { SizeTokens, SpaceTokens } from '@tamagui/core'

type GenericTokens = Record<string, Variable<any>>

export const getSize = (size?: SizeTokens | undefined, shift = 0, bounds = [0]) => {
  console.log(
    'getting size',
    size,
    stepTokenUpOrDown(getTokens(true).size, size, shift, bounds)
  )
  return stepTokenUpOrDown(getTokens(true).size as GenericTokens, size, shift, bounds)
}

const cache = new WeakMap()

export const stepTokenUpOrDown = (
  tokens: GenericTokens,
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
