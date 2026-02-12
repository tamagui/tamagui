import type { GetStyleState, SplitStyleProps } from '../types';
/**
 * resolves embedded $tokens in compound CSS string values like
 * boxShadow, textShadow, filter, backgroundImage, border, outline.
 *
 * returns the original value unchanged if no resolution is needed.
 */
export declare function resolveCompoundTokens(key: string, value: string, styleProps: SplitStyleProps, styleState: Partial<GetStyleState>): any;
//# sourceMappingURL=resolveCompoundTokens.d.ts.map