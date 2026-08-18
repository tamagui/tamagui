// The universal flat value parser.
//
//   value  := base? clause*
//   clause := modifier (":" modifier)* ":" payload
//
// See plans/dom-tailwind-flat-values.md — "The universal value grammar". The
// parser only splits: `base` and every `payload` come back as trimmed raw CSS
// component-value sequences with no interpretation and no token resolution.
//
// The split itself is `scanFlatValue`, the one lexer every implementation of
// this grammar drives; this file is what that split MEANS, which is the part
// the registry decides. Read `scanFlatValue.ts` for why a top-level colon,
// brace or semicolon is structural and everything inside a string or a paren is
// not.

import {
  scanFlatValue,
  type FlatScanErrorCode,
  type FlatValueVisitor,
} from './scanFlatValue'
import type {
  ModifierRegistryView,
  ParsedClause,
  ValueParseError,
  ValueParseErrorCode,
  ValueParseResult,
} from './valueTypes'

const CHAR_COLON = 58

const noClauses: readonly ParsedClause[] = Object.freeze([])

export interface ValueSourceSpan {
  kind: 'base' | 'payload' | 'modifier' | 'word'
  start: number
  end: number
}

export interface ValueParseWithSourceSpans {
  result: ValueParseResult
  spans: readonly ValueSourceSpan[]
}

export function parseValue(
  input: string,
  registry: ModifierRegistryView
): ValueParseResult {
  return parseValueInternal(input, registry)
}

/**
 * Parses through the runtime scanner while also retaining source boundaries for
 * editor tooling. The ordinary runtime path does not allocate these spans.
 */
export function parseValueWithSourceSpans(
  input: string,
  registry: ModifierRegistryView
): ValueParseWithSourceSpans {
  const spans: ValueSourceSpan[] = []
  return {
    result: parseValueInternal(input, registry, spans),
    spans,
  }
}

function scanErrorMessage(code: FlatScanErrorCode, input: string, index: number): string {
  if (code === 'invalid-character') {
    return `"${input[index]}" cannot appear in a value: it would end the declaration or rule`
  }
  if (code === 'unterminated-string') {
    return `unterminated ${input[index]} string`
  }
  return 'unterminated "(" in value'
}

function parseValueInternal(
  input: string,
  registry: ModifierRegistryView,
  sourceSpans?: ValueSourceSpan[]
): ValueParseResult {
  let errors: ValueParseError[] | null = null
  let base: string | null = null
  let clauses: ParsedClause[] | null = null
  // modifiers of the clause whose payload is currently being collected
  let pending: string[] | null = null
  // where the base, or the current payload, starts before trimming, which is
  // what an empty payload has to point its diagnostic at
  let segmentStart = 0

  const addError = (
    code: ValueParseErrorCode,
    index: number,
    message: string,
    modifier?: string
  ): void => {
    ;(errors ||= []).push(
      modifier === undefined
        ? { code, index, message }
        : { code, index, message, modifier }
    )
  }

  const visitor: FlatValueVisitor = {
    segment(start, end, isBase) {
      sourceSpans?.push({ kind: isBase ? 'base' : 'payload', start, end })
      if (isBase) {
        base = start < end ? input.slice(start, end) : null
        return
      }
      if (start >= end) {
        addError(
          'empty-payload',
          segmentStart,
          `the "${pending!.join(':')}:" clause has no value`
        )
        return
      }
      ;(clauses ||= []).push({ modifiers: pending!, payload: input.slice(start, end) })
    },

    // a clause word ended: everything before its last top-level colon is the
    // modifier chain, everything after it begins the payload
    chain(chainStart, chainEnd) {
      const modifiers: string[] = []
      let nameStart = chainStart
      for (let index = chainStart; index <= chainEnd; index++) {
        if (index !== chainEnd && input.charCodeAt(index) !== CHAR_COLON) continue
        if (index === nameStart) {
          addError('empty-modifier', index, 'a modifier chain has an empty segment')
        } else {
          const name = input.slice(nameStart, index)
          sourceSpans?.push({ kind: 'modifier', start: nameStart, end: index })
          if (registry.get(name) === undefined) {
            addError(
              'unregistered-modifier',
              nameStart,
              `"${name}" is not a registered modifier`,
              name
            )
          }
          modifiers.push(name)
        }
        nameStart = index + 1
      }
      pending = modifiers
      segmentStart = chainEnd + 1
      return true
    },

    error(code, index) {
      addError(code, index, scanErrorMessage(code, input, index))
    },
  }

  if (sourceSpans) {
    // only the trailing bare word is a completion position the spans have no
    // other name for: every earlier word is inside a base or a payload span
    visitor.word = (start, end, isChain) => {
      if (!isChain && end === input.length) {
        sourceSpans.push({ kind: 'word', start, end })
      }
    }
  }

  scanFlatValue(input, visitor)

  if (errors !== null) return { ok: false, errors }
  return { ok: true, value: { base, clauses: clauses ?? noClauses } }
}
