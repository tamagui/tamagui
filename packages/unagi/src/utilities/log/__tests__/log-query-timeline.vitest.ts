import { stripColors } from 'kolorist'
import { Mocked, vi } from 'vitest'

import { UnagiRequest } from '../../../foundation/UnagiRequest/UnagiRequest.server.js'
import { Logger, setLogger } from '../index.js'
import { collectQueryTimings, logQueryTimings } from '../log-query-timeline.js'

let mockedLogger: Mocked<Logger>

const QUERY_1 = 'test1'
const QUERY_2 = 'testing2'

const time = 1640995200000

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

    vi.spyOn(performance, 'now').mockImplementation(() => time)

    setLogger({ ...mockedLogger, showQueryTiming: true })
  })

  afterEach(() => {
    setLogger(undefined)
  })

  it('should log query timing', () => {
    const request = {
      url: 'http://localhost:3000/',
      ctx: {
        queryTimings: [],
      },
      time: 1640995200200,
      previouslyLoadedRequest: () => false,
    } as unknown as UnagiRequest
    collectQueryTimings(request, QUERY_1, 'requested')
    collectQueryTimings(request, QUERY_1, 'resolved', 100)
    collectQueryTimings(request, QUERY_1, 'rendered')

    logQueryTimings('ssr', request)

    expect(mockedLogger.debug).toHaveBeenCalled()
    expect(stripColors(mockedLogger.debug.mock.calls[0][1])).toMatchInlineSnapshot(`
      "┌── Query timings for http://localhost:3000/
      │ -200.00ms  Requested  test1
      │ -200.00ms  Resolved   test1 (Took 100.00ms)
      │ -200.00ms  Rendered   test1
      └──"
    `)
  })

  it('should detect suspense waterfall', () => {
    const request = {
      url: 'http://localhost:3000/',
      ctx: {
        queryTimings: [],
      },
      time: 1640995200200,
      previouslyLoadedRequest: () => true,
    } as unknown as UnagiRequest
    collectQueryTimings(request, QUERY_1, 'requested')
    collectQueryTimings(request, QUERY_1, 'resolved', 100)
    collectQueryTimings(request, QUERY_1, 'requested')
    collectQueryTimings(request, QUERY_1, 'rendered')
    collectQueryTimings(request, QUERY_2, 'requested')
    collectQueryTimings(request, QUERY_2, 'resolved', 100)
    collectQueryTimings(request, QUERY_2, 'requested')
    collectQueryTimings(request, QUERY_2, 'rendered')

    logQueryTimings('ssr', request)

    expect(mockedLogger.debug).toHaveBeenCalled()
    expect(stripColors(mockedLogger.debug.mock.calls[0][1])).toMatchInlineSnapshot(`
      "┌── Query timings for http://localhost:3000/
      │ -200.00ms  Requested  test1
      │ -200.00ms  Resolved   test1 (Took 100.00ms)
      │ -200.00ms  Requested  test1
      │ -200.00ms  Rendered   test1
      │ Suspense waterfall detected
      │ -200.00ms  Requested  testing2
      │ -200.00ms  Resolved   testing2 (Took 100.00ms)
      │ -200.00ms  Requested  testing2
      │ -200.00ms  Rendered   testing2
      └──"
    `)
  })

  it('should detect unused query', () => {
    const request = {
      url: 'http://localhost:3000/',
      ctx: {
        queryTimings: [],
      },
      previouslyLoadedRequest: () => false,
      time: 1640995200200,
    } as unknown as UnagiRequest
    collectQueryTimings(request, QUERY_1, 'requested')
    collectQueryTimings(request, QUERY_1, 'resolved', 100)

    logQueryTimings('ssr', request)

    expect(mockedLogger.debug).toHaveBeenCalled()
    expect(stripColors(mockedLogger.debug.mock.calls[0][1])).toMatchInlineSnapshot(`
      "┌── Query timings for http://localhost:3000/
      │ -200.00ms  Requested  test1
      │ -200.00ms  Resolved   test1 (Took 100.00ms)
      │ Unused query detected: test1
      └──"
    `)
  })

  it('should detect multiple data load', () => {
    const request = {
      url: 'http://localhost:3000/',
      ctx: {
        queryTimings: [],
      },
      previouslyLoadedRequest: () => false,
      time: 1640995200200,
    } as unknown as UnagiRequest
    collectQueryTimings(request, QUERY_1, 'requested')
    collectQueryTimings(request, QUERY_1, 'resolved', 100)
    collectQueryTimings(request, QUERY_1, 'resolved', 120)
    collectQueryTimings(request, QUERY_1, 'rendered')

    logQueryTimings('ssr', request)

    expect(mockedLogger.debug).toHaveBeenCalled()
    expect(stripColors(mockedLogger.debug.mock.calls[0][1])).toMatchInlineSnapshot(`
      "┌── Query timings for http://localhost:3000/
      │ -200.00ms  Requested  test1
      │ -200.00ms  Resolved   test1 (Took 100.00ms)
      │ -200.00ms  Resolved   test1 (Took 120.00ms)
      │ -200.00ms  Rendered   test1
      │ Multiple data loads detected: test1
      └──"
    `)
  })
})
