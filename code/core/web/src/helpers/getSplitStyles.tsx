import {
  isAndroid,
  isClient,
  isWeb,
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

// non-enumerable field on a $$css style object carrying the emitting
// component's property→class map, so a tamagui consumer can merge the classes
// with per-property position semantics while RNW's for-in flatten ignores it
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
//
// One clause's resolved condition. A cursor is owned by the call frame that
// acquires it and released by watermark on the way out, so live condition
// state never outlives its frame. The scanner's per-modifier events resolve
// each modifier against the compiled vocabulary exactly once, straight into
// the cursor: by the time a payload segment arrives its condition — activity
// included — is already known, and nothing re-walks a chain span.
//
// A cursor records its resolved atoms (kind, rank, canonical name) so the two
// composition consumers — compound Cartesian products and parent×child
// condition nesting — replay resolution over atoms instead of serializing a
// canonical key and reparsing it.

interface ConditionCursor {
  /** sorted canonical modifier identity, e.g. "dark:hover" */
  key: string
  /** packed precedence + activity flags; valid after commitConditionCursor */
  condition: number
  active: boolean
  emit: boolean
  selector: string
  wrappers: string[]
  theme: string
  enter: boolean
  exit: boolean
  /** carries a hover/press/focus state atom (platform-pseudo discovery) */
  platformPseudo: boolean
  /** on native, a component-tier state with no native state source */
  unsupportedState: string
  /** the first modifier that failed to resolve; clears `resolved` */
  unresolvedName: string
  resolved: boolean
  platformRank: number
  depth: number
  categoryRank: number
  withinRank: number
  selfStateSpecificity: number
  atomCount: number
  atomKinds: number[]
  atomRanks: number[]
  atomNames: string[]
}

function createConditionCursor(): ConditionCursor {
  return {
    key: '',
    condition: 0,
    active: true,
    emit: true,
    selector: '',
    wrappers: [],
    theme: '',
    enter: false,
    exit: false,
    platformPseudo: false,
    unsupportedState: '',
    unresolvedName: '',
    resolved: true,
    platformRank: 0,
    depth: 0,
    categoryRank: 0,
    withinRank: 0,
    selfStateSpecificity: 0,
    atomCount: 0,
    atomKinds: [],
    atomRanks: [],
    atomNames: [],
  }
}

// stack-disciplined pool: acquire on the way into a scan or probe, release by
// watermark on the way out. Reentrant passes nest above the outer watermark.
const conditionCursorPool: ConditionCursor[] = []
let conditionCursorTop = 0

function acquireConditionCursor(parent: ConditionCursor | null): ConditionCursor {
  let cursor = conditionCursorPool[conditionCursorTop]
  if (!cursor) {
    cursor = createConditionCursor()
    conditionCursorPool[conditionCursorTop] = cursor
  }
  conditionCursorTop++
  resetConditionCursor(cursor, parent)
  return cursor
}

function releaseConditionCursors(watermark: number) {
  // clear released cursors so no string or authored-source reference survives
  // the frame that owned it: the pool keeps only empty shells and capacity
  for (let index = watermark; index < conditionCursorTop; index++) {
    const cursor = conditionCursorPool[index]
    cursor.key = ''
    cursor.selector = ''
    cursor.theme = ''
    cursor.unsupportedState = ''
    cursor.unresolvedName = ''
    cursor.wrappers.length = 0
    cursor.atomNames.length = 0
    cursor.atomKinds.length = 0
    cursor.atomRanks.length = 0
    cursor.atomCount = 0
  }
  conditionCursorTop = watermark
}

function copyConditionCursor(target: ConditionCursor, source: ConditionCursor) {
  target.key = source.key
  target.condition = source.condition
  target.active = source.active
  target.emit = source.emit
  target.selector = source.selector
  target.wrappers.length = 0
  for (let index = 0; index < source.wrappers.length; index++) {
    target.wrappers[index] = source.wrappers[index]
  }
  target.theme = source.theme
  target.enter = source.enter
  target.exit = source.exit
  target.platformPseudo = source.platformPseudo
  target.unsupportedState = source.unsupportedState
  target.unresolvedName = source.unresolvedName
  target.resolved = source.resolved
  target.platformRank = source.platformRank
  target.depth = source.depth
  target.categoryRank = source.categoryRank
  target.withinRank = source.withinRank
  target.selfStateSpecificity = source.selfStateSpecificity
  target.atomCount = source.atomCount
  for (let index = 0; index < source.atomCount; index++) {
    target.atomKinds[index] = source.atomKinds[index]
    target.atomRanks[index] = source.atomRanks[index]
    target.atomNames[index] = source.atomNames[index]
  }
}

function resetConditionCursor(cursor: ConditionCursor, parent: ConditionCursor | null) {
  if (parent) {
    copyConditionCursor(cursor, parent)
    return
  }
  cursor.key = ''
  cursor.condition = 0
  cursor.active = true
  cursor.emit = true
  cursor.selector = ''
  cursor.wrappers.length = 0
  cursor.theme = ''
  cursor.enter = false
  cursor.exit = false
  cursor.platformPseudo = false
  cursor.unsupportedState = ''
  cursor.unresolvedName = ''
  cursor.resolved = true
  cursor.platformRank = 0
  cursor.depth = 0
  cursor.categoryRank = 0
  cursor.withinRank = 0
  cursor.selfStateSpecificity = 0
  cursor.atomCount = 0
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
  // a duplicate modifier contributes nothing further: dedupe against the
  // recorded atoms (their canonical names are unique per atom), never by
  // rebuilding identity text
  for (let index = 0; index < cursor.atomCount; index++) {
    if (cursor.atomNames[index] === name) return
  }

  const atomIndex = cursor.atomCount++
  cursor.atomKinds[atomIndex] = kind
  cursor.atomRanks[atomIndex] = rank
  cursor.atomNames[atomIndex] = name

  if (kind === modifierKindPlatform) {
    if (rank > cursor.platformRank) cursor.platformRank = rank
    const matches = platformMatches(name)
    cursor.active &&= matches
    cursor.emit &&= matches
    return
  }
  cursor.depth++
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
  if (nextCategory > cursor.categoryRank) {
    cursor.categoryRank = nextCategory
    cursor.withinRank = rank
  } else if (nextCategory === cursor.categoryRank && rank > cursor.withinRank) {
    cursor.withinRank = rank
  }

  const buildCSS = canGenerateCSS && state.flatShouldDoClasses

  if (kind === modifierKindMedia) {
    const query = getConfigRevisionState(state.conf).mediaQueries[name]
    if (!query) {
      cursor.resolved = false
      cursor.unresolvedName ||= name
      return
    }
    if (buildCSS) cursor.wrappers.push(`@media ${query}`)
    cursor.active &&= !!state.flatMediaState?.[name]
    ;(state.flatMediaKeys ||= new Set()).add(name)
  } else if (kind === modifierKindTheme) {
    cursor.theme = name
    if (buildCSS) cursor.selector += `:where(.t_${name}, .t_${name} *)`
    cursor.active &&=
      state.flatThemeName === name || state.flatThemeName?.startsWith(`${name}_`) === true
  } else if (kind === 5) {
    // name is canonical: `group-<state>` or `group-<state>/<name>`
    const slash = name.indexOf('/')
    const groupName = slash === -1 ? 'true' : name.slice(slash + 1)
    const stateSelector = stateModifierSelectors[rank]
    const conditionStateName = canonicalStateModifierNames[rank]
    if (buildCSS) {
      cursor.selector += `:where(.t_group_${groupName}${stateSelector} *)`
      if (rank === 0) cursor.wrappers.push('@media (hover: hover)')
    }
    const component = state.componentState.group?.[groupName]
    const context = state.flatGroupContext?.[groupName]
    cursor.active &&= !!(component?.pseudo ?? context?.state.pseudo)?.[conditionStateName]
    ;(state.flatGroupKeys ||= new Set()).add(groupName)
  } else if (kind === 6) {
    // name is canonical: `@<size>` or `@<size>/<name>`
    const slash = name.indexOf('/')
    const containerSize = name.slice(1, slash === -1 ? name.length : slash)
    const containerName = slash === -1 ? '' : name.slice(slash + 1)
    const containerQuery = getConfigRevisionState(state.conf).mediaQueries[containerSize]
    const groupKey = `@${containerName}`
    if (buildCSS) {
      cursor.wrappers.push(
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
    cursor.active &&=
      match === undefined
        ? !!(context?.state.layout && mediaKeyMatch(containerSize, context.state.layout))
        : !!match
    ;(state.flatGroupKeys ||= new Set()).add(groupKey)
    ;(state.flatGroupMedia ||= new Set()).add(containerSize)
  } else {
    const stateSelector = stateModifierSelectors[rank]
    cursor.selfStateSpecificity++
    if (!isWeb && stateSelector[0] === '[' && name !== 'disabled') {
      cursor.unsupportedState = name
    }
    if (rank === 6) cursor.enter = true
    else if (rank === 7) cursor.exit = true
    else if (rank === 0 || rank === 2 || rank === 4) cursor.platformPseudo = true
    if (buildCSS) {
      if (stateSelector[0] === '.') {
        cursor.selector += `:is(${stateSelector}, ${stateSelector} *)`
      } else {
        cursor.selector += stateSelector
      }
      if (rank === 0) cursor.wrappers.push('@media (hover: hover)')
    }
    const component = state.componentState
    cursor.active &&=
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
  cursor.resolved = false
  cursor.unresolvedName ||= modifier
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
      cursor.resolved = false
      return
    }
    if (!cursor.resolved) return
    resolveConditionModifier(state, cursor, text.slice(start, index))
    start = index + 1
  }
}

/** pack the accumulated cursor into the condition number, enforcing depth */
function commitConditionCursor(state: GetStyleState, cursor: ConditionCursor): number {
  if (!cursor.resolved) {
    cursor.condition = 0
    return 0
  }
  // the canonical identity materializes once per committed clause: the
  // smallest unused atom name joins next (selection over at most six names,
  // no intermediate collections)
  if (cursor.atomCount === 1) {
    cursor.key = cursor.atomNames[0]
  } else {
    let key = ''
    let previous = ''
    for (let picked = 0; picked < cursor.atomCount; picked++) {
      let smallest = ''
      for (let index = 0; index < cursor.atomCount; index++) {
        const name = cursor.atomNames[index]
        if (previous && name <= previous) continue
        if (!smallest || name < smallest) smallest = name
      }
      key = picked === 0 ? smallest : `${key}:${smallest}`
      previous = smallest
    }
    cursor.key = key
  }
  if (cursor.depth > 5) {
    throw new Error(
      `a flat value clause supports at most 5 non-platform conditions; received ${cursor.depth} in "${cursor.key}:"`
    )
  }
  const precedence =
    (cursor.platformRank << 26) |
    (cursor.depth << 23) |
    (cursor.categoryRank << 20) |
    cursor.withinRank
  cursor.condition =
    precedence * 256 +
    cursor.selfStateSpecificity * 32 +
    16 +
    (cursor.active ? 1 : 0) +
    (cursor.emit ? 2 : 0) +
    (cursor.enter ? 4 : 0) +
    (cursor.exit ? 8 : 0)
  return cursor.condition
}

// compound-arena payload: condition snapshots for matched conditional
// branches, addressed by index from arena nodes. Module-resident but strictly
// pass-scoped: forEachPropInForwardOrder watermarks and releases them with the
// arena. Index 0 is the unconditional branch.
const conditionSnapshots: ConditionCursor[] = [createConditionCursor()]
let conditionSnapshotTop = 1

function snapshotCondition(cursor: ConditionCursor): number {
  const id = conditionSnapshotTop++
  let target = conditionSnapshots[id]
  if (!target) {
    target = createConditionCursor()
    conditionSnapshots[id] = target
  }
  copyConditionCursor(target, cursor)
  return id
}

function releaseConditionSnapshots(base: number) {
  for (let index = base; index < conditionSnapshotTop; index++) {
    const snapshot = conditionSnapshots[index]
    snapshot.key = ''
    snapshot.selector = ''
    snapshot.theme = ''
    snapshot.unsupportedState = ''
    snapshot.unresolvedName = ''
    snapshot.wrappers.length = 0
    snapshot.atomNames.length = 0
    snapshot.atomKinds.length = 0
    snapshot.atomRanks.length = 0
    snapshot.atomCount = 0
  }
  conditionSnapshotTop = base
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
  const a = conditionSnapshots[first]
  const b = conditionSnapshots[second]
  const id = conditionSnapshotTop++
  let target = conditionSnapshots[id]
  if (!target) {
    target = createConditionCursor()
    conditionSnapshots[id] = target
  }
  copyConditionCursor(target, a)
  for (let index = 0; index < b.atomCount; index++) {
    accumulateConditionAtom(
      state,
      target,
      b.atomKinds[index],
      b.atomRanks[index],
      b.atomNames[index]
    )
  }
  // the key materializes at commit, so commit before deciding whether the
  // composition collapsed into one of its inputs
  commitConditionCursor(state, target)
  if (target.key === a.key) {
    conditionSnapshotTop = id
    return first
  }
  if (target.key === b.key) {
    conditionSnapshotTop = id
    return second
  }
  return id
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
  const indexes = state.flatCompoundIndexes
  const stateStart = state.flatCompoundStateStart
  const epoch = state.flatCompoundEpoch
  const key = state.flatCompoundKey
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
    if (!chainValid || !cursor || !cursor.resolved || !cursor.condition) {
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
      cursor = state.flatScanCursor = acquireConditionCursor(null)
    } else if (first) {
      resetConditionCursor(cursor, null)
    }
    if (!valid) {
      cursor.resolved = false
      return
    }
    if (cursor.resolved) {
      resolveConditionModifier(state, cursor, source.slice(start, end))
    }
  },
  chain(state, _start, _end, valid) {
    const cursor = state.flatScanCursor
    if (cursor) {
      if (!valid) cursor.resolved = false
      if (cursor.resolved) commitConditionCursor(state, cursor)
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
  state: DirectState,
  key: string,
  value: any,
  indexes: number[] | undefined,
  stateStart: number,
  epoch: number,
  contribute: (
    key: string,
    value: any,
    compoundIndexes?: number[],
    compoundStateStart?: number,
    compoundEpoch?: number,
    parentConditionId?: number
  ) => void
) {
  if (!indexes) return
  let needsScan = false
  for (let index = 0; index < indexes.length; index++) {
    const stateIndex = stateStart + indexes[index] * compoundStateWidth
    if (!compoundArena[stateIndex + compoundScanned]) {
      needsScan = true
      break
    }
  }
  if (needsScan) {
    const previousIndexes = state.flatCompoundIndexes
    const previousKey = state.flatCompoundKey
    const previousStateStart = state.flatCompoundStateStart
    const previousEpoch = state.flatCompoundEpoch
    state.flatCompoundIndexes = indexes
    state.flatCompoundKey = key
    state.flatCompoundStateStart = stateStart
    state.flatCompoundEpoch = epoch
    try {
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
            const cursor = acquireConditionCursor(null)
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
    } finally {
      state.flatCompoundIndexes = previousIndexes
      state.flatCompoundKey = previousKey
      state.flatCompoundStateStart = previousStateStart
      state.flatCompoundEpoch = previousEpoch
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
        contribute(
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
  isChain?: (chain: string) => boolean
): number {
  if (Object.prototype.hasOwnProperty.call(value, 'default')) return -1
  for (const key in value) {
    if (!key.length) return 0
    if (!state) return isChain?.(key) ? 1 : 0
    const watermark = conditionCursorTop
    const cursor = acquireConditionCursor(null)
    resolveConditionText(state, cursor, key)
    const condition = commitConditionCursor(state, cursor)
    releaseConditionCursors(watermark)
    return condition
  }
  return 0
}

type OrderedPropEntry = readonly [string, any]

interface StyledDefaultEntry {
  key: string
  value: any
  /** definition-time: the value is a clause program (string with a clause cut
   * or a conditional-capable object), so displacement re-injects it upfront */
  program: boolean
  /** the key contributes styles on this component (style prop or shorthand) */
  styleLike: boolean
}

// Styled defaults computed once per static config. mergeComponentProps replaces
// defaults at the prop level, but flat programs merge per clause slot: either a
// conditioned default or a conditioned prop therefore needs the displaced
// styled value re-injected at the styled-base position. This is what preserves
// `styled(View, { flexDirection: 'row' })` under `sm:column`.
const styledDefaultsCache = new WeakMap<object, StyledDefaultEntry[] | null>()
const styledDefaultsByKeyCache = new WeakMap<
  object,
  Record<string, StyledDefaultEntry> | null
>()

function getStyledDefaults(
  staticConfig: StaticConfig,
  shorthands: Record<string, string>
): StyledDefaultEntry[] | null {
  let entries = styledDefaultsCache.get(staticConfig)
  if (entries === undefined) {
    entries = null
    const defaults = staticConfig.defaultProps
    if (defaults) {
      for (const key in defaults) {
        const value = defaults[key]
        ;(entries ||= []).push({
          key,
          value,
          program: maybeStyleProgram(value),
          styleLike: key in stylePropsAll || key in shorthands,
        })
      }
    }
    styledDefaultsCache.set(staticConfig, entries)
  }
  return entries
}

/** displaced plain style defaults by prop key, for the post-scan weak path */
function getStyledDefaultsByKey(
  staticConfig: StaticConfig,
  shorthands: Record<string, string>
): Record<string, StyledDefaultEntry> | null {
  let byKey = styledDefaultsByKeyCache.get(staticConfig)
  if (byKey === undefined) {
    byKey = null
    const entries = getStyledDefaults(staticConfig, shorthands)
    if (entries) {
      for (let index = 0; index < entries.length; index++) {
        const entry = entries[index]
        if (!entry.styleLike || entry.program) continue
        ;(byKey ||= Object.create(null) as Record<string, StyledDefaultEntry>)[
          entry.key
        ] = entry
      }
    }
    styledDefaultsByKeyCache.set(staticConfig, byKey)
  }
  return byKey
}

// definition-time only: render never rescans a value to ask this
const maybeStyleProgram = (value: any): boolean =>
  typeof value === 'string'
    ? value.indexOf(':') !== -1
    : !!value && typeof value === 'object' && !Array.isArray(value) && !isVariable(value)

function contributeDisplacedStyledDefaults(
  styledDefaults: StyledDefaultEntry[] | null,
  processedProps: Record<string, any>,
  contribute: (key: string, value: any) => void
) {
  if (!styledDefaults) return
  for (let index = 0; index < styledDefaults.length; index++) {
    const entry = styledDefaults[index]
    if (!entry.styleLike || !entry.program) continue
    const propValue = processedProps[entry.key]
    // equal means the default flowed through the merge untouched and will be
    // processed as an ordinary prop entry; different means a call-site value
    // displaced it, and a displaced PROGRAM default re-injects at the styled
    // position so its clause slots survive the caller's base. A displaced
    // plain default matters only when the displacing prop itself carries
    // clauses, which the prop's own scan discovers — see the weak injection
    // in forEachPropInForwardOrder.
    if (propValue !== undefined && propValue !== entry.value) {
      contribute(entry.key, entry.value)
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
  styleState: GetStyleState,
  shorthands: Record<string, string>,
  contribute: (
    key: string,
    value: any,
    compoundIndexes?: number[],
    compoundStateStart?: number,
    compoundEpoch?: number,
    parentConditionId?: number
  ) => void
) {
  const processedBaseStyle = staticConfig.baseStyle
  const styledDefaults = getStyledDefaults(staticConfig, shorthands)
  const displacedPlainDefaults = getStyledDefaultsByKey(staticConfig, shorthands)
  const directState = styleState as DirectState
  const preparedCompounds = (staticConfig as StaticConfigWithPreparedCompounds)[
    preparedCompoundsKey
  ]

  // a displaced PLAIN styled default matters only when the displacing prop's
  // own scan discovered a clause: re-contribute it weakly (create-only slot
  // writes) so its base survives under the prop's conditions without any
  // pre-scan of the authored value
  const weakInjectDisplacedDefault = (key: string, value: any) => {
    const entry = displacedPlainDefaults![key]
    if (!entry || value === entry.value || value === undefined) return
    directState.flatWeakContribution = true
    try {
      contribute(key, entry.value)
    } finally {
      directState.flatWeakContribution = false
    }
  }

  if (!preparedCompounds) {
    if (processedBaseStyle) {
      for (const key in processedBaseStyle) contribute(key, processedBaseStyle[key])
    }
    contributeDisplacedStyledDefaults(styledDefaults, processedProps, contribute)
    for (const key in processedProps) {
      const value = processedProps[key]
      directState.flatPropSawCondition = false
      contribute(key, value)
      if (displacedPlainDefaults && directState.flatPropSawCondition) {
        weakInjectDisplacedDefault(key, value)
      }
    }
    return
  }

  const arenaBase = compoundArenaTop
  const conditionBase = conditionSnapshotTop
  const compoundVariants = staticConfig.compoundVariants!
  const stateStart = reserveCompoundArena(compoundVariants.length * compoundStateWidth)
  const epoch = ++compoundArenaEpoch
  try {
    if (processedBaseStyle) {
      for (const key in processedBaseStyle) contribute(key, processedBaseStyle[key])
    }
    contributeDisplacedStyledDefaults(styledDefaults, processedProps, contribute)
    const selectorCounts = preparedCompounds[preparedCompoundsKey]
    for (
      let compoundIndex = 0;
      compoundIndex < compoundVariants.length;
      compoundIndex++
    ) {
      if (selectorCounts[compoundIndex]) continue
      const style = compoundVariants[compoundIndex].style
      if (!isPlainObject(style)) continue
      for (const key in style) contribute(key, style[key])
    }
    for (const key in processedProps) {
      const compoundIndexes = preparedCompounds[key]
      const value = processedProps[key]
      beginCompoundEdges(compoundIndexes, stateStart, epoch)
      directState.flatPropSawCondition = false
      contribute(key, value, compoundIndexes, stateStart, epoch)
      if (displacedPlainDefaults && directState.flatPropSawCondition) {
        weakInjectDisplacedDefault(key, value)
      }
      finishCompoundEdges(
        styleState as DirectState,
        key,
        value,
        compoundIndexes,
        stateStart,
        epoch,
        contribute
      )
    }
  } finally {
    releaseConditionSnapshots(conditionBase)
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
  const driverIsReactNative = Boolean(driver?.isReactNative)
  const resolvedDriver = driver?.isStub ? null : (driver as AnimationDriver | null)

  if (props.passThrough) {
    return null
  }

  // a bit icky, we need no normalize but not fully
  if (isWeb && styleProps.isAnimated && driverIsReactNative && !styleProps.noNormalize) {
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

  let shouldDoClasses =
    !process.env.TAMAGUI_DID_OUTPUT_CSS &&
    acceptsClassName &&
    isWeb &&
    !styleProps.noClass

  const rulesToInsert: RulesToInsert =
    process.env.TAMAGUI_TARGET === 'native' ? (undefined as any) : {}
  const classNames: ClassNamesObject = {}
  const needsCssStyles = isReactNative || (styleProps.isAnimated && driverIsReactNative)
  let transportedRawClasses: Record<string, string> | undefined

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
  let className = ''
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
  const processedProps = props
  const parentVariants = parentStaticConfig?.variants
  const defaultProps = asChild ? getDefaultProps(staticConfig) : undefined
  const shouldSkipDirectProps = !noSkip && !isHOC
  const shouldCheckSkipProps = !noSkip
  const asChildExceptStyleLike =
    asChild === 'except-style' || asChild === 'except-style-web'
  const isTextOrInput = isText || isInput
  const hocParentVariants = isHOC ? parentVariants : undefined
  const canResolveContextPrograms = !isHOC
  const animatedOrHOCUsesReactNativeDriver = (isAnimated || isHOC) && driverIsReactNative
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

  const mergeStylePropAtCurrentPosition = (styleProp: any) => {
    if (!styleProp) return
    if (noMergeStyle) {
      viewProps.style = styleProp
      return
    }
    const isArray = Array.isArray(styleProp)
    const length = isArray ? styleProp.length : 1
    for (let index = 0; index < length; index++) {
      const style = isArray ? styleProp[index] : styleProp
      if (!style) continue
      if (style['$$css']) {
        // a tamagui parent (HOC output) attaches its property→class map
        // non-enumerably. merging through it puts each class in the same
        // per-property slot as ordinary contributions: it displaces anything
        // contributed before this style prop's position, and a later authored
        // prop for the same property displaces it. entries outside the map
        // (identity classes like is_View) merge by name as before
        const classProps = style[TAMAGUI_CLASS_PROPS] as
          | Record<string, string>
          | undefined
        if (classProps) {
          const mapped = new Set<string>()
          for (const property in classProps) {
            clearDirectStyle(styleState, property)
            styleState.classNames[property] = classProps[property]
            mapped.add(classProps[property])
          }
          for (const key in style) {
            if (key === '$$css' || mapped.has(key)) continue
            styleState.classNames[key] = style[key]
          }
        } else {
          for (const key in style) clearDirectStyle(styleState, key)
          Object.assign(styleState.classNames, style)
        }
        continue
      }
      const normalized = normalizeStyle(style, false, true)
      const styleOriginals = shouldTrackStyleTokenProvenance
        ? styleOriginalValues.get(style)
        : undefined
      for (const key in normalized) {
        if (normalized[key] == null) continue
        if (process.env.TAMAGUI_TARGET === 'web') {
          if (
            key === 'containerName' &&
            typeof normalized[key] === 'string' &&
            normalized[key].indexOf(':') === -1
          ) {
            containerName = normalized[key]
          }
          if (
            key === 'containerType' &&
            typeof normalized[key] === 'string' &&
            normalized[key].indexOf(':') === -1
          ) {
            containerType = normalized[key]
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
  }

  const flushForwardStylesToClasses = () => {
    if (!shouldDoClasses) return
    completeFrameCSS(styleState)
    flushDirectStyles(styleState, true)
  }

  function contributeClassName(source: string) {
    const getClassPlan = styleFrontend?.getClassPlan
    let start = 0
    for (let index = 0; index <= source.length; index++) {
      if (index !== source.length && source.charCodeAt(index) > 32) continue
      if (index === start) {
        start = index + 1
        continue
      }
      const candidate = source.slice(start, index)
      const plan = getClassPlan ? getClassPlan(candidate, conf) : 'raw'
      if (plan === null) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            `[tamagui] frontend candidate "${candidate}" is unavailable on this platform and was dropped.`
          )
        }
      } else if (plan === 'raw') {
        className = className ? `${className} ${candidate}` : candidate
        if (needsCssStyles) {
          transportedRawClasses ||= {}
          transportedRawClasses[candidate] = candidate
        }
        // a frontend's unclaimed candidate is an earlier generated layer, so
        // later Tamagui contributions stay inline to keep their cascade
        // position. Core className is raw interop and flips nothing.
        if (getClassPlan) {
          flushForwardStylesToClasses()
          shouldDoClasses = false
          styleState.flatShouldDoClasses = false
        }
      } else {
        const parentPlan = plan as {
          entries: readonly (readonly [
            property: string,
            value: unknown,
            condition?: string,
            modifiers?: readonly string[],
          ])[]
          preserveRawClass: boolean
        }
        if (!Array.isArray(plan) && parentPlan.preserveRawClass) {
          className = className ? `${className} ${candidate}` : candidate
          if (needsCssStyles) {
            transportedRawClasses ||= {}
            transportedRawClasses[candidate] = candidate
          }
          flushForwardStylesToClasses()
          shouldDoClasses = false
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
            contributeProp(entry[0], entry[1])
          }
        }
      }
      start = index + 1
    }
  }

  if (staticPassthroughClassName) contributeClassName(staticPassthroughClassName)

  // ONE forward pass over the props. the body is a closure so base style,
  // displaced styled defaults and the props themselves feed it directly from
  // their own objects — nothing is copied into an intermediate list first.
  const contributePropBody = (keyOg: string, valOg: any) => {
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
        contributeClassName(valInit)
        if (props[HOC_CLASSNAME_MARKER] !== undefined) {
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
        containerValue = valInit
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
    if (isWeb) {
      // react-native-web filters direct data-* props, including when its
      // Animated.View replaces the final host. dataSet is its supported path.
      if (
        (isReactNative ||
          (isAnimated && driverIsReactNative && !driver?.View?.acceptRenderProp)) &&
        keyInit.startsWith('data-')
      ) {
        keyInit = keyInit.replace('data-', '')
        viewProps.dataSet ||= {}
        viewProps.dataSet[keyInit] = valInit
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
            if (animatedOrHOCUsesReactNativeDriver) {
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

    contributeMappedValue(
      keyInit,
      valInit,
      styleState,
      disablePropMap,
      (key, val, originalVal, condition) => {
        const isStyledContextProp =
          styledContextKeys?.has(key) || (styledContext && key in styledContext)

        if (key === 'className') {
          if (process.env.TAMAGUI_TARGET === 'web' && typeof val === 'string' && val) {
            className = `${className} ${val}`.trim()
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
        const isContextProgramKey =
          canResolveContextPrograms && Boolean(isStyledContextProp)

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
            const structured = addStructuredClause(
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

        isVariant = variants && key in variants

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
    )

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

  const contributeProp = (
    key: string,
    value: any,
    compoundIndexes?: number[],
    compoundStateStart?: number,
    compoundEpoch?: number,
    parentConditionId?: number
  ) => {
    const compoundState = styleState as DirectState
    const previousIndexes = compoundState.flatCompoundIndexes
    const previousKey = compoundState.flatCompoundKey
    const previousStateStart = compoundState.flatCompoundStateStart
    const previousEpoch = compoundState.flatCompoundEpoch
    const previousParent = compoundState.flatParentCursor
    compoundState.flatCompoundIndexes = compoundIndexes
    compoundState.flatCompoundKey = key
    compoundState.flatCompoundStateStart = compoundStateStart
    compoundState.flatCompoundEpoch = compoundEpoch
    compoundState.flatParentCursor = parentConditionId
      ? conditionSnapshots[parentConditionId]
      : null
    try {
      contributePropBody(key, value)
    } finally {
      compoundState.flatCompoundIndexes = previousIndexes
      compoundState.flatCompoundKey = previousKey
      compoundState.flatCompoundStateStart = previousStateStart
      compoundState.flatCompoundEpoch = previousEpoch
      compoundState.flatParentCursor = previousParent
    }
  }

  forEachPropInForwardOrder(
    processedProps,
    staticConfig,
    styleState,
    shorthands,
    contributeProp
  )

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
        if (isWeb && (isReactNative ? driverInputStyle !== 'css' : true)) {
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
      !noNormalize &&
      !isReactNative &&
      !isHOC &&
      (!isAnimated || driverInputStyle === 'css')

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
  if (styleState.flatHasEnterStyle) result.hasEnterStyle = true
  if (styleState.flatHasPlatformPseudo) result.platformPseudo = true

  if (!noMergeStyle) {
    if (!asChildExceptStyleLike) {
      const style = styleState.style

      if (process.env.TAMAGUI_TARGET === 'web') {
        // merge className and style back into viewProps:
        // only emit font class if fontFamily was explicitly in props (not from defaults)
        const fontFamily = isText || isInput ? styleState.fontFamily : null
        const fontFamilyClassName = fontFamily ? `font_${fontFamily}` : ''
        const groupClassName = props.group ? `t_group_${props.group}` : ''
        const displayName = styleProps.displayName
        let validDisplayName = Boolean(
          !props.asChild &&
          displayName &&
          displayName !== 'Text' &&
          displayName !== 'View'
        )
        if (validDisplayName) {
          for (let index = 0; index < displayName!.length; index++) {
            const code = displayName!.charCodeAt(index)
            if (
              !(
                code === 95 ||
                code === 45 ||
                (code >= 48 && code <= 57 && index > 0) ||
                (code >= 65 && code <= 90) ||
                (code >= 97 && code <= 122)
              )
            ) {
              validDisplayName = false
              break
            }
          }
        }
        const displayNameClassName = validDisplayName ? `is_${displayName}` : ''

        let finalClassName = displayNameClassName
        // is_View gets base flex styles + font reset, is_Text gets base text styles
        const baseClassName = isText ? 'is_Text' : 'is_View'
        finalClassName = finalClassName
          ? `${finalClassName} ${baseClassName}`
          : baseClassName
        if (fontFamilyClassName) finalClassName += ` ${fontFamilyClassName}`
        if (classNames) {
          for (const key in classNames) {
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
        } else if (needsCssStyles) {
          // RNW or RNW-animated: apply classNames via $$css. keys stay class
          // names (createDOMProps flattens by key and classifies on the _
          // prefix), but a tamagui consumer merging this via its style prop
          // needs each class's property to slot it into per-property position
          // competition, so the property→class map rides along non-enumerably
          // (invisible to RNW's for-in flatten)
          const cnStyles: Record<string, unknown> = { $$css: true }
          if (displayNameClassName) cnStyles[displayNameClassName] = displayNameClassName
          cnStyles[baseClassName] = baseClassName
          if (fontFamilyClassName) cnStyles[fontFamilyClassName] = fontFamilyClassName
          for (const key in classNames) cnStyles[classNames[key]] = classNames[key]
          if (groupClassName) cnStyles[groupClassName] = groupClassName
          if (transportedRawClasses) {
            for (const name in transportedRawClasses) cnStyles[name] = name
          }
          if (cnStyles && classNames) {
            Object.defineProperty(cnStyles, TAMAGUI_CLASS_PROPS, {
              value: classNames,
              enumerable: false,
            })
          }
          viewProps.style = [...(Array.isArray(style) ? style : [style]), cnStyles]
        } else {
          // regular web: use className directly
          if (finalClassName) {
            if (isHOC) viewProps[HOC_CLASSNAME_MARKER] = ''
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
  flatFrame?: Record<string, StyleFrameEntry[]>
  flatAtomics?: Record<string, unknown>
  flatBoxShadow?: any
  flatDynamicColors?: Record<string, Record<string, any>>
  flatDynamicThemeAccess?: boolean
  flatTextShadow?: Record<string, any>
  flatWebShadow?: Record<string, any>
  flatCompoundEpoch?: number
  flatCompoundIndexes?: number[]
  flatCompoundKey?: string
  flatCompoundStateStart?: number
  flatParentCursor?: ConditionCursor | null
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
  condition: number,
  identity: string,
  wrappers: string[] | undefined,
  selector: string,
  original: any,
  forceCSS: boolean,
  normalize = false
) {
  const direct = state as DirectState
  const weak = direct.flatWeakContribution === true
  const frame = (direct.flatFrame ||= {})
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
    selector,
    wrappers: wrappers && wrappers.length ? wrappers.slice() : undefined,
    original,
    forceCSS,
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
    !(canGenerateCSS && state.flatShouldDoClasses && state.transformAccumulator)
  ) {
    return
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
  const parent = (state as DirectState).flatParentCursor
  emitValue(
    state,
    property,
    value,
    parent ? parent.condition : 0,
    parent ? parent.key : '',
    parent && parent.wrappers.length ? parent.wrappers : undefined,
    parent ? parent.selector : '',
    parent ? parent.theme : '',
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
  const condition = cursor.condition
  // a real conditional clause reached emission intent (active or not): the
  // prop loop uses this to restore a displaced plain styled default
  if (merge && property && condition) {
    ;(state as DirectState).flatPropSawCondition = true
  }
  if (!cursor.resolved) {
    if (warnMode && process.env.NODE_ENV === 'development') {
      warnRefusedValue(
        property!,
        warnSource,
        `unknown modifier "${cursor.unresolvedName}"`
      )
    }
    return 0
  }
  if (warnMode && cursor.unsupportedState && process.env.NODE_ENV === 'development') {
    warnOnce(
      `${property}: "${cursor.unsupportedState}:" has no native component-state source; dropping the clause`
    )
  }
  if (
    merge &&
    property &&
    condition & 2 &&
    (condition & 1 ||
      (canGenerateCSS && state.flatShouldDoClasses) ||
      (warnMode === 1 &&
        !isWeb &&
        cursor.theme &&
        supportsDynamicColorIOS &&
        isColorStyleKey(property)))
  ) {
    emitValue(
      state,
      property,
      value,
      condition,
      cursor.key,
      cursor.wrappers.length ? cursor.wrappers : undefined,
      cursor.selector,
      cursor.theme,
      merge,
      // the variant path (warnMode 2) forwards its tracked original verbatim;
      // the direct paths fall back to the payload itself so consumers like the
      // iOS dynamic-color scheme keep the authored spelling
      warnMode === 2 ? originalValue : (originalValue ?? value),
      contextOnly
    )
    if (cursor.enter) state.flatHasEnterStyle = true
    if (cursor.platformPseudo) state.flatHasPlatformPseudo = true
  } else if (merge && property && condition & 2) {
    // not emitting here, but the clause is real: lifecycle and platform-pseudo
    // discovery must still see it
    if (cursor.enter) state.flatHasEnterStyle = true
    if (cursor.platformPseudo) state.flatHasPlatformPseudo = true
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
      : cursor.resolved
        ? cursor.condition
        : 0
    feedCompoundSegment(
      directState,
      source,
      start,
      end,
      false,
      valid && Boolean(condition),
      condition && directState.flatCompoundIndexes ? snapshotCondition(cursor) : 0
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
        directState.flatParentCursor || null
      )
    } else if (first) {
      resetConditionCursor(cursor, directState.flatParentCursor || null)
    }
    if (!valid) {
      cursor.resolved = false
      return
    }
    if (cursor.resolved) {
      resolveConditionModifier(state, cursor, source.slice(start, end))
    }
  },
  chain(state, _start, _end, valid) {
    const cursor = (state as DirectState).flatScanCursor
    if (cursor) {
      if (!valid) cursor.resolved = false
      if (cursor.resolved) commitConditionCursor(state, cursor)
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

const webShadowParts = new Set([
  'shadowColor',
  'shadowOffset',
  'shadowOpacity',
  'shadowRadius',
])

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
    isWeb && !state.flatShouldDoClasses && state.styleProps.resolveValues === 'auto'
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
    value = isWeb
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
  condition: number,
  conditionKey: string,
  conditionWrappers: string[] | undefined,
  conditionSelector: string,
  conditionTheme: string,
  merge: MergeStyle,
  originalValue: any,
  contextOnly: boolean
) {
  const direct = state as DirectState
  if (condition & 4) (state.flatEnterKeys ||= new Set()).add(property)
  if (condition & 8) (state.flatExitKeys ||= new Set()).add(property)

  if (!isWeb && conditionTheme) {
    if (supportsDynamicColorIOS && isColorStyleKey(property)) {
      const schemes = ((direct.flatDynamicColors ||= {})[property] ||= {})
      schemes[conditionTheme] =
        typeof originalValue === 'string' && isAsciiLetters(originalValue)
          ? originalValue
          : value
      frameWrite(
        state,
        property,
        { dynamic: { ...schemes } },
        // a DynamicColorIOS aggregate applies on every scheme: force the
        // active bit by addition — the packed condition exceeds Int32, so a
        // bitwise write would corrupt it
        condition & 1 ? condition : condition + 1,
        conditionKey,
        undefined,
        '',
        originalValue,
        false,
        true
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
    !state.animationDriver?.isReactNative &&
    property in nonAnimatableStyleProps

  if (canGenerateCSS && (state.flatShouldDoClasses || shouldPromoteAnimatedStyle)) {
    if (!condition) {
      if (state.style) delete state.style[property]
    }
    frameWrite(
      state,
      property,
      value,
      condition,
      conditionKey,
      conditionWrappers,
      conditionSelector,
      originalValue,
      !state.flatShouldDoClasses
    )
    return
  }

  // inline and native: inactive conditions contribute nothing; the rest land
  // in the frame and the completion picks each property's winner
  if (condition && !(condition & 1)) return
  frameWrite(
    state,
    property,
    value,
    condition,
    conditionKey,
    undefined,
    '',
    originalValue,
    false
  )
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
    const code = value.charCodeAt(index) | 32
    if (code !== 37 && (code < 97 || code > 122)) return false
  }
  return true
}

function startsValueFunction(value: string): boolean {
  let index = 0
  while (index < value.length) {
    const code = value.charCodeAt(index)
    if (code === 45 || (code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
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
  condition: number,
  conditionKey: string,
  conditionWrappers: string[] | undefined,
  conditionSelector: string,
  conditionTheme: string,
  merge: MergeStyle,
  originalValue: any,
  contextOnly: boolean
) {
  if (!isWeb && (property === 'borderBlock' || property === 'borderInline')) {
    if (process.env.NODE_ENV === 'development') {
      warnOnce(`RN has no logical border shorthand "${property}"; dropping it`)
    }
    return
  }
  const targets = borderTargets[property]
  let width: string | undefined
  let style: string | undefined
  let color: string | undefined
  for (const part of splitComponents(raw)) {
    const lower = part.toLowerCase()
    if (lineStyles.has(lower) || (property === 'outline' && lower === 'auto')) {
      style = part
    } else if (
      lower === 'thin' ||
      lower === 'medium' ||
      lower === 'thick' ||
      isNumericCSSComponent(part) ||
      startsValueFunction(part)
    ) {
      width = part
    } else {
      color = part
    }
  }
  if (style === 'none' && width === undefined) width = '0'
  if (width !== undefined) {
    for (const target of targets.width) {
      emitResolved(
        state,
        target,
        width,
        condition,
        conditionKey,
        conditionWrappers,
        conditionSelector,
        conditionTheme,
        merge,
        originalValue,
        contextOnly
      )
    }
  }
  if (style !== undefined) {
    const styleTargets = !isWeb && property === 'border' ? ['borderStyle'] : targets.style
    for (const target of styleTargets) {
      emitProperty(
        state,
        target,
        style,
        condition,
        conditionKey,
        conditionWrappers,
        conditionSelector,
        conditionTheme,
        merge,
        originalValue,
        contextOnly
      )
    }
  }
  if (color !== undefined) {
    for (const target of targets.color) {
      emitResolved(
        state,
        target,
        color,
        condition,
        conditionKey,
        conditionWrappers,
        conditionSelector,
        conditionTheme,
        merge,
        originalValue,
        contextOnly
      )
    }
  }
}

function emitTextDecoration(
  state: GetStyleState,
  raw: string,
  condition: number,
  conditionKey: string,
  conditionWrappers: string[] | undefined,
  conditionSelector: string,
  conditionTheme: string,
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
    emitResolved(
      state,
      property,
      part,
      condition,
      conditionKey,
      conditionWrappers,
      conditionSelector,
      conditionTheme,
      merge,
      originalValue,
      contextOnly
    )
  }
}

function emitTransform(
  state: GetStyleState,
  property: string,
  value: any,
  condition: number,
  conditionKey: string,
  conditionWrappers: string[] | undefined,
  conditionSelector: string,
  conditionTheme: string,
  merge: MergeStyle,
  originalValue: any,
  contextOnly: boolean
) {
  if (!canGenerateCSS || !state.flatShouldDoClasses) {
    emitProperty(
      state,
      property,
      value,
      condition,
      conditionKey,
      conditionWrappers,
      conditionSelector,
      conditionTheme,
      merge,
      originalValue,
      contextOnly
    )
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
    emitProperty(
      state,
      target,
      targetValue,
      condition,
      conditionKey,
      conditionWrappers,
      conditionSelector,
      conditionTheme,
      merge,
      originalValue,
      contextOnly
    )
    if (target === '--t-x' || target === '--t-y') addComposition(state, 'translate')
    else if (target.startsWith('--t-scale')) addComposition(state, 'scale')
  }
}

function emitResolved(
  state: GetStyleState,
  property: string,
  raw: string,
  condition: number,
  conditionKey: string,
  conditionWrappers: string[] | undefined,
  conditionSelector: string,
  conditionTheme: string,
  merge: MergeStyle,
  originalValue: any,
  contextOnly: boolean
) {
  let value = configuredValue(state, property, raw)
  if (value === raw) value = resolveEmbeddedTokens(state, property, raw)
  if ((!isWeb || !state.flatShouldDoClasses) && typeof value === 'string') {
    const unitValue = numericUnitValue(value, 'px', 'dp')
    if (Number.isFinite(unitValue)) {
      value = unitValue
    } else if (value !== '' && Number.isFinite(Number(value))) {
      value = Number(value)
    }
  }
  emitProperty(
    state,
    property,
    value,
    condition,
    conditionKey,
    conditionWrappers,
    conditionSelector,
    conditionTheme,
    merge,
    originalValue,
    contextOnly
  )
}

function shadowUnit(part: any) {
  return typeof part === 'number' ? `${part}px` : part || '0px'
}

function emitWebShadow(
  state: DirectState,
  property: string,
  value: any,
  merge: MergeStyle,
  originalValue: any,
  contextOnly: boolean
) {
  const shadow = (state.flatWebShadow ||= {})
  shadow[property] = value
  const offset = shadow.shadowOffset || { width: 0, height: 0 }
  const color = normalizeColor(shadow.shadowColor, shadow.shadowOpacity ?? 1)
  if (!color) return
  const next = `${shadowUnit(offset.width)} ${shadowUnit(offset.height)} ${shadowUnit(shadow.shadowRadius)} ${color}`
  emitProperty(
    state,
    'boxShadow',
    state.flatBoxShadow ? `${state.flatBoxShadow}, ${next}` : next,
    0,
    '',
    undefined,
    '',
    '',
    merge,
    originalValue,
    contextOnly
  )
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
    0,
    '',
    undefined,
    '',
    '',
    merge,
    originalValue,
    contextOnly
  )
}

function emitValue(
  state: GetStyleState,
  property: string,
  raw: any,
  condition: number,
  conditionKey: string,
  conditionWrappers: string[] | undefined,
  conditionSelector: string,
  conditionTheme: string,
  merge: MergeStyle,
  originalValue: any,
  contextOnly: boolean
) {
  if (typeof raw === 'string') {
    raw = raw.trim()
  }

  if (isVariable(raw)) {
    raw = resolveVariableValue(
      property,
      raw,
      isWeb && !state.flatShouldDoClasses && state.styleProps.resolveValues === 'auto'
        ? 'value'
        : state.styleProps.resolveValues
    )
  }

  requestBorderStyleDefault(
    state,
    property,
    condition,
    conditionKey,
    conditionWrappers,
    conditionSelector
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
        condition,
        conditionKey,
        conditionWrappers,
        conditionSelector,
        conditionTheme,
        merge,
        originalValue,
        contextOnly
      )
    } else {
      frameWrite(
        state,
        property,
        value,
        condition,
        conditionKey,
        undefined,
        '',
        originalValue,
        false,
        true
      )
    }
    return
  }

  if (isWeb && webShadowParts.has(property)) {
    const value = typeof raw === 'string' ? configuredValue(state, property, raw) : raw
    if (canGenerateCSS && state.flatShouldDoClasses) {
      emitWebShadow(
        state as DirectState,
        property,
        value,
        merge,
        originalValue,
        contextOnly
      )
    } else {
      frameWrite(
        state,
        property,
        value,
        condition,
        conditionKey,
        undefined,
        '',
        originalValue,
        false,
        true
      )
    }
    return
  }

  if (isWeb && webTextShadowParts.has(property)) {
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
      frameWrite(
        state,
        property,
        value,
        condition,
        conditionKey,
        undefined,
        '',
        originalValue,
        false,
        true
      )
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
    emitBorder(
      state,
      property,
      raw,
      condition,
      conditionKey,
      conditionWrappers,
      conditionSelector,
      conditionTheme,
      merge,
      originalValue,
      contextOnly
    )
    return
  }
  if (typeof raw === 'string' && property === 'textDecoration') {
    emitTextDecoration(
      state,
      raw,
      condition,
      conditionKey,
      conditionWrappers,
      conditionSelector,
      conditionTheme,
      merge,
      originalValue,
      contextOnly
    )
    return
  }
  if (typeof raw === 'string' && property === 'background') {
    const parts = splitComponents(raw)
    if (parts.length === 1 && !startsValueFunction(parts[0])) {
      emitResolved(
        state,
        'backgroundColor',
        parts[0],
        condition,
        conditionKey,
        conditionWrappers,
        conditionSelector,
        conditionTheme,
        merge,
        originalValue,
        contextOnly
      )
      return
    }
    if (!isWeb) {
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
      (!isWeb || !state.flatShouldDoClasses) &&
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
          frameWrite(
            state,
            property,
            FRAME_TOMBSTONE,
            condition,
            conditionKey,
            undefined,
            '',
            undefined,
            false
          )
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
    emitTransform(
      state,
      property,
      value,
      condition,
      conditionKey,
      conditionWrappers,
      conditionSelector,
      conditionTheme,
      merge,
      originalValue,
      contextOnly
    )
    return
  }

  if (isWeb && !state.flatShouldDoClasses && !condition && property === 'borderRadius') {
    // css reads the shorthand, so skip the four-corner expansion here. a string
    // value still needs its token resolved, which is what emitResolved does.
    if (typeof raw === 'string') {
      emitResolved(
        state,
        property,
        raw,
        condition,
        conditionKey,
        conditionWrappers,
        conditionSelector,
        conditionTheme,
        merge,
        originalValue,
        contextOnly
      )
    } else {
      emitProperty(
        state,
        property,
        raw,
        condition,
        conditionKey,
        conditionWrappers,
        conditionSelector,
        conditionTheme,
        merge,
        originalValue,
        contextOnly
      )
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
      emitProperty(
        state,
        property,
        transform,
        condition,
        conditionKey,
        conditionWrappers,
        conditionSelector,
        conditionTheme,
        merge,
        originalValue,
        contextOnly
      )
      return
    }
  }

  let value: any = raw
  if (typeof raw === 'string') {
    value = configuredValue(state, property, raw)
    if (value === raw) value = resolveEmbeddedTokens(state, property, raw)
  }

  if ((!isWeb || !state.flatShouldDoClasses) && typeof value === 'string') {
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
          emitProperty(
            state,
            key,
            parsedValue,
            condition,
            conditionKey,
            conditionWrappers,
            conditionSelector,
            conditionTheme,
            merge,
            originalValue,
            contextOnly
          )
        }
      } else {
        emitProperty(
          state,
          property === 'backgroundImage' ? 'experimental_backgroundImage' : property,
          parsed,
          condition,
          conditionKey,
          conditionWrappers,
          conditionSelector,
          conditionTheme,
          merge,
          originalValue,
          contextOnly
        )
      }
      return
    }
  }

  if (!isWeb && property === 'fontVariant' && typeof value === 'string') {
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
    emitProperty(
      state,
      property,
      value,
      condition,
      conditionKey,
      conditionWrappers,
      conditionSelector,
      conditionTheme,
      merge,
      originalValue,
      contextOnly
    )
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
          condition,
          conditionKey,
          conditionWrappers,
          conditionSelector,
          conditionTheme,
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
      condition,
      conditionKey,
      conditionWrappers,
      conditionSelector,
      conditionTheme,
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
  const parent = directState.flatParentCursor || null
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
        condition && directState.flatCompoundIndexes ? snapshotCondition(cursor) : 0
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
  if (isHocClauseTransport(value)) {
    // a wrapping component's conditional contributions arrive as resolved
    // atoms: replay each into a cursor at this position, no text reparsed
    if (value.hasBase) {
      contributeValue(state, property, value.base, merge, value.base, contextOnly)
    }
    for (let index = 0; index < value.entries.length; index++) {
      const entry = value.entries[index]
      const watermark = conditionCursorTop
      const cursor = acquireTransportCursor(
        state,
        entry,
        (state as DirectState).flatParentCursor || null
      )
      emitUnderCondition(
        state,
        property,
        entry.value,
        cursor,
        merge,
        entry.value,
        contextOnly,
        2,
        entry.value
      )
      releaseConditionCursors(watermark)
    }
    return true
  }
  if (condition !== undefined) {
    const directState = state as DirectState
    const parent = directState.flatParentCursor || null
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
        for (let index = 0; index < condition.atomCount; index++) {
          accumulateConditionAtom(
            state,
            effective,
            condition.atomKinds[index],
            condition.atomRanks[index],
            condition.atomNames[index]
          )
        }
        if (!condition.resolved) effective.resolved = false
        commitConditionCursor(state, effective)
      } else {
        effective = condition
      }
      if (
        value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        !isVariable(value) &&
        classifyConditionalObject(value, state)
      ) {
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
            const child = acquireConditionCursor(effective)
            resolveConditionText(state, child, key)
            commitConditionCursor(state, child)
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
            releaseConditionCursors(keyWatermark)
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
    isWeb &&
    (webShadowParts.has(property) || legacyTransformParts.has(property)) &&
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
    : webShadowParts.has(property)
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

interface HocClauseEntry {
  value: any
  atomCount: number
  atomKinds: number[]
  atomRanks: number[]
  atomNames: string[]
}

interface HocClauseTransport {
  hasBase: boolean
  base: any
  entries: HocClauseEntry[]
}

const hocClauseTransports = new WeakSet<HocClauseTransport>()

function isHocClauseTransport(value: unknown): value is HocClauseTransport {
  return (
    typeof value === 'object' &&
    value !== null &&
    hocClauseTransports.has(value as HocClauseTransport)
  )
}

function hocClauseEntryFromCursor(cursor: ConditionCursor, value: any): HocClauseEntry {
  const entry: HocClauseEntry = {
    value,
    atomCount: cursor.atomCount,
    atomKinds: [],
    atomRanks: [],
    atomNames: [],
  }
  for (let index = 0; index < cursor.atomCount; index++) {
    entry.atomKinds[index] = cursor.atomKinds[index]
    entry.atomRanks[index] = cursor.atomRanks[index]
    entry.atomNames[index] = cursor.atomNames[index]
  }
  return entry
}

function sameAtomSet(entry: HocClauseEntry, cursor: ConditionCursor): boolean {
  if (entry.atomCount !== cursor.atomCount) return false
  for (let index = 0; index < entry.atomCount; index++) {
    let found = false
    for (let inner = 0; inner < cursor.atomCount; inner++) {
      if (entry.atomNames[index] === cursor.atomNames[inner]) {
        found = true
        break
      }
    }
    if (!found) return false
  }
  return true
}

/** replay a transported clause's atoms into a fresh committed cursor */
function acquireTransportCursor(
  state: GetStyleState,
  entry: HocClauseEntry,
  parent: ConditionCursor | null
): ConditionCursor {
  const cursor = acquireConditionCursor(parent)
  for (let index = 0; index < entry.atomCount; index++) {
    accumulateConditionAtom(
      state,
      cursor,
      entry.atomKinds[index],
      entry.atomRanks[index],
      entry.atomNames[index]
    )
  }
  commitConditionCursor(state, cursor)
  return cursor
}

function addStructuredClause(
  state: GetStyleState,
  prev: unknown,
  cursor: ConditionCursor,
  value: unknown
): HocClauseTransport {
  let transport: HocClauseTransport
  if (isHocClauseTransport(prev)) {
    transport = prev
  } else {
    transport = { hasBase: false, base: undefined, entries: [] }
    hocClauseTransports.add(transport)
    if (prev != null) {
      if (
        typeof prev === 'object' &&
        !Array.isArray(prev) &&
        !isVariable(prev) &&
        classifyConditionalObject(prev as Record<string, any>, state)
      ) {
        // an authored conditional object joins as transported clauses; its
        // keys are authored text and resolve here exactly once
        for (const key in prev as Record<string, any>) {
          const payload = (prev as Record<string, any>)[key]
          if (payload == null) continue
          if (key === 'default') {
            transport.hasBase = true
            transport.base = payload
            continue
          }
          const watermark = conditionCursorTop
          const keyCursor = acquireConditionCursor(null)
          resolveConditionText(state, keyCursor, key)
          commitConditionCursor(state, keyCursor)
          transport.entries.push(hocClauseEntryFromCursor(keyCursor, payload))
          releaseConditionCursors(watermark)
        }
      } else {
        transport.hasBase = true
        transport.base = prev
      }
    }
  }
  // a repeat contribution under the same condition set replaces its entry and
  // moves to the end: the wrapped pass sees last-wins in authored order
  for (let index = 0; index < transport.entries.length; index++) {
    if (sameAtomSet(transport.entries[index], cursor)) {
      transport.entries.splice(index, 1)
      break
    }
  }
  transport.entries.push(hocClauseEntryFromCursor(cursor, value))
  return transport
}

type MappedValue = Parameters<PropMapper>[4]
type VariantScanContext = [GetStyleState, string, string, string, MappedValue]

const variantValueHandler: FlatValueHandler<VariantScanContext> = {
  segment(ctx, start, end, isBase, valid, source, chainStart, chainEnd, chainValid) {
    const state = ctx[0]
    const directState = state as DirectState
    if (start === end) return
    if (isBase) {
      feedCompoundSegment(directState, source, start, end, true, valid, 0)
      if (!valid) return
      emitResolvedVariant(ctx[1], source.slice(start, end), state, ctx[2], null, ctx[4])
      return
    }
    if (!valid || !chainValid) return
    // the clause's own condition: parent composition happens downstream where
    // the resolved output emits, exactly like every other conditional value
    const cursor = directState.flatScanCursor
    const condition = cursor && cursor.resolved ? cursor.condition : 0
    feedCompoundSegment(
      directState,
      source,
      start,
      end,
      false,
      Boolean(condition),
      condition && directState.flatCompoundIndexes ? snapshotCondition(cursor!) : 0
    )
    if (!condition) return
    emitResolvedVariant(ctx[1], source.slice(start, end), state, ctx[2], cursor!, ctx[4])
  },
  modifier(ctx, start, end, valid, first, source) {
    const directState = ctx[0] as DirectState
    let cursor = directState.flatScanCursor
    if (!cursor) {
      cursor = directState.flatScanCursor = acquireConditionCursor(null)
    } else if (first) {
      resetConditionCursor(cursor, null)
    }
    if (!valid) {
      cursor.resolved = false
      return
    }
    if (cursor.resolved) {
      resolveConditionModifier(ctx[0], cursor, source.slice(start, end))
    }
  },
  chain(ctx, _start, _end, valid) {
    const cursor = (ctx[0] as DirectState).flatScanCursor
    if (cursor) {
      if (!valid) cursor.resolved = false
      if (cursor.resolved) commitConditionCursor(ctx[0], cursor)
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
  const add = (key: string) => {
    set ||= new Set()
    set.add(key)
  }
  if (contextConfig?.props) for (const key in contextConfig.props) add(key)
  if (contextPropKeys) for (const key of contextPropKeys) add(key)
  if (contextConfig?.propKeys) for (const key of contextConfig.propKeys) add(key)
  const parentPropKeys = staticConfig.parentStaticConfig?.context?.propKeys
  if (parentPropKeys) for (const key of parentPropKeys) add(key)
  contextPropSets.set(staticConfig, set)
  return set
}

const contributeMappedValue: PropMapper = (key, value, styleState, disabled, map) => {
  if (disabled) {
    return map(key, value)
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
      resolveVariants(key, value, styleProps, styleState, key, map)
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
        map(nkey, nvalue, originalValue)
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
        map(nkey, nvalue, noriginalValue ?? originalValue)
      }
    } else {
      map(key, value, originalValue)
    }
  }
}

function resolveVariants(
  key: string,
  value: any,
  styleProps: SplitStyleProps,
  styleState: GetStyleState,
  parentVariantKey: string,
  map: MappedValue
) {
  const variantDefinition = styleState.staticConfig.variants?.[key]
  if (isHocClauseTransport(value)) {
    // conditional variant selections transported through an HOC: resolve each
    // branch under its replayed condition
    if (value.hasBase) {
      emitResolvedVariant(key, value.base, styleState, parentVariantKey, null, map)
    }
    for (let index = 0; index < value.entries.length; index++) {
      const entry = value.entries[index]
      const watermark = conditionCursorTop
      const cursor = acquireTransportCursor(styleState, entry, null)
      emitResolvedVariant(key, entry.value, styleState, parentVariantKey, cursor, map)
      releaseConditionCursors(watermark)
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
      scanFlatValue(value, variantValueHandler, [
        styleState,
        key,
        parentVariantKey,
        '',
        map,
      ])
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
  if (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    !isVariable(value) &&
    classifyConditionalObject(value, styleState)
  ) {
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
        emitResolvedVariant(key, payload, styleState, parentVariantKey, null, map)
        continue
      }
      const watermark = conditionCursorTop
      const cursor = acquireConditionCursor(null)
      resolveConditionText(styleState, cursor, objKey)
      const condition = commitConditionCursor(styleState, cursor)
      if (directState.flatCompoundIndexes) {
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
      emitResolvedVariant(key, payload, styleState, parentVariantKey, cursor, map)
      releaseConditionCursors(watermark)
    }
    return
  }

  emitResolvedVariant(key, value, styleState, parentVariantKey, null, map)
}

function emitResolvedVariant(
  key: string,
  value: any,
  styleState: GetStyleState,
  parentVariantKey: string,
  conditionCursor: ConditionCursor | null,
  map: MappedValue
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
      process.env.TAMAGUI_TARGET !== 'native'
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
        (mappedKey, mappedValue, mappedOriginal, nestedCondition) => {
          const nested = nestedCondition as ConditionCursor | undefined
          let resolvedCondition: ConditionCursor | undefined =
            nested ?? conditionCursor ?? undefined
          const watermark = conditionCursorTop
          if (nested && conditionCursor) {
            // a conditional value inside a conditional variant clause: compose
            // by replaying the nested clause's atoms over the outer condition
            const composed = acquireConditionCursor(conditionCursor)
            for (let index = 0; index < nested.atomCount; index++) {
              accumulateConditionAtom(
                styleState,
                composed,
                nested.atomKinds[index],
                nested.atomRanks[index],
                nested.atomNames[index]
              )
            }
            if (!nested.resolved) composed.resolved = false
            commitConditionCursor(styleState, composed)
            resolvedCondition = composed
          }
          if (
            mappedKey === 'fontFamily' ||
            mappedKey === conf.inverseShorthands.fontFamily
          ) {
            styleState.fontFamily = getFontFamilyFromNameOrVariable(mappedValue, conf)
          }
          map(mappedKey, mappedValue, mappedOriginal ?? originalValue, resolvedCondition)
          releaseConditionCursors(watermark)
        }
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

function isViewportValue(value: string): boolean {
  return (
    ((value.endsWith('vw') || value.endsWith('vh')) && hasNumericPrefix(value, 2)) ||
    ((value.endsWith('dvw') ||
      value.endsWith('lvw') ||
      value.endsWith('svw') ||
      value.endsWith('dvh') ||
      value.endsWith('lvh') ||
      value.endsWith('svh')) &&
      hasNumericPrefix(value, 3))
  )
}

function isAllowedStyleValue(
  category: 'size' | 'space' | 'radius' | 'zIndex',
  value: any,
  conf: TamaguiInternalConfig,
  string: boolean,
  number: boolean,
  rem: boolean
) {
  const hasSetting = Object.prototype.hasOwnProperty.call(
    conf.settings,
    'allowedStyleValues'
  )
  const configured = conf.settings.allowedStyleValues
  const setting =
    configured && typeof configured === 'object' ? configured[category] : configured
  const web =
    value === 'unset' ||
    value === 'inherit' ||
    (string && value.startsWith('var(') && value.endsWith(')')) ||
    ((category === 'size' || category === 'space') &&
      (value === 'max-content' ||
        value === 'min-content' ||
        (string &&
          (isViewportValue(value) ||
            ((value.startsWith('calc(') ||
              value.startsWith('min(') ||
              value.startsWith('max(')) &&
              value.endsWith(')'))))))
  const somewhat =
    category === 'size' || category === 'space'
      ? value === 'auto' || number || rem || (string && value.endsWith('%'))
      : number
  if (setting === 'strict') return false
  if (setting === 'strict-web') return web
  if (setting === 'somewhat-strict') return somewhat
  if (setting === 'somewhat-strict-web') return somewhat || web
  return (
    number || (string && (category === 'size' || category === 'space' || !hasSetting))
  )
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
    case 'ZIndex': {
      const category =
        resolverName === 'ZIndex'
          ? 'zIndex'
          : (resolverName.toLowerCase() as 'size' | 'space' | 'radius')
      return (
        value === true ||
        (value != null && value in conf.tokensParsed[category]) ||
        ((resolverName === 'Space' ||
          resolverName === 'Radius' ||
          resolverName === 'ZIndex') &&
          isVariable(value)) ||
        ((resolverName === 'Radius' || resolverName === 'ZIndex') && (number || rem)) ||
        isAllowedStyleValue(category, value, conf, string, number, rem)
      )
    }
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
