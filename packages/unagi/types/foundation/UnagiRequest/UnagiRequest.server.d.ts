import { HelmetData as HeadData } from 'react-helmet-async';
import type { PreloadOptions, QueryKey, ResolvedUnagiConfig, RuntimeContext } from '../../types.js';
import type { QueryCacheControlHeaders } from '../../utilities/log/log-cache-header.js';
import type { QueryTiming } from '../../utilities/log/log-query-timeline.js';
import type { SessionSyncApi } from '../session/session-types.js';
export declare type PreloadQueryEntry = {
    key: QueryKey;
    fetcher: (request: UnagiRequest) => Promise<unknown>;
    preload?: PreloadOptions;
};
export declare type PreloadQueriesByURL = Map<string, PreloadQueryEntry>;
export declare type AllPreloadQueries = Map<string, PreloadQueriesByURL>;
export declare type RouterContextData = {
    routeRendered: boolean;
    serverProps: Record<string, any>;
    routeParams: Record<string, string>;
};
/**
 * This augments the `Request` object from the Fetch API:
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Request
 *
 * - Adds a `cookies` map for easy access
 * - Adds a static constructor to convert a Node.js `IncomingMessage` to a Request.
 */
export declare class UnagiRequest extends Request {
    /**
     * A Map of cookies for easy access.
     */
    cookies: Map<string, string>;
    id: string;
    time: number;
    /**
     * Get the canonical URL for the current page, across SSR and RSC requests.
     */
    normalizedUrl: string;
    ctx: {
        cache: Map<string, any>;
        head: HeadData;
        unagiConfig?: ResolvedUnagiConfig;
        queryCacheControl: Array<QueryCacheControlHeaders>;
        queryTimings: Array<QueryTiming>;
        preloadQueries: PreloadQueriesByURL;
        analyticsData: any;
        router: RouterContextData;
        session?: SessionSyncApi;
        flashSession: Record<string, any>;
        runtime?: RuntimeContext;
        scopes: Map<string, Record<string, any>>;
        [key: string]: any;
    };
    constructor(input: any);
    constructor(input: RequestInfo, init?: RequestInit);
    previouslyLoadedRequest(): boolean;
    private parseCookies;
    isRscRequest(): boolean;
    savePreloadQuery(query: PreloadQueryEntry): void;
    getPreloadQueries(): PreloadQueriesByURL | undefined;
    savePreloadQueries(): void;
    /**
     * Buyer IP varies by hosting provider and runtime. The developer should provide this
     * as an argument to the `handleRequest` function for their runtime.
     * Defaults to `x-forwarded-for` header value.
     */
    getBuyerIp(): string | null;
    /**
     * Build a `cacheKey` in the form of a `Request` to be used in full-page
     * caching.
     * - lockKey generates a placeholder cache key
     */
    cacheKey(lockKey?: boolean): Request;
    formData(): Promise<FormData>;
}
//# sourceMappingURL=UnagiRequest.server.d.ts.map