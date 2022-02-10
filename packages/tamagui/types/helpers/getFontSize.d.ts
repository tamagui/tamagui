import { FontTokens, SizeTokens } from '@tamagui/core';
declare type GetFontSizeOpts = {
    relativeSize?: number;
    font?: FontTokens;
};
export declare const getFontSize: (inSize: SizeTokens | null | undefined, opts?: GetFontSizeOpts | undefined) => number;
export declare const getFontSizeVariable: (inSize: SizeTokens | null | undefined, opts?: GetFontSizeOpts | undefined) => number | `$${string}` | import("@tamagui/core").Variable | null | undefined;
export declare const getFontSizeToken: (inSize: SizeTokens | null | undefined, opts?: GetFontSizeOpts | undefined) => SizeTokens;
export {};
//# sourceMappingURL=getFontSize.d.ts.map