import { getTokens } from '../config'
import { SizeTokens, SpaceTokens } from '../types'

export const getSize = (size?: SizeTokens | undefined, shift = 0, bounds = [0]) => {
  return stepTokenUpOrDown(getTokens().size, size, shift, bounds)
}

export const stepTokenUpOrDown = (
  tokens: Object,
  current?: SizeTokens | SpaceTokens | string,
  shift = 0,
  bounds = [0]
) => {
  const sizeNames = Object.keys(tokens)
  const currentKeyNum = (typeof current === 'string' ? current.replace('$', '') : current) || '4'
  const nextKeyName = `$${+currentKeyNum + shift}`
  const min = bounds[0] ?? 0
  const max = bounds[1] ?? sizeNames.length - 1
  const index = Math.min(max, Math.max(min, sizeNames.indexOf(nextKeyName)))
  const key = sizeNames[index]
  return tokens[key] || tokens['$4']
}
