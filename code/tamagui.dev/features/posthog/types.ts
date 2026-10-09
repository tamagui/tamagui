export interface ErrorContext {
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
