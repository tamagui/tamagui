import {
  currentPlatform,
  isAndroid,
  isClient,
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
  mediaKeyMatch,
  mediaQueryConfig,
  mergeMediaByImportance,
} from '../hooks/useMedia'
import type {
  ClassNamesObject,
  ComponentContextI,
  DebugProp,
  GetStyleResult,
  GetStyleState,
  MediaQueryKey,
  PseudoPropKeys,
  PseudoStyles,
  RulesToInsert,
  SpaceTokens,
  SplitStyleProps,
  StaticConfig,
  StyleObject,
  TamaguiComponentState,
  TamaguiInternalConfig,
  TextStyleProps,
  ThemeParsed,
  ViewStyleWithPseudos,
} from '../types'
import { createMediaStyle } from './createMediaStyle'
import { fixStyles } from './expandStyles'
import { getGroupPropParts } from './getGroupPropParts'
import {
  generateAtomicStyles,
  getStylesAtomic,
  styleToCSS,
  transformsToString,
} from './getStylesAtomic'
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
import { getPropMappedFontFamily, propMapper } from './propMapper'
import { pseudoDescriptors, pseudoPriorities } from './pseudoDescriptors'

const fontFamilyKey = 'fontFamily'

// bugfix for some reason it gets reset
const IS_STATIC = process.env.IS_STATIC === 'is_static'

export type SplitStyles = ReturnType<typeof getSplitStyles>

export type SplitStyleResult = ReturnType<typeof getSplitStyles>

type TransformNamespaceKey = 'transform' | PseudoPropKeys | MediaQueryKey

let conf: TamaguiInternalConfig

type StyleSplitter = (
  props: { [key: string]: any },
  staticConfig: StaticConfig,
  theme: ThemeParsed,
  themeName: string,
  componentState: TamaguiComponentState,
  styleProps: SplitStyleProps,
  parentSplitStyles?: GetStyleResult | null,
  context?: ComponentContextI,
  // web-only
  elementType?: string,
  debug?: DebugProp
) => GetStyleResult

export const PROP_SPLIT = '-'

// if you need and easier way to test performance, you can do something like this
// add this early return somewhere in this file and you can see roughly where it slows down:

// return {
//   space,
//   hasMedia,
//   fontFamily: styleState.fontFamily,
//   viewProps: {
//     children: props.children,
//   },
//   style: {
//     borderColor: props.borderColor,
//     borderWidth: props.borderWidth,
//     padding: props.padding,
//   },
//   pseudos,
//   classNames,
//   rulesToInsert,
//   dynamicThemeAccess,
// }

export const getSplitStyles: StyleSplitter = (
  props,
  staticConfig,
  theme,
  themeName,
  componentState,
  styleProps,
  parentSplitStyles,
  context,
  elementType,
  debug
) => {
  conf = conf || getConfig()
  const { shorthands } = conf
  const {
    isHOC,
    isText,
    variants,
    isReactNative,
    inlineProps,
    inlineWhenUnflattened,
    parentStaticConfig,
    acceptsClassName,
  } = staticConfig
  const validStyleProps = isText ? stylePropsText : validStyles
  const viewProps: GetStyleResult['viewProps'] = {}
  const mediaState = styleProps.mediaState || globalMediaState
  const usedKeys: Record<string, number> = {}
  const shouldDoClasses = acceptsClassName && isWeb && !styleProps.noClassNames
  const rulesToInsert: RulesToInsert = []
  const classNames: ClassNamesObject = {}
  // we need to gather these specific to each media query / pseudo
  // value is [hash, val], so ["-jnjad-asdnjk", "scaleX(1) rotate(10deg)"]
  const transforms: Record<TransformNamespaceKey, [string, string]> = {}

  let pseudos: PseudoStyles | null = null
  let space: SpaceTokens | null = props.space
  let hasMedia: boolean | string[] = false
  let dynamicThemeAccess: boolean | undefined
  let pseudoGroups: Set<string> | undefined
  let mediaGroups: Set<string> | undefined
  let style: ViewStyleWithPseudos = {}
  let className = '' // existing classNames
  let mediaStylesSeen = 0

  /**
   * Not the biggest fan of creating an object but it is a nice API
   */
  const styleState: GetStyleState = {
    curProps: Object.assign({}, props),
    classNames,
    conf,
    props,
    styleProps,
    componentState,
    staticConfig,
    style,
    theme,
    usedKeys,
    viewProps,
    context,
    debug,
  }

  if (
    process.env.NODE_ENV === 'development' &&
    debug &&
    debug !== 'profile' &&
    isClient
  ) {
    console.groupCollapsed('getSplitStyles (collapsed)')

    // biome-ignore lint/suspicious/noConsoleLog: ok
    console.log({
      props,
      staticConfig,
      shouldDoClasses,
      styleProps,
      componentState,
      styleState,
      theme: { ...theme },
    })
    console.groupEnd()
  }

  // handle before the loop so we can mark usedKeys in className
  // since the compiler will optimize to className we just treat className as the more powerful
  //   TODO the compiler should probably just leave things inline if its not flattening
  //   that way it keeps merging order
  if (process.env.TAMAGUI_TARGET === 'web' && typeof props.className === 'string') {
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

  for (const keyOg in props) {
    let keyInit = keyOg
    let valInit = props[keyOg]

    // normalize shorthands up front
    if (!styleProps.disableExpandShorthands) {
      if (keyInit in shorthands) {
        keyInit = shorthands[keyInit]
      }
    }

    if (keyInit === 'className') continue // handled above
    if (keyInit in usedKeys) continue
    if (keyInit in skipProps && !isHOC) {
      if (keyInit === 'group') {
        if (process.env.TAMAGUI_TARGET === 'web') {
          // add container style
          const identifier = `t_group_${valInit}`
          const containerCSS = {
            identifier,
            property: 'container',
            rules: [
              `.${identifier} { container-name: ${valInit}; container-type: inline-size; }`,
            ],
          }
          addStyleToInsertRules(rulesToInsert, containerCSS)
        }
      }
      continue
    }

    const valInitType = typeof valInit

    styleState.curProps[keyInit] = valInit

    // TODO this is duplicated! but seems to be fixing some bugs so leaving got now
    if (process.env.TAMAGUI_TARGET === 'web') {
      if (valInitType === 'string' && valInit[0] === '_') {
        if (keyInit in validStyleProps || keyInit.includes('-')) {
          if (process.env.NODE_ENV === 'development' && debug) {
            // biome-ignore lint/suspicious/noConsoleLog: <explanation>
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
        viewProps['accessibilityRole'] = accessibilityWebRoleToNativeRole[
          valInit
        ] as GetStyleResult['viewProps']['AccessibilityRole']
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

    if (keyInit[0] === '_' && keyInit.startsWith('_style')) {
      mergeStyleProp(styleState, valInit)
      continue
    }

    if (process.env.TAMAGUI_TARGET === 'web') {
      if (!styleProps.noExpand) {
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
          viewProps[isReactNative ? keyInit : 'data-testid'] = valInit
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
              // biome-ignore lint/suspicious/noConsoleLog: ok
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
    }

    /**
     * There's (some) reason to this madness: we want to allow returning media/pseudo from variants
     * Say you have a variant hoverable: { true: { hoverStyle: {} } }
     * We run propMapper first to expand variant, then we run the inner loop and look again
     * for if there's a pseudo/media returned from it.
     */

    const isValidStyleKeyInit = keyInit in validStyleProps
    const isShorthand = keyInit in shorthands

    let isVariant = !isValidStyleKeyInit && variants && keyInit in variants

    const isStyleLikeKey = isShorthand || isValidStyleKeyInit || isVariant

    let isPseudo = keyInit in validPseudoKeys
    let isMedia = !isStyleLikeKey && !isPseudo && isMediaKey(keyInit)
    let isMediaOrPseudo = isMedia || isPseudo

    const isStyleProp =
      isMediaOrPseudo ||
      (isVariant && !styleProps.noExpand) ||
      isValidStyleKeyInit ||
      isShorthand

    if (
      isStyleProp &&
      (props.asChild === 'except-style' || props.asChild === 'except-style-web')
    ) {
      continue
    }

    const shouldPassProp =
      !isStyleProp ||
      // is in parent variants
      (isHOC && parentStaticConfig?.variants && keyInit in parentStaticConfig.variants) ||
      inlineProps?.has(keyInit)

    const parentVariant = parentStaticConfig?.variants?.[keyInit]
    const isHOCShouldPassThrough = Boolean(
      isHOC &&
        (isShorthand ||
          isValidStyleKeyInit ||
          isMediaOrPseudo ||
          parentVariant ||
          keyInit in skipProps)
    )

    const shouldPassThrough = shouldPassProp || isHOCShouldPassThrough

    if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
      console.groupCollapsed(
        `🔹🔹🔹🔹 ${keyOg}${keyInit !== keyOg ? ` (shorthand for ${keyInit})` : ''} ${
          shouldPassThrough ? '(pass)' : ''
        } 🔹🔹🔹🔹`
      )
      // biome-ignore lint/suspicious/noConsoleLog: <explanation>
      console.log({ isVariant, valInit, shouldPassProp })
      if (isClient) {
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log({
          variants,
          variant: variants?.[keyInit],
          isVariant,
          isHOCShouldPassThrough,
          curProps: { ...styleState.curProps },
          parentStaticConfig,
        })
      }
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
      // so *don't* skip applying the styles if its different from the parent one
      if (!isVariant) {
        continue
      }
    }

    // after shouldPassThrough
    if (!styleProps.noSkip) {
      if (keyInit in skipProps) continue
    }

    // we sort of have to update fontFamily all the time: before variants run, after each variant
    if (isText) {
      if (
        valInit &&
        (keyInit === fontFamilyKey || keyInit === shorthands[fontFamilyKey]) &&
        valInit in conf.fontsParsed
      ) {
        styleState.fontFamily = valInit
      }
    }

    // micro bench optimize
    if (
      process.env.TAMAGUI_TARGET === 'native' &&
      isValidStyleKeyInit &&
      !variants &&
      (valInitType === 'number' || (valInitType === 'string' && valInit[0] !== '$'))
    ) {
      style[keyInit] = valInit
      continue
    }

    const avoidPropMap = isMediaOrPseudo || (!isVariant && !isValidStyleKeyInit)

    const expanded = avoidPropMap
      ? ([[keyInit, valInit]] as const)
      : propMapper(keyInit, valInit, styleState)

    const next = getPropMappedFontFamily(expanded)
    if (next) {
      styleState.fontFamily = next
    }

    if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
      console.groupCollapsed('  💠 expanded', keyInit, valInit)
      try {
        if (!isServer && isDevTools) {
          // biome-ignore lint/suspicious/noConsoleLog: <explanation>
          console.log({
            expanded,
            styleProps,
            componentState,
            isVariant,
            variant: variants?.[keyInit],
            shouldPassProp,
            isHOCShouldPassThrough,
            theme,
            usedKeys: { ...usedKeys },
            curProps: { ...styleState.curProps },
          })
          // biome-ignore lint/suspicious/noConsoleLog: ok
          console.log('expanded', expanded, '\nusedKeys', { ...usedKeys }, '\ncurrent', {
            ...style,
          })
        }
      } catch {
        // rn can run into PayloadTooLargeError: request entity too large
      }
      console.groupEnd()
    }

    if (!expanded) continue

    for (const [key, val] of expanded) {
      if (val == null) continue
      if (key in usedKeys) continue

      isPseudo = key in validPseudoKeys
      isMedia = !isPseudo && !isValidStyleKeyInit && isMediaKey(key)
      isMediaOrPseudo = isMedia || isPseudo
      isVariant = variants && key in variants

      if (inlineProps?.has(key) || (IS_STATIC && inlineWhenUnflattened?.has(key))) {
        viewProps[key] = props[key] ?? val
      }

      // have to run this logic again here because expansions may need to be passed down
      // see StyledButtonVariantPseudoMerge test
      const shouldPassThrough =
        (styleProps.noExpand && isPseudo) ||
        (isHOC && (isMediaOrPseudo || parentStaticConfig?.variants?.[keyInit]))

      if (shouldPassThrough) {
        passDownProp(viewProps, key, val, isMediaOrPseudo)
        if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
          console.groupCollapsed(` - passing down prop ${key}`)
          // biome-ignore lint/suspicious/noConsoleLog: <explanation>
          console.log({ val, after: { ...viewProps[key] } })
          console.groupEnd()
        }
        continue
      }

      if (isPseudo) {
        if (!val) continue

        // TODO can avoid processing this if !shouldDoClasses + state is off
        // (note: can't because we need to set defaults on enter/exit or else enforce that they should)
        const pseudoStyleObject = getSubStyle(
          styleState,
          key,
          val,
          styleProps.noClassNames
        )

        const descriptor = pseudoDescriptors[key as keyof typeof pseudoDescriptors]
        const isEnter = key === 'enterStyle'
        const isExit = key === 'exitStyle'

        // dev-time warning that helps clear confusion around need for animation  when using enter/exit style
        if (
          process.env.NODE_ENV === 'development' &&
          !styleProps.isAnimated &&
          !componentState.unmounted &&
          (isEnter || isExit)
        ) {
          console.warn(
            `No animation prop given to component ${staticConfig.componentName || ''} ${
              props['data-at'] || ''
            } with enterStyle / exitStyle, these styles will be ignored`,
            { props }
          )
        }

        // don't continue here on isEnter && !state.unmounted because we need to merge defaults
        if (!descriptor || (isExit && !styleProps.isExiting)) {
          continue
        }

        if (!shouldDoClasses || IS_STATIC) {
          pseudos ||= {}
          pseudos[key] ||= {}

          if (IS_STATIC) {
            Object.assign(pseudos[key], pseudoStyleObject)
            continue
          }
        }

        if (shouldDoClasses && !isEnter && !isExit) {
          const pseudoStyles = generateAtomicStyles(pseudoStyleObject, descriptor)

          if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
            // prettier-ignore
            console.groupCollapsed("pseudo (classes)", key);

            // biome-ignore lint/suspicious/noConsoleLog: <explanation>
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
              isMediaOrPseudo,
              true
            )
          }
        } else {
          // we don't skip this if disabled because we need to animate to default states that aren't even set:
          // so if we have <Stack enterStyle={{ opacity: 0 }} />
          // we need to animate from 0 => 1 once enter is finished
          // see the if (isDisabled) block below which loops through animatableDefaults

          const descriptorKey = descriptor.stateKey || descriptor.name
          const pseudoState = componentState[descriptorKey]
          let isDisabled = isExit ? !styleProps.isExiting : !pseudoState

          // we never animate in on server side just show the full thing
          // on client side we use CSS to hide the fully in SSR items, then
          // un-hide and replay with original animation.
          if (isWeb && !isClient && isEnter) {
            isDisabled = false
          }

          if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
            // prettier-ignore
            console.groupCollapsed("pseudo", key, { isDisabled });

            // biome-ignore lint/suspicious/noConsoleLog: <explanation>
            console.log(pseudoStyleObject, {
              isDisabled,
              descriptorKey,
              descriptor,
              pseudoState,
              state: { ...componentState },
            })
            console.groupEnd()
          }

          const importance = descriptor.priority

          for (const pkey in pseudoStyleObject) {
            const val = pseudoStyleObject[pkey]
            // when disabled ensure the default value is set for future animations to align

            if (isDisabled) {
              if (pkey in animatableDefaults && !(pkey in usedKeys)) {
                const defaultVal = animatableDefaults[pkey]
                mergeStyle(styleState, pkey, defaultVal)
              }
            } else {
              const curImportance = usedKeys[pkey] || 0
              const shouldMerge = importance >= curImportance

              if (shouldMerge) {
                pseudos ||= {}
                pseudos[key] ||= {}
                pseudos[key][pkey] = val
                mergeStyle(styleState, pkey, val)
              }

              if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
                // biome-ignore lint/suspicious/noConsoleLog: <explanation>
                console.log('    subKey', pkey, shouldMerge, {
                  importance,
                  curImportance,
                  pkey,
                  val,
                  transforms: { ...styleState.transforms },
                })
              }
            }
          }

          // set this after the loop over pseudoStyleObject so it applies before setting usedKeys
          if (!isDisabled) {
            // mark usedKeys based on pseudoStyleObject
            for (const key in val) {
              const k = shorthands[key] || key
              usedKeys[k] = Math.max(importance, usedKeys[k] || 0)
            }
          }
        }

        continue
      }
      // media
      else if (isMedia) {
        if (!val) continue

        const isPlatformMedia = key.startsWith('$platform-')
        if (isPlatformMedia) {
          const platform = key.slice(10)
          if (
            // supports web, ios, android
            platform !== currentPlatform &&
            // supports web, native
            platform !== process.env.TAMAGUI_TARGET
          ) {
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
          // TODO try true like pseudo
          false
        )

        const mediaKeyShort = key.slice(1)

        if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
          // biome-ignore lint/suspicious/noConsoleLog: ok
          console.log(`  📺 ${key}`, {
            key,
            val,
            mediaStyle,
            props,
            shouldDoClasses,
            componentState,
          })
        }

        // for some reason 'space' in val upsetting next ssr during prod build
        // technically i guess this also will not apply if 0 space which makes sense?
        const hasSpace = val['space']
        if (hasSpace || !shouldDoClasses) {
          if (!Array.isArray(hasMedia)) {
            hasMedia = []
          }
          hasMedia.push(mediaKeyShort)
        }

        if (shouldDoClasses) {
          if (hasSpace) {
            delete mediaStyle['space']
            // TODO group/theme/platform + space support (or just make it official not supported in favor of gap)
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
                  // biome-ignore lint/suspicious/noConsoleLog: <explanation>
                  console.log(
                    `Found more important space for current media ${mediaKeyShort}: ${val} (importance: ${importance})`
                  )
                }
              }
            }
          }

          const mediaStyles = getStylesAtomic(mediaStyle, debug)
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
            mergeClassName(transforms, classNames, fullKey, out.identifier, true, true)
          }
        } else {
          const isThemeMedia = !isPlatformMedia && mediaKeyShort.startsWith('theme-')
          const isGroupMedia =
            !isPlatformMedia && !isThemeMedia && mediaKeyShort.startsWith('group-')

          if (!isThemeMedia && !isPlatformMedia && !isGroupMedia) {
            if (!mediaState[mediaKeyShort]) {
              continue
            }
          }

          let importanceBump = 0

          if (isThemeMedia) {
            // needed to get updates when theme changes
            dynamicThemeAccess = true
            const mediaThemeName = mediaKeyShort.slice(6)
            if (!(themeName === mediaThemeName || themeName.startsWith(mediaThemeName))) {
              continue
            }
          } else if (isGroupMedia) {
            const groupInfo = getGroupPropParts(mediaKeyShort)
            const groupName = groupInfo.name

            // $group-x
            const groupContext = context?.groups.state[groupName]
            if (!groupContext) {
              if (process.env.NODE_ENV === 'development' && debug) {
                console.warn(`No parent with group prop, skipping styles: ${groupName}`)
              }
              continue
            }

            const groupPseudoKey = groupInfo.pseudo
            const groupMediaKey = groupInfo.media
            const componentGroupState = componentState.group?.[groupName]

            if (groupMediaKey) {
              mediaGroups ||= new Set()
              mediaGroups.add(groupMediaKey)
              const mediaState = componentGroupState?.media
              let isActive = mediaState?.[groupMediaKey]
              // use parent styles if width and height hardcoded we can do an inline media match and avoid double render
              if (!mediaState && groupContext.layout) {
                isActive = mediaKeyMatch(groupMediaKey, groupContext.layout)
              }
              if (!isActive) continue
              importanceBump = 2
            }

            if (groupPseudoKey) {
              pseudoGroups ||= new Set()
              pseudoGroups.add(groupName)
              const componentGroupPseudoState = (
                componentGroupState ||
                // fallback to context initially
                context.groups.state[groupName]
              ).pseudo
              const isActive = componentGroupPseudoState?.[groupPseudoKey]
              if (!isActive) continue
              const priority = pseudoPriorities[groupPseudoKey]
              importanceBump = priority
            }
          }

          for (const subKey in mediaStyle) {
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
              mediaState[mediaKeyShort],
              importanceBump
            )
            if (key === fontFamilyKey) {
              styleState.fontFamily = mediaStyle.fontFamily as string
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

      if (
        // is HOC we can just pass through the styles as props
        // this fixes issues where style prop got merged with wrong priority
        !isHOC &&
        (key in validStyleProps ||
          (process.env.TAMAGUI_TARGET === 'native' && isAndroid && key === 'elevation'))
      ) {
        mergeStyle(styleState, key, val)
        continue
      }

      // pass to view props
      if (!isVariant) {
        viewProps[key] = val
      }
    }

    if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
      console.groupCollapsed(` ✔️ expand complete`, keyInit)
      try {
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log('style', { ...style })
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log('transforms', { ...transforms })
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log('viewProps', { ...viewProps })
      } catch {
        // RN can run into PayloadTooLargeError: request entity too large
      }
      console.groupEnd()
    }
  } // end prop loop

  // merge after the prop loop - this way pseudos apply and set usedKeys and then this wont clobber them
  // otherwise styled(styleable(), { bg: 'red', pressStyle: { bg: 'pink' } })
  // will pass down a style={} + pressStyle={} but pressStyle will go behind style depending on how you pass it
  // also it makes sense that props.style is basically the last to apply,
  // at least more sense than "it applies at the position its defined in the prop loop"
  if (props.style) {
    mergeStyleProp(styleState, props.style)
  }

  if (!styleProps.noNormalize) {
    fixStyles(style)

    // shouldnt this be better? but breaks some tests wierdly, need to check
    // if (isWeb && !staticConfig.isReactNative) {
    if (isWeb && !staticConfig.isReactNative) {
      styleToCSS(style)
    }

    // these are only the flat transforms
    // always do this at the very end to preserve the order strictly (animations, origin)
    // and allow proper merging of all pseudos before applying
    if (styleState.transforms) {
      // we need to match the order for animations to work because it needs consistent order
      // was thinking of having something like `state.prevTransformsOrder = ['y', 'x', ...]
      // but if we just handle it here its not a big cost and avoids having stateful things
      // so the strategy is: always sort by a consistent order, until you run into a "duplicate"
      // because you can have something like:
      //   [{ translateX: 0 }, { scale: 1 }, { translateX: 10 }]
      // so basically we sort until we get to a duplicate... we could sort even smarter but
      // this should work for most (all?) of our cases since the order preservation really only needs to apply
      // to the "flat" transform props
      Object.entries(styleState.transforms)
        .sort(([a], [b]) => a.localeCompare(b))
        .forEach(([key, val]) => {
          mergeTransform(style, key, val, true)
        })

      // Button for example uses disableClassName: true but renders to a 'button' element, so needs this
      if (process.env.TAMAGUI_TARGET === 'web') {
        if (
          !staticConfig.isReactNative &&
          !styleProps.isAnimated &&
          Array.isArray(style.transform)
        ) {
          style.transform = transformsToString(style.transform) as any
        }
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
  }

  if (process.env.TAMAGUI_TARGET === 'web') {
    if (shouldDoClasses) {
      let retainedStyles: ViewStyleWithPseudos | undefined
      let shouldRetain = false

      if (style['$$css']) {
        // avoid re-processing for rnw
      } else {
        const atomic = getStylesAtomic(style)

        for (const atomicStyle of atomic) {
          const key = atomicStyle.property
          const isAnimatedAndAnimateOnly =
            styleProps.isAnimated &&
            styleProps.noClassNames &&
            (!props.animateOnly || props.animateOnly.includes(key))

          // or not animated but you have animateOnly
          // (moves it to style={}, nice to avoid generating lots of classnames)
          const nonAnimatedAnimateOnly =
            !isAnimatedAndAnimateOnly &&
            !styleProps.isAnimated &&
            props.animateOnly?.includes(key)

          if (isAnimatedAndAnimateOnly) {
            retainedStyles ||= {}
            retainedStyles[key] = style[key]
          } else if (nonAnimatedAnimateOnly) {
            retainedStyles ||= {}
            retainedStyles[key] = atomicStyle.value
            shouldRetain = true
          } else {
            addStyleToInsertRules(rulesToInsert, atomicStyle)
            mergeClassName(
              transforms,
              classNames,
              key,
              atomicStyle.identifier,
              false,
              true
            )
          }
        }

        if (shouldRetain || (!IS_STATIC && !styleProps.keepStyleSSR)) {
          style = retainedStyles || {}
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

    if (isWeb && !isReactNative) {
      if (viewProps.tabIndex == null) {
        const isFocusable = viewProps.focusable ?? viewProps.accessible

        if (viewProps.focusable) {
          delete viewProps.focusable
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
        if (isFocusable) {
          viewProps.tabIndex = '0'
          delete viewProps.focusable
        }
      }
    }
  }

  const result: GetStyleResult = {
    space,
    hasMedia,
    fontFamily: styleState.fontFamily,
    viewProps,
    // @ts-expect-error
    style,
    pseudos,
    classNames,
    rulesToInsert,
    dynamicThemeAccess,
    pseudoGroups,
    mediaGroups,
  }

  // native: swap out the right family based on weight/style
  if (process.env.TAMAGUI_TARGET === 'native') {
    if (style.fontFamily) {
      const faceInfo = getFont(style.fontFamily as string)?.face
      if (faceInfo) {
        const overrideFace =
          faceInfo[style.fontWeight as string]?.[style.fontStyle || 'normal']?.val
        if (overrideFace) {
          style.fontFamily = overrideFace
          styleState.fontFamily = overrideFace
          // If we pass both font family (e.g. InterBold) and a font weight (e.g. 900), android gets confused and just shows the default font, so we remove these:
          delete style.fontWeight
          delete style.fontStyle
        }
      }
      if (process.env.NODE_ENV === 'development' && debug && debug !== 'profile') {
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log(`Found fontFamily native: ${style.fontFamily}`, faceInfo)
      }
    }
  }

  if (className) {
    classNames.className = className
  }

  if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
    if (isDevTools) {
      console.groupCollapsed('  🔹 ===>')
      try {
        // prettier-ignore
        const logs = {
          ...result,
          componentState,
          transforms,
          viewProps,
          viewPropsOrder: Object.keys(viewProps),
          rulesToInsert,
          parentSplitStyles,
        };
        for (const key in logs) {
          // biome-ignore lint/suspicious/noConsoleLog: ok
          console.log(key, logs[key])
        }
      } catch {
        // RN can run into PayloadTooLargeError: request entity too large
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
  isMediaOrPseudo = false,
  isInsertingNow = false
) {
  if (process.env.TAMAGUI_TARGET === 'web') {
    // empty classnames passed by compiler sometimes
    if (!val) return
    if (!isInsertingNow && val[0] === '_' && val.startsWith('_transform-')) {
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

function mergeStyle(styleState: GetStyleState, key: string, val: any) {
  const { classNames, viewProps, style, usedKeys, styleProps } = styleState
  if (isWeb && val?.[0] === '_') {
    classNames[key] = val
    usedKeys[key] ||= 1
  } else if (key in stylePropsTransform) {
    styleState.transforms ||= {}
    styleState.transforms[key] = val
  } else {
    const out =
      isWeb && !styleProps.noNormalize ? normalizeValueWithProperty(val, key) : val
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
  avoidMergeTransform?: boolean
): TextStyleProps => {
  const { staticConfig, props, conf, styleProps } = styleState
  const styleOut: TextStyleProps = {}

  for (let key in styleIn) {
    const val = styleIn[key]
    key = conf.shorthands[key] || key
    const expanded = propMapper(key, val, styleState, { ...props, ...props[subKey] })
    if (!expanded || (!staticConfig.isHOC && key in skipProps && !styleProps.noSkip)) {
      continue
    }
    for (const [skey, sval] of expanded) {
      if (!avoidMergeTransform && skey in stylePropsTransform) {
        mergeTransform(styleOut, skey, sval)
      } else {
        styleOut[skey] = styleProps.noNormalize
          ? sval
          : normalizeValueWithProperty(sval, key)
      }
    }
  }

  if (!styleProps.noNormalize) {
    fixStyles(styleOut)
  }

  return styleOut
}

function mergeStyleProp(styleState: GetStyleState, val: any) {
  if (!val) return
  const styles = [].concat(val).flat()
  for (const cur of styles) {
    if (!cur) continue
    const isRNW = cur['$$css']
    if (isRNW) {
      Object.assign(styleState.classNames, cur)
    } else {
      for (const key in cur) {
        if (key in styleState.usedKeys) {
          continue
        }
        mergeStyle(styleState, key, cur[key])
      }
    }
  }
}

// on native no need to insert any css
const useInsertEffectCompat = isWeb
  ? useInsertionEffect || useIsomorphicLayoutEffect
  : () => {}

export const useSplitStyles: StyleSplitter = (...args) => {
  const res = getSplitStyles(...args)

  useInsertEffectCompat(() => {
    insertStyleRules(res.rulesToInsert)
  }, [res.rulesToInsert])

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

const mapTransformKeys = {
  x: 'translateX',
  y: 'translateY',
}

const skipProps = {
  untilMeasured: 1,
  animation: 1,
  space: 1,
  animateOnly: 1,
  disableClassName: 1,
  debug: 1,
  componentName: 1,
  disableOptimization: 1,
  tag: 1,
  style: 1, // handled after loop so pseudos set usedKeys and override it if necessary
  group: 1,
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
    allowFontScaling: true,
    adjustsFontSizeToFit: true,
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
