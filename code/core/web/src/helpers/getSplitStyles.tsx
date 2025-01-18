import { isAndroid, isClient, isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import {
  StyleObjectIdentifier,
  StyleObjectProperty,
  StyleObjectPseudo,
  StyleObjectRules,
  stylePropsText,
  stylePropsTransform,
  tokenCategories,
  validPseudoKeys,
  validStyles as validStylesView,
} from '@tamagui/helpers'
import React from 'react'

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
  TextStyle,
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
import { isActivePlatform } from './isActivePlatform'
import { isActiveTheme } from './isActiveTheme'
import { log } from './log'
import {
  normalizeValueWithProperty,
  reverseMapClassNameToValue,
} from './normalizeValueWithProperty'
import { propMapper } from './propMapper'
import { pseudoDescriptors, pseudoPriorities } from './pseudoDescriptors'
import { skipProps } from './skipProps'
import { sortString } from './sortString'
import { transformsToString } from './transformsToString'

const consoleGroupCollapsed = isWeb ? console.groupCollapsed : console.info

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

function isValidStyleKey(
  key: string,
  validStyles: Record<string, boolean>,
  accept?: Record<string, any>
) {
  return key in validStyles ? true : accept && key in accept
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
  debug
) => {
  if (props.reddish) debug = 'verbose'

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
  const shouldDoClasses = acceptsClassName && isWeb && !styleProps.noClass
  const rulesToInsert: RulesToInsert =
    process.env.TAMAGUI_TARGET === 'native' ? (undefined as any) : {}
  const classNames: ClassNamesObject = {}
  // we need to gather these specific to each media query / pseudo
  // value is [hash, val], so ["-jnjad-asdnjk", "scaleX(1) rotate(10deg)"]
  const transforms: Record<TransformNamespaceKey, [string, string]> = {}

  let pseudos: PseudoStyles | null = null
  let space: SpaceTokens | null = props.space
  let hasMedia: boolean | Record<string, boolean> = false
  let dynamicThemeAccess: boolean | undefined
  let pseudoGroups: Set<string> | undefined
  let mediaGroups: Set<string> | undefined
  let className = (props.className as string) || '' // existing classNames
  let mediaStylesSeen = 0

  const validStyles =
    staticConfig.validStyles ||
    (staticConfig.isText || staticConfig.isInput ? stylePropsText : validStylesView)

  if (process.env.NODE_ENV === 'development' && debug === 'profile') {
    // @ts-expect-error
    time`split-styles-setup`
  }

  /**
   * Not the biggest fan of creating an object but it is a nice API
   */
  const styleState: GetStyleState = {
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
  }

  // only used by compiler
  if (process.env.IS_STATIC === 'is_static') {
    const { fallbackProps } = styleProps
    if (fallbackProps) {
      styleState.props = new Proxy(props, {
        get(_, key, val) {
          if (!Reflect.has(props, key)) {
            return Reflect.get(fallbackProps, key)
          }
          return Reflect.get(props, key)
        },
      })
    }
  }

  if (process.env.NODE_ENV === 'development' && debug === 'profile') {
    // @ts-expect-error
    time`style-state`
  }

  if (
    process.env.NODE_ENV === 'development' &&
    debug &&
    debug !== 'profile' &&
    isClient
  ) {
    consoleGroupCollapsed('getSplitStyles (collapsed)')
    log({
      props,
      staticConfig,
      shouldDoClasses,
      styleProps,
      rulesToInsert,
      componentState,
      styleState,
      theme: { ...theme },
    })
    console.groupEnd()
  }

  const { asChild } = props
  const { accept } = staticConfig
  const { noSkip, disableExpandShorthands, noExpand } = styleProps
  const { webContainerType } = conf.settings
  const parentVariants = parentStaticConfig?.variants

  for (const keyOg in props) {
    let keyInit = keyOg
    let valInit = props[keyInit]

    if (keyInit === 'children') {
      viewProps[keyInit] = valInit
      continue
    }

    if (process.env.NODE_ENV === 'development' && debug === 'profile') {
      // @ts-expect-error
      time`before-prop-${keyInit}`
    }

    if (process.env.NODE_ENV === 'test' && keyInit === 'jestAnimatedStyle') {
      continue
    }

    // for custom accept sub-styles
    if (accept) {
      const accepted = accept[keyInit]
      if (
        (accepted === 'style' || accepted === 'textStyle') &&
        valInit &&
        typeof valInit === 'object'
      ) {
        viewProps[keyInit] = getSubStyle(styleState, keyInit, valInit, styleProps.noClass)
        continue
      }
    }

    if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
      // otherwise things just keep nesting - careful don't leave these around
      // they cause big performance dips in Chrome, only use them when debug prop set
      console.groupEnd()
    }

    // normalize shorthands up front
    if (!disableExpandShorthands) {
      if (keyInit in shorthands) {
        keyInit = shorthands[keyInit]
      }
    }

    if (keyInit === 'className') continue // handled above first
    if (keyInit in usedKeys) continue

    if (process.env.TAMAGUI_TARGET === 'web') {
      // skip the webViewFlexCompatStyles when asChild on web
      if (asChild && webViewFlexCompatStyles[keyInit] === valInit) {
        continue
      }
    }

    // keyInit === 'style' is handled in skipProps
    if (keyInit in skipProps && !noSkip && !isHOC) {
      if (keyInit === 'group') {
        if (process.env.TAMAGUI_TARGET === 'web') {
          // add container style
          const identifier = `t_group_${valInit}`
          const containerType = webContainerType || 'inline-size'
          const containerCSS = [
            'continer',
            undefined,
            identifier,
            undefined,
            [
              `.${identifier} { container-name: ${valInit}; container-type: ${containerType}; }`,
            ],
          ] satisfies StyleObject
          addStyleToInsertRules(rulesToInsert, containerCSS)
        }
      }
      continue
    }

    const valInitType = typeof valInit
    let isValidStyleKeyInit = isValidStyleKey(keyInit, validStyles, accept)

    // this is all for partially optimized (not flattened)... maybe worth removing?
    if (process.env.TAMAGUI_TARGET === 'web') {
      // react-native-web ignores data-* attributes, fixes passing them to animated views
      if (staticConfig.isReactNative && keyInit.startsWith('data-')) {
        keyInit = keyInit.replace('data-', '')
        viewProps['dataSet'] ||= {}
        viewProps['dataSet'][keyInit] = valInit
        continue
      }

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

    if (process.env.TAMAGUI_TARGET === 'native') {
      if (!isValidStyleKeyInit) {
        if (!isAndroid) {
          // only works in android
          if (keyInit === 'elevationAndroid') continue
        }

        // map userSelect to native prop
        if (keyInit === 'userSelect') {
          keyInit = 'selectable'
          valInit = valInit !== 'none'
        } else if (keyInit.startsWith('data-')) {
          continue
        }
      }
    }

    // TODO deprecate dataSet be sure we map on native from data-
    if (keyInit === 'dataSet') {
      for (const keyInit in valInit) {
        viewProps[`data-${hyphenate(keyInit)}`] = valInit[keyInit]
      }
      continue
    }

    if (process.env.TAMAGUI_TARGET === 'web') {
      if (!noExpand) {
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

    let isVariant = !isValidStyleKeyInit && variants && keyInit in variants

    const isStyleLikeKey = isValidStyleKeyInit || isVariant

    let isPseudo = keyInit in validPseudoKeys
    let isMedia: IsMediaType = !isStyleLikeKey && !isPseudo && isMediaKey(keyInit)
    let isMediaOrPseudo = Boolean(isMedia || isPseudo)

    if (isMediaOrPseudo && keyInit.startsWith('$group-')) {
      const parts = keyInit.split('-')
      if (
        // check if its actually a simple group selector to avoid breaking selectors
        parts.length === 2 ||
        (parts.length === 3 && pseudoPriorities[parts[parts.length - 1]])
      ) {
        const name = parts[1]
        if (context?.groups.subscribe && !context?.groups.state[name]) {
          keyInit = keyInit.replace('$group-', `$group-true-`)
        }
      }
    }

    const isStyleProp = isValidStyleKeyInit || isMediaOrPseudo || (isVariant && !noExpand)

    if (isStyleProp && (asChild === 'except-style' || asChild === 'except-style-web')) {
      continue
    }

    const shouldPassProp =
      (!isStyleProp && isHOC) ||
      // is in parent variants
      (isHOC && parentVariants && keyInit in parentVariants) ||
      inlineProps?.has(keyInit)

    const parentVariant = parentVariants?.[keyInit]
    const isHOCShouldPassThrough = Boolean(
      isHOC &&
        (isValidStyleKeyInit || isMediaOrPseudo || parentVariant || keyInit in skipProps)
    )

    const shouldPassThrough = shouldPassProp || isHOCShouldPassThrough

    if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
      console.groupEnd() // react native was not nesting right
      console.groupEnd() // react native was not nesting right
      consoleGroupCollapsed(
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
      //     state.noClass
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
    if (!noSkip) {
      if (keyInit in skipProps) {
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

    const disablePropMap = isMediaOrPseudo || !isStyleLikeKey

    propMapper(keyInit, valInit, styleState, disablePropMap, (key, val) => {
      if (!isHOC && disablePropMap && !isMediaOrPseudo) {
        viewProps[key] = val
        return
      }

      if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
        consoleGroupCollapsed('  💠 expanded', keyInit, '=>', key)
        log(val)
        console.groupEnd()
      }

      if (val == null) return
      if (key in usedKeys) return

      if (process.env.TAMAGUI_TARGET === 'native') {
        if (key === 'pointerEvents') {
          viewProps[key] = val
          return
        }
      }

      if (
        (!isHOC && isValidStyleKey(key, validStyles, accept)) ||
        (process.env.TAMAGUI_TARGET === 'native' && isAndroid && key === 'elevation')
      ) {
        mergeStyle(styleState, key, val)
        return
      }

      isPseudo = key in validPseudoKeys
      isMedia = !isPseudo && isMediaKey(key)
      isMediaOrPseudo = Boolean(isMedia || isPseudo)
      isVariant = variants && key in variants

      if (
        inlineProps?.has(key) ||
        (process.env.IS_STATIC === 'is_static' && inlineWhenUnflattened?.has(key))
      ) {
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
          consoleGroupCollapsed(` - passing down prop ${key}`)
          log({ val, after: { ...viewProps[key] } })
          console.groupEnd()
        }
        return
      }

      if (isPseudo) {
        if (!val) return

        // TODO can avoid processing this if !shouldDoClasses + state is off
        // (note: can't because we need to set defaults on enter/exit or else enforce that they should)
        const pseudoStyleObject = getSubStyle(styleState, key, val, styleProps.noClass)

        if (!shouldDoClasses || process.env.IS_STATIC === 'is_static') {
          pseudos ||= {}
          pseudos[key] ||= {}

          // if compiler we can just set this and continue on our way
          if (process.env.IS_STATIC === 'is_static') {
            Object.assign(pseudos[key], pseudoStyleObject)
            return
          }
        }

        const descriptor = pseudoDescriptors[key as keyof typeof pseudoDescriptors]
        const isEnter = key === 'enterStyle'
        const isExit = key === 'exitStyle'

        // don't continue here on isEnter && !state.unmounted because we need to merge defaults
        if (!descriptor) {
          return
        }

        // on server only generate classes for enterStyle
        if (shouldDoClasses && !isExit) {
          const pseudoStyles = getStyleAtomic(pseudoStyleObject, descriptor)

          if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
            // prettier-ignore
            consoleGroupCollapsed('pseudo (classes)', key)

            log({ pseudoStyleObject, pseudoStyles })
            console.groupEnd()
          }

          for (const psuedoStyle of pseudoStyles) {
            const fullKey = `${psuedoStyle[StyleObjectProperty]}${PROP_SPLIT}${descriptor.name}`
            if (fullKey in usedKeys) continue

            addStyleToInsertRules(rulesToInsert, psuedoStyle)
            mergeClassName(
              transforms,
              classNames,
              fullKey,
              psuedoStyle[StyleObjectIdentifier],
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
          if (isEnter && componentState.unmounted === false) {
            isDisabled = true
          }

          if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
            consoleGroupCollapsed('pseudo', key, { isDisabled })
            log({ pseudoStyleObject, isDisabled, descriptor, componentState })
            console.groupEnd()
          }

          const importance = descriptor.priority

          for (const pkey in pseudoStyleObject) {
            const val = pseudoStyleObject[pkey]
            // when disabled ensure the default value is set for future animations to align

            if (isDisabled) {
              applyDefaultStyle(pkey, styleState)
            } else {
              const curImportance = usedKeys[pkey] || 0
              const shouldMerge = importance >= curImportance

              if (shouldMerge) {
                if (process.env.IS_STATIC === 'is_static') {
                  pseudos ||= {}
                  pseudos[key] ||= {}
                  pseudos[key][pkey] = val
                }
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

        return
      }

      // media
      if (isMedia) {
        if (!val) return

        // for some reason 'space' in val upsetting next ssr during prod build
        // technically i guess this also will not apply if 0 space which makes sense?
        const hasSpace = val['space']
        const mediaKeyShort = key.slice(isMedia == 'theme' ? 7 : 1)

        hasMedia ||= true

        if (hasSpace || !shouldDoClasses || styleProps.willBeAnimated) {
          if (typeof hasMedia !== 'object') {
            hasMedia = {}
          }
          hasMedia[mediaKeyShort] = true
        }

        // can bail early
        if (isMedia === 'platform') {
          if (!isActivePlatform(key)) {
            return
          }
        }

        if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
          log(`  📺 ${key}`, {
            key,
            val,
            props,
            shouldDoClasses,
            acceptsClassName,
            componentState,
            mediaState,
          })
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
            // handle nested media:
            // for now we're doing weird stuff, getStylesAtomic will put the
            // $platform-web into property so we can check it here
            const property = style[StyleObjectProperty]
            const isSubStyle = property[0] === '$'
            if (isSubStyle && !isActivePlatform(property)) {
              continue
            }

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
            // this is imperfect it should be fixed fruther down, we mess up property when dealing with
            // media-sub-style, like $sm={{ $platform-web: {} }}
            // property is just $platform-web, it should br $platform-web-bg, so we add extra info from style
            // but that info includes the value too
            const subKey = isSubStyle ? style[2] : ''
            const fullKey = `${style[StyleObjectProperty]}${subKey}${PROP_SPLIT}${mediaKeyShort}${
              style[StyleObjectPseudo] || ''
            }`

            if (fullKey in usedKeys) continue
            addStyleToInsertRules(rulesToInsert, out as any)
            mergeClassName(
              transforms,
              classNames,
              fullKey,
              out[StyleObjectIdentifier],
              true,
              true
            )
          }
        } else {
          const isThemeMedia = isMedia === 'theme'
          const isGroupMedia = isMedia === 'group'
          const isPlatformMedia = isMedia === 'platform'

          if (!isThemeMedia && !isPlatformMedia && !isGroupMedia) {
            if (!mediaState[mediaKeyShort]) {
              if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
                log(`  📺 ❌ DISABLED ${mediaKeyShort}`)
              }
              return
            }
            if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
              log(`  📺 ✅ ENABLED ${mediaKeyShort}`)
            }
          }

          const mediaStyle = getSubStyle(styleState, key, val, true)

          let importanceBump = 0

          if (isThemeMedia) {
            // needed to get updates when theme changes
            dynamicThemeAccess = true

            if (!(themeName === mediaKeyShort || themeName.startsWith(mediaKeyShort))) {
              return
            }
          } else if (isGroupMedia) {
            const groupInfo = getGroupPropParts(mediaKeyShort)
            const groupName = groupInfo.name

            // $group-x
            const groupContext = context?.groups.state[groupName]
            if (!groupContext) {
              if (process.env.NODE_ENV === 'development' && debug) {
                log(`No parent with group prop, skipping styles: ${groupName}`)
              }
              return
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
              if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
                log(` 🏘️ GROUP media ${groupMediaKey} active? ${isActive}`)
              }
              if (!isActive) {
                // ensure we set the defaults so animations work
                for (const pkey in mediaStyle) {
                  applyDefaultStyle(pkey, styleState)
                }

                return
              }
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
              const priority = pseudoPriorities[groupPseudoKey]
              if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
                log(
                  ` 🏘️ GROUP pseudo ${groupMediaKey} active? ${isActive}, priority ${priority}`
                )
              }
              if (!isActive) {
                // ensure we set the defaults so animations work
                for (const pkey in mediaStyle) {
                  applyDefaultStyle(pkey, styleState)
                }

                return
              }
              importanceBump = priority
            }
          }

          function mergeMediaStyle(key: string, val: any) {
            styleState.style ||= {}
            const didMerge = mergeMediaByImportance(
              styleState,
              mediaKeyShort,
              key,
              val,
              usedKeys,
              mediaState[mediaKeyShort],
              importanceBump,
              debug
            )
            if (didMerge && key === 'fontFamily') {
              styleState.fontFamily = mediaStyle.fontFamily as string
            }
          }

          for (const subKey in mediaStyle) {
            if (subKey === 'space') {
              space = valInit.space
              continue
            }
            if (subKey[0] === '$') {
              if (!isActivePlatform(subKey)) continue
              if (!isActiveTheme(subKey, themeName)) continue
              for (const subSubKey in mediaStyle[subKey]) {
                mergeMediaStyle(subSubKey, mediaStyle[subKey][subSubKey])
              }
            } else {
              mergeMediaStyle(subKey, mediaStyle[subKey])
            }
          }
        }

        return // end media
      }

      // pass to view props
      if (!isVariant) {
        if (styleProps.styledContextProps && key in styleProps.styledContextProps) {
          return
        }

        viewProps[key] = val
      }
    })

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

  if (process.env.NODE_ENV === 'development' && debug === 'profile') {
    // @ts-expect-error
    time`split-styles-propsend`
  }

  // style prop after:

  const avoidNormalize = styleProps.noNormalize === false

  if (!avoidNormalize) {
    if (styleState.style) {
      fixStyles(styleState.style)

      // shouldn't this be better? but breaks some tests weirdly, need to check
      if (isWeb && !isReactNative) {
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
        .sort(([a], [b]) => sortString(a, b))
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
          const [key, value, identifier] = atomicStyle
          const isAnimatedAndAnimateOnly =
            styleProps.isAnimated &&
            styleProps.noClass &&
            props.animateOnly?.includes(key)

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
            retainedStyles[key] = value
            shouldRetain = true
          } else {
            addStyleToInsertRules(rulesToInsert, atomicStyle)
            mergeClassName(transforms, classNames, key, identifier, false, true)
          }
        }

        if (process.env.NODE_ENV === 'development' && props.debug === 'verbose') {
          console.groupEnd() // ensure group ended from loop above
          consoleGroupCollapsed(`🔹 getSplitStyles final style object`)
          console.info(styleState.style)
          console.info(`retainedStyles`, retainedStyles)
          console.groupEnd()
        }

        if (shouldRetain || !(process.env.IS_STATIC === 'is_static')) {
          styleState.style = retainedStyles || {}
        }
      }

      if (transforms) {
        for (const namespace in transforms) {
          if (!transforms[namespace]) {
            if (process.env.NODE_ENV === 'development') {
              log('Error no transform', transforms, namespace)
            }
            continue
          }
          const [hash, val] = transforms[namespace]
          const identifier = `_transform${hash}`
          if (isClient && !insertedTransforms[identifier]) {
            const rule = `.${identifier} { transform: ${val}; }`
            addStyleToInsertRules(rulesToInsert, [
              namespace,
              val,
              identifier,
              undefined,
              [rule],
            ] satisfies StyleObject)
          }
          classNames[namespace] = identifier
        }
      }
    }

    if (isReactNative) {
      if (viewProps.tabIndex === 0) {
        viewProps.accessible ??= true
      }
    } else {
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

  if (process.env.NODE_ENV === 'development' && debug === 'profile') {
    // @ts-expect-error
    time`split-styles-pre-result`
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
      consoleGroupCollapsed('🔹 getSplitStyles ===>')
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

  if (process.env.NODE_ENV === 'development' && debug === 'profile') {
    // @ts-expect-error
    time`split-styles-done`
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
): TextStyle => {
  const { staticConfig, conf, styleProps } = styleState
  const styleOut: TextStyle = {}

  for (let key in styleIn) {
    const val = styleIn[key]
    key = conf.shorthands[key] || key

    const shouldSkip = !staticConfig.isHOC && key in skipProps && !styleProps.noSkip
    if (shouldSkip) {
      continue
    }

    propMapper(key, val, styleState, false, (skey, sval) => {
      // pseudo inside media
      if (skey in validPseudoKeys) {
        sval = getSubStyle(styleState, skey, sval, avoidMergeTransform)
      }

      if (!avoidMergeTransform && skey in stylePropsTransform) {
        mergeTransform(styleOut, skey, sval)
      } else {
        styleOut[skey] = styleProps.noNormalize
          ? sval
          : normalizeValueWithProperty(sval, key)
      }
    })
  }

  if (!styleProps.noNormalize) {
    fixStyles(styleOut)
  }

  return styleOut
}

// on native no need to insert any css
const useInsertEffectCompat = isWeb
  ? React.useInsertionEffect || useIsomorphicLayoutEffect
  : () => {}

// perf: ...args a bit expensive on native
export const useSplitStyles: StyleSplitter = (a, b, c, d, e, f, g, h, i, j) => {
  conf = conf || getConfig()
  const res = getSplitStyles(a, b, c, d, e, f, g, h, i, j)

  if (process.env.TAMAGUI_TARGET !== 'native') {
    if (!process.env.TAMAGUI_REACT_19) {
      useInsertEffectCompat(() => {
        insertStyleRules(res.rulesToInsert)
      }, [res.rulesToInsert])
    }
  }

  return res
}

function addStyleToInsertRules(rulesToInsert: RulesToInsert, styleObject: StyleObject) {
  // if (process.env.NODE_ENV === 'development') {
  //   if (rulesToInsert[styleObject[2]!]) {
  //     console.log('already have this style rule to insert?', styleObject, rulesToInsert)
  //   }
  // }
  if (process.env.TAMAGUI_TARGET === 'web') {
    const identifier = styleObject[StyleObjectIdentifier]
    if (!process.env.TAMAGUI_REACT_19) {
      if (shouldInsertStyleRules(identifier)) {
        updateRules(identifier, styleObject[StyleObjectRules])
      }
    }
    rulesToInsert[identifier] = styleObject
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

const mergeTransform = (obj: TextStyle, key: string, val: any, backwards = false) => {
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
  importanceBump?: number,
  debugProp?: DebugProp
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
  if (process.env.NODE_ENV === 'development' && debugProp === 'verbose') {
    log(
      `mergeMediaByImportance ${key} importance existing ${importancesUsed[key]} next ${importance}`
    )
  }
  if (importance === null) {
    return false
  }
  importancesUsed[key] = importance

  if (key in pseudoDescriptors) {
    const descriptor = pseudoDescriptors[key]
    const descriptorKey = descriptor.stateKey || descriptor.name
    const isDisabled = styleState.componentState[descriptorKey] === false
    if (isDisabled) {
      return false
    }
    for (const subKey in value) {
      mergeStyle(styleState, subKey, value[subKey])
    }
  } else {
    mergeStyle(styleState, key, value)
  }

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

function applyDefaultStyle(pkey: string, styleState: GetStyleState) {
  const defaultValues = animatableDefaults[pkey]
  if (
    defaultValues != null &&
    !(pkey in styleState.usedKeys) &&
    (!styleState.style || !(pkey in styleState.style))
  ) {
    mergeStyle(styleState, pkey, defaultValues)
  }
}
