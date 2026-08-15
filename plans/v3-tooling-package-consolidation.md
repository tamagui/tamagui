# Tooling packaging: one umbrella, and the react-native weight

2026-08-15. Two questions, measured rather than argued:

1. Can the build/tooling packages collapse into one package a user installs?
2. Can a web or tooling install avoid React Native entirely?

## Question 1: consolidation is free, but subpaths are not the lever

Measured with `bun pm pack` on every workspace package in each closure, rewired
to one another, then isolated `npm 11.12.1` installs with scripts disabled on
darwin-arm64, `du -sk node_modules`:

| closure | size | unique packages |
| --- | ---: | ---: |
| `@tamagui/cli` | 332.4 MiB | 476 |
| `@tamagui/static` | 232.6 MiB | 347 |
| `@tamagui/vite-plugin` | 270.9 MiB | 363 |
| `@tamagui/metro-plugin` | 232.6 MiB | 348 |
| sum of the four | 1,068.5 MiB | — |
| **union (all four together)** | **332.2 MiB** | **477** |

68.9% of the separate-install sum overlaps. All 347 packages in `static` appear
in every closure; Metro adds exactly one package over that common set. The union
is *within noise of installing the CLI alone*, so bundling the four together
costs effectively nothing.

**But subpath exports cannot reduce install weight.** npm installs the whole
dependency graph before any import happens, and:

- `peerDependenciesMeta.optional` peers are documented as **not** auto-installed
- `optionalDependencies` **are** installed by default, and only skipped with
  `--omit=optional`
- Node's `exports` is entry-point routing, and says nothing about dependencies

Sources: [peerDependenciesMeta](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/#peerdependenciesmeta),
[optionalDependencies](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/#optionaldependencies),
[subpath exports](https://nodejs.org/api/packages.html#subpath-exports).

So `@tamagui/run/vite` versus `@tamagui/run/metro` changes the public API and
nothing about disk weight. Only peer/optional status does.

### Decision

Make **`@tamagui/cli` the documented umbrella** with `./vite`, `./metro` and
`./lsp` subpaths. Do not introduce a new name: renaming costs 38/90/82/55 source
occurrences across CLI/static/vite-plugin/metro-plugin (plus 38 package.json
files) and breaks starters, docs and external configs, while changing install
cost by zero. Keep the specialized packages published; a Vite-only user who is
pushed onto the umbrella regresses by ~61 MiB, and a Metro-only user by ~100 MiB.

### Landed

`./vite` and `./metro` ship as of this change. `./lsp` is deliberately absent:
the Rust language server binary does not exist yet (see `plans/v3-lsp-rust.md`),
and a subpath resolving to nothing is worse than no subpath. Add it in the same
change that ships the binary.

Shape, for whoever adds `./lsp`. The CLI builds flat CJS into `dist/` because
`pkgMain` is set and `pkgModule` is not; adding `module` flips `tamagui-build`
to `dist/cjs` + `dist/esm`, which moves `dist/index.cjs` out from under `bin`
and breaks `src/cli.ts`'s `require('../package.json')`. So the subpaths are not
built from `src/`. They are three checked-in one-liners per entry at the package
root (`vite.cjs`, `vite.mjs`, `vite.d.ts`), listed in `files` and wired through
`exports`. This was not cosmetic: routing `./vite` at a bundler-built CJS file
first, Node's `cjs-module-lexer` could not follow the `__reExport` chain, and
`import('@tamagui/cli/vite')` exposed only `default` and `module.exports` with
zero named exports. Real `.mjs` files fixed it; the namespace now matches
importing `@tamagui/vite-plugin` directly, name for name.

One pre-existing gap surfaced, not caused by this change and confirmed with a
control that imports the plugins directly: under TypeScript
`moduleResolution: node16` the generated types fail with "no exported member
'tamaguiPlugin'". `@tamagui/vite-plugin` is `"type": "module"`, and its
`types/index.d.ts` re-exports extensionless (`export * from './plugin'`), which
node16 rejects in ESM. The repo and its consumers use `moduleResolution:
Bundler`, which resolves clean. Fixing it means teaching `tamagui-build` to
emit fully specified declaration re-exports, which touches every package.

### Free cleanup, independent of the above

Packages with **zero runtime references** to declared dependencies:

- CLI: `@tamagui/vite-plugin`, `esbuild`, `express`, `get-port`, `url`
- static: `@tamagui/config-default`, `@tamagui/fake-react-native`,
  `@tamagui/helpers-node`, `@tamagui/shorthands`, `browserslist`, `find-root`
- vite-plugin: `@tamagui/fake-react-native`, `esm-resolve`, `fs-extra`, `outdent`

Delete these rather than converting them to peers.

## Question 2: react-native

**The weight is real.** The heaviest shared subtree is
`@tamagui/static -> @tamagui/web -> @tamagui/native -> peer react-native`:
hermes-compiler 48.2 MiB, react-native 31.1 MiB, the RN debugger frontend
18.1 MiB, react-devtools-core 18.5 MiB, fb-dotslash 9.7 MiB, Metro 4.3 MiB.

**READ: npm 11 does auto-install required peers.** Installing
`@tamagui/animations-reanimated@2.7.7`, which declares a required
`react-native-reanimated` peer, produces a **333-package** tree containing
`react-native-reanimated`, `react-native` and `react`. So a required peer is not
a passive declaration; it pulls the whole subtree into a tooling install.

**READ: `@tamagui/native` and `@tamagui/proxy-worm` declared `react-native` as
a required peer.** `@tamagui/native` already marked eight other native peers
optional (`burnt`, `expo-linear-gradient`, gesture-handler, ...) and left
`react-native` and `react-native-web` required.

Fixed in `da21efb550`: both are now `peerDependenciesMeta.optional`.

Caveat, stated plainly: the "before" half is READ (the 333-package tree above).
The "after" half rests on npm's documented behaviour for optional peers rather
than a direct measurement, because verifying it end to end requires publishing.
A `file:`-linked probe cannot discriminate, since npm does not auto-install
peers for linked dependencies at all.

### Why this is safe

READ: every `react-native` **value** import in core lives in a `.native.ts`
file, which only Metro resolves:

```
constants.native.ts, getBaseViews.native.ts, eventHandling.native.ts,
doesRootSchemeMatchSystem.native.ts, nativeTransitionTarget.native.ts,
resolveRem.native.ts, helpers.native.ts
```

plus `@tamagui/native`'s own `PressBoundary.tsx` and the native-only packages
(`native-registry`, `react-native-media-driver`, `use-keyboard-visible`). A web
bundle never loads any of them, so react-native was only ever a *native runtime*
requirement. Nothing needs it at build time.

### The remaining piece: types

READ: `@tamagui/core` and `@tamagui/helpers` published types reference
react-native **zero** times. `@tamagui/web` references it in 6 of 26 `.d.ts`
files, and the entire surface is **one import of seven names**:

```ts
import type {
  PressableProps, Text as RNText, TextStyle as RNTextStyle,
  TextProps as ReactTextProps, View, ViewProps, ViewStyle,
} from 'react-native'
```

A consumer without react-native installed cannot resolve those, which is the
real reason the peer has felt mandatory.

**The `@types/react-native` re-export idea does not work**, for a reason worth
recording: READ, `@types/react-native` has been a **deprecated empty stub since
0.73.0 (2023-12-21)**. Its own description reads "This is a stub types
definition. react-native provides its own type definitions, so you do not need
this installed." There is nothing left in it to re-export, and RN has shipped
its own types since 0.71.

**What landed: the DOM entry owns its style types, and CI proves they still
match.** `View`/`Text` and the regular style props keep react-native's types on
purpose. Only `@tamagui/core/dom` and `tamagui/dom` have to resolve without
react-native, and that entry needed exactly one thing from `types.tsx`:

```ts
export type StyleDefinition = StackStyleBase & TextStylePropsBase
```

`code/core/web/src/dom/styleTypes.ts` now defines that property set outright,
from `csstype` plus explicit unions, and `standalone.ts` imports it instead. The
transitive `.d.ts` closure of `types/dom/index.d.ts` went from
`@tamagui/dom, @tamagui/helpers, @tamagui/style-grammar/runtime, csstype, react,
react-native` down to `@tamagui/dom, csstype, react`.

`code/core/web/src/dom/styleTypes.test-d.ts` is the drift alarm, and it is the
part that makes this owned rather than copy-pasted. It runs here, where
react-native *is* installed, and asserts at the type level that the owned key set
is exactly `keyof (StackStyleBase & TextStylePropsBase)`, that it covers
react-native's `ViewStyle` and `TextStyle`, and that every value the regular
props accept is accepted too. `vitest --typecheck` runs it, so a property added
to `types.tsx` and not to `styleTypes.ts` is a red build.

Three value forms are deliberately gone, all of them runtime handles a
compile-only `style()` could never have read: `Animated.AnimatedNode`,
`OpaqueColorValue` (`PlatformColor()`), and `Variable`. Token names stay plain
strings on this entry rather than the config-derived `ColorTokens`/`SizeTokens`
unions, which are rooted in `TamaguiConfig` and cannot be reached without the
react-native-typed part of the config: `'$4'` still typechecks, it just does not
autocomplete there.

Worth recording for whoever does the remaining `View`/`Text` surface: a
`grep -rl react-native types/dom/` is not a check. The leak was transitive
through `'../types'`, so that grep came back clean before the fix and comes back
dirty after it, on prose in the doc comments. And `skipLibCheck: true`, which
nearly every consumer sets, hides the failure rather than surfacing it: the
unresolved import silently degrades `StyleDefinition` to `any`, so
`style({ notAStyleProperty: 1, padding: true })` typechecked. The real checks are
a transitive import walk over the emitted `.d.ts` files, and `tsc` on a scratch
project that has no react-native installed.

The same treatment is still available for `ViewProps`/`PressableProps` on the
regular entry if that peer is ever worth dropping, but the owner's bar was "so
long as html stuff works without react-native at all we're good", and it does.

## Native binary distribution, for the Rust LSP

Verified against installed manifests and `npm view`: esbuild lists 25 platform
packages in `optionalDependencies`, SWC 10, Rollup 27, Biome 8, oxlint 19. Each
leaf is shaped:

```json
{ "name": "@tamagui/lsp-darwin-arm64", "version": "X", "os": ["darwin"], "cpu": ["arm64"] }
```

carrying only the executable, with `libc` added for linux gnu/musl. npm selects
by `process.platform`/`process.arch`, so exactly one lands. The umbrella's JS
launcher resolves the installed leaf and executes it. Use this shape verbatim.
