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

## The compiler silently stops compiling (the #2 time sink)

The metro plugin computes a lowering plan per file, then transform workers look
it up by source hash. When they disagree the worker logs
`metro/plan-miss: ... (source-hash-mismatch)` and **ships the module
unlowered**, which is a warning in a wall of warnings and changes what your
harness measures without changing a line of your source:

- `NativeRegistryBenchCase.tsx` shipped unlowered in one session and lowered in
  the next from identical source. The same "tamagui baseline" scenario measured
  `styled()`/createComponent one time and the compiler's `_withStableStyle` the
  next, a 1.7x difference in the row everything else is compared against.
- Once a module ships unlowered it STAYS unlowered for the life of the metro
  session: metro's transform cache is keyed on file content and transformer
  options, and the plan is handed over out of band, so a fresh plan does not
  invalidate the cached output. Relaunching the app does not fix it. Only
  `bun expo start --clear` (or another edit to that file) does.
- So: after editing a file whose lowering matters, restart metro with `--clear`
  and confirm with `grep plan-miss <metro log>` that your file is not listed.
- Root cause, INFERRED from reading `code/compiler/metro-plugin/src/`
  (frontend `#watchModule` -> `void this.updateFile(id)`, transformer
  `cache.read(moduleId, args.src, ...)`) plus the observed behavior: the
  frontend republishes a file's plan from an `fs.watch` callback that is not
  awaited, and metro's own watcher can transform the new content first. The
  worker then finds only the old plan, ships the module unlowered, and metro
  caches THAT output against the new content hash, so the miss outlives the
  race that caused it. Worth fixing upstream: making a plan miss on an
  eligible file non-cacheable, or having the worker wait briefly for the
  republished generation, both beat a warning nobody reads in a wall of
  gradle-sized log output.
- Check what actually shipped without waiting on a 4-minute bundle fetch: the
  plan lives in
  `code/kitchen-sink/node_modules/.cache/tamagui/metro-compiler/ios/v4/`
  (`manifest.json` maps absolute path to a blob hash; the blob's `plan.edits`
  hold the emitted `_withStableStyle` / `_withNativeStyle` wrappers). To see
  the served module instead:
  `curl -s "http://localhost:8081/code/kitchen-sink/index.bundle?platform=ios&dev=true&minify=false"`.
- Do not build a harness that assumes either answer. Any scenario whose meaning
  depends on being lowered (or not) must prove it at runtime: the bench reports
  engine call counts and linked view count per scenario, and the runtime-mode
  grids build their elements with `createElement` so the compiler's JSX path
  can never claim them.

## Running the compiler-mode bench

1. `TAMAGUI_NATIVE_FAST_PATH=1 bun expo start --clear --port 8081` in
   `code/kitchen-sink`. The flag is env-gated in `metro.config.js` so normal
   sessions and CI are unaffected; with no engine installed the emitted
   `_withNativeStyle` wrapper falls back to the ordinary theme-hook path.
2. Wait for "Bundled", then launch with
   `-directUseCase NativeRegistryBenchCase` and tap the six run buttons.
3. Read `[bench]` lines. The path proof per scenario:
   `applyEntries > 0` is runtime mode, `stateNameCalls` only is compiler mode,
   `linkedViews: 0` on an engine scenario means it measured the React fallback.

## Android

- `code/kitchen-sink/android/` is gitignored and locally prebuilt, same as
  `ios/`. Build and install with
  `npx expo run:android --no-bundler --device test` from `code/kitchen-sink`
  (about 7 min clean, most of it the Nitro C++ NDK compile). `--device` wants
  the AVD NAME (`test`), not the adb serial: `--device emulator-5554` fails
  with "Could not find device with name".
- Boot the emulator headless with
  `$ANDROID_HOME/emulator/emulator -avd test -no-window -no-audio -gpu swiftshader_indirect`,
  then `adb reverse tcp:8081 tcp:8081` so the app reaches metro on localhost.
- Launch a case:
  `adb shell am start -n com.tamagui.tamaguikitchensink/.MainActivity -e directUseCase NativeRegistryParityCase`
  (`react-native-launch-arguments` reads intent extras). Drive it with
  `adb shell input tap X Y`, with coordinates from
  `adb shell uiautomator dump /sdcard/ui.xml && adb shell cat /sdcard/ui.xml`.
- Read results from `adb logcat -d | grep '\[parity\]'` and friends.
- This emulator ANRs under the 500-square bench and will swallow the tap that
  triggered it. Tapping "Wait" recovers the app; re-tap the button afterwards
  and confirm from the log, not from the fact that you tapped.
- Do not report emulator timings as benchmarks. Correctness (parity checks,
  engine call counts, media flips) is what this setup can prove.

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

## Release builds

- `TAMAGUI_NATIVE_FAST_PATH=1 npx expo run:ios --configuration Release --device <UDID>`
  from `code/kitchen-sink` builds and installs a release app with the JS bundle
  embedded (about 25 min cold). It replaces the debug app on that sim, so
  rebuild debug afterwards if you still need the dev loop.
- Grepping the embedded `main.jsbundle` for `_withNativeStyle` proves nothing:
  the release bundle is minified and the string is absent even when the module
  was lowered. Confirm lowering from the metro output instead
  (`grep plan-miss` over the build log) and from the engine call counts at
  runtime.
- No metro means no `[bench]` console lines. Read results from the on-screen
  text through the accessibility tree (`xcodebuildmcp ui-automation
  snapshot-ui`), which carries the full result line.
- **React.Profiler is a no-op in production React.** Every React counter reads
  0 in a release run, including `sq0Commits`, so a release build cannot show
  that the fast path skipped re-renders; it will show zero for the baseline
  too. The bench reports `profiled: false` in that case. Take re-render proof
  from dev and frame timing from release.

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

- Bench: tamagui (64,56), fastpath (170,56), compiled (279,56),
  compiled fast (82,101), native (198,101), rn (294,101)
- Parity: run parity (57,60), flip media (86,113)
- Re-derive from `snapshot-ui` after any layout change, or tap by testID
  (`xcodebuildmcp ui-automation tap --id runCompiledFast`), which is stable.

## Never compare numbers across app sessions

Medians on this sim move 1.5-2x between sessions for the same code: the
uncompiled baseline measured 133ms, 149ms, 166ms and 250ms on the same build.
Every claim of the form "X is faster than Y" needs X and Y measured in one app
session, which is why the bench runs all six scenarios from one screen. Two
conclusions in this plan were wrong for exactly this reason before the
one-session matrix replaced them.

## Remaining work (state as of 2026-08-04)

1. Release benchmark on REAL devices, iOS and Android. Release-on-simulator is
   done (see the plan); what is left needs the owner for device provisioning,
   and matters most for Android, where the emulator can prove correctness but
   not timing.
2. Publish the scope change where the theme changes instead of from `Theme`'s
   layout effect. Compiler mode's engine commit currently cannot start until
   React has scheduled, rendered and committed, which is about 22ms of the
   52ms it takes; the engine work itself is already at the floor.
3. Emit RN's `unstable_NativeView` instead of `require('react-native').View`
   for compiled elements whose static props need neither aria handling nor
   TextAncestorContext. Worth about 18% of React render time on a trivial
   view, and it helps the paths that re-render, which is the compiled baseline
   rather than the fast path.
4. Detox correctness coverage (Phase 2): nested scopes, list virtualization
   re-linking, unmount/remount churn.
5. Takeout hit-rate measurement; native CLI aggregate found/bailed stats;
   DynamicColorIOS supersede implementation.
6. The metro plan-miss race above, which silently disables the compiler for a
   file for the rest of a session.
