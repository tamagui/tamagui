// Lane W1: flat value programs entering the forward pass.
//
// Every string style value contributes per-longhand programs: a clause-free
// string is a base-only program, so configured bare names and numeric strings
// resolve config-first through the payload identifier lookup (`p="4"` is the
// configured space token. A clause-shaped string that fails to
// parse throws in development (v3 cutover) — a top-level colon is never valid
// CSS, so it can only be a typo — except on aspectRatio, whose RN value space
// legitimately holds "16:9". Colon-free strings that fail to parse fall
// through to the plain-value path in every mode.
// See plans/dom-tailwind-flat-values.md, "Programs and merging" and the phase
// 5 wiring lanes.

import {
  borderFamilyTargets,
  expandToLonghands,
  fontShorthandTargets,
  legacyTransformKeysFor,
  longhandExpansionTable,
  type LonghandProgram,
  mergeProgramValues,
  type ParsedValue,
  legacyPartComposite,
  programEligibility,
  textDecorationFamilyTargets,
  transformDeclarationUnit,
  transformDeclarationsFor,
  transformFamilyProps,
  uniformLegacySiblings,
  unitlessNumberProperties,
} from '@tamagui/style-grammar'

import type { GetStyleState } from '../types'
import { resetLoweredProgramCache } from './lowerAccumulatedPrograms'
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
    // stale lowered entries are unreachable (revision-keyed) — clear for memory
    resetLoweredProgramCache()
  }
  return context
}

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

// exported for the internal-runtime projection only: another frontend
// serializing numeric/arbitrary values must reuse THIS units heuristic, never
// copy it (a second units heuristic is the second-table disease)
export function plainValueToPayload(value: unknown, longhand: string): string | null {
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
  if (declarations.length) return declarations
  // a family prop enumerates every longhand it could touch; the
  // value-dependent split narrows this before contribution
  const family = borderFamilyTargets[prop]
  if (family) return [...family.width, ...family.style, ...family.color]
  const decoration = textDecorationFamilyTargets[prop]
  if (decoration) return [...decoration.line, ...decoration.style, ...decoration.color]
  const font = fontShorthandTargets[prop]
  if (font)
    return [
      ...font.style,
      ...font.weight,
      ...font.size,
      ...font.lineHeight,
      ...font.family,
    ]
  return expandToLonghands(prop, styleState.conf.shorthands)
}

function isTransformDeclaration(longhand: string): boolean {
  return transformDeclarationUnit[longhand] !== undefined
}

function syncProgramLifecycle(
  styleState: GetStyleState,
  longhand: string,
  value: ParsedValue
): void {
  let enter: true | undefined
  let exit: true | undefined
  for (const clause of value.clauses) {
    for (const modifier of clause.modifiers) {
      if (modifier === 'enter' || modifier === 'starting') enter = true
      if (modifier === 'exit' || modifier === 'ending') exit = true
    }
  }
  if (enter || exit) {
    ;(styleState.programLifecycle ||= new Map()).set(longhand, { enter, exit })
  } else {
    styleState.programLifecycle?.delete(longhand)
  }
}

/** Clear lifecycle metadata when a plain value displaces a program. */
export function clearProgramLifecycleForProp(
  styleState: GetStyleState,
  prop: string
): void {
  if (!styleState.programLifecycle?.size) return
  for (const longhand of longhandsFor(prop, styleState)) {
    styleState.programLifecycle.delete(longhand)
  }
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

/**
 * Claims every longhand for one parsed contribution. Later contributions
 * replace the base and any condition sets they restate while preserving the
 * other clauses already accumulated for that longhand.
 */
export function contributeParsedProgram(
  styleState: GetStyleState,
  prop: string,
  value: ParsedValue,
  sourceProp = prop
): void {
  const programs = (styleState.programs ||= new Map<string, LonghandProgram>())

  // mirror setLastFontFamilyToken: a base naming a configured family drives
  // the font_* scope class on web and per-family variable resolution on native
  if (prop === 'fontFamily' && value.base) {
    if (styleState.conf.fontsParsed?.[value.base]) {
      styleState.fontFamily = value.base
    }
  }

  for (const longhand of longhandsFor(prop, styleState)) {
    const existing = programs.get(longhand)
    const displaced = isTransformDeclaration(longhand)
      ? displaceFlatTransforms(styleState, longhand, programs)
      : displacePlainStyles(styleState, longhand, programs, sourceProp)

    // the merge unit is the clause (decision 21): the later contribution
    // replaces the base and the condition sets it restates; everything else
    // survives, and an earlier plain value lifts into the base when neither
    // side states one
    let earlier = existing?.value ?? null
    if (displaced !== noPlainValue && (earlier?.base ?? null) === null) {
      const displacedBase = plainValueToPayload(displaced, longhand)
      if (displacedBase !== null) {
        earlier = earlier
          ? { base: displacedBase, clauses: earlier.clauses }
          : { base: displacedBase, clauses: [] }
      }
    }
    const nextValue = earlier ? mergeProgramValues(earlier, value) : value

    programs.delete(longhand)
    programs.set(longhand, { property: longhand, value: nextValue, sourceProp })
    syncProgramLifecycle(styleState, longhand, nextValue)
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
  // program eligibility has one owner (style-grammar): RN shadow parts and
  // non-family transform parts have no per-part clause spelling by design —
  // the composite property owns it. plain values keep their legacy pipeline;
  // a clause-shaped value drops with a diagnostic naming the migration, so
  // it can never forward into malformed CSS or a mangled native string
  if (programEligibility(key) === 'legacy-part') {
    if (val.indexOf(':') !== -1) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `[tamagui] ${key}="${val}": conditional values are not supported on part props — move the condition onto \`${legacyPartComposite[key]}\``
        )
      }
      return true
    }
    return false
  }

  // the `transform` property replaces its whole function list, so legacy part
  // props cannot compose with a transform program on one element — the
  // program wins and the mix is a dev diagnostic, never an undefined order
  if (key === 'transform' && styleState.flatTransforms) {
    for (const legacyKey in styleState.flatTransforms) {
      if (transformFamilyProps.has(legacyKey)) continue
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `[tamagui] legacy transform part "${legacyKey}" beside a flat \`transform\` value: the transform program replaces the whole function list. Move "${legacyKey}" into the transform value.`
        )
      }
      delete styleState.flatTransforms[legacyKey]
      delete styleState.usedKeys[legacyKey]
    }
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
      // v3 cutover: a top-level colon is never valid CSS, so a clause-shaped
      // string that fails to parse is a typo (`hver:blue`) and hides broken
      // styling if it passes through — throw where the author can see it.
      // aspectRatio is the one RN value space that legitimately holds a colon
      // ("16:9"), so it stays a silent fallthrough, as does any colon-free
      // string (unterminated or invalid CSS the author wrote as a plain
      // value). production never throws
      if (key !== 'aspectRatio' && val.indexOf(':') !== -1) {
        throw new Error(
          `[tamagui] ${key}="${val}" looks like a flat value program but does not parse (${cached.errors[0].code}). Fix the value, or if this is intentional CSS, remove the top-level ":".`
        )
      }
    }
    return false
  }

  for (const entry of cached.programs) {
    contributeParsedProgram(styleState, entry.property, entry.value, key)
  }

  return true
}

/**
 * Numeric values on the transform family contribute base-only programs so the
 * family always composes in the canonical CSS order (translate, rotate,
 * scale). Without this, a numeric x beside a string rotate falls into the
 * legacy tail and its order against the family entries flips. Numbers stay
 * literal (px/deg by declaration unit), never config-resolved.
 */
export function contributeTransformNumber(
  styleState: GetStyleState,
  key: string,
  val: number
): boolean {
  if (!Number.isFinite(val)) return false
  const declarations = transformDeclarationsFor(key)
  if (!declarations.length) return false
  const payload = plainValueToPayload(val, declarations[0])
  if (payload === null) return false
  ensureGrammarContext(styleState)
  contributeParsedProgram(styleState, key, { base: payload, clauses: [] }, key)
  return true
}

/** mergeStyle calls this so a later plain value replaces any program it covers */
/**
 * A later plain BASE write on a program-owned longhand restates the program's
 * base clause instead of destroying the program (decision 21): the styled
 * hover survives a call-site `bg="red"`, whether that override arrives as a
 * flat value, a plain prop, or a `style` object. Returns true when the value
 * was fully absorbed and the caller must skip its own store write. Values
 * that cannot become a payload fall back to wholesale replacement so nothing
 * mixes stores.
 */
export function absorbPlainIntoPrograms(
  styleState: GetStyleState,
  key: string,
  val: unknown
): boolean {
  const programs = styleState.programs
  if (!programs || !programs.size) return false

  const declarations = transformDeclarationsFor(key)
  const isTransform = declarations.length > 0
  const longhands: readonly string[] = isTransform
    ? declarations
    : (longhandExpansionTable[key] ?? singleKey(key))

  let anyProgram = false
  for (let index = 0; index < longhands.length; index++) {
    if (programs.has(longhands[index])) {
      anyProgram = true
      break
    }
  }
  if (!anyProgram) return false

  // a transform value that cannot become a payload (NaN, `cond && 2` false)
  // bails wholesale: covered programs go, the caller writes the raw value to
  // flatTransforms exactly as legacy did — never silently drop both (M1)
  if (isTransform && plainValueToPayload(val, longhands[0]) === null) {
    for (let index = 0; index < longhands.length; index++) {
      programs.delete(longhands[index])
      styleState.programLifecycle?.delete(longhands[index])
      delete styleState.usedKeys[longhands[index]]
    }
    return false
  }

  // per-slot values: transforms cover their axes uniformly, geometric
  // shorthands expand by the CSS slot pattern, single keys pass through
  let perSlot: readonly unknown[] | null
  if (longhands.length === 1 || isTransform) {
    perSlot = longhands.length === 1 ? singleValue(val) : [val, val]
  } else {
    perSlot = expandShorthandValue(val, longhands)
  }
  if (!perSlot) {
    // unexpandable shorthand over programs: wholesale replacement, caller
    // writes its store. usedKeys entries the programs installed go too, so a
    // later shorthand expansion is not suppressed by a stale mark (M5)
    for (let index = 0; index < longhands.length; index++) {
      programs.delete(longhands[index])
      styleState.programLifecycle?.delete(longhands[index])
      delete styleState.usedKeys[longhands[index]]
    }
    return false
  }

  for (let index = 0; index < longhands.length; index++) {
    const longhand = longhands[index]
    const existing = programs.get(longhand)
    if (existing) {
      const payload = plainValueToPayload(perSlot[index], longhand)
      if (payload === null) {
        // not expressible as a payload: this longhand reverts to plain
        programs.delete(longhand)
        styleState.programLifecycle?.delete(longhand)
        if (!isTransform) writePlainSlot(styleState, longhand, perSlot[index])
        continue
      }
      programs.delete(longhand)
      programs.set(longhand, {
        property: longhand,
        value: mergeProgramValues(existing.value, {
          base: payload,
          clauses: emptyClauses,
        }),
        sourceProp: key,
      })
      syncProgramLifecycle(styleState, longhand, programs.get(longhand)!.value)
      styleState.usedKeys[longhand] = 1
    } else if (longhands.length > 1) {
      if (isTransform) {
        // a uniform transform value covers every axis: the sibling axis gets a
        // base-only program so nothing is dropped (`scale: 2` beside a scaleX
        // program still scales y)
        const payload = plainValueToPayload(perSlot[index], longhand)
        if (payload !== null) {
          programs.set(longhand, {
            property: longhand,
            value: { base: payload, clauses: emptyClauses },
            sourceProp: key,
          })
          styleState.usedKeys[longhand] = 1
        }
      } else {
        writePlainSlot(styleState, longhand, perSlot[index])
      }
    }
  }
  return true
}

const emptyClauses: readonly never[] = []
const singleKeyCache: Record<string, [string]> = {}
function singleKey(key: string): readonly string[] {
  return (singleKeyCache[key] ||= [key])
}
const singleValueBox: [unknown] = [null]
function singleValue(val: unknown): readonly unknown[] {
  singleValueBox[0] = val
  return singleValueBox
}

// writes at fixed base importance with no normalization: reachable only from
// mergeStylePropAtCurrentPosition (importance 1) because geometric shorthands
// are pre-expanded before mergeStyle. revisit if absorb ever runs for a
// shorthand at importance >= 2 (M4)
function writePlainSlot(
  styleState: GetStyleState,
  longhand: string,
  value: unknown
): void {
  styleState.style ||= {}
  styleState.style[longhand] = value
  styleState.usedKeys[longhand] = 1
}
