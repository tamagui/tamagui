# Soot Tamagui v3 migration receipt

## Outcome

- **RAN** - Migrated Soot in `/Users/n8/.worktrees/soot-v3` on branch `v3`. The primary `/Users/n8/soot` checkout stayed on `main`.
- **RAN** - The inherited migration started at `fc3aa7e403e38ac45ee16eaaaf90768375172232`. The local branch head is `d5f28c58c879b6bbd6de3c7e7de59e1b48229191`.
- **RAN** - The latest Tamagui dependency commit is `9a16a0dfd92a2828c2f5e0fa53bef4bb60a34171`, which pins every `tamagui` and `@tamagui/*` dependency to the published npm beta `3.0.0-beta.917.1`, either directly or through the root `catalog:` entry.
- **RAN** - `origin/v3` remains at `9a16a0dfd92a2828c2f5e0fa53bef4bb60a34171`. The final main integration commit and generated warm-dependency refresh are deliberately local because the receiving coordinator requested no further Soot push.
- **TESTED** - The final dependency version passed the prerequisite build, production web build, root unit suite, template checks, mobile-template check, Tamagui flat-style check, and an isolated light/dark web runtime smoke.
- **RAN** - Direct root `npx tsgo --noEmit` is not green. It exited 1 with 759 diagnostics in 151 files. The inherited `RnxHero.tsx` parser errors are gone; the remaining output is recorded below rather than hidden behind `bun run check:types`.
- **RAN** - The iOS simulator smoke and native light/dark screenshots were not run before closeout. This is an explicit remaining gap.

## Commits

| SHA | Subject |
| --- | --- |
| `fc3aa7e403e38ac45ee16eaaaf90768375172232` | `chore(v3): migrate src/packages/app to tamagui v3 flat values` |
| `53ed5c4dadc61b8bed565826defe98bd88df5f4c` | `wip: tamagui v3 migration in progress` |
| `bda0967e8b7811ca58e3f69faf390320ef912cd2` | merge current `origin/main` |
| `f41bb614c695ab7b18e47edbde2e1d9a3f345952` | `chore(deps): upgrade tamagui dependency set to published version 3.0.0-beta.907.1` |
| `856ae8f850a7fc752f0761d00638ba1d6dd9645a` | `chore(deps): pin custom native camera fixture to Tamagui beta` |
| `2730cce3cbaa42ae0c5916e02f55f1df683fd27c` | `chore(v3): finish Tamagui v3 source migration` |
| `33b89c44b943ab0e2a52aa9da24f74c14a2812a4` | merge current `origin/main` |
| `9e7d1d8e931c0b00fd7d3e462979525bd1a08bab` | `chore(v3): migrate removed Tamagui component APIs` |
| `a535a36438a224ee7d765dededadb0599543c679` | merge current `origin/main` |
| `2a49c2f18545b217e59e06992ab4620b8d4f606f` | `test(v3): verify migrated sprout styles at runtime` |
| `9008a2103a3fb98e003dcbf57f60b5cc8b02eeb6` | merge current `origin/main` |
| `9a16a0dfd92a2828c2f5e0fa53bef4bb60a34171` | `chore(deps): update Tamagui beta to 3.0.0-beta.917.1` |
| `97c08e571935384e340fc115f8c77a29ad2180a7` | merge current `origin/main` |
| `d5f28c58c879b6bbd6de3c7e7de59e1b48229191` | `chore(v3): refresh warm Tamagui dependencies` |

## Dependency installation

Commands:

```sh
cd /Users/n8/.worktrees/soot-v3
export PATH="/Users/n8/.local/share/fnm/node-versions/v24.16.0/installation/bin:$PATH"
bun install
bun run generate:seed
```

- **RAN** - The first `bun install` immediately after the `3.0.0-beta.917.1` repin failed because Bun could not resolve `@tamagui/get-token@3.0.0-beta.917.1` while the npm publish was still propagating. An npm content check subsequently found the package, and the unchanged retry installed 140 packages successfully.
- **RAN** - No package manifest or generated seed retains `3.0.0-beta.907.1`.
- **RAN** - The isolated web startup regenerated `src/config/warmDeps.generated.json` to include `@tamagui/config-v5` while retaining the intentional static compatibility import `@tamagui/config/v5`; that generated delta is commit `d5f28c58c8`.

## Codemod

Final audit command:

```sh
cd /Users/n8/.worktrees/soot-v3
bun /Users/n8/tamagui/code/core/codemod-flat-values/src/index.ts \
  --report /tmp/soot-v3-flat-917.md \
  --json /tmp/soot-v3-flat-917.json \
  app src packages templates examples demos
```

- **RAN** - The `3.0.0-beta.917.1` codemod audit completed after roughly four minutes of spread analysis and reported `0 style sites`, `0 functional variants`, `0 Sheet.Frame sites`, and `0 source files ignored`.
- **RAN** - `npx tamagui check --styles-only` reported `✓ 2524 files, no flat value problems`.
- **RAN** - The earlier automated template edit did not match the second conditional `pressStyle` block in `templates/contrast-mobile/interface/chat/ComposerAttachmentDialog.tsx`. The first pass changed the value but left the v2 object prop. Commit `2730cce3cb` manually reconciles line 574 from `pressStyle={busyAction ? undefined : { bg: 'color4' }}` to `bg={busyAction ? undefined : 'press:color4'}`.

## Hand migration beyond the codemod

- **RAN** - Migrated legacy pseudo and presence objects (`enterStyle`, `exitStyle`, `hoverStyle`, `pressStyle`, and focus styles) to v3 flat values, including conditional and spread-authored sites.
- **RAN** - Migrated media objects, fractional token spellings, theme/platform clauses, transforms, shadows, and invalid theme-key spellings.
- **RAN** - Replaced `Sheet.Frame` with `Sheet.Container` and `Sheet.Background`, and migrated the removed toast v2 API.
- **RAN** - Replaced removed component APIs including `unstyled`, `chromeless`, styled option `name`, `fullscreen`, and `selectable`; moved WebKit backdrop filtering to raw web style where required.
- **RAN** - Kept `@tamagui/config/v5` where Soot intentionally consumes the frozen static v5 compatibility pack, while dynamic v5 theme builders now come from `@tamagui/config-v5`.
- **TESTED** - Replaced stale source-string Sprout assertions with runtime configuration assertions around shared `PET_TAP_BUTTON_PROPS`. The unit suite failed before this repair and passed afterward.

## Theme inline warning gap

The isolated development render emitted exactly:

```text
[tamagui] <Theme borderTopLeftRadius=...> no longer accepts inline values. Wrap the subtree in <ThemeUpdate borderTopLeftRadius=...> instead.
[tamagui] <Theme borderBottomLeftRadius=...> no longer accepts inline values. Wrap the subtree in <ThemeUpdate borderBottomLeftRadius=...> instead.
```

- **RAN** - A TypeScript AST sweep of every TSX/JSX file under `app`, `src`, `packages`, `templates`, `examples`, and `demos` found no authored `<Theme>` element with a non-reserved prop or spread. Output: `NO_JSX_THEME_INLINE_CALL_SITES`.
- **RAN** - Direct searches for `<Theme>` near `borderTopLeftRadius`, `borderBottomLeftRadius`, `btlr`, or `bblr` also returned no call site.
- **RAN** - Remaining authored Theme-inline call sites to list: none found. No speculative `ThemeUpdate` conversion was made because there is no source `file:line` that owns either prop.
- **INFERRED** - The runtime warning reaches `<Theme>` through generated or transformed props not visible as an authored Theme element. The flat-value codemod and `tamagui check --styles-only` both miss it, so locating transformed Theme provenance is a codemod/skill gap.

## Validation

Commands run at the Soot root with Node 24.16.0 on `PATH`:

```sh
npx tamagui check --styles-only
bun run check:types
bun run check:templates
bun run check:mobile-template
npx tsgo --noEmit
bun run build:prereqs:validate
bun run build:prod
bun run test:unit
bun run test:sootsim
bun run test:sootsim:gate
```

| Evidence | Command | Result |
| --- | --- | --- |
| **RAN** | `bun run check:types` | Passed, but is not accepted as the direct type gate because direct `tsgo` failed. |
| **RAN** | `bun run check:templates` | Passed. |
| **RAN** | `bun run check:mobile-template` | Passed with `0 type errors`. |
| **RAN** | `npx tsgo --noEmit` | Failed with 759 diagnostics in 151 files. The old `RnxHero.tsx` TS1382/TS17002 parser errors are absent. Of the diagnostic files, only `scripts/debug/mobile-ui-probe/cases.tsx` and `vite.config.ts` overlap the broad migration diff; the first is an unchanged missing `@m/...` alias, and the migration changed only the toast optimize-dependency line in the second. Log: `/tmp/soot-v3-tsgo-917.log`. |
| **RAN** | `bun run build:prereqs:validate` | Passed after the `3.0.0-beta.917.1` repin. Log: `/tmp/soot-v3-prereqs-917.log`. |
| **RAN** | `bun run build:prod` | Passed after the repin and compressed 4,597 files. Log: `/tmp/soot-v3-build-prod-917.log`. |
| **TESTED** | `bun run test:unit` | Passed after the repin. Log: `/tmp/soot-v3-unit-917.log`. |
| **TESTED** | `bun run test:sootsim` | Passed the four worker smoke tests before the final repin. It was not rerun on the final integrated head. |
| **TESTED** | `bun run test:sootsim:gate` | On the earlier beta, 508 passed and 15 failed. The full gate was not rerun on `3.0.0-beta.917.1`. |

Focused SootSim command on the final beta:

```sh
PLAYWRIGHT_WORKERS=1 PLAYWRIGHT_RETRIES=0 \
  bun scripts/run-sootsim-playwright.ts \
  packages/sootsim-engine/test/kitchen-sink/integration/pan-responder-shared-value-swipe.test.ts
```

- **TESTED** - On `3.0.0-beta.917.1`, the focused suite passed two tests and failed three. Log: `/tmp/soot-v3-pan-917.log`.
- **TESTED** - The identical focused suite in a temporary clean Soot `main` worktree at `d42b25741e` with Tamagui 2.7.7, isolated with `SOOTSIM_SHELL_PORT=6197`, passed the same two and failed the same three. Log: `/tmp/soot-v3-pan-baseline.log`. The baseline worktree was clean and removed.
- **INFERRED** - Those three focused SootSim failures are baseline behavior rather than a v3 regression because the independent v2 control produced the exact same result.

## Web runtime and screenshots

Commands:

```sh
cd /Users/n8/.worktrees/soot-v3
PORT_OFFSET=1740 bun run dev
```

The Playwright smoke opened `https://contrast.localhost:4740/` in separate 1440 by 1000 contexts with `colorScheme: 'light'` and `colorScheme: 'dark'`, asserted the page title and the visible strings `Create websites and apps that` and `iOS, Android, and web all at once.`, then captured PNG and converted with:

```sh
cwebp -quiet -q 90 /tmp/soot-v3-evidence/web-light-viewport.png \
  -o /tmp/soot-v3-evidence/web-light.webp
cwebp -quiet -q 90 /tmp/soot-v3-evidence/web-dark-viewport.png \
  -o /tmp/soot-v3-evidence/web-dark.webp
```

- **TESTED** - Both requests returned HTTP 200 and mounted the expected Contrast landing page.
- **TESTED** - Light computed `background: rgb(237, 237, 237)` and `color: rgb(5, 5, 5)`; dark computed `background: rgb(41, 41, 43)` and `color: rgb(255, 255, 255)`.
- **TESTED** - The quality-90 WebP screenshots are `/private/tmp/soot-v3-evidence/web-light.webp` and `/private/tmp/soot-v3-evidence/web-dark.webp`; both were shared through Team Machine without downscaling.
- **RAN** - The first cold light render also logged an existing nested-anchor hydration warning and an ignored `onPress` DOM-prop warning. The page remained mounted; these warnings were not changed or hidden.

## Remaining gaps

- **RAN** - Direct root `npx tsgo --noEmit` is red with the 759-diagnostic repository baseline described above.
- **RAN** - The full SootSim gate was not rerun on the final beta or after the final main integration.
- **RAN** - The two Theme-inline runtime warnings have no authored source call site, so they remain unresolved and should be used to improve transformed-provenance diagnostics in the codemod or upgrade skill.
- **RAN** - No iOS simulator build, launch, accessibility assertion, or native light/dark screenshot was completed.
- **RAN** - The prerequisite build, production build, unit suite, and Tamagui checks ran on `3.0.0-beta.917.1` before the final `origin/main` integration. The final integrated head received only the isolated web runtime smoke and generated warm-dependency refresh.
