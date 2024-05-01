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
  tokenCategories,
  validPseudoKeys,
  validStyles,
} from '@tamagui/helpers'
import { useInsertionEffect } from 'react'

import { getConfig, getFont } from '../config'
import { accessibilityDirectMap } from '../constants/accessibilityDirectMap'
import { webViewFlexCompatStyles } from '../constants/constants'
import { isDevTools } from '../constants/isDevTools'
import {
  getMediaImportanceIfMoreImportant,
  mediaState as globalMediaState,
  isMediaKey,
  mediaKeyMatch,
  mediaQueryConfig,
} from '../hooks/useMedia'
import type { TamaguiComponentState } from '../interfaces/TamaguiComponentState'
import type {
  ClassNamesObject,
  ComponentContextI,
  DebugProp,
  GetStyleResult,
  GetStyleState,
  IsMediaType,
  MediaQueryKey,
  PseudoPropKeys,
  PseudoStyles,
  RulesToInsert,
  SpaceTokens,
  SplitStyleProps,
  StaticConfig,
  StyleObject,
  TamaguiInternalConfig,
  TextStyleProps,
  ThemeParsed,
  ViewStyleWithPseudos,
} from '../types'
import { createMediaStyle } from './createMediaStyle'
import { fixStyles } from './expandStyles'
import { getGroupPropParts } from './getGroupPropParts'
import { getStyleAtomic, getStylesAtomic, styleToCSS } from './getStylesAtomic'
import {
  insertStyleRules,
  insertedTransforms,
  scanAllSheets,
  shouldInsertStyleRules,
  updateRules,
} from './insertStyleRule'
import { log } from './log'
import {
  normalizeValueWithProperty,
  reverseMapClassNameToValue,
} from './normalizeValueWithProperty'
import { getPropMappedFontFamily, propMapper } from './propMapper'
import { pseudoDescriptors, pseudoPriorities } from './pseudoDescriptors'
import { skipProps } from './skipProps'
import { transformsToString } from './transformsToString'

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
  debug?: DebugProp,
  skipThemeTokenResolution?: boolean
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

function isValidStyleKey(key: string, staticConfig: StaticConfig) {
  const validStyleProps =
    staticConfig.validStyles ||
    (staticConfig.isText || staticConfig.isInput ? stylePropsText : validStyles)
  return validStyleProps[key] || staticConfig.accept?.[key]
}

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
  debug,
  skipThemeTokenResolution
) => {
  conf = conf || getConfig()

  // a bit icky, we need no normalize but not fully
  if (
    isWeb &&
    styleProps.isAnimated &&
    conf.animations.isReactNative &&
    !styleProps.noNormalize
  ) {
    styleProps.noNormalize = 'values'
  }

  const { shorthands } = conf
  const {
    isHOC,
    isText,
    isInput,
    variants,
    isReactNative,
    inlineProps,
    inlineWhenUnflattened,
    parentStaticConfig,
    acceptsClassName,
  } = staticConfig

  const viewProps: GetStyleResult['viewProps'] = {}
  const mediaState = styleProps.mediaState || globalMediaState
  const usedKeys: Record<string, number> = {}
  const shouldDoClasses = acceptsClassName && isWeb && !styleProps.noClassNames
  const rulesToInsert: RulesToInsert =
    process.env.TAMAGUI_TARGET === 'native' ? (undefined as any) : []
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
  let className = (props.className as string) || '' // existing classNames
  let mediaStylesSeen = 0

  /**
   * Not the biggest fan of creating an object but it is a nice API
   */
  const styleState: GetStyleState = {
    curProps: {},
    classNames,
    conf,
    props,
    styleProps,
    componentState,
    staticConfig,
    style: null,
    theme,
    usedKeys,
    viewProps,
    context,
    debug,
    skipThemeTokenResolution,
  }

  if (
    process.env.NODE_ENV === 'development' &&
    debug &&
    debug !== 'profile' &&
    isClient
  ) {
    console.groupCollapsed('getSplitStyles (collapsed)')
    log({
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

  for (const keyOg in props) {
    let keyInit = keyOg
    let valInit = props[keyOg]

    if (
      staticConfig.accept &&
      (staticConfig.accept[keyInit] === 'style' ||
        staticConfig.accept[keyInit] === 'textStyle') &&
      typeof valInit === 'object'
    ) {
      const styleObject = getSubStyle(
        styleState,
        keyInit,
        valInit,
        styleProps.noClassNames
      )
      viewProps[keyInit] = styleObject
      continue
    }

    if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
      // otherwise things just keep nesting - careful don't leave these around
      // they cause big performance dips in Chrome, only use them when debug prop set
      console.groupEnd()
    }

    // normalize shorthands up front
    if (!styleProps.disableExpandShorthands) {
      if (keyInit in shorthands) {
        keyInit = shorthands[keyInit]
      }
    }

    if (keyInit === 'className') continue // handled above first
    if (keyInit in usedKeys) continue

    if (process.env.TAMAGUI_TARGET === 'web') {
      // skip the webViewFlexCompatStyles when asChild on web
      if (props.asChild && webViewFlexCompatStyles[keyInit] === valInit) {
        continue
      }
    }

    // keyInit === 'style' is handled in skipProps
    if (keyInit in skipProps && !styleProps.noSkip && !isHOC) {
      if (keyInit === 'group') {
        if (process.env.TAMAGUI_TARGET === 'web') {
          // add container style
          const identifier = `t_group_${valInit}`
          const containerType = conf.settings.webContainerType || 'inline-size'
          const containerCSS = {
            identifier,
            property: 'container',
            rules: [
              `.${identifier} { container-name: ${valInit}; container-type: ${containerType}; }`,
            ],
          }
          addStyleToInsertRules(rulesToInsert, containerCSS)
        }
      }
      continue
    }

    const valInitType = typeof valInit
    const isValidStyleKeyInit = isValidStyleKey(keyInit, staticConfig)

    if (process.env.TAMAGUI_TARGET === 'web') {
      if (isValidStyleKeyInit && valInitType === 'string') {
        if (valInit[0] === '_') {
          const isValidClassName = keyInit in validStyles
          const isMediaOrPseudo =
            !isValidClassName &&
            // media are flattened for some reason to color-hover keys,
            // we should probably just leave them in place to avoid extra complexity
            keyInit.includes(PROP_SPLIT) &&
            validStyles[keyInit.split(PROP_SPLIT)[0]]

          if (isValidClassName || isMediaOrPseudo) {
            if (shouldDoClasses) {
              mergeClassName(transforms, classNames, keyInit, valInit, isMediaOrPseudo)
              if (styleState.style) {
                delete styleState.style[keyInit]
              }
            } else {
              styleState.style ||= {}
              styleState.style[keyInit] = reverseMapClassNameToValue(keyInit, valInit)
              delete classNames[keyInit]
            }
            continue
          }
        }
      }
    }

    if (valInit !== props[keyInit]) {
      // we collect updated props as we go, for functional variants later
      // functional variants receive a prop object that represents the current
      // props at that point in the loop
      styleState.curProps[keyInit] = valInit
    }

    if (process.env.TAMAGUI_TARGET === 'native') {
      if (!isValidStyleKeyInit) {
        if (!isAndroid) {
          // only works in android
          if (keyInit === 'elevationAndroid') continue
        }

        // map userSelect to native prop
        if (keyInit === 'userSelect') {
          keyInit = 'selectable'
          valInit = valInit === 'none' ? false : true
        } else if (keyInit.startsWith('data-')) {
          continue
        }
      }
    }

    if (keyInit === 'dataSet') {
      for (const keyInit in valInit) {
        viewProps[`data-${hyphenate(keyInit)}`] = valInit[keyInit]
      }
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
          // nativeId now deprecated for RN
          viewProps.id = valInit
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
          }
          // TODO: remove this in the future when react native a11y API is removed
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

        if (didUseKeyInit) {
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

    const isShorthand = keyInit in shorthands

    let isVariant = !isValidStyleKeyInit && variants && keyInit in variants

    const isStyleLikeKey = isShorthand || isValidStyleKeyInit || isVariant

    let isPseudo = keyInit in validPseudoKeys
    let isMedia: IsMediaType = !isStyleLikeKey && !isPseudo && isMediaKey(keyInit)
    let isMediaOrPseudo = Boolean(isMedia || isPseudo)

    if (isMediaOrPseudo && keyInit.startsWith('$group-')) {
      const name = keyInit.split('-')[1]
      // for simple group, name is not in the key
      if (context?.groups.subscribe && !context?.groups.state[name]) {
        keyInit = keyInit.replace('$group-', `$group-true-`)
      }
    }

    const isStyleProp =
      isValidStyleKeyInit ||
      isMediaOrPseudo ||
      (isVariant && !styleProps.noExpand) ||
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
      console.groupEnd() // react native was not nesting right
      console.groupEnd() // react native was not nesting right
      console.groupCollapsed(
        `  🔑 ${keyOg}${keyInit !== keyOg ? ` (shorthand for ${keyInit})` : ''} ${
          shouldPassThrough ? '(pass)' : ''
        }`
      )
      log({ isVariant, valInit, shouldPassProp })
      if (isClient) {
        log({
          variants,
          variant: variants?.[keyInit],
          isVariant,
          isHOCShouldPassThrough,
          curProps: { ...styleState.curProps },
          parentStaticConfig,
        })
      }
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
        if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
          console.groupEnd()
        }
        continue
      }
    }

    // after shouldPassThrough
    if (!styleProps.noSkip) {
      if (keyInit in skipProps) {
        if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
          console.groupEnd()
        }
        continue
      }
    }

    // we sort of have to update fontFamily all the time: before variants run, after each variant
    if (isText || isInput) {
      if (
        valInit &&
        (keyInit === 'fontFamily' || keyInit === shorthands['fontFamily']) &&
        valInit in conf.fontsParsed
      ) {
        styleState.fontFamily = valInit
      }
    }

    const avoidPropMap = isMediaOrPseudo || (!isVariant && !isValidStyleKeyInit)
    const expanded = avoidPropMap ? null : propMapper(keyInit, valInit, styleState)

    if (!avoidPropMap) {
      if (!expanded) continue
      const next = getPropMappedFontFamily(expanded)
      if (next) {
        styleState.fontFamily = next
      }
    }

    if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
      console.groupCollapsed('  💠 expanded', keyInit, valInit)
      try {
        if (!isServer && isDevTools) {
          log({
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
          log('expanded', expanded, '\nusedKeys', { ...usedKeys }, '\ncurrent', {
            ...styleState.style,
          })
        }
      } catch {
        // rn can run into PayloadTooLargeError: request entity too large
      }
      console.groupEnd()
    }

    let key = keyInit
    let val = valInit
    const max = expanded ? expanded.length : 1

    // before we just made an array if avoidPropMap, but to avoid making extra arrays in a perf sensitive area
    // now we do this part more imperatively. saves making a nested array for each prop key on every component
    for (let i = 0; i < max; i++) {
      if (expanded) {
        const [k, v] = expanded[i]
        key = k
        val = v
      }

      if (val == null) continue
      if (key in usedKeys) continue

      isPseudo = key in validPseudoKeys
      isMedia = !isPseudo && !isValidStyleKeyInit && isMediaKey(key)
      isMediaOrPseudo = Boolean(isMedia || isPseudo)
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
          log({ val, after: { ...viewProps[key] } })
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

        // don't continue here on isEnter && !state.unmounted because we need to merge defaults
        if (!descriptor) {
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

        // on server only generate classes for enterStyle
        if (shouldDoClasses && !isExit) {
          const pseudoStyles = getStyleAtomic(pseudoStyleObject, descriptor)

          if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
            // prettier-ignore
            console.groupCollapsed('pseudo (classes)', key)

            log({ pseudoStyleObject, pseudoStyles })
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
        }

        if (!shouldDoClasses || isExit || isEnter) {
          // we don't skip this if disabled because we need to animate to default states that aren't even set:
          // so if we have <Stack enterStyle={{ opacity: 0 }} />
          // we need to animate from 0 => 1 once enter is finished
          // see the if (isDisabled) block below which loops through animatableDefaults

          const descriptorKey = descriptor.stateKey || descriptor.name

          let isDisabled = componentState[descriptorKey] === false
          if (isExit) {
            isDisabled = !styleProps.isExiting
          }
          if (isEnter) {
            isDisabled =
              componentState.unmounted === 'should-enter'
                ? true
                : !componentState.unmounted
          }

          if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
            console.groupCollapsed('pseudo', key, { isDisabled })
            log({ pseudoStyleObject, isDisabled, descriptor, componentState })
            console.groupEnd()
          }

          const importance = descriptor.priority

          for (const pkey in pseudoStyleObject) {
            const val = pseudoStyleObject[pkey]
            // when disabled ensure the default value is set for future animations to align

            if (isDisabled) {
              const defaultValues = animatableDefaults[pkey]
              if (
                defaultValues != null &&
                !(pkey in usedKeys) &&
                (!styleState.style || !(pkey in styleState.style))
              ) {
                mergeStyle(styleState, pkey, defaultValues)
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
                log('    subKey', pkey, shouldMerge, {
                  importance,
                  curImportance,
                  pkey,
                  val,
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
      if (isMedia) {
        if (!val) continue

        if (isMedia === 'platform') {
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

        const mediaKeyShort = key.slice(1)

        if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
          log(`  📺 ${key}`, {
            key,
            val,
            props,
            shouldDoClasses,
            acceptsClassName,
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
          const mediaStyle = getSubStyle(styleState, key, val, false)

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
                  log(
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
              isMedia,
              false,
              priority
            )
            if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
              log(`📺 media style:`, out)
            }
            const fullKey = `${style.property}${PROP_SPLIT}${mediaKeyShort}${
              style.pseudo || ''
            }`
            if (fullKey in usedKeys) continue
            addStyleToInsertRules(rulesToInsert, out as any)
            mergeClassName(transforms, classNames, fullKey, out.identifier, true, true)
          }
        } else {
          const mediaStyle = getSubStyle(styleState, key, val, true)
          const isThemeMedia = isMedia === 'theme'
          const isGroupMedia = isMedia === 'group'
          const isPlatformMedia = isMedia === 'platform'

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
            styleState.style ||= {}
            mergeMediaByImportance(
              styleState,
              mediaKeyShort,
              subKey,
              mediaStyle[subKey],
              usedKeys,
              mediaState[mediaKeyShort],
              importanceBump
            )
            if (key === 'fontFamily') {
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
        (isValidStyleKey(key, staticConfig) ||
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
      try {
        log(` ✔️ expand complete`, keyInit)
        log('style', { ...styleState.style })
        log('transforms', { ...transforms })
        log('viewProps', { ...viewProps })
      } catch {
        // RN can run into PayloadTooLargeError: request entity too large
      }
      console.groupEnd()
    }
  } // end prop loop

  // style prop after:

  const avoidNormalize = styleProps.noNormalize === false

  if (!avoidNormalize) {
    if (styleState.style) {
      fixStyles(styleState.style)

      // shouldn't this be better? but breaks some tests weirdly, need to check
      // if (isWeb && !staticConfig.isReactNative) {
      if (isWeb && !staticConfig.isReactNative) {
        styleToCSS(styleState.style)
      }
    }

    // these are only the flat transforms
    // always do this at the very end to preserve the order strictly (animations, origin)
    // and allow proper merging of all pseudos before applying
    if (styleState.flatTransforms) {
      // we need to match the order for animations to work because it needs consistent order
      // was thinking of having something like `state.prevTransformsOrder = ['y', 'x', ...]
      // but if we just handle it here its not a big cost and avoids having stateful things
      // so the strategy is: always sort by a consistent order, until you run into a "duplicate"
      // because you can have something like:
      //   [{ translateX: 0 }, { scale: 1 }, { translateX: 10 }]
      // so basically we sort until we get to a duplicate... we could sort even smarter but
      // this should work for most (all?) of our cases since the order preservation really only needs to apply
      // to the "flat" transform props
      styleState.style ||= {}
      Object.entries(styleState.flatTransforms)
        .sort(([a], [b]) => a.localeCompare(b))
        .forEach(([key, val]) => {
          mergeTransform(styleState.style!, key, val, true)
        })
    }

    // add in defaults if not set:
    if (parentSplitStyles) {
      if (process.env.TAMAGUI_TARGET === 'web') {
        if (shouldDoClasses) {
          for (const key in parentSplitStyles.classNames) {
            const val = parentSplitStyles.classNames[key]
            if ((styleState.style && key in styleState.style) || key in classNames)
              continue
            classNames[key] = val
          }
        }
      }
      if (!shouldDoClasses) {
        for (const key in parentSplitStyles.style) {
          if (key in classNames || (styleState.style && key in styleState.style)) continue
          styleState.style ||= {}
          styleState.style[key] = parentSplitStyles.style[key]
        }
      }
    }
  }

  // Button for example uses disableClassName: true but renders to a 'button' element, so needs this
  if (process.env.TAMAGUI_TARGET === 'web') {
    const shouldStringifyTransforms =
      !styleProps.noNormalize &&
      !staticConfig.isReactNative &&
      !staticConfig.isHOC &&
      (!styleProps.isAnimated || conf.animations.supportsCSSVars)
    if (shouldStringifyTransforms && Array.isArray(styleState.style?.transform)) {
      styleState.style.transform = transformsToString(styleState.style!.transform) as any
    }
  }

  if (process.env.TAMAGUI_TARGET === 'web') {
    if (styleState.style && shouldDoClasses) {
      let retainedStyles: ViewStyleWithPseudos | undefined
      let shouldRetain = false

      if (styleState.style['$$css']) {
        // avoid re-processing for rnw
      } else {
        const atomic = getStylesAtomic(styleState.style)

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
            retainedStyles[key] = styleState.style[key]
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

        if (process.env.NODE_ENV === 'development' && props.debug === 'verbose') {
          console.groupEnd() // ensure group ended from loop above
          console.groupCollapsed(`🔹 getSplitStyles final style object`)
          console.info(styleState.style)
          console.groupEnd()
        }

        if (shouldRetain || !IS_STATIC) {
          styleState.style = retainedStyles || {}
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

    if (!isReactNative) {
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

  // merge after the prop loop - and always keep it on style dont turn into className except if RN gives us
  const styleProp = props.style

  if (styleProp) {
    if (isHOC) {
      viewProps.style = normalizeStyle(styleProp)
    } else {
      const isArray = Array.isArray(styleProp)
      const len = isArray ? styleProp.length : 1
      for (let i = 0; i < len; i++) {
        const style = isArray ? styleProp[i] : styleProp
        if (style) {
          if (style['$$css']) {
            Object.assign(styleState.classNames, style)
          } else {
            styleState.style ||= {}
            Object.assign(styleState.style, normalizeStyle(style))
          }
        }
      }
    }
  }

  // native: swap out the right family based on weight/style
  if (process.env.TAMAGUI_TARGET === 'native') {
    const style = styleState.style
    if (style?.fontFamily) {
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
        log(`Found fontFamily native: ${style.fontFamily}`, faceInfo)
      }
    }
  }

  const result: GetStyleResult = {
    space,
    hasMedia,
    fontFamily: styleState.fontFamily,
    viewProps,
    style: styleState.style as any,
    pseudos,
    classNames,
    rulesToInsert,
    dynamicThemeAccess,
    pseudoGroups,
    mediaGroups,
  }

  const asChild = props.asChild
  const asChildExceptStyleLike =
    asChild === 'except-style' || asChild === 'except-style-web'

  if (!asChildExceptStyleLike) {
    const style = styleState.style

    if (process.env.TAMAGUI_TARGET === 'web') {
      // merge className and style back into viewProps:
      let fontFamily =
        isText || isInput
          ? styleState.fontFamily || staticConfig.defaultProps?.fontFamily
          : null
      if (fontFamily && fontFamily[0] === '$') {
        fontFamily = fontFamily.slice(1)
      }
      const fontFamilyClassName = fontFamily ? `font_${fontFamily}` : ''
      const groupClassName = props.group ? `t_group_${props.group}` : ''
      const componentNameFinal = props.componentName || staticConfig.componentName
      const componentClassName =
        props.asChild || !componentNameFinal ? '' : `is_${componentNameFinal}`

      let classList: string[] = []
      if (componentClassName) classList.push(componentClassName)
      if (fontFamilyClassName) classList.push(fontFamilyClassName)
      if (classNames) classList.push(Object.values(classNames).join(' '))
      if (groupClassName) classList.push(groupClassName)
      if (props.className) classList.push(props.className)
      const finalClassName = classList.join(' ')

      if (styleProps.noMergeStyle) {
        // this is passed in by useProps() and we want to avoid all .style setting then
        if (finalClassName) {
          viewProps.className = finalClassName
        }
      } else if (
        styleProps.isAnimated &&
        !conf.animations.supportsCSSVars &&
        isReactNative
      ) {
        if (style) {
          viewProps.style = style as any
        }
      } else if (isReactNative) {
        const cnStyles = { $$css: true }
        for (const name of finalClassName.split(' ')) {
          cnStyles[name] = name
        }
        viewProps.style = [...(Array.isArray(style) ? style : [style]), cnStyles]
      } else {
        if (finalClassName) {
          viewProps.className = finalClassName
        }
        if (style) {
          viewProps.style = style as any
        }
      }
    } else {
      // this is passed in by useProps() and we want to avoid all .style setting then
      if (style && !styleProps.noMergeStyle) {
        // native assign styles
        viewProps.style = style as any
      }
    }
  }

  if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
    if (isDevTools) {
      console.groupCollapsed('🔹 getSplitStyles ===>')
      try {
        // prettier-ignore
        const logs = {
          ...result,
          className,
          componentState,
          transforms,
          viewProps,
          rulesToInsert,
          parentSplitStyles,
        }
        for (const key in logs) {
          log(key, logs[key])
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

function mergeStyle(
  styleState: GetStyleState,
  key: string,
  val: any,
  disableNormalize = false
) {
  const { classNames, viewProps, usedKeys, styleProps, staticConfig } = styleState
  if (isWeb && val?.[0] === '_') {
    classNames[key] = val
    usedKeys[key] ||= 1
  } else if (key in stylePropsTransform) {
    styleState.flatTransforms ||= {}
    styleState.flatTransforms[key] = val
  } else {
    const shouldNormalize = isWeb && !disableNormalize && !styleProps.noNormalize
    const out = shouldNormalize ? normalizeValueWithProperty(val, key) : val
    if (
      // accept is for props not styles
      staticConfig.accept &&
      key in staticConfig.accept
    ) {
      viewProps[key] = out
    } else {
      styleState.style ||= {}
      styleState.style[key] = out
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

// on native no need to insert any css
const useInsertEffectCompat = isWeb
  ? useInsertionEffect || useIsomorphicLayoutEffect
  : () => {}

// perf: ...args a bit expensive on native
export const useSplitStyles: StyleSplitter = (a, b, c, d, e, f, g, h, i, j) => {
  const res = getSplitStyles(a, b, c, d, e, f, g, h, i, j)

  if (process.env.TAMAGUI_TARGET !== 'native') {
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

const defaultColor = process.env.TAMAGUI_DEFAULT_COLOR || 'rgba(0,0,0,0)'
const animatableDefaults = {
  ...Object.fromEntries(
    Object.entries(tokenCategories.color).map(([k, v]) => [k, defaultColor])
  ),
  opacity: 1,
  scale: 1,
  rotate: '0deg',
  rotateY: '0deg',
  rotateX: '0deg',
  x: 0,
  y: 0,
  borderRadius: 0,
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

function mergeMediaByImportance(
  styleState: GetStyleState,
  mediaKey: string,
  key: string,
  value: any,
  importancesUsed: Record<string, number>,
  isSizeMedia: boolean,
  importanceBump?: number
) {
  let importance = getMediaImportanceIfMoreImportant(
    mediaKey,
    key,
    importancesUsed,
    isSizeMedia
  )
  if (importanceBump) {
    importance = (importance || 0) + importanceBump
  }
  if (importance === null) {
    return false
  }
  importancesUsed[key] = importance
  mergeStyle(styleState, key, value)
  return true
}

function normalizeStyle(style: any) {
  const out: Record<string, any> = {}
  for (const key in style) {
    const val = style[key]
    if (key in stylePropsTransform) {
      mergeTransform(out, key, val)
    } else {
      out[key] = normalizeValueWithProperty(val, key)
    }
  }
  if (isWeb && Array.isArray(out.transform)) {
    out.transform = transformsToString(out.transform)
  }
  fixStyles(out)
  return out
}
