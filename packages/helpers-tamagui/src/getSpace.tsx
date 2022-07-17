import { SpaceTokens, getTokens } from '@tamagui/core'

export const getSpace = (token?: SpaceTokens | undefined, sizeUpOrDownBy = 0) => {
  const spaces = getTokens().space as any as SpaceTokens
  const spaceNames = Object.keys(spaces)
  const key = spaceNames[Math.max(0, spaceNames.indexOf(String(token || '$4')) + sizeUpOrDownBy)]
  return (spaces[key] || spaces['$4']) as SpaceTokens
}
