import { SpaceTokens, getTokens } from '@tamagui/core'

export const getSpace = (token?: SpaceTokens | undefined, sizeUpOrDownBy = 0) => {
  const spaces = getTokens().space
  const spaceNames = Object.keys(spaces)
  const key =
    spaceNames[Math.max(0, spaceNames.indexOf(String(token || '$true')) + sizeUpOrDownBy)]
  return (spaces[key] || spaces['$true']) as SpaceTokens
}
