import { GenericFont } from '@tamagui/core';
export declare const createInterFont: <A extends GenericFont<11 | 12 | 13 | 14 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 15 | 16>>(font?: { [Key in keyof Partial<A>]?: Partial<A[Key]> | undefined; }, { sizeLineHeight, sizeSize, }?: {
    sizeLineHeight?: ((fontSize: number) => number) | undefined;
    sizeSize?: ((size: number) => number) | undefined;
}) => GenericFont<keyof typeof defaultSizes>;
declare const defaultSizes: {
    readonly 1: 11;
    readonly 2: 12;
    readonly 3: 13;
    readonly 4: 14;
    readonly 5: 17;
    readonly 6: 18;
    readonly 7: 20;
    readonly 8: 23;
    readonly 9: 30;
    readonly 10: 45;
    readonly 11: 58;
    readonly 12: 64;
    readonly 13: 72;
    readonly 14: 92;
    readonly 15: 114;
    readonly 16: 134;
};
export {};
//# sourceMappingURL=index.d.ts.map