/**
 * Preserves prop ordering, so that the order most closely matches the last spread objects
 * Useful for having { ...defaultProps, ...props } that ensure props ordering is always kept
 *
 *    Given:
 *      mergeProps({ a: 1, b: 2 }, { b: 1, a: 2 })
 *    The final key order will be:
 *      b, a
 *
 */
export type GenericProps = Record<string, any>;
export declare const mergeProps: (a: Object, b?: Object) => GenericProps;
export declare const mergeComponentProps: (defaultProps: Object | null | undefined, contextProps: Object | undefined, props: Object) => readonly [Object, null] | readonly [GenericProps, GenericProps | null];
//# sourceMappingURL=mergeProps.d.ts.map