# Lane B: tamagui.dev site chrome

Repo: `~/tamagui`, branch `v3-beta`, shared checkout. Work directly on `v3-beta`.

You own ONLY these areas: `code/tamagui.dev/components/`, `code/tamagui.dev/features/site/`,
`code/tamagui.dev/features/docs/` (topbar/header/quicknav only), `code/tamagui.dev/app/` page files
for the homepage, `code/tamagui.dev/public/fonts/`, the site font config.

You do NOT own: `code/ui/*`, `code/core/*`, `code/demos/*`, `code/tamagui.dev/data/docs/**`.
Another lane owns docs content and the docs sidebar route list. If you need a change there, say so in
your report instead of making it.

REVIEW: none - reviewed as part of the v3 polish wave.

## Tasks

1. **Topbar sizing.** The `core / ui / theme` segmented switcher in the topbar reads a touch too small.
   Bump it one step. Same for the light/dark/system scheme icon button, it is too small.

2. **Search button theme.** The search button in the topbar should be `theme="accent"`.

3. **Homepage hero spacing.** Under the line "The style engine that feels great on native and web."
   there is too much space. Tighten it.

4. **Homepage buttons with no border, ever.** The GitHub button and the "Copy agent prompt" button must
   have no border in any state, including hover. Not a transparent border, no border.

5. **Get started split.** The single "Get started" button becomes two buttons:
   - "Style"
   - "Components"
   Both keep the same trailing arrow the current button has, and both render inversed (the high
   contrast treatment the current primary button uses). "Style" links to the style/core docs entry,
   "Components" to the UI docs entry. Also make sure these two have no border either.

6. **Rename core -> style in site copy and routes-facing labels.**
   - Topbar segmented control: `Core UI` becomes `Style Components`. (It is one control with two
     halves; the left half is currently labeled for core, the right for ui.) Read the component and
     apply the rename so the left reads `Style` and the right reads `Components` if that is how the
     control is built; if it is a single label string `Core UI`, make it `Style Components`.
   - Docs sidebar/header label `Tamagui UI` becomes `Tamagui Components`.
   Do NOT rename the npm package `@tamagui/core` or any import path. This is copy only. Route renames
   are a separate lane; leave `/docs/core/*` URLs alone.

7. **Tamagui / Tailwind toggle gets an animated roving indicator.** On the homepage there is a
   Tamagui vs Tailwind switch. Give it a sliding/roving active indicator that animates between the two
   options. It must be SSR safe: the server-rendered markup and the first client render must match, so
   drive the indicator position from the same state the server has (CSS transform driven by which item
   is active, not a measured pixel offset applied in an effect). Measuring in `useEffect` and setting
   state is what causes hydration mismatch; do not do that. If you must measure, render the indicator
   with a CSS-derived default that is correct on the server.

8. **Contrast font.** Bring over the Contrast typeface from `~/soot` and use it as the site body/UI
   face, including its loading strategy.
   - Copy `~/soot/public/fonts/contrast-wght-normal.woff2` and `~/soot/public/fonts/contrast-OFL.txt`
     into `code/tamagui.dev/public/fonts/`. Also copy the two Inter italic woff2 files it pairs with
     (`inter-latin-wght-italic.woff2`, `inter-latin-ext-wght-italic.woff2`) since Contrast has no
     italic of its own.
   - The `@font-face` block to mirror lives in `~/soot/src/site/contrast-root.css` around line 239.
     Contrast is a single variable file, `font-weight: 100 900`, `font-display: swap`.
   - Copy the preload approach from `~/soot/app/_layout+ssg.tsx` around line 89: a
     `<link rel="preload" as="font" type="font/woff2" crossOrigin="anonymous" fetchPriority="high">`
     for the woff2, emitted in `<head>`. The `fetchPriority="high"` matters, the comment there explains
     why (One emits ~74 low-priority modulepreloads first and fonts otherwise start ~400ms late).
   - Wire it into the site's Tamagui font config so headings and body use it. Keep the existing mono
     font as is.
   - Include the OFL license file in the public dir, as soot does.

## Validation you must do

- Run the site: `cd code/tamagui.dev && bun run dev`. Check the log for the port.
- Screenshot the homepage and one docs page with headless playwright, before and after, and describe
  what changed. A screenshot is the only acceptable evidence for the visual items.
- For the roving indicator, load the page with JS disabled or read the SSR HTML via
  `curl -s <url> | rg -o 'indicator[^"]*"[^"]*"'` style checks and confirm the server markup already
  places the indicator on the active item. Then load it in playwright and confirm no React hydration
  warning appears in the console.
- At repo root run `bun run lint`. Fix only files you touched; report any failure in a file you did not
  touch and leave it alone.

## Reporting

Label every causal claim RAN / TESTED / INFERRED / GUESSED. Commit narrowly with explicit pathspecs
(`git add <paths> && git commit -m "site: ..." -- <paths>`), one line per commit, `site:` prefix. Pull
with `git fetch && git merge --ff-only origin/v3-beta` before you commit. Push when green. Report back
to your spawner with: what changed, files, validation, what is still open.
