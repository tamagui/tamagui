import type { GenericFont } from '@tamagui/web';
declare const genericFontSizes: {
    readonly 1: 10;
    readonly 2: 11;
    readonly 3: 12;
    readonly 4: 14;
    readonly 5: 15;
    readonly 6: 16;
    readonly 7: 20;
    readonly 8: 22;
    readonly 9: 30;
    readonly 10: 42;
    readonly 11: 52;
    readonly 12: 62;
    readonly 13: 72;
    readonly 14: 92;
    readonly 15: 114;
    readonly 16: 124;
};
export declare function createGenericFont<A extends GenericFont<keyof typeof genericFontSizes>>(family: string, font?: Partial<A>, { sizeLineHeight, }?: {
    sizeLineHeight?: (val: number) => number;
}): A;
//# sourceMappingURL=createGenericFont.d.ts.map