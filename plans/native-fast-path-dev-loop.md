# Native fast path: on-device dev loop and traps

Operational knowledge for working on `plans/native-fast-path.md` (v3-beta).
Everything here was paid for in lost hours; read it before touching the loop.

## Where the work lives

- Worktree `~/.worktrees/native-registry`, branch `native-registry-work`,
  pushes go to `origin/v3-beta` (`git push origin native-registry-work:v3-beta`).
- `code/tamagui.dev/tamagui.generated.css` is a build artifact someone else
  owns; it blocks `git pull --rebase`. Back it up to a temp dir,
  `git checkout --` it, rebase/push, copy it back. Never commit it.
- CI on v3-beta cancels in-progress runs on every push. Batch pushes; if
  another agent is waiting on a clean run, coordinate before pushing.

## Build and bundle ordering (the #1 time sink)

1. Core changes require rebuilding dists in order: `bun run build` in
   `code/core/web` FIRST, then `code/core/core`. The test bundle
   (`dist/test.native.cjs`) and metro both consume web's dist through core.
2. Metro runs with `useWatchman=false`: it picks up KITCHEN-SINK SOURCE edits
   but NOT rebuilt dists in node_modules. After a core rebuild, restart metro
   with `bun expo start --clear --port 8081` (in `code/kitchen-sink`); the
   clear rebundle takes ~3.5 min.
3. Killing the metro wrapper does not kill metro. Free the port with
   `kill $(lsof -nP -iTCP:8081 -sTCP:LISTEN -t)`.
4. Launch the app only AFTER "Bundled" appears in the metro log or it
   red-screens; when in doubt, terminate and relaunch.

## Driving the simulator (no GUI, no mouse)

- Sim UDID `F91BE159-9281-46C9-9F53-01A640D9010A` (iPhone 17). Boot and run
  headless via `xcrun simctl`; do NOT open Simulator.app or script it with
  osascript/cliclick — that grabs the user's input devices and rotation via
  the Device menu doesn't work from AX anyway.
- Launch a case directly:
  `xcrun simctl launch <UDID> com.tamagui.tamaguikitchensink -directUseCase NativeRegistryParityCase`
  (fresh launch required for the arg to apply; terminate first).
- Tap via `xcodebuildmcp ui-automation tap --simulator-id <UDID> --id <testID>`
  (or `-x/-y` from `snapshot-ui` frames). These go through simulator HID.
- Media/rotation testing needs NO rotation: the parity case's `flip media`
  button fires `Dimensions.set()` with swapped dims — the exact event the
  media driver subscribes to. The app is landscape-enabled (app.json
  `orientation: default`), but `ios/` is gitignored, so a fresh prebuild
  regenerates Info.plist from app.json.
- Read results from metro log markers: `[parity]`, `[bench]`, `[showdown]`,
  `[mediaflip]`/`[mediaflush]`. Console bursts of hundreds of lines get
  dropped by the log transport — keep probes capped, prefer engine-side
  counters (`getStats()`, `getViewState(id)`).
- Shell trap: background scripts run under zsh, which does NOT word-split
  unquoted variables (`set -- $spec` keeps one arg). Loops that parse
  coordinate strings must be zsh-safe.

## Tests

- JS suite: `bun run test:native` in `code/core/core-test` — the script sets
  `TAMAGUI_TARGET=native`, which the vite config bakes as a define. Raw
  `npx vitest` without the env yields false failures (`var(--c-white)`
  instead of `#fff`). The suite is order-dependent on that env; never
  diagnose "regressions" from a raw vitest run.
- react-test-renderer needs `render(..., { createNodeMock: () => ({}) })`.

## Harness bug or core bug? (the honest-diagnosis checklist)

Five on-device "failures" in the verification pass split 3 harness / 2 core.
Before touching engine code, check the harness for these known shapes:

- Border/radius/padding shorthands expand per-side in computed styles
  (`borderTopColor`, `borderTopLeftRadius`, `paddingBottom`...). A check for
  `borderColor` will always "fail".
- `padding: '$2'` means `paddingBottom` ALWAYS exists — a `sm:`-only
  paddingBottom can never exercise the dropped-key null reset. Use a key
  with no base value (the parity square uses `minHeight: 'sm:70'`).
- String flat candidates resolve through token scales: `'2 sm:6'` on
  borderWidth pushes the size-token VALUES, not the literals. Assert
  presence/change, not exact numbers.
- Warm-cache truth: the mounting render's state is never pushed, so the
  FIRST toggle back to it is cold; only the second visit to a state is warm.
  Any prior push (including a media flip) warms that state and changes
  parity expectations — run parity on a fresh launch.
- Profiler callbacks passed to memoized grids MUST be identity-stable
  (useRef/useCallback). An inline arrow invalidates the grid's useMemo per
  parent render and every square remounts — this alone faked "1 re-render
  per toggle" in the bench until fixed.
- Bare v6 defaultConfig has no `blue` theme: `<Theme name="blue">` is a
  silent no-op there (kitchen-sink adds blue via themeDev). A "pinned theme
  received pushes" failure may be a nonexistent theme.
- The real core bugs both had the same signature: values correct in JS
  tests, wrong on device. `$`-token normalization (directStyle
  `tokenVariable`) and media recomputes reading the render-captured
  `styleProps.mediaState` (a frozen snapshot in `first-render` mode, the
  native default). If a value is stale on device, suspect a render-captured
  closure before suspecting the engine.

## Measurement honesty (see plan's honesty protocol)

- A benchmark that never increments the engine commit counter measured
  nothing. Read `getStats()` before/after.
- Per-square Profiler controls stay in every scenario: if the fast path
  breaks, its render cost must APPEAR, not stay at a flattering zero.
- On the shared JS thread, "time to visually done" for the fast path
  measures the OTHER panel's jank (its flush microtask queues behind
  baseline renders). Compare per-panel React render cost instead — that's
  why the showdown HUD shows `React render per toggle`.
- `simctl io recordVideo` needs `--force` to overwrite; without it you
  silently analyze the previous take.

## Current tap targets (portrait, iPhone 17)

- Bench: fastpath (170,57), tamagui (64,57), native (269,57), rn (62,102)
- Parity: run parity (57,60), flip media (86,113)
- Re-derive from `snapshot-ui` after any layout change.

## Remaining work (state as of 2026-08-04)

1. Compiler emit mode on-device: never run on a device. Wire a
   compiler-emitted (`_withNativeStyle`) scenario into the bench case; it
   should close the 150ms (runtime mode) → 42ms (pure native) jsDone gap.
   This is the headline number the effort exists for.
2. Release-build benchmark on a real device (all current numbers are
   dev-mode sim; the plan explicitly owes this).
3. Android first boot (packagingOptions build break was fixed, zero runs so
   far).
4. Detox correctness coverage (Phase 2): nested scopes, list virtualization
   re-linking, unmount/remount churn.
5. Takeout hit-rate measurement; native CLI aggregate found/bailed stats;
   DynamicColorIOS supersede implementation.
