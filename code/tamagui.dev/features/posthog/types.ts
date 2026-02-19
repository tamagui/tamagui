export interface PostHogInstance {
  capture(event: string, properties?: Record<string, any>): void
  captureException(error: Error, properties?: Record<string, any>): void
  identify(userId: string, properties?: Record<string, any>): void
  reset(): void
}

export interface ErrorContext {
  userId?: string
  url?: string
  userAgent?: string
  timestamp?: number
  additional?: Record<string, any>
}

export interface ErrorReport {
  error: Error
  context?: ErrorContext
  severity?: 'low' | 'medium' | 'high' | 'critical'
  tags?: Record<string, string>
}
