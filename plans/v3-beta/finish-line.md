# V3 beta: finish line plan

Written 2026-09-01 at tip `91e4b4ad2f` (1940 commits past `main`, 26 behind).
Owner session: Fable (r16625). Supersedes the execution state in
`v3-codex-handoff.md`; the design docs it points at still hold
(`single-function-variants.md`, `web-core-split.md`, `bundle-size-ledger.md`).

## Where things are

- CI on the tip is green on all four workflows (Checks, Registry, Detox, Maestro).
- **The beta publish for the tip failed.** Release run `33493520720` packed
  `@tamagui/style-grammar` and the tarball audit rejected
  `src/__tests__/backgroundFamily.test.ts`: its `files` is `["src", "types",
  "dist"]` and the 2026-08-30 tier reorganization moved tests under `src`. npm
  `beta` is stale at `3.0.0-beta.831.1`, which predates all of the
  styled.dynamic phase 2 work. Fix is `!src/__tests__` in that package's `files`.
- styled.dynamic / `.resolve` / `style()` pieces landed in full (phase 1
  `d0b1127537`, phase 2 `40e323361d..0c6d678977`, dev shape validation
  `9fe1449a7b`, compiler lane A `e60920957c`). Legacy spread/type-key/catch-all
  variant machinery is deleted. Every in-repo functional variant is migrated
  (Button, Checkbox, RadioGroup, Select, Switch, Tabs, Card, Group, Input,
  Label, ListItem, Progress, Slider, Spacer, shapes, getElevation,
  get-font-sized; SizableText is the one `.resolve`).
- No worker is active on v3-beta. `p37006` (codex) finished repairing main's
  lint and is idle; `m11297` (the phase 1 Fable session) is unreachable on a
  stale machine.
- Downstream pins: team-machine gui `3.0.0-beta.653.1` with a local patch to
  `@tamagui/web` `nativeStyleEngine.ts` (splits `renderProps` from
  `nativeProps` so `processStyleColors` output does not reach React render
  props) that is NOT upstreamed, and `@tamagui/native-registry` pinned
  separately at `beta.765.1`. takeout and soot are on v2 `2.7.7`, chat on
  `2.4.6`.

## Gaps against "finished, documented, launch-ready"

| area | state | gap |
| --- | --- | --- |
| API | landed, typed, tested | open decisions in `single-function-variants.md` unresolved (per-depth tier interleave, resolver skipping, where `styled.dynamic` lives after the web/core split) |
| codemod | flat values + `$` removal; recognizes `styled.dynamic` bodies | does NOT rewrite v2 `'...size'` / `':number'` / `'...'` functional variants to `styled.dynamic`; upgrade guide says manual |
| docs | `variants.mdx` covers `styled.dynamic` and `.resolve` | no `style()` piece doc, no piece-typed prop docs (`activeStyle`, `contentContainerStyle`), `styled.mdx` silent on `.resolve`, no `@tamagui/tailwind` docs page |
| skills | `tamagui`, `tamagui-upgrade-v3` | neither mentions `styled.dynamic`, `.resolve`, `style()`, or the tailwind frontend |
| blog | `version-three.mdx` 4k words, `tailwind-mode.mdx` | v3 post has zero mention of the variant system; tailwind post carries stale pre-engine numbers (group hover 396 ms vs 18 ms) |
| bundle | styled-view fixture 28,220 gzip, ceiling 28,370 | v2 comparator is 25,523: **+2,697 (+10.6%)**; phase 2 alone was +911 |
| compiler | 2,128 / 2,645 kitchen-sink candidates fully flatten | three known retention defects in `v3-compiler-retention-follow-ups.md`; lane A coverage of dynamics/resolvers on real corpora unmeasured |
| benchmarks | harnesses exist for web (6 arms), native (4 arms + nativewind/uniwind), build time, typecheck | retained cross-framework web numbers are from `398b93155b` vs v2.4.6; native V2/V3 12-sample campaign never ran; no build-time receipt |
| types | v3 typechecks 1.3-1.8x faster than v2; definition regression fixed | no completion-quality probe for object styles (keys, values, variant props) |
| native runtime | native-registry Detox suite green in CI | not exercised on a fresh beta in a real app since 653.1 |
| main sync | merge-base 2026-08-21 | 26 main commits (sheet keyboard, native media driver, ci) not in v3-beta |

## Status log

- 2026-09-01 (day 1): phase 0 done (main merged, native fast path engine
  fixes upstreamed with tests, tarball audit fixed). Compiler discovers
  component packages on demand (`b587feeccf`); `components` is a warm-up
  list. Compiler retention defects closed (`0d664ed254`). Tamagui Tailwind
  utility gaps closed in the shared grammar (`82f2622332`); docs, skills and
  blog updated for the variant system and Tamagui Tailwind (`0456f1f5ed`).
  Comparison apps extracted toward a standalone repo (`300a4db8de`). Runtime
  style pass measured against a real v2 control: v3 is 0.79x of v2 on the
  corpus after two engine rounds, clause paths still 1.2x
  (`runtime-corpus-receipt.md`). Beta publish is gated on push cadence: the
  beta job only publishes when its Checks run belongs to the newest commit, so
  docs pushes on top keep superseding green runs; a main-side `release.yml`
  change is drafted to tolerate docs-only newer commits and waits for the
  owner. Codemod, comparison, and types-probe workers still running.
- 2026-09-01 (day 1, later): the frozen head's Checks failed on the converter
  (`text-[body]` classified as color) and the zero-runtime starter CSS baseline;
  both fixed and the batch pushed as `ea2077c85a`, Checks green, beta release
  running. Functional-variant codemod landed and reviewed (`5369893f38`,
  `b5e298c17d`): every real site in takeout, chat, soot, and 3pc converts
  automatically. Editor type probe landed (`9d96bc2377`): all completions
  present, sub-4 ms, no leaks; `createStyledHOC` now hands render callbacks a
  ref value (local `48cc946e87`). Condition template cache tried and reverted
  (no win, +258 gzip). Migrations started in worktrees on local tarballs:
  takeout (r17171), team-machine (r17281), chat (r17284).

## Plan

Phase 0, unblock (this session, direct):
1. Fix the style-grammar tarball, merge `main` into `v3-beta`, push. A green
   Checks run auto-publishes the next beta.
2. Upstream the team-machine `nativeStyleEngine` patch with a test that pins
   the render/native props split.

Phase 1, finish styled.dynamic cleanly:
3. API review of the landed surface against the design doc; settle the three
   open decisions and record them.
4. Codemod: v2 functional variants to `styled.dynamic<T>`; flag
   `extras.props` reads for a manual `.resolve`. Prove it on the v2 corpora we
   own (takeout, soot, bento).
5. Docs: `style()` pieces page, `.resolve` in `styled.mdx`, piece-typed prop
   docs on Checkbox/Toggle/Tabs/ScrollView, `@tamagui/tailwind` page, upgrade
   guide rows.
6. Skills: both skills learn the variant system and the tailwind frontend.
7. Blog: variant-system section in the v3 post; numbers replaced in phase 2.
8. Types: a tsserver probe that records completions and latency at the
   positions that matter (`styled(View, { | })`, `<View |`, value positions
   for token/theme keys, `styled.dynamic<T>` prop types, `.resolve` props),
   against the default config and a soot-sized config. Fix what it finds.

Phase 2, baselines at one SHA, one receipt doc:
9. Bundle (styled-view fixture, whole-app compiled/runtime, metro islands,
   zero-runtime starter), compiler build time v2 vs v3, flatten rate, web
   runtime all arms, native runtime V2/V3 + NativeWind + Uniwind, typecheck
   perf v2 vs v3.

Phase 3, improve:
10. Bundle: attack the +2.7K (options: web/core split phase 1 moving variants
    behind a carrier package; targeted shaving of the base-piece path; or
    accept with a stated budget). Owner decision, see questions.
11. Compiler: the three retention defects; measure lane A on ui-kit and
    downstream corpora.
12. Tailwind: close the named utility gaps (`text-*` color/size, `font-*`,
    `size-*`, corner radius, side borders, axis insets), re-run the
    NativeWind/Uniwind comparison, fix outliers.

Phase 4, native runtime validation:
13. Kitchen-sink iOS and Android Detox native suites on the cut candidate,
    v3-canary `g0:native`, then the real app (team-machine iOS) on the beta.

Phase 5, cut and roll out:
14. Cut, bump team-machine (drop the patch), validate desktop, iOS, web.
15. takeout, then chat, then soot: codemod + upgrade skill, numbers before and
    after, types checked in-editor.

## Fleet shape

The owner (Fable) does the API review, engine/bundle work, and the merge. Sol
`lg` workers take the codemod, benchmark campaigns, tailwind coverage, and the
LSP probe; Agy `md` takes docs, skills, and blog prose. The codemod gets one
assembled review (it rewrites user code). Everything else ships on runtime
evidence. Receipts go in this directory.
