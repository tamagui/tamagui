# Bento open source in the Tamagui repo

State: wave 1 landed on `v3-beta` and curated to 22 groups and 47 demos;
visual pass and wave 2 next. Worktree `~/.worktrees/tamagui-bento-oss`.
Owner: lane `bento-oss`. `code/bento` is now the source of truth; `~/bento`
is read-only history.

## Why

Today the site builds Bento from a sibling private checkout. That costs:
`scripts/with-bento.mjs` (symlinks node_modules into `../bento`),
`code/tamagui.dev/scripts/generate-bento-proxy.mjs` (writes stub or real proxy
files on postinstall), a Vite stub plugin plus four conditional aliases in
`code/tamagui.dev/vite.config.ts`, a Railway step that clones and pins Bento,
`types/bento.d.ts`, a Supabase storage bucket that serves source text to the
code viewer and `bento-get`, and a duplicate set of hand-written listing files
(`components/bento-showcase/sections/*/data.tsx`). Bento in the repo deletes
all of that and makes Bento typecheck and build with every Tamagui change.

Paid gating is already gone on v3-beta: `d50e101ab8` removed the pro tier and
`690f09f8d7` removed gating from `bento-get`. The `/bento` page already says
"Every component, free and open source. No license, no account."

## Where it lives

```
code/bento/                      private workspace package "@tamagui/bento" (never published)
  package.json                   "private": true; deps resolve from the monorepo
  src/<section>/<group>/*.tsx    one file per component, self-contained, own mock data
  src/<section>/<group>/index.ts barrel for the group
  src/registry.ts                the only list of sections, groups, titles, files (metadata only)
  src/demos.ts                   export names to components, keyed "section/group"
  src/shared/                    the few hooks and helpers components truly share
```

- The directory path is the URL: `src/forms/inputs` is `/bento/forms/inputs`.
  No rename tables, no `product_list` versus `product-list`.
- `registry.ts` holds no component imports, so the SSR'd `/bento` home can read
  it without pulling client-only demo deps; the group page looks components up
  in `demos.ts`.
- `registry.ts` replaces the site's `bento-showcase/sections/*` wrappers and
  their `data.tsx` path lists, and Bento's own `Data`, `Sections` and
  `example/registry.ts`. Each entry names the component, its title, its source
  file and its layout hint (input, short, full width, phone frame).
- A component imports only `tamagui`, `@tamagui/*`, `react`, `react-native`
  and a short allowlist of third-party packages (`@rehookify/datepicker`,
  `@tanstack/react-table`, `react-hook-form`, `zod`). Anything else gets
  replaced or the component is cut. Copied code must work in a user's app, so
  no reaching into site internals.
- Package is added to root `workspaces` as `./code/bento`, so typecheck and
  lint run with the rest of the repo.

## How the site routes keep their structure

- Same URLs and layout: `/bento` home with section grid, `/bento/<section>/<group>`
  with the left sidebar of sections and groups, each component in a Showcase
  frame with preview, size control, theme toggle and code tab.
- `app/(site)/bento/[...parts]+spa.tsx` renders any group from `registry.ts`
  with one generic Showcase loop; the 25 hand-written section wrapper files go.
- Code tab source: `import.meta.glob('@tamagui/bento/src/**/*.tsx', { query: '?raw' })`,
  loaded lazily per file. No API call, no storage bucket, always the code that
  rendered.
- `/api/bento/code` and `/api/bento/cli/v2/code-download` read the same raw
  glob on the server, so `bento-get` keeps working with no login.
- Deleted: `scripts/with-bento.mjs`, `generate-bento-proxy.mjs` and its
  postinstall, the stub plugin and Bento aliases in `vite.config.ts`,
  `types/bento.d.ts`, the Railway Bento clone variables, `getBentoCode` and
  friends in `supabaseAdmin.ts`, `/api/bento/zip-download`.

## First cut

Rule: a component makes it if it is something people actually build, renders
clean in light and dark at 360 and 1280, is keyboard and screen-reader usable,
and holds up next to the shadcn/ui or HeroUI equivalent. Duplicates that only
vary a color or an icon collapse into one with a variant. Gimmicks are cut.

Wave 1: the 25 groups already on tamagui.dev (they are public, migrated to v3,
and the site depends on them). Each group gets culled to its best pieces
during import.

| Section | Groups |
| --- | --- |
| forms | inputs, checkboxes, radiogroups, switches, textareas, layouts |
| elements | avatars, buttons, chips, datepickers, dialogs, list, pickers, tables |
| shells | navbars, tabbars |
| ecommerce | payment, productpage, product-list |
| user | preferences |
| panels | walkthrough |
| animation | buttons, avatars, microinteractions, slide |

Wave 2: new groups from the Bento v2 expansion, in order of how often apps
need them and how far they beat what exists elsewhere. Each lands only after
a visual review and cleanup pass.

1. command (palette), data-grid, toasts, skeletons, empty-states, stats
2. segmented-controls, accordions, settings-cells, steppers, file-upload, search
3. calendar, kanban, ai-chat, menus, carousels, progress, ratings, timeline
4. pricing, marketing sections, social-proof, auth layouts, checkout, quantity, filters

Held back pending review: notifications, onboarding, profile, color-picker,
banners. Cut candidates: anything that only demos an animation trick with no
app use; decided per component when reviewed.

## Curation (applied)

Wave 1 direction: cut hard, keep only what is worth having (the shopping cart
was too basic). Cut 48 demos plus whole groups `elements/buttons`,
`ecommerce/product-list` and `panels/walkthrough`. Rules used: one demo per
idea (input label, left icon, right icon and addon variants fold into "Label,
Help and Error" and "Grouped with Buttons"); no plain layout variations of a
list or checkbox; no demos that only restyle a stock component (plain chips,
plain alert, rounded avatars); no gimmicks without an app use (pulse button,
fancy tooltip, slide out); no thin screens (cart, status tracker, users
table, upload file). What remains is in `code/bento/src/registry.ts`.

`bento-get` (`code/packages/bento-get`) still lists the old component names;
it is left alone until the owner answers the install path question below.

## Owner decisions

- 2026-10-04: cut hard; the shopping cart was too basic, the paywall can stay.
- 2026-10-04: no gray fill behind demos and no fake browser window; each
  demo sits in a hairline border with a small radius.
- 2026-10-04: share less often. Study what HeroUI does best, bring those
  pieces over, clean up what we keep, and cut ugly or low-value demos. Styling
  must follow one system: no input darker than its surface, no light mode
  that reads backwards, nothing styled at random.

## Quality bar (per component)

Measured against shadcn/ui and HeroUI: theme tokens only, state ramps (hover,
press, focus ring, disabled at half opacity, invalid), exit faster than enter,
reduced motion honored, 44pt touch targets, real roles and labels, no fixed
widths that overflow at 360. Prefer Tamagui v3 primitives (`@tamagui/*`
unstyled parts) over hand-rolled ones.

## Validation per landing

- `bun run typecheck` and lint for `code/bento` and `code/tamagui.dev`
- tamagui.dev dev server (and the production build before the first landing)
- headless playwright sweep of touched groups on the site: light and dark at
  360 and 1280, zero console errors, no horizontal overflow
- a side-by-side before/after webp shared per visual milestone

## Paid pieces

- Purchase pages and gating: already removed on v3-beta.
- `bento-get` CLI: keeps working free, backed by the in-repo source through
  the site API (pending the owner's answer on its future, see below).
- Licensing: Bento ships under the Tamagui repo MIT license; its separate
  `LICENSE` is dropped. The "free and open source" copy on `/bento` stays.
- Supabase `bento` storage bucket and `~/bento/scripts/upload-bento.cjs`:
  unused once the site reads repo source. Deleting the bucket is prod infra
  and waits for the owner.
- `~/bento` repo: archive after wave 1 lands (owner's call).

## Open questions for the owner

- Install path: keep `bento-get` (free, no login), fold it into a
  `tamagui add` command, or drop the CLI and copy from the site only.
- Retire the Supabase `bento` bucket and archive `tamagui/bento` once wave 1
  is live.

## Log

- 2026-10-04: wave 1 landed (`5d22564c09`, `e4e3d2c91b`); curated to 47 demos
  with a metadata registry and one generic group page; fixed `style()` pieces
  dropping shorthands (`py`, `justify`, `items` compiled to empty rules), which
  had uncentered every showcase frame.
- 2026-10-04: plan written; worktree `~/.worktrees/tamagui-bento-oss` off
  `origin/v3-beta` `980b3a3803`.
