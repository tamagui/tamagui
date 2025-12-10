// deno-lint-ignore-file
/* eslint-disable */
// biome-ignore: needed import
import type { OneRouter } from 'one'

declare module 'one' {
  export namespace OneRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(blog)` | `/(blog)/blog` | `/(blog)/draft` | `/(docs)` | `/(site)` | `/(site)/` | `/(site)/(blog)` | `/(site)/(blog)/blog` | `/(site)/(blog)/draft` | `/(site)/(docs)` | `/(site)/account` | `/(site)/bento` | `/(site)/bento/(home)` | `/(site)/blog` | `/(site)/chat` | `/(site)/community` | `/(site)/dpa` | `/(site)/draft` | `/(site)/login` | `/(site)/payment-finished` | `/(site)/privacy` | `/(site)/pro-license` | `/(site)/pro-policy` | `/(site)/studio` | `/(site)/takeout` | `/(site)/theme` | `/(site)/theme/` | `/_sitemap` | `/account` | `/admin` | `/admin/user` | `/auth` | `/bento` | `/bento/(home)` | `/blog` | `/chat` | `/community` | `/dpa` | `/draft` | `/invoice` | `/login` | `/payment-finished` | `/privacy` | `/pro-license` | `/pro-policy` | `/responsive-demo` | `/sandbox` | `/studio` | `/takeout` | `/talk` | `/test` | `/theme` | `/theme/`
      DynamicRoutes: `/(blog)/blog/${OneRouter.SingleRoutePart<T>}` | `/(docs)/docs/core/${OneRouter.SingleRoutePart<T>}` | `/(docs)/docs/guides/${OneRouter.SingleRoutePart<T>}` | `/(docs)/docs/intro/${OneRouter.SingleRoutePart<T>}` | `/(docs)/ui/${string}` | `/(site)/(blog)/blog/${OneRouter.SingleRoutePart<T>}` | `/(site)/(docs)/docs/core/${OneRouter.SingleRoutePart<T>}` | `/(site)/(docs)/docs/guides/${OneRouter.SingleRoutePart<T>}` | `/(site)/(docs)/docs/intro/${OneRouter.SingleRoutePart<T>}` | `/(site)/(docs)/ui/${string}` | `/(site)/bento/${string}` | `/(site)/blog/${OneRouter.SingleRoutePart<T>}` | `/(site)/docs/core/${OneRouter.SingleRoutePart<T>}` | `/(site)/docs/guides/${OneRouter.SingleRoutePart<T>}` | `/(site)/docs/intro/${OneRouter.SingleRoutePart<T>}` | `/(site)/theme/${string}` | `/(site)/ui/${string}` | `/bento/${string}` | `/blog/${OneRouter.SingleRoutePart<T>}` | `/docs/core/${OneRouter.SingleRoutePart<T>}` | `/docs/guides/${OneRouter.SingleRoutePart<T>}` | `/docs/intro/${OneRouter.SingleRoutePart<T>}` | `/theme/${string}` | `/ui/${string}`
      DynamicRouteTemplate: `/(blog)/blog/[slug]` | `/(docs)/docs/core/[slug]` | `/(docs)/docs/guides/[slug]` | `/(docs)/docs/intro/[slug]` | `/(docs)/ui/[...subpath]` | `/(site)/(blog)/blog/[slug]` | `/(site)/(docs)/docs/core/[slug]` | `/(site)/(docs)/docs/guides/[slug]` | `/(site)/(docs)/docs/intro/[slug]` | `/(site)/(docs)/ui/[...subpath]` | `/(site)/bento/[...parts]` | `/(site)/blog/[slug]` | `/(site)/docs/core/[slug]` | `/(site)/docs/guides/[slug]` | `/(site)/docs/intro/[slug]` | `/(site)/theme/[...subpath]` | `/(site)/ui/[...subpath]` | `/bento/[...parts]` | `/blog/[slug]` | `/docs/core/[slug]` | `/docs/guides/[slug]` | `/docs/intro/[slug]` | `/theme/[...subpath]` | `/ui/[...subpath]`
      IsTyped: true
      RouteTypes: {
        '/(blog)/blog/[slug]': RouteInfo<{ slug: string }>
        '/(docs)/docs/core/[slug]': RouteInfo<{ slug: string }>
        '/(docs)/docs/guides/[slug]': RouteInfo<{ slug: string }>
        '/(docs)/docs/intro/[slug]': RouteInfo<{ slug: string }>
        '/(docs)/ui/[...subpath]': RouteInfo<{ subpath: string[] }>
        '/(site)/(blog)/blog/[slug]': RouteInfo<{ slug: string }>
        '/(site)/(docs)/docs/core/[slug]': RouteInfo<{ slug: string }>
        '/(site)/(docs)/docs/guides/[slug]': RouteInfo<{ slug: string }>
        '/(site)/(docs)/docs/intro/[slug]': RouteInfo<{ slug: string }>
        '/(site)/(docs)/ui/[...subpath]': RouteInfo<{ subpath: string[] }>
        '/(site)/bento/[...parts]': RouteInfo<{ parts: string[] }>
        '/(site)/blog/[slug]': RouteInfo<{ slug: string }>
        '/(site)/docs/core/[slug]': RouteInfo<{ slug: string }>
        '/(site)/docs/guides/[slug]': RouteInfo<{ slug: string }>
        '/(site)/docs/intro/[slug]': RouteInfo<{ slug: string }>
        '/(site)/theme/[...subpath]': RouteInfo<{ subpath: string[] }>
        '/(site)/ui/[...subpath]': RouteInfo<{ subpath: string[] }>
        '/bento/[...parts]': RouteInfo<{ parts: string[] }>
        '/blog/[slug]': RouteInfo<{ slug: string }>
        '/docs/core/[slug]': RouteInfo<{ slug: string }>
        '/docs/guides/[slug]': RouteInfo<{ slug: string }>
        '/docs/intro/[slug]': RouteInfo<{ slug: string }>
        '/theme/[...subpath]': RouteInfo<{ subpath: string[] }>
        '/ui/[...subpath]': RouteInfo<{ subpath: string[] }>
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