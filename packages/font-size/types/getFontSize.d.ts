import { FontSizeTokens, FontTokens } from '@tamagui/core';
declare type GetFontSizeOpts = {
    relativeSize?: number;
    font?: FontTokens;
};
export declare const getFontSize: (inSize: FontSizeTokens | null | undefined, opts?: GetFontSizeOpts) => number;
export declare const getFontSizeVariable: (inSize: FontSizeTokens | null | undefined, opts?: GetFontSizeOpts) => number | `$${string}` | import("@tamagui/core").Variable<import("@tamagui/core").VariableValue> | null | undefined;
export declare const getFontSizeToken: (inSize: FontSizeTokens | null | undefined, opts?: GetFontSizeOpts) => FontSizeTokens | null;
export {};
//# sourceMappingURL=getFontSize.d.ts.map