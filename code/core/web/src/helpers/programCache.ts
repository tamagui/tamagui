// The runtime parse cache for flat value programs (lane W4).
//
// See plans/dom-tailwind-flat-values.md — "Non-string and dynamic values", the
// boundary-in-detail part. This covers pipeline steps 1 and 2: parse the authored
// string, then split family props per longhand. It sits before resolution on
// purpose, which is what makes the cache immortal per config:
//
// - theme switching never invalidates it, because web resolution produces
//   variable references and native resolves through the granular theme
//   subscription at evaluate time;
// - state and media changes never invalidate it, because clauses are data, not
//   resolved branches.
//
// Template strings that embed changing values produce a new key each render, so
// the cache has a size cap and resets completely on overflow. A reset re-parses
// on demand and changes nothing observable, so there is no LRU bookkeeping.
//
// Parse errors are cached too: a bad value in a render loop must not re-parse
// every frame. Deciding what to do with an error (throw in development, drop the
// prop in production) belongs to the caller, not here.

import {
  borderFamilyTargets,
  fontShorthandTargets,
  parseValue,
  splitBackgroundValue,
  splitBorderValue,
  splitFontValue,
  splitTextDecorationValue,
  textDecorationFamilyTargets,
  type BorderFamilyError,
  type FontShorthandError,
  type ModifierRegistryView,
  type ParsedValue,
  type TextDecorationFamilyError,
  type ValueParseError,
} from '@tamagui/style-grammar'

/** one authored prop's contribution to one CSS longhand, pre-resolution */
export interface ProgramEntry {
  property: string
  value: ParsedValue
}

/** a background family component that is neither a color nor an image */
export interface BackgroundFamilyError {
  code: 'unsupported-bg-component'
  component: string
  where: 'base' | number
}

export type ProgramError =
  | ValueParseError
  | BackgroundFamilyError
  | BorderFamilyError
  | TextDecorationFamilyError
  | FontShorthandError

export type CachedEntry =
  | { programs: readonly ProgramEntry[]; errors?: undefined }
  | { programs?: undefined; errors: readonly ProgramError[] }

export interface ProgramCacheContext {
  /** the registry the active config's modifiers were built from */
  registry: ModifierRegistryView
  /** stamped at config creation; a new revision means a new cache generation */
  configRevision: string
  /** color token names, for classifying background family components */
  colorTokens: ReadonlySet<string>
}

/**
 * Authored props that expand to more than one background longhand. Geometric
 * shorthands (`padding`, `borderRadius`) are NOT split here: they expand during
 * the forward merge, so the cache stays keyed by the authored prop.
 */
export const backgroundFamilyProps: ReadonlySet<string> = new Set(['bg', 'background'])

// one map, keyed property + '\0' + input, matching the plan's cache design
const cache = new Map<string, CachedEntry>()

// generous enough that real apps never reach it, small enough to bound memory
const CACHE_LIMIT = 10_000

let context: ProgramCacheContext | null = null

/**
 * Replaces the active context wholesale and drops every cached entry, mirroring
 * how @tamagui/web holds a single active config. Called from config creation.
 */
export function setProgramCacheContext(next: ProgramCacheContext): void {
  context = next
  cache.clear()
}

export function resetProgramCache(): void {
  cache.clear()
}

/** for tests and diagnostics only */
export function getProgramCacheSize(): number {
  return cache.size
}

export function getCachedPrograms(property: string, input: string): CachedEntry {
  const key = `${property}\0${input}`
  const hit = cache.get(key)
  if (hit !== undefined) return hit

  const entry = computeEntry(property, input)

  // cap and reset wholesale, no LRU bookkeeping
  if (cache.size >= CACHE_LIMIT) cache.clear()
  cache.set(key, entry)
  return entry
}

function computeEntry(property: string, input: string): CachedEntry {
  if (context === null) {
    throw new Error(
      `@tamagui/web: the flat value program cache has no config context. setProgramCacheContext() must run during config creation, before "${property}" is parsed.`
    )
  }

  const parsed = parseValue(input, context.registry)
  if (!parsed.ok) {
    return { errors: parsed.errors }
  }

  if (backgroundFamilyProps.has(property)) {
    const split = splitBackgroundValue(parsed.value, context.colorTokens)
    if (split.errors.length > 0) {
      return { errors: split.errors }
    }
    return { programs: split.entries }
  }

  if (borderFamilyTargets[property]) {
    const split = splitBorderValue(property, parsed.value, context.colorTokens)
    if (split.errors.length > 0) {
      return { errors: split.errors }
    }
    return { programs: split.entries }
  }

  if (textDecorationFamilyTargets[property]) {
    const split = splitTextDecorationValue(parsed.value, context.colorTokens)
    if (split.errors.length > 0) {
      return { errors: split.errors }
    }
    return { programs: split.entries }
  }

  if (fontShorthandTargets[property]) {
    const split = splitFontValue(parsed.value)
    if (split.errors.length > 0) {
      return { errors: split.errors }
    }
    return { programs: split.entries }
  }

  return { programs: [{ property, value: parsed.value }] }
}
