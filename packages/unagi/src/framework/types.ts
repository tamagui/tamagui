import type { IncomingMessage, ServerResponse } from 'http'

import { SessionStorageAdapter } from '../foundation/session/session-types'

export type UnagiVitePluginOptions = {
  devCache?: boolean
  purgeQueryCacheOnBuild?: boolean
  configPath?: string
  optimizeBoundaries?: boolean | 'build'
  experimental?: {
    css: 'global' | 'modules-only'
  }
}

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
