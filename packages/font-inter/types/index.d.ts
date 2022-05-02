export declare const createInterFont: <A extends GenericFont<11 | 12 | 13 | 14 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 15 | 16>>(font?: { [Key in keyof Partial<A>]?: Partial<A[Key]> | undefined; }, { sizeLineHeight, sizeSize, }?: {
    sizeLineHeight?: ((fontSize: number) => number) | undefined;
    sizeSize?: ((size: number) => number) | undefined;
}) => GenericFont<11 | 12 | 13 | 14 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 15 | 16>;
//# sourceMappingURL=index.d.ts.map