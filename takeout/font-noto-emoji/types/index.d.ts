import { GenericFont } from '@tamagui/core';
export declare const createNotoFont: <A extends GenericFont<11 | 12 | 13 | 14 | 16 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 15>>(font?: { [Key in keyof Partial<A>]?: Partial<A[Key]> | undefined; }, { sizeLineHeight, sizeSize, webFallbackFonts, }?: {
    sizeLineHeight?: ((fontSize: number) => number) | undefined;
    sizeSize?: ((size: number) => number) | undefined;
    webFallbackFonts?: string[] | undefined;
}) => GenericFont<keyof typeof defaultSizes>;
declare const defaultSizes: {
    readonly 1: 11;
    readonly 2: 12;
    readonly 3: 13;
    readonly 4: 14;
    readonly 5: 16;
    readonly 6: 18;
    readonly 7: 20;
    readonly 8: 24;
    readonly 9: 30;
    readonly 10: 42;
    readonly 11: 54;
    readonly 12: 64;
    readonly 13: 74;
    readonly 14: 80;
    readonly 15: 110;
    readonly 16: 126;
};
export {};
//# sourceMappingURL=index.d.ts.map