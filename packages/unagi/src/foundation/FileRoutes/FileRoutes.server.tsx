import React, { useMemo } from 'react'

import type { ImportGlobEagerOutput } from '../../types.js'
import { extractPathFromRoutesKey } from '../../utilities/apiRoutes.js'
import { log } from '../../utilities/log/index.js'
import { matchPath } from '../../utilities/matchPath.js'
import { useServerRequest } from '../ServerRequestProvider/index.js'
import { RouteParamsProvider } from '../useRouteParams/RouteParamsProvider.client.js'

interface FileRoutesProps {
  /** The routes defined by Vite's [import.meta.globEager](https://vitejs.dev/guide/features.html#glob-import) method. */
  routes?: ImportGlobEagerOutput
  /** A path that's prepended to all file routes. You can modify `basePath` if you want to prefix all file routes. For example, you can prefix all file routes with a locale. */
  basePath?: string
  /** The portion of the file route path that shouldn't be a part of the URL. You need to modify this if you want to import routes from a location other than the default `src/routes`. */
  dirPrefix?: string | RegExp
}

/**
 * The `FileRoutes` component builds a set of default Unagi routes based on the output provided by Vite's
 * [import.meta.globEager](https://vitejs.dev/guide/features.html#glob-import) method. You can have multiple
 * instances of this component to source file routes from multiple locations.
 */
export function FileRoutes({ routes, basePath, dirPrefix }: FileRoutesProps) {
  const request = useServerRequest()
  const { routeRendered, serverProps } = request.ctx.router

  if (routeRendered) return null

  if (!routes) {
    const fileRoutes = request.ctx.unagiConfig!.routes
    routes = fileRoutes.files
    dirPrefix ??= fileRoutes.dirPrefix
    basePath ??= fileRoutes.basePath
  }

  basePath ??= '/'

  const pageRoutes = useMemo(
    () => createPageRoutes(routes!, basePath, dirPrefix),
    [routes, basePath, dirPrefix]
  )

  let foundRoute, foundRouteDetails

  for (let i = 0; i < pageRoutes.length; i++) {
    foundRouteDetails = matchPath(serverProps.pathname, pageRoutes[i])

    if (foundRouteDetails) {
      foundRoute = pageRoutes[i]
      break
    }
  }

  if (foundRoute) {
    request.ctx.router.routeRendered = true
    request.ctx.router.routeParams = foundRouteDetails.params
    return (
      <RouteParamsProvider routeParams={foundRouteDetails.params} basePath={basePath}>
        <foundRoute.component params={foundRouteDetails.params} {...serverProps} />
      </RouteParamsProvider>
    )
  }

  return null
}

interface UnagiRoute {
  component: any
  path: string
  exact: boolean
}

export function createPageRoutes(
  pages: ImportGlobEagerOutput,
  topLevelPath = '*',
  dirPrefix: string | RegExp = ''
): UnagiRoute[] {
  const topLevelPrefix = topLevelPath.replace('*', '').replace(/\/$/, '')

  const keys = Object.keys(pages)

  const routes = keys
    .map((key) => {
      const path = extractPathFromRoutesKey(key, dirPrefix)

      /**
       * Catch-all routes [...handle].jsx don't need an exact match
       * https://reactrouter.com/core/api/Route/exact-bool
       */
      const exact = !/\[(?:[.]{3})(\w+?)\]/.test(key)

      if (!pages[key].default && !pages[key].api) {
        log?.warn(`${key} doesn't export a default React component or an API function`)
      }

      return {
        path: topLevelPrefix + path,
        component: pages[key].default,
        exact,
      }
    })
    .filter((route) => route.component)

  /**
   * Place static paths BEFORE dynamic paths to grant priority.
   */
  return [
    ...routes.filter((route) => !route.path.includes(':')),
    ...routes.filter((route) => route.path.includes(':')),
  ]
}
