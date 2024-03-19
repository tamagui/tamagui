import { getConfig } from '../config'
import { mediaObjectToString } from '../hooks/useMedia'
import type { IsMediaType, MediaQueries, MediaStyleObject, StyleObject } from '../types'
import { getGroupPropParts } from './getGroupPropParts'

// TODO have this be used by extractMediaStyle in tamagui static
// not synced to static/constants for now
export const MEDIA_SEP = '_'

let prefixes: Record<string, string> | null = null
let selectors: Record<string, string> | null = null

const groupPseudoToPseudoCSSMap = {
  press: 'active',
}

export const createMediaStyle = (
  styleObject: StyleObject,
  mediaKeyIn: string,
  mediaQueries: MediaQueries,
  type: IsMediaType,
  negate?: boolean,
  priority?: number
): MediaStyleObject => {
  const { property, identifier, rules } = styleObject
  const conf = getConfig()
  const enableMediaPropOrder = conf.settings.mediaPropOrder
  const isTheme = type === 'theme'
  const isPlatform = type === 'platform'
  const isGroup = type === 'group'
  const isNonWindowMedia = isTheme || isPlatform || isGroup
  const negKey = negate ? '0' : ''
  const ogPrefix = identifier.slice(0, identifier.indexOf('-') + 1)
  const id = `${ogPrefix}${MEDIA_SEP}${mediaKeyIn.replace('-', '')}${negKey}${MEDIA_SEP}`

  let styleRule = ''
  let groupMediaKey: string | undefined
  let containerName: string | undefined
  let nextIdentifier = identifier.replace(ogPrefix, id)
  let styleInner = rules.map((rule) => rule.replace(identifier, nextIdentifier)).join(';')

  if (isNonWindowMedia) {
    const precedenceImportancePrefix = new Array((priority || 0) + (isGroup ? 1 : 0))
      .fill(':root')
      .join('')

    if (isTheme || isGroup) {
      const groupInfo = getGroupPropParts(mediaKeyIn)
      const mediaName = groupInfo?.name
      groupMediaKey = groupInfo?.media
      if (isGroup) {
        containerName = mediaName
      }
      const name = (isGroup ? 'group_' : '') + mediaName

      const selectorStart = styleInner.indexOf(':root')
      const selectorEnd = styleInner.lastIndexOf('{')
      const selector = styleInner.slice(selectorStart, selectorEnd)
      const precedenceSpace = conf.themeClassNameOnRoot && isTheme ? '' : ' '
      const pseudoSelectorName = groupInfo.pseudo
        ? groupPseudoToPseudoCSSMap[groupInfo.pseudo] || groupInfo.pseudo
        : undefined

      const pseudoSelector = pseudoSelectorName ? `:${pseudoSelectorName}` : ''
      const presedencePrefix = `:root${precedenceImportancePrefix}${precedenceSpace}`
      const mediaSelector = `.t_${name}${pseudoSelector}`
      const nextSelector = `${presedencePrefix}${mediaSelector} ${selector.replace(
        ':root',
        ''
      )}`
      // const selectors = `${nextSelector}, :root${nextSelector}`
      // add back in the { we used to split
      styleRule = styleInner.replace(selector, nextSelector)
    } else {
      styleRule = `${precedenceImportancePrefix}${styleInner}`
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
      ? ''
      : enableMediaPropOrder
        ? // this new array should be cached
          new Array(priority)
            .fill(':root')
            .join('')
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
        conf.settings.webContainerType || 'inline-size'
      }) {${styleRule}}`
    }
  }

  return {
    property,
    rules: [styleRule],
    identifier: nextIdentifier,
  }
}
