import { RSC_PATHNAME } from '../constants.js'
import type { SessionApi, SessionStorageAdapter } from '../foundation/session/session-types.js'
import { emptySessionImplementation } from '../foundation/session/session.js'
import type { UnagiRequest } from '../foundation/UnagiRequest/UnagiRequest.server.js'
import { ImportGlobEagerOutput, ResolvedUnagiConfig, ResolvedUnagiRoutes } from '../types.js'
import { getLoggerWithContext, logServerResponse } from './log/index.js'
import { matchPath } from './matchPath.js'

let memoizedApiRoutes: Array<UnagiApiRoute> = []
let memoizedRawRoutes: ImportGlobEagerOutput = {}

type RouteParams = Record<string, string>
export type RequestOptions = {
  params: RouteParams
  session: SessionApi | null
  unagiConfig: ResolvedUnagiConfig
}
export type ResourceGetter = (
  request: UnagiRequest,
  requestOptions: RequestOptions
) => Promise<Response | Object | String>

interface UnagiApiRoute {
  path: string
  resource: ResourceGetter
  hasServerComponent: boolean
}

export type ApiRouteMatch = {
  resource: ResourceGetter
  hasServerComponent: boolean
  params: RouteParams
}

export function extractPathFromRoutesKey(routesKey: string, dirPrefix: string | RegExp) {
  let path = routesKey
    .replace(dirPrefix, '')
    .replace(/\.server\.(t|j)sx?$/, '')
    /**
     * Replace /index with /
     */
    .replace(/\/index$/i, '/')
    /**
     * Only lowercase the first letter. This allows the developer to use camelCase
     * dynamic paths while ensuring their standard routes are normalized to lowercase.
     */
    .replace(/\b[A-Z]/, (firstLetter) => firstLetter.toLowerCase())
    /**
     * Convert /[handle].jsx and /[...handle].jsx to /:handle.jsx for react-router-dom
     */
    .replace(/\[(?:[.]{3})?(\w+?)\]/g, (_match, param: string) => `:${param}`)

  if (path.endsWith('/') && path !== '/') {
    path = path.substring(0, path.length - 1)
  }

  return path
}

export function getApiRoutes({
  files: routes,
  basePath: topLevelPath = '',
  dirPrefix = '',
}: Partial<ResolvedUnagiRoutes>): Array<UnagiApiRoute> {
  if (!routes || memoizedRawRoutes === routes) return memoizedApiRoutes

  const topLevelPrefix = topLevelPath.replace('*', '').replace(/\/$/, '')

  const keys = Object.keys(routes)

  const apiRoutes = keys
    .filter((key) => routes[key].api)
    .map((key) => {
      const path = extractPathFromRoutesKey(key, dirPrefix)

      /**
       * Catch-all routes [...handle].jsx don't need an exact match
       * https://reactrouter.com/core/api/Route/exact-bool
       */
      const exact = !/\[(?:[.]{3})(\w+?)\]/.test(key)

      return {
        path: topLevelPrefix + path,
        resource: routes[key].api,
        hasServerComponent: !!routes[key].default,
        exact,
      }
    })

  memoizedApiRoutes = [
    ...apiRoutes.filter((route) => !route.path.includes(':')),
    ...apiRoutes.filter((route) => route.path.includes(':')),
  ]

  memoizedRawRoutes = routes

  return memoizedApiRoutes
}

export function getApiRouteFromURL(url: URL, routes: Array<UnagiApiRoute>): ApiRouteMatch | null {
  let foundRoute, foundRouteDetails

  for (let i = 0; i < routes.length; i++) {
    foundRouteDetails = matchPath(url.pathname, routes[i])

    if (foundRouteDetails) {
      foundRoute = routes[i]
      break
    }
  }

  if (!foundRoute) return null

  return {
    resource: foundRoute.resource,
    params: foundRouteDetails.params,
    hasServerComponent: foundRoute.hasServerComponent,
  }
}

export async function renderApiRoute(
  request: UnagiRequest,
  route: ApiRouteMatch,
  unagiConfig: ResolvedUnagiConfig,
  {
    session,
    suppressLog,
  }: {
    session?: SessionStorageAdapter
    suppressLog?: boolean
  }
): Promise<Response | Request> {
  let response: any
  const log = getLoggerWithContext(request)
  let cookieToSet = ''

  try {
    response = await route.resource(request, {
      params: route.params,
      unagiConfig,
      session: session
        ? {
            async get() {
              return session.get(request)
            },
            async set(key: string, value: string) {
              const data = await session.get(request)
              data[key] = value
              cookieToSet = await session.set(request, data)
            },
            async destroy() {
              cookieToSet = await session.destroy(request)
            },
          }
        : emptySessionImplementation(log),
    })

    if (!(response instanceof Response || response instanceof Request)) {
      if (typeof response === 'string' || response instanceof String) {
        response = new Response(response as string)
      } else if (typeof response === 'object') {
        response = new Response(JSON.stringify(response), {
          headers: {
            'Content-Type': 'application/json',
          },
        })
      }
    }

    if (!response) {
      response = new Response(null)
    }

    if (cookieToSet) {
      response.headers.set('Set-Cookie', cookieToSet)
    }
  } catch (e) {
    log.error(e)
    response = new Response('Error processing: ' + request.url, {
      status: 500,
    })
  }

  if (!suppressLog) {
    logServerResponse('api', request as UnagiRequest, (response as Response).status ?? 200)
  }

  if (response instanceof Request) {
    const url = new URL(request.url)
    const newUrl = new URL(response.url, url)

    if (request.headers.get('Unagi-Client') === 'Form-Action') {
      response.headers.set('Unagi-RSC-Pathname', newUrl.pathname + newUrl.search)
      return new Request(getRscUrl(url, newUrl), {
        headers: response.headers,
      })
    } else {
      // This request was made by a native form presumably because the client components had yet to hydrate,
      // Because of this, we need to redirect instead of just rendering the response.
      // Doing so prevents odd refresh / back behavior. The redirect response also should *never* be cached.
      response.headers.set('Location', newUrl.href)
      response.headers.set('Cache-Control', 'no-store')

      return new Response(null, {
        status: 303,
        headers: response.headers,
      })
    }
  }

  return response
}

function getRscUrl(currentUrl: URL, newUrl: URL) {
  const rscUrl = new URL(RSC_PATHNAME, currentUrl)
  const searchParams = new URLSearchParams({
    state: JSON.stringify({
      pathname: newUrl.pathname,
      search: newUrl.search,
    }),
  })
  rscUrl.search = searchParams.toString()
  return rscUrl.toString()
}
