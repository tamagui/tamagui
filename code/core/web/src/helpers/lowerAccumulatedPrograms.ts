// Lane W2: accumulated programs become program-block CSS after the forward
// pass. Each longhand's program resolves its payloads (token names to var()
// references, opacity to color-mix), lowers to one contiguous rule block at
// specificity (0,1,0), and rides the existing insert/dedup path: the hashed
// class name is the identifier, so a repeat name skips insertion the same way
// atomic styles do. Cross-program stylesheet order is irrelevant by design
// (plans/dom-tailwind-flat-values.md, "The program block encoding").

import type { StyleObject } from '@tamagui/helpers'
import {
  lowerProgram,
  resolvePayload,
  serializePayloadWeb,
  type ParsedClause,
  type ParsedValue,
} from '@tamagui/style-grammar'

import type { GetStyleState } from '../types'
import { ensureGrammarContext } from './contributePrograms'

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
  return !serialized.includes('"') && !serialized.includes("'") && !serialized.includes('url(')
}

export function lowerAccumulatedPrograms(
  styleState: GetStyleState,
  addStyleObject: (styleObject: StyleObject) => void
): void {
  const programs = styleState.programs
  if (!programs || !programs.size) return

  const context = ensureGrammarContext(styleState)

  for (const program of programs.values()) {
    const longhand = program.property
    const lookup = context.getLookup(longhand, styleState.fontFamily)
    const resolveNumbers = context.resolvesNumbers(longhand)

    const resolveOne = (payload: string): string | null => {
      const resolved = resolvePayload(payload, { lookup, resolveNumbers })
      if (resolved.errors?.length) {
        warnOnce(
          `${longhand}\0${payload}`,
          `[tamagui] ${program.sourceProp}: "${payload}" — ${resolved.errors[0].code}; dropping this program`
        )
        return null
      }
      const serialized = serializePayloadWeb(resolved, context.toVar)
      if (hasBareTokenPrefix(serialized)) {
        warnOnce(
          `${longhand}\0${payload}\0$`,
          `[tamagui] ${program.sourceProp}: "${payload}" — flat clause values use config-first names without "$"; dropping this program`
        )
        return null
      }
      return serialized
    }

    let failed = false
    const base = program.value.base === null ? null : resolveOne(program.value.base)
    if (program.value.base !== null && base === null) failed = true

    const clauses: ParsedClause[] = []
    if (!failed) {
      for (const clause of program.value.clauses) {
        const payload = resolveOne(clause.payload)
        if (payload === null) {
          failed = true
          break
        }
        clauses.push({ modifiers: clause.modifiers, payload })
      }
    }
    if (failed) continue

    const resolvedValue: ParsedValue = { base, clauses }

    let lowered: ReturnType<typeof lowerProgram>
    try {
      lowered = lowerProgram(
        { property: longhand, value: resolvedValue, sourceProp: program.sourceProp },
        {
          registry: context.registry,
          configRevision: context.configRevision,
          mediaQueries: context.mediaQueries,
          containerQueries: context.containerQueries,
        }
      )
    } catch (error) {
      // a clause that cannot become CSS (exit:, unknown media key) drops the
      // whole program with one warning; native evaluation is unaffected
      warnOnce(
        `${longhand}\0${program.sourceProp}\0lower`,
        `[tamagui] ${program.sourceProp}: ${error instanceof Error ? error.message : String(error)}`
      )
      continue
    }

    styleState.classNames[longhand] = lowered.className
    addStyleObject([longhand, null, lowered.className, undefined, lowered.rules])
  }
}
