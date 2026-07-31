// The universal flat value parser.
//
//   value  := base? clause*
//   clause := modifier (":" modifier)* ":" payload
//
// See plans/dom-tailwind-flat-values.md — "The universal value grammar". The
// parser only splits: `base` and every `payload` come back as trimmed raw CSS
// component-value sequences with no interpretation and no token resolution.
//
// Clause detection is purely syntactic. A colon counts only at the top level:
// outside strings and outside every paren nesting, which covers url() and every
// other function. A top-level colon is never valid inside a CSS value, so an
// unregistered modifier is a hard error rather than silent value content.
//
// A top-level `{`, `}`, or `;` is rejected for the same reason: those tokens are
// never valid in a CSS component value, and refusing them here is what makes
// rule and selector injection through a payload structurally impossible in the
// web lowering, which emits payloads verbatim by contract. Inside strings and
// inside parens they stay ordinary content.
//
// This runs at runtime on native, so it is one left-to-right pass with no
// regexes and no substrings beyond the slices it returns.

import type {
  ModifierRegistryView,
  ParsedClause,
  ValueParseError,
  ValueParseErrorCode,
  ValueParseResult,
} from './valueTypes'

const CHAR_TAB = 9
const CHAR_LF = 10
const CHAR_FF = 12
const CHAR_CR = 13
const CHAR_SPACE = 32
const CHAR_DOUBLE_QUOTE = 34
const CHAR_SINGLE_QUOTE = 39
const CHAR_PAREN_OPEN = 40
const CHAR_PAREN_CLOSE = 41
const CHAR_SEMICOLON = 59
const CHAR_COLON = 58
const CHAR_BACKSLASH = 92
const CHAR_BRACE_OPEN = 123
const CHAR_BRACE_CLOSE = 125

const noClauses: readonly ParsedClause[] = Object.freeze([])

function isWhitespace(code: number): boolean {
  return (
    code === CHAR_SPACE ||
    code === CHAR_TAB ||
    code === CHAR_LF ||
    code === CHAR_CR ||
    code === CHAR_FF
  )
}

export function parseValue(
  input: string,
  registry: ModifierRegistryView
): ValueParseResult {
  const length = input.length

  let errors: ValueParseError[] | null = null
  let base: string | null = null
  let clauses: ParsedClause[] | null = null
  // modifiers of the clause whose payload is currently being collected
  let pending: string[] | null = null
  // where the base, or the current payload, starts
  let segmentStart = 0

  // scanner state: in a string, inside parens, or at the top level
  let quote = 0
  let quoteStart = -1
  let depth = 0
  let parenStart = -1
  // the top-level word being scanned, and the last top-level colon inside it
  let wordStart = -1
  let lastColon = -1

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

  // closes the base (before any clause) or the payload of the pending clause
  const closeSegment = (end: number): void => {
    let start = segmentStart
    let stop = end
    while (start < stop && isWhitespace(input.charCodeAt(start))) start++
    while (stop > start && isWhitespace(input.charCodeAt(stop - 1))) stop--
    if (pending === null) {
      base = start < stop ? input.slice(start, stop) : null
      return
    }
    if (start >= stop) {
      addError(
        'empty-payload',
        segmentStart,
        `the "${pending.join(':')}:" clause has no value`
      )
      return
    }
    ;(clauses ||= []).push({ modifiers: pending, payload: input.slice(start, stop) })
  }

  // a clause word ended: everything before its last top-level colon is the
  // modifier chain, everything after it begins the payload
  const startClause = (chainStart: number, chainEnd: number): void => {
    closeSegment(chainStart)
    const modifiers: string[] = []
    let nameStart = chainStart
    for (let index = chainStart; index <= chainEnd; index++) {
      if (index !== chainEnd && input.charCodeAt(index) !== CHAR_COLON) continue
      if (index === nameStart) {
        addError('empty-modifier', index, 'a modifier chain has an empty segment')
      } else {
        const name = input.slice(nameStart, index)
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
  }

  for (let index = 0; index < length; index++) {
    const code = input.charCodeAt(index)

    if (quote !== 0) {
      // inside a string only an unescaped matching quote ends it
      if (code === CHAR_BACKSLASH) index++
      else if (code === quote) quote = 0
      continue
    }

    if (depth > 0) {
      // inside parens whitespace and colons are ordinary content
      if (code === CHAR_BACKSLASH) index++
      else if (code === CHAR_DOUBLE_QUOTE || code === CHAR_SINGLE_QUOTE) {
        quote = code
        quoteStart = index
      } else if (code === CHAR_PAREN_OPEN) depth++
      else if (code === CHAR_PAREN_CLOSE) depth--
      continue
    }

    if (isWhitespace(code)) {
      if (wordStart !== -1) {
        if (lastColon !== -1) startClause(wordStart, lastColon)
        wordStart = -1
        lastColon = -1
      }
      continue
    }

    // any other top-level character starts or continues a word
    if (wordStart === -1) wordStart = index

    if (
      code === CHAR_BRACE_OPEN ||
      code === CHAR_BRACE_CLOSE ||
      code === CHAR_SEMICOLON
    ) {
      addError(
        'invalid-character',
        index,
        `"${input[index]}" cannot appear in a value: it would end the declaration or rule`
      )
    } else if (code === CHAR_BACKSLASH) index++
    else if (code === CHAR_DOUBLE_QUOTE || code === CHAR_SINGLE_QUOTE) {
      quote = code
      quoteStart = index
    } else if (code === CHAR_PAREN_OPEN) {
      depth = 1
      parenStart = index
    } else if (code === CHAR_COLON) lastColon = index
  }

  if (quote !== 0) {
    addError(
      'unterminated-string',
      quoteStart,
      `unterminated ${String.fromCharCode(quote)} string`
    )
  }
  if (depth > 0) {
    addError('unterminated-function', parenStart, 'unterminated "(" in value')
  }
  if (wordStart !== -1 && lastColon !== -1) startClause(wordStart, lastColon)
  closeSegment(length)

  if (errors !== null) return { ok: false, errors }
  return { ok: true, value: { base, clauses: clauses ?? noClauses } }
}
