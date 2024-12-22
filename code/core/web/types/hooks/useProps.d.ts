import type { SplitStyleProps, StaticConfig, ThemeParsed, UseMediaState } from '../types';
import type { ViewProps, ViewStyle } from '../views/View';
type UsePropsOptions = Pick<SplitStyleProps, 'noExpand' | 'noNormalize' | 'noClass' | 'resolveValues'> & {
    disableExpandShorthands?: boolean;
    forComponent?: {
        staticConfig: StaticConfig;
    };
    noClass?: boolean;
};
export type PropsWithoutMediaStyles<A> = {
    [Key in keyof A extends `$${string}` ? never : keyof A]?: A[Key];
};
type PropsLikeObject = (ViewProps & Record<string, any>) | Object;
type StyleLikeObject = (ViewStyle & Record<string, any>) | Object;
/**
 * Returns props and style as a single object, expanding and merging shorthands and media queries.
 *
 * Use sparingly, it will loop props and trigger re-render on all media queries you access.
 *
 * */
export declare function useProps<A extends PropsLikeObject>(props: A, opts?: UsePropsOptions): PropsWithoutMediaStyles<A>;
/**
 * Returns only style values fully resolved and flattened with merged media queries and shorthands with all theme and token values resolved.
 *
 * Use sparingly, it will loop props and trigger re-render on all media queries you access.
 *
 * */
export declare function useStyle<A extends StyleLikeObject>(props: A, opts?: UsePropsOptions): PropsWithoutMediaStyles<A>;
/**
 * Returns [props, styles, theme, media] fully resolved and flattened with merged media queries and shorthands with all theme and token values resolved.
 *
 * Use sparingly, it will loop props and trigger re-render on all media queries you access.
 *
 * */
export declare function usePropsAndStyle<A extends PropsLikeObject>(props: A, opts?: UsePropsOptions): [PropsWithoutMediaStyles<A>, PropsWithoutMediaStyles<A>, ThemeParsed, UseMediaState];
export {};
//# sourceMappingURL=useProps.d.ts.map