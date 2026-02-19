import posthog from 'posthog-js'
import type { PostHogInstance } from './types'

const POSTHOG_KEY = 'phc_vy6MdaPFUllGBQLrBNWs4RJ8tbGuHyFF0nY6lncB1Ol'
const POSTHOG_HOST = 'https://us.i.posthog.com'

class ClientPostHog implements PostHogInstance {
  private isInitialized = false

  initialize(): void {
    if (this.isInitialized) return
    if (typeof window === 'undefined') return
    if (process.env.NODE_ENV === 'development') return

    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      person_profiles: 'identified_only',
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: true,
      session_recording: {
        recordCrossOriginIframes: true,
      },
    })

    this.isInitialized = true
  }

  capture(event: string, properties?: Record<string, any>): void {
    if (!this.isInitialized) return
    posthog.capture(event, properties)
  }

  identify(userId: string, properties?: Record<string, any>): void {
    if (!this.isInitialized) return
    posthog.identify(userId, properties)
  }

  reset(): void {
    if (!this.isInitialized) return
    posthog.reset()
  }

  captureException(error: Error, properties?: Record<string, any>): void {
    if (!this.isInitialized) return

    if (typeof posthog.captureException === 'function') {
      posthog.captureException(error, properties)
    } else {
      posthog.capture('$exception', {
        $exception_type: error.name,
        $exception_message: error.message,
        $exception_stack_trace_raw: error.stack || '',
        ...properties,
      })
    }
  }
}

export const clientPostHog = new ClientPostHog()
