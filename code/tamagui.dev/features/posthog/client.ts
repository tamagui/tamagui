import type { PostHogInstance } from './types'

const POSTHOG_KEY = 'phc_vy6MdaPFUllGBQLrBNWs4RJ8tbGuHyFF0nY6lncB1Ol'
const POSTHOG_HOST = 'https://us.i.posthog.com'

let distinctId = ''

function getDistinctId(): string {
  if (distinctId) return distinctId
  try {
    distinctId = localStorage.getItem('ph_distinct_id') || ''
  } catch {}
  if (!distinctId) {
    distinctId = crypto.randomUUID()
    try {
      localStorage.setItem('ph_distinct_id', distinctId)
    } catch {}
  }
  return distinctId
}

function send(events: Array<Record<string, any>>): void {
  const body = JSON.stringify({
    api_key: POSTHOG_KEY,
    batch: events,
  })
  // navigator.sendBeacon is fire-and-forget, works on page unload
  if (navigator.sendBeacon) {
    navigator.sendBeacon(`${POSTHOG_HOST}/batch/`, body)
  } else {
    fetch(`${POSTHOG_HOST}/batch/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {})
  }
}

class ClientPostHog implements PostHogInstance {
  private isInitialized = false

  initialize(): void {
    if (this.isInitialized) return
    if (typeof window === 'undefined') return
    if (process.env.NODE_ENV === 'development') return

    this.isInitialized = true

    this.capture('$pageview', {
      $current_url: location.href,
      $referrer: document.referrer,
    })
  }

  capture(event: string, properties?: Record<string, any>): void {
    if (!this.isInitialized) return
    send([
      {
        event,
        distinct_id: getDistinctId(),
        properties: {
          $lib: 'web-lite',
          $current_url: location.href,
          ...properties,
        },
        timestamp: new Date().toISOString(),
      },
    ])
  }

  identify(userId: string, properties?: Record<string, any>): void {
    if (!this.isInitialized) return
    const anonId = getDistinctId()
    distinctId = userId
    try {
      localStorage.setItem('ph_distinct_id', userId)
    } catch {}
    send([
      {
        event: '$identify',
        distinct_id: userId,
        properties: {
          $anon_distinct_id: anonId,
          $set: properties,
        },
        timestamp: new Date().toISOString(),
      },
    ])
  }

  reset(): void {
    if (!this.isInitialized) return
    distinctId = ''
    try {
      localStorage.removeItem('ph_distinct_id')
    } catch {}
  }

  captureException(error: Error, properties?: Record<string, any>): void {
    if (!this.isInitialized) return
    this.capture('$exception', {
      $exception_type: error.name,
      $exception_message: error.message,
      $exception_stack_trace_raw: error.stack || '',
      ...properties,
    })
  }
}

export const clientPostHog = new ClientPostHog()
