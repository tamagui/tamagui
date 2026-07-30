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
          // a single-component shorthand value is uniform: expand it so the
          // program can own just its longhand
          const isUniform =
            typeof parentValue === 'number' ||
            (typeof parentValue === 'string' && !String(parentValue).trim().includes(' '))
          if (isUniform) {
            for (const sibling of longhandExpansionTable[parent]) {
              if (sibling === longhand || programs.has(sibling)) continue
              styleState.style[sibling] = parentValue
              styleState.usedKeys[sibling] = styleState.usedKeys[parent] || 1
            }
          } else if (process.env.NODE_ENV === 'development') {
            console.warn(
              `[tamagui] ${key} program on "${longhand}" cannot displace the multi-value "${parent}" style; the result is unordered until both use flat values`
            )
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
