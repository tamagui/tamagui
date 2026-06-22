import { getMedia } from './mediaState'
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

// cache of parsed group prop names. group prop strings are finite (~dozens per
// app) and the parse does split/regex/in-checks against getMedia on every call,
// which shows up as the dominant `before-prop-$group-*` span on Hermes. cache
// is keyed on the input string and invalidated by `resetGroupPropPartsCache()`
// from configureMedia when the media map changes.
let cache = new Map<string, GroupParts>()

export function resetGroupPropPartsCache() {
  cache = new Map()
}

export function getGroupPropParts(groupProp: string): GroupParts {
  const cached = cache.get(groupProp)
  if (cached !== undefined) return cached
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

  const result: GroupParts = { name, pseudo: pseudoCandidate, media }
  cache.set(groupProp, result)
  return result
}
