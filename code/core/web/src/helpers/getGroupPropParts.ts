import { getMedia } from '../hooks/useMedia'

export type GroupParts = { name: string; pseudo?: string; media?: string }

export function getGroupPropParts(groupProp: string): GroupParts {
  const mediaQueries = getMedia()
  const [_, name, part3, part4] = groupProp.split('-')
  let pseudo: 'focus' | 'press' | 'hover' | 'disabled' | undefined
  const media = part3 in mediaQueries ? part3 : undefined
  if (!media) {
    pseudo = part3 as any
  } else {
    pseudo = part4 as any
  }
  return { name, pseudo, media }
}
