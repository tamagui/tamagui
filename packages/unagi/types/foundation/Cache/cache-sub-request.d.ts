import type { CachingStrategy, QueryKey } from '../../types.js';
export declare function generateSubRequestCacheControlHeader(userCacheOptions?: CachingStrategy): string;
export declare function getItemFromCache(key: QueryKey): Promise<undefined | [any, Response]>;
export declare function setItemInCache(key: QueryKey, value: any, userCacheOptions?: CachingStrategy): Promise<void>;
export declare function deleteItemFromCache(key: QueryKey): Promise<void>;
export declare function isStale(key: QueryKey, response: Response): boolean;
//# sourceMappingURL=cache-sub-request.d.ts.map