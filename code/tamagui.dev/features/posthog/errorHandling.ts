import { clientPostHog } from './client'
import type { ErrorReport } from './types'

let handlersSetup = false

const MAX_ERRORS_PER_MINUTE = 10
const DEDUP_WINDOW_MS = 60_000

const IGNORED_ERROR_PATTERNS = [
  // Browser extensions
  /chrome-extension:\/\//i,
  /moz-extension:\/\//i,
  /safari-(?:web-)?extension:\/\//i,
  /webkit-masked-url:\/\//i,

  // Benign browser notifications
  /ResizeObserver loop/i,
  /(?:^|:\s*)Script error\.?$/im,

  // Aborted requests / user navigation
  /AbortError/i,
  /The user aborted a request/i,
  /The operation was aborted/i,
  /signal is aborted/i,

  // Ad blockers / network drops
  /ERR_BLOCKED_BY_CLIENT/i,
  /Failed to fetch/i,
  /NetworkError when attempting to fetch resource/i,
  /Load failed/i,

  // One router loader 404s from prefetch/navigation
  /404 loader for/i,
  /ssg route not in routeMap/i,
]

export function shouldIgnoreError(error: Error, sourceUrl?: string): boolean {
  const message = error.message || ''
  const stack = error.stack || ''
  const name = error.name || ''
  const fullText = `${name}: ${message}\n${stack}\n${sourceUrl || ''}`

  return IGNORED_ERROR_PATTERNS.some((pattern) => pattern.test(fullText))
}

const recentErrors = new Map<string, number>()
const errorTimestamps: number[] = []

export function resetErrorLimitsForTesting(): void {
  recentErrors.clear()
  errorTimestamps.length = 0
}

export function isRateLimitedOrDuplicate(error: Error): boolean {
  const now = Date.now()

  // 1. Sliding window rate limit (max N errors per minute)
  while (errorTimestamps.length > 0 && now - errorTimestamps[0] > 60_000) {
    errorTimestamps.shift()
  }
  if (errorTimestamps.length >= MAX_ERRORS_PER_MINUTE) {
    return true
  }

  // 2. Deduping identical errors within DEDUP_WINDOW_MS
  const key = `${error.name}:${error.message}`
  const lastSeen = recentErrors.get(key)
  if (lastSeen && now - lastSeen < DEDUP_WINDOW_MS) {
    return true
  }

  // Evict stale dedup entries if map grows large
  if (recentErrors.size > 100) {
    for (const [k, timestamp] of recentErrors.entries()) {
      if (now - timestamp > DEDUP_WINDOW_MS) {
        recentErrors.delete(k)
      }
    }
  }

  recentErrors.set(key, now)
  errorTimestamps.push(now)
  return false
}

export function initializeErrorHandling(): void {
  if (typeof window === 'undefined') return
  if (process.env.NODE_ENV === 'development') return
  if (handlersSetup) return

  setupWebHandlers()
  handlersSetup = true
}

export function processError(report: ErrorReport): void {
  const { error, context = {}, severity = 'medium', tags } = report
  if (!error) return

  if (shouldIgnoreError(error, context.url)) return
  if (isRateLimitedOrDuplicate(error)) return

  clientPostHog.captureException(error, {
    ...tags,
    severity,
    url: context.url,
    userAgent: context.userAgent,
    timestamp: context.timestamp || Date.now(),
    ...context.additional,
  })

  if (severity === 'critical' || severity === 'high') {
    console.error('[posthog error]', error)
  }
}

function setupWebHandlers(): void {
  const ogWindowErrorHandler = window.onerror

  window.onerror = (message, source, lineno, colno, error) => {
    ogWindowErrorHandler?.(message, source, lineno, colno, error)

    const actualError = error || new Error(String(message))
    processError({
      error: actualError,
      context: {
        url: source?.toString(),
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        additional: { line: lineno, column: colno },
      },
      severity: 'high',
      tags: { source: 'window.onerror' },
    })

    return false
  }

  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    const error =
      event.reason instanceof Error ? event.reason : new Error(String(event.reason))

    processError({
      error,
      context: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
      },
      severity: 'high',
      tags: { source: 'unhandled_promise_rejection' },
    })
  })
}
