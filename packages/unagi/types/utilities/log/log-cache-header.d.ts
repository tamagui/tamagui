import { UnagiRequest } from '../../foundation/UnagiRequest/UnagiRequest.server.js';
import { UnagiResponse } from '../../foundation/UnagiResponse/UnagiResponse.server.js';
import { QueryKey } from '../../types.js';
import { RenderType } from './log.js';
export declare type QueryCacheControlHeaders = {
    name: string;
    header: string | null;
};
export declare function collectQueryCacheControlHeaders(request: UnagiRequest, queryKey: QueryKey, cacheControlHeader: string | null): void;
export declare function logCacheControlHeaders(type: RenderType, request: UnagiRequest, response?: UnagiResponse): void;
//# sourceMappingURL=log-cache-header.d.ts.map