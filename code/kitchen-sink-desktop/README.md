# Tamagui Expo Desktop playground

This is an isolated Expo SDK 54 app for validating Tamagui on native desktop. It currently targets
macOS, while keeping the generated React Native Windows project ready for follow-up work. It is not
part of the root Bun workspace and owns its `bun.lock` and `node_modules`.

The native projects were created with `expo-desktop@0.1.37` and pinned to this compatible set:

- React Native 0.81.6
- React Native macOS 0.81.9
- React Native Windows 0.81.32
- React 19.1.4 and Expo SDK 54

## Run on macOS

Install Bun, Node 24, Xcode 16.1 or newer, CocoaPods, and Watchman. From this directory:

```sh
bun install --frozen-lockfile
bun run macos
```

If CocoaPods needs to be refreshed after changing dependencies:

```sh
cd macos
pod install
cd ..
```

The V5 config package offers several optional animation drivers. This playground uses the React
Native animation driver; its Reanimated and Worklets peers remain excluded from Expo autolinking
because the versions selected transitively by Tamagui do not target React Native 0.81.

The app opens on a component playground with three tabs:

1. **Portal lab** exercises direct Portal and a three-layer direct-Portal stacking circuit. Tooltip,
   Popover, Select, Menu, ContextMenu, Dialog, AlertDialog, Sheet, and Toast remain visible as
   disabled diagnostics where the current native desktop implementation is incomplete.
2. **Components** covers stateful Input, Switch, Checkbox, RadioGroup, Tabs, Slider, and Progress
   specimens.
3. **Desktop events** preserves the original hover, nested group, button, and raw React Native
   pointer regression probes.

The Portal lab deliberately labels unsupported surfaces instead of mounting a path known to crash.
That keeps the playground useful as both a smoke test and a compact inventory of the remaining
native desktop gaps.

## Test a local Tamagui build

First build Tamagui from the repository root. For an active debugging session, the root watcher is
the quickest option:

```sh
cd ../..
bun install --frozen-lockfile
bun run watch
```

In another terminal, install this app and replace its published Tamagui packages with links to the
local monorepo packages:

```sh
cd code/kitchen-sink-desktop
bun install --frozen-lockfile
bun run link:tamagui
TAMAGUI_USE_LOCAL=1 bun run macos
```

`TAMAGUI_USE_LOCAL=1` watches the linked Tamagui package sources while keeping React, React Native,
and other third-party resolution pinned to this app's isolated dependency graph. Restore the
published packages before updating the lockfile or dependencies:

```sh
bun run unlink:tamagui
bun install --frozen-lockfile
```

Run `bun run typecheck` for a quick JavaScript-side configuration check.

## Windows follow-up

The Windows C++ project is committed but has not been validated on this macOS-focused pass. On a
Windows development machine, install dependencies, regenerate native autolinking, and launch it:

```powershell
bun install --frozen-lockfile
bun run autolink-windows
bun run windows
```

For a locally linked Tamagui build in PowerShell, run `bun run link:tamagui`, set
`$env:TAMAGUI_USE_LOCAL = '1'`, and then run `bun run windows`.

`expo-desktop prebuild` is not implemented in 0.1.37, so treat the committed `macos` and `windows`
directories as source. Use the pinned generator templates when intentionally regenerating them.
