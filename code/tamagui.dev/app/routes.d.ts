// deno-lint-ignore-file
/* eslint-disable */
// biome-ignore: needed import
import type { OneRouter } from 'one'

declare module 'one' {
  export namespace OneRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes:
        | `/`
        | `/(blog)`
        | `/(blog)/blog`
        | `/(blog)/draft`
        | `/(docs)`
        | `/(site)`
        | `/(site)/`
        | `/(site)/(blog)`
        | `/(site)/(blog)/blog`
        | `/(site)/(blog)/draft`
        | `/(site)/(docs)`
        | `/(site)/(tailwind)`
        | `/(site)/(unstyled)`
        | `/(site)/account`
        | `/(site)/bento`
        | `/(site)/bento/(home)`
        | `/(site)/blog`
        | `/(site)/chat`
        | `/(site)/community`
        | `/(site)/dpa`
        | `/(site)/draft`
        | `/(site)/login`
        | `/(site)/payment-finished`
        | `/(site)/pop`
        | `/(site)/pop/accept-invite`
        | `/(site)/privacy`
        | `/(site)/pro-license`
        | `/(site)/pro-policy`
        | `/(site)/pro/enable-v2-renewal`
        | `/(site)/tailwind`
        | `/(site)/takeout`
        | `/(site)/theme`
        | `/(site)/theme/`
        | `/(tailwind)`
        | `/(unstyled)`
        | `/_sitemap`
        | `/account`
        | `/admin`
        | `/admin/user`
        | `/auth`
        | `/bento`
        | `/bento/(home)`
        | `/blog`
        | `/chat`
        | `/community`
        | `/dpa`
        | `/draft`
        | `/invoice`
        | `/login`
        | `/payment-finished`
        | `/pop`
        | `/pop/accept-invite`
        | `/privacy`
        | `/pro-license`
        | `/pro-policy`
        | `/pro/enable-v2-renewal`
        | `/reproductions/motion-bug`
        | `/reproductions/motion-bug/`
        | `/responsive-demo`
        | `/sandbox`
        | `/sandbox2`
        | `/tailwind`
        | `/takeout`
        | `/test`
        | `/theme`
        | `/theme/`
      DynamicRoutes:
        | `/(blog)/blog/${OneRouter.SingleRoutePart<T>}`
        | `/(docs)/docs/core/${OneRouter.SingleRoutePart<T>}`
        | `/(docs)/docs/guides/${OneRouter.SingleRoutePart<T>}`
        | `/(docs)/docs/intro/${OneRouter.SingleRoutePart<T>}`
        | `/(docs)/ui/${string}`
        | `/(site)/(blog)/blog/${OneRouter.SingleRoutePart<T>}`
        | `/(site)/(docs)/docs/core/${OneRouter.SingleRoutePart<T>}`
        | `/(site)/(docs)/docs/guides/${OneRouter.SingleRoutePart<T>}`
        | `/(site)/(docs)/docs/intro/${OneRouter.SingleRoutePart<T>}`
        | `/(site)/(docs)/ui/${string}`
        | `/(site)/(tailwind)/tailwind-ui/${string}`
        | `/(site)/(tailwind)/tailwind/core/${OneRouter.SingleRoutePart<T>}`
        | `/(site)/(tailwind)/tailwind/guides/${OneRouter.SingleRoutePart<T>}`
        | `/(site)/(tailwind)/tailwind/intro/${OneRouter.SingleRoutePart<T>}`
        | `/(site)/(unstyled)/unstyled-ui/${string}`
        | `/(site)/(unstyled)/unstyled/core/${OneRouter.SingleRoutePart<T>}`
        | `/(site)/(unstyled)/unstyled/guides/${OneRouter.SingleRoutePart<T>}`
        | `/(site)/(unstyled)/unstyled/intro/${OneRouter.SingleRoutePart<T>}`
        | `/(site)/bento/${string}`
        | `/(site)/blog/${OneRouter.SingleRoutePart<T>}`
        | `/(site)/docs/core/${OneRouter.SingleRoutePart<T>}`
        | `/(site)/docs/guides/${OneRouter.SingleRoutePart<T>}`
        | `/(site)/docs/intro/${OneRouter.SingleRoutePart<T>}`
        | `/(site)/tailwind-ui/${string}`
        | `/(site)/tailwind/core/${OneRouter.SingleRoutePart<T>}`
        | `/(site)/tailwind/guides/${OneRouter.SingleRoutePart<T>}`
        | `/(site)/tailwind/intro/${OneRouter.SingleRoutePart<T>}`
        | `/(site)/theme/${string}`
        | `/(site)/ui/${string}`
        | `/(site)/unstyled-ui/${string}`
        | `/(site)/unstyled/core/${OneRouter.SingleRoutePart<T>}`
        | `/(site)/unstyled/guides/${OneRouter.SingleRoutePart<T>}`
        | `/(site)/unstyled/intro/${OneRouter.SingleRoutePart<T>}`
        | `/(tailwind)/tailwind-ui/${string}`
        | `/(tailwind)/tailwind/core/${OneRouter.SingleRoutePart<T>}`
        | `/(tailwind)/tailwind/guides/${OneRouter.SingleRoutePart<T>}`
        | `/(tailwind)/tailwind/intro/${OneRouter.SingleRoutePart<T>}`
        | `/(unstyled)/unstyled-ui/${string}`
        | `/(unstyled)/unstyled/core/${OneRouter.SingleRoutePart<T>}`
        | `/(unstyled)/unstyled/guides/${OneRouter.SingleRoutePart<T>}`
        | `/(unstyled)/unstyled/intro/${OneRouter.SingleRoutePart<T>}`
        | `/bento/${string}`
        | `/blog/${OneRouter.SingleRoutePart<T>}`
        | `/demo/${OneRouter.SingleRoutePart<T>}`
        | `/docs/core/${OneRouter.SingleRoutePart<T>}`
        | `/docs/guides/${OneRouter.SingleRoutePart<T>}`
        | `/docs/intro/${OneRouter.SingleRoutePart<T>}`
        | `/tailwind-ui/${string}`
        | `/tailwind/core/${OneRouter.SingleRoutePart<T>}`
        | `/tailwind/guides/${OneRouter.SingleRoutePart<T>}`
        | `/tailwind/intro/${OneRouter.SingleRoutePart<T>}`
        | `/theme/${string}`
        | `/ui/${string}`
        | `/unstyled-ui/${string}`
        | `/unstyled/core/${OneRouter.SingleRoutePart<T>}`
        | `/unstyled/guides/${OneRouter.SingleRoutePart<T>}`
        | `/unstyled/intro/${OneRouter.SingleRoutePart<T>}`
      DynamicRouteTemplate:
        | `/(blog)/blog/[slug]`
        | `/(docs)/docs/core/[slug]`
        | `/(docs)/docs/guides/[slug]`
        | `/(docs)/docs/intro/[slug]`
        | `/(docs)/ui/[...subpath]`
        | `/(site)/(blog)/blog/[slug]`
        | `/(site)/(docs)/docs/core/[slug]`
        | `/(site)/(docs)/docs/guides/[slug]`
        | `/(site)/(docs)/docs/intro/[slug]`
        | `/(site)/(docs)/ui/[...subpath]`
        | `/(site)/(tailwind)/tailwind-ui/[...subpath]`
        | `/(site)/(tailwind)/tailwind/core/[slug]`
        | `/(site)/(tailwind)/tailwind/guides/[slug]`
        | `/(site)/(tailwind)/tailwind/intro/[slug]`
        | `/(site)/(unstyled)/unstyled-ui/[...subpath]`
        | `/(site)/(unstyled)/unstyled/core/[slug]`
        | `/(site)/(unstyled)/unstyled/guides/[slug]`
        | `/(site)/(unstyled)/unstyled/intro/[slug]`
        | `/(site)/bento/[...parts]`
        | `/(site)/blog/[slug]`
        | `/(site)/docs/core/[slug]`
        | `/(site)/docs/guides/[slug]`
        | `/(site)/docs/intro/[slug]`
        | `/(site)/tailwind-ui/[...subpath]`
        | `/(site)/tailwind/core/[slug]`
        | `/(site)/tailwind/guides/[slug]`
        | `/(site)/tailwind/intro/[slug]`
        | `/(site)/theme/[...subpath]`
        | `/(site)/ui/[...subpath]`
        | `/(site)/unstyled-ui/[...subpath]`
        | `/(site)/unstyled/core/[slug]`
        | `/(site)/unstyled/guides/[slug]`
        | `/(site)/unstyled/intro/[slug]`
        | `/(tailwind)/tailwind-ui/[...subpath]`
        | `/(tailwind)/tailwind/core/[slug]`
        | `/(tailwind)/tailwind/guides/[slug]`
        | `/(tailwind)/tailwind/intro/[slug]`
        | `/(unstyled)/unstyled-ui/[...subpath]`
        | `/(unstyled)/unstyled/core/[slug]`
        | `/(unstyled)/unstyled/guides/[slug]`
        | `/(unstyled)/unstyled/intro/[slug]`
        | `/bento/[...parts]`
        | `/blog/[slug]`
        | `/demo/[name]`
        | `/docs/core/[slug]`
        | `/docs/guides/[slug]`
        | `/docs/intro/[slug]`
        | `/tailwind-ui/[...subpath]`
        | `/tailwind/core/[slug]`
        | `/tailwind/guides/[slug]`
        | `/tailwind/intro/[slug]`
        | `/theme/[...subpath]`
        | `/ui/[...subpath]`
        | `/unstyled-ui/[...subpath]`
        | `/unstyled/core/[slug]`
        | `/unstyled/guides/[slug]`
        | `/unstyled/intro/[slug]`
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
        '/(site)/(tailwind)/tailwind-ui/[...subpath]': RouteInfo<{ subpath: string[] }>
        '/(site)/(tailwind)/tailwind/core/[slug]': RouteInfo<{ slug: string }>
        '/(site)/(tailwind)/tailwind/guides/[slug]': RouteInfo<{ slug: string }>
        '/(site)/(tailwind)/tailwind/intro/[slug]': RouteInfo<{ slug: string }>
        '/(site)/(unstyled)/unstyled-ui/[...subpath]': RouteInfo<{ subpath: string[] }>
        '/(site)/(unstyled)/unstyled/core/[slug]': RouteInfo<{ slug: string }>
        '/(site)/(unstyled)/unstyled/guides/[slug]': RouteInfo<{ slug: string }>
        '/(site)/(unstyled)/unstyled/intro/[slug]': RouteInfo<{ slug: string }>
        '/(site)/bento/[...parts]': RouteInfo<{ parts: string[] }>
        '/(site)/blog/[slug]': RouteInfo<{ slug: string }>
        '/(site)/docs/core/[slug]': RouteInfo<{ slug: string }>
        '/(site)/docs/guides/[slug]': RouteInfo<{ slug: string }>
        '/(site)/docs/intro/[slug]': RouteInfo<{ slug: string }>
        '/(site)/tailwind-ui/[...subpath]': RouteInfo<{ subpath: string[] }>
        '/(site)/tailwind/core/[slug]': RouteInfo<{ slug: string }>
        '/(site)/tailwind/guides/[slug]': RouteInfo<{ slug: string }>
        '/(site)/tailwind/intro/[slug]': RouteInfo<{ slug: string }>
        '/(site)/theme/[...subpath]': RouteInfo<{ subpath: string[] }>
        '/(site)/ui/[...subpath]': RouteInfo<{ subpath: string[] }>
        '/(site)/unstyled-ui/[...subpath]': RouteInfo<{ subpath: string[] }>
        '/(site)/unstyled/core/[slug]': RouteInfo<{ slug: string }>
        '/(site)/unstyled/guides/[slug]': RouteInfo<{ slug: string }>
        '/(site)/unstyled/intro/[slug]': RouteInfo<{ slug: string }>
        '/(tailwind)/tailwind-ui/[...subpath]': RouteInfo<{ subpath: string[] }>
        '/(tailwind)/tailwind/core/[slug]': RouteInfo<{ slug: string }>
        '/(tailwind)/tailwind/guides/[slug]': RouteInfo<{ slug: string }>
        '/(tailwind)/tailwind/intro/[slug]': RouteInfo<{ slug: string }>
        '/(unstyled)/unstyled-ui/[...subpath]': RouteInfo<{ subpath: string[] }>
        '/(unstyled)/unstyled/core/[slug]': RouteInfo<{ slug: string }>
        '/(unstyled)/unstyled/guides/[slug]': RouteInfo<{ slug: string }>
        '/(unstyled)/unstyled/intro/[slug]': RouteInfo<{ slug: string }>
        '/bento/[...parts]': RouteInfo<{ parts: string[] }>
        '/blog/[slug]': RouteInfo<{ slug: string }>
        '/demo/[name]': RouteInfo<{ name: string }>
        '/docs/core/[slug]': RouteInfo<{ slug: string }>
        '/docs/guides/[slug]': RouteInfo<{ slug: string }>
        '/docs/intro/[slug]': RouteInfo<{ slug: string }>
        '/tailwind-ui/[...subpath]': RouteInfo<{ subpath: string[] }>
        '/tailwind/core/[slug]': RouteInfo<{ slug: string }>
        '/tailwind/guides/[slug]': RouteInfo<{ slug: string }>
        '/tailwind/intro/[slug]': RouteInfo<{ slug: string }>
        '/theme/[...subpath]': RouteInfo<{ subpath: string[] }>
        '/ui/[...subpath]': RouteInfo<{ subpath: string[] }>
        '/unstyled-ui/[...subpath]': RouteInfo<{ subpath: string[] }>
        '/unstyled/core/[slug]': RouteInfo<{ slug: string }>
        '/unstyled/guides/[slug]': RouteInfo<{ slug: string }>
        '/unstyled/intro/[slug]': RouteInfo<{ slug: string }>
      }
    }
  }
}

/**
 * Helper type for route information
 */
type RouteInfo<Params = Record<string, never>> = {
  Params: Params
  LoaderProps: { path: string; search?: string; subdomain?: string; params: Params; request?: Request }
}