import { PostHog } from 'posthog-node'
import type { PostHogInstance } from './types'

const POSTHOG_KEY = 'phc_vy6MdaPFUllGBQLrBNWs4RJ8tbGuHyFF0nY6lncB1Ol'
const POSTHOG_HOST = 'https://us.i.posthog.com'

class ServerPostHog implements PostHogInstance {
  private posthog: PostHog | null = null

  constructor() {
    if (process.env.NODE_ENV !== 'development') {
      this.posthog = new PostHog(POSTHOG_KEY, {
        host: POSTHOG_HOST,
      })
    }
  }

  capture(event: string, properties?: Record<string, any>): void {
    if (!this.posthog) return
    this.posthog.capture({
      event,
      properties,
      distinctId: properties?.distinctId || properties?.userId || 'anonymous-server',
    })
  }

  captureException(error: Error, properties?: Record<string, any>): void {
    if (!this.posthog) return
    this.posthog.capture({
      event: '$exception',
      distinctId: properties?.distinctId || properties?.userId || 'anonymous-server',
      properties: {
        $exception_type: error.name,
        $exception_message: error.message,
        $exception_stack_trace_raw: error.stack || '',
        source: 'server',
        ...properties,
      },
    })

    // flush immediately for exceptions
    this.posthog.flush()
  }

  identify(userId: string, properties?: Record<string, any>): void {
    if (!this.posthog) return
    this.posthog.identify({
      distinctId: userId,
      properties,
    })
  }

  reset(): void {
    if (!this.posthog) return
    this.posthog.shutdown()
  }
}

export const serverPostHog = new ServerPostHog()
