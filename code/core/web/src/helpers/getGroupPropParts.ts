import { getMedia } from '../hooks/useMedia'

export type GroupParts = { name: string; pseudo?: string; media?: string }

export function getGroupPropParts(groupProp: string): GroupParts {
  const m = getMedia()
  const [_, name, a, b, c] = groupProp.split('-')
  // check 2-part media key first (e.g. "max-md"), then 1-part
  const m2 = a && b ? `${a}-${b}` : ''
  const media = (m2 && m2 in m && m2) || (a && a in m && a) || undefined
  const pseudo = media
    ? media === m2
      ? c
      : b
        ? `${b}${c ? `-${c}` : ''}`
        : undefined
    : a
      ? `${a}${b ? `-${b}` : ''}${c ? `-${c}` : ''}`
      : undefined
  return { name, pseudo, media }
}
