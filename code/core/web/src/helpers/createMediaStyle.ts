import { getSetting } from '../config'
import { mediaObjectToString } from '../hooks/useMedia'
import type { IsMediaType, MediaQueries, MediaStyleObject, StyleObject } from '../types'
import { getGroupPropParts, type GroupParts } from './getGroupPropParts'

// TODO have this be used by extractMediaStyle in tamagui static
// not synced to static/constants for now
export const MEDIA_SEP = '_'

let prefixes: Record<string, string> | null = null
let selectors: Record<string, string> | null = null

const groupPseudoToPseudoCSSMap = {
  press: 'active',
  focusVisible: 'focus-visible',
  focusWithin: 'focus-within',
}

const specificities = new Array(5)
  .fill(0)
  .map((_, i) => new Array(i).fill(':root').join(''))

function getThemeOrGroupSelector(
  name: string,
  styleInner: string,
  isGroup: boolean,
  groupParts: GroupParts,
  isTheme = false,
  precedenceImportancePrefix = ''
) {
  const selectorStart = styleInner.lastIndexOf(':root') + 5
  const selectorEnd = styleInner.lastIndexOf('{')
  const selector = styleInner.slice(selectorStart, selectorEnd)
  const precedenceSpace = getSetting('themeClassNameOnRoot') && isTheme ? '' : ' '
  const pseudoSelectorName = groupParts.pseudo
    ? groupPseudoToPseudoCSSMap[groupParts.pseudo] || groupParts.pseudo
    : undefined

  const pseudoSelector = pseudoSelectorName ? `:${pseudoSelectorName}` : ''
  const presedencePrefix = `:root${precedenceImportancePrefix}${precedenceSpace}`
  const mediaSelector = `.t_${isGroup ? 'group_' : ''}${name}${pseudoSelector}`
  return [
    selector,
    `${presedencePrefix}${mediaSelector} ${selector.replaceAll(':root', '')}`,
  ] as const
}

export const createMediaStyle = (
  styleObject: StyleObject,
  mediaKeyIn: string,
  mediaQueries: MediaQueries,
  type: IsMediaType,
  negate?: boolean,
  priority?: number
): MediaStyleObject => {
  const [propertyIn, , identifier, pseudoIn, rules] = styleObject
  let property = propertyIn
  const enableMediaPropOrder = getSetting('mediaPropOrder')
  const isTheme = type === 'theme'
  const isPlatform = type === 'platform'
  const isGroup = type === 'group'
  const isNonWindowMedia = isTheme || isPlatform || isGroup
  const negKey = negate ? '0' : ''
  const ogPrefix = identifier.slice(0, identifier.indexOf('-') + 1)
  const id = `${ogPrefix}${MEDIA_SEP}${mediaKeyIn.replace('-', '')}${negKey}${MEDIA_SEP}`

  let styleRule = ''
  let groupPriority = ''
  let groupMediaKey: string | undefined
  let containerName: string | undefined
  let nextIdentifier = identifier.replace(ogPrefix, id)
  let styleInner = rules.map((rule) => rule.replace(identifier, nextIdentifier)).join(';')
  let isHover = false

  if (isNonWindowMedia) {
    let specificity = (priority || 0) + (isGroup || isPlatform ? 1 : 0)

    if (isTheme || isGroup) {
      const groupParts = getGroupPropParts(isTheme ? 'theme-' + mediaKeyIn : mediaKeyIn)
      const { name, media, pseudo } = groupParts
      groupMediaKey = media
      if (isGroup) {
        containerName = name
      }
      if (pseudo === 'press' || pseudoIn === 'active') {
        specificity += 2
      }
      if (pseudo === 'hover') {
        isHover = true
      }
      const [selector, nextSelector] = getThemeOrGroupSelector(
        name,
        styleInner,
        isGroup,
        groupParts,
        isTheme,
        specificities[specificity]
      )
      // const selectors = `${nextSelector}, :root${nextSelector}`
      // add back in the { we used to split
      styleRule = styleInner.replace(selector, nextSelector)
    } else {
      styleRule = `${specificities[specificity]}${styleInner}`
    }
  }

  if (!isNonWindowMedia || groupMediaKey) {
    // one time cost:
    // TODO MOVE THIS INTO SETUP AREA AND EXPORT IT
    if (!selectors) {
      const mediaKeys = Object.keys(mediaQueries)
      selectors = Object.fromEntries(
        mediaKeys.map((key) => [key, mediaObjectToString(mediaQueries[key])])
      )
      if (!enableMediaPropOrder) {
        prefixes = Object.fromEntries(
          mediaKeys.map((k, index) => [k, new Array(index + 1).fill(':root').join('')])
        )
      }
    }

    const mediaKey = groupMediaKey || mediaKeyIn
    const mediaSelector = selectors[mediaKey]
    const screenStr = negate ? 'not all and ' : ''
    const mediaQuery = `${screenStr}${mediaSelector}`
    const precedenceImportancePrefix = groupMediaKey
      ? groupPriority
      : enableMediaPropOrder && priority
        ? // this new array should be cached
          specificities[priority]
        : // @ts-ignore
          prefixes[mediaKey]
    const prefix = groupMediaKey ? `@container ${containerName}` : '@media'

    if (groupMediaKey) {
      styleInner = styleRule
    }

    // combines media queries if they already exist
    if (styleInner.includes(prefix)) {
      // combine
      styleRule = styleInner
        .replace('{', ` and ${mediaQuery} {`)
        // temp bugfix can be better done
        .replace(`and screen and`, `and`)
    } else {
      styleRule = `${prefix} ${mediaQuery}{${precedenceImportancePrefix}${styleInner}}`
    }

    // add @supports for legacy browser support to not break container queries
    if (groupMediaKey) {
      styleRule = `@supports (contain: ${
        getSetting('webContainerType') || 'inline-size'
      }) {${styleRule}}`
    }
  }

  if (isHover) {
    styleRule = `@media (hover:hover){${styleRule}}`
  }

  return [property, undefined, nextIdentifier, undefined, [styleRule]]
}
