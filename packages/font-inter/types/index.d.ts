import { GenericFont } from '@tamagui/core';
export declare const createInterFont: <A extends GenericFont<12 | 13 | 14 | 16 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 15>>(font?: { [Key in keyof Partial<A>]?: Partial<A[Key]> | undefined; }, { sizeLineHeight, }?: {
    sizeLineHeight?: ((fontSize: number) => number) | undefined;
}) => GenericFont<keyof typeof defaultSizes>;
declare const defaultSizes: {
    readonly 1: 12;
    readonly 2: 13;
    readonly 3: 14;
    readonly 4: 16;
    readonly 5: 18;
    readonly 6: 19;
    readonly 7: 21;
    readonly 8: 26;
    readonly 9: 32;
    readonly 10: 45;
    readonly 11: 58;
    readonly 12: 64;
    readonly 13: 76;
    readonly 14: 102;
    readonly 15: 124;
    readonly 16: 144;
};
export {};
//# sourceMappingURL=index.d.ts.map