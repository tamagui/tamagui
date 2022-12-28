type Value = Object | Array<any> | string | number;
export type Style = {
    [key: string]: Value;
};
export declare const cache: {
    get(key: string, valStr: string): any;
    set(key: string, valStr: string, object: any): void;
};
export {};
//# sourceMappingURL=cache.d.ts.map