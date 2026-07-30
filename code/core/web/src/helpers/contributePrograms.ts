// Lane W1: flat value programs entering the forward pass.
//
// A style prop whose string value carries clauses (`bg="red hover:blue"`)
// contributes per-longhand programs instead of a plain style value. During the
// staging phase only clause-bearing values divert: a clause-less string keeps
// the existing token-resolution path, which produces identical output, and a
// string that fails to parse falls back to the legacy path with a one-time
// development note instead of an error — real values like RN's
// `aspectRatio="16:9"` must keep working until the V3 cutover makes the
// grammar the one parser. See plans/dom-tailwind-flat-values.md, "Programs and
// merging" and the phase 5 wiring lanes.

import { stylePropsTransform } from '@tamagui/helpers'
import {
  expandToLonghands,
  longhandExpansionTable,
  type LonghandProgram,
} from '@tamagui/style-grammar'

import type { GetStyleState } from '../types'
import { getCachedPrograms, setProgramCacheContext } from './programCache'
import { createGrammarRuntimeContext, type GrammarRuntimeContext } from './grammarConfig'

// geometric longhand -> the shorthand style keys whose expansion contains it,
// so a program landing on `paddingTop` can displace an earlier plain `padding`
const shorthandsContaining: Record<string, string[]> = {}
for (const shorthand in longhandExpansionTable) {
  for (const longhand of longhandExpansionTable[shorthand]) {
    ;(shorthandsContaining[longhand] ||= []).push(shorthand)
  }
}

// CSS geometric shorthand slot patterns by value count. The index pattern is
// identical for box sides (top/right/bottom/left) and radius corners
// (TL/TR/BR/BL): 2 values alternate, 3 values mirror the second.
const slotPatterns: Record<number, Record<number, readonly number[]>> = {
  4: { 1: [0, 0, 0, 0], 2: [0, 1, 0, 1], 3: [0, 1, 2, 1], 4: [0, 1, 2, 3] },
  2: { 1: [0, 0], 2: [0, 1] },
}

/**
 * Expands a plain geometric shorthand value to its per-longhand values, or
 * null when it cannot be done faithfully (function values, slash syntax).
 */
function expandShorthandValue(value: unknown, longhands: readonly string[]): unknown[] | null {
  if (typeof value === 'number') {
    return longhands.map(() => value)
  }
  if (typeof value !== 'string') return null
  const text = value.trim()
  if (text.includes('(') || text.includes('/')) return null
  const parts = text.split(/\s+/)
  const pattern = slotPatterns[longhands.length]?.[parts.length]
  if (!pattern) return null
  return pattern.map((index) => parts[index])
}

let activeContext: GrammarRuntimeContext | null = null

export function ensureGrammarContext(styleState: GetStyleState): GrammarRuntimeContext {
  const context = createGrammarRuntimeContext(styleState.conf)
  if (context !== activeContext) {
    activeContext = context
    setProgramCacheContext({
      registry: context.registry,
      configRevision: context.configRevision,
      colorTokens: context.colorTokens,
    })
  }
  return context
}

const notedFallbacks = new Set<string>()

/**
 * Returns true when the value was consumed as programs. False means the caller
 * proceeds down the existing plain-value path.
 */
export function contributeStylePrograms(
  styleState: GetStyleState,
  key: string,
  val: string
): boolean {
  // transform parts stay legacy until the transform family is designed
  // (plan remaining design work item 7)
  if (key in stylePropsTransform || key === 'transform') return false

  // accept-keys are props, not styles (Input's placeholderTextColor): they
  // must reach the host through mergeStyle's viewProps branch, never CSS
  if (styleState.staticConfig.accept && key in styleState.staticConfig.accept) {
    return false
  }

  ensureGrammarContext(styleState)

  const cached = getCachedPrograms(key, val)

  if (cached.errors) {
    if (process.env.NODE_ENV === 'development') {
      const noteKey = `${key}\0${val}`
      if (!notedFallbacks.has(noteKey)) {
        // dynamic colon-bearing values would grow this without bound
        if (notedFallbacks.size > 1000) notedFallbacks.clear()
        notedFallbacks.add(noteKey)
        console.info(
          `[tamagui] ${key}="${val}" is not a flat value program (${cached.errors[0].code}); passing through unchanged. The V3 flat-value cutover will make this an error.`
        )
      }
    }
    return false
  }

  let hasClauses = false
  for (const entry of cached.programs) {
    if (entry.value.clauses.length) {
      hasClauses = true
      break
    }
  }
  if (!hasClauses) return false

  const programs = (styleState.programs ||= new Map<string, LonghandProgram>())

  for (const entry of cached.programs) {
    for (const longhand of expandToLonghands(entry.property)) {
      // a later contribution replaces the whole program; re-set for map order
      programs.delete(longhand)
      programs.set(longhand, { property: longhand, value: entry.value, sourceProp: key })

      // displace the legacy store so one longhand never carries both systems.
      // usedKeys stays SET at base importance: it marks the program's
      // ownership, so applyDefaultStyle skips the key and a later equal-
      // importance write still replaces the program through mergeStyle
      if (styleState.style && longhand in styleState.style) {
        delete styleState.style[longhand]
      }
      styleState.usedKeys[longhand] = 1
      const parents = shorthandsContaining[longhand]
      if (parents && styleState.style) {
        for (const parent of parents) {
          if (!(parent in styleState.style)) continue
          const parentValue = styleState.style[parent]
          const perSide = expandShorthandValue(parentValue, longhandExpansionTable[parent])
          if (!perSide) {
            // cannot expand faithfully (calc(), slash syntax): leave the
            // shorthand in place — unordered against the program beats
            // silently dropping the other sides
            if (process.env.NODE_ENV === 'development') {
              console.warn(
                `[tamagui] ${key} program on "${longhand}" beside the unexpandable "${parent}" style value "${parentValue}": ordering between them is undefined until both use flat values`
              )
            }
            continue
          }
          const siblings = longhandExpansionTable[parent]
          const parentImportance = styleState.usedKeys[parent] || 1
          for (let index = 0; index < siblings.length; index++) {
            const sibling = siblings[index]
            // a sibling that any contribution already wrote (or a program
            // owns) keeps its value: the parent was authored earlier
            if (sibling === longhand || programs.has(sibling)) continue
            if (sibling in styleState.usedKeys) continue
            styleState.style[sibling] = perSide[index]
            styleState.usedKeys[sibling] = parentImportance
          }
          delete styleState.style[parent]
          delete styleState.usedKeys[parent]
        }
      }
    }
  }

  return true
}

/** mergeStyle calls this so a later plain value replaces any program it covers */
export function deleteProgramsForStyleKey(
  programs: Map<string, LonghandProgram>,
  key: string
): void {
  const longhands = longhandExpansionTable[key]
  if (longhands) {
    for (const longhand of longhands) programs.delete(longhand)
  } else {
    programs.delete(key)
  }
}
