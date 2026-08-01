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

// `$` survives resolution only when the author mixed the legacy token
// spelling into a clause payload (`hover:$color10`); a `$` in real CSS lives
// inside strings or urls, which resolution never touches, so a bare one here
// means invalid CSS is about to ship
function hasBareTokenPrefix(serialized: string): boolean {
  const index = serialized.indexOf('$')
  if (index === -1) return false
  return (
    !serialized.includes('"') && !serialized.includes("'") && !serialized.includes('url(')
  )
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
    warnOnce(
      `${longhand}\0${payload}`,
      `[tamagui] ${sourceProp}: "${payload}" — ${resolved.errors[0].code}; dropping this program`
    )
    return null
  }
  const serialized = serializePayloadWeb(resolved, context.toVar)
  if (hasBareTokenPrefix(serialized)) {
    warnOnce(
      `${longhand}\0${payload}\0$`,
      `[tamagui] ${sourceProp}: "${payload}" — flat clause values use config-first names without "$"; dropping this program`
    )
    return null
  }
  return serialized
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
    // an unresolvable base ships raw (with the warning above), matching what
    // the legacy value path did — dropping it would silently erase the style
    if (base === null) {
      base = program.value.base
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
