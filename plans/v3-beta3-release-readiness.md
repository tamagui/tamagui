# Tamagui v3 beta 3 release readiness

Engine baseline audited: `5dd5b1992f` on `v3-beta`.
Last updated: 2026-08-03.

This is the single blocker list for the beta 3 cut. A checked item means the named
acceptance check passed. Publishing, creating the frozen starter ref, and choosing whether
to ship with a documented correctness gap remain owner actions.

## Cut verdict

**Do not cut beta 3 yet.** The native theme correctness decision, branch Checks, frozen
starter and Bento refs, and final packed release preview are still open. The compiled-native
warmup effectiveness gate now passes, but the retained native benchmark cells remain invalid
until the full 12-sample campaign replaces them.

## Blockers

| Status | Owner | Finding | Required evidence to close |
| --- | --- | --- | --- |
| Fixed, retained campaign pending | a2946 | `expo export:embed`, which Xcode Release uses, shipped compiled-native output unlowered. The Metro plugin planned from an approximate Babel pass, then discarded the plan when Expo-only `customTransformOptions` made the real worker bytes differ. The fix plans against raw source and applies edits before the worker's single Babel pass. A real Release warmup gate improved V3 from 0.91x before the fix to 4.37x after it, versus V2's 4.70x and a required 1.50x. | Delivery is fixed. Keep `output/benchmarks-native-v2-v3.json` marked partial and do not quote its old compiled-native cells until a full 12-sample campaign replaces them. |
| Pending decision | a2946, then a2943 | `compilerHost` resolves theme values against the first theme during native flattening. Theme switching therefore breaks on fully flattened components. This is a correctness bug. | Fix and native theme-switch proof, or an explicit coordinator block-versus-document decision. |
| In progress | a2949 | Checks are red at `4ac01cd6e7`. The failures are v6 fixture-regeneration debt predating the sync: `flatten.native.test.tsx` changed its theme background from `hsla(0,0%,8%,1)` to `#030712`, and `@tamagui/cli`'s `to-tailwind-default-config` bundle still contains grammar names removed by `d7dd3efa06`. | Validate the source change, regenerate the derived fixtures, then pass branch Checks. |
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
  lowered 1, flattened 1, bailed 0. The landed Metro Release gate independently proves those
  native plans reach the production bundle.

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
| Blank Expo registry consumer | Install generated skin, drift check, typecheck, native interaction and Expo app export | Passed before the Metro fix; compiled-native skin acceptance is being rerun on the assembled tree |
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
- [ ] The production docs build and Playwright three-mode toggle check must finish after the
  compiled-native timing quiet window. The initial build with a non-v3 sibling Bento checkout
  supplied the independent ref discriminator recorded in the blocker table.

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
