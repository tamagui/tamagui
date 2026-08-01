// Lane W2: accumulated programs become program-block CSS after the forward
// pass. Each longhand's program resolves its payloads (token names to var()
// references, opacity to color-mix), lowers to one contiguous rule block at
// specificity (0,1,0), and rides the existing insert/dedup path: the hashed
// class name is the identifier, so a repeat name skips insertion the same way
// atomic styles do. Cross-program stylesheet order is irrelevant by design
// (plans/dom-tailwind-flat-values.md, "The program block encoding").
//
// Hot path: the resolved+lowered result memoizes on the program's normalized
// identity (config revision included), so a stable program costs one string
// build and one Map hit per render — the resolve/serialize/lower pipeline runs
// once per distinct program per config. Cap-and-reset like the parse cache,
// no LRU bookkeeping.

import type { StyleObject } from '@tamagui/helpers'
import {
  lowerProgram,
  normalizeProgramKey,
  resolvePayload,
  serializePayloadWeb,
  type LonghandProgram,
  type ParsedClause,
  type ParsedValue,
} from '@tamagui/style-grammar'

import type { GetStyleState } from '../types'
import { ensureGrammarContext } from './contributePrograms'
import type { GrammarRuntimeContext } from './grammarConfig'

const warned = new Set<string>()

function warnOnce(key: string, message: string) {
  if (process.env.NODE_ENV === 'development' && !warned.has(key)) {
    if (warned.size > 1000) warned.clear()
    warned.add(key)
    console.warn(message)
  }
}

type LoweredResult =
  | (ReturnType<typeof lowerProgram> & {
      /** resolved base payload, riding the StyleObject value slot like the
       * legacy atomic emitter did (informational: devtools and tests) */
      baseValue: string | null
    })
  | null

const loweredCache = new Map<string, LoweredResult>()

function resolveProgramPayload(
  context: GrammarRuntimeContext,
  lookup: (name: string) => any,
  resolveNumbers: boolean,
  longhand: string,
  sourceProp: string,
  payload: string
): string | null {
  const resolved = resolvePayload(payload, { lookup, resolveNumbers })
  if (resolved.errors?.length) {
    const error = resolved.errors[0]
    warnOnce(
      `${longhand}\0${payload}`,
      `[tamagui] ${sourceProp}: "${payload}" — ${error.message}`
    )
    return null
  }
  return serializePayloadWeb(resolved, context.toVar)
}

function lowerOneProgram(
  context: GrammarRuntimeContext,
  program: LonghandProgram,
  fontFamily: string | undefined
): LoweredResult {
  const longhand = program.property
  const lookup = context.getLookup(longhand, fontFamily)
  const resolveNumbers = context.resolvesNumbers(longhand)

  let base: string | null = null
  if (program.value.base !== null) {
    base = resolveProgramPayload(
      context,
      lookup,
      resolveNumbers,
      longhand,
      program.sourceProp,
      program.value.base
    )
    if (base === null) {
      // clause-free compound values retain the legacy path's byte-for-byte
      // handling of unknown embedded tokens. a conditional program cannot ship
      // an unresolved sigil because native would receive it as an invalid value.
      if (program.value.clauses.length === 0) {
        base = program.value.base
      } else {
        return null
      }
    }
  }

  const clauses: ParsedClause[] = []
  for (const clause of program.value.clauses) {
    const payload = resolveProgramPayload(
      context,
      lookup,
      resolveNumbers,
      longhand,
      program.sourceProp,
      clause.payload
    )
    if (payload === null) return null
    clauses.push({ modifiers: clause.modifiers, payload })
  }

  const resolvedValue: ParsedValue = { base, clauses }

  try {
    const lowered = lowerProgram(
      { property: longhand, value: resolvedValue, sourceProp: program.sourceProp },
      {
        registry: context.registry,
        configRevision: context.configRevision,
        mediaQueries: context.mediaQueries,
        containerQueries: context.containerQueries,
      }
    ) as NonNullable<LoweredResult>
    lowered.baseValue = base
    return lowered
  } catch (error) {
    // a clause that cannot become CSS (exit:, unknown media key) drops the
    // whole program with one warning; native evaluation is unaffected
    warnOnce(
      `${longhand}\0${program.sourceProp}\0lower`,
      `[tamagui] ${program.sourceProp}: ${error instanceof Error ? error.message : String(error)}`
    )
    return null
  }
}

export function lowerAccumulatedPrograms(
  styleState: GetStyleState,
  addStyleObject: (styleObject: StyleObject) => void
): void {
  const programs = styleState.programs
  if (!programs || !programs.size) return

  const context = ensureGrammarContext(styleState)
  const fontFamily = styleState.fontFamily

  for (const program of programs.values()) {
    // identity covers property, merged program, config revision, and the
    // font-scope, which is the full input space of resolution and lowering
    const memoKey =
      normalizeProgramKey(program.property, program.value, context.configRevision) +
      (fontFamily ? `\0${fontFamily}` : '')

    let lowered: LoweredResult
    if (loweredCache.has(memoKey)) {
      lowered = loweredCache.get(memoKey)!
    } else {
      lowered = lowerOneProgram(context, program, fontFamily)
      if (loweredCache.size > 10000) loweredCache.clear()
      loweredCache.set(memoKey, lowered)
    }
    if (!lowered) continue

    styleState.classNames[program.property] = lowered.className
    const rules =
      program.property === 'transition' &&
      styleState.sawTransitionPreset &&
      styleState.animationDriver?.outputStyle === 'css'
        ? lowered.rules.map((rule) =>
            rule.replace(/(transition:[^;}]+)(})/, '$1 !important$2')
          )
        : lowered.rules
    addStyleObject([
      program.property,
      lowered.baseValue,
      lowered.className,
      undefined,
      rules,
    ])

    // an axis-variable program (x/y/scaleX/scaleY) only sets a custom property;
    // the rule turning those variables into `translate`/`scale` is identical for
    // every element using that axis group, so it carries its own class and hash
    // and the insert path dedupes it to one rule per sheet. Both classes have to
    // land on the element or the variable is set and nothing consumes it.
    if (lowered.composition) {
      const { property, className, rules } = lowered.composition
      styleState.classNames[property] = className
      addStyleObject([property, null, className, undefined, rules])
    }
  }
}

/** test-only: the lowered-program memo, for cache behavior assertions */
export function getLoweredProgramCacheSize(): number {
  return loweredCache.size
}

export function resetLoweredProgramCache(): void {
  loweredCache.clear()
}
