import { StyleObject } from '@tamagui/helpers'

import { mediaObjectToString } from '../hooks/useMedia'
import { MediaQueries } from '../types'

// TODO have this be used by extractMediaStyle in tamagui static

// not synced to static/constants for now
export const MEDIA_SEP = '_'

export const createMediaStyle = (
  { identifier, rules }: StyleObject,
  mediaKey: string,
  mediaQueries: MediaQueries,
  negate?: boolean,
  importance = 0
) => {
  const mediaKeys = Object.keys(mediaQueries)
  const mediaKeyPrecendence = mediaKeys.reduce((acc, cur, i) => {
    acc[cur] = new Array(importance + 1).fill(':root').join('')
    return acc
  }, {})
  const negKey = negate ? '0' : ''
  const ogPrefix = identifier.slice(0, identifier.indexOf('-') + 1)
  const nextIdentifier = `${identifier.replace(
    ogPrefix,
    `${ogPrefix}${MEDIA_SEP}${mediaKey}${negKey}${MEDIA_SEP}`
  )}`
  const screenStr = negate ? 'not all' : 'screen'
  const mediaSelector = mediaObjectToString(mediaQueries[mediaKey])
  const mediaQuery = `${screenStr} and ${mediaSelector}`
  const precendencePrefix = mediaKeyPrecendence[mediaKey]
  const styleInner = rules[0].replace(identifier, nextIdentifier)
  // combines media queries if they already exist
  let styleRule = ''
  if (styleInner.includes('@media')) {
    // combine
    styleRule = styleInner.replace('{', ` and ${mediaQuery} {`)
  } else {
    styleRule = `@media ${mediaQuery} { ${precendencePrefix} ${styleInner} }`
  }
  return {
    styleRule,
    identifier: nextIdentifier,
  }
}
