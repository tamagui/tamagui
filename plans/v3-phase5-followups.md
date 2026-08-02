# V3 phase 5 follow-ups

Recorded 2026-08-01 while converging `v3/rip-token-sigil` (see
`plans/v3-rip-token-sigil.md`). None of these block that branch's merge to
`v3-beta`. They are written down so nobody rediscovers them from scratch.

Every "pre-existing" claim below was established the same way: build an
isolated worktree at the pre-rip baseline `c4be9a44c8` with its own frozen
install and root build, then run the same command there. Both arms on the same
branch cannot discriminate a regression, so the branch is the independent
variable.

## Branch consolidation onto v3-beta (2026-08-01)

Per decision 7 in `plans/v3-beta-campaign-plan.md`, everything lands on
`v3-beta`. Seventeen v3 branches were outstanding when that started. The single
fact that explains most of them: **this repo only allows squash merges**, so a
merged branch is never an ancestor of its target. `git merge-base --is-ancestor`
therefore reports merged work as unmerged, and reading that as "seventeen
branches of lost work" is wrong. Check the PR record first.

Merged content, branch already deleted. The PR is the recoverable record:

| branch | tip | how it landed |
| --- | --- | --- |
| `v3/t12-v1-removal-surface` | `3e1de5df1b` | squashed, PR #4137 |
| `v3/t5-docs-migration` | `bb619f1cf7` | squashed, PR #4138 |
| `v3/t7-benchmarks` | `26ca8cd8ee` | squashed, PR #4139 |
| `v3/t3-native-ci-truth` | `d26f4b9b35` | squashed, PR #4140 |
| `v3/t4-state-wiring` | `b0ab83afc8` | squashed, PR #4136 |
| `v3/fix-ssr-hydration-baseline` | `566e5f1e92` | squashed, PR #4095 |
| `v3/remove-inverse` | `0a60f22107` | squashed, PR #4090 |
| `v3/remove-true-literals-snapshot` | `3a013b0065` | squashed, PR #4098 |
| `v3/docs-toggle-migration` | `fd169b062c` | re-applied, no PR |
| `collection/air-24/v3-docs-main-20260731` | `fab16460f4` | re-applied except `release.yml` |
| `collection/air-24/v3-beta-integration-20260731` | `897d5ea242` | already an ancestor |
| `recovery/air24-v3-flat-20260731` | `d7c1df523f` | already an ancestor |

Merged during consolidation, so their history is now in `v3-beta` directly:
`collection/air-24/v3-hook-hazards-20260731` (`20c90a90f4`),
`collection/air-24/v3-compiler-validation-20260731` (`50dd7e4663`),
`release-canary-from-any-branch` (`2d3bf61f40`), and the five-file deprecated
surface removal cherry-picked out of `v3/deprecated-jsdoc-sweep` (`1fbd6d981e`).

Two traps worth remembering, both hit during this pass:

**A clean merge is not a safe merge.** `v3/t7-benchmarks` merged with zero
conflicts and would have reintroduced `$blue3`/`$gray1`. They turned out to be
correct, because they live in `tamagui-v2-bench`, a v2 fixture that exists to be
benchmarked against v3. Check *where* a sigil lands before reacting to it.

**Marker greps produce false SUPERSEDED verdicts.** `resolveTokenSize` exists in
`code/core/size`, but the shipped Button/Select skins still use named size
tables, so `v3-button-sizing` was not superseded. `mediaEmitListeners` exists in
`createComponent.tsx`, but the listener-lifetime fix does not, so
`v3-hook-hazards` was not superseded either. A symbol being present says nothing
about whether the behavior around it landed. Read the diff.

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

## The codemod does not convert token-valued variant props

Found while migrating Button/Select sizing: running the codemod with `--write`
across the consumer sweep reported **0 sites**. Not zero remaining work, zero
recognized work. `size` on a `Button` is a variant, not a style prop, and the
codemod matches style props, so `<Button size="$4">` is invisible to it. Every
one of those mappings had to be applied by hand.

This matters more than the formatting item above. Ruling 4 makes the codemod the
whole migration story, and a component library's most common token-valued props
are variants: `size` on Button, Select, Input, Label, ListItem, and any variant a
user defines that accepts a token. A migrating app runs the codemod, sees a clean
report, and still has `$` values throughout its own components.

The honest framing for anyone writing migration docs: the codemod covers style
props, and variant props are a manual pass. Either teach the codemod the
component's variant surface (the manifests already declare it) or say so plainly
in the guide. Reporting `0 sites` while real sites exist is the worst of the
three options.

## A missing workspace bin silently runs another repo's CLI

Nine package scripts invoke the CLI as bare `tamagui generate-themes` / `tamagui
generate-css` (`code/core/config`, `code/core/themes` x5, `code/tamagui.dev`,
`code/tests/configs` x2). Bins hoist to the root `node_modules/.bin`, so no
workspace package has a local one, and the call depends entirely on the runner
prepending the root bin directory.

When that does not happen, the script does not fail. It falls through to `PATH`
and runs whatever `tamagui` it finds there. On this machine that is
**`/Users/n8/soot/node_modules/.bin/tamagui`, a different repository**, and it
was hit for real while regenerating the v6 Tailwind theme artifact in a fresh
worktree whose install had not exposed the bin. Confirmed by hand afterwards:
`node_modules/.bin/tamagui` exists at the repo root, and `which tamagui` still
answers with soot's copy.

A generate script quietly running another project's compiler produces committed
artifacts that nobody can reproduce. The regeneration above was instead done
through the worktree's own package APIs (importing `generateThemes` /
`writeGeneratedThemes` from `@tamagui/generate-themes`) and verified byte-stable
across a repeat, so the committed artifact is sound. The scripts were left as
authored.

Same root cause as the `next15-plus-cli-optimize` failure above, which dies with
`Script not found "tamagui"` from a fixture cwd. One reports loudly, the other
does not report at all. The fix belongs at the invocation, not at either
symptom: resolve the workspace bin explicitly rather than trusting `PATH`
lookup. Changing all nine together keeps one spelling; changing one is how the
repo ends up with two.

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
