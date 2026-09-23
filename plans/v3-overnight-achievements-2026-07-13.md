# Tamagui v3 — what the fleet achieved overnight (through 2026-07-13 morning)

Accomplishments log for the v3 styling-and-compiler rewrite, compiled from the
fleet's own breakdown (`ab-mriu55kg-47600`) and cross-checked against the git
branches and `plans/v3-evolution.md`. All work happened on `air-24`.

**How the work integrates:** v3 does not merge into `origin/main` (that is the
v2 line, currently `v2.4.5`) or the older `origin/v3-beta` plan branch. It stacks
onto a dedicated integration branch, **`origin/v3-evolution-plan-baseline`**,
currently at `c278a293a4`. Each packet is its own GitHub PR that merges into that
baseline in dependency order.

**Headline:** three plan foundations are already merged and green on the v3
baseline — the shared style grammar plus token-first semantics (A0/A1), the v6
Tailwind-aligned config (A2), and the variant resolver engine (B0). The Vite
compiler evaluation lane (E0) is now merged and green on the baseline, with its
earlier Railway preview 502 root-caused and fixed along the way. The
new `styled()` authoring API (B1) is committed and validated locally, waiting to
replay onto the E0 baseline. The analyzer spike (E1) is written and ready for its
evidence run.

---

## Merged and green on the v3 baseline

### A0 / A1 — shared style grammar + token-first semantics
Merged as `535f8b394e` (PR #4126; 66 files, +6,884 / −1,047).

- Added the dependency-light grammar owner under `code/core/style-grammar/`
  (`candidate.ts`, `registry.ts`, `table.ts` + tests), wired it into the runtime
  (`getSplitStyles.tsx`, `createComponent.tsx`) and into the converter
  (`to-tailwind/src/transform.ts`) so runtime and conversion share one inverse
  contract. The duplicated `to-tailwind` prop/pseudo maps were deleted.
- A1 (same merge) removed the Tailwind-scale / `N*4` assumptions, resolves
  numeric names category-first from the active config, emits token spellings for
  token props (`padding="$4"` → `p-4`) and arbitrary values for raw
  numbers/lengths, and preserves unresolved input instead of inventing dead
  output. Token-category ownership moved to `helpers/src/tokenCategories.ts`.
- **Validated:** candidate/registry + dist-parity suites green including the
  33-case focused grammar suite; runtime web/native round-trip, adversarial
  partition/precedence, arbitrary/state/typography/theme-color/animation/icon
  fixtures green; PR #4126 passed the full GitHub matrix plus Detox, Maestro and
  Railway.

### A2 — v6 config aligned to Tailwind v4
Merged as `c278a293a4` (PR #4130; lane commit `a60638af1b`).

- Replaced the inherited v5 numeric scales with an explicit v6 scale derived from
  a pinned Tailwind v4 source (spacing, size, named radii, z-index, font-size /
  line-height pairs), generated from one source with a drift test. `space` and
  `size` stay semantically distinct even where values coincide, and user `$4`
  overrides still win.
- **Validated:** config build green; web 28/28; native 22/22; generator proof
  3 tests / 26 assertions; exact byte-drift check against `tailwindcss@4.3.0`;
  PR #4130 green across GitHub, Detox, Maestro and Railway.

### B0 — variant resolver engine
Merged as `cc417760a7` (PR #4128; 10 files, +1,752 / −206).

- The closed resolver-key registry, trimmed `|`-union keys, exact-match before
  resolver matching, declaration order, and `any` as the explicit replacement
  for the old global `...`, with matching TypeScript and runtime semantics.
- **Validated:** web/native runtime matrix and type fixtures green; PR #4128
  green across GitHub, Detox, Maestro and Railway.

### to-tailwind foundation
Hardened and integrated into the `535f8b394e` merge (converter + CLI + dist
parity). The converter and runtime now share precedence/value-domain
classification instead of maintaining separate inverse tables. (PR #4125, the
separate `borderWidth={1}` bare-`border` correction, is still open — not landed.)

---

## E0 — Vite ModuleRunner compiler evaluation (merged)

Merged into the v3 baseline as squash `6d184eb827` (51 files, +2,638 / −162).
Exact head `0d92ede647` passed 21/21 terminal statuses (18 success, 3 skipped) —
all integration, Detox, Maestro and Railway green, with public health/root at
200. The remote feature branch has been deleted. The original branch commit chain
(head `0d92ede647`):

**What it does:** evaluates `tamagui.config` and component modules through the
user's real Vite plugin/resolver pipeline via a dedicated `ModuleRunner`
environment, and deletes the old ad-hoc Vite-side loader. The commit chain:
`ca71f70122` ModuleRunner evaluation → `bc252af6ab` shared client/SSR runner
cleanup → `d95be08edb` package-exports/tsconfig-path resolution → `17b89e2425`
browserless config install with host token/media sync → `0dafedf6a6` isolated
Vite serve evaluation → `1be9d97491` bounded side effects + lazy Slider polling →
`a8b9586dd1` configured package-root resolution → `0d92ede647` bind Railway
server to the injected port.

**Validated:** vite-plugin builds green; ModuleRunner contract 7/7; Node 24 dev
SSR/hydration 18/18; Node 24 production SSR/hydration 18/18; exact integration
Playwright 2/2 in 8.0s; config HMR, conditional exports, aliases, monorepo
packages, client/SSR concurrency, teardown cleanup and transform isolation all
fixture-covered.

### The ~600-module regression — fixed
The integration build ballooned to 636 modules and cold dev navigation regressed
from ~6s to ~80s, because `ensureFullConfigLoaded` and dependency-watch
registration were running for every raw transform and dragging the runner through
the broad Tamagui barrel. `1be9d97491` moved full config evaluation and watch
registration behind the disabled / native / non-`.tsx` guards while keeping it
before every real extractable `.tsx` path. After the fix the unchanged 30s
integration test is back to green (2/2 in 8.0s).

### The externalization finding
Workspace symlink realpaths made Vite inline and crawl the entire Tamagui UI
graph, but blindly externalizing bare `tamagui` was also wrong (the top-level
resolve discarded `.external`, then `runner.import()` had no importer and could
not load the bare entry). The final policy externalizes ordinary discovered
scoped packages, keeps `config`/`core`/`slider`/`web` inline, and removes the
configured component roots from both external lists so their direct entries stay
absolute and runnable. Covered in both the serve and owned-build paths.

### Railway preview 502 — root-caused and fixed
The earlier preview built, briefly reported success, then returned
`502 Application failed to respond`. A local exact-artifact reproduction proved
the server was healthy on the port it actually chose: `PORT=3010` was ignored and
One bound its default `3002`, where health and root returned 200 and the process
survived. The fix, `0d92ede647` ("site: bind Railway server to injected port"),
changes `code/tamagui.dev/package.json` to
`one serve --host 0.0.0.0 --port ${PORT:-3000}`. The same artifact then bound only
3010 and stayed alive with health/root 200.

**Railway (resolved):** the replacement deployment `5429537545` for head
`0d92ede647` reached SUCCESS at 2026-07-13T18:58:26Z (public `/api/health` 200 in
0.410s, `/` 200 in 0.824s, 475 KB). E0 then merged with all 21 checks
terminal-green.

---

## Built and validated, not yet merged

### B1 — compound variants, context props, class-string `styled()`
Committed on `feat/v3-b1-styled` as `dd0540ae5d` (styled v3 class overloads) and
`7ace17b40f` (compound variants; 48 files, +3,739 / −572). Adds
`compoundVariants` matching/merge, exact styled-context consumed-key typing, the
`styled(Component, baseClassName, styleOptions?, staticConfig?)` overload
normalized into one implementation, and compatibility migrations across Adapt,
Button, Dialog, Popover, Popper, Sheet, Slider and Toast.

- **Validated locally:** core web build green; focused type fixtures 3 files /
  30 tests green; affected UI package builds green; static/declaration coherence
  review passed.
- **Waiting on:** replay onto the integrated E0 baseline, then full runtime/iOS
  acceptance and its own PR. Deliberately not represented as merged.

### E1 — analyzer decision spike
A source-only spike under `code/compiler/analyzer-spike/` comparing
`yuku-analyzer` against `oxc-parser@0.112.0` plus a Tamagui-owned lexical/module
graph, over the same host-resolved fixtures (token imports, aliased/re-export
chains, spreads, workspace bindings, shadowing, source vs compiled
JSX/createElement, definition/reference spans, trace maps, two-branch
invalidation, fresh-process timing/memory).

- **Status:** passed source/static review; the actual install/timing/memory
  evidence run has not been done yet. Next step is to run it, pick the winner,
  delete the losing adapter, and record the verdict in the plan.

---

## Not started (honestly)

- **B2** — repo-wide mechanical migration to the new variant keys and removal of
  the legacy `SpreadKeys` / `VariantTypeKeys` / `:number|:string|:boolean` /
  bare `...` / context `emptyVariants` paths.
- **C0–C4** — component deconstruction: the generic size primitive, the Button
  pilot, Sheet decomposition, the Select hard case, then the repo inventory
  sweep. Intentionally sequenced after B1/B2; the durable behavior/skin contracts
  are already written into the plan.
- **D0 / D1** — official Tailwind v4 compilation for unclaimed web classes
  (consuming A0's `classifyCandidate` boundary), and the deferred native Tailwind
  registry.
- **E2–E5** — shared element IR / project graph, the Vite compiler frontend, the
  Metro frontend, and webpack/Next adapters + Babel extractor removal.

---

## Held for your go

**Publishing Tamagui `3.0.0-beta.0` is held for explicit owner sign-off.** The
plan's `G0`/`G1` (integrated canary, release dry run) and the owner publish gate
have not been reached. The near-term path is: with E0 now merged, replay and PR B1 onto that baseline,
run E1's evidence and record the analyzer verdict, then B2 and the C-lane.

---

_Compiled by the coordinator from the v3 lead's breakdown (`ab-mriu55kg-47600`)
and verified against the git branches and integration baseline._
