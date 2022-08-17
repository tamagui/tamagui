import type { AllCacheOptions, CachingStrategy, NoStoreStrategy } from '../../../types.js';
export declare const NO_STORE = "no-store";
export declare function generateCacheControlHeader(cacheOptions: CachingStrategy): string;
export declare function CacheNone(): NoStoreStrategy;
export declare function CacheShort(overrideOptions?: CachingStrategy): AllCacheOptions;
export declare function CacheLong(overrideOptions?: CachingStrategy): AllCacheOptions;
export declare function CacheCustom(overrideOptions: CachingStrategy): AllCacheOptions;
//# sourceMappingURL=index.d.ts.map