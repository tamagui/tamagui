# The compiler's evaluation environment externalizes packages node cannot load

A v3 app whose tamagui config registers the reanimated animation driver could not
start its web dev server. The compiler's evaluation environment handed
`react-native-reanimated` to node's ESM loader, and node cannot load it.

Found while migrating `~/team-machine` to the v3 beta, which is the first real
app on it. iOS/Metro was unaffected; this was web only. **Fixed** — the shape of
the fix is at the bottom.

## Repro

Any config that does what the docs suggest for spring animations:

```ts
import { animationsReanimated } from '@tamagui/config/v5-reanimated'

export const config = createTamagui({
  animations: { reanimated: animationsReanimated, /* … */ },
})
```

Start the dev server and request any route. Evaluating the config fails, and
because every transform needs the config, the request fails with it:

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

This has nothing to do with whether the app uses SSR. team-machine is a SPA. The
failing evaluation happens in `TAMAGUI_EVALUATION_ENVIRONMENT`, a separate node
environment the compiler creates to run `tamagui.config.ts` and read the result.
Every app has it, SSR or not, because the compiler cannot compile a style prop
without knowing the tokens behind it. The error naming a route is just the first
request that needed the config.

## Mechanism

`react-native-reanimated` ships ESM with **extensionless relative imports** and
**directory imports** (`import './publicGlobals'`, `import './ReanimatedModule'`).
Bundlers resolve those; node's ESM loader does not. So the package is only
loadable if something inlines it.

The evaluation environment externalized it instead:

1. The config imports `@tamagui/config/v5-reanimated`. That matches
   `inlineEvaluationTamaguiPackage`, so `resolveBarePackage` inlines it, and
   vite transforms `@tamagui/config/dist/esm/animations-reanimated.mjs`.
2. That file calls `createAnimations` from `@tamagui/animations-reanimated`,
   which imports `react-native-reanimated` at module scope.
3. Node then loads `lib/module/index.js` and dies on the first relative import.

`externalizablePackageExtensions` encodes the assumption behind this: a package
resolving into `node_modules` with a `''`/`.js`/`.mjs`/`.cjs` entry is treated as
safe to hand to node. That assumption does not hold for the React Native
ecosystem, which is full of ESM only a bundler can resolve.

## Two workarounds that do not work

Both were measured on team-machine, not reasoned about.

- **`components: ['react-native-reanimated']`.** This is the only user-facing
  thing that feeds `configuredEvaluationPackages`, and it does land: a probe in
  the installed plugin printed
  `evalPkgs= ["tamagui","react-native-reanimated"]`. The package was still
  externalized and the error unchanged.
- **Relying on the environment's `noExternal`.** The same probe printed
  `external= []` and a `noExternal` that already contained
  `react-native-reanimated`. It was externalized anyway.

## The fix

Nothing the compiler reads off an animation driver needs the animation runtime.
It reads the `animations` record and a handful of static flags; the rest is hooks
and components that only ever run inside an app. So the driver publishes a second
build containing exactly that, and the compiler resolves to it.

Three parts:

1. **`@tamagui/animations-reanimated` ships a runtime-free build**
   (`src/createAnimationsCompiler.ts`) that imports nothing from reanimated. It
   normalizes the animation configs identically to the real driver, so the
   compiler reads back the values an app would, and throws a named error from
   every hook and component in case one is ever reached.
2. **A `tamagui-compiler` export condition selects it.** The evaluation
   environment resolves with that condition first, ahead of
   `defaultClientConditions`. A condition is the portable way to express this:
   any bundler integration adds the same one, an app configures nothing, and any
   package we control can opt in the same way.
3. **Packages declaring the condition are inlined, never externalized.** This is
   the part that is easy to miss and it is what made the first attempt fail. A
   condition only decides anything while Vite is the one resolving. Externalizing
   hands node a *bare specifier*, node resolves the package again under its own
   conditions, and the compiler build is silently discarded — Vite picks the
   right file and node then throws it away. So `scanInstalledTamaguiPackages`
   splits installed packages into the ordinary externalizable ones and those
   declaring the condition, and the latter go into the evaluation environment's
   `noExternal`. They are the cheap ones to inline by construction, since the
   whole point of the build is that it carries no app runtime.

Verified on team-machine: dev server boots, `app/_layout.tsx` went 500 → 200,
zero reanimated errors in the log, the compiler runs (`19 files (17 compiled)`),
and the app mounts in a headless browser with 789 DOM elements and real session
data. `vite-plugin`'s own suite stays green (15 tests).

Node reproduces both halves directly, which is the control that made the
diagnosis certain rather than plausible:

```
$ node --conditions=tamagui-compiler -e "import('@tamagui/animations-reanimated')"
OK loaded, keys: [ 'createAnimations' ]

$ node -e "import('@tamagui/animations-reanimated')"
FAIL Directory import '.../react-native-reanimated/lib/module/ReanimatedModule'
```

## User escape hatch and regression coverage

The general limitation remains: externalizing to node is only safe when node can
actually load the package, and the compiler does not attempt to prove that for
arbitrary dependencies. Apps now have a real escape hatch, though. A user's
evaluation-environment `resolve.noExternal` is merged with the compiler's
required entries, and the installed-package scan does not add a matching
`@tamagui/*` package back to `resolve.external`. That second half matters because
Vite gives an explicit `external` entry precedence over `noExternal`.

`loadTamagui.test.ts` now proves both paths with distinct packages next to the
existing `packages/evaluation-fixture`:

- `@tamagui/compiler-condition-fixture` publishes a `tamagui-compiler` branch
  whose ESM entry has an extensionless relative import. The evaluation runner
  selects that branch, bundles it successfully, and keeps the package out of
  `externalPackages`.
- `@tamagui/user-no-external-fixture` has the same node-unloadable import but no
  compiler condition. A user `noExternal` entry keeps it bundled and loadable,
  including through Tamagui's installed-package externalization scan.

Both fixture entries fail with `ERR_MODULE_NOT_FOUND` when loaded directly by
node, so the green test demonstrates bundling rather than accidentally using a
node-compatible fixture.

## Why it mattered

`@tamagui/config/v5-reanimated` is the shipped way to register the reanimated
driver, and an app reaches for it as soon as it wants real spring physics on a
dialog or sheet. In team-machine the driver is used from `Sheet.tsx` and
`CommandPalette.tsx`, both shared components, so dropping it on web was not an
option and the app simply had no working web dev server on v3.
