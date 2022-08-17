import type { InlineUnagiConfig } from './types.js'

export const defineConfig = (params: InlineUnagiConfig) => params

export type { InlineUnagiConfig as UnagiConfig }

// export { ShopifyServerAnalyticsConnector } from './foundation/Analytics/connectors/Shopify/ServerAnalyticsConnector.js'
// export { PerformanceMetricsServerAnalyticsConnector } from './foundation/Analytics/connectors/PerformanceMetrics/ServerAnalyticsConnector.js'

export { CookieSessionStorage } from './foundation/CookieSessionStorage/CookieSessionStorage.js'
export { MemorySessionStorage } from './foundation/MemorySessionStorage/MemorySessionStorage.js'
