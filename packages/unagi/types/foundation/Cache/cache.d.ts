import type { CachingStrategy } from '../../types.js';
export declare function generateDefaultCacheControlHeader(userCacheOptions?: CachingStrategy): string;
export declare function getItemFromCache(request: Request): Promise<Response | undefined>;
export declare function setItemInCache(request: Request, response: Response, userCacheOptions: CachingStrategy): Promise<void>;
export declare function deleteItemFromCache(request: Request): Promise<void>;
export declare function isStale(request: Request, response: Response): boolean;
//# sourceMappingURL=cache.d.ts.map