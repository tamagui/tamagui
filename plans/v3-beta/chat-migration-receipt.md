# Chat Tamagui v3 migration receipt

## Outcome

- **RAN**: migrated `/Users/n8/chat` from the v2 dependency set at `2.4.6` to the local Tamagui `v3-beta` package set whose tarballs carry version `2.7.7`.
- **RAN**: all work is in `/Users/n8/.worktrees/chat-v3` on branch `v3`; `/Users/n8/chat` remained on `main`.
- **RAN**: the migration started from chat commit `42cd3ff0a9f2b2552fa69e151573b6a5f666e27a`.
- **RAN**: `tamagui.build.ts` contains only `components: ['tamagui']`. No downstream component package is listed.
- **TESTED**: direct TypeScript, the web production build, the iOS Expo export, the full repository test command, and the five requested browser flows are green.
- **TESTED**: the native Xcode workspace builds, installs, launches, requests and evaluates its Metro bundle, initializes MMKV, and loads keyboard extensions.
- **INFERRED**: a clean native launch smoke remains blocked in upstream Tamagui. React Native rejects `outlineStyle="none"`, followed by a `StyleValuePool.h` assertion. The offending values are authored by `@tamagui/dialog` and `@tamagui/roving-focus`; this migration does not patch the engine or installed packages.

## Setup and local packages

Commands:

```sh
cd /Users/n8/chat
git worktree add /Users/n8/.worktrees/chat-v3 -b v3
cd /Users/n8/.worktrees/chat-v3
bun install

cd /Users/n8/tamagui
bun release --into /Users/n8/.worktrees/chat-v3

cd /Users/n8/.worktrees/chat-v3
node -e "const p=require('./node_modules/tamagui/package.json'); console.log(p.version)"
```

- **RAN**: the installed local package version printed `2.7.7`.
- **RAN**: all `tamagui` and `@tamagui/*` dependency strings in chat were set to the tarball version.
- **RAN**: the final local unpack processed 135 Tamagui workspace packages.
- **RAN**: `@tamagui/config-v5` is required directly because chat intentionally retains its v5 token and theme values while adopting v3 authoring and runtime APIs.
- **RAN**: `yuku-analyzer@0.6.1` is direct because the local beta compiler graph requires it but did not install it transitively into this consumer.
- **RAN**: the local release script only replaces packages already present in the consumer. The unpublished `@tamagui/config-v5` package first arrived as a Bun `link:` dependency; Metro cannot traverse that link outside its project root. Replacing the link with a physical local tarball unpack made Metro resolve it.

## Codemod

Commands:

```sh
cd /Users/n8/.worktrees/chat-v3
npx tamagui migrate --from v2

bun /Users/n8/tamagui/code/core/codemod-flat-values/src/index.ts \
  --report /tmp/chat-flat-v2-report.md \
  --json /tmp/chat-flat-v2-report.json \
  app src packages

bun /Users/n8/tamagui/code/core/codemod-flat-values/src/index.ts \
  --write \
  --report /tmp/chat-flat-write-report.md \
  --json /tmp/chat-flat-write-report.json \
  app src packages

bun /Users/n8/tamagui/code/core/codemod-flat-values/src/index.ts \
  --report /tmp/chat-flat-v3-final-report.md \
  --json /tmp/chat-flat-v3-final-report.json \
  app src packages
```

Initial write report:

| Result | Count |
| --- | ---: |
| source files rewritten | 395 |
| style sites | 2,600 |
| clean | 2,243 |
| need relocation | 122 |
| unknown host | 78 |
| ineligible | 7 |
| syntax flagged | 68 |
| configuration warnings | 97 |
| functional variants converted automatically | 8 |
| functional variants flagged | 0 |

- **RAN**: the complete report was read before applying `--write`.
- **RAN**: the final dry run reports 0 style sites, 0 functional variants, 0 `Sheet.Frame` sites, 0 flags, 0 warnings, and 0 ignored files.
- **RAN**: the unmigrated source contained 4,962 quoted `$token` values, 409 legacy conditional objects in 144 TSX files, 213 fractional token spellings, and three legacy dynamic-variant builders. The final codemod audit found no v2 authoring.

## Hand fixes beyond the codemod

This is the complete semantic hand-fix inventory. Formatter-only changes produced by the migration command are not expanded line by line.

### Flat-value sites left authored after `--write`

- **RAN**: manually rewrote the 27 files whose report rows still had `legacyLeft > 0`: `src/features/attachments/AttachmentItemUnfurl.tsx`, `src/features/blocks/components/List.tsx`, `src/features/blocks/components/Stat.tsx`, `src/features/blog/BlogPostLayout.tsx`, `src/features/hud/HudTips.tsx`, `src/features/mention/Mention.tsx`, `src/features/message/ui/MessageActionBar.tsx`, `src/features/message/ui/MessageItemBackground.tsx`, `src/features/message/ui/MessageItemMinimal.tsx`, `src/features/topbar/JoinServerIfNotJoinedButton.tsx`, `src/features/topbar/TopBarContent.tsx`, `src/features/website/home/Hero.tsx`, `src/features/website/home/home-sections/DataSectionTable.tsx`, `src/features/website/home/home-sections/HudSection.tsx`, `src/features/website/home/home-sections/OverviewSection.tsx`, `src/features/website/ui/OverviewCard.tsx`, `src/features/website/ui/ResponsiveParagraph.tsx`, `src/interface/animations/AnimatedSteps.tsx`, `src/interface/app/LinkMinimal.tsx`, `src/interface/app/SidePanel.tsx`, `src/interface/dividers/DraggableVerticalSeparator.tsx`, `src/interface/effects/guidedNavigation.tsx`, `src/interface/pill/Pill.tsx`, `src/interface/searchable-list/SearchableList.tsx`, `src/interface/tabs/Tabs.tsx`, `src/interface/text/IntroParagraph.tsx`, and `src/interface/text/SubTitle.tsx`.
- **RAN**: collapsed responsive, pseudo, platform, group, and enter/exit objects into the owning property strings in those files. Dynamic expressions were retained only where they are runtime values rather than v2 condition objects.
- **RAN**: `src/features/blocks/zones/StatsZone.tsx` was a missed site. The report marked the `YStack` clean while leaving a conditional spread containing `$sm`, `$md`, and `$lg`. It is now one `minW="160px sm:40% md:calc(max(22%, 170px)) lg:10%"` value plus `container="card"`.
- **RAN**: all 97 palette warnings were reviewed against the retained `@tamagui/config/v5` pack. Bare `red*`, `green*`, `blue*`, and `orange*` values remain valid in that pack, so they were preserved instead of being renamed as v6 colors.

### Functional variants and styled components

- **RAN**: the codemod converted all eight functional variants to `styled.dynamic` with no flagged site.
- **RAN**: six conversions remain as `styled.dynamic` in `AnimatedSteps`, `Gallery`, `SearchableList`, `WebsiteNav`, `TopBarHoverPreview`, and `TabsHoverPreview`.
- **RAN**: hand-simplified the generated dynamic size variants in `src/interface/text/IntroParagraph.tsx` and `src/interface/text/SubTitle.tsx` into direct flat `fontSize` and `lineHeight` values. `SubTitleInner` now uses `SizableText`, which already owns the size behavior.
- **RAN**: updated custom styled component definitions and their props in `src/interface/buttons/Button.tsx`, `src/interface/avatars/Avatar.tsx`, `src/interface/lists/ListItemFrame.tsx`, `src/interface/lists/ListItemBackground.tsx`, `src/interface/forms/LabeledGroup.tsx`, `src/interface/tabs/Tabs.tsx`, and their call sites to use v3 variant and flat-style types.

### Removed v2 APIs and changed component contracts

- **RAN**: replaced 79 authored `fullscreen` uses across 38 TSX files with explicit `position="absolute"` and `inset={0}`. The only remaining `fullscreen` identifier is a local React Native style constant in `BlurView.native.tsx`.
- **RAN**: manually migrated the three Sheet implementations in `src/interface/sheets/Sheet.tsx`, `src/interface/select/Select.tsx`, and `src/interface/sliding-popover/SlidingPopover.tsx` from `Sheet.Frame` to `Sheet.Container` plus `Sheet.Background`, preserving clipping, layout, and surface props.
- **RAN**: removed the one `$true` font-size fallback in `src/interface/select/Select.tsx` and used the real `4` token.
- **RAN**: migrated the web and native toast wrappers in `src/interface/toast/Toast.tsx`, `src/interface/toast/Toast.native.tsx`, and `src/interface/notification/Notification.tsx` from the old imperative/provider shape to the v3 composable provider, viewport, title, description, close, and portal APIs.
- **RAN**: updated `src/interface/dialogs/Dialog.tsx` for v3 Portal props (`z`), adapted Sheet behavior, keep-mounted pointer behavior, event `cancel()`, and two explicit dialog layers. Updated the layer-two callers in `DialogConfirm`, `DialogFeedback`, `DialogInfo`, and `DialogInput`.
- **RAN**: updated `src/interface/select/Select.tsx`, `src/interface/tooltip/Tooltip.tsx`, `src/interface/app/Link.tsx`, icon props, and custom event types to their v3 contracts. Tamagui dismiss/focus events use `cancel()` where the browser event API is not exposed.
- **RAN**: removed the dead `src/features/presence/TopBarPresence.tsx` wrapper after its removed v2 props made it redundant.
- **RAN**: updated animation imports from the old `v5-css`, `v5-motion`, and `v5-reanimated` spellings to `animations-css`, `animations-motion`, and `animations-reanimated`.
- **RAN**: moved `createV5Theme` imports from `@tamagui/themes/v5*` to `@tamagui/config-v5`, kept `@tamagui/config/v5` for tokens, media, settings, selection styles, and shorthands, and removed the unused direct `@tamagui/themes` dependency.
- **RAN**: removed `$` prefixes from the runtime custom-theme variant table in `src/features/app/themes/variants.ts` because those values are passed back to Tamagui as authored theme names.

### Runtime fixes found by TypeScript and Playwright

- **TESTED**: fixed a v3 pointer-events cascade in `src/features/hud/useHudMainFrameHideProps.ts` and `src/features/topbar/TopBarFrame.tsx`. The main frame now receives `pointerEvents="none"` only while the HUD is open and no longer receives a redundant authored `auto` that overrides descendants.
- **TESTED**: put the upload drop overlay inside its display-contents wrapper in `src/interface/upload/DragDropFile.tsx`, restoring the hit target after v3 flattening.
- **TESTED**: made dialog closure emission follow the controlled `open` transition rather than an overlay callback. This fixed nested dialog sequencing and responsive dialog-to-sheet behavior without changing test timing or assertions.
- **RAN**: fixed the two baseline non-Tamagui type errors by using `bindCan` rather than removed `can` fields in `scripts/dev/load-test.ts` and `src/start/src/sdk/setup.ts`.
- **RAN**: regenerated `src/start/types` after the source and dependency type changes.

### Native wiring

- **RAN**: added `main: "one/metro-entry"`, `babel.config.cjs`, and `metro.config.cjs`. The Metro config delegates to One, selects native/client/server conditions, and excludes test/spec routes from native discovery.
- **TESTED**: upgraded `@nandorojo/galeria` from `1.2.0` to `3.0.3`. Version 1.2.0 failed the RN 0.83 Xcode build on removed `RCTIsNewArchEnabled`; the same build passed after the upgrade.
- **TESTED**: moved `SafeAreaProvider` to the root of `app/_layout.native.tsx`. The preceding launch emitted `No safe area value available`; the next bundle evaluation passed that point and reached the later outline-style assertion.
- **RAN**: added the native notification portal provider and host needed by the composable toast/notification path.

## Compiler discovery and stats

Production build command used for both versions:

```sh
cd /Users/n8/.worktrees/chat-v3
env TAMAGUI_COMPILER_STATS=1 /usr/bin/time -p \
  bun run:dev scripts/web/build.ts --kind manual
```

| Compiler metric | v2 main | v3 branch | Delta |
| --- | ---: | ---: | ---: |
| modules with candidates | 377 | 370 | -7 |
| components found | 2,862 | 2,869 | +7 |
| lowered | 2,545 | 2,399 | -146 |
| flattened | 2,321 | 2,387 | +66 |
| retained / bailed | 541 | 470 | -71 |
| flatten rate | 81.10% | 83.20% | +2.10 percentage points |

- **RAN**: v3 additionally reported 12 partial lowers and 86 styled lowers.
- **RAN**: v3 bailout reasons were 195 dynamic style values, 155 unsupported targets, 120 unsafe style spreads, and two linked unresolved bindings.
- **RAN**: the build emitted no package-discovery failure diagnostic with only `components: ['tamagui']` configured.
- **INFERRED**: the 2,387 flattened sites across 370 candidate modules demonstrate that on-demand discovery reached the application's styled components without enumerating downstream packages.

## Before and after numbers

### TypeScript

Command used for both versions:

```sh
cd /Users/n8/.worktrees/chat-v3
/usr/bin/time -p bunx tsc -p tsconfig.json --noEmit \
  --extendedDiagnostics --pretty false
```

| Metric | v2 main | v3 branch | Delta |
| --- | ---: | ---: | ---: |
| exit | 2, two `can` errors | 0 | green |
| wall time | 19.68s | 22.33s | +2.65s, +13.47% |
| TypeScript total time | 19.09s | 21.87s | +2.78s |
| instantiations | 3,675,732 | 2,756,318 | -919,414, -25.01% |
| memory | 2,389,820K | 2,273,174K | -116,646K |
| files | 8,175 | 8,221 | +46 |

- **RAN**: the v3 result above is the clean warm rerun immediately following the first final pass. The first pass was also type-clean after the one `Dialog.Portal` `zIndex` to `z` correction but had 53.26s wall time during heavier machine I/O.
- **RAN**: the separate unmigrated-source v3 type probe produced 422 diagnostics before the source migration.

### Web production bundle

The build command is the compiler-stats command above. Gzip totals were computed with this command against each resulting `dist/client` tree:

```sh
bun -e "import { readdirSync, readFileSync } from 'node:fs'; import { join, extname } from 'node:path'; import { gzipSync } from 'node:zlib'; const totals = { '.js': { files: 0, raw: 0, gzip: 0 }, '.css': { files: 0, raw: 0, gzip: 0 } }; const walk = (dir) => { for (const entry of readdirSync(dir, { withFileTypes: true })) { const fileName = join(dir, entry.name); if (entry.isDirectory()) walk(fileName); else { const kind = extname(fileName); if (kind in totals) { const data = readFileSync(fileName); totals[kind].files++; totals[kind].raw += data.length; totals[kind].gzip += gzipSync(data, { level: 9 }).length; } } } }; walk('dist/client'); console.log(JSON.stringify(totals, null, 2));"
```

| Metric | v2 main | v3 branch | Delta |
| --- | ---: | ---: | ---: |
| build exit | 0 | 0 | green |
| wall time | 22.68s | 64.93s | +42.25s, +186.29% |
| JS files | 955 | 950 | -5 |
| JS raw | 15,767,331 B | 15,656,233 B | -111,098 B |
| JS gzip, level 9 per file | 3,582,697 B | 3,571,401 B | -11,296 B, -0.32% |
| CSS files | 95 | 87 | -8 |
| CSS raw | 563,641 B | 537,373 B | -26,268 B |
| CSS gzip, level 9 per file | 96,281 B | 104,400 B | +8,119 B, +8.43% |

- **RAN**: the v3 wall time is the latest of two consecutive compiler-stats builds. The preceding cold run took 143.11s. The full test command's production web-build lane completed in 33s, so build wall time is sensitive to cache and machine load.
- **RAN**: the repository has no web bundle-analyzer or Rollup visualizer configuration and produced no analyzer artifact. A Tamagui-attributable byte share is therefore unavailable.

### Native export

Commands:

```sh
cd /Users/n8/.worktrees/chat-v3
/usr/bin/time -p bunx expo export --platform ios --output-dir dist/expo-ios
find dist/expo-ios -type f -name '*.hbc' -exec stat -f '%z %N' {} \;
```

| Metric | v2 main | v3 branch |
| --- | ---: | ---: |
| export exit | unavailable | 0 |
| modules | unavailable | 4,988 |
| Metro bundle time | unavailable | 31.265s |
| command wall time | unavailable | 48.03s |
| embedded Hermes bundle | unavailable | 18,286,514 B |

- **RAN**: the v2 generic Expo export failed because the repo had no Expo `main` entry and attempted to resolve missing `App`. The repo-native `bun one build --platform=ios` baseline also failed before bundling on Rolldown parser errors in `@rocicorp/logger`, `drizzle-orm`, and `zod`. There is no honest v2 embedded-bundle comparison.
- **RAN**: the final bundle is `dist/expo-ios/_expo/static/js/ios/metro-entry-e6a75c8f48ded01874d6497fdd5dbe92.hbc`.

## Validation

### Repository gates and tests

Commands:

```sh
cd /Users/n8/.worktrees/chat-v3
bun run lint
bun run check
bun run test e2e
```

- **RAN**: `bun run lint` passed with 0 warnings and 0 errors across 2,310 files.
- **RAN**: `bun run check` passed types, dependency cycles, lint, knip, and zero-version.
- **TESTED**: `bun run test e2e` passed 203 Vitest files and all 1,090 unit tests.
- **TESTED**: the same command passed 78 Playwright tests in Chromium. One repository-declared test remained skipped. No test was skipped, retried, relaxed, or given a wider timeout for this migration.
- **TESTED**: the same command built the production web application and completed its client-bundle secret scan.

### Browser flows

Command:

```sh
cd /Users/n8/.worktrees/chat-v3
env ALLOW_MISSING_ENV=1 NODE_ENV=development TAKEOUT_ENV_MODE=development \
  DISABLE_OPTIMIZATION=1 PORT_OFFSET=300 SKIP_JOBS=1 IS_TESTING=1 \
  bun run:dev playwright test src/integration/e2e/chat-v3-visual-receipt.test.ts
```

- **TESTED**: the one-shot receipt test passed its setup and Chromium test, asserted the application loaded, clicked each flow, and wrote quality-90 WebP screenshots. The temporary test file was removed after capture.
- **TESTED**: auth screen: [01-auth.webp](./chat-screenshots/01-auth.webp).
- **TESTED**: authenticated main list: [02-main-list.webp](./chat-screenshots/02-main-list.webp).
- **TESTED**: desktop invite dialog: [03-dialog.webp](./chat-screenshots/03-dialog.webp).
- **TESTED**: 390 by 844 responsive invite sheet: [04-sheet.webp](./chat-screenshots/04-sheet.webp).
- **TESTED**: theme settings after selecting dark: [05-theme-switch.webp](./chat-screenshots/05-theme-switch.webp). The test asserted the dark tab and the document dark state.

### Native build, bundle, and launch

Commands:

```sh
cd /Users/n8/.worktrees/chat-v3
bunx expo prebuild --platform ios --no-install
bunx pod-install ios
xcodebuildmcp simulator build-and-run \
  --workspace-path /Users/n8/.worktrees/chat-v3/ios/Start.xcworkspace \
  --scheme Start \
  --simulator-id 98F5F32A-8031-4233-92ED-0C81BCAA5EA8 \
  --configuration Debug \
  --prefer-xcodebuild true \
  --output json

bun run:dev expo start --dev-client --port 8081
```

- **RAN**: Expo prebuild and CocoaPods install passed.
- **TESTED**: `xcodebuildmcp` reported a successful build, install, and launch of `chat.start.dev1` on simulator `TM-v3-r17281`.
- **TESTED**: Metro produced a 5,107-module iOS development bundle, and the launched application evaluated it.
- **TESTED**: after moving `SafeAreaProvider`, logs reached MMKV initialization and keyboard-extension loading with no safe-area error.
- **RAN**: the final native log then printed `Could not parse OutlineStyle:none` twice and aborted at `StyleValuePool.h:76`.
- **RAN**: the only relevant authored package values found are `node_modules/@tamagui/dialog/src/Dialog.tsx:638` and `node_modules/@tamagui/roving-focus/src/RovingFocusGroup.tsx:118`, both `outlineStyle="none"`.
- **INFERRED**: a negative-control engine patch would be required to prove that removing or platform-gating those upstream values prevents the assertion. This task does not own the engine, so the source and installed package were left unchanged.

## Codemod, skill, and guide feedback

- **RAN**: the report falsely marked valid `borderRadius` on Tamagui `View` as needing relocation at `app/(site)/blog/index+ssg.tsx:68` and `src/features/blog/BlogPostLayout.tsx:104`.
- **RAN**: it also falsely marked valid padding and radius props on `SizableText` at `app/(site)/blog/index+ssg.tsx:94` and `src/features/blog/BlogPostLayout.tsx:80`.
- **RAN**: `src/features/blocks/zones/StatsZone.tsx:27` was reported clean even though a conditional spread still contained `$sm`, `$md`, and `$lg`. The applied before/after is documented in the hand-fix section.
- **RAN**: the upgrade guide and skill incorrectly treated every legacy palette warning as a v6 rename even when the app intentionally retained the frozen v5 config. They now require checking the selected config pack.
- **RAN**: the flat-values command in this tarball did not rewrite `Sheet.Frame`; the tarball predated `58ed07002f`, which added that rewrite to the codemod. The upgrade guide's claim that the codemod rewrites `Sheet.Frame` holds at the tip and was kept.
- **RAN**: the local release flow cannot seed a newly introduced unpublished workspace package into a downstream that does not already have it. This affected `@tamagui/config-v5` and required the physical-unpack step described above.

## Remaining gap

- **INFERRED**: the chat migration itself is green for types, web, tests, production Expo export, native compilation, native install, Metro bundling, and initial JavaScript evaluation. A clean simulator UI smoke requires the upstream Tamagui native outline-style assertion to be fixed and the local packages to be rebuilt and unpacked again.
