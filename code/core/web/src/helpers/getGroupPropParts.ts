import { getMedia } from '../hooks/useMedia'
import { pseudoPriorities } from './pseudoDescriptors'

export type GroupParts = { name: string; pseudo?: string; media?: string }

// convert kebab-case to camelCase (e.g. "focus-visible" -> "focusVisible")
function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

// validate that a string is a known pseudo selector
function isValidPseudo(str: string | undefined): str is string {
  if (!str) return false
  // pseudoPriorities uses camelCase keys, but parsed candidates may be kebab-case
  return kebabToCamel(str) in pseudoPriorities
}

export function getGroupPropParts(groupProp: string): GroupParts {
  const m = getMedia()
  const [_, name, a, b, c] = groupProp.split('-')
  // check 2-part media key first (e.g. "max-md"), then 1-part
  const m2 = a && b ? `${a}-${b}` : ''
  const media = (m2 && m2 in m && m2) || (a && a in m && a) || undefined
  let pseudoCandidate = media
    ? media === m2
      ? c
      : b
        ? `${b}${c ? `-${c}` : ''}`
        : undefined
    : a
      ? `${a}${b ? `-${b}` : ''}${c ? `-${c}` : ''}`
      : undefined

  // only treat as pseudo if it's a known pseudo selector
  // otherwise it might be an unrecognized media query
  if (pseudoCandidate && !isValidPseudo(pseudoCandidate)) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `Unknown group prop part "${pseudoCandidate}" in "${groupProp}". If this is a media query, ensure it's defined in your tamagui config.`
      )
    }
    pseudoCandidate = undefined
  }

  return { name, pseudo: pseudoCandidate, media }
}
