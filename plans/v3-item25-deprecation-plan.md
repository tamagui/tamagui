# v3 item 25 published-surface deprecation plan

This document records the owner-gated half of item 25. It does not authorize
source, export, package, or release changes. Searches below covered source imports,
package manifests, TypeScript project references, lockfiles, path fragments, and
the package names across the repository, excluding generated `dist` and `types`
directories.

## Internal-only hook audit

No `code/core/use-*` or `code/core/react-native-use-*` package is marked private.
All 16 have a version plus root `main`, `module`, `types`, and `exports` entries.
The five direct-only hooks with source consumers (`use-callback-ref`,
`use-constant`, `use-direction`, `use-escape-keydown`, and `use-previous`) are
therefore published surfaces too. An in-repo search cannot prove that external
consumers do not import them, so none qualified for the internal-only fold in
this change.

## `@tamagui/calc`

`@tamagui/calc` exports `calc`, which emits a CSS `calc(...)` expression on web
and evaluates the same operator sequence as a number on native.

There are no in-repo source importers. The remaining repository references are
its package manifest, the root TypeScript project reference, and workspace lock
entries.

There is no exact existing replacement with the same web and native contract. A
consumer would need to use a CSS `calc(...)` value on web and compute its native
number explicitly, then remove the package dependency. Before removal, release
notes should call out that platform split and provide a migration example.

## `@tamagui/use-keyboard-visible`

`@tamagui/use-keyboard-visible` subscribes to React Native's `keyboardDidShow`
and `keyboardDidHide` events and returns a boolean.

There are no in-repo source importers. Sheet had only a dead manifest dependency
and TypeScript project reference. Its implementation uses
`useKeyboardControllerSheet`, which owns different keyboard state and animation
handling and is not a general public replacement.

A consumer would need to own the two `Keyboard` subscriptions and clean them up
on unmount, or move to a separately approved public keyboard hook. It should not
import Sheet's private controller.

## `@tamagui/config-base`

`@tamagui/config-base` has no usable API. Importing its entry throws a deprecation
error directing callers to `@tamagui/themes`.

There are no in-repo source importers. The remaining repository references are
its package manifest, the root TypeScript project reference, and workspace lock
entries.

A consumer must replace the dependency and imports with the corresponding
`@tamagui/themes` exports before the package shell can be removed in a major
release.

## `@tamagui/theme-base`

`@tamagui/theme-base` has no usable API. Importing its entry throws the same
deprecation error directing callers to `@tamagui/themes`.

There are no in-repo source importers. One historical blog post names the
package; the other repository references are its package manifest, the root
TypeScript project reference, and workspace lock entries.

A consumer must replace the dependency and imports with the corresponding
`@tamagui/themes` exports before the package shell can be removed in a major
release.

## `useEvent` name collision

`@tamagui/use-event` accepts a callback and returns a stable callback. It is also
re-exported by `@tamagui/core`. In-repo source importers are:

- `code/core/floating/src/interactions/useHover.ts`
- `code/core/floating/src/interactions/useInnerOffset.ts`
- `code/core/floating/src/interactions/useListNavigation.ts`
- `code/core/floating/src/interactions/useTypeahead.ts`
- `code/core/use-controllable-state/src/useControllableState.ts`
- `code/core/web/src/index.ts`
- `code/packages/next-theme/src/NextThemeProvider.tsx`
- `code/ui/dismissable/src/Dismissable.tsx`
- `code/ui/focus-scope/src/FocusScope.tsx`
- `code/ui/focus-scope/src/FocusScopeController.tsx`

Package manifests and TypeScript project references also encode the dependency.

`@tamagui/react-native-web-internals` exports a different `useEvent`. It accepts
an event name and returns an event-listener registration function. Its only
direct source consumer is the relative `useHover` module inside the same package,
although `react-native-web-lite` also re-exports the internals barrel.

The replacement is a release-approved distinct name for the React Native Web
event-handle hook. A consumer of the stable callback API would keep or move to
`useEvent` from `@tamagui/core`. A consumer of the event-handle API would change
its named import to the approved new name. The relative `useHover` import would
change in the same release unit.

## `@tamagui/get-token`

`@tamagui/get-token` exports policy-aware `getSize`, `getSpace`, and `getRadius`
helpers returning token variables, plus `oneSizeTokenSmaller`. In-repo source and
test importers are:

- `code/kitchen-sink/src/features/home/TestBuildAButton.tsx`
- `code/kitchen-sink/src/usecases/StyledButtonAnimationAuto.tsx`
- `code/kitchen-sink/tests/BuildAButton.test.tsx`
- `code/tamagui.dev/data/docs/guides/how-to-build-a-button.mdx`
- `code/tamagui.dev/data/docs/guides/how-to-upgrade.mdx`
- `code/tamagui.dev/tests/fixtures/migration-guide.tsx`
- `code/ui/list-item/src/ListItem.tsx`
- `code/ui/popper/src/Popper.tsx`
- `code/ui/progress/src/Progress.tsx`
- `code/ui/slider/src/SliderImpl.tsx`
- `code/ui/tamagui/src/components/Switch.tsx`
- `code/ui/tooltip/src/Tooltip.tsx`
- `code/ui/tooltip/src/TooltipSimple.tsx`

Bento Get also emits the package name into component dependency lists. Package
manifests, TypeScript project references, the site Vite config, and lockfiles
encode additional graph edges.

Core web separately exports generic `getToken`, `getTokenObject`, and
`getTokenValue`. Those perform exact-key lookup and choose a variable or raw
value. They do not implement the size policy, so they are not drop-in
replacements.

The replacement should be one root-exported API that makes the token category,
size policy, and return mode explicit. Consumers would change their import to
`@tamagui/core` or `tamagui`, pass the category and return mode required by their
call site, and replace `oneSizeTokenSmaller` with the approved scale-step API.
The canonical API must land before any alias can be deprecated, and all source,
manifest, TypeScript, docs, fixture, and generated-dependency consumers must move
in the same release unit.
