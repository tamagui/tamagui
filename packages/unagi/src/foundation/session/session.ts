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
      }
    : emptySyncSessionImplementation(log)
}

export const emptySessionImplementation = function (log: Logger) {
  return {
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
  }
}
