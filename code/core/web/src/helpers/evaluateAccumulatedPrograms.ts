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
  evaluateProgram,
  resolvePayload,
  serializePayloadNative,
  unitlessNumberProperties,
  type ActiveConditions,
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
          ;(usedStates ||= new Set()).add(modifier)
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
        unit: unitlessNumberProperties.has(longhand) ? undefined : 'px-to-number',
      })
    } catch (error) {
      noteOnce(
        `${longhand}\0${payload}\0ser`,
        `[tamagui] ${program.sourceProp}: ${error instanceof Error ? error.message : String(error)}`
      )
      continue
    }

    styleState.style ||= {}
    styleState.style[longhand] = value
  }

  return { usedMediaKeys, usedStates }
}
