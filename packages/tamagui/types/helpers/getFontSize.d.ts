import { FontTokens, SizeTokens, Variable } from '@tamagui/core';
declare type GetFontSizeOpts = {
    relativeSize?: number;
    font?: FontTokens;
};
export declare const getFontSize: (inSize: SizeTokens | null | undefined, opts?: GetFontSizeOpts | undefined) => string | number;
export declare const getFontSizeVariable: (inSize: SizeTokens | null | undefined, opts?: GetFontSizeOpts | undefined) => number | `$${string}` | Variable | null | undefined;
export declare const getFontSizeToken: (inSize: SizeTokens | null | undefined, opts?: GetFontSizeOpts | undefined) => SizeTokens;
export {};
//# sourceMappingURL=getFontSize.d.ts.map