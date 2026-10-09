import type { one } from 'one/vite'

type Redirect = NonNullable<
  NonNullable<NonNullable<Parameters<typeof one>[0]>['web']>['redirects']
>[number]

// shared by the one dev and node servers (vite.config.ts) and by the static
// cloudflare build, which writes them as dist/client/_redirects
export const redirects: Redirect[] = [
  // moved pages; listed before /docs/components/:slug so they win
  ...['/docs', '/unstyled', '/tailwind'].map((section) => ({
    source: `${section}/guides/cli`,
    destination: `${section}/core/cli`,
    permanent: true,
  })),
  ...[
    '/ui/roving-focus',
    '/ui/roving-focus/:version',
    '/docs/components/roving-focus',
    '/docs/components/roving-focus/:version',
  ].map((source) => ({ source, destination: '/ui/focus-scope', permanent: true })),
  { source: '/unstyled-ui/:slug', destination: '/ui/:slug', permanent: true },
  {
    source: '/unstyled-ui/:slug/:version',
    destination: '/ui/:slug/:version',
    permanent: true,
  },
  // llms.txt, llms-full.txt, docs.txt are served by app/_middleware.tsx in dev
  // and written as files by scripts/build-static.ts
  {
    source: '/account/subscriptions',
    destination: '/account',
    permanent: false,
  },
  {
    source: '/docs',
    destination: '/docs/intro/introduction',
    permanent: true,
  },
  {
    source: '/docs/intro/why-a-compiler',
    destination: '/docs/intro/introduction#why-a-compiler',
    permanent: true,
  },
  {
    source: '/docs/intro/agents',
    destination: '/docs/intro/installation#set-up-with-an-agent',
    permanent: true,
  },
  {
    source: '/docs/core/font-language',
    destination: '/docs/core/fonts#per-language-fonts',
    permanent: true,
  },
  {
    source: '/docs/intro/props',
    destination: '/docs/core/view-and-text',
    permanent: true,
  },
  {
    source: '/docs/core/variables',
    destination: '/docs/core/theme#custom-variables',
    permanent: true,
  },
  {
    source: '/vite',
    destination: 'https://vxrn.dev',
    permanent: true,
  },
  // the v3 composable toast replaced the old imperative one, so the
  // temporary "toast-2" page folded back into /ui/toast
  {
    source: '/ui/toast-2',
    destination: '/ui/toast',
    permanent: true,
  },
  {
    source: '/docs/components/:slug/:version',
    destination: '/ui/:slug/:version',
    permanent: true,
  },
  {
    source: '/docs/components/:slug',
    destination: '/ui/:slug',
    permanent: true,
  },
]
