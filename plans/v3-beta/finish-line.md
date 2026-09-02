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
- 2026-09-01 (day 1, evening): Detox `ThemeMutation` red traced to the Metro
  compiler: `<Square size={100} />` lost its `size` variant because the host
  derived Square's config from the graph-visible dist literal
  `styled(YStack, {...}, { memo: true })`, which compiler-core misparsed as the
  class-string form, and that derivation beat the evaluated registry config.
  Fixed at the source (`744b5b7294`): the object form with a third argument is
  parsed and its static config folded in, an evaluated config now beats a
  literal-derived one, and discovery evaluates package specifiers only (app
  modules are the graph's job). The zero-runtime starter baseline moved by 3
  gzip bytes from class order and was re-recorded (`6be2a974c1`). Takeout and
  team-machine migrations landed their receipts; the codemod now rewrites
  `Sheet.Frame` to `Sheet.Container` + `Sheet.Background` (the source-only
  script is gone) and the docs stop pointing at it. Workers: soot migration
  (r18015), team-machine GUI test-drive with light/dark pixel diffs (r18019),
  chat (r17284), comparison repo (r16846).
- 2026-09-01 (day 1, afternoon): beta `3.0.0-beta.891.1` published from
  `dc8a609e9f`; the comparison re-run on it is assigned (r16846). The codemod
  now converts the size-typed variant props (`size`, `elevation`, `iconSize`)
  and `defaultVariants`, writes `$true` as `4` on style props with a
  `legacy-true-token` warning and as the boolean on those variants, and keeps
  comment indentation on rewritten members. The web heavy/animated comparison
  outlier is explained: every dynamic className form in the tailwind bench
  (template literal with an expression, conditional className, `style={{
  width: expr }}`) bails out of the compiler at the tip, while the same
  dynamics on a core `View` lower through lane A. An earlier probe that showed
  a mis-lowered template was a `dedent` artifact (it keeps `\$` raw), not a
  compiler defect.
- 2026-09-01 (day 1, afternoon, compiler): a tailwind View's dynamic
  className now flattens on web when its value is finite: conditionals and
  template-wrapped conditionals lower per branch, and a static array read with
  a dynamic index (`heavyColors[(index + seed) % heavyColors.length]`) lowers
  to a class table keyed by the runtime string; native lowers the conditional
  form per branch. Identifiers resolve by position, so function-scope
  constants fold and a parameter shadowing a module constant is no longer read
  as the module's value. Still open for the heavy bench element:
  `style={{ width: expr }}` bails on every component.
- 2026-09-01 (day 1, afternoon, compiler part C): a `style` object whose
  members do not all evaluate now lowers member by member (static members stay
  on the style layer, each dynamic member lowers like the direct prop of its
  name), and lane A inline styles share an element with per-branch classes
  when they own different CSS properties. The comparison bench's heavy element
  (class template over a static array plus `style={{ width: expr }}`) flattens
  to hoisted shared classes, a class table keyed by the runtime string, and one
  inline width. Precedence is honored the runtime's way: the style layer is the
  highest tier, so a static style member over a dynamic direct prop of the same
  property stays at runtime (a pre-existing hole that lowered wrong is closed),
  while a dynamic style member beside a class on the same property is fine
  because inline style wins in CSS. Chat migration receipt landed (r17284):
  web, tests, and typecheck green on the local tarball; native blocked by an
  upstream abort on `outlineStyle: 'none'` reaching Fabric (Dialog,
  RovingFocusGroup), assigned to r17284 to fix in the native style engine.
- 2026-09-01 (day 1, evening, compiler): the comparison bench's animated
  element flattens. A conditional className under `transition-*` differs per
  branch in inline style rather than classes (the css driver keeps transitioned
  properties inline), so the per-branch lowering now diffs each branch's inline
  style against the base: a value every branch shares hoists into the element's
  style, a value that differs becomes one conditional inline property, and a
  branch program whose classes all hoisted is dropped instead of emitting an
  empty ternary. Class-table entries (array read by index) whose leaves differ
  in inline style still bail. Pushed as `0bb490118d`; the compiler stats on the
  bench should read 14 found, 14 flattened, 0 bailed on the next beta. The
  codemod gaps found on chat (false host warnings under `onlyAllowShorthands`,
  silent legacy keys inside an unopenable spread, report accounting) landed as
  `0899359cb9`.
- 2026-09-02 (day 2, early): beta `3.0.0-beta.907.1` published from
  `ffd2c5feb4` (verified by tarball content: it predates the animated fix).
  Every later push failed the zero-runtime starter size gate on the metro-web
  island (+9 gzip bytes; vite and next unchanged, so the compiler output is
  identical and the growth is the create-menu runtime fix, which metro-web
  does not tree-shake). Baseline re-recorded from CI's receipts. The Maestro
  iOS `Sheet` flow is red on `2b03ce3a87` (the Home list stays on screen after
  tapping Sheet; last green `55e0019330`), assigned to r18019 on its simulator
  before the team-machine pin bump. Team-machine test drive: Finding 3 closed
  as UIKit `UIMenu` behavior (the composer menus are zeego native menus, which
  do not restyle after an appearance change; engine on/off diffs identical),
  two real create-menu defects fixed (`dce5caf065`: no-adapter fallback on
  native, `Menu.Portal` optional again); kitchen-sink's Menu opens on iOS with
  no adapter, so the composer non-presentation is app composition. The
  comparison document is complete at `/Users/n8/tamagui-comparisons`
  (`COMPARISON.md`, clean `4d35a9b`), shared with the owner; the animated web
  scenario still needs a re-run on the beta carrying `0bb490118d` (bench
  should read 14/14/0). Benchmark worker r16846 and soot worker r18015 hit
  provider hard limits until 2026-09-07; soot respawned as a fresh `lg`
  worker on the existing `~/.worktrees/soot-v3` worktree.
- 2026-09-02 (day 2, beta 917.1): published from `af016777b2` and verified
  by tarball content: the animated lowering, the create-menu fixes, and the
  codemod spread flag are all in it. Two release-only failures cost a cycle
  each: the release audit rejected the codemod for a helper named
  `legacySpreadKeys` (the audit forbids the deleted v2 grammar's identifiers
  as substrings in every shipped package but style-grammar; renamed), and a
  Detox shard died in `setup-node` on a runner DNS failure (rerun). The
  Maestro Sheet red was a flake that self-cleared. Assigned on 917.1:
  team-machine pin bump and merge through the push guard (r18019), the
  animated web re-run for the comparison (r16846), soot re-pin (r18696).

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
