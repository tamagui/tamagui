/**
 * See ssrInterop for context!
 */

import { Context, useContext } from 'react'

import { useServerRequest } from './ServerRequestProvider/index.js'
import type { UnagiRequest } from './UnagiRequest/UnagiRequest.server.js'

type ServerGetter<T> = (request: UnagiRequest) => T
const reactContextType = Symbol.for('react.context')

export const META_ENV_SSR = import.meta.env.SSR

export function useEnvContext<T>(serverGetter: ServerGetter<T>, clientFallback?: any) {
  if (META_ENV_SSR) return serverGetter(useServerRequest())

  return clientFallback && clientFallback.$$typeof === reactContextType
    ? useContext(clientFallback as Context<T>) // eslint-disable-line react-hooks/rules-of-hooks
    : (clientFallback as T)
}
