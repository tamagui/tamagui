import {
  isAndroid,
  isClient,
  platformMatches,
  supportsDynamicColorIOS,
} from '@tamagui/constants'
import {
  StyleObjectIdentifier,
  StyleObjectPseudo,
  StyleObjectRules,
  nonAnimatableStyleProps,
  stylePropsAll,
  stylePropsText,
  stylePropsTransform,
  validStyles as validStylesView,
  tokenCategories,
} from '@tamagui/helpers'
import { getConfig, getFont } from '../config'
import { isVariable } from '../createVariable'
import { isDevTools } from '../constants/isDevTools'
import { mediaState as globalMediaState } from './mediaState'
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
  SpaceTokens,
  SplitStyleProps,
  StaticConfig,
  PropMapper,
  Variable,
  VariantSpreadFunction,
  StyleObject,
  TamaguiComponentState,
  TamaguiInternalConfig,
  TextStyle,
  ThemeParsed,
  TransitionProp,
  ViewStyleObject,
} from '../types'
import { variantResolverNames } from '../types'
import {
  addTransformValue,
  canonicalStateModifierNames,
  cloneTransformAccumulator,
  createTransformAccumulator,
  finalizeTransformAccumulator,
  getTransformPartKeys,
  isContainerSizeQueryText,
  isModifierName,
  modifierKindMedia,
  modifierKindPlatform,
  modifierKindState,
  modifierKindTheme,
  removeTransformValue,
  scanFlatValue,
  stateModifierSelectors,
  type ClausePrecedenceKey,
  type FlatValueHandler,
  type TransformAccumulator,
} from '@tamagui/style-grammar/runtime'
import { mediaKeyMatch } from './mediaState'
import { warnOnce, warnRefusedValue } from './warnOnce'
import { expandStyle } from './expandStyle'
import { fixStyles } from './expandStyles'
import { styleToCSS } from './styleToCSS'
import {
  addComposition,
  canGenerateCSS,
  clearFrameAtomic,
  completeFrameCSS,
  flushDirectStyles,
  requestBorderStyleDefault,
  type StyleFrameEntry,
} from './directStyleCSS'

export { directStyleSignature, flushDirectStyles } from './directStyleCSS'
import { getConfigRevisionState } from './grammarConfig'
import { isColorStyleKey } from './getDynamicVal'
import { getDefaultProps } from './getDefaultProps'
import { shouldInsertStyleRules, updateRules } from './insertStyleRule'
import { isPlainObject } from './isObj'
import { isObj } from './isObj'
import { log } from './log'
import { normalizeStyle } from './normalizeStyle'
import { normalizeColor } from './normalizeColor'
import { normalizeValueWithProperty } from './normalizeValueWithProperty'
import { parseNativeStyle } from './parseNativeStyle.native'
import { parseNativeTransform } from './parseNativeTransform.native'
import { getFontsForLanguage, getVariantExtras } from './getVariantExtras'
import { isRemValue, resolveRem } from './resolveRem'
import { expandSafeAreaValue, isSafeAreaKey } from './resolveSafeArea'
import { resolveSafeAreaVariable } from './resolveSafeAreaVariable'
import { resolveVariableValue } from './resolveVariableValue'
import { THEME_REF_PREFIX } from './themeRef'
import { getTokenCategoryForProperty, tokenCategoryByProperty } from './tokenCategories'
import { HOC_CLASSNAME_MARKER, skipProps } from './skipProps'
import { styleOriginalValues } from './styleOriginalValues'
import {
  type StyleDebugReceipt,
  type StyleTokenProvenance,
  setStyleTokenProvenance,
} from './styleProvenance'
import { transformsToString } from './transformsToString'

export { styleOriginalValues }
export { getStyleTokenProvenance, STYLE_TOKEN_PROVENANCE_KEY } from './styleProvenance'
export type {
  StyleDebugReceipt,
  StyleDebugTier,
  StyleTokenBinding,
  StyleTokenProvenance,
} from './styleProvenance'

export type SplitStyles = ReturnType<typeof getSplitStyles>

// internal HOC style entry carrying the property-to-class map at the authored
// style position. unlike the removed RNW transport, this has no $$css payload.
const TAMAGUI_CLASS_PROPS = '$$tamaguiClassProps'

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
  animationDriver?: AnimationDriverLike | null
) => null | GetStyleResult

function compoundMatcherMatches(expected: any, actual: any) {
  if (Array.isArray(expected)) {
    for (let index = 0; index < expected.length; index++) {
      if (expected[index] === actual) return true
    }
    return false
  }
  return expected === actual
}

// clause-string payloads arrive as slices, so booleans and numbers in the
// matcher compare by their string spelling
function compoundMatcherMatchesPayload(
  expected: any,
  source: string,
  start: number,
  end: number
) {
  if (Array.isArray(expected)) {
    for (let index = 0; index < expected.length; index++) {
      if (compoundMatcherMatchesPayload(expected[index], source, start, end)) return true
    }
    return false
  }
  const expectedValue = typeof expected === 'string' ? expected : String(expected)
  if (expectedValue.length !== end - start) return false
  for (let index = 0; index < expectedValue.length; index++) {
    if (expectedValue.charCodeAt(index) !== source.charCodeAt(start + index)) return false
  }
  return true
}

const preparedCompoundsKey = Symbol()

type PreparedCompounds = Record<string, number[]> & {
  [preparedCompoundsKey]: number[]
}

type StaticConfigWithPreparedCompounds = StaticConfig & {
  [preparedCompoundsKey]?: PreparedCompounds | null
}

function prepareStaticConfigCompounds(staticConfig: StaticConfig) {
  const compoundVariants = staticConfig.compoundVariants
  const preparedConfig = staticConfig as StaticConfigWithPreparedCompounds
  if (!compoundVariants?.length) {
    preparedConfig[preparedCompoundsKey] = null
    return
  }

  const selectorCounts: number[] = []
  const indexesByKey = Object.create(null) as PreparedCompounds
  indexesByKey[preparedCompoundsKey] = selectorCounts
  for (let index = 0; index < compoundVariants.length; index++) {
    const compoundVariant = compoundVariants[index]
    let selectorCount = 0
    for (const key in compoundVariant) {
      if (key === 'style') continue
      selectorCount++
      ;(indexesByKey[key] ||= []).push(index)
    }
    selectorCounts[index] = selectorCount
  }
  preparedConfig[preparedCompoundsKey] = indexesByKey
}

let compoundArena = new Float64Array(2048)
let compoundArenaTop = 1
let compoundArenaEpoch = 0

// ── condition cursors ────────────────────────────────────────────────────────

// Cursor handles are indexes into one numeric arena. Strings and the two
// variable-width payloads use parallel flat stacks. Acquisitions and releases
// are watermark-disciplined, so nested and reentrant passes append above the
// outer pass and clear every authored reference on release.
type ConditionCursor = number

const conditionWidth = 5
const conditionValueOffset = 0
const conditionFlagsOffset = 1
const conditionPrecedenceOffset = 2
const conditionAtomOffset = 3
const conditionWrapperOffset = 4

const conditionActiveFlag = 1
const conditionEmitFlag = 2
const conditionResolvedFlag = 4
const conditionEnterFlag = 8
const conditionExitFlag = 16
const conditionPlatformPseudoFlag = 32
const conditionInitialFlags =
  conditionActiveFlag | conditionEmitFlag | conditionResolvedFlag

const conditionTextWidth = 5
const conditionKeyOffset = 0
const conditionSelectorOffset = 1
const conditionThemeOffset = 2
const conditionUnsupportedStateOffset = 3
const conditionUnresolvedNameOffset = 4

let conditionNumbers = new Float64Array(2048)
const conditionTexts: string[] = []
const conditionAtomNumbers: number[] = []
const conditionAtomNames: string[] = []
const conditionWrappers: string[] = []
let conditionAtomTop = 0
let conditionWrapperTop = 0
let conditionCursorTop = conditionWidth

function reserveConditionCursor(cursor: number) {
  const required = cursor + conditionWidth
  if (required > conditionTexts.length) {
    const previous = conditionTexts.length
    conditionTexts.length = required
    conditionTexts.fill('', previous)
  }
  if (required <= conditionNumbers.length) return
  let length = conditionNumbers.length * 2
  while (length < required) length *= 2
  const previous = conditionNumbers
  conditionNumbers = new Float64Array(length)
  conditionNumbers.set(previous)
}

function conditionWrapperCopy(cursor: ConditionCursor) {
  const wrapper = conditionNumbers[cursor + conditionWrapperOffset]
  const count = wrapper & 7
  if (!count) return undefined
  const start = wrapper >> 3
  const wrappers = new Array<string>(count)
  for (let index = 0; index < count; index++) {
    wrappers[index] = conditionWrappers[start + index]
  }
  return wrappers
}

function setConditionUnresolved(cursor: ConditionCursor, name = '') {
  conditionNumbers[cursor + conditionFlagsOffset] &= ~conditionResolvedFlag
  if (name) {
    const text = cursor + conditionUnresolvedNameOffset
    conditionTexts[text] ||= name
  }
}

function appendConditionWrapper(cursor: ConditionCursor, wrapper: string) {
  conditionWrappers[conditionWrapperTop++] = wrapper
  conditionNumbers[cursor + conditionWrapperOffset]++
}

function copyConditionCursor(target: ConditionCursor, source: ConditionCursor) {
  for (let offset = 0; offset <= conditionPrecedenceOffset; offset++) {
    conditionNumbers[target + offset] = conditionNumbers[source + offset]
  }
  for (let offset = 0; offset < conditionTextWidth; offset++) {
    conditionTexts[target + offset] = conditionTexts[source + offset] || ''
  }
  const atom = conditionNumbers[source + conditionAtomOffset]
  const atomStart = atom >> 4
  const atomCount = atom & 15
  for (let index = 0; index < atomCount; index++) {
    const sourceAtom = atomStart + index
    conditionAtomNumbers[conditionAtomTop] = conditionAtomNumbers[sourceAtom]
    conditionAtomNames[conditionAtomTop++] = conditionAtomNames[sourceAtom]
  }
  conditionNumbers[target + conditionAtomOffset] += atomCount
  const wrapper = conditionNumbers[source + conditionWrapperOffset]
  const wrapperStart = wrapper >> 3
  const wrapperCount = wrapper & 7
  for (let index = 0; index < wrapperCount; index++) {
    conditionWrappers[conditionWrapperTop++] = conditionWrappers[wrapperStart + index]
  }
  conditionNumbers[target + conditionWrapperOffset] += wrapperCount
}

function resetConditionCursor(cursor: ConditionCursor, parent: ConditionCursor | null) {
  conditionNumbers[cursor + conditionValueOffset] = 0
  conditionNumbers[cursor + conditionFlagsOffset] = conditionInitialFlags
  conditionNumbers[cursor + conditionPrecedenceOffset] = 0
  conditionNumbers[cursor + conditionAtomOffset] = conditionAtomTop << 4
  conditionNumbers[cursor + conditionWrapperOffset] = conditionWrapperTop << 3
  conditionTexts.fill('', cursor, cursor + conditionTextWidth)
  if (parent) copyConditionCursor(cursor, parent)
}

function acquireConditionCursor(parent: ConditionCursor | null = 0): ConditionCursor {
  const cursor = conditionCursorTop
  conditionCursorTop += conditionWidth
  reserveConditionCursor(cursor)
  resetConditionCursor(cursor, parent)
  return cursor
}

function releaseConditionCursors(watermark: number) {
  if (watermark >= conditionCursorTop) return
  conditionTexts.fill('', watermark, conditionCursorTop)
  conditionCursorTop = watermark
}

function releaseConditionPayloads(atomBase: number, wrapperBase: number) {
  conditionAtomNames.fill('', atomBase, conditionAtomTop)
  conditionAtomTop = atomBase
  conditionWrappers.fill('', wrapperBase, conditionWrapperTop)
  conditionWrapperTop = wrapperBase
}

/**
 * Fold one resolved modifier atom into a cursor: identity insertion (sorted,
 * deduped), precedence ranks, activity against the current component state,
 * and — only while the pass can still emit CSS classes — selector and wrapper
 * text. Composition replays these same atoms, so this is the single place a
 * modifier's meaning is applied.
 */
function accumulateConditionAtom(
  state: GetStyleState,
  cursor: ConditionCursor,
  kind: number,
  rank: number,
  name: string
) {
  const atom = conditionNumbers[cursor + conditionAtomOffset]
  const atomStart = atom >> 4
  const atomCount = atom & 15
  for (let index = 0; index < atomCount; index++) {
    if (conditionAtomNames[atomStart + index] === name) return
  }
  conditionAtomNumbers[conditionAtomTop] = kind | (rank << 3)
  conditionAtomNames[conditionAtomTop++] = name
  conditionNumbers[cursor + conditionAtomOffset]++

  if (kind === modifierKindPlatform) {
    const precedence = conditionNumbers[cursor + conditionPrecedenceOffset]
    if (rank > precedence >>> 26) {
      conditionNumbers[cursor + conditionPrecedenceOffset] =
        (precedence & 0x3ffffff) | (rank << 26)
    }
    const matches = platformMatches(name)
    if (!matches) {
      conditionNumbers[cursor + conditionFlagsOffset] &= ~(
        conditionActiveFlag | conditionEmitFlag
      )
    }
    return
  }
  let precedence = conditionNumbers[cursor + conditionPrecedenceOffset]
  const depth = ((precedence >> 23) & 7) + 1
  const nextCategory =
    kind === modifierKindMedia
      ? 0
      : kind === 6
        ? 1
        : kind === modifierKindTheme
          ? 2
          : kind === 5
            ? 3
            : 4
  let categoryRank = (precedence >> 20) & 7
  let withinRank = precedence & 0xfffff
  if (nextCategory > categoryRank) {
    categoryRank = nextCategory
    withinRank = rank
  } else if (nextCategory === categoryRank && rank > withinRank) {
    withinRank = rank
  }
  precedence =
    (precedence & ~0x3ffffff) | (depth << 23) | (categoryRank << 20) | withinRank
  conditionNumbers[cursor + conditionPrecedenceOffset] = precedence

  const buildCSS = canGenerateCSS && state.flatShouldDoClasses

  if (kind === modifierKindMedia) {
    const query = getConfigRevisionState(state.conf).mediaQueries[name]
    if (!query) {
      setConditionUnresolved(cursor, name)
      return
    }
    if (buildCSS) appendConditionWrapper(cursor, `@media ${query}`)
    if (!state.flatMediaState?.[name]) {
      conditionNumbers[cursor + conditionFlagsOffset] &= ~conditionActiveFlag
    }
    ;(state.flatMediaKeys ||= new Set()).add(name)
  } else if (kind === modifierKindTheme) {
    conditionTexts[cursor + conditionThemeOffset] = name
    if (buildCSS) {
      const selector = cursor + conditionSelectorOffset
      conditionTexts[selector] += `:where(.t_${name}, .t_${name} *)`
    }
    if (
      state.flatThemeName !== name &&
      state.flatThemeName?.startsWith(`${name}_`) !== true
    ) {
      conditionNumbers[cursor + conditionFlagsOffset] &= ~conditionActiveFlag
    }
  } else if (kind === 5) {
    // name is canonical: `group-<state>` or `group-<state>/<name>`
    const slash = name.indexOf('/')
    const groupName = slash === -1 ? 'true' : name.slice(slash + 1)
    const stateSelector = stateModifierSelectors[rank]
    const conditionStateName = canonicalStateModifierNames[rank]
    if (buildCSS) {
      const selector = cursor + conditionSelectorOffset
      conditionTexts[selector] += `:where(.t_group_${groupName}${stateSelector} *)`
      if (rank === 0) appendConditionWrapper(cursor, '@media (hover: hover)')
    }
    const component = state.componentState.group?.[groupName]
    const context = state.flatGroupContext?.[groupName]
    if (!(component?.pseudo ?? context?.state.pseudo)?.[conditionStateName]) {
      conditionNumbers[cursor + conditionFlagsOffset] &= ~conditionActiveFlag
    }
    ;(state.flatGroupKeys ||= new Set()).add(groupName)
  } else if (kind === 6) {
    // name is canonical: `@<size>` or `@<size>/<name>`
    const slash = name.indexOf('/')
    const containerSize = name.slice(1, slash === -1 ? name.length : slash)
    const containerName = slash === -1 ? '' : name.slice(slash + 1)
    const containerQuery = getConfigRevisionState(state.conf).mediaQueries[containerSize]
    const groupKey = `@${containerName}`
    if (buildCSS) {
      appendConditionWrapper(
        cursor,
        containerName
          ? `@container ${containerName} ${containerQuery}`
          : `@container ${containerQuery}`
      )
    }
    const component = state.componentState.group?.[groupKey]
    const context = state.flatGroupContext?.[groupKey]
    if (
      process.env.NODE_ENV === 'development' &&
      containerName &&
      !component &&
      !context &&
      state.flatGroupContext?.[containerName]
    ) {
      warnOnce(
        `group-container:${containerName}`,
        `@${containerSize}/${containerName}: targets group="${containerName}", but groups no longer establish query containers. Add container="${containerName}" to that group.`
      )
    }
    const match = component?.media?.[containerSize]
    if (
      !(match === undefined
        ? context?.state.layout && mediaKeyMatch(containerSize, context.state.layout)
        : match)
    ) {
      conditionNumbers[cursor + conditionFlagsOffset] &= ~conditionActiveFlag
    }
    ;(state.flatGroupKeys ||= new Set()).add(groupKey)
    ;(state.flatGroupMedia ||= new Set()).add(containerSize)
  } else {
    const stateSelector = stateModifierSelectors[rank]
    conditionNumbers[cursor + conditionFlagsOffset] += 64
    if (
      process.env.TAMAGUI_TARGET === 'native' &&
      stateSelector[0] === '[' &&
      name !== 'disabled'
    ) {
      conditionTexts[cursor + conditionUnsupportedStateOffset] = name
    }
    if (rank === 6) {
      conditionNumbers[cursor + conditionFlagsOffset] |= conditionEnterFlag
    } else if (rank === 7) {
      conditionNumbers[cursor + conditionFlagsOffset] |= conditionExitFlag
    } else if (rank === 0 || rank === 2 || rank === 4) {
      conditionNumbers[cursor + conditionFlagsOffset] |= conditionPlatformPseudoFlag
    }
    if (buildCSS) {
      const selector = cursor + conditionSelectorOffset
      if (stateSelector[0] === '.') {
        conditionTexts[selector] += `:is(${stateSelector}, ${stateSelector} *)`
      } else {
        conditionTexts[selector] += stateSelector
      }
      if (rank === 0) appendConditionWrapper(cursor, '@media (hover: hover)')
    }
    const component = state.componentState
    const active =
      rank === 0
        ? !!component.hover
        : rank === 4
          ? !!(component.press || component.pressIn)
          : rank === 2
            ? !!component.focus
            : rank === 3
              ? !!component.focusVisible
              : rank === 1
                ? !!component.focusWithin
                : rank === 5
                  ? !!(component.disabled || state.props.disabled)
                  : rank === 6
                    ? !!component.unmounted
                    : rank === 7
                      ? !!state.styleProps.isExiting
                      : false
    if (!active) {
      conditionNumbers[cursor + conditionFlagsOffset] &= ~conditionActiveFlag
    }
    if (stateSelector[0] === ':') {
      ;(state.flatStateKeys ||= new Set()).add(name)
    }
  }
}

/** classify one authored modifier name and fold it into the cursor */
function resolveConditionModifier(
  state: GetStyleState,
  cursor: ConditionCursor,
  modifier: string
) {
  const compiled = getConfigRevisionState(state.conf)
  let code = compiled.modifiers[modifier]
  let kind = code & 7
  let rank = code >> 3
  if (kind === modifierKindState) {
    accumulateConditionAtom(state, cursor, kind, rank, canonicalStateModifierNames[rank])
    return
  }
  if (!kind && modifier.startsWith('group-')) {
    const slash = modifier.indexOf('/')
    const authoredState = modifier.slice(6, slash === -1 ? undefined : slash)
    code = compiled.modifiers[authoredState]
    if ((code & 7) === modifierKindState) {
      rank = code >> 3
      const groupName = slash === -1 ? 'true' : modifier.slice(slash + 1)
      if (
        rank !== 6 &&
        rank !== 7 &&
        (slash === -1 || isModifierName(groupName, 0, groupName.length))
      ) {
        const stateName = canonicalStateModifierNames[rank]
        accumulateConditionAtom(
          state,
          cursor,
          5,
          rank,
          `group-${stateName}${slash === -1 ? '' : modifier.slice(slash)}`
        )
        return
      }
    }
  } else if (!kind && modifier.charCodeAt(0) === 64) {
    const slash = modifier.indexOf('/')
    const containerSize = modifier.slice(1, slash === -1 ? undefined : slash)
    const containerName = slash === -1 ? '' : modifier.slice(slash + 1)
    let containerQuery = ''
    if (
      isModifierName(containerSize, 0, containerSize.length) &&
      (slash === -1 || isModifierName(containerName, 0, containerName.length)) &&
      ((code = compiled.modifiers[containerSize]) & 7) === modifierKindMedia &&
      (containerQuery = compiled.mediaQueries[containerSize]) &&
      isContainerSizeQueryText(containerQuery)
    ) {
      accumulateConditionAtom(state, cursor, 6, code >> 3, modifier)
      return
    }
  } else if (kind) {
    accumulateConditionAtom(state, cursor, kind, rank, modifier)
    return
  }
  setConditionUnresolved(cursor, modifier)
}

/** resolve a colon-joined condition text (an object key) into the cursor */
function resolveConditionText(
  state: GetStyleState,
  cursor: ConditionCursor,
  text: string
) {
  let start = 0
  for (let index = 0; index <= text.length; index++) {
    if (index !== text.length && text.charCodeAt(index) !== 58) continue
    if (index === start) {
      setConditionUnresolved(cursor)
      return
    }
    if (!(conditionNumbers[cursor + conditionFlagsOffset] & conditionResolvedFlag)) return
    resolveConditionModifier(state, cursor, text.slice(start, index))
    start = index + 1
  }
}

/** pack the accumulated cursor into the condition number, enforcing depth */
function commitConditionCursor(state: GetStyleState, cursor: ConditionCursor): number {
  if (!(conditionNumbers[cursor + conditionFlagsOffset] & conditionResolvedFlag)) {
    conditionNumbers[cursor + conditionValueOffset] = 0
    return 0
  }
  // the canonical identity materializes once per committed clause: the
  // smallest unused atom name joins next (selection over at most six names,
  // no intermediate collections)
  const atom = conditionNumbers[cursor + conditionAtomOffset]
  const atomStart = atom >> 4
  const atomCount = atom & 15
  let key = ''
  if (atomCount === 1) {
    key = conditionAtomNames[atomStart]
  } else {
    let previous = ''
    for (let picked = 0; picked < atomCount; picked++) {
      let smallest = ''
      for (let index = 0; index < atomCount; index++) {
        const name = conditionAtomNames[atomStart + index]
        if (previous && name <= previous) continue
        if (!smallest || name < smallest) smallest = name
      }
      key = picked === 0 ? smallest : `${key}:${smallest}`
      previous = smallest
    }
  }
  conditionTexts[cursor + conditionKeyOffset] = key
  const precedence = conditionNumbers[cursor + conditionPrecedenceOffset]
  const depth = (precedence >> 23) & 7
  if (depth > 5) {
    throw new Error(
      `a flat value clause supports at most 5 non-platform conditions; received ${depth} in "${key}:"`
    )
  }
  const flags = conditionNumbers[cursor + conditionFlagsOffset]
  const condition =
    precedence * 256 +
    (flags >> 6) * 32 +
    16 +
    (flags & conditionActiveFlag ? 1 : 0) +
    (flags & conditionEmitFlag ? 2 : 0) +
    (flags & conditionEnterFlag ? 4 : 0) +
    (flags & conditionExitFlag ? 8 : 0)
  conditionNumbers[cursor + conditionValueOffset] = condition
  return condition
}

// compound-arena payload: condition snapshots for matched conditional
// branches, addressed by index from arena nodes. Module-resident but strictly
// pass-scoped: forEachPropInForwardOrder watermarks and releases them with the
// arena. Index 0 is the unconditional branch.
const conditionSnapshotTexts: string[] = []

function snapshotCondition(cursor: ConditionCursor): number {
  const id = reserveCompoundArena(conditionWidth)
  const targetBase = id
  const sourceBase = cursor
  for (let offset = 0; offset < conditionWidth; offset++) {
    compoundArena[targetBase + offset] = conditionNumbers[sourceBase + offset]
  }
  const targetText = id
  const sourceText = cursor
  for (let offset = 0; offset < conditionTextWidth; offset++) {
    conditionSnapshotTexts[targetText + offset] =
      conditionTexts[sourceText + offset] || ''
  }
  return id
}

function copyConditionSnapshot(target: ConditionCursor, snapshot: number) {
  const targetBase = target
  const sourceBase = snapshot
  for (let offset = 0; offset <= conditionPrecedenceOffset; offset++) {
    conditionNumbers[targetBase + offset] = compoundArena[sourceBase + offset]
  }
  const targetText = target
  const sourceText = snapshot
  for (let offset = 0; offset < conditionTextWidth; offset++) {
    conditionTexts[targetText + offset] =
      conditionSnapshotTexts[sourceText + offset] || ''
  }
  const atom = compoundArena[sourceBase + conditionAtomOffset]
  const atomStart = atom >> 4
  const atomCount = atom & 15
  for (let index = 0; index < atomCount; index++) {
    const sourceAtom = atomStart + index
    conditionAtomNumbers[conditionAtomTop] = conditionAtomNumbers[sourceAtom]
    conditionAtomNames[conditionAtomTop++] = conditionAtomNames[sourceAtom]
  }
  conditionNumbers[targetBase + conditionAtomOffset] += atomCount
  const wrapper = compoundArena[sourceBase + conditionWrapperOffset]
  const wrapperStart = wrapper >> 3
  const wrapperCount = wrapper & 7
  for (let index = 0; index < wrapperCount; index++) {
    conditionWrappers[conditionWrapperTop++] = conditionWrappers[wrapperStart + index]
  }
  conditionNumbers[targetBase + conditionWrapperOffset] += wrapperCount
}

function acquireConditionSnapshotCursor(snapshot: number) {
  const cursor = acquireConditionCursor()
  copyConditionSnapshot(cursor, snapshot)
  return cursor
}

// compose two snapshots by replaying the second's atoms over a copy of the
// first: shared modifiers dedupe, ranks and activity re-derive, and no
// generated condition text is ever reparsed
function combineConditionSnapshots(
  state: GetStyleState,
  first: number,
  second: number
): number {
  if (!first) return second
  if (!second || first === second) return first
  const watermark = conditionCursorTop
  const target = acquireConditionSnapshotCursor(first)
  const secondBase = second
  const atomMeta = compoundArena[secondBase + conditionAtomOffset]
  const atomStart = atomMeta >> 4
  const atomCount = atomMeta & 15
  for (let index = 0; index < atomCount; index++) {
    const atom = atomStart + index
    accumulateConditionAtom(
      state,
      target,
      conditionAtomNumbers[atom] & 7,
      conditionAtomNumbers[atom] >> 3,
      conditionAtomNames[atom]
    )
  }
  commitConditionCursor(state, target)
  const key = conditionTexts[target + conditionKeyOffset] || ''
  let result: number
  if (key === conditionSnapshotTexts[first + conditionKeyOffset]) {
    result = first
  } else if (key === conditionSnapshotTexts[second + conditionKeyOffset]) {
    result = second
  } else {
    result = snapshotCondition(target)
  }
  releaseConditionCursors(watermark)
  return result
}

function reserveCompoundArena(count: number) {
  const start = compoundArenaTop
  const required = start + count
  if (required > compoundArena.length) {
    let length = compoundArena.length * 2
    while (length < required) length *= 2
    const previous = compoundArena
    compoundArena = new Float64Array(length)
    for (let index = 0; index < compoundArenaTop; index++) {
      compoundArena[index] = previous[index]
    }
  }
  compoundArenaTop = required
  return start
}

const compoundStateWidth = 8
const compoundSeen = 1
const compoundFailed = 2
const compoundCombinations = 3
const compoundPendingHead = 4
const compoundPendingTail = 5
const compoundMatchedBase = 6
const compoundScanned = 7

function initializeCompoundState(stateIndex: number, epoch: number) {
  if (compoundArena[stateIndex] === epoch) return
  compoundArena[stateIndex] = epoch
  for (let offset = 1; offset < compoundStateWidth; offset++) {
    compoundArena[stateIndex + offset] = 0
  }
}

function appendCompoundNode(headCell: number, tailCell: number, conditionId: number) {
  const node = reserveCompoundArena(2)
  compoundArena[node] = conditionId
  compoundArena[node + 1] = 0
  const tail = compoundArena[tailCell]
  if (tail) compoundArena[tail + 1] = node
  else compoundArena[headCell] = node
  compoundArena[tailCell] = node
}

function beginCompoundEdges(
  indexes: number[] | undefined,
  stateStart: number,
  epoch: number
) {
  if (!indexes) return
  for (let index = 0; index < indexes.length; index++) {
    const stateIndex = stateStart + indexes[index] * compoundStateWidth
    initializeCompoundState(stateIndex, epoch)
    compoundArena[stateIndex + compoundPendingHead] = 0
    compoundArena[stateIndex + compoundPendingTail] = 0
    compoundArena[stateIndex + compoundMatchedBase] = 0
    compoundArena[stateIndex + compoundScanned] = 0
  }
}

function feedCompoundSegment(
  state: DirectState,
  source: string,
  start: number,
  end: number,
  isBase: boolean,
  valid: boolean,
  conditionId: number
) {
  if (state.flatCompoundOutputDepth) return
  const pass = state.flatPass!
  const indexes = pass[passCompoundIndexes] as number[] | undefined
  const stateStart = pass[passCompoundStateStart] as number | undefined
  const epoch = pass[passCompoundEpoch] as number | undefined
  const key = pass[passCompoundKey] as string | undefined
  if (!indexes || stateStart === undefined || epoch === undefined || !key) return
  const compoundVariants = state.staticConfig.compoundVariants!
  for (let index = 0; index < indexes.length; index++) {
    const compoundIndex = indexes[index]
    const stateIndex = stateStart + compoundIndex * compoundStateWidth
    compoundArena[stateIndex + compoundScanned] = 1
    if (
      !valid ||
      start === end ||
      !compoundMatcherMatchesPayload(
        compoundVariants[compoundIndex][key],
        source,
        start,
        end
      )
    ) {
      continue
    }
    if (isBase) {
      compoundArena[stateIndex + compoundMatchedBase] = 1
    } else if (!compoundArena[stateIndex + compoundMatchedBase]) {
      appendCompoundNode(
        stateIndex + compoundPendingHead,
        stateIndex + compoundPendingTail,
        conditionId
      )
    }
  }
}

const compoundOnlyHandler: FlatValueHandler<DirectState> = {
  segment(state, start, end, isBase, valid, source, chainStart, chainEnd, chainValid) {
    if (isBase) {
      feedCompoundSegment(state, source, start, end, true, valid, 0)
      return
    }
    const cursor = state.flatScanCursor
    if (
      !chainValid ||
      !cursor ||
      !(conditionNumbers[cursor + conditionFlagsOffset] & conditionResolvedFlag) ||
      !conditionNumbers[cursor + conditionValueOffset]
    ) {
      feedCompoundSegment(state, source, start, end, false, false, 0)
      return
    }
    feedCompoundSegment(
      state,
      source,
      start,
      end,
      false,
      valid,
      snapshotCondition(cursor)
    )
  },
  modifier(state, start, end, valid, first, source) {
    let cursor = state.flatScanCursor
    if (!cursor) {
      cursor = state.flatScanCursor = acquireConditionCursor()
    } else if (first) {
      resetConditionCursor(cursor, 0)
    }
    if (!valid) {
      setConditionUnresolved(cursor)
      return
    }
    if (conditionNumbers[cursor + conditionFlagsOffset] & conditionResolvedFlag) {
      resolveConditionModifier(state, cursor, source.slice(start, end))
    }
  },
  chain(state, _start, _end, valid) {
    const cursor = state.flatScanCursor
    if (cursor) {
      if (!valid) setConditionUnresolved(cursor)
      if (conditionNumbers[cursor + conditionFlagsOffset] & conditionResolvedFlag) {
        commitConditionCursor(state, cursor)
      }
    }
    return true
  },
}

function appendUniqueCombination(head: number, tail: number, conditionId: number) {
  for (let node = head; node; node = compoundArena[node + 1]) {
    if (compoundArena[node] === conditionId) return tail
  }
  const node = reserveCompoundArena(2)
  compoundArena[node] = conditionId
  compoundArena[node + 1] = 0
  if (tail) compoundArena[tail + 1] = node
  return node
}

function finishCompoundEdges(
  pass: StylePass,
  key: string,
  value: any,
  indexes: number[] | undefined,
  stateStart: number,
  epoch: number
) {
  if (!indexes) return
  const state = pass[passStyleState] as DirectState
  pass[passCompoundIndexes] = indexes
  pass[passCompoundKey] = key
  pass[passCompoundStateStart] = stateStart
  pass[passCompoundEpoch] = epoch
  let needsScan = false
  for (let index = 0; index < indexes.length; index++) {
    const stateIndex = stateStart + indexes[index] * compoundStateWidth
    if (!compoundArena[stateIndex + compoundScanned]) {
      needsScan = true
      break
    }
  }
  if (needsScan) {
    if (typeof value === 'string') {
      const watermark = conditionCursorTop
      const previousCursor = state.flatScanCursor
      state.flatScanCursor = null
      try {
        scanFlatValue(value, compoundOnlyHandler, state)
      } finally {
        state.flatScanCursor = previousCursor
        releaseConditionCursors(watermark)
      }
    } else if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      !isVariable(value) &&
      Object.prototype.hasOwnProperty.call(value, 'default')
    ) {
      for (const conditionKey in value) {
        const payload = value[conditionKey]
        if (conditionKey === 'default') {
          const payloadString = String(payload)
          feedCompoundSegment(
            state,
            payloadString,
            0,
            payloadString.length,
            true,
            true,
            0
          )
        } else {
          const watermark = conditionCursorTop
          const cursor = acquireConditionCursor()
          resolveConditionText(state, cursor, conditionKey)
          const condition = commitConditionCursor(state, cursor)
          const payloadString = String(payload)
          feedCompoundSegment(
            state,
            payloadString,
            0,
            payloadString.length,
            false,
            Boolean(condition),
            condition ? snapshotCondition(cursor) : 0
          )
          releaseConditionCursors(watermark)
        }
      }
    } else {
      const variants = state.staticConfig.compoundVariants!
      for (let index = 0; index < indexes.length; index++) {
        const compoundIndex = indexes[index]
        const stateIndex = stateStart + compoundIndex * compoundStateWidth
        compoundArena[stateIndex + compoundScanned] = 1
        if (compoundMatcherMatches(variants[compoundIndex][key], value)) {
          compoundArena[stateIndex + compoundMatchedBase] = 1
        }
      }
    }
  }

  const variants = state.staticConfig.compoundVariants!
  const selectorCounts = (state.staticConfig as StaticConfigWithPreparedCompounds)[
    preparedCompoundsKey
  ]![preparedCompoundsKey]
  for (let index = 0; index < indexes.length; index++) {
    const compoundIndex = indexes[index]
    const stateIndex = stateStart + compoundIndex * compoundStateWidth
    if (compoundArena[stateIndex + compoundFailed]) continue
    let branches = compoundArena[stateIndex + compoundPendingHead]
    if (compoundArena[stateIndex + compoundMatchedBase]) {
      branches = reserveCompoundArena(2)
      compoundArena[branches] = 0
      compoundArena[branches + 1] = 0
    }
    if (!branches) {
      compoundArena[stateIndex + compoundFailed] = 1
      continue
    }

    const seen = compoundArena[stateIndex + compoundSeen]
    if (!seen) {
      compoundArena[stateIndex + compoundCombinations] = branches
    } else {
      const previous = compoundArena[stateIndex + compoundCombinations]
      let nextHead = 0
      let nextTail = 0
      for (let left = previous; left; left = compoundArena[left + 1]) {
        for (let right = branches; right; right = compoundArena[right + 1]) {
          const conditionId = combineConditionSnapshots(
            state,
            compoundArena[left],
            compoundArena[right]
          )
          const appended = appendUniqueCombination(nextHead, nextTail, conditionId)
          if (!nextHead) nextHead = appended
          nextTail = appended
        }
      }
      compoundArena[stateIndex + compoundCombinations] = nextHead
    }
    compoundArena[stateIndex + compoundSeen] = seen + 1
    if (seen + 1 !== selectorCounts[compoundIndex]) continue
    const style = variants[compoundIndex].style
    if (!isPlainObject(style)) continue
    for (
      let combination = compoundArena[stateIndex + compoundCombinations];
      combination;
      combination = compoundArena[combination + 1]
    ) {
      for (const styleKey in style) {
        contributeProp(
          pass,
          styleKey,
          style[styleKey],
          undefined,
          stateStart,
          epoch,
          compoundArena[combination]
        )
      }
    }
  }
}

// the runtime discrimination rule, phrased over an isChain callback: a
// conditional object names a `default` or opens with a resolvable chain
// probe: does this object's first key open a resolvable modifier chain (or
// does it name a `default`)? Walks nothing twice — the probe resolves through
// a scratch cursor and the caller's own enumeration does the contribution.
function classifyConditionalObject(
  value: Record<string, any>,
  state: GetStyleState | null,
  isChain?: (chain: string) => boolean,
  firstCursor?: ConditionCursor
): number {
  if (Object.prototype.hasOwnProperty.call(value, 'default')) return -1
  for (const key in value) {
    if (!key.length) return 0
    if (!state) return isChain?.(key) ? 1 : 0
    const watermark = conditionCursorTop
    const cursor = firstCursor || acquireConditionCursor()
    try {
      resolveConditionText(state, cursor, key)
      return commitConditionCursor(state, cursor)
    } finally {
      if (!firstCursor) releaseConditionCursors(watermark)
    }
  }
  return 0
}

type OrderedPropEntry = readonly [string, any]

type StylePass = any[]

const passStyleState = 0
const passClassName = 21
const passShouldDoClasses = 22
const passContainerValue = 23
const passContainerName = 24
const passContainerType = 25
const passFrontendGroup = 26
const passFrontendContainer = 27
const passFrontendContainerType = 28
const passHocMappedProperties = 29
const passHocMappedClasses = 30
const passCompoundIndexes = 31
const passCompoundKey = 32
const passCompoundStateStart = 33
const passCompoundEpoch = 34
const passParentCursor = 35
const passMapSourceKey = 36
const passMapFlags = 37

const passNoSkipFlag = 1
const passDisableShorthandsFlag = 2
const passNoExpandFlag = 4
const passNoMergeFlag = 8
const passHocFlag = 16
const passTextFlag = 32
const passInputFlag = 64
const passAsChildStyleFlag = 128

type PreparedStyledDefaults = unknown[]

// Styled defaults computed once per static config. mergeComponentProps replaces
// defaults at the prop level, but flat programs merge per clause slot: either a
// conditioned default or a conditioned prop therefore needs the displaced
// styled value re-injected at the styled-base position. This is what preserves
// `styled(View, { flexDirection: 'row' })` under `sm:column`.
const styledDefaultsCache = new WeakMap<object, PreparedStyledDefaults | null>()

function getStyledDefaults(
  staticConfig: StaticConfig,
  shorthands: Record<string, string>
): PreparedStyledDefaults | null {
  let prepared = styledDefaultsCache.get(staticConfig)
  if (prepared === undefined) {
    let entries: unknown[] | null = null
    const defaults = staticConfig.defaultProps
    if (defaults) {
      for (const key in defaults) {
        if (!(key in stylePropsAll || key in shorthands)) continue
        const value = defaults[key]
        if (maybeStyleProgram(value)) (entries ||= []).push(key, value)
      }
    }
    prepared = entries
    styledDefaultsCache.set(staticConfig, prepared)
  }
  return prepared
}

// definition-time only: render never rescans a value to ask this
const maybeStyleProgram = (value: any): boolean =>
  typeof value === 'string'
    ? value.indexOf(':') !== -1
    : !!value && typeof value === 'object' && !Array.isArray(value) && !isVariable(value)

function contributeDisplacedStyledDefaults(
  styledDefaults: PreparedStyledDefaults | null,
  processedProps: Record<string, any>,
  pass: StylePass
) {
  if (!styledDefaults) return
  for (let offset = 0; offset < styledDefaults.length; offset += 2) {
    const key = styledDefaults[offset] as string
    const value = styledDefaults[offset + 1]
    const propValue = processedProps[key]
    // equal means the default flowed through the merge untouched and will be
    // processed as an ordinary prop entry; different means a call-site value
    // displaced it, and a displaced PROGRAM default re-injects at the styled
    // position so its clause slots survive the caller's base. A displaced
    // plain default matters only when the displacing prop itself carries
    // clauses, which the prop's own scan discovers — see the weak injection
    // in forEachPropInForwardOrder.
    if (propValue !== undefined && propValue !== value) {
      contributeProp(pass, key, value)
    }
  }
}

function injectDisplacedStyledDefault(pass: StylePass, key: string, value: any) {
  const defaultValue = pass[4].defaultProps?.[key]
  if (
    defaultValue === undefined ||
    value === undefined ||
    value === defaultValue ||
    maybeStyleProgram(defaultValue)
  ) {
    return
  }
  const state = pass[passStyleState] as DirectState
  state.flatWeakContribution = true
  try {
    contributeProp(pass, key, defaultValue)
  } finally {
    state.flatWeakContribution = false
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
function forEachPropInForwardOrder(pass: StylePass) {
  const styleState = pass[passStyleState] as GetStyleState
  const staticConfig = styleState.staticConfig
  const processedProps = styleState.props
  const shorthands = styleState.conf.shorthands
  const processedBaseStyle = staticConfig.baseStyle
  const styledDefaults = getStyledDefaults(staticConfig, shorthands)
  const directState = styleState as DirectState
  const preparedCompounds = (staticConfig as StaticConfigWithPreparedCompounds)[
    preparedCompoundsKey
  ]

  if (preparedCompounds === undefined && staticConfig.compoundVariants?.length) {
    throw new Error(
      'A component with compoundVariants reached style resolution before its static config was prepared.'
    )
  }

  const conditionAtomBase = conditionAtomTop
  const conditionWrapperBase = conditionWrapperTop
  if (!preparedCompounds) {
    try {
      if (processedBaseStyle) {
        for (const key in processedBaseStyle) {
          contributeProp(pass, key, processedBaseStyle[key])
        }
      }
      contributeDisplacedStyledDefaults(styledDefaults, processedProps, pass)
      for (const key in processedProps) {
        const value = processedProps[key]
        directState.flatPropSawCondition = false
        contributeProp(pass, key, value)
        if (directState.flatPropSawCondition) {
          injectDisplacedStyledDefault(pass, key, value)
        }
      }
    } finally {
      releaseConditionPayloads(conditionAtomBase, conditionWrapperBase)
    }
    return
  }

  const arenaBase = compoundArenaTop
  const compoundVariants = staticConfig.compoundVariants!
  const stateStart = reserveCompoundArena(compoundVariants.length * compoundStateWidth)
  const epoch = ++compoundArenaEpoch
  try {
    if (processedBaseStyle) {
      for (const key in processedBaseStyle) {
        contributeProp(pass, key, processedBaseStyle[key])
      }
    }
    contributeDisplacedStyledDefaults(styledDefaults, processedProps, pass)
    const selectorCounts = preparedCompounds[preparedCompoundsKey]
    for (
      let compoundIndex = 0;
      compoundIndex < compoundVariants.length;
      compoundIndex++
    ) {
      if (selectorCounts[compoundIndex]) continue
      const style = compoundVariants[compoundIndex].style
      if (!isPlainObject(style)) continue
      for (const key in style) contributeProp(pass, key, style[key])
    }
    for (const key in processedProps) {
      const compoundIndexes = preparedCompounds[key]
      const value = processedProps[key]
      beginCompoundEdges(compoundIndexes, stateStart, epoch)
      directState.flatPropSawCondition = false
      contributeProp(pass, key, value, compoundIndexes, stateStart, epoch)
      if (directState.flatPropSawCondition) {
        injectDisplacedStyledDefault(pass, key, value)
      }
      finishCompoundEdges(pass, key, value, compoundIndexes, stateStart, epoch)
    }
  } finally {
    conditionSnapshotTexts.fill('', arenaBase, compoundArenaTop)
    releaseConditionPayloads(conditionAtomBase, conditionWrapperBase)
    compoundArenaTop = arenaBase
  }
}

// exported so the compiler applies the SAME host-validity decision when it
// flattens: a style-shaped key that fails this check must be dropped with a
// diagnostic, never kept as a DOM attribute (one predicate, two hosts)
export function isValidStyleKey(
  key: string,
  validStyles: Record<string, boolean>,
  accept?: Record<string, any>
) {
  return Boolean(key in validStyles || (accept && key in accept))
}

function flushForwardStylesToClasses(pass: StylePass) {
  const styleState = pass[passStyleState] as GetStyleState
  if (!pass[passShouldDoClasses]) return
  completeFrameCSS(styleState)
  flushDirectStyles(styleState, true)
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

function mapContributedProp(
  styleState: GetStyleState,
  key: string,
  val: any,
  originalVal: any,
  condition: number | undefined
) {
  const pass = (styleState as DirectState).flatPass!
  const keyInit = pass[passMapSourceKey] as string
  const disablePropMap = Boolean(pass[passMapFlags])
  const [
    ,
    conf,
    props,
    viewProps,
    ,
    validStyles,
    accept,
    ,
    variants,
    inlineProps,
    parentVariants,
    ,
    styledContext,
    styledContextKeys,
    flags,
    debug,
  ] = pass
  const isHOC = Boolean(flags & passHocFlag)
  const hocParentVariants = isHOC ? parentVariants : undefined
  const canResolveContextPrograms = !isHOC
  const isStyledContextProp =
    styledContextKeys?.has(key) || (styledContext && key in styledContext)

  if (key === 'className') {
    if (process.env.TAMAGUI_TARGET === 'web' && typeof val === 'string' && val) {
      pass[passClassName] = `${pass[passClassName]} ${val}`.trim()
    }
    return
  }

  if (canResolveContextPrograms && disablePropMap && !isStyledContextProp) {
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
    isValidStyleKey(key, validStyles, accept) ||
    (process.env.TAMAGUI_TARGET === 'native' && isAndroid && key === 'elevation')
  const isContextProgramKey = canResolveContextPrograms && Boolean(isStyledContextProp)

  if (condition !== undefined) {
    const conditionCursor = condition as ConditionCursor
    if (isHostStyleKey || isContextProgramKey) {
      contributeValue(
        styleState,
        key,
        val,
        mergeStyle,
        originalVal,
        !isHostStyleKey,
        conditionCursor
      )
    } else if (isHOC) {
      // hand the wrapped component a structured clause keyed by the
      // canonical condition; its own pass resolves it in place. No flat
      // string is ever reconstructed for re-parsing. Delete first: the
      // clause lands at the outer contribution's position, so a prop the
      // wrapped component authored earlier can no longer outrank it.
      const structured = mergeConditionTransport(
        styleState,
        viewProps[key],
        conditionCursor,
        val
      )
      if (key in viewProps) delete viewProps[key]
      viewProps[key] = structured
    } else if (process.env.NODE_ENV === 'development') {
      console.warn(
        `[tamagui] "${key}" is not a valid style on this component; the conditional variant value is dropped.`
      )
    }
    return
  }

  if (isHostStyleKey || isContextProgramKey) {
    contributeValue(styleState, key, val, mergeStyle, originalVal, !isHostStyleKey)
    return
  }

  const isVariant = Boolean(variants && key in variants)

  if (inlineProps?.has(key)) {
    viewProps[key] = props[key] ?? val
  }

  const shouldPassThrough = Boolean(hocParentVariants && hocParentVariants[keyInit])

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

function contributeProp(
  pass: StylePass,
  keyOg: string,
  valOg: any,
  compoundIndexes?: number[],
  compoundStateStart?: number,
  compoundEpoch?: number,
  parentConditionId?: number
) {
  const parentWatermark = conditionCursorTop
  if (compoundIndexes) {
    pass[passCompoundIndexes] = compoundIndexes
    pass[passCompoundKey] = keyOg
    pass[passCompoundStateStart] = compoundStateStart
    pass[passCompoundEpoch] = compoundEpoch
  } else if (pass[passCompoundIndexes]) {
    pass[passCompoundIndexes] = undefined
  }
  if (parentConditionId) {
    pass[passParentCursor] = acquireConditionSnapshotCursor(parentConditionId)
  }
  try {
    const [
      styleState,
      conf,
      props,
      viewProps,
      staticConfig,
      validStyles,
      accept,
      neverSkipProps,
      variants,
      inlineProps,
      parentVariants,
      styleFrontend,
      styledContext,
      styledContextKeys,
      flags,
      debug,
      parentStaticConfig,
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
    const canResolveContextPrograms = !isHOC
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

    // for custom accept sub-styles
    if (accept) {
      const accepted = accept[keyInit]
      if (
        (accepted === 'style' || accepted === 'textStyle') &&
        valInit &&
        typeof valInit === 'object'
      ) {
        viewProps[keyInit] = resolveAcceptedStyle(styleState, valInit)
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
      if (
        typeof valInit === 'string' &&
        valInit &&
        (process.env.TAMAGUI_TARGET === 'web' || styleFrontend?.getClassPlan)
      ) {
        if (noMergeStyle) {
          viewProps.className = valInit
          return
        }
        // core className is raw interop: the string passes through untouched.
        // HOC and frontend class transport marks an earlier generated layer,
        // so keep later Tamagui contributions inline to retain their position
        const hocClassNames = props[HOC_CLASSNAME_MARKER]
        if (hocClassNames && typeof hocClassNames === 'object') {
          // the HOC marker carries the emitting layer's property→class map:
          // slot each class at this authored position so per-property
          // competition applies, and keep those classes out of the raw walk
          flushForwardStylesToClasses(pass)
          for (const property in hocClassNames) {
            const generatedClass = hocClassNames[property]
            if (typeof generatedClass !== 'string') continue
            clearDirectStyle(styleState, property)
            styleState.classNames[property] = generatedClass
            ;(pass[passHocMappedProperties] ||= new Set()).add(property)
            ;(pass[passHocMappedClasses] ||= new Set()).add(generatedClass)
          }
        }
        const getClassPlan = styleFrontend?.getClassPlan
        let start = 0
        for (let index = 0; index <= valInit.length; index++) {
          if (index !== valInit.length && valInit.charCodeAt(index) > 32) continue
          if (index === start) {
            start = index + 1
            continue
          }
          const candidate = valInit.slice(start, index)
          if (pass[passHocMappedClasses]?.has(candidate)) {
            start = index + 1
            continue
          }
          const plan = getClassPlan ? getClassPlan(candidate, conf) : 'raw'
          if (plan === null) {
            if (process.env.NODE_ENV === 'development') {
              warnOnce(
                `[tamagui] frontend candidate "${candidate}" is unavailable on this platform and was dropped.`
              )
            }
          } else if (plan === 'raw') {
            pass[passClassName] = pass[passClassName]
              ? `${pass[passClassName]} ${candidate}`
              : candidate
            if (getClassPlan) {
              flushForwardStylesToClasses(pass)
              pass[passShouldDoClasses] = false
              styleState.flatShouldDoClasses = false
            }
          } else {
            const parentPlan = plan as {
              entries: readonly (readonly [string, unknown, string?])[]
              preserveRawClass: boolean
            }
            if (!Array.isArray(plan) && parentPlan.preserveRawClass) {
              pass[passClassName] = pass[passClassName]
                ? `${pass[passClassName]} ${candidate}`
                : candidate
              flushForwardStylesToClasses(pass)
              pass[passShouldDoClasses] = false
              styleState.flatShouldDoClasses = false
            }
            const entries = Array.isArray(plan) ? plan : parentPlan.entries
            for (let entryIndex = 0; entryIndex < entries.length; entryIndex++) {
              const entry = entries[entryIndex]
              if (entry[2] !== undefined) {
                if (isValidStyleKey(entry[0], validStyles, accept)) {
                  contributeValue(
                    styleState,
                    entry[0],
                    entry[1],
                    mergeStyle,
                    undefined,
                    false,
                    entry[2]
                  )
                } else if (process.env.NODE_ENV === 'development') {
                  console.warn(
                    `[tamagui] "${entry[0]}" is not a valid style on this component; the frontend value is dropped.`
                  )
                }
              } else {
                if (entry[0] === 'group') {
                  pass[passFrontendGroup] = entry[1] as boolean | string
                } else if (entry[0] === 'container') {
                  pass[passFrontendContainer] = entry[1] as boolean | string
                } else if (entry[0] === 'containerType') {
                  pass[passFrontendContainerType] = entry[1] as string
                }
                contributeProp(pass, entry[0], entry[1])
              }
            }
          }
          start = index + 1
        }
        if (props[HOC_CLASSNAME_MARKER] !== undefined) {
          flushForwardStylesToClasses(pass)
          pass[passShouldDoClasses] = false
          styleState.flatShouldDoClasses = false
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
      const isArray = Array.isArray(valInit)
      const length = isArray ? valInit.length : 1
      for (let index = 0; index < length; index++) {
        const style = isArray ? valInit[index] : valInit
        if (!style) continue
        const hocClassNames = style[TAMAGUI_CLASS_PROPS] as
          | Record<string, string>
          | undefined
        if (hocClassNames) {
          for (const property in hocClassNames) {
            clearDirectStyle(styleState, property)
            styleState.classNames[property] = hocClassNames[property]
            ;(pass[passHocMappedProperties] ||= new Set()).add(property)
          }
          continue
        }
        const normalized = normalizeStyle(style, false, true)
        const styleOriginals = shouldTrackStyleTokenProvenance
          ? styleOriginalValues.get(style)
          : undefined
        for (const key in normalized) {
          if (normalized[key] == null) continue
          if (pass[passHocMappedProperties]?.delete(key)) {
            clearDirectStyle(styleState, key)
          }
          if (process.env.TAMAGUI_TARGET === 'web') {
            if (
              key === 'containerName' &&
              typeof normalized[key] === 'string' &&
              normalized[key].indexOf(':') === -1
            ) {
              pass[passContainerName] = normalized[key]
            }
            if (
              key === 'containerType' &&
              typeof normalized[key] === 'string' &&
              normalized[key].indexOf(':') === -1
            ) {
              pass[passContainerType] = normalized[key]
            }
          }
          contributeValue(
            styleState,
            key,
            normalized[key],
            mergeStyle,
            styleOriginals?.[key]
          )
        }
      }
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

    // keyInit === 'style' is handled in skipProps
    if (keyInit in skipProps && shouldSkipDirectProps && !neverSkipProps?.[keyInit]) {
      if (process.env.TAMAGUI_TARGET === 'web' && keyInit === 'container') {
        pass[passContainerValue] = valInit
      }
      if (keyInit === 'transition' && typeof valInit === 'string') {
        if (process.env.TAMAGUI_TARGET === 'native') return
        const animationConfig = driverAnimations?.[valInit]
        if (
          animationConfig &&
          driverOutputStyle === 'css' &&
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

    let isValidStyleKeyInit = isValidStyleKey(keyInit, validStyles, accept)

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
    const isHOCShouldPassThrough = Boolean(
      isHOC && (parentVariant || keyInit in skipProps)
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
    if (shouldCheckSkipProps && !neverSkipProps?.[keyInit]) {
      if (
        keyInit in skipProps &&
        !(
          keyInit === 'transition' &&
          typeof valInit === 'string' &&
          !driverAnimations?.[valInit]
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

    const disablePropMap = !isStyleLikeKey

    // ordinary host styles scan and emit directly without propMapper
    if (
      isValidStyleKeyInit &&
      valInit != null &&
      !(process.env.TAMAGUI_TARGET === 'native' && valInit === 'unset') &&
      !(variants && keyInit in variants) &&
      !(accept && keyInit in accept) &&
      !(styledContextKeys?.has(keyInit) || (styledContext && keyInit in styledContext))
    ) {
      contributeValue(styleState, keyInit, valInit, mergeStyle)
      return
    }

    pass[passMapSourceKey] = keyInit
    pass[passMapFlags] = disablePropMap ? 1 : 0
    contributeMappedValue(keyInit, valInit, styleState, disablePropMap)

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
  } finally {
    if (parentConditionId) pass[passParentCursor] = null
    releaseConditionCursors(parentWatermark)
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
    (conf.animations as AnimationDriverLike)
  const driverAnimations = driver?.animations
  const driverInputStyle = driver?.inputStyle
  const driverOutputStyle = driver?.outputStyle
  const resolvedDriver = driver?.isStub ? null : (driver as AnimationDriver | null)

  if (props.passThrough) {
    return null
  }

  const { shorthands } = conf
  const {
    isHOC,
    isText,
    isInput,
    variants,
    inlineProps,
    parentStaticConfig,
    acceptsClassName,
  } = staticConfig

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
  const staticPassthroughClassName =
    process.env.TAMAGUI_TARGET === 'web' ? staticConfig.passthroughClassName || '' : ''
  let className = staticPassthroughClassName
  if (staticPassthroughClassName) {
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
    animationDriver: resolvedDriver,
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
  const { accept, neverSkipProps } = staticConfig
  const {
    noSkip,
    disableExpandShorthands,
    noExpand,
    noClass,
    noMergeStyle,
    noNormalize,
    isAnimated,
    styledContext,
    styledContextKeys,
  } = styleProps

  const styleFrontend = staticConfig.styleFrontend
  let frontendGroup: boolean | string | undefined
  let frontendContainer: boolean | string | undefined
  let frontendContainerType: string | undefined
  const processedProps = props
  const parentVariants = parentStaticConfig?.variants
  const defaultProps = asChild ? getDefaultProps(staticConfig) : undefined
  const asChildExceptStyleLike =
    asChild === 'except-style' || asChild === 'except-style-web'
  let containerValue: boolean | string | undefined
  let containerName: string | undefined
  let containerType: string | undefined
  if (process.env.TAMAGUI_TARGET === 'web') {
    const authoredContainerName = processedProps.containerName
    const authoredContainerType = processedProps.containerType
    containerName =
      typeof authoredContainerName === 'string' &&
      authoredContainerName.indexOf(':') === -1
        ? authoredContainerName
        : undefined
    containerType =
      typeof authoredContainerType === 'string' &&
      authoredContainerType.indexOf(':') === -1
        ? authoredContainerType
        : undefined
  }

  // properties whose class landed through the HOC class transport at an
  // authored style position: a later plain value for the same property
  // displaces the transported class, exactly like ordinary contributions
  let hocMappedClassProperties: Set<string> | undefined
  // generated classes already slotted per property from an HOC className, so
  // the raw className walk does not merge them a second time by name
  let hocMappedClasses: Set<string> | undefined

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
    accept,
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
    hocMappedClassProperties,
    hocMappedClasses,
  ]
  ;(styleState as DirectState).flatPass = pass

  forEachPropInForwardOrder(pass)

  ;[
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    className,
    shouldDoClasses,
    containerValue,
    containerName,
    containerType,
    frontendGroup,
    frontendContainer,
    frontendContainerType,
    hocMappedClassProperties,
    hocMappedClasses,
  ] = pass

  if (process.env.TAMAGUI_TARGET === 'web' && containerValue) {
    containerName ??= typeof containerValue === 'string' ? containerValue : undefined
    containerType ??= 'inline-size'
    contributeValue(
      styleState,
      containerName ? 'container' : 'containerType',
      containerName ? `${containerName} / ${containerType}` : containerType,
      mergeStyle
    )
  }

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
        1,
        true
      )
      styleState.transformAccumulator = undefined
    }
  }

  // the one output completion: CSS-destined slots serialize once, the rest
  // resolve to inline winners
  completeStyleFrame(styleState, mergeStyle)

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
    if (styleState.style) {
      fixStyles(styleState.style)

      if (!noExpand && !noMergeStyle) {
        // shouldn't this be better? but breaks some tests weirdly, need to check
        if (process.env.TAMAGUI_TARGET === 'web') {
          styleToCSS(styleState.style)
        }
      }
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
            finalClassName += ` ${classNames[key]}`
          }
        }
        if (groupClassName) finalClassName += ` ${groupClassName}`
        if (className) finalClassName += ` ${className}`

        if (isAnimated && driverInputStyle === 'css') {
          // CSS animation driver uses className directly
          viewProps.className = finalClassName
          if (style) {
            viewProps.style = style as any
          }
        } else {
          // regular web: use className directly. an HOC also hands its
          // property→class map to the wrapped tamagui component: on the
          // marker for the className path, and on a non-enumerable style
          // entry so the map holds the authored style position
          if (finalClassName) {
            if (isHOC) viewProps[HOC_CLASSNAME_MARKER] = classNames
            viewProps.className = finalClassName
          }
          if (isHOC && hasPropertyClassNames) {
            const classStyle = {}
            Object.defineProperty(classStyle, TAMAGUI_CLASS_PROPS, {
              value: classNames,
              enumerable: false,
            })
            viewProps.style = style ? [classStyle, style] : classStyle
          } else if (style) {
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

function mergeStyle(
  styleState: GetStyleState,
  key: string,
  val: any,
  _importance: number,
  disableNormalize = false,
  originalVal?: any
) {
  const { viewProps, styleProps, staticConfig } = styleState

  // track context overrides for pseudo/media styles (issues #3670, #3676):
  // when a style sets a key the styled context declares, propagate it via
  // overriddenContextProps using the original token value (like '8') rather
  // than the resolved CSS variable, so children's functional variants can look
  // up token values. membership is a per-staticConfig cached Set.
  const contextPropSet = getContextPropSet(staticConfig)
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

const resolveAcceptedStyle = (
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
  ;(childState as DirectState).flatFrame = undefined
  ;(childState as DirectState).flatAtomics = undefined
  const mergeAccepted: MergeStyle = (
    _state,
    key,
    value,
    _importance,
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
    contributeValue(childState, key, value, mergeAccepted)
  }
  completeStyleFrame(childState, mergeAccepted)
  if (childState.transformAccumulator) {
    styleOut.transform = finalizeTransformAccumulator(childState.transformAccumulator)
  }
  if (!styleProps.noNormalize) fixStyles(styleOut)
  if (originalValues) {
    styleOriginalValues.set(styleOut, originalValues)
  }
  return styleOut
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

function passDownProp(viewProps: object, key: string, val: any) {
  // a later contribution must displace IN AUTHORED POSITION: the wrapped
  // component enumerates viewProps in insertion order, and reassigning an
  // existing key would leave the new value at the old position
  if (key in viewProps) delete viewProps[key]
  viewProps[key] = val
}

export type MergeStyle = (
  state: GetStyleState,
  key: string,
  value: any,
  importance: number,
  disableNormalize?: boolean,
  originalValue?: any
) => void

type DirectState = GetStyleState & {
  flatPass?: StylePass
  flatFrame?: Record<string, StyleFrameEntry[]>
  flatAtomics?: Record<string, unknown>
  flatBoxShadow?: any
  flatBoxShadowSequence?: number
  flatDynamicColors?: Record<string, Record<string, any>>
  flatDynamicThemeAccess?: boolean
  flatTextShadow?: Record<string, any>
  flatWebShadow?: any[]
  flatScanCursor?: ConditionCursor | null
  flatCompoundOutputDepth?: number
  flatPropSawCondition?: boolean
  flatWeakContribution?: boolean
}

// an active conditional clause can retract a property entirely (an invalid
// native transform value drops the part); the tombstone wins its slot and the
// inline completion emits nothing for it
const FRAME_TOMBSTONE: unique symbol = Symbol('tamaguiFrameTombstone')

let frameSequence = 0

/**
 * Land one contribution in the neutral output frame. A slot holds one entry
 * per exact condition identity: a repeat write replaces the value in place
 * (CSS keeps the slot's rule position) and bumps the sequence (inline ties
 * resolve to the last write).
 */
function frameWrite(
  state: GetStyleState,
  property: string,
  value: any,
  cursor: ConditionCursor | null,
  original: any,
  forceCSS: boolean,
  normalize = false,
  conditionOverride = -1
) {
  const direct = state as DirectState
  const weak = direct.flatWeakContribution === true
  const frame = (direct.flatFrame ||= {})
  const condition =
    conditionOverride !== -1
      ? conditionOverride
      : cursor
        ? conditionNumbers[cursor + conditionValueOffset]
        : 0
  const identity = cursor ? conditionTexts[cursor + conditionKeyOffset] || '' : ''
  let slot = frame[property]
  if (!slot) {
    slot = frame[property] = []
  }
  for (let index = 0; index < slot.length; index++) {
    const entry = slot[index]
    if (entry.identity === identity) {
      // a weak write never displaces: it restores a styled default under a
      // prop that already owns this identity
      if (weak) return
      entry.value = value
      entry.condition = condition
      entry.original = original
      entry.forceCSS = forceCSS
      entry.sequence = ++frameSequence
      entry.normalize = normalize
      return
    }
  }
  slot.push({
    property,
    value,
    condition,
    identity,
    selector: cursor ? conditionTexts[cursor + conditionSelectorOffset] || '' : '',
    wrappers: cursor ? conditionWrapperCopy(cursor) : undefined,
    original,
    forceCSS,
    sequence: weak ? 0 : ++frameSequence,
    normalize,
  })
}

// the inline path never needs selector or wrapper text; identity and
// precedence are enough to pick a winner
function frameWriteInline(
  state: GetStyleState,
  property: string,
  value: any,
  cursor: ConditionCursor | null,
  original: any,
  normalize = false
) {
  const direct = state as DirectState
  const weak = direct.flatWeakContribution === true
  const frame = (direct.flatFrame ||= {})
  const condition = cursor ? conditionNumbers[cursor + conditionValueOffset] : 0
  const identity = cursor ? conditionTexts[cursor + conditionKeyOffset] || '' : ''
  let slot = frame[property]
  if (!slot) {
    slot = frame[property] = []
  }
  for (let index = 0; index < slot.length; index++) {
    const entry = slot[index]
    if (entry.identity === identity) {
      if (weak) return
      entry.value = value
      entry.condition = condition
      entry.original = original
      entry.sequence = ++frameSequence
      entry.normalize = normalize
      return
    }
  }
  slot.push({
    property,
    value,
    condition,
    identity,
    selector: '',
    wrappers: undefined,
    original,
    forceCSS: false,
    sequence: weak ? 0 : ++frameSequence,
    normalize,
  })
}

/**
 * The one output completion: serialize the frame's CSS-destined slots once
 * (winning content only), then pick each remaining slot's inline winner by
 * condition precedence and last write. Completion walks slots; it never reads
 * an authored prop again.
 */
function completeStyleFrame(state: GetStyleState, merge: MergeStyle) {
  const direct = state as DirectState
  if (
    !direct.flatFrame &&
    !direct.flatWebShadow &&
    !(canGenerateCSS && state.flatShouldDoClasses && state.transformAccumulator)
  ) {
    return
  }
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
        merge,
        shadow[5],
        shadow[6]
      )
      const slot = direct.flatFrame?.boxShadow
      if (slot) slot[slot.length - 1].sequence = shadow[4]
    }
  }
  completeFrameCSS(state)
  const frame = direct.flatFrame
  if (!frame) return
  for (const property in frame) {
    const slot = frame[property]
    let winner: StyleFrameEntry | null = null
    let winnerPrecedence = -2
    for (let index = 0; index < slot.length; index++) {
      const entry = slot[index]
      if (entry.condition && !(entry.condition & 1)) continue
      const precedence = entry.condition ? Math.floor(entry.condition / 256) : -1
      if (
        precedence > winnerPrecedence ||
        (precedence === winnerPrecedence && (!winner || entry.sequence > winner.sequence))
      ) {
        winner = entry
        winnerPrecedence = precedence
      }
    }
    if (!winner || winner.value === FRAME_TOMBSTONE) continue
    merge(state, property, winner.value, 1, !winner.normalize, winner.original)
  }
  direct.flatFrame = undefined
}

function emitAtParentCondition(
  state: GetStyleState,
  property: string,
  value: any,
  merge: MergeStyle,
  originalValue: any,
  contextOnly: boolean
) {
  emitValue(
    state,
    property,
    value,
    ((state as DirectState).flatPass?.[passParentCursor] as ConditionCursor) || null,
    merge,
    originalValue,
    contextOnly
  )
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
  property: string | undefined,
  value: any,
  cursor: ConditionCursor,
  merge: MergeStyle | undefined,
  originalValue: any,
  contextOnly: boolean,
  warnMode: number,
  warnSource: any
): number {
  const condition = conditionNumbers[cursor + conditionValueOffset]
  // a real conditional clause reached emission intent (active or not): the
  // prop loop uses this to restore a displaced plain styled default
  if (merge && property && condition) {
    ;(state as DirectState).flatPropSawCondition = true
  }
  if (!(conditionNumbers[cursor + conditionFlagsOffset] & conditionResolvedFlag)) {
    if (warnMode && process.env.NODE_ENV === 'development') {
      warnRefusedValue(
        property!,
        warnSource,
        `unknown modifier "${conditionTexts[cursor + conditionUnresolvedNameOffset] || ''}"`
      )
    }
    return 0
  }
  const unsupportedState = conditionTexts[cursor + conditionUnsupportedStateOffset] || ''
  if (warnMode && unsupportedState && process.env.NODE_ENV === 'development') {
    warnOnce(
      `${property}: "${unsupportedState}:" has no native component-state source; dropping the clause`
    )
  }
  if (
    merge &&
    property &&
    condition & 2 &&
    (condition & 1 ||
      (canGenerateCSS && state.flatShouldDoClasses) ||
      (warnMode === 1 &&
        process.env.TAMAGUI_TARGET === 'native' &&
        conditionTexts[cursor + conditionThemeOffset] &&
        supportsDynamicColorIOS &&
        isColorStyleKey(property)))
  ) {
    emitValue(
      state,
      property,
      value,
      cursor,
      merge,
      // the variant path (warnMode 2) forwards its tracked original verbatim;
      // the direct paths fall back to the payload itself so consumers like the
      // iOS dynamic-color scheme keep the authored spelling
      warnMode === 2 ? originalValue : (originalValue ?? value),
      contextOnly
    )
    const flags = conditionNumbers[cursor + conditionFlagsOffset]
    if (flags & conditionEnterFlag) state.flatHasEnterStyle = true
    if (flags & conditionPlatformPseudoFlag) state.flatHasPlatformPseudo = true
  } else if (merge && property && condition & 2) {
    // not emitting here, but the clause is real: lifecycle and platform-pseudo
    // discovery must still see it
    const flags = conditionNumbers[cursor + conditionFlagsOffset]
    if (flags & conditionEnterFlag) state.flatHasEnterStyle = true
    if (flags & conditionPlatformPseudoFlag) state.flatHasPlatformPseudo = true
  }
  return condition
}

const directStyleHandler: FlatValueHandler<GetStyleState> = {
  segment(
    state,
    start,
    end,
    isBase,
    valid,
    source,
    chainStart,
    chainEnd,
    chainValid,
    chainCount,
    _result,
    failure,
    failureIndex,
    property,
    merge,
    originalValue,
    contextOnly
  ) {
    if (isBase) {
      if (start === end) return
      feedCompoundSegment(
        state as DirectState,
        source,
        start,
        end,
        true,
        valid || failure === 'invalid-character' || failure === 'stray-comment-close',
        0
      )
      if (!valid) {
        if (failure === 'invalid-character' || failure === 'stray-comment-close') {
          // refusal belongs to the clause grammar. Keep only the decision until
          // the scan knows whether this string contains a chain marker.
          return 16
        }
        if (process.env.NODE_ENV === 'development') {
          warnRefusedValue(
            property,
            source,
            failure === 'unterminated-string'
              ? 'an unterminated string'
              : failure === 'unterminated-comment'
                ? 'an unterminated "/*" comment'
                : 'an unterminated "("'
          )
        }
        return
      }
      const value = source.slice(start, end)
      emitAtParentCondition(state, property, value, merge, value, contextOnly)
      return 5
    }
    if (!chainValid) {
      if (process.env.NODE_ENV === 'development') {
        warnRefusedValue(
          property,
          source,
          failure === 'invalid-character'
            ? `"${source[failureIndex]}" would end the declaration or rule`
            : failure === 'unterminated-string'
              ? 'an unterminated string'
              : failure === 'unterminated-comment'
                ? 'an unterminated "/*" comment'
                : failure === 'stray-comment-close'
                  ? 'a stray "*/"'
                  : 'an unterminated "("'
        )
      }
      return
    }
    if (start === end) {
      if (process.env.NODE_ENV === 'development') {
        warnRefusedValue(property, source, 'a conditional clause has no value')
      }
      return
    }
    if (property === 'aspectRatio' && chainCount === 1) {
      const left = Number(source.slice(chainStart, chainEnd))
      const right = Number(source.slice(start, end))
      if (
        chainStart < chainEnd &&
        Number.isFinite(left) &&
        left > 0 &&
        Number.isFinite(right) &&
        right > 0
      ) {
        return 12
      }
    }
    const directState = state as DirectState
    const cursor = directState.flatScanCursor!
    const condition = valid
      ? emitUnderCondition(
          state,
          property,
          source.slice(start, end),
          cursor,
          merge,
          undefined,
          contextOnly,
          1,
          source
        )
      : conditionNumbers[cursor + conditionFlagsOffset] & conditionResolvedFlag
        ? conditionNumbers[cursor + conditionValueOffset]
        : 0
    feedCompoundSegment(
      directState,
      source,
      start,
      end,
      false,
      valid && Boolean(condition),
      condition && directState.flatPass?.[passCompoundIndexes]
        ? snapshotCondition(cursor)
        : 0
    )
    if (!condition) return
    if (!valid) {
      if (process.env.NODE_ENV === 'development') {
        warnRefusedValue(
          property,
          source,
          failure === 'invalid-character'
            ? `"${source[failureIndex]}" would end the declaration or rule`
            : failure === 'unterminated-string'
              ? 'an unterminated string'
              : failure === 'unterminated-comment'
                ? 'an unterminated "/*" comment'
                : failure === 'stray-comment-close'
                  ? 'a stray "*/"'
                  : 'an unterminated "("'
        )
      }
      return
    }
    return 4 | (condition & 12 ? 2 : 0)
  },
  modifier(state, start, end, valid, first, source) {
    const directState = state as DirectState
    let cursor = directState.flatScanCursor
    if (!cursor) {
      cursor = directState.flatScanCursor = acquireConditionCursor(
        (directState.flatPass?.[passParentCursor] as ConditionCursor) || null
      )
    } else if (first) {
      resetConditionCursor(
        cursor,
        (directState.flatPass?.[passParentCursor] as ConditionCursor) || null
      )
    }
    if (!valid) {
      setConditionUnresolved(cursor)
      return
    }
    if (conditionNumbers[cursor + conditionFlagsOffset] & conditionResolvedFlag) {
      resolveConditionModifier(state, cursor, source.slice(start, end))
    }
  },
  chain(state, _start, _end, valid) {
    const cursor = (state as DirectState).flatScanCursor
    if (cursor) {
      if (!valid) setConditionUnresolved(cursor)
      if (conditionNumbers[cursor + conditionFlagsOffset] & conditionResolvedFlag) {
        commitConditionCursor(state, cursor)
      }
    }
    return true
  },
  end(
    state,
    source,
    result,
    lastPayloadStart,
    chainCount,
    property,
    merge,
    originalValue,
    contextOnly,
    failure,
    failureIndex
  ) {
    let hasBase = !!(result & 1)
    if (result & 16) {
      if (chainCount === 0) {
        emitAtParentCondition(
          state,
          property,
          source,
          merge,
          originalValue ?? source,
          contextOnly
        )
        hasBase = true
      } else if (process.env.NODE_ENV === 'development') {
        warnRefusedValue(
          property,
          source,
          failure === 'invalid-character'
            ? `"${source[failureIndex]}" would end the declaration or rule`
            : failure === 'unterminated-string'
              ? 'an unterminated string'
              : failure === 'unterminated-comment'
                ? 'an unterminated "/*" comment'
                : failure === 'stray-comment-close'
                  ? 'a stray "*/"'
                  : 'an unterminated "("'
        )
      }
    }
    if (result & 8 && chainCount === 1) {
      emitAtParentCondition(
        state,
        property,
        source,
        merge,
        originalValue ?? source,
        contextOnly
      )
      hasBase = true
    }
    if (
      process.env.NODE_ENV === 'development' &&
      !hasBase &&
      result & 4 &&
      (property in tokenCategories.color || property in tokenCategoryByProperty) &&
      splitComponents(source.slice(lastPayloadStart)).length > 1
    ) {
      warnOnce(
        `${property}="${source}" has multiple values after its first conditional. Write the base value before the first conditional.`
      )
    }
    if ((!canGenerateCSS || !state.flatShouldDoClasses) && result & 2 && !hasBase) {
      const value = implicitLifecycleBase(property)
      if (value !== null) {
        emitAtParentCondition(state, property, value, merge, value, contextOnly)
      }
    }
  },
}

// enter/exit clauses with no authored base animate from the property's natural
// resting value on the inline-style path (the class path reads it from the
// cascade instead)
function implicitLifecycleBase(property: string): string | number | null {
  return property === 'opacity' ||
    property === 'scale' ||
    property === 'scaleX' ||
    property === 'scaleY'
    ? 1
    : property === 'rotate'
      ? '0deg'
      : property === 'x' || property === 'y'
        ? 0
        : null
}

const legacyTransformParts = new Set([
  'matrix',
  'perspective',
  'rotateX',
  'rotateY',
  'rotateZ',
  'scaleZ',
  'skewX',
  'skewY',
])

const webShadowParts: Record<string, number> = {
  shadowColor: 1,
  shadowOffset: 2,
  shadowOpacity: 3,
  shadowRadius: 4,
}

const webTextShadowParts = new Set([
  'textShadowColor',
  'textShadowOffset',
  'textShadowRadius',
])

const lineStyles = new Set([
  'none',
  'hidden',
  'dotted',
  'dashed',
  'solid',
  'double',
  'groove',
  'ridge',
  'inset',
  'outset',
])

const borderTargets: Record<
  string,
  { width: string[]; style: string[]; color: string[] }
> = {
  border: {
    width: ['borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth'],
    style: ['borderTopStyle', 'borderRightStyle', 'borderBottomStyle', 'borderLeftStyle'],
    color: ['borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor'],
  },
  borderTop: {
    width: ['borderTopWidth'],
    style: ['borderTopStyle'],
    color: ['borderTopColor'],
  },
  borderRight: {
    width: ['borderRightWidth'],
    style: ['borderRightStyle'],
    color: ['borderRightColor'],
  },
  borderBottom: {
    width: ['borderBottomWidth'],
    style: ['borderBottomStyle'],
    color: ['borderBottomColor'],
  },
  borderLeft: {
    width: ['borderLeftWidth'],
    style: ['borderLeftStyle'],
    color: ['borderLeftColor'],
  },
  outline: {
    width: ['outlineWidth'],
    style: ['outlineStyle'],
    color: ['outlineColor'],
  },
  borderBlock: {
    width: ['borderBlockStartWidth', 'borderBlockEndWidth'],
    style: ['borderBlockStartStyle', 'borderBlockEndStyle'],
    color: ['borderBlockStartColor', 'borderBlockEndColor'],
  },
  borderInline: {
    width: ['borderInlineStartWidth', 'borderInlineEndWidth'],
    style: ['borderInlineStartStyle', 'borderInlineEndStyle'],
    color: ['borderInlineStartColor', 'borderInlineEndColor'],
  },
}

interface TokenLookup {
  value: any
  /** The value resolved through the active theme, so it changes when the theme does. */
  fromTheme: boolean
  /** The normalized key the runtime theme object is indexed by. */
  themeKey: string
}

// single reused result object: tokenVariable runs on the style hot path and its
// one caller consumes the result before any re-entry, so this avoids allocating
// per token lookup
const tokenLookup: TokenLookup = { value: undefined, fromTheme: false, themeKey: '' }

function fillTokenLookup(value: any, fromTheme: boolean, themeKey: string): TokenLookup {
  tokenLookup.value = value
  tokenLookup.fromTheme = fromTheme
  tokenLookup.themeKey = themeKey
  return tokenLookup
}

function tokenVariable(
  state: GetStyleState,
  property: string,
  name: string
): TokenLookup | undefined {
  // v3's canonical token representation is unprefixed, but classic `$token`
  // values are still valid input: normalize here so `$background` and
  // `background` resolve identically (themes, tokens, and fonts are all
  // keyed unprefixed)
  let lookupName = name.charCodeAt(0) === 36 ? name.slice(1) : name
  if (property === 'fontFamily') {
    const family = state.conf.fontsParsed[lookupName]?.family
    return family ? fillTokenLookup(family, false, lookupName) : undefined
  }
  const fontKey =
    property === 'fontSize'
      ? 'size'
      : property === 'fontWeight'
        ? 'weight'
        : property === 'lineHeight' || property === 'letterSpacing'
          ? property
          : undefined
  if (fontKey) {
    const font =
      state.conf.fontsParsed[state.fontFamily || state.conf.defaultFontToken] ||
      state.conf.fontsParsed[state.conf.defaultFontToken]
    const value = font?.[fontKey]?.[lookupName]
    return value ? fillTokenLookup(value, false, lookupName) : undefined
  }
  const category = getTokenCategoryForProperty(property)
  const dot = lookupName.indexOf('.')
  if (dot !== -1) {
    const prefix = lookupName.slice(0, dot)
    if (!category || prefix === category || prefix === 'color') {
      lookupName = lookupName.slice(dot + 1)
    }
  }
  if (category) {
    const own = state.conf.tokensParsed[category]?.[lookupName]
    if (own) return fillTokenLookup(own, false, lookupName)
    for (const sibling of ['color', 'space', 'size', 'radius', 'zIndex'] as const) {
      if (sibling !== category && state.conf.tokensParsed[sibling]?.[lookupName]) return
    }
  } else {
    const first = lookupName.charCodeAt(0)
    if ((first >= 48 && first <= 57) || first === 43 || first === 45 || first === 46) {
      return
    }
  }
  const theme =
    state.theme?.[lookupName] ||
    state.conf.themes?.[state.flatThemeName || '']?.[lookupName]
  if (theme) return fillTokenLookup(theme, true, lookupName)
  if (category) return
  const token =
    state.conf.tokensParsed.space?.[lookupName] ||
    state.conf.tokensParsed.color?.[lookupName]
  return token ? fillTokenLookup(token, false, lookupName) : undefined
}

function configuredValue(state: GetStyleState, property: string, raw: string): any {
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

  const safeArea = resolveSafeAreaVariable(name)
  if (safeArea !== undefined) {
    state.flatUsesSafeArea = true
    return safeArea
  }

  const lookup = tokenVariable(state, property, name)
  if (!lookup || !isVariable(lookup.value)) {
    if (
      process.env.NODE_ENV === 'development' &&
      tokenCategoryByProperty[property] &&
      state.conf.tokensParsed.color?.[name]
    ) {
      warnOnce(`"${name}" contributes to "color", not "${property}"; keeping it literal`)
    }
    return raw
  }
  const resolveValues =
    process.env.TAMAGUI_TARGET === 'web' &&
    !state.flatShouldDoClasses &&
    state.styleProps.resolveValues === 'auto'
      ? 'value'
      : state.styleProps.resolveValues
  // the static compiler resolves tokens but keeps theme-backed values symbolic
  // so compiled output can read them through the live theme instead of freezing
  // the build machine's first theme. an opacity modifier stays in the sentinel,
  // which the compiler cannot represent and treats as a runtime-path bailout.
  if (resolveValues === 'except-theme' && lookup.fromTheme) {
    return `${THEME_REF_PREFIX}${lookup.themeKey}${opacity !== undefined ? `/${opacity}` : ''}`
  }
  let value = resolveVariableValue(property, lookup.value, resolveValues)
  if (opacity !== undefined) {
    value =
      process.env.TAMAGUI_TARGET === 'web'
        ? `color-mix(in srgb, ${value} ${opacity}%, transparent)`
        : normalizeColor(value, opacity / 100)
  }
  return value
}

function resolveEmbeddedTokens(state: GetStyleState, property: string, raw: string) {
  let copyFrom = 0
  let out = ''
  let quote = 0
  for (let index = 0; index < raw.length; index++) {
    const code = raw.charCodeAt(index)
    if (quote) {
      if (code === 92) index++
      else if (code === quote) quote = 0
      continue
    }
    if (code === 34 || code === 39) {
      quote = code
      continue
    }
    if (
      !(
        code === 36 ||
        code === 95 ||
        (code >= 65 && code <= 90) ||
        (code >= 97 && code <= 122)
      )
    ) {
      continue
    }
    let end = index + 1
    while (end < raw.length) {
      const next = raw.charCodeAt(end)
      if (
        next === 36 ||
        next === 45 ||
        next === 46 ||
        next === 95 ||
        (next >= 48 && next <= 57) ||
        (next >= 65 && next <= 90) ||
        (next >= 97 && next <= 122)
      ) {
        end++
      } else {
        break
      }
    }
    if (raw.charCodeAt(end) === 47) {
      let suffix = end + 1
      while (suffix < raw.length) {
        const next = raw.charCodeAt(suffix)
        if (next < 48 || next > 57) break
        suffix++
      }
      if (suffix > end + 1) end = suffix
    }
    const before = raw.charCodeAt(index - 1)
    if (
      code !== 36 &&
      ((before >= 48 && before <= 57) ||
        before === 35 ||
        (before === 45 && raw.charCodeAt(index - 2) === 45) ||
        raw.charCodeAt(end) === 40)
    ) {
      index = end - 1
      continue
    }
    const word = raw.slice(index, end)
    const value = configuredValue(state, property, word)
    if (value !== word) {
      out += raw.slice(copyFrom, index)
      out += String(value)
      copyFrom = end
    }
    index = end - 1
  }
  return copyFrom ? out + raw.slice(copyFrom) : raw
}

function normalizeTransitionNames(state: GetStyleState, raw: string) {
  let quote = 0
  let depth = 0
  let copyFrom = 0
  let out = ''
  for (let index = 0; index < raw.length; index++) {
    const code = raw.charCodeAt(index)
    if (quote) {
      if (code === 92) index++
      else if (code === quote) quote = 0
      continue
    }
    if (code === 34 || code === 39) {
      quote = code
      continue
    }
    if (code === 40) {
      depth++
      continue
    }
    if (code === 41) {
      depth--
      continue
    }
    if (
      depth ||
      !((code >= 65 && code <= 90) || (code >= 97 && code <= 122) || code === 95) ||
      (index > 1 && raw.charCodeAt(index - 1) === 45 && raw.charCodeAt(index - 2) === 45)
    ) {
      continue
    }
    let end = index + 1
    while (end < raw.length) {
      const next = raw.charCodeAt(end)
      if (
        (next >= 48 && next <= 57) ||
        (next >= 65 && next <= 90) ||
        (next >= 97 && next <= 122) ||
        next === 45 ||
        next === 95
      ) {
        end++
      } else {
        break
      }
    }
    if (raw.charCodeAt(end) !== 40) {
      const authored = raw.slice(index, end)
      let property = state.conf.shorthands[authored] || authored
      if (property === 'x' || property === 'y') property = 'translate'
      else if (property === 'scaleX' || property === 'scaleY') property = 'scale'
      else if (legacyTransformParts.has(property)) property = 'transform'
      let hasUpper = false
      for (let offset = 0; offset < property.length; offset++) {
        const letter = property.charCodeAt(offset)
        if (letter >= 65 && letter <= 90) {
          hasUpper = true
          break
        }
      }
      if (property !== authored || hasUpper) {
        out += raw.slice(copyFrom, index)
        for (let offset = 0; offset < property.length; offset++) {
          const letter = property.charCodeAt(offset)
          out +=
            letter >= 65 && letter <= 90
              ? `-${String.fromCharCode(letter + 32)}`
              : property[offset]
        }
        copyFrom = end
      }
    }
    index = end - 1
  }
  return copyFrom ? out + raw.slice(copyFrom) : raw
}

export function getDirectDynamicThemeAccess(state: GetStyleState) {
  return (state as DirectState).flatDynamicThemeAccess
}

function emitProperty(
  state: GetStyleState,
  property: string,
  value: any,
  cursor: ConditionCursor | null,
  merge: MergeStyle,
  originalValue: any,
  contextOnly: boolean
) {
  const direct = state as DirectState
  const condition = cursor ? conditionNumbers[cursor + conditionValueOffset] : 0
  if (condition & 4) (state.flatEnterKeys ||= new Set()).add(property)
  if (condition & 8) (state.flatExitKeys ||= new Set()).add(property)

  const theme = cursor ? conditionTexts[cursor + conditionThemeOffset] || '' : ''
  if (process.env.TAMAGUI_TARGET === 'native' && theme) {
    if (supportsDynamicColorIOS && isColorStyleKey(property)) {
      const schemes = ((direct.flatDynamicColors ||= {})[property] ||= {})
      schemes[theme] =
        typeof originalValue === 'string' && isAsciiLetters(originalValue)
          ? originalValue
          : value
      frameWrite(
        state,
        property,
        { dynamic: { ...schemes } },
        cursor,
        originalValue,
        false,
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
    if (!condition) {
      if (state.style) delete state.style[property]
    }
    frameWrite(state, property, value, cursor, originalValue, !state.flatShouldDoClasses)
    return
  }

  // inline and native: inactive conditions contribute nothing; the rest land
  // in the frame and the completion picks each property's winner
  if (condition && !(condition & 1)) return
  frameWriteInline(state, property, value, cursor, originalValue)
}

function splitComponents(value: string) {
  const parts: string[] = []
  let start = 0
  let quote = 0
  let depth = 0
  for (let index = 0; index <= value.length; index++) {
    const code = index === value.length ? 32 : value.charCodeAt(index)
    if (quote) {
      if (code === 92) index++
      else if (code === quote) quote = 0
      continue
    }
    if (code === 34 || code === 39) quote = code
    else if (code === 40) depth++
    else if (code === 41) depth--
    else if (!depth && code <= 32) {
      if (index > start) parts.push(value.slice(start, index))
      start = index + 1
    }
  }
  return parts
}

function isAsciiLetters(value: string): boolean {
  if (!value) return false
  for (let index = 0; index < value.length; index++) {
    const code = value.charCodeAt(index) | 32
    if (code < 97 || code > 122) return false
  }
  return true
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

function isNumericCSSComponent(value: string): boolean {
  let index = 0
  if (value.charCodeAt(index) === 43 || value.charCodeAt(index) === 45) index++
  let digits = 0
  let dot = false
  for (; index < value.length; index++) {
    const code = value.charCodeAt(index)
    if (code >= 48 && code <= 57) {
      digits++
      continue
    }
    if (code === 46 && !dot) {
      dot = true
      continue
    }
    break
  }
  if (!digits) return false
  for (; index < value.length; index++) {
    const code = value.charCodeAt(index)
    if (code !== 37 && (code < 97 || code > 122)) return false
  }
  return true
}

function startsValueFunction(value: string): boolean {
  let index = 0
  while (index < value.length) {
    const code = value.charCodeAt(index)
    if (code === 45 || (code >= 97 && code <= 122)) {
      index++
      continue
    }
    break
  }
  return index > 0 && value.charCodeAt(index) === 40
}

function emitBorder(
  state: GetStyleState,
  property: string,
  raw: string,
  cursor: ConditionCursor | null,
  merge: MergeStyle,
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
  let width: string | undefined
  let style: string | undefined
  let color: string | undefined
  for (const part of splitComponents(raw)) {
    if (lineStyles.has(part) || (property === 'outline' && part === 'auto')) {
      style = part
    } else if (
      part === 'thin' ||
      part === 'medium' ||
      part === 'thick' ||
      isNumericCSSComponent(part) ||
      startsValueFunction(part)
    ) {
      width = part
    } else {
      color = part
    }
  }
  if (style === 'none' && width === undefined) width = '0'
  const targets = borderTargets[property]
  if (width !== undefined) {
    for (const target of targets.width) {
      emitResolved(state, target, width, cursor, merge, originalValue, contextOnly)
    }
  }
  if (style !== undefined) {
    const styleTargets =
      process.env.TAMAGUI_TARGET === 'native' && property === 'border'
        ? ['borderStyle']
        : targets.style
    for (const target of styleTargets) {
      emitProperty(state, target, style, cursor, merge, originalValue, contextOnly)
    }
  }
  if (color !== undefined) {
    for (const target of targets.color) {
      emitResolved(state, target, color, cursor, merge, originalValue, contextOnly)
    }
  }
}

function emitTextDecoration(
  state: GetStyleState,
  raw: string,
  cursor: ConditionCursor | null,
  merge: MergeStyle,
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
    emitResolved(state, property, part, cursor, merge, originalValue, contextOnly)
  }
}

function emitTransform(
  state: GetStyleState,
  property: string,
  value: any,
  cursor: ConditionCursor | null,
  merge: MergeStyle,
  originalValue: any,
  contextOnly: boolean
) {
  if (!canGenerateCSS || !state.flatShouldDoClasses) {
    emitProperty(state, property, value, cursor, merge, originalValue, contextOnly)
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
    emitProperty(state, target, targetValue, cursor, merge, originalValue, contextOnly)
    if (target === '--t-x' || target === '--t-y') addComposition(state, 'translate')
    else if (target.startsWith('--t-scale')) addComposition(state, 'scale')
  }
}

function emitResolved(
  state: GetStyleState,
  property: string,
  raw: string,
  cursor: ConditionCursor | null,
  merge: MergeStyle,
  originalValue: any,
  contextOnly: boolean
) {
  let value = configuredValue(state, property, raw)
  if (value === raw) value = resolveEmbeddedTokens(state, property, raw)
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
  emitProperty(state, property, value, cursor, merge, originalValue, contextOnly)
}

function shadowUnit(part: any) {
  return typeof part === 'number' ? `${part}px` : part || '0px'
}

function emitWebTextShadow(
  state: DirectState,
  property: string,
  value: any,
  merge: MergeStyle,
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
    merge,
    originalValue,
    contextOnly
  )
}

function emitValue(
  state: GetStyleState,
  property: string,
  raw: any,
  cursor: ConditionCursor | null,
  merge: MergeStyle,
  originalValue: any,
  contextOnly: boolean
) {
  const condition = cursor ? conditionNumbers[cursor + conditionValueOffset] : 0

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

  requestBorderStyleDefault(
    state,
    property,
    condition,
    cursor ? conditionTexts[cursor + conditionKeyOffset] || '' : '',
    cursor ? conditionTexts[cursor + conditionSelectorOffset] || '' : '',
    cursor ? conditionWrappers : undefined,
    cursor ? conditionNumbers[cursor + conditionWrapperOffset] >> 3 : 0,
    cursor ? conditionNumbers[cursor + conditionWrapperOffset] & 7 : 0
  )

  if (
    typeof raw === 'string' &&
    (property === 'transition' || property === 'transitionProperty')
  ) {
    raw = normalizeTransitionNames(state, raw)
  }

  if (legacyTransformParts.has(property)) {
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
        merge,
        originalValue,
        contextOnly
      )
    } else {
      frameWriteInline(state, property, value, cursor, originalValue, true)
    }
    return
  }

  const webShadowPart = webShadowParts[property]
  if (process.env.TAMAGUI_TARGET === 'web' && webShadowPart) {
    const value = typeof raw === 'string' ? configuredValue(state, property, raw) : raw
    if (canGenerateCSS && state.flatShouldDoClasses) {
      const shadow = ((state as DirectState).flatWebShadow ||= [])
      shadow[webShadowPart - 1] = value
      shadow[4] = ++frameSequence
      shadow[5] = originalValue
      shadow[6] = contextOnly
    } else {
      frameWriteInline(state, property, value, cursor, originalValue, true)
    }
    return
  }

  if (process.env.TAMAGUI_TARGET === 'web' && webTextShadowParts.has(property)) {
    const value = typeof raw === 'string' ? configuredValue(state, property, raw) : raw
    if (canGenerateCSS && state.flatShouldDoClasses) {
      emitWebTextShadow(
        state as DirectState,
        property,
        value,
        merge,
        originalValue,
        contextOnly
      )
    } else {
      frameWriteInline(state, property, value, cursor, originalValue, true)
    }
    return
  }

  if (
    canGenerateCSS &&
    state.flatShouldDoClasses &&
    property === 'transform' &&
    Array.isArray(raw)
  ) {
    raw = transformsToString(raw)
  }

  if (typeof raw === 'string' && property in borderTargets) {
    emitBorder(state, property, raw, cursor, merge, originalValue, contextOnly)
    return
  }
  if (typeof raw === 'string' && property === 'textDecoration') {
    emitTextDecoration(state, raw, cursor, merge, originalValue, contextOnly)
    return
  }
  if (typeof raw === 'string' && property === 'background') {
    const parts = splitComponents(raw)
    if (parts.length === 1 && !startsValueFunction(parts[0])) {
      emitResolved(
        state,
        'backgroundColor',
        parts[0],
        cursor,
        merge,
        originalValue,
        contextOnly
      )
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
    // a transform going into a real style object rather than a CSS class has to
    // carry numbers: that is every native render and every web render an
    // animation driver drives inline. strings survive only on the class path.
    // a theme-ref sentinel is not a number and must pass through untouched.
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
          frameWriteInline(state, property, FRAME_TOMBSTONE, cursor, undefined)
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
    emitTransform(state, property, value, cursor, merge, originalValue, contextOnly)
    return
  }

  if (
    process.env.TAMAGUI_TARGET === 'web' &&
    !state.flatShouldDoClasses &&
    !condition &&
    property === 'borderRadius'
  ) {
    // css reads the shorthand, so skip the four-corner expansion here. a string
    // value still needs its token resolved, which is what emitResolved does.
    if (typeof raw === 'string') {
      emitResolved(state, property, raw, cursor, merge, originalValue, contextOnly)
    } else {
      emitProperty(state, property, raw, cursor, merge, originalValue, contextOnly)
    }
    return
  }

  if (
    process.env.TAMAGUI_TARGET === 'native' &&
    property === 'transform' &&
    typeof raw === 'string'
  ) {
    const transform = parseNativeTransform(raw)
    if (transform) {
      emitProperty(state, property, transform, cursor, merge, originalValue, contextOnly)
      return
    }
  }

  let value: any = raw
  if (typeof raw === 'string') {
    value = configuredValue(state, property, raw)
    if (value === raw) value = resolveEmbeddedTokens(state, property, raw)
  }

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
          emitProperty(state, key, parsedValue, cursor, merge, originalValue, contextOnly)
        }
      } else {
        emitProperty(
          state,
          property === 'backgroundImage' ? 'experimental_backgroundImage' : property,
          parsed,
          cursor,
          merge,
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

  const expanded = state.styleProps.noExpand
    ? null
    : expandStyle(property, value, state.conf.settings.styleCompat || 'web')
  if (!expanded) {
    emitProperty(state, property, value, cursor, merge, originalValue, contextOnly)
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
          merge,
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
      merge,
      originalValue,
      contextOnly
    )
  }
}

export function contributeStyleString(
  state: GetStyleState,
  property: string,
  source: string,
  merge: MergeStyle,
  originalValue?: any,
  contextOnly = false
) {
  const directState = state as DirectState
  const watermark = conditionCursorTop
  const previousCursor = directState.flatScanCursor
  // acquired lazily by the first modifier event, so clause-free values never
  // touch the pool
  directState.flatScanCursor = null
  try {
    scanFlatValue(
      source,
      directStyleHandler,
      state,
      property,
      merge,
      originalValue,
      contextOnly
    )
  } finally {
    directState.flatScanCursor = previousCursor
    releaseConditionCursors(watermark)
  }
  return true
}

// a flat conditional object either names a `default` or opens with a
// resolvable modifier chain; anything else is a structured leaf value
// (shadowOffset) and stays whole. only the first key is probed, the same way
// the string scanner commits at its first clause
function contributeStyleObject(
  state: GetStyleState,
  property: string,
  value: Record<string, any>,
  merge: MergeStyle,
  contextOnly: boolean
) {
  const directState = state as DirectState
  const parent = (directState.flatPass?.[passParentCursor] as ConditionCursor) || null
  const hasDefault = Object.prototype.hasOwnProperty.call(value, 'default')
  let hasBase = false
  const base = hasDefault ? value.default : undefined
  if (base != null) {
    const baseString = String(base)
    feedCompoundSegment(directState, baseString, 0, baseString.length, true, true, 0)
    emitAtParentCondition(state, property, base, merge, base, contextOnly)
    hasBase = true
  }
  let conditions = 0
  // the first non-default key both classifies the object and contributes: one
  // enumeration, one getter read, one resolution
  let firstCondition = !hasDefault
  for (const key in value) {
    if (key === 'default') continue
    const payload = value[key]
    const watermark = conditionCursorTop
    const cursor = acquireConditionCursor(parent)
    resolveConditionText(state, cursor, key)
    const condition = commitConditionCursor(state, cursor)
    if (firstCondition) {
      firstCondition = false
      if (!condition) {
        releaseConditionCursors(watermark)
        return false
      }
    }
    if (payload != null) {
      conditions |= emitUnderCondition(
        state,
        property,
        payload,
        cursor,
        merge,
        payload,
        contextOnly,
        1,
        payload
      )
      const payloadString = String(payload)
      feedCompoundSegment(
        directState,
        payloadString,
        0,
        payloadString.length,
        false,
        Boolean(condition),
        condition && directState.flatPass?.[passCompoundIndexes]
          ? snapshotCondition(cursor)
          : 0
      )
    }
    releaseConditionCursors(watermark)
  }
  if (!hasDefault && firstCondition) return false
  if ((!canGenerateCSS || !state.flatShouldDoClasses) && conditions & 12 && !hasBase) {
    const resting = implicitLifecycleBase(property)
    if (resting !== null) {
      emitAtParentCondition(state, property, resting, merge, resting, contextOnly)
    }
  }
  return true
}

function contributeValue(
  state: GetStyleState,
  property: string,
  value: any,
  merge: MergeStyle,
  originalValue?: any,
  contextOnly = false,
  condition?: ConditionCursor | string
) {
  if (isConditionTransport(value)) {
    // a wrapping component's conditional contributions arrive as resolved
    // atoms: replay each into a cursor at this position, no text reparsed
    if (value.hasBase) {
      contributeValue(state, property, value.base, merge, value.base, contextOnly)
    }
    for (let offset = 0; offset < value.entries.length; ) {
      const entryValue = value.entries[offset]
      const watermark = conditionCursorTop
      try {
        const cursor = acquireTransportCursor(
          state,
          value.entries,
          offset,
          ((state as DirectState).flatPass?.[passParentCursor] as ConditionCursor) || null
        )
        emitUnderCondition(
          state,
          property,
          entryValue,
          cursor,
          merge,
          entryValue,
          contextOnly,
          2,
          entryValue
        )
      } finally {
        releaseConditionCursors(watermark)
      }
      offset += conditionEntryWidth(value.entries, offset)
    }
    return true
  }
  if (condition !== undefined) {
    const directState = state as DirectState
    const parent = (directState.flatPass?.[passParentCursor] as ConditionCursor) || null
    const watermark = conditionCursorTop
    try {
      // compose the incoming condition over any live parent condition by
      // replaying atoms; a frontend hands the condition as authored text
      let effective: ConditionCursor
      if (typeof condition === 'string') {
        effective = acquireConditionCursor(parent)
        resolveConditionText(state, effective, condition)
        commitConditionCursor(state, effective)
      } else if (parent) {
        effective = acquireConditionCursor(parent)
        const atomMeta = conditionNumbers[condition + conditionAtomOffset]
        const atomCount = atomMeta & 15
        const atomStart = atomMeta >> 4
        for (let index = 0; index < atomCount; index++) {
          const atom = atomStart + index
          const code = conditionAtomNumbers[atom]
          accumulateConditionAtom(
            state,
            effective,
            code & 7,
            code >> 3,
            conditionAtomNames[atom]
          )
        }
        if (
          !(conditionNumbers[condition + conditionFlagsOffset] & conditionResolvedFlag)
        ) {
          setConditionUnresolved(effective)
        }
        commitConditionCursor(state, effective)
      } else {
        effective = condition
      }
      const isObjectValue =
        value && typeof value === 'object' && !Array.isArray(value) && !isVariable(value)
      const objectHasDefault =
        isObjectValue && Object.prototype.hasOwnProperty.call(value, 'default')
      const firstChild =
        isObjectValue && !objectHasDefault ? acquireConditionCursor(effective) : null
      if (
        isObjectValue &&
        classifyConditionalObject(value, state, undefined, firstChild || undefined)
      ) {
        let useFirstChild = firstChild !== null
        for (const key in value) {
          const payload = value[key]
          if (payload == null) continue
          if (key === 'default') {
            emitUnderCondition(
              state,
              property,
              payload,
              effective,
              merge,
              payload,
              contextOnly,
              2,
              payload
            )
          } else {
            const keyWatermark = conditionCursorTop
            const child = useFirstChild ? firstChild! : acquireConditionCursor(effective)
            if (useFirstChild) {
              useFirstChild = false
            } else {
              resolveConditionText(state, child, key)
              commitConditionCursor(state, child)
            }
            emitUnderCondition(
              state,
              property,
              payload,
              child,
              merge,
              payload,
              contextOnly,
              2,
              payload
            )
            if (child !== firstChild) releaseConditionCursors(keyWatermark)
          }
        }
        return true
      }
      emitUnderCondition(
        state,
        property,
        value,
        effective,
        merge,
        originalValue,
        contextOnly,
        2,
        value
      )
      return true
    } finally {
      releaseConditionCursors(watermark)
    }
  }
  if (
    process.env.TAMAGUI_TARGET === 'web' &&
    (webShadowParts[property] || legacyTransformParts.has(property)) &&
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
  if (value === 'safe' && isSafeAreaKey(property)) {
    const expanded = expandSafeAreaValue(property)
    if (expanded) {
      state.flatUsesSafeArea = true
      for (const [key, resolved] of expanded) {
        emitAtParentCondition(
          state,
          key,
          resolved,
          merge,
          originalValue ?? value,
          contextOnly
        )
      }
      return true
    }
  }
  if (typeof value === 'string') {
    return contributeStyleString(
      state,
      property,
      value,
      merge,
      originalValue,
      contextOnly
    )
  }
  if (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    !isVariable(value) &&
    contributeStyleObject(state, property, value, merge, contextOnly)
  ) {
    return true
  }
  if (value != null) {
    emitAtParentCondition(
      state,
      property,
      value,
      merge,
      originalValue ?? value,
      contextOnly
    )
    return true
  }
  return false
}

export function clearDirectStyle(state: GetStyleState, property: string) {
  const direct = state as DirectState
  const atomicKey = property.startsWith('transition')
    ? 'transition'
    : webShadowParts[property]
      ? 'boxShadow'
      : webTextShadowParts.has(property)
        ? 'textShadow'
        : legacyTransformParts.has(property)
          ? 'transform'
          : property
  clearFrameAtomic(state, atomicKey)
  const frame = direct.flatFrame
  if (frame) {
    if (atomicKey === 'transition') {
      for (const key in frame) {
        if (key.startsWith('transition')) delete frame[key]
      }
    } else {
      delete frame[atomicKey]
    }
  }
  if (atomicKey === 'transform') state.transformAccumulator = undefined
  if (state.style) delete state.style[atomicKey]
  delete state.classNames[atomicKey]
}

// ── HOC clause transport ─────────────────────────────────────────────────────
// A conditional contribution whose key the host cannot style hands the wrapped
// component its RESOLVED atoms, never serialized condition text: the inner
// pass replays them straight into a cursor. Values are recognized only through
// a module-private WeakSet, so the transport cannot become publicly authorable.

interface ConditionTransport {
  hasBase: boolean
  base: any
  entries: unknown[]
}

const conditionTransports = new WeakSet<ConditionTransport>()

function isConditionTransport(value: unknown): value is ConditionTransport {
  return (
    typeof value === 'object' &&
    value !== null &&
    conditionTransports.has(value as ConditionTransport)
  )
}

const transportHeaderWidth = 3
const transportAtomWidth = 2

function conditionEntryWidth(entries: unknown[], offset: number) {
  return transportHeaderWidth + (entries[offset + 2] as number) * transportAtomWidth
}

function appendConditionEntry(entries: unknown[], cursor: ConditionCursor, value: any) {
  const atomMeta = conditionNumbers[cursor + conditionAtomOffset]
  const atomCount = atomMeta & 15
  const atomStart = atomMeta >> 4
  entries.push(value, conditionTexts[cursor + conditionKeyOffset] || '', atomCount)
  for (let index = 0; index < atomCount; index++) {
    const atom = atomStart + index
    entries.push(conditionAtomNumbers[atom], conditionAtomNames[atom])
  }
}

/** replay a transported clause's atoms into a fresh committed cursor */
function acquireTransportCursor(
  state: GetStyleState,
  entries: unknown[],
  offset: number,
  parent: ConditionCursor | null
): ConditionCursor {
  const cursor = acquireConditionCursor(parent)
  const atomCount = entries[offset + 2] as number
  let atomOffset = offset + transportHeaderWidth
  for (let index = 0; index < atomCount; index++) {
    accumulateConditionAtom(
      state,
      cursor,
      (entries[atomOffset] as number) & 7,
      (entries[atomOffset] as number) >> 3,
      entries[atomOffset + 1] as string
    )
    atomOffset += transportAtomWidth
  }
  commitConditionCursor(state, cursor)
  return cursor
}

function mergeConditionTransport(
  state: GetStyleState,
  prev: unknown,
  cursor: ConditionCursor,
  value: unknown
): ConditionTransport {
  let transport: ConditionTransport
  if (isConditionTransport(prev)) {
    transport = prev
  } else {
    transport = { hasBase: false, base: undefined, entries: [] }
    conditionTransports.add(transport)
    if (prev != null) {
      const isObjectValue =
        typeof prev === 'object' && !Array.isArray(prev) && !isVariable(prev)
      const objectHasDefault =
        isObjectValue && Object.prototype.hasOwnProperty.call(prev, 'default')
      const authoredWatermark = conditionCursorTop
      try {
        const firstCursor =
          isObjectValue && !objectHasDefault ? acquireConditionCursor() : null
        if (
          isObjectValue &&
          classifyConditionalObject(
            prev as Record<string, any>,
            state,
            undefined,
            firstCursor || undefined
          )
        ) {
          // an authored conditional object joins as transported clauses; its
          // keys are authored text and resolve here exactly once
          let useFirstCursor = firstCursor !== null
          for (const key in prev as Record<string, any>) {
            const payload = (prev as Record<string, any>)[key]
            if (payload == null) continue
            if (key === 'default') {
              transport.hasBase = true
              transport.base = payload
              continue
            }
            const watermark = conditionCursorTop
            const keyCursor = useFirstCursor ? firstCursor! : acquireConditionCursor()
            if (useFirstCursor) {
              useFirstCursor = false
            } else {
              resolveConditionText(state, keyCursor, key)
              commitConditionCursor(state, keyCursor)
            }
            appendConditionEntry(transport.entries, keyCursor, payload)
            if (keyCursor !== firstCursor) releaseConditionCursors(watermark)
          }
        } else {
          transport.hasBase = true
          transport.base = prev
        }
      } finally {
        releaseConditionCursors(authoredWatermark)
      }
    }
  }
  // a repeat contribution under the same condition set replaces its entry and
  // moves to the end: the wrapped pass sees last-wins in authored order
  for (let offset = 0; offset < transport.entries.length; ) {
    const width = conditionEntryWidth(transport.entries, offset)
    if (
      transport.entries[offset + 1] ===
      (conditionTexts[cursor + conditionKeyOffset] || '')
    ) {
      transport.entries.splice(offset, width)
      break
    }
    offset += width
  }
  appendConditionEntry(transport.entries, cursor, value)
  return transport
}

type VariantScanContext = [GetStyleState, string, string]

const variantValueHandler: FlatValueHandler<VariantScanContext> = {
  segment(ctx, start, end, isBase, valid, source, chainStart, chainEnd, chainValid) {
    const state = ctx[0]
    const directState = state as DirectState
    if (start === end) return
    if (isBase) {
      feedCompoundSegment(directState, source, start, end, true, valid, 0)
      if (!valid) return
      emitResolvedVariant(ctx[1], source.slice(start, end), state, ctx[2], null)
      return
    }
    if (!valid || !chainValid) return
    // the clause's own condition: parent composition happens downstream where
    // the resolved output emits, exactly like every other conditional value
    const cursor = directState.flatScanCursor
    const condition =
      cursor && conditionNumbers[cursor + conditionFlagsOffset] & conditionResolvedFlag
        ? conditionNumbers[cursor + conditionValueOffset]
        : 0
    feedCompoundSegment(
      directState,
      source,
      start,
      end,
      false,
      Boolean(condition),
      condition && directState.flatPass?.[passCompoundIndexes]
        ? snapshotCondition(cursor!)
        : 0
    )
    if (!condition) return
    emitResolvedVariant(ctx[1], source.slice(start, end), state, ctx[2], cursor!)
  },
  modifier(ctx, start, end, valid, first, source) {
    const directState = ctx[0] as DirectState
    let cursor = directState.flatScanCursor
    if (!cursor) {
      cursor = directState.flatScanCursor = acquireConditionCursor()
    } else if (first) {
      resetConditionCursor(cursor, 0)
    }
    if (!valid) {
      setConditionUnresolved(cursor)
      return
    }
    if (conditionNumbers[cursor + conditionFlagsOffset] & conditionResolvedFlag) {
      resolveConditionModifier(ctx[0], cursor, source.slice(start, end))
    }
  },
  chain(ctx, _start, _end, valid) {
    const cursor = (ctx[0] as DirectState).flatScanCursor
    if (cursor) {
      if (!valid) setConditionUnresolved(cursor)
      if (conditionNumbers[cursor + conditionFlagsOffset] & conditionResolvedFlag) {
        commitConditionCursor(ctx[0], cursor)
      }
    }
    return true
  },
}

// per-staticConfig union of every key the styled context declares, cached so
// context-membership checks on the style write path are one Set lookup instead
// of re-deriving config each time (issues #3670, #3676)
const contextPropSets = new WeakMap<StaticConfig, Set<string> | null>()
export function getContextPropSet(staticConfig: StaticConfig): Set<string> | null {
  const cached = contextPropSets.get(staticConfig)
  if (cached !== undefined) return cached
  const contextConfig = staticConfig.context || staticConfig.parentStaticConfig?.context
  const inheritedContextPropKeys =
    !staticConfig.context ||
    staticConfig.context === staticConfig.parentStaticConfig?.context
      ? staticConfig.parentStaticConfig?.contextProps
      : undefined
  const contextPropKeys = staticConfig.contextProps || inheritedContextPropKeys
  let set: Set<string> | null = null
  if (contextConfig?.props) {
    set ||= new Set()
    for (const key in contextConfig.props) set.add(key)
  }
  if (contextPropKeys) {
    set ||= new Set()
    for (const key of contextPropKeys) set.add(key)
  }
  if (contextConfig?.propKeys) {
    set ||= new Set()
    for (const key of contextConfig.propKeys) set.add(key)
  }
  const parentPropKeys = staticConfig.parentStaticConfig?.context?.propKeys
  if (parentPropKeys) {
    set ||= new Set()
    for (const key of parentPropKeys) set.add(key)
  }
  contextPropSets.set(staticConfig, set)
  return set
}

function emitMappedValue(
  styleState: GetStyleState,
  key: string,
  value: any,
  originalValue: any,
  nestedCondition: number | undefined,
  parentCondition: number | undefined,
  fallbackOriginal: any
) {
  const nested = nestedCondition as ConditionCursor | undefined
  const parent = parentCondition as ConditionCursor | undefined
  let resolvedCondition = nested ?? parent
  const watermark = conditionCursorTop
  if (nested && parent) {
    const composed = acquireConditionCursor(parent)
    const atomMeta = conditionNumbers[nested + conditionAtomOffset]
    const atomCount = atomMeta & 15
    const atomStart = atomMeta >> 4
    for (let index = 0; index < atomCount; index++) {
      const atom = atomStart + index
      const code = conditionAtomNumbers[atom]
      accumulateConditionAtom(
        styleState,
        composed,
        code & 7,
        code >> 3,
        conditionAtomNames[atom]
      )
    }
    if (!(conditionNumbers[nested + conditionFlagsOffset] & conditionResolvedFlag)) {
      setConditionUnresolved(composed)
    }
    commitConditionCursor(styleState, composed)
    resolvedCondition = composed
  }
  const conf = styleState.conf
  if (key === 'fontFamily' || key === conf.inverseShorthands.fontFamily) {
    styleState.fontFamily = getFontFamilyFromNameOrVariable(value, conf)
  }
  mapContributedProp(
    styleState,
    key,
    value,
    originalValue ?? fallbackOriginal,
    resolvedCondition
  )
  releaseConditionCursors(watermark)
}

const contributeMappedValue: PropMapper = (
  key,
  value,
  styleState,
  disabled,
  parentCondition,
  fallbackOriginal
) => {
  if (disabled) {
    return emitMappedValue(
      styleState,
      key,
      value,
      undefined,
      undefined,
      parentCondition,
      fallbackOriginal
    )
  }

  const { conf, styleProps, staticConfig } = styleState
  const { variants } = staticConfig
  const { disableExpandShorthands, noExpand, resolveValues } = styleProps
  const shorthands = conf.shorthands

  // "unset" is a CSS-wide keyword: valid CSS on web, but React Native
  // style props reject it (e.g. aspectRatio throws "must be a number, a
  // ratio string or `auto`"). On native, clear anything an earlier prop or
  // styled default already merged for this key — matching web, where unset
  // resets toward initial — then drop the value so RN never sees it.
  if (process.env.TAMAGUI_TARGET === 'native' && value === 'unset') {
    const expandedKey = (!disableExpandShorthands && shorthands[key]) || key
    const expanded = noExpand
      ? null
      : expandStyle(expandedKey, value, conf.settings.styleCompat || 'web')
    const frame = (styleState as DirectState).flatFrame
    if (expanded) {
      for (const [nkey] of expanded) {
        if (frame) delete frame[nkey]
        if (styleState.style) delete styleState.style[nkey]
      }
    } else {
      if (frame) delete frame[expandedKey]
      if (styleState.style) delete styleState.style[expandedKey]
    }
    return
  }

  if (!noExpand) {
    if (variants && key in variants) {
      resolveVariants(key, value, styleProps, styleState, key)
      return
    }
  }

  // handle shorthands
  if (!disableExpandShorthands) {
    if (key in shorthands) {
      key = shorthands[key]
    }
  }

  // Capture original value before resolution (for context prop tracking)
  const originalValue = value

  // "safe" value -> env(safe-area-inset-*) on web, numeric inset on native.
  // expands multi-edge props (padding, inset, marginHorizontal, ...) into
  // per-side keys so each side gets its own edge value.
  if (value === 'safe' && isSafeAreaKey(key)) {
    const expanded = expandSafeAreaValue(key)
    if (expanded) {
      for (let i = 0; i < expanded.length; i++) {
        const [nkey, nvalue] = expanded[i]
        emitMappedValue(
          styleState,
          nkey,
          nvalue,
          originalValue,
          undefined,
          parentCondition,
          fallbackOriginal
        )
      }
      return
    }
  }

  if (value != null) {
    if (typeof value === 'string') {
      value = isRemValue(value) ? resolveRem(value) : value
    } else if (isVariable(value)) {
      value = resolveVariableValue(key, value, resolveValues)
    } else if (isRemValue(value)) {
      value = resolveRem(value)
    }
  }

  // strings stay whole so the direct scanner can distinguish CSS components
  // from modifier clauses before it emits them.

  if (value != null) {
    if (key === 'fontFamily' && typeof originalValue === 'string') {
      if (originalValue in conf.fontsParsed) {
        styleState.fontFamily = originalValue
      }
    }

    // strings stay whole for the direct flat-value scanner
    const expanded =
      noExpand || typeof value === 'string'
        ? null
        : expandStyle(key, value, conf.settings.styleCompat || 'web')

    if (expanded) {
      const max = expanded.length
      for (let i = 0; i < max; i++) {
        const [nkey, nvalue, noriginalValue] = expanded[i]
        emitMappedValue(
          styleState,
          nkey,
          nvalue,
          noriginalValue ?? originalValue,
          undefined,
          parentCondition,
          fallbackOriginal
        )
      }
    } else {
      emitMappedValue(
        styleState,
        key,
        value,
        originalValue,
        undefined,
        parentCondition,
        fallbackOriginal
      )
    }
  }
}

function resolveVariants(
  key: string,
  value: any,
  styleProps: SplitStyleProps,
  styleState: GetStyleState,
  parentVariantKey: string
) {
  const variantDefinition = styleState.staticConfig.variants?.[key]
  if (isConditionTransport(value)) {
    // conditional variant selections transported through an HOC: resolve each
    // branch under its replayed condition
    if (value.hasBase) {
      emitResolvedVariant(key, value.base, styleState, parentVariantKey, null)
    }
    for (let offset = 0; offset < value.entries.length; ) {
      const entryValue = value.entries[offset]
      const watermark = conditionCursorTop
      try {
        const cursor = acquireTransportCursor(styleState, value.entries, offset, null)
        emitResolvedVariant(key, entryValue, styleState, parentVariantKey, cursor)
      } finally {
        releaseConditionCursors(watermark)
      }
      offset += conditionEntryWidth(value.entries, offset)
    }
    return
  }
  if (
    typeof value === 'string' &&
    // a variant can define a literal colon key like "16:9" — an exact match
    // wins over clause parsing
    !(
      variantDefinition &&
      typeof variantDefinition === 'object' &&
      value in variantDefinition
    )
  ) {
    const directState = styleState as DirectState
    const watermark = conditionCursorTop
    const previousCursor = directState.flatScanCursor
    directState.flatScanCursor = null
    try {
      scanFlatValue(value, variantValueHandler, [styleState, key, parentVariantKey])
    } finally {
      directState.flatScanCursor = previousCursor
      releaseConditionCursors(watermark)
    }
    return
  }

  // the object spelling of a conditional variant prop mirrors the clause
  // string: density={{ default: 'compact', sm: 'roomy' }}. a payload object
  // with no default and no modifier first key (a functional variant's own
  // argument shape) falls through whole
  const isObjectValue =
    value && typeof value === 'object' && !Array.isArray(value) && !isVariable(value)
  const objectHasDefault =
    isObjectValue && Object.prototype.hasOwnProperty.call(value, 'default')
  const objectWatermark = conditionCursorTop
  try {
    const firstCursor =
      isObjectValue && !objectHasDefault ? acquireConditionCursor() : null
    if (
      isObjectValue &&
      classifyConditionalObject(value, styleState, undefined, firstCursor || undefined)
    ) {
      let useFirstCursor = firstCursor !== null
      for (const objKey in value) {
        const payload = value[objKey]
        if (payload == null) continue
        const directState = styleState as DirectState
        const payloadString = String(payload)
        if (objKey === 'default') {
          feedCompoundSegment(
            directState,
            payloadString,
            0,
            payloadString.length,
            true,
            true,
            0
          )
          emitResolvedVariant(key, payload, styleState, parentVariantKey, null)
          continue
        }
        const watermark = conditionCursorTop
        const cursor = useFirstCursor ? firstCursor! : acquireConditionCursor()
        let condition = conditionNumbers[cursor + conditionValueOffset]
        if (useFirstCursor) {
          useFirstCursor = false
        } else {
          resolveConditionText(styleState, cursor, objKey)
          condition = commitConditionCursor(styleState, cursor)
        }
        if (directState.flatPass?.[passCompoundIndexes]) {
          feedCompoundSegment(
            directState,
            payloadString,
            0,
            payloadString.length,
            false,
            Boolean(condition),
            condition ? snapshotCondition(cursor) : 0
          )
        }
        // an unresolvable key still flows down as its (unresolved) cursor so the
        // downstream contribution warns and drops it, never emits unconditioned
        emitResolvedVariant(key, payload, styleState, parentVariantKey, cursor)
        if (cursor !== firstCursor) releaseConditionCursors(watermark)
      }
      return
    }
  } finally {
    releaseConditionCursors(objectWatermark)
  }

  emitResolvedVariant(key, value, styleState, parentVariantKey, null)
}

function emitResolvedVariant(
  key: string,
  value: any,
  styleState: GetStyleState,
  parentVariantKey: string,
  conditionCursor: ConditionCursor | null
) {
  const { staticConfig, conf, debug } = styleState
  const styleProps = styleState.styleProps
  const { variants } = staticConfig
  if (!variants) return

  const variant = variants[key]
  let variantValue = getVariantDefinition(variant, value, conf, styleState)

  if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
    console.groupCollapsed(`♦️♦️♦️ resolve variant ${key}`)
    console.info({
      key,
      value,
      variantValue,
      variants,
    })
    console.groupEnd()
  }

  if (!variantValue) {
    // variant at key exists, but no matching variant
    // disabling warnings, its fine to pass through, could re-enable later somehoiw
    if (process.env.TAMAGUI_WARN_ON_MISSING_VARIANT === '1') {
      // don't warn on missing booleans
      if (typeof value !== 'boolean') {
        const name = styleState.styleProps.displayName || '[UnnamedComponent]'
        console.warn(
          `No variant found: ${name} has variant "${key}", but no matching value "${value}"`
        )
      }
    }
    return
  }

  if (typeof variantValue === 'function') {
    const fn = variantValue as VariantSpreadFunction<any>
    const extras = getVariantExtras(styleState)
    variantValue = fn(value, extras)

    if (
      process.env.NODE_ENV === 'development' &&
      debug === 'verbose' &&
      process.env.TAMAGUI_TARGET === 'web'
    ) {
      console.groupCollapsed('   expanded functional variant', key)
      console.info({ fn, variantValue, extras })
      console.groupEnd()
    }
  }

  if (!isObj(variantValue)) return

  if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
    console.info(`   expanding styles from `, variantValue)
  }
  const { noSkip } = styleProps
  const originals = styleOriginalValues.get(variantValue)
  const directState = styleState as DirectState
  directState.flatCompoundOutputDepth = (directState.flatCompoundOutputDepth || 0) + 1
  try {
    for (const outputKey in variantValue) {
      if (!noSkip && outputKey in skipProps) continue
      // normalize per value at the variant boundary (numbers gain units on
      // web, px-strings become numbers on native), the same normalization the
      // materialized variant object received before streaming replaced it —
      // atomic identity depends on it
      const rawOutputValue = variantValue[outputKey]
      const outputValue = styleProps.noNormalize
        ? rawOutputValue
        : normalizeValueWithProperty(
            rawOutputValue,
            conf.shorthands[outputKey] || outputKey
          )
      const originalValue = originals?.[outputKey] ?? rawOutputValue

      const contextPropSet = getContextPropSet(staticConfig)
      if (contextPropSet?.has(outputKey)) {
        styleState.overriddenContextProps ||= {}
        styleState.overriddenContextProps[outputKey] = originalValue
        styleState.originalContextPropValues ||= {}
        styleState.originalContextPropValues[outputKey] = originalValue
      }

      contributeMappedValue(
        outputKey,
        outputValue,
        styleState,
        parentVariantKey === key && outputKey === key,
        conditionCursor || undefined,
        originalValue
      )
    }
  } finally {
    directState.flatCompoundOutputDepth!--
  }
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

// goes through specificity finding best matching variant function
function getVariantDefinition(
  variant: any,
  value: any,
  conf: TamaguiInternalConfig,
  { theme }: Partial<GetStyleState>
): any {
  if (!variant) return
  if (value === undefined) return
  if (typeof variant === 'function') {
    return variant
  }
  if (Object.prototype.hasOwnProperty.call(variant, value)) {
    return variant[value]
  }
  for (const { key, parts } of getCompiledVariantResolvers(variant)) {
    for (const part of parts) {
      if (matchesVariantResolver(part, value, conf, theme)) {
        return variant[key]
      }
    }
  }

  return
}

type VariantResolverName = (typeof variantResolverNames)[number]

const variantResolverNameSet = new Set<string>(variantResolverNames)

type CompiledVariantResolver = {
  key: string
  parts: VariantResolverName[]
}

const variantResolverCache = new WeakMap<object, readonly CompiledVariantResolver[]>()

const preparedStyleStaticConfigs = new WeakSet<StaticConfig>()

export function prepareStyleStaticConfig(staticConfig: StaticConfig): StaticConfig {
  if (preparedStyleStaticConfigs.has(staticConfig)) return staticConfig
  preparedStyleStaticConfigs.add(staticConfig)
  getContextPropSet(staticConfig)
  prepareStaticConfigCompounds(staticConfig)
  const variants = staticConfig.variants
  if (variants) {
    for (const key in variants) {
      const variant = variants[key]
      if (variant && typeof variant === 'object') getCompiledVariantResolvers(variant)
    }
  }
  return staticConfig
}

function getCompiledVariantResolvers(variant: object) {
  let cached = variantResolverCache.get(variant)
  if (cached) {
    return cached
  }
  const compiled: CompiledVariantResolver[] = []
  for (const key in variant) {
    const parts = parseVariantResolverKey(key)
    if (parts) {
      compiled.push({ key, parts })
    }
  }
  variantResolverCache.set(variant, compiled)
  return compiled
}

function parseVariantResolverKey(key: string): VariantResolverName[] | null {
  if (!key) return null
  const parts: VariantResolverName[] = []
  let start = 0
  for (let index = 0; index <= key.length; index++) {
    if (index !== key.length && key.charCodeAt(index) !== 124) continue
    let partStart = start
    let partEnd = index
    while (partStart < partEnd && key.charCodeAt(partStart) <= 32) partStart++
    while (partEnd > partStart && key.charCodeAt(partEnd - 1) <= 32) partEnd--
    if (partStart === partEnd) return null
    const part = key.slice(partStart, partEnd)
    if (!variantResolverNameSet.has(part)) return null
    parts.push(part as VariantResolverName)
    start = index + 1
  }
  return parts
}

function hasNumericPrefix(value: string, suffixLength: number): boolean {
  if (value.length <= suffixLength) return false
  return Number.isFinite(Number(value.slice(0, value.length - suffixLength)))
}

function matchesVariantResolver(
  resolverName: VariantResolverName,
  value: any,
  conf: TamaguiInternalConfig,
  theme: Partial<GetStyleState>['theme']
) {
  const string = typeof value === 'string'
  const number = typeof value === 'number'
  const rem = string && value.endsWith('rem') && hasNumericPrefix(value, 3)

  switch (resolverName) {
    case 'Size':
    case 'Space':
    case 'Radius':
    case 'ZIndex':
      // styles are authored by devs and never validated at runtime: any number
      // or string routes to the token variant, which passes unknown values
      // through. Size keeps its historical variable exclusion so variables
      // route to the Space/Radius/ZIndex fallbacks.
      return (
        value === true ||
        number ||
        string ||
        (resolverName !== 'Size' && isVariable(value))
      )
    // a token or theme color, otherwise any string is taken to be a raw CSS
    // color and left for the browser to resolve. checking that against a CSS
    // color-name table costs 2.3KB gzip to reject values that were never valid
    // anyway. `red/50` opacity modifiers stay limited to token and theme
    // colors, which the branches above already covered.
    case 'Color':
      return (value != null && value in conf.tokensParsed.color) || string
    case 'Theme':
      return string && !!theme && value in theme
    case 'FontSize':
      return value === true || !!conf.fontsParsed.body?.size?.[value] || number || rem
    case 'FontStyle':
      return (
        !!conf.fontsParsed.body?.style?.[value] ||
        value === 'normal' ||
        value === 'italic'
      )
    case 'FontTransform':
      return (
        !!conf.fontsParsed.body?.transform?.[value] ||
        value === 'none' ||
        value === 'capitalize' ||
        value === 'uppercase' ||
        value === 'lowercase'
      )
    case 'FontLineHeight':
      return !!conf.fontsParsed.body?.lineHeight?.[value] || number || rem
    case 'FontLetterSpacing':
      return !!conf.fontsParsed.body?.letterSpacing?.[value] || number || rem
    case 'number':
    case 'string':
    case 'boolean':
      return typeof value === resolverName
    case 'any':
      return true
  }
}
