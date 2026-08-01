# V3 phase 5 follow-ups

Recorded 2026-08-01 while converging `v3/rip-token-sigil` (see
`plans/v3-rip-token-sigil.md`). None of these block that branch's merge to
`v3-beta`. They are written down so nobody rediscovers them from scratch.

Every "pre-existing" claim below was established the same way: build an
isolated worktree at the pre-rip baseline `c4be9a44c8` with its own frozen
install and root build, then run the same command there. Both arms on the same
branch cannot discriminate a regression, so the branch is the independent
variable.

## Failures that reproduce at the pre-rip baseline

These fail identically at `c4be9a44c8` and on the rip branch. Real bugs, wrong
branch.

1. **`@tamagui/v3-canary`** — `web-canary.test.ts > shares the tree with Vite
   dev and invalidates a cross-file styled value`. `canary-cascade` expects
   `oklch(0.623 0.214 259.815)` (Tailwind blue-500) and gets
   `rgb(124, 58, 237)` (the violet Tamagui token). The element is
   `className="bg-canary-token supports-[display:grid]:bg-blue-500"`, and the
   comment above it says the claimed candidate becomes a Tamagui atom in
   `@layer tamagui` while the Tailwind passthrough utility should win the
   cascade. So a Tamagui atom is beating the passthrough. Baseline and rip
   differ only in timing. The second test in that file never runs because this
   one fails first.

2. **`sandbox`** — two failures, 15 passing, 5 never reached.
   `hydration-drivers.test.ts` expects a pre-hydration computed transform
   containing `matrix` and gets `none`; `ssr-theme.test.ts` times out after
   15s waiting for the theme-light rule to appear in document stylesheets.
   The only difference across the branch is the migrated test title
   (`$theme-light` → `theme-light`), which shows the migration reached the file
   and changed nothing about the failure.

3. **`next15-plus-cli-optimize`** — all 8 tests die on
   `error: Script not found "tamagui"` from `bun tamagui build`. This is a
   harness gap, not a product bug: `node_modules/.bin/tamagui` exists at the
   repo root, but the fixture cwd cannot resolve it. Vitest then reports 5
   obsolete snapshots downstream of the command failures.

4. **`@tamagui/expo-router-starter` `tests/native-smoke.test.tsx:71`** — the
   toast title is absent. Fails at the identical line at baseline.

5. **kitchen-sink native `TooltipToolbarRow`** — 2 tests time out waiting on
   `[data-popper-animate-position]`. Both fail at baseline, retry included.

6. **kitchen-sink `PopoverHoverableReposition`** (default/WebKit) — initial-to-
   final x drift exceeds the 20px threshold: 34.75px at the branch tip, 33.3px
   at baseline. Fails both places, so the threshold is the thing to revisit.

### Not pre-existing, not a regression either

**kitchen-sink reanimated `TooltipToolbarRow` fast-sweep** fails only when three
Playwright projects run concurrently. It was checked against baseline but the
failure could not be reproduced there, and a focused repeat passes 10/10 at the
tip and 10/10 at baseline. That is a load-dependent flake, and it is recorded
that way deliberately: "could not reproduce it either way" is a different claim
from "reproduced it at baseline", and flattening the two is how a flake becomes
a fact.

### Final kitchen-sink state

1482 passed across five projects — 700 default/WebKit, 224 CSS, 141 native,
197 reanimated, 220 motion — with 190 skipped. Down from 25 failures of 1669
scheduled at the start of convergence. kitchen-sink `tsc` is green with zero
TS7056.

## Tests that exist but nothing runs

A test nobody runs is worse than no test, because it reads as coverage. Four
files were found and fixed during phase 5; the fifth is listed for a decision.

- Fixed: `static-tests` globbed `tests/*.web.test.tsx`, so
  `e3-lowerer.web.test.ts` (27 tests, 6 failing) and `e2-parity.web.test.ts`
  (7 passing) never ran. `core-test` globbed `*.web.test.tsx`, missing
  `constants.web.test.ts`; `getSplitStyles.nestedMedia.test.tsx` had no
  platform infix so no script matched it at all (10 tests, 1 failing). Both
  globs are now `*.test.ts*` and the nested-media file is `.native.test.tsx`.
- Fixed: `scripts/gate-audit.sh` **duplicated** the static gate's glob instead
  of calling the package script, so the audit kept reporting 110 tests while
  the package ran 144. The glob now lives only in the package, as
  `test:web:files`.
- **Open:** `.github/workflows/checks.yaml` runs `test:native` filtered to
  `@tamagui/static-tests`, `@tamagui/core-test` and `@tamagui/components-test`.
  Every other package's `test:native` is unreachable from CI, including the
  Expo Router starter's. Decide whether those should run or be deleted.

Both classes have the same root cause: a pattern copied into a second place
silently stops matching when the first one changes. Prefer calling the
package's own script over repeating its glob.

## Bento ships V2 sigil code (different repo)

`code/tamagui.dev/components/bento-showcase/hooks/useReplaceTokens.tsx` still
matches `$`-prefixed values and builds `'$' + token` fallbacks. That hook is
**correct for its input**: the strings come from the private
`github.com/tamagui/bento` repo, concatenated by `scripts/build-bento.cjs` into
`bento-output/merged/**`, uploaded to the Supabase `bento` bucket, and served
through `app/api/bento/code+api.ts`. 199 of 325 files in that repo's
`src/components` still contain `$` strings, including on its own `v3` branch,
and the build script does no token migration.

So Bento will display V2 sigil code against a V3 runtime until the private repo
is migrated. Do that first. Loosening the site regex to match bare names would
hide the problem behind a match that can hit arbitrary literals, and
`mappedTokens` is null until a user uploads their own config, so customization
only makes it worse.

## The codemod emits badly formatted JSX

Ruling 4 makes the codemod the entire migration story, so its output is what
users see. It collapses multi-line JSX prop lists onto one line with broken
indentation. From `code/tests/v3-canary/src/CanaryTree.tsx`:

```tsx
                            testID="canary-root" background="background" gap="4" minHeight="100%" padding="4"
                          >
```

21 of the 49 files failing `oxfmt` in the phase 5 audits are in codemod-touched
directories. Running a formatter afterwards is a fine workaround for this repo,
but a user migrating their own app gets this diff.

## Smaller items

- `scripts/inspect-style-prop-types.mjs` counts token literals by a `$` prefix
  that no longer exists, so `--expect-tokens` always reports zero.
  `plans/v3-type-performance.md` and `plans/v3-static-types-feasibility.md`
  both rely on it. Post-rip there is no syntactic marker separating a token
  from a CSS keyword, so this needs a design answer, not a patch.
- `code/comparisons` is not in the root `workspaces` array, so the Tailwind
  pixel conformance harness (`code/comparisons/conformance`) has no install and
  cannot run. Installing its deps ad hoc pulls Vite 6 while
  `@tamagui/vite-plugin` peers on `^8.0.3`; with the root's Vite 8 the server
  starts but the page reports `Can't find Tamagui configuration` alongside a
  duplicate-instance warning. The Tailwind unit suites (web 456, native 275)
  are green, but the pixel-level check went unmeasured in phase 5.
- Two configs independently paired a v5 config with v6 themes and broke at
  runtime: kitchen-sink (walked back in `e761914e27`) and the Expo Router
  starter (`ba0f262924`, where `theme.red10.val` threw
  `Cannot read properties of undefined`). If a third config does the same, it
  will fail the same way.
