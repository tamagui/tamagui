import type { GrammarConfigView } from './candidate'
import {
  resolveCandidateTarget,
  type CandidateContribution,
  type CandidatePropertyMismatch,
} from './candidateTarget'
import { resolvePayload } from './resolvePayload'
import { grammarEntries, type TokenCategory } from './registry'
import { parseValue } from './valueParser'
import type { ModifierRegistryView, ValueParseErrorCode } from './valueTypes'
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
