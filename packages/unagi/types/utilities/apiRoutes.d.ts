import type { SessionApi, SessionStorageAdapter } from '../foundation/session/session-types.js';
import type { UnagiRequest } from '../foundation/UnagiRequest/UnagiRequest.server.js';
import { ResolvedUnagiConfig, ResolvedUnagiRoutes } from '../types.js';
declare type RouteParams = Record<string, string>;
export declare type RequestOptions = {
    params: RouteParams;
    session: SessionApi | null;
    unagiConfig: ResolvedUnagiConfig;
};
export declare type ResourceGetter = (request: UnagiRequest, requestOptions: RequestOptions) => Promise<Response | Object | String>;
interface UnagiApiRoute {
    path: string;
    resource: ResourceGetter;
    hasServerComponent: boolean;
}
export declare type ApiRouteMatch = {
    resource: ResourceGetter;
    hasServerComponent: boolean;
    params: RouteParams;
};
export declare function extractPathFromRoutesKey(routesKey: string, dirPrefix: string | RegExp): string;
export declare function getApiRoutes({ files: routes, basePath: topLevelPath, dirPrefix, }: Partial<ResolvedUnagiRoutes>): Array<UnagiApiRoute>;
export declare function getApiRouteFromURL(url: URL, routes: Array<UnagiApiRoute>): ApiRouteMatch | null;
export declare function renderApiRoute(request: UnagiRequest, route: ApiRouteMatch, unagiConfig: ResolvedUnagiConfig, { session, suppressLog, }: {
    session?: SessionStorageAdapter;
    suppressLog?: boolean;
}): Promise<Response | Request>;
export {};
//# sourceMappingURL=apiRoutes.d.ts.map