import type { CreateTokens, Variable, VariableVal } from './types';
/**
 * Tokens are flat and mirror css custom properties: `space-1`, `radius-sm`,
 * `color-red`. The leading segment is the category, which is how a style prop
 * finds its default token: `borderRadius="sm"` resolves `radius-sm`, because
 * borderRadius maps to the radius category. Any other name resolves literally,
 * so `borderRadius="brand-card"` just works with no category registration.
 */
export declare function createTokens<T extends CreateTokens>(tokens: T): MakeTokens<T>;
/**
 * The css variable name for a token. Colors get the short `--c-` prefix because
 * they are by far the most numerous; everything else is `--t-`.
 */
export declare function tokenVariableName(key: string): string;
export declare function createTokenVariables(tokens: Record<string, VariableVal | Variable>): Record<string, Variable>;
type MakeTokens<T extends CreateTokens> = {
    [Key in keyof T as Key extends number ? `${Key}` : Key]: Variable<T[Key]>;
};
/**
 * The tokens in one category, keyed without the prefix. For the few places that
 * genuinely iterate a single category: the font-size fallback, the config
 * revision snapshot, and css variable output.
 */
export declare function getTokensInCategory(tokens: Record<string, Variable>, category: string): Record<string, Variable>;
/**
 * Prefixes a scale into flat token names: `prefixTokens('space', { 1: 4 })` gives
 * `{ 'space-1': 4 }`. The inverse of `getTokensInCategory`, for composing a flat
 * token record out of a scale you already have.
 */
export type PrefixedTokens<Prefix extends string, Scale> = {
    [Key in keyof Scale & string as `${Prefix}-${Key}`]: Scale[Key];
};
export declare function prefixTokens<Prefix extends string, Scale extends Record<string, any>>(prefix: Prefix, scale: Scale): PrefixedTokens<Prefix, Scale>;
export {};
//# sourceMappingURL=createTokens.d.ts.map