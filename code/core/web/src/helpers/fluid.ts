export interface FluidOptions {
  min: number
  max: number
  from?: number
  to?: number
  unit?: 'cqi' | 'cqw' | 'vw'
}

/**
 * Generates a CSS clamp() string implementing a linear fluid scale.
 * Symmetrically consumed by Web (CSS engine) and Native (Tamagui unit resolver).
 *
 * @example
 * fluid({ min: 18, max: 36, from: 375, to: 1200, unit: 'cqi' })
 * // => "clamp(18px, 2.1818cqi + 9.82px, 36px)"
 *
 * fluid(18, 36, { from: 375, to: 1200 })
 * // => "clamp(18px, 2.1818cqi + 9.82px, 36px)"
 */
export function fluid(options: FluidOptions): string
export function fluid(
  min: number,
  max: number,
  options?: Omit<FluidOptions, 'min' | 'max'>
): string
export function fluid(
  arg1: number | FluidOptions,
  arg2?: number,
  arg3?: Omit<FluidOptions, 'min' | 'max'>
): string {
  let min: number
  let max: number
  let from = 375
  let to = 1200
  let unit: 'cqi' | 'cqw' | 'vw' = 'cqi'

  if (typeof arg1 === 'number') {
    min = arg1
    max = arg2!
    if (arg3) {
      if (arg3.from !== undefined) from = arg3.from
      if (arg3.to !== undefined) to = arg3.to
      if (arg3.unit !== undefined) unit = arg3.unit
    }
  } else {
    min = arg1.min
    max = arg1.max
    if (arg1.from !== undefined) from = arg1.from
    if (arg1.to !== undefined) to = arg1.to
    if (arg1.unit !== undefined) unit = arg1.unit
  }

  const slope = (max - min) / (to - from)
  const intercept = min - slope * from
  const slopePercent = +(slope * 100).toFixed(4)
  const interceptRounded = +intercept.toFixed(2)

  let expr = `${slopePercent}${unit}`
  if (interceptRounded > 0) {
    expr += ` + ${interceptRounded}px`
  } else if (interceptRounded < 0) {
    expr += ` - ${Math.abs(interceptRounded)}px`
  }

  return `clamp(${min}px, ${expr}, ${max}px)`
}
