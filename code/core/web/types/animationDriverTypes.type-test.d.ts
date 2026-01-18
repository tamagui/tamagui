/**
 * Type tests for animatedBy prop and animation driver configuration.
 *
 * These tests ensure type-safe inference for:
 * 1. Single animation driver config
 * 2. Multiple animation drivers config
 * 3. TypeOverride for lazy-loaded drivers
 * 4. Combination scenarios
 *
 * Run with: yarn test:types
 */
export {};
/**
 * SUMMARY OF APPLIED TYPE FIXES:
 *
 * 1. CreateTamaguiConfig (line ~737):
 *    FIXED: Changed from `animations: AnimationDriver<E>`
 *    To: `animations: AnimationDriver<E> | AnimationsConfigObject`
 *    This preserves the multi-driver object shape for type inference.
 *
 * 2. AnimationDriverKeys (line ~888-895):
 *    FIXED: Changed from conditional (inferred OR override)
 *    To: Union of all sources:
 *      | 'default'
 *      | InferredAnimationDriverKeys
 *      | (TypeOverride extends 1 ? never : TypeOverride)
 *    This ensures both config-defined AND lazy-loaded drivers are available.
 *
 * 3. InferredAnimationDriverKeys (line 879-886):
 *    No changes needed - works correctly with the above fixes.
 *    Properly infers 'default' for single driver and keyof for multi-driver.
 *
 * 4. TransitionKeys (line 868-876):
 *    No changes needed - already handles both single and multi-driver cases.
 *    Uses default driver's config for animation names.
 */
//# sourceMappingURL=animationDriverTypes.type-test.d.ts.map