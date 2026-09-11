/**
 * This is what you want to run before Object.assign() a style onto another.
 * It does the following:
 *   1. Shorthands into longhands, px = paddingHorizontal
 *   2. Expands flex, borderColor and other properties that can expand into sub-parts
 *   3. Preserves original-value provenance across expanded longhands
 */
export declare function normalizeStyle(style: Record<string, any>, disableNormalize?: boolean, mergeTransforms?: boolean): Record<string, any>;
//# sourceMappingURL=normalizeStyle.d.ts.map