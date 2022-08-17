import { useEnvContext } from '../ssrInterop.js'
import { RouteParamsContext } from './RouteParamsProvider.client.js'

/**
 *  The `useRouteParams` hook retrieves the parameters of an active route. The hook is available in both server and client components.
 */
export function useRouteParams() {
  const router = useEnvContext((req) => req.ctx.router, RouteParamsContext)
  return router.routeParams
}
