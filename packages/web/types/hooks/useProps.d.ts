import { SplitStyleProps, StaticConfig, ThemeParsed, UseMediaState } from '../types';
type UsePropsOptions = Pick<SplitStyleProps, 'noExpand' | 'noNormalize' | 'noClassNames' | 'resolveValues'> & {
    disableExpandShorthands?: boolean;
    forComponent?: {
        staticConfig: StaticConfig;
    };
};
type FlattenedProps<A> = {
    [Key in keyof A extends `$${string}` ? never : keyof A]?: A[Key];
};
/**
 * Returns props and style as a single object, expanding and merging shorthands and media queries.
 *
 * Use sparingly, it will loop props and trigger re-render on all media queries you access.
 *
 * */
export declare function useProps<A extends Object>(props: A, opts?: UsePropsOptions): FlattenedProps<A>;
/**
 * Returns only style values fully resolved and flattened with merged media queries and shorthands with all theme and token values resolved.
 *
 * Use sparingly, it will loop props and trigger re-render on all media queries you access.
 *
 * */
export declare function useStyle<A extends Object>(props: A, opts?: UsePropsOptions): FlattenedProps<A>;
/**
 * Returns [props, styles] fully resolved and flattened with merged media queries and shorthands with all theme and token values resolved.
 *
 * Use sparingly, it will loop props and trigger re-render on all media queries you access.
 *
 * */
export declare function usePropsAndStyle<A extends Object>(props: A, opts?: UsePropsOptions): [FlattenedProps<A>, FlattenedProps<A>, ThemeParsed, UseMediaState];
export {};
//# sourceMappingURL=useProps.d.ts.map