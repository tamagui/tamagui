import { clientPostHog } from './client'
import type { ErrorReport } from './types'

let handlersSetup = false

export function initializeErrorHandling(): void {
  if (typeof window === 'undefined') return
  if (process.env.NODE_ENV === 'development') return
  if (handlersSetup) return

  setupWebHandlers()
  handlersSetup = true
}

export function processError(report: ErrorReport): void {
  const { error, context = {}, severity = 'medium', tags } = report

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
