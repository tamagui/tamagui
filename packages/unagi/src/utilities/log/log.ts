import { green, italic, lightBlue, red, yellow } from 'kolorist'

import { UnagiRequest } from '../../foundation/UnagiRequest/UnagiRequest.server.js'
import { getTime } from '../timing.js'
import { parseUrl } from './utils.js'

/** The `log` utility is a function that's used for logging debugging, warning, and error information about the application.
 * Use this utility by importing `log` from `@tamagui/unagi`, or by using a `log` prop passed to each page
 * component. We recommend using the `log` prop passed to each page because it will associated your log to the
 * current request in progress.
 */

type LoggerMethod = (...args: Array<any>) => void | Promise<any>

export interface Logger {
  trace: LoggerMethod
  debug: LoggerMethod
  warn: LoggerMethod
  error: LoggerMethod
  fatal: LoggerMethod
  options: () => LoggerOptions
}

export type LoggerOptions = {
  showCacheControlHeader?: boolean
  showCacheApiStatus?: boolean
  showQueryTiming?: boolean
  showUnusedQueryProperties?: boolean
}

export type LoggerConfig = Partial<Exclude<Logger, 'options'>> & LoggerOptions

export type RenderType = 'str' | 'rsc' | 'ssr' | 'api'

const defaultLogger: Logger = {
  trace(context, ...args) {
    // Re-enable following line to show trace debugging information
    // console.log(context.id, ...args);
  },
  debug(context, ...args) {
    console.log(...args)
  },
  warn(context, ...args) {
    console.warn(yellow('WARN: '), ...args)
  },
  error(context, ...args) {
    console.error(red('ERROR: '), ...args)
  },
  fatal(context, ...args) {
    console.error(red('FATAL: '), ...args)
  },
  options: () => ({} as LoggerOptions),
}

let currentLogger = defaultLogger as Logger

function doLog(method: keyof typeof defaultLogger, request: Partial<UnagiRequest>, ...args: any[]) {
  const maybePromise = currentLogger[method](request, ...args)
  if (maybePromise instanceof Promise) {
    request?.ctx?.runtime?.waitUntil?.(maybePromise)
  }
}

export function getLoggerWithContext(context: Partial<UnagiRequest>): Logger {
  return {
    trace: (...args) => doLog('trace', context, ...args),
    debug: (...args) => doLog('debug', context, ...args),
    warn: (...args) => doLog('warn', context, ...args),
    error: (...args) => doLog('error', context, ...args),
    fatal: (...args) => doLog('fatal', context, ...args),
    options: () => currentLogger.options(),
  }
}

export const log: Logger = getLoggerWithContext({})

export function setLogger(config?: LoggerConfig) {
  if (!config) {
    currentLogger = defaultLogger
    return
  }

  const options = {} as LoggerOptions
  currentLogger = { ...defaultLogger, ...config, options: () => options }

  for (const key of Object.keys(config) as (keyof LoggerOptions)[]) {
    if (!(key in defaultLogger)) {
      delete currentLogger[key as keyof Logger]
      options[key] = config[key]
    }
  }
}

const SERVER_RESPONSE_MAP: Record<string, string> = {
  str: 'streaming SSR',
  rsc: 'Server Components',
  ssr: 'buffered SSR',
}

export function logServerResponse(type: RenderType, request: UnagiRequest, responseStatus: number) {
  const log = getLoggerWithContext(request)
  const coloredResponseStatus =
    responseStatus >= 500
      ? red(responseStatus)
      : responseStatus >= 400
      ? yellow(responseStatus)
      : responseStatus >= 300
      ? lightBlue(responseStatus)
      : green(responseStatus)

  const fullType: string = SERVER_RESPONSE_MAP[type] || type

  const styledType = italic(fullType.padEnd(17))
  const paddedTiming = ((getTime() - request.time).toFixed(2) + ' ms').padEnd(10)
  const url = parseUrl(type, request.url)

  log.debug(`${request.method} ${styledType} ${coloredResponseStatus} ${paddedTiming} ${url}`)
}
