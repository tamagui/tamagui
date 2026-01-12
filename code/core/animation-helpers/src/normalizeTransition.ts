import type {
  AnimationConfig,
  NormalizedTransition,
  TransitionPropInput,
} from './types'

/**
 * Normalizes the various transition prop formats into a consistent structure.
 *
 * Supported input formats:
 * - String: "bouncy" -> { default: "bouncy", properties: {} }
 * - Object: { x: 'quick', default: 'slow' } -> { default: "slow", properties: { x: "quick" } }
 * - Array: ['bouncy', { delay: 100, x: 'quick' }] -> { default: "bouncy", delay: 100, properties: { x: "quick" } }
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
      delay: undefined,
      properties: {},
    }
  }

  // String format: "bouncy"
  if (typeof transition === 'string') {
    return {
      default: transition,
      delay: undefined,
      properties: {},
    }
  }

  // Array format: ['bouncy', { delay: 100, x: 'quick' }]
  if (Array.isArray(transition)) {
    const [defaultAnimation, config] = transition
    const properties: Record<string, string | AnimationConfig> = {}
    let delay: number | undefined

    if (config && typeof config === 'object') {
      for (const [key, value] of Object.entries(config)) {
        if (key === 'delay' && typeof value === 'number') {
          delay = value
        } else if (value !== undefined) {
          // Property-specific animation: string or config object
          properties[key] = value as string | AnimationConfig
        }
      }
    }

    return {
      default: defaultAnimation,
      delay,
      properties,
    }
  }

  // Object format: { x: 'quick', y: 'bouncy', default: 'slow' }
  if (typeof transition === 'object') {
    const properties: Record<string, string | AnimationConfig> = {}
    let defaultAnimation: string | null = null

    for (const [key, value] of Object.entries(transition)) {
      if (key === 'default' && typeof value === 'string') {
        defaultAnimation = value
      } else if (value !== undefined) {
        // Property-specific animation: string or config object
        properties[key] = value as string | AnimationConfig
      }
    }

    return {
      default: defaultAnimation,
      delay: undefined,
      properties,
    }
  }

  // Fallback
  return {
    default: null,
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
    Object.keys(normalized.properties).length > 0
  )
}

/**
 * Gets all property names that have specific animations defined.
 * Does not include 'default' in the list.
 */
export function getAnimatedProperties(
  normalized: NormalizedTransition
): string[] {
  return Object.keys(normalized.properties)
}
