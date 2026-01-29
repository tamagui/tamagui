import { type AnimationDriver } from "@tamagui/core";
import { type WithSpringConfig, type WithTimingConfig } from "react-native-reanimated";
/** Spring animation configuration */
type SpringConfig = {
	type?: "spring";
	delay?: number;
} & Partial<WithSpringConfig>;
/** Timing animation configuration */
type TimingConfig = {
	type: "timing";
	delay?: number;
} & Partial<WithTimingConfig>;
/** Combined animation configuration type */
export type TransitionConfig = SpringConfig | TimingConfig;
/** Options for createAnimations (reserved for future use) */
export type CreateAnimationsOptions = {};
/**
* Create a Reanimated-based animation driver for Tamagui.
*
* This is a native Reanimated implementation without Moti dependency.
* It provides smooth spring and timing animations with full support for:
* - Per-property animation configurations
* - Exit animations with proper completion callbacks
* - Dynamic theme value resolution
* - Transform property animations
* - avoidReRenders optimization for hover/press/focus states
*
* @example
* ```tsx
* const animations = createAnimations({
*   fast: { type: 'spring', damping: 20, stiffness: 250 },
*   slow: { type: 'timing', duration: 500 },
* })
*
* ```
*/
export declare function createAnimations<A extends Record<string, TransitionConfig>>(animationsConfig: A): AnimationDriver<A>;
export {};

//# sourceMappingURL=createAnimations.d.ts.map