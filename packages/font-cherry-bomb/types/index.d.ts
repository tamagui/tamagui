import type { FillInFont, GenericFont } from '@tamagui/core';
export declare const createCherryBombFont: <A extends GenericFont>(font?: Partial<A>, { sizeLineHeight, sizeSize, }?: {
    sizeLineHeight?: (fontSize: number) => number;
    sizeSize?: (size: number) => number;
}) => FillInFont<A, keyof typeof defaultSizes>;
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