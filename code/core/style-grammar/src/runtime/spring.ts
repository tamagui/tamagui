// the one spring solver. every driver and the transition object parser go
// through it, so `spring(200ms, 0.2)` means the same motion on css, reanimated,
// motion, and react-native instead of each config being hand-tuned separately.
//
// canonical form is (duration, bounce), the portable pair:
//
//   duration  the perceptual duration, defined as the UNDAMPED PERIOD
//             `2pi / sqrt(stiffness / mass)`. this is SwiftUI's convention.
//             note it is NOT the settle time: a bouncy spring keeps moving
//             after it, which is why css needs `springSettleTime` separately.
//   bounce    0 is critically damped, approaches 1 for undamped oscillation,
//             negative is overdamped. maps to damping ratio zeta as
//             `zeta = 1 - bounce` when bounce >= 0, else `1 / (1 + bounce)`.
//
// stiffness/damping/mass stay reachable, but they are a projection of the
// canonical pair rather than a second source of truth.

export interface SpringPhysics {
  stiffness: number
  damping: number
  mass: number
}

export interface SpringCanonical {
  /** undamped period, in milliseconds */
  duration: number
  bounce: number
}

const TWO_PI = Math.PI * 2

/** bounce -> damping ratio. bounce is exclusive of -1 and 1. */
export function bounceToDampingRatio(bounce: number): number {
  return bounce >= 0 ? 1 - bounce : 1 / (1 + bounce)
}

/** damping ratio -> bounce. exact inverse of bounceToDampingRatio. */
export function dampingRatioToBounce(dampingRatio: number): number {
  return dampingRatio <= 1 ? 1 - dampingRatio : 1 / dampingRatio - 1
}

export function springFromDurationBounce(
  { duration, bounce }: SpringCanonical,
  mass = 1
): SpringPhysics {
  const naturalFrequency = TWO_PI / (duration / 1000)
  const dampingRatio = bounceToDampingRatio(bounce)
  return {
    stiffness: naturalFrequency * naturalFrequency * mass,
    damping: 2 * dampingRatio * naturalFrequency * mass,
    mass,
  }
}

export function springToDurationBounce({
  stiffness,
  damping,
  mass,
}: SpringPhysics): SpringCanonical {
  const naturalFrequency = Math.sqrt(stiffness / mass)
  const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass))
  return {
    duration: (TWO_PI / naturalFrequency) * 1000,
    bounce: dampingRatioToBounce(dampingRatio),
  }
}

/**
 * normalized step response of a unit spring at time t (seconds): 0 at rest,
 * 1 at target, overshooting past 1 when underdamped.
 */
export function springPosition(
  { duration, bounce }: SpringCanonical,
  timeSeconds: number
): number {
  const naturalFrequency = TWO_PI / (duration / 1000)
  const dampingRatio = bounceToDampingRatio(bounce)
  const wt = naturalFrequency * timeSeconds

  if (dampingRatio < 1) {
    const damped = Math.sqrt(1 - dampingRatio * dampingRatio)
    const envelope = Math.exp(-dampingRatio * wt)
    const dampedAngle = damped * wt
    return (
      1 -
      envelope * (Math.cos(dampedAngle) + (dampingRatio / damped) * Math.sin(dampedAngle))
    )
  }

  if (dampingRatio === 1) {
    return 1 - Math.exp(-wt) * (1 + wt)
  }

  const excess = Math.sqrt(dampingRatio * dampingRatio - 1)
  const rootA = naturalFrequency * (-dampingRatio + excess)
  const rootB = naturalFrequency * (-dampingRatio - excess)
  return (
    1 -
    (rootB * Math.exp(rootA * timeSeconds) - rootA * Math.exp(rootB * timeSeconds)) /
      (rootB - rootA)
  )
}

/**
 * an upper bound on |springPosition - 1| at time t (seconds). monotonically
 * decreasing in every damping regime, which is what lets settle time bisect.
 *
 * bounding the ENVELOPE rather than the position matters for underdamped
 * springs: the position crosses its target on every oscillation, so "first
 * time within threshold" would report a zero crossing rather than the settle.
 */
export function springEnvelope(
  { duration, bounce }: SpringCanonical,
  timeSeconds: number
): number {
  const naturalFrequency = TWO_PI / (duration / 1000)
  const dampingRatio = bounceToDampingRatio(bounce)
  const wt = naturalFrequency * timeSeconds

  if (dampingRatio < 1) {
    // |cos(x) + k sin(x)| <= sqrt(1 + k^2), and 1 + zeta^2/(1-zeta^2) = 1/(1-zeta^2)
    return Math.exp(-dampingRatio * wt) / Math.sqrt(1 - dampingRatio * dampingRatio)
  }

  if (dampingRatio === 1) {
    // the (1 + wt) polynomial factor decays far slower than the exponential
    // alone, so a pure e^(-wt) estimate lands roughly 8x short of the target
    return Math.exp(-wt) * (1 + wt)
  }

  const excess = Math.sqrt(dampingRatio * dampingRatio - 1)
  const rootA = naturalFrequency * (-dampingRatio + excess)
  const rootB = naturalFrequency * (-dampingRatio - excess)
  const span = rootB - rootA
  return (
    Math.abs(rootB / span) * Math.exp(rootA * timeSeconds) +
    Math.abs(rootA / span) * Math.exp(rootB * timeSeconds)
  )
}

/**
 * time in ms until the spring stays within `threshold` of its target.
 *
 * the default 0.5% is the practical settle point: tighter thresholds buy only
 * motion nobody can see while stretching transition-duration well past the
 * point the element looks finished, which delays every completion callback
 * hanging off it.
 *
 * css needs this and not `duration`: a `linear()` easing maps its samples
 * across transition-duration, so the transition has to be as long as the
 * motion actually lasts or the tail gets cut off mid-bounce.
 *
 * bisected rather than solved, because the critically damped envelope has no
 * elementary inverse and the underdamped and overdamped closed forms both go
 * singular as they approach it.
 */
/** how close to the target counts as settled */
export const SPRING_SETTLE_THRESHOLD: number = 0.005

export function springSettleTime(
  canonical: SpringCanonical,
  threshold: number = SPRING_SETTLE_THRESHOLD
): number {
  let high = canonical.duration / 1000
  for (
    let attempt = 0;
    attempt < 60 && springEnvelope(canonical, high) > threshold;
    attempt++
  ) {
    high *= 2
  }
  let low = 0
  for (let step = 0; step < 60; step++) {
    const mid = (low + high) / 2
    if (springEnvelope(canonical, mid) > threshold) low = mid
    else high = mid
  }
  return high * 1000
}

/**
 * a spring as a css `linear()` easing plus the transition-duration to run it
 * over, so springs work on the css driver with no javascript.
 *
 * `linear()` is Chrome 113+, Safari 17.2+, Firefox 112+.
 */
export function springToLinearEasing(
  canonical: SpringCanonical,
  sampleCount = 40
): { easing: string; durationMs: number } {
  const durationMs = springSettleTime(canonical)
  const samples: string[] = []
  for (let index = 0; index <= sampleCount; index++) {
    const progress = index / sampleCount
    const position = springPosition(canonical, (progress * durationMs) / 1000)
    // css tolerates values outside 0..1, which is exactly how overshoot reads
    samples.push(round(position))
  }
  // pin the endpoints: sampling error at the tail must never leave the
  // property short of its target value
  samples[0] = '0'
  samples[samples.length - 1] = '1'
  return { easing: `linear(${samples.join(', ')})`, durationMs }
}

function round(value: number): string {
  return String(Math.round(value * 10000) / 10000)
}
