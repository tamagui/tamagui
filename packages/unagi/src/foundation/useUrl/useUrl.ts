import { useContext, useMemo } from 'react'

import { RSC_PATHNAME } from '../../constants.js'
import { parseJSON } from '../../utilities/parse.js'
import { RouterContext } from '../Router/BrowserRouter.client.js'
import { META_ENV_SSR, useEnvContext } from '../ssrInterop.js'

/**
 * The `useUrl` hook retrieves the current URL in a server or client component.
 */
export function useUrl(): URL {
  if (META_ENV_SSR) {
    const serverUrl = new URL(
      useEnvContext((req) => req.url) // eslint-disable-line react-hooks/rules-of-hooks
    )

    if (serverUrl.pathname === RSC_PATHNAME) {
      const state = parseJSON(serverUrl.searchParams.get('state') || '{}')
      const parsedUrl = `${serverUrl.origin}${state.pathname ?? ''}${state.search ?? ''}`
      return new URL(parsedUrl)
    }

    return new URL(serverUrl)
  }

  /**
   * We return a `URL` object instead of passing through `location` because
   * the URL object contains important info like hostname, etc.
   * Note: do not call `useLocation` directly here to avoid throwing errors
   * when `useUrl` is used outside of a Router component (e.g. in <Seo>).
   */
  const location = useContext(RouterContext) // eslint-disable-line react-hooks/rules-of-hooks

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useMemo(() => new URL(window.location.href), [location]) // eslint-disable-line react-hooks/exhaustive-deps
}
