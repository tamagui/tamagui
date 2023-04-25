export declare const EQUALITY_KEY: unique symbol;
export type IsEqualOptions = {
    ignoreKeys?: {
        [key: string]: boolean;
    };
    keyComparators?: {
        [key: string]: (a: any, b: any) => boolean;
    };
    log?: boolean;
    maxDepth?: number;
};
export declare function isEqual(a: any, b: any, options?: IsEqualOptions): boolean;
//# sourceMappingURL=fastCompare.d.ts.map