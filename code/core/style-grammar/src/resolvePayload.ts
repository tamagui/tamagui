// Config-first identifier resolution inside one clause payload.
//
// See plans/dom-tailwind-flat-values.md — "the resolver's mechanical contract".
// Step 3 of the shared pipeline: the parser has already split the program, and
// this turns one payload into static text runs plus reference nodes, which the
// two serializers in ./serializePayload render for web and native. One
// implementation serves both platforms, so resolution never bakes in a target.
//
// What is a candidate:
//
// - ident tokens anywhere, including inside function arguments, so
//   `linear-gradient(135deg, accent, blue)` resolves `accent`;
// - never inside a string, never inside an unquoted `url()` body, never a
//   function name, never a `--*` custom-property reference;
// - bare numbers only when the property binds a numeric token category, and only
//   as a whole component value: `4 8` resolves both, `0 2px` resolves neither for
//   box-shadow because it binds no numeric category. Numbers with units are
//   always literal.
//
// A lookup miss stays literal text. Typos in literal positions are the
// compiler's and language service's job, never a runtime guess — so with a
// lookup that resolves nothing, both serializers reproduce the input exactly.

import { reservedCssIdents } from './valueTypes'

export type ReferenceKind = 'color' | 'length' | 'number' | 'other'

/**
 * What a lookup returns for a configured token or variable. Intentionally open:
 * the variables unification (design item 11) can carry more here, and extra
 * fields ride through onto the emitted reference.
 */
export interface ResolvedReference {
  /** the resolved name, which is what the serializers key on */
  name: string
  kind: ReferenceKind
}

/** a resolved reference in a payload, with its color opacity suffix if any */
export type PayloadReference = ResolvedReference & {
  /** integer 1-99; only ever present when `kind` is `color` */
  opacity?: number
}

export type PayloadSegment = string | PayloadReference

export type PayloadResolveErrorCode = 'opacity-on-non-color'

export interface PayloadResolveError {
  code: PayloadResolveErrorCode
  /** character offset of the identifier within the payload */
  index: number
  message: string
  /** the identifier the suffix was applied to, without the suffix */
  name: string
  opacity: number
}

export interface ResolvedPayload {
  /** static text runs and references, in payload order; adjacent text collapses */
  segments: readonly PayloadSegment[]
  /** every reference in `segments`, same objects, in order */
  references: readonly PayloadReference[]
  errors: readonly PayloadResolveError[]
}

export interface ResolvePayloadOptions {
  /** the property's bound token categories first, then the variables namespace */
  lookup(name: string): ResolvedReference | undefined
  /**
   * set when the property binds a numeric token category (space, size, radius,
   * z-index). Off means bare numbers are always literal.
   */
  resolveNumbers?: boolean
}

const noReferences: readonly PayloadReference[] = Object.freeze([])
const noErrors: readonly PayloadResolveError[] = Object.freeze([])

const CHAR_TAB = 9
const CHAR_LF = 10
const CHAR_FF = 12
const CHAR_CR = 13
const CHAR_SPACE = 32
const CHAR_PERCENT = 37
const CHAR_HASH = 35
const CHAR_DOUBLE_QUOTE = 34
const CHAR_SINGLE_QUOTE = 39
const CHAR_PAREN_OPEN = 40
const CHAR_PAREN_CLOSE = 41
const CHAR_PLUS = 43
const CHAR_COMMA = 44
const CHAR_MINUS = 45
const CHAR_DOT = 46
const CHAR_SLASH = 47
const CHAR_UNDERSCORE = 95
const CHAR_BACKSLASH = 92
const CHAR_E_LOWER = 101
const CHAR_E_UPPER = 69

function isWhitespace(code: number): boolean {
  return (
    code === CHAR_SPACE ||
    code === CHAR_TAB ||
    code === CHAR_LF ||
    code === CHAR_CR ||
    code === CHAR_FF
  )
}

function isDigit(code: number): boolean {
  return code >= 48 && code <= 57
}

function isLetter(code: number): boolean {
  return (code >= 97 && code <= 122) || (code >= 65 && code <= 90)
}

function isIdentStart(code: number): boolean {
  return (
    isLetter(code) ||
    code === CHAR_UNDERSCORE ||
    code === CHAR_MINUS ||
    code === CHAR_BACKSLASH ||
    // non-ascii idents are legal CSS and may name a configured token
    code > 127
  )
}

function isIdentPart(code: number): boolean {
  return isIdentStart(code) || isDigit(code)
}

/** a component-value boundary, with -1 meaning start or end of the payload */
function isBoundary(code: number): boolean {
  return (
    code === -1 ||
    isWhitespace(code) ||
    code === CHAR_COMMA ||
    code === CHAR_PAREN_OPEN ||
    code === CHAR_PAREN_CLOSE
  )
}

export function resolvePayload(
  payload: string,
  options: ResolvePayloadOptions
): ResolvedPayload {
  const { lookup, resolveNumbers = false } = options
  const length = payload.length

  const segments: PayloadSegment[] = []
  let references: PayloadReference[] | null = null
  let errors: PayloadResolveError[] | null = null
  // start of the static run not yet pushed
  let staticStart = 0

  const codeAt = (index: number): number =>
    index >= 0 && index < length ? payload.charCodeAt(index) : -1

  const pushReference = (start: number, end: number, reference: PayloadReference) => {
    if (start > staticStart) segments.push(payload.slice(staticStart, start))
    segments.push(reference)
    ;(references ||= []).push(reference)
    staticStart = end
  }

  let index = 0
  while (index < length) {
    const code = payload.charCodeAt(index)

    // strings are verbatim, including anything ident-shaped inside them
    if (code === CHAR_DOUBLE_QUOTE || code === CHAR_SINGLE_QUOTE) {
      index++
      while (index < length) {
        const inner = payload.charCodeAt(index)
        if (inner === CHAR_BACKSLASH) index += 2
        else if (inner === code) {
          index++
          break
        } else index++
      }
      continue
    }

    // a hex color's digits are not a number token
    if (code === CHAR_HASH) {
      index++
      while (index < length && isIdentPart(payload.charCodeAt(index))) index++
      continue
    }

    // `-` before a digit is a signed number, not an ident
    if (isIdentStart(code) && !(code === CHAR_MINUS && isDigit(codeAt(index + 1)))) {
      const start = index
      let end = index
      while (end < length && isIdentPart(payload.charCodeAt(end))) {
        end += payload.charCodeAt(end) === CHAR_BACKSLASH ? 2 : 1
      }
      const name = payload.slice(start, Math.min(end, length))

      // a function name is never a candidate, and an unquoted url() body never
      // resolves, so skip the whole call
      if (codeAt(end) === CHAR_PAREN_OPEN) {
        index = name.toLowerCase() === 'url' ? skipParens(payload, end) : end + 1
        continue
      }

      // custom-property references stay literal
      if (name.startsWith('--')) {
        index = end
        continue
      }

      // an integer percentage directly on the ident is the opacity suffix
      let consumedEnd = end
      let opacity: number | undefined
      if (codeAt(end) === CHAR_SLASH) {
        let digitsEnd = end + 1
        while (digitsEnd < length && isDigit(payload.charCodeAt(digitsEnd))) digitsEnd++
        const digits = digitsEnd - (end + 1)
        if (digits > 0 && digits <= 3 && isBoundary(codeAt(digitsEnd))) {
          const percentage = Number(payload.slice(end + 1, digitsEnd))
          if (percentage >= 0 && percentage <= 100) {
            opacity = percentage
            consumedEnd = digitsEnd
          }
        }
      }

      const resolved = reservedCssIdents.has(name) ? undefined : lookup(name)

      if (opacity !== undefined && (!resolved || resolved.kind !== 'color')) {
        // the suffix is recognized only directly after a resolved color token;
        // the text stays literal so the payload still round-trips
        ;(errors ||= []).push({
          code: 'opacity-on-non-color',
          index: start,
          message: resolved
            ? `"${name}" is not a color token (kind: ${resolved.kind}), so the /${opacity} opacity suffix does not apply`
            : `"${name}" is not a resolved color token, so the /${opacity} opacity suffix does not apply`,
          name,
          opacity,
        })
        index = consumedEnd
        continue
      }

      if (!resolved) {
        index = end
        continue
      }

      pushReference(
        start,
        consumedEnd,
        // 100% is the identity, so it never reaches a serializer
        opacity === undefined || opacity === 100
          ? { ...resolved }
          : { ...resolved, opacity }
      )
      index = consumedEnd
      continue
    }

    if (
      isDigit(code) ||
      code === CHAR_DOT ||
      ((code === CHAR_PLUS || code === CHAR_MINUS) && isDigit(codeAt(index + 1)))
    ) {
      const start = index
      let end = index
      if (code === CHAR_PLUS || code === CHAR_MINUS) end++
      while (end < length) {
        const digit = payload.charCodeAt(end)
        if (isDigit(digit) || digit === CHAR_DOT) end++
        else break
      }
      // scientific notation stays part of the number token
      if (codeAt(end) === CHAR_E_LOWER || codeAt(end) === CHAR_E_UPPER) {
        let exponent = end + 1
        if (codeAt(exponent) === CHAR_PLUS || codeAt(exponent) === CHAR_MINUS) exponent++
        if (isDigit(codeAt(exponent))) {
          exponent++
          while (exponent < length && isDigit(payload.charCodeAt(exponent))) exponent++
          end = exponent
        }
      }
      const numberEnd = end

      // a unit or percent sign makes it literal
      let unitEnd = numberEnd
      if (codeAt(unitEnd) === CHAR_PERCENT) unitEnd++
      else while (unitEnd < length && isIdentPart(payload.charCodeAt(unitEnd))) unitEnd++
      if (unitEnd > numberEnd) {
        index = unitEnd
        continue
      }

      // a number resolves only as a WHOLE component value, so it must be
      // bounded on both sides: `4 8` resolves both, `4/8` and `12px/4` neither
      if (
        !resolveNumbers ||
        !isBoundary(codeAt(start - 1)) ||
        !isBoundary(codeAt(numberEnd))
      ) {
        index = numberEnd
        continue
      }

      const name = payload.slice(start, numberEnd)
      const resolved = lookup(name)
      if (resolved) pushReference(start, numberEnd, { ...resolved })
      index = numberEnd
      continue
    }

    index++
  }

  if (staticStart < length) segments.push(payload.slice(staticStart))

  return {
    segments,
    references: references ?? noReferences,
    errors: errors ?? noErrors,
  }
}

/** index just past the `)` matching the `(` at `open` */
function skipParens(payload: string, open: number): number {
  let depth = 0
  let index = open
  while (index < payload.length) {
    const code = payload.charCodeAt(index)
    if (code === CHAR_BACKSLASH) {
      index += 2
      continue
    }
    if (code === CHAR_DOUBLE_QUOTE || code === CHAR_SINGLE_QUOTE) {
      index++
      while (index < payload.length) {
        const inner = payload.charCodeAt(index)
        if (inner === CHAR_BACKSLASH) index += 2
        else if (inner === code) {
          index++
          break
        } else index++
      }
      continue
    }
    if (code === CHAR_PAREN_OPEN) depth++
    else if (code === CHAR_PAREN_CLOSE) {
      depth--
      if (depth === 0) return index + 1
    }
    index++
  }
  return payload.length
}
