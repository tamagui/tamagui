import { SpaceTokens, getTokens } from '@tamagui/core'

export const getSpace = (size?: SpaceTokens | undefined, sizeUpOrDownBy = 0) => {
  // TODO type
  const spaces = getTokens().size as any as SpaceTokens
  const spaceNames = Object.keys(spaces)
  const key = spaceNames[Math.max(0, spaceNames.indexOf(String(size || '$4')) + sizeUpOrDownBy)]
  return (spaces[key] || spaces['$4']) as SpaceTokens
}
