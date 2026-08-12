import type { GrammarConfigView } from './candidate'
import {
  resolveCandidateTarget,
  type CandidateContribution,
  type CandidatePropertyMismatch,
} from './candidateTarget'
import { createGrammarConfigView, type GrammarSourceConfig } from './config'
import { formatParsedValue } from './mergeFlatValues'
import { stateModifierNames } from './modifierRegistry'
import { resolvePayload } from './resolvePayload'
import {
  fontWeightNames,
  grammarEntries,
  standaloneValueProps,
  type TokenCategory,
} from './registry'
import { parseValue, parseValueWithSourceSpans } from './valueParser'
import type {
  ModifierRegistryView,
  ParsedValue,
  ValueParseError,
  ValueParseErrorCode,
} from './valueTypes'
import { v6RemovedThemeNames, v6ThemeNameReplacements } from './v6ThemeNames'

type Names = readonly string[] | ReadonlySet<string> | Readonly<Record<string, unknown>>

export type CandidatePropertyVocabulary = ReadonlyMap<
  string,
  readonly CandidateContribution[]
>

export type StyleValueDiagnosticCode =
  | ValueParseErrorCode
  | CandidatePropertyMismatch['code']
  | 'v6-theme-name-replaced'
  | 'v6-theme-name-removed'

export interface StyleValueDiagnostic {
  code: StyleValueDiagnosticCode
  index: number
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
    contributions.push({ property: entry.prop })
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

/**
 * Returns the diagnostics every static frontend must agree on for one authored
 * style value. Source tools locate the value; this function owns its meaning.
 */
export function diagnoseStyleValue(
  property: string,
  input: string,
  options: DiagnoseStyleValueOptions
): readonly StyleValueDiagnostic[] {
  const parsed = parseValue(input, options.registry)
  if (!parsed.ok) {
    return parsed.errors.map((error) => ({
      code: error.code,
      index: error.index,
      message: error.message,
    }))
  }

  const targetProperty = options.config.shorthands?.[property] || property
  const targetIsKnown = grammarProperties.has(targetProperty)
  const candidates =
    options.candidates || createCandidatePropertyVocabulary(options.config)
  const diagnostics: StyleValueDiagnostic[] = []
  const diagnosed = new Set<string>()

  const diagnosePayload = (payload: string): void => {
    const resolved = resolvePayload(payload, {
      lookup(name) {
        const contributions = candidates.get(name)
        const replacement =
          v6ThemeNameReplacements[name as keyof typeof v6ThemeNameReplacements]

        if (!contributions && replacement) {
          const key = `v6-theme-name-replaced:${name}`
          if (!diagnosed.has(key)) {
            diagnosed.add(key)
            diagnostics.push({
              code: 'v6-theme-name-replaced',
              index: 0,
              candidate: name,
              replacement,
              message: `"${name}" is not a v6 built-in name; use "${replacement}"`,
            })
          }
          return undefined
        }

        if (!contributions && removedThemeNames.has(name)) {
          const key = `v6-theme-name-removed:${name}`
          if (!diagnosed.has(key)) {
            diagnosed.add(key)
            diagnostics.push({
              code: 'v6-theme-name-removed',
              index: 0,
              candidate: name,
              message: `"${name}" was removed from the v6 built-in theme vocabulary`,
            })
          }
          return undefined
        }

        return contributions ? { name, kind: 'other' } : undefined
      },
    })

    const candidate =
      resolved.segments.length === 1 && typeof resolved.segments[0] !== 'string'
        ? resolved.segments[0].name
        : null
    if (candidate === null || !targetIsKnown) return
    const contributions = candidates.get(candidate)
    if (!contributions) return

    const target = resolveCandidateTarget(targetProperty, candidate, contributions)
    if (target.ok) return
    const key = `${target.diagnostic.code}:${candidate}:${targetProperty}`
    if (diagnosed.has(key)) return
    diagnosed.add(key)
    diagnostics.push({
      ...target.diagnostic,
      index: 0,
    })
  }

  if (parsed.value.base !== null) diagnosePayload(parsed.value.base)
  for (const clause of parsed.value.clauses) diagnosePayload(clause.payload)

  return diagnostics
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
      completions: completeModifiers(options, input.charCodeAt(active.end) !== 58),
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
      completions: completeStyleValue(property, options),
    }
  }

  if (parsed.result.ok && cursor === input.length) {
    return {
      replaceStart: cursor,
      replaceLength: 0,
      completions: completeModifiers(options, true),
    }
  }

  return null
}

function completeModifiers(
  options: DiagnoseStyleValueOptions,
  appendColon: boolean
): readonly StyleValueCompletion[] {
  const names = new Set<string>()
  for (const name of stateModifierNames) {
    names.add(name)
    names.add(`group-${name}`)
  }
  forEachName(options.config.mediaNames, (name) => names.add(name))
  forEachName(options.config.containerSizeNames, (name) => names.add(`@${name}`))
  forEachName(options.config.themeNames, (name) => names.add(name))
  forEachName(options.config.platformNames, (name) => names.add(name))

  const completions: StyleValueCompletion[] = []
  for (const name of names) {
    if (options.registry.get(name) === undefined) continue
    completions.push({
      value: name,
      kind: 'modifier',
      insertText: appendColon ? `${name}:` : name,
    })
  }
  completions.sort((a, b) => (a.value < b.value ? -1 : a.value > b.value ? 1 : 0))
  return completions
}
