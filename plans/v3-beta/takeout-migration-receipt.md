# Takeout Tamagui v3 migration receipt

## Outcome

- **RAN** - Migrated Takeout from commit `d6199b193aa44ad05246e884fad56ac9a1316c95` in the isolated worktree `/Users/n8/.worktrees/takeout-v3` on branch `v3`.
- **RAN** - The Takeout commits are `4780545c` (`style: format database adapter test`) and `5b7d3861` (`feat: migrate app to Tamagui v3`). Neither commit was pushed or merged.
- **RAN** - The shared `/Users/n8/takeout` checkout stayed on `main`. All baseline builds ran in a detached worktree at the same `d6199b19` source commit.
- **RAN** - Local packages came only from `cd /Users/n8/tamagui && bun release --into /Users/n8/.worktrees/takeout-v3`. The unpacked `node_modules/tamagui/package.json` version was `2.7.7`, so Takeout's exact Tamagui dependency strings already matched the tarballs.
- **RAN** - `tamagui.build.ts` keeps only `components: ['tamagui']`. The compiler discovered every other component package on demand.
- **TESTED** - Typecheck, production web build, iOS Expo export, unit tests, integration tests, browser flows, a Release iOS simulator build, install, and launch all passed.

Machine for both sides: macOS 26.5.1 arm64, Bun 1.3.14, Node 24.3.0. The exact shell prefix was:

```bash
eval "$(fnm env --shell zsh)"
fnm use 24.3.0
```

## Before and after numbers

The v2 and v3 measurements below use the same commands, machine, base commit, environment files, and Node/Bun versions. Web gzip totals sum each generated JS or CSS asset compressed independently at gzip level 9.

| Evidence | Metric | v2 `main` at `d6199b19` | v3 branch | Delta |
| --- | --- | ---: | ---: | ---: |
| **RAN** | Web build wall time | 13.13 s | 14.43 s | +1.30 s, +9.90% |
| **RAN** | Vite bundle time | 9.01 s | 10.51 s | +1.50 s, +16.65% |
| **RAN** | JS gzip | 1,246,577 B across 303 files | 1,257,947 B across 302 files | +11,370 B, +0.91% |
| **RAN** | CSS gzip | 61,011 B across 47 files | 64,705 B across 46 files | +3,694 B, +6.05% |
| **RAN** | Total app JS + CSS gzip | 1,307,588 B | 1,322,652 B | +15,064 B, +1.15% |
| **RAN** | Tamagui analyzer rendered bytes | 997,196 B | 1,048,482 B | +51,286 B, +5.14% |
| **RAN** | Tamagui analyzer gzip | 304,477 B, 23.29% of app gzip | 317,170 B, 23.98% of app gzip | +12,693 B, +4.17% |
| **RAN** | Tamagui analyzer parts | 366 | 383 | +17 |
| **RAN** | iOS Expo embedded bundle | 10,688,315 B | 10,830,770 B | +142,455 B, +1.33% |
| **RAN** | iOS Expo modules | 4,100 | 4,019 | -81, -1.98% |
| **RAN** | iOS Expo export wall time | 20.20 s | 33.82 s | +13.62 s, +67.43% |
| **RAN** | TypeScript wall time | 7.59 s | 6.39 s | -1.20 s, -15.81% |
| **RAN** | TypeScript check time | 5.20 s | 4.37 s | -0.83 s, -15.96% |
| **RAN** | TypeScript instantiations | 1,749,874 | 1,284,724 | -465,150, -26.58% |
| **RAN** | TypeScript memory | 1,518,029 K | 1,288,306 K | -229,723 K, -15.13% |
| **RAN** | Compiler candidates found | 660 | 806 | +146, +22.12% |
| **RAN** | Compiler flattened | 468 | 642 | +174, +37.18% |
| **RAN** | Compiler retained | 192 | 159 | -33, -17.19% |
| **RAN** | Compiler flatten rate | 70.91% | 79.65% | +8.74 percentage points |

### Exact measurement commands

Run from each worktree:

```bash
/usr/bin/time -p env ANALYZE=1 TAMAGUI_COMPILER_STATS=1 bun run web build --prod
```

The production build generated 41 static pages including all 20 documentation pages and passed its client-secret scan on both sides. The gzip command was:

```bash
bun -e "import { gzipSync } from 'node:zlib'; import { readdirSync, readFileSync, statSync } from 'node:fs'; import { join } from 'node:path'; const root='dist/client'; const files=[]; const walk=(d)=>{for(const n of readdirSync(d)){const p=join(d,n);statSync(p).isDirectory()?walk(p):files.push(p)}};walk(root);for(const ext of ['.js','.css']){const picked=files.filter(x=>x.endsWith(ext));console.log(ext,picked.length,picked.reduce((n,f)=>n+gzipSync(readFileSync(f),{level:9}).byteLength,0))}"
```

`ANALYZE=1` produced `dist/client/bundle_stats.json`. The Tamagui share includes module IDs below either `node_modules/tamagui/` or `node_modules/@tamagui/`:

```bash
bun -e "import { readFileSync } from 'node:fs'; const data=JSON.parse(readFileSync('dist/client/bundle_stats.json','utf8')); const ids=new Set(); let modules=0; for(const meta of Object.values(data.nodeMetas)){if(/\/node_modules\/(?:tamagui|@tamagui)\//.test(meta.id)){modules++;for(const id of Object.values(meta.moduleParts))ids.add(id)}}const parts=[...ids].map(id=>data.nodeParts[id]).filter(Boolean);console.log({modules,parts:parts.length,rendered:parts.reduce((n,x)=>n+x.renderedLength,0),gzip:parts.reduce((n,x)=>n+x.gzipLength,0),brotli:parts.reduce((n,x)=>n+x.brotliLength,0)})"
```

Native export and bundle size:

```bash
/usr/bin/time -p bunx expo export --platform ios --clear --output-dir dist-expo
stat -f '%z %N' dist-expo/_expo/static/js/ios/*.hbc
```

TypeScript:

```bash
/usr/bin/time -p bunx tsc --noEmit --extendedDiagnostics
```

V2 compiler totals were summed from the plugin's per-module rows. V3 printed its aggregate directly and also wrote verbose JSON:

```bash
TAMAGUI_COMPILER_STATS=verbose \
TAMAGUI_COMPILER_STATS_JSON=/tmp/takeout-v3-compiler-stats.json \
bun run web build --prod
```

The v3 compiler totals were 104 modules with candidates, 806 found, 647 lowered, 642 flattened, 5 partial, 171 styled, and 159 bailed. Bailouts were 75 `local/unsupported-target`, 46 `local/dynamic-style-value`, 38 `local/unsafe-style-spread`, and one `linked/unresolved-binding` diagnostic.

- **RAN** - No component package failed on-demand discovery or flattening with `components: ['tamagui']` as the only warm-up entry.
- **RAN** - The linked diagnostic was `src/zero/client.tsx`: `Module './batchUpdates' has no export 'unstable_batchedUpdates'`. Both platform files export that symbol, and the file's three candidates were all lowered and flattened, so this is a platform-resolution diagnostic rather than a retained component package.

## Codemod receipt

The packed `tamagui` package has no executable, so the requested consumer command failed before printing a report:

```bash
npx tamagui migrate --from v2
```

The local CLI entry produced the complete migration prompt instead:

```bash
bun /Users/n8/tamagui/code/core/cli/src/cli.ts migrate --from v2
```

The flat-values report and write passes were:

```bash
bun /Users/n8/tamagui/code/core/codemod-flat-values/src/index.ts \
  --report /tmp/takeout-v3-flat-report.md \
  --json /tmp/takeout-v3-flat-report.json \
  app src packages

bun /Users/n8/tamagui/code/core/codemod-flat-values/src/index.ts \
  --write \
  --report /tmp/takeout-v3-flat-write.md \
  --json /tmp/takeout-v3-flat-write.json \
  app src packages
```

- **RAN** - The initial report covered 801 style sites: 663 clean, 82 `needs-relocation`, 29 unknown hosts, 6 ineligible hosts, 11 syntax flags, and 21 palette warnings. It found one functional variant and converted that one automatically.
- **RAN** - The 82 relocation rows were false positives for View/Text props accepted by the generated v3 types. Each was retained after typecheck and runtime verification.
- **RAN** - The 21 palette names are valid values in the retained static v5 pack, so they remain unchanged.
- **RAN** - The final report command returned zero style sites, zero functional variants, and zero ignored source files:

```bash
bun /Users/n8/tamagui/code/core/codemod-flat-values/src/index.ts \
  --report /tmp/takeout-v3-flat-final.md \
  --json /tmp/takeout-v3-flat-final.json \
  app src packages
```

### Hand fixes outside the codemod

- **RAN** - Replaced runtime `createV5Theme()` generation with static `themes` from `@tamagui/config/v5`, then removed the direct `@tamagui/themes` dependency.
- **RAN** - Converted exact token literals outside Tamagui style props, including app-owned variant maps, icon sizing, theme reads, and runtime style values. Dotted token names use the v3 hyphen spelling and `$true` uses `4`.
- **RAN** - Replaced responsive non-style `size` values with explicit `fontSize` and `lineHeight` clauses where the prop was text behavior rather than a Tamagui style token.
- **RAN** - Flattened runtime condition objects and conditional spreads in ProBadge, AIChatInput, Input, ScrollHeader, Popover, ListItem, themed shadows, and web-only background clipping.
- **RAN** - Replaced `fullscreen` with explicit position/inset props and migrated pseudo, media, theme, platform, group, shadow, and transform objects to flat clauses.
- **RAN** - Migrated six Sheet callsites from `Sheet.Frame` to `Sheet.Container` plus `Sheet.Background`, preserving layout props on the container and visual props on the background.
- **RAN** - Migrated Select item indexes, the v3 value-change details argument, and the trigger caret child.
- **RAN** - Converted Button's missed sibling-prop functional variant from `true: (_, { props }) => ...` to `styled.dynamic<boolean>()` plus `ButtonFrameBase.resolve((props) => ...)`.
- **RAN** - Replaced `@tamagui/toast/v2` imports and warm dependency entries with `@tamagui/toast`.
- **RAN** - Removed deprecated `unstyled` and shorthand/longhand patterns that no longer typecheck, and narrowed icon sizes to the v3 `SizeTokens` shape.
- **RAN** - Updated Tooltip aliases and z-index typing, removed obsolete styled names, and migrated Dialog/Popover/Select/Sheet anatomy and props.
- **RAN** - Switched the web CSS driver to `@tamagui/animations-css/extras`. The root entry lacks the animated-number hooks used by Sheet and threw during the Sheet smoke test.
- **RAN** - Replaced `export * from 'react-native-svg'` with the exact SVG primitives Takeout uses. Vite could not interoperate the broad export, which made `OneLogo` undefined during landing-page SSG.
- **RAN** - Added the ejected `babel.config.cjs` and `metro.config.cjs` so Expo export is reproducible.
- **RAN** - Added `@react-native-community/cli@20.2.0` and declared its external Xcode-script use in `knip.json`. The Release iOS build failed at the React Native bundle phase without it.
- **RAN** - Deleted the fully commented, unreferenced `NotificationBell.tsx` file.
- **RAN** - Applied oxfmt to the one formatting miss introduced by the current `main` base commit in `packages/database/src/better-auth.test.ts`; this is isolated in `4780545c`.

## Validation

| Evidence | Command or probe | Result |
| --- | --- | --- |
| **RAN** | `bun run format:check` | Passed on 820 files |
| **RAN** | `bun run lint` | Passed with 19 existing warnings and zero errors |
| **RAN** | `bun run check` | All dependency, lint, type, and knip scripts completed successfully |
| **RAN** | `bun run test:unit` | Database 9 passed, run package 4 passed, Vitest 10 files and 75 tests passed |
| **RAN** | `bun run test:integration` | 18 Playwright tests passed, zero retries on the final run |
| **RAN** | `bunx tsc --noEmit --extendedDiagnostics` | Passed with zero type errors |
| **RAN** | `ANALYZE=1 TAMAGUI_COMPILER_STATS=1 bun run web build --prod` | Production web build passed, 41 pages and all 20 docs generated, secret scan passed |
| **RAN** | `bunx expo export --platform ios --clear --output-dir dist-expo` | Passed, 4,019 modules bundled |
| **TESTED** | `node /tmp/takeout-v3-flow.mjs` against the running app | Asserted landing page mount, auth screen, Zero-connected feed, post dialog, mobile menu Sheet, and a visible white-to-dark theme change; no page errors |

The browser evidence is stored without downscaling as WebP quality 90:

- [Auth screen](./takeout-migration-evidence/web-auth.webp)
- [Main feed list](./takeout-migration-evidence/web-main-list.webp)
- [Sheet](./takeout-migration-evidence/web-sheet.webp)
- [Dialog](./takeout-migration-evidence/web-dialog.webp)
- [Theme switch](./takeout-migration-evidence/web-theme-switch.webp)

### Native launch smoke

Commands:

```bash
bun ios:prebuild
bunx pod-install ios
xcodebuildmcp simulator build \
  --workspace-path /Users/n8/.worktrees/takeout-v3/ios/TakeoutDev.xcworkspace \
  --scheme TakeoutDev \
  --simulator-id F4C2962B-5DC1-4251-920B-8A9327C1B0A2 \
  --configuration Release \
  --derived-data-path /tmp/takeout-v3-derived
xcodebuildmcp simulator install \
  --simulator-id F4C2962B-5DC1-4251-920B-8A9327C1B0A2 \
  --app-path /tmp/takeout-v3-derived/Build/Products/Release-iphonesimulator/TakeoutDev.app
xcodebuildmcp simulator launch-app \
  --simulator-id F4C2962B-5DC1-4251-920B-8A9327C1B0A2 \
  --bundle-id dev.tamagui.takeout.dev
xcodebuildmcp simulator snapshot-ui \
  --simulator-id F4C2962B-5DC1-4251-920B-8A9327C1B0A2 \
  --output text
```

- **TESTED** - The Release simulator build succeeded. Its embedded `main.jsbundle` was 11,219,779 bytes.
- **TESTED** - The final app installed and launched as `dev.tamagui.takeout.dev`. The accessibility snapshot contained `Takeout`, `Continue with Email`, `Login Demo`, `Google`, and `Apple`.
- **TESTED** - [Native auth launch](./takeout-migration-evidence/native-auth-launch.webp) is the final Release app after the dependency and animation fixes.

## Contract and codemod feedback

- **RAN** - Updated the v3 upgrade guide, migration skill, CLI prompt, and CLI test to say the npm package does not contain the Sheet source codemod, expand file paths for the source-only script, and require `@tamagui/animations-css/extras` for CSS Sheet apps.
- **RAN** - Prepared the functional-variant miss, false relocation flags, CLI packaging gap, Sheet command gap, and before/after fixes for `r16844` with file and line evidence. `tm send r16844 --stdin` returned `session is not live`, so the same evidence is included in this receipt and the final `r16625` handoff.

## Remaining observations

- **RAN** - The v3 app gzip total increased 1.15%, its Tamagui-attributable gzip increased 4.17%, and its native embedded bundle increased 1.33%.
- **RAN** - TypeScript instantiations decreased 26.58%, compiler flatten rate improved by 8.74 percentage points, and the paired TypeScript wall time decreased 15.81%.
- **INFERRED** - The one compiler linked-binding diagnostic is a platform resolver false positive because both platform modules export the symbol and all three candidates in the importing file flattened. It did not affect either production build.
