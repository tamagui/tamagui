/**
 * Animation configuration that can include additional properties
 * like delay, duration, stiffness, damping, etc.
 */
export type AnimationConfig = {
  type?: string
  [key: string]: any
}

/**
 * Input format for the transition prop - supports multiple syntaxes:
 *
 * 1. String: "bouncy"
 * 2. Object with property mappings: { x: 'quick', y: 'bouncy', default: 'slow' }
 * 3. Array with config: ['bouncy', { delay: 100, x: 'quick' }]
 *
 * Note: Uses `any` to be compatible with the TransitionProp type from @tamagui/web
 * which has more complex union types.
 */
export type TransitionPropInput = any

/**
 * Normalized output format that all animation drivers consume.
 * Provides a consistent structure regardless of input format.
 */
export type NormalizedTransition = {
  /** Default animation key for properties not explicitly listed */
  default: string | null
  /** Global delay in ms */
  delay: number | undefined
  /** Per-property animation configs: propertyName -> animationKey or config */
  properties: Record<string, string | AnimationConfig>
}
