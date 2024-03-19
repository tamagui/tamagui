import type { FillInFont, GenericFont } from '@tamagui/core';
export declare const createCherryBombFont: <A extends GenericFont>(font?: Partial<A>, { sizeLineHeight, sizeSize, }?: {
    sizeLineHeight?: ((fontSize: number) => number) | undefined;
    sizeSize?: ((size: number) => number) | undefined;
}) => FillInFont<A, 10 | 1 | 11 | 12 | 13 | 14 | 16 | 2 | 3 | 4 | "true" | 5 | 6 | 7 | 8 | 9 | 15>;
declare const defaultSizes: {
    readonly 1: number;
    readonly 2: number;
    readonly 3: number;
    readonly 4: number;
    readonly true: number;
    readonly 5: number;
    readonly 6: number;
    readonly 7: number;
    readonly 8: number;
    readonly 9: number;
    readonly 10: number;
    readonly 11: number;
    readonly 12: number;
    readonly 13: number;
    readonly 14: number;
    readonly 15: number;
    readonly 16: number;
};
export {};
//# sourceMappingURL=index.d.ts.map