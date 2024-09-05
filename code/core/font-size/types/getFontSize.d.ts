import type { FontSizeTokens, FontTokens } from '@tamagui/core';
type GetFontSizeOpts = {
    relativeSize?: number;
    font?: FontTokens;
};
export declare const getFontSize: (inSize: FontSizeTokens | null | undefined, opts?: GetFontSizeOpts) => number;
export declare const getFontSizeVariable: (inSize: FontSizeTokens | null | undefined, opts?: GetFontSizeOpts) => number | `$${string}` | import("@tamagui/core").Variable<any> | null | undefined;
export declare const getFontSizeToken: (inSize: FontSizeTokens | null | undefined, opts?: GetFontSizeOpts) => FontSizeTokens | null;
export {};
//# sourceMappingURL=getFontSize.d.ts.map