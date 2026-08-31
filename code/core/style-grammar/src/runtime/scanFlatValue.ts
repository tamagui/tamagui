export type FlatScanErrorCode =
  | 'invalid-character'
  | 'unterminated-string'
  | 'unterminated-function'
  | 'unterminated-comment'
  | 'stray-comment-close'

export type FlatScanFailure = FlatScanErrorCode | 'refused-chain'

export interface FlatValueHandler<Context> {
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
  chain(ctx: Context, start: number, end: number, valid: boolean): boolean
  error?(ctx: Context, code: FlatScanErrorCode, index: number): void
  word?(ctx: Context, start: number, end: number, isChain: boolean): void
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

export type ParsedFlatValue = [
  segments: readonly number[],
  failure: FlatScanFailure | null,
  failureIndex: number,
]

function opensUrlToken(source: string, index: number): boolean {
  if (
    index < 3 ||
    (source.charCodeAt(index - 3) | 32) !== 117 ||
    (source.charCodeAt(index - 2) | 32) !== 114 ||
    (source.charCodeAt(index - 1) | 32) !== 108
  ) {
    return false
  }
  const b = index > 3 ? source.charCodeAt(index - 4) : 0
  if (
    b === 45 ||
    b === 95 ||
    b > 127 ||
    (b > 47 && b < 58) ||
    (b > 64 && b < 91) ||
    (b > 96 && b < 123)
  ) {
    return false
  }
  while (source.charCodeAt(++index) <= 32);
  const q = source.charCodeAt(index)
  return q !== 34 && q !== 39
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
  let failure: FlatScanFailure | null = null,
    failureIndex = -1,
    sawChain = false,
    chainCount = 0,
    chainStart = -1,
    chainEnd = -1,
    chainValid = true,
    result = 0,
    lastAcceptedStart = 0,
    segmentValid = true,
    segmentStart = 0,
    comment = false,
    commentStart = -1,
    quote = 0,
    quoteStart = -1,
    url = false,
    depth = 0,
    parenStart = -1,
    wordStart = -1,
    lastColon = -1,
    modifierStart = -1,
    wordErrorMin = length,
    wordErrorMax = -1

  const report = (code: FlatScanErrorCode, at: number) => {
    if (failureIndex === -1) failureIndex = at
    failure ??= code
    handler.error?.(ctx, code, at)
    if (at < wordErrorMin) wordErrorMin = at
    if (at > wordErrorMax) wordErrorMax = at
  }

  const closeSegment = (end: number) => {
    let start = segmentStart,
      stop = end
    while (start < stop && source.charCodeAt(start) <= 32) start++
    while (stop > start && source.charCodeAt(stop - 1) <= 32) stop--
    const bits = (handler.segment(
      ctx,
      start,
      stop,
      !sawChain,
      segmentValid,
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
    ) || 0) as number
    result |= bits
    if (bits & 4) lastAcceptedStart = start
  }

  const flushWord = (end: number) => {
    if (wordStart !== -1) {
      handler.word?.(ctx, wordStart, end, lastColon !== -1)
      if (lastColon !== -1) {
        const nextChainValid = wordErrorMin >= lastColon
        if (!handler.chain(ctx, wordStart, lastColon, nextChainValid)) return false
        chainStart = wordStart
        chainEnd = lastColon
        chainValid = nextChainValid
        chainCount++
        sawChain = true
        segmentStart = lastColon + 1
        segmentValid = nextChainValid && wordErrorMax < lastColon
      }
    }
    if (lastColon === -1 && wordErrorMax !== -1) segmentValid = false
    wordStart = lastColon = modifierStart = wordErrorMax = -1
    wordErrorMin = length
    return true
  }

  for (let index = 0; index < length; index++) {
    const code = source.charCodeAt(index)

    if (code === 42 && source.charCodeAt(index + 1) === 47) {
      if (comment) comment = false
      else report('stray-comment-close', index)
      index++
      continue
    }
    if (comment) continue

    if (code === 92) {
      index++
      continue
    }

    if (quote) {
      if (code === quote) quote = 0
      else if (code === 10 || code === 13 || code === 12) {
        report('unterminated-string', quoteStart)
        quote = 0
        index--
      }
      continue
    }

    if (url) {
      if (code === 41) {
        url = false
        depth--
      }
      continue
    }

    if (code === 47 && source.charCodeAt(index + 1) === 42) {
      comment = true
      commentStart = index++
      continue
    }

    if (code === 34 || code === 39) {
      quote = code
      quoteStart = index
      continue
    }
    if (code === 40) {
      if (opensUrlToken(source, index)) url = true
      if (!depth) parenStart = index
      depth++
      continue
    }
    if (depth) {
      if (code === 41) depth--
      continue
    }

    if (code <= 32) {
      if (wordStart !== -1 && !flushWord(index)) return 'refused-chain'
      continue
    }

    if (wordStart === -1) wordStart = index

    if (code === 59 || code === 123 || code === 125) {
      report('invalid-character', index)
    } else if (code === 58) {
      const first = modifierStart === -1
      const start = first ? wordStart : modifierStart
      if (first) closeSegment(wordStart)
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
      modifierStart = (lastColon = index) + 1
    }
  }

  if (comment) report('unterminated-comment', commentStart)
  if (quote) report('unterminated-string', quoteStart)
  if (depth) report('unterminated-function', parenStart)

  if (!flushWord(length)) return 'refused-chain'
  closeSegment(length)

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

const parsedValues = new Map<string, ParsedFlatValue>()

export function parseFlatValue(source: string): ParsedFlatValue {
  const known = parsedValues.get(source)
  if (known) return known

  const context =
    process.env.NODE_ENV === 'production'
      ? parseFlatValueProduction(source)
      : parseFlatValueChecked(source)
  if (parsedValues.size > 2048) parsedValues.clear()
  parsedValues.set(source, context)
  return context
}

function parseFlatValueProduction(source: string): ParsedFlatValue {
  const length = source.length
  const segments: number[] = []
  let sawChain = false,
    chainStart = -1,
    chainEnd = -1,
    segmentStart = 0,
    wordStart = -1,
    lastColon = -1,
    quote = 0,
    comment = false,
    depth = 0,
    valid = true

  const close = (end: number) => {
    let start = segmentStart
    while (start < end && source.charCodeAt(start) <= 32) start++
    while (end > start && source.charCodeAt(end - 1) <= 32) end--
    segments.push(start, end, chainStart, chainEnd, (!sawChain ? 1 : 0) | 6)
  }
  const flush = () => {
    if (wordStart !== -1 && lastColon !== -1) {
      chainStart = wordStart
      chainEnd = lastColon
      sawChain = true
      segmentStart = lastColon + 1
    }
    wordStart = lastColon = -1
  }

  for (let index = 0; index < length; index++) {
    const code = source.charCodeAt(index)
    if (comment) {
      if (code === 42 && source.charCodeAt(index + 1) === 47) {
        comment = false
        index++
      }
      continue
    }
    if (code === 92) {
      index++
      continue
    }
    if (quote) {
      if (code === quote) quote = 0
      else if (code === 10 || code === 13 || code === 12) valid = false
      continue
    }
    if (code === 47 && source.charCodeAt(index + 1) === 42) {
      comment = true
      index++
      continue
    }
    if (code === 42 && source.charCodeAt(index + 1) === 47) {
      valid = false
      index++
      continue
    }
    if (code === 34 || code === 39) {
      quote = code
      continue
    }
    if (code === 40) {
      depth++
      continue
    }
    if (depth) {
      if (code === 41) depth--
      continue
    }
    if (code <= 32) {
      if (wordStart !== -1) flush()
      continue
    }
    if (wordStart === -1) wordStart = index
    if (code === 59 || code === 123 || code === 125) valid = false
    else if (code === 58) {
      if (lastColon === -1) close(wordStart)
      lastColon = index
    }
  }

  if (comment || quote || depth) valid = false
  flush()
  close(length)
  if (!valid) {
    for (let index = 4; index < segments.length; index += 5) segments[index] &= 1
  }
  return [segments, null, -1]
}

function parseFlatValueChecked(source: string): ParsedFlatValue {
  const length = source.length
  const segments: number[] = []
  let failure: FlatScanFailure | null = null,
    failureIndex = -1,
    sawChain = false,
    chainStart = -1,
    chainEnd = -1,
    chainValid = true,
    segmentValid = true,
    segmentStart = 0,
    comment = false,
    commentStart = -1,
    quote = 0,
    quoteStart = -1,
    url = false,
    depth = 0,
    parenStart = -1,
    wordStart = -1,
    lastColon = -1,
    wordErrorMin = length,
    wordErrorMax = -1

  const report = (code: FlatScanErrorCode, index: number) => {
    if (failureIndex === -1) failureIndex = index
    failure ??= code
    wordErrorMin = Math.min(wordErrorMin, index)
    wordErrorMax = Math.max(wordErrorMax, index)
  }
  const close = (end: number) => {
    let start = segmentStart
    while (start < end && source.charCodeAt(start) <= 32) start++
    while (end > start && source.charCodeAt(end - 1) <= 32) end--
    const valid = segmentValid && chainValid
    segments.push(
      start,
      end,
      chainStart,
      chainEnd,
      (!sawChain ? 1 : 0) | (segmentValid ? 2 : 0) | (chainValid ? 4 : 0)
    )
  }
  const flush = (end: number) => {
    if (wordStart !== -1 && lastColon !== -1) {
      chainStart = wordStart
      chainEnd = lastColon
      chainValid = wordErrorMin >= lastColon
      sawChain = true
      segmentStart = lastColon + 1
      segmentValid = chainValid && wordErrorMax < lastColon
    } else if (wordErrorMax !== -1) {
      segmentValid = false
    }
    wordStart = lastColon = wordErrorMax = -1
    wordErrorMin = length
  }

  for (let index = 0; index < length; index++) {
    const code = source.charCodeAt(index)
    if (code === 42 && source.charCodeAt(index + 1) === 47) {
      if (comment) comment = false
      else report('stray-comment-close', index)
      index++
      continue
    }
    if (comment) continue
    if (code === 92) {
      index++
      continue
    }
    if (quote) {
      if (code === quote) quote = 0
      else if (code === 10 || code === 13 || code === 12) {
        report('unterminated-string', quoteStart)
        quote = 0
        index--
      }
      continue
    }
    if (url) {
      if (code === 41) {
        url = false
        depth--
      }
      continue
    }
    if (code === 47 && source.charCodeAt(index + 1) === 42) {
      comment = true
      commentStart = index++
      continue
    }
    if (code === 34 || code === 39) {
      quote = code
      quoteStart = index
      continue
    }
    if (code === 40) {
      if (opensUrlToken(source, index)) url = true
      if (!depth) parenStart = index
      depth++
      continue
    }
    if (depth) {
      if (code === 41) depth--
      continue
    }
    if (code <= 32) {
      if (wordStart !== -1) flush(index)
      continue
    }
    if (wordStart === -1) wordStart = index
    if (code === 59 || code === 123 || code === 125) {
      report('invalid-character', index)
    } else if (code === 58) {
      if (lastColon === -1) close(wordStart)
      lastColon = index
    }
  }

  if (comment) report('unterminated-comment', commentStart)
  if (quote) report('unterminated-string', quoteStart)
  if (depth) report('unterminated-function', parenStart)
  flush(length)
  close(length)
  return [segments, failure, failureIndex]
}
