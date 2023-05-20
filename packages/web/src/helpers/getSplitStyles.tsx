import {
  isAndroid,
  isClient,
  isRSC,
  isServer,
  isWeb,
  useIsomorphicLayoutEffect,
} from '@tamagui/constants'
import {
  stylePropsFont,
  stylePropsText,
  stylePropsTransform,
  validPseudoKeys,
  validStyles,
  validStylesOnBaseProps,
} from '@tamagui/helpers'
import { useInsertionEffect } from 'react'

import { getConfig, getFont } from '../config'
import { accessibilityDirectMap } from '../constants/accessibilityDirectMap'
import { isDevTools } from '../constants/isDevTools'
import {
  getMediaImportanceIfMoreImportant,
  mediaState as globalMediaState,
  isMediaKey,
  mediaQueryConfig,
  mergeMediaByImportance,
} from '../hooks/useMedia'
import type {
  ClassNamesObject,
  DebugProp,
  GetStyleResult,
  MediaQueryKey,
  PseudoPropKeys,
  PseudoStyles,
  RulesToInsert,
  SpaceTokens,
  SplitStyleState,
  StaticConfigParsed,
  StyleObject,
  TamaguiInternalConfig,
  TextStyleProps,
  ThemeParsed,
  ViewStyleWithPseudos,
} from '../types'
import type { FontLanguageProps, LanguageContextType } from '../views/FontLanguage.types'
import { createMediaStyle } from './createMediaStyle'
import { getPropMappedFontFamily } from './createPropMapper'
import { fixStyles } from './expandStyles'
import { generateAtomicStyles, getStylesAtomic, styleToCSS } from './getStylesAtomic'
import {
  insertStyleRules,
  insertedTransforms,
  scanAllSheets,
  shouldInsertStyleRules,
  updateRules,
} from './insertStyleRule'
import {
  normalizeValueWithProperty,
  reverseMapClassNameToValue,
} from './normalizeValueWithProperty'
import { pseudoDescriptors } from './pseudoDescriptors'

type GetStyleState = {
  style: TextStyleProps
  usedKeys: Record<string, number>
  classNames: ClassNamesObject
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

export type SplitStyleResult = ReturnType<typeof getSplitStyles>

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

// loop props backwards
//   track used keys:
//     const keys = new Set<string>()
//   keep classnames and styles separate:
//     const styles = {}
//     const classNames = {}

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
  const { shorthands } = conf
  const { variants, propMapper, isReactNative, inlineProps, inlineWhenUnflattened } =
    staticConfig
  const validStyleProps = staticConfig.isText ? stylePropsText : validStyles
  const viewProps: GetStyleResult['viewProps'] = {}
  let pseudos: PseudoStyles | null = null
  let psuedosUsed: Record<string, number> | null = null
  const mediaState = state.mediaState || globalMediaState
  const usedKeys: Record<string, number> = {}
  const propKeys = Object.keys(props)
  let space: SpaceTokens | null = props.space
  let hasMedia: boolean | string[] = false

  const shouldDoClasses =
    staticConfig.acceptsClassName && (isWeb || IS_STATIC) && !state.noClassNames

  let style: ViewStyleWithPseudos = {}
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

  /**
   * Not the biggest fan of creating this object but it is a nice API
   */
  const styleState: GetStyleState = {
    classNames,
    conf,
    props,
    state,
    staticConfig,
    style,
    theme,
    usedKeys,
    viewProps,
    languageContext,
  }

  if (process.env.NODE_ENV === 'development' && debug) {
    console.groupCollapsed('getSplitStyles (looping backwards)')
    // prettier-ignore
    // rome-ignore lint/nursery/noConsoleLog: ok
    console.log({ props, staticConfig, shouldDoClasses, state, IS_STATIC, propKeys, styleState, theme: { ...theme } })
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
        usedKeys[fullKey] = 1
        mergeClassName(transforms, classNames, fullKey, cn, isMediaOrPseudo)
      } else if (cn) {
        className += ` ${cn}`
      }
    }
  }

  function passDownProp(key: string, val: any, shouldMergeObject = false) {
    if (shouldMergeObject) {
      viewProps[key] ||= {}
      // we are going backwards to apply in front
      viewProps[key] = {
        ...val,
        ...viewProps[key],
      }
    } else {
      usedKeys[key] = 1
      viewProps[key] = val
    }
  }

  /**
   * Need to process these after done with flattening the rest of the props + variants/mediam when we have the final font family.
   *
   * We use this because fonts are grouped together and cannot be processed correctly without the correct font family.
   */
  const specialProps: [string, any][] = []

  function processProp(
    keyInit: string,
    valInit: any,
    special = false,
    fontFamilyOverride: any = null
  ) {
    if (keyInit === 'className') return // handled above

    // normalize shorthands up front
    if (keyInit in shorthands) {
      keyInit = shorthands[keyInit]
    }

    if (process.env.TAMAGUI_TARGET === 'native') {
      if (!isAndroid) {
        // only works in android
        if (keyInit === 'elevationAndroid') return
      }
      // map userSelect to native prop
      if (keyInit === 'userSelect') {
        keyInit = 'selectable'
        valInit = valInit === 'none' ? false : true
      } else if (keyInit.startsWith('data-') || keyInit.startsWith('aria-')) {
        return
      }
    }

    if (process.env.TAMAGUI_TARGET === 'web') {
      if (keyInit === 'elevationAndroid') return
    }

    if (!staticConfig.isHOC) {
      if (keyInit in skipProps) {
        if (process.env.NODE_ENV === 'development' && debug && keyInit === 'debug') {
          // pass throuhg debug
        } else {
          return
        }
      }
    }

    if (keyInit in usedKeys) {
      return
    }

    if (typeof valInit === 'string' && valInit[0] === '_') {
      if (keyInit in validStyleProps || keyInit.includes('-')) {
        if (shouldDoClasses) {
          classNames[keyInit] = valInit
        } else {
          style[keyInit] = reverseMapClassNameToValue(keyInit, valInit)
        }
        usedKeys[keyInit] = 1
        return
      }
    }

    if (keyInit === 'dataSet') {
      for (const key in valInit) {
        viewProps[`data-${hyphenate(key)}`] = valInit[key]
      }
      return
    }

    const isMainStyle = keyInit === 'style'
    if (isMainStyle || keyInit.startsWith('_style')) {
      if (!valInit) return
      const styles = Array.isArray(valInit) ? valInit : [valInit]
      const styleLen = styles.length
      for (let j = styleLen; j >= 0; j--) {
        const cur = styles[j]
        if (!cur) continue
        for (const key in cur) {
          if (!isMainStyle && usedKeys[key]) {
            continue
          }
          usedKeys[key] = 1
          style[key] = cur[key]
        }
      }
      return
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
          return
        }
      }

      if (keyInit === 'testID') {
        usedKeys[keyInit] = 1
        viewProps[isReactNative ? 'testId' : 'data-testid'] = valInit
        return
      }

      if (keyInit === 'id' || keyInit === 'nativeID') {
        usedKeys[keyInit] = 1
        if (isReactNative) {
          viewProps.nativeID = valInit
        } else {
          viewProps.id = valInit
        }
        return
      }

      let didUseKeyInit = false

      if (isReactNative) {
        // pass along to react-native-web
        if (accessibilityDirectMap[keyInit] || keyInit.startsWith('accessibility')) {
          viewProps[keyInit] = valInit
          usedKeys[keyInit] = 1
          return
        }
      } else {
        didUseKeyInit = true

        if (accessibilityDirectMap[keyInit]) {
          viewProps[accessibilityDirectMap[keyInit]] = valInit
        } else {
          switch (keyInit) {
            case 'accessibilityRole': {
              if (valInit === 'none') {
                viewProps.role = 'presentation'
              } else {
                viewProps.role = accessibilityRoleToWebRole[valInit] || valInit
              }
              return
            }
            case 'accessibilityLabelledBy':
            case 'accessibilityFlowTo':
            case 'accessibilityControls':
            case 'accessibilityDescribedBy': {
              viewProps[`aria-${keyInit.replace('accessibility', '').toLowerCase()}`] =
                processIDRefList(valInit)
              return
            }
            case 'accessibilityKeyShortcuts': {
              if (Array.isArray(valInit)) {
                viewProps['aria-keyshortcuts'] = valInit.join(' ')
              }
              return
            }
            case 'accessibilityLiveRegion': {
              viewProps['aria-live'] = valInit === 'none' ? 'off' : valInit
              return
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
              return
            }
            case 'accessibilityRequired': {
              viewProps['aria-required'] = valInit
              // Enhance with native semantics
              if (
                elementType === 'input' ||
                elementType === 'select' ||
                elementType === 'textarea'
              ) {
                viewProps.required = valInit
              }
              return
            }
            default: {
              didUseKeyInit = false
            }
          }
        }
      }

      if (didUseKeyInit) {
        usedKeys[keyInit] = 1
        return
      }

      if (valInit && valInit[0] === '_') {
        // if valid style key (or pseudo like color-hover):
        // this conditional and esp the pseudo check rarely runs so not a perf issue
        const isValidClassName = keyInit in validStyles
        const isMediaOrPseudo =
          !isValidClassName &&
          keyInit.includes(PROP_SPLIT) &&
          validStyles[keyInit.split(PROP_SPLIT)[0]]

        if (isValidClassName || isMediaOrPseudo) {
          usedKeys[keyInit] = 1
          if (process.env.NODE_ENV === 'development' && debug) {
            // rome-ignore lint/nursery/noConsoleLog: ok
            console.log('tamagui classname props', keyInit, valInit)
          }
          mergeClassName(transforms, classNames, keyInit, valInit, isMediaOrPseudo)
          return
        }
      }
    }

    /**
     * There's (some) reason to this madness: we want to allow returning media/pseudo from variants
     * Say you have a variant hoverable: { true: { hoverStyle: {} } }
     * We run propMapper first to expand variant, then we run the inner loop and look again
     * for if there's a pseudo/media returned from it.
     */

    let isMedia = isMediaKey(keyInit)
    let isPseudo = keyInit in validPseudoKeys
    let isMediaOrPseudo = isMedia || isPseudo

    const isVariant = variants && keyInit in variants

    const shouldPassProp = !(
      isMediaOrPseudo ||
      isVariant ||
      keyInit in validStyleProps ||
      keyInit in shorthands
    )

    const isHOCShouldPassThrough =
      staticConfig.isHOC &&
      (isMediaOrPseudo || staticConfig.parentStaticConfig?.variants?.[keyInit])
    const shouldPassThrough = shouldPassProp || isHOCShouldPassThrough

    if (shouldPassThrough) {
      if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
        console.groupCollapsed(`  🔹 pass through ${keyInit}`)
        // rome-ignore lint/nursery/noConsoleLog: <explanation>
        console.log({
          valInit,
          variants,
          variant: variants?.[keyInit],
          isVariant,
          shouldPassProp,
          isHOCShouldPassThrough,
        })
        console.groupEnd()
      }

      if (isPseudo) {
        // this is a lot... but we need to track sub-keys so we don't override them in future things that aren't passed down
        // like our own variants that aren't in parent
        const pseudoStyleObject = getSubStyle(
          styleState,
          keyInit,
          valInit,
          true,
          state.noClassNames
        )
        const descriptor = pseudoDescriptors[keyInit]
        for (const key in pseudoStyleObject) {
          const fullKey = `${key}${PROP_SPLIT}${descriptor.name}`
          usedKeys[fullKey] = 1
        }
      }

      passDownProp(keyInit, valInit, isMediaOrPseudo)

      // if it's a variant here, we have a two layer variant...
      // aka styled(Input, { unstyled: true, variants: { unstyled: {} } })
      // which now has it's own unstyled + the child unstyled...
      // so *don't* skip applying the styles, but also pass `unstyled` to children
      if (!isVariant) {
        return
      }
    }

    const expanded = isMediaOrPseudo
      ? [[keyInit, valInit]]
      : propMapper(
          keyInit,
          valInit,
          theme,
          special ? { ...props, fontFamily: fontFamilyOverride } : props,
          state,
          languageContext,
          undefined,
          debug
        )

    if (!fontFamily) {
      fontFamily = getPropMappedFontFamily(expanded)
    }

    if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
      console.groupCollapsed('  🔹 styles', keyInit, valInit)
      // rome-ignore lint/nursery/noConsoleLog: <explanation>
      console.log({
        expanded,
        state,
        isVariant,
        variant: variants?.[keyInit],
        shouldPassProp,
        isHOCShouldPassThrough,
        theme,
      })
      if (!isServer && isDevTools) {
        // rome-ignore lint/nursery/noConsoleLog: ok
        console.log('expanded', expanded, '\nusedKeys', { ...usedKeys }, '\ncurrent', {
          ...style,
        })
      }
      console.groupEnd()
    }

    if (!expanded) return

    for (const [key, val] of expanded) {
      if (val === undefined) continue
      if (key in stylePropsFont && !special && key !== 'fontFamily') {
        specialProps.push([key, val])
        continue
      }

      isMedia = isMediaKey(key)
      isPseudo = key in validPseudoKeys
      isMediaOrPseudo = isMedia || isPseudo

      if (!isMediaOrPseudo && key in usedKeys) {
        if (process.env.NODE_ENV === 'developmnet' && debug === 'verbose') {
          // rome-ignore lint/nursery/noConsoleLog: <explanation>
          console.log(`Used media/pseudo ${key}`)
        }
        continue
      }

      if (inlineProps?.has(key) || inlineWhenUnflattened?.has(key)) {
        usedKeys[key] = 1
        viewProps[key] = props[key] ?? val
      }

      // have to run this logic again here
      const isHOCShouldPassThrough =
        staticConfig.isHOC &&
        (isMediaOrPseudo || staticConfig.parentStaticConfig?.variants?.[keyInit])

      if (isHOCShouldPassThrough) {
        passDownProp(key, val, true)
        // if its also a variant here, pass down but also keep it
        if (!isVariant) {
          continue
        }
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
          pseudos ||= {}
          pseudos[key] ||= {}
          Object.assign(pseudos[key], pseudoStyleObject)
        }

        if (shouldDoClasses && !isEnter && !isExit) {
          const pseudoStyles = generateAtomicStyles(pseudoStyleObject, descriptor)
          for (const psuedoStyle of pseudoStyles) {
            const fullKey = `${psuedoStyle.property}${PROP_SPLIT}${descriptor.name}`

            if (!(fullKey in usedKeys)) {
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
          if (key in usedKeys) {
            continue
          }

          let isDisabled = !state[descriptor.stateKey || descriptor.name]

          // we never animate in on server side just show the full thing
          // on client side we use CSS to hide the fully in SSR items, then
          // un-hide and replay with original animation.
          if (isWeb && !isClient && isEnter) {
            isDisabled = false
          }

          if (!isDisabled) {
            if (valInit === staticConfig.defaultProps[keyInit]) {
              // ignore:
              // if it's a default property given by styled(), we don't mark it as used, so
              // that props given inline can override:
            } else {
              usedKeys[key] ||= 1
              if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
                // rome-ignore lint/nursery/noConsoleLog: <explanation>
                console.log(`Setting used ${key}`)
              }
            }
          }

          psuedosUsed ||= {}

          const importance = descriptor.priority

          for (const pkey in pseudoStyleObject) {
            const val = pseudoStyleObject[pkey]
            // when disabled ensure the default value is set for future animations to align
            if (isDisabled) {
              if (!(pkey in usedKeys) && pkey in animatableDefaults) {
                const defaultVal = animatableDefaults[pkey]
                mergeStyle(styleState, flatTransforms, pkey, defaultVal, true)
              }
              continue
            }
            const curImportance = psuedosUsed[importance] || 0
            const shouldMerge = importance >= curImportance

            if (shouldMerge) {
              psuedosUsed[pkey] = importance
              pseudos ||= {}
              pseudos[key] ||= {}
              pseudos[key][pkey] = val
              mergeStyle(styleState, flatTransforms, pkey, val)
            }
            if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
              // prettier-ignore
              // rome-ignore lint/nursery/noConsoleLog: <explanation>
              console.log('    merge pseudo?', keyInit, shouldMerge, { importance, curImportance, pkey, val })
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
          // prettier-ignore
          // rome-ignore lint/nursery/noConsoleLog: ok
          console.log(`  📺 ${key}`, { key, mediaStyle, props, shouldDoClasses })
        }

        if ('space' in mediaStyle) {
          if (!Array.isArray(hasMedia)) {
            hasMedia = []
          }
          hasMedia.push(mediaKeyShort)
        }

        if (shouldDoClasses) {
          if ('space' in mediaStyle) {
            delete mediaStyle['space']
            if (mediaState[mediaKeyShort]) {
              const val = valInit.space
              const importance = getMediaImportanceIfMoreImportant(
                mediaKeyShort,
                'space',
                usedKeys
              )
              if (importance) {
                space = val
                usedKeys['space'] = importance
                if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
                  // rome-ignore lint/nursery/noConsoleLog: <explanation>
                  console.log(
                    `Found more important space for current media ${mediaKeyShort}: ${val} (importance: ${importance})`
                  )
                }
              }
            }
          }

          const mediaStyles = getStylesAtomic(mediaStyle)
          for (const style of mediaStyles) {
            const out = createMediaStyle(style, mediaKeyShort, mediaQueryConfig)
            const fullKey = `${style.property}${PROP_SPLIT}${mediaKeyShort}`

            if (!usedKeys[fullKey]) {
              usedKeys[fullKey] = 1
              addStyleToInsertRules(rulesToInsert, out as any)
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
              fontFamily = mediaStyle.fontFamily as string
            }
          }
        }
        continue
      }

      if (process.env.TAMAGUI_TARGET === 'native') {
        if (key === 'pointerEvents') {
          usedKeys[key] = 1
          viewProps[key] = val
          continue
        }
      }

      if (key === 'fontFamily' && !fontFamily && valInit && val) {
        fontFamily = valInit[0] === '$' ? valInit : val
      }

      if (key in validStyleProps) {
        mergeStyle(styleState, flatTransforms, key, val)
        continue
      } else if (
        process.env.TAMAGUI_TARGET === 'native' &&
        isAndroid &&
        key === 'elevation'
      ) {
        mergeStyle(styleState, flatTransforms, key, val)
        continue
      }

      // pass to view props
      if (!isVariant && !(key in skipProps)) {
        viewProps[key] = val
        usedKeys[key] = 1
      }
    }
  }

  // loop backwards so we can skip already-used props
  for (let i = len - 1; i >= 0; i--) {
    const keyInit = propKeys[i]
    const valInit = props[keyInit]
    processProp(keyInit, valInit)
  }

  // default to default font
  fontFamily ||= conf.defaultFont

  // loop the special props once again
  // this one doesn't need to be backwards since it was pushed in the backwards loop (is already reversed)
  for (let i = 0; i < specialProps.length; i++) {
    const [key, value] = specialProps[i]
    processProp(key, value, true, fontFamily)
  }

  fixStyles(style)
  if (isWeb) {
    styleToCSS(style)
  }

  // native: swap out the right family based on weight/style
  if (process.env.TAMAGUI_TARGET === 'native') {
    if ('fontFamily' in style && style.fontFamily) {
      const faceInfo = getFont(style.fontFamily as string)?.face
      if (faceInfo) {
        const overrideFace =
          faceInfo[style.fontWeight as string]?.[style.fontStyle || 'normal']?.val
        if (overrideFace) {
          style.fontFamily = overrideFace
          fontFamily = overrideFace
          delete style.fontWeight
          delete style.fontStyle
        }
      }
      if (process.env.NODE_ENV === 'development') {
        if (debug) {
          // rome-ignore lint/nursery/noConsoleLog: <explanation>
          console.log(`Found fontFamily native: ${style.fontFamily}`, faceInfo)
        }
      }
    }
    if (process.env.TAMAGUI_TARGET === 'native') {
      if ('elevationAndroid' in style) {
        // @ts-ignore
        style['elevation'] = style.elevationAndroid
        // @ts-ignore
        delete style.elevationAndroid
      }
    }
  }

  // always do this at the very end to preserve the order strictly (animations, origin)
  // and allow proper merging of all pseudos before applying
  if (flatTransforms) {
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
      const retainedStyles = {}
      if (style['$$css']) {
        // avoid re-processing for rnw
      } else {
        const atomic = getStylesAtomic(style)
        for (const atomicStyle of atomic) {
          const key = atomicStyle.property
          if (props.animateOnly && props.animateOnly.includes(key)) {
            retainedStyles[key] = style[key]
          } else {
            addStyleToInsertRules(rulesToInsert, atomicStyle)
            mergeClassName(transforms, classNames, key, atomicStyle.identifier)
          }
        }
        if (!IS_STATIC) {
          style = retainedStyles
        }
      }
    }

    if (transforms) {
      for (const namespace in transforms) {
        if (!transforms[namespace]) {
          if (process.env.NODE_ENV === 'development') {
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
          } as StyleObject)
        }
        classNames[namespace] = identifier
      }
    }
  }

  // now we need to reverse viewProps because order is important for wrapped tamagui children:
  // techcnically we could just do this when it is HOC/has parentStaticConfig I think... but safer this way
  const nextViewProps = {}
  const ks = Object.keys(viewProps)
  const l = ks.length
  for (let i = l - 1; i >= 0; i--) {
    nextViewProps[ks[i]] = viewProps[ks[i]]
  }

  const result: GetStyleResult = {
    space,
    hasMedia,
    fontFamily,
    viewProps: nextViewProps,
    // @ts-expect-error
    style,
    pseudos,
    classNames,
    rulesToInsert,
  }

  if (className) {
    classNames.className = className
  }

  if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
    if (isDevTools) {
      console.groupCollapsed('  🔹 =>')
      // prettier-ignore
      const logs = { ...result, state, etc: { transforms, viewProps, rulesToInsert, parentSplitStyles, flatTransforms } }
      for (const key in logs) {
        // rome-ignore lint/nursery/noConsoleLog: ok
        console.log(key, logs[key])
      }
      console.groupEnd()
    }
  }

  return result
}

// not ever hitting cache?
// const cache = createChainedWeakCache()
// export const getSplitStyles: StyleSplitter = (
//   props,
//   staticConfig,
//   theme,
//   state,
//   parentSplitStyles,
//   languageContext,
//   elementType,
//   debug
// ) => {
//   const cacheProps = [props, theme, state]
//   const cached = cache.get(cacheProps)
//   if (cached) {
//     return cached as any
//   }

//   const res = getSplitStylesWithoutMemo(
//     props,
//     staticConfig,
//     theme,
//     state,
//     parentSplitStyles,
//     languageContext,
//     elementType,
//     debug
//   )

//   cache.set(cacheProps, res)

//   return res
// }

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
    if (val[0] === '_' && val.startsWith('_transform-')) {
      const ns: TransformNamespaceKey = isMediaOrPseudo ? key : 'transform'
      let transform = insertedTransforms[val]
      if (isClient && !transform) {
        scanAllSheets() // HMR or loaded a new chunk
        transform = insertedTransforms[val]
        if (!transform && isWeb && val[0] !== '_') {
          transform = val // runtime insert
        }
      }
      transforms[ns] ||= ['', '']
      transforms[ns][0] += val.replace('_transform', '')
      // ssr doesn't need to do anything just make the right classname
      if (transform) {
        transforms[ns][1] += transform
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

function getSubStyleProps(
  defaultProps: Object,
  baseProps: Object,
  specificProps: Object
) {
  return {
    ...defaultProps,
    ...baseProps,
    ...specificProps,
  }
}

function mergeStyle(
  { usedKeys, classNames, viewProps, style }: GetStyleState,
  flatTransforms: FlatTransforms,
  key: string,
  val: any,
  dontSetUsed = false
) {
  if (!dontSetUsed) {
    usedKeys[key] ||= 1
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
): TextStyleProps => {
  const { staticConfig, theme, props, state, conf, languageContext } = styleState
  const styleOut: TextStyleProps = {}

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
    if (!staticConfig.isHOC) {
      if (key in skipProps) {
        continue
      }
    }
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

function addStyleToInsertRules(rulesToInsert: RulesToInsert, styleObject: StyleObject) {
  if (process.env.TAMAGUI_TARGET === 'web') {
    if (!shouldInsertStyleRules(styleObject.identifier)) {
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

const lowercaseHyphenate = (match: string) => `-${match.toLowerCase()}`
const hyphenate = (str: string) => str.replace(/[A-Z]/g, lowercaseHyphenate)

export type FlatTransforms = Record<string, any>

const mergeTransform = (
  obj: TextStyleProps,
  key: string,
  val: any,
  backwards = false
) => {
  obj.transform ||= []
  obj.transform[backwards ? 'unshift' : 'push']({
    [mapTransformKeys[key] || key]: val,
  } as any)
}

const mergeTransforms = (
  obj: TextStyleProps,
  flatTransforms: FlatTransforms,
  backwards = false
) => {
  Object.entries(flatTransforms).forEach(([key, val]) => {
    mergeTransform(obj, key, val, backwards)
  })
}

const mapTransformKeys = {
  x: 'translateX',
  y: 'translateY',
}

const skipProps = {
  animation: true,
  space: true,
  animateOnly: true,
  debug: true,
  componentName: true,
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
    cursor: true,
    contain: true,
    boxSizing: true,
    boxShadow: true,
    outlineStyle: true,
    outlineOffset: true,
    outlineWidth: true,
    outlineColor: true,
  })
}

const accessibilityRoleToWebRole = {
  adjustable: 'slider',
  header: 'heading',
  image: 'img',
  link: 'link',
  none: 'presentation',
  summary: 'region',
}
