// Lane W3: on native, accumulated programs evaluate at the end of the forward
// pass — evaluateProgram picks the last matching clause exactly as the CSS
// cascade does inside a web program block, then the payload resolves through
// the per-theme native getter and lands in the plain style object. Interaction
// states re-evaluate through the normal componentState re-render loop, media
// through the same hasMedia subscription legacy media objects use.
//
// W3 v1 scope: state, theme, media, and platform clauses. Group and container
// clauses need the component-tree wiring (group emitters, container
// measurement) and are skipped with one development note each.

import { isAndroid, isIos, isTV } from '@tamagui/constants'
import {
  composeTransformArray,
  evaluateProgram,
  resolvePayload,
  serializePayloadNative,
  transformPropForDeclaration,
  unitlessNumberProperties,
  type ActiveConditions,
  type TransformEntry,
} from '@tamagui/style-grammar'

import type { GetStyleState } from '../types'
import { ensureGrammarContext } from './contributePrograms'

const platformName = isIos
  ? isTV
    ? 'tvos'
    : 'ios'
  : isAndroid
    ? isTV
      ? 'androidtv'
      : 'android'
    : 'native'

const noMatch = () => false

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

// react-native-web's unitless list is CSS-truth; on native the gap family is
// a real length wanting numbers
const nativeLengthOverrides: ReadonlySet<string> = new Set([
  'gap',
  'rowGap',
  'columnGap',
  'gridRowGap',
  'gridColumnGap',
])

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
}

export function evaluateAccumulatedPrograms(
  styleState: GetStyleState,
  themeName: string,
  mediaState: Record<string, boolean | undefined>
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

  const active: ActiveConditions = {
    states,
    themes,
    media,
    platform: platformName,
    groups: noMatch,
    containers: noMatch,
  }

  const getValue = context.createNativeValueGetter(styleState.theme)

  let usedMediaKeys: string[] | null = null
  let usedStates: Set<string> | null = null
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
        } else if (kind === 'group' || kind === 'container') {
          noteOnce(
            `${kind}\0${modifier}`,
            `[tamagui] ${program.sourceProp}: "${modifier}:" ${kind} clauses are not evaluated on native yet; the clause is skipped`
          )
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
    styleState.style[longhand] = value
  }

  if (transformResults) {
    styleState.style ||= {}
    composeNativeTransform(styleState, transformResults)
  }

  return { usedMediaKeys, usedStates }
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
