import {
  currentPlatform,
  isAndroid,
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

import { getConfig, getFont } from '../config'
import {
  accessibilityDirectMap,
  accessibilityWebRoleToNativeRole,
  nativeAccessibilityState,
  nativeAccessibilityValue,
  webToNativeAccessibilityDirectMap,
} from '../constants/accessibilityDirectMap'
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

// bugfix for some reason it gets reset
const IS_STATIC = process.env.IS_STATIC === 'is_static'

export type SplitStyles = ReturnType<typeof getSplitStyles>

export type SplitStyleResult = ReturnType<typeof getSplitStyles>

type TransformNamespaceKey = 'transform' | PseudoPropKeys | MediaQueryKey

let conf: TamaguiInternalConfig

type StyleSplitter = (
  props: { [key: string]: any },
  staticConfig: StaticConfigParsed,
  themeState: {
    theme: ThemeParsed
    name: string
  },
  state: SplitStyleState,
  parentSplitStyles?: GetStyleResult | null,
  languageContext?: LanguageContextType,
  // web-only
  elementType?: string,
  debug?: DebugProp
) => GetStyleResult

export const PROP_SPLIT = '-'
let defaultFontVariable = ''

// loop props backwards
//   track used keys:
//     const keys = new Set<string>()
//   keep classnames and styles separate:
//     const styles = {}
//     const classNames = {}

export const getSplitStyles: StyleSplitter = (
  props,
  staticConfig,
  themeState,
  state,
  parentSplitStyles,
  languageContext,
  elementType,
  debug
) => {
  conf = conf || getConfig()
  const { shorthands } = conf
  const { theme, name: themeName } = themeState
  const { variants, propMapper, isReactNative, inlineProps, inlineWhenUnflattened } =
    staticConfig
  const validStyleProps = staticConfig.isText ? stylePropsText : validStyles
  const viewProps: GetStyleResult['viewProps'] = {}
  let pseudos: PseudoStyles | null = null
  const mediaState = state.mediaState || globalMediaState
  const usedKeys: Record<string, number> = {}
  const propKeys = Object.keys(props)
  const numProps = propKeys.length
  let space: SpaceTokens | null = props.space
  let hasMedia: boolean | string[] = false
  let dynamicThemeAccess: boolean | undefined

  const shouldDoClasses =
    staticConfig.acceptsClassName && (isWeb || IS_STATIC) && !state.noClassNames

  let style: ViewStyleWithPseudos = {}
  const flatTransforms: FlatTransforms = {}
  const rulesToInsert: RulesToInsert = []
  const classNames: ClassNamesObject = {}
  let className = '' // existing classNames
  // we need to gather these specific to each media query / pseudo
  // value is [hash, val], so ["-jnjad-asdnjk", "scaleX(1) rotate(10deg)"]
  const transforms: Record<TransformNamespaceKey, [string, string]> = {}

  // fontFamily is our special baby, ensure we grab the latest set one always
  let fontFamily: string | undefined
  let mediaStylesSeen = 0

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

  if (process.env.NODE_ENV === 'development' && debug && isClient) {
    console.groupCollapsed('getSplitStyles (collapsed)')
    // prettier-ignore
    // rome-ignore lint/nursery/noConsoleLog: ok
    console.log({ props, staticConfig, shouldDoClasses, state, propKeys, styleState, theme: { ...theme } })
    console.groupEnd()
  }

  // handle before the loop so we can mark usedKeys in className
  // since the compiler will optimize to className we just treat className as the more powerful
  if (typeof props.className === 'string') {
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

  for (let i = 0; i < numProps; i++) {
    let keyInit = propKeys[i]
    let valInit = props[keyInit]

    // normalize shorthands up front
    if (keyInit in shorthands) {
      keyInit = shorthands[keyInit]
    }

    if (keyInit === 'className') continue // handled above
    if (keyInit in usedKeys) continue
    if (keyInit in skipProps && !staticConfig.isHOC) continue

    // TODO this is duplicated! but seems to be fixing some bugs so leaving got now
    if (process.env.TAMAGUI_TARGET === 'web') {
      if (typeof valInit === 'string' && valInit[0] === '_') {
        if (keyInit in validStyleProps || keyInit.includes('-')) {
          if (process.env.NODE_ENV === 'development' && debug) {
            // rome-ignore lint/nursery/noConsoleLog: <explanation>
            console.log(`Adding compiled style ${keyInit}: ${valInit}`)
          }

          if (shouldDoClasses) {
            classNames[keyInit] = valInit
            delete style[keyInit]
          } else {
            style[keyInit] = reverseMapClassNameToValue(keyInit, valInit)
            delete className[keyInit]
          }
          continue
        }
      }
    }

    if (process.env.TAMAGUI_TARGET === 'native') {
      if (!isAndroid) {
        // only works in android
        if (keyInit === 'elevationAndroid') continue
      }

      // map userSelect to native prop
      if (keyInit === 'userSelect') {
        keyInit = 'selectable'
        valInit = valInit === 'none' ? false : true
      } else if (keyInit === 'role') {
        if (valInit === 'list') {
          // role = "list"
          viewProps[keyInit] = valInit
        } else if (accessibilityWebRoleToNativeRole[valInit]) {
          viewProps['accessibilityRole'] = accessibilityWebRoleToNativeRole[
            valInit
          ] as GetStyleResult['viewProps']['AccessibilityRole']
        }
        continue
      } else if (keyInit.startsWith('aria-')) {
        if (webToNativeAccessibilityDirectMap[keyInit]) {
          const nativeA11yProp = webToNativeAccessibilityDirectMap[keyInit]
          if (keyInit === 'aria-hidden') {
            // accessibilityElementsHidden only works with ios, RN version >0.71.1 support aria-hidden which works for both ios/android
            viewProps['aria-hidden'] = valInit
          }
          viewProps[nativeA11yProp] = valInit
          continue
        } else if (nativeAccessibilityValue[keyInit]) {
          let field = nativeAccessibilityValue[keyInit]
          if (viewProps['accessibilityValue']) {
            viewProps['accessibilityValue'][field] = valInit
          } else {
            viewProps['accessibilityValue'] = {
              [field]: valInit,
            }
          }
        } else if (nativeAccessibilityState[keyInit]) {
          let field = nativeAccessibilityState[keyInit]
          if (viewProps['accessibilityState']) {
            viewProps['accessibilityState'][field] = valInit
          } else {
            viewProps['accessibilityState'] = {
              [field]: valInit,
            }
          }
        }
        continue
      } else if (keyInit.startsWith('data-')) {
        continue
      }
    }

    if (keyInit === 'dataSet') {
      for (const keyInit in valInit) {
        viewProps[`data-${hyphenate(keyInit)}`] = valInit[keyInit]
      }
      continue
    }

    const isMainStyle = keyInit === 'style'
    if (isMainStyle || keyInit.startsWith('_style')) {
      if (!valInit) continue
      const styles = [].concat(valInit).flat()
      const styleLen = styles.length
      for (let j = styleLen; j >= 0; j--) {
        const cur = styles[j]
        if (!cur) continue
        for (const key in cur) {
          if (!isMainStyle && key in usedKeys) {
            continue
          }
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
        viewProps[isReactNative ? 'testId' : 'data-testid'] = valInit
        continue
      }

      if (keyInit === 'id' || keyInit === 'nativeID') {
        if (isReactNative) {
          viewProps.nativeID = valInit
        } else {
          viewProps.id = valInit
        }
        continue
      }

      let didUseKeyInit = false

      if (isReactNative) {
        // pass along to react-native-web
        if (keyInit in accessibilityDirectMap || keyInit.startsWith('accessibility')) {
          viewProps[keyInit] = valInit
          continue
        }
      } else {
        didUseKeyInit = true

        if (keyInit in accessibilityDirectMap) {
          viewProps[accessibilityDirectMap[keyInit]] = valInit
          continue
        } else {
          switch (keyInit) {
            case 'accessibilityRole': {
              if (valInit === 'none') {
                viewProps.role = 'presentation'
              } else {
                viewProps.role = accessibilityRoleToWebRole[valInit] || valInit
              }
              continue
            }
            case 'accessibilityLabelledBy':
            case 'accessibilityFlowTo':
            case 'accessibilityControls':
            case 'accessibilityDescribedBy': {
              viewProps[`aria-${keyInit.replace('accessibility', '').toLowerCase()}`] =
                processIDRefList(valInit)
              continue
            }
            case 'accessibilityKeyShortcuts': {
              if (Array.isArray(valInit)) {
                viewProps['aria-keyshortcuts'] = valInit.join(' ')
              }
              continue
            }
            case 'accessibilityLiveRegion': {
              viewProps['aria-live'] = valInit === 'none' ? 'off' : valInit
              continue
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
              continue
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
              continue
            }
            default: {
              didUseKeyInit = false
            }
          }
        }
      }

      if (didUseKeyInit) {
        continue
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
          if (process.env.NODE_ENV === 'development' && debug) {
            // rome-ignore lint/nursery/noConsoleLog: ok
            console.log('tamagui classname prop', keyInit, valInit)
          }

          if (shouldDoClasses) {
            mergeClassName(transforms, classNames, keyInit, valInit, isMediaOrPseudo)
            delete style[keyInit]
          } else {
            style[keyInit] = reverseMapClassNameToValue(keyInit, valInit)
            delete className[keyInit]
          }
          continue
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

    let isVariant = variants && keyInit in variants
    const isStyleProp =
      isMediaOrPseudo || isVariant || keyInit in validStyleProps || keyInit in shorthands

    if (isStyleProp && props.asChild === 'except-style') {
      continue
    }

    const shouldPassProp = !isStyleProp

    const isHOCShouldPassThrough = Boolean(
      staticConfig.isHOC &&
        (isMediaOrPseudo ||
          staticConfig.parentStaticConfig?.variants?.[keyInit] ||
          keyInit in skipProps)
    )

    const shouldPassThrough = shouldPassProp || isHOCShouldPassThrough

    if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
      console.groupCollapsed(`  🔹 prop ${keyInit} ${shouldPassThrough ? '(pass)' : ''}`)
      // prettier-ignore
      // rome-ignore lint/nursery/noConsoleLog: <explanation>
      console.log({ valInit, variants, variant: variants?.[keyInit], isVariant, shouldPassProp, isHOCShouldPassThrough })
      console.groupEnd()
    }

    if (shouldPassThrough) {
      // // TODO bring this back but probably improve it?
      // if (isPseudo) {
      //   // this is a lot... but we need to track sub-keys so we don't override them in future things that aren't passed down
      //   // like our own variants that aren't in parent
      //   const pseudoStyleObject = getSubStyle(
      //     styleState,
      //     keyInit,
      //     valInit,
      //     fontFamily,
      //     true,
      //     state.noClassNames
      //   )
      //   const descriptor = pseudoDescriptors[keyInit]
      //   for (const key in pseudoStyleObject) {
      //     debugger
      //   }
      // }

      passDownProp(viewProps, keyInit, valInit, isMediaOrPseudo)

      // if it's a variant here, we have a two layer variant...
      // aka styled(Input, { unstyled: true, variants: { unstyled: {} } })
      // which now has it's own unstyled + the child unstyled...
      // so *don't* skip applying the styles, but also pass `unstyled` to children
      if (!isVariant) {
        continue
      }
    }

    // after shouldPassThrough
    if (keyInit in skipProps) continue

    // default font family
    // is this great? no, but backwards compat until we add tests and make better
    defaultFontVariable ||= `$${conf.defaultFont}`
    fontFamily ||=
      props[conf.inverseShorthands.fontFamily] || props.fontFamily || defaultFontVariable

    const expanded =
      isMediaOrPseudo || (!(keyInit in validStyleProps) && !isVariant)
        ? [[keyInit, valInit]]
        : propMapper(
            keyInit,
            valInit,
            theme,
            props,
            state,
            fontFamily,
            languageContext,
            undefined,
            debug
          )

    if (!fontFamily) {
      fontFamily = getPropMappedFontFamily(expanded)
    }

    if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
      console.groupCollapsed('  🔹 expanded', keyInit, valInit)
      if (!isServer && isDevTools) {
        // prettier-ignore
        // rome-ignore lint/nursery/noConsoleLog: <explanation>
        console.log({ expanded, state: { ...state }, isVariant, variant: variants?.[keyInit], shouldPassProp, isHOCShouldPassThrough, theme, usedKeys: { ...usedKeys } })
        // rome-ignore lint/nursery/noConsoleLog: ok
        console.log('expanded', expanded, '\nusedKeys', { ...usedKeys }, '\ncurrent', {
          ...style,
        })
      }
      console.groupEnd()
    }

    if (!expanded) continue

    for (const [key, val] of expanded) {
      if (val == null) continue
      if (key in usedKeys) continue

      isMedia = isMediaKey(key)
      isPseudo = key in validPseudoKeys
      isMediaOrPseudo = isMedia || isPseudo

      if (inlineProps?.has(key) || inlineWhenUnflattened?.has(key)) {
        viewProps[key] = props[key] ?? val
      }

      // have to run this logic again here
      const isHOCShouldPassThrough =
        staticConfig.isHOC &&
        (isMediaOrPseudo || staticConfig.parentStaticConfig?.variants?.[keyInit])

      if (isHOCShouldPassThrough) {
        isVariant = variants && key in variants
        passDownProp(viewProps, key, val, isMediaOrPseudo)
        if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
          console.groupCollapsed(` - passing down prop ${key}`)
          // rome-ignore lint/nursery/noConsoleLog: <explanation>
          console.log({ val, after: { ...viewProps[key] } })
          console.groupEnd()
        }
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
          fontFamily,
          true,
          state.noClassNames
        )

        const descriptor = pseudoDescriptors[key as keyof typeof pseudoDescriptors]
        const isEnter = descriptor.name === 'enter'
        const isExit = descriptor.name === 'exit'

        // dev-time warning that helps clear confusion around need for animation  when using enter/exit style
        if (
          process.env.NODE_ENV === 'development' &&
          !state.isAnimated &&
          !state.unmounted &&
          (isEnter || isExit)
        ) {
          console.warn(
            `No animation prop given to component ${
              staticConfig.componentName || ''
            } with enterStyle / exitStyle, these styles will be ignore.`
          )
        }

        // don't continue here on isEnter && !state.unmounted because we need to merge defaults
        if (!descriptor || (isExit && !state.isExiting)) {
          if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
            // prettier-ignore
            // rome-ignore lint/nursery/noConsoleLog: <explanation>
            console.log('skip exit')
          }

          continue
        }

        if (!shouldDoClasses || IS_STATIC) {
          pseudos ||= {}
          pseudos[key] ||= {}

          if (IS_STATIC) {
            Object.assign(pseudos[key], pseudoStyleObject)
          }
        }

        if (shouldDoClasses && !isEnter && !isExit) {
          const pseudoStyles = generateAtomicStyles(pseudoStyleObject, descriptor)

          if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
            // prettier-ignore
            console.groupCollapsed('pseudo (classes)', key)
            // prettier-ignore
            // rome-ignore lint/nursery/noConsoleLog: <explanation>
            console.log({ pseudoStyleObject, pseudoStyles })
            console.groupEnd()
          }

          for (const psuedoStyle of pseudoStyles) {
            const fullKey = `${psuedoStyle.property}${PROP_SPLIT}${descriptor.name}`
            if (fullKey in usedKeys) continue

            addStyleToInsertRules(rulesToInsert, psuedoStyle)
            mergeClassName(
              transforms,
              classNames,
              fullKey,
              psuedoStyle.identifier,
              isMediaOrPseudo
            )
          }
        } else {
          // we don't skip this if disabled because we need to animate to default states that aren't even set:
          // so if we have <Stack enterStyle={{ opacity: 0 }} />
          // we need to animate from 0 => 1 once enter is finished
          // see the if (isDisabled) block below which loops through animatableDefaults

          const descriptorKey = descriptor.stateKey || descriptor.name
          const pseudoState = state[descriptorKey]
          let isDisabled = !pseudoState

          // we never animate in on server side just show the full thing
          // on client side we use CSS to hide the fully in SSR items, then
          // un-hide and replay with original animation.
          if (isWeb && !isClient && isEnter) {
            isDisabled = false
          }

          if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
            // prettier-ignore
            console.groupCollapsed('pseudo', key, !isDisabled)
            // prettier-ignore
            // rome-ignore lint/nursery/noConsoleLog: <explanation>
            console.log(pseudoStyleObject, { isDisabled, descriptorKey, descriptor, pseudoState, state: { ...state } })
            console.groupEnd()
          }

          // if (!isDisabled) {
          //   if (valInit === staticConfig.defaultProps[keyInit]) {
          //     // ignore:
          //     // if it's a default property given by styled(), we don't mark it as used, so
          //     // that props given inline can override:
          //   }
          // }

          const importance = descriptor.priority

          if (!isDisabled) {
            // mark usedKeys based not on pseudoStyleObject
            for (const key in val) {
              const k = shorthands[key] || key
              usedKeys[k] = Math.max(importance, usedKeys[k] || 0)
            }
          }

          for (const pkey in pseudoStyleObject) {
            const val = pseudoStyleObject[pkey]
            // when disabled ensure the default value is set for future animations to align

            if (isDisabled) {
              if (pkey in animatableDefaults && !(pkey in usedKeys)) {
                const defaultVal = animatableDefaults[pkey]
                mergeStyle(styleState, flatTransforms, pkey, defaultVal)
              }
            } else {
              const curImportance = usedKeys[importance] || 0
              const shouldMerge = importance >= curImportance

              if (shouldMerge) {
                pseudos ||= {}
                pseudos[key] ||= {}
                pseudos[key][pkey] = val
                mergeStyle(styleState, flatTransforms, pkey, val)
                usedKeys[pkey] ||= 1
              }
              if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
                // prettier-ignore
                // rome-ignore lint/nursery/noConsoleLog: <explanation>
                console.log('    subKey', pkey, shouldMerge, { importance, curImportance, pkey, val })
              }
            }
          }
        }

        continue
      }

      // media
      if (isMedia) {
        if (!val) continue

        const isPlatformMedia = key.startsWith('$platform-')
        if (isPlatformMedia) {
          const platform = key.slice(10)
          if (platform !== currentPlatform) {
            continue
          }
        }

        hasMedia ||= true

        // THIS USED TO PROXY BACK TO REGULAR PROPS BUT THAT IS THE WRONG BEHAVIOR
        // we avoid passing in default props for media queries because that would confuse things like SizableText.size:

        const mediaStyle = getSubStyle(
          styleState,
          key,
          val,
          fontFamily,
          // TODO try true like pseudo
          false
        )

        const mediaKeyShort = key.slice(1)

        if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
          // prettier-ignore
          // rome-ignore lint/nursery/noConsoleLog: ok
          console.log(`  📺 ${key}`, { key, mediaStyle, props, shouldDoClasses })
        }

        const hasSpace = 'space' in val
        if (hasSpace || !shouldDoClasses) {
          if (!Array.isArray(hasMedia)) {
            hasMedia = []
          }
          hasMedia.push(mediaKeyShort)
        }

        if (shouldDoClasses) {
          if (hasSpace) {
            delete mediaStyle['space']
            if (mediaState[mediaKeyShort]) {
              const importance = getMediaImportanceIfMoreImportant(
                mediaKeyShort,
                'space',
                usedKeys,
                true
              )
              if (importance) {
                space = val['space']
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
          const priority = mediaStylesSeen
          mediaStylesSeen += 1

          for (const style of mediaStyles) {
            const out = createMediaStyle(
              style,
              mediaKeyShort,
              mediaQueryConfig,
              false,
              priority
            )
            const fullKey = `${style.property}${PROP_SPLIT}${mediaKeyShort}`
            if (fullKey in usedKeys) continue
            addStyleToInsertRules(rulesToInsert, out as any)
            mergeClassName(transforms, classNames, fullKey, out.identifier, true)
          }
        } else {
          const isThemeMedia = mediaKeyShort.startsWith('theme-')
          const isPlatformMedia = mediaKeyShort.startsWith('platform-')

          if (!isThemeMedia && !isPlatformMedia) {
            if (!mediaState[mediaKeyShort]) {
              continue
            }
          }

          if (isThemeMedia) {
            // needed to get updates when theme changes
            dynamicThemeAccess = true

            const mediaThemeName = mediaKeyShort.slice(6)
            if (!(themeName === mediaThemeName || themeName.startsWith(mediaThemeName))) {
              continue
            }
          }

          for (const subKey in mediaStyle) {
            const importance = getMediaImportanceIfMoreImportant(
              mediaKeyShort,
              subKey,
              usedKeys,
              mediaState[mediaKeyShort]
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
              usedKeys,
              mediaState[mediaKeyShort]
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
          viewProps[key] = val
          continue
        }
      }

      if (key === 'fontFamily' && !fontFamily && valInit && val) {
        const fam = valInit[0] === '$' ? valInit : val
        if (fam in conf.fontsParsed) {
          fontFamily = fam
        }
      }

      if (
        key in validStyleProps ||
        (process.env.TAMAGUI_TARGET === 'native' && isAndroid && key === 'elevation')
      ) {
        mergeStyle(styleState, flatTransforms, key, val)
        continue
      }

      // pass to view props
      if (!isVariant) {
        viewProps[key] = val
      }
    }

    if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
      console.groupCollapsed(` ✔️ expand complete`, keyInit)
      // rome-ignore lint/nursery/noConsoleLog: <explanation>
      console.log('style', { ...style })
      // rome-ignore lint/nursery/noConsoleLog: <explanation>
      console.log('viewProps', { ...viewProps })
      console.groupEnd()
    }
  }

  // default to default font
  fontFamily ||= conf.defaultFont

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
    if ('elevationAndroid' in style) {
      // @ts-ignore
      style['elevation'] = style.elevationAndroid
      // @ts-ignore
      delete style.elevationAndroid
    }
  }

  // always do this at the very end to preserve the order strictly (animations, origin)
  // and allow proper merging of all pseudos before applying
  if (flatTransforms) {
    mergeFlatTransforms(style, flatTransforms, true)
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
          if (state.isAnimated && props.animateOnly && props.animateOnly.includes(key)) {
            retainedStyles[key] = style[key]
          } else {
            addStyleToInsertRules(rulesToInsert, atomicStyle)
            mergeClassName(transforms, classNames, key, atomicStyle.identifier)
          }
        }
        if (!IS_STATIC && !state.willBeAnimated) {
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

    if (viewProps.tabIndex == undefined) {
      const isFocusable = props.focusable ?? props.accessible

      if (props.focusable) {
        delete props.focusable
      }

      const role = viewProps.role
      if (isFocusable === false) {
        viewProps.tabIndex = '-1'
      }
      if (
        // These native elements are focusable by default
        elementType === 'a' ||
        elementType === 'button' ||
        elementType === 'input' ||
        elementType === 'select' ||
        elementType === 'textarea'
      ) {
        if (isFocusable === false || props.accessibilityDisabled === true) {
          viewProps.tabIndex = '-1'
        }
      } else if (
        // These roles are made focusable by default
        role === 'button' ||
        role === 'checkbox' ||
        role === 'link' ||
        role === 'radio' ||
        // @ts-expect-error (consistent with RNW)
        role === 'textbox' ||
        role === 'switch'
      ) {
        if (isFocusable !== false) {
          viewProps.tabIndex = '0'
        }
      }
      // Everything else must explicitly set the prop
      if (isFocusable === true) {
        viewProps.tabIndex = '0'
        delete viewProps.focusable
      }
    }
  }

  const result: GetStyleResult = {
    space,
    hasMedia,
    fontFamily,
    viewProps,
    // @ts-expect-error
    style,
    pseudos,
    classNames,
    rulesToInsert,
    dynamicThemeAccess,
  }

  if (className) {
    classNames.className = className
  }

  if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
    if (isDevTools) {
      console.groupCollapsed('  🔹 ===>')
      // prettier-ignore
      const logs = { ...result, state, transforms, viewProps, viewPropsOrder: Object.keys(viewProps), rulesToInsert, parentSplitStyles, flatTransforms }
      for (const key in logs) {
        // rome-ignore lint/nursery/noConsoleLog: ok
        console.log(key, logs[key])
      }
      console.groupEnd()
    }
  }

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
  { classNames, viewProps, style, usedKeys }: GetStyleState,
  flatTransforms: FlatTransforms,
  key: string,
  val: any
) {
  if (val?.[0] === '_') {
    classNames[key] = val
    usedKeys[key] ||= 1
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
  fontFamily?: string,
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
      fontFamily,
      languageContext,
      avoidDefaultProps
    )
    if (!expanded || (!staticConfig.isHOC && key in skipProps)) {
      continue
    }
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
  x: 0,
  y: 0,
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
  if (typeof obj.transform === 'string') {
    return
  }
  obj.transform ||= []
  obj.transform[backwards ? 'unshift' : 'push']({
    [mapTransformKeys[key] || key]: val,
  } as any)
}

// we need to match the order for animations to work because it needs consistent order
// was thinking of having something like `state.prevTransformsOrder = ['y', 'x', ...]
// but if we just handle it here its not a big cost and avoids having stateful things
// so the strategy is: always sort by a consistent order, until you run into a "duplicate"
// because you can have something like:
//   [{ translateX: 0 }, { scale: 1 }, { translateX: 10 }]
// so basically we sort until we get to a duplicate... we could sort even smarter but
// this should work for most (all?) of our cases since the order preservation really only needs to apply
// to the "flat" transform props
const mergeFlatTransforms = (
  obj: TextStyleProps,
  flatTransforms: FlatTransforms,
  backwards = false
) => {
  Object.entries(flatTransforms)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([key, val]) => {
      mergeTransform(obj, key, val, backwards)
    })
}

const mapTransformKeys = {
  x: 'translateX',
  y: 'translateY',
}

const skipProps = {
  animation: 1,
  space: 1,
  animateOnly: 1,
  debug: 1,
  componentName: 1,
  disableOptimization: 1,
  tag: 1,
}

if (process.env.NODE_ENV === 'test') {
  skipProps['data-test-renders'] = 1
}

// native only skips
if (process.env.TAMAGUI_TARGET === 'native') {
  Object.assign(skipProps, {
    whiteSpace: 1,
    wordWrap: 1,
    textOverflow: 1,
    textDecorationDistance: 1,
    cursor: 1,
    contain: 1,
    boxSizing: 1,
    boxShadow: 1,
    outlineStyle: 1,
    outlineOffset: 1,
    outlineWidth: 1,
    outlineColor: 1,
  })
} else {
  Object.assign(skipProps, {
    elevationAndroid: 1,
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

function passDownProp(
  viewProps: Object,
  key: string,
  val: any,
  shouldMergeObject = false
) {
  if (shouldMergeObject) {
    const next = {
      ...viewProps[key],
      ...val,
    }
    // need to re-insert it at current position
    delete viewProps[key]
    viewProps[key] = next
  } else {
    viewProps[key] = val
  }
}
