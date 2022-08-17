export * from './client.js'

/**
 * The following are exported from this file because they are intended to be available
 * *only* on the server.
 */
export {
  ServerPropsProvider,
  ServerPropsContext,
  type ServerProps,
  type ServerPropsContextValue,
} from './foundation/ServerPropsProvider/index.js'
export { useUrl } from './foundation/useUrl/index.js'
export { useQuery, type UnagiUseQueryOptions } from './foundation/useQuery/hooks.js'
export { useServerProps } from './foundation/useServerProps.js'
export { FileRoutes } from './foundation/FileRoutes/FileRoutes.server.js'
export { Route } from './foundation/Route/Route.server.js'
export { Router } from './foundation/Router/Router.server.js'
export { log, type Logger } from './utilities/log/index.js'
//  export {LocalizationProvider} from './components/LocalizationProvider/LocalizationProvider.server.js';
//  export {ShopifyProvider} from './foundation/ShopifyProvider/ShopifyProvider.server.js';
export {
  generateCacheControlHeader,
  CacheNone,
  CacheShort,
  CacheLong,
  CacheCustom,
} from './foundation/Cache/strategies/index.js'
export { useRequestContext } from './foundation/useRequestContext/index.js'
//  export {useServerAnalytics} from './foundation/Analytics/hook.js';
//  export {ShopifyAnalytics} from './foundation/Analytics/connectors/Shopify/ShopifyAnalytics.server.js';
//  export {ShopifyAnalyticsConstants} from './foundation/Analytics/connectors/Shopify/const.js';
export { useSession } from './foundation/useSession.js'
export { Cookie } from './foundation/Cookie/Cookie.js'

/**
 * Override the client version of `fetchSync` with the server version.
 */
export { fetchSync } from './foundation/fetchSync/server/fetchSync.js'

export { type UnagiRequest } from './foundation/UnagiRequest/UnagiRequest.server.js'
export { type UnagiResponse } from './foundation/UnagiResponse/UnagiResponse.server.js'
export { type UnagiRouteProps } from './types.js'
export {
  type ResourceGetter as UnagiApiRoute,
  RequestOptions as UnagiApiRouteOptions,
} from './utilities/apiRoutes.js'
