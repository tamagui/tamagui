/**
 * This is what you want to run before Object.assign() a style onto another.
 * It does the following:
 *   1. Turns user shorthands into longhands, ie px = paddingHorizontal
 *   2. Normalizes various inconsistent styles to be more consistent
 *   3. Expands react-native shorthands, ie paddingHorizontal => paddingLeft, paddingRight
 */
export declare function expandStylesAndRemoveNullishValues(style: Record<string, any>, disableNormalize?: boolean): Record<string, any>;
//# sourceMappingURL=expandStylesAndRemoveNullishValues.d.ts.map