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
declare type StringRecord = Record<string, string>;
export declare const mergeProps: (a: Object, b: Object, leaveOutClassNames?: boolean, inverseShorthands?: StringRecord) => readonly [StringRecord, StringRecord];
export {};
//# sourceMappingURL=mergeProps.d.ts.map