# v3-beta engine and release risk review

Reviewed 2026-09-07 at `v3-beta` tip `7fb616872a` (2,119 commits ahead of `origin/main`,
1 behind). Read-only; nothing edited, committed, or published.

Every causal claim below is labeled **RAN** / **TESTED** / **INFERRED** / **GUESSED**.

**Headline:** the branch is in better shape than its history suggests. Lint, the
workspace `check`, and both core suites are green right now, and the code is
genuinely migrated (11 TODOs in the whole web engine, no v2 dual paths of
substance). The risk is not defects-in-hand, it is **velocity**: the core style
engine was rewritten 7 days ago, 121 commits landed in the 5 days when no beta
could publish, and the release pipeline itself was still being repaired
yesterday and today. Nothing here blocks Soot on web. Two things block Soot on
Metro/native.

---

## 1. Churn signal: what is still moving

**RAN** `git log --since='2026-08-17' --format='%ad|%s' --date=short v3-beta`
(791 commits). Classified by conventional-commit prefix.

| week | total | fix | feat | perf | refactor | test | docs | ci | site | chore |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| W34 (Aug 17-23) | 342 | 81 | 26 | 23 | 11 | 47 | 96 | 29 | 4 | 11 |
| W35 (Aug 24-30) | 213 | 54 | 12 | 32 | 34 | 26 | 21 | 8 | 3 | 8 |
| W36 (Aug 31-Sep 6) | 233 | 67 | 45 | 8 | 3 | 26 | 35 | 8 | 17 | 12 |
| W37 (Sep 7) | 3 | 2 | - | - | - | - | - | - | - | - |

**The fix rate is not decaying.** W36 (the most recent full week) has the
highest fix count of the three, and the second-highest feat count. A branch
approaching a cut normally shows fixes falling and feats going to zero. This one
shipped 45 features last week.

**RAN** fix scopes over the same window (`grep -oE '\|fix\([^)]*\)'`), top 12:

```
51 core        16 compiler     8 tailwind      5 native-registry
18 web         13 release     7 comparisons    4 types
10 static       5 style-grammar                4 portal
```

Grouped: **core web style engine (`core` + `web` + `style-grammar`) = 74 fixes**,
3x the next subsystem. Compiler (`compiler` + `static`) = 26. Release mechanics
= 13. Tailwind = 8. Sheet/adapt/select/animations each ≤ 2.

### The engine was rewritten 7 days ago

**RAN** `git show --shortstat 2191f07f02` — `rewrite engine to fix bundle size`,
2026-08-31, **57 files, 2,968 insertions, 3,037 deletions**. The centerpiece is
`code/core/web/src/helpers/getSplitStyles.tsx` at **3,012 lines changed**, plus
`getCSSStylesAtomic.ts` (318), `grammarConfig.ts` (232),
`resolveVariantStyle.ts` (234), and a new `style-grammar/src/runtime/scanFlatValue.ts` (239).

This is the single hottest path in the framework, replaced one week before this
review. It is well covered (see §4) and the suites are green, but a large app
adopting the branch is adopting a 7-day-old engine, not a hardened one.

**Tailwind features were still landing 5 days ago.** **RAN** the W36 log shows
15 `feat(tailwind)` commits on 2026-09-02 alone (fractional flex, native
position geometry, Android drop shadows, inset ring, platform-aware filters,
numeric leading scale). The tailwind frontend is the newest surface on the
branch.

---

## 2. Hot paths: TODO/HACK, dev-only branches, dual paths, v2 residue

**RAN** `grep -rn -E '(TODO|FIXME|HACK|XXX)' code/core/web/src` (excluding
`.d.ts`): **11 total**. For a 3,600-line style engine plus a 2,300-line component
factory, that is clean. Full list of what is in or near the hot paths:

| file:line | note |
|---|---|
| `createComponent.tsx:1074` | `TODO believe we need to set some sort of "pendingState" in case it re-renders` — the only TODO on the render path |
| `helpers/expandStyles.ts:41` | `TODO: need to add borderBlock and borderInline here, but they are alot and might impact performance` — logical border properties unimplemented |
| `helpers/resolveNativeUnits.native.ts:130` | calc() regex handles only `+`/`-`, not `*` |
| `helpers/insertStyleRule.tsx:13` | merge two selector registries |
| `helpers/expandStyles.ts:14` | deprecate for web-style shadows |
| `views/Theme.tsx:75` | React 18 clone, deprecate after 18 |
| `eventHandling.native.ts:236` | hitSlop / delayLongPress |
| `types.tsx:1230,1490,1600,2662` | type-level TODOs, not runtime |

### Dev-only branches that could differ from prod

**RAN** `grep -rn "process.env.NODE_ENV" code/core/web/src` → 130 sites. Nearly
all are `time\`...\`` instrumentation guarded by
`NODE_ENV === 'development' && time`, which is dead in prod. Three are worth
naming:

- **`createComponent.tsx:328`** —
  `const internalID = process.env.NODE_ENV === 'development' ? React.useId() : ''`.
  A conditionally-called hook. Stable within a build (NODE_ENV is constant), so
  React is satisfied, but dev and prod have different hook counts on every
  component. **INFERRED** (read the line; did not construct a failing case): this
  is safe as written, and only becomes a bug if anything ever compares hook
  indices across a dev/prod boundary.
- **`helpers/insertStyleRule.tsx:65`** — `if (process.env.NODE_ENV === 'test') return`
  inside `scanAllSheets`. **The stylesheet dedup scan and theme collection do not
  run under test.** So the unit suites never exercise the sheet-scan path that
  production uses to hydrate theme values from a CSS artifact. That path is
  covered only by the Playwright/SSR jobs.
- **`createComponent.tsx:350`**, **`getSplitStyles.tsx:566`**,
  **`helpers/skipProps.ts:27`** — `NODE_ENV === 'test'` branches adding
  `data-test-renders` accounting and a `jestAnimatedStyle` key. Small and
  contained.

### Dual paths (the repo's "one path" rule)

Two genuine forks, both deliberate:

1. **`styleCompat`** (`'legacy' | 'react-native' | 'web'`). **RAN** grep across
   `code/core/*/src`: only **9 sites** —
   `web/src/types.tsx:1228` (type), `config/src/settings.ts:20` (default `'web'`),
   `web/src/config.ts:83` (read), `getSplitStyles.tsx:1008,3167,3184`,
   `expandStyle.ts:74,78`, `cli/src/migrate.ts:380` (docs). Well contained; it is
   the v2 flex/position escape hatch and it is documented in the migration CLI.
   Not a smell at this size.
2. **CSS-class path vs inline path.** **RAN** `getSplitStyles.tsx:2725-2735`:
   `emitProperty` ends with
   `if (canGenerateCSS && (state.flatShouldDoClasses || shouldPromoteAnimatedStyle)) { writeStyleRecord(...); return }`
   and only otherwise falls through to `streamWriteInline(...)`. So the two paths
   still execute different code and `mergeStyle` (`:1901`, called from `:1404`
   and `:2244`) does not run on the web class path. This is the exact structure
   `plans/v3-beta/v3-consolidated-review.md:449-471` flagged, and the 8/31
   rewrite did not unify it. **INFERRED**: for a mixed compiled+runtime app this
   is the surface where a compiler/runtime disagreement would show up as a
   hydration or cascade difference. It is mitigated by
   `code/comparisons/conformance` and `core-test/parserAgreement.web.test.tsx`,
   both of which are green.

### v2 residue

Close to none. **RAN** the 8/31 rewrite deleted `helpers/directStyle.ts`,
`clauseIdentity.ts`, `clausePrecedence.ts`, `propMapper.ts`, and
`useComponentState.ts` from `code/core/web/src/helpers` — the entire "deletion
pool" the consolidated review listed. The only half-migration left:

- **`code/core/web/src/config.ts:83`** —
  `return (config?.settings.styleCompat ?? (config as any)?.styleCompat) || 'web'`.
  Reads both the v3 `settings.styleCompat` and a v2-shaped top-level
  `styleCompat`, with an `as any` cast. One line, one property.
- `createComponent.tsx:902,1007` reference RN's `nativeProps_DEPRECATED`, which is
  React Native's deprecation, not Tamagui's.

### A hard runtime limit worth knowing before Soot's factory generates UI

**RAN** — I imported the built grammar and called it directly:

```
$ node -e "import('.../style-grammar/dist/esm/runtime/clausePrecedence.mjs')..."
depth const = 5
5 conditions: OK
6 conditions THREW: a flat value clause supports at most 5 non-platform conditions; received 6
```

`code/core/style-grammar/src/runtime/clausePrecedence.ts:28-34` and `:131-137`
**throw** above `grammarMaxNonPlatformDepth = 5`
(`src/ast/valueTypes.ts:43`). In a production build the message collapses to
`❌ Error 004`. Platform modifiers do not count toward the cap.

This is tested and intentional (`core-test/parserAgreement.web.test.tsx:377-388`,
`style-grammar/src/__tests__/clausePrecedence.test.ts:93-98`), and 5 conditions is
plenty for hand-written UI. It matters here because **Soot's factory generates UI
with smaller LLMs**, and a small model asked for a Tailwind-ish class chain will
happily emit `sm:dark:group-hover:hover:focus:active:bg-red`. That is 6, and it
throws at render with an opaque code. **INFERRED**: this needs a generation-side
cap or a caught-and-degraded render in the factory, not an engine change.

---

## 3. Known gaps: open vs closed

Sources read: `plans/v3-beta/finish-line.md` (240 lines, written 2026-09-01),
`plans/v3-beta/v3-consolidated-review.md` (619 lines, 2026-08-27),
`plans/v3-handoff-log.md` (tail), `docs/v3-launch-review-2026-09-04.md`
"What looks incomplete", plus the 43 `plans/`+`docs/` markdown files touched
since 2026-08-24.

| # | item | source | status | evidence |
|---|---|---|---|---|
| 1 | Consolidated review's "deletion pool" (`directStyle`, `clauseIdentity`, `propMapper`, `useComponentState`, 5 redundant `scanFlatValue` sites) | consolidated-review:474 | **closed** | **RAN** `ls code/core/web/src/helpers/` — all five files gone; folded into `getSplitStyles.tsx` by `2191f07f02` |
| 2 | `usePresence` unconditionally pulls `animate-presence` into every app | consolidated-review:510 | **closed** | **RAN** `useComponentState.ts:86` is now `animationDriver?.usePresence?.(curStateRef) \|\| null` — driver-provided, not a static import |
| 3 | Compiler retention defects (3 known) | finish-line gaps table | **closed** | `plans/v3-beta/compiler-retention-receipt.md` tail records 12 live-value controls in `tests/nativeClausePrograms.native.test.tsx`; deliberate retentions are named |
| 4 | team-machine `nativeStyleEngine` render/native props split not upstreamed | finish-line "Downstream pins" | **closed** | **RAN** `code/core/web/src/helpers/nativeStyleEngine.ts:127,129,176-191` — `renderProps` and `nativeProps` are separate fields on `ResolvedMappingState` |
| 5 | 26 `main` commits not in `v3-beta` | finish-line gaps table | **closed** | **RAN** `git rev-list --count v3-beta..origin/main` = **1** |
| 6 | Tarball audit rejected `@tamagui/style-grammar` (`src/__tests__` shipped); beta stale at 831.1 | finish-line "Where things are" | **closed** | **RAN** npm `beta` dist-tag = `3.0.0-beta.1093.1`, published 2026-09-07T14:23Z |
| 7 | CSS and inline paths execute different code; `mergeStyle` dead on web class path | consolidated-review:449 | **open** | **RAN** `getSplitStyles.tsx:2725-2735` still returns from `writeStyleRecord` before `streamWriteInline`; `mergeStyle` called only at `:1404`/`:2244` |
| 8 | Shorthand vs longhand output slots unspecified (Gemini item D, "real and unaddressed") | consolidated-review:436,505 | **unknown** | the rewrite replaced the file the finding cited; I found `styleSlot`/`classifyStyleSlot` at `getSplitStyles.tsx:2132-2138` but did not verify the ordering contract. Not re-audited post-rewrite |
| 9 | Native V2-vs-V3 12-sample benchmark campaign never ran | finish-line gaps table | **open** | see §5 — the extracted comparisons repo has native numbers, but no v2-vs-v3 native arm |
| 10 | Bundle: styled-view fixture is +2,697 gzip (+10.6%) over v2 | finish-line gaps table | **open, and larger now** | **RAN** ledger tail: v3 = 28,797 gzip; `bundle-size-ledger.md:216-217` corrects the v2 comparator to 25,523. Delta is **+3,274 gzip (+12.8%)** |
| 11 | `plans/v3-beta/finish-line.md` phase 3 item 10 (attack the +2.7K) — "owner decision" | finish-line:Plan | **open** | no decision recorded in any doc touched since |
| 12 | Handoff-log bundle campaign target (parser cluster ≤1,000 gzip, target 800) | `plans/v3-handoff-log.md` tail | **open, missed ~5x** | doc's own words: parser cluster at **4,707** against a 4,706 baseline, "**Even the favorable result remains far above the <=1,000 report gate and 800 target**"; "IV-c is paused pending the owner's continuation decision" |
| 13 | Launch review: "a single current release narrative" — `docs/v3-beta-state-of-the-release.md` dated July 19 and stale | launch-review "What looks incomplete" #1 | **open** | **RAN** the file was touched since 2026-08-24 but still carries superseded compiler/sizing/perf sections |
| 14 | Launch review: perf claims outrun evidence ("faster in every case" unsupported) | same, #2 | **open** | `plans/v3-beta/runtime-corpus-receipt.md:33,38` — total corpus **0.79x** (v3 faster) but **clause strings 1.22x** (v3 slower). "v3 beats v2" is not true for clause strings |
| 15 | Launch review: sizing fallback did not match the approved contract | same, #4 | **closed** | launch-review:293-296 records the bounded fallback (authored name → configured default → token `4`) plus its regression test |
| 16 | Launch review: consumer migration is a separate acceptance gate; Soot branch is "inventory, not evidence" | same, #7 | **open** | `plans/v3-beta/soot-migration-receipt.md` exists; finish-line records the soot worker hit provider limits and was respawned. No merged-and-validated Soot receipt |
| 17 | Codemod does not rewrite v2 `'...size'` / `':number'` functional variants | finish-line gaps table | **closed** | finish-line status log 2026-09-01: `5369893f38`, `b5e298c17d` — "every real site in takeout, chat, soot, and 3pc converts automatically" |
| 18 | Docs: no `style()` piece page, no `@tamagui/tailwind` page, `styled.mdx` silent on `.resolve` | finish-line gaps table | **closed** | finish-line status log: `0456f1f5ed` updated docs, skills and blog for the variant system and Tamagui Tailwind |
| 19 | `bun run typecheck` / `lint` / `check` state | CLAUDE.md gate | **closed / green** | **RAN**, see §4 |
| 20 | Stale `gitHead` in every published package.json | found in this review | **open, pre-existing, cosmetic** | **RAN** `npm view tamagui@{2.7.7,3.0.0-beta.924.1,3.0.0-beta.1091.1,3.0.0-beta.1093.1} gitHead` all return `a49cc7ea6b…`, which `git cat-file` cannot resolve after `git fetch --all`. Source is a committed field, e.g. `code/ui/tamagui/package.json:5`. Present on v2 too, so not a v3 regression |

---

## 4. Tests

### Current state — RAN, not quoted from a doc

```
$ bun run lint                       # oxfmt --check && oxlint
All matched files use the correct format.   (5541 files)
3 warnings, 0 errors

$ bun run check                      # deps, unused, tamagui, references, paths, web-types, lsp-pins
☔️ success workspaces valid!
Tamagui dependencies look good ✅
No missing dependencies found!       (210 packages)
✓ no compiler-only path mappings (209 tsconfigs, 213 package.json)
✓ 2080 published entries resolve without react-native (14425 declaration files, 0 exceptions)
✓ @tamagui/lsp pins 8 platform binaries at 2.7.7

$ cd code/core/core-test && bun run test:web
Test Files  83 passed | 2 skipped (85)
     Tests  630 passed | 3 skipped (633)

$ bun run test:native
Test Files  31 passed | 1 skipped (32)
     Tests  339 passed | 7 expected fail | 9 skipped (355)
```

Zero unexpected failures. The native numbers match
`docs/v3-launch-review-2026-09-04.md:431` exactly (339 / 7 / 9), so the branch has
not regressed since that review three days ago.

### Skip inventory — v3-beta is *better* than main

**RAN** grep across `code/` (excluding `node_modules`, `dist`):

| marker | v3-beta | main |
|---|---:|---:|
| `test.skip` | 50 | 62 |
| `it.skip` | 5 | 6 |
| `describe.skip` | 4 | 8 |
| `test.fixme` | 2 | 1 |
| `xit` / `xdescribe` / `.todo` / `test.failing` | 0 | 0 |
| **unconditional** (`X.skip('…'` literal) | **19** | **23** |

Most `test.skip` hits are conditional (`test.skip(cond)`), which is normal
gating. The 19 unconditional skips cluster meaningfully:

- **Native gesture/press, 6 skips** — `e2e/SheetDragResist.test.ts:151,200,340`,
  `e2e/PressStyleNative.test.ts:61` (whole describe),
  `e2e/GroupPressNative.test.ts:15` (whole describe),
  `e2e/SheetKeyboardDrag.test.ts:28` (whole describe). Sheet drag-vs-scroll
  arbitration and native press styling are **not** covered.
- **Pointer events, 2** — `e2e/PointerEvents.test.ts:77,113` (pointerLeave on
  drag-off, capture outside bounds).
- **Sheet/animation web, 4** — `SheetSnapPointsFit.animated:452` (dialog→sheet
  adapt on small screens), `SheetDrag.animated:144`, `SheetAnimation.animated:261`,
  `TooltipAnimation.animated:235`.
- **Compiler, 1** — `static-tests/tests/babel.web.test.tsx:806`
  `test.skip('border with a token extracts correctly')`. A known extraction hole.
- **Core, 3** — `webAlignment.web:326` (shadow* deprecation),
  `componentProps.native:12,23`.
- **Site, 1** — `TamaguiSiteMotion.test.ts:18` (whole describe).

Plus **7 `test.fails`** in `core-test/webAlignment.native.test.tsx:237,250,262,321,330,338,346`
— the "shadow* should be ignored after migration" family. These are the "7 expected
fail" in the run above: pinned known-wrong behavior, not passing tests.

### Flake masking

- **`code/kitchen-sink/playwright.config.ts:106`** — `retries: process.env.CI ? 2 : 1`.
  **A test that fails twice and passes on the third attempt reports green in CI.**
  This is the repo's largest single flake-masking surface and it directly
  contradicts the global contract's "a failing test gets STRICTER" rule.
- `playwright.config.ts:105` `workers: CI ? 2 : 4`, `:108` `timeout: 50_000`,
  `:101` `timeout: 120_000` for webserver start.
- **RAN** no `retry`/`continue-on-error`/`nick-fields/retry` in
  `.github/workflows/*.y*ml` beyond that; native Detox flake handling is documented
  separately (see the pre-existing shard-flake memory).

### Browser coverage is narrow

**RAN** `.github/workflows/checks.yaml:261-330`. `integration-tests` runs
`--project=default --project=animated-css --project=animated-reanimated
--project=animated-motion`, all **chromium**. `integration-tests-webkit`
(`:325-391`) runs only 4 projects, and the workflow's own comment says they are
"**30 tests across 6 files**": `RemoveScroll`, `ProgramCascade`,
`ProgramBlockDelivery`, `SelectMultipleNativeWeb`, `SheetWebKeyboard*`. No
Firefox project at all.

---

## 5. Native: has the "web-only" caveat changed?

**Partly. The caveat is now explicit policy, not an oversight.**

`docs/v3-launch-review-2026-09-04.md:272` records the owner's own clarification:

> "The owner clarified that **only web bundle size is an optimization target**.
> Native correctness remains a validation requirement."

So native *performance* is deliberately out of scope for the cut. What changed
since `finish-line.md` is that native *comparison* numbers now exist — but not
the ones the gap table asked for.

**RAN** `/Users/n8/tamagui-comparisons/COMPARISON.md` (the benchmarks were
extracted out of this repo by `300a4db8de`, `chore: extract comparison
benchmarks`, 2026-09-01):

- **Native Tailwind class coverage is the real gap.** Tamagui Tailwind resolves
  all 23,286 web classes but returns native RN styles for **4,522 (19.42%)**.
  NativeWind resolves **88.04%**, Uniwind **95.99%**. The doc's own caveat: the
  registry is web-only CSS, so this measures accepted surface, not visual
  capability. Named remaining native gaps: **masks, gradients, shadows, rings,
  outlines, logical-direction borders**.
- **No v2-vs-v3 native arm exists.** The doc says "Tamagui runtime and compiled
  arms use different fixture families and are reported separately," and
  "NativeWind and Uniwind share a class fixture." The only native Tamagui number
  is compiled-vs-runtime: **6.82x speedup** on a declared simple-mount warmup
  gate. `finish-line.md`'s "native V2/V3 12-sample campaign" still has not run.
- Web numbers are solid: on the beta-901 shared fixture, compiled Tamagui
  Tailwind had lower mount means than NativeWind and Uniwind for simple, rich,
  group and heavy, with every paired 95% interval below zero. Beta-917 animated:
  compiler flattened **14/14 candidates, 0 bailouts**.
- Build time: Tamagui 1.40s cold / 1.30s warm; NativeWind 4.50 / 2.27;
  Uniwind 0.51 / 0.50; Tailwind CSS 0.29 / 0.30.

### Animation drivers: supported vs tested

**RAN** `ls code/core | grep -i anim` and
`code/tamagui.dev/data/docs/core/animation-drivers.mdx`.

| driver | documented | tested in web CI |
|---|---|---|
| `animations-css` | yes | yes (`animated-css`) |
| `animations-reanimated` | yes | yes (`animated-reanimated`) |
| `animations-motion` | yes | yes (`animated-motion`) |
| `animations-react-native` | yes | **no web project** — native only, via Detox |
| `animations-moti` | not in the drivers doc | **RAN** `ls code/core/animations-moti/` → only a `types` dir. A stub, not a shipping driver |

`code/kitchen-sink/tests/test-utils.ts:4` —
`export const ANIMATION_DRIVERS = ['css', 'reanimated', 'motion'] as const`.
3 of 4 documented drivers get web coverage. The RN driver is exercised only in
`test-native.yml` (Detox iOS + Android).

---

## 6. Bundle: the barrel, the subpaths, and the gate

### The `tamagui` index is still a barrel — and so is its escape hatch

**RAN** `grep -c "export \*" code/ui/tamagui/src/index.ts` = **61**.

**RAN** `code/ui/tamagui/package.json` exports = **30 keys**, of which 25 are
per-component subpaths (`./button`, `./sheet`, `./select`, `./dialog`, …) plus
`./dom`, `./web`, `./native`, `./unstyled`, `./facets`.

**The subpaths do not escape a barrel.** **RAN** the built output:

```
$ head -1 code/ui/tamagui/dist/esm/components/Button.mjs
import { ButtonFrame, ButtonIcon, ..., styled, useButton, withStaticProperties } from "@tamagui/ui";

$ head -1 .../Sheet.mjs   → from "@tamagui/ui"
$ head -1 .../Select.mjs  → from "@tamagui/ui"
$ head -1 .../Dialog.mjs  → from "@tamagui/ui"

$ grep -c "export \*" code/ui/ui/src/index.ts
54
```

So `tamagui/button` trades the 61-`export *` `tamagui` barrel for the
54-`export *` `@tamagui/ui` barrel. **INFERRED** (from the file structure plus
the size receipt below): on a tree-shaking bundler this is free; on Metro the
per-component subpaths buy you approximately nothing.

### The measured cost

**RAN** `code/starters/zero-runtime/size-baseline.json` — one app, one source
tree, built six ways. `src/Dashboard.tsx:1` imports from `'tamagui'`;
`src/islands/DetailsIsland.tsx` imports `Sheet` from `@tamagui/sheet` and
`Button, styled, Text, View` from `'tamagui'`.

| bundler | base jsGzip | islands jsGzip | **island jsGzip** |
|---|---:|---:|---:|
| vite | 60,776 | 60,776 | **92,493** |
| next-webpack | 141,879 | 141,879 | **92,458** |
| metro-web | 62,614 | 62,614 | **367,022** |

**The Metro island is 3.97x the Vite island — +274,529 gzip bytes for identical
source.** The base page (which imports only `Theme, View`) is comparable across
all three, so the divergence is specifically the island pulling the barrel.
`plans/v3-beta/bundle-size-ledger.md` states the mechanism in its own words: a
create-menu runtime fix grew metro-web by +36 gzip while vite and next were
byte-identical, "the compiler output is identical and the growth is the
create-menu runtime fix, **which metro-web does not tree-shake**."

### Is there an enforced size gate? Yes — two, with caveats

1. **`.github/workflows/checks.yaml:69-70`** — `node code/comparisons/check-styled-view-size.mts`,
   inside the `checks` job, which has **no branch condition**, so it runs on every
   push including `main`. It is a proper **ceiling** with 150 bytes of slack
   (`check-styled-view-size.mts:52`) and it refuses to compare across zlib
   versions. Well built.
   **Current headroom is 24 bytes.** **RAN** `styled-view-size-baseline.json`:
   ceiling 28,821; ledger tail records the latest measurement at **28,797**. The
   next feature that touches core will fail this gate.
2. **`.github/workflows/checks.yaml:455-476`** — the zero-runtime starter gate
   (`node scripts/measure.mjs`) and fixture receipts. **RAN** its `if:` — it only
   runs when `github.event_name == 'push' && startsWith(github.ref_name, 'v3')`.
   **After `v3-beta` merges to `main`, this gate stops running.** The same is true
   of `v3-ssr-hydration` (`:391-396`), which is narrower still:
   `github.ref_name == 'v3-beta'` exactly.
   Its thresholds are also `{jsGzip: 0, cssGzip: 0, islandJsGzip: 0}` — exact
   equality, zero tolerance.

**The gates are re-recorded roughly daily.** **RAN**
`git log --since='2026-08-17' | grep -icE "baseline|rebaseline|re-record"` = **32**
in three weeks, including 5 on 2026-09-01 and 4 on 2026-09-03. With a
zero-tolerance threshold this is structurally inevitable, but it means the
starter gate functions as an accounting ledger that records movement, not a
budget that resists it. **INFERRED** from the commit subjects (each names what it
re-recorded and why) — the discipline is genuinely good; the gate design forces
the churn.

### v3 vs v2 runtime size

**RAN** `bundle-size-ledger.md:216-217` — a freshly built v2.6.2 comparator on
the same Vite 8.2.2 measures **25,523** gzip-9. Current v3 styled-view fixture is
**28,797**. Delta: **+3,274 gzip (+12.8%)**. This is a fixed floor cost, not
per-component, so it amortizes to nothing in a large app. Worth knowing, not
worth blocking on.

---

## 7. Verdict: top 10 risks for putting Soot on v3

Ranked by expected cost to a single large app with an LLM-driven UI factory.

| # | risk | evidence | blocking? |
|---|---|---|---|
| 1 | **Metro does not tree-shake the barrel; per-component subpaths do not fix it.** `tamagui/button` → `@tamagui/ui` (54 `export *`). Metro web island 367,022 gzip vs 92,493 on Vite for the same app. | **RAN** `size-baseline.json`; **RAN** `head -1 dist/esm/components/{Button,Sheet,Select,Dialog}.mjs` | **Blocking if Soot ships on Metro/Expo.** Fine to proceed on Vite/webpack — there the barrel shakes and the island is 92 KB. Decide which bundler Soot targets before adopting. |
| 2 | **Clause depth caps at 5 and throws** — `❌ Error 004` in production. Soot's factory generates UI with smaller LLMs that will emit longer modifier chains. | **RAN** direct call on built dist: `6 conditions THREW`; `clausePrecedence.ts:28-34,131-137`; `valueTypes.ts:43` | **Blocking for the factory** until generation caps chains at 5 or the render is caught and degraded. Not blocking for hand-written app code. |
| 3 | **The core style engine is 7 days old.** `2191f07f02` (2026-08-31) rewrote `getSplitStyles.tsx` by 3,012 lines across 57 files, 2,968+/3,037-. | **RAN** `git show --shortstat 2191f07f02` | **Watch it.** Suites are green and the rewrite executed a reviewed deletion plan, but expect a fix tail. Pin an exact beta; do not float `^3.0.0-beta`. |
| 4 | **Fix rate is not decaying and features are still landing.** W36 had the highest fix count of three weeks (67) plus 45 feats, 15 of them `feat(tailwind)` on one day. Core+web+style-grammar took 74 of 204 fixes. | **RAN** `git log --since='2026-08-17'` classification | **Watch it.** This is a branch mid-flight, not a branch converging. Budget for a beta bump cadence, not a one-time pin. |
| 5 | **Playwright retries twice in CI**, so a test that fails 2 of 3 attempts ships green. Sheet drag, native press, and pointer-capture e2e are *additionally* skipped outright (6 + 2 skips). | `playwright.config.ts:106`; **RAN** skip inventory (`SheetDragResist:151,200,340`, `PressStyleNative:61`, `GroupPressNative:15`, `SheetKeyboardDrag:28`, `PointerEvents:77,113`) | **Watch it.** Green CI is weaker evidence than it looks specifically for sheet gestures and native press. Validate those two by hand in Soot. |
| 6 | **Native Tailwind class coverage is 19.42%** vs NativeWind 88% / Uniwind 96%. Missing: masks, gradients, shadows, rings, outlines, logical borders. | **RAN** `/Users/n8/tamagui-comparisons/COMPARISON.md:8-18` | **Blocking if Soot uses tailwind mode on native.** Non-issue on web, where coverage is 23,286/23,286. |
| 7 | **Two CI gates die on merge to `main`.** The zero-runtime starter size gate and `v3-ssr-hydration` are gated on `startsWith(ref_name,'v3')` and `ref_name == 'v3-beta'`. | **RAN** `checks.yaml:391-396`, `:455-461` | **Watch it — cheap to fix.** The styled-view gate (`checks.yaml:69`) is unconditional and survives. But SSR-hydration coverage disappearing at merge is the one that "ships silently" (the consolidated review's own phrase, `:618`). |
| 8 | **Release mechanics were being repaired through yesterday and today**, and no beta published for 5 days while 121 commits landed. | **RAN** `npm view tamagui time` — beta.924.1 on 2026-09-02T07:35Z, then nothing until beta.1091.1 on 2026-09-07T12:30Z; **RAN** `git log --since=2026-09-02 --until=2026-09-07 \| wc -l` = 121; tip commits `d2a4aaa6bf` (release self-export), `2f74eb761e` (tarball), `64a9282e7b` (beta browser install) | **Watch it.** Verify any beta you pin by tarball content, not version string — which is already this team's documented practice. |
| 9 | **CSS-class and inline paths still execute different code**; `mergeStyle` never runs on the web class path. Matters for mixed compiled+runtime rendering and hydration. | **RAN** `getSplitStyles.tsx:2725-2735`, `:1404`, `:1901`, `:2244`; flagged at `v3-consolidated-review.md:449-471` and not closed by the rewrite | **Fine to proceed.** Mitigated by `code/comparisons/conformance` and `parserAgreement.web.test.tsx`, both green, plus the SSR-hydration job (see risk 7). |
| 10 | **The "v3 beats v2" claim is web-only and not universally true**; the +3,274 gzip (+12.8%) floor over v2 is unresolved and its owner decision is still open. | **RAN** `runtime-corpus-receipt.md:33,38` — total corpus 0.79x but clause strings **1.22x slower**; `bundle-size-ledger.md:216`; `finish-line.md` phase 3 item 10 unanswered; handoff-log tail: parser cluster 4,707 vs an 800 target, "IV-c is paused pending the owner's continuation decision" | **Fine to proceed.** A one-time +3.3 KB gzip floor is noise in a large app. Just do not carry the marketing claim into Soot's own perf expectations for clause-heavy code. |

### What is fine

- Code hygiene is genuinely good: **11 TODOs** in the entire web engine, `styleCompat`
  is the only real dual path at 9 sites, and the v2 residue is one line
  (`config.ts:83`).
- **Lint, `check`, and both core suites are green right now** — I ran all four.
  210 packages, no missing deps, no unused, 2,080 published entries resolve
  without `react-native`.
- v3-beta has **fewer** skipped tests than `main` (19 unconditional vs 23).
- The styled-view size gate is well-designed (ceiling not equality, zlib-aware,
  runs on every branch) and the team's measurement discipline is unusually
  honest — the ledger corrects its own stale numbers and the launch review
  lists its own incomplete items.
- The compiler flattens 14/14 on the animated bench with zero bailouts, and the
  three known retention defects are closed with controls.
- `main` sync is current (1 commit behind), and the migration codemod converts
  every real call site in takeout, chat, soot, and 3pc automatically.

### The one thing I would do before committing Soot

Decide the bundler question first (risk 1). Everything else on this list is a
"pin a beta and watch it" item; Metro vs Vite is the one that changes the answer
from "+3 KB floor" to "+275 KB per island," and no amount of subpath discipline
fixes it on the Tamagui side today.
