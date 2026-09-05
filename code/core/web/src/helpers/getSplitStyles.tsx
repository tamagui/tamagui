// leaf subpath on purpose, see grammarConfig
import { getTransitionResolver } from '@tamagui/animation-helpers/transitionResolver'
import { isAndroid, isClient, supportsDynamicColorIOS } from '@tamagui/constants'
import {
  StyleObjectIdentifier,
  StyleObjectRules,
  nonAnimatableStyleProps,
  stylePropsAll,
  stylePropsInput,
  stylePropsText,
  stylePropsTransform,
  validStyles as validStylesView,
} from '@tamagui/helpers'
import {
  addTransformValue,
  createTransformAccumulator,
  finalizeTransformAccumulator,
  getTransformPartKeys,
  removeTransformValue,
} from '@tamagui/style-grammar/runtime'
import { getConfig, getConfigMaybe, getFont } from '../config'
import { isDevTools } from '../constants/isDevTools'
import { defaultComponentStateMounted } from '../defaultComponentState'
import { isVariable } from '../createVariable'
import type {
  AllGroupContexts,
  AnimationDriver,
  AnimationDriverLike,
  ClassNamesObject,
  ComponentContextI,
  DebugProp,
  GetStyleResult,
  GetStyleState,
  RulesToInsert,
  SplitStyleProps,
  StaticConfig,
  StyleObject,
  StylePiece,
  TamaguiComponentState,
  TamaguiInternalConfig,
  TextStyle,
  ThemeParsed,
  TransitionProp,
  Variable,
} from '../types'
import { stylePieceSymbol } from '../types'
import {
  type AtomicSlotEntry,
  addComposition,
  canGenerateCSS,
  flushDirectStyles,
  registerAtomicSlot,
} from './getCSSStylesAtomic'
import { expandStyle } from './expandStyle'
import {
  classifyBorderComponents,
  splitComponents,
  startsValueFunction,
} from './borderComponents'
import { fixStyles } from './expandStyles'
import { getConfigRevisionState } from './grammarConfig'
import { mediaState as globalMediaState, mediaKeyMatch } from './mediaState'
import { getStyleStaticConfig, type StyleStaticConfig } from './styleStaticConfig'
import { mergeFrontendCondition, type FrontendClassSink } from './styleFrontend'
import { nativeTextInputColorProps, normalizeNativeStyle } from './nativeStyleEngine'
import { warnOnce, warnRefusedValue } from './warnOnce'

export { getStyleStaticConfig }

import { isColorStyleKey } from './getDynamicVal'
import { getDynamicEnv } from './styledDynamic'
import {
  getRulesForIdentifier,
  insertStyleRules,
  shouldInsertStyleRules,
  updateRules,
} from './insertStyleRule'
import { log } from './log'
import { normalizeColor } from './normalizeColor'
import { normalizeValueWithProperty } from './normalizeValueWithProperty'
import { parseNativeStyle } from './parseNativeStyle.native'
import { parseNativeTransform } from './parseNativeTransform.native'
import { isRemValue, resolveRem } from './resolveRem'
import { resolveNativeUnits } from './resolveNativeUnits'
import { resolveVariableValue } from './resolveVariableValue'
import { HOC_CLASSNAME_MARKER, skipProps } from './skipProps'
import { styleOriginalValues } from './styleOriginalValues'
import {
  setStyleTokenProvenance,
  type StyleDebugReceipt,
  type StyleTokenProvenance,
} from './styleProvenance'
import { THEME_REF_PREFIX } from './themeRef'
import { transformsToString } from './transformsToString'
import {
  isStylePiece,
  isStylePieceCacheable,
  setStylePieceCompiler,
  setStylePieceResolver,
} from '../style'

export { STYLE_TOKEN_PROVENANCE_KEY, getStyleTokenProvenance } from './styleProvenance'
export type {
  StyleDebugReceipt,
  StyleDebugTier,
  StyleTokenBinding,
  StyleTokenProvenance,
} from './styleProvenance'
export { styleOriginalValues }

export type SplitStyles = ReturnType<typeof getSplitStyles>

const shouldTrackStyleTokenProvenance =
  process.env.NODE_ENV === 'development' &&
  process.env.TAMAGUI_ENABLE_STYLE_TOKEN_PROVENANCE === '1'
export type SplitStyleResult = ReturnType<typeof getSplitStyles>

// note: we intentionally don't cache conf at module level here
// because createTamagui may be called multiple times (HMR, tests)
// and getConfig() already has its own caching

export type StyleSplitter = (
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
  animationDriver?: AnimationDriverLike | null,
  styleStaticConfig?: StyleStaticConfig
) => null | GetStyleResult

// ── conditions ───────────────────────────────────────────────────────────────

type Condition = [
  value: number,
  platformRank: number,
  key: string,
  selector: string,
  theme: string,
  wrappers: string[],
  atoms: string[],
  ranks: number[],
] & { problem?: string }

const conditionValue = 0
const conditionPlatform = 1
const conditionKey = 2
const conditionSelector = 3
const conditionTheme = 4
const conditionWrappers = 5
const conditionAtoms = 6
const conditionRanks = 7

const conditionResolvedFlag = 16
const conditionPlatformPseudoFlag = 32

function createCondition(parent?: Condition | null): Condition {
  return parent
    ? [
        parent[conditionValue] & 63,
        parent[conditionPlatform],
        '',
        parent[conditionSelector],
        parent[conditionTheme],
        parent[conditionWrappers].slice(),
        parent[conditionAtoms].slice(),
        parent[conditionRanks].slice(),
      ]
    : [19, 0, '', '', '', [], [], []]
}

function setConditionUnresolved(condition: Condition, name = '') {
  condition[conditionValue] &= ~conditionResolvedFlag
  if (process.env.NODE_ENV !== 'production') condition.problem ||= name
}

function appendConditionWrapper(condition: Condition, wrapper: string) {
  const wrappers = condition[conditionWrappers]
  if (!wrappers.includes(wrapper)) wrappers.push(wrapper)
}

function resolveConditionModifier(
  state: GetStyleState,
  condition: Condition,
  authored: string
) {
  const compiled = getConfigRevisionState(state.conf)
  const modifier = compiled.resolveCondition(authored)
  if (!modifier) {
    setConditionUnresolved(condition, authored)
    return
  }
  const [name, kind, rank] = modifier

  const atoms = condition[conditionAtoms]
  let atomIndex = 0
  while (atomIndex < atoms.length && atoms[atomIndex] < name) atomIndex++
  if (atoms[atomIndex] === name) return
  for (let index = atoms.length; index > atomIndex; index--)
    atoms[index] = atoms[index - 1]
  atoms[atomIndex] = name

  if (kind === 3) {
    condition[conditionPlatform] = Math.max(condition[conditionPlatform], rank)
    if (!modifier[6]) {
      condition[conditionValue] &= ~3
    }
    return
  }

  const precedence =
    kind === 2
      ? 1 + Math.min(rank, 63)
      : kind === 6
        ? 65 + Math.min(rank, 63)
        : kind === 4
          ? 129
          : kind === 5
            ? 161 + rank
            : 225 + rank
  const ranks = condition[conditionRanks]
  let rankIndex = 0
  while (rankIndex < ranks.length && ranks[rankIndex] >= precedence) rankIndex++
  for (let index = ranks.length; index > rankIndex; index--)
    ranks[index] = ranks[index - 1]
  ranks[rankIndex] = precedence

  const buildCSS = canGenerateCSS && state.flatShouldDoClasses
  if (kind === 2) {
    const query = modifier[3]
    if (!query) return setConditionUnresolved(condition, name)
    if (buildCSS) appendConditionWrapper(condition, `@media ${query}`)
    if (!state.flatMediaState?.[name]) condition[conditionValue] &= ~1
    ;(state.flatMediaKeys ||= new Set()).add(name)
    return
  }
  if (kind === 4) {
    if (process.env.TAMAGUI_TARGET === 'native') condition[conditionTheme] = name
    if (buildCSS) condition[conditionSelector] += `:where(.t_${name}, .t_${name} *)`
    if (
      state.flatThemeName !== name &&
      state.flatThemeName?.startsWith(`${name}_`) !== true
    ) {
      condition[conditionValue] &= ~1
    }
    return
  }
  if (kind === 6) {
    const size = modifier[4]!
    const containerName = modifier[5]!
    const groupName = `@${containerName}`
    if (buildCSS) {
      const query = modifier[3]
      appendConditionWrapper(
        condition,
        containerName ? `@container ${containerName} ${query}` : `@container ${query}`
      )
    }
    const component = state.componentState.group?.[groupName]
    const context = state.flatGroupContext?.[groupName]
    if (
      process.env.NODE_ENV === 'development' &&
      containerName &&
      !component &&
      !context &&
      state.flatGroupContext?.[containerName]
    ) {
      warnOnce(
        `group-container:${containerName}`,
        `@${size}/${containerName}: targets group="${containerName}", but groups no longer establish query containers. Add container="${containerName}" to that group.`
      )
    }
    const match = component?.media?.[size]
    if (
      !(match ?? (context?.state.layout && mediaKeyMatch(size, context.state.layout)))
    ) {
      condition[conditionValue] &= ~1
    }
    ;(state.flatGroupKeys ||= new Set()).add(groupName)
    ;(state.flatGroupMedia ||= new Set()).add(size)
    return
  }

  const selector = modifier[3]!
  if (kind === 5) {
    const groupName = modifier[4]!
    if (buildCSS) {
      condition[conditionSelector] += `:where(.t_group_${groupName}${selector} *)`
    }
    const component = state.componentState.group?.[groupName]
    const context = state.flatGroupContext?.[groupName]
    if (!(component?.pseudo ?? context?.state.pseudo)?.[modifier[5]!]) {
      condition[conditionValue] &= ~1
    }
    ;(state.flatGroupKeys ||= new Set()).add(groupName)
  } else {
    if (rank === 0 || rank === 2 || rank === 4) {
      condition[conditionValue] |= conditionPlatformPseudoFlag
    } else if (rank === 6) {
      condition[conditionValue] |= 4
    } else if (rank === 7) {
      condition[conditionValue] |= 8
    }
    if (buildCSS) {
      condition[conditionSelector] +=
        `:where(${selector}${selector[0] === '.' ? `, ${selector} *` : ''})`
    }
    const component = state.componentState
    const active =
      rank === 1
        ? component.focusWithin
        : rank === 3
          ? component.focusVisible
          : rank === 4
            ? component.press || component.pressIn
            : rank === 5
              ? component.disabled || state.props.disabled
              : rank === 6
                ? component.unmounted
                : rank === 7
                  ? state.styleProps.isExiting
                  : component[name]
    if (!active) condition[conditionValue] &= ~1
    if (selector[0] === ':') (state.flatStateKeys ||= new Set()).add(name)
  }
  if (rank === 0 && buildCSS) {
    appendConditionWrapper(condition, '@media (hover: hover)')
  }
}

/** resolve a colon-joined condition text (an object key) into the cursor */
function resolveConditionText(state: GetStyleState, condition: Condition, text: string) {
  let start = 0
  for (let index = 0; index <= text.length; index++) {
    if (index !== text.length && text.charCodeAt(index) !== 58) continue
    if (index === start) {
      setConditionUnresolved(condition)
      return
    }
    if (!(condition[conditionValue] & conditionResolvedFlag)) return
    resolveConditionModifier(state, condition, text.slice(start, index))
    start = index + 1
  }
}

/** pack the accumulated cursor into the condition number, enforcing depth */
function commitCondition(condition: Condition): number {
  if (!(condition[conditionValue] & conditionResolvedFlag)) {
    condition[conditionValue] = 0
    return 0
  }
  const atoms = condition[conditionAtoms]
  condition[conditionKey] = atoms.join(':')
  const ranks = condition[conditionRanks]
  const depth = ranks.length
  if (depth > 5) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        `a flat value clause supports at most 5 non-platform conditions; received ${depth} in "${condition[conditionKey]}:"`
      )
    }
    return 0
  }
  let precedence = condition[conditionPlatform] * 6 + depth
  for (let index = 0; index < 5; index++) {
    precedence = precedence * 256 + (ranks[index] || 0)
  }
  const value = precedence * 256 + condition[conditionValue]
  condition[conditionValue] = value
  return value
}

function conditionFromKey(state: GetStyleState, key: string, parent?: Condition | null) {
  if (!key) return createCondition(parent)
  if (!parent) {
    // one element's props name the same conditions over and over (`web:` and
    // `hover:` on width, height, margin, background...). a committed condition
    // is immutable and reads only pass-fixed state, so resolve each key once.
    // shouldDoClasses can flip mid-pass and changes what gets built, so it
    // scopes the cache.
    const direct = state as DirectState
    let cache = direct.flatConditions
    if (
      cache === undefined ||
      direct.flatConditionsClassed !== state.flatShouldDoClasses
    ) {
      cache = direct.flatConditions = new Map()
      direct.flatConditionsClassed = state.flatShouldDoClasses
    }
    const known = cache.get(key)
    if (known !== undefined) return known
    const resolved = createCondition(null)
    resolveConditionText(state, resolved, key)
    commitCondition(resolved)
    cache.set(key, resolved)
    return resolved
  }
  const condition = createCondition(parent)
  resolveConditionText(state, condition, key)
  commitCondition(condition)
  return condition
}

// does this object's first key open a resolvable modifier chain, or does it
// name a `default`? the probe resolves through a scratch cursor and the
// caller's own enumeration does the contribution.
function classifyConditionalObject(
  value: Record<string, any>,
  state: GetStyleState | null,
  isChain?: (chain: string) => boolean,
  firstCondition?: Condition
): number {
  if ('default' in value) return -1
  for (const key in value) {
    if (!key.length) return 0
    if (!state) return isChain?.(key) ? 1 : 0
    const condition = firstCondition || createCondition()
    resolveConditionText(state, condition, key)
    return commitCondition(condition)
  }
  return 0
}

type StylePass = any[]

const passStyleState = 0
const passClassName = 20
const passShouldDoClasses = 21
const passContainerValue = 22
const passContainerName = 23
const passContainerType = 24
const passFrontendGroup = 25
const passFrontendContainer = 26
const passFrontendContainerType = 27
const passSourceLayer = 28
const passParentCursor = 29
const passMapSourceKey = 30

const passFlags = 13

// style contribution precedence tiers (ownsSourceLayer): a higher tier's
// unconditional value replaces a lower tier's for the same property, equal
// tiers are last-wins, conditional values layer over lower tiers instead
const sourceLayerBase = 0
const sourceLayerVariant = 1
const sourceLayerResolver = 2
const sourceLayerProps = 3
const sourceLayerStyle = 4

const passNoSkipFlag = 1
const passDisableShorthandsFlag = 2
const passNoExpandFlag = 4
const passNoMergeFlag = 8
const passHocFlag = 16
const passTextFlag = 32
const passInputFlag = 64
const passAsChildStyleFlag = 128

// exported so the compiler applies the SAME host-validity decision when it
// flattens: a style-shaped key that fails this check must be dropped with a
// diagnostic, never kept as a DOM attribute (one predicate, two hosts)
export function isValidStyleKey(key: string, validStyles: Record<string, boolean>) {
  return key in validStyles
}

function effectiveLifecycleKeys(keys?: Set<string>) {
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

function contributeProp(
  pass: StylePass,
  keyOg: string,
  valOg: any,
  originalOg = valOg,
  disabled = false
) {
  const [
    styleState,
    conf,
    props,
    viewProps,
    ,
    validStyles,
    neverSkipProps,
    variants,
    inlineProps,
    parentVariants,
    styleFrontend,
    styledContext,
    styledContextKeys,
    flags,
    debug,
    ,
    defaultProps,
    driverAnimations,
    driverOutputStyle,
    elementType,
  ] = pass
  const noSkip = Boolean(flags & passNoSkipFlag)
  const disableExpandShorthands = Boolean(flags & passDisableShorthandsFlag)
  const noExpand = Boolean(flags & passNoExpandFlag)
  const noMergeStyle = Boolean(flags & passNoMergeFlag)
  const isHOC = Boolean(flags & passHocFlag)
  const isText = Boolean(flags & passTextFlag)
  const isInput = Boolean(flags & passInputFlag)
  const shorthands = conf.shorthands
  const shouldSkipDirectProps = !noSkip && !isHOC
  const shouldCheckSkipProps = !noSkip
  const asChildExceptStyleLike = Boolean(flags & passAsChildStyleFlag)
  const isTextOrInput = isText || isInput
  const hocParentVariants = isHOC ? parentVariants : undefined
  let keyInit = keyOg
  let valInit = valOg

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

  // normalize shorthands up front
  if (!disableExpandShorthands) {
    if (keyInit in shorthands) {
      keyInit = shorthands[keyInit]
    }
  }

  if (keyInit === 'className') {
    if (pass[passParentCursor]) {
      if (process.env.TAMAGUI_TARGET === 'web' && typeof valInit === 'string') {
        pass[passClassName] = `${pass[passClassName]} ${valInit}`.trim()
      }
      return
    }
    if (
      typeof valInit === 'string' &&
      valInit &&
      (process.env.TAMAGUI_TARGET === 'web' || styleFrontend?.resolveClassName)
    ) {
      if (noMergeStyle) {
        viewProps.className = valInit
        return
      }
      const resolveClassName = styleFrontend?.resolveClassName
      // composed utilities (ring width + ring color -> one boxShadow) arrive as
      // `__`-prefixed keys the frontend folds together after the walk. only
      // allocates when a class actually emits one.
      let composedProps: Record<string, any> | null = null
      const sink: FrontendClassSink = (entry) => {
        const property = entry[0]
        const condition = entry[2]
        if (property.charCodeAt(0) === 95 && property.charCodeAt(1) === 95) {
          composedProps ||= {}
          composedProps[property] = mergeFrontendCondition(
            composedProps[property],
            entry[1],
            condition
          )
          return
        }
        if (condition !== undefined) {
          if (isValidStyleKey(property, validStyles)) {
            contributeValue(styleState, property, entry[1], undefined, false, condition)
          } else if (process.env.NODE_ENV === 'development') {
            console.warn(
              `[tamagui] "${property}" is not a valid style on this component; the frontend value is dropped.`
            )
          }
          return
        }
        if (property === 'group') pass[passFrontendGroup] = entry[1]
        else if (property === 'container') pass[passFrontendContainer] = entry[1]
        else if (property === 'containerType') {
          pass[passFrontendContainerType] = entry[1]
        }
        contributeProp(pass, property, entry[1])
      }
      let start = 0
      for (let index = 0; index <= valInit.length; index++) {
        if (index !== valInit.length && valInit.charCodeAt(index) > 32) continue
        if (index === start) {
          start = index + 1
          continue
        }
        const candidate = valInit.slice(start, index)
        const preserveRaw = resolveClassName
          ? resolveClassName(candidate, conf, sink)
          : true
        if (preserveRaw === null) {
          if (process.env.NODE_ENV === 'development') {
            warnOnce(
              `[tamagui] frontend candidate "${candidate}" is unavailable on this platform and was dropped.`
            )
          }
        } else if (preserveRaw) {
          pass[passClassName] = pass[passClassName]
            ? `${pass[passClassName]} ${candidate}`
            : candidate
          if (resolveClassName) {
            if (pass[passShouldDoClasses]) {
              completeResolvedStyles(styleState)
              flushDirectStyles(styleState, true)
            }
            pass[passShouldDoClasses] = false
            styleState.flatShouldDoClasses = false
          }
        }
        start = index + 1
      }
      if (composedProps) {
        // contributed at the className's own authored position, so composing a
        // ring never moves an unrelated property to another precedence tier
        const composed = styleFrontend!.compose?.(composedProps)
        for (const property in composed) {
          contributeProp(pass, property, composed[property])
        }
      }
    }
    return
  }

  if (keyInit === HOC_CLASSNAME_MARKER) {
    if (valInit && typeof valInit === 'object') {
      const direct = styleState as DirectState
      const layers = (direct.flatPropertyLayers ||= new Map())
      for (const property in valInit) {
        clearDirectStyle(styleState, property)
        styleState.classNames[property] = valInit[property]
        layers.set(property, pass[passSourceLayer])
      }
    }
    return
  }

  if (keyInit === 'style') {
    if (!valInit) return
    if (noMergeStyle) {
      viewProps.style = valInit
      return
    }
    const layerBeforeStyle = pass[passSourceLayer]
    pass[passSourceLayer] = sourceLayerStyle
    const isArray = Array.isArray(valInit)
    const length = isArray ? valInit.length : 1
    for (let index = 0; index < length; index++) {
      const style = isArray ? valInit[index] : valInit
      if (!style) continue
      if (isStylePiece(style)) {
        if (
          process.env.TAMAGUI_TARGET === 'web' &&
          styleState.flatShouldDoClasses &&
          applyStylePieceClasses(styleState, style, sourceLayerStyle)
        ) {
          continue
        }
        const resolvedPiece = resolveStylePiece(styleState, style)
        const pieceOriginals = shouldTrackStyleTokenProvenance
          ? styleOriginalValues.get(style[stylePieceSymbol].styleObject)
          : undefined
        for (const key in resolvedPiece) {
          if (resolvedPiece[key] == null) continue
          contributeValue(styleState, key, resolvedPiece[key], pieceOriginals?.[key])
        }
        continue
      }
      const styleOriginals = shouldTrackStyleTokenProvenance
        ? styleOriginalValues.get(style)
        : undefined
      for (const key in style) {
        if (style[key] == null) continue
        if (process.env.TAMAGUI_TARGET === 'web') {
          if (key === 'containerName') {
            pass[passContainerName] = style[key]
          } else if (key === 'containerType') {
            pass[passContainerType] = style[key]
          }
        }
        contributeValue(styleState, key, style[key], styleOriginals?.[key])
      }
    }
    pass[passSourceLayer] = layerBeforeStyle
    return
  }

  // when asChild, skip default props - they shouldn't be passed down to children
  if (defaultProps) {
    // check both original key and expanded key (after shorthand expansion)
    const defaultVal = defaultProps[keyOg] ?? defaultProps[keyInit]
    if (defaultVal !== undefined && valInit === defaultVal) {
      return
    }
  }

  const isNativeInputColor =
    process.env.TAMAGUI_TARGET === 'native' &&
    isInput &&
    keyInit in nativeTextInputColorProps

  // keyInit === 'style' is handled in skipProps
  if (
    !isNativeInputColor &&
    keyInit in skipProps &&
    shouldSkipDirectProps &&
    !neverSkipProps?.[keyInit]
  ) {
    if (process.env.TAMAGUI_TARGET === 'web' && keyInit === 'container') {
      pass[passContainerValue] = valInit
    }
    if (keyInit === 'transition' && typeof valInit === 'string') {
      if (process.env.TAMAGUI_TARGET === 'native') return
      // the same grammar the compiler uses, so a value never means one thing
      // here and another there. a transition made only of css timings needs no
      // driver and falls through to the ordinary style path, and a bundle with
      // no driver in it has no resolver because it has no presets to resolve.
      const transitions = getTransitionResolver()
      const resolved = transitions?.resolve(valInit, { animations: driverAnimations })
      if (resolved?.fused) {
        if (driverOutputStyle === 'css' && process.env.IS_STATIC === 'is_static') {
          // css output needs no runtime component: springs lower to a
          // `linear()` easing, so the compiler can keep flattening.
          valInit = transitions!.toCSS(resolved) ?? valInit
        } else {
          // animation drivers consume the authored value directly
          return
        }
      }
    } else {
      return
    }
  }

  let isValidStyleKeyInit = isValidStyleKey(keyInit, validStyles)

  // this is all for partially optimized (not flattened)... maybe worth removing?
  if (process.env.TAMAGUI_TARGET === 'web') {
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
      // map the React Native-shaped public prop surface onto DOM attributes in
      // this pass so prop processing stays single-loop

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
        viewProps['data-testid'] = valInit
        return
      }

      if (keyInit === 'id') {
        viewProps.id = valInit
        return
      }
    }
  }

  if (
    process.env.TAMAGUI_TARGET === 'web' &&
    isValidStyleKeyInit &&
    valInit == null &&
    keyOg in props
  ) {
    clearDirectStyle(styleState, keyInit)
    if (styledContextKeys?.has(keyInit)) {
      ;(styleState.overriddenContextProps ||= {})[keyInit] = valInit
    }
    return
  }

  let isVariant = !isValidStyleKeyInit && variants && keyInit in variants
  const isStyleLikeKey = isValidStyleKeyInit || isVariant
  const isStyleProp = isValidStyleKeyInit || (isVariant && !noExpand)

  if (isStyleProp && asChildExceptStyleLike) {
    return
  }

  const shouldPassProp =
    (!isStyleProp && isHOC) ||
    // is in parent variants
    (hocParentVariants && keyInit in hocParentVariants) ||
    inlineProps?.has(keyInit)

  const parentVariant = parentVariants?.[keyInit]
  const isHOCShouldPassThrough = Boolean(isHOC && (parentVariant || keyInit in skipProps))

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
        parentStaticConfig: pass[15],
      })
    }
  }

  if (shouldPassThrough) {
    // delete first so wrapped components enumerate the replacement at its authored position
    if (keyInit in viewProps) delete viewProps[keyInit]
    viewProps[keyInit] = valInit

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
  if (!isNativeInputColor && shouldCheckSkipProps && !neverSkipProps?.[keyInit]) {
    if (
      keyInit in skipProps &&
      // a plain-css transition is a style, not a driver prop, so it must not be
      // skipped here. same test as above: only a preset or spring needs a driver
      !(
        keyInit === 'transition' &&
        typeof valInit === 'string' &&
        !getTransitionResolver()?.resolve(valInit, { animations: driverAnimations }).fused
      )
    ) {
      if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
        console.groupEnd()
      }
      return
    }
  }

  // we sort of have to update fontFamily all the time: before variants run, after each variant
  if (isTextOrInput) {
    if (
      valInit &&
      (keyInit === 'fontFamily' || keyInit === shorthands['fontFamily']) &&
      valInit in conf.fontsParsed
    ) {
      styleState.fontFamily = valInit
    }
  }

  // ordinary host styles scan and emit directly
  if (
    isValidStyleKeyInit &&
    valInit != null &&
    !(process.env.TAMAGUI_TARGET === 'native' && valInit === 'unset') &&
    !(variants && keyInit in variants) &&
    !(styledContextKeys?.has(keyInit) || (styledContext && keyInit in styledContext))
  ) {
    contributeValue(styleState, keyInit, valInit, originalOg)
    return
  }

  if (variants && keyInit in variants && !noExpand && !disabled) {
    const previousLayer = pass[passSourceLayer]
    pass[passSourceLayer] = previousLayer ? sourceLayerVariant : sourceLayerBase
    pass[passMapSourceKey] = keyInit
    const variantConfig = (styleState as DirectState).flatStyleStaticConfig!
    variantConfig.variantStyleResolver?.(
      styleState,
      variantConfig.variants,
      keyInit,
      valInit,
      keyInit,
      pass[passParentCursor]
    )
    pass[passSourceLayer] = previousLayer
    return
  }

  const isStyledContextProp =
    !isHOC &&
    (styledContextKeys?.has(keyInit) || (styledContext && keyInit in styledContext))
  if (isStyledContextProp) {
    ;(styleState.overriddenContextProps ||= {})[keyInit] = originalOg
    ;(styleState.originalContextPropValues ||= {})[keyInit] = originalOg
  }
  const isHostStyleKey =
    isValidStyleKeyInit ||
    (process.env.TAMAGUI_TARGET === 'native' && isAndroid && keyInit === 'elevation')
  if (isHostStyleKey || isStyledContextProp) {
    if (process.env.TAMAGUI_TARGET === 'native' && valInit === 'unset') {
      const expanded = expandStyle(keyInit, valInit, conf.settings.styleCompat || 'web')
      clearDirectStyle(styleState, keyInit)
      if (expanded) {
        for (let index = 0; index < expanded.length; index++) {
          clearDirectStyle(styleState, expanded[index][0])
        }
      }
    } else {
      contributeValue(styleState, keyInit, valInit, originalOg, !isHostStyleKey)
    }
    return
  }

  const condition = pass[passParentCursor] as Condition | null
  if (condition) {
    if (isHOC) {
      const previous = viewProps[keyInit]
      const transport =
        previous &&
        typeof previous === 'object' &&
        !Array.isArray(previous) &&
        'default' in previous
          ? (previous as Record<string, unknown>)
          : { default: previous }
      transport[condition[conditionKey]] = valInit
      viewProps[keyInit] = transport
    } else if (process.env.NODE_ENV === 'development') {
      console.warn(
        `[tamagui] "${keyInit}" is not a valid style on this component; the conditional variant value is dropped.`
      )
    }
    return
  }

  if (keyInit in stylePropsAll) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `[tamagui] "${keyInit}" is a text style prop and this component is not text — it would render on neither platform. Use a Text-based component, or html.* for raw web elements.`
      )
    }
    return
  }
  viewProps[keyInit] = valInit

  if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
    try {
      log(` ✔️ expand complete`, keyInit)
      log('style', { ...styleState.style })
      log('viewProps', { ...viewProps })
      log('transforms', styleState.transformAccumulator)
    } catch {
      // RN can run into PayloadTooLargeError: request entity too large
    }
    console.groupEnd()
  }
} // end prop contribution

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
  animationDriver,
  styleStaticConfig
) => {
  const conf = getConfig()
  styleStaticConfig ||= getStyleStaticConfig(staticConfig, conf)
  // use passed animationDriver or fall back to context/config
  const driver =
    animationDriver ||
    componentContext?.animationDriver ||
    (conf.animations as AnimationDriverLike)
  const driverAnimations = driver?.animations
  const driverInputStyle = driver?.inputStyle
  const driverOutputStyle = driver?.outputStyle
  const resolvedDriver = driver?.isStub ? null : (driver as AnimationDriver | null)

  if (props.passThrough) {
    return null
  }

  const { shorthands } = conf
  const { isHOC, isText, isInput, inlineProps, parentStaticConfig, acceptsClassName } =
    staticConfig
  const variants = styleStaticConfig.variants

  const viewProps: GetStyleResult['viewProps'] = {}
  const mediaState = styleProps.mediaState || globalMediaState

  let shouldDoClasses =
    !process.env.TAMAGUI_DID_OUTPUT_CSS &&
    acceptsClassName &&
    process.env.TAMAGUI_TARGET === 'web' &&
    !styleProps.noClass

  const rulesToInsert: RulesToInsert =
    process.env.TAMAGUI_TARGET === 'native' ? (undefined as any) : {}
  const classNames: ClassNamesObject = {}

  let hasMedia: boolean | Set<string> = false
  let pseudoGroups: Set<string> | undefined
  let mediaGroups: Set<string> | undefined
  // the frontend normalization partitions unclaimed styled-base
  // classes into passthroughClassName (baseStyle holds styles only). they are
  // the base's raw-interop className at the earliest forward position:
  // prepend them and flip the cascade-preserving switch so every later
  // Tamagui contribution keeps its last-wins position inline, exactly as a
  // className prop does mid-loop
  const staticPassthroughClassName =
    process.env.TAMAGUI_TARGET === 'web'
      ? styleStaticConfig.passthroughClassName || ''
      : ''
  let className = staticPassthroughClassName
  if (staticPassthroughClassName) {
    shouldDoClasses = false
  }
  const validStyles =
    staticConfig.validStyles ||
    (staticConfig.isInput
      ? stylePropsInput
      : staticConfig.isText
        ? stylePropsText
        : validStylesView)

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
    animationDriver: resolvedDriver,
  }
  ;(styleState as DirectState).flatStyleStaticConfig = styleStaticConfig

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
  const { neverSkipProps } = staticConfig
  const {
    noSkip,
    disableExpandShorthands,
    noExpand,
    noClass,
    noMergeStyle,
    noNormalize,
    isAnimated,
    styledContext,
  } = styleProps
  const styledContextKeys = styleStaticConfig.styledContextKeys

  const styleFrontend = staticConfig.styleFrontend
  let frontendGroup: boolean | string | undefined
  let frontendContainer: boolean | string | undefined
  let frontendContainerType: string | undefined
  const processedProps = props
  const parentVariants = parentStaticConfig
    ? getStyleStaticConfig(parentStaticConfig as StaticConfig, conf).variants
    : undefined
  const defaultProps = asChild ? styleStaticConfig.defaultProps : undefined
  const asChildExceptStyleLike =
    asChild === 'except-style' || asChild === 'except-style-web'
  let containerValue: boolean | string | undefined
  let containerName: string | undefined
  let containerType: string | undefined
  if (process.env.TAMAGUI_TARGET === 'web') {
    containerName = processedProps.containerName
    containerType = processedProps.containerType
  }

  const stylePassFlags =
    (noSkip ? passNoSkipFlag : 0) |
    (disableExpandShorthands ? passDisableShorthandsFlag : 0) |
    (noExpand ? passNoExpandFlag : 0) |
    (noMergeStyle ? passNoMergeFlag : 0) |
    (isHOC ? passHocFlag : 0) |
    (isText ? passTextFlag : 0) |
    (isInput ? passInputFlag : 0) |
    (asChildExceptStyleLike ? passAsChildStyleFlag : 0)

  const pass: StylePass = [
    styleState,
    conf,
    props,
    viewProps,
    staticConfig,
    validStyles,
    neverSkipProps,
    variants,
    inlineProps,
    parentVariants,
    styleFrontend,
    styledContext,
    styledContextKeys,
    stylePassFlags,
    debug,
    parentStaticConfig,
    defaultProps,
    driverAnimations,
    driverOutputStyle,
    elementType,
    className,
    shouldDoClasses,
    containerValue,
    containerName,
    containerType,
    frontendGroup,
    frontendContainer,
    frontendContainerType,
  ]
  ;(styleState as DirectState).flatPass = pass

  let conditionalStates: Set<string> | null = null
  let usesSafeArea = false
  // base styles precede call-site props so the last authored contribution wins
  const baseStyle = styleStaticConfig.baseStyle
  const baseVariantProps = styleStaticConfig.baseVariantProps
  const appliesBaseStyle = baseStyle && !processedProps.asChild
  pass[passSourceLayer] = sourceLayerBase
  let appliedBaseStylePieces: Set<StylePiece> | undefined
  if (appliesBaseStyle && baseVariantProps) {
    // a defaulted variant the caller replaced keeps the default's authored
    // position (so a later styled override of its outputs still wins), but the
    // caller's value becomes authoritative for that variant key: any DEFAULT
    // variant's nested re-assignment of it is suppressed in emitVariantStyle
    let callerKeys: Set<string> | undefined
    for (const key in baseVariantProps) {
      if (
        Object.hasOwn(processedProps, key) &&
        processedProps[key] !== baseVariantProps[key]
      ) {
        ;(callerKeys ||= new Set()).add(key)
      }
    }
    ;(styleState as DirectState).flatCallerVariantKeys = callerKeys
  }
  if (appliesBaseStyle) {
    for (const key in baseStyle) {
      const baseValue =
        baseVariantProps &&
        Object.hasOwn(baseVariantProps, key) &&
        Object.hasOwn(processedProps, key)
          ? processedProps[key]
          : baseStyle[key]
      const expandedKey = shorthands[key] || key
      // Precompiled base pieces bypass contributeProp, but font-aware dynamics
      // and resolvers still need the same active-family state that the ordinary
      // base walk establishes before they execute.
      if (
        (isText || isInput) &&
        baseValue &&
        expandedKey === 'fontFamily' &&
        baseValue in conf.fontsParsed
      ) {
        styleState.fontFamily = baseValue
      }
      const piece = styleStaticConfig.baseStylePieces?.[key]
      if (
        piece &&
        process.env.TAMAGUI_TARGET === 'web' &&
        styleState.flatShouldDoClasses
      ) {
        if (!appliedBaseStylePieces?.has(piece)) {
          if (applyStylePieceClasses(styleState, piece, sourceLayerBase)) {
            ;(appliedBaseStylePieces ||= new Set()).add(piece)
          }
        }
        if (appliedBaseStylePieces?.has(piece)) continue
      }
      contributeProp(pass, key, baseValue)
    }
  }
  pass[passSourceLayer] = sourceLayerProps
  for (const key in processedProps) {
    if (appliesBaseStyle && baseVariantProps && Object.hasOwn(baseVariantProps, key)) {
      continue
    }
    contributeProp(pass, key, processedProps[key])
  }

  // component resolvers (`.resolve`): parent-first, full merged props, style
  // fragment output. contributed above variants, below call-site props, so a
  // later resolver in the chain wins within the tier
  const resolvers = staticConfig.resolvers
  if (resolvers && !noExpand) {
    const prevSourceLayer = pass[passSourceLayer]
    pass[passSourceLayer] = sourceLayerResolver
    const flagsBefore = pass[passFlags]
    // resolver output is styles only: never re-enter variant dispatch
    pass[passFlags] = flagsBefore | passNoExpandFlag
    const env = getDynamicEnv(styleState)
    for (let index = 0; index < resolvers.length; index++) {
      const resolved = resolvers[index](processedProps, env)
      if (resolved) {
        for (const key in resolved) {
          if (resolved[key] == null) continue
          contributeProp(pass, key, resolved[key])
        }
      }
    }
    pass[passFlags] = flagsBefore
    pass[passSourceLayer] = prevSourceLayer
  }

  className = pass[passClassName]
  shouldDoClasses = pass[passShouldDoClasses]
  containerValue = pass[passContainerValue]
  containerName = pass[passContainerName]
  containerType = pass[passContainerType]
  frontendGroup = pass[passFrontendGroup]
  frontendContainer = pass[passFrontendContainer]
  frontendContainerType = pass[passFrontendContainerType]

  if (process.env.TAMAGUI_TARGET === 'web' && containerValue) {
    containerName ??= typeof containerValue === 'string' ? containerValue : undefined
    containerType ??= 'inline-size'
    contributeValue(
      styleState,
      containerName ? 'container' : 'containerType',
      containerName ? `${containerName} / ${containerType}` : containerType
    )
  }

  if (
    process.env.NODE_ENV === 'development' &&
    (debug === 'profile' || (globalThis as any).time)
  ) {
    // @ts-expect-error
    time`split-styles-propsend`
  }

  conditionalStates = styleState.flatStateKeys || null
  usesSafeArea = !!styleState.flatUsesSafeArea
  hasMedia = styleState.flatMediaKeys?.size ? styleState.flatMediaKeys : false
  pseudoGroups = styleState.flatGroupKeys?.size ? styleState.flatGroupKeys : undefined
  mediaGroups = styleState.flatGroupMedia?.size ? styleState.flatGroupMedia : undefined

  // a platform driver with native pseudo states rides the emitter path: the
  // whole frame completes inline instead of as classes. The frame is neutral,
  // so choosing the policy after the pass costs nothing to undo.
  if (styleProps.canPlatformPseudo && styleState.flatHasPlatformPseudo) {
    shouldDoClasses = false
    styleState.flatShouldDoClasses = false
    if (styleState.transformAccumulator) {
      mergeStyle(
        styleState,
        'transform',
        finalizeTransformAccumulator(styleState.transformAccumulator),
        true
      )
      styleState.transformAccumulator = undefined
    }
  }

  if (styleProps.stylePieceEntries) {
    const slots = (styleState as DirectState).flatSlots
    if (slots) {
      for (const [slot, entries] of slots) styleProps.stylePieceEntries[slot] = entries
    }
  }
  completeResolvedStyles(styleState)
  if (styleState.flatGroupKeys?.size) pseudoGroups = styleState.flatGroupKeys
  if (styleState.flatGroupMedia?.size) mediaGroups = styleState.flatGroupMedia
  if (styleProps.isStatic) {
    for (const property in classNames) {
      const identifier = classNames[property]
      if (rulesToInsert[identifier]) continue
      const rules = getRulesForIdentifier(identifier)
      if (rules) {
        rulesToInsert[identifier] = [
          property,
          '',
          identifier,
          undefined,
          rules,
        ] as StyleObject
      }
    }
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
    (process.env.TAMAGUI_TARGET === 'native' || driverOutputStyle !== 'css')
  ) {
    delete styleState.style.transition
  }

  // on native, container config is context + layout measurement, never a
  // react-native style key
  if (process.env.TAMAGUI_TARGET === 'native' && styleState.style) {
    if ('containerType' in styleState.style) delete styleState.style.containerType
    if ('containerName' in styleState.style) delete styleState.style.containerName
  }

  // style prop after:

  const avoidNormalize = noNormalize === false

  if (!avoidNormalize) {
    if (process.env.TAMAGUI_TARGET === 'native' && styleState.style) {
      fixStyles(styleState.style)
    }

    if (styleState.transformAccumulator && !styleState.flatShouldDoClasses) {
      styleState.style ||= {}
      styleState.style.transform = finalizeTransformAccumulator(
        styleState.transformAccumulator
      )
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
      !noNormalize && !isHOC && (!isAnimated || driverInputStyle === 'css')

    if (shouldStringifyTransforms && Array.isArray(styleState.style?.transform)) {
      styleState.style.transform = transformsToString(styleState.style!.transform) as any
    }
  }

  if (process.env.TAMAGUI_TARGET === 'web') {
    flushDirectStyles(styleState)
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
    if (styleState.style) {
      styleState.style = normalizeNativeStyle(styleState.style)
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
  if ((styleState as DirectState).flatDynamicThemeAccess) result.dynamicThemeAccess = true

  if (styleState.flatEnterKeys || styleState.flatExitKeys) {
    result.programLifecycleStyleKeys = {
      enter: effectiveLifecycleKeys(styleState.flatEnterKeys),
      exit: effectiveLifecycleKeys(styleState.flatExitKeys),
    }
  }
  if (styleState.flatHasEnterStyle) result.hasEnterStyle = true
  if (styleState.flatHasPlatformPseudo) result.platformPseudo = true
  if (frontendGroup !== undefined) result.frontendGroup = frontendGroup
  if (frontendContainer !== undefined) result.frontendContainer = frontendContainer
  if (frontendContainerType !== undefined) {
    result.frontendContainerType = frontendContainerType
  }

  if (!noMergeStyle) {
    if (!asChildExceptStyleLike) {
      const style = styleState.style

      if (process.env.TAMAGUI_TARGET === 'web') {
        // merge className and style back into viewProps:
        // only emit font class if fontFamily was explicitly in props (not from defaults)
        const fontFamily = isText || isInput ? styleState.fontFamily : null
        const fontFamilyClassName = fontFamily ? `font_${fontFamily}` : ''
        const group = props.group ?? frontendGroup
        const groupClassName = group ? `t_group_${group}` : ''
        // core host classes carry the base web reset. component hooks are
        // ordinary authored className defaults and do not derive from React identity.
        let finalClassName = isText ? 'is_Text' : 'is_View'
        if (fontFamilyClassName) finalClassName += ` ${fontFamilyClassName}`
        let hasPropertyClassNames = false
        if (classNames) {
          for (const key in classNames) {
            hasPropertyClassNames = true
            if (!isHOC) finalClassName += ` ${classNames[key]}`
          }
        }
        if (groupClassName) finalClassName += ` ${groupClassName}`
        if (className) finalClassName += ` ${className}`
        if (isHOC && hasPropertyClassNames) {
          viewProps[HOC_CLASSNAME_MARKER] = classNames
        }
        if (finalClassName) {
          viewProps.className = finalClassName
        }
        if (style) {
          viewProps.style = style as any
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
          ...((props as any).__tamaguiStyleDebugReceipt && {
            receipt: (props as any).__tamaguiStyleDebugReceipt as StyleDebugReceipt,
          }),
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

const stylePieceStaticConfig = {
  acceptsClassName: true,
  isText: true,
  validStyles: stylePropsAll,
} as StaticConfig

type CompiledStylePiece = {
  slots: Record<string, AtomicSlotEntry[]>
  directClassNames: ClassNamesObject
  programStates?: Set<string>
  mediaKeys?: Set<string>
  pseudoGroups?: Set<string>
  mediaGroups?: Set<string>
  dynamicThemeAccess?: boolean
}

const compiledStylePieces = new WeakMap<StylePiece, CompiledStylePiece>()

const compileStylePieceRuntime = (piece: StylePiece, layer: 'base' | 'style') => {
  if (process.env.TAMAGUI_TARGET !== 'web') return
  const conf = getConfigMaybe()
  if (!conf) return
  const themeName = Object.keys(conf.themes)[0] || ''
  const theme = conf.themes[themeName] || {}
  const definition = piece[stylePieceSymbol].styleObject
  const isBase = layer === 'base'
  const slots: Record<string, AtomicSlotEntry[]> = {}
  const split = getSplitStyles(
    isBase ? {} : { style: definition },
    isBase
      ? ({
          ...stylePieceStaticConfig,
          baseStyle: definition,
          disableBaseStylePiece: true,
        } as StaticConfig)
      : stylePieceStaticConfig,
    theme,
    themeName,
    defaultComponentStateMounted,
    {
      isAnimated: false,
      resolveValues: 'variable',
      stylePieceEntries: slots,
    }
  )
  if (!split) return
  const directClassNames: ClassNamesObject = {}
  for (const key in split.classNames) {
    if (!(key in slots)) directClassNames[key] = split.classNames[key]
  }
  compiledStylePieces.set(piece, {
    slots,
    directClassNames,
    programStates: split.programStates,
    mediaKeys: split.hasMedia instanceof Set ? split.hasMedia : undefined,
    pseudoGroups: split.pseudoGroups,
    mediaGroups: split.mediaGroups,
    dynamicThemeAccess: split.dynamicThemeAccess,
  })
  const byKey = piece[stylePieceSymbol].byKey
  let className = ''
  for (const key in split.classNames) {
    const identifier = split.classNames[key]
    byKey[key] = identifier
    className = className ? `${className} ${identifier}` : identifier
  }
  piece.className = className
  if (isClient) insertStyleRules(split.rulesToInsert)
}

setStylePieceCompiler(compileStylePieceRuntime)

setStylePieceResolver((piece, theme, themeName) => {
  const split = getSplitStyles(
    { style: piece },
    stylePieceStaticConfig,
    theme,
    themeName,
    defaultComponentStateMounted,
    {
      isAnimated: false,
      resolveValues: 'value',
    }
  )
  return (split?.style || {}) as TextStyle
})

const resolvedStylePieceCache = new WeakMap<StylePiece, WeakMap<object, TextStyle>>()

function resolveStylePiece(styleState: GetStyleState, piece: StylePiece): TextStyle {
  const definition = piece[stylePieceSymbol].styleObject
  if (!isStylePieceCacheable(piece)) {
    return resolveStyleObject(styleState, definition)
  }
  let themeCache = resolvedStylePieceCache.get(piece)
  if (!themeCache) {
    themeCache = new WeakMap()
    resolvedStylePieceCache.set(piece, themeCache)
  }
  const theme = styleState.theme as object
  const cached = themeCache.get(theme)
  if (cached) return cached
  const resolved = resolveStyleObject(styleState, definition)
  themeCache.set(theme, resolved)
  return resolved
}

function applyStylePieceClasses(
  styleState: GetStyleState,
  piece: StylePiece,
  sourceLayer: number
) {
  let compiled = compiledStylePieces.get(piece)
  if (!compiled && process.env.TAMAGUI_TARGET === 'web' && getConfigMaybe()) {
    compileStylePieceRuntime(piece, 'style')
    compiled = compiledStylePieces.get(piece)
  }
  if (compiled) {
    const direct = styleState as DirectState
    const slots = (direct.flatSlots ||= new Map())
    for (const slot in compiled.slots) {
      for (const entry of compiled.slots[slot]) {
        const property = entry[0]
        const conditional = !!entry[2]
        if (!ownsSourceLayer(styleState, property, conditional)) continue
        writeCapturedStyleRecord(slots, slot, entry, sourceLayer)
      }
    }
    if (compiled.programStates) {
      const target = (styleState.flatStateKeys ||= new Set())
      for (const key of compiled.programStates) target.add(key)
    }
    if (compiled.mediaKeys) {
      const target = (styleState.flatMediaKeys ||= new Set())
      for (const key of compiled.mediaKeys) target.add(key)
    }
    if (compiled.pseudoGroups) {
      const target = (styleState.flatGroupKeys ||= new Set())
      for (const key of compiled.pseudoGroups) target.add(key)
    }
    if (compiled.mediaGroups) {
      const target = (styleState.flatGroupMedia ||= new Set())
      for (const key of compiled.mediaGroups) target.add(key)
    }
    if (compiled.dynamicThemeAccess) direct.flatDynamicThemeAccess = true
    for (const property in compiled.directClassNames) {
      styleState.classNames[property] = compiled.directClassNames[property]
    }
    return true
  }

  const byKey = piece[stylePieceSymbol].byKey
  const direct = styleState as DirectState
  const layers = (direct.flatPropertyLayers ||= new Map())
  let applied = false
  for (const property in byKey) {
    const previousLayer = layers.get(property)
    if (previousLayer !== undefined && previousLayer > sourceLayer) continue
    clearDirectStyle(styleState, property)
    styleState.classNames[property] = byKey[property]
    layers.set(property, sourceLayer)
    const identifier = byKey[property]
    const fallbackRules = getRulesForIdentifier(identifier)
    const shouldInsert =
      styleState.styleProps.isStatic || shouldInsertStyleRules(identifier)
    if (fallbackRules && shouldInsert) {
      styleState.flatRulesToInsert![identifier] = [
        property,
        '',
        identifier,
        undefined,
        fallbackRules,
      ] as StyleObject
    }
    applied = true
  }
  return applied
}

function writeCapturedStyleRecord(
  slots: Map<string, AtomicSlotEntry[]>,
  slot: string,
  source: AtomicSlotEntry,
  sourceLayer: number
) {
  let list = slots.get(slot)
  if (!list) slots.set(slot, (list = []))
  const flags = source[7]! & 31
  const identity = source[3]
  const condition = source[2]
  for (let index = 0; index < list.length; index++) {
    const entry = list[index]
    const entryFlags = entry[7]! & 31
    if (
      (entryFlags & (recordInline | recordCSS)) !==
      (flags & (recordInline | recordCSS))
    ) {
      continue
    }
    if (entry[0] !== source[0]) continue
    if (flags & recordDefault) {
      if (!(entryFlags & recordDefault) && (!entry[2] || entry[3] === identity)) return
    } else if (entryFlags & recordDefault && (!condition || entry[3] === identity)) {
      list.splice(index--, 1)
      continue
    }
    if (entry[3] === identity) {
      list.splice(index, 1)
      break
    }
  }
  const next = [...source] as AtomicSlotEntry
  next[7] = flags | (sourceLayer << 5)
  list.push(next)
}

function mergeStyle(
  styleState: GetStyleState,
  key: string,
  val: any,
  disableNormalize = false,
  originalVal?: any
) {
  const { viewProps, styleProps, staticConfig } = styleState

  // track context overrides for pseudo/media styles (issues #3670, #3676):
  // when a style sets a key the styled context declares, propagate it via
  // overriddenContextProps using the original token value (like '8') rather
  // than the resolved CSS variable, so children's functional variants can look
  // up token values. membership is a per-staticConfig cached Set.
  const contextPropSet = (styleState as DirectState).flatStyleStaticConfig!
    .styledContextKeys
  if (contextPropSet?.has(key)) {
    styleState.overriddenContextProps ||= {}
    // priority: originalVal from propMapper, tracked original from variant
    // resolution, then the value itself
    const originalFromState = styleState.originalContextPropValues?.[key]
    styleState.overriddenContextProps[key] = originalVal ?? originalFromState ?? val
  }

  if (key === 'transform' || key in stylePropsTransform) {
    styleState.transformAccumulator ||= createTransformAccumulator()
    addTransformValue(styleState.transformAccumulator, key, val)
  } else {
    const shouldNormalize =
      process.env.TAMAGUI_TARGET === 'web' && !disableNormalize && !styleProps.noNormalize
    let out = shouldNormalize ? normalizeValueWithProperty(val, key) : val
    if (process.env.TAMAGUI_TARGET === 'native' && typeof out === 'string') {
      if (out.includes('cqi') || out.includes('cqw')) {
        ;(styleState.flatGroupKeys ||= new Set()).add('@')
        ;(styleState.flatGroupMedia ||= new Set()).add('@')
      }
      out = resolveNativeUnits(key, out, styleState)
    }
    if (
      process.env.TAMAGUI_TARGET === 'native' &&
      staticConfig.isInput &&
      key in nativeTextInputColorProps
    ) {
      viewProps[nativeTextInputColorProps[key]] = out
    } else {
      styleState.style ||= {}
      styleState.style[key] = out
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
    (tokenName in styleState.theme ||
      tokenName in (styleState.conf.themes?.[styleState.flatThemeName || ''] || {}) ||
      Object.values(styleState.conf.tokensParsed).some(
        (category) => tokenName in category
      ))
  if (isConfiguredToken) {
    ;(styleState.tokenProvenance ||= {})[key] = originalVal
  } else if (styleState.tokenProvenance && key in styleState.tokenProvenance) {
    delete styleState.tokenProvenance[key]
  }
}

const resolveStyleObject = (
  styleState: GetStyleState,
  styleIn: Record<string, any>
): TextStyle => {
  const { conf, styleProps } = styleState
  const styleOut: TextStyle = {}
  let originalValues: Record<string, any> | undefined
  const styleInOriginalValues = styleOriginalValues.get(styleIn)
  const childState: GetStyleState = {
    ...styleState,
    classNames: {},
    flatShouldDoClasses: false,
    props: styleIn,
    style: styleOut,
    transformAccumulator: undefined,
  }
  ;(childState as DirectState).flatAtomics = undefined
  ;(childState as DirectState).flatSlots = undefined
  ;(childState as DirectState).flatPropertyLayers = undefined
  const mergeAccepted: MergeStyle = (
    _state,
    key,
    value,
    disableNormalize,
    originalValue
  ) => {
    styleOut[key] =
      disableNormalize || styleProps.noNormalize
        ? value
        : normalizeValueWithProperty(value, key)
    const trackedOriginal = styleInOriginalValues?.[key] ?? originalValue
    if (trackedOriginal !== undefined) {
      ;(originalValues ||= {})[key] = trackedOriginal
    }
  }
  for (let key in styleIn) {
    const value = styleIn[key]
    key = conf.shorthands[key] || key
    if (key in skipProps || value == null) continue
    contributeValue(childState, key, value)
  }
  completeResolvedStyles(childState, mergeAccepted)
  if (childState.transformAccumulator) {
    styleOut.transform = finalizeTransformAccumulator(childState.transformAccumulator)
  }
  if (process.env.TAMAGUI_TARGET === 'native' && !styleProps.noNormalize) {
    fixStyles(styleOut)
  }
  if (originalValues) {
    styleOriginalValues.set(styleOut, originalValues)
  }
  return styleOut
}

export type MergeStyle = (
  state: GetStyleState,
  key: string,
  value: any,
  disableNormalize?: boolean,
  originalValue?: any
) => void

type DirectState = GetStyleState & {
  flatValueScope?: ValueScopeCache
  flatValueScopeKind?: any
  flatConditions?: Map<string, Condition>
  flatConditionsClassed?: boolean
  flatPass?: StylePass
  flatStyleStaticConfig?: StyleStaticConfig
  flatSlots?: Map<string, AtomicSlotEntry[]>
  flatPropertyLayers?: Map<string, number>
  flatCallerVariantKeys?: Set<string>
  flatAtomics?: Map<string, any>
  flatBoxShadow?: any
  flatBoxShadowSequence?: number
  flatDynamicColors?: Record<string, Record<string, any>>
  flatDynamicThemeAccess?: boolean
  flatTextShadow?: Record<string, any>
  flatWebShadow?: any[]
}

// orders the authored boxShadow value against the shadow-part record so the
// later contribution wins; also feeds the transition dedupe
let frameSequence = 0

const recordInline = 1
const recordNormalize = 2
const recordRetract = 4
const recordDefault = 8
const recordCSS = 16

// react-native spells its RTL-aware props the way a dropped CSS draft did
// (padding-start, border-end-color, border-top-start-radius, start/end). No
// browser implements those, so the rules generated for them were inert and the
// props did nothing on web. rename them onto the CSS logical properties that
// are RTL-aware in exactly the same way (#3099)
const webRTLRenames: Record<string, string> = {
  paddingStart: 'paddingInlineStart',
  paddingEnd: 'paddingInlineEnd',
  marginStart: 'marginInlineStart',
  marginEnd: 'marginInlineEnd',
  borderStartWidth: 'borderInlineStartWidth',
  borderEndWidth: 'borderInlineEndWidth',
  borderStartColor: 'borderInlineStartColor',
  borderEndColor: 'borderInlineEndColor',
  borderStartStyle: 'borderInlineStartStyle',
  borderEndStyle: 'borderInlineEndStyle',
  // css orders these block-then-inline, so top-start is start-start
  borderTopStartRadius: 'borderStartStartRadius',
  borderTopEndRadius: 'borderStartEndRadius',
  borderBottomStartRadius: 'borderEndStartRadius',
  borderBottomEndRadius: 'borderEndEndRadius',
  start: 'insetInlineStart',
  end: 'insetInlineEnd',
}

// the property vocabulary is small and its strings are interned, so these
// per-property classifications resolve once per process instead of running
// their string tests on every value of every pass
const webStyleProperties = new Map<string, string>()
function webStyleProperty(property: string) {
  let web = webStyleProperties.get(property)
  if (web === undefined) {
    web =
      webRTLRenames[property] ||
      (property === 'writingDirection'
        ? 'direction'
        : property.endsWith('Horizontal')
          ? `${property.slice(0, -10)}Inline`
          : property.endsWith('Vertical')
            ? `${property.slice(0, -8)}Block`
            : property)
    webStyleProperties.set(property, web)
  }
  return web
}

const styleSlots = new Map<string, string>()
function styleSlot(property: string) {
  let slot = styleSlots.get(property)
  if (slot === undefined) styleSlots.set(property, (slot = classifyStyleSlot(property)))
  return slot
}

function classifyStyleSlot(property: string) {
  return property.startsWith('border')
    ? property.includes('Radius')
      ? 'borderRadius'
      : 'border'
    : property.startsWith('margin')
      ? 'margin'
      : property.startsWith('padding')
        ? 'padding'
        : property.startsWith('background')
          ? 'background'
          : property.startsWith('textDecoration')
            ? 'textDecoration'
            : property.includes('flex')
              ? 'flex'
              : property.startsWith('transition')
                ? 'transition'
                : property.startsWith('overflow')
                  ? 'overflow'
                  : property === 'top' ||
                      property === 'right' ||
                      property === 'bottom' ||
                      property === 'left' ||
                      property.startsWith('inset')
                    ? 'inset'
                    : property
}

function writeStyleRecord(
  state: GetStyleState,
  property: string,
  value: any,
  cursor: Condition | null,
  original: any,
  flags: number,
  conditionOverride = -1
) {
  const condition =
    conditionOverride !== -1 ? conditionOverride : cursor ? cursor[conditionValue] : 0
  const identity = cursor ? cursor[conditionKey] : ''
  const direct = state as DirectState
  const slots = (direct.flatSlots ||= new Map())
  const slot =
    process.env.TAMAGUI_TARGET === 'web' &&
    canGenerateCSS &&
    (state.flatShouldDoClasses || flags & recordCSS)
      ? styleSlot(property)
      : property.startsWith('transition')
        ? 'transition'
        : property
  let list = slots.get(slot)
  if (!list) slots.set(slot, (list = []))
  for (let index = 0; index < list.length; index++) {
    const entry = list[index]
    const entryFlags = entry[7]!
    if (
      (entryFlags & (recordInline | recordCSS)) !==
      (flags & (recordInline | recordCSS))
    ) {
      continue
    }
    if (entry[0] !== property) continue
    if (flags & recordDefault) {
      if (!(entryFlags & recordDefault) && (!entry[2] || entry[3] === identity)) return
    } else if (entryFlags & recordDefault && (!condition || entry[3] === identity)) {
      list.splice(index--, 1)
      continue
    }
    if (entry[3] === identity) {
      list.splice(index, 1)
      break
    }
  }
  list.push([
    property,
    value,
    condition,
    identity,
    cursor ? cursor[conditionSelector] : '',
    cursor ? cursor[conditionWrappers] : undefined,
    original,
    flags | (((state as DirectState).flatPass?.[passSourceLayer] || 0) << 5),
  ])
}

function streamWriteInline(
  state: GetStyleState,
  property: string,
  value: any,
  cursor: Condition | null,
  original: any,
  normalize = property === 'lineHeight',
  conditionOverride = -1,
  force = false
) {
  writeStyleRecord(
    state,
    property,
    value,
    cursor,
    original,
    (normalize ? recordNormalize : 0) | (force ? recordInline : 0),
    conditionOverride
  )
}

function completeResolvedStyles(state: GetStyleState, merge: MergeStyle = mergeStyle) {
  const direct = state as DirectState
  const shadow = direct.flatWebShadow
  if (shadow && (direct.flatBoxShadowSequence || 0) <= shadow[4]) {
    const offset = shadow[1] || { width: 0, height: 0 }
    const color = normalizeColor(shadow[0], shadow[2] ?? 1)
    if (color) {
      const next = `${shadowUnit(offset.width)} ${shadowUnit(offset.height)} ${shadowUnit(shadow[3])} ${color}`
      emitProperty(
        state,
        'boxShadow',
        direct.flatBoxShadow ? `${direct.flatBoxShadow}, ${next}` : next,
        null,
        shadow[5],
        shadow[6]
      )
    }
    direct.flatWebShadow = undefined
  }

  if (state.flatShouldDoClasses && state.transformAccumulator) {
    const transform = finalizeTransformAccumulator(state.transformAccumulator)
    state.transformAccumulator = undefined
    writeStyleRecord(
      state,
      'transform',
      Array.isArray(transform) ? transformsToString(transform) : transform,
      null,
      transform,
      0
    )
  }

  const slots = direct.flatSlots
  if (!slots) return

  for (const [property, entries] of slots) {
    let cssEntries: AtomicSlotEntry[] | undefined
    let inlineWinner: AtomicSlotEntry | undefined
    let importance = -1
    for (let index = 0; index < entries.length; index++) {
      const entry = entries[index]
      const flags = entry[7]!
      if (flags & recordCSS || (state.flatShouldDoClasses && !(flags & recordInline))) {
        cssEntries ||= []
        const precedence = entry[2] ? Math.floor(entry[2] / 256) : -1
        const layer = flags >> 5
        let index = cssEntries.length
        while (index > 0) {
          const before = cssEntries[index - 1]
          const beforeLayer = before[7]! >> 5
          if (
            beforeLayer < layer ||
            (beforeLayer === layer &&
              (before[2] ? Math.floor(before[2] / 256) : -1) <= precedence)
          ) {
            break
          }
          index--
        }
        if (index === cssEntries.length) cssEntries.push(entry)
        else cssEntries.splice(index, 0, entry)
      } else if (!entry[2] || entry[2] & 1) {
        const next = entry[2] ? Math.floor(entry[2] / 256) : 0
        if (next >= importance) {
          importance = next
          inlineWinner = entry
        }
      }
    }
    if (cssEntries) registerAtomicSlot(direct, property, cssEntries)
    if (inlineWinner) {
      if (inlineWinner[7]! & recordRetract) {
        if (state.style) delete state.style[inlineWinner[0]]
      } else {
        merge(
          state,
          inlineWinner[0],
          inlineWinner[1],
          !(inlineWinner[7]! & recordNormalize),
          inlineWinner[6] !== undefined ? inlineWinner[6] : inlineWinner[1]
        )
      }
    }
  }
  direct.flatSlots = undefined
}

function emitAtParentCondition(
  state: GetStyleState,
  property: string,
  value: any,
  originalValue: any,
  contextOnly: boolean
) {
  const cursor = (state as DirectState).flatPass?.[passParentCursor] as Condition
  if (cursor) {
    emitUnderCondition(
      state,
      property,
      value,
      cursor,
      originalValue,
      contextOnly,
      0,
      value
    )
  } else {
    emitValue(state, property, value, null, originalValue, contextOnly)
  }
}

/**
 * The one place a resolved clause decides whether its payload emits: active
 * conditions always, any resolvable condition while the pass can emit CSS
 * classes, and the iOS dynamic-color theme case on the direct style path.
 * warnMode: 0 silent probe, 1 style path (warn with the authored source),
 * 2 variant clause (warn with the raw payload).
 */
function emitUnderCondition(
  state: GetStyleState,
  property: string,
  value: any,
  cursor: Condition,
  originalValue: any,
  contextOnly: boolean,
  warnMode: number,
  warnSource: any
): number {
  const condition = cursor[conditionValue]
  if (!(condition & conditionResolvedFlag)) {
    if (warnMode && process.env.NODE_ENV !== 'production') {
      warnRefusedValue(property!, warnSource, `unknown modifier "${cursor.problem}"`)
    }
    return 0
  }
  emitValue(
    state,
    property,
    value,
    cursor,
    // the variant path (warnMode 2) forwards its tracked original verbatim;
    // the direct paths fall back to the payload itself so consumers like the
    // iOS dynamic-color scheme keep the authored spelling
    warnMode === 2 ? originalValue : (originalValue ?? value),
    contextOnly
  )
  if (condition & 2) {
    if (condition & 4) state.flatHasEnterStyle = true
    if (condition & conditionPlatformPseudoFlag) state.flatHasPlatformPseudo = true
  }
  return condition
}

const formatScanFailure = (
  failure: string | undefined | null,
  source: string,
  failureIndex: number
) =>
  failure === 'invalid-character'
    ? `"${source[failureIndex]}" would end the declaration or rule`
    : failure === 'unterminated-string'
      ? 'an unterminated string'
      : failure === 'unterminated-comment'
        ? 'an unterminated "/*" comment'
        : failure === 'stray-comment-close'
          ? 'a stray "*/"'
          : 'an unterminated "("'

const warnScanFailure = (
  property: string,
  source: string,
  failure: string | undefined | null,
  failureIndex: number
) => {
  if (process.env.NODE_ENV === 'development') {
    warnRefusedValue(property, source, formatScanFailure(failure, source, failureIndex))
  }
}

const borderTargets: Record<string, string[]> = {
  border: ['Top', 'Right', 'Bottom', 'Left'],
  borderTop: ['Top'],
  borderRight: ['Right'],
  borderBottom: ['Bottom'],
  borderLeft: ['Left'],
  outline: [''],
  borderBlock: ['BlockStart', 'BlockEnd'],
  borderInline: ['InlineStart', 'InlineEnd'],
}

let valueCacheConf: unknown
let valueCacheRevision = -1
// themeObject -> `${themeName}\u001f${resolveValues}` -> property -> raw -> resolved
type ValueMaps = { direct: Map<string, any>; embedded?: Map<string, any> }
type ValueScopeCache = Map<string, ValueMaps>
let valueCaches = new WeakMap<object, Map<string, ValueScopeCache>>()
let valueCacheEntries = 0
const valueCacheRoot = {}
const parsedSlices = new WeakMap<object, (string | undefined)[]>()

// `embedded` also runs the embedded-token pass when the direct lookup leaves the
// value alone, and memoizes that result. it is a regex replace over most string
// values, so repeating it every render of every element is the single largest
// cost on this path.
const fontProperties = new Map<string, boolean>()

function configuredValue(
  state: GetStyleState,
  property: string,
  raw: string,
  embedded = false
): any {
  const grammar = getConfigRevisionState(state.conf)
  let name = raw
  let opacity: number | undefined
  const slash = raw.lastIndexOf('/')
  if (slash > 0) {
    const amount = Number(raw.slice(slash + 1))
    if (Number.isInteger(amount) && amount >= 0 && amount <= 100) {
      name = raw.slice(0, slash)
      opacity = amount
    }
  }

  const safeArea = grammar.safeAreaVariable(name)
  if (safeArea !== undefined) {
    state.flatUsesSafeArea = true
    return safeArea
  }

  let fontProperty = fontProperties.get(property)
  if (fontProperty === undefined) {
    fontProperty =
      property.startsWith('font') ||
      property === 'lineHeight' ||
      property === 'letterSpacing'
    fontProperties.set(property, fontProperty)
  }
  const revision = grammar.revision
  if (state.conf !== valueCacheConf || revision !== valueCacheRevision) {
    valueCacheConf = state.conf
    valueCacheRevision = revision
    valueCaches = new WeakMap()
    valueCacheEntries = 0
    ;(state as DirectState).flatValueScope = undefined
  }
  const resolveValues =
    process.env.TAMAGUI_TARGET === 'web' &&
    !state.flatShouldDoClasses &&
    state.styleProps.resolveValues === 'auto'
      ? 'value'
      : state.styleProps.resolveValues
  // the scope (theme identity, name, resolveValues) is fixed for a pass apart
  // from the class/inline flip, so resolve it once and key the per-value lookups
  // off interned property and raw strings instead of joining them into a key
  const direct = state as DirectState
  let scope = direct.flatValueScope
  if (scope === undefined || direct.flatValueScopeKind !== resolveValues) {
    const themeObject =
      state.theme && typeof state.theme === 'object' ? state.theme : valueCacheRoot
    let byScope = valueCaches.get(themeObject)
    if (!byScope) valueCaches.set(themeObject, (byScope = new Map()))
    const scopeKey = `${state.flatThemeName || ''}\u001f${resolveValues}`
    scope = byScope.get(scopeKey)
    if (!scope) byScope.set(scopeKey, (scope = new Map()))
    direct.flatValueScope = scope
    direct.flatValueScopeKind = resolveValues
  }
  let maps = scope.get(property)
  if (maps === undefined) scope.set(property, (maps = { direct: new Map() }))
  const byRaw = embedded ? (maps.embedded ||= new Map()) : maps.direct
  if (!fontProperty) {
    const known = byRaw.get(raw)
    if (known !== undefined || byRaw.has(raw)) return known
  }

  let lookupName = name.charCodeAt(0) === 36 ? name.slice(1) : name
  let value: any
  let fromTheme = false
  if (property === 'fontFamily') {
    value = state.conf.fontsParsed[lookupName]?.family
  } else {
    const fontKey =
      property === 'fontSize'
        ? 'size'
        : property === 'fontWeight'
          ? 'weight'
          : property === 'lineHeight' || property === 'letterSpacing'
            ? property
            : ''
    if (fontKey) {
      const font =
        state.conf.fontsParsed[state.fontFamily || state.conf.defaultFontToken] ||
        state.conf.fontsParsed[state.conf.defaultFontToken]
      value = font?.[fontKey]?.[lookupName]
    } else {
      const category = grammar.tokenCategory(property)
      const dot = lookupName.indexOf('.')
      if (dot !== -1) {
        const prefix = lookupName.slice(0, dot)
        if (!category || prefix === category || prefix === 'color') {
          lookupName = lookupName.slice(dot + 1)
        }
      }
      value = category ? state.conf.tokensParsed[category]?.[lookupName] : undefined
      if (!value) {
        const first = lookupName.charCodeAt(0)
        if (
          category ||
          !((first >= 48 && first <= 57) || first === 43 || first === 45 || first === 46)
        ) {
          value =
            state.theme?.[lookupName] ||
            state.conf.themes?.[state.flatThemeName || '']?.[lookupName]
          fromTheme = !!value
          if (!value && !category) {
            value =
              state.conf.tokensParsed.space?.[lookupName] ||
              state.conf.tokensParsed.color?.[lookupName]
          }
        }
      }
    }
  }

  if (process.env.NODE_ENV === 'development') {
    const category = grammar.tokenCategory(property)
    if (category && category !== 'color' && state.conf.tokensParsed.color?.[name]) {
      warnOnce(`"${name}" contributes to "color", not "${property}"`)
    }
  }
  let out = raw
  if (isVariable(value)) {
    out =
      resolveValues === 'except-theme' && fromTheme
        ? `${THEME_REF_PREFIX}${lookupName}${opacity !== undefined ? `/${opacity}` : ''}`
        : resolveVariableValue(property, value, resolveValues)
    if (opacity !== undefined) {
      out =
        process.env.TAMAGUI_TARGET === 'web'
          ? `color-mix(in srgb, ${out} ${opacity}%, transparent)`
          : (normalizeColor(out, opacity / 100) ?? out)
    }
  }
  if (embedded && out === raw) {
    const usedSafeArea = state.flatUsesSafeArea
    out = grammar.embeddedTokens(raw, (word) => configuredValue(state, property, word))
    // a safe-area token flips state as it resolves, so a cached hit would lose it
    if (!usedSafeArea && state.flatUsesSafeArea) return out
  }
  if (!fontProperty && !fromTheme) {
    if (valueCacheEntries > 8192) {
      valueCaches = new WeakMap()
      valueCacheEntries = 0
    } else {
      valueCacheEntries++
      byRaw.set(raw, out)
    }
  }
  return out
}

function ownsSourceLayer(state: GetStyleState, property: string, conditional = false) {
  const direct = state as DirectState
  const layer = direct.flatPass?.[passSourceLayer] || 0
  const layers = (direct.flatPropertyLayers ||= new Map())
  const previous = layers.get(property)
  if (previous !== undefined) {
    if (previous > layer) return false
    if (previous < layer) {
      // a conditional contribution layers over a lower tier instead of
      // replacing it: flexDirection="sm:column" on a styled row keeps the
      // base row while the condition is inactive. only a program's
      // unconditional base transfers ownership and clears what it replaces.
      if (conditional) return true
      clearDirectStyle(state, property)
    }
  } else if (conditional) {
    // don't claim the slot either, so a later lower-tier base can still join
    return true
  }
  layers.set(property, layer)
  return true
}

function emitProperty(
  state: GetStyleState,
  property: string,
  value: any,
  cursor: Condition | null,
  originalValue: any,
  contextOnly: boolean
) {
  if (!ownsSourceLayer(state, property, cursor !== null)) return
  const direct = state as DirectState
  const condition = cursor ? cursor[conditionValue] : 0
  if (
    condition &&
    (!(condition & 2) ||
      (!(condition & 1) &&
        !(canGenerateCSS && state.flatShouldDoClasses) &&
        !(
          process.env.TAMAGUI_TARGET === 'native' &&
          cursor![conditionTheme] &&
          supportsDynamicColorIOS &&
          isColorStyleKey(property)
        )))
  ) {
    return
  }
  if (process.env.TAMAGUI_TARGET === 'web' && value === false && !condition) {
    clearDirectStyle(state, property)
    if (direct.flatStyleStaticConfig?.styledContextKeys?.has(property)) {
      ;(state.overriddenContextProps ||= {})[property] = false
    }
    return
  }
  if (condition & 4) (state.flatEnterKeys ||= new Set()).add(property)
  if (condition & 8) (state.flatExitKeys ||= new Set()).add(property)

  const theme = cursor ? cursor[conditionTheme] : ''
  if (process.env.TAMAGUI_TARGET === 'native' && theme) {
    if (supportsDynamicColorIOS && isColorStyleKey(property)) {
      const schemes = ((direct.flatDynamicColors ||= {})[property] ||= {})
      schemes[theme] =
        typeof originalValue === 'string' && /^[a-z]+$/i.test(originalValue)
          ? originalValue
          : value
      streamWriteInline(
        state,
        property,
        { dynamic: { ...schemes } },
        cursor,
        originalValue,
        true,
        // a DynamicColorIOS aggregate applies on every scheme: force the
        // active bit by addition — the packed condition exceeds Int32, so a
        // bitwise write would corrupt it
        condition & 1 ? condition : condition + 1
      )
      return
    }
    direct.flatDynamicThemeAccess = true
  }

  if (contextOnly) {
    if (!condition || condition & 1) {
      ;(state.overriddenContextProps ||= {})[property] = originalValue
    }
    return
  }

  if (
    canGenerateCSS &&
    state.flatShouldDoClasses &&
    !condition &&
    property === 'transform'
  ) {
    if (process.env.NODE_ENV === 'development' && state.transformAccumulator) {
      for (const part of getTransformPartKeys(state.transformAccumulator)) {
        warnOnce(
          `legacy transform part "${part}" is dropped because "transform" owns the property`
        )
      }
    }
    state.transformAccumulator ||= createTransformAccumulator()
    addTransformValue(state.transformAccumulator, property, value)
    return
  }

  const shouldPromoteAnimatedStyle =
    canGenerateCSS &&
    !condition &&
    !state.flatShouldDoClasses &&
    !state.styleProps.noMergeStyle &&
    state.styleProps.isAnimated &&
    state.animationDriver?.inputStyle === 'css' &&
    property in nonAnimatableStyleProps

  if (canGenerateCSS && (state.flatShouldDoClasses || shouldPromoteAnimatedStyle)) {
    writeStyleRecord(
      state,
      property,
      value,
      cursor,
      originalValue,
      shouldPromoteAnimatedStyle ? recordCSS : 0
    )
    return
  }

  streamWriteInline(state, property, value, cursor, originalValue)
}

function numericUnitValue(value: string, first: string, second?: string): number {
  const unitLength =
    value.endsWith(first) || (second !== undefined && value.endsWith(second))
      ? first.length
      : 0
  if (!unitLength || value.length === unitLength) return Number.NaN
  const numeric = Number(value.slice(0, value.length - unitLength))
  return Number.isFinite(numeric) ? numeric : Number.NaN
}

function emitBorder(
  state: GetStyleState,
  property: string,
  raw: string,
  cursor: Condition | null,
  originalValue: any,
  contextOnly: boolean
) {
  if (
    process.env.TAMAGUI_TARGET === 'native' &&
    (property === 'borderBlock' || property === 'borderInline')
  ) {
    if (process.env.NODE_ENV === 'development') {
      warnOnce(`RN has no logical border shorthand "${property}"; dropping it`)
    }
    return
  }
  let { width, style, color } = classifyBorderComponents(raw, property === 'outline')
  if (style === 'none' && width === undefined) width = '0'
  if (process.env.TAMAGUI_TARGET === 'native' && width !== undefined) {
    // native width props want numbers; the CSS keywords map to their
    // user-agent px values (px so they convert instead of resolving as tokens)
    if (width === 'thin') width = '1px'
    else if (width === 'medium') width = '3px'
    else if (width === 'thick') width = '5px'
  }
  const targets = borderTargets[property]
  const prefix = property === 'outline' ? 'outline' : 'border'
  if (
    style !== undefined &&
    process.env.TAMAGUI_TARGET === 'native' &&
    property === 'border'
  ) {
    emitProperty(state, 'borderStyle', style, cursor, originalValue, contextOnly)
  }
  for (const target of targets) {
    const propBase = `${prefix}${target}`
    if (width !== undefined) {
      emitResolved(state, `${propBase}Width`, width, cursor, originalValue, contextOnly)
    }
    if (
      style !== undefined &&
      !(process.env.TAMAGUI_TARGET === 'native' && property === 'border')
    ) {
      emitProperty(state, `${propBase}Style`, style, cursor, originalValue, contextOnly)
    }
    if (color !== undefined) {
      emitResolved(state, `${propBase}Color`, color, cursor, originalValue, contextOnly)
    }
  }
}

function emitTextDecoration(
  state: GetStyleState,
  raw: string,
  cursor: Condition | null,
  originalValue: any,
  contextOnly: boolean
) {
  for (const part of splitComponents(raw)) {
    const property =
      part === 'solid' ||
      part === 'double' ||
      part === 'dotted' ||
      part === 'dashed' ||
      part === 'wavy'
        ? 'textDecorationStyle'
        : part === 'underline' ||
            part === 'overline' ||
            part === 'line-through' ||
            part === 'none'
          ? 'textDecorationLine'
          : 'textDecorationColor'
    emitResolved(state, property, part, cursor, originalValue, contextOnly)
  }
}

function emitResolved(
  state: GetStyleState,
  property: string,
  raw: string,
  cursor: Condition | null,
  originalValue: any,
  contextOnly: boolean
) {
  emitProperty(
    state,
    property,
    resolveValue(state, property, raw),
    cursor,
    originalValue,
    contextOnly
  )
}

function resolveValue(state: GetStyleState, property: string, raw: any) {
  let value = typeof raw === 'string' ? configuredValue(state, property, raw, true) : raw
  if (
    (process.env.TAMAGUI_TARGET === 'native' || !state.flatShouldDoClasses) &&
    typeof value === 'string'
  ) {
    const unitValue = numericUnitValue(value, 'px', 'dp')
    if (Number.isFinite(unitValue)) {
      value = unitValue
    } else if (value !== '' && Number.isFinite(Number(value))) {
      value = Number(value)
    }
  }
  return value
}

function shadowUnit(part: any) {
  return typeof part === 'number' ? `${part}px` : part || '0px'
}

function emitWebTextShadow(
  state: DirectState,
  property: string,
  value: any,
  originalValue: any,
  contextOnly: boolean
) {
  const shadow = (state.flatTextShadow ||= {})
  shadow[property] = value
  const offset = shadow.textShadowOffset || { width: 0, height: 0 }
  if (!shadow.textShadowColor) return
  emitProperty(
    state,
    'textShadow',
    `${shadowUnit(offset.width)} ${shadowUnit(offset.height)} ${shadowUnit(shadow.textShadowRadius)} ${shadow.textShadowColor}`,
    null,
    originalValue,
    contextOnly
  )
}

function emitValue(
  state: GetStyleState,
  property: string,
  raw: any,
  cursor: Condition | null,
  originalValue: any,
  contextOnly: boolean
) {
  const condition = cursor ? cursor[conditionValue] : 0
  const grammar = getConfigRevisionState(state.conf)

  if (process.env.TAMAGUI_TARGET === 'web') {
    property = webStyleProperty(property)
    if (property === 'backdropFilter') {
      emitValue(state, 'WebkitBackdropFilter', raw, cursor, originalValue, contextOnly)
    }
  }

  if (isVariable(raw)) {
    raw = resolveVariableValue(
      property,
      raw,
      process.env.TAMAGUI_TARGET === 'web' &&
        !state.flatShouldDoClasses &&
        state.styleProps.resolveValues === 'auto'
        ? 'value'
        : state.styleProps.resolveValues
    )
  }

  if (
    typeof raw === 'string' &&
    (property === 'transition' || property === 'transitionProperty')
  ) {
    raw = grammar.normalizeTransition(raw)
  }

  if (
    (property === 'borderWidth' ||
      property === 'borderTopWidth' ||
      property === 'borderRightWidth' ||
      property === 'borderBottomWidth' ||
      property === 'borderLeftWidth') &&
    state.styleProps.noNormalize !== false
  ) {
    const target =
      process.env.TAMAGUI_TARGET === 'native'
        ? 'borderStyle'
        : property.slice(0, -5) + 'Style'
    writeStyleRecord(state, target, 'solid', cursor, originalValue, recordDefault)
  }

  const propertyKind = grammar.propertyKind(property)
  if (
    process.env.TAMAGUI_TARGET === 'web' &&
    propertyKind >= 7 &&
    typeof raw === 'string'
  ) {
    const composite = grammar.compositeValue(property, raw, state, configuredValue)
    if (composite !== undefined) {
      emitProperty(state, property, composite, cursor, originalValue, contextOnly)
      return
    }
  }
  if (propertyKind === 5) {
    const value = typeof raw === 'string' ? configuredValue(state, property, raw) : raw
    if (canGenerateCSS && state.flatShouldDoClasses && !condition) {
      state.transformAccumulator ||= createTransformAccumulator()
      addTransformValue(state.transformAccumulator, property, value)
    } else if (condition && canGenerateCSS && state.flatShouldDoClasses) {
      emitProperty(
        state,
        'transform',
        `${property}(${value})`,
        cursor,
        originalValue,
        contextOnly
      )
    } else {
      streamWriteInline(state, property, value, cursor, originalValue, true)
    }
    return
  }

  if (process.env.TAMAGUI_TARGET === 'web') {
    const webShadowPart = propertyKind < 5 ? propertyKind : 0
    if (webShadowPart || propertyKind === 6) {
      const value = typeof raw === 'string' ? configuredValue(state, property, raw) : raw
      if (state.styleProps.noNormalize !== false) {
        if (webShadowPart) {
          const shadow = ((state as DirectState).flatWebShadow ||= [])
          shadow[webShadowPart - 1] = value
          shadow[4] = ++frameSequence
          shadow[5] = originalValue
          shadow[6] = contextOnly
        } else {
          emitWebTextShadow(
            state as DirectState,
            property,
            value,
            originalValue,
            contextOnly
          )
        }
      } else {
        streamWriteInline(state, property, value, cursor, originalValue, true, -1, true)
      }
      return
    }
  }

  if (property === 'transform') {
    if (canGenerateCSS && state.flatShouldDoClasses && Array.isArray(raw)) {
      raw = transformsToString(raw)
    }
    if (process.env.TAMAGUI_TARGET === 'native' && typeof raw === 'string') {
      const transform = parseNativeTransform(raw)
      if (transform) {
        emitProperty(state, property, transform, cursor, originalValue, contextOnly)
        return
      }
    }
  }

  if (
    process.env.TAMAGUI_TARGET === 'native' &&
    typeof raw === 'string' &&
    borderTargets[property]
  ) {
    emitBorder(state, property, raw, cursor, originalValue, contextOnly)
    return
  }
  if (
    process.env.TAMAGUI_TARGET === 'native' &&
    typeof raw === 'string' &&
    property === 'textDecoration'
  ) {
    emitTextDecoration(state, raw, cursor, originalValue, contextOnly)
    return
  }
  if (typeof raw === 'string' && property === 'background') {
    const parts = splitComponents(raw)
    if (parts.length === 1 && !startsValueFunction(parts[0])) {
      emitResolved(state, 'backgroundColor', parts[0], cursor, originalValue, contextOnly)
      return
    }
    if (process.env.TAMAGUI_TARGET === 'native') {
      if (process.env.NODE_ENV === 'development') {
        warnOnce(`native background cannot represent "${raw}"; dropping it`)
      }
      return
    }
  }

  if (
    property === 'x' ||
    property === 'y' ||
    property === 'scale' ||
    property === 'scaleX' ||
    property === 'scaleY' ||
    property === 'rotate'
  ) {
    let value = typeof raw === 'string' ? configuredValue(state, property, raw) : raw
    if (
      (process.env.TAMAGUI_TARGET === 'native' || !state.flatShouldDoClasses) &&
      typeof value === 'string' &&
      !value.startsWith(THEME_REF_PREFIX)
    ) {
      if (
        property === 'rotate' &&
        !Number.isFinite(numericUnitValue(value, 'deg', 'rad'))
      ) {
        if (process.env.NODE_ENV === 'development') {
          warnOnce(
            `native transform "${property}" cannot represent "${value}"; dropping it`
          )
        }
        if (condition & 1) {
          removeTransformValue(state.transformAccumulator, property)
          writeStyleRecord(state, property, undefined, cursor, undefined, recordRetract)
        }
        return
      }
      const unitValue = numericUnitValue(value, 'px', 'dp')
      if (Number.isFinite(unitValue)) {
        value = unitValue
      } else if (Number.isFinite(Number(value))) {
        value = Number(value)
      }
    }
    if (!canGenerateCSS || !state.flatShouldDoClasses) {
      emitProperty(state, property, value, cursor, originalValue, contextOnly)
      return
    }
    const targets =
      property === 'scale'
        ? ['--t-scale-x', '--t-scale-y']
        : [
            property === 'x'
              ? '--t-x'
              : property === 'y'
                ? '--t-y'
                : property === 'scaleX'
                  ? '--t-scale-x'
                  : property === 'scaleY'
                    ? '--t-scale-y'
                    : 'rotate',
          ]
    for (const target of targets) {
      let targetValue = value
      if (typeof targetValue === 'number') {
        if (target === '--t-x' || target === '--t-y') targetValue = `${targetValue}px`
        else if (target === 'rotate') targetValue = `${targetValue}deg`
      }
      emitProperty(state, target, targetValue, cursor, originalValue, contextOnly)
      if (target === '--t-x' || target === '--t-y') addComposition(state, 'translate')
      else if (target.startsWith('--t-scale')) addComposition(state, 'scale')
    }
    return
  }

  if (
    property === 'borderRadius' &&
    process.env.TAMAGUI_TARGET === 'web' &&
    !state.flatShouldDoClasses &&
    !condition
  ) {
    if (typeof raw === 'string') {
      emitResolved(state, property, raw, cursor, originalValue, contextOnly)
    } else {
      emitProperty(state, property, raw, cursor, originalValue, contextOnly)
    }
    return
  }

  let value: any = resolveValue(state, property, raw)
  if (
    canGenerateCSS &&
    state.flatShouldDoClasses &&
    property === 'boxShadow' &&
    !condition
  ) {
    ;(state as DirectState).flatBoxShadow = value
    ;(state as DirectState).flatBoxShadowSequence = frameSequence + 1
  }

  if (
    process.env.TAMAGUI_TARGET === 'native' &&
    typeof value === 'string' &&
    (property === 'backgroundImage' ||
      property === 'boxShadow' ||
      property === 'textShadow')
  ) {
    const parsed = parseNativeStyle(property, value)
    if (parsed) {
      if (property === 'textShadow') {
        for (const [key, parsedValue] of parsed) {
          emitProperty(state, key, parsedValue, cursor, originalValue, contextOnly)
        }
      } else {
        emitProperty(
          state,
          property === 'backgroundImage' ? 'experimental_backgroundImage' : property,
          parsed,
          cursor,
          originalValue,
          contextOnly
        )
      }
      return
    }
  }

  if (
    process.env.TAMAGUI_TARGET === 'native' &&
    property === 'fontVariant' &&
    typeof value === 'string'
  ) {
    const variants: string[] = []
    let start = 0
    for (let index = 0; index <= value.length; index++) {
      const code = index === value.length ? 32 : value.charCodeAt(index)
      if (code !== 44 && code > 32) continue
      if (start < index) variants.push(value.slice(start, index))
      start = index + 1
    }
    value = variants
  }

  if (
    process.env.TAMAGUI_TARGET === 'web' &&
    !state.styleProps.noExpand &&
    property === 'flex' &&
    typeof value === 'number'
  ) {
    const compat = state.conf.settings.styleCompat
    value =
      value === -1
        ? '0 auto'
        : compat === 'legacy'
          ? `${value} auto`
          : compat && compat !== 'web'
            ? value > 0
              ? `${value} 0 0`
              : `0 ${-value} auto`
            : value < 0
              ? value
              : `${value} 0px`
  }

  const expanded =
    process.env.TAMAGUI_TARGET === 'native' && !state.styleProps.noExpand
      ? expandStyle(property, value, state.conf.settings.styleCompat || 'web')
      : null
  if (!expanded) {
    emitProperty(state, property, value, cursor, originalValue, contextOnly)
    return
  }

  if (typeof raw === 'string' && expanded.length > 1) {
    const parts = splitComponents(raw)
    if (parts.length > 0 && parts.length <= (expanded.length === 4 ? 4 : 2)) {
      for (let index = 0; index < expanded.length; index++) {
        const partIndex =
          index === 0 || parts.length === 1
            ? 0
            : index === 1 || (index === 3 && parts.length < 4)
              ? 1
              : index === 2 && parts.length < 3
                ? 0
                : index
        emitResolved(
          state,
          expanded[index][0],
          parts[partIndex],
          cursor,
          originalValue,
          contextOnly
        )
      }
      return
    }
  }
  for (let index = 0; index < expanded.length; index++) {
    emitProperty(
      state,
      expanded[index][0],
      expanded[index][1],
      cursor,
      originalValue,
      contextOnly
    )
  }
}

type ConditionalValueSink = (payload: any, condition: unknown, source: any) => void

function emitConditionalValue(
  state: GetStyleState,
  property: string,
  payload: any,
  condition: Condition | null,
  source: any,
  sink: ConditionalValueSink | null,
  mode: number,
  contextOnly: boolean
) {
  if (sink) {
    sink(payload, condition, source)
  } else if (condition) {
    emitUnderCondition(
      state,
      property,
      payload,
      condition,
      mode === 2 ? payload : undefined,
      contextOnly,
      mode,
      source
    )
  } else {
    emitValue(state, property, payload, null, payload, contextOnly)
  }
}

export function walkConditionalValue(
  state: GetStyleState,
  property: string,
  value: any,
  parent: unknown,
  sink: ConditionalValueSink | null,
  warnMode = 0,
  contextOnly = false
) {
  const parentCondition = (parent as Condition) || null
  let hasBase = false
  let conditions = 0
  let lastPayload = ''
  if (typeof value === 'string') {
    const parsed = getConfigRevisionState(state.conf).parseFlatValue(value)
    const [segments, failure, failureIndex] = parsed
    // the parse result is cached per authored string, so its payload and chain
    // substrings can be too. without this every render of every element re-slices
    // the same pieces out of the same value
    let slices = parsedSlices.get(parsed)
    if (slices === undefined) parsedSlices.set(parsed, (slices = []))
    const chainCount = segments.length / 5 - 1
    if (property === 'aspectRatio' && chainCount === 1) {
      const left = Number(value.slice(segments[7], segments[8]))
      const right = Number(value.slice(segments[5], segments[6]))
      if (left > 0 && right > 0 && Number.isFinite(left) && Number.isFinite(right)) {
        return false
      }
    }
    // base segments emit before conditional ones regardless of authored order:
    // the program's own base is what transfers slot ownership, so it must land
    // before its clauses, and clause order independence is already the contract
    for (let index = 0; index < segments.length; index += 5) {
      const start = segments[index]
      const end = segments[index + 1]
      const flags = segments[index + 4]
      if (!(flags & 1)) continue
      if (start === end) continue
      if (flags & 2) {
        const payload = (slices[index] ??= value.slice(start, end))
        emitConditionalValue(
          state,
          property,
          payload,
          parentCondition,
          payload,
          sink,
          warnMode,
          contextOnly
        )
        hasBase = true
      } else if (
        process.env.NODE_ENV !== 'production' &&
        warnMode &&
        !chainCount &&
        (failure === 'invalid-character' || failure === 'stray-comment-close')
      ) {
        emitConditionalValue(
          state,
          property,
          value,
          parentCondition,
          value,
          sink,
          warnMode,
          contextOnly
        )
        hasBase = true
      } else if (warnMode) {
        warnScanFailure(property, value, failure, failureIndex)
      }
    }
    let lastPayloadStart = 0
    for (let index = 0; index < segments.length; index += 5) {
      const start = segments[index]
      const end = segments[index + 1]
      const flags = segments[index + 4]
      if (flags & 1) continue
      if (!(flags & 4) || !(flags & 2)) {
        if (warnMode) warnScanFailure(property, value, failure, failureIndex)
        continue
      }
      lastPayloadStart = start
      if (start === end) {
        if (warnMode && process.env.NODE_ENV === 'development') {
          warnRefusedValue(property, value, 'a conditional clause has no value')
        }
        continue
      }
      const cursor = conditionFromKey(
        state,
        (slices[index + 2] ??= value.slice(segments[index + 2], segments[index + 3])),
        parentCondition
      )
      conditions |= cursor[conditionValue]
      if (cursor[conditionValue] & conditionResolvedFlag || warnMode) {
        emitConditionalValue(
          state,
          property,
          (slices[index] ??= value.slice(start, end)),
          cursor,
          value,
          sink,
          warnMode,
          contextOnly
        )
      }
    }
    if (process.env.NODE_ENV !== 'production') lastPayload = value.slice(lastPayloadStart)
  } else {
    if (
      !value ||
      typeof value !== 'object' ||
      Array.isArray(value) ||
      isVariable(value) ||
      !classifyConditionalObject(value, state)
    ) {
      return false
    }
    if (value.default != null) {
      emitConditionalValue(
        state,
        property,
        value.default,
        parentCondition,
        value.default,
        sink,
        warnMode,
        contextOnly
      )
      hasBase = true
    }
    for (const key in value) {
      if (key === 'default' || value[key] == null) continue
      const cursor = conditionFromKey(state, key, parentCondition)
      conditions |= cursor[conditionValue]
      if (cursor[conditionValue] & conditionResolvedFlag || warnMode) {
        emitConditionalValue(
          state,
          property,
          value[key],
          cursor,
          value[key],
          sink,
          warnMode,
          contextOnly
        )
      }
    }
  }

  if (
    warnMode &&
    process.env.NODE_ENV === 'development' &&
    typeof value === 'string' &&
    !hasBase &&
    conditions &&
    getConfigRevisionState(state.conf).tokenCategory(property) &&
    splitComponents(lastPayload).length > 1
  ) {
    warnOnce(
      `${property}="${value}" has multiple values after its first conditional. Write the base value before the first conditional.`
    )
  }
  if (
    warnMode === 1 &&
    (!canGenerateCSS || !state.flatShouldDoClasses) &&
    conditions & 12 &&
    !hasBase
  ) {
    // inline lifecycle styles need a natural resting value when no base was
    // authored anywhere: a lower tier that owns the property (a styled default)
    // is the resting value already, so don't stamp over it
    const resting =
      property === 'opacity' || property.startsWith('scale')
        ? 1
        : property === 'rotate'
          ? '0deg'
          : property === 'x' || property === 'y'
            ? 0
            : null
    if (resting !== null && !(state as DirectState).flatPropertyLayers?.has(property)) {
      emitConditionalValue(
        state,
        property,
        resting,
        parentCondition,
        resting,
        sink,
        warnMode,
        contextOnly
      )
    }
  }
  return true
}

function contributeValue(
  state: GetStyleState,
  property: string,
  value: any,
  originalValue?: any,
  contextOnly = false,
  condition?: Condition | string
) {
  if (condition !== undefined) {
    const directState = state as DirectState
    const parent = (directState.flatPass?.[passParentCursor] as Condition) || null
    // compose the incoming condition over any live parent condition by
    // re-parsing its canonical key; a frontend hands authored text directly
    let effective: Condition
    if (typeof condition === 'string') {
      effective = conditionFromKey(state, condition, parent)
    } else if (parent) {
      effective = conditionFromKey(state, condition[conditionKey], parent)
      if (!(condition[conditionValue] & conditionResolvedFlag)) {
        setConditionUnresolved(effective)
      }
      commitCondition(effective)
    } else {
      effective = condition
    }
    if (
      typeof value !== 'string' &&
      walkConditionalValue(state, property, value, effective, null, 2, contextOnly)
    ) {
      return true
    }
    emitUnderCondition(
      state,
      property,
      value,
      effective,
      originalValue,
      contextOnly,
      2,
      value
    )
    return true
  }
  const compositeKind =
    process.env.TAMAGUI_TARGET === 'web'
      ? getConfigRevisionState(state.conf).propertyKind(property)
      : 0
  if (
    compositeKind > 0 &&
    compositeKind < 6 &&
    ((typeof value === 'string' && value.indexOf(':') !== -1) ||
      (value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        !isVariable(value) &&
        classifyConditionalObject(value, state)))
  ) {
    if (process.env.NODE_ENV === 'development') {
      warnOnce(`conditional "${property}" needs its composite property; dropping it`)
    }
    return true
  }
  if (value === 'safe') {
    const expanded = getConfigRevisionState(state.conf).expandSafeArea(property)
    if (expanded) {
      state.flatUsesSafeArea = true
      for (const [key, resolved] of expanded) {
        emitAtParentCondition(state, key, resolved, originalValue ?? value, contextOnly)
      }
      return true
    }
  }
  const parent =
    ((state as DirectState).flatPass?.[passParentCursor] as Condition) || null
  if (walkConditionalValue(state, property, value, parent, null, 1, contextOnly))
    return true
  if (value != null) {
    emitAtParentCondition(state, property, value, originalValue ?? value, contextOnly)
    return true
  }
  return false
}

function clearDirectStyle(state: GetStyleState, property: string) {
  const direct = state as DirectState
  if (process.env.TAMAGUI_TARGET === 'web') property = webStyleProperty(property)
  const propertyKind = getConfigRevisionState(state.conf).propertyKind(property)
  const atomicKey = property.startsWith('transition')
    ? 'transition'
    : propertyKind > 0 && propertyKind < 5
      ? 'boxShadow'
      : propertyKind === 6
        ? 'textShadow'
        : propertyKind === 5
          ? 'transform'
          : property
  const slot = process.env.TAMAGUI_TARGET === 'web' ? styleSlot(atomicKey) : atomicKey
  direct.flatAtomics?.delete(slot)
  if (direct.flatSlots) {
    if (slot !== atomicKey) {
      const entries = direct.flatSlots.get(slot)
      if (entries) {
        for (let index = entries.length; index--; ) {
          if (entries[index][0] === atomicKey) entries.splice(index, 1)
        }
      }
    }
    direct.flatSlots.delete(atomicKey)
  }
  if (atomicKey === 'transform') state.transformAccumulator = undefined
  if (state.style) delete state.style[atomicKey]
  delete state.classNames[atomicKey]
  delete state.classNames[slot]
}

export function emitVariantStyle(
  state: GetStyleState,
  key: string,
  value: any,
  original: any,
  condition: unknown,
  disabled: boolean
) {
  const pass = (state as DirectState).flatPass!
  // an explicit caller value for a defaulted variant is authoritative: a
  // nested re-assignment of that variant from ANOTHER variant's output is
  // dropped, so a default like unstyled=false cannot overwrite a caller size.
  // a variant re-emitting its own key (fontFamily -> getFontSized ->
  // { fontFamily }) is that caller value being applied, so it passes
  if (
    key !== pass[passMapSourceKey] &&
    (state as DirectState).flatCallerVariantKeys?.has(key)
  ) {
    return
  }
  if ((state as DirectState).flatStyleStaticConfig!.styledContextKeys?.has(key)) {
    ;(state.overriddenContextProps ||= {})[key] = (state.originalContextPropValues ||=
      {})[key] = original
  }
  const parent = pass[passParentCursor]
  pass[passParentCursor] = condition
  contributeProp(pass, key, value, original, disabled)
  pass[passParentCursor] = parent
}

// handles finding and resolving the fontFamily to the token name
// this is used as `font_[name]` in className for nice css variable support
export function getFontFamilyFromNameOrVariable(input: any, conf: TamaguiInternalConfig) {
  if (isVariable(input)) {
    const val = variableToFontNameCache.get(input)
    if (val) return val
    for (const key in conf.fontsParsed) {
      const familyVariable = conf.fontsParsed[key].family
      if (isVariable(familyVariable)) {
        variableToFontNameCache.set(familyVariable, key)
        if (familyVariable === input) {
          return key
        }
      }
    }
  } else if (typeof input === 'string' && input in conf.fontsParsed) {
    return input
  }
}

const variableToFontNameCache = new WeakMap<Variable, string>()

// the prop -> token-category tables live in their own module; re-exported
// here because they have always been part of this module's public surface
export * from './tokenCategories'
