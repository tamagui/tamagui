# Tamagui site static build

Direction, 2026-10-09:

> "we're moving off of railway"
>
> "we're getting rid of all of the server stuff we're not selling anything anymore"

Build the v3 site as static assets for the `tamagui-dev` Cloudflare worker. Public
pages and the theme builder remain available without accounts. Build time emits
the Bento source, free themes are bundled with the site, and account, sales,
Supabase, Stripe, and API route code is removed.

Acceptance:

- `bun run build:static` succeeds.
- The deployed asset directory serves `/`, docs, blog, UI, Bento, and theme pages.
- Bento code and the docs theme picker load bundled content with no `/api/*` requests.
- Root lint and the site typecheck pass.
