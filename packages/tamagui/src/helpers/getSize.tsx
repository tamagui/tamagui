import { SizeTokens, getTokens } from '@tamagui/core'

export const getSize = (size?: SizeTokens | undefined, sizeUpOrDownBy = 0) => {
  // TODO type
  const sizes = getTokens().size as any as SizeTokens
  const sizeNames = Object.keys(sizes)
  const key = sizeNames[Math.max(0, sizeNames.indexOf(String(size || '$4')) + sizeUpOrDownBy)]
  return (sizes[key] || sizes['$4']) as SizeTokens
}
