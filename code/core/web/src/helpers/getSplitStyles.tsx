import { isAndroid, isClient, isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import {
  StyleObjectIdentifier,
  StyleObjectProperty,
  StyleObjectPseudo,
  StyleObjectRules,
  nonAnimatableStyleProps,
  stylePropsAll,
  stylePropsText,
  stylePropsTransform,
  validStyles as validStylesView,
} from '@tamagui/helpers'
import React from 'react'
import {
  STYLE_FRONTEND_PASSTHROUGH_PREFIX,
  STYLE_FRONTEND_PREPROCESSED,
} from './styleFrontend'
import { getConfig, getFont } from '../config'
import { isDevTools } from '../constants/isDevTools'
import { mediaState as globalMediaState } from './mediaState'
import type {
  AllGroupContexts,
  AnimationDriver,
  ClassNamesObject,
  ComponentContextI,
  DebugProp,
  GetStyleResult,
  GetStyleState,
  GenericCompoundVariant,
  RulesToInsert,
  SpaceTokens,
  SplitStyleProps,
  StaticConfig,
  StyleObject,
  TamaguiComponentState,
  TamaguiInternalConfig,
  TextStyle,
  ThemeParsed,
  TransitionProp,
  ViewStyleObject,
} from '../types'
import { fixStyles } from './expandStyles'
import { getCSSStyleAtomic, styleToCSS } from './getCSSStylesAtomic'
import { getDefaultProps } from './getDefaultProps'
import { insertStyleRules, shouldInsertStyleRules, updateRules } from './insertStyleRule'
import { log } from './log'
import { normalizeValueWithProperty } from './normalizeValueWithProperty'
import { appendFlatClause, propMapper } from './propMapper'
import {
  clearDirectStyle,
  contributeStyleValue,
  contributeStyleString,
  contributeVariantClauseValue,
  directStyleSignature,
  flushDirectStyles,
  getDirectDynamicThemeAccess,
} from './directStyle'
import { contributeFrontendProgram, isFrontendProgram } from './frontendProgram'
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
const validComponentClassName = /^[A-Za-z_][A-Za-z0-9_-]*$/

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

// Styled defaults computed once per static config. mergeComponentProps replaces
// defaults at the prop level, but flat programs merge per clause slot: either a
// conditioned default or a conditioned prop therefore needs the displaced
// styled value re-injected at the styled-base position. This is what preserves
// `styled(View, { flexDirection: 'row' })` under `sm:column`.
const styledDefaultsCache = new WeakMap<object, OrderedPropEntry[] | null>()

function getStyledDefaults(staticConfig: StaticConfig): OrderedPropEntry[] | null {
  let entries = styledDefaultsCache.get(staticConfig)
  if (entries === undefined) {
    entries = null
    const defaults = staticConfig.defaultProps
    if (defaults) {
      for (const key in defaults) {
        ;(entries ||= []).push([key, defaults[key]])
      }
    }
    styledDefaultsCache.set(staticConfig, entries)
  }
  return entries
}

function contributeDisplacedStyledDefaults(
  styledDefaults: OrderedPropEntry[] | null,
  processedProps: Record<string, any>,
  shorthands: Record<string, string>,
  contribute: (key: string, value: any) => void
) {
  if (!styledDefaults) return
  for (let index = 0; index < styledDefaults.length; index++) {
    const key = styledDefaults[index][0]
    const styledValue = styledDefaults[index][1]
    const propValue = processedProps[key]
    if (!(key in stylePropsAll) && !(key in shorthands)) continue
    // equal means the default flowed through the merge untouched and will be
    // processed as an ordinary prop entry; different means a call-site value
    // displaced it. Re-injection is only needed when either contribution is a
    // program; ordinary values retain the prop-level fast path.
    if (
      propValue !== undefined &&
      propValue !== styledValue &&
      ((typeof styledValue === 'string' && styledValue.includes(':')) ||
        (typeof propValue === 'string' && propValue.includes(':')))
    ) {
      contribute(key, styledValue)
    }
  }
}

/**
 * Walks every style contribution in authored forward order and hands each one
 * to `contribute`, without building an intermediate list.
 *
 * Order is base style, then any styled default a call-site value displaced,
 * then the props. That is the cascade: last writer wins, so the props must come
 * last.
 *
 * The common case touches each source object exactly once and allocates
 * nothing. Only compound variants need a materialised list, because a matching
 * compound has to run immediately after the LAST prop that selected it, and
 * that anchor is not known until the props have been indexed.
 */
function forEachPropInForwardOrder(
  processedProps: Record<string, any>,
  staticConfig: StaticConfig,
  shorthands: Record<string, string>,
  contribute: (key: string, value: any) => void
) {
  const processedBaseStyle = staticConfig.baseStyle
  const compoundVariants = staticConfig.compoundVariants
  const styledDefaults = getStyledDefaults(staticConfig)

  if (!compoundVariants?.length) {
    if (processedBaseStyle) {
      for (const key in processedBaseStyle) contribute(key, processedBaseStyle[key])
    }
    contributeDisplacedStyledDefaults(styledDefaults, processedProps, shorthands, contribute)
    for (const key in processedProps) contribute(key, processedProps[key])
    return
  }

  // compound path: needs indexed prop entries to resolve each compound's anchor
  const propEntries = Object.entries(processedProps) as OrderedPropEntry[]
  const orderedEntries = processedBaseStyle
    ? (Object.entries(processedBaseStyle) as OrderedPropEntry[])
    : []
  contributeDisplacedStyledDefaults(styledDefaults, processedProps, shorthands, (k, v) =>
    orderedEntries.push([k, v])
  )

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

  for (let index = 0; index < orderedEntries.length; index++) {
    contribute(orderedEntries[index][0], orderedEntries[index][1])
  }
  const beforeProps = compoundsByAnchor.get(-1)
  if (beforeProps) {
    for (let index = 0; index < beforeProps.length; index++) {
      contribute(beforeProps[index][0], beforeProps[index][1])
    }
  }
  for (let index = 0; index < propEntries.length; index++) {
    contribute(propEntries[index][0], propEntries[index][1])
    const compounds = compoundsByAnchor.get(index)
    if (compounds) {
      for (let i = 0; i < compounds.length; i++) contribute(compounds[i][0], compounds[i][1])
    }
  }
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
//   classNames,
//   rulesToInsert,
// }

// exported so the compiler applies the SAME host-validity decision when it
// flattens: a style-shaped key that fails this check must be dropped with a
// diagnostic, never kept as a DOM attribute (one predicate, two hosts)
export function isValidStyleKey(
  key: string,
  validStyles: Record<string, boolean>,
  accept?: Record<string, any>
) {
  return Boolean(
    key in validStyles ||
    (isWeb &&
      (key === 'transitionProperty' ||
        key === 'transitionDuration' ||
        key === 'transitionTimingFunction' ||
        key === 'transitionDelay' ||
        key === 'transitionBehavior')) ||
    (accept && key in accept)
  )
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
  let hasMedia: boolean | Set<string> = false
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
    viewProps,
    context: componentContext,
    debug,
    flatRulesToInsert: rulesToInsert,
    flatShouldDoClasses: shouldDoClasses,
    flatThemeName: themeName,
    flatMediaState: mediaState,
    flatGroupContext: groupContext,
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
        for (const key in style) clearDirectStyle(styleState, key)
        Object.assign(styleState.classNames, style)
        continue
      }
      const normalized = normalizeStyle(style)
      const styleOriginals = shouldTrackStyleTokenProvenance
        ? styleOriginalValues.get(style)
        : undefined
      for (const key in normalized) {
        if (normalized[key] == null) continue
        contributeStyleValue(
          styleState,
          key,
          normalized[key],
          mergeStyle,
          styleOriginals?.[key]
        )
      }
    }
  }

  const flushForwardStylesToClasses = () => {
    if (!shouldDoClasses) return
    flushDirectStyles(styleState, true)
  }

  // ONE forward pass over the props. the body is a closure so base style,
  // displaced styled defaults and the props themselves feed it directly from
  // their own objects — nothing is copied into an intermediate list first.
  const contributeProp = (keyOg: string, valOg: any) => {
    let keyInit = keyOg
    let valInit = valOg

    if (styleFrontend && keyInit.startsWith(STYLE_FRONTEND_PASSTHROUGH_PREFIX)) {
      keyInit = 'className'
    }

    if (keyInit === 'children') {
      viewProps[keyInit] = valInit
      return
    }

    if (keyInit === 'ref') {
      // ref is composed and assigned explicitly onto viewProps in createComponent;
      // never forward the incoming ref through the style split onto the host element
      return
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
      return
    }

    if (
      process.env.NODE_ENV === 'development' &&
      (debug === 'profile' || (globalThis as any).time)
    ) {
      // @ts-expect-error
      time`before-prop-${keyInit}`
    }

    if (process.env.NODE_ENV === 'test' && keyInit === 'jestAnimatedStyle') {
      return
    }

    if (
      process.env.TAMAGUI_TARGET === 'native' &&
      (keyInit === 'transition' ||
        keyInit === 'transitionProperty' ||
        keyInit === 'transitionDuration' ||
        keyInit === 'transitionTimingFunction' ||
        keyInit === 'transitionDelay' ||
        keyInit === 'transitionBehavior')
    ) {
      return
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
        return
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
          styleState.flatShouldDoClasses = false
        }
      }
      return
    }

    if (keyInit === 'style') {
      mergeStylePropAtCurrentPosition(valInit)
      return
    }

    // when asChild, skip default props - they shouldn't be passed down to children
    if (asChild) {
      const defaults = getDefaultProps(staticConfig)
      if (defaults) {
        // check both original key and expanded key (after shorthand expansion)
        const defaultVal = defaults[keyOg] ?? defaults[keyInit]
        if (defaultVal !== undefined && valInit === defaultVal) {
          return
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
          // animation drivers consume configured preset names directly
          return
        }
      } else {
        return
      }
    }

    // minted frontend values consume before style-key validity and
    // propMapper: the transport key is only a position marker (unique per
    // contribution, so repeated clauses on one property and interleaving
    // with ordinary props survive in authored order). validity applies to
    // the value's real property, so the host ruling still holds
    if (isFrontendProgram(valInit)) {
      if (isValidStyleKey(valInit.property, validStyles, accept)) {
        contributeFrontendProgram(styleState, valInit, mergeStyle)
      } else if (process.env.NODE_ENV === 'development') {
        console.warn(
          `[tamagui] "${valInit.property}" is not a valid style on this component; the frontend value is dropped.`
        )
      }
      return
    }

    let isValidStyleKeyInit = isValidStyleKey(keyInit, validStyles, accept)

    // this is all for partially optimized (not flattened)... maybe worth removing?
    if (isWeb) {
      // React Native Web ignores direct data-* props. This includes ordinary
      // Tamagui views whose final host is swapped to RNW Animated.View.
      if (
        (staticConfig.isReactNative ||
          (styleProps.isAnimated &&
            driver?.isReactNative &&
            !driver.View?.acceptRenderProp)) &&
        keyInit.startsWith('data-')
      ) {
        keyInit = keyInit.replace('data-', '')
        viewProps['dataSet'] ||= {}
        viewProps['dataSet'][keyInit] = valInit
        return
      }

      // standard data attributes are view props, never styles or styled-context
      // values. Context providers receive arbitrary JSX attributes, so handle
      // these before a provider value can make the key look style-like.
      if (keyInit.startsWith('data-')) {
        viewProps[keyInit] = valInit
        return
      }
    }

    if (process.env.TAMAGUI_TARGET === 'native') {
      if (!isValidStyleKeyInit) {
        if (!isAndroid) {
          // only works in android
          if (keyInit === 'elevationAndroid') return
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
          return
        } else if (keyInit.startsWith('data-')) {
          return
        }
      }
    }

    if (process.env.TAMAGUI_TARGET === 'web') {
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
            return
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
          return
        }

        if (keyInit === 'id') {
          viewProps.id = valInit
          return
        }
      }
    }

    let isVariant = !isValidStyleKeyInit && variants && keyInit in variants
    const isStyleLikeKey = isValidStyleKeyInit || isVariant
    const isStyleProp = isValidStyleKeyInit || (isVariant && !noExpand)

    if (isStyleProp && (asChild === 'except-style' || asChild === 'except-style-web')) {
      return
    }

    const shouldPassProp =
      (!isStyleProp && isHOC) ||
      // is in parent variants
      (isHOC && parentVariants && keyInit in parentVariants) ||
      inlineProps?.has(keyInit)

    const parentVariant = parentVariants?.[keyInit]
    const isHOCShouldPassThrough = Boolean(
      isHOC && (isValidStyleKeyInit || parentVariant || keyInit in skipProps)
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
          parentStaticConfig,
        })
      }
    }

    if (shouldPassThrough) {
      passDownProp(viewProps, keyInit, valInit)

      if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
        console.groupEnd()
      }

      // a styled child can pass through a parent variant and define the same key
      // itself, so keep applying its own definition when the variants differ
      if (!isVariant) {
        return
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
        return
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

    const disablePropMap = !isStyleLikeKey

    // ordinary host styles scan and emit directly without propMapper
    if (
      !isHOC &&
      isValidStyleKeyInit &&
      valInit != null &&
      !(process.env.TAMAGUI_TARGET === 'native' && valInit === 'unset') &&
      !(variants && keyInit in variants) &&
      !(accept && keyInit in accept) &&
      !(styledContext && keyInit in styledContext)
    ) {
      contributeStyleValue(styleState, keyInit, valInit, mergeStyle)
      return
    }

    propMapper(
      keyInit,
      valInit,
      styleState,
      disablePropMap,
      (key, val, originalVal, conditionSource) => {
        const isStyledContextProp = styledContext && key in styledContext

        if (key === 'className') {
          if (typeof val === 'string' && val) {
            className = `${className} ${val}`.trim()
          }
          return
        }

        if (!isHOC && disablePropMap && !isStyledContextProp) {
          // a text-only style prop on a non-text host must not leak to the DOM
          // as an unknown attribute (and RN would silently ignore it). every key
          // here already failed this host's validity table, so the extra check
          // only runs on that cold path
          if (key in stylePropsAll && !isValidStyleKey(key, validStyles, accept)) {
            if (process.env.NODE_ENV === 'development') {
              console.warn(
                `[tamagui] "${key}" is a text style prop and this component is not text — it would render on neither platform. Use a Text-based component, or html.* for raw web elements.`
              )
            }
            return
          }
          viewProps[key] = val
          return
        }

        if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
          console.groupCollapsed('  💠 expanded', keyInit, '=>', key)
          log(val)
          console.groupEnd()
        }

        if (val == null) return

        if (accept && key in accept) {
          viewProps[key] = val
          return
        }

        const isHostStyleKey =
          (!isHOC && isValidStyleKey(key, validStyles, accept)) ||
          (process.env.TAMAGUI_TARGET === 'native' && isAndroid && key === 'elevation')
        const isContextProgramKey = !isHOC && Boolean(isStyledContextProp)

        if (conditionSource !== undefined) {
          if (isHostStyleKey || isContextProgramKey) {
            contributeVariantClauseValue(
              styleState,
              key,
              val,
              conditionSource,
              mergeStyle,
              originalVal,
              !isHostStyleKey
            )
          } else if (isHOC) {
            // reduce the clause back to flat-value string form so the wrapped
            // component's own string parser applies the condition
            const appended = appendFlatClause(viewProps[key], conditionSource, val)
            if (appended !== undefined) {
              viewProps[key] = appended
            } else if (process.env.NODE_ENV === 'development') {
              console.warn(
                `[tamagui] conditional variant value for "${key}" is not string-representable; dropping the clause`
              )
            }
          } else if (process.env.NODE_ENV === 'development') {
            console.warn(
              `[tamagui] "${key}" is not a valid style on this component; the conditional variant value is dropped.`
            )
          }
          return
        }

        if (isHostStyleKey || isContextProgramKey) {
          contributeStyleValue(
            styleState,
            key,
            val,
            mergeStyle,
            originalVal,
            !isHostStyleKey
          )
          return
        }

        isVariant = variants && key in variants

        if (inlineProps?.has(key)) {
          viewProps[key] = props[key] ?? val
        }

        const shouldPassThrough =
          isHOC && Boolean(parentStaticConfig?.variants?.[keyInit])

        if (shouldPassThrough) {
          passDownProp(viewProps, key, val)
          if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
            console.groupCollapsed(` - passing down prop ${key}`)
            log({ val, after: { ...viewProps[key] } })
            console.groupEnd()
          }
          return
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
      }
    )

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
  } // end prop contribution

  forEachPropInForwardOrder(processedProps, staticConfig, shorthands, contributeProp)

  if (
    process.env.NODE_ENV === 'development' &&
    (debug === 'profile' || (globalThis as any).time)
  ) {
    // @ts-expect-error
    time`split-styles-propsend`
  }

  const conditionalStates = styleState.flatStateKeys || null
  const usesSafeArea = !!styleState.flatUsesSafeArea
  if (styleState.flatMediaKeys?.size) {
    if (!hasMedia) hasMedia = new Set()
    if (typeof hasMedia !== 'boolean') {
      for (const key of styleState.flatMediaKeys) hasMedia.add(key)
    }
  }
  if (styleState.flatGroupKeys?.size) {
    pseudoGroups ||= new Set()
    for (const key of styleState.flatGroupKeys) pseudoGroups.add(key)
  }
  if (styleState.flatGroupMedia?.size) {
    mediaGroups ||= new Set()
    for (const key of styleState.flatGroupMedia) mediaGroups.add(key)
  }

  // hand the selected transition to animation drivers and keep it out of native
  // destination styles, where `transition` is not a React Native style key.
  const effectiveTransition = styleState.style?.transition as
    | TransitionProp
    | null
    | undefined
  if (
    effectiveTransition != null &&
    styleState.style &&
    (process.env.TAMAGUI_TARGET === 'native' || driver?.outputStyle !== 'css')
  ) {
    delete styleState.style.transition
  }

  // on native, container config is context + layout measurement, never a
  // react-native style key
  if (process.env.TAMAGUI_TARGET === 'native' && styleState.style) {
    if ('containerType' in styleState.style) delete styleState.style.containerType
    if ('containerName' in styleState.style) delete styleState.style.containerName
  }

  // a named container also establishes containment
  if (
    process.env.TAMAGUI_TARGET === 'web' &&
    (styleState.style?.containerName != null || classNames.containerName) &&
    !(styleState.style && 'containerType' in styleState.style) &&
    !classNames.containerType
  ) {
    contributeStyleValue(
      styleState,
      'containerType',
      webContainerType || 'inline-size',
      mergeStyle
    )
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
    // and allow proper merging before applying
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
    flushDirectStyles(styleState)

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
        for (const key in styleState.style) {
          if (key in nonAnimatableStyleProps) {
            // reproduce the direct-emission identity so the surviving class
            // matches its server-rendered counterpart exactly
            const atomicStyle = getCSSStyleAtomic(
              key,
              styleState.style[key],
              '',
              undefined,
              directStyleSignature(key, styleState.style[key]),
              true
            )
            delete styleState.style[key]
            if (atomicStyle) {
              addStyleToInsertRules(rulesToInsert, atomicStyle)
              classNames[atomicStyle[StyleObjectProperty]] =
                atomicStyle[StyleObjectIdentifier]
            }
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

  // built without conditional spreads: this runs once per component render and
  // each spread transpiles to an ownKeys/defineProperty helper chain that
  // profiles at several percent of total style-resolution time
  const result: GetStyleResult = {
    hasMedia,
    fontFamily: styleState.fontFamily,
    viewProps,
    style: styleState.style as any,
    classNames,
    rulesToInsert,
    pseudoGroups,
    mediaGroups,
    overriddenContextProps: styleState.overriddenContextProps,
  }
  if (effectiveTransition != null) result.effectiveTransition = effectiveTransition
  if (conditionalStates) result.programStates = conditionalStates
  if (usesSafeArea) result.usesSafeArea = true
  if (getDirectDynamicThemeAccess(styleState)) result.dynamicThemeAccess = true

  if (styleState.flatEnterKeys || styleState.flatExitKeys) {
    const effectiveKeys = (keys?: Set<string>) => {
      if (!keys) return
      const out = new Set<string>()
      for (const key of keys) {
        out.add(
          key === '--t-x' || key === '--t-y'
            ? 'translate'
            : key === '--t-scale-x' || key === '--t-scale-y'
              ? 'scale'
              : key
        )
      }
      return out
    }
    result.programLifecycleStyleKeys = {
      enter: effectiveKeys(styleState.flatEnterKeys),
      exit: effectiveKeys(styleState.flatExitKeys),
    }
  }

  const asChildExceptStyleLike =
    asChild === 'except-style' || asChild === 'except-style-web'

  if (!styleProps.noMergeStyle) {
    if (!asChildExceptStyleLike) {
      const style = styleState.style

      if (process.env.TAMAGUI_TARGET === 'web') {
        // merge className and style back into viewProps:
        // only emit font class if fontFamily was explicitly in props (not from defaults)
        const fontFamily = isText || isInput ? styleState.fontFamily : null
        const fontFamilyClassName = fontFamily ? `font_${fontFamily}` : ''
        const groupClassName = props.group ? `t_group_${props.group}` : ''
        const containerClassName = props.container ? 't_container' : ''
        const displayNameClassName =
          props.asChild ||
          !styleProps.displayName ||
          styleProps.displayName === 'Text' ||
          styleProps.displayName === 'View' ||
          !validComponentClassName.test(styleProps.displayName)
            ? ''
            : `is_${styleProps.displayName}`

        let classList: string[] = []
        if (displayNameClassName) classList.push(displayNameClassName)
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
  const transform: Record<string, any>[] = []
  if ('x' in flatTransforms) transform.push({ translateX: flatTransforms.x })
  if ('y' in flatTransforms) transform.push({ translateY: flatTransforms.y })
  if ('rotate' in flatTransforms) transform.push({ rotate: flatTransforms.rotate })

  const hasScaleX = 'scaleX' in flatTransforms
  const hasScaleY = 'scaleY' in flatTransforms
  if (hasScaleX && hasScaleY && Object.is(flatTransforms.scaleX, flatTransforms.scaleY)) {
    transform.push({ scale: flatTransforms.scaleX })
  } else {
    if (hasScaleX) transform.push({ scaleX: flatTransforms.scaleX })
    if (hasScaleY) transform.push({ scaleY: flatTransforms.scaleY })
    if (!hasScaleX && !hasScaleY && 'scale' in flatTransforms) {
      transform.push({ scale: flatTransforms.scale })
    }
  }

  const keys: string[] = []
  for (const key in flatTransforms) {
    if (
      key !== 'x' &&
      key !== 'y' &&
      key !== 'rotate' &&
      key !== 'scale' &&
      key !== 'scaleX' &&
      key !== 'scaleY'
    )
      keys.push(key)
  }
  keys.sort(sortString)
  for (const key of keys) {
    transform.push({ [mapTransformKeys[key] || key]: flatTransforms[key] })
  }
  if (Array.isArray(target.transform)) {
    transform.push(...(target.transform as any))
  }
  target.transform = transform as any
}

function mergeStyle(
  styleState: GetStyleState,
  key: string,
  val: any,
  _importance: number,
  disableNormalize = false,
  originalVal?: any
) {
  const { viewProps, styleProps, staticConfig } = styleState

  // track context overrides for pseudo/media styles (issues #3670, #3676)
  // when a style sets a key that's in context props, update overriddenContextProps
  // so it propagates to children. use the original token value (like '8')
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
// tracked, and a literal override clears any earlier token for that key.
function recordStyleTokenProvenance(
  styleState: GetStyleState,
  key: string,
  originalVal: any
) {
  let tokenName = typeof originalVal === 'string' ? originalVal : ''
  if (tokenName) {
    const slash = tokenName.lastIndexOf('/')
    const opacity = slash === -1 ? NaN : Number(tokenName.slice(slash + 1))
    if (Number.isInteger(opacity) && opacity >= 0 && opacity <= 100) {
      tokenName = tokenName.slice(0, slash)
    }
  }
  const isConfiguredToken =
    tokenName !== '' &&
    (Object.prototype.hasOwnProperty.call(styleState.theme, tokenName) ||
      Object.prototype.hasOwnProperty.call(
        styleState.conf.themes?.[styleState.flatThemeName || ''] || {},
        tokenName
      ) ||
      Object.values(styleState.conf.tokensParsed).some((category) =>
        Object.prototype.hasOwnProperty.call(category, tokenName)
      ))
  if (isConfiguredToken) {
    ;(styleState.tokenProvenance ||= {})[key] = originalVal
  } else if (styleState.tokenProvenance && key in styleState.tokenProvenance) {
    delete styleState.tokenProvenance[key]
  }
}

export const getSubStyle = (
  styleState: GetStyleState,
  _subKey: string,
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

function passDownProp(viewProps: object, key: string, val: any) {
  viewProps[key] = val
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
