import type { OneRouter } from 'one'

declare module 'one' {
  export namespace OneRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/_sitemap` | `/docs` | `/duck` | `/test`
      DynamicRoutes: `/docs/${OneRouter.SingleRoutePart<T>}`
      DynamicRouteTemplate: `/docs/[slug]`
      IsTyped: true
    }
  }
}