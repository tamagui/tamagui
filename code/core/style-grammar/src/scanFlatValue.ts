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
// outside strings, outside comments, outside `url()` and outside every paren
// nesting, which covers every other function. A top-level colon is never valid
// inside a CSS value, so an unregistered modifier is a hard error rather than
// silent value content.
//
// A top-level `{`, `}`, or `;` is rejected for the same reason: those tokens are
// never valid in a CSS component value. Inside strings, comments, `url()` and
// parens they stay ordinary content.
//
// The states below mirror CSS's tokenizer rather than approximating it, because
// the whole class of bugs here has been the scan believing it was inside a
// construct the tokenizer had already left:
//
//   - a comment outranks paren depth, because comments are lexical. `/*` opens
//     one at ANY depth, since `calc(1px /* pad */ + 2px)` is real CSS. It runs
//     to `*/` however many lines that takes and holds no escapes: `\*/` still
//     closes it. A comment is opaque content belonging to whatever segment it
//     sits in, so a colon inside one is not a clause boundary and a `;` inside
//     one is not a refused character.
//   - a string outranks a comment opener: `"/*"` is a two-character string.
//   - a comment outranks a quote: a `"` inside one is just text.
//   - `url(` outranks BOTH. It is the one function CSS does not tokenize: no
//     comments, no strings, only an escape and the `)` that ends it.
//     `url("...")` is an ordinary function whose string IS real, so the quote
//     lookahead in `opensUrlToken` has to tell the two apart.
//   - a backslash escapes its next character everywhere except inside a comment.
//
// Containment is only real if the delimiter actually closes, so an unbalanced
// value is an error rather than trusted for a containment the emitted CSS will
// not honour:
//
//   - a string. CSS ends an unterminated one at a NEWLINE, as a parse error, so
//     `"abc\n;}.x{y"` would read quoted end to end to a naive scan while the
//     browser reads a bad string, a top-level `;}` and a new rule. The scan
//     reports the error at the opening quote and RESUMES at the newline, so the
//     `;}` is seen where the browser sees it. A backslash before the newline is
//     a line continuation and does stay inside the string, which is why the
//     escape branch is checked first.
//   - a comment. `red/*` opens one that swallows whatever follows it, and
//     `insertStyleRule`'s `getAllRules` joins rules into one blob that SSR emits
//     as a single style tag, so an unclosed comment blanks other components'
//     rules until some later `*/` turns them back on.
//   - a `*/` with nothing open, at any depth, closes a comment somewhere else in
//     that same blob.
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
const CHAR_STAR = 42
const CHAR_SLASH = 47
const CHAR_SEMICOLON = 59
const CHAR_COLON = 58
const CHAR_BACKSLASH = 92
const CHAR_BRACE_OPEN = 123
const CHAR_BRACE_CLOSE = 125

export type FlatScanErrorCode =
  | 'invalid-character'
  | 'unterminated-string'
  | 'unterminated-function'
  | 'unterminated-comment'
  | 'stray-comment-close'

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
 * `index` points at the `(`. A url token is the ident `url` followed directly by
 * it, with no ident character before the `u` (`myurl(` is an ordinary function)
 * and no quote after it (`url("a")` is one too).
 */
function opensUrlToken(source: string, index: number): boolean {
  if (index < 3) return false
  if (
    (source.charCodeAt(index - 3) | 32) !== 117 ||
    (source.charCodeAt(index - 2) | 32) !== 114 ||
    (source.charCodeAt(index - 1) | 32) !== 108
  ) {
    return false
  }
  const before = index > 3 ? source.charCodeAt(index - 4) : 0
  if (
    before === 45 ||
    before === 95 ||
    before >= 128 ||
    (before >= 48 && before <= 57) ||
    (before >= 65 && before <= 90) ||
    (before >= 97 && before <= 122)
  ) {
    return false
  }
  let next = index + 1
  while (next < source.length && source.charCodeAt(next) <= 32) next++
  const quote = source.charCodeAt(next)
  return quote !== CHAR_DOUBLE_QUOTE && quote !== CHAR_SINGLE_QUOTE
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

  // scanner state: in a comment, in a string, in a url token, inside parens, or
  // at the top level
  let comment = false
  let commentStart = -1
  let quote = 0
  let quoteStart = -1
  let url = false
  let depth = 0
  let parenStart = -1
  // the top-level word being scanned, and the last top-level colon inside it
  let wordStart = -1
  let lastColon = -1

  for (let index = 0; index < length; index++) {
    const code = source.charCodeAt(index)

    if (comment) {
      // no escapes inside a comment: `\*/` still closes it
      if (code === CHAR_STAR && source.charCodeAt(index + 1) === CHAR_SLASH) {
        comment = false
        index++
      }
      continue
    }

    if (quote !== 0) {
      // inside a string an unescaped matching quote ends it, and a newline ends
      // it as a parse error the browser sees the same way
      if (code === CHAR_BACKSLASH) index++
      else if (code === quote) quote = 0
      else if (code === CHAR_LF || code === CHAR_CR || code === CHAR_FF) {
        if (failure === null) failure = 'unterminated-string'
        if (visitor.error !== undefined) visitor.error('unterminated-string', quoteStart)
        quote = 0
        // re-read the newline at top level, where it is ordinary whitespace
        index--
      }
      continue
    }

    if (url) {
      // the one function CSS does not tokenize: only an escape and the `)`
      if (code === CHAR_BACKSLASH) index++
      else if (code === CHAR_PAREN_CLOSE) {
        url = false
        depth--
      }
      continue
    }

    // comments are lexical, so they open at any depth and outrank paren nesting
    if (code === CHAR_SLASH && source.charCodeAt(index + 1) === CHAR_STAR) {
      comment = true
      commentStart = index
      index++
      continue
    }
    if (code === CHAR_STAR && source.charCodeAt(index + 1) === CHAR_SLASH) {
      if (failure === null) failure = 'stray-comment-close'
      if (visitor.error !== undefined) visitor.error('stray-comment-close', index)
      index++
      continue
    }

    if (depth > 0) {
      // inside parens whitespace and colons are ordinary content
      if (code === CHAR_BACKSLASH) index++
      else if (code === CHAR_DOUBLE_QUOTE || code === CHAR_SINGLE_QUOTE) {
        quote = code
        quoteStart = index
      } else if (code === CHAR_PAREN_OPEN) {
        if (opensUrlToken(source, index)) url = true
        depth++
      } else if (code === CHAR_PAREN_CLOSE) depth--
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
      if (opensUrlToken(source, index)) url = true
      depth = 1
      parenStart = index
    } else if (code === CHAR_COLON) lastColon = index
  }

  if (comment) {
    if (failure === null) failure = 'unterminated-comment'
    if (visitor.error !== undefined) visitor.error('unterminated-comment', commentStart)
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
