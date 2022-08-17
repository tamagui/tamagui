import { BrowserHistory, Location, createBrowserHistory } from 'history'
import React, {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'

import type { LocationServerProps } from '../ServerPropsProvider/ServerPropsProvider.js'
import { META_ENV_SSR } from '../ssrInterop.js'
import { useInternalServerProps } from '../useServerProps.js'

type RouterContextValue = {
  history: BrowserHistory
  location: Location
}

export const RouterContext = createContext<RouterContextValue | undefined>(undefined)

let isFirstLoad = true
const positions: Record<string, number> = {}

export const BrowserRouter: FC<{
  history?: BrowserHistory
  children: ReactNode
}> = ({ history: pHistory, children }) => {
  if (META_ENV_SSR) return <>{children}</>
  /* eslint-disable react-hooks/rules-of-hooks */

  const history = useMemo(() => pHistory || createBrowserHistory(), [pHistory])
  const [location, setLocation] = useState(history.location)
  const [scrollNeedsRestoration, setScrollNeedsRestoration] = useState(false)

  const { pending, locationServerProps, setLocationServerProps } = useInternalServerProps()

  useScrollRestoration({
    location,
    pending,
    serverProps: locationServerProps,
    scrollNeedsRestoration,
    onFinishNavigating: () => setScrollNeedsRestoration(false),
  })

  useLayoutEffect(() => {
    const unlisten = history.listen(({ location: newLocation, action }) => {
      positions[location.key] = window.scrollY

      setLocationServerProps({
        pathname: newLocation.pathname,
        search: newLocation.search,
      })

      setLocation(newLocation)

      const state = (newLocation.state ?? {}) as Record<string, any>

      /**
       * "pop" navigations, like forward/backward buttons, always restore scroll position
       * regardless of what the original forward navigation intent was.
       */
      const needsScrollRestoration = action === 'POP' || !!state.scroll

      setScrollNeedsRestoration(needsScrollRestoration)
    })

    return () => unlisten()
  }, [history, location, setScrollNeedsRestoration, setLocation, setLocationServerProps])

  /* eslint-enable react-hooks/rules-of-hooks */

  return (
    <RouterContext.Provider
      value={{
        history,
        location,
      }}
    >
      {children}
    </RouterContext.Provider>
  )
}

export function useRouter() {
  if (META_ENV_SSR) return { location: {}, history: {} } as RouterContextValue

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useContext(RouterContext)
  if (router) return router

  throw new Error('Router hooks and <Link> component must be used within a <Router> component')
}

export function useLocation() {
  return useRouter().location
}

/**
 * Run a callback before browser unload.
 */
function useBeforeUnload(callback: () => any): void {
  React.useEffect(() => {
    window.addEventListener('beforeunload', callback)
    return () => {
      window.removeEventListener('beforeunload', callback)
    }
  }, [callback])
}

function useScrollRestoration({
  location,
  pending,
  serverProps,
  scrollNeedsRestoration,
  onFinishNavigating,
}: {
  location: Location
  pending: boolean
  serverProps: LocationServerProps
  scrollNeedsRestoration: boolean
  onFinishNavigating: () => void
}) {
  /**
   * Browsers have an API for scroll restoration. We wait for the page to load first,
   * in case the browser is able to restore scroll position automatically, and then
   * set it to manual mode.
   */
  useEffect(() => {
    window.history.scrollRestoration = 'manual'
  }, [])

  /**
   * If the page is reloading, allow the browser to handle its own scroll restoration.
   */
  useBeforeUnload(
    useCallback(() => {
      window.history.scrollRestoration = 'auto'
    }, [])
  )

  useLayoutEffect(() => {
    // The app has just loaded
    if (isFirstLoad || !scrollNeedsRestoration) {
      isFirstLoad = false
      return
    }

    const position = positions[location.key]

    /**
     * When serverState gets updated, `pending` is true while the fetch is in progress.
     * When that resolves, the serverState is updated. We should wait until the internal
     * location pointer and serverState match, and pending is false, to do any scrolling.
     */
    const finishedNavigating =
      !pending &&
      location.pathname === serverProps.pathname &&
      location.search === serverProps.search

    if (!finishedNavigating) {
      return
    }

    // If there is a location hash, scroll to it
    if (location.hash) {
      const element = document.querySelector(location.hash)
      if (element) {
        element.scrollIntoView()
        onFinishNavigating()
        return
      }
    }

    // If we have a matching position, scroll to it
    if (position) {
      window.scrollTo(0, position)
      onFinishNavigating()
      return
    }

    // Scroll to the top of new pages
    window.scrollTo(0, 0)
    onFinishNavigating()
  }, [
    location.pathname,
    location.search,
    location.hash,
    location.key,
    pending,
    serverProps.pathname,
    serverProps.search,
    scrollNeedsRestoration,
    onFinishNavigating,
  ])
}
