// The one flat-value lexer.
//
//   value  := base? clause*
//   clause := modifier (":" modifier)* ":" payload
//
// Every implementation of this grammar splits a value the same way, so the
// split lives here once and every consumer drives it with a handler:
// `parseValue` builds the canonical result on top of it, and the web runtime's
// style, variant and lifecycle scanners drive it directly so that what they
// consume cannot drift from what the canonical parser says the value means.
//
// The handler gets index ranges, never slices. A style prop is scanned on every
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

export interface FlatValueHandler<Context> {
  /** one modifier segment, reported by the scanner's existing character loop */
  modifier?(
    ctx: Context,
    start: number,
    end: number,
    valid: boolean,
    first: boolean,
    source: string,
    a: any,
    b: any,
    c: any,
    d: any
  ): boolean | void
  /**
   * The base, or one clause's payload, just ended. `start` and `end` are
   * already trimmed, and `start === end` means the segment is empty: an empty
   * base is simply no base, an empty payload is a clause with nothing in it.
   * `valid` is false when this segment contains a lexical error.
   */
  segment(
    ctx: Context,
    start: number,
    end: number,
    isBase: boolean,
    valid: boolean,
    source: string,
    chainStart: number,
    chainEnd: number,
    chainValid: boolean,
    chainCount: number,
    result: number,
    failure: FlatScanFailure | null,
    failureIndex: number,
    a: any,
    b: any,
    c: any,
    d: any
  ): number | void
  /**
   * A modifier chain just ended, without its trailing colon, so
   * `source.slice(start, end)` is `dark:hover` for `dark:hover:red`. `valid` is
   * false when the chain word itself contains a lexical error. Returning false
   * stops the scan.
   */
  chain(ctx: Context, start: number, end: number, valid: boolean): boolean
  /**
   * A character the grammar refuses, or a delimiter left open at the end. The
   * scan continues, so a consumer that only wants the first one records it and
   * uses the segment validity bit to refuse the affected segment.
   */
  error?(ctx: Context, code: FlatScanErrorCode, index: number): void
  /** every top-level word, whether or not it turned out to carry a chain */
  word?(ctx: Context, start: number, end: number, isChain: boolean): void
  /** the scan ended; `result` is the bitwise union returned by `segment` */
  end?(
    ctx: Context,
    source: string,
    result: number,
    lastAcceptedStart: number,
    chainCount: number,
    a: any,
    b: any,
    c: any,
    d: any,
    failure: FlatScanFailure | null,
    failureIndex: number
  ): void
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
function closeSegment<Context>(
  source: string,
  handler: FlatValueHandler<Context>,
  ctx: Context,
  segmentStart: number,
  end: number,
  isBase: boolean,
  valid: boolean,
  chainStart: number,
  chainEnd: number,
  chainValid: boolean,
  chainCount: number,
  result: number,
  failure: FlatScanFailure | null,
  failureIndex: number,
  a: any,
  b: any,
  c: any,
  d: any
): number {
  let start = segmentStart
  let stop = end
  while (start < stop && isWhitespace(source.charCodeAt(start))) start++
  while (stop > start && isWhitespace(source.charCodeAt(stop - 1))) stop--
  const bits =
    handler.segment(
      ctx,
      start,
      stop,
      isBase,
      valid,
      source,
      chainStart,
      chainEnd,
      chainValid,
      chainCount,
      result,
      failure,
      failureIndex,
      a,
      b,
      c,
      d
    ) || 0
  return start * 32 + bits
}

export function scanFlatValue<Context>(
  source: string,
  handler: FlatValueHandler<Context>,
  ctx: Context,
  a?: any,
  b?: any,
  c?: any,
  d?: any
): FlatScanFailure | null {
  const length = source.length

  let failure: FlatScanFailure | null = null
  let failureIndex = -1
  let sawChain = false
  let chainCount = 0
  let chainStart = -1
  let chainEnd = -1
  let chainValid = true
  let result = 0
  let lastAcceptedStart = 0
  let segmentValid = true
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
  let modifierStart = -1
  // A chain is recognized only when its whole top-level word closes. Keep the
  // error bounds for that word separate from the preceding segment so an error
  // in `hover:bad;` cannot invalidate the base flushed immediately before it.
  let wordErrorMin = length
  let wordErrorMax = -1

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
        if (failureIndex === -1) failureIndex = quoteStart
        if (failure === null) failure = 'unterminated-string'
        handler.error?.(ctx, 'unterminated-string', quoteStart)
        if (quoteStart < wordErrorMin) wordErrorMin = quoteStart
        if (quoteStart > wordErrorMax) wordErrorMax = quoteStart
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
      if (failureIndex === -1) failureIndex = index
      if (failure === null) failure = 'stray-comment-close'
      handler.error?.(ctx, 'stray-comment-close', index)
      if (index < wordErrorMin) wordErrorMin = index
      if (index > wordErrorMax) wordErrorMax = index
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
        handler.word?.(ctx, wordStart, index, lastColon !== -1)
        if (lastColon !== -1) {
          // the preceding segment already closed at this word's first colon
          const nextChainValid = wordErrorMin >= lastColon
          const payloadValid = wordErrorMax < lastColon
          if (!handler.chain(ctx, wordStart, lastColon, nextChainValid)) {
            return 'refused-chain'
          }
          chainStart = wordStart
          chainEnd = lastColon
          chainValid = nextChainValid
          chainCount++
          sawChain = true
          segmentStart = lastColon + 1
          segmentValid = nextChainValid && payloadValid
        } else if (wordErrorMax !== -1) {
          segmentValid = false
        }
        wordStart = -1
        lastColon = -1
        modifierStart = -1
        wordErrorMin = length
        wordErrorMax = -1
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
      if (failureIndex === -1) failureIndex = index
      if (failure === null) failure = 'invalid-character'
      handler.error?.(ctx, 'invalid-character', index)
      if (index < wordErrorMin) wordErrorMin = index
      if (index > wordErrorMax) wordErrorMax = index
    } else if (code === CHAR_BACKSLASH) index++
    else if (code === CHAR_DOUBLE_QUOTE || code === CHAR_SINGLE_QUOTE) {
      quote = code
      quoteStart = index
    } else if (code === CHAR_PAREN_OPEN) {
      if (opensUrlToken(source, index)) url = true
      depth = 1
      parenStart = index
    } else if (code === CHAR_COLON) {
      const first = modifierStart === -1
      const start = first ? wordStart : modifierStart
      if (first) {
        // this word is a chain, so the base (or the previous clause's payload)
        // ends where the word began. Close it now, before any modifier event,
        // so a consumer can hold one condition cursor: every payload segment
        // arrives before the next clause starts accumulating.
        const closed = closeSegment(
          source,
          handler,
          ctx,
          segmentStart,
          wordStart,
          !sawChain,
          segmentValid,
          chainStart,
          chainEnd,
          chainValid,
          chainCount,
          result,
          failure,
          failureIndex,
          a,
          b,
          c,
          d
        )
        const bits = closed % 32
        result |= bits
        if (bits & 4) lastAcceptedStart = Math.floor(closed / 32)
      }
      if (
        handler.modifier?.(
          ctx,
          start,
          index,
          wordErrorMax < start,
          first,
          source,
          a,
          b,
          c,
          d
        ) === false
      ) {
        return 'refused-chain'
      }
      modifierStart = index + 1
      lastColon = index
    }
  }

  if (comment) {
    if (failureIndex === -1) failureIndex = commentStart
    if (failure === null) failure = 'unterminated-comment'
    handler.error?.(ctx, 'unterminated-comment', commentStart)
    if (commentStart < wordErrorMin) wordErrorMin = commentStart
    if (commentStart > wordErrorMax) wordErrorMax = commentStart
  }
  if (quote !== 0) {
    if (failureIndex === -1) failureIndex = quoteStart
    if (failure === null) failure = 'unterminated-string'
    handler.error?.(ctx, 'unterminated-string', quoteStart)
    if (quoteStart < wordErrorMin) wordErrorMin = quoteStart
    if (quoteStart > wordErrorMax) wordErrorMax = quoteStart
  }
  if (depth > 0) {
    if (failureIndex === -1) failureIndex = parenStart
    if (failure === null) failure = 'unterminated-function'
    handler.error?.(ctx, 'unterminated-function', parenStart)
    if (parenStart < wordErrorMin) wordErrorMin = parenStart
    if (parenStart > wordErrorMax) wordErrorMax = parenStart
  }

  if (wordStart !== -1) {
    handler.word?.(ctx, wordStart, length, lastColon !== -1)
    if (lastColon !== -1) {
      // the preceding segment already closed at this word's first colon
      const nextChainValid = wordErrorMin >= lastColon
      const payloadValid = wordErrorMax < lastColon
      if (!handler.chain(ctx, wordStart, lastColon, nextChainValid)) {
        return 'refused-chain'
      }
      chainStart = wordStart
      chainEnd = lastColon
      chainValid = nextChainValid
      chainCount++
      sawChain = true
      segmentStart = lastColon + 1
      segmentValid = nextChainValid && payloadValid
    } else if (wordErrorMax !== -1) {
      segmentValid = false
    }
  } else if (wordErrorMax !== -1) {
    segmentValid = false
  }
  const closed = closeSegment(
    source,
    handler,
    ctx,
    segmentStart,
    length,
    !sawChain,
    segmentValid,
    chainStart,
    chainEnd,
    chainValid,
    chainCount,
    result,
    failure,
    failureIndex,
    a,
    b,
    c,
    d
  )
  const bits = closed % 32
  result |= bits
  if (bits & 4) lastAcceptedStart = Math.floor(closed / 32)
  handler.end?.(
    ctx,
    source,
    result,
    lastAcceptedStart,
    chainCount,
    a,
    b,
    c,
    d,
    failure,
    failureIndex
  )

  return failure
}
