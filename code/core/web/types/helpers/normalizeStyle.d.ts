/**
 * This is what you want to run before Object.assign() a style onto another.
 * It does the following:
 *   1. Shorthands into longhands, px = paddingHorizontal
 *   2. Expands flex, borderColor and other properties that can expand into sub-parts
 *   3. Normalizes all sub pseudo-media-etc styles
 */
export declare function normalizeStyle(style: Record<string, any>, disableNormalize?: boolean): Record<string, any>;
//# sourceMappingURL=normalizeStyle.d.ts.map