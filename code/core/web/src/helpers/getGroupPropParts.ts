import { getMedia } from '../hooks/useMedia'

export function getGroupPropParts(groupProp: string) {
  const mediaQueries = getMedia()
  const [_, name, part3, part4] = groupProp.split('-')
  let pseudo: string | undefined
  const media = part3 in mediaQueries ? part3 : undefined
  if (!media) {
    pseudo = part3
  } else {
    pseudo = part4
  }
  return { name, pseudo, media }
}
