/**
 * This file is CHANGED on ssr to become ssrInteropServer - don't change the serverGetter signature
 */

import { Context, useContext } from 'react'

import type { UnagiRequest } from './UnagiRequest/UnagiRequest.server.js'

// This is replaced by Vite to import.meta.env.SSR
export const META_ENV_SSR = false

type ServerGetter<T> = (request: UnagiRequest) => T

const reactContextType = Symbol.for('react.context')

/**
 * Isomorphic hook to access context data. It gives access to the current request
 * when running on the server, and returns the provided client fallback in the browser.
 * This can be used in server components (RSC) as a Context/Provider replacement. In client
 * components, it uses the server getter in SSR and the client fallback in the browser.
 * @param serverGetter - A function that gets the current server request and returns any
 * desired request property. It only runs in the server (both in RSC and SSR).
 * @param clientFallback - An optional raw value or a React.Context to be consumed that will be
 * returned if the current environment is not the server. Note that, if this is a React.Context,
 * there must be a React.Provider parent in the app tree.
 * @returns A value retrieved from the current server request or a fallback value in the client.
 * The returned type depends on what the server getter returns.
 * @example
 * ```js
 * import {MyClientContext} from './my-client-react-context-provider.js';
 * useEnvContext(req => req.ctx.myServerContext, MyClientContext)
 * ```
 */
export function useEnvContext<T>(serverGetter: ServerGetter<T>, clientFallback?: any) {
  return clientFallback && clientFallback.$$typeof === reactContextType
    ? useContext(clientFallback as Context<T>) // eslint-disable-line react-hooks/rules-of-hooks
    : (clientFallback as T)
}
