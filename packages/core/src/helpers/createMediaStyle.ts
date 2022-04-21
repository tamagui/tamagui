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
  importance?: number
) => {
  const mediaKeys = Object.keys(mediaQueries)
  const importance_ = Math.max(
    0,
    importance == undefined ? mediaKeys.indexOf(mediaKey) : importance || 0
  )
  const precendencePrefix = new Array(importance_ + 1).fill(':root').join('')
  const negKey = negate ? '0' : ''
  const ogPrefix = identifier.slice(0, identifier.indexOf('-') + 1)
  const nextIdentifier = `${identifier.replace(
    ogPrefix,
    `${ogPrefix}${MEDIA_SEP}${mediaKey}${negKey}${MEDIA_SEP}`
  )}`
  const screenStr = negate ? 'not all' : 'screen'
  const mediaSelector = mediaObjectToString(mediaQueries[mediaKey])
  const mediaQuery = `${screenStr} and ${mediaSelector}`
  const styleInner = rules[0].replace(identifier, nextIdentifier)
  if (styleInner.includes('2:r;')) debugger
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
