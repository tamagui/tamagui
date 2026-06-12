# Tailwind conformance — status & what's left

Goal: make tamagui's `styleMode:'tailwind'` (shipped via **v6 config**, releasing on the next
tamagui major) a real **Tailwind v4** drop-in, proven by pixel conformance on web AND native iOS.

## Current status (honest)

Harness: `code/comparisons/conformance/` — author one case (real Tailwind classes), render as
real Tailwind v4 (oracle), tamagui-web, and tamagui-native (iOS via Expo Go), crop, pixel-diff.

- **Web: 94%** (115/122) — `run.ts` → `report/index.md`. Oracle = `@tailwindcss/vite` v4.
- **Native: 97%** (116/120) — `run-native.ts` → `report-native/index.md`. Expo Go on a booted sim,
  deep-link remount, `#cfm-root` self-measures (`measureInWindow`) and POSTs its rect to the harness
  (`:8090`) which crops the screenshot exactly.
- 122 cases; `cases.tsx` is the single source.

The remaining fails split into REAL conversion gaps (worth closing) and INHERENT model differences
(not bugs — see below). Native is the *honest* conversion test (no CSS fallback). Native's looser
6% tolerance lets `rounded-t-*` / `border-t-*` squeak by at small sizes even though they don't
truly convert — web (1% tol) exposes them.

v6 config (`code/core/config/src/`): `v6-tailwind-palette.ts` (289 colors, generated from TW v4
oklch→sRGB hex via `gen-palette-v4.ts`), `v6-tailwind-tokens.ts` (v4 radii), `w/h` shorthands.
Conversion in `code/core/web/src/helpers/getSplitStyles.tsx`: scale (N×0.25rem), palette/named-radii
via tokens, named utilities (flex-row/col/wrap/1, hidden, relative/absolute, border), min/max
prefixes, sizing keywords/fractions, align value-aliases.

## Harness gotchas (cost real time — read before running)

1. **Expo Go caches its JS bundle.** After editing `cases.tsx`, NEITHER Fast Refresh NOR
   `simctl terminate host.exp.Exponent` + `openurl` refetches — the device keeps the OLD bundle.
   The tell: identical `diff %` across runs and `report-native/<case>/native.png` crop dims matching
   the OLD content. **Fix:** kill metro (`lsof -ti:8099 | xargs kill`), start a FRESH metro session
   (`cd native && CI=1 bun run start`), pre-warm with one `curl` of the hermes bundle, then cold-launch
   Expo Go (`openurl exp://127.0.0.1:8099/--/?case=X`) and wait ~30s before `run-native.ts`.
   (Verify metro itself is fresh with the PLAIN-JS bundle — Hermes bytecode string-grep lies via
   suffix-sharing: `…/index.bundle?platform=ios&dev=true&transform.bytecode=0`.)
2. **Web tamagui leg must NOT load tailwind CSS.** `web/src/main.tsx` imports `tailwind.css` ONLY in
   the oracle (`target=tailwind`) branch. If it's global, the tamagui leg's UNconverted classes get
   silently styled by tailwind → real gaps become false passes (this previously inflated web to ~96%).
3. **Auto-width `#cfm-root` is non-comparable** across web (1280 viewport) and native (402 screen):
   a full-width block crops to different proportions. Give padding/gap cases explicit widths
   (`w-24/32/48`) so they're bounded and viewport-independent.

## Inherent model differences (NOT tamagui bugs — keep but understand)

- **margin-collapse** (`margin-inner`, `margin-top-inner`): a plain Tailwind `<div>` is `display:block`,
  so a child's vertical margin collapses and it sits flush at the container top. tamagui/RN containers
  are `flex` and never collapse margins → the child is inset by its full margin. `m-4` converts
  correctly (margin:16); the divergence is the container layout model. Unfixable without making Views
  block (which breaks the RN model).
- **text rasterization** (`text-align-center/right`): tamagui `Text` has its own font stack /
  line-height defaults vs a bare `<span>`, so glyph position differs even web-to-web. Native text
  never pixel-matches a browser → those cases are `skip:['native']`.

## Real conversion gaps — the frontier (close via CONFIG, not carve-outs)

Direction (per design discussion): do NOT add tailwind-only special-case branches in getSplitStyles.
Keep the tailwind→tamagui map 1-to-1 and CONFIG-driven. The clean mechanism is **multi-target
shorthands** — a general tamagui feature (a shorthand maps to one OR an array of props) that tailwind
mode rides on, plus making the generic tailwind parser match the LONGEST shorthand prefix (kebab→camel)
so `rounded-t-xl` parses as prop `rounded-t` (→shorthand `roundedT`) + value `xl` (→`$xl` token),
instead of `rounded` + `t-xl`. This also REPLACES the existing `tailwindPropPrefixes` (min-w/max-h)
special-case, so it's a cleanup, not a new carve-out.

1. **bare `grow` / `shrink`** (`grow-shrink` case): Tailwind bare utilities = `flexGrow:1` / `flexShrink:1`.
   `grow`/`shrink` are already shorthands but have no value → not converted (parser needs a dash).
   Add to the named-utility map: `grow → {flexGrow:1}`, `shrink → {flexShrink:1}` (data, like flex-1).
2. **`inset-x-*` / `inset-y-*`** (`gap-inset-x`): shorthands `insetX:['left','right']`,
   `insetY:['top','bottom']` (spacing scale ×4). Currently only `inset-0` (utility map) converts.
3. **single-side borders** `border-t/r/b/l-*`, `border-x/y-*` (`gap-border-t`): shorthands
   `borderT:['borderTopWidth']`… `borderX:['borderLeftWidth','borderRightWidth']` (raw px like border-N);
   per-side color via `borderTColor`… if desired.
4. **corner-specific radius** `rounded-t/b/l/r/tl/tr/bl/br-*` (`gap-rounded-t`): shorthands
   `roundedT:['borderTopLeftRadius','borderTopRightRadius']`, `roundedTL:['borderTopLeftRadius']`, …
   value resolves to a radius token (`xl`→`$xl`), same as `rounded-*`.

Prereq for all of the above: **shorthands must accept `string | string[]`** (multi-target). That's the
one core change; everything else is config data. Deferred for now (native already ≥90%); not blocking.

## Deferred (decided: leave out for now)

- **lineHeight / rem emission.** Tailwind uses rem; tamagui emits px (== rem at the default 16px
  root, so it conforms — the harness renders at 16px). True rem emission was excluded from the v2
  merge (`645aea813a`) and lives on the `v2-style-compat` branch. Breaking change → fine to revive
  for the next major, but it does NOT move conformance at the default root. Cherry-pick when desired.

## Run

```
# after a fresh root install, install the comparison app deps locally first:
#   cd code/comparisons/conformance/web && bun install
#   cd ../native && bun install
bun code/comparisons/conformance/run.ts                 # web  → report/index.md
# native prereqs (see gotcha #1): FRESH metro session + cold-launched Expo Go
bun code/comparisons/conformance/run-native.ts          # native → report-native/index.md
bun code/comparisons/conformance/gen-palette-v4.ts      # regenerate palette from TW v4
```

## Done

- Promo page at `/tailwind` (`code/tamagui.dev/app/(site)/tailwind.tsx` + `features/tailwind/*`).
  Hero, pixel-conformance proof (featured triple + per-case rows, real harness PNGs in
  `public/tailwind/proof/`, all 0.0% diff), class/prop examples, honest coverage + variants tables.
  Validated by rendering: `one dev` (site), screenshotted light/dark/mobile, doc links 200.
  Run it: `cd code/tamagui.dev && bun run dev --port 3456` then open `/tailwind`.
- Host/query detection for Tailwind docs mode lives in `features/docs/isTailwindMode.ts`.
  Production uses `tailwind.tamagui.dev`; development can use `?syntax=tailwind`.
- Tailwind-specific docs page lives at `/docs/intro/tailwind-mode` and the promo route links to
  `/tailwind/intro/tailwind-mode`.
- Generated comparison output and nested comparison lockfiles are ignored and should not be
  committed. The comparison apps are intentionally not root workspaces, so root installs do not pull
  their Tailwind/NativeWind/Expo dependency sets.

## Not done yet

- Close the 4 real conversion gaps via multi-target shorthands (above) when picking this back up.
- Optional promo-page follow-ups: link the full 122-case report + one real diff image; mobile polish
  on the hero code card.
