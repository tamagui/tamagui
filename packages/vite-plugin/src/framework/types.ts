import type { IncomingMessage, ServerResponse } from 'http'

import { SessionStorageAdapter } from '../core/session/session-types'

export type TamaguiVitePluginOptions = any

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
