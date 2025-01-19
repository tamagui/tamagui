/**
 * Preserves prop ordering, so that the order most closely matches the last spread objects
 * Useful for having { ...defaultProps, ...props } that ensure props ordering is always kept
 *
 *    Given:
 *      mergeProps({ a: 1, b: 2 }, { b: 1, a: 2 })
 *    The final key order will be:
 *      b, a
 *
 * Handles a couple special tamagui cases
 *   - classNames can be extracted out separately
 *   - shorthands can be expanded before merging
 */
type AnyRecord = Record<string, any>;
export declare const mergeProps: (a: Object, b?: Object, inverseShorthands?: AnyRecord) => AnyRecord;
export {};
//# sourceMappingURL=mergeProps.d.ts.map