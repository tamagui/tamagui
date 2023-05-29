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
  if (!isThemeOrPlatform) {
    if (!enableMediaPropOrder) {
      if (!(prefixes && selectors)) {
        // TODO move this into useMedia calc once there and unify w getMediaImportance
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
    } else {
      if (!selectors) {
        const mediaKeys = Object.keys(mediaQueries)
        selectors = Object.fromEntries(
          mediaKeys.map((key) => [key, mediaObjectToString(mediaQueries[key])])
        )
      }
    }
    const precedencePrefix = enableMediaPropOrder
      ? new Array(priority).fill(':root').join('')
      : // @ts-ignore
        prefixes[mediaKey]
    const mediaSelector = selectors[mediaKey]
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
      styleRule = `@media ${mediaQuery} { ${precedencePrefix} ${styleInner} }`
    }
    return {
      property,
      rules: [styleRule],
      identifier: nextIdentifier,
    }
  } else {
    const precedencePrefix = new Array(priority).fill(':root').join('')
    if (isThemeMedia) {
      mediaKey = mediaKey.replace('theme-', '')
    } else {
      mediaKey = mediaKey.replace('platform-', '')
    }
    const nextIdentifier = `${identifier.replace(
      ogPrefix,
      `${ogPrefix}${MEDIA_SEP}${mediaKey}${negKey}${MEDIA_SEP}`
    )}`
    const styleInner = rules
      .map((rule) => rule.replace(identifier, nextIdentifier))
      .join(';')
    let styleRule
    if (isThemeMedia) {
      styleRule = `${precedencePrefix} .t_${mediaKey} ${styleInner}`
    } else {
      styleRule = `${precedencePrefix} ${styleInner}`
    }
    return {
      property,
      rules: [styleRule],
      identifier: nextIdentifier,
    }
  }
}
