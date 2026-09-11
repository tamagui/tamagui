import type { AnimationsConfig } from './types'

/**
 * The shipped animation presets, defined once for every driver.
 *
 * Before v3 each driver carried its own hand-tuned table, so `bouncy` was a
 * 350ms cubic-bezier on the web, a stiffness-120 spring on react-native, and a
 * stiffness-90 spring on motion. Three different motions under one name.
 *
 * They are springs in the canonical pair instead:
 *
 * - `duration` is the spring's undamped period, which is what "how fast does
 *   this feel" actually means. It is not a stopwatch: a bouncy spring keeps
 *   ringing past it, which is the point of a bouncy spring.
 * - `bounce` is 0 for critically damped (fast, no overshoot), up toward 1 for
 *   loose and oscillating, and negative for sluggish.
 *
 * On the web these compile to a `linear()` easing that traces the real spring
 * curve, overshoot included, with no javascript running.
 *
 * There are no `'200ms'`-style presets any more. A duration is CSS now, so
 * `transition="200ms"` and `transition="200ms ease-out"` work directly and
 * need nothing configured. Keep your own table small for the same reason:
 * a name is worth having only when it means something a duration cannot say.
 */
export const animationPresets = {
  quickest: { duration: 120, bounce: 0.2 },
  quickestLessBouncy: { duration: 120, bounce: 0 },
  quicker: { duration: 160, bounce: 0.25 },
  quickerLessBouncy: { duration: 160, bounce: 0 },
  quick: { duration: 220, bounce: 0.3 },
  quickLessBouncy: { duration: 220, bounce: 0 },
  medium: { duration: 300, bounce: 0.15 },
  slow: { duration: 450, bounce: 0.1 },
  slowest: { duration: 700, bounce: 0.1 },
  lazy: { duration: 500, bounce: -0.2 },
  superLazy: { duration: 800, bounce: -0.3 },
  bouncy: { duration: 400, bounce: 0.5 },
  superBouncy: { duration: 400, bounce: 0.75 },
} as const satisfies AnimationsConfig
