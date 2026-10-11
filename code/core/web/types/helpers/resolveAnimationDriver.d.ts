import type { AnimationDriverLike } from '../types';
/**
 * Resolves a value that might be an animation driver or a multi-driver config
 * object like { default: motionDriver, css: cssDriver } into a driver.
 */
export declare function resolveAnimationDriver(driver: AnimationDriverLike | Record<string, AnimationDriverLike> | null | undefined): AnimationDriverLike | null;
//# sourceMappingURL=resolveAnimationDriver.d.ts.map