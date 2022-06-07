import { getTokens } from '../conf'
import { SizeTokens, SpaceTokens } from '../types'

export const getSize = (size?: SizeTokens | undefined, shift = 0) => {
  return stepTokenUpOrDown(getTokens().size, size, shift)
}

export const stepTokenUpOrDown = (
  tokens: Object,
  current?: SizeTokens | SpaceTokens | string,
  shift = 0
) => {
  const sizeNames = Object.keys(tokens)
  const currentKeyNum = (typeof current === 'string' ? current.replace('$', '') : current) || '4'
  const nextKeyName = `$${+currentKeyNum + shift}`
  const index = Math.min(sizeNames.length - 1, Math.max(0, sizeNames.indexOf(nextKeyName)))
  const key = sizeNames[index]
  return tokens[key] || tokens['$4']
}
