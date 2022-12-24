import {
  isClient,
  isRSC,
  isServer,
  isWeb,
  useIsomorphicLayoutEffect,
} from '@tamagui/constants'
import {
  stylePropsText,
  stylePropsTransform,
  validPseudoKeys,
  validStyles,
  validStylesOnBaseProps,
} from '@tamagui/helpers'
import { useInsertionEffect } from 'react'
import type { ViewStyle } from 'react-native'

import { getConfig } from '../config'
import { isDevTools } from '../constants/isDevTools'
import {
  getMediaImportanceIfMoreImportant,
  mediaState as globalMediaState,
  mediaKeysWithAndWithout$,
  mediaQueryConfig,
  mediaState,
  mergeMediaByImportance,
} from '../hooks/useMedia'
import type {
  DebugProp,
  MediaQueryKey,
  PseudoPropKeys,
  PseudoStyles,
  SpaceTokens,
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
import { FlatTransforms, mergeTransform, mergeTransforms } from './mergeTransform'
import {
  normalizeValueWithProperty,
  reverseMapClassNameToValue,
} from './normalizeValueWithProperty.js'
import { pseudoDescriptors } from './pseudoDescriptors'

type GetStyleResult = {
  pseudos: PseudoStyles
  medias: Record<MediaQueryKey, ViewStyle>
  style: ViewStyle
  classNames: ClassNamesObject
  rulesToInsert: RulesToInsert
  viewProps: StackProps & Record<string, any>
  fontFamily: string | undefined
  space?: any // SpaceTokens?
  hasMedia: boolean | 'space'
}

type GetStyleState = {
  style: ViewStyle
  usedKeys: Record<string, number>
  classNames: ClassNamesObject
  flatTransforms: FlatTransforms
  staticConfig: StaticConfigParsed
  theme: ThemeParsed
  props: Record<string, any>
  viewProps: Record<string, any>
  state: SplitStyleState
  conf: TamaguiInternalConfig
  languageContext?: FontLanguageProps
  avoidDefaultProps?: boolean
  avoidMergeTransform?: boolean
}

export type SplitStyles = ReturnType<typeof getSplitStyles>
export type ClassNamesObject = Record<string, string>
export type SplitStyleResult = ReturnType<typeof getSplitStyles>

const skipProps = {
  animation: true,
  space: true,
  animateOnly: true,
  debug: true,
  componentName: true,
  role: true,
  tag: true,
}
if (process.env.NODE_ENV === 'test') {
  skipProps['data-test-renders'] = true
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

type StyleSplitter = (
  props: { [key: string]: any },
  staticConfig: StaticConfigParsed,
  theme: ThemeParsed,
  state: SplitStyleState,
  parentSplitStyles?: GetStyleResult | null,
  languageContext?: LanguageContextType,
  // web-only
  elementType?: string,
  debug?: DebugProp
) => GetStyleResult

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

const isMediaKey = (key: string) =>
  Boolean(key[0] === '$' && mediaKeysWithAndWithout$.has(key))

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
  if (cache.has(props)) {
    return cache.get(props)
  }

  conf = conf || getConfig()
  const { shorthands } = conf
  const {
    defaultVariants,
    variants,
    propMapper,
    isReactNative,
    deoptProps,
    inlineProps,
    inlineWhenUnflattened,
  } = staticConfig
  const validStyleProps = staticConfig.isText ? stylePropsText : validStyles
  const viewProps: GetStyleResult['viewProps'] = {}
  const pseudos: PseudoStyles = {}
  let psuedosUsed: Record<string, number> | null = null
  const medias: Record<MediaQueryKey, ViewStyle> = {}
  const mediaState = state.mediaState || globalMediaState
  const usedKeys: Record<string, number> = {}
  const propKeys = Object.keys(props)
  let space: SpaceTokens | null = props.space
  let hasMedia: boolean | 'space' = space ? 'space' : false

  const shouldDoClasses =
    staticConfig.acceptsClassName && (isWeb || IS_STATIC) && !state.noClassNames

  let style: ViewStyle = {}
  const flatTransforms: FlatTransforms = {}

  const len = propKeys.length
  const rulesToInsert: RulesToInsert = []
  const classNames: ClassNamesObject = {}
  let className = '' // existing classNames
  // we need to gather these specific to each media query / pseudo
  // value is [hash, val], so ["-jnjad-asdnjk", "scaleX(1) rotate(10deg)"]
  const transforms: Record<TransformNamespaceKey, [string, string]> = {}
  // fontFamily is our special baby, ensure we grab the latest set one always
  let fontFamily: string | undefined

  const styleState: GetStyleState = {
    classNames,
    conf,
    flatTransforms,
    props,
    state,
    staticConfig,
    style,
    theme,
    usedKeys,
    viewProps,
    languageContext,
  }

  if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
    // eslint-disable-next-line no-console
    console.groupCollapsed('getSplitStyles')
    // eslint-disable-next-line no-console
    console.log(staticConfig, { shouldDoClasses, state, IS_STATIC })
    // eslint-disable-next-line no-console
    console.groupEnd()
  }

  if (props.className) {
    for (const cn of props.className.split(' ')) {
      if (cn[0] === '_') {
        // tamagui, merge it expanded on key, eventually this will go away with better compiler
        const [shorthand, mediaOrPseudo] = cn.slice(1).split('-')
        const isMedia = mediaOrPseudo[0] === '_'
        const isPseudo = mediaOrPseudo[0] === '0'
        const isMediaOrPseudo = isMedia || isPseudo
        let fullKey = shorthands[shorthand]
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
          className += ` ${cn}`
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
    if (keyInit in shorthands) {
      keyInit = shorthands[keyInit]
    }

    if (keyInit in usedKeys) continue
    if (keyInit in skipProps) continue
    if (!isWeb && keyInit.startsWith('data-')) continue

    if (typeof valInit === 'string' && valInit[0] === '_') {
      if (keyInit in validStyleProps || keyInit.includes('-')) {
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
        if (!variants?.disabled) {
          continue
        }
      }

      if (keyInit === 'testID') {
        usedKeys[keyInit] = 1
        if (isReactNative) {
          viewProps.testId = valInit
        } else {
          viewProps['data-testid'] = valInit
        }
        continue
      }

      if (keyInit === 'id' || keyInit === 'nativeID') {
        usedKeys[keyInit] = 1
        if (isReactNative) {
          viewProps.nativeID = valInit
        } else {
          viewProps.id = valInit
        }
        continue
      }

      let didUseKeyInit = true

      if (isReactNative) {
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
            if (
              elementType === 'input' ||
              elementType === 'select' ||
              elementType === 'textarea'
            ) {
              viewProps.readOnly = true
            }
            break
          }
          case 'accessibilityRequired': {
            viewProps['aria-required'] = valInit
            // Enhance with native semantics
            if (
              elementType === 'input' ||
              elementType === 'select' ||
              elementType === 'textarea'
            ) {
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
      (defaultVariants && keyInit in defaultVariants) ||
      // may want to just: not compile styled() into classnames, always do this, and always pass in all values in extras.props
      // but we'd want to add styled({ extracted: true }) or something at compile time to save on parsing a bit...
      (state.keepVariantsAsProps && variants && keyInit in variants)
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
      !(
        isMedia ||
        isPseudo ||
        variants?.[keyInit] ||
        validStyleProps[keyInit] ||
        shorthands[keyInit]
      )
    ) {
      // web-only, exclude all other accessibility props not handled above
      if (isWeb && keyInit.indexOf('ccessibility') > 0) {
        continue
      }
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
        : propMapper(
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
        console.log('expanded', expanded, '\nusedKeys', usedKeys, '\ncurrent', {
          ...style,
        })
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

      if (inlineProps?.has(key) || inlineWhenUnflattened?.has(key)) {
        usedKeys[key] = 1
        viewProps[key] = props[key] ?? val
      }

      // pseudo
      if (isPseudo) {
        if (!val) continue

        // TODO can avoid processing this if !shouldDoClasses + state is off
        const pseudoStyleObject = getSubStyle(
          styleState,
          key,
          val,
          true,
          state.noClassNames
        )

        const descriptor = pseudoDescriptors[key as keyof typeof pseudoDescriptors]
        const isEnter = descriptor.name === 'enter'
        const isExit = descriptor.name === 'exit'

        // don't continue here on isEnter && !state.unmounted because we need to merge defaults
        if (!descriptor || (isExit && !state.isExiting)) {
          continue
        }

        if (!shouldDoClasses || IS_STATIC) {
          pseudos[key] ||= {}
          Object.assign(pseudos[key], pseudoStyleObject)
        }

        if (shouldDoClasses && !isEnter && !isExit) {
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
          const isDisabled = !state[descriptor.stateKey || descriptor.name]
          if (!isDisabled) {
            usedKeys[key] ||= 1
          }
          psuedosUsed ||= {}

          const importance = descriptor.priority
          for (const pkey in pseudoStyleObject) {
            const val = pseudoStyleObject[pkey]
            // when disabled ensure the default value is set for future animations to align
            if (isDisabled) {
              if (!(pkey in usedKeys) && pkey in animatableDefaults) {
                const defaultVal = animatableDefaults[pkey]
                mergeStyle(styleState, pkey, defaultVal, true)
              }
              continue
            }
            const curImportance = psuedosUsed[importance] || 0
            if (importance >= curImportance) {
              psuedosUsed[pkey] = importance
              pseudos[key] ||= {}
              pseudos[key][pkey] = val
              // eslint-disable-next-line no-console
              if (process.env.NODE_ENV === 'development' && debug === 'verbose')
                console.log('merging', pkey, val)
              mergeStyle(styleState, pkey, val)
            }
          }
        }
        continue
      }

      // media
      if (isMedia) {
        if (!val) continue

        hasMedia ||= true

        // THIS USED TO PROXY BACK TO REGULAR PROPS BUT THAT IS THE WRONG BEHAVIOR
        // we avoid passing in default props for media queries because that would confuse things like SizableText.size:

        const mediaStyle = getSubStyle(
          styleState,
          key,
          val,
          // TODO try true like pseudo
          false
        )

        const mediaKeyShort = key.slice(1)

        if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
          // eslint-disable-next-line no-console
          console.log(`  📺 ${key}`, mediaState[mediaKeyShort], {
            key,
            mediaStyle,
            props,
            shouldDoClasses,
            mediaState: { ...mediaState },
          })
        }

        if ('space' in mediaStyle) {
          hasMedia = 'space'
        }

        if (shouldDoClasses) {
          if ('space' in mediaStyle) {
            const val = valInit.space
            delete mediaStyle['space']
            if (
              mediaState[mediaKeyShort] &&
              getMediaImportanceIfMoreImportant(mediaKeyShort, 'space', usedKeys)
            ) {
              space = val
            }
          }
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
        } else if (mediaState[mediaKeyShort]) {
          for (const subKey in mediaStyle) {
            const importance = getMediaImportanceIfMoreImportant(
              mediaKeyShort,
              subKey,
              usedKeys
            )
            if (importance === null) continue
            if (subKey === 'space') {
              space = valInit.space
              continue
            }
            mergeMediaByImportance(
              style,
              mediaKeyShort,
              subKey,
              mediaStyle[subKey],
              usedKeys
            )
            if (key === 'fontFamily') {
              fontFamily = mediaStyle[key]
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

      if (key in validStyleProps) {
        mergeStyle(styleState, key, val)
        continue
      }

      // pass to view props
      if (!(variants && key in variants)) {
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
    if (process.env.NODE_ENV === 'development' && debug) {
      // eslint-disable-next-line no-console
      console.log(
        'Merging flat transforms, transform before',
        [...(style.transform || [])],
        flatTransforms
      )
    }
    mergeTransforms(style, flatTransforms, true)
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
        if (isClient && !insertedTransforms[identifier]) {
          const rule = `.${identifier} { transform: ${val}; }`
          addStyleToInsertRules(rulesToInsert, {
            identifier,
            rules: [rule],
            property: namespace,
          })
        }
        classNames[namespace] = identifier
      }
    }
  }

  const result = {
    space,
    hasMedia,
    fontFamily,
    viewProps,
    style,
    medias,
    pseudos,
    classNames,
    rulesToInsert,
  }

  if (className) {
    classNames.className = className
  }

  if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
    if (isDevTools) {
      // eslint-disable-next-line no-console
      console.groupCollapsed('  🔹 styles =>')
      const logs = {
        transforms,
        viewProps,
        state,
        rulesToInsert,
        parentSplitStyles,
        flatTransforms,
      }
      for (const key in { ...result, ...logs }) {
        // eslint-disable-next-line no-console
        console.log(key, logs[key])
      }
      // eslint-disable-next-line no-console
      console.groupEnd()
    }
  }

  cache.set(props, result)

  return result
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
function getSubStyleProps(
  defaultProps: Object,
  baseProps: Object,
  specificProps: Object
) {
  const key = specificProps || baseProps
  // can cache based only on specific it's always referentially consistent with base
  if (!cache.has(key)) {
    cache.set(key, {
      ...defaultProps,
      ...baseProps,
      ...specificProps,
    })
  }
  return cache.get(key)!
}

function mergeStyle(
  { usedKeys, classNames, flatTransforms, viewProps, style }: GetStyleState,
  key: string,
  val: any,
  dontSetUsed = false
) {
  if (!dontSetUsed) {
    usedKeys[key] = usedKeys[key] || 1
  }
  if (val && val[0] === '_') {
    classNames[key] = val
  } else if (key in stylePropsTransform) {
    flatTransforms ||= {}
    flatTransforms[key] = val
  } else {
    const out = normalizeValueWithProperty(val, key)
    if (key in validStylesOnBaseProps) {
      viewProps[key] = out
    } else {
      style[key] = out
    }
  }
}

export const getSubStyle = (
  styleState: GetStyleState,
  subKey: string,
  styleIn: Object,
  avoidDefaultProps?: boolean,
  avoidMergeTransform?: boolean
): ViewStyle => {
  const { staticConfig, theme, props, state, conf, languageContext } = styleState
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
const useInsertEffectCompat = isWeb
  ? useInsertionEffect || useIsomorphicLayoutEffect
  : () => {}

export const useSplitStyles: StyleSplitter = (...args) => {
  const res = getSplitStyles(...args)

  if (!isRSC) {
    useInsertEffectCompat(() => {
      insertStyleRules(res.rulesToInsert)
    }, [res.rulesToInsert])
  }

  return res
}

function addStyleToInsertRules(
  rulesToInsert: RulesToInsert,
  styleObject: PartialStyleObject
) {
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

const animatableDefaults = {
  opacity: 1,
  scale: 1,
  rotate: '0deg',
  rotateY: '0deg',
  rotateX: '0deg',
}
