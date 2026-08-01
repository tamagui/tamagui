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
// A bare lookup miss stays literal text. Typos in literal positions are the
// compiler's and language service's job, never a runtime guess. An explicit
// legacy `$token` is different: a miss is structured invalid-token input so
// neither serializer can ship the sigil as CSS or a native value.

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

export type PayloadResolveErrorCode =
  /** the suffix is recognized only directly after a resolved color token */
  | 'opacity-on-non-color'
  /** a suffix on a resolved color token that is not an integer 0 through 100 */
  | 'opacity-out-of-range'
  /** a legacy `$token` spelling did not name a configured token */
  | 'unresolved-token'

export interface PayloadResolveError {
  code: PayloadResolveErrorCode
  /** character offset of the identifier within the payload */
  index: number
  message: string
  /** the token or identifier name, without a sigil or opacity suffix */
  name: string
  /** the percentage as authored, when this is an opacity error */
  opacity?: number
}

interface OpacitySuffix {
  /** index just past the suffix */
  end: number
  /** the percentage, or null when it is not a valid integer 0 through 100 */
  percentage: number | null
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

// CSS-wide keywords are case-insensitive, and the shared set spells one of them
// camelCase (`currentColor`), so both sides of the comparison have to fold
const reservedFolded: ReadonlySet<string> = new Set(
  Array.from(reservedCssIdents, (ident) => ident.toLowerCase())
)

const noReferences: readonly PayloadReference[] = Object.freeze([])
const noErrors: readonly PayloadResolveError[] = Object.freeze([])

const CHAR_TAB = 9
const CHAR_LF = 10
const CHAR_FF = 12
const CHAR_CR = 13
const CHAR_SPACE = 32
const CHAR_DOLLAR = 36
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

function isLegacyTokenPart(code: number): boolean {
  return isIdentPart(code) || code === CHAR_DOT
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

    // the flat spelling is bare, but v3 must remain additive while existing
    // apps still author `$token`. treat one leading sigil as syntax, consume
    // the complete legacy atom (including dotted and numeric names), then run
    // the same configured-name lookup exactly once.
    const hasLegacyPrefix = code === CHAR_DOLLAR
    const candidateStart = hasLegacyPrefix ? index + 1 : index
    const candidateCode = codeAt(candidateStart)

    // `-` before a digit is a signed number, not an ident
    if (
      hasLegacyPrefix ||
      (isIdentStart(candidateCode) &&
        !(candidateCode === CHAR_MINUS && isDigit(codeAt(candidateStart + 1))))
    ) {
      const replacementStart = index
      const start = candidateStart
      let end = candidateStart
      while (
        end < length &&
        (hasLegacyPrefix
          ? isLegacyTokenPart(payload.charCodeAt(end))
          : isIdentPart(payload.charCodeAt(end)))
      ) {
        end += payload.charCodeAt(end) === CHAR_BACKSLASH ? 2 : 1
      }
      const name = payload.slice(start, Math.min(end, length))

      // a function name is never a candidate, and an unquoted url() body never
      // resolves, so skip the whole call
      if (!hasLegacyPrefix && codeAt(end) === CHAR_PAREN_OPEN) {
        index = name.toLowerCase() === 'url' ? skipParens(payload, end) : end + 1
        continue
      }

      // custom-property references stay literal
      if (!hasLegacyPrefix && name.startsWith('--')) {
        index = end
        continue
      }

      // CSS-wide keywords are case-insensitive, so the reserved gate is folded.
      // Token names themselves stay case-sensitive, and an explicit legacy
      // sigil bypasses this literal-only gate.
      const resolved =
        !name || (!hasLegacyPrefix && reservedFolded.has(name.toLowerCase()))
          ? undefined
          : lookup(name)

      // a numeric run directly after the ident, ending at a component boundary,
      // is an opacity suffix attempt. `center/50%` and `center/cover` are not
      // attempts at all, so ordinary CSS slash forms never come near this.
      const suffix = readOpacitySuffix(payload, end, codeAt)

      if (hasLegacyPrefix && !resolved) {
        const tokenEnd = suffix?.end ?? end
        const authored = payload.slice(replacementStart, tokenEnd) || '$'
        ;(errors ||= []).push({
          code: 'unresolved-token',
          index: replacementStart,
          message: `"${authored}" is not a configured token; use a configured token name or remove "$" for a literal value`,
          name,
        })
        index = Math.max(tokenEnd, replacementStart + 1)
        continue
      }

      if (suffix !== null && resolved?.kind === 'color') {
        if (suffix.percentage === null) {
          // a malformed percentage on a real color token is the user reaching for
          // opacity and missing, so it is reported rather than emitted as text
          ;(errors ||= []).push({
            code: 'opacity-out-of-range',
            index: replacementStart,
            message: `"${name}${payload.slice(end, suffix.end)}" is not an opacity suffix: it must be an integer percentage from 0 through 100`,
            name,
            opacity: Number(payload.slice(end + 1, suffix.end)),
          })
          index = suffix.end
          continue
        }
        pushReference(
          replacementStart,
          suffix.end,
          // 100% is the identity, so it never reaches a serializer
          suffix.percentage === 100
            ? { ...resolved }
            : { ...resolved, opacity: suffix.percentage }
        )
        index = suffix.end
        continue
      }

      if (suffix !== null && suffix.percentage !== null) {
        // a well-formed suffix somewhere it cannot apply: the suffix is
        // recognized only directly after a resolved color token. The text stays
        // literal so the payload still round-trips.
        ;(errors ||= []).push({
          code: 'opacity-on-non-color',
          index: replacementStart,
          message: resolved
            ? `"${name}" is not a color token (kind: ${resolved.kind}), so the /${suffix.percentage} opacity suffix does not apply`
            : `"${name}" is not a resolved color token, so the /${suffix.percentage} opacity suffix does not apply`,
          name,
          opacity: suffix.percentage,
        })
        index = suffix.end
        continue
      }

      // no suffix, or a malformed one after an ident that is not a color token,
      // which is ordinary CSS such as `font: bold small/1.2 serif`
      if (!resolved) {
        index = end
        continue
      }

      pushReference(replacementStart, end, { ...resolved })
      index = end
      continue
    }

    if (
      isDigit(code) ||
      code === CHAR_DOT ||
      ((code === CHAR_PLUS || code === CHAR_MINUS) && isDigit(codeAt(index + 1)))
    ) {
      const replacementStart = index
      const start = index
      let end = start
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
        !isBoundary(codeAt(replacementStart - 1)) ||
        !isBoundary(codeAt(numberEnd))
      ) {
        index = numberEnd
        continue
      }

      const name = payload.slice(start, numberEnd)
      const resolved = lookup(name)
      if (resolved) pushReference(replacementStart, numberEnd, { ...resolved })
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

export type ColorOpacitySuffix =
  /** no suffix attempt: `center/cover` and `x/50%` are ordinary CSS */
  | { kind: 'none' }
  /** a valid suffix: unsigned integer 0 through 100 */
  | { kind: 'valid'; name: string; opacity: number }
  /** an attempt that is signed, fractional, or out of range — a diagnostic, never a clamp */
  | { kind: 'invalid'; name: string; raw: string }

const opacityAttempt = /^[+-]?\d+(?:\.\d+)?$/
const opacityValid = /^\d+$/

/**
 * The one owner of the color opacity suffix rule for WHOLE names
 * (`slate-500/50`). Every layer — flat payloads (via `readOpacitySuffix`
 * below, same rules anchored mid-payload), Tailwind candidates, and the
 * legacy `$token/NN` path — must agree: valid means an unsigned integer 0
 * through 100; an invalid attempt is a diagnostic and is never clamped or
 * partially applied (review divergence 2).
 */
export function splitColorOpacitySuffix(value: string): ColorOpacitySuffix {
  const slash = value.lastIndexOf('/')
  if (slash <= 0 || slash === value.length - 1) return { kind: 'none' }
  const raw = value.slice(slash + 1)
  if (!opacityAttempt.test(raw)) return { kind: 'none' }
  const name = value.slice(0, slash)
  if (opacityValid.test(raw) && Number(raw) <= 100) {
    return { kind: 'valid', name, opacity: Number(raw) }
  }
  return { kind: 'invalid', name, raw }
}

/**
 * Reads a `/NN` opacity suffix attempt sitting directly on an ident. An attempt
 * is a numeric run that ends at a component boundary, so `center/cover` and
 * `center/50%` are not attempts and stay ordinary CSS. `percentage` is null when
 * the number is signed, fractional, or outside 0 through 100.
 */
function readOpacitySuffix(
  payload: string,
  identEnd: number,
  codeAt: (index: number) => number
): OpacitySuffix | null {
  if (codeAt(identEnd) !== CHAR_SLASH) return null
  let cursor = identEnd + 1
  let signed = false
  if (codeAt(cursor) === CHAR_MINUS || codeAt(cursor) === CHAR_PLUS) {
    signed = true
    cursor++
  }
  const digitsStart = cursor
  while (isDigit(codeAt(cursor))) cursor++
  if (cursor === digitsStart) return null
  let fractional = false
  if (codeAt(cursor) === CHAR_DOT && isDigit(codeAt(cursor + 1))) {
    fractional = true
    cursor++
    while (isDigit(codeAt(cursor))) cursor++
  }
  if (!isBoundary(codeAt(cursor))) return null
  const value = Number(payload.slice(identEnd + 1, cursor))
  const valid = !signed && !fractional && value >= 0 && value <= 100
  return { end: cursor, percentage: valid ? value : null }
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
