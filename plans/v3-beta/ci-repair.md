# v3-beta CI repair

Acceptance: Checks, Native Tests (Detox), and Test iOS Native (Maestro) pass on
the v3-beta tip carrying the repairs. Each cause lands separately on v3-beta.
Main and v3-release-ci are outside this work. The CI owner and current evidence
are tracked in task `t-mv19dz3f-urb0`, label `lane:tamagui-v3-beta-ci`.

## observed causes

- RAN: Checks at `191463b07f` fails oxfmt on the reanimated driver's config
  comparison. A focused negative check reproduced it. Formatting alone fixes
  that check, shipped in `1b97e44d2c`.
- RAN: pod installation rejects Reanimated 4.5.1 with React Native 0.87.1.
  Worklets 0.10.1 also rejects it through its shipped validator. Reanimated
  4.6.0 and Worklets 0.12.2 explicitly support this RN version, and all three
  upstream dependency validators pass after installing them. The reanimated
  web-import patch is obsolete because 4.6.0 ships those imports upstream.
  The existing Worklets mock patch moves to the new version, preserving its
  implementations while exposing the ESM exports the native test harness uses.
- RAN: the updated upstream reanimated mock uses JSReanimated, while native
  test file resolution selects the native initializer and throws registering
  native CSS events. The native unit harness selects the JS initializer for
  that mock. The existing components native suite passes all 73 tests across
  22 files with unchanged assertions.
- RAN: RN 0.87 pulls AGP 9.2.1 into the app build, but Expo 57 compiles
  against the AGP 8 library DSL. Raising Gradle only uncovers incompatible
  Kotlin initialization and the removed `LibraryDefaultConfig.setTargetSdk`
  API. The shared Android init script pins AGP 8.12.0, the version used by
  Expo 57's supported React Native toolchain, for app build scripts and the
  RN plugin compiler. Expo plugins retain their authored AGP 8.5 compile
  dependencies, whose DSL type bounds their Kotlin source requires. It retains the existing Detox JNI packaging rule and is used
  by CI and local Detox. Expo libraries declaring custom BuildConfig fields
  also require BuildConfig enabled under this AGP version. `gradlew help`
  with the shared init script completes with `BUILD SUCCESSFUL` after all
  package plugins configure. Expo fingerprint includes the script so
  compiler configuration changes invalidate native artifact caches.
- RAN: the installed fast-flow-transform 0.0.3 rejects Flow `readonly` fields
  in RN 0.87 `Event.js`, reproducing the native production bundle CI error.
  The One v2-beta family is pinned to `2.0.0-0.canary.1791569029449`,
  whose published manifests identify source `3c811296a6dc1b419cd120adbf98d6388a099dd1`.
  Its shipped vite-flow delegates to the Hermes-backed compiler. Transforming
  the actual Event.js with that artifact produces JavaScript with zero oxc
  parser errors. The obsolete vxrn 1.21 patch is removed. Frozen installation
  and workspace dependency checks pass. The full iOS bundle now reaches
  resolution and exposes a separate navigation override conflict.


- RAN: global React Navigation 7 overrides replace One's declared version 8
  dependencies. Its bottom-tabs build then cannot resolve the version 3
  elements package's `internal` export. Removing those overrides restores
  the declared graph. Apps supply One's exact core/native peers, and workspace
  navigation declarations align with those peers. iOS and Android production
  bundles both build through the heavy-work window with unchanged application
  code. Frozen installation, workspace consistency, and unused-dependency
  checks pass. Native interaction tests remain CI gates.

- RAN: React Navigation 8 takes a param-list generic for `useRoute`; the old
  `any` generic yields untyped `object` params. A cold kitchen-sink typecheck
  reproduces TS2339 for `params.id`. The stack and hook now share the existing
  route contract and the hook names its `test` route. A cold typecheck then
  passes, as do focused formatting and lint.

- RAN: the published One pod requires iOS 17, while Expo's generated app
  target is lower. Local pod installation reproduces the dependency solver's
  minimum-target rejection. The kitchen-sink's Expo build-properties plugin
  declares iOS 17 so prebuild owns both Podfile and Xcode target settings.
  Generated Podfile properties report `ios.deploymentTarget: 17.0`, and the
  pod installation completes successfully with One included. Frozen
  installation and workspace dependency checks pass. Full compilation remains
  a CI gate.

## cost and validation

Dependency alignment changes build inputs, not application render work. The
Android init script configures build dependency resolution and packaging once
per Gradle project. The initializer selection runs only in the native
JavaScript unit harness. Pod installation completes with 119 pods after the
animation dependency alignment. Full app compilation and interactions remain
CI acceptance gates.

Focused validation precedes each commit. CI owns complete native compilation,
the native interaction suites, and the full Checks matrix. Logs and temporary
probes stay outside tracked source. Future optimization worth evaluating:
validate native dependency compatibility before paying for prebuild and builds.

The CI watcher accepts repeated `--workflow <name>` arguments to watch only the
required workflows. It requires every selected workflow to appear before it
can report a verdict. Run it detached through Team Machine, for example:

```sh
tm wait --exec "bun scripts/watch-ci.ts --sha <commit> --workflow Checks --workflow 'Native Tests (Detox)' --workflow 'Test iOS Native (Maestro)'" --timeout 50m
```
