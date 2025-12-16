// deno-lint-ignore-file
/* eslint-disable */
// biome-ignore: needed import
import type { OneRouter } from 'one'

declare module 'one' {
  export namespace OneRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/_sitemap` | `/sandbox` | `/sandbox-ssr` | `/sub` | `/sub/portal-missing-styles`
      DynamicRoutes: `/bento/${OneRouter.SingleRoutePart<T>}` | `/test/${OneRouter.SingleRoutePart<T>}`
      DynamicRouteTemplate: `/bento/[slug]` | `/test/[slug]`
      IsTyped: true
      RouteTypes: {
        '/bento/[slug]': RouteInfo<{ slug: string }>
        '/test/[slug]': RouteInfo<{ slug: string }>
      }
    }
  }
}

/**
 * Helper type for route information
 */
type RouteInfo<Params = Record<string, never>> = {
  Params: Params
  LoaderProps: { path: string; params: Params; request?: Request }
}