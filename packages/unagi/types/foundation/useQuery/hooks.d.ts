import type { CachingStrategy, PreloadOptions, QueryKey } from '../../types.js';
export interface UnagiUseQueryOptions {
    /** The [caching strategy](https://shopify.dev/custom-storefronts/unagi/framework/cache#caching-strategies) to help you
     * determine which cache control header to set.
     */
    cache?: CachingStrategy;
    /** Whether to [preload the query](https://shopify.dev/custom-storefronts/unagi/framework/preloaded-queries).
     * Defaults to `false`. Specify `true` to preload the query for the URL or `'*'`
     * to preload the query for all requests.
     */
    preload?: PreloadOptions;
    /** A function that inspects the response body to determine if it should be cached.
     */
    shouldCacheResponse?: (body: any) => boolean;
}
/**
 * The `useQuery` hook executes an asynchronous operation like `fetch` in a way that
 * supports [Suspense](https://reactjs.org/docs/concurrent-mode-suspense.html). You can use this
 * hook to call any third-party APIs from a server component.
 *
 * \> Note:
 * \> If you're making a simple fetch call on the server, then we recommend using the [`fetchSync`](https://shopify.dev/api/unagi/hooks/global/fetchsync) hook instead.
 */
export declare function useQuery<T>(
/** A string or array to uniquely identify the current query. */
key: QueryKey, 
/** An asynchronous query function like `fetch` which returns data. */
queryFn: () => Promise<T>, 
/** The options to manage the cache behavior of the sub-request. */
queryOptions?: UnagiUseQueryOptions): {
    data?: undefined;
    error: Response | Error;
} | {
    data: T;
    error?: undefined;
};
export declare function shouldPreloadQuery(queryOptions?: UnagiUseQueryOptions): boolean;
//# sourceMappingURL=hooks.d.ts.map