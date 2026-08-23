/**
 * Preserves prop ordering, so that the order most closely matches the last spread objects
 * Useful for having { ...defaultProps, ...props } that ensure props ordering is always kept
 *
 * Honestly this is somehwat backwards logically from Object.assign, reason was that we typically
 * are merging defaultProps, givenProps, but we started using it elsewhere and now its a bit confusing
 * Should look into refactoring this to match common usage
 *
 *    Given:
 *      mergeProps({ a: 1, b: 2 }, { b: 1, a: 2 })
 *    The final key order will be:
 *      b, a
 *
 */
export type GenericProps = Record<string, any>;
export declare const mergeProps: (defaultProps: object, props: object) => GenericProps;
export declare function readMergedProp(caller: Record<string, any>, context: Record<string, any> | undefined, defaults: Record<string, any> | undefined, key: string): any;
export declare function getOverriddenContextProps(caller: Record<string, any>, context: Record<string, any> | undefined): GenericProps | null;
//# sourceMappingURL=mergeProps.d.ts.map