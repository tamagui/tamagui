import { v4 as uid } from 'uuid'

import { Cookie } from '../Cookie/Cookie.js'
import type { CookieOptions } from '../Cookie/Cookie.js'
import type { SessionStorageAdapter } from '../session/session-types.js'

/** The `MemorySessionStorage` component stores session data within Hydrogen runtime memory.
 */
export const MemorySessionStorage = function (
  /** The name of the cookie stored in the browser. */
  name: string,
  /** An optional object to configure [how the cookie is persisted in the browser](https://shopify.dev/api/hydrogen/components/framework/cookie#cookie-options). */
  options: CookieOptions
): () => SessionStorageAdapter {
  const sessions: Map<string, { data: Record<string, string>; expires: number }> = new Map()

  return function () {
    const cookie = new Cookie(name, options)

    return {
      async get(request: Request): Promise<Record<string, string>> {
        const sid = cookie.getSessionId(request)
        let sessionData

        if (sid && sessions.has(sid)) {
          const { expires, data } = sessions.get(sid)!

          if (expires < new Date().getTime()) {
            sessions.delete(sid)
            sessionData = {}
          } else {
            sessionData = data
          }
        } else {
          sessionData = {}
        }

        return sessionData
      },

      async set(request: Request, value: Record<string, string>) {
        let sid = cookie.getSessionId(request) || ''

        if (!sid) {
          sid = uid()
        }

        sessions.set(sid, {
          data: value,
          expires: cookie.expires,
        })

        cookie.setSessionid(sid)

        return cookie.serialize()
      },

      async destroy(request: Request) {
        const sid = cookie.getSessionId(request)

        if (sid) {
          sessions.delete(sid)
        }

        return cookie.destroy()
      },
    }
  }
}
