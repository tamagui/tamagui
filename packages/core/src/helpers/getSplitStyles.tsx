import { isClient, isRSC, isServer, isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import { stylePropsText, stylePropsTransform, validPseudoKeys, validStyles } from '@tamagui/helpers'
import type { ViewStyle } from '@tamagui/types-react-native'
import { useInsertionEffect } from 'react'

import { getConfig } from '../config'
import { isDevTools } from '../constants/isDevTools'
import {
  mediaState as globalMediaState,
  mediaQueryConfig,
  mergeMediaByImportance,
} from '../hooks/useMedia'
import type {
  DebugProp,
  MediaQueryKey,
  PseudoPropKeys,
  PseudoStyles,
  SplitStyleState,
  StackProps,
  StaticConfigParsed,
  TamaguiInternalConfig,
  ThemeParsed,
} from '../types'
import { FontLanguageProps, LanguageContextType } from '../views/FontLanguage.types'
import { createMediaStyle } from './createMediaStyle'
import { getPropMappedFontFamily } from './createPropMapper'
import { fixStyles } from './expandStyles'
import { getAtomicStyle, getStylesAtomic, styleToCSS } from './getStylesAtomic'
import {
  PartialStyleObject,
  RulesToInsert,
  insertStyleRules,
  insertedTransforms,
  shouldInsertStyleRules,
  updateInserted,
  updateRules,
} from './insertStyleRule'
import { mergeTransform } from './mergeTransform'
import {
  normalizeValueWithProperty,
  reverseMapClassNameToValue,
} from './normalizeValueWithProperty.js'
import { pseudoDescriptors } from './pseudoDescriptors'

export type SplitStyles = ReturnType<typeof getSplitStyles>
export type ClassNamesObject = Record<string, string>
export type SplitStyleResult = ReturnType<typeof getSplitStyles>

const skipProps = {
  animation: true,
  animateOnly: true,
  debug: true,
  componentName: true,
  role: true,
  tag: true,
}

const IS_STATIC = process.env.IS_STATIC === 'is_static'

// native only skips
if (process.env.TAMAGUI_TARGET === 'native') {
  Object.assign(skipProps, {
    whiteSpace: true,
    wordWrap: true,
    textOverflow: true,
    textDecorationDistance: true,
    userSelect: true,
    selectable: true,
    cursor: true,
    contain: true,
    boxSizing: true,
    boxShadow: true,
  })
}

// web only maps accessibility to aria props
const accessibilityDirectMap: Record<string, string> = {}
if (process.env.TAMAGUI_TARGET === 'web') {
  // bundle size shave
  const items = {
    Hidden: true,
    ActiveDescendant: true,
    Atomic: true,
    AutoComplete: true,
    Busy: true,
    Checked: true,
    ColumnCount: 'colcount',
    ColumnIndex: 'colindex',
    ColumnSpan: 'colspan',
    Current: true,
    Details: true,
    ErrorMessage: true,
    Expanded: true,
    HasPopup: true,
    Invalid: true,
    Label: true,
    Level: true,
    Modal: true,
    Multiline: true,
    MultiSelectable: true,
    Orientation: true,
    Owns: true,
    Placeholder: true,
    PosInSet: true,
    Pressed: true,
    RoleDescription: true,
    RowCount: true,
    RowIndex: true,
    RowSpan: true,
    Selected: true,
    SetSize: true,
    Sort: true,
    ValueMax: true,
    ValueMin: true,
    ValueNow: true,
    ValueText: true,
  }
  for (const key in items) {
    let val = items[key]
    if (val === true) {
      val = key.toLowerCase()
    }
    accessibilityDirectMap[`accessibility${key}`] = `aria-${val}`
  }
}

type TransformNamespaceKey = 'transform' | PseudoPropKeys | MediaQueryKey

let conf: TamaguiInternalConfig

type SplitStylesAndProps = {
  pseudos: PseudoStyles
  medias: Record<MediaQueryKey, ViewStyle>
  style: ViewStyle
  classNames: ClassNamesObject
  rulesToInsert: RulesToInsert
  viewProps: StackProps & Record<string, any>
  fontFamily: string | undefined
  mediaKeys: string[]
}

type StyleSplitter = (
  props: { [key: string]: any },
  staticConfig: StaticConfigParsed,
  theme: ThemeParsed,
  state: SplitStyleState,
  parentSplitStyles?: SplitStylesAndProps | null,
  languageContext?: LanguageContextType,
  // web-only
  elementType?: string,
  debug?: DebugProp
) => SplitStylesAndProps

export const PROP_SPLIT = '-'

const accessibilityRoleToWebRole = {
  adjustable: 'slider',
  header: 'heading',
  image: 'img',
  link: 'link',
  none: 'presentation',
  summary: 'region',
}

// loop props backwards
//   track used keys:
//     const keys = new Set<string>()
//   keep classnames and styles separate:
//     const styles = {}
//     const classNames = {}

const isMediaKey = (key: string) => Boolean(key[0] === '$' && mediaQueryConfig[key.slice(1)])

export const getSplitStyles: StyleSplitter = (
  props,
  staticConfig,
  theme,
  state,
  parentSplitStyles,
  languageContext,
  elementType,
  debug
) => {
  conf = conf || getConfig()
  const validStyleProps = staticConfig.isText ? stylePropsText : validStyles
  const mediaKeys: string[] = []
  const viewProps: SplitStylesAndProps['viewProps'] = {}
  const pseudos: PseudoStyles = {}
  let psuedosUsed: Record<string, number> | null = null
  const medias: Record<MediaQueryKey, ViewStyle> = {}
  const mediaState = state.mediaState || globalMediaState
  const usedKeys: Record<string, number> = {}
  const propKeys = Object.keys(props)

  const shouldDoClasses =
    staticConfig.acceptsClassName && (isWeb || IS_STATIC) && !state.noClassNames

  let style: ViewStyle = {}
  let flatTransforms: Record<string, any> | undefined

  const len = propKeys.length
  const rulesToInsert: RulesToInsert = []
  const classNames: ClassNamesObject = {}
  let className = '' // existing classNames
  // we need to gather these specific to each media query / pseudo
  // value is [hash, val], so ["-jnjad-asdnjk", "scaleX(1) rotate(10deg)"]
  const transforms: Record<TransformNamespaceKey, [string, string]> = {}
  // fontFamily is our special baby, ensure we grab the latest set one always
  let fontFamily: string | undefined

  if (props.className) {
    for (const cn of props.className.split(' ')) {
      if (cn[0] === '_') {
        // tamagui, merge it expanded on key, eventually this will go away with better compiler
        const [shorthand, mediaOrPseudo] = cn.slice(1).split('-')
        const isMedia = mediaOrPseudo[0] === '_'
        const isPseudo = mediaOrPseudo[0] === '0'
        const isMediaOrPseudo = isMedia || isPseudo
        let fullKey = conf.shorthands[shorthand]
        if (isMedia) {
          // is media
          let mediaShortKey = mediaOrPseudo.slice(1)
          mediaShortKey = mediaShortKey.slice(0, mediaShortKey.indexOf('_'))
          fullKey += `${PROP_SPLIT}${mediaShortKey}`
        } else if (isPseudo) {
          // is pseudo
          const pseudoShortKey = mediaOrPseudo.slice(1)
          fullKey += `${PROP_SPLIT}${pseudoShortKey}`
        }
        if (process.env.NODE_ENV === 'development') {
          if (debug) {
            // eslint-disable-next-line no-console
            console.log('tamagui classname', fullKey, cn)
          }
        }
        usedKeys[fullKey] = 1
        mergeClassName(transforms, classNames, fullKey, cn, isMediaOrPseudo)
      } else {
        if (cn) {
          className += ' ' + cn
        }
      }
    }
  }

  // loop backwards so we can skip already-used props
  for (let i = len - 1; i >= 0; i--) {
    let keyInit = propKeys[i]
    if (keyInit === 'className') continue // handled above
    const valInit = props[keyInit]

    // normalize shorthands up front
    const expandedKey = conf.shorthands[keyInit]
    if (expandedKey) {
      keyInit = expandedKey
    }

    if (usedKeys[keyInit]) continue
    if (skipProps[keyInit]) continue
    if (!isWeb && keyInit.startsWith('data-')) continue

    if (validStyleProps[keyInit] || keyInit.includes('-')) {
      if (valInit && valInit[0] === '_') {
        if (shouldDoClasses) {
          classNames[keyInit] = valInit
        } else {
          style[keyInit] = reverseMapClassNameToValue(keyInit, valInit)
        }
        usedKeys[keyInit] = 1
        continue
      }
    }

    if (keyInit === 'style' || keyInit.startsWith('_style')) {
      if (!valInit) continue
      const styles = Array.isArray(valInit) ? valInit : [valInit]
      const styleLen = styles.length
      for (let j = styleLen; j >= 0; j--) {
        const cur = styles[j]
        if (!cur) continue
        for (const key in cur) {
          if (usedKeys[key]) continue
          usedKeys[key] = 1
          style[key] = cur[key]
        }
      }
      continue
    }

    function mergeStyle(key: string, val: any) {
      usedKeys[key] = usedKeys[key] || 1
      if (val && val[0] === '_') {
        classNames[key] = val
      } else if (key in stylePropsTransform) {
        flatTransforms ||= {}
        flatTransforms[key] = val
      } else {
        style[key] = normalizeValueWithProperty(val, key)
      }
    }

    if (process.env.TAMAGUI_TARGET === 'web') {
      /**
       * Copying in the accessibility/prop handling from react-native-web here
       * Keeps it in a single loop, avoids dup de-structuring to avoid bundle size
       */
      if (keyInit === 'disabled' && valInit === true) {
        usedKeys[keyInit] = 1
        viewProps['aria-disabled'] = true
        // Enhance with native semantics
        if (
          elementType === 'button' ||
          elementType === 'form' ||
          elementType === 'input' ||
          elementType === 'select' ||
          elementType === 'textarea'
        ) {
          viewProps.disabled = true
        }
        if (!staticConfig.variants?.disabled) {
          continue
        }
      }

      if (keyInit === 'testID') {
        usedKeys[keyInit] = 1
        if (staticConfig.isReactNative) {
          viewProps.testId = valInit
        } else {
          viewProps['data-testid'] = valInit
        }
        continue
      }

      if (keyInit === 'id' || keyInit === 'nativeID') {
        usedKeys[keyInit] = 1
        if (staticConfig.isReactNative) {
          viewProps.nativeID = valInit
        } else {
          viewProps.id = valInit
        }
        continue
      }

      let didUseKeyInit = true

      if (staticConfig.isReactNative) {
        didUseKeyInit = false

        // pass along to react-native-web
        if (accessibilityDirectMap[keyInit] || keyInit.startsWith('accessibility')) {
          viewProps[keyInit] = valInit
          usedKeys[keyInit] = 1
          continue
        }
      } else {
        if (accessibilityDirectMap[keyInit]) {
          viewProps[accessibilityDirectMap[keyInit]] = valInit
          usedKeys[keyInit] = 1
          continue
        }

        switch (keyInit) {
          case 'accessibilityRole': {
            if (valInit === 'none') {
              viewProps.role = 'presentation'
            } else {
              viewProps.role = accessibilityRoleToWebRole[valInit] || valInit
            }
            break
          }
          case 'accessibilityControls': {
            viewProps['aria-controls'] = processIDRefList(valInit)
            break
          }
          case 'accessibilityDescribedBy': {
            viewProps['aria-describedby'] = processIDRefList(valInit)
            break
          }
          case 'accessibilityFlowTo': {
            viewProps['aria-flowto'] = processIDRefList(valInit)
            break
          }
          case 'accessibilityLabelledBy': {
            viewProps['aria-labelledby'] = processIDRefList(valInit)
            break
          }
          case 'accessibilityKeyShortcuts': {
            if (Array.isArray(valInit)) {
              viewProps['aria-keyshortcuts'] = valInit.join(' ')
            }
            break
          }
          case 'accessibilityLiveRegion': {
            viewProps['aria-live'] = valInit === 'none' ? 'off' : valInit
            break
          }
          case 'accessibilityReadOnly': {
            viewProps['aria-readonly'] = valInit
            // Enhance with native semantics
            if (elementType === 'input' || elementType === 'select' || elementType === 'textarea') {
              viewProps.readOnly = true
            }
            break
          }
          case 'accessibilityRequired': {
            viewProps['aria-required'] = valInit
            // Enhance with native semantics
            if (elementType === 'input' || elementType === 'select' || elementType === 'textarea') {
              viewProps.required = true
            }
            break
          }
          default: {
            didUseKeyInit = false
          }
        }
      }

      if (didUseKeyInit) {
        usedKeys[keyInit] = 1
        continue
      }

      if (valInit && valInit[0] === '_') {
        // if valid style key (or pseudo like color-hover):
        // this conditional and esp the pseudo check rarely runs so not a perf issue
        const isValidClassName = validStyles[keyInit]
        const isMediaOrPseudo =
          !isValidClassName &&
          keyInit.includes(PROP_SPLIT) &&
          validStyles[keyInit.split(PROP_SPLIT)[0]]

        if (isValidClassName || isMediaOrPseudo) {
          usedKeys[keyInit] = 1
          if (process.env.NODE_ENV === 'development') {
            if (debug) {
              // eslint-disable-next-line no-console
              console.log('tamagui classname props', keyInit, valInit)
            }
          }
          mergeClassName(transforms, classNames, keyInit, valInit, isMediaOrPseudo)
          continue
        }
      }
    }

    if (
      (staticConfig.defaultVariants && keyInit in staticConfig.defaultVariants) ||
      // may want to just: not compile styled() into classnames, always do this, and always pass in all values in extras.props
      // but we'd want to add styled({ extracted: true }) or something at compile time to save on parsing a bit...
      (state.keepVariantsAsProps && staticConfig.variants && keyInit in staticConfig.variants)
    ) {
      viewProps[keyInit] = valInit
    }

    /**
     * There's (some) reason to this madness: we want to allow returning media/pseudo from variants
     * Say you have a variant hoverable: { true: { hoverStyle: {} } }
     * We run propMapper first to expand variant, then we run the inner loop and look again
     * for if there's a pseudo/media returned from it.
     */

    let isMedia = isMediaKey(keyInit)
    let isPseudo = validPseudoKeys[keyInit]

    if (
      !isMedia &&
      !isPseudo &&
      !staticConfig.variants?.[keyInit] &&
      !validStyleProps[keyInit] &&
      !conf.shorthands[keyInit]
    ) {
      usedKeys[keyInit] = 1
      viewProps[keyInit] = valInit
      continue
    }

    if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
      // eslint-disable-next-line no-console
      console.groupCollapsed('  🔹 styles', keyInit, valInit)
    }

    const expanded =
      isMedia || isPseudo
        ? [[keyInit, valInit]]
        : staticConfig.propMapper(
            keyInit,
            valInit,
            theme,
            props,
            state,
            languageContext,
            undefined,
            debug
          )

    if (!fontFamily) {
      fontFamily = getPropMappedFontFamily(expanded)
    }

    if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
      if (!isServer && isWeb) {
        // eslint-disable-next-line no-console
        console.log('expanded', expanded, '\nusedKeys', usedKeys, '\ncurrent', { ...style })
      }
      // eslint-disable-next-line no-console
      console.groupEnd()
    }

    if (!expanded) continue

    for (const [key, val] of expanded) {
      if (val === undefined) continue

      isMedia = isMediaKey(key)
      isPseudo = validPseudoKeys[key]
      const isMediaOrPseudo = isMedia || isPseudo

      if (!isMediaOrPseudo && usedKeys[key]) {
        continue
      }

      if (
        staticConfig.deoptProps?.has(key) ||
        staticConfig.inlineProps?.has(key) ||
        staticConfig.inlineWhenUnflattened?.has(key)
      ) {
        usedKeys[key] = 1
        viewProps[key] = props[key] ?? val
      }

      // pseudo
      if (isPseudo) {
        if (!val) continue

        // TODO can avoid processing this if !shouldDoClasses + state is off
        const pseudoStyleObject = getSubStyle(
          key,
          val,
          staticConfig,
          theme,
          props,
          state,
          conf,
          languageContext,
          true,
          state.noClassNames
        )

        const descriptor = pseudoDescriptors[key as keyof typeof pseudoDescriptors]
        if (!descriptor) {
          continue
        }

        if (!shouldDoClasses || IS_STATIC) {
          pseudos[key] ||= {}
          Object.assign(pseudos[key], pseudoStyleObject)
        }

        if (shouldDoClasses) {
          const pseudoStyles = getAtomicStyle(pseudoStyleObject, descriptor)
          for (const psuedoStyle of pseudoStyles) {
            const fullKey = `${psuedoStyle.property}${PROP_SPLIT}${descriptor.name}`
            if (!usedKeys[fullKey]) {
              usedKeys[fullKey] = 1
              addStyleToInsertRules(rulesToInsert, psuedoStyle)
              mergeClassName(
                transforms,
                classNames,
                fullKey,
                psuedoStyle.identifier,
                isMediaOrPseudo
              )
            }
          }
        } else {
          if (!state[descriptor.stateKey || descriptor.name]) {
            continue
          }

          psuedosUsed ||= {}
          usedKeys[key] ||= 1
          const importance = descriptor.priority
          for (const pkey in pseudoStyleObject) {
            const curImportance = psuedosUsed[importance] || 0
            const val = pseudoStyleObject[pkey]
            if (importance >= curImportance) {
              psuedosUsed[pkey] = importance
              pseudos[key] ||= {}
              pseudos[key][pkey] = val
              mergeStyle(pkey, val)
            }
          }
        }
        continue
      }

      // media
      if (isMedia) {
        if (!val) continue

        const mediaKey = key
        const mediaKeyShort = mediaKey.slice(1)
        mediaKeys.push(mediaKeyShort)

        // THIS USED TO PROXY BACK TO REGULAR PROPS BUT THAT IS THE WRONG BEHAVIOR
        // we avoid passing in default props for media queries because that would confuse things like SizableText.size:

        const mediaStyle = getSubStyle(
          key,
          val,
          staticConfig,
          theme,
          props,
          state,
          conf,
          languageContext,
          // TODO try true like pseudo
          false,
          state.noClassNames
        )

        if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
          // prettier-ignore
          // eslint-disable-next-line no-console
          console.log(`  📺 ${mediaKey}`, mediaState[mediaKeyShort], { mediaKey, mediaStyle, props, shouldDoClasses, mediaState: { ...mediaState } })
        }

        if (shouldDoClasses) {
          const mediaStyles = getStylesAtomic(mediaStyle)
          for (const style of mediaStyles) {
            const out = createMediaStyle(style, mediaKeyShort, mediaQueryConfig)
            const fullKey = `${style.property}${PROP_SPLIT}${mediaKeyShort}`
            if (!usedKeys[fullKey]) {
              usedKeys[fullKey] = 1
              addStyleToInsertRules(rulesToInsert, out)
              mergeClassName(transforms, classNames, fullKey, out.identifier, true)
            }
          }
        } else if (mediaState[mediaKey]) {
          for (const key in mediaStyle) {
            const didMerge = mergeMediaByImportance(style, key, mediaStyle[key], usedKeys)
            if (didMerge) {
              if (key === 'fontFamily') {
                fontFamily = mediaStyle[key]
              }
            }
          }
        }
        continue
      }

      if (!isWeb && key === 'pointerEvents') {
        usedKeys[key] = 1
        viewProps[key] = val
        continue
      }

      if (key === 'fontFamily' && !fontFamily && valInit && val) {
        fontFamily = valInit[0] === '$' ? valInit : val
      }

      if (validStyleProps[key]) {
        mergeStyle(key, val)
        continue
      }

      // pass to view props
      if (!staticConfig.variants || !(key in staticConfig.variants)) {
        if (!skipProps[key]) {
          viewProps[key] = val
          usedKeys[key] = 1
        }
      }
    }
  }

  fixStyles(style)
  if (isWeb) {
    styleToCSS(style)
  }

  // always do this at the very end to preserve the order strictly (animations, origin)
  // and allow proper merging of all pseudos before applying
  if (flatTransforms) {
    for (const key in flatTransforms) {
      mergeTransform(style, key, flatTransforms[key], true)
    }
  }

  // add in defaults if not set:
  if (parentSplitStyles) {
    if (process.env.TAMAGUI_TARGET === 'web') {
      if (shouldDoClasses) {
        for (const key in parentSplitStyles.classNames) {
          const val = parentSplitStyles.classNames[key]
          if (key in style || key in classNames) continue
          classNames[key] = val
        }
      }
    }
    if (!shouldDoClasses) {
      for (const key in parentSplitStyles.style) {
        if (key in classNames || key in style) continue
        style[key] = parentSplitStyles.style[key]
      }
    }
  }

  if (process.env.TAMAGUI_TARGET === 'web') {
    if (shouldDoClasses) {
      if (style['$$css']) {
        // avoid re-processing for rnw
      } else {
        const atomic = getStylesAtomic(style)
        for (const atomicStyle of atomic) {
          const key = atomicStyle.property
          addStyleToInsertRules(rulesToInsert, atomicStyle)
          mergeClassName(transforms, classNames, key, atomicStyle.identifier)
        }
        if (!IS_STATIC) {
          style = {}
        }
      }
    }

    if (transforms) {
      for (const namespace in transforms) {
        if (!transforms[namespace]) {
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.warn('Error no transform', transforms, namespace)
          }
          continue
        }
        const [hash, val] = transforms[namespace]
        const identifier = `_transform${hash}`
        if (isClient) {
          if (!insertedTransforms[identifier]) {
            const rule = `.${identifier} { transform: ${val}; }`
            addStyleToInsertRules(rulesToInsert, {
              identifier,
              rules: [rule],
              property: namespace,
            })
          }
        }
        classNames[namespace] = identifier
      }
    }
  }

  if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
    if (isDevTools) {
      // prettier-ignore
      // eslint-disable-next-line no-console
      console.groupCollapsed('  🔹 styles =>')
      const logs = { style, pseudos, medias, classNames, viewProps, state, rulesToInsert }
      for (const key in logs) {
        // eslint-disable-next-line no-console
        console.log(key, logs[key])
      }
      // eslint-disable-next-line no-console
      console.groupEnd()
    }
  }

  if (className) {
    classNames.className = className
  }

  return {
    fontFamily,
    viewProps,
    style,
    medias,
    mediaKeys,
    pseudos,
    classNames,
    rulesToInsert,
  }
}

function mergeClassName(
  transforms: Record<string, any[]>,
  classNames: Record<string, string>,
  key: string,
  val: string,
  isMediaOrPseudo = false
) {
  if (process.env.TAMAGUI_TARGET === 'web') {
    // empty classnames passed by compiler sometimes
    if (!val) return
    if (val.startsWith('_transform-')) {
      const namespace: TransformNamespaceKey = isMediaOrPseudo ? key : 'transform'
      let transform = insertedTransforms[val]
      if (isClient) {
        if (!transform) {
          // HMR or loaded a new chunk
          updateInserted()
          transform = insertedTransforms[val]
          if (process.env.NODE_ENV === 'development') {
            if (!transform) {
              // eslint-disable-next-line no-console
              console.warn('no transform found', { insertedTransforms, val })
            }
          }
        }
        if (!transform) {
          if (isWeb && val[0] !== '_') {
            // runtime insert
            transform = val
          }
        }
      }
      transforms[namespace] = transforms[namespace] || ['', '']
      const identifier = val.replace('_transform', '')
      transforms[namespace][0] += identifier
      // ssr doesn't need to do anything just make the right classname
      if (transform) {
        transforms[namespace][1] += transform
      }
    } else {
      classNames[key] = val
    }
  }
}

/**
 * getSubStyle calls propMapper with props
 * those should be specific to the substyle, but fallback to the base props
 * so given props:
 *
 *   { fontSize: 12, color: 'red', $sm: { color: 'blue' } }
 *
 * getSubStyle props should be a proxy that ends up like:
 *
 *   { fontSize: 12, color: 'blue' }
 *
 * and to avoid re-creating it over and over, use a WeakMap
 */
const cache = new WeakMap()
function getSubStyleProps(defaultProps: Object, baseProps: Object, specificProps: Object) {
  const key = specificProps || baseProps
  // can cache based only on specific it's always referentially consistent with base
  if (cache.has(key)) {
    return cache.get(key)
  }
  const next = {
    ...defaultProps,
    ...baseProps,
    ...specificProps,
  }
  cache.set(key, next)
  return next
}

export const getSubStyle = (
  subKey: string,
  styleIn: Object,
  staticConfig: StaticConfigParsed,
  theme: ThemeParsed,
  props: any,
  state: SplitStyleState,
  conf: TamaguiInternalConfig,
  languageContext?: FontLanguageProps,
  avoidDefaultProps?: boolean,
  avoidMergeTransform?: boolean
): ViewStyle => {
  const styleOut: ViewStyle = {}

  for (let key in styleIn) {
    const val = styleIn[key]
    key = conf.shorthands[key] || key
    const expanded = staticConfig.propMapper(
      key,
      val,
      theme,
      getSubStyleProps(staticConfig.defaultProps, props, props[subKey]),
      state,
      languageContext,
      avoidDefaultProps
    )
    if (!expanded) continue
    for (const [skey, sval] of expanded) {
      if (!avoidMergeTransform && skey in stylePropsTransform) {
        mergeTransform(styleOut, skey, sval)
      } else {
        styleOut[skey] = normalizeValueWithProperty(sval, key)
      }
    }
  }

  fixStyles(styleOut)

  return styleOut
}

export const insertSplitStyles: StyleSplitter = (...args) => {
  const res = getSplitStyles(...args)
  insertStyleRules(res.rulesToInsert)
  return res
}

// on native no need to insert any css
const useInsertEffectCompat = isWeb ? useInsertionEffect || useIsomorphicLayoutEffect : () => {}

export const useSplitStyles: StyleSplitter = (...args) => {
  const res = getSplitStyles(...args)

  if (!isRSC) {
    useInsertEffectCompat(() => {
      insertStyleRules(res.rulesToInsert)
    }, [res.rulesToInsert])
  }

  return res
}

function addStyleToInsertRules(rulesToInsert: RulesToInsert, styleObject: PartialStyleObject) {
  if (process.env.TAMAGUI_TARGET === 'web') {
    if (!shouldInsertStyleRules(styleObject)) {
      return
    }
    updateRules(styleObject.identifier, styleObject.rules)
    rulesToInsert.push(styleObject)
  }
}

function processIDRefList(idRefList: string | Array<string>): string {
  return Array.isArray(idRefList) ? idRefList.join(' ') : idRefList
}
