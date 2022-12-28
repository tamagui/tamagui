import { GenericFont } from '@tamagui/core';
export declare const createInterFont: <A extends GenericFont<11 | 12 | 13 | 14 | 16 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 15>>(font?: Partial<A> extends infer T ? { [Key in keyof T]?: Partial<A[Key]> | undefined; } : never, { sizeLineHeight, sizeSize, }?: {
    sizeLineHeight?: ((fontSize: number) => number) | undefined;
    sizeSize?: ((size: number) => number) | undefined;
}) => A;
//# sourceMappingURL=index.d.ts.map