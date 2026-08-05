# Tamagui v3 beta 3 release readiness

Last complete packed preview: `b0bf3f7bef` on the assembled local `v3-beta` tree.
The Android push freeze is lifted and every held commit is on `origin/v3-beta`,
including `b0bf3f7bef`, `41af737b54` and `8ee854df01`. The native fast path batch
landed on top of them, so the current candidate is `ee76ceb69f` and the packed G1
preview is several batches behind it.
Last updated: 2026-08-04.

This is the single blocker list for the beta 3 cut. A checked item means the named
acceptance check passed. Publishing and choosing whether to ship with a documented
correctness gap remain owner actions.

## Cut verdict

**Do not cut beta 3 yet.** Packaging, the whole-monorepo build and typecheck, the default
Expo Router production export, and the static compiler suites are green on the assembled
local candidate. Branch Checks, the native parity device gate, and the docs static-page
fail-open gate remain open. The retained native benchmark cells remain invalid until a
full 12-sample campaign replaces them; that campaign is now unblocked, because the freeze
it waited on is lifted.

Checks is close, and one of its failures turned out to be a real animation bug rather than a
test artifact. The reanimated tooltip red was previously recorded here as a metric that
misreads a starved frame as a teleport. That was wrong: under starved frames the tooltip
really does jump, to `translate: -33,554,430px` for a frame, because reanimated steps its
spring with a negative time delta and the closed-form solution then exponentiates instead
of decaying. The fix is in Tamagui's reanimated driver and is described in the Checks row
below. The other three failures were a dependency range, a fixture migration, and seven
stale test expectations. The packed G1 preview needs a rerun after the native fast path
batch, since it was taken at `b0bf3f7bef`.

Every row is either passed, or pushed and waiting on a CI verdict, or an owner action. The
conditional font variant gap, which was the one item still asking for a ship-or-fix
decision, turned out to be fixed on both platforms on 2026-08-03.

The device gate is the real remaining risk, but it is smaller than this document
recorded until now. READ from the completed Detox log of the run that started
2026-08-05T03:16Z, the last run before `6af1478d7b`:

- **Android produces a signal again.** The `packagingOptions.excludes` fix works: the
  Android app built, the Detox job ran, and it reported per-suite results instead of
  being skipped. The earlier "unverified on a device" caveat on that row is closed.
- **Only six suites fail, across both platforms combined.** `Accordion` (iOS 1/4 and
  Android), `PointerEvents` (iOS 2/4 and Android), `NativeMixedDriver` (Android only),
  `NativeRegistryCorrectness` (iOS auto-discovered and Android),
  `SheetKeyboardFitContent` (iOS 4/4), and `SheetPressRegression` (iOS 4/4).
- **iOS shard 3/4 is green**, so "all four iOS shards are red" is retired.
- **`GroupPressTransitionMatrix` and `PressStyleNative.noRngh` both pass** on both
  platforms. The "seven suite families, one of them never launching" count is retired
  with them. `PressStyleScrollStuck` and `AdaptLiveSlotSpike` also pass.

Three of the six already have fixes pushed that this log predates:
`NativeRegistryCorrectness` by `6af1478d7b`, which commits the generated Detox fixture
so Metro resolves it, and `PointerEvents` by `1811045631` plus `ee76ceb69f`, which add
the `onPointer*` handlers to the native flatten bailout list and correct the case to v6
palette names. The branch run on `ee76ceb69f` is the acceptance check for all three.
That leaves `Accordion`, `NativeMixedDriver`, and the two keyboard-driven sheet cases.

Of those, two are diagnosed and neither is a product defect, so neither blocks the cut.

`NativeMixedDriver` is a **test bug**, owned by m3987. READ of Detox 20.47.0's
`GetAttributesAction.kt`: `getFrame()` puts `view.width` and `view.height` straight into
`frame`, which are raw pixels on Android, while the iOS frame is points. READ of the CI
AVD: `hw.lcd.density=440`, a factor of 2.75, so the case's 40 dp node reports 110 and the
suite's first assertion fails on every Android run forever. This is also why it is the
only suite affected: it is the only one in `e2e` that reads `getAttributes().frame`.
The animation-scale explanation is ruled out independently, because the case has no mount
animation and `waitForHeight` only ever polls final targets, never intermediates. The fix
divides `frame.height` by `frame.width / 120`, using the case's constant 120 dp width as
the device pixel ratio, so it is unit-correct on both platforms with no platform branch
and still catches a real 40-to-160 regression.

`Accordion` is **two independent test-environment bugs**, owned by m3971, and the
accordion itself is correct on both platforms. On iOS the flat-values migration
`cfe12cb080` rewrote the case's width from the pre-v6 `$20` (about 224 px) to the v6
token `20` (80 px). Every label then wraps about three times taller, the default-open
first item pushes the second item's button below the 874 pt window, and Detox refuses the
tap as obscured. Fix `f531d38190` pins `width={224}`; local Detox is 3 of 3. On Android
the workflow set `disable-animations: true`, which zeroes the system animation scales.
READ of reanimated's `NativeProxy.java`: its Android reduce-motion check is specifically
`TRANSITION_ANIMATION_SCALE == 0`, so reanimated disables animations and the suite's
intermediate-height assertions find content already at its final value or unmounted. Fix
`445bbc2a00` keeps `disable-animations: true` and raises only `transition_animation_scale`
after boot, so Detox's sync semantics stay conventional and only reanimated's trigger is
defused. This applies to reanimated-driven suites only; `GroupPressTransitionMatrix` and
`NativeMixedDriver` both use RN's Animated driver, which never consults that setting, so
neither should move when `445bbc2a00` lands and neither is evidence against it.

One piece of log noise to ignore while reading these runs: Metro prints
`metro/resolve-failed: Failed to resolve assert from e2e/PressStyleNative.noRngh.test.ts`
on every platform. The e2e files are Jest-side and never bundled into the app, and that
suite passes, so the message is a graph-walk artifact rather than a failure.

## Blockers

| Status | Owner | Finding | Required evidence to close |
| --- | --- | --- | --- |
| Fixed locally | a2965 | The raw-source Metro fix initially worked only when Metro started from a project-source entry. A clean-cache default Expo Router export produced 2,257 `no-entry` plan misses including the starter's own app files. Graph discovery stopped at the external Expo Router entry and missed its `require.context` app graph. The project-source-entry warmup result therefore did not generalize and remains prohibited in tester-facing performance claims. The corrected graph plans realpathed workspace imports reached through Expo Router's external entry and `require.context`. `Separator.native.js` is correctly planned with zero candidates because it only defines a styled component; app use sites show 9 candidates and 7 flattened. `ToastComposable.native.js`, `Switch.native.js`, and `SheetScrollView.native.js` prove workspace dist modules receive real edits. | Passed on assembled `b0bf3f7bef`: the default Expo Router production export bundled 3,417 modules into a 6.6 MB Hermes bundle, emitted `dist-native`, logged no plan miss, and passed the rendered native smoke. Keep retained native benchmark cells invalid until a full 12-sample campaign replaces them. |
| Documented, deferred post-beta | a2965, decision by a2943 | Metro's transform cache key excludes the lowering-plan generation. A plan change without a source change can therefore reuse stale compiled output in a live `expo start` session or warm CLI build. This is the third incomplete cache-key defect found in the campaign, after platform-ambiguous config bundles and `simpleHash` omitting `hashMin`. Metro provides no per-module cache-key hook, while global invalidation would defeat incremental rebuilds, so the root fix is deferred with coordinator sign-off. | The beta upgrade guide tells testers to restart with `expo start -c`, or clear the app-local Tamagui cache and reset Metro before a warm production rebuild, after changing Tamagui config. The one-time replan costs about 12 ms per module: 27 seconds for the 2,328-module starter and roughly two minutes for a 10,000-module app. Steady-state warm builds remain unchanged at 7 seconds in both measured arms. |
| Fixed locally | a2965 | `compilerHost` previously resolved theme values against the first theme during native flattening, so theme switching broke on fully flattened components. The compiler now preserves theme-backed values as symbolic references through `except-theme` resolution and emits runtime theme reads. | Passed on assembled `b0bf3f7bef`: `themedFlatten.native.test.tsx` exercises the symbolic theme path end to end inside the 63-of-63 native static suite. The native core suite also passes 238 tests with only its seven pinned expected failures. |
| Fixed | this session, m3971 | Native flattening dropped runtime behavior for three prop families, all silent. `onPointer*` handlers were missing from the bailout list, so a flattened bare RN View never fired them (RN's W3C pointer events are flag-gated off, and Tamagui's `usePointerEvents` maps them to touch at runtime). That prompted an audit of every `skipProps` key plus the separately destructured props, run as a probe over the native emit, which found two more. `asChild` flattened: `createComponent` sets `elementType = Slot`, which merges props into the single child and emits no element of its own, while the compiler emitted a real wrapping host view around the child, so the tree gained an element the runtime never renders and the child never received the merged props. `container`, `containerName` and `containerType` flattened: those three compute `isContainer`, which publishes the `'@'` and `'@name'` entries in `AllGroupContexts` that descendant `@sm:` and `@name-sm:` clauses read, so a flattened provider silently breaks every consumer under it. `group` already bailed for exactly that reason, and the asymmetry was the tell. The audit cleared the rest: `space` and `onGroupStateChange` have no live runtime implementation in v3, `untilMeasured` only functions alongside `group` and warns otherwise, and `animatedBy` is already consumed by the compiler. | Passed. `onPointer*` landed as `1811045631`; `asChild` and the container props bail as of the commit carrying this row, with behavioral tests asserting the outer element stays `View` rather than the flattened host. Negative control: the same probe showed all three flattening before the change. Full native static suite is 76 of 76 with no flattening regressions. Web is unverified for `asChild`: the runtime `Slot` swap has no platform guard so the bail covers both, while the container bail stays native-only because web compiles those to CSS container rules. |
| Fixed | a2952 | V5 palette-step names such as `blue10` and `red10` do not exist in the v6 config. A live cross-driver probe computed the missing `blue10` color as transparent on both paths without an error or warning, then exposed different CSS and React Native Web fallback colors. The upgrade guide mentioned palette tokens as a separate migration but did not state that failure is silent. The flat-values codemod preserves `$blue10` as `blue10` because it cannot evaluate custom runtime config or choose the intended replacement. It now emits every preserved v5 palette name as a non-blocking `legacy-palette-token` configuration warning in both reports, while write mode keeps applying safe syntax conversions. | Passed: the published guide has an explicit before/after and silent-failure warning; focused static JSX, dynamic-expression, custom-name, Markdown report, full 92-test, and typecheck coverage pass. |
| Fixed | a2971 code, a2952 docs | Explicit Button and Input sizes in the v6 config resolved through the Tailwind spacing scale, so `size="4"` produced a 16 px frame and `size="3"` a 12 px frame, shorter than their text. The control-height ramp reproduces every v2 component size name and value, including the duplicated 224 px values at steps `16` and `17`; the unsized default is the `4` step at 44 px. Shapes intentionally remain on the config spacing scale. | Passed. The ramp landed as `8ee0cafcf9` and `controlSizes` in `code/core/size/src/index.ts` carries the full v2 table. Measured in the kitchen sink on `a7bf975a27`: `button-skin-default` is a 44 px frame around 23 px text and `button-skin-wide` at `size="5"` is a 52 px frame around 24 px text, against the 20 px frame the original report recorded. The published guide and codemod draft carry the exact mapping and warn earlier v3 beta users to remove compensating oversized keys. |
| Closed | a2952 lint, a2971 hydration, a2965 unit tests | The three Checks failures recorded at `a8d156b150` are all gone at `a7bf975a27`. Lint passes since `8ee854df01`. `v3-ssr-hydration`, which owns `hydration-drivers.test.ts`, ran on the PR #4124 event and passed; it is skipped on push runs by design because its `if` requires `pull_request`. `next15-plus-cli-optimize` no longer appears in the failed-task list, whose only entry was `@tamagui/codemod-flat-values#test:web`. | Passed. Superseded by the Checks row below, which lists the failures that replaced them. |
| Fixed locally, push pending | this session | Checks on `a7bf975a27` has four failures, three deterministic and one load-dependent. `checks`: `@tamagui/native-registry` declared `typescript@^5.9.2` against a repo standard of `~5.9.2`, so manypkg failed the job for every branch. `unit-tests`: the `codemod-flat-values` kitchen-sink corpus gate asserts zero v1 conversion sites and found 3, all in the new `NativeRegistry{Bench,Parity,Showdown}Case` fixtures. `integration-tests (1/3)`: 7 default-project Playwright tests carried pre-v6 expectations, 4 colors (`color9`, `shadow-color`, `light_green` background, `light_blue` `color`/`color10`) and 3 selectors invalidated by the skin restructure and component-theme removal (`.is_Checkbox`, `.is_Toggle`, `.is_SliderActive`). `integration-tests (3/3)`: two reanimated tooltip suites failed their teleport-velocity assertion, at 11.50 to 404.65 px/ms against a 9.0 px/ms boundary, deterministically across both retries. This is a real animation defect, not a starved-frame misread. reanimated stamps `lastTimestamp` from `performance.now()` when an animation starts outside a frame, then steps it on the frame timestamp, which is the frame's start and lags `performance.now()` by the length of a starved frame. `deltaTime` goes negative, `Math.min(now - lastTimestamp, 64)` clamps only the upper bound, and the closed-form spring's `exp(-zeta * omega0 * t)` becomes exponential growth. | Fixed in six local commits on `v3-beta` plus the driver fix. Each expected color was recomputed from `@tamagui/config/v6` and the theme builder rather than read off the render. `applyAnimation` in `code/core/animations-reanimated/src/createAnimations.tsx` now wraps the spring descriptor's `onFrame` and holds the clock monotonic before reanimated's math runs. Receipts from a CDP `Emulation.setCPUThrottlingRate: 10` probe on `TooltipToolbarRowCase`, single sampled node, 7 starved frames over 60 ms in both arms: before the fix the tooltip reached `translate: -33,554,430px` and 2,029,919 px/ms peak velocity, then relaxed back geometrically; after the fix the same probe peaks at 2.3 px/ms. Reverting the fix and clamping `deltaTime` inside `node_modules` instead reproduces the same drop to 1.88 px/ms, which isolates the negative delta as the cause. The 150 px per 60 Hz frame boundary, the shared `tests/utils.tsx` metric, and the synthetic 151 px negative control are unchanged. `bun run check` green, kitchen-sink `tsc` green, corpus back to 0 sites, full default Playwright project 702 passed with one macOS-only screenshot golden. Upstreaming the one-line `Math.max(0, ...)` to reanimated is still worth doing, since every reanimated-on-web spring has this exposure, not only Tamagui's. |
| Five known Android failures, all pre-batch | a2952 baseline | The exact pre-batch SHA `077ab3cb2f` ran Android and failed eight suites. Every failure still present on current candidate `41af737b54` was already red there: `Accordion`, `GroupPressTransitionMatrix`, `NativeMixedDriver`, `PointerEvents`, and `PressStyleNative.noRngh`. The current candidate fixed the baseline's `CompilerExtraction`, `CompilerTernaryActive`, and `ThemeChangeBasic` failures. `AdaptLiveSlotSpike` has flipped across completed runs, while `PressStyleScrollStuck` failed only once and passed both the baseline and current candidate. | The batch introduced none of the five stable failures. Treat `AdaptLiveSlotSpike` as demonstrated flake and do not classify `PressStyleScrollStuck` from its single red observation. Baseline run `30912958881` built Android and executed the job rather than skipping it; its temporary branch was deleted after attribution. |
| Fixed locally | a2952 | The final all-package G1 preview at assembled `b0bf3f7bef` passed: 164 requested and packed artifacts, 8,043 export-condition probes, isolated installation, web production plus SSR browser canary, native Expo export plus runtime test, and 164 generated publish commands carrying the beta tag with zero `latest`. The tarball contains all 16 generated skin subpaths and all 112 declared web, native, CommonJS, default, and type targets. Packed `@tamagui/web` and bundled `@tamagui/core` both contain the native `background` to `backgroundColor` lowering and media-condition tuple resolution. The eight package allowlists retain every runtime, compatibility, platform-extension, declaration, CSS, JSON, bin, and exported file; their reviewed diffs remove only explained build and test files. | Passed. The report is `release-preview.json` under the G1 directory named `tamagui-v3-beta3-g1-b0bf3f7bef`. It states `Release preview only. No publish was attempted.` Rerun after any source or built-byte change. |
| Fixed | a2952, ref authorized by Nate | `create-tamagui` previously cloned the Expo and Remix starters from `main`, whose Expo package still contains placeholder `true` tests. Pointing it at moving `v3-beta` was unsafe because that branch is permitted to be red. Its old shallow cached update used `git pull --rebase`: moving from one tag to another replayed the old tag commit and missed the requested ref, while Git could autostash edits inside the cache. The replacement has one shared release-ref setting and uses only exact fetch plus detached checkout. Nate authorized the annotated `starter/v3-beta.3` tag at candidate `41af737b5416be4bdc9e98089f1b7b94036b2a6e`. | Passed end to end: a clean `create-tamagui --template expo-router` run cloned the tag, detached at the exact candidate SHA, copied the real web and native test scripts plus `@tamagui/config/v6`, installed dependencies, and completed. Main's placeholder `true` test scripts were absent. The source-checkout probe rewrote workspace dependencies to its current `2.6.3` package version; the published beta CLI uses its release-assigned beta version through the same mechanism. |
| Fixed | a2952 plumbing, a2968 Bento | The production site Dockerfile cloned private Bento from a moving branch and ignored its declared ref argument. The ref is a real independent input: Bento's older line still imports removed APIs and fails the v3 site build. Bento `v3-beta` is complete and pushed, and the validated source is frozen at `50432b85cc47de443b640bee0bcf5decd119231e`. A negative control proves `git clone --branch` rejects that SHA; the Docker path and local `TAMAGUI_BENTO_REF` path now both fetch the exact ref and detach at `FETCH_HEAD`. The positive Git probe lands exactly on the SHA with no branch. | Passed: the production docs build against that exact Bento SHA emits all 876 static pages with zero page-generation or template errors, and the three-mode browser check passes 9/9. |
| Fixed | a2968 Bento, a2952 docs | Exact Bento `v3` at `25af842` had 28 callers of the removed curried `createStyledHOC(Component)(render)` signature. Bento had already migrated `.styleable()` to that intermediate form in July, so the current two-argument signature is a second API break on the same export in one cycle. The completed conversion audit reports zero conversion sites and zero legacy condition objects after manual review, including configuration, theme-builder, size, theme-key, and responsive-name fixes. This break was absent from the tester migration instructions; those instructions now include a before/after, and no curried caller remains in the Tamagui repository. | Passed: Bento `v3-beta` is pushed at the frozen SHA above, its production site integration builds, and the migration guide covers the API break. |
| Green, awaiting owner merge | a2952, m3974 | The docs picker portal targeted an element that did not exist, so no syntax control rendered. After restoring it, the control changed URL and cookie while code stayed Styled because query strings cannot select a different prebuilt SSG payload. Static Tailwind routes also compiled Styled because three prose loaders discarded the SSG `path`. The replacement gives Styled, Unstyled, and Tailwind distinct static routes and resolves mode from the SSG path. The same build exposed 11 omitted component pages from four demo names removed or renamed by the v3 migration. One printed those page errors, skipped them, exited zero, and still printed `build complete`; `/ui/checkbox` and `/ui/switch` returned 404. The MDX callers now use the current demo names and valid template sources. | Tamagui passes locally: 876 pages, zero page or template errors, all six current Checkbox/Switch mode URLs return 200, and Playwright passes 9/9 on the guide, Button, and Tabs. One branch `fix/page-build-errors` commit `c9cdfe4` removes both swallowing paths. An intentionally throwing SSG page now exits 1 with workers enabled and disabled; the valid fixture still reaches `build complete`. That commit is now onejs/one PR #747, opened 2026-08-04 against a `main` it merges into cleanly. Both of its jobs are green at head `525f77ca0`, READ from the check-runs API at a terminal state, so the only step left is the merge and that is an owner action. Its `checks` job had been failing on four npm advisories published after `main`'s last green run, none of them related to this fix: `fast-uri` GHSA-7p8r-x3mc-p8w7, `ip-address` GHSA-mwp4-54f8-5fhr, `brace-expansion` GHSA-rgw5-rvv9-x895, and `undici` GHSA-4cwx-7wf7-3272. All four were already pinned in the root `resolutions` at their last vulnerable patch; the pins moved to `3.1.5`, `10.4.0`, `5.0.9`, and `7.29.0` with a refreshed lockfile, all same-major, and no new audit ignore flags. |
| Fixed | this session | Detox run `30948627664` on `a7bf975a27` is the first completed run after the native fast path batch, and the Android app build failed, so `Android Detox Tests` was skipped and the branch has no Android signal at all. `:tamagui_native-registry:mergeDebugAndroidTestNativeLibs` found `lib/arm64-v8a/libc++_shared.so` twice, once from the package's own AAR and once from React Native's. The package compiles with `-DANDROID_STL=c++_shared` while excluding only `libjsi.so` and `libreact_nativemodule_core.so` from packaging. Job-by-job against pre-batch baseline run `30912958881`, this is the only job that changed direction; all four iOS Detox shards were already red at the baseline, so the batch did not break iOS. Full comparison in `plans/v3-android-verdict-a8d156b150.md`. | Passed. `packagingOptions.excludes` now carries the same fourteen-library list `react-native-nitro-modules` uses, confirmed against that file by m3667. READ on a later branch run whose log starts 2026-08-05T03:16Z: the Android app built, `Android Detox Tests` executed instead of being skipped, and it reported per-suite results with four failures rather than a build error. |
| Fixed | a2946 | V3 refused to compile conditional font variants as `local/dynamic-style-value` on web and native, where v2 lowered each branch. Branch lowering is restored on both platforms, so no release decision is needed. Native landed as `ab66499598`, web as `9a15837246`, both on 2026-08-03 and both on `origin/v3-beta`. | Passed, run against the branch on 2026-08-04. `fonts.web.test.tsx` is 3 of 3 and its conditional case asserts the emitted `(compact) ? "font_body" : "font_heading"`, with no `_fs-` class inside either conditional segment because font size is now a family-independent `var(--f-size-*)`. `babel.native.test.tsx`'s `conditional font family lowers per-branch with per-family size resolution` passes, asserting the two branches differ, that the false branch carries its own `fontWeight` of 700, that `stats.flattened` is above zero, and that `diagnostics` is empty. |

## Fixed in beta 3

### Expo starter first render and native smoke

The Expo starter's first web render reached the error boundary with
`Cannot read properties of undefined (reading 'val')` on both the unsynced
`4ac01cd6e7` baseline and a2949's sync branch. It still read v5 theme keys
`red10` and `borderColor` while loading config v6. The web starter now uses
`color9` and `border-color`; a fresh static export, served artifact, and browser
hydration pass.

The native smoke test also searched for a `toast-title` test ID that no component
emitted and expected an animated dismissal to unmount synchronously. It now presses
the real Button handlers, observes the rendered Toast text, and verifies dismissal
marks the live Toast deleted. The production iOS Expo export and interaction pass.

Owner: a2952. Status: fixed, committed, and locally validated.

### Styled skin package exports

Decision 1 was not implemented at the package boundary: all 16 per-component skin paths
such as `tamagui/button` failed with `ERR_PACKAGE_PATH_NOT_EXPORTED` under both browser
and React Native conditions.

- [x] Export entries are generated from the same `discoverSkins()` registry source used to
  emit skin copies. There is no hand-maintained component list.
- [x] `registry:check` rejects package-map drift.
- [x] All 16 paths resolve to emitted `.mjs` files under browser conditions and emitted
  `.native.js` files under React Native conditions. Types point at emitted declarations.
- [x] The web static compiler resolves and lowers `tamagui/separator`: found 1, lowered 1,
  flattened 1, bailed 0.
- [x] The native static compiler resolves and lowers the same generated subpath: found 1,
  lowered 1, flattened 1, bailed 0. This proves the package path reaches the compiler. The
  corrected default Expo graph also plans `Separator.native.js`; its zero candidates are
  expected because that module only defines the styled component, while the app use sites lower.

Owner: a2952. Status: fixed, committed, and locally validated.

### Styled v3 roots and removed v1 surface

- [x] `tamagui` exports the styled Button and composable Toast skin, distinct from
  `@tamagui/ui`'s unstyled exports.
- [x] There are no Button or Toast `src/v1` trees and no active `/v1` or Toast v2 package
  imports in starters, registry output, demos, canary, or kitchen-sink code.
- [x] Built public types do not expose the removed imperative Toast provider/controller
  API. Old API names remain only in explicit before/after migration examples.
- [x] `@tamagui/kit` appears only in planning text that says the package was dropped.

Owner: a2952. Status: passed.

## Baseline build and typecheck

The initial checkout had no local dependencies, so its first typecheck invoked an unrelated
global TypeScript and was not a valid verdict. After `bun install --frozen-lockfile`:

- [x] `bun run typecheck`: passed under the repository TypeScript 5.9.3.
- [x] `bun run build`: 167 of 167 tasks passed. The first baseline run was entirely served
  from exact-hash cache; the export-map rerun rebuilt 7 tasks and reused 160.
- [x] The standard root test graph now builds the package outputs its tests load. The
  `test`, `test:web`, and `test:native` tasks previously depended on `^build:js`, but no
  workspace package defines that task. `@tamagui/static-tests` also imported
  `@tamagui/static` without declaring it, so Turbo could not infer the compiler dependency
  chain. The tasks now depend on `^build`, and the test package declares the direct
  dependency. Turbo's dry graph proves `static-tests -> static -> core -> web`; the standard
  native workflows pass with 116 of 116 tasks and 63 of 63 static tests, then 51 of 51 tasks
  and 238 passing core tests. Historical CI results did not rely on the broken task name:
  the shared install action runs a full `build:js` before the Checks unit tests, focused native
  jobs build the selected app's dependency closure, and the targeted workflow also runs
  `build:js` explicitly.
- [x] Preliminary local candidate `44d5423895` passes root typecheck and all 167 root build
  tasks. All build tasks were served from exact-hash Turbo cache, so this is a graph verdict;
  the final force build and packed-content receipts still determine artifact freshness.
- [x] Final assembled `b0bf3f7bef` force build: 167 of 167 tasks passed, zero cached, in
  24.171 seconds. A sequential root typecheck against those freshly rebuilt artifacts passed.
  The packed-content receipts in the blocker table confirm that the force-built bytes reached
  both `@tamagui/web` and the `@tamagui/core` bundle that inlines it.
- [ ] Branch Checks are green. This remains blocked on the a2949 fixture work above.

## Tester first-run matrix

| Surface | Test | Status |
| --- | --- | --- |
| Expo Router starter, web | Static Expo export, served artifact, browser hydration and themed style | Passed after v6 theme-key fix |
| Expo Router starter, native | Production iOS Expo export plus rendered Toast interaction | Passed after replacing the false Toast assertions |
| Remix starter | Typecheck and Vite production build | Passed after v6 shorthand migration |
| Blank web registry consumer | Install generated skin, drift check, typecheck, production browser smoke | Passed |
| Blank Expo registry consumer | Install generated skin, drift check, typecheck, native interaction and Expo app export | Passed. The corrected default Expo graph plans the skin definition and lowers the app use sites; assembled native static coverage passes. |
| `create-tamagui` frozen clone | Full Expo Router generation and install from `starter/v3-beta.3` | Passed. The cache detached at `41af737b5416be4bdc9e98089f1b7b94036b2a6e`, copied the v3 test scripts and v6 config, installed dependencies, and completed. |

The v3 branch no longer has the T3 placeholder test scripts. Expo, Remix, and both blank
registry fixtures contain real build or interaction commands. The frozen starter tag and
shared release-ref setting now deliver those files to generated tester projects.

## Release channel proof

- [x] The exact beta workflow path was run as a read-only preview with version
  `3.0.0-beta.999.1`. It resolved `Publishing to npm dist-tag: beta` and printed every
  publish command with `--tag beta` before exiting without publishing.
- [x] `scripts/release-publish-tag.test.ts`: 9 passed, 0 failed.
- [x] The relevant dist-tag implementation is byte-equivalent to
  `origin/release-beta-dist-tag` commit `3cecd0b05c`, although that commit is not an
  ancestor of `v3-beta`. Do not reopen this question from ancestry alone.

Runbook footgun: the general-purpose explicit `--tag latest` option intentionally overrides
a prerelease version, and a test pins that behavior. The automatic v3 beta workflow has no
tag input and passes only `--beta` plus a beta version, so its tested path cannot select
`latest`. A human manual release must not add `--tag latest`.

## Version, release notes, and migration state

- [x] A successful push-triggered `Checks` run on the current `v3-beta` tip publishes
  `3.0.0-beta.<github-run-number>.<github-run-attempt>` to the `beta` dist-tag.
- [x] The automatic beta path uses `--skip-finish`, so it creates no version commit or Git
  tag. The immutable npm version and the source SHA from the workflow run are the beta's
  identity.
- [x] The repository has no package changelog. Tester-facing release notes are the Tamagui 3
  post plus the v3 upgrade guide. The post now names flat conditional values, config v6, and
  the three component import surfaces; its placeholder credits section is removed.
- [x] The draft codemod guide is assessed as **not ship-ready**. Its `--write` instructions
  and removed `legacyConditionObjects` statement are corrected, but most implementation and
  corpus claims predate the landed legacy-path deletion and direct-style emitter. Do not
  publish it without a new verification pass. The published upgrade and flat-values guides
  contain the current tester workflow.
- [x] A real Bento migration dry run found 2,113 flat-value sites. The codemod classified
  1,681 as clean, while 412 of 2,052 JSX sites and 20 of 61 `styled()` configuration sites
  need review. That is 432 sites, or 20.4% of the corpus. Proposed conversion still leaves
  legacy condition objects in 63 of 208 files. The published guide now says plainly that a
  successful codemod run is not a completed migration.
- [x] a2968 manually reviewed all 432 flagged sites. Its final source and example reports
  contain zero conversion sites and zero legacy condition objects. The manual tail included
  undefined template branches, dotted size mappings, Pagination dimensions,
  `colorTransparent -> transparent`, kebab-case border theme keys, `alt1 -> level2`, and
  `gt-sm -> gtSm`. This closes the migration corpus itself; the Bento branch build and docs
  integration remain separate acceptance checks in the blocker table.
- [x] The published upgrade guide now covers every removed API surfaced by the Bento audit:
  `createStyledHOC`, Sheet anatomy, `focusable`, `fullscreen`, Text `selectable`,
  `Select.Item index`, `$true`, variant keys, `getSpace` options, `backgroundActive`, surface
  themes, adaptive `color12`, config v4, `defaultComponentThemes`, animations-moti, the Babel
  plugin, and the app-owned Avatar/Tabs/Group skin requirement. Each class has an explicit
  replacement or before/after example.
- [x] The concrete Bento inventory was 28 curried `createStyledHOC` calls, 8 `Sheet.Frame`
  pairs, 16 `fullscreen` tokens, 20 `$true` references, 41 removed variant-key declarations,
  2 `backgroundActive` references, 3 `Select.Item index` props, one shifted `getSpace` call,
  112 adaptive `color12` references, and direct behavior-component imports in 34 Avatar,
  5 Tabs, and 2 Group files. It also exercised Text `selectable`, core `focusable`, surface
  themes, config v4, `defaultComponentThemes`, animations-moti, and the Babel plugin. This
  list is the migration documentation acceptance checklist, not a Bento-only defect list.
- [x] The stale interactive beta instructions in `next.md` now describe the automatic
  workflow, exact version formula, lack of Git finish artifacts, and the manual
  `--tag latest` footgun.

The beta announcement must link the Tamagui 3 post and upgrade guide because the workflow
does not generate a GitHub release or changelog entry.

## Documentation surface

- [x] Migration snippets import styled skins from generated paths such as
  `tamagui/button` and `tamagui/toast`; the compiled migration fixture typechecks.
- [x] Unstyled code transformation derives the current styled skin set from
  `tamagui/package.json` rather than maintaining a second component list.
- [x] The production docs build against frozen Bento
  `50432b85cc47de443b640bee0bcf5decd119231e` completes all 876 static pages with zero
  page-generation or missing-template errors.
- [x] The Playwright three-mode toggle passes 9/9 against production output. Styled,
  Unstyled, and Tailwind use distinct static routes and transformed code payloads on the
  upgrade guide, Button, and Tabs.

## Reproducibility sweep

The following external inputs still move even when the Tamagui source SHA is fixed. They are
recorded for the cut decision; this lane is fixing only the frozen repository refs.

- The beta publish job runs on `ubuntu-latest` with Node `24`, so the runner image and Node
  patch release are not pinned. Its checkout, setup-node, and setup-bun actions are pinned by
  commit, while `actions/cache@v4` is not.
- The Checks and native workflows use moving `actions/*@v4` tags and `ubuntu-latest` images.
  Native CI additionally installs unversioned `detox-cli` and `applesimutils`; iOS pins the
  named Xcode app and Maestro version, while Java `17` still selects a moving patch.
- The site image starts from `node:22` by tag and installs current Debian packages with
  `apt-get`. Bun itself is pinned there. These inputs affect the deployed image even after
  Bento is frozen.
- Incremental beta publishing reads current npm `beta` dist-tags for unchanged Tamagui
  packages. Those values decide which packages are republished and which exact prior beta
  versions are written into dependency manifests. G1 downloads those skipped packages by the
  resolved exact versions, but the resolution is not stored in the source candidate.
- The font and icon generator command clones the moving `generated` branches of
  `tamagui-google-fonts` and `tamagui-iconify`. This happens when a tester explicitly runs that
  generator, not during the beta package build.
- Browser runtime assets such as analytics scripts, demo avatars, and the admin-only jsDelivr
  Supabase script are remote, but the site build does not download them into candidate bytes.

The root dependency graph itself is locked by `bun.lock` with package integrity hashes; the
sweep found no Git dependency or remote tarball entry in that lockfile.

## Known open and deferred work

- **Unowned:** `AdaptLiveSlotSpike` test 2 is flaky on Android and passes only on retry.
  Retry-passed flakes retain no artifacts, so there is no evidence to diagnose. The missing
  retry artifacts are the current observability blocker.
- **Deliberately deferred:** Dialog, Accordion, Slider, and ToggleGroup call
  `withStaticProperties` on components imported from `@tamagui/ui`. This grafts styled
  parts onto the unstyled package's own exports for all consumers. It is not breaking a
  current test, but it contradicts the three-layer package contract.
- **Contributor build artifact follow-up:** `@tamagui/core` bundles the built output of
  `@tamagui/web`. The package dependency and Turbo `^build` edge are already correct, but a
  caller that explicitly filters to `@tamagui/web`, or runs its package-local build, does not
  select reverse dependents. Four lanes consumed stale bundled core bytes after such filtered
  builds on 2026-08-03. The beta release path is not exposed because it runs the full root
  build before packing, and the standard test graph now builds declared dependencies. After
  beta, assess externalizing `@tamagui/web` from the core native bundle so one built copy is
  resolved at runtime. That change needs explicit single-instance and dual-instance native
  consumer probes because changing module resolution in this layer can recreate the split
  package instances that previously broke Toast.
- **Held registry consumers:** the strict final drift gate passes all 32 generated copies in
  the blank web and Expo fixtures. The report-only full sweep still lists 64 missing or
  divergent copies across demos, kitchen-sink, the site, and v3-canary. Those four consumers
  are explicitly marked `writeAuthorized: false` until the campaign chooses to replace their
  existing components with generated copies. This is unfinished generator adoption, while
  the shipped registry artifacts, package exports, and tester install fixtures are current.

## Remaining release-readiness audit

- [x] Finish the starter and registry first-run matrix.
- [x] Finish the three-mode documentation runtime check against the final
  `tamagui/<skin>` exports.
- [x] Audit version automation, changelog state, and the breaking-change/codemod guide.
- [x] Run the packed G1 release preview after all blocker fixes are assembled.
- [x] Re-run root typecheck, root force build, registry drift, export checks, and relevant
  static compiler tests from assembled `b0bf3f7bef`. `registry:check` passes all 16 artifacts
  and exports; the strict authorized-consumer drift gate passes 32 of 32 copies; all 8,043
  packed export probes pass; static native passes 63 of 63; static web passes 157 with two
  skips plus 20 of 20 webpack tests; core native passes 238 with seven expected failures and
  nine skips.
- [x] Pin the production docs Bento input at validated commit
  `50432b85cc47de443b640bee0bcf5decd119231e`.
- [x] Create annotated tag `starter/v3-beta.3` at validated candidate
  `41af737b5416be4bdc9e98089f1b7b94036b2a6e`, point the single starter release-ref
  setting at it, and prove a complete generated Expo starter lands on that exact tag.
- [ ] Obtain explicit owner authorization before any npm publish or ref creation.
