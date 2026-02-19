import { serverPostHog } from './server'

export function captureServerError(
  error: Error,
  context?: {
    endpoint?: string
    userId?: string
    method?: string
    [key: string]: any
  }
) {
  serverPostHog.captureException(error, {
    endpoint: context?.endpoint,
    method: context?.method,
    distinctId: context?.userId || 'anonymous-server',
    ...context,
  })
}
