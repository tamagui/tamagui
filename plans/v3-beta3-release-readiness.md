# Tamagui v3 beta 3 release readiness

Last updated: 2026-08-03 at `4ac01cd6e7f5db42312c01aa8d13e1811ea30f1a` on
`v3-beta`.

This is the single blocker list for the beta 3 cut. A checked item means the named
acceptance check passed. Publishing, creating the frozen starter ref, and choosing whether
to ship with a documented correctness gap remain owner actions.

## Cut verdict

**Do not cut beta 3 yet.** Compiled native lowering is not engaged in the Xcode Release
path, fully flattened native components can freeze the first theme, the branch Checks are
red, and the Expo starter currently fails its first web render. The native performance
numbers in T7 do not support a release claim because they measured an unlowered path.

## Blockers

| Status | Owner | Finding | Required evidence to close |
| --- | --- | --- | --- |
| In progress | a2946 | `expo export:embed`, which Xcode Release uses, ships compiled-native output unlowered. The Metro plugin planned from an approximate Babel pass, then silently discarded the plan when Expo-only `customTransformOptions` made the real worker bytes differ. This is the third defect of this class. T7 measured a path that was never engaged, so compiled-native performance claims are unsupported. Run `30879334011` on GitHub-hosted iOS infrastructure also logged `metro/plan-miss` and `module ships unlowered` for dependency modules, proving the symptom reaches CI. Those lines did not cause that job's separate Maestro warmup failure. | A production native export proves lowering is present, followed by the compiled-native skin acceptance check. |
| Pending decision | a2946, then a2943 | `compilerHost` resolves theme values against the first theme during native flattening. Theme switching therefore breaks on fully flattened components. This is a correctness bug. | Fix and native theme-switch proof, or an explicit coordinator block-versus-document decision. |
| In progress | a2949 | Checks are red at `4ac01cd6e7`. The failures are v6 fixture-regeneration debt predating the sync: `flatten.native.test.tsx` changed its theme background from `hsla(0,0%,8%,1)` to `#030712`, and `@tamagui/cli`'s `to-tailwind-default-config` bundle still contains grammar names removed by `d7dd3efa06`. | Validate the source change, regenerate the derived fixtures, then pass branch Checks. |
| Cut action pending | a2952, cut action by Nate | `create-tamagui` currently clones the Expo and Remix starters from `main`, whose Expo package still contains placeholder `true` tests and v2 dependencies. Pointing it at moving `v3-beta` is unsafe because that branch is permitted to be red. Its old shallow cached update used `git pull --rebase`: moving from one tag to another replayed the old tag commit and missed the requested ref, while Git could autostash edits inside the cache. The replacement has one shared release-ref setting and uses only exact fetch plus detached checkout. A throwaway Git probe landed both an initial and updated cached clone exactly on their requested tags, with no rebase or autostash path left. | Set `tamaguiStarterReleaseRef` in `code/core/create-tamagui/src/templates.ts` to the frozen beta 3 ref at cut time. Do not create the ref before the owner cut. |
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

Owner: a2952. Status: fixed and locally validated, pending commit.

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
- [ ] The production compiled-native half is blocked on a2946's Metro fix. Until then,
  runtime fallback there is not evidence against the export map.

Owner: a2952. Status: fixed and locally validated, pending commit.

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
| Blank Expo registry consumer | Install generated skin, drift check, typecheck, native interaction and Expo app export | Passed; export still logs the a2946-owned compiled-hash misses on this pre-fix branch |
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

## Known open and deferred work

- **Unowned:** `AdaptLiveSlotSpike` test 2 is flaky on Android and passes only on retry.
  Retry-passed flakes retain no artifacts, so there is no evidence to diagnose. The missing
  retry artifacts are the current observability blocker.
- **Deliberately deferred:** Dialog, Accordion, Slider, and ToggleGroup call
  `withStaticProperties` on components imported from `@tamagui/ui`. This grafts styled
  parts onto the unstyled package's own exports for all consumers. It is not breaking a
  current test, but it contradicts the three-layer package contract.

## Remaining release-readiness audit

- [ ] Finish the starter and registry first-run matrix.
- [ ] Validate the three-mode documentation toggle and regenerate migration snippets
  against the final `tamagui/<skin>` exports.
- [ ] Audit version automation, changelog state, and the breaking-change/codemod guide.
- [ ] Run the packed G1 release preview after all blocker fixes are assembled.
- [ ] Re-run root typecheck, root build, registry drift, export checks, and relevant static
  compiler tests from the assembled candidate.
- [ ] Create the frozen starter ref at the validated candidate SHA and change the single
  starter release-ref setting at cut time.
- [ ] Obtain explicit owner authorization before any npm publish or ref creation.
