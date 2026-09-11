// The two serializers over a ResolvedPayload: one representation, two targets.
//
// See plans/dom-tailwind-flat-values.md — "the resolver's mechanical contract".
// Web joins references as `var(--name)` so theme switches stay zero-re-render,
// and a color opacity suffix becomes `color-mix(in srgb, var(--name) NN%,
// transparent)`, which keeps opacity variants theme-reactive without generating
// per-alpha variables. Native looks references up through the granular theme
// subscription at evaluate time and alpha-composes the color right there.
//
// Both spellings match what core already emits: the `color-mix` form is
// `normalizeColor` on web, and the `rgba(r,g,b,a)` form is `normalizeColor` on
// native. Neither is imported — this package stays dependency-free.
//
// With a payload whose references are empty (every lookup missed), both
// functions return the input string byte for byte, which is what makes literal
// CSS provably untouched.

import type { PayloadReference, ResolvedPayload } from './resolvePayload'

export function serializePayloadWeb(
  resolved: ResolvedPayload,
  toVar: (name: string) => string
): string {
  let out = ''
  for (const segment of resolved.segments) {
    if (typeof segment === 'string') {
      out += segment
      continue
    }
    const variable = toVar(segment.name)
    out +=
      segment.opacity === undefined
        ? variable
        : `color-mix(in srgb, ${variable} ${segment.opacity}%, transparent)`
  }
  return out
}

export interface SerializeNativeOptions {
  /**
   * `px-to-number` finalizes a single `<number>px` result to the bare number,
   * which React Native requires for length props. Whether a property takes
   * unitless numbers is property-table knowledge, so it stays with the caller.
   */
  unit?: 'px-to-number'
}

export function serializePayloadNative(
  resolved: ResolvedPayload,
  get: (name: string) => string | number,
  opts?: SerializeNativeOptions
): string | number {
  let out = ''
  for (const segment of resolved.segments) {
    if (typeof segment === 'string') {
      out += segment
      continue
    }
    const value = get(segment.name)
    out += segment.opacity === undefined ? value : composeAlpha(value, segment)
  }
  return finalizeNumeric(out, opts?.unit)
}

/**
 * Alpha-composes a resolved color so native matches what `color-mix(in srgb, C
 * NN%, transparent)` produces on web: the suffix scales the color's existing
 * alpha rather than replacing it.
 */
function composeAlpha(value: string | number, reference: PayloadReference): string {
  const parsed = typeof value === 'string' ? readColor(value) : null
  if (!parsed) {
    throw new Error(
      `cannot apply the /${reference.opacity} opacity suffix to "${reference.name}": ` +
        `its value ${JSON.stringify(value)} is not a #hex, rgb(), or rgba() color`
    )
  }
  const alpha = round4(parsed.a * (reference.opacity! / 100))
  return `rgba(${parsed.r},${parsed.g},${parsed.b},${alpha})`
}

interface Rgba {
  r: number
  g: number
  b: number
  a: number
}

function readColor(input: string): Rgba | null {
  const color = input.trim()
  if (color.charCodeAt(0) === 35) return readHex(color)

  const open = color.indexOf('(')
  if (open === -1 || color.charCodeAt(color.length - 1) !== 41) return null
  const fn = color.slice(0, open).toLowerCase()
  if (fn !== 'rgb' && fn !== 'rgba') return null

  const parts = color.slice(open + 1, -1).split(',')
  if (parts.length !== 3 && parts.length !== 4) return null

  const channels: number[] = []
  for (let index = 0; index < 3; index++) {
    const channel = readNumber(parts[index])
    // percentage channels would need a second scale; not supported here
    if (channel === null) return null
    channels.push(clamp(Math.round(channel), 0, 255))
  }
  let alpha = 1
  if (parts.length === 4) {
    const parsedAlpha = readNumber(parts[3])
    if (parsedAlpha === null) return null
    alpha = clamp(parsedAlpha, 0, 1)
  }
  return { r: channels[0], g: channels[1], b: channels[2], a: alpha }
}

function readHex(color: string): Rgba | null {
  const digits = color.slice(1)
  const size = digits.length
  if (size !== 3 && size !== 4 && size !== 6 && size !== 8) return null
  for (let index = 0; index < size; index++) {
    const code = digits.charCodeAt(index)
    const isHex =
      (code >= 48 && code <= 57) ||
      (code >= 97 && code <= 102) ||
      (code >= 65 && code <= 70)
    if (!isHex) return null
  }
  const short = size === 3 || size === 4
  const pair = (position: number): number =>
    short
      ? Number.parseInt(digits[position].repeat(2), 16)
      : Number.parseInt(digits.slice(position * 2, position * 2 + 2), 16)
  const hasAlpha = size === 4 || size === 8
  return {
    r: pair(0),
    g: pair(1),
    b: pair(2),
    a: hasAlpha ? round4(pair(3) / 255) : 1,
  }
}

function readNumber(text: string): number | null {
  const trimmed = text.trim()
  if (!trimmed) return null
  for (let index = 0; index < trimmed.length; index++) {
    const code = trimmed.charCodeAt(index)
    const ok =
      (code >= 48 && code <= 57) ||
      code === 46 || // .
      ((code === 45 || code === 43) && index === 0) // leading sign
    if (!ok) return null
  }
  const value = Number(trimmed)
  return Number.isFinite(value) ? value : null
}

function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value
}

/** 8-bit alpha needs nowhere near this much precision; this just kills float noise */
function round4(value: number): number {
  return Math.round(value * 10000) / 10000
}

/**
 * React Native wants bare numbers for numeric props, so a result that is exactly
 * one plain number becomes a number, and `<number>px` becomes one when the
 * caller says this property's lengths are unitless.
 */
function finalizeNumeric(out: string, unit: 'px-to-number' | undefined): string | number {
  let end = out.length
  if (unit === 'px-to-number' && end > 2 && out.endsWith('px')) end -= 2
  if (end === 0) return out

  let index = 0
  const first = out.charCodeAt(0)
  if (first === 45 || first === 43) index++
  let digits = 0
  let dots = 0
  for (; index < end; index++) {
    const code = out.charCodeAt(index)
    if (code >= 48 && code <= 57) {
      digits++
      continue
    }
    if (code === 46) {
      dots++
      if (dots > 1) return out
      continue
    }
    return out
  }
  if (digits === 0) return out

  const value = Number(out.slice(0, end))
  return Number.isFinite(value) ? value : out
}
