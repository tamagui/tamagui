import { stripColors } from 'kolorist'
import { Mocked, vi } from 'vitest'

import { UnagiRequest } from '../../../foundation/UnagiRequest/UnagiRequest.server.js'
import { UnagiResponse } from '../../../foundation/UnagiResponse/UnagiResponse.server.js'
import { Logger, setLogger } from '../index.js'
import { collectQueryCacheControlHeaders, logCacheControlHeaders } from '../log-cache-header.js'

let mockedLogger: Mocked<Logger>

const QUERY_1 = 'test1'
const QUERY_2 = 'testing2'
const QUERY_3 = 'testable3'

describe('cache header log', () => {
  beforeEach(() => {
    mockedLogger = {
      trace: vi.fn(),
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      fatal: vi.fn(),
      options: vi.fn(() => ({})),
    }

    setLogger({ ...mockedLogger, showCacheControlHeader: true })
  })

  afterEach(() => {
    setLogger(undefined)
  })

  it('should log cache control header for main request', () => {
    const request = {
      url: 'http://localhost:3000/',
      ctx: {
        queryCacheControl: [],
      },
    } as unknown as UnagiRequest
    const response = {
      cacheControlHeader: 'public, max-age=1, stale-while-revalidate=9',
    } as UnagiResponse

    logCacheControlHeaders('str', request, response)

    expect(mockedLogger.debug).toHaveBeenCalled()
    expect(mockedLogger.debug.mock.calls[0][0]).toEqual(request)
    expect(stripColors(mockedLogger.debug.mock.calls[0][1])).toMatchInlineSnapshot(
      '"┌── Cache control header for http://localhost:3000/"'
    )
    expect(stripColors(mockedLogger.debug.mock.calls[1][1])).toMatchInlineSnapshot(
      '"│ public, max-age=1, stale-while-revalidate=9"'
    )
    expect(stripColors(mockedLogger.debug.mock.calls[2][1])).toMatchInlineSnapshot('"└──"')
  })

  it('should log cache control header for sub request', () => {
    const request = {
      url: 'http://localhost:3000/react?state=%7B%22pathname%22%3A%22%2F%22%2C%22search%22%3A%22%22%7D',
      ctx: {
        queryCacheControl: [],
      },
    } as unknown as UnagiRequest
    const response = {
      cacheControlHeader: 'public, max-age=1, stale-while-revalidate=9',
    } as UnagiResponse

    logCacheControlHeaders('rsc', request, response)

    expect(mockedLogger.debug).toHaveBeenCalled()
    expect(mockedLogger.debug.mock.calls[0][0]).toEqual(request)
    expect(stripColors(mockedLogger.debug.mock.calls[0][1])).toMatchInlineSnapshot(
      '"┌── Cache control header for {\\"pathname\\":\\"/\\",\\"search\\":\\"\\"}"'
    )
    expect(stripColors(mockedLogger.debug.mock.calls[1][1])).toMatchInlineSnapshot(
      '"│ public, max-age=1, stale-while-revalidate=9"'
    )
    expect(stripColors(mockedLogger.debug.mock.calls[2][1])).toMatchInlineSnapshot('"└──"')
  })

  it('should log cache control header for main request and sub query request', () => {
    const request = {
      url: 'http://localhost:3000/',
      ctx: {
        queryCacheControl: [],
      },
    } as unknown as UnagiRequest
    const response = {
      cacheControlHeader: 'public, max-age=1, stale-while-revalidate=9',
    } as UnagiResponse

    collectQueryCacheControlHeaders(request, QUERY_1, 'public, max-age=1, stale-while-revalidate=9')
    logCacheControlHeaders('str', request, response)

    expect(mockedLogger.debug).toHaveBeenCalled()
    expect(mockedLogger.debug.mock.calls[0][0]).toEqual(request)
    expect(stripColors(mockedLogger.debug.mock.calls[0][1])).toMatchInlineSnapshot(
      '"┌── Cache control header for http://localhost:3000/"'
    )
    expect(stripColors(mockedLogger.debug.mock.calls[1][1])).toMatchInlineSnapshot(
      '"│ public, max-age=1, stale-while-revalidate=9"'
    )
    expect(stripColors(mockedLogger.debug.mock.calls[2][1])).toMatchInlineSnapshot('"│"')
    expect(stripColors(mockedLogger.debug.mock.calls[3][1])).toMatchInlineSnapshot(
      '"│ query test1 public, max-age=1, stale-while-revalidate=9"'
    )
    expect(stripColors(mockedLogger.debug.mock.calls[4][1])).toMatchInlineSnapshot('"└──"')
  })

  it('should log cache control header for main request and several sub query requests', () => {
    const request = {
      url: 'http://localhost:3000/',
      ctx: {
        queryCacheControl: [],
      },
    } as unknown as UnagiRequest
    const response = {
      cacheControlHeader: 'public, max-age=1, stale-while-revalidate=9',
    } as UnagiResponse

    collectQueryCacheControlHeaders(request, QUERY_1, 'public, max-age=1, stale-while-revalidate=9')
    collectQueryCacheControlHeaders(
      request,
      QUERY_2,
      'public, max-age=2, stale-while-revalidate=10'
    )
    collectQueryCacheControlHeaders(
      request,
      QUERY_3,
      'public, max-age=3, stale-while-revalidate=11'
    )
    logCacheControlHeaders('str', request, response)

    expect(mockedLogger.debug).toHaveBeenCalled()
    expect(mockedLogger.debug.mock.calls[0][0]).toEqual(request)
    expect(stripColors(mockedLogger.debug.mock.calls[0][1])).toMatchInlineSnapshot(
      '"┌── Cache control header for http://localhost:3000/"'
    )
    expect(stripColors(mockedLogger.debug.mock.calls[1][1])).toMatchInlineSnapshot(
      '"│ public, max-age=1, stale-while-revalidate=9"'
    )
    expect(stripColors(mockedLogger.debug.mock.calls[2][1])).toMatchInlineSnapshot('"│"')
    expect(stripColors(mockedLogger.debug.mock.calls[3][1])).toMatchInlineSnapshot(
      '"│ query test1     public, max-age=1, stale-while-revalidate=9"'
    )
    expect(stripColors(mockedLogger.debug.mock.calls[4][1])).toMatchInlineSnapshot(
      '"│ query testing2  public, max-age=2, stale-while-revalidate=10"'
    )
    expect(stripColors(mockedLogger.debug.mock.calls[5][1])).toMatchInlineSnapshot(
      '"│ query testable3 public, max-age=3, stale-while-revalidate=11"'
    )
    expect(stripColors(mockedLogger.debug.mock.calls[6][1])).toMatchInlineSnapshot('"└──"')
  })
})
