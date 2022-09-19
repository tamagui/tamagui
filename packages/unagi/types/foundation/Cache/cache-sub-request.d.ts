import type { CachingStrategy, QueryKey } from '../../types.js';
export declare function generateSubRequestCacheControlHeader(userCacheOptions?: CachingStrategy): string;
/**
 * Get an item from the cache. If a match is found, returns a tuple
 * containing the `JSON.parse` version of the response as well
 * as the response itself so it can be checked for staleness.
 */
export declare function getItemFromCache(key: QueryKey): Promise<undefined | [any, Response]>;
/**
 * Put an item into the cache.
 */
export declare function setItemInCache(key: QueryKey, value: any, userCacheOptions?: CachingStrategy): Promise<void>;
export declare function deleteItemFromCache(key: QueryKey): Promise<void>;
/**
 * Manually check the response to see if it's stale.
 */
export declare function isStale(key: QueryKey, response: Response): boolean;
//# sourceMappingURL=cache-sub-request.d.ts.map