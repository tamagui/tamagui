export * from './shared-types.js'

import type { ServerResponse } from 'http'

import type { SessionStorageAdapter } from './foundation/session/session-types.js'
import type { UnagiRequest } from './foundation/UnagiRequest/UnagiRequest.server.js'
import type { UnagiResponse } from './foundation/UnagiResponse/UnagiResponse.server.js'
import type { Logger, LoggerConfig } from './utilities/log/index.js'

export type AssembleHtmlParams = {
  ssrHtml: string
  rscPayload?: string
  routes?: ImportGlobEagerOutput
  request: UnagiRequest
  template: string
}

export type RunSsrParams = {
  state: Record<string, any>
  rsc: { readable: ReadableStream; didError: () => Error | undefined }
  routes?: ImportGlobEagerOutput
  request: UnagiRequest
  response: UnagiResponse
  log: Logger
  dev?: boolean
  template: string
  nonce?: string
  nodeResponse?: ServerResponse
  revalidate?: Boolean
}

export type RunRscParams = {
  App: any
  state: Record<string, any>
  log: Logger
  request: UnagiRequest
  response: UnagiResponse
}

export type Hook = (params: { url: URL } & Record<string, any>) => any | Promise<any>

export type ImportGlobEagerOutput = Record<string, Record<'default' | 'api', any>>

export type InlineUnagiRoutes =
  | string
  | {
      files: string
      basePath?: string
    }

export type ResolvedUnagiRoutes = {
  files: ImportGlobEagerOutput
  dirPrefix: string
  basePath: string
}

export type ServerAnalyticsConnector = {
  request: (
    requestUrl: string,
    requestHeader: Headers,
    data?: any,
    contentType?: 'json' | 'text'
  ) => Promise<any>
}

export type InlineUnagiConfig = ClientConfig & {
  routes?: InlineUnagiRoutes
  serverAnalyticsConnectors?: Array<ServerAnalyticsConnector>
  logger?: LoggerConfig
  session?: (log: Logger) => SessionStorageAdapter
  poweredByHeader?: boolean
  serverErrorPage?: string
  __EXPERIMENTAL__devTools?: boolean
}

export type ResolvedUnagiConfig = Omit<InlineUnagiConfig, 'routes'> & {
  routes: ResolvedUnagiRoutes
}

export type ClientConfig = {
  /** React's StrictMode is on by default for your client side app; if you want to turn it off (not recommended), you can pass `false` */
  strictMode?: boolean
}

export type ClientHandler = (App: React.ElementType, config: ClientConfig) => Promise<void>

export type QueryKey = string | readonly unknown[]

export type NoStoreStrategy = {
  mode: string
}

export interface AllCacheOptions {
  mode?: string
  maxAge?: number
  staleWhileRevalidate?: number
  sMaxAge?: number
  staleIfError?: number
}

export type CachingStrategy = AllCacheOptions

export type PreloadOptions = boolean | string

export type UnagiRouteProps = {
  request: UnagiRequest
  response: UnagiResponse
  log: Logger
  params: Record<string, any>
  pathname: string
  search: string
  [key: string]: any
}
