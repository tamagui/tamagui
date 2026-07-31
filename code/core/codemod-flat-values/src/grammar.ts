// Every piece of style knowledge the codemod needs comes from
// `@tamagui/style-grammar`: the value parser, the legacy condition converter, the
// clause merge, and the property/unit tables. Nothing here re-derives grammar
// behavior, so a converted program is spelled exactly the way the runtime and the
// compiler will read it back.

import { stylePropsAll } from '@tamagui/helpers'
import { shorthands } from '@tamagui/shorthands/v6'
// the source, not the package entry: the package entry resolves to `dist`, and a
// codemod that reads a stale build of the grammar would emit values the current
// grammar does not agree with
import * as styleGrammarRuntime from '../../style-grammar/src/index'
import type {
  ConvertLegacyConditionOptions,
  LegacyConditionError,
  LegacyConditionResult,
} from '../../style-grammar/src/legacyConditions'
import type {
  ConversionReason,
  ConversionTargets,
  HostView,
} from '../../style-grammar/src/clauseCapability'
import type {
  ModifierRegistryView,
  ParsedClause,
  ParsedValue,
} from '../../style-grammar/src/valueTypes'
import { replaceV6BuiltInTokens } from './builtInNames'

const grammar = styleGrammarRuntime

export const {
  assessFlatConversion,
  createModifierRegistry,
  defaultMediaKeys,
  evaluateProgram,
  expandToLonghands,
  grammarEntries,
  grammarPlatformNames,
  legacyPartComposite,
  mergeProgramValues,
  parseValue,
  programEligibility,
  pseudoToModifier,
  standaloneValueProps,
  parseTransformString,
} = grammar

export type {
  ConversionReason,
  ConversionTargets,
  HostView,
  LegacyConditionError,
  ModifierRegistryView,
  ParsedClause,
  ParsedValue,
}

export { shorthands }

function renameBuiltInTokens(value: unknown): unknown {
  if (typeof value === 'string') return replaceV6BuiltInTokens(value)
  if (Array.isArray(value)) return value.map(renameBuiltInTokens)
  if (value === null || typeof value !== 'object') return value

  const renamed: Record<string, unknown> = {}
  for (const key in value) {
    renamed[key] = renameBuiltInTokens((value as Record<string, unknown>)[key])
  }
  return renamed
}

export function convertLegacyConditionProp(
  propName: string,
  value: unknown,
  options: ConvertLegacyConditionOptions
): LegacyConditionResult | null {
  return grammar.convertLegacyConditionProp(propName, renameBuiltInTokens(value), options)
}

/** every prop spelling the codemod treats as carrying a style value */
export const styleProps: ReadonlySet<string> = new Set<string>([
  ...grammarEntries.map((entry) => entry.prop),
  ...Object.keys(standaloneValueProps),
  ...Object.keys(stylePropsAll),
  ...Object.keys(shorthands),
  ...Object.values(shorthands),
])

/** the media keys of the V6 default config, plus the two motion queries */
export const codemodMediaNames: readonly string[] = [
  ...defaultMediaKeys,
  'motionReduce',
  'motionSafe',
]

export function resolveProp(prop: string): string {
  return shorthands[prop] ?? prop
}

/**
 * The one registered condition the codemod uses to reach the shared value
 * converter for a single (prop, value) pair. Base values and clause payloads then
 * spell identically by construction.
 */
const payloadProbeCondition = '$platform-web'

export interface SharedPayload {
  payload: string | null
  errors: readonly LegacyConditionError[]
}

export function sharedPayload(
  prop: string,
  value: unknown,
  registry: ModifierRegistryView
): SharedPayload {
  const converted = convertLegacyConditionProp(
    payloadProbeCondition,
    { [prop]: value },
    { registry }
  )
  if (converted === null) {
    throw new Error(
      `the payload probe condition "${payloadProbeCondition}" is unregistered`
    )
  }
  return {
    payload: converted.contributions[0]?.clause.payload ?? null,
    errors: converted.errors,
  }
}

/**
 * A property with no family split, no unit table entry, and no transform part, so
 * the shared converter's answer for a string value is exactly its token rule and
 * nothing else.
 */
const stringProbeProp = 'color'

export interface FlatString {
  /** the flat spelling, or null when the shared converter refused the value */
  text: string | null
  error: LegacyConditionError | null
}

/**
 * The flat spelling of a legacy string, taken from the shared converter rather
 * than re-derived. That converter drops `$` from token spellings anywhere in a
 * composite value and refuses a value that mixes `$` with quoted or unquoted
 * `url()` content, where a `$` is literal CSS the resolver never reads as a
 * token candidate.
 */
export function flatStringValue(
  value: string,
  registry: ModifierRegistryView
): FlatString {
  const probe = sharedPayload(stringProbeProp, value, registry)
  return { text: probe.payload, error: probe.errors[0] ?? null }
}

const unitSuffixes = new Map<string, string>()

/**
 * The unit a raw number carries for this property, taken from the shared
 * converter itself: `px` for lengths, `deg` for `rotate`, nothing for the
 * unitless table. A dynamic numeric expression interpolates with the same
 * suffix a literal would have received.
 */
export function unitSuffix(prop: string, registry: ModifierRegistryView): string {
  const cached = unitSuffixes.get(prop)
  if (cached !== undefined) return cached
  const probe = sharedPayload(prop, 1, registry)
  const suffix =
    probe.payload !== null && probe.payload.startsWith('1') ? probe.payload.slice(1) : ''
  unitSuffixes.set(prop, suffix)
  return suffix
}

export const printProgram = grammar.formatParsedValue
