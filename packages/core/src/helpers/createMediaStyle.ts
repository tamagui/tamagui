import { StyleObject } from '@tamagui/helpers'

import { mediaObjectToString } from '../hooks/useMedia'
import { MediaQueries } from '../types'
import { PartialStyleObject } from './insertStyleRule'

// TODO have this be used by extractMediaStyle in tamagui static
// not synced to static/constants for now
export const MEDIA_SEP = '_'

let prefixes: Record<string, string> | null = null
let selectors: Record<string, string> | null = null

export const createMediaStyle = (
  { property, identifier, rules }: StyleObject,
  mediaKey: string,
  mediaQueries: MediaQueries,
  negate?: boolean
): PartialStyleObject => {
  if (!(prefixes && selectors)) {
    // TODO move this into useMedia calc once there and unify w getMediaImportance
    const mediaKeys = Object.keys(mediaQueries)
    prefixes = Object.fromEntries(
      mediaKeys.map((key, index) => [key, new Array(index + 1).fill(':root').join('')])
    )
    selectors = Object.fromEntries(
      mediaKeys.map((key) => [key, mediaObjectToString(mediaQueries[key])])
    )
  }
  const precendencePrefix = prefixes[mediaKey]
  const mediaSelector = selectors[mediaKey]
  const negKey = negate ? '0' : ''
  const ogPrefix = identifier.slice(0, identifier.indexOf('-') + 1)
  const nextIdentifier = `${identifier.replace(
    ogPrefix,
    `${ogPrefix}${MEDIA_SEP}${mediaKey}${negKey}${MEDIA_SEP}`
  )}`
  const screenStr = negate ? 'not all and' : ''
  const mediaQuery = `${screenStr} ${mediaSelector}`
  const styleInner = rules
    .map((rule) => rule.replace(identifier, nextIdentifier))
    .join(';')
  // combines media queries if they already exist
  let styleRule = ''
  if (styleInner.includes('@media')) {
    // combine
    styleRule = styleInner.replace('{', ` and ${mediaQuery} {`)
  } else {
    styleRule = `@media ${mediaQuery} { ${precendencePrefix} ${styleInner} }`
  }
  return {
    property,
    rules: [styleRule],
    identifier: nextIdentifier,
  }
}
