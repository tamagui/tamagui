# Team Machine v3 beta tip migration receipt

## Outcome

- **TESTED** - Team Machine GUI is migrated on the isolated `tamagui-v3-tip` worktree branch. The final dependency and lockfile state uses published `3.0.0-beta.881.1` for every direct `tamagui` and `@tamagui/*` dependency.
- **RAN** - The worktree is `/Users/n8/.worktrees/team-machine-v3`, created from Team Machine main at `a87d41f416f22568a92297d91ee7c71e4069df25`.
- **RAN** - `/Users/n8/team-machine` remained on main and was not switched or edited.
- **TESTED** - The local Tamagui tip packed from `3159649a61` passed the web, GPUI, and iOS runtime checks below. Published `3.0.0-beta.881.1` then passed a fresh install, typecheck, production web build, compiler-stat collection, and GPUI production bundle.

## Package preparation

- **RAN** - `bun install` from the worktree `gui/`, followed by `bun run sync:gpui`, established the GUI-local install and the required React Native GPUI development copy.
- **RAN** - `bun release --into /Users/n8/.worktrees/team-machine-v3/gui` from `/Users/n8/tamagui` packed 126 workspaces into the consumer. The packed manifests reported `2.7.7`, including `node_modules/tamagui/package.json`.
- **TESTED** - A lockfile pinned to the packed manifest value was impossible because `@tamagui/native-registry@2.7.7` does not exist on npm. `bun install` rejected that pin. Runtime checks therefore used the locally overlaid workspaces, while the durable package and lockfile state uses the uniform published beta.
- **RAN** - After `3.0.0-beta.881.1` published, `bun install` installed all 11 direct Tamagui packages at exactly that version. `bun install --frozen-lockfile` then passed.
- **RAN** - Removed `@tamagui/web@3.0.0-beta.653.1` from `patchedDependencies` and deleted `patches/@tamagui%2Fweb@3.0.0-beta.653.1.patch`.
- **RAN** - Read `f263ece3e7` and `code/core/web/src/helpers/nativeStyleEngine.ts`. Raw `renderProps` are resolved separately from processed `nativeProps` at lines 127 through 141, and a late host links against the live scope name and theme at lines 220 through 249.

## Source changes

- **RAN** - `package.json` and `bun.lock`: moved direct pins from `3.0.0-beta.653.1` and native-registry `3.0.0-beta.765.1` to uniform `3.0.0-beta.881.1`; removed the obsolete web patch registration.
- **RAN** - `features/animations-gpui/createAnimations.ts`: removed `isReactNative: true`, updated the target-resolution explanation, and typed the returned driver as `AnimationDriverWithAnimatedNumbers<A>`, the v3 interface that includes the animated-number hooks the GPUI driver implements.
- **TESTED** - The GPUI runtime tree contains concrete hex colors and no CSS variables after removing `isReactNative`.
- **RAN** - `tamagui.build.ts`: reduced compiler components to `['tamagui']` and retained `experimental.nativeFastPath: true`.
- **RAN** - `interface/tm/gallery/GalleryOverlay.tsx`: migrated the numeric `going` functional variant to `styled.dynamic<number>`.
- **RAN** - Replaced longhand `userSelect` with the configured `select` shorthand in `AppErrorBoundary.tsx`, `CardSummaryStream.native.tsx`, `CardSummaryStream.tsx`, `ComposerTargetPill.tsx`, `DiffRowView.tsx`, `FeedPane.tsx`, `MarkdownBody.tsx`, `RightPanel.tsx`, `TimelineEntryView.tsx`, `TimelineView.tsx`, `mobile/ChatMarkdown.tsx`, `mobile/CloudSyncScreen.tsx`, `mobile/ConnectSheet.tsx`, `mobile/SessionFeed.tsx`, and `mobile/TelegramSettingsScreen.tsx`.
- **RAN** - `interface/tm/PipControlBand.native.tsx`: replaced longhand `textAlign="center"` with the configured `text="center"` shorthand.
- **TESTED** - No widened `size: string` or `RefCallback<unknown>` workaround was needed. The final published-package typecheck is clean.
- **TESTED** - Despite the expectation that `48cc946e87` missed this beta, installed `@tamagui/web@3.0.0-beta.881.1` declares the `createStyledHOC` render callback as `ref?: ReactRef<NoInfer<Ref>>`; `interface/tm/Button.tsx` typechecks without an app workaround.

## Before and after numbers

| Measurement | Before, main beta.653.1 | Local tip overlay | Published beta.881.1 |
| --- | ---: | ---: | ---: |
| Typecheck wall time | 6.36 s | 7.17 s | 13.37 s |
| Web client JS and CSS raw | unavailable | 4,900,538 B | 4,900,598 B |
| Web client JS and CSS gzip, level 9 | unavailable | 1,297,538 B | 1,297,768 B |
| Compiler modules with candidates | unavailable | 76 | 76 |
| Compiler found | unavailable | 1,122 | 1,122 |
| Compiler flattened | unavailable | 802 | 802 |
| Compiler partially lowered | unavailable | 32 | 32 |
| Compiler retained or bailed | unavailable | 288 | 288 |
| iOS Hermes bundle | unavailable | 11,815,188 B, HBC 98 | not repeated |

- **RAN** - The before typecheck used the original beta.653.1 install after the required GPUI sync.
- **RAN** - The original beta.653.1 production web build failed before emitting client assets because its compiler evaluated the extensionless ESM `react-native-worklets/lib/module/initializers/initializers` import. That leaves no honest before gzip or compiler count.
- **RAN** - The fresh worktree had no generated iOS project before migration. I did not generate artifacts or run a build in the live checkout, so an honest before iOS bundle number is unavailable.
- **TESTED** - Shrinking `components` did not change local-tip versus published compiler counts. The production build discovered the menu and toast imports on demand and completed with 802 flattened elements.

## Web proof

- **TESTED** - Local tip: `TAMAGUI_COMPILER_STATS=1 bun run build` completed. Stats were 1,122 found, 834 lowered, 802 flattened, 32 partial, and 288 bailed. Bailouts were 146 dynamic values, 101 unsupported targets, and 41 unsafe spreads.
- **TESTED** - Published beta: `TAMAGUI_COMPILER_STATS=1 bun run build` completed in 58.60 seconds with the same compiler counts.
- **TESTED** - Fixture-backed `one dev` on port 4297 was driven with headless Playwright. It rendered the overview, opened the Codebase Overview session, accepted `v3 migration composer probe` in the composer without sending, and switched system appearance from light to dark with no page errors.
- **TESTED** - The web theme probe changed the body background from `rgb(227, 227, 227)` to `rgb(13, 13, 13)`.
- **RAN** - Screenshots: `/tmp/team-machine-v3-web-overview-light.png`, `/tmp/team-machine-v3-web-session-light.png`, `/tmp/team-machine-v3-web-composer-light.png`, and `/tmp/team-machine-v3-web-session-dark.png`.

## Desktop GPUI proof

- **TESTED** - `bun run bundle:gpui` produced the production Hermes bytecode for both the local tip overlay and the final published install.
- **TESTED** - The non-activating fixture capture launched the real control-room tree and rendered 241 div nodes, 40 SVG nodes, 97 text nodes, six Ghostty terminals, and one text input.
- **TESTED** - The dumped GPUI runtime tree contains resolved color values such as `#d9d9d9`, `#0a0a0a`, and `#319667`; `rg 'var\\('` found no CSS variables.
- **TESTED** - `bun run conformance:gpui:dynamic-color` passed a dark-to-light painted-pixel transition with one render.
- **TESTED** - `bun run conformance:gpui:light-mode` passed with light chrome and light new-tab state.
- **TESTED** - `bun run conformance:gpui:dark-mode` passed with dark chrome, dark stage, and a native transcript.
- **RAN** - The optional GPUI PNG service did not write a pixel file for the full app capture. The dumped native tree and the three painted/theme conformance commands supplied the runtime evidence instead.

## iOS proof

- **RAN** - `bun run ios:prebuild` built GhosttyKit, generated the gitignored Xcode project, installed CocoaPods, and applied the Team Machine development identity.
- **TESTED** - `xcodebuildmcp simulator build-and-run` built, installed, and launched `dev.tamagui.agentbus.dev` from `TeamMachine.xcworkspace` in 7 minutes 47 seconds on the dedicated `TM-v3-r17281` simulator, UDID `98F5F32A-8031-4233-92ED-0C81BCAA5EA8`.
- **TESTED** - The accessibility snapshot found the Team Machine Dev application, overview session rows, bottom navigation, and the mobile composer input and controls.
- **TESTED** - A temporary runtime probe, removed before the final diff, reported the native registry available in light mode with 239 linked views, 6 commits, and 0 misses.
- **TESTED** - Switching that simulator to dark with xcodebuildmcp changed the native registry to 248 linked views and 10 commits while misses remained 0. Light and dark screenshots show the control room recolored without stale light surfaces in the stage or session list.
- **RAN** - Light screenshot: `/var/folders/w3/nl3nl7ks6s36641hzl_gls9m0000gn/T/screenshot_optimized_4e5bbfd9-34ae-4793-9115-4e6352fbd502.jpg`.
- **RAN** - Dark screenshot: `/var/folders/w3/nl3nl7ks6s36641hzl_gls9m0000gn/T/screenshot_optimized_015c4ecd-0212-4b44-8672-0eb098821e51.jpg`.
- **TESTED** - `node scripts/ota-publish.mjs` in build-only mode compiled the production iOS bundle with the Pod Hermes compiler. The bundle is 11,815,188 bytes and HBC 98. Nothing was uploaded.

## Other validation

- **TESTED** - Final `bun run typecheck` passes against the frozen published install. The first published run completed in 13.37 seconds; a later concurrent final run completed in 16.81 seconds.
- **TESTED** - `bun test scripts/native-style-engine-contract.test.mjs` passes all 21 cases across ESM/CJS and native/default entry points, including the late-link and live-state cases.
- **TESTED** - `bunx oxfmt --check` passes for every changed source and manifest file. Team Machine does not declare a GUI or root lint script.
- **TESTED** - `git diff --check` passes.

## Remaining observations

- **INFERRED** - The unavailable before bundle numbers are measurement gaps, not migration regressions. No beta.653.1 production assets or generated iOS project existed in the isolated worktree, and the live checkout was intentionally left untouched.
- **TESTED** - Dev web and iOS logs warn that `<Theme data-one-source=...>` or `<Theme srcloc=...>` no longer accepts inline values. The app only supplies `name`; the warning is caused by the compiler's source-location prop reaching Theme. `interface/tm/OverviewCard.tsx:85` is a minimal app call site. This belongs in the Tamagui compiler or Theme reserved-prop handling, not an app workaround.
- **TESTED** - Dev web also reports React DOM passthrough warnings for `testID`, accessibility props, and `onLayout`. The inspected flows had no page errors and the production build is green. These warnings were not masked with app-specific filtering.
- **RAN** - No release, publish, tag, workflow dispatch, live-checkout switch, or main-branch push was performed.
