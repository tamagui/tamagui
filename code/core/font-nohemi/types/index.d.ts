import type { FillInFont, GenericFont } from '@tamagui/core';
export declare const createNohemi: <A extends GenericFont>(font?: Partial<A>, { sizeLineHeight, sizeSize, }?: {
    sizeLineHeight?: (fontSize: number) => number;
    sizeSize?: (size: number) => number;
}) => FillInFont<A, keyof typeof defaultSizes>;
declare const defaultSizes: {
    readonly 1: 11;
    readonly 2: 12;
    readonly 3: 13;
    readonly 4: 14;
    readonly true: 14;
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