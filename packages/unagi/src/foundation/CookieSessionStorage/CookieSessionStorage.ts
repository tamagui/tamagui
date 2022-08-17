import { Cookie } from '../Cookie/Cookie.js'
import type { CookieOptions } from '../Cookie/Cookie.js'
import type { SessionStorageAdapter } from '../session/session-types.js'

/** The `CookieSessionStorage` component is the default session storage mechanism for Hydrogen.
 */
export const CookieSessionStorage = function (
  /** The name of the cookie stored in the browser. */
  name: string,
  /** An optional object to configure [how the cookie is persisted in the browser](https://shopify.dev/api/hydrogen/components/framework/cookie#cookie-options). */
  options: CookieOptions
): () => SessionStorageAdapter {
  return function () {
    const cookie = new Cookie(name, options)
    let parsed = false

    return {
      async get(request: Request): Promise<Record<string, string>> {
        if (!parsed) {
          const cookieValue = request.headers.get('cookie')
          cookie.parse(cookieValue || '')
          parsed = true
        }
        return cookie.data
      },
      async set(request: Request, value: Record<string, string>) {
        cookie.setAll(value)
        return cookie.serialize()
      },
      async destroy(request: Request) {
        // @todo - set expires for Date in past
        parsed = true
        return cookie.destroy()
      },
    }
  }
}
