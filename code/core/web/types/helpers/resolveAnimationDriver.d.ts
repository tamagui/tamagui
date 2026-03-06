import type { AnimationDriver } from '../types';
/**
 * Resolves a value that might be an AnimationDriver or a multi-driver config object
 * like { default: motionDriver, css: cssDriver } into an actual AnimationDriver.
 */
export declare function resolveAnimationDriver(driver: AnimationDriver | Record<string, AnimationDriver> | null | undefined): AnimationDriver | null;
//# sourceMappingURL=resolveAnimationDriver.d.ts.map