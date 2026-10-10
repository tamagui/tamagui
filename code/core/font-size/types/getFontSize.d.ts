import type { FontSizeTokens, FontTokens, Variable } from "@tamagui/core";
type GetFontSizeOpts = {
	relativeSize?: number;
	font?: FontTokens;
};
export declare const getFontSize: (inSize: FontSizeTokens | true | null | undefined, opts?: GetFontSizeOpts) => number;
export declare const getFontSizeVariable: (inSize: FontSizeTokens | true | null | undefined, opts?: GetFontSizeOpts) => FontSizeTokens | Variable<string> | null | undefined;
export declare const getFontSizeToken: (inSize: FontSizeTokens | true | null | undefined, opts?: GetFontSizeOpts) => FontSizeTokens | null;
export {};

//# sourceMappingURL=getFontSize.d.ts.map