import { FontSizeTokens, FontTokens } from '@tamagui/core';
declare type GetFontSizeOpts = {
    relativeSize?: number;
    font?: FontTokens;
};
export declare const getFontSize: (inSize: FontSizeTokens | null | undefined, opts?: GetFontSizeOpts | undefined) => number;
export declare const getFontSizeVariable: (inSize: FontSizeTokens | null | undefined, opts?: GetFontSizeOpts | undefined) => number | import("@tamagui/core").Variable | `$${string}` | null | undefined;
export declare const getFontSizeToken: (inSize: FontSizeTokens | null | undefined, opts?: GetFontSizeOpts | undefined) => FontSizeTokens | null;
export {};
//# sourceMappingURL=getFontSize.d.ts.map