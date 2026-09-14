import type { GenericFonts, GetStyleState, LanguageContextType, StyledDynamic, StyledDynamicEnv, StyledDynamicFn, StyledDynamicProp } from '../types';
export declare function getFontsForLanguage(fonts: GenericFonts, language: LanguageContextType): any;
export declare function isStyledDynamic(value: unknown): value is StyledDynamic;
/**
 * `styled.dynamic<T>()` declares a typed variant prop that is consumed by
 * styling (given style by a component `.resolve`). `styled.dynamic<T>(fn)`
 * maps the value to a style fragment; it is invoked per clause payload so
 * responsive/conditional values work, and the branded function stays callable
 * inside other dynamics or resolvers.
 */
export declare function styledDynamic<Val>(): StyledDynamicProp<Val>;
export declare function styledDynamic<Val>(fn: (value: Val, env: StyledDynamicEnv) => Record<string, any> | null | undefined): StyledDynamicFn<Val>;
/**
 * the env for `styled.dynamic` callbacks and `.resolve` resolvers: tokens,
 * theme, fonts, and the active font. Built once per style pass.
 */
export declare function getDynamicEnv(styleState: GetStyleState): StyledDynamicEnv;
//# sourceMappingURL=styledDynamic.d.ts.map