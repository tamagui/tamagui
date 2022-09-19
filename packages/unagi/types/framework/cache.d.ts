/**
 * This is a limited implementation of an in-memory cache.
 * It only supports the `cache-control` header.
 * It does NOT support `age` or `expires` headers.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Cache
 */
export declare class InMemoryCache implements Cache {
    #private;
    constructor();
    add(request: RequestInfo): Promise<void>;
    addAll(requests: RequestInfo[]): Promise<void>;
    matchAll(request?: RequestInfo, options?: CacheQueryOptions): Promise<readonly Response[]>;
    put(request: Request, response: Response): Promise<void>;
    match(request: Request): Promise<Response | undefined>;
    delete(request: Request): Promise<boolean>;
    keys(request?: Request): Promise<Request[]>;
}
//# sourceMappingURL=cache.d.ts.map