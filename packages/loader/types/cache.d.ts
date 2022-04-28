export interface ICache {
    get: (key: string) => Promise<string>;
    set: (key: string, value: string) => Promise<void>;
}
declare class MemoryCache implements ICache {
    private cache;
    get(key: string): Promise<string>;
    set(key: string, value: string): Promise<void>;
}
export declare const memoryCache: MemoryCache;
export declare const getCacheInstance: (cacheProvider: string | ICache | undefined) => Promise<ICache>;
export {};
//# sourceMappingURL=cache.d.ts.map