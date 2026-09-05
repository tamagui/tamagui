export type ColorOpacitySuffix =
  | { kind: 'none' }
  /** a valid integer 0-100 suffix */
  | { kind: 'valid'; name: string; opacity: number }
  /** an attempt that is signed, fractional, or out of range — a diagnostic, never a clamp */
  | { kind: 'invalid'; name: string; raw: string }

const opacityAttempt = /^[+-]?\d+(?:\.\d+)?$/
const opacityValid = /^\d+$/

/**
 * The one owner of the color opacity suffix rule for WHOLE names
 * (`slate-500/50`). Every layer — flat payloads, Tailwind candidates, and whole
 * color token values must agree: valid means an unsigned integer 0 through
 * 100; an invalid attempt is a diagnostic and is never clamped or partially
 * applied.
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
