import type { OneRouter } from 'one'

declare module 'one' {
  export namespace OneRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/_sitemap` | `/sandbox` | `/sub` | `/sub/portal-missing-styles`
      DynamicRoutes: `/bento/${OneRouter.SingleRoutePart<T>}` | `/test/${OneRouter.SingleRoutePart<T>}`
      DynamicRouteTemplate: `/bento/[slug]` | `/test/[slug]`
      IsTyped: true
    }
  }
}