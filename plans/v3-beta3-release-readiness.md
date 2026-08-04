# Tamagui v3 beta 3 release readiness

Last complete packed preview: `8976311c1e` on the merged `v3-beta` tree.
Current source candidate: `5a0b3d9d59`; its post-allowlist packed rerun was interrupted for
the native timing window and remains required.
Last updated: 2026-08-03.

This is the single blocker list for the beta 3 cut. A checked item means the named
acceptance check passed. Publishing, creating the frozen starter ref, and choosing whether
to ship with a documented correctness gap remain owner actions.

## Cut verdict

**Do not cut beta 3 yet.** The native parity device gate, native theme correctness decision,
branch Checks, frozen starter and Bento refs, completed docs check, and final post-allowlist
packed preview are open. The retained native benchmark cells remain invalid until a full
12-sample campaign replaces them.

## Blockers

| Status | Owner | Finding | Required evidence to close |
| --- | --- | --- | --- |
| Fixed, final candidate rerun pending | a2965 | The raw-source Metro fix initially worked only when Metro started from a project-source entry. A clean-cache default Expo Router export produced 2,257 `no-entry` plan misses including the starter's own app files. Graph discovery stopped at the external Expo Router entry and missed its `require.context` app graph. The project-source-entry warmup result therefore did not generalize and remains prohibited in tester-facing performance claims. The corrected default Expo probe now plans realpathed workspace imports through the app graph. `Separator.native.js` is correctly planned with zero candidates because it only defines a styled component; app use sites show 9 candidates and 7 flattened. `ToastComposable.native.js`, `Switch.native.js`, and `SheetScrollView.native.js` prove workspace dist modules receive real edits. | Rerun the assembled clean-cache Expo production export after a2965 lands the fix. Keep retained native benchmark cells invalid until a full 12-sample campaign replaces them. |
| Documented, deferred post-beta | a2965, decision by a2943 | Metro's transform cache key excludes the lowering-plan generation. A plan change without a source change can therefore reuse stale compiled output in a live `expo start` session or warm CLI build. This is the third incomplete cache-key defect found in the campaign, after platform-ambiguous config bundles and `simpleHash` omitting `hashMin`. Metro provides no per-module cache-key hook, while global invalidation would defeat incremental rebuilds, so the root fix is deferred with coordinator sign-off. | The beta upgrade guide tells testers to restart with `expo start -c`, or clear the app-local Tamagui cache and reset Metro before a warm production rebuild, after changing Tamagui config. The one-time replan costs about 12 ms per module: 27 seconds for the 2,328-module starter and roughly two minutes for a 10,000-module app. Steady-state warm builds remain unchanged at 7 seconds in both measured arms. |
| Pending decision | a2946, then a2943 | `compilerHost` resolves theme values against the first theme during native flattening. Theme switching therefore breaks on fully flattened components. This is a correctness bug. | Fix and native theme-switch proof, or an explicit coordinator block-versus-document decision. |
| Documentation fixed, codemod guard pending | a2952 | V5 palette-step names such as `blue10` and `red10` do not exist in the v6 config. A live cross-driver probe computed the missing `blue10` color as transparent on both paths without an error or warning, then exposed different CSS and React Native Web fallback colors. The upgrade guide mentioned palette tokens as a separate migration but did not state that failure is silent. The flat-values codemod currently preserves `$blue10` as `blue10`, so its output can look valid while losing color under v6. | Keep the explicit before/after and silent-failure warning in the published guide. Make the codemod report every old palette-step token for manual review without guessing a replacement, then prove the report catches a representative JSX value and dynamic expression. |
| In progress | a2949 | Checks are red at `4ac01cd6e7`. The failures are v6 fixture-regeneration debt predating the sync: `flatten.native.test.tsx` changed its theme background from `hsla(0,0%,8%,1)` to `#030712`, and `@tamagui/cli`'s `to-tailwind-default-config` bundle still contains grammar names removed by `d7dd3efa06`. | Validate the source change, regenerate the derived fixtures, then pass branch Checks. |
| Rerun pending after quiet window | a2952 | The merged all-package G1 preview at `8976311c1e` passed: 164 requested and packed artifacts, 8,043 export-condition probes, isolated installation, web production plus SSR browser canary, native Expo export plus runtime test, and 164 generated publish commands with `--tag beta` and zero `latest`. Packed `@tamagui/web` and bundled `@tamagui/core` contain the recent native-background and media-tuple fixes. The byte sweep found eight packages without `files` allowlists shipping nine tsconfigs, web Vitest config output, two source-build scripts, and the `tamagui` package's source-build config. Exact before/after inventories prove all runtime, compatibility, platform-extension, declaration, CSS, JSON, bin, and exported files are retained; only those explained build/test files leave. | Rerun G1 at or after `5a0b3d9d59`, because the allowlists changed the packed bytes after the passing preview. Record the exact assembled SHA and repeat content receipts. |
| Cut action pending | a2952, cut action by Nate | `create-tamagui` currently clones the Expo and Remix starters from `main`, whose Expo package still contains placeholder `true` tests and v2 dependencies. Pointing it at moving `v3-beta` is unsafe because that branch is permitted to be red. Its old shallow cached update used `git pull --rebase`: moving from one tag to another replayed the old tag commit and missed the requested ref, while Git could autostash edits inside the cache. The replacement has one shared release-ref setting and uses only exact fetch plus detached checkout. A throwaway Git probe landed both an initial and updated cached clone exactly on their requested tags, with no rebase or autostash path left. | Set `tamaguiStarterReleaseRef` in `code/core/create-tamagui/src/templates.ts` to the frozen beta 3 ref at cut time. Do not create the ref before the owner cut. |
| Cut action pending | a2952, cut action by Nate | The production site Dockerfile cloned private Bento from the moving `v3` branch and ignored its declared `BENTO_BRANCH` argument. The ref is a real independent input: Bento's `bento-quality` branch still imports removed `ThemeableStack`, while the newer v3 line uses `YStack`, and the former made the v3 site build call `styled()` with an undefined component. The Docker build now consumes one ref argument, defaults to the paired Bento `v3-beta` branch, and the existing local `TAMAGUI_BENTO_REF` pin uses exact fetch plus detached `FETCH_HEAD`. | After the paired Bento branch passes, replace the `ARG BENTO_BRANCH=v3-beta` default in `Dockerfile` with its exact validated SHA at cut time. The branch is the integration line, not the freeze. |
| In progress | a2968 | Exact Bento `v3` at `25af842` still has 28 callers of the removed curried `createStyledHOC(Component)(render)` signature. Bento had already migrated `.styleable()` to that intermediate form in July, so the current two-argument signature is a second API break on the same export in one cycle. The production docs bundle succeeds, then static route import invokes the returned themed component outside React and fails on `useContext`. This break was absent from the tester migration instructions; those instructions now include a before/after, and no curried caller remains in the Tamagui repository. A broken paid Bento package is also a public docs blocker because the home page imports its showcase. | Finish Bento's v3 conversion on its paired `v3-beta` branch, select its frozen SHA, then pass the production docs build and three-mode browser test. |
| Pending, lowest compiler priority | a2946 | V3 refuses to compile conditional font variants as `local/dynamic-style-value` on web and native, where v2 lowered each branch. `fonts.web.test.tsx` pins the regression so it stays visible. | Restore branch lowering or make an explicit release decision. |

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
- [ ] Branch Checks are green. This remains blocked on the a2949 fixture work above.

## Tester first-run matrix

| Surface | Test | Status |
| --- | --- | --- |
| Expo Router starter, web | Static Expo export, served artifact, browser hydration and themed style | Passed after v6 theme-key fix |
| Expo Router starter, native | Production iOS Expo export plus rendered Toast interaction | Passed after replacing the false Toast assertions |
| Remix starter | Typecheck and Vite production build | Passed after v6 shorthand migration |
| Blank web registry consumer | Install generated skin, drift check, typecheck, production browser smoke | Passed |
| Blank Expo registry consumer | Install generated skin, drift check, typecheck, native interaction and Expo app export | Runtime interaction and export passed; static native skin lowering passes. The corrected default Expo graph plans the skin definition and lowers the app use sites; final assembled rerun remains. |
| `create-tamagui` cached clone | Initial clone and repeat/update clone from frozen tag | Passed in throwaway Git repositories; cut ref remains an owner action |

The v3 branch no longer has the T3 placeholder test scripts. Expo, Remix, and both blank
registry fixtures contain real build or interaction commands. The published CLI still
targets `main`, so those improvements do not reach a generated tester project until the
frozen-ref plumbing closes.

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
- [ ] The production docs build and Playwright three-mode toggle check must finish against the
  completed Bento `v3-beta` SHA. The initial build with a non-v3 sibling Bento checkout supplied
  the independent ref discriminator recorded in the blocker table.

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

## Remaining release-readiness audit

- [x] Finish the starter and registry first-run matrix.
- [ ] Finish the three-mode documentation runtime check against the final
  `tamagui/<skin>` exports.
- [x] Audit version automation, changelog state, and the breaking-change/codemod guide.
- [ ] Run the packed G1 release preview after all blocker fixes are assembled.
- [ ] Re-run root typecheck, root build, registry drift, export checks, and relevant static
  compiler tests from the assembled candidate.
- [ ] Create the frozen starter ref at the validated candidate SHA and change the single
  starter release-ref setting at cut time.
- [ ] Obtain explicit owner authorization before any npm publish or ref creation.
