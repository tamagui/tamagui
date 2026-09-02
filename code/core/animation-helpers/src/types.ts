/**
 * One entry in a driver's `animations` config, and the same type for all four
 * drivers: a config written once resolves to the same motion on css,
 * reanimated, motion, and react-native.
 *
 * The canonical spelling is `{ duration, bounce }`. `duration` is the spring's
 * undamped period, the "how fast does this feel" number, and `bounce` is 0 for
 * critically damped, up toward 1 for loose and oscillating, negative for
 * sluggish. A css string is a timing; `{ type: 'timing' }` is the object
 * spelling of one. `stiffness`/`damping`/`mass` stay available for a config
 * that was already tuned against them.
 */
export type PresetConfig =
  | string
  | {
      type?: 'spring'
      duration?: number
      bounce?: number
      stiffness?: number
      damping?: number
      mass?: number
      velocity?: number
      overshootClamping?: boolean
      restDisplacementThreshold?: number
      restSpeedThreshold?: number
    }
  | {
      type: 'timing'
      duration: number
      /** any css timing function */
      easing?: string
    }

/** the `animations` object a driver is created with */
export type AnimationsConfig = Record<string, PresetConfig>

/**
 * A resolved animation config in a driver's own terms. Drivers build these
 * from a `ResolvedEntry`; nothing parses one.
 */
export type AnimationConfig = {
  type?: string
  [key: string]: any
}

/**
 * Input format for the `transition` prop: a CSS transition string, a preset
 * name, or a config object. See `@tamagui/style-grammar/transitions`.
 *
 * Note: uses `any` to stay compatible with the `TransitionProp` type from
 * `@tamagui/web`, which carries the full style-key union.
 */
export type TransitionPropInput = any
