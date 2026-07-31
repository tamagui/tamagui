import {
  getPlatformDriver,
  isAndroid,
  isClient,
  isWeb,
  supportsDynamicColorIOS,
  useIsomorphicLayoutEffect,
} from '@tamagui/constants'
import {
  StyleObjectIdentifier,
  StyleObjectProperty,
  StyleObjectPseudo,
  StyleObjectRules,
  nonAnimatableStyleProps,
  stylePropsAll,
  stylePropsText,
  stylePropsTransform,
  tokenCategories,
  validPseudoKeys,
  validStyles as validStylesView,
} from '@tamagui/helpers'
import {
  borderSideSuffix,
  classifyCandidate,
  convertLegacyConditionProp,
  createGrammarConfigView,
  decodeArbitrary,
  getTokenCategory,
  hasTokenName,
  modifierToPseudo,
  percentUtilityProps,
  radiusCornerProps,
  transformFamilyProps,
  type GrammarConfigView,
  type ParsedCandidate,
} from '@tamagui/style-grammar'
import React from 'react'
import { STYLE_FRONTEND_PREPROCESSED } from './styleFrontend'
import { getConfig, getFont, getSetting } from '../config'
import { isDevTools } from '../constants/isDevTools'
import {
  getMediaKey,
  getMediaKeyImportance,
  mediaKeyMatch,
  platformMediaKeys,
} from '../hooks/useMedia'
import { mediaState as globalMediaState, mediaQueryConfig } from './mediaState'
import type {
  AllGroupContexts,
  AnimationDriver,
  ClassNamesObject,
  ComponentContextI,
  DebugProp,
  GetStyleResult,
  GetStyleState,
  GenericCompoundVariant,
  PseudoStyles,
  RulesToInsert,
  SpaceTokens,
  SplitStyleProps,
  StaticConfig,
  StyleObject,
  TamaguiComponentState,
  TamaguiInternalConfig,
  TextStyle,
  ThemeParsed,
  ViewStyleWithPseudos,
} from '../types'
import { createMediaStyle } from './createMediaStyle'
import { fixStyles } from './expandStyles'
import { getCSSStylesAtomic, getStyleAtomic, styleToCSS } from './getCSSStylesAtomic'
import { getDefaultProps } from './getDefaultProps'
import {
  extractValueFromDynamic,
  getDynamicVal,
  getOppositeScheme,
  isColorStyleKey,
} from './getDynamicVal'
import { getGroupPropParts } from './getGroupPropParts'
import { insertStyleRules, shouldInsertStyleRules, updateRules } from './insertStyleRule'
import { isActivePlatform, getPlatformSpecificityBump } from './isActivePlatform'
import { isActiveTheme } from './isActiveTheme'
import { log } from './log'
import { normalizeValueWithProperty } from './normalizeValueWithProperty'
import { propMapper } from './propMapper'
import {
  absorbPlainIntoPrograms,
  canContributeConvertedProgram,
  contributeConvertedProgram,
  contributeStylePrograms,
  contributeTransformNumber,
  ensureGrammarContext,
} from './contributePrograms'
import { evaluateAccumulatedPrograms } from './evaluateAccumulatedPrograms'
import { lowerAccumulatedPrograms } from './lowerAccumulatedPrograms'
import {
  type PseudoDescriptorKey,
  pseudoDescriptors,
  pseudoPriorities,
  defaultMediaImportance,
} from './pseudoDescriptors'
import { skipProps } from './skipProps'
import { sortString } from './sortString'
import { styleOriginalValues } from './styleOriginalValues'
import { type StyleTokenProvenance, setStyleTokenProvenance } from './styleProvenance'
import { transformsToString } from './transformsToString'

export { styleOriginalValues }
export { getStyleTokenProvenance, STYLE_TOKEN_PROVENANCE_KEY } from './styleProvenance'
export type { StyleTokenBinding, StyleTokenProvenance } from './styleProvenance'

export type SplitStyles = ReturnType<typeof getSplitStyles>

const shouldTrackStyleTokenProvenance =
  process.env.NODE_ENV === 'development' &&
  process.env.TAMAGUI_ENABLE_STYLE_TOKEN_PROVENANCE === '1'

const notedLegacyConditionFallbacks = new Set<string>()

function noteLegacyConditionFallback(key: string, code: string, path: string) {
  if (process.env.NODE_ENV !== 'development' || notedLegacyConditionFallbacks.has(key)) {
    return
  }
  if (notedLegacyConditionFallbacks.size > 1000) {
    notedLegacyConditionFallbacks.clear()
  }
  notedLegacyConditionFallbacks.add(key)
  console.info(
    `[tamagui] ${key} could not be converted to flat value programs (${code} at ${path}); using legacy condition handling`
  )
}

export type SplitStyleResult = ReturnType<typeof getSplitStyles>

// note: we intentionally don't cache conf at module level here
// because createTamagui may be called multiple times (HMR, tests)
// and getConfig() already has its own caching

type StyleSplitter = (
  props: { [key: string]: any },
  staticConfig: StaticConfig,
  theme: ThemeParsed,
  themeName: string,
  componentState: TamaguiComponentState,
  styleProps: SplitStyleProps,
  parentSplitStyles?: GetStyleResult | null,
  context?: ComponentContextI,
  groupContext?: AllGroupContexts | null,
  // web-only
  elementType?: string,
  startedUnhydrated?: boolean,
  debug?: DebugProp,
  // resolved animation driver (respects animatedBy prop)
  animationDriver?: AnimationDriver | null
) => null | GetStyleResult

export const PROP_SPLIT = '-'

function isPlainObject(value: unknown): value is Record<string, any> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false
  }
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

function compoundMatcherMatches(expected: any, actual: any) {
  if (Array.isArray(expected)) {
    return expected.some((value) => Object.is(value, actual))
  }
  return Object.is(expected, actual)
}

function compoundVariantMatches(
  compoundVariant: GenericCompoundVariant,
  props: Record<string, any>
) {
  for (const key in compoundVariant) {
    if (key === 'style') continue
    if (!compoundMatcherMatches(compoundVariant[key], props[key])) {
      return false
    }
  }
  return true
}

type OrderedPropEntry = readonly [string, any]

function getPropEntriesInForwardOrder(
  processedProps: Record<string, any>,
  processedBaseStyle: Record<string, any> | undefined,
  compoundVariants: StaticConfig['compoundVariants']
) {
  // fast path: with no compound variants (the common case) build the forward-ordered
  // [key, value] list in a single for...in pass — skip the two Object.entries arrays
  // and the spread that only the compound path needs. base style first, then props.
  if (!compoundVariants?.length) {
    const orderedEntries: OrderedPropEntry[] = []
    if (processedBaseStyle) {
      for (const key in processedBaseStyle) {
        orderedEntries.push([key, processedBaseStyle[key]])
      }
    }
    for (const key in processedProps) {
      orderedEntries.push([key, processedProps[key]])
    }
    return orderedEntries
  }

  // compound path needs indexed prop entries to resolve each compound's anchor
  const propEntries = Object.entries(processedProps) as OrderedPropEntry[]
  const orderedEntries = processedBaseStyle
    ? (Object.entries(processedBaseStyle) as OrderedPropEntry[])
    : []

  // Compounds are ordinary contributions in the same authored forward pass. A
  // matching compound runs immediately after its last selector entry, then any
  // later prop/style/className is free to override it. Never collect variants,
  // compounds, or caller values into precedence tiers.
  const compoundsByAnchor = new Map<number, OrderedPropEntry[]>()
  for (const compoundVariant of compoundVariants) {
    if (!compoundVariantMatches(compoundVariant, processedProps)) {
      continue
    }
    const { style } = compoundVariant
    if (!isPlainObject(style)) {
      continue
    }

    let anchor = -1
    for (const selectorKey in compoundVariant) {
      if (selectorKey === 'style') continue
      for (let index = propEntries.length - 1; index >= 0; index--) {
        if (propEntries[index][0] === selectorKey) {
          anchor = Math.max(anchor, index)
          break
        }
      }
    }

    const entries = compoundsByAnchor.get(anchor) || []
    for (const key in style) {
      entries.push([key, style[key]])
    }
    compoundsByAnchor.set(anchor, entries)
  }

  const beforeProps = compoundsByAnchor.get(-1)
  if (beforeProps) orderedEntries.push(...beforeProps)
  for (let index = 0; index < propEntries.length; index++) {
    orderedEntries.push(propEntries[index])
    const compounds = compoundsByAnchor.get(index)
    if (compounds) orderedEntries.push(...compounds)
  }
  return orderedEntries
}

// Normalize group keys like $group-press to $group-true-press when the group name
// doesn't exist in context (defaults to the unnamed 'true' group)
function normalizeGroupKey(
  key: string,
  groupContext: AllGroupContexts | null | undefined
): string {
  const parts = key.split('-')
  const plen = parts.length
  if (
    // check if its actually a simple group selector to avoid breaking selectors
    plen === 2 ||
    (plen === 3 && pseudoPriorities[parts[parts.length - 1]])
  ) {
    const name = parts[1]
    if (name !== 'true' && groupContext && !groupContext[name]) {
      return key.replace('$group-', '$group-true-')
    }
  }
  return key
}

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

function shouldSkipNativeHoverProp(key: string, isMedia: false | boolean | string) {
  if (process.env.TAMAGUI_TARGET !== 'native') return false
  if (getPlatformDriver()?.pseudo) return false
  if (key === 'hoverStyle') return true
  if (isMedia === 'group') {
    return getGroupPropParts(key.slice(1)).pseudo === 'hover'
  }
  return false
}

export const getSplitStyles: StyleSplitter = (
  props,
  staticConfig,
  theme,
  themeName,
  componentState,
  styleProps,
  parentSplitStyles,
  componentContext,
  groupContext,
  elementType,
  startedUnhydrated,
  debug,
  animationDriver
) => {
  const conf = getConfig()
  // a frontend-bound component resolves its static style input (class-string
  // base, string variants) through its own descriptor; implementations memoize
  // per (staticConfig, config). components without a descriptor pay one read.
  if (staticConfig.styleFrontend?.normalizeStaticConfig) {
    staticConfig = staticConfig.styleFrontend.normalizeStaticConfig(
      staticConfig as any,
      conf
    ) as StaticConfig
  }
  // use passed animationDriver or fall back to context/config
  const driver =
    animationDriver ||
    componentContext?.animationDriver ||
    (conf.animations as AnimationDriver)

  if (props.passThrough) {
    return null
  }

  // a bit icky, we need no normalize but not fully
  if (
    isWeb &&
    styleProps.isAnimated &&
    driver?.isReactNative &&
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
    parentStaticConfig,
    acceptsClassName,
  } = staticConfig

  const viewProps: GetStyleResult['viewProps'] = {}
  const mediaState = styleProps.mediaState || globalMediaState

  let shouldDoClasses = acceptsClassName && isWeb && !styleProps.noClass

  const rulesToInsert: RulesToInsert =
    process.env.TAMAGUI_TARGET === 'native' ? (undefined as any) : {}
  const classNames: ClassNamesObject = {}

  let space: SpaceTokens | null = props.space
  let pseudos: PseudoStyles | null = null
  let hasMedia: boolean | Set<string> = false
  let dynamicThemeAccess: boolean | undefined
  let pseudoGroups: Set<string> | undefined
  let mediaGroups: Set<string> | undefined
  // the frontend's normalizeStaticConfig partitions unclaimed styled-base
  // classes into passthroughClassName (baseStyle holds styles only). they are
  // the base's raw-interop className at the earliest forward position:
  // prepend them and flip the cascade-preserving switch so every later
  // Tamagui contribution keeps its last-wins position inline, exactly as a
  // className prop does mid-loop
  let className = staticConfig.passthroughClassName || ''
  if (className) {
    shouldDoClasses = false
  }
  let mediaStylesSeen = 0

  const validStyles =
    staticConfig.validStyles ||
    (staticConfig.isText || staticConfig.isInput ? stylePropsText : validStylesView)

  if (
    process.env.NODE_ENV === 'development' &&
    (debug === 'profile' || (globalThis as any).time)
  ) {
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
    usedKeys: {},
    viewProps,
    context: componentContext,
    debug,
    // resolved animation driver (respects animatedBy prop)
    animationDriver: driver,
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

  if (
    process.env.NODE_ENV === 'development' &&
    (debug === 'profile' || (globalThis as any).time)
  ) {
    // @ts-expect-error
    time`style-state`
  }

  if (process.env.NODE_ENV === 'development' && debug === 'verbose' && isClient) {
    if (isDevTools) {
      console.groupCollapsed('🔹 getSplitStyles 👇')
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
    }
  }

  const { asChild } = props
  const { accept } = staticConfig
  const { noSkip, disableExpandShorthands, noExpand, styledContext } = styleProps

  // frontend preprocessing runs once per render: createComponent already ran the
  // descriptor's preprocessProps and marked the result, so this only fires for
  // direct callers (tests, non-component paths), which self-process exactly once
  let processedProps: Record<string, any>
  const styleFrontend = staticConfig.styleFrontend
  if (styleFrontend && !(props as any)[STYLE_FRONTEND_PREPROCESSED]) {
    processedProps = styleFrontend.preprocessProps(props, conf)
  } else {
    processedProps = props
  }
  const { webContainerType } = conf.settings
  const parentVariants = parentStaticConfig?.variants
  // decision 23: legacy condition objects convert into program clauses at the
  // loop entry, on by default in v3 (set legacyConditionObjects: false to keep
  // the old machinery). unconvertible categories (resetting composite
  // shorthands, exotic transform parts) still fall through to the legacy path
  const legacyConditionObjects = getSetting('legacyConditionObjects') !== false
  const orderedProcessedProps = getPropEntriesInForwardOrder(
    processedProps,
    staticConfig.baseStyle,
    staticConfig.compoundVariants
  )

  const contributeLegacyCondition = legacyConditionObjects
    ? (key: string, value: unknown): boolean => {
        if (
          !(
            process.env.TAMAGUI_TARGET === 'native' ||
            (process.env.TAMAGUI_TARGET === 'web' &&
              (shouldDoClasses || process.env.IS_STATIC !== 'is_static'))
          )
        ) {
          return false
        }

        const converted = convertLegacyConditionProp(key, value, {
          registry: ensureGrammarContext(styleState).registry,
        })
        if (converted === null) return false

        if (converted.errors.length) {
          const error = converted.errors[0]
          noteLegacyConditionFallback(key, error.code, error.path)
          return false
        }

        for (const contribution of converted.contributions) {
          if (
            !canContributeConvertedProgram(styleState, contribution.prop, {
              base: null,
              clauses: [contribution.clause],
            })
          ) {
            noteLegacyConditionFallback(
              key,
              'unsupported-legacy-base',
              `${key}.${contribution.prop}`
            )
            return false
          }
        }

        for (const contribution of converted.contributions) {
          contributeConvertedProgram(
            styleState,
            contribution.prop,
            { base: null, clauses: [contribution.clause] },
            key
          )
        }
        return true
      }
    : null

  const mergeStylePropAtCurrentPosition = (styleProp: any) => {
    if (styleProps.noMergeStyle || !styleProp) return
    if (isHOC) {
      viewProps.style = normalizeStyle(styleProp)
      return
    }
    const isArray = Array.isArray(styleProp)
    const length = isArray ? styleProp.length : 1
    for (let index = 0; index < length; index++) {
      const style = isArray ? styleProp[index] : styleProp
      if (!style) continue
      if (style['$$css']) {
        Object.assign(styleState.classNames, style)
        continue
      }
      const normalized = normalizeStyle(style)
      styleState.style ||= {}
      const styleOriginals = shouldTrackStyleTokenProvenance
        ? styleOriginalValues.get(normalized)
        : undefined
      for (const key in normalized) {
        if (
          styleState.programs?.size &&
          absorbPlainIntoPrograms(styleState, key, normalized[key])
        ) {
          // a later style-prop value restates the program's base; the
          // program's conditions survive (decision 21)
          continue
        }
        styleState.style[key] = normalized[key]
        // An authored style object is one ordinary contribution, not a permanent
        // higher-precedence tier. Reset the key so any later contribution can win.
        styleState.usedKeys[key] = 1
        if (shouldTrackStyleTokenProvenance) {
          // the literal style prop wins at its position: carry its own token
          // provenance forward, and clear a prior token wherever it supplies a
          // literal (e.g. style={{ color: '#fff' }} over color="$color9")
          recordStyleTokenProvenance(styleState, key, styleOriginals?.[key])
        }
      }
    }
  }

  const flushForwardStylesToClasses = () => {
    if (!shouldDoClasses || !styleState.style) return
    if (styleState.flatTransforms) {
      mergeFlatTransforms(styleState.style, styleState.flatTransforms)
      styleState.flatTransforms = undefined
    }
    if (styleProps.noNormalize !== false) {
      fixStyles(styleState.style)
      if (!styleProps.noExpand && !styleProps.noMergeStyle) {
        if (isWeb && (isReactNative ? driver?.inputStyle !== 'css' : true)) {
          styleToCSS(styleState.style)
        }
      }
    }
    const flushedKeys = Object.keys(styleState.style)
    for (const atomicStyle of getCSSStylesAtomic(styleState.style)) {
      addStyleToInsertRules(rulesToInsert, atomicStyle)
      classNames[atomicStyle[StyleObjectProperty]] = atomicStyle[StyleObjectIdentifier]
    }
    styleState.style = {}
    for (const key of flushedKeys) {
      delete styleState.usedKeys[key]
    }
    // programs flush here too: this early flush can be followed by
    // shouldDoClasses turning off (tailwind className path), which would
    // otherwise drop them
    if (styleState.programs?.size) {
      lowerAccumulatedPrograms(styleState, (styleObject) => {
        addStyleToInsertRules(rulesToInsert, styleObject)
      })
      styleState.programs.clear()
    }
  }

  for (const [keyOg, valOg] of orderedProcessedProps) {
    let keyInit = keyOg
    let valInit = valOg

    if (keyInit === 'children') {
      viewProps[keyInit] = valInit
      continue
    }

    if (keyInit === 'ref') {
      // ref is composed and assigned explicitly onto viewProps in createComponent;
      // never forward the incoming ref through the style split onto the host element
      continue
    }

    // native: data-* attributes never become native props (they're stripped
    // further down anyway), and the compiler-emitted data-disable-theme/-media
    // flags are already consumed in createComponent. skip them before any per-prop
    // work so they don't pay the isValidStyleKey + handling cost on the hot path.
    if (
      process.env.TAMAGUI_TARGET === 'native' &&
      keyInit[0] === 'd' &&
      keyInit.startsWith('data-')
    ) {
      continue
    }

    if (
      process.env.NODE_ENV === 'development' &&
      (debug === 'profile' || (globalThis as any).time)
    ) {
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

    // normalize shorthands up front
    if (!disableExpandShorthands) {
      if (keyInit in shorthands) {
        keyInit = shorthands[keyInit]
      }
    }

    if (keyInit === 'className') {
      if (typeof valInit === 'string' && valInit) {
        // core className is raw interop: the string passes through untouched.
        // a frontend-bound component's claimed candidates were already consumed
        // by preprocessProps, so what remains here is passthrough CSS emitted
        // after the base Tamagui layer — keep subsequent Tamagui contributions
        // inline so they retain their later, last-wins cascade position
        className = `${className} ${valInit}`.trim()
        if (styleFrontend) {
          flushForwardStylesToClasses()
          shouldDoClasses = false
        }
      }
      continue
    }

    if (keyInit === 'style') {
      mergeStylePropAtCurrentPosition(valInit)
      continue
    }

    // when asChild, skip default props - they shouldn't be passed down to children
    if (asChild) {
      const defaults = getDefaultProps(staticConfig)
      if (defaults) {
        // check both original key and expanded key (after shorthand expansion)
        const defaultVal = defaults[keyOg] ?? defaults[keyInit]
        if (defaultVal !== undefined && valInit === defaultVal) {
          continue
        }
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
            'container',
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
      if (keyInit === 'container' && valInit) {
        if (process.env.TAMAGUI_TARGET === 'web') {
          // the boolean container shorthand: establish an unnamed inline-size
          // query container (decision 17); `@sm:` clauses target it as the
          // nearest container. named containers author container-name /
          // container-type as regular style props instead
          addStyleToInsertRules(rulesToInsert, [
            'container',
            undefined,
            't_container',
            undefined,
            [`.t_container { container-type: ${webContainerType || 'inline-size'}; }`],
          ] satisfies StyleObject)
        }
      }
      if (keyInit === 'transition' && typeof valInit === 'string') {
        const animationConfig = driver?.animations?.[valInit]
        if (
          animationConfig &&
          driver?.outputStyle === 'css' &&
          process.env.IS_STATIC === 'is_static'
        ) {
          // css output needs no runtime component: lower its named transition
          // to ordinary css so the compiler can keep flattening.
          valInit = `all ${animationConfig}`
        } else if (animationConfig) {
          continue
        }
        // unknown names are raw CSS transition values and pass through.
      } else {
        continue
      }
    }

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
        } else if (keyInit === 'textOverflow') {
          // map textOverflow="ellipsis" on Text to numberOfLines + ellipsizeMode.
          // any other value (e.g. "clip") is a no-op on native (default behavior).
          if (isText && valInit === 'ellipsis') {
            viewProps.numberOfLines ??= 1
            viewProps.ellipsizeMode ??= 'tail'
          }
          continue
        } else if (keyInit.startsWith('data-')) {
          continue
        }
      }
    }

    if (process.env.TAMAGUI_TARGET === 'web') {
      // map the RN Text `selectable` prop to the userSelect style so it never
      // reaches the DOM as an invalid attribute (inverse of the native branch
      // mapping userSelect => selectable)
      if (keyInit === 'selectable' && !isValidStyleKeyInit) {
        keyInit = 'userSelect'
        valInit = valInit === false ? 'none' : 'auto'
        isValidStyleKeyInit = isValidStyleKey(keyInit, validStyles, accept)
      }

      if (!noExpand) {
        /**
         * Copying in the accessibility/prop handling from react-native-web here
         * Keeps it in a single loop, avoids dup de-structuring to avoid bundle size
         */

        if (keyInit === 'disabled' && valInit === true) {
          viewProps['aria-disabled'] = true
          // isInput: Input/TextArea wrap the real <input>/<textarea> in a styled HOC, so
          // elementType is the wrapper here - forward disabled down or it never reaches it
          if (
            isInput ||
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
          if (isReactNative) {
            viewProps.testID = valInit
          } else {
            viewProps['data-testid'] = valInit
            // also keep testID when using the RN animation driver (Animated.View
            // from react-native-web only forwards testID, not data-testid). isHOC
            // wrappers don't animate themselves but forward to an inner animated
            // component, so keep testID for them too — otherwise a styled/HOC
            // primitive (e.g. a skinned Dialog.Overlay) loses its testID on native
            // and becomes untestable.
            if ((styleProps.isAnimated || staticConfig.isHOC) && driver?.isReactNative) {
              viewProps.testID = valInit
            }
          }
          continue
        }

        if (keyInit === 'id') {
          viewProps.id = valInit
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

    if (contributeLegacyCondition?.(keyInit, valInit)) {
      continue
    }

    let isVariant = !isValidStyleKeyInit && variants && keyInit in variants

    const isStyleLikeKey = isValidStyleKeyInit || isVariant

    let isPseudo = keyInit in validPseudoKeys
    let isMedia = !isStyleLikeKey && !isPseudo ? getMediaKey(keyInit) : false
    let isMediaOrPseudo = Boolean(isMedia || isPseudo)

    if (isMediaOrPseudo && isMedia === 'group') {
      keyInit = normalizeGroupKey(keyInit, groupContext)
    }

    const isStyleProp = isValidStyleKeyInit || isMediaOrPseudo || (isVariant && !noExpand)

    if (shouldSkipNativeHoverProp(keyInit, isMedia)) {
      continue
    }

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
      // console.groupEnd() // react native was not nesting right
      console.groupCollapsed(
        `  🔑 ${keyOg}${
          keyInit !== keyOg ? ` (shorthand for ${keyInit})` : ''
        } ${shouldPassThrough ? '(pass)' : ''}`
      )
      log({ isVariant, valInit, shouldPassProp })
      if (isClient) {
        log({
          variants,
          variant: variants?.[keyInit],
          isVariant,
          isHOCShouldPassThrough,
          usedKeys: { ...styleState.usedKeys },
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

      if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
        console.groupEnd()
      }

      // a styled child can pass through a parent variant and define the same key
      // itself, so keep applying its own definition when the variants differ
      if (!isVariant) {
        continue
      }
    }

    // after shouldPassThrough
    if (!noSkip) {
      if (
        keyInit in skipProps &&
        !(
          keyInit === 'transition' &&
          typeof valInit === 'string' &&
          !driver?.animations?.[valInit]
        )
      ) {
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

    const disablePropMap = isMediaOrPseudo || !isStyleLikeKey

    propMapper(keyInit, valInit, styleState, disablePropMap, (key, val, originalVal) => {
      const isStyledContextProp = styledContext && key in styledContext

      if (key === 'className') {
        if (typeof val === 'string' && val) {
          className = `${className} ${val}`.trim()
        }
        return
      }

      if (!isHOC && disablePropMap && !isStyledContextProp && !isMediaOrPseudo) {
        viewProps[key] = val
        return
      }

      if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
        console.groupCollapsed('  💠 expanded', keyInit, '=>', key)
        log(val)
        console.groupEnd()
      }

      if (val == null) {
        if (
          process.env.NODE_ENV === 'development' &&
          typeof valInit === 'string' &&
          valInit[0] === '$' &&
          valInit.indexOf(':') !== -1
        ) {
          // `color="$color hover:blue"` dies in token resolution before the
          // program hook can see it; the whole-string token lookup fails.
          // flat clause values use config-first names with no `$`.
          console.warn(
            `[tamagui] ${keyInit}="${valInit}" resolved to nothing — flat clause values use config-first names without "$" (try "${valInit.replace(/\$/g, '')}")`
          )
        }
        return
      }

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
        // flat value programs: every string value contributes per-longhand
        // programs — clause-free strings are base-only programs, which is what
        // resolves configured bare names and numeric strings config-first
        // (`p="4"` is the space token). on web, classes express programs when
        // shouldDoClasses; the noClass/animated-inline path evaluates them at
        // the end of the pass exactly like native. static extraction keeps its
        // own path
        if (
          (process.env.TAMAGUI_TARGET === 'native' ||
            (process.env.TAMAGUI_TARGET === 'web' &&
              (shouldDoClasses || process.env.IS_STATIC !== 'is_static'))) &&
          ((typeof val === 'string' && contributeStylePrograms(styleState, key, val)) ||
            (typeof val === 'number' &&
              transformFamilyProps.has(key) &&
              contributeTransformNumber(styleState, key, val)))
        ) {
          return
        }
        mergeStyle(styleState, key, val, 1, false, originalVal)
        return
      }

      if (contributeLegacyCondition?.(key, val)) {
        return
      }

      // re-run with expanded key
      isPseudo = key in validPseudoKeys
      isMedia = isPseudo ? false : getMediaKey(key)
      isMediaOrPseudo = Boolean(isMedia || isPseudo)
      isVariant = variants && key in variants

      // handle group key transformation for variant-expanded keys (issue #3613)
      if (isMedia === 'group') {
        key = normalizeGroupKey(key, groupContext)
      }

      if (shouldSkipNativeHoverProp(key, isMedia)) {
        return
      }

      if (inlineProps?.has(key)) {
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
        return
      }

      if (isPseudo) {
        if (!val) return

        // TODO can avoid processing this if !shouldDoClasses + state is off
        // (note: can't because we need to set defaults on enter/exit or else enforce that they should)
        const pseudoStyleObject = getSubStyle(
          styleState,
          key,
          val,
          styleProps.noClass && !(process.env.IS_STATIC === 'is_static')
        )

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
            console.info('pseudo:', key, pseudoStyleObject, pseudoStyles)
          }

          for (const psuedoStyle of pseudoStyles) {
            const fullKey = `${psuedoStyle[StyleObjectProperty]}${PROP_SPLIT}${descriptor.name}`
            addStyleToInsertRules(rulesToInsert, psuedoStyle)
            classNames[fullKey] = psuedoStyle[StyleObjectIdentifier]
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
            console.groupCollapsed('pseudo', key, { isDisabled })
            log({ pseudoStyleObject, isDisabled, descriptor, componentState })
            console.groupEnd()
          }

          const importance = descriptor.priority

          const pseudoOriginalValues = styleOriginalValues.get(pseudoStyleObject)
          for (const pkey in pseudoStyleObject) {
            const val = pseudoStyleObject[pkey]
            // when disabled ensure the default value is set for future animations to align

            if (isDisabled) {
              applyDefaultStyle(pkey, styleState)
            } else {
              const curImportance = styleState.usedKeys[pkey] || 0
              const shouldMerge = importance >= curImportance

              if (shouldMerge) {
                if (process.env.IS_STATIC === 'is_static') {
                  pseudos ||= {}
                  pseudos[key] ||= {}
                  pseudos[key][pkey] = val
                }
                mergeStyle(
                  styleState,
                  pkey,
                  val,
                  importance,
                  false,
                  pseudoOriginalValues?.[pkey]
                )
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
              styleState.usedKeys[k] = Math.max(importance, styleState.usedKeys[k] || 0)
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
        const mediaKeyShort = key.slice(isMedia == 'theme' ? 7 : 1)

        hasMedia ||= true
        const hasSpace = val['space']

        if (hasSpace || !shouldDoClasses || styleProps.willBeAnimated) {
          if (!hasMedia || typeof hasMedia === 'boolean') {
            hasMedia = new Set()
          }
          hasMedia.add(mediaKeyShort)
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

        const priority = mediaStylesSeen
        mediaStylesSeen += 1

        // for theme media ($theme-light, $theme-dark), generate CSS classes for proper SSR
        // when noClass is set (inline animation drivers), de-opt to inline styles so the
        if (shouldDoClasses) {
          const mediaStyle = getSubStyle(styleState, key, val, false)
          const mediaStyles = getCSSStylesAtomic(mediaStyle)

          for (const style of mediaStyles) {
            // handle nested media:
            // for now we're doing weird stuff, getCSSStylesAtomic will put the
            // $web into property so we can check it here
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

            // this is imperfect it should be fixed further down, we mess up property when dealing with
            // media-sub-style, like $sm={{ $web: {} }}
            // property is just $web, it should br $web-bg, so we add extra info from style
            // but that info includes the value too
            const subKey = isSubStyle ? style[2] : ''
            const fullKey = `${
              style[StyleObjectProperty]
            }${subKey}${PROP_SPLIT}${mediaKeyShort}${style[StyleObjectPseudo] || ''}`

            addStyleToInsertRules(rulesToInsert, out as any)
            classNames[fullKey] = out[StyleObjectIdentifier]
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
            if (
              process.env.TAMAGUI_TARGET === 'native' &&
              supportsDynamicColorIOS &&
              getSetting('fastSchemeChange')
            ) {
              // iOS will use https://reactnative.dev/docs/dynamiccolorios
              // so need to predefine the dynamic color before merging the styles
              // for example: <StyledYStack $theme-dark={{borderColor: '$red10'}} $theme-light={{borderColor: '$green10'}}> => {borderColor: {dynamic: {dark: '$red10', light: '$green10'}}}

              styleState.style ||= {}
              const scheme = mediaKeyShort
              const oppositeScheme = getOppositeScheme(mediaKeyShort)
              const themeOriginalValues = styleOriginalValues.get(mediaStyle)
              const isCurrentScheme = themeName === scheme || themeName.startsWith(scheme)

              for (const subKey in mediaStyle) {
                const val = extractValueFromDynamic(mediaStyle[subKey], scheme)
                const existing = styleState.style[subKey]

                // Only color properties support DynamicColorIOS - non-color properties
                // like opacity, dimensions, etc. will crash if wrapped with {dynamic: {...}}
                // See: https://github.com/tamagui/tamagui/issues/3096
                // See: https://github.com/tamagui/tamagui/issues/2980
                if (!isColorStyleKey(subKey)) {
                  // non-color properties require re-render to update
                  dynamicThemeAccess = true
                  // only apply if this is the current theme
                  if (isCurrentScheme) {
                    // update mediaStyle so the later merge loop uses correct value
                    mediaStyle[subKey] = val
                  } else {
                    // remove from mediaStyle so it doesn't get merged with wrong theme's value
                    delete mediaStyle[subKey]
                  }
                  continue
                }

                // if there's already a dynamic object from the other theme pseudo prop,
                // merge directly to avoid importance conflicts between $theme-dark and $theme-light
                if (existing?.dynamic) {
                  existing.dynamic[scheme] = val
                  mediaStyle[subKey] = existing
                } else {
                  const oppositeVal = extractValueFromDynamic(existing, oppositeScheme)
                  mediaStyle[subKey] = getDynamicVal({
                    scheme,
                    val,
                    oppositeVal,
                  })
                  mergeStyle(
                    styleState,
                    subKey,
                    mediaStyle[subKey],
                    priority,
                    false,
                    themeOriginalValues?.[subKey]
                  )
                }
              }
            } else {
              // non-ios or no fastschemechange - need re-renders for theme changes
              dynamicThemeAccess = true
              if (!(themeName === mediaKeyShort || themeName.startsWith(mediaKeyShort))) {
                return
              }
            }
          } else if (isGroupMedia) {
            const groupInfo = getGroupPropParts(mediaKeyShort)
            const groupName = groupInfo.name

            // $group-x
            const groupState = groupContext?.[groupName]?.state
            const groupPseudoKey = groupInfo.pseudo
            const groupMediaKey = groupInfo.media

            if (process.env.TAMAGUI_TARGET === 'native' && groupPseudoKey === 'hover') {
              return
            }

            if (!groupState) {
              if (process.env.NODE_ENV === 'development' && debug) {
                log(`No parent with group prop, skipping styles: ${groupName}`)
              }
              // we still want to indicate we should listen! this is how subscribeToGroupContext knows to run
              pseudoGroups ||= new Set()
              return
            }

            const componentGroupState = componentState.group?.[groupName]

            if (groupMediaKey) {
              mediaGroups ||= new Set()
              mediaGroups.add(groupMediaKey)
              const mediaState = componentGroupState?.media
              let isActive = mediaState?.[groupMediaKey]

              // use parent styles if width and height hardcoded we can do an inline media match and avoid double render
              if (!mediaState && groupState.layout) {
                isActive = mediaKeyMatch(groupMediaKey, groupState.layout)
              }

              if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
                log(` 🏘️ GROUP media ${groupMediaKey} active? ${isActive}`, {
                  ...mediaState,
                  usedKeys: { ...styleState.usedKeys },
                })
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
                groupContext?.[groupName].state
              )?.pseudo

              const isActive = componentGroupPseudoState?.[groupPseudoKey]
              const priority = pseudoPriorities[groupPseudoKey]

              if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
                log(
                  ` 🏘️ GROUP pseudo ${groupMediaKey} active? ${isActive}, priority ${priority}`,
                  {
                    componentGroupPseudoState: { ...componentGroupPseudoState },
                    usedKeys: { ...styleState.usedKeys },
                  }
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
          } else if (isPlatformMedia) {
            // Platform styles use specificity-based importance bumps so that more
            // specific platform selectors reliably win over broader ones regardless
            // of prop declaration order (e.g. $tv always overrides
            // $native for the same property, even if tv is listed first).
            importanceBump = getPlatformSpecificityBump(mediaKeyShort)
          }

          const mediaOriginalValues = styleOriginalValues.get(mediaStyle)

          // extract transition from group pseudo styles (e.g., $group-scenario4-hover.transition)
          if (isGroupMedia && mediaStyle.transition) {
            styleState.pseudoTransitions ||= {}
            styleState.pseudoTransitions[
              `$${mediaKeyShort}` as keyof typeof styleState.pseudoTransitions
            ] = mediaStyle.transition as any
          }

          function mergeMediaStyle(key: string, val: any, originalVal?: any) {
            // on native, non-style keys from media queries (like numberOfLines)
            // need to go to viewProps, not style
            if (process.env.TAMAGUI_TARGET === 'native') {
              if (!isValidStyleKey(key, validStyles, accept)) {
                viewProps[key] = val
                return
              }
            }
            styleState.style ||= {}
            const didMerge = mergeMediaByImportance(
              styleState,
              mediaKeyShort,
              key,
              val,
              mediaState[mediaKeyShort],
              importanceBump,
              debug,
              originalVal
            )
            if (didMerge && key === 'fontFamily') {
              styleState.fontFamily = mediaStyle.fontFamily as string
            }
          }

          for (const subKey in mediaStyle) {
            if (subKey === 'space') {
              continue
            }
            if (subKey[0] === '$') {
              const subMediaType = getMediaKey(subKey)
              if (subMediaType === 'platform') {
                if (!isActivePlatform(subKey)) continue
              } else if (subMediaType === 'theme') {
                if (!isActiveTheme(subKey, themeName)) continue
              } else if (subMediaType === true) {
                // regular media query nested inside platform/theme/media
                const subKeyShort = subKey.slice(1)
                if (!mediaState[subKeyShort]) continue
              }

              const nestedVal = mediaStyle[subKey] as Record<string, any>
              const subOriginalValues = styleOriginalValues.get(nestedVal)

              // Nested styles are more specific than their outer context because
              // they require both conditions to be true. Calculate an importance
              // that is the sum of both the outer and inner importances so that:
              //   1) nested always beats non-nested
              //   2) $xs={{ $android: ... }} and
              //      $android={{ $xs: ... }} produce identical importance
              //      (last-declared wins for the same property)
              const isSizeMediaKey = !!mediaState[mediaKeyShort]
              const outerBase = isSizeMediaKey
                ? getMediaKeyImportance(mediaKeyShort)
                : defaultMediaImportance

              let innerBase: number
              if (subMediaType === 'platform') {
                innerBase =
                  defaultMediaImportance + getPlatformSpecificityBump(subKey.slice(1))
              } else if (subMediaType === true) {
                innerBase = getMediaKeyImportance(subKey.slice(1))
              } else {
                innerBase = defaultMediaImportance
              }

              const nestedImportance = outerBase + importanceBump + innerBase + 1

              for (const subSubKey in nestedVal) {
                // expand shorthands, getSubStyle doesn't expand keys
                // inside nested $ objects (they pass through propMapper as-is)
                const expandedKey = shorthands[subSubKey] || subSubKey
                const { usedKeys } = styleState
                if (usedKeys[expandedKey] && usedKeys[expandedKey] > nestedImportance) {
                  continue
                }
                styleState.style ||= {}
                mergeStyle(
                  styleState,
                  expandedKey,
                  nestedVal[subSubKey],
                  nestedImportance,
                  false,
                  subOriginalValues?.[subSubKey]
                )
                if (expandedKey === 'fontFamily') {
                  styleState.fontFamily = nestedVal[subSubKey] as string
                }
              }
            } else {
              mergeMediaStyle(subKey, mediaStyle[subKey], mediaOriginalValues?.[subKey])
            }
          }
        }

        return // end media
      }

      // pass to view props
      if (!isVariant) {
        if (isStyledContextProp) {
          return
        }

        // a text-only style prop on a non-text host must not leak to the DOM
        // as an unknown attribute (and RN would silently ignore it): drop it
        // with a dev diagnostic naming the fix. cold path — only keys that
        // already failed this host's validity table get here
        if (key in stylePropsAll && !isValidStyleKey(key, validStyles, accept)) {
          if (process.env.NODE_ENV === 'development') {
            console.warn(
              `[tamagui] "${key}" is a text style prop and this component is not text — it would render on neither platform. Use a Text-based component, or html.* for raw web elements.`
            )
          }
          return
        }

        viewProps[key] = val
      }
    })

    if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
      try {
        log(` ✔️ expand complete`, keyInit)
        log('style', { ...styleState.style })
        log('viewProps', { ...viewProps })
        log('transforms', { ...styleState.flatTransforms })
      } catch {
        // RN can run into PayloadTooLargeError: request entity too large
      }
      console.groupEnd()
    }
  } // end prop loop

  if (
    process.env.NODE_ENV === 'development' &&
    (debug === 'profile' || (globalThis as any).time)
  ) {
    // @ts-expect-error
    time`split-styles-propsend`
  }

  // lane W3: native programs evaluate last-matching-clause against the live
  // conditions, BEFORE the native post-processing below (fixStyles defaults,
  // the per-weight font-face swap) so program values go through the same
  // finishing as plain values. referenced media keys ride the hasMedia
  // subscription; referenced states surface for event attachment
  let programStates: Set<string> | null = null
  let usesSafeArea = false
  if (
    styleState.programs?.size &&
    (process.env.TAMAGUI_TARGET === 'native' ||
      (!shouldDoClasses && process.env.IS_STATIC !== 'is_static'))
  ) {
    const info = evaluateAccumulatedPrograms(
      styleState,
      themeName,
      mediaState,
      groupContext
    )
    programStates = info.usedStates
    usesSafeArea = info.usesSafeArea
    if (info.usedMediaKeys) {
      if (!hasMedia) {
        hasMedia = new Set()
      }
      if (typeof hasMedia !== 'boolean') {
        for (const usedKey of info.usedMediaKeys) {
          hasMedia.add(usedKey)
        }
      }
      // hasMedia === true means subscribe-to-all and already covers the keys
    }
    // group/container clauses subscribe through the same context channel the
    // legacy $group styles use: keys feed the per-name listeners, sizes feed
    // the layout-to-media math inside subscribeToContextGroup
    if (info.usedGroupKeys) {
      pseudoGroups ||= new Set()
      for (const groupKey of info.usedGroupKeys) {
        pseudoGroups.add(groupKey)
      }
    }
    if (info.usedGroupSizes) {
      mediaGroups ||= new Set()
      for (const sizeKey of info.usedGroupSizes) {
        mediaGroups.add(sizeKey)
      }
    }
  }

  // on native, container config is context + layout measurement, never a
  // react-native style key
  if (process.env.TAMAGUI_TARGET === 'native' && styleState.style) {
    if ('containerType' in styleState.style) delete styleState.style.containerType
    if ('containerName' in styleState.style) delete styleState.style.containerName
  }

  // a named container must also establish containment or its size queries
  // match nothing: `containerName` alone pairs with the default container type
  // (mirroring `isContainer` in createComponent, decision 17). the name may
  // sit in plain style or as a base-only program
  if (
    process.env.TAMAGUI_TARGET === 'web' &&
    (styleState.style?.containerName != null ||
      styleState.programs?.has('containerName')) &&
    !(styleState.style && 'containerType' in styleState.style) &&
    !styleState.programs?.has('containerType')
  ) {
    styleState.style ||= {}
    styleState.style.containerType = webContainerType || 'inline-size'
  }

  // style prop after:

  const avoidNormalize = styleProps.noNormalize === false

  if (!avoidNormalize) {
    if (styleState.style) {
      fixStyles(styleState.style)

      if (!styleProps.noExpand && !styleProps.noMergeStyle) {
        // shouldn't this be better? but breaks some tests weirdly, need to check
        if (isWeb && (isReactNative ? driver?.inputStyle !== 'css' : true)) {
          styleToCSS(styleState.style)
        }
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
      mergeFlatTransforms(styleState.style, styleState.flatTransforms)
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
      (!styleProps.isAnimated || driver?.inputStyle === 'css')

    if (shouldStringifyTransforms && Array.isArray(styleState.style?.transform)) {
      styleState.style.transform = transformsToString(styleState.style!.transform) as any
    }
  }

  if (process.env.TAMAGUI_TARGET === 'web') {
    if (!styleProps.noMergeStyle && styleState.style && shouldDoClasses) {
      let retainedStyles: ViewStyleWithPseudos | undefined
      let shouldRetain = false

      if (styleState.style['$$css']) {
        // avoid re-processing for rnw
      } else {
        const atomic = getCSSStylesAtomic(styleState.style)

        for (const atomicStyle of atomic) {
          const [key, value, identifier] = atomicStyle

          const isAnimatedAndTransitionOnly =
            styleProps.isAnimated &&
            styleProps.noClass &&
            props.animateOnly?.includes(key)

          // animateOnly properties should always use className on server and initial
          // client render to avoid hydration mismatch (server has isAnimated=false but
          // client has isAnimated=true for CSS driver, causing different style output)
          const nonAnimatedTransitionOnly =
            !isAnimatedAndTransitionOnly &&
            !styleProps.isAnimated &&
            isClient &&
            driver?.outputStyle === 'css' &&
            props.animateOnly?.includes(key)

          if (isAnimatedAndTransitionOnly) {
            retainedStyles ||= {}
            retainedStyles[key] = styleState.style[key]
          } else if (nonAnimatedTransitionOnly) {
            retainedStyles ||= {}
            retainedStyles[key] = value
            shouldRetain = true
          } else {
            addStyleToInsertRules(rulesToInsert, atomicStyle)
            classNames[key] = identifier
          }
        }

        if (process.env.NODE_ENV === 'development' && props.debug === 'verbose') {
          // console.groupEnd() // ensure group ended from loop above
          console.groupCollapsed(`🔹 getSplitStyles final style object`)
          console.info(styleState.style)
          console.info(`retainedStyles`, retainedStyles)
          console.groupEnd()
        }

        if (shouldRetain || !(process.env.IS_STATIC === 'is_static')) {
          styleState.style = retainedStyles || {}
        }
      }
    }

    // flat value programs lower to program-block CSS; insertion dedups by the
    // hashed class name, and cross-program order is irrelevant by design
    if (!styleProps.noMergeStyle && shouldDoClasses && styleState.programs?.size) {
      lowerAccumulatedPrograms(styleState, (styleObject) => {
        addStyleToInsertRules(rulesToInsert, styleObject)
      })
    }

    // when noClass is true (inline animation driver) extract non-animatable
    // base styles to atomic CSS classNames so the driver doesn't manage them
    // skip for RNW animation drivers since their AnimatedView doesn't forward classNames
    if (
      !styleProps.noMergeStyle &&
      styleState.style &&
      !shouldDoClasses &&
      styleProps.isAnimated &&
      !driver?.isReactNative
    ) {
      if (!styleState.style['$$css']) {
        const toConvert: Record<string, any> = {}
        let hasProps = false
        const animateOnly = props.animateOnly as string[] | undefined
        for (const key in styleState.style) {
          if (key in nonAnimatableStyleProps) {
            toConvert[key] = styleState.style[key]
            delete styleState.style[key]
            hasProps = true
          }
        }
        if (hasProps) {
          const atomic = getCSSStylesAtomic(toConvert)
          for (const atomicStyle of atomic) {
            addStyleToInsertRules(rulesToInsert, atomicStyle)
            classNames[atomicStyle[StyleObjectProperty]] =
              atomicStyle[StyleObjectIdentifier]
          }
        }
      }
    }
  }

  // native: swap out the right family based on weight/style
  if (process.env.TAMAGUI_TARGET === 'native') {
    // set accessible when tabIndex is 0 (issue #3350)
    if (viewProps.tabIndex === 0) {
      viewProps.accessible ??= true
    }

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

  if (
    process.env.NODE_ENV === 'development' &&
    (debug === 'profile' || (globalThis as any).time)
  ) {
    // @ts-expect-error
    time`split-styles-pre-result`
  }

  // stamp exact token provenance onto the final winning style object. on native
  // (and non-className web) this is the same identity assigned to viewProps.style,
  // so a consumer inspecting the host node's style can recover the token + theme
  // behind each resolved value without any enumerable-key or RN-output change.
  if (shouldTrackStyleTokenProvenance && styleState.style && styleState.tokenProvenance) {
    const provenance: StyleTokenProvenance = {}
    let hasProvenance = false
    for (const key in styleState.tokenProvenance) {
      provenance[key] = { token: styleState.tokenProvenance[key], theme: themeName }
      hasProvenance = true
    }
    if (hasProvenance) {
      setStyleTokenProvenance(styleState.style, provenance)
    }
  }

  const result: GetStyleResult = {
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
    overriddenContextProps: styleState.overriddenContextProps,
    pseudoTransitions: styleState.pseudoTransitions,
    ...(programStates && { programStates }),
    ...(usesSafeArea && { usesSafeArea: true }),
  }

  const asChildExceptStyleLike =
    asChild === 'except-style' || asChild === 'except-style-web'

  if (!styleProps.noMergeStyle) {
    if (!asChildExceptStyleLike) {
      const style = styleState.style

      if (process.env.TAMAGUI_TARGET === 'web') {
        // merge className and style back into viewProps:
        // only emit font class if fontFamily was explicitly in props (not from defaults)
        let fontFamily = isText || isInput ? styleState.fontFamily : null
        if (fontFamily && fontFamily[0] === '$') {
          fontFamily = fontFamily.slice(1)
        }
        const fontFamilyClassName = fontFamily ? `font_${fontFamily}` : ''
        const groupClassName = props.group ? `t_group_${props.group}` : ''
        const containerClassName = props.container ? 't_container' : ''
        const componentNameFinal = props.componentName || staticConfig.componentName
        const componentNameClassName =
          props.asChild || !componentNameFinal || componentNameFinal === 'Text'
            ? ''
            : `is_${componentNameFinal}`

        let classList: string[] = []
        if (componentNameClassName) classList.push(componentNameClassName)
        // is_View gets base flex styles + font reset, is_Text gets base text styles
        if (!isText) classList.push('is_View')
        else classList.push('is_Text')
        if (fontFamilyClassName) classList.push(fontFamilyClassName)
        if (classNames) {
          for (const key in classNames) {
            classList.push(classNames[key])
          }
        }
        if (groupClassName) classList.push(groupClassName)
        if (containerClassName) classList.push(containerClassName)
        // use className variable which may have been updated by tailwind preprocessing
        if (className) classList.push(className)
        const finalClassName = classList.join(' ')

        // use $$css for RNW components OR when animated with RNW driver
        // (driver's AnimatedView doesn't forward className)
        const needsCssStyles =
          isReactNative || (styleProps.isAnimated && driver?.isReactNative)

        if (styleProps.isAnimated && driver?.inputStyle === 'css') {
          // CSS animation driver uses className directly
          viewProps.className = finalClassName
          if (style) {
            viewProps.style = style as any
          }
        } else if (needsCssStyles) {
          // RNW or RNW-animated: apply classNames via $$css
          let cnStyles: Record<string, unknown> | undefined
          for (const name of finalClassName.split(' ')) {
            cnStyles ||= { $$css: true }
            cnStyles[name] = name
          }
          viewProps.style = cnStyles
            ? [...(Array.isArray(style) ? style : [style]), cnStyles]
            : [style]
        } else {
          // regular web: use className directly
          if (finalClassName) {
            viewProps.className = finalClassName
          }
          if (style) {
            viewProps.style = style as any
          }
        }
      } else {
        if (style) {
          // native assign styles
          viewProps.style = style as any
        }
      }
    }
  }

  if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
    if (isClient && isDevTools) {
      // end collapsed log above
      console.groupEnd()

      console.groupCollapsed('🔹 getSplitStyles ===>')
      try {
        // prettier-ignore
        const logs = {
          ...result,
          className,
          componentState,
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

  if (
    process.env.NODE_ENV === 'development' &&
    (debug === 'profile' || (globalThis as any).time)
  ) {
    // @ts-expect-error
    time`split-styles-done`
  }

  return result
}

function mergeFlatTransforms(target: TextStyle, flatTransforms: Record<string, any>) {
  const keys: string[] = []
  for (const key in flatTransforms) {
    keys.push(key)
  }
  keys.sort(sortString)
  for (const key of keys) {
    mergeTransform(target, key, flatTransforms[key], true)
  }
}

function mergeStyle(
  styleState: GetStyleState,
  key: string,
  val: any,
  importance: number,
  disableNormalize = false,
  originalVal?: any
) {
  const { viewProps, styleProps, staticConfig, usedKeys } = styleState

  const existingImportance = usedKeys[key] || 0
  if (existingImportance > importance) {
    return
  }

  // track context overrides for pseudo/media styles (issues #3670, #3676)
  // when a style sets a key that's in context props, update overriddenContextProps
  // so it propagates to children. use the original token value (like '$8')
  // instead of the resolved CSS variable (like 'var(--t-space-8)')
  // so children's functional variants can look up token values.
  const contextConfig = staticConfig.context || staticConfig.parentStaticConfig?.context
  const contextProps = contextConfig?.props
  const inheritedContextPropKeys =
    !staticConfig.context ||
    staticConfig.context === staticConfig.parentStaticConfig?.context
      ? staticConfig.parentStaticConfig?.contextProps
      : undefined
  const contextPropKeys = staticConfig.contextProps || inheritedContextPropKeys
  const isContextProp =
    (contextProps && key in contextProps) ||
    contextPropKeys?.includes(key) ||
    contextConfig?.propKeys?.includes(key)
  if (isContextProp) {
    styleState.overriddenContextProps ||= {}
    // Priority: 1) originalVal from propMapper, 2) tracked original from variant resolution, 3) val
    const originalFromState = styleState.originalContextPropValues?.[key]
    styleState.overriddenContextProps[key] = originalVal ?? originalFromState ?? val
  }

  if (key in stylePropsTransform) {
    styleState.flatTransforms ||= {}
    usedKeys[key] = importance
    if (styleState.programs && importance <= 1) {
      // a later BASE transform value restates the covered programs' bases;
      // their conditions survive (decision 21)
      if (absorbPlainIntoPrograms(styleState, key, val)) return
    }
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
      usedKeys[key] = importance
      if (styleState.programs && importance <= 1) {
        // a later BASE value restates the program's base clause; the
        // program's conditions survive (decision 21). narrower-scope writes
        // (pseudo/media importance) are contributions beside the program
        if (absorbPlainIntoPrograms(styleState, key, out)) return
      }
      styleState.style[key] =
        // if you dont do this you'll be passing props.transform arrays directly here and then mutating them
        // if theres any flatTransforms later, causing issues (mutating props is bad, in strict mode styles get borked)
        key === 'transform' && Array.isArray(out) ? [...out] : out
      if (shouldTrackStyleTokenProvenance) {
        // dev-tools token provenance: this write is the current winner for `key`,
        // so record the token that produced it, or clear a prior token when a
        // literal wins, keeping literal-over-token exact.
        recordStyleTokenProvenance(styleState, key, originalVal)
      }
    }
  }
}

// track which token produced the winning value for a style key so the final
// style object can expose exact provenance. only the base (painted) style is
// tracked — pseudo/media writes flow through mergeStyle at their real importance,
// and a literal override clears any earlier token for that key.
function recordStyleTokenProvenance(
  styleState: GetStyleState,
  key: string,
  originalVal: any
) {
  if (typeof originalVal === 'string' && originalVal[0] === '$') {
    ;(styleState.tokenProvenance ||= {})[key] = originalVal
  } else if (styleState.tokenProvenance && key in styleState.tokenProvenance) {
    delete styleState.tokenProvenance[key]
  }
}

export const getSubStyle = (
  styleState: GetStyleState,
  subKey: string,
  styleIn: object,
  avoidMergeTransform?: boolean
): TextStyle => {
  const { staticConfig, conf, styleProps } = styleState
  const styleOut: TextStyle = {}
  let originalValues: Record<string, any> | undefined
  const styleInOriginalValues = styleOriginalValues.get(styleIn)
  const parentProps = styleState.props
  // prototype-chain view instead of a spread copy: reads fall through to
  // parentProps, avoiding an O(parentProps) allocation per sub-style. define
  // styleIn as own props (not Object.assign) because parentProps is React's
  // frozen props object — [[Set]] of a key that exists read-only up the proto
  // chain (e.g. a base backgroundColor also set in a pseudo/media sub-style)
  // throws, whereas [[DefineOwnProperty]] via descriptors always writes an own.
  styleState.props = Object.create(parentProps, Object.getOwnPropertyDescriptors(styleIn))

  try {
    for (let key in styleIn) {
      const val = styleIn[key]
      key = conf.shorthands[key] || key

      // extract transition from pseudo-style props (e.g., hoverStyle.transition)
      // store it separately for animation drivers to use for enter/exit timing
      if (key === 'transition') {
        styleState.pseudoTransitions ||= {}
        styleState.pseudoTransitions[
          subKey as keyof typeof styleState.pseudoTransitions
        ] = val
        // for CSS driver, also add transition to CSS output so native CSS transitions work
        // group styles ($group-*) need !important to override inline base transition
        const driver = styleState.animationDriver
        if (driver?.outputStyle === 'css') {
          const animationConfig = driver.animations?.[val as string]
          if (animationConfig) {
            const important = subKey[0] === '$' ? ' !important' : ''
            styleOut['transition'] = `all ${animationConfig}${important}`
          }
        }
        // not a known animation name, pass through as raw CSS
        if (
          !styleOut['transition'] &&
          typeof val === 'string' &&
          !driver?.animations?.[val]
        ) {
          styleOut['transition'] = val
        }
        continue
      }

      const shouldSkip = !staticConfig.isHOC && key in skipProps && !styleProps.noSkip
      if (shouldSkip) {
        continue
      }

      propMapper(key, val, styleState, false, (skey, sval, originalVal) => {
        // track original values for context prop propagation
        const trackedOriginalVal = styleInOriginalValues?.[skey] ?? originalVal
        if (trackedOriginalVal !== undefined) {
          originalValues ||= {}
          originalValues[skey] = trackedOriginalVal
        }
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
  } finally {
    styleState.props = parentProps
  }

  if (!avoidMergeTransform) {
    const parentTransform = styleState.style?.transform
    const flatTransforms = styleState.flatTransforms
    const styleOutTransform = styleOut.transform

    if (Array.isArray(styleOutTransform) && styleOutTransform.length) {
      // Inline conflict check - faster than building lookup object for small arrays
      const len = styleOutTransform.length

      if (Array.isArray(parentTransform)) {
        const merged: any[] = []
        outer: for (let i = 0; i < parentTransform.length; i++) {
          const pt = parentTransform[i]
          for (const pk in pt) {
            for (let j = 0; j < len; j++) {
              for (const sk in styleOutTransform[j]) {
                if (pk === sk) continue outer
                break
              }
            }
            merged.push(pt)
            break
          }
        }
        for (let i = 0; i < len; i++) merged.push(styleOutTransform[i])
        styleOut.transform = merged
      }

      if (flatTransforms) {
        outer: for (const fk in flatTransforms) {
          const ck = fk === 'x' ? 'translateX' : fk === 'y' ? 'translateY' : fk
          for (let j = 0; j < len; j++) {
            for (const sk in styleOutTransform[j]) {
              if (ck === sk) continue outer
              break
            }
          }
          mergeTransform(styleOut, fk, flatTransforms[fk])
        }
      }
    } else if (flatTransforms) {
      mergeFlatTransforms(styleOut, flatTransforms)
    }
  }

  if (!styleProps.noNormalize) {
    fixStyles(styleOut)
  }

  // Store original values in WeakMap instead of on the object itself
  // (originalValues is only ever created right before a key is set, so
  // defined implies non-empty)
  if (originalValues) {
    styleOriginalValues.set(styleOut, originalValues)
  }

  return styleOut
}

// on native no need to insert any css
const useInsertEffectCompat = isWeb
  ? React.useInsertionEffect || useIsomorphicLayoutEffect
  : () => {}

// perf: ...args a bit expensive on native
export const useSplitStyles: StyleSplitter = (a, b, c, d, e, f, g, h, i, j, k, l, m) => {
  'use no memo'

  const res = getSplitStyles(a, b, c, d, e, f, g, h, i, j, k, l, m)

  if (process.env.TAMAGUI_TARGET !== 'native') {
    useInsertEffectCompat(() => {
      if (res) {
        insertStyleRules(res.rulesToInsert)
      }
    }, [res?.rulesToInsert])
  }

  return res
}

function addStyleToInsertRules(rulesToInsert: RulesToInsert, styleObject: StyleObject) {
  if (process.env.TAMAGUI_TARGET === 'web') {
    const identifier = styleObject[StyleObjectIdentifier]
    if (shouldInsertStyleRules(identifier)) {
      updateRules(identifier, styleObject[StyleObjectRules])
      rulesToInsert[identifier] = styleObject
    }
  }
}

const defaultColor = process.env.TAMAGUI_DEFAULT_COLOR || 'rgba(0,0,0,0)'
const animatableDefaults = {
  ...Object.fromEntries(
    Object.entries(tokenCategories.color).map(([k, v]) => [k, defaultColor])
  ),
  opacity: 1,
  scale: 1,
  scaleX: 1,
  scaleY: 1,
  rotate: '0deg',
  rotateX: '0deg',
  rotateY: '0deg',
  rotateZ: '0deg',
  skewX: '0deg',
  skewY: '0deg',
  x: 0,
  y: 0,
  borderRadius: 0,
}

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

function passDownProp(
  viewProps: object,
  key: string,
  val: any,
  shouldMergeObject = false
) {
  if (shouldMergeObject) {
    if (key in viewProps) {
      const next = {
        ...viewProps[key],
        ...val,
      }
      // delete so re-adding moves the key to the end: precedence follows the
      // latest occurrence when an HOC child re-iterates props in order. only
      // done on repeat occurrences so the common case avoids the
      // dictionary-mode deopt delete causes on viewProps
      delete viewProps[key]
      viewProps[key] = next
    } else {
      // clone to avoid aliasing the parent's object
      viewProps[key] = { ...val }
    }
  } else {
    viewProps[key] = val
  }
}

function mergeMediaByImportance(
  styleState: GetStyleState,
  mediaKey: string,
  key: string,
  value: any,
  isSizeMedia: boolean,
  importanceBump?: number,
  debugProp?: DebugProp,
  originalVal?: any
) {
  const usedKeys = styleState.usedKeys
  const baseImportance = isSizeMedia
    ? getMediaKeyImportance(mediaKey)
    : defaultMediaImportance
  let importance =
    !usedKeys[key] || baseImportance >= usedKeys[key] ? baseImportance : null
  if (importanceBump) {
    // With a specificity bump, the effective importance is always
    // defaultMediaImportance + bump. This lets higher-specificity styles
    // (e.g. $tv > $native) override lower-specificity ones
    // regardless of prop declaration order, even when getMediaImportanceIfMoreImportant
    // returns null (meaning the same base importance was already applied).
    //
    // We must re-check `usedKeys[key]` here (rather than relying on the null
    // returned by getMediaImportanceIfMoreImportant) because that function only
    // compares against `defaultMediaImportance`, which equals our base before
    // the bump. We need to compare against the *bumped* value to correctly
    // allow a more-specific style to win.
    const bumpedImportance = defaultMediaImportance + importanceBump
    importance =
      !usedKeys[key] || bumpedImportance >= usedKeys[key] ? bumpedImportance : null
  }
  if (process.env.NODE_ENV === 'development' && debugProp === 'verbose') {
    log(
      `mergeMediaByImportance ${key} importance usedKey ${usedKeys[key]} next ${importance}`
    )
  }
  if (importance === null) {
    return false
  }
  if (key in pseudoDescriptors) {
    const descriptor = pseudoDescriptors[key as PseudoDescriptorKey]
    const descriptorKey = descriptor.stateKey || descriptor.name
    const isDisabled = styleState.componentState[descriptorKey] === false
    if (isDisabled) {
      return false
    }
    // For pseudo inside media, value is an object with subkeys
    const pseudoOriginalValues = styleOriginalValues.get(value as object)
    for (const subKey in value) {
      mergeStyle(
        styleState,
        subKey,
        value[subKey],
        importance,
        false,
        pseudoOriginalValues?.[subKey]
      )
    }
  } else {
    mergeStyle(styleState, key, value, importance, false, originalVal)
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
    mergeStyle(styleState, pkey, defaultValues, 1)
  }
}
