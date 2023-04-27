/**
 * Will flatten any media styles down + expand all shorthands.
 *
 * Use sparingly, it will loop props and trigger re-render on all media queries.
 *
 * */
export declare function useProps<A extends Object>(props: A, opts?: {
    disableExpandShorthands?: boolean;
}): {
    [Key in keyof A extends `$${string}` ? never : keyof A]?: A[Key];
};
//# sourceMappingURL=useProps.d.ts.map