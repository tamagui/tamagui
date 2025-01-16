import type { FillInFont, GenericFont } from '@tamagui/core';
export declare const createSystemFont: <A extends GenericFont>({ font, sizeLineHeight, sizeSize, }?: {
    font?: Partial<A>;
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
export declare const fonts: {
    body: FillInFont<GenericFont, 2 | 9 | 15 | 1 | 10 | 5 | 14 | 11 | 12 | 16 | 3 | 4 | 6 | 7 | 8 | 13 | "true">;
    heading: FillInFont<GenericFont, 2 | 9 | 15 | 1 | 10 | 5 | 14 | 11 | 12 | 16 | 3 | 4 | 6 | 7 | 8 | 13 | "true">;
};
export {};
//# sourceMappingURL=v4-fonts.d.ts.map