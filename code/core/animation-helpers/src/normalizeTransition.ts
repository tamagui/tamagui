import type {
  AnimationConfig,
  NormalizedTransition,
  SpringConfig,
  TransitionPropInput,
} from './types'

/**
 * Spring config keys that should be extracted as global overrides.
 * Using Set for O(1) lookup performance.
 */
const SPRING_CONFIG_KEYS: Set<string> = new Set([
  'stiffness',
  'damping',
  'mass',
  'tension',
  'friction',
  'velocity',
  'overshootClamping',
  'duration',
  'bounciness',
  'speed',
])

/**
 * Check if a key is a spring config parameter
 */
function isSpringConfigKey(key: string): key is keyof SpringConfig {
  return SPRING_CONFIG_KEYS.has(key)
}

/**
 * Normalizes the various transition prop formats into a consistent structure.
 *
 * Supported input formats:
 * - String: "bouncy" -> { default: "bouncy", enter: null, exit: null, properties: {} }
 * - Object: { x: 'quick', default: 'slow' } -> { default: "slow", enter: null, exit: null, properties: { x: "quick" } }
 * - Object with enter/exit: { enter: 'bouncy', exit: 'quick' } -> { default: null, enter: "bouncy", exit: "quick", properties: {} }
 * - Array: ['bouncy', { delay: 100, x: 'quick' }] -> { default: "bouncy", enter: null, exit: null, delay: 100, properties: { x: "quick" } }
 *
 * @param transition - The transition prop value in any supported format
 * @returns Normalized transition object with consistent structure
 */
export function normalizeTransition(
  transition: TransitionPropInput
): NormalizedTransition {
  // Handle null/undefined
  if (!transition) {
    return {
      default: null,
      enter: null,
      exit: null,
      delay: undefined,
      properties: {},
    }
  }

  // String format: "bouncy"
  if (typeof transition === 'string') {
    return {
      default: transition,
      enter: null,
      exit: null,
      delay: undefined,
      properties: {},
    }
  }

  // Array format: ['bouncy', { delay: 100, x: 'quick', enter: 'slow', exit: 'fast' }]
  // Also supports spring config overrides: ['bouncy', { stiffness: 1000, damping: 70 }]
  if (Array.isArray(transition)) {
    const [defaultAnimation, configObj] = transition
    const properties: Record<string, string | AnimationConfig> = {}
    const springConfig: SpringConfig = {}
    let delay: number | undefined
    let enter: string | null = null
    let exit: string | null = null

    if (configObj && typeof configObj === 'object') {
      for (const [key, value] of Object.entries(configObj)) {
        if (key === 'delay' && typeof value === 'number') {
          delay = value
        } else if (key === 'enter' && typeof value === 'string') {
          enter = value
        } else if (key === 'exit' && typeof value === 'string') {
          exit = value
        } else if (isSpringConfigKey(key) && value !== undefined) {
          // Spring config override: { stiffness: 1000, damping: 70 }
          springConfig[key] = value as SpringConfig[keyof SpringConfig]
        } else if (value !== undefined) {
          // Property-specific animation: string or config object
          properties[key] = value as string | AnimationConfig
        }
      }
    }

    return {
      default: defaultAnimation,
      enter,
      exit,
      delay,
      properties,
      config: Object.keys(springConfig).length > 0 ? springConfig : undefined,
    }
  }

  // Object format: { x: 'quick', y: 'bouncy', default: 'slow', enter: 'bouncy', exit: 'quick' }
  // Also supports spring config overrides: { default: 'bouncy', stiffness: 1000 }
  if (typeof transition === 'object') {
    const properties: Record<string, string | AnimationConfig> = {}
    const springConfig: SpringConfig = {}
    let defaultAnimation: string | null = null
    let enter: string | null = null
    let exit: string | null = null
    let delay: number | undefined

    for (const [key, value] of Object.entries(transition)) {
      if (key === 'default' && typeof value === 'string') {
        defaultAnimation = value
      } else if (key === 'enter' && typeof value === 'string') {
        enter = value
      } else if (key === 'exit' && typeof value === 'string') {
        exit = value
      } else if (key === 'delay' && typeof value === 'number') {
        delay = value
      } else if (isSpringConfigKey(key) && value !== undefined) {
        // Spring config override: { stiffness: 1000, damping: 70 }
        springConfig[key] = value as SpringConfig[keyof SpringConfig]
      } else if (value !== undefined) {
        // Property-specific animation: string or config object
        properties[key] = value as string | AnimationConfig
      }
    }

    return {
      default: defaultAnimation,
      enter,
      exit,
      delay,
      properties,
      config: Object.keys(springConfig).length > 0 ? springConfig : undefined,
    }
  }

  // Fallback
  return {
    default: null,
    enter: null,
    exit: null,
    delay: undefined,
    properties: {},
  }
}

/**
 * Gets the animation key for a specific property from a normalized transition.
 * Falls back to the default animation if no property-specific one is defined.
 *
 * @param normalized - The normalized transition object
 * @param property - The property name to get animation for (e.g., 'x', 'opacity')
 * @returns The animation key/config or null if none defined
 */
export function getAnimationForProperty(
  normalized: NormalizedTransition,
  property: string
): string | AnimationConfig | null {
  // Check for property-specific animation
  const propertyAnimation = normalized.properties[property]
  if (propertyAnimation !== undefined) {
    return propertyAnimation
  }

  // Fall back to default
  return normalized.default
}

/**
 * Checks if the normalized transition has any animations defined.
 */
export function hasAnimation(normalized: NormalizedTransition): boolean {
  return (
    normalized.default !== null ||
    normalized.enter !== null ||
    normalized.exit !== null ||
    Object.keys(normalized.properties).length > 0
  )
}

/**
 * Gets all property names that have specific animations defined.
 * Does not include 'default' in the list.
 */
export function getAnimatedProperties(normalized: NormalizedTransition): string[] {
  return Object.keys(normalized.properties)
}

/**
 * Gets the effective animation key based on the current animation state.
 * Priority: enter/exit specific > default > null
 *
 * @param normalized - The normalized transition object
 * @param state - The animation state: 'enter', 'exit', or 'default'
 * @returns The effective animation key or null
 */
export function getEffectiveAnimation(
  normalized: NormalizedTransition,
  state: 'enter' | 'exit' | 'default'
): string | null {
  if (state === 'enter' && normalized.enter) {
    return normalized.enter
  }
  if (state === 'exit' && normalized.exit) {
    return normalized.exit
  }
  return normalized.default
}
