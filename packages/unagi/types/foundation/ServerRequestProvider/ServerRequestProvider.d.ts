import React from 'react';
import type { QueryKey } from '../../types.js';
import type { UnagiRequest } from '../UnagiRequest/UnagiRequest.server.js';
declare type ServerRequestProviderProps = {
    request: UnagiRequest;
    children: React.ReactNode;
};
export declare function ServerRequestProvider({ request, children }: ServerRequestProviderProps): JSX.Element;
export declare function useServerRequest(): UnagiRequest;
declare type RequestCacheResult<T> = {
    data: T;
    error?: never;
} | {
    data?: never;
    error: Response | Error;
};
/**
 * Returns data stored in the request cache.
 * It will throw the promise if data is not ready.
 */
export declare function useRequestCacheData<T>(key: QueryKey, fetcher: (request: UnagiRequest) => T | Promise<T>): RequestCacheResult<T>;
export declare function preloadRequestCacheData(request: UnagiRequest): void;
export {};
//# sourceMappingURL=ServerRequestProvider.d.ts.map