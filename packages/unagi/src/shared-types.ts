// These types are shared in ESM and CJS builds.
// Do not import anything from subfolders here to avoid
// affecting the files generated in the CJS build.

import type { IncomingMessage, ServerResponse } from 'http'

import type { SessionStorageAdapter } from './foundation/session/session-types'

export interface RuntimeContext {
  waitUntil: (fn: Promise<any>) => void
}

export interface RequestHandlerOptions {
  indexTemplate: string | ((url: string) => Promise<string | { default: string }>)
  cache?: Cache
  streamableResponse?: ServerResponse
  dev?: boolean
  context?: RuntimeContext
  nonce?: string
  buyerIpHeader?: string
  sessionApi?: SessionStorageAdapter
  headers?: Headers
}

export interface RequestHandler {
  (request: Request | IncomingMessage, options: RequestHandlerOptions): Promise<
    Response | undefined
  >
}
