import type { CachingStrategy } from '../../types.js';
export declare function generateDefaultCacheControlHeader(userCacheOptions?: CachingStrategy): string;
/**
 * Get an item from the cache. If a match is found, returns a tuple
 * containing the `JSON.parse` version of the response as well
 * as the response itself so it can be checked for staleness.
 */
export declare function getItemFromCache(request: Request): Promise<Response | undefined>;
/**
 * Put an item into the cache.
 */
export declare function setItemInCache(request: Request, response: Response, userCacheOptions: CachingStrategy): Promise<void>;
export declare function deleteItemFromCache(request: Request): Promise<void>;
/**
 * Manually check the response to see if it's stale.
 */
export declare function isStale(request: Request, response: Response): boolean;
//# sourceMappingURL=cache.d.ts.map