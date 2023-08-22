import { getConfig } from '../config'
import { mediaObjectToString } from '../hooks/useMedia'
import type { MediaQueries, MediaStyleObject, StyleObject } from '../types'

// TODO have this be used by extractMediaStyle in tamagui static
// not synced to static/constants for now
export const MEDIA_SEP = '_'

let prefixes: Record<string, string> | null = null
let selectors: Record<string, string> | null = null

const parentPseudoToSelector = {
  hovered: ':hover',
  focused: ':focus',
  pressed: ':active',
}

export const createMediaStyle = (
  { property, identifier, rules }: StyleObject,
  mediaKey: string,
  mediaQueries: MediaQueries,
  negate?: boolean,
  priority?: number
): MediaStyleObject => {
  const conf = getConfig()
  const enableMediaPropOrder = conf.settings.mediaPropOrder
  const isThemeMedia = mediaKey.startsWith('theme-')
  const isPlatformMedia = !isThemeMedia && mediaKey.startsWith('platform-')
  const isGroupMedia = !isThemeMedia && !isPlatformMedia && mediaKey.startsWith('group-')
  const isNonWindowMedia = isThemeMedia || isPlatformMedia || isGroupMedia
  const negKey = negate ? '0' : ''
  const ogPrefix = identifier.slice(0, identifier.indexOf('-') + 1)

  let styleRule: string

  const id = `${ogPrefix}${MEDIA_SEP}${mediaKey.replace('-', '')}${negKey}${MEDIA_SEP}`
  const nextIdentifier = identifier.replace(ogPrefix, id)

  if (isNonWindowMedia) {
    const precedencePrefix = new Array(priority).fill(':root').join('')
    const styleInner = rules
      .map((rule) => rule.replace(identifier, nextIdentifier))
      .join(';')

    if (isThemeMedia || isGroupMedia) {
      const keyParts = mediaKey.split('-')
      const name = (isGroupMedia ? 'group_' : '') + keyParts[1]
      const selectorStart = styleInner.indexOf(':root')
      const selectorEnd = styleInner.lastIndexOf('{')
      const selector = styleInner.slice(selectorStart, selectorEnd)
      const precedenceSpace = conf.themeClassNameOnRoot ? '' : ' '
      const pseudoSelector = parentPseudoToSelector[keyParts[2]] || ''
      const nextSelector = `:root${precedencePrefix}${precedenceSpace}.t_${name}${pseudoSelector} ${selector.replace(
        ':root',
        ''
      )}`
      // const selectors = `${nextSelector}, :root${nextSelector}`
      // add back in the { we used to split
      styleRule = styleInner.replace(selector, nextSelector)
    } else {
      styleRule = `${precedencePrefix}${styleInner}`
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
      styleRule = `@media ${mediaQuery}{${precedencePrefix}${styleInner}}`
    }
  }

  return {
    property,
    rules: [styleRule],
    identifier: nextIdentifier,
  }
}
