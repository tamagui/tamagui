import { GenericFont } from '@tamagui/core';
export declare const createInterFont: <A extends GenericFont<1 | 11 | 12 | 13 | 14 | 16 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 15>>(font?: Partial<A> extends infer T ? { [Key in keyof T]?: Partial<A[Key]> | undefined; } : never, { sizeLineHeight, sizeSize, }?: {
    sizeLineHeight?: ((fontSize: number) => number) | undefined;
    sizeSize?: ((size: number) => number) | undefined;
}) => GenericFont<keyof typeof defaultSizes>;
declare const defaultSizes: {
    readonly 1: 11;
    readonly 2: 12;
    readonly 3: 13;
    readonly 4: 14;
    readonly 5: 16;
    readonly 6: 18;
    readonly 7: 20;
    readonly 8: 23;
    readonly 9: 30;
    readonly 10: 46;
    readonly 11: 55;
    readonly 12: 62;
    readonly 13: 72;
    readonly 14: 92;
    readonly 15: 114;
    readonly 16: 134;
};
export {};
//# sourceMappingURL=index.d.ts.map