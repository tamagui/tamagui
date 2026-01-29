import type { AnimationConfig, NormalizedTransition, TransitionPropInput } from "./types";
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
export declare function normalizeTransition(transition: TransitionPropInput): NormalizedTransition;
/**
* Gets the animation key for a specific property from a normalized transition.
* Falls back to the default animation if no property-specific one is defined.
*
* @param normalized - The normalized transition object
* @param property - The property name to get animation for (e.g., 'x', 'opacity')
* @returns The animation key/config or null if none defined
*/
export declare function getAnimationForProperty(normalized: NormalizedTransition, property: string): string | AnimationConfig | null;
/**
* Checks if the normalized transition has any animations defined.
*/
export declare function hasAnimation(normalized: NormalizedTransition): boolean;
/**
* Gets all property names that have specific animations defined.
* Does not include 'default' in the list.
*/
export declare function getAnimatedProperties(normalized: NormalizedTransition): string[];
/**
* Gets the effective animation key based on the current animation state.
* Priority: enter/exit specific > default > null
*
* @param normalized - The normalized transition object
* @param state - The animation state: 'enter', 'exit', or 'default'
* @returns The effective animation key or null
*/
export declare function getEffectiveAnimation(normalized: NormalizedTransition, state: "enter" | "exit" | "default"): string | null;

//# sourceMappingURL=normalizeTransition.d.ts.map