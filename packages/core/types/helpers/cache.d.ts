type Value = Object | Array<any> | string | number;
export type Style = {
    [key: string]: Value;
};
declare class Cache {
    v: Record<string, any>;
    get(key: string, valStr: string): any;
    set(key: string, valStr: string, object: any): void;
}
export declare const cache: Cache;
export {};
//# sourceMappingURL=cache.d.ts.map