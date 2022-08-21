import { Logger } from '../../utilities/log/index.js'
import { wrapPromise } from '../../utilities/suspense.js'
import type { UnagiRequest } from '../UnagiRequest/UnagiRequest.server.js'
import type { UnagiResponse } from '../UnagiResponse/UnagiResponse.server.js'
import type { SessionStorageAdapter } from './session-types.js'

export function getSyncSessionApi(
  request: UnagiRequest,
  componentResponse: UnagiResponse,
  log: Logger,
  session?: SessionStorageAdapter
) {
  type ThrowablePromise = {
    read: () => any
  }

  const sessionPromises: { [key: string]: ThrowablePromise } = {}

  return session
    ? {
        get() {
          if (!sessionPromises.getPromise) {
            sessionPromises.getPromise = wrapPromise(session.get(request))
          }
          return sessionPromises.getPromise.read()
        },
        set(data: Record<string, any>) {
          if (!sessionPromises.setPromise) {
            sessionPromises.setPromise = wrapPromise(session.set(request, data))
          }
          const cookie = sessionPromises.setPromise.read()
          componentResponse.headers.set('Set-Cookie', cookie)
          return cookie
        },
      }
    : emptySyncSessionImplementation(log)
}

export const emptySessionImplementation = function (log: Logger) {
  return {
    async getFlash(key: string) {
      log.warn('No session adapter has been configured!')
      return null
    },
    async get() {
      log.warn('No session adapter has been configured!')
      return {}
    },
    async set(key: string, value: string) {
      log.warn('No session adapter has been configured!')
    },
    async destroy() {
      log.warn('No session adapter has been configured!')
      return
    },
  }
}

export const emptySyncSessionImplementation = function (log: Logger) {
  return {
    get() {
      log.warn('No session adapter has been configured!')
      return {}
    },
    set(data: Record<string, any>) {
      log.warn('No session adapter has been configured!')
      return null
    },
  }
}
