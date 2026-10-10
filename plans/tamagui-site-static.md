# Tamagui site static build

Build the v3 site as static assets for the `tamagui-dev` Cloudflare worker. Public
pages and the theme builder remain available without accounts. Build time emits
the Bento source, free themes are bundled with the site, and account, sales,
Supabase, Stripe, and API route code is removed.

Acceptance:

- `bun run build:static` succeeds.
- The deployed asset directory serves `/`, docs, blog, UI, Bento, and theme pages.
- Bento code and the docs theme picker load bundled content with no `/api/*` requests.
- Root lint and the site typecheck pass.

## Article reading and speculative prefetch

Failed speculative route prefetch must preserve the current document, text
selection and scroll. Chunk failures needed by an actual navigation retain skew
recovery. Failed speculative loader results must not suppress that recovery when
the reader subsequently follows a link.

Browser evidence must exercise `/blog/version-three` with failed route artifacts,
ordinary reading and text selection, healthy navigation and an active navigation
failure control. Healthy reading alone does not establish the network condition
behind an intermittent reset.

The repaired site uses One `2.0.0-0.canary.1791616071316`, published from
`blog-prefetch-reset-beta` at `5f6ca1a374c99db19f0ba48fccfb32e8758ca73b`.
The changed source and compiled router modules in that npm artifact match the
validated local package family byte for byte.
