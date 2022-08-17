import { stripColors } from 'kolorist'
import { Mocked, vi } from 'vitest'

import { UnagiRequest } from '../../../foundation/UnagiRequest/UnagiRequest.server.js'
import { Logger, getLoggerWithContext, log, logServerResponse, setLogger } from '../index.js'

let mockedLogger: Mocked<Logger>

describe('log', () => {
  beforeEach(() => {
    mockedLogger = {
      trace: vi.fn(),
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      fatal: vi.fn(),
      options: vi.fn(() => ({})),
    }

    vi.spyOn(Date, 'now').mockImplementation(() => 2100)
    vi.spyOn(performance, 'now').mockImplementation(() => 2100)

    setLogger(mockedLogger)
  })

  afterEach(() => {
    setLogger(undefined)
  })

  it('should return the wrapped mockLogger instance when log is called', () => {
    log.debug('test')
    expect(mockedLogger.debug).toHaveBeenCalled()
    expect(log.options()).toEqual({})
    expect(mockedLogger.debug.mock.calls[0][0]).toEqual({})
    expect(stripColors(mockedLogger.debug.mock.calls[0][1])).toEqual('test')
  })

  it('should return the mockLogger2 instance when setLogger is called', () => {
    const mockLogger2: Mocked<Logger> = {
      trace: vi.fn(),
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      fatal: vi.fn(),
      options: vi.fn(() => ({})),
    }

    setLogger({ ...mockLogger2, showCacheControlHeader: true })

    log.debug('test')
    expect(mockLogger2.debug).toHaveBeenCalled()
    expect(log.options()).toEqual({
      showCacheControlHeader: true,
    })
    expect(mockLogger2.debug.mock.calls[0][0]).toEqual({})
    expect(mockLogger2.debug.mock.calls[0][1]).toEqual('test')
  })

  it('should set showCacheControlHeader option correctly', () => {
    setLogger({ showCacheControlHeader: true })
    expect(log.options()).toEqual({
      showCacheControlHeader: true,
    })
  })

  it('should set showCacheApiStatus option correctly', () => {
    setLogger({
      showCacheApiStatus: true,
    })
    expect(log.options()).toEqual({
      showCacheApiStatus: true,
    })
  })

  it('should set multiple options correctly', () => {
    setLogger({
      showCacheControlHeader: true,
    })
    expect(log.options()).toEqual({
      showCacheControlHeader: true,
    })
    setLogger({
      showCacheApiStatus: true,
      showCacheControlHeader: true,
    })
    expect(log.options()).toEqual({
      showCacheApiStatus: true,
      showCacheControlHeader: true,
    })
  })

  it('should log 500 server response', () => {
    const request = {
      method: 'GET',
      url: 'http://localhost:3000/',
      time: 1000,
    } as UnagiRequest
    logServerResponse('str', request, 500)
    expect(mockedLogger.debug).toHaveBeenCalled()
    expect(mockedLogger.debug.mock.calls[0][0]).toEqual(request)
    expect(stripColors(mockedLogger.debug.mock.calls[0][1])).toMatchInlineSnapshot(
      '"GET streaming SSR     500 1100.00 ms http://localhost:3000/"'
    )
  })

  it('should log 200 server response', () => {
    const request = {
      method: 'GET',
      url: 'http://localhost:3000/',
      time: 1000,
    } as UnagiRequest
    logServerResponse('str', request, 200)
    expect(mockedLogger.debug).toHaveBeenCalled()
    expect(mockedLogger.debug.mock.calls[0][0]).toEqual(request)
    expect(stripColors(mockedLogger.debug.mock.calls[0][1])).toMatchInlineSnapshot(
      '"GET streaming SSR     200 1100.00 ms http://localhost:3000/"'
    )
  })

  it('should log 300 server response', () => {
    const request = {
      method: 'GET',
      url: 'http://localhost:3000/',
      time: 1000,
    } as UnagiRequest
    logServerResponse('str', request, 301)
    expect(mockedLogger.debug).toHaveBeenCalled()
    expect(mockedLogger.debug.mock.calls[0][0]).toEqual(request)
    expect(stripColors(mockedLogger.debug.mock.calls[0][1])).toMatchInlineSnapshot(
      '"GET streaming SSR     301 1100.00 ms http://localhost:3000/"'
    )
  })

  it('should log 400 server response', () => {
    const request = {
      method: 'GET',
      url: 'http://localhost:3000/',
      time: 1000,
    } as UnagiRequest
    logServerResponse('str', request, 404)
    expect(mockedLogger.debug).toHaveBeenCalled()
    expect(mockedLogger.debug.mock.calls[0][0]).toEqual(request)
    expect(stripColors(mockedLogger.debug.mock.calls[0][1])).toMatchInlineSnapshot(
      '"GET streaming SSR     404 1100.00 ms http://localhost:3000/"'
    )
  })
  ;['trace', 'debug', 'warn', 'error', 'fatal'].forEach((method) => {
    it(`logs ${method}`, () => {
      ;(log as any)[method](`unagi: ${method}`)
      expect((mockedLogger as any)[method]).toHaveBeenCalled()
      expect(((mockedLogger as any)[method] as any).mock.calls[0][0]).toEqual({})
      expect(((mockedLogger as any)[method] as any).mock.calls[0][1]).toBe(`unagi: ${method}`)
    })

    it('gets logger for a given context', () => {
      const clog = getLoggerWithContext({ url: 'example.com' })

      ;(clog as any)[method](`unagi: ${method}`)
      expect((mockedLogger as any)[method]).toHaveBeenCalled()
      expect(((mockedLogger as any)[method] as any).mock.calls[0][0]).toEqual({
        url: 'example.com',
      })
      expect(((mockedLogger as any)[method] as any).mock.calls[0][1]).toBe(`unagi: ${method}`)
    })

    it('marks async calls for waitUntil', () => {
      const waitUntilPromises = [] as Array<Promise<any>>

      const clog = getLoggerWithContext({
        ctx: {
          runtime: { waitUntil: (p: Promise<any>) => waitUntilPromises.push(p) },
        } as unknown as UnagiRequest['ctx'],
      })

      ;(clog as any)[method]('no promise 1')
      ;(clog as any)[method]('no promise 2')
      expect(waitUntilPromises).toHaveLength(0)

      setLogger({ [method]: async () => null })
      ;(clog as any)[method]('promise 1')
      ;(clog as any)[method]('promise 2')
      expect(waitUntilPromises).toHaveLength(2)
    })
  })
})
