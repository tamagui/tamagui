import { reduceFlatValueIdentity, type ClauseIdentityHandler } from './clauseIdentity'
import type { ParsedValue } from './valueTypes'

/** Prints one parsed value without changing payloads, modifier order, or clause order. */
export function formatParsedValue(value: ParsedValue): string {
  const parts: string[] = []
  if (value.base !== null) parts.push(value.base)
  for (const clause of value.clauses) {
    parts.push(`${clause.modifiers.join(':')}:${clause.payload}`)
  }
  return parts.join(' ')
}

type ClauseSlice = {
  value: string
  slot: string
}

type MergeReduction = {
  source: string
  baseStart: number
  baseEnd: number
  clauses: ClauseSlice[] | null
  malformed: boolean
}

const mergeIdentityHandler: ClauseIdentityHandler<MergeReduction> = {
  segment(ctx, start, end, isBase) {
    if (isBase) {
      ctx.baseStart = start
      ctx.baseEnd = end
    }
  },

  clause(ctx, start, chainEnd, payloadStart, end, slot) {
    ;(ctx.clauses ||= []).push({
      value: `${ctx.source.slice(start, chainEnd)}:${ctx.source.slice(payloadStart, end)}`,
      slot,
    })
  },

  error(ctx) {
    ctx.malformed = true
  },
}

function reduceForMerge(source: string): MergeReduction {
  const reduction: MergeReduction = {
    source,
    baseStart: 0,
    baseEnd: 0,
    clauses: null,
    malformed: false,
  }
  reduceFlatValueIdentity(source, mergeIdentityHandler, reduction)
  return reduction
}

/**
 * Combine two flat values for the same property, later winning.
 *
 * The merge unit is the clause, so a later `borderColor="green"` overrides the
 * earlier base without erasing an earlier `press:transparent`. Style values
 * that carry no clause take the cheap path and the later one simply wins,
 * which is every ordinary prop.
 */
export function mergeFlatValues(earlier: unknown, later: unknown): unknown {
  if (typeof earlier !== 'string' || typeof later !== 'string') return later
  // a clause needs a colon; skipping identity reduction here keeps ordinary
  // props off the grammar path entirely
  if (!earlier.includes(':') && !later.includes(':')) return later

  const earlierReduction = reduceForMerge(earlier)
  if (earlierReduction.malformed) return later
  const laterReduction = reduceForMerge(later)
  if (laterReduction.malformed) return later

  const earlierClauses = earlierReduction.clauses
  const laterClauses = laterReduction.clauses
  if (!earlierClauses && !laterClauses) return later

  const parts: string[] = []
  const base =
    laterReduction.baseStart < laterReduction.baseEnd ? laterReduction : earlierReduction
  if (base.baseStart < base.baseEnd) {
    parts.push(base.source.slice(base.baseStart, base.baseEnd))
  }

  if (earlierClauses) {
    if (laterClauses) {
      const restated = new Set<string>()
      for (const clause of laterClauses) restated.add(clause.slot)
      for (const clause of earlierClauses) {
        if (!restated.has(clause.slot)) {
          parts.push(clause.value)
        }
      }
    } else {
      for (const clause of earlierClauses) {
        parts.push(clause.value)
      }
    }
  }
  if (laterClauses) {
    for (const clause of laterClauses) {
      parts.push(clause.value)
    }
  }
  return parts.join(' ')
}
