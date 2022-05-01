export declare const createInterFont: <A extends GenericFont<12 | 13 | 14 | 16 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 15>>(font?: { [Key in keyof Partial<A>]?: Partial<A[Key]> | undefined; }, { sizeLineHeight, }?: {
    sizeLineHeight?: ((fontSize: number) => number) | undefined;
}) => GenericFont<12 | 13 | 14 | 16 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 15>;
//# sourceMappingURL=index.d.ts.map