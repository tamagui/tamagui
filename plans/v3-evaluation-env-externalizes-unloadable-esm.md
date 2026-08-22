# The compiler's evaluation environment externalizes packages node cannot load

A v3 app whose tamagui config registers the reanimated animation driver cannot
start its web dev server. The compiler's evaluation environment hands
`react-native-reanimated` to node's ESM loader, and node cannot load it.

Found while migrating `~/team-machine` to the v3 beta, which is the first real
app on it. iOS/Metro is unaffected; this is web only.

## Repro

Any config that does what the docs suggest for spring animations:

```ts
import { animationsReanimated } from '@tamagui/config/v5-reanimated'

export const config = createTamagui({
  animations: { reanimated: animationsReanimated, /* … */ },
})
```

Start the dev server, request any route. The SSR transform of the root layout
fails:

```
Internal server error: Cannot find module
  '.../react-native-reanimated/lib/module/publicGlobals'
  imported from .../react-native-reanimated/lib/module/index.js
  Plugin: tamagui-compiler
```

On a newer vite the same cause surfaces as:

```
Directory import '.../react-native-reanimated/lib/module/ReanimatedModule'
  is not supported resolving ES modules
```

Reproduced on vite 8.0.14 and 8.2.2, one 1.21.13 and 1.25.4, reanimated 4.3.3.

## Mechanism

`react-native-reanimated` ships ESM with **extensionless relative imports** and
**directory imports** (`import './publicGlobals'`,
`import './ReanimatedModule'`). Bundlers resolve those; node's ESM loader does
not. So the package is only loadable if something inlines it.

The evaluation environment externalizes it instead:

1. The config imports `@tamagui/config/v5-reanimated`. That matches
   `inlineEvaluationTamaguiPackage`, so `resolveBarePackage` inlines it, and
   vite transforms `@tamagui/config/dist/esm/animations-reanimated.mjs`.
2. That file does a bare `import … from 'react-native-reanimated'`.
3. That specifier never reaches tamagui's resolver.
   `createEvaluationResolveId` only delegates to `resolveBarePackage` when the
   plugin is `one:tsconfig-paths` **and** the source matches
   `bareTamaguiPackage`. `react-native-reanimated` matches neither, so it falls
   through to ordinary resolution and ends up external.
4. Node then loads `lib/module/index.js` and dies on the first relative import.

`externalizablePackageExtensions` encodes the assumption behind this: a package
resolving into `node_modules` with a `''`/`.js`/`.mjs`/`.cjs` entry is treated
as safe to hand to node. That assumption does not hold for the React Native
ecosystem, which is full of ESM that only a bundler can resolve.

## Two workarounds that do not work

Both were measured on team-machine, not reasoned about.

- **`components: ['react-native-reanimated']`.** This is the only user-facing
  thing that feeds `configuredEvaluationPackages`, and it does land: a probe in
  the installed plugin printed
  `evalPkgs= ["tamagui","react-native-reanimated"]`. The package is still
  externalized and the error is unchanged.
- **Relying on the environment's `noExternal`.** The same probe printed
  `external= []` and a `noExternal` that already contains
  `react-native-reanimated`. It is externalized anyway, so the externalization
  is happening below the point where that list is consulted.

The practical consequence is that there is currently **no way for an app to opt
a package out** of this externalization.

## What a fix has to satisfy

Externalizing to node is only safe when node can actually load the package.
Options, roughly in order of how well they match the existing design:

1. Do not externalize a package that is ESM but not node-resolvable. Detecting
   that cheaply is the hard part; `"type"` and the entry extension are not
   enough, since reanimated has no `"type"` field and a `.js` entry that node
   treats as ESM only because of syntax detection.
2. Let `resolve.noExternal` on the evaluation environment be authoritative, and
   merge a user-supplied list rather than overwriting it in
   `getEvaluationEnvironmentOptions`. This does not fix the default, but it
   gives apps a real escape hatch, which today they do not have.
3. Keep an explicit deny-list of known non-node-loadable packages, seeded with
   the React Native ones the config packs themselves reach for. Least
   principled, but it makes the shipped `@tamagui/config/v5-reanimated` path
   work out of the box, which is the case users actually hit.

Whatever the shape, the regression test belongs next to the existing
`packages/evaluation-fixture` used by `loadTamagui.test.ts`: a fixture package
whose ESM entry has an extensionless relative import, asserted to load. That
suite already asserts the opposite behaviour for the normal case
(`expect(externalPackages).toContain('@tamagui/evaluation-fixture')`), so the
new fixture needs to be a distinct one rather than a change to that
expectation.

## Why it matters

This is not an exotic setup. `@tamagui/config/v5-reanimated` is the shipped way
to register the reanimated driver, and an app reaches for it as soon as it wants
real spring physics on a dialog or sheet. In team-machine the driver is used
from `Sheet.tsx` and `CommandPalette.tsx`, both shared components, so dropping
it on web is not an option and the app simply has no working web dev server on
v3.
