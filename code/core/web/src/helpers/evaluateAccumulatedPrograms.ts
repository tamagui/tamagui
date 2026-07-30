// Lane W3: on native, accumulated programs evaluate at the end of the forward
// pass — evaluateProgram picks the last matching clause exactly as the CSS
// cascade does inside a web program block, then the payload resolves through
// the per-theme native getter and lands in the plain style object. Interaction
// states re-evaluate through the normal componentState re-render loop, media
// through the same hasMedia subscription legacy media objects use.
//
// Group clauses read the parent group's pseudo state and container clauses the
// parent container's measured layout, both through the same GroupContext
// channel legacy `$group-*` styles use: registration rides pseudoGroups /
// mediaGroups so `subscribeToContextGroup` feeds `componentState.group`, and
// container context entries are keyed `@` / `@name` — group names cannot
// contain `@`, so the two namespaces share one context without collisions.

import { isAndroid, isIos, isTV, isWeb } from '@tamagui/constants'
import {
  composeTransformArray,
  evaluateProgram,
  parseContainerModifier,
  parseGroupModifier,
  resolvePayload,
  serializePayloadNative,
  transformPropForDeclaration,
  unitlessNumberProperties,
  type ActiveConditions,
  type ContainerModifier,
  type GroupModifier,
  type TransformEntry,
} from '@tamagui/style-grammar'

import { mediaKeyMatch } from '../hooks/useMedia'
import type { AllGroupContexts, GetStyleState, TamaguiComponentState } from '../types'
import { ensureGrammarContext } from './contributePrograms'

// the noClass/animated-inline web path evaluates here too, so the platform
// containment must answer `web:` on web, never the native fallback
const platformName = isWeb
  ? 'web'
  : isIos
    ? isTV
      ? 'tvos'
      : 'ios'
    : isAndroid
      ? isTV
        ? 'androidtv'
        : 'android'
      : 'native'

// the states this platform can actually source right now: componentState
// fields plus enter/exit from the lifecycle. component-tier states (checked,
// open, selected, highlighted, invalid) need the behavior packages to feed
// componentState and are diagnosed, never silent, until that lands
const sourceableStates: ReadonlySet<string> = new Set([
  'hover',
  'press',
  'active',
  'focus',
  'focus-visible',
  'focus-within',
  'disabled',
  'enter',
  'exit',
])

// react-native has no per-side border style, so the border family's style
// longhands collapse onto the uniform key (the last side written wins, and a
// split from one composite value writes the same style to every side)
const nativeKeyAliases: Readonly<Record<string, string>> = {
  borderTopStyle: 'borderStyle',
  borderRightStyle: 'borderStyle',
  borderBottomStyle: 'borderStyle',
  borderLeftStyle: 'borderStyle',
}

// react-native-web's unitless list is CSS-truth; on native the gap family is
// a real length wanting numbers
const nativeLengthOverrides: ReadonlySet<string> = new Set([
  'gap',
  'rowGap',
  'columnGap',
  'gridRowGap',
  'gridColumnGap',
])

// grammar group states map to the camelCase keys `subscribeToContextGroup`
// writes into componentState.group[name].pseudo; press and active share a
// source exactly like the subject-state set above
const groupStateKeys: Readonly<Record<string, string>> = {
  hover: 'hover',
  press: 'press',
  active: 'press',
  focus: 'focus',
  'focus-visible': 'focusVisible',
  'focus-within': 'focusWithin',
  disabled: 'disabled',
}

// modifier spellings are interned by the parse cache, so parsing each distinct
// group/container modifier once is stable; cap-and-clear like the other caches
const groupModifierCache = new Map<string, GroupModifier | null>()
const containerModifierCache = new Map<string, ContainerModifier | null>()

function cachedGroupModifier(modifier: string): GroupModifier | null {
  let parsed = groupModifierCache.get(modifier)
  if (parsed === undefined) {
    if (groupModifierCache.size > 1000) groupModifierCache.clear()
    parsed = parseGroupModifier(modifier)
    groupModifierCache.set(modifier, parsed)
  }
  return parsed
}

function cachedContainerModifier(modifier: string): ContainerModifier | null {
  let parsed = containerModifierCache.get(modifier)
  if (parsed === undefined) {
    if (containerModifierCache.size > 1000) containerModifierCache.clear()
    parsed = parseContainerModifier(modifier)
    containerModifierCache.set(modifier, parsed)
  }
  return parsed
}

function containerContextKey(parsed: ContainerModifier): string {
  return parsed.container === null ? '@' : `@${parsed.container}`
}

// evaluateProgram's group/container callbacks run synchronously inside one
// evaluate call, so the current component's sources live in module state
// instead of per-call closures (hot-path rules)
let activeGroupState: TamaguiComponentState['group'] | undefined
let activeGroupContext: AllGroupContexts | null | undefined

function matchGroupModifier(modifier: string): boolean {
  const parsed = cachedGroupModifier(modifier)
  if (!parsed) return false
  const stateKey = groupStateKeys[parsed.state]
  if (!stateKey) return false
  const key = parsed.group ?? 'true'
  // componentState carries the subscribed updates; the context's own state is
  // the initial snapshot before the first emit, same as the legacy path
  const pseudo =
    activeGroupState?.[key]?.pseudo ?? activeGroupContext?.[key]?.state.pseudo
  return !!pseudo?.[stateKey]
}

function matchContainerModifier(modifier: string): boolean {
  const parsed = cachedContainerModifier(modifier)
  if (!parsed) return false
  const key = containerContextKey(parsed)
  const media = activeGroupState?.[key]?.media
  if (media && parsed.size in media) return !!media[parsed.size]
  // before the first subscribed update, measure directly against the
  // container's last known layout (also covers hardcoded width/height parents)
  const layout = activeGroupContext?.[key]?.state.layout
  return layout ? mediaKeyMatch(parsed.size, layout) : false
}

const noted = new Set<string>()
function noteOnce(key: string, message: string) {
  if (process.env.NODE_ENV === 'development' && !noted.has(key)) {
    if (noted.size > 1000) noted.clear()
    noted.add(key)
    console.warn(message)
  }
}

export interface EvaluatedProgramsInfo {
  /** media keys any clause referenced, for the hasMedia subscription */
  usedMediaKeys: string[] | null
  /** interaction states any clause referenced, for event attachment */
  usedStates: Set<string> | null
  /**
   * group-context keys any group/container clause referenced (`true`, `card`,
   * `@`, `@card`), for the pseudoGroups subscription set
   */
  usedGroupKeys: Set<string> | null
  /** container sizes any clause referenced, for the mediaGroups layout math */
  usedGroupSizes: string[] | null
}

export function evaluateAccumulatedPrograms(
  styleState: GetStyleState,
  themeName: string,
  mediaState: Record<string, boolean | undefined>,
  groupContext: AllGroupContexts | null | undefined
): EvaluatedProgramsInfo {
  const programs = styleState.programs!
  const context = ensureGrammarContext(styleState)
  const { componentState, props } = styleState

  // progressive underscore prefixes: dark_blue activates dark and dark_blue,
  // matching the established parent-theme inheritance rule with an exact
  // name-boundary (no `da` matching `dark`)
  const themes = new Set<string>()
  let prefixEnd = themeName.indexOf('_')
  while (prefixEnd !== -1) {
    themes.add(themeName.slice(0, prefixEnd))
    prefixEnd = themeName.indexOf('_', prefixEnd + 1)
  }
  if (themeName) themes.add(themeName)

  const states = new Set<string>()
  if (componentState.hover) states.add('hover')
  if (componentState.press || componentState.pressIn) {
    states.add('press')
    states.add('active')
  }
  if (componentState.focus) states.add('focus')
  if (componentState.focusVisible) states.add('focus-visible')
  if (componentState.focusWithin) states.add('focus-within')
  if (componentState.disabled || props.disabled) states.add('disabled')
  if (componentState.unmounted) states.add('enter')
  if (styleState.styleProps.isExiting) states.add('exit')

  const media = new Set<string>()
  for (const key in mediaState) {
    if (mediaState[key]) media.add(key)
  }

  activeGroupState = componentState.group
  activeGroupContext = groupContext

  const active: ActiveConditions = {
    states,
    themes,
    media,
    platform: platformName,
    groups: matchGroupModifier,
    containers: matchContainerModifier,
  }

  const getValue = context.createNativeValueGetter(styleState.theme)

  let usedMediaKeys: string[] | null = null
  let usedStates: Set<string> | null = null
  let usedGroupKeys: Set<string> | null = null
  let usedGroupSizes: string[] | null = null
  let transformResults: Record<string, string | number> | null = null

  for (const program of programs.values()) {
    const longhand = program.property

    // classify every referenced modifier once: media keys feed the
    // subscription, states feed event attachment, groups/containers note
    for (const clause of program.value.clauses) {
      for (const modifier of clause.modifiers) {
        const kind = context.registry.get(modifier)
        if (kind === 'media') {
          ;(usedMediaKeys ||= []).push(modifier)
        } else if (kind === 'state') {
          if (sourceableStates.has(modifier)) {
            ;(usedStates ||= new Set()).add(modifier)
          } else {
            noteOnce(
              `state\0${modifier}`,
              `[tamagui] ${program.sourceProp}: "${modifier}:" is a component-tier state with no native source yet; the clause is skipped`
            )
          }
        } else if (kind === 'group') {
          const parsed = cachedGroupModifier(modifier)
          if (parsed && groupStateKeys[parsed.state]) {
            const key = parsed.group ?? 'true'
            ;(usedGroupKeys ||= new Set()).add(key)
            if (!groupContext?.[key]) {
              noteOnce(
                `group\0${key}`,
                `[tamagui] ${program.sourceProp}: "${modifier}:" has no parent providing group "${key === 'true' ? '' : key}"`
              )
            }
          } else {
            noteOnce(
              `group\0${modifier}`,
              `[tamagui] ${program.sourceProp}: "${modifier}:" group state has no native source; the clause is skipped`
            )
          }
        } else if (kind === 'container') {
          const parsed = cachedContainerModifier(modifier)
          if (parsed) {
            const key = containerContextKey(parsed)
            ;(usedGroupKeys ||= new Set()).add(key)
            ;(usedGroupSizes ||= []).push(parsed.size)
            if (!groupContext?.[key]) {
              noteOnce(
                `container\0${key}`,
                `[tamagui] ${program.sourceProp}: "${modifier}:" has no parent container${parsed.container ? ` named "${parsed.container}"` : ''}`
              )
            }
          }
        }
      }
    }

    const payload = evaluateProgram(program.value, context.registry, active)
    if (payload === null) continue

    const resolved = resolvePayload(payload, {
      lookup: context.getLookup(longhand, styleState.fontFamily),
      resolveNumbers: context.resolvesNumbers(longhand),
    })
    if (resolved.errors?.length) {
      noteOnce(
        `${longhand}\0${payload}`,
        `[tamagui] ${program.sourceProp}: "${payload}" — ${resolved.errors[0].code}; dropping`
      )
      continue
    }

    let value: string | number
    try {
      value = serializePayloadNative(resolved, getValue, {
        unit:
          unitlessNumberProperties.has(longhand) && !nativeLengthOverrides.has(longhand)
            ? undefined
            : 'px-to-number',
      })
    } catch (error) {
      noteOnce(
        `${longhand}\0${payload}\0ser`,
        `[tamagui] ${program.sourceProp}: ${error instanceof Error ? error.message : String(error)}`
      )
      continue
    }

    // the transform family composes into one array below rather than writing a
    // style key of its own
    const transformProp = transformPropForDeclaration[longhand]
    if (transformProp) {
      transformResults ||= {}
      transformResults[transformProp] = value
      continue
    }

    styleState.style ||= {}
    styleState.style[nativeKeyAliases[longhand] ?? longhand] = value
  }

  // module state must not retain the component past this call
  activeGroupState = undefined
  activeGroupContext = undefined

  if (transformResults) {
    styleState.style ||= {}
    composeNativeTransform(styleState, transformResults)
  }

  return { usedMediaKeys, usedStates, usedGroupKeys, usedGroupSizes }
}

/**
 * Interleaving with the legacy transform path, which matters because evaluation
 * now runs before `mergeFlatTransforms`:
 *
 * the family owns its six props, so by this point contribution has already
 * displaced their `flatTransforms` entries. What can still be in flight is
 * (a) legacy parts the family does not own yet — skews, perspective, 3D
 * rotations, matrix — and (b) a raw `transform` prop already sitting in
 * `style.transform`. Both are the "raw tail" in the plan's fixed order, so this
 * consumes them here and clears `flatTransforms`, which makes the later
 * `mergeFlatTransforms` a no-op instead of unshifting legacy parts in front of
 * the composed family entries.
 *
 * Legacy `mergeFlatTransforms` sorts its keys and unshifts, so it produced
 * reverse-alphabetical order. The composed order is the CSS one the plan
 * mandates — translate, rotate, scale, then the tail — which is identical for
 * the common x/y/uniform-scale cases and deliberately different once rotate and
 * a non-uniform scale are combined.
 */
function composeNativeTransform(
  styleState: GetStyleState,
  results: Record<string, string | number>
): void {
  const style = styleState.style!
  const tail: TransformEntry[] = []

  const flatTransforms = styleState.flatTransforms
  if (flatTransforms) {
    // preserve legacy relative order among the parts the family does not own
    const keys: string[] = []
    for (const key in flatTransforms) keys.push(key)
    keys.sort()
    for (let index = keys.length - 1; index >= 0; index--) {
      const key = keys[index]
      tail.push({ [key]: flatTransforms[key] } as TransformEntry)
    }
    styleState.flatTransforms = undefined
  }

  if (Array.isArray(style.transform)) {
    for (const entry of style.transform) tail.push(entry as TransformEntry)
  } else if (typeof style.transform === 'string') {
    // a raw transform string parses once, inside composeTransformArray
    const composed = composeTransformArray(results, style.transform)
    reportTransformErrors(composed.errors, styleState)
    style.transform = composed.transform.concat(tail) as any
    return
  }

  const composed = composeTransformArray(results, tail)
  reportTransformErrors(composed.errors, styleState)
  style.transform = composed.transform as any
}

function reportTransformErrors(
  errors: readonly { code: string; source: string; message: string }[],
  styleState: GetStyleState
): void {
  for (const error of errors) {
    noteOnce(`transform\0${error.code}\0${error.source}`, `[tamagui] ${error.message}`)
  }
}
