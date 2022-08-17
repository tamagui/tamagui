import { META_ENV_SSR, useEnvContext } from '../ssrInterop.js'

type ScopedContext = Record<string, any>

/**
 * Provides access to the current request context.
 * @param scope - An optional string used to scope the request context. It is recommended to
 * prevent modifying the properties added by other plugins.
 * @returns A request-scoped object that can be modified to provide and consume information
 * across different React components in the tree.
 * @example
 * ```js
 * import {useRequestContext} from '@shopify/unagi';
 * useRequestContext('my-plugin-name');
 * ```
 */
export function useRequestContext<T extends ScopedContext>(scope = 'default'): T {
  if (__UNAGI_DEV__ && !META_ENV_SSR) {
    throw new Error('useRequestContext can only be used in the server')
  }

  const scopes = useEnvContext((req) => req.ctx.scopes)

  if (!scopes.has(scope)) {
    scopes.set(scope, Object.create(null))
  }

  return scopes.get(scope) as T
}
