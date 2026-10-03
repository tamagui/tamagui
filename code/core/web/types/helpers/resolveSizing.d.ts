import type { ComponentSize, Font, GenericSizing, TamaguiConfig, TokensParsed } from '../types';
/** the env slice resolveSizing reads: a styled.dynamic env or hand-built */
export type SizingEnv = {
    sizing: GenericSizing;
    fonts: TamaguiConfig['fonts'];
    tokens: TokensParsed;
    font?: Font;
};
/**
 * the default control ladder, transcribed from the Button frame/text tables
 * so the derived px are identical by construction. v6 re-exports this;
 * resolveSizing falls back to it when a config carries no `sizing`.
 */
export declare const defaultSizing: {
    readonly default: 'md';
    readonly sizes: {
        readonly xs: {
            readonly fontSize: 'xs';
            readonly controlFontSize: 'xs';
            readonly paddingInline: '2';
            readonly paddingBlock: '1';
            readonly gap: '1';
            readonly radius: 'sm';
        };
        readonly sm: {
            readonly fontSize: 'sm';
            readonly controlFontSize: 'sm';
            readonly paddingInline: '3';
            readonly paddingBlock: '1.5';
            readonly gap: '1.5';
            readonly radius: 'md';
        };
        readonly md: {
            readonly fontSize: 'sm';
            readonly controlFontSize: 'base';
            readonly paddingInline: '4';
            readonly paddingBlock: '2';
            readonly gap: '2';
            readonly radius: 'md';
        };
        readonly lg: {
            readonly fontSize: 'base';
            readonly controlFontSize: 'lg';
            readonly paddingInline: '6';
            readonly paddingBlock: '2';
            readonly gap: '2';
            readonly radius: 'md';
        };
        readonly xl: {
            readonly fontSize: 'lg';
            readonly controlFontSize: 'xl';
            readonly paddingInline: '8';
            readonly paddingBlock: '2.5';
            readonly gap: '2.5';
            readonly radius: 'lg';
        };
    };
};
/** a rung resolved: token keys stay keys, geometry is px */
export type ResolvedSizing = {
    /** the rung that rendered (degrades to the default in production) */
    name: string;
    fontSize: string;
    lineHeight: string;
    paddingInline: string;
    paddingBlock: string;
    gap: string;
    radius: string;
    /** text line box plus vertical padding, before any border */
    height: number;
    /** icon px for the rung */
    icon: number;
    /** the square controls: checkbox box, radio circle, switch track height */
    square: number;
};
/**
 * a size name -> its rung resolved to pixels, against the sizing in `env`.
 * `true`/absent resolve to the default rung, `false` to no styles. Without
 * an env (plain render code, no styled.dynamic callback) it reads the active
 * config and default font: a sync global read, not a subscription, so static
 * sizes never re-render on media or theme changes. Unknown names resolve to
 * no styles, exactly like a miss in the old static tables: numeric sizes and
 * cascaded values pass through variants that do not know them, and must never
 * throw. A rung pointing at missing tokens is a broken config: it warns in
 * development and resolves to no styles.
 */
export declare function resolveSizing(size: false, env?: SizingEnv): undefined;
export declare function resolveSizing(size: ComponentSize | true | undefined, env?: SizingEnv): ResolvedSizing;
export declare function resolveSizing(size: ComponentSize | boolean | undefined, env?: SizingEnv): ResolvedSizing | undefined;
//# sourceMappingURL=resolveSizing.d.ts.map