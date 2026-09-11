# core runtime cleanup audit

## Summary

- **READ:** `isPlainObject` is copied verbatim in three web runtime helpers, creating a clear DRY and drift seam.
- **READ:** the React Native Web internals package carries the same `normalizeColor` algorithm in its public module path and compiler path.
- **READ:** `@tamagui/calc` is a published package whose own source calls itself unused, and no `@tamagui/calc` or `core/calc` import exists anywhere under `code/`.
- **READ:** `@tamagui/use-keyboard-visible` has no source caller or deep import under `code/`; Sheet still declares it and keeps a project reference even though Sheet owns a different keyboard controller implementation.
- **READ:** `debug="break"` is part of the public `DebugProp` union but its only runtime branch is an empty block containing a comment.
- **READ:** `getSplitStyles.tsx` still contains a commented-out early-return benchmark probe in the core style splitter.
- **READ:** `@tamagui/config-base` and `@tamagui/theme-base` are full published package shells whose entire source entry is an unconditional deprecation throw; no code import exists under `code/`.
- **READ:** the native `@tamagui/animations-motion` entry is typed as a complete `AnimationDriver` but returns only four fields, so the resolver rejects it and native callers get no usable driver.
- **READ:** `generateThemes` explicitly purges cache on its second invocation, but its Bun path reads the nonexistent CommonJS `module` global; a two-call Bun probe fails on the second call before generating output.
- **READ:** core contains 16 independently published `use-*` or React Native hook packages with their own build/export/type surfaces; six have no aggregate barrel export in `code/core` or `code/ui`, and one has no source caller.
- **READ:** `@tamagui/get-token` and `@tamagui/web` expose two token-resolution contracts, one policy-resolving size/radius/space helpers and one generic exact-key lookup, while the composite root exports only the latter.
- **READ:** `@tamagui/use-event` and `@tamagui/react-native-web-internals` both publicly export `useEvent` with incompatible signatures, callback-to-stable-function versus event-name-to-listener-handle.

## Findings

### F1. Three web helpers copy the same `isPlainObject` predicate  [severity: med] [size: S] [label: READ]

- Evidence: `code/core/web/src/helpers/mergeVariants.ts:5-11`, `code/core/web/src/helpers/createStyledContext.tsx:66-72`, and `code/core/web/src/helpers/getSplitStyles.tsx:100-106` each contain the same six-line implementation: reject null/non-objects/arrays, then accept only `Object.prototype` or `null` prototypes. `rg -n "function isPlainObject" code/core` found these three runtime definitions.
- Why it matters: **INFERRED** - three copies can drift independently, and every caller is asking the same object-shape question. The duplication is especially undesirable because one copy sits in `getSplitStyles`, a central runtime path.
- Proposed change: move the predicate to one shared internal helper in the existing core helper surface and import it from all three files. Keep the exact prototype semantics.
- Risk / what could make this wrong: **READ** - the three current bodies are equivalent. The only material implementation risk is choosing a shared export that changes the intended package graph; keep it internal to the existing web package if bundle boundaries make that preferable.

### F2. React Native Web keeps two copies of the same color-channel normalization algorithm  [severity: low] [size: S] [label: READ]

- Evidence: `code/core/react-native-web-internals/src/modules/normalizeColor/index.tsx:17-30` and `code/core/react-native-web-internals/src/StyleSheet/compiler/normalizeColor.tsx:14-27` both null-check, preserve `isWebColor`, call `processColor`, unpack RGBA channels with the same bit shifts, format alpha with `.toFixed(2)`, and return the same `rgba(...)` string. The compiler file adds only a web fallback at lines 30-34. The module path is exported from `code/core/react-native-web-internals/src/index.tsx:38`, while the compiler copy is used by `StyleSheet/preprocess.tsx:11`.
- Why it matters: **INFERRED** - if this were repo-owned code, fixes to channel extraction or alpha formatting could drift between paths. This is a low-priority observation because `code/core/react-native-web-internals` is a vendored React Native Web fork, so its upstream-shaped duplication is not a Tamagui package design failure.
- Proposed change: treat this as an upstream-vendoring note unless Tamagui has intentionally diverged from React Native Web. Do not spend core cleanup time merging it. Do not merge this with Tamagui web's separate `color-mix` implementation in `code/core/web/src/helpers/normalizeColor.ts:6-18`.
- Risk / what could make this wrong: **READ** - the two callers have different input types and the compiler has extra fallback behavior. Any upstream sync must preserve those differences.

### F3. `@tamagui/calc` is an unpublished-in-repo caller with an explicitly unused implementation  [severity: med] [size: S] [label: READ]

- Evidence: `code/core/calc/src/index.ts:9` says `unused code - not exported could be used for cross compat calc() functions`, while `code/core/calc/src/index.ts:17-71` does export `calc`. `code/core/calc/package.json:2,14-24,29-36` presents it as a normal root-exported package with a build script and a dependency on `@tamagui/core`. A whole-`code/` search for `@tamagui/calc`, `core/calc`, and `calc/src` returned only `code/core/calc/package.json:2`; there are no source imports or deep imports.
- Why it matters: **INFERRED** - the package builds and exposes code that the repository does not consume, while the source comment and public export contradict each other. It adds package maintenance and release surface without an in-repo consumer.
- Proposed change: decide whether `calc` is still a supported public API. If it is not, remove the package from the workspace and correct any package lists; if it is, remove the stale comment, add a real caller, and document the compatibility contract before keeping it.
- Risk / what could make this wrong: **GUESS** - external applications may import `@tamagui/calc`; the repository search proves only that there are no callers inside `code/`, not that npm consumers do not exist. Treat package removal as a release decision.

### F4. `@tamagui/use-keyboard-visible` has no source callers and Sheet retains a stale dependency/reference  [severity: med] [size: S] [label: READ]

- Evidence: `code/core/use-keyboard-visible/src/useKeyboardVisible.ts:1-21` is a standalone hook, but a whole-`code/` search for both `@tamagui/use-keyboard-visible` and `core/use-keyboard-visible` found no source import or deep import. The only non-manifest references are `code/ui/sheet/package.json:61` and `code/ui/sheet/tsconfig.json:30`. Sheet's actual implementation is `code/ui/sheet/src/useKeyboardControllerSheet.ts:30-142`, which owns its own `isKeyboardVisible` state and event handling; `rg -n "useKeyboardVisible" code/ui/sheet code/core` finds no Sheet source caller.
- Why it matters: **INFERRED** - the package and Sheet's dependency/project-reference entries create a dead graph edge and preserve a second, simpler keyboard hook beside the implementation Sheet actually uses.
- Proposed change: remove the stale Sheet dependency and TypeScript project reference, then either retire the uncalled package or explicitly mark it as external compatibility API with an owner and usage policy.
- Risk / what could make this wrong: **GUESS** - consumers outside this monorepo may import the published hook. Removing the package itself needs a compatibility/release decision; removing only the demonstrably unused Sheet graph edges is lower risk.

### F5. The public `debug="break"` option is a no-op  [severity: low] [size: S] [label: READ]

- Evidence: `code/core/web/src/types.tsx:569` includes `'break'` in `DebugProp = boolean | 'break' | 'verbose' | 'visualize' | 'profile'`. The only matching runtime branch is `code/core/web/src/createComponent.tsx:2166-2168`, an empty `if (debugProp === 'break')` containing only `// debugger intentionally here for debugging`. A whole-`code/` search for `debugProp === 'break'`, `debug="break"`, and `debugger` found no implementation or call site for this mode.
- Why it matters: **INFERRED** - users can opt into a documented-looking debug mode and receive the regular verbose debug output without the promised break behavior. The option name and the shipped behavior disagree.
- Proposed change: remove `'break'` from the public type and the empty branch, or implement a deliberate development-only breakpoint with a testable owner-approved contract. Removing the dead branch is the smaller cleanup.
- Risk / what could make this wrong: **GUESS** - a local developer may have been expected to place a breakpoint manually at that location. If so, the public option should not advertise a behavior the runtime does not provide.

### F6. A commented performance-probe return remains in the hot style splitter  [severity: low] [size: S] [label: READ]

- Evidence: `code/core/web/src/helpers/getSplitStyles.tsx:276-293` is a fully commented-out early return with the instruction to add it to test performance. It returns a reduced style result containing `space`, `hasMedia`, selected `viewProps`, and selected styles. It is not referenced by executable code.
- Why it matters: **INFERRED** - this is debug instrumentation preserved in a central runtime file, and the comment instructs future edits to mutate production code for profiling. It increases ambiguity about which return shape is current.
- Proposed change: delete the commented probe. Put any reusable profiling harness in a benchmark/test file rather than inside the runtime implementation.
- Risk / what could make this wrong: **READ** - the block is entirely commented out, so deleting it cannot change runtime behavior.

### F7. Two deprecated packages are still full published shells whose entries always throw  [severity: low] [size: S] [label: READ]

- Evidence: `code/core/config-base/src/index.tsx:1-3` and `code/core/theme-base/src/index.tsx:1-3` each unconditionally throw that the package is deprecated and replaced with `@tamagui/themes`. Their manifests still provide root exports and build scripts at `code/core/config-base/package.json:14-33` and `code/core/theme-base/package.json:15-33`. A whole-`code/` search for `@tamagui/config-base`, `core/config-base`, `@tamagui/theme-base`, and `core/theme-base` found only the package manifests plus one historical blog mention of `@tamagui/theme-base`.
- Why it matters: **INFERRED** - the repository carries buildable package surfaces that cannot provide a successful import and have no in-repo callers. This is maintenance surface for a migration trap rather than runtime functionality.
- Proposed change: retire these workspace packages after confirming the intended compatibility window, or make the deprecation explicit in package metadata and remove their normal build/export surface. Keep a migration note outside the runtime package if old users need guidance.
- Risk / what could make this wrong: **GUESS** - these may intentionally remain as published install-time diagnostics for old consumers. Do not delete or republish them without an explicit compatibility/release decision.

### F8. Native motion exports an incomplete `AnimationDriver`  [severity: high] [size: M] [label: READ]

- Evidence: `code/core/animations-motion/src/index.native.ts:8-27` declares `createAnimations` to return `AnimationDriver<A>` but returns only `isReactNative`, `animations`, `View`, and `Text`. The contract at `code/core/web/src/types.tsx:3453-3477` requires `useAnimations`, `usePresence`, `ResetPresence`, `useAnimatedNumber`, `useAnimatedNumberStyle`, `useAnimatedNumbersStyle`, and `useAnimatedNumberReaction`. The native declaration repeats the false complete return type at `code/core/animations-motion/types/index.native.d.ts:1-2`.
- Why it matters: **INFERRED** - `code/core/web/src/helpers/resolveAnimationDriver.ts:7-22` rejects this object because `useAnimations` is absent and returns `null`. `code/core/web/src/createTamagui.ts:245-261` then stores the original incomplete object when this is the configured driver, while `code/core/web/src/createComponent.tsx:500-520` can select that raw object for an `animatedBy` entry. The public `@tamagui/config/animations-motion` native export points at this entry (`code/core/config/package.json:110-117`, `code/core/config/src/animations-motion.ts:1-3`).
- Proposed change: make the native motion entry return one complete shared stub shape with `isStub: true` and all required methods, or change the public native entry to a deliberately typed unsupported factory. The resolver and component selection must see the same explicit stub instead of a structurally incomplete driver.
- Risk / what could make this wrong: **READ** - the native file itself says motion only works on web and recommends the native or reanimated drivers (`code/core/animations-motion/src/index.native.ts:1-2`). That supports an explicit stub, but changing the behavior of users who currently pass the object still needs native test coverage.

### F9. `generateThemes` cannot be called twice under Bun and retains cross-run token state  [severity: high] [size: M] [label: READ]

- Evidence: `code/core/generate-themes/src/generate-themes.ts:32-34` deliberately calls `purgeCache(inputFilePath)` on every invocation after the first. `purgeCache` then reads `module.constructor` at lines 192-205 even though Bun has no CommonJS `module` global, as its own comment at line 193 acknowledges. I ran a two-call Bun probe against two temporary theme modules; the second call failed with `ReferenceError: module is not defined` at `generate-themes.ts:192` before returning generated output. Independently, `dedupedTokens` is module-global at lines 59-62 and is appended to at lines 74-81 but never cleared, so any fixed repeat path would mix old token values into the next emitted `colors` array at lines 123-132.
- Why it matters: **INFERRED** - the public generator exposes a repeatable function but a second call fails in the package's supported Bun environment. If the cache guard is repaired without moving the map into one invocation, repeated CLI/library use will also produce output dependent on earlier runs.
- Proposed change: replace `module.constructor` cache handling with a Bun-safe cache API or remove the cache purge from the repeat path, and make `dedupedTokens` local to `generatedThemesToTypescript` (or clear it before each run). Add one two-invocation generator test with distinct color values.
- Risk / what could make this wrong: **READ** - the failure was observed with Bun, and the source explicitly contains a Bun-specific branch. Node-only behavior may differ, so the cache implementation should be validated in both runtimes used by the CLI.

### F10. Six of 16 published hook micro-packages have no aggregate barrel export  [severity: med] [size: M] [label: READ]

- Evidence: `find code/core -mindepth 2 -maxdepth 2 -name package.json` found 16 packages named `@tamagui/use-*` or `@tamagui/react-native-use-*`. Each manifest carries its own `main`, `module`, `types`, `exports`, and `build: tamagui-build` surface, for example `code/core/use-callback-ref/package.json:2,11-30` and `code/core/use-controllable-state/package.json:2,13-32`. A whole `code/core` plus `code/ui` source search for `export * from '<package>'` found aggregate exports for 10 packages, while six had none: `use-callback-ref`, `use-constant`, `use-direction`, `use-escape-keydown`, `use-keyboard-visible`, and `use-previous`. The six still have internal source consumers except `use-keyboard-visible`; the latter has only the stale Sheet manifest/project-reference edge already recorded in F4.
- Why it matters: **INFERRED** - the repository maintains 16 independently versioned build and release surfaces for small hooks, while only 10 are reachable through a composite core/UI barrel and six require direct package imports. This makes every internal hook move a package graph and release change, and it leaves one package with no source caller.
- Proposed change: decide which of the six direct-only packages are supported external APIs. Fold confirmed internal-only hooks into a single internal hooks surface, remove their package manifests and dependency edges, and keep separately published packages only where the public compatibility contract requires them. Start with the no-caller keyboard package from F4.
- Risk / what could make this wrong: **GUESS** - absence of an aggregate export does not prove absence of npm consumers; direct package imports are still possible. Keep a compatibility window or package deprecation metadata until external usage is checked.

### F11. Token resolution has two public contracts with no canonical root API  [severity: med] [size: M] [label: READ]

- Evidence: `code/core/get-token/src/index.ts:8-27` exposes `getSize`, `getSpace`, and `getRadius` through a policy-aware resolver that calls `resolveSizeToken` and returns a `Variable`. Separately, `code/core/web/src/config.ts:133-147` exposes generic `getToken`, `getTokenObject`, and `getTokenValue`, which perform exact-key lookup and choose `.variable` or `.val`; they do not run the size policy. `@tamagui/get-token` is itself a public package (`code/core/get-token/package.json:15-31`) and has 11 source import files under `code/`, while `code/ui/tamagui/src/index.ts:269-275` exports only the generic `getToken`/`getTokenValue` family from `@tamagui/core`.
- Why it matters: **INFERRED** - callers resolving the same size/space/radius concept must choose between a deep package API that accepts policy inputs such as `true` and returns a `Variable`, and a root API that accepts the generic token type and returns a raw value or CSS variable. The naming does not reveal this contract split, and the common helpers are unavailable from the composite root.
- Proposed change: define one canonical token-resolution API with explicit return mode and size-policy behavior, then make the legacy names thin aliases or deprecate them together. Re-export the supported surface from `@tamagui/core`/`tamagui` and update the 11 source imports in one migration.
- Risk / what could make this wrong: **READ** - the two APIs serve different consumers today: `get-token` is used by UI sizing helpers, while generic config access is used by core runtime code. Preserve those distinctions in the unified signature rather than changing return values silently.

### F12. Two public packages export incompatible `useEvent` functions under the same name  [severity: low] [size: M] [label: READ]

- Evidence: `code/core/use-event/src/useEvent.ts:5-7` defines `useEvent(callback?)` and returns a stable callback; `code/core/web/src/index.ts:123-124` re-exports it, so it is part of `@tamagui/core` and `tamagui`. The vendored package separately exports `useEvent(event, options?)` returning an event-target listener handle at `code/core/react-native-web-internals/src/modules/useEvent/index.tsx:20-35`, and publishes it from its root at `code/core/react-native-web-internals/src/index.tsx:49-53`.
- Why it matters: **INFERRED** - a consumer working across Tamagui core and the React Native Web internals package can import the same named hook and receive incompatible argument and return contracts. This is an API naming collision across sibling public surfaces, not a behavior difference hidden behind platform selection.
- Proposed change: rename or keep the React Native Web function internal under a name such as `useEventHandle`, and reserve `useEvent` for the stable callback hook. If vendoring prevents a source rename, stop re-exporting the vendored name from the public internals barrel and document the deep internal boundary.
- Risk / what could make this wrong: **GUESS** - downstream users may already import the React Native Web name directly. Treat a rename or barrel removal as a compatibility change and provide a deprecation path if that package is supported externally.

## Ideas (speculative, not findings)

### I1. Share the identical `isRemValue` predicate across the web and native resolver files

**READ:** `code/core/web/src/helpers/resolveRem.ts:15` and `code/core/web/src/helpers/resolveRem.native.ts:42` both implement `typeof value === 'string' && value.includes('rem')`. A shared tiny predicate could remove this platform-copy seam, but the current split may be deliberate for platform bundling.

### I2. Share the repeated camelCase-to-kebab callback where bundle boundaries permit

**READ:** `code/core/react-native-web-internals/src/modules/createDOMProps/index.tsx:63-67`, `code/core/react-native-web-internals/src/StyleSheet/compiler/hyphenateStyleName.tsx:14-23`, and `code/core/web/src/helpers/getCSSStylesAtomic.ts:218-222` each define the same `'-' + match.toLowerCase()` callback. The surrounding functions have different caching and `ms-` handling, so only the callback is a safe candidate for consolidation. The first two copies are in the vendored React Native Web fork, so this is low priority and should not be treated as a core Tamagui duplication finding.
