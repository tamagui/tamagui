import type { CachingStrategy, PreloadOptions, QueryKey } from '../../types.js';
export interface UnagiUseQueryOptions {
    cache?: CachingStrategy;
    preload?: PreloadOptions;
    shouldCacheResponse?: (body: any) => boolean;
}
export declare function useQuery<T>(key: QueryKey, queryFn: () => Promise<T>, queryOptions?: UnagiUseQueryOptions): {
    data?: undefined;
    error: Response | Error;
} | {
    data: T;
    error?: undefined;
};
export declare function shouldPreloadQuery(queryOptions?: UnagiUseQueryOptions): boolean;
//# sourceMappingURL=hooks.d.ts.map