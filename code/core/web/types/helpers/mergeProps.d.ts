/**
 * Preserves prop ordering, so that the order most closely matches the last spread objects
 * Useful for having { ...defaultProps, ...props } that ensure props ordering is always kept
 *
 * Honestly this is somehwat backwards logically from Object.assign, reason was that we typically
 * are merging defaultProps, givenProps, but we started using it elsewhere and now its a bit confusing
 * Should look into refactoring this to match common usage
 *
 * Merges sub-objects if they start are pseudo-keys or media-key-like (start with "$")
 *
 *    Given:
 *      mergeProps({ a: 1, b: 2 }, { b: 1, a: 2 })
 *    The final key order will be:
 *      b, a
 *
 */
export type GenericProps = Record<string, any>;
export declare const mergeProps: (defaultProps: Object, props: Object) => GenericProps;
export declare const mergeComponentProps: (defaultProps: Object | null | undefined, contextProps: Object | undefined, props: Object) => readonly [Object, null] | readonly [GenericProps, GenericProps | null];
//# sourceMappingURL=mergeProps.d.ts.map