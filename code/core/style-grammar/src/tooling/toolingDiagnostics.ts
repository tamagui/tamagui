import type { GrammarConfigView } from './candidate'
import {
  resolveCandidateTarget,
  type CandidateContribution,
  type CandidatePropertyMismatch,
} from './candidateTarget'
import { createGrammarConfigView, type GrammarSourceConfig } from './config'
import { splitGeometricShorthandValue } from '../shorthands/geometricShorthand'
import { formatParsedValue } from './toolingFormat'
import { validatePayloadShape, type PayloadShapeDiagnostic } from '../ast/payloadShape'
import { legacyPartComposite, programEligibility } from '../programs/programEligibility'
import {
  resolvePayload,
  type PayloadReference,
  type PayloadResolveErrorCode,
  type ReferenceKind,
} from '../ast/resolvePayload'
import {
  fontWeightNames,
  grammarEntries,
  propToGrammarEntry,
  standaloneValueProps,
  type TokenCategory,
} from './registry'
import {
  parseValue,
  parseValueWithSourceSpans,
  type ValueSourceSpan,
} from '../ast/valueParser'
import type {
  ModifierRegistryView,
  ParsedValue,
  ValueParseError,
  ValueParseErrorCode,
} from '../ast/valueTypes'
import { v6RemovedThemeNames, v6ThemeNameReplacements } from '../v6ThemeNames'
import { namedCssColors } from '../runtime/namedCssColors'
import { getTokenCategoryName, propToTokenCategoryCode } from '../runtime/tokenCategories'
import { hasTokenName } from './candidate'

type Names = readonly string[] | ReadonlySet<string> | Readonly<Record<string, unknown>>

export type CandidatePropertyVocabulary = ReadonlyMap<
  string,
  readonly CandidateContribution[]
>

export type StyleValueDiagnosticCode =
  | ValueParseErrorCode
  | PayloadResolveErrorCode
  | CandidatePropertyMismatch['code']
  | PayloadShapeDiagnostic['code']
  | 'legacy-part-conditional'
  | 'v6-theme-name-replaced'
  | 'v6-theme-name-removed'
  | 'v2-dollar-prefix'
  | 'v2-removed-prop'
  | 'unknown-payload-value'

export interface StyleValueDiagnostic {
  code: StyleValueDiagnosticCode
  /** kept for compatibility; always equals `start` */
  index: number
  /** character span within the authored value the diagnostic points at */
  start: number
  end: number
  message: string
  candidate?: string
  property?: string
  contributedProperties?: readonly string[]
  replacement?: string
}

export interface DiagnoseStyleValueOptions {
  config: GrammarConfigView
  registry: ModifierRegistryView
  candidates?: CandidatePropertyVocabulary
  strictPayloads?: boolean
}

export interface SerializedGrammarSourceConfig {
  shorthands?: GrammarSourceConfig['shorthands']
  media?: GrammarSourceConfig['media']
  themes?: GrammarSourceConfig['themes']
  tokens?: GrammarSourceConfig['tokensParsed']
  fonts?: GrammarSourceConfig['fontsParsed']
}

export interface SerializedGrammarConfigMetadata {
  themeFields: 'values-only'
}

export type StyleValueCompletionKind = 'configured' | 'keyword' | 'modifier'

export interface StyleValueCompletion {
  value: string
  kind: StyleValueCompletionKind
  insertText?: string
}

export interface StyleValueCursorCompletions {
  replaceStart: number
  replaceLength: number
  completions: readonly StyleValueCompletion[]
}

export type CanonicalStyleValueResult =
  | { ok: true; value: string; parsed: ParsedValue }
  | { ok: false; errors: readonly ValueParseError[] }

/** Parses and prints the canonical surface spelling for the same value IR. */
export function canonicalizeStyleValue(
  input: string,
  registry: ModifierRegistryView
): CanonicalStyleValueResult {
  const parsed = parseValue(input, registry)
  if (!parsed.ok) return parsed
  return {
    ok: true,
    value: formatParsedValue(parsed.value),
    parsed: parsed.value,
  }
}

function forEachName(names: Names | undefined, visit: (name: string) => void): void {
  if (!names) return
  if (Array.isArray(names)) {
    for (const name of names) visit(name)
    return
  }
  if (names instanceof Set) {
    for (const name of names) visit(name)
    return
  }
  for (const name in names as Readonly<Record<string, unknown>>) visit(name)
}

/**
 * Projects the config vocabulary into the properties each name can target.
 *
 * Tooling consumes this projection rather than inferring from spelling. A name
 * shared by categories keeps every contribution, and the shared target
 * validator selects the authored property or reports the mismatch.
 */
export function createCandidatePropertyVocabulary(
  config: GrammarConfigView
): CandidatePropertyVocabulary {
  const byName = new Map<string, CandidateContribution[]>()
  const entriesByCategory = new Map<TokenCategory, CandidateContribution[]>()

  for (const entry of grammarEntries) {
    if (!entry.tokenCategory) continue
    const contributions = entriesByCategory.get(entry.tokenCategory) || []
    contributions.push({ property: entry.prop, tokenCategory: entry.tokenCategory })
    entriesByCategory.set(entry.tokenCategory, contributions)
  }

  for (const [category, contributions] of entriesByCategory) {
    forEachName(config.tokenNames?.[category], (name) => {
      const existing = byName.get(name) || []
      for (const contribution of contributions) {
        if (!existing.some((item) => item.property === contribution.property)) {
          existing.push(contribution)
        }
      }
      byName.set(name, existing)
    })
  }

  return byName
}

/**
 * Projects the JSON config emitted by Tamagui's compiler into the same grammar
 * view the runtime creates from its live config.
 */
export function createGrammarConfigViewFromSerializedConfig(
  config: SerializedGrammarSourceConfig,
  metadata?: unknown
): GrammarConfigView {
  const isVersioned =
    typeof metadata === 'object' &&
    metadata !== null &&
    (metadata as { themeFields?: unknown }).themeFields === 'values-only'
  if (metadata !== undefined && !isVersioned) {
    throw new Error(
      '@tamagui/style-grammar: unsupported serialized config themeFields format'
    )
  }

  const themes: Record<string, Readonly<Record<string, unknown>>> = {}
  for (const themeName in config.themes) {
    const serializedTheme = config.themes[themeName]
    if (!serializedTheme || typeof serializedTheme !== 'object') continue
    const runtimeTheme: Record<string, unknown> = {}
    for (const key in serializedTheme) {
      // Unversioned compiler artifacts injected `id` into the theme value
      // namespace and overwrote any user value with that name. Keep this exact
      // legacy cleanup only until stale artifacts have been regenerated.
      if (isVersioned || key !== 'id') {
        runtimeTheme[key] = (serializedTheme as Readonly<Record<string, unknown>>)[key]
      }
    }
    themes[themeName] = runtimeTheme
  }
  return createGrammarConfigView({
    shorthands: config.shorthands,
    media: config.media,
    themes,
    tokensParsed: config.tokens,
    fontsParsed: config.fonts,
  })
}

const removedThemeNames: ReadonlySet<string> = new Set(v6RemovedThemeNames)
const grammarProperties: ReadonlySet<string> = new Set(
  grammarEntries.map((entry) => entry.prop)
)

const categoryReferenceKind: Readonly<Record<TokenCategory, ReferenceKind>> = {
  color: 'color',
  space: 'length',
  size: 'length',
  radius: 'length',
  zIndex: 'number',
  fontFamily: 'other',
  fontSize: 'length',
  fontWeight: 'number',
  lineHeight: 'length',
  letterSpacing: 'length',
}

/**
 * The reference kind a candidate resolves as for one target property: the
 * category it binds the target through, else color if any contribution is a
 * color (so opacity suffixes keep their authored meaning), else the first.
 */
export function referenceKindFor(
  contributions: readonly CandidateContribution[],
  targetProperty: string
): ReferenceKind {
  let fallback: ReferenceKind | undefined
  for (const contribution of contributions) {
    const kind = contribution.tokenCategory
      ? categoryReferenceKind[contribution.tokenCategory]
      : 'other'
    if (contribution.property === targetProperty) return kind
    if (fallback !== 'color') fallback = kind
  }
  return fallback ?? 'other'
}

function parseErrorSpan(
  input: string,
  error: ValueParseError
): { start: number; end: number } {
  const length = input.length
  if (error.code === 'unregistered-modifier' && error.modifier) {
    return { start: error.index, end: error.index + error.modifier.length }
  }
  if (
    error.code === 'unterminated-string' ||
    error.code === 'unterminated-function' ||
    error.code === 'unterminated-comment'
  ) {
    // an unclosed delimiter owns everything after it, so the squiggle does too
    return { start: Math.max(0, Math.min(error.index, length - 1)), end: length }
  }
  const start = Math.max(0, Math.min(error.index, length - 1))
  // `*/` is two characters; every other single-character code is one
  const width = error.code === 'stray-comment-close' ? 2 : 1
  return { start, end: Math.min(length, start + width) }
}

/** index just past the candidate and any attached `/suffix` run */
function candidateEndWithSuffix(payload: string, end: number): number {
  if (payload.charCodeAt(end) !== 47) return end
  let cursor = end + 1
  while (cursor < payload.length) {
    const code = payload.charCodeAt(cursor)
    // component-value boundary, matching the resolver's isBoundary
    if (code === 32 || code === 9 || code === 10 || code === 13 || code === 12) break
    if (code === 44 || code === 40 || code === 41) break
    cursor++
  }
  return cursor
}

type CandidateSighting = {
  start: number
  end: number
  name: string
  resolved: PayloadReference | undefined
}

export const removedV2Props: Readonly<Record<string, string>> = Object.freeze({
  animation: 'transition=',
  hoverStyle: 'hover:',
  pressStyle: 'press:',
  focusStyle: 'focus:',
  enterStyle: 'enter:',
  exitStyle: 'exit:',
})

const globalCssKeywords: ReadonlySet<string> = new Set([
  'inherit',
  'initial',
  'unset',
  'revert',
  'revert-layer',
])

const spaceKeywords: ReadonlySet<string> = new Set(['auto', 'normal', 'safe'])

const sizeKeywords: ReadonlySet<string> = new Set([
  'auto',
  'fit-content',
  'max-content',
  'min-content',
  'none',
  'full',
  'screen',
  'min',
  'max',
  'fit',
  'intrinsic',
  'content',
])

const radiusKeywords: ReadonlySet<string> = new Set(['none'])

const zIndexKeywords: ReadonlySet<string> = new Set(['auto'])

const borderWidthKeywordsSet: ReadonlySet<string> = new Set(['thin', 'medium', 'thick'])

const fontKeywords: ReadonlySet<string> = new Set([
  'normal',
  'sans-serif',
  'serif',
  'monospace',
  'cursive',
  'fantasy',
  'system-ui',
  'ui-sans-serif',
  'ui-serif',
  'ui-monospace',
  'ui-rounded',
  'emoji',
  'math',
  'fangsong',
  'sans',
  'serif',
  'mono',
])

const sizeCategoryFallbacks: ReadonlySet<TokenCategory> = new Set([
  'width',
  'minWidth',
  'maxWidth',
  'inlineSize',
  'minInlineSize',
  'maxInlineSize',
  'flexBasis',
])

function editDistance(a: string, b: string): number {
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index)
  for (let aIndex = 0; aIndex < a.length; aIndex++) {
    let diagonal = previous[0]!
    previous[0] = aIndex + 1
    for (let bIndex = 0; bIndex < b.length; bIndex++) {
      const above = previous[bIndex + 1]!
      previous[bIndex + 1] = Math.min(
        previous[bIndex]! + 1,
        above + 1,
        diagonal + (a[aIndex] === b[bIndex] ? 0 : 1)
      )
      diagonal = above
    }
  }
  return previous[b.length]!
}

function findNearestCompletion(
  payload: string,
  completions: readonly StyleValueCompletion[]
): string | undefined {
  let bestCandidate: string | undefined
  let bestDistance = Number.POSITIVE_INFINITY
  const maxAllowedDistance = Math.max(3, Math.floor(payload.length * 0.6))

  for (const completion of completions) {
    const val = completion.value
    if (Math.abs(val.length - payload.length) > maxAllowedDistance) continue
    const distance = editDistance(payload, val)
    if (distance < bestDistance && distance <= maxAllowedDistance) {
      bestDistance = distance
      bestCandidate = val
    }
  }
  return bestCandidate
}

function isSingleBareToken(payload: string): boolean {
  if (/\s/.test(payload)) return false
  if (payload.includes('(') || payload.includes(')')) return false
  if (payload.startsWith('"') || payload.startsWith("'")) return false
  if (/^#[0-9a-fA-F]{3,8}$/.test(payload)) return false
  if (/^-?(?:\d+|\d*\.\d+)(?:%|[a-zA-Z]+)$/.test(payload)) return false
  return true
}

function hasTokenVocabulary(
  config: GrammarConfigView,
  category: TokenCategory | undefined,
  targetProperty: string,
  candidates: CandidatePropertyVocabulary
): boolean {
  if (category) {
    const domain =
      config.tokenNames?.[category] ||
      (sizeCategoryFallbacks.has(category) ? config.tokenNames?.size : undefined)
    if (domain) {
      if (Array.isArray(domain) && domain.length > 0) return true
      if (domain instanceof Set && domain.size > 0) return true
      if (typeof domain === 'object' && Object.keys(domain).length > 0) return true
    }
  }
  for (const [, contributions] of candidates) {
    for (const contribution of contributions) {
      if (contribution.property === targetProperty) return true
    }
  }
  return false
}

function isKnownPropertyValue(
  payload: string,
  targetProperty: string,
  category: TokenCategory | undefined,
  config: GrammarConfigView,
  candidates: CandidatePropertyVocabulary
): boolean {
  if (/^-?(?:\d+|\d*\.\d+)$/.test(payload)) return true
  if (globalCssKeywords.has(payload)) return true
  if (standaloneValueProps[targetProperty]?.[payload] !== undefined) return true
  if (targetProperty === 'fontWeight' && payload in fontWeightNames) return true

  const contributions = candidates.get(payload)
  if (
    contributions &&
    resolveCandidateTarget(targetProperty, payload, contributions).ok
  ) {
    return true
  }

  if (category && hasTokenName(config, category, payload)) return true

  if (category === 'color') {
    if (
      payload === 'transparent' ||
      payload === 'currentColor' ||
      payload === 'currentcolor'
    )
      return true
    if (namedCssColors.has(payload.toLowerCase())) return true
    if (payload.includes('/')) {
      const slash = payload.lastIndexOf('/')
      const base = payload.slice(0, slash)
      const opacity = payload.slice(slash + 1)
      if (/^\d+(?:\.\d+)?$/.test(opacity)) {
        const baseContribs = candidates.get(base)
        if (baseContribs && resolveCandidateTarget(targetProperty, base, baseContribs).ok)
          return true
        if (
          namedCssColors.has(base.toLowerCase()) ||
          base === 'transparent' ||
          base === 'currentColor'
        )
          return true
      }
    }
  }

  if (category === 'space' && spaceKeywords.has(payload)) return true

  if (
    (category === 'size' || (category && sizeCategoryFallbacks.has(category))) &&
    sizeKeywords.has(payload)
  ) {
    return true
  }

  if (category === 'radius' && radiusKeywords.has(payload)) return true
  if (category === 'zIndex' && zIndexKeywords.has(payload)) return true
  if (targetProperty.endsWith('Width') && borderWidthKeywordsSet.has(payload)) return true

  if (
    (category === 'fontFamily' ||
      category === 'lineHeight' ||
      category === 'letterSpacing') &&
    fontKeywords.has(payload)
  ) {
    return true
  }

  if (targetProperty === 'boxShadow' && payload === 'none') return true

  return false
}

/**
 * Returns the diagnostics every static frontend must agree on for one authored
 * style value. Source tools locate the value; this function owns its meaning.
 */
export function diagnoseStyleValue(
  property: string,
  input: string,
  options: DiagnoseStyleValueOptions
): readonly StyleValueDiagnostic[] {
  const removedReplacement = removedV2Props[property]
  if (removedReplacement) {
    return [
      {
        code: 'v2-removed-prop',
        index: 0,
        start: 0,
        end: input.length,
        property,
        message:
          property === 'animation'
            ? `"${property}" was removed in v3; use "transition=" instead`
            : `"${property}" was removed in v3; use "${removedReplacement}" clauses instead`,
      },
    ]
  }

  const { result, spans } = parseValueWithSourceSpans(input, options.registry)
  if (!result.ok) {
    return result.errors.map((error) => {
      const span = parseErrorSpan(input, error)
      return {
        code: error.code,
        index: span.start,
        ...span,
        message: error.message,
      }
    })
  }

  const targetProperty = options.config.shorthands?.[property] || property
  const targetIsKnown = grammarProperties.has(targetProperty)
  const candidates =
    options.candidates || createCandidatePropertyVocabulary(options.config)
  const diagnostics: StyleValueDiagnostic[] = []
  const diagnosed = new Set<string>()

  const push = (key: string, diagnostic: Omit<StyleValueDiagnostic, 'index'>): void => {
    if (diagnosed.has(key)) return
    diagnosed.add(key)
    diagnostics.push({ index: diagnostic.start, ...diagnostic })
  }

  const diagnoseSegment = (payload: string, offset: number): void => {
    const sightings: CandidateSighting[] = []
    const resolved = resolvePayload(payload, {
      lookup(name) {
        const contributions = candidates.get(name)
        if (!contributions) return undefined
        return { name, kind: referenceKindFor(contributions, targetProperty) }
      },
      onCandidate(start, end, name, reference) {
        sightings.push({ start, end, name, resolved: reference })
        if (reference) return

        const replacement =
          v6ThemeNameReplacements[name as keyof typeof v6ThemeNameReplacements]
        if (replacement) {
          push(`v6-theme-name-replaced:${name}`, {
            code: 'v6-theme-name-replaced',
            start: offset + start,
            end: offset + end,
            candidate: name,
            replacement,
            message: `"${name}" is not a v6 built-in name; use "${replacement}"`,
          })
        } else if (removedThemeNames.has(name)) {
          push(`v6-theme-name-removed:${name}`, {
            code: 'v6-theme-name-removed',
            start: offset + start,
            end: offset + end,
            candidate: name,
            message: `"${name}" was removed from the v6 built-in theme vocabulary`,
          })
        }
      },
    })

    if (targetIsKnown) {
      for (const error of resolved.errors) {
        // an opacity attempt on an unresolved ident is legal CSS slash syntax
        // (`grid-area: a/2`), so only resolved candidates report
        const sighting = sightings.find((entry) => entry.start === error.index)
        if (!sighting?.resolved) continue
        push(`${error.code}:${error.name}:${error.opacity}`, {
          code: error.code,
          start: offset + error.index,
          end: offset + candidateEndWithSuffix(payload, sighting.end),
          candidate: error.name,
          message: error.message,
        })
      }
    }

    const candidate =
      resolved.segments.length === 1 && typeof resolved.segments[0] !== 'string'
        ? resolved.segments[0].name
        : null
    if (candidate === null || !targetIsKnown) return
    const contributions = candidates.get(candidate)
    if (!contributions) return

    const target = resolveCandidateTarget(targetProperty, candidate, contributions)
    if (target.ok) return
    const sighting = sightings.find((entry) => entry.name === candidate && entry.resolved)
    push(`${target.diagnostic.code}:${candidate}:${targetProperty}`, {
      ...target.diagnostic,
      start: offset + (sighting?.start ?? 0),
      end: offset + (sighting?.end ?? payload.length),
    })
  }

  for (const span of spans) {
    if (span.kind !== 'base' && span.kind !== 'payload') continue
    if (span.start >= span.end) continue
    const payload = input.slice(span.start, span.end)

    if (payload.startsWith('$')) {
      const stripped = payload.slice(1)
      push(`v2-dollar-prefix:${span.start}`, {
        code: 'v2-dollar-prefix',
        start: span.start,
        end: span.end,
        property,
        replacement: stripped,
        message: `v3 tokens have no "$" prefix, write "${stripped}" not "${payload}"`,
      })
      continue
    }

    diagnoseSegment(payload, span.start)

    if (options.strictPayloads && targetIsKnown) {
      if (candidates.has(payload)) continue
      if (!isSingleBareToken(payload)) continue
      const category =
        propToGrammarEntry[targetProperty]?.tokenCategory ||
        (getTokenCategoryName(
          propToTokenCategoryCode[targetProperty]
        ) as TokenCategory) ||
        undefined
      if (!hasTokenVocabulary(options.config, category, targetProperty, candidates))
        continue
      if (
        isKnownPropertyValue(
          payload,
          targetProperty,
          category,
          options.config,
          candidates
        )
      )
        continue

      const completions = completeStyleValue(property, {
        ...options,
        strictPayloads: false,
        candidates,
      })
      const suggestion = findNearestCompletion(payload, completions)
      const message = suggestion
        ? `unknown value "${payload}" for ${property}; did you mean "${suggestion}"?`
        : `unknown value "${payload}" for ${property}`

      push(`unknown-payload-value:${span.start}:${payload}`, {
        code: 'unknown-payload-value',
        start: span.start,
        end: span.end,
        property,
        candidate: payload,
        replacement: suggestion,
        message,
      })
    }
  }

  return diagnostics
}

/**
 * The modifier chain whose final colon sits directly before `start`, outermost
 * first. Shared by cursor completions and value annotations.
 */
export function modifierChainBefore(
  input: string,
  spans: readonly ValueSourceSpan[],
  start: number
): readonly string[] {
  const byEnd = new Map<number, ValueSourceSpan>()
  for (const span of spans) {
    if (span.kind === 'modifier') byEnd.set(span.end, span)
  }

  const reversed: string[] = []
  let colon = start - 1
  while (colon >= 0 && input.charCodeAt(colon) === 58) {
    const span = byEnd.get(colon)
    if (!span) break
    reversed.push(input.slice(span.start, span.end))
    colon = span.start - 1
  }
  reversed.reverse()
  return reversed
}

/**
 * Every prop name static tooling treats as a flat style value site: grammar
 * properties, legacy part props, and both sides of every configured shorthand.
 */
export function createStylePropSet(config: GrammarConfigView): ReadonlySet<string> {
  const styleProps = new Set([
    ...grammarEntries.map((entry) => entry.prop),
    ...Object.keys(legacyPartComposite),
    ...Object.keys(removedV2Props),
  ])
  for (const shorthand in config.shorthands) {
    styleProps.add(shorthand)
    styleProps.add(config.shorthands[shorthand])
  }
  return styleProps
}

/** the span of `payload` within `input`, else the whole value */
function payloadSpan(input: string, payload: string): { start: number; end: number } {
  const at = input.indexOf(payload)
  return at === -1
    ? { start: 0, end: input.length }
    : { start: at, end: at + payload.length }
}

/**
 * The complete static verdict for one authored value: everything
 * `diagnoseStyleValue` reports, plus the program-level rules — part props take
 * no conditionals, geometric shorthands split before per-slot target checks,
 * and single-value longhands take one component per slot. Every static
 * frontend (editor plugin, checker, lint rule) reports exactly this list.
 */
export function diagnoseStyleValueProgram(
  property: string,
  input: string,
  options: DiagnoseStyleValueOptions
): readonly StyleValueDiagnostic[] {
  const candidates =
    options.candidates || createCandidatePropertyVocabulary(options.config)
  const scoped = { ...options, candidates }
  const diagnostics = diagnoseStyleValue(property, input, scoped)
  if (diagnostics.length > 0) return diagnostics

  const parsed = parseValue(input, options.registry)
  if (!parsed.ok) return diagnostics

  const targetProperty = options.config.shorthands?.[property] || property
  if (
    parsed.value.clauses.length > 0 &&
    programEligibility(targetProperty) === 'legacy-part'
  ) {
    return [
      {
        code: 'legacy-part-conditional',
        index: 0,
        start: 0,
        end: input.length,
        property: targetProperty,
        message: `conditional values are not supported on part prop "${targetProperty}"; move the condition onto \`${legacyPartComposite[targetProperty]}\``,
      },
    ]
  }

  const results: StyleValueDiagnostic[] = []
  const reported = new Set<string>()
  const geometric = splitGeometricShorthandValue(targetProperty, parsed.value)
  const programs =
    geometric && geometric.errors.length === 0
      ? geometric.entries
      : [{ property: targetProperty, value: parsed.value }]

  for (const program of programs) {
    const { base, clauses } = program.value
    const payloads = [
      ...(base === null ? [] : [base]),
      ...clauses.map((clause) => clause.payload),
    ]
    for (const payload of payloads) {
      for (const diagnostic of diagnoseStyleValueProgramSlot(
        program.property,
        payload,
        scoped
      )) {
        const key = `${diagnostic.code}:${diagnostic.candidate}:${program.property}`
        if (reported.has(key)) continue
        reported.add(key)
        const span = payloadSpan(input, payload)
        results.push({ ...diagnostic, index: span.start, ...span })
      }
    }
    if (base !== null) {
      pushShapeDiagnostic(results, reported, input, program.property, base, true)
    }
    for (const clause of clauses) {
      pushShapeDiagnostic(
        results,
        reported,
        input,
        program.property,
        clause.payload,
        base !== null
      )
    }
  }

  return results
}

function diagnoseStyleValueProgramSlot(
  property: string,
  payload: string,
  options: DiagnoseStyleValueOptions
): readonly StyleValueDiagnostic[] {
  const slotDiagnostics = diagnoseStyleValue(property, payload, options)
  return slotDiagnostics.filter(
    (diagnostic) =>
      diagnostic.code === 'candidate-property-mismatch' ||
      diagnostic.code === 'unknown-payload-value' ||
      diagnostic.code === 'v2-dollar-prefix'
  )
}

function pushShapeDiagnostic(
  results: StyleValueDiagnostic[],
  reported: Set<string>,
  input: string,
  property: string,
  payload: string,
  hasBase: boolean
): void {
  const diagnostic = validatePayloadShape(property, payload, hasBase)
  if (!diagnostic) return
  const key = `${diagnostic.code}:${diagnostic.payload}:${property}`
  if (reported.has(key)) return
  reported.add(key)
  const span = payloadSpan(input, payload)
  results.push({
    code: diagnostic.code,
    index: span.start,
    ...span,
    property,
    message: diagnostic.message,
  })
}

/**
 * Returns the finite configured and keyword values that are valid for one
 * property. Every result passes through the same parser, config lookup, and
 * target validator used by diagnostics.
 */
export function completeStyleValue(
  property: string,
  options: DiagnoseStyleValueOptions
): readonly StyleValueCompletion[] {
  const candidates =
    options.candidates || createCandidatePropertyVocabulary(options.config)
  const targetProperty = options.config.shorthands?.[property] || property
  if (!grammarProperties.has(targetProperty)) return []

  const byValue = new Map<string, StyleValueCompletionKind>()
  for (const [value, contributions] of candidates) {
    if (resolveCandidateTarget(targetProperty, value, contributions).ok) {
      byValue.set(value, 'configured')
    }
  }

  const standalone = standaloneValueProps[targetProperty]
  if (standalone) {
    for (const value in standalone) {
      if (!byValue.has(value)) byValue.set(value, 'keyword')
    }
  }
  if (targetProperty === 'fontWeight') {
    for (const value in fontWeightNames) {
      if (!byValue.has(value)) byValue.set(value, 'keyword')
    }
  }

  const completions: StyleValueCompletion[] = []
  for (const [value, kind] of byValue) {
    if (
      diagnoseStyleValue(property, value, {
        ...options,
        candidates,
      }).length === 0
    ) {
      completions.push({ value, kind })
    }
  }

  completions.sort((a, b) => (a.value < b.value ? -1 : a.value > b.value ? 1 : 0))
  return completions
}

/**
 * Returns completions and a replacement span for one cursor position. Source
 * boundaries come from the runtime value scanner, including incomplete clause
 * payloads and modifier chains.
 */
export function completeStyleValueAtCursor(
  property: string,
  input: string,
  cursor: number,
  options: DiagnoseStyleValueOptions
): StyleValueCursorCompletions | null {
  if (cursor < 0 || cursor > input.length) return null
  const parsed = parseValueWithSourceSpans(input, options.registry)
  const active =
    parsed.spans.find(
      (span) => cursor >= span.start && cursor <= span.end && span.kind === 'modifier'
    ) ??
    parsed.spans.find(
      (span) =>
        cursor >= span.start &&
        cursor <= span.end &&
        span.kind === 'word' &&
        span.start > 0 &&
        parsed.result.ok &&
        parsed.spans.some(
          (segment) =>
            (segment.kind === 'base' || segment.kind === 'payload') &&
            segment.start < span.start &&
            segment.end >= span.end
        )
    ) ??
    parsed.spans.find(
      (span) =>
        cursor >= span.start &&
        cursor <= span.end &&
        span.kind !== 'modifier' &&
        span.kind !== 'word'
    )

  if (active?.kind === 'modifier' || active?.kind === 'word') {
    if (
      !parsed.result.ok &&
      parsed.result.errors.some(
        (error) =>
          error.code !== 'unregistered-modifier' &&
          error.code !== 'empty-modifier' &&
          error.code !== 'empty-payload'
      )
    ) {
      return null
    }
    return {
      replaceStart: active.start,
      replaceLength: active.end - active.start,
      completions: completeModifiers(
        options,
        input.charCodeAt(active.end) !== 58,
        active.kind === 'modifier'
          ? modifierChainBefore(input, parsed.spans, active.start)
          : []
      ),
    }
  }

  if (active) {
    if (
      !parsed.result.ok &&
      parsed.result.errors.some((error) => error.code !== 'empty-payload')
    ) {
      return null
    }
    return {
      replaceStart: active.start,
      replaceLength: active.end - active.start,
      // the first payload word is also where another modifier in the chain
      // begins, so both vocabularies remain available until the author picks.
      completions:
        active.kind === 'payload' && input.charCodeAt(active.start - 1) === 58
          ? [
              ...completeModifiers(
                options,
                true,
                modifierChainBefore(input, parsed.spans, active.start)
              ),
              ...completeStyleValue(property, options),
            ]
          : completeStyleValue(property, options),
    }
  }

  if (parsed.result.ok && cursor === input.length) {
    return {
      replaceStart: cursor,
      replaceLength: 0,
      completions: completeModifiers(options, true, []),
    }
  }

  return null
}

function completeModifiers(
  options: DiagnoseStyleValueOptions,
  appendColon: boolean,
  modifiers: readonly string[]
): readonly StyleValueCompletion[] {
  const names = options.registry.next?.(modifiers)
  if (!names) return []
  const completions: StyleValueCompletion[] = []
  for (const name of names) {
    completions.push({
      value: name,
      kind: 'modifier',
      insertText: appendColon ? `${name}:` : name,
    })
  }
  completions.sort((a, b) => (a.value < b.value ? -1 : a.value > b.value ? 1 : 0))
  return completions
}
