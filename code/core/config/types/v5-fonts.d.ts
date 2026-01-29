import type { FillInFont, GenericFont } from '@tamagui/core';
declare const webSizes: {
    readonly 1: 12;
    readonly 2: 13;
    readonly 3: 14;
    readonly 4: 15;
    readonly true: 15;
    readonly 5: 16;
    readonly 6: 18;
    readonly 7: 22;
    readonly 8: 26;
    readonly 9: 30;
    readonly 10: 40;
    readonly 11: 46;
    readonly 12: 52;
    readonly 13: 60;
    readonly 14: 70;
    readonly 15: 85;
    readonly 16: 100;
};
export declare const createSystemFont: <A extends GenericFont>({ font, sizeLineHeight, sizeSize, }?: {
    font?: Partial<A>;
    sizeLineHeight?: (fontSize: number) => number;
    sizeSize?: (size: number) => number;
}) => FillInFont<A, keyof typeof webSizes>;
export declare const fonts: {
    body: FillInFont<GenericFont, 9 | 15 | 1 | 10 | 3 | 2 | 5 | 6 | 16 | 11 | 12 | 14 | 4 | 7 | 8 | 13 | "true">;
    heading: FillInFont<GenericFont, 9 | 15 | 1 | 10 | 3 | 2 | 5 | 6 | 16 | 11 | 12 | 14 | 4 | 7 | 8 | 13 | "true">;
};
export {};
//# sourceMappingURL=v5-fonts.d.ts.map