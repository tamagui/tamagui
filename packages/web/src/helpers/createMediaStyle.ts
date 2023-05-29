import { getConfig } from '../config'
import { mediaObjectToString } from '../hooks/useMedia'
import type { MediaQueries, MediaStyleObject, StyleObject } from '../types'

// TODO have this be used by extractMediaStyle in tamagui static
// not synced to static/constants for now
export const MEDIA_SEP = '_'

let prefixes: Record<string, string> | null = null
let selectors: Record<string, string> | null = null

export const createMediaStyle = (
  { property, identifier, rules }: StyleObject,
  mediaKey: string,
  mediaQueries: MediaQueries,
  negate?: boolean,
  priority?: number
): MediaStyleObject => {
  const enableMediaPropOrder = getConfig().enableMediaPropOrder
  const isThemeMedia = mediaKey.startsWith('theme-')
  const isPlatformMedia = mediaKey.startsWith('platform-')
  const isThemeOrPlatform = isThemeMedia || isPlatformMedia
  const negKey = negate ? '0' : ''
  const ogPrefix = identifier.slice(0, identifier.indexOf('-') + 1)

  let styleRule: string

  const key = isThemeOrPlatform ? mediaKey.split('-')[1] : mediaKey
  const nextIdentifier = `${identifier.replace(
    ogPrefix,
    `${ogPrefix}${MEDIA_SEP}${key}${negKey}${MEDIA_SEP}`
  )}`

  if (isThemeOrPlatform) {
    const precedencePrefix = new Array(priority).fill(':root').join('')
    const styleInner = rules
      .map((rule) => rule.replace(identifier, nextIdentifier))
      .join(';')

    if (isThemeMedia) {
      styleRule = `${precedencePrefix} .t_${key} ${styleInner}`
    } else {
      styleRule = `${precedencePrefix} ${styleInner}`
    }
  } else {
    if (!selectors) {
      if (enableMediaPropOrder) {
        const mediaKeys = Object.keys(mediaQueries)
        selectors = Object.fromEntries(
          mediaKeys.map((key) => [key, mediaObjectToString(mediaQueries[key])])
        )
      } else {
        const mediaKeys = Object.keys(mediaQueries)
        prefixes = Object.fromEntries(
          mediaKeys.map((key, index) => [
            key,
            new Array(index + 1).fill(':root').join(''),
          ])
        )
        selectors = Object.fromEntries(
          mediaKeys.map((key) => [key, mediaObjectToString(mediaQueries[key])])
        )
      }
    }

    const precedencePrefix = enableMediaPropOrder
      ? // this new array should be cached
        new Array(priority).fill(':root').join('')
      : // @ts-ignore
        prefixes[mediaKey]

    const mediaSelector = selectors[mediaKey]
    const screenStr = negate ? 'not all and' : ''
    const mediaQuery = `${screenStr} ${mediaSelector}`
    const styleInner = rules
      .map((rule) => rule.replace(identifier, nextIdentifier))
      .join(';')
    // combines media queries if they already exist

    if (styleInner.includes('@media')) {
      // combine
      styleRule = styleInner.replace('{', ` and ${mediaQuery} {`)
    } else {
      styleRule = `@media ${mediaQuery} { ${precedencePrefix} ${styleInner} }`
    }
  }

  return {
    property,
    rules: [styleRule],
    identifier: nextIdentifier,
  }
}
