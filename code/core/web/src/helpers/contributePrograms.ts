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
  legacyTransformKeysFor,
  longhandExpansionTable,
  type LonghandProgram,
  type ParsedValue,
  transformDeclarationUnit,
  transformDeclarationsFor,
  transformFamilyProps,
  uniformLegacySiblings,
  unitlessNumberProperties,
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
function expandShorthandValue(
  value: unknown,
  longhands: readonly string[]
): unknown[] | null {
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

const noPlainValue = Symbol()

function displacePlainStyles(
  styleState: GetStyleState,
  longhand: string,
  programs: Map<string, LonghandProgram>,
  sourceProp: string
): unknown | typeof noPlainValue {
  let displaced: unknown | typeof noPlainValue = noPlainValue
  const style = styleState.style
  if (style && longhand in style) {
    displaced = style[longhand]
    delete style[longhand]
  }

  const parents = shorthandsContaining[longhand]
  if (!parents || !style) return displaced

  for (const parent of parents) {
    if (!(parent in style)) continue
    const parentValue = style[parent]
    const siblings = longhandExpansionTable[parent]
    const perSide = expandShorthandValue(parentValue, siblings)
    if (!perSide) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `[tamagui] ${sourceProp} program on "${longhand}" beside the unexpandable "${parent}" style value "${parentValue}": ordering between them is undefined until both use flat values`
        )
      }
      continue
    }

    const parentImportance = styleState.usedKeys[parent] || 1
    for (let index = 0; index < siblings.length; index++) {
      const sibling = siblings[index]
      if (sibling === longhand) {
        if (displaced === noPlainValue) displaced = perSide[index]
        continue
      }
      if (programs.has(sibling) || sibling in styleState.usedKeys) continue
      style[sibling] = perSide[index]
      styleState.usedKeys[sibling] = parentImportance
    }
    delete style[parent]
    delete styleState.usedKeys[parent]
  }

  return displaced
}

function plainValueToPayload(value: unknown, longhand: string): string | null {
  if (typeof value === 'string') return value
  if (typeof value !== 'number' || !Number.isFinite(value)) return null
  const transformUnit = transformDeclarationUnit[longhand]
  if (transformUnit) {
    if (transformUnit === 'none') return String(value)
    return value === 0 ? '0' : `${value}${transformUnit}`
  }
  return unitlessNumberProperties.has(longhand) ? String(value) : `${value}px`
}

function longhandsFor(prop: string, styleState: GetStyleState): readonly string[] {
  const declarations = transformDeclarationsFor(prop)
  return declarations.length
    ? declarations
    : expandToLonghands(prop, styleState.conf.shorthands)
}

function isTransformDeclaration(longhand: string): boolean {
  return transformDeclarationUnit[longhand] !== undefined
}

/**
 * The transform family's legacy store is `flatTransforms`, not `style`, so a
 * transform program displaces there. A uniform legacy `scale` covers both axes:
 * it expands onto the sibling axis first (always uniform, so never ambiguous)
 * before being deleted, exactly like a uniform `padding` expanding to the sides.
 */
function displaceFlatTransforms(
  styleState: GetStyleState,
  declaration: string,
  programs: Map<string, LonghandProgram>
): unknown {
  const flatTransforms = styleState.flatTransforms
  if (!flatTransforms) return noPlainValue
  let displaced: unknown = noPlainValue
  for (const legacyKey of legacyTransformKeysFor[declaration] ?? []) {
    if (!(legacyKey in flatTransforms)) continue
    if (displaced === noPlainValue) displaced = flatTransforms[legacyKey]
    if (legacyKey === 'scale') {
      // the uniform parent still owes the other axis its value
      const sibling = uniformLegacySiblings[declaration]
      const siblingDeclaration = sibling === 'scaleX' ? '--t-scale-x' : '--t-scale-y'
      if (sibling && !programs.has(siblingDeclaration) && !(sibling in flatTransforms)) {
        flatTransforms[sibling] = flatTransforms[legacyKey]
      }
    }
    delete flatTransforms[legacyKey]
    delete styleState.usedKeys[legacyKey]
  }
  return displaced
}

export function canAppendParsedProgram(styleState: GetStyleState, prop: string): boolean {
  for (const longhand of longhandsFor(prop, styleState)) {
    if (styleState.programs?.has(longhand)) continue
    // a legacy flat transform value is always a number or a unit string, so it
    // always lifts into a base
    if (isTransformDeclaration(longhand)) continue
    if (
      styleState.style &&
      longhand in styleState.style &&
      plainValueToPayload(styleState.style[longhand], longhand) === null
    ) {
      return false
    }
  }
  return true
}

/**
 * Claims every longhand for one parsed contribution. Ordinary flat values
 * replace the whole program. Converted legacy condition props append clauses
 * at their authored position and lift an earlier plain value into the base.
 */
export function contributeParsedProgram(
  styleState: GetStyleState,
  prop: string,
  value: ParsedValue,
  sourceProp = prop,
  appendClauses = false
): void {
  const programs = (styleState.programs ||= new Map<string, LonghandProgram>())

  for (const longhand of longhandsFor(prop, styleState)) {
    const existing = appendClauses ? programs.get(longhand) : undefined
    const displaced = isTransformDeclaration(longhand)
      ? displaceFlatTransforms(styleState, longhand, programs)
      : displacePlainStyles(styleState, longhand, programs, sourceProp)

    let nextValue = value
    if (appendClauses) {
      let base = existing?.value.base ?? value.base
      if (base === null && displaced !== noPlainValue) {
        base = plainValueToPayload(displaced, longhand)
      }
      nextValue = {
        base,
        clauses: existing ? [...existing.value.clauses, ...value.clauses] : value.clauses,
      }
    }

    programs.delete(longhand)
    programs.set(longhand, { property: longhand, value: nextValue, sourceProp })
    styleState.usedKeys[longhand] = 1
  }
}

/**
 * Returns true when the value was consumed as programs. False means the caller
 * proceeds down the existing plain-value path.
 */
export function contributeStylePrograms(
  styleState: GetStyleState,
  key: string,
  val: string
): boolean {
  // the transform family (x, y, scale, scaleX, scaleY, rotate) routes through
  // programs; every other transform part and the raw `transform` string stay
  // legacy this round, so skews, perspective, 3D rotations, and matrix keep
  // their flatTransforms path untouched
  if (
    !transformFamilyProps.has(key) &&
    (key in stylePropsTransform || key === 'transform')
  ) {
    return false
  }

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

  for (const entry of cached.programs) {
    contributeParsedProgram(styleState, entry.property, entry.value, key)
  }

  return true
}

/** mergeStyle calls this so a later plain value replaces any program it covers */
export function deleteProgramsForStyleKey(
  programs: Map<string, LonghandProgram>,
  key: string
): void {
  const declarations = transformDeclarationsFor(key)
  if (declarations.length) {
    for (const declaration of declarations) programs.delete(declaration)
    return
  }
  const longhands = longhandExpansionTable[key]
  if (longhands) {
    for (const longhand of longhands) programs.delete(longhand)
  } else {
    programs.delete(key)
  }
}
