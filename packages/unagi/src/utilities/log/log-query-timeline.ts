import { gray, green, red, yellow } from 'kolorist'

import { UnagiRequest } from '../../foundation/UnagiRequest/UnagiRequest.server.js'
import { QueryKey } from '../../types.js'
import { hashKey } from '../hash.js'
import { getTime } from '../timing.js'
import { RenderType, getLoggerWithContext } from './log.js'
import { findQueryName, parseUrl } from './utils.js'

export type TimingType = 'requested' | 'resolved' | 'rendered' | 'preload'

export type QueryTiming = {
  name: string
  timingType: TimingType
  timestamp: number
  duration?: number
}

const color = gray
const TIMING_MAPPING = {
  requested: 'Requested',
  rendered: 'Rendered',
  resolved: 'Resolved',
  preload: 'Preload',
}

export function collectQueryTimings(
  request: UnagiRequest,
  queryKey: QueryKey,
  timingType: TimingType,
  duration?: number
) {
  const hashedKey = hashKey(queryKey)
  request.ctx.queryTimings.push({
    name: findQueryName(hashedKey),
    timingType,
    timestamp: getTime(),
    duration,
  })
}

export function logQueryTimings(type: RenderType, request: UnagiRequest) {
  const log = getLoggerWithContext(request)

  if (!__UNAGI_DEV__ && !log.options().showQueryTiming) {
    return
  }

  const previouslyLoadedRequest = request.previouslyLoadedRequest()

  let logMessage = color(`┌── Query timings for ${parseUrl(type, request.url)}`)

  let firstSuspenseWaterfallQueryName = ''

  const queryList = request.ctx.queryTimings
  if (queryList.length > 0) {
    const requestStartTime = request.time
    const detectSuspenseWaterfall: Record<string, boolean> = {}
    const detectMultipleDataLoad: Record<string, number> = {}
    const preloadedQueries: Set<string> = new Set()
    let suspenseWaterfallDetectedCount = 0

    queryList.forEach((query: QueryTiming, index: number) => {
      if (query.timingType === 'preload') preloadedQueries.add(query.name)

      if (query.timingType === 'requested' || query.timingType === 'preload') {
        detectSuspenseWaterfall[query.name] = true
      } else if (query.timingType === 'rendered') {
        delete detectSuspenseWaterfall[query.name]
      } else if (query.timingType === 'resolved') {
        detectMultipleDataLoad[query.name] = detectMultipleDataLoad[query.name]
          ? detectMultipleDataLoad[query.name] + 1
          : 1
      }

      const loadColor = query.timingType === 'preload' ? green : color
      const duration = query.duration

      logMessage += color(
        `\n│ ${`${(query.timestamp - requestStartTime).toFixed(2)}ms`.padEnd(10)} ${loadColor(
          TIMING_MAPPING[query.timingType].padEnd(10)
        )} ${query.name}${
          query.timingType === 'resolved' ? ` (Took ${duration?.toFixed(2)}ms)` : ''
        }`
      )

      // SSR + RSC render path generates 2 `load` and `render` for each query
      // We want to avoid falsely identifying a suspense waterfall near the end
      // of the query list
      //
      // The (index + 4) is detecting that near the end of list.
      // A complete set of events for a given query is 4 entries
      // │ (639.62ms)  Requested  Localization
      // │ (993.33ms)  Resolved   Localization (Took 353.66ms)
      // │ (993.96ms)  Requested  Localization      <-- second time React tries to load
      // │ (994.03ms)  Rendered   Localization
      //
      // so the end of list index range is 3 (one less from a set entry) + 1 (zero index)
      if (
        queryList.length >= index + 4 &&
        Object.keys(detectSuspenseWaterfall).length === 0 &&
        !preloadedQueries.has(query.name) &&
        previouslyLoadedRequest
      ) {
        // Store the first suspense waterfall query name to display in the summary console output
        if (!firstSuspenseWaterfallQueryName) firstSuspenseWaterfallQueryName = query.name

        suspenseWaterfallDetectedCount++
        const warningColor = suspenseWaterfallDetectedCount === 1 ? yellow : red
        logMessage += `\n${color(`│ `)}${warningColor(`Suspense waterfall detected`)}`
      }
    })

    const unusedQueries = Object.keys(detectSuspenseWaterfall)
    if (unusedQueries.length > 0) {
      unusedQueries.forEach((queryName: string) => {
        logMessage += `\n${color(`│ `)}${yellow(`Unused query detected: ${queryName}`)}`
      })
    }

    Object.keys(detectMultipleDataLoad).forEach((queryName: string) => {
      const count = detectMultipleDataLoad[queryName]
      if (count > 1) {
        logMessage += `\n${color(`│ `)}${yellow(`Multiple data loads detected: ${queryName}`)}`
      }
    })
  }

  logMessage += '\n' + color('└──')

  if (log.options().showQueryTiming) {
    log.debug(logMessage)
  } else if (firstSuspenseWaterfallQueryName) {
    log.debug(yellow('Suspense waterfall detected on query: ' + firstSuspenseWaterfallQueryName))
    log.debug(
      '  Add the `showQueryTiming` property to your Unagi configuration to see more information:'
    )
    log.debug('  https://shopify.dev/custom-storefronts/unagi/framework/unagi-config#logger')
  }
}
