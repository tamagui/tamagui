// The one flat-value lexer.
//
//   value  := base? clause*
//   clause := modifier (":" modifier)* ":" payload
//
// Every implementation of this grammar splits a value the same way, so the
// split lives here once and every consumer drives it with a visitor:
// `parseValue` builds the canonical result on top of it, and the web runtime's
// style, variant and lifecycle scanners drive it directly so that what they
// consume cannot drift from what the canonical parser says the value means.
//
// The visitor gets index ranges, never slices. A style prop is scanned on every
// render it is not classed away, so the scan itself allocates nothing and the
// consumer slices only what it keeps.
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
// regexes and no substrings.

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

export type FlatScanErrorCode =
  | 'invalid-character'
  | 'unterminated-string'
  | 'unterminated-function'

/** why a scan stopped short, or null when it ran to the end cleanly */
export type FlatScanFailure = FlatScanErrorCode | 'refused-chain'

export interface FlatValueVisitor {
  /**
   * The base, or one clause's payload, just ended. `start` and `end` are
   * already trimmed, and `start === end` means the segment is empty: an empty
   * base is simply no base, an empty payload is a clause with nothing in it.
   */
  segment(start: number, end: number, isBase: boolean): void
  /**
   * A modifier chain just ended, without its trailing colon, so
   * `source.slice(start, end)` is `dark:hover` for `dark:hover:red`. Returning
   * false stops the scan: the consumer has refused the value and does not want
   * later chains resolved.
   */
  chain(start: number, end: number): boolean
  /**
   * A character the grammar refuses, or a delimiter left open at the end. The
   * scan continues, so a consumer that only wants the first one records it and
   * refuses the next chain.
   */
  error?(code: FlatScanErrorCode, index: number): void
  /** every top-level word, whether or not it turned out to carry a chain */
  word?(start: number, end: number, isChain: boolean): void
}

function isWhitespace(code: number): boolean {
  return (
    code === CHAR_SPACE ||
    code === CHAR_TAB ||
    code === CHAR_LF ||
    code === CHAR_CR ||
    code === CHAR_FF
  )
}

/**
 * Closes the base (before any clause) or the payload of the pending clause.
 *
 * A module function rather than a closure over the scan: a style prop is
 * scanned on every render it is not classed away, and one closure per scan is
 * one allocation per prop per render for nothing.
 */
function closeSegment(
  source: string,
  visitor: FlatValueVisitor,
  segmentStart: number,
  end: number,
  isBase: boolean
): void {
  let start = segmentStart
  let stop = end
  while (start < stop && isWhitespace(source.charCodeAt(start))) start++
  while (stop > start && isWhitespace(source.charCodeAt(stop - 1))) stop--
  visitor.segment(start, stop, isBase)
}

export function scanFlatValue(
  source: string,
  visitor: FlatValueVisitor
): FlatScanFailure | null {
  const length = source.length

  let failure: FlatScanFailure | null = null
  let sawChain = false
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

  for (let index = 0; index < length; index++) {
    const code = source.charCodeAt(index)

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
        if (visitor.word !== undefined) visitor.word(wordStart, index, lastColon !== -1)
        if (lastColon !== -1) {
          closeSegment(source, visitor, segmentStart, wordStart, !sawChain)
          if (!visitor.chain(wordStart, lastColon)) return 'refused-chain'
          sawChain = true
          segmentStart = lastColon + 1
        }
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
      if (failure === null) failure = 'invalid-character'
      if (visitor.error !== undefined) visitor.error('invalid-character', index)
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
    if (failure === null) failure = 'unterminated-string'
    if (visitor.error !== undefined) visitor.error('unterminated-string', quoteStart)
  }
  if (depth > 0) {
    if (failure === null) failure = 'unterminated-function'
    if (visitor.error !== undefined) visitor.error('unterminated-function', parenStart)
  }

  if (wordStart !== -1) {
    if (visitor.word !== undefined) visitor.word(wordStart, length, lastColon !== -1)
    if (lastColon !== -1) {
      closeSegment(source, visitor, segmentStart, wordStart, !sawChain)
      if (!visitor.chain(wordStart, lastColon)) return 'refused-chain'
      sawChain = true
      segmentStart = lastColon + 1
    }
  }
  closeSegment(source, visitor, segmentStart, length, !sawChain)

  return failure
}
