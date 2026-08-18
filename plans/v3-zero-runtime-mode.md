# V3 zero-runtime mode and DOM package retirement

Status: design for Block 2. This document does not implement the mode.

This design incorporates the owner's direction from 2026-08-16. It keeps the
settled failure policy, greenfield audience, and component split from
`plans/v3-web-zero-runtime.md`. It also treats Block 1's runtime native `html.*`
mapping and Block 3's direct theme-value prop form of `Theme` as prerequisites.

Evidence labels have the same meaning as the measured foundation:

- **READ** means the cited source, plan receipt, or command was read directly.
- **INFERRED** means the conclusion follows from named readings.
- **GUESS** means the shape is plausible but has not been proven.

No new bundle measurement was run by this designer. Byte figures below are
either relayed from `plans/v3-web-zero-runtime.md` or from the manager-verified
webpack probe added during review; each source is named beside the figure.

## Decisions

1. Zero-runtime is a web build mode of regular Tamagui, with its byte guarantee
   enforced on production output and its authoring contract active in
   development. The same source may build for web in zero-runtime mode and for
   native with the regular runtime. Block 1 therefore remains the native
   behavior for `html.*`.
2. The build option is experimental and the compile-time environment variable
   is `TAMAGUI_RUNTIME`, with the literals `'full'` and `'zero'`.
3. A successful zero-runtime web build always owns and loads one generated CSS
   artifact containing config CSS and compiler atomic CSS. The bundler derives
   `TAMAGUI_DID_OUTPUT_CSS='1'` only after that relationship has been
   established. An author cannot set it directly.
4. `TAMAGUI_DOES_SSR_CSS='mutates-themes'` remains the declaration that runtime
   theme mutation is required. It blocks global-CSS stripping and is a build
   error in zero-runtime mode. It is not the zero-runtime switch.
5. `createComponent` and `createTamagui` each get a direct
   `process.env.TAMAGUI_RUNTIME === 'zero'` guard at the top of the exported
   function. The compiler removes all zero-graph references to them before
   dependency collection. The guards remain a secondary invariant and reduce a
   missed path to a throwing stub in Vite and webpack; guard folding does not
   satisfy the module-absence gate.
6. The seven authoring rules are hard build errors. The compiler prints the
   complete, deterministic per-site list. There is no retained-component
   fallback.
7. `acceptsClassName` remains the authority for whether a component is allowed
   in the zero graph. A package list is documentation, never a second source of
   truth.
8. Islands are full-runtime entry graphs built in a separate bundler invocation
   with `TAMAGUI_RUNTIME='full'`. A dynamic import produced inside the same
   zero-runtime compilation is not an island in the first experimental release.
   Islands are client-only and receive a compiler-generated theme bridge.
9. Static CSS transitions remain available without an animation runtime. The
   component animation hook, presence lifecycle, driver selection, and WAAPI
   completion machinery drop. The four public animated-number hooks survive as
   an optional CSS animated-number leaf.
10. `@tamagui/dom` remains published and compatible, but becomes undocumented
    implementation plumbing. `tamagui/dom` and `@tamagui/core/dom` also remain
    compatible, receive no new frontend features, and are no longer recommended.
11. Theme reachability pruning is deferred. Apps narrow themes and color tokens
    through the existing config API. The mode accepts literal or statically
    bounded theme-name choices and static Block 3 theme-value props.
12. The CSS-custom-property escape for dynamic style values is deferred from the
    first release. Dynamic Tamagui style values fail and the developer uses a
    full-runtime island.
13. Base zero-runtime and island support are enabled per integration after that
    integration passes its own receipts. One lagging integration does not block
    another. `report` can remain available with the full runtime even when an
    integration has not qualified for zero output.

## 1. Scope and guarantee

The guarantee is narrower than the absolute wording in
`plans/v3-web-zero-runtime.md` because the owner requires AnimatedNumber to
remain usable:

> A zero-runtime entry graph contains no Tamagui component renderer, runtime
> style engine, runtime CSS generator, provider, theme state, media state, or
> component animation machinery. The only allowed Tamagui client module is the
> optional CSS animated-number leaf, and it appears only when one of its four
> public hooks is used.

The output is lowered React host JSX plus one generated CSS artifact. React and
React DOM remain. A literal host element can still use ordinary React `style`;
that surface is outside the Tamagui style guarantee.

**READ, relayed from `plans/v3-web-zero-runtime.md` sections 1 and 9:** the
fully flattened probe was 7 bytes gzip above the hand-written React control.
The measured endpoint is therefore real for a graph that follows the contract.

The mode remains web-only. Metro still needs the flag because Metro can build a
web client, and because one cross-platform project can run the same compiler
integration for web and native. A native Metro build always receives the
literal `'full'`. It uses Block 1's runtime `html.*` mapping when lowering does
not happen.

This resolves the conflict with the older DOM plans:

- **READ:** `plans/dom-tailwind-flat-values.md` says native `html.*` is
  compiler-required and says standalone DOM is a public product. Both claims
  are superseded by the 2026-08-16 owner direction.
- **READ:** `plans/v3-dom-native-lowering-design.md` recommends keeping native
  DOM out of the beta. That recommendation is superseded by Block 1.
- **READ:** `plans/v3-web-zero-runtime.md` defines the bundle gate as zero
  `@tamagui/*` modules. The AnimatedNumber caveat supersedes that absolute
  wording. The gate becomes an allowlist containing one leaf module.

The native quality rule from the older design still applies. Unsupported tags,
props, events, and semantic structures must fail through the shared generated
tables. Runtime native `html.*` and compiler-lowered native `html.*` must share
those tables and conformance fixtures. A browser-like approximation is never a
fallback.

## 2. Configuration and environment variables

### Public build option

The existing `experimental` object on `TamaguiBuildOptions` gains:

```ts
experimental?: {
  nativeFastPath?: boolean
  zeroRuntime?: true | 'report' | { islands: string[] }
}
```

The meanings are exact:

- absent: regular Tamagui;
- `'report'`: run every compiler analysis and write the complete report, but
  keep `TAMAGUI_RUNTIME='full'` and exit successfully;
- `true`: enforce the contract and build one zero-runtime entry graph;
- `{ islands }`: enforce the zero graph and treat each listed module as the
  root of a separately compiled full-runtime entry.

Island entries are path globs resolved relative to the project root. A module
cannot belong to both graphs. Crossing from the zero graph to an island is only
legal through the generated async island loader. A normal static import is a
build error because it would place the full runtime in the zero graph.

### The new environment variable

`TAMAGUI_RUNTIME` has two integration-owned literal values:

| Literal | Meaning |
| --- | --- |
| `'full'` | Keep ordinary Tamagui runtime behavior. |
| `'zero'` | The compiler and artifact gates have established an enforced zero-runtime web graph. |

Outside an official integration, an absent variable behaves as full runtime.
An absent variable cannot activate zero-runtime mode. Official integrations
always inline one of the two literals, which makes every guard a constant.

The public config is the author input. The environment variable is generated
output. Reading an ambient shell value for `TAMAGUI_RUNTIME` is rejected because
it would let the runtime branch disagree with the compiler options.

### Why the existing variables do not fit

| Existing variable | Existing meaning | Decision |
| --- | --- | --- |
| `TAMAGUI_TARGET` | Platform selection, web or native. | Keep separate. A web build can be full or zero. |
| `IS_STATIC` | Compiler evaluation and static extraction behavior. | Keep separate. It is true while evaluating config and cannot describe the emitted client. |
| `TAMAGUI_IS_SERVER` | Server versus client execution. | Keep separate. Both server and client can compile lowered output. |
| `TAMAGUI_ENVIRONMENT` | Vite or Next execution environment such as client, SSR, or config evaluation. | Keep separate. It does not express the runtime contract. |
| `TAMAGUI_DOES_SSR_CSS` | Whether theme CSS must still be produced at runtime, including the special `'mutates-themes'` value. | Use only as the theme-mutation declaration. It cannot represent component/style runtime removal. |
| `TAMAGUI_OPTIMIZE_THEMES` | Currently written by integrations and read by no source module. | Do not reuse a dead, theme-specific flag. |
| `TAMAGUI_DID_OUTPUT_CSS` | Claim that global CSS has already been emitted. | Keep as a derived artifact fact, never as the mode switch. |

**READ, relayed from `plans/v3-web-zero-runtime.md` section 3:**
`TAMAGUI_DID_OUTPUT_CSS` currently has readers and no setter. Forcing it to
`'1'` removes design-system and root rules from JavaScript without placing them
in the Vite CSS asset. That is the failure shape this design forbids.

### `TAMAGUI_DOES_SSR_CSS='mutates-themes'`

This is the right existing declaration for runtime theme mutation.
`getThemeCSSRules.ts` already treats `'mutates-themes'` as a reason to retain
theme rule generation. The integration rules are:

1. In ordinary compiled Tamagui, keep current behavior.
2. In compiled-global-CSS mode, `'mutates-themes'` prevents
   `TAMAGUI_DID_OUTPUT_CSS='1'`, so the runtime generator remains.
3. In zero-runtime mode, fail before transforming application modules with:

```text
[tamagui zero-runtime] Rule 4: TAMAGUI_DOES_SSR_CSS="mutates-themes" declares runtime theme mutation. Zero-runtime themes are build-time data. Remove runtime mutation or move that surface to a full-runtime island.
```

No new `mutatesThemes` option is added. This keeps one declaration for the
same capability.

## 3. How each bundler sets the flag and owns the CSS artifact

An enforced zero-runtime web entry uses `'zero'` in production and development.
Development runs the same complete lowering and reference erasure, while the
integration serves the combined CSS artifact as an in-memory virtual module and
hot-replaces it after config or source changes. Config evaluation and
full-runtime island builds use `'full'`. A `'report'` build also uses `'full'`
because it audits an ordinary provider-backed app without changing its runtime.
This gives a provider-less zero app one dev path: it never calls `getConfig()`
in the client, and config CSS comes from the integration-owned virtual module.
Production remains the byte and final module-graph gate.

### Vite plugin

`code/compiler/vite-plugin/src/plugin.ts` does the following in its config and
build hooks:

1. Resolve `experimental.zeroRuntime` from the same loaded
   `TamaguiBuildOptions` used by the compiler.
2. In the dedicated config-evaluation environment, inline
   `process.env.TAMAGUI_RUNTIME` as `'full'`. Config evaluation must retain
   `createTamagui` and CSS generation even when the client graph is zero.
   The Vite SSR environment for a zero entry receives `'zero'`, matching the
   client transform, so SSR never imports a full runtime that hydration removed.
3. In a production web client, generate the config portion of `outputCSS` from
   the fully evaluated config before application transform begins. A missing
   `outputCSS` path is a configuration error in zero mode. Development exposes
   the same generated content through the hot-replaceable virtual CSS module.
4. Collect each compiler plan's atomic CSS into the same plugin-owned artifact
   in deterministic module-id order. Apply reference erasure in the same
   transform before Vite analyzes the returned imports. Zero production
   transforms do not inject the ordinary per-module `.tamagui.css` imports.
   Full-runtime child island builds contribute their atomic and bridge rules
   before finalization. Expose the combined file as one virtual CSS module and
   inject one import into each declared zero entry. The JavaScript stripping
   fact and its complete replacement asset therefore cannot diverge.
5. Inline these exact definitions in the client environment:

```ts
{
  'process.env.TAMAGUI_RUNTIME': JSON.stringify('zero'),
  'process.env.TAMAGUI_DID_OUTPUT_CSS': JSON.stringify('1'),
}
```

6. Enforced zero development builds inline `'zero'` and register the virtual
   CSS artifact before deriving `TAMAGUI_DID_OUTPUT_CSS='1'`. Report, native,
   config-evaluation, and full-runtime island builds inline `'full'`; they do
   not claim `TAMAGUI_DID_OUTPUT_CSS` unless that individual build also passed
   the compiled-global-CSS artifact gate.
7. In `generateBundle`, inspect Rollup chunk module ids and importer chains.
   Fail if a zero entry reaches a forbidden Tamagui module or if its generated
   CSS asset is absent.

This closes the Vite gap described in the measured foundation. Vite's current
per-module atomic CSS virtual modules remain in the ordinary tiers. Zero
production combines those rules with the base, root, font, theme, bridge, and
child-island rules in one entry artifact.

### Next plugin

`code/compiler/next-plugin/src/withTamagui.ts` and
`code/compiler/loader/src/TamaguiPlugin.ts` own the equivalent webpack path:

1. `loadTamaguiBuildConfigSync` supplies the public mode to the loader and
   plugin. The plugin's pre-compilation hook writes the config portion of
   `outputCSS`; the loader contributes compiler atomic CSS to the same ordered
   collector and returns reference-erased source before webpack records that
   module's dependencies.
2. `DefinePlugin` receives the direct literal definitions above. Production and
   development server/client compilations for an enforced zero entry use
   `'zero'`, so SSR does not execute a runtime path the client removed. Report,
   config evaluation, and island compilations use `'full'`.
3. Before sealing, the plugin emits the combined config-plus-atomic artifact.
   Full-runtime child compilations contribute their extracted atomic rules and
   bridge rules to that collector before sealing.
   The client compilation must contain that normalized `outputCSS` module under
   the existing Tamagui CSS loader. If the app has not imported that file from
   its root layout, compilation fails and prints the exact import path. The
   flag is therefore unable to produce a successful artifact-less build.
4. `finishModules` aggregates compiler diagnostics. `afterSeal` inspects
   webpack's module graph and issuer chains for the zero bundle gate.
5. A configured island is submitted as a separate full-runtime child build and
   entered in an island manifest. An ordinary async webpack chunk from the zero
   compilation does not qualify because it shares the zero graph's resolved
   Tamagui module ids.

The deprecated webpack adapter is still the current Next integration in this
repo. The CLI/Turbopack path must implement the same artifact and module-graph
gates before it advertises this experimental mode.

### Metro plugin

`code/compiler/metro-plugin/src/index.ts`, `frontend.ts`, and `transformer.ts`
carry the target-aware literal:

1. `withTamagui` serializes the resolved runtime mode into the existing
   transformer bridge configuration. It never reads an ambient client value.
2. The transformer appends the zero transform to `args.plugins`. It replaces
   only the exact AST member expression `process.env.TAMAGUI_RUNTIME` with
   `'zero'` for an enforced `platform=web` zero entry in development or
   production, and with `'full'` for native, report, config-evaluation, and
   island entries. It also applies the compiler's reference erasure before
   Metro extracts dependencies from transformed code. Minification and the
   serializer are too late to remove an import from Metro's graph.
3. Metro web zero mode requires `outputCSS`. After planning the entry graph, the
   frontend writes config CSS plus every zero and island plan's atomic CSS and
   bridge rules in deterministic graph/module-id order, then verifies that both
   bundle requests resolve that exact file. A missing, stale, incomplete, or
   unimported artifact is a build error.
4. The plugin wraps Metro's serializer. Before delegating to the configured
   serializer, it inspects `graph.dependencies` and importer paths for the same
   forbidden-module gate. The repo's pinned Metro serializer is used when no
   custom serializer was supplied. This must be a named, version-pinned import,
   not a feature-detection chain.
5. Native Metro builds always inline `'full'`. Block 1's runtime DOM mapping and
   regular theme/media machinery remain available.
6. An island is a second Metro bundle request with `'full'` and its own entry.
   It is not another module in the zero bundle graph.

Reference removal happens early enough for Metro's graph construction, so
Metro remains a first-release candidate and qualifies through its own receipts.
Serializer-time folding alone would defer it; that is not the chosen path.

### Artifact identity

Every integration records this tuple in its cache/build identity:

```text
runtime literal
target
config generation/hash
generated CSS content hash
compiler implementation version
sorted island entry list
theme bridge manifest hash
sorted island compiler-output hashes
```

Changing any member invalidates lowering plans and the bundle cache. The CSS
path alone is insufficient because the content can change in place.

## 4. What gates where

Compiler reference erasure below creates the module-absence guarantee. The two
zero-runtime guards deliberately contain the full `process.env` expression at
the use site. No `const isZeroRuntime`, config lookup, helper function, or
runtime global sits between the bundler and the comparison.

| Subsystem | Files and import boundary | Exact foldable guard | Zero-mode result | Graph proof required before landing |
| --- | --- | --- | --- | --- |
| Runtime style engine, Cluster A | `createComponent.tsx`; imports of `getSplitStyles`, `directStyle`, `propMapper`, `validStyleProps`, safe-area resolution, and `@tamagui/style-grammar/runtime` | `if (process.env.TAMAGUI_RUNTIME === 'zero') { throw new Error(...) }` as the first statement of `createComponent` | Lowering plus reference erasure makes `createComponent` unreachable before dependency collection. A missed reference produces a throwing stub in Vite/webpack and a forbidden graph path in every integration. | Vite/Rollup module graph, webpack module graph, and Metro serializer graph contain none of the named modules in the successful zero entry. A negative-control full build must contain them. |
| Config parsing and CSS generation, Cluster B | `createTamagui.ts`; `createDesignSystem.ts`, `insertStyleRule.tsx`, `variables.ts`, font registration, token creation, media configuration, animation normalization | The same direct guard as the first statement of `createTamagui`; existing `if (!process.env.TAMAGUI_DID_OUTPUT_CSS)` guards remain for the intermediate tier | The provider and client config references are compiler errors or erased. Reaching `createTamagui` is a hard error. Config evaluation runs in a separate `'full'` environment and produces CSS. | The Vite, Next, and Metro zero web graphs omit the config/CSS modules. The config-evaluation graph contains them, proving the control can fail. The generated CSS hash must match the config result. |
| Component runtime, Cluster C | The remainder of `createComponent.tsx`, `useComponentState.ts`, `useThemeState.ts`, `getThemeProxied.ts`, `useTheme.tsx`, styled contexts | The `createComponent` direct guard catches a residual component path; direct calls to forbidden hooks get compiler diagnostics and are never erased as effects. | Reference erasure removes component definitions and imports. No component hook path remains in the zero graph. Static `Theme` is compiler syntax and becomes host markup plus classes. | Module graphs omit the hook/context files. An executable fixture switches static theme classes without importing a provider. |
| Provider and root injection | `views/TamaguiProvider.tsx`, `ThemeProvider.tsx`, `TamaguiRoot.tsx` | No fallback guard. Their use is illegal in a zero graph and the compiler reports it. | The zero root is ordinary React markup. Generated CSS is loaded by the bundler integration. | Bundle graph rejects these modules and prints their importer chain. |
| Media runtime | `hooks/useMedia.tsx`, `helpers/mediaState.ts`, `matchMedia` and component media subscriptions | No media-specific guard. `useMedia` is a rule 7 diagnostic; component-owned media paths sit behind the `createComponent` guard if a missed reference remains. | Erasure removes runtime references. Media clauses remain CSS. No matchMedia listener or per-component subscription ships. | Graph absence plus a Playwright viewport fixture proving emitted CSS still changes computed style. |
| Theme runtime and mutation | `useThemeState.ts`, `getThemeCSSRules.ts`, `_mutateTheme.ts`, `registerCSSVariable.ts`, Block 3 Theme runtime | No theme-specific guard. The two top-level guards cover residual component/config paths; the artifact tier retains existing `TAMAGUI_DID_OUTPUT_CSS` guards. | Erasure removes runtime references. Static theme classes and direct theme-value props survive as CSS. Theme mutation and JS theme reads fail. | Graph absence, static theme-switch browser fixture, and a mutation negative control that must fail the compiler. |
| Component animation machinery, Cluster D | `createComponent.tsx`, `useComponentState.ts`, `@tamagui/animations-css/createAnimations`, `@tamagui/animation-helpers`, `@tamagui/use-presence`, `@tamagui/use-element-layout` | Only `createComponent` has the direct guard. `createAnimations` has no zero branch because it must be absent from the zero graph; config evaluation and islands reach it under `'full'`. | Static transitions are CSS. Presence, enter/exit orchestration, driver selection, layout measurement, WAAPI completion, and non-CSS drivers disappear. | Graphs omit every named module except the optional animated-number leaf. Static transition and AnimatedNumber browser fixtures run separately. |
| CSS animated-number leaf | New leaf in `@tamagui/animations-css`, re-exported through regular Tamagui and targeted by compiler import rewrite | No guard in the leaf. Reachability is the opt-in. | `useAnimatedNumber`, `useAnimatedNumberStyle`, `useAnimatedNumbersStyle`, and `useAnimatedNumberReaction` survive when imported. | A bundle with no hook omits the leaf. A bundle with one hook contains only the leaf plus React/React DOM dependencies and runs its completion test. |
| Native runtime DOM mapping | Block 1's `html.native.tsx`, `htmlRuntime.native.tsx`, primitives, and generated `@tamagui/dom` tables | No zero guard because native receives `'full'` | Runtime native `html.*` continues to map supported non-style DOM props and reject unsupported behavior. | Native runtime-versus-compiler conformance fixtures compare host props and rejection behavior per generated table row. |

**READ, relayed from `plans/v3-web-zero-runtime.md` section 5:** Cluster A is
about 16.5 KB gzip and is one value-level import unit because `directStyle`
imports the style-grammar runtime and the mapper/safe-area helpers. Cluster B is
about 3.5 KB gzip after the color-normalization removal. Cluster C is about
7 KB gzip. Cluster D is about 4 KB gzip. These are inventory figures, not new
measurements and not additive release promises.

### Zero-mode reference erasure

A passing compiler plan has a stronger fact than a bundler: every Tamagui
component use in the zero graph lowered, and every use that could not lower is
already a hard error. The compiler uses that fact to remove references before
the bundler records dependencies. CSS extraction happens first, so deleting a
definition never deletes its emitted rules.

The zero transform performs these steps in order:

1. Account for every reference to compiler-recognized component bindings,
   static `Theme`, `html.*`, and `styled()`. A `styled()` declaration is
   erasable only when its arguments are declarative static input and every
   binding reference is consumed by lowering. A value read, effectful argument,
   unresolved export consumer, or other runtime use is a contract violation.
2. Erase each accounted app-local `styled()` declarator, including an exported
   declarator in a module with other live exports. An exported binding is erased
   only after the integration's entry-graph accounting proves every importer in
   that zero graph was transformed. Package-internal component modules become
   unused when their import specifiers disappear and then drop through their
   existing `sideEffects` metadata.
3. Rewrite the four AnimatedNumber named imports directly to the leaf module.
   This happens before general import cleanup, so the public `tamagui` or
   `@tamagui/core` barrel never enters the client graph for those hooks.
4. Remove now-dead Tamagui import specifiers. Remove the whole import statement
   when no specifier survives. A bare side-effect Tamagui import is a hard
   error; the compiler does not erase unknown effects.
5. Emit the transformed module before Vite/Rollup import analysis, webpack
   loader dependency parsing, or Metro dependency extraction. The final graph
   gate then rejects any forbidden id that remains.

This is one mechanism for direct components, app-local styled components,
barrel re-exports, and Metro. There is no bundler-specific fallback.

**READ, assigned-review receipts independently verified by the manager:**
Metro fixes dependencies before minification and does no export-level shaking;
removing the localized re-export made all three Metro markers disappear. A
webpack zero probe folded the guarded path to a 154-byte stub containing one
throw, which left the guarded module id in the graph. An app-local module-scope
`styled()` call is presumed effectful by the bundlers when its module has other
live exports. These observations make the earlier guard-only claim false.

The `createComponent` and `createTamagui` guards remain for two narrower
reasons. Vite and webpack can fold their large bodies to a small throwing stub,
and a missed compiler reference fails loudly if graph enforcement is bypassed
during development. Metro receives the same invariant check, but no byte-removal
claim is made for it. A successful build still requires the guarded module ids
to be absent.

### Graph acceptance after erasure

The erasure plan and direct guards do not prove the bytes disappeared. Each
integration must produce a machine-readable module graph for two builds of the
same fixture:

- zero build: the forbidden modules are absent;
- full negative control: the same fixture deliberately retains one runtime
  component and the modules are present.

If the negative control cannot make the check fail, the check is invalid. The
implementation also records gzip from the emitted chunks, but module absence is
the correctness gate.

**READ, relayed from `plans/v3-web-zero-runtime.md` section 3:** the existing
`TAMAGUI_DID_OUTPUT_CSS` direct guards removed 2,928 bytes gzip after the color
change. That proves this expression shape is foldable in the measured Vite
fixture. The manager's webpack probe above proves body folding there while also
proving that folding cannot meet the graph gate. Reference erasure and the
integration-specific graph receipts remain the acceptance evidence.

## 5. Compiler contract and exact diagnostics

### Failure format

The compiler collects all violations before failing. It sorts by normalized
file path, source offset, rule, then message. The header and site format are:

```text
[tamagui zero-runtime] build failed with <count> violations

Rule <n> <code>
<relative-file>:<line>:<column> <Component>
  <exact message>
```

The final line is always:

```text
Fix every site or move the owning module to a declared full-runtime island. Zero-runtime never retains one component as a fallback.
```

`'report'` emits the identical list and JSON schema, but exits successfully.

### Rule map

| Rule | Detectability and owner | Exact developer message |
| --- | --- | --- |
| 1. No prop spreading onto styled components | Detectable for every compiler-recognized Tamagui or `html.*` element from its materialized spread entries. Zero mode rejects static and dynamic spreads alike. | `Zero-runtime rule 1: <COMPONENT> cannot receive a prop spread because the compiler cannot prove it is style-free. Pass non-style props explicitly or move this module to a full-runtime island.` |
| 2. No dynamic component types | Detectable when the binding graph traces the JSX/call target to one or more Tamagui component imports. `linked/unresolved-binding` and dynamic union targets become this rule. A wholly opaque React component with no Tamagui provenance is outside this rule. | `Zero-runtime rule 2: component expression <EXPRESSION> does not resolve to one literal lowerable host component. Use a literal Tamagui or html.* component, or move this module to a full-runtime island.` |
| 3. Static style values | Detectable for Tamagui style props, `style` handles, styled definitions, variants, and the values of Block 3 direct `Theme` theme-key props when the compiler owns the expression. The compiler classifies those props with the shared `reservedThemeProps` exported by `@tamagui/helpers`; it does not maintain a second reserved-name list. Existing `local/dynamic-style-value` sites map here. Plain host `style` and opaque user-component internals are not detectable as Tamagui style. | `Zero-runtime rule 3: value for <PROP> on <COMPONENT> cannot be lowered: <DETAIL>. Use a supported build-time value or move this module to a full-runtime island.` |
| 4. Static themes and static config | Detectable at config evaluation, at every recognized `Theme` name and direct theme-key-prop site, at `theme` or `themeInverse` on a component, at `TamaguiProvider`, and for imports/calls of the theme mutation API. The existing `local/unsupported-target` bailout for `theme` and `themeInverse` maps to rule 4 instead of rule 6. A name may be a literal or a statically enumerable conditional over literal names. The compiler parses static theme and platform modifiers in each direct prop value with Block 3's value grammar. An element modifier such as `hover:` or `sm:` is a hard error because it cannot describe a subtree value. Indirect mutation hidden inside opaque third-party code is only visible to the bundle gate. | `Zero-runtime rule 4: <DETAIL> requires runtime theme or config state. Theme names and modifier targets must be statically enumerable, Theme value props and config must be build-time data, and runtime mutation belongs in a full-runtime island.` |
| 5. CSS animation driver only | Detectable from evaluated config and from `animatedBy`, `transition`, lifecycle, and animation props. Static CSS transitions lower. Non-CSS drivers, dynamic driver choice, presence lifecycle, and layout-driven animation fail. | `Zero-runtime rule 5: <DETAIL> requires a component animation runtime. Use a static CSS transition or move this module to a full-runtime island.` |
| 6. Lowerable components only | Detectable after component resolution. `compilerHost.ts` already derives `acceptsClassName` from `staticConfig.acceptsClassName`, `neverFlatten`, and context. This boolean is the only authority. | `Zero-runtime rule 6: <COMPONENT> does not lower to one host element with className and is island-only. Move this module to a declared full-runtime island.` |
| 7. No JavaScript reads of design state | Detectable for direct, aliased, namespace, and re-exported references whose module provenance reaches `useMedia`, `useTheme`, `useThemeName`, `useProps`, `getConfig`, `getTokens`, `useTokens`, `getVariableValue`, `getToken`, `getTokenValue`, `useConfiguration`, `useAnimationDriver`, or theme mutation exports. A computed property hidden behind opaque code may only reach the bundle gate. | `Zero-runtime rule 7: <API> reads Tamagui design state in JavaScript. Express the condition in CSS or move this module to a full-runtime island.` |

**READ, manager verification:** `compilerHost.ts:1558` currently routes
`theme` and `themeInverse` through `local/unsupported-target`. Zero mode changes
that diagnostic mapping to rule 4; ordinary compiler mode is unchanged.

The config-level rule 5 message is fixed as:

```text
[tamagui zero-runtime] Rule 5: createTamagui animations must resolve to the CSS driver. Driver <NAME> has outputStyle=<VALUE>. Remove it from the zero entry or move its consumers to a full-runtime island.
```

The provider message is fixed as:

```text
[tamagui zero-runtime] Rule 4: TamaguiProvider is not used by a zero-runtime root. The bundler loads generated CSS and the compiler lowers static Theme nodes. Remove this provider or make this entry full-runtime.
```

The component theme-boundary message is fixed as:

```text
[tamagui zero-runtime] Rule 4: <COMPONENT> uses <theme|themeInverse>, which creates a runtime component theme boundary. Replace it with a static <Theme name="..."> wrapper (use name="inverse" for themeInverse) or move this module to a full-runtime island.
```

The unresolved island-theme message is fixed as:

```text
[tamagui zero-runtime] Rule 4: island <ENTRY> has no statically resolved theme context at this mount. Place the island boundary under a compiler-visible static <Theme> or make this entry full-runtime.
```

### Island boundary

The compiler resolves every candidate before it evaluates the island rule. If
`acceptsClassName` is false in the zero graph, rule 6 fires with the component's
display name and import provenance. No manually maintained list can override
that result.

**READ, relayed from `plans/v3-web-zero-runtime.md` section 6:** the earlier
audit found 15 of 49 audited packages on the lowerable side and 34 on the island
side. Those counts are calibration from that audit. They do not become a
hard-coded allowlist.

The separately compiled island graph uses ordinary Tamagui and owns its own
`TamaguiProvider`. It imports the integration-owned combined CSS artifact with
`disableInjectCSS`, so CSS is loaded once while the island retains the config
values its runtime needs. Sharing the island provider with the zero root is
rejected because it would put config parsing, theme state, media state, and the
component runtime back in the zero graph.

### Honest limits

The compiler cannot reject behavior it cannot identify as Tamagui authoring.
Examples include a dynamic ordinary React host `style`, a third-party component
that internally computes CSS, and arbitrary runtime DOM mutations. Those cases
can build. They do not cause a Tamagui runtime to ship and are the app's ordinary
React/CSS responsibility.

An opaque path that does retain Tamagui code fails the bundle gate with the
forbidden module id and shortest importer chain, even if the compiler cannot
name a precise call site. A path that contains no Tamagui module remains valid.
This is why the local compiler gate and final bundler gate both remain required.

## 6. Theme, media, config, and provider behavior

### Static Theme after Block 3

This block must consume the Block 3 shape, where theme keys are props directly
on `Theme`. It must not add a new `<Variables>` lowering path or a `values`
object.

**READ, Block 3 worktree `plans/variables.md`, the 2026-08-16 binding section,
and `code/core/web/src/helpers/variables.ts`:** there is no `values` object on
the new surface. `getInlineValuesFromProps` reads every prop absent from
`reservedThemeProps` as a theme key. Theme and platform targeting use the value
grammar, while element conditions such as `hover:` and `sm:` are invalid for a
subtree-wide value.

Accepted zero-mode forms include:

```tsx
<Theme name="light">...</Theme>

<Theme name="brand" color="#111" background="#fff">
  ...
</Theme>

<Theme background="blue4 dark:blue2">...</Theme>
```

The name must be a literal or a bounded conditional whose branches are literal
theme names. Every direct theme-value prop must be statically evaluable. The
compiler uses the shared `reservedThemeProps` classification, parses each
unique static raw value once with Block 3's grammar, consumes its clauses in one
forward pass, and emits the theme class plus a deterministic value class and
rules in the owned CSS artifact. The lowering never emits a client
`parseValue`. A prop named
`values` is a theme key literally named `values`; zero-runtime does not give it
special object semantics, and an object passed there fails rule 3 as an invalid
theme value. A theme name computed from an open-ended runtime string, a runtime
theme builder, or mutation fails rule 4.

Phase 4 moves `reservedThemeProps` unchanged from Block 3's
`helpers/variables.ts` into the side-effect-free
`code/core/helpers/src/reservedThemeProps.ts` and exports it through
`@tamagui/helpers`. The Theme runtime and compiler both consume that table.
**READ, `code/compiler/static/package.json` and `compilerHost.ts`:** the compiler
already depends on `@tamagui/helpers` and `@tamagui/style-grammar`. This keeps
prop classification and parsing shared without importing the Theme runtime into
the compiler.

The zero root does not import `TamaguiProvider`. Config evaluation happens only
inside the bundler's full evaluation environment. The client receives classes
and CSS, not parsed config.

### Theme reachability

The first release does not automatically prune a broad config to used theme
names. This is a deliberate scope decision rather than an undecided option.

**READ, relayed from `plans/v3-web-zero-runtime.md` section 3:** the regenerated
default V6 CSS artifact measured 17,243 bytes gzip. Narrowing themes and color
tokens with the existing config API measured 2,592 bytes gzip, a reduction of
14,651 bytes gzip. Both values are app-authoring costs, not changes to the V2
versus V3 core delta.

The author narrows the pack. Automatic reachability can be reconsidered only if
a representative zero-runtime starter shows that manual narrowing is the
dominant adoption failure. The deciding evidence is a whole-program inventory
of static `Theme name`, direct theme-key props, and their theme modifiers that
proves there is no hidden name source.

### Media

Media, group, container, and pseudo clauses remain compiler input and CSS
output. JavaScript reads fail rule 7. This removes matchMedia listeners and
component subscriptions while preserving browser-responsive styling.

### Dynamic CSS custom properties

The proposed `style={{ '--x': value }}` escape is deferred. It changes rule 3,
creates a new boundary between host style and Tamagui style, and has no measured
recovery value in the foundation. The evidence required to reopen it is a
greenfield report showing a material share of otherwise valid sites whose only
dynamic input can be represented by one custom property, followed by a bundle
and render-cost probe.

## 7. Tiers

The product remains a ladder. `report` is an auditing tool and does not form a
runtime tier.

| Tier | What ships | Author requirements | Measured value |
| --- | --- | --- | --- |
| Ordinary compiled Tamagui | Compiler extraction and flattening where possible, plus provider, config, runtime CSS generation, style engine, theme/media state, component runtime, and configured animation drivers for residual sites | Existing Tamagui authoring. Runtime fallback remains valid. | **READ, relayed from foundation sections 2 and 9:** the bench measured 44,899 bytes gzip attributable to Tamagui and 105,760 bytes gzip for the whole app in the split-chunk run. |
| Compiled global CSS | Ordinary compiled Tamagui plus an owned `outputCSS` artifact. Runtime design-system, root, font, and static theme CSS generation drops behind `TAMAGUI_DID_OUTPUT_CSS='1'`; residual components and runtime theme/media behavior remain. | Import the integration-owned artifact and do not declare runtime theme mutation. Dynamic residual styles are still allowed. | **READ, relayed from foundation sections 3 and 9:** 2,928 bytes gzip removed on the post-color-removal baseline. |
| Strict zero-runtime | Generated global CSS plus complete lowering. Provider, config, Clusters A through C, component animation machinery, media/theme state, and residual component packages disappear. The optional animated-number leaf is the only allowlisted Tamagui client module. | Follow all seven rules. Use only lowerable components in the zero entry. Put runtime-dependent work in separately built islands. Narrow the config when CSS size matters. | **READ, relayed from foundation section 9:** the upper bound is removal of 44,899 bytes gzip of Tamagui JS in the fully flattenable bench. Generated CSS measured from 2,592 to 17,243 bytes gzip depending on config authoring. The 7-byte probe demonstrates the no-feature endpoint. |

The 21,119-byte provider measurement from the foundation is included inside the
strict endpoint and must not be added again to the 44,899-byte upper bound.
**READ, relayed from foundation sections 1 and 10:** that 21,119-byte difference
was P2 minus P1 on a tree whose component calls had already lowered.

## 8. Animation scope

### What drops

For static component transitions, the compiler resolves the configured CSS
transition and emits CSS. The following CSS-driver responsibilities are not
needed in a zero graph and move out of the animated-number leaf:

- `useAnimations` and its per-component hook state;
- `usePresence` and `ResetPresence`;
- enter, exit, and update lifecycle bookkeeping;
- `getAnimations()` and WAAPI completion waiting;
- computed-style capture and interruption restoration;
- transition preset normalization and per-property driver selection;
- `animateOnly`, dynamic `animatedBy`, multi-driver selection, layout
  measurement, and non-CSS output paths;
- `@tamagui/animation-helpers`, `@tamagui/use-presence`, and
  `@tamagui/use-element-layout` imports when they have no other consumer.

Lifecycle animation sites that need those behaviors fail rule 5 and move to an
island.

### What survives

The optional leaf owns exactly these existing public hooks:

```ts
useAnimatedNumber
useAnimatedNumberStyle
useAnimatedNumbersStyle
useAnimatedNumberReaction
```

It retains the CSS driver's rAF timing/spring numeric engine, cancellation,
completion callback, listener notification, linked-style render, and React DOM
batching. It imports React and React DOM at value level and imports Tamagui
types only. It does not import config, `useConfiguration`, presence, animation
helpers, or the component runtime.

In zero mode the compiler rewrites those named imports from `tamagui` or
`@tamagui/core` to the leaf. `useAnimationDriver` and `useConfiguration` remain
rule 7 errors because they expose runtime driver/config selection.

`createAnimations` has no zero branch and no successful zero-client importer.
The config-evaluation graph and full-runtime islands execute the unchanged
function under `'full'`; reference erasure keeps it out of the zero graph.

An animated style can be applied to a literal host element. Applying it as a
dynamic style prop to a Tamagui component remains a rule 3 error. A component
that needs the Tamagui style path and AnimatedNumber belongs in an island.

### Honest byte accounting

**READ, relayed from foundation section 5:**
`animations-css/createAnimations` is 2,344 bytes gzip in the measured bundle.

**INFERRED from the current `createAnimations.tsx` source:** if
`createAnimations` remains reachable today, zero of those 2,344 bytes is
reliably removable because AnimatedNumber and `useAnimations` are methods of
one returned object in one function. If the whole driver is unreachable, all
2,344 bytes are reachable for removal from the zero entry. A full-runtime
island keeps the whole driver.

The post-split leaf size is unknown. Claiming that the entire 2,344 bytes drops
for an app that imports AnimatedNumber would be false. Implementation must
measure three artifacts with the same fixture and command used by the
foundation: full driver, zero graph without AnimatedNumber, and zero graph with
one animated-number hook. The difference between the last two is the surviving
cost; the difference from the full driver is the actually dropped component
animation cost.

## 9. `@tamagui/dom` retirement

### Documentation and messaging

`@tamagui/dom` is no longer a product name, recommendation, or release-message
item. Public examples use:

```tsx
import { html } from 'tamagui'
```

or the lower-level regular core import. Zero-runtime documentation describes
the build mode, never a separate DOM package.

**READ:** this command returned no public documentation matches in the current
worktree:

```sh
rg -n --glob '*.mdx' --glob '*.md' --glob '!plans/**' \
  '@tamagui/dom|tamagui/dom|@tamagui/core/dom|Tamagui DOM|DOM mode' \
  code/tamagui.dev docs README.md
```

Therefore no current tamagui.dev page needs a removal edit. Existing plan files
are historical records and stay unchanged. Any DOM page created before this
implementation lands must remove standalone-package examples and point to
regular `html.*` plus the zero-runtime option.

The `version-three.mdx` animation material is unrelated and remains. Release
messaging does not mention this experimental mode or the retired package.

### Package and export behavior

The package boundaries are:

| Import | V3 behavior |
| --- | --- |
| `@tamagui/dom` | Remains published. Its current generated tables, strict prop types, event helpers, compatibility rows, and native backing metadata remain available for compatibility. Tamagui compiler/runtime code is the intended consumer. No new user-facing API is added. |
| `tamagui/dom` | Remains exported with its current `html` and `style()` compatibility behavior. It is undocumented and frozen except for correctness fixes. |
| `@tamagui/core/dom` | Remains the lower-level compatibility alias with the same behavior and export conditions. |
| `tamagui` and `@tamagui/core` roots | Own the recommended runtime `html.*` API on web and native. The compiler optimizes it in every tier and must fully lower it in zero mode. |

The `@tamagui/dom` package.json export map is not narrowed in V3 because that
would break direct imports. The root declarations and standalone subpath
declarations receive `@deprecated` JSDoc directing new code to regular
`html.*`. There is no runtime console warning, package-install warning, or
throw added as part of demotion.

A user who imports these entries today sees the same runtime/compiler behavior
and a TypeScript deprecation hint. Their code does not stop building. The
standalone compiler frontend remains supported for compatibility, but it no
longer receives new syntax or independent product work.

### Implementation ownership

The generated `@tamagui/dom` tables remain the one source of truth for regular
runtime HTML, compiler lowering, diagnostics, strict types, and native
conformance. Demotion does not authorize copying those tables into a second
package. Block 1's generated `.native` mapping is part of this ownership model.

## 10. Islands and provider ownership

The first experimental release refuses same-compilation islands. A
module-identity constraint forces this choice. Changing how an integration
injects the environment literal does not change that constraint.

**INFERRED from the Vite/Rollup chunk module ids, webpack module graph, and
Metro dependency graph used by the gates in section 3:** one resolved module id
has one transformed body in a module graph. Reference erasure means a successful
zero entry no longer reaches `createComponent.tsx`, `createTamagui.ts`, or their
transitive runtime imports. It does not make an ordinary lazy island full: that
island still resolves the standard module ids inside a compilation whose
runtime literal is `'zero'`. Retagging those ids from island ancestry is an
importer-sensitive closure transform, and a dependency shared by two importer
paths converges on one id again.

Module duplication through virtual ids or resource queries is a possible later
architecture, but it is rejected for the first release. Duplicating only
`createComponent.tsx` is insufficient. The full-runtime identity must propagate
through its transitive runtime closure, keep Tamagui config, theme, and styled
context singletons coherent inside the island, share exactly one React
instance, and still leave the zero importer chain free of forbidden modules.
The evidence that can reopen this decision is one same-compilation prototype in
each integration whose module graph proves those properties and passes every
fixture below. A per-module literal transform without that deliberate closure
duplication is closed as an alternative.

The chosen first-release boundary is:

```text
zero entry build, TAMAGUI_RUNTIME='zero'
  -> generated async island loader and manifest
  -> separate island entry build, TAMAGUI_RUNTIME='full'
```

Each island mounts its own provider. The zero root never shares one. The island
build externalizes or shares the application's React singleton according to the
host integration and imports the integration-owned CSS artifact with runtime
injection disabled.

### Static theme bridge

An island provider cannot infer CSS ancestry at its mount node. Each island
mount therefore receives a compiler-generated bridge record:

```ts
type IslandThemeBridge = {
  name: string
  layers: readonly {
    inlineValues: { values: Record<string, string | number>; themes?: Record<string, Record<string, string | number>> }
    inlineClassName: string
  }[]
}
```

The public authoring surface remains direct `Theme` props. `inlineValues` above
is Block 3's normalized internal representation, produced at compile time after
the one parse and forward pass from section 6. It never runs `parseValue` in the
zero client.

The compiler assigns each island mount site a stable bridge id. Its manifest
record contains the effective static theme name and the ordered direct-value
layers between the zero root and that mount. A bounded conditional theme emits
one descriptor per branch and the lowered loader call selects the id with the
same condition. The boundary must be under the root default or a
compiler-visible static `Theme` chain. Theme inheritance hidden behind an
opaque component call fails rule 4 rather than silently using the default.

The generated island entry passes `name` to its `TamaguiProvider` as
`defaultTheme`, then replays the normalized layers through internal `Theme`
props. Full-runtime portals must carry the same context. `Portal.tsx` therefore
replaces its name-only `useThemeName()` handoff with an internal
`usePortalThemeState()` result containing the current name and cumulative
normalized layers. `TamaguiRoot` reapplies those layers and their compiled
class names around portaled content. This is an internal bridge, not a second
public Theme API, and it also preserves direct Theme values created inside the
island.

**READ, assigned-review receipts independently verified by the manager:**
`Portal.tsx` currently reads only `useThemeName()` and passes only that name to
`TamaguiRoot`. That preserves a named theme but loses direct theme-value layers.

### One artifact across both builds

The integration coordinates CSS across the separate builds. Each full-runtime
island child build returns its compiler atomic CSS and bridge-class rules without
injecting them. The coordinator finalizes one deterministic artifact containing
config CSS, zero-entry atomic CSS, every island's atomic CSS, and every bridge
class, ordered by graph kind, island id, then module id. Both entry graphs point
at that final asset, and `TAMAGUI_DID_OUTPUT_CSS='1'` is derived only after all
declared island fragments are present. This intentionally loads island CSS with
the page in the first experimental release; lazy island CSS would create a
second artifact and is deferred.

### The one accepted runtime recovery

Zero-runtime mode is otherwise a hard-error mode: no fallbacks, no feature
detection, no recovery paths. There is exactly one exception, and it is
deliberate.

The generated island loader calls `ensureZeroStylesheet` before it fetches the
island bundle. If the document does not already link the generated CSS artifact,
the loader links it and prints an error naming the artifact path, the island id
and the integration, and saying that a correct build never reaches this code.

It exists because **"unimported" is not decidable at build time for a published
zero artifact.** Phase 2 established this rather than faking a check: Metro emits
a JS bundle and owns no HTML or CSS module pipeline, and Next's zero tier
publishes its artifact to `public/`, which is not final until the islands are
built. Both can verify that the published copy exists and matches what they
generated; neither can verify that the page links it. Removing robustness that
nothing replaces would be worse than keeping it, and a silent recovery would
contradict the mode's own posture, so it is loud and documented instead.

It is removed when *both* integrations gain a build-time way to verify the link:
Metro by owning or being handed the document that loads its bundle, Next by
resolving the published artifact through the compilation's own module graph.
Vite already has that check (`checkGlobalCSSArtifact` on the compiled-global
tier, and the HTML-entry check on the zero tier), so Vite alone is not enough.

The Playwright receipt drives the state it exists for: it removes the artifact
link before the island mounts, then asserts both halves, that the stylesheet is
recovered and that the console error names the artifact, the island and the
integration.

### Client-only SSR contract

Islands are client-only in the first experimental release. The zero server
render emits a deterministic island placeholder and theme-bridge id. It never
imports or renders the full-runtime island module. Hydration reproduces the
same placeholder, then the separate client entry mounts after hydration. An app
that needs island content in server HTML must make that route a full-runtime
entry or express the content with lowerable zero components.

This is the least proven part of the design. It must be prototyped before any
large runtime surgery. The acceptance fixture has one static zero page and one
Sheet island. It must prove all of the following in Vite, Next, and Metro web:

- the initial zero graph contains no forbidden Tamagui module;
- loading the island does not create a second React instance;
- the island renders and animates with the full runtime;
- the island is nested under a non-default static theme and a direct
  theme-value prop, and computed colors of its portaled content match both;
- a unique compiler-extracted island style has the expected computed value and
  its atomic rule is present in the shared artifact;
- the zero and island entries load the same single CSS artifact, containing
  config, zero, island, and bridge rules;
- Next server HTML contains the deterministic placeholder and no full-runtime
  island module, hydration reports no mismatch, and the island mounts only
  after hydration;
- an illegal static import from zero code to the island fails.

Availability is per integration:

| Integration | Base `true` | `{ islands }` |
| --- | --- | --- |
| Vite web | Enabled only after Vite passes its erasure, artifact, and zero-graph receipts. | Enabled only after the Vite island fixture above passes. |
| Next webpack | Enabled only after webpack passes its erasure, artifact, server/client, and zero-graph receipts. | Enabled only after the Next client-only SSR and island fixture above passes. |
| Metro web | Enabled only after the pre-dependency erasure and serializer graph receipts pass. | Enabled only after the second-bundle island fixture above passes. |
| Next Turbopack and other adapters | Unavailable until that adapter implements and passes the same receipts. | Unavailable. |

`report` may remain available for any row because it keeps the full runtime. If
base support is unavailable, `true` and `{ islands }` fail before transforming
application modules with:

```text
[tamagui zero-runtime] <INTEGRATION> has not qualified for zero-runtime output in this version. Use zeroRuntime: "report" or choose a qualified integration.
```

If base support exists but the island fixture has not passed, `true` works and
`{ islands }` fails with:

```text
[tamagui zero-runtime] <INTEGRATION> does not support experimental.zeroRuntime islands in this version. Use zeroRuntime: true without islands or choose an integration with island support.
```

Rejection never emits an ordinary async chunk as a substitute.

## 11. Implementation sequence and validation

The riskiest uncertainty comes first. Every step has a proof that can fail.

### Phase 0: merge prerequisites and pin their contracts

Dependencies:

- Block 1 must merge its runtime native `html.*` prop mapping and native
  rejection behavior into `v3-beta`.
- Block 3 must merge direct Theme value props into `v3-beta` before this block
  edits theme machinery. This block must build against the direct-prop surface.
  The older `<Variables values={...}>` and `<Theme values={...}>` shapes are not
  compiler targets.

Validation:

- run Block 1's runtime and compiler native DOM fixtures against the same table
  rows;
- run Block 3's web and native direct Theme value-prop fixtures;
- build the relevant packages before dependent tests, per `CONTRIBUTING.md`.

### Phase 1: prove the island, per-build flag, and minimum artifact architecture

Build the smallest zero root plus one full Sheet island for Vite, Next, and
Metro web. Add the exact `TAMAGUI_RUNTIME` literal plumbing and graph receipts,
but do not yet remove subsystems broadly. Prototype the pre-dependency reference
erasure needed to keep the minimal zero graph clean. This phase also owns the
fixture-scale theme bridge, client-only placeholder, and cross-build CSS
coordinator. The coordinator combines config CSS, zero atomic CSS, island atomic
CSS, and bridge rules, then derives `TAMAGUI_DID_OUTPUT_CSS='1'` only after both
entries resolve the final artifact.

Validation:

- every island assertion in section 10, recorded separately for each
  integration;
- a full negative control that makes the forbidden-module graph check fail;
- cache invalidation when only the runtime literal, island list, bridge
  descriptor, or island atomic CSS changes;
- **GUESS to resolve, nonblocking:** a scoping probe adds one app-local
  `const Card = styled(View, {...})` in a module with another live export, uses
  `Card` only in lowered JSX, and records all integration module graphs before
  and after prototype erasure. This confirms the styled-definition leg's exact
  scope; Metro already requires reference removal regardless of the result.

The island assertions are a hard gate for that integration's island capability.
The styled scoping probe is confirmatory and does not change the Phase 1
capability verdict. Failure in one integration changes only that integration's
availability, never the all-or-nothing contract of a successful build.

### Phase 2: productionize global CSS artifact ownership

Generalize Phase 1's minimum artifact path to all entries and to the
compiled-global-CSS tier. Wire the Vite web path to `writeTamaguiCSS`, connect
Next and Metro validation, add deterministic multi-module and cross-island
collection, include bridge classes, and keep `TAMAGUI_DID_OUTPUT_CSS`
integration-owned.

Validation:

- missing, stale, and unimported artifacts each fail;
- base `.is_View`, root variables, font rules, theme rules, and compiler atomic
  rules appear in the loaded CSS;
- one island-only atomic rule appears in the same artifact and changes the
  island's computed style;
- the compiled-global-CSS fixture renders correctly with JavaScript CSS
  generation absent;
- `TAMAGUI_DOES_SSR_CSS='mutates-themes'` keeps the ordinary tier live and
  rejects zero mode.

### Phase 3: implement the compiler contract, reference erasure, and both gates

Add mode-aware diagnostics to the shared compiler result, aggregate all sites
in each integration, enforce `acceptsClassName`, erase compiler-consumed styled
definitions and imports, rewrite AnimatedNumber imports to the leaf, and add the
final module-graph gate. Erasure runs only after a zero plan has no violations;
`report` keeps source runtime references unchanged.

Validation:

- one behavioral fixture per rule fails before its fix and prints the exact
  message;
- a multi-file fixture reports every violation in deterministic order;
- `'report'` emits the identical JSON and exits successfully;
- an opaque computed runtime access that rule 7 cannot attribute passes the
  local accounting but fails the bundle graph, proving the second gate has an
  independent variable;
- an app-local lowered `styled()` definition disappears while a neighboring
  live export remains, and all module graphs omit its Tamagui imports;
- the AnimatedNumber fixture resolves directly to the leaf and contains no
  public Tamagui barrel;
- a bare side-effect Tamagui import fails instead of being erased.

### Phase 4: remove provider and compile Theme

Move `reservedThemeProps` to the side-effect-free shared helper described in
section 6. Teach the compiler to classify static Block 3 `Theme` nodes with
that table, then lower `name` plus direct theme-key props and their
theme/platform value modifiers into markup and CSS. Productionize the Phase 1
theme-bridge manifest and the cumulative portal-theme handoff. Remove
`TamaguiProvider` from the zero starter.

Validation:

- static light/dark switching and nested static themes in Playwright;
- direct theme-value props change descendant computed styles;
- theme modifiers select the expected static rule without a runtime theme read;
- dynamic name and dynamic theme-value negative controls fail rules 4 and 3,
  respectively;
- `theme` and `themeInverse` component props report rule 4 with the static
  `Theme` wrapper remediation;
- a portal under an island bridge retains the compiled name and direct-value
  layers in both JavaScript theme state and computed CSS;
- the provider/config modules are absent from every zero graph.

### Phase 5: add the runtime guards and split CSS AnimatedNumber

Add the direct guards to `createComponent` and `createTamagui`. Do not add a
zero branch to `createAnimations`; it is reachable only from full config
evaluation and full-runtime islands. Extract the optional animated-number leaf
and complete the zero-mode import rewrite for the four hooks.

Validation:

- module-graph negative controls described in section 4;
- existing public AnimatedNumber completion behavior for the leaf;
- static transition behavior with the component animation path absent;
- full-runtime island animation and presence behavior remains unchanged;
- fresh gzip measurements for full, zero without AnimatedNumber, and zero with
  AnimatedNumber.

### Phase 6: demote DOM surfaces

Keep export maps compatible, add declaration deprecations, remove any public
package recommendations that appeared after this design was written, and make
regular `html.*` the only documented frontend.

Validation:

- package export-resolution tests for all current import paths;
- TypeScript fixtures show the hint without an error;
- bundle graphs keep `@tamagui/dom` out of a regular web client while compiler
  evaluation can still load its tables;
- runtime native `html.*` continues to pass Block 1's conformance suite.

### Phase 7: hydration premise, theme-variable collapsing, and end-to-end size gate

**Theme-variable collapsing belongs to this phase too, and it is measured, not
hypothetical.** `359e29cc83` stopped normalizing theme colors and dropped
`normalize-css-color` from the web runtime, which is a real byte win that stands.
What it also removed, unintentionally, is the collapsing of equivalent color
spellings into one variable. Regenerating `code/tamagui.dev/tamagui.generated.css`
against current source measures the cost: distinct theme variables go from 577 to
709, so 132 duplicate variables, and the artifact grows 34,794 to 35,443 gzip
(+649) on that site alone. Structure is otherwise unchanged; every difference is a
color literal or one of the new duplicates.

That inflates exactly the number this mode exists to shrink, since theme CSS is
the zero-runtime build's transferred cost (the foundation measured 17,243 gzip on
a default v6 config). Owner direction, 2026-08-17: restore the collapsing at
config-parse / CSS-generation time, NOT by bringing the runtime dependency back to
web. The two belong in one phase because the hydration-equality property and the
collapsing property have the same cause and the same fixture. **If the collapse
turns out to genuinely require runtime normalization on web, stop and raise it
rather than adding the dependency back.**

Before relying on static theme CSS for release, add the mixed-color-spelling
hydration check named in the foundation for the earlier
`normalizeThemeValue` removal. This belongs here because zero mode removes the
runtime generator that might otherwise hide a server/client mismatch.

Then build the contract-compliant starter through Vite, Next, and Metro web.
Record JavaScript gzip, CSS gzip, compiler violation count, forbidden module
count, and first render/theme switch behavior. Qualify each integration
independently. An integration is listed as supporting `true` only after its base
receipts pass, and as supporting `{ islands }` only after its additional island
receipts pass. Another integration's failure does not block that qualification.

## 12. Answers to the six open questions in the foundation

1. Compiler theme reachability is not required for the first release. App
   authors narrow the existing config. Revisit only with representative
   adoption evidence.
2. An island has its own provider in a separately compiled, client-only
   full-runtime entry. The compiler passes the static theme name and normalized
   direct-value layers through the manifest, and the portal bridge replays that
   state outside the mount ancestry. Sharing a provider with the zero root is
   rejected.
3. The CSS-custom-property dynamic-value escape is deferred until a greenfield
   report proves enough recoverable sites to justify the new contract.
4. `TAMAGUI_DOES_SSR_CSS='mutates-themes'` is the existing declaration for
   runtime theme mutation. It blocks stripping and zero mode. It is not the
   mode switch.
5. A strict zero build gives the coherent story for removing
   `getSplitStyles`: every component call site lowers, compiler reference
   erasure removes the definitions and imports, `createComponent` is
   unreachable, and the final graph proves it. Ordinary compiled Tamagui keeps
   the prop walker because residual call sites remain valid.
6. The mixed-color-spelling hydration test is a prerequisite in Phase 7. It is
   small, but zero mode must not depend on the unverified premise.

## 13. Main risks

| Risk | Current confidence | Required deciding evidence |
| --- | --- | --- |
| Separate client-only full-runtime islands while sharing React and one cross-build CSS artifact | **GUESS:** architecture chosen, no fixture has proven it | Phase 1 end-to-end island fixture in each integration |
| Metro pre-dependency reference erasure and serializer graph gate | **INFERRED from the manager's localization probe:** removing the reference removed all observed markers, but the complete transform is untested | Emitted Metro web graph with full and residual-import negative controls |
| App-local `styled()` erasure covers declarations in otherwise-live modules | **GUESS:** bundlers retain the effectful call today; the exact compiler binding shapes are unproven | Phase 1 nonblocking scoping probe, followed by Phase 3 graph acceptance |
| Static island theme bridge survives provider, portal, and direct-value layers | **GUESS:** the name-only Portal failure is read, but the cumulative bridge is unimplemented | Portaled computed-color and JavaScript theme-state fixture under a non-default direct-value Theme |
| AnimatedNumber leaf keeps existing completion and linked-style behavior without config/provider | **INFERRED from current method boundaries** | Existing browser completion test retargeted to the leaf plus new gzip receipts |
| Static Block 3 Theme can replace every zero-root provider use | **READ:** the direct-prop API is present on current `v3-beta`. **GUESS:** provider-free zero behavior is unproven | Nested theme, direct theme-value props and modifiers, SSR, hydration, and class-switch fixtures |
| Config narrowing is sufficient without theme reachability analysis | **INFERRED from the measured 17,243 to 2,592 byte authoring result** | Contract-compliant starter feedback and CSS transfer measurement |

The weakest link is the island build architecture, now including theme-state and
CSS coordination across separate client builds. It is deliberately first in the
sequence. Reference erasure solves the zero entry's forbidden imports, while an
ordinary lazy chunk still inherits the zero compilation's literal and standard
module identities. No runtime guard, importer-sensitive transform, or
per-component fallback is allowed to hide that conflict.

---

## Phase 1 record: what the fixtures proved

This section is evidence, added after Phase 1 ran. Every claim here is a build or
a browser run that was executed; the fixture is `code/tests/zero-runtime` and the
receipts are written to its `.tamagui/zero` directory.

### Verdict per integration

| Integration | Base zero | Islands | Receipt |
| --- | --- | --- | --- |
| Vite | yes | yes | `.tamagui/zero/vite-receipts.json`, `vite-dist.graph.json` |
| Next webpack | yes | yes | `.tamagui/zero/next-receipts.json`, `next-zero.graph.json` |
| Metro web | yes | yes | `.tamagui/zero/metro-receipts.json`, `metro-zero.graph.json` |

The island architecture holds. No design-contradicting failure was found.

### Corrections the fixtures forced

These are the parts of the design that were wrong or underspecified, found by
running it rather than by reading it.

**Reference erasure must be evidence-based, and the analyzer would not supply
the evidence.** The first implementation asked the module analyzer for the
references of each imported binding. It returns no definition for an *import*
binding in an unlinked single-module project, so every lookup returned zero
references, and "no references" was read as "dead". Every Tamagui import
specifier was being erased unconditionally; a fixture whose sites all lowered
looked correct by luck. Erasure now counts name occurrences from the AST
directly, and deliberately over-counts a shadowed name: over-counting keeps an
import that could have dropped, under-counting ships a `ReferenceError`. The
standing control is a module that statically reads `getTokens`, which must fail
with rule `zero/live-tamagui-reference` and must never build green.

**The zero transform applies to app-authored modules only.** A workspace package
resolves outside `node_modules` in this repository, so a `node_modules` guard is
not enough. Running erasure inside `@tamagui/web`'s own dist breaks its
re-exports.

**A build's CSS artifact cannot depend on work a cache skips.** Webpack's module
cache skips the loader on a rebuild, and Metro's plan cache skips the scan, but
those are exactly where each module's atomic CSS and bridge rules are collected.
Both integrations emitted an artifact missing every zero and island rule on the
second build while still deriving `TAMAGUI_DID_OUTPUT_CSS` from it, which is the
divergence section 3 forbids. Both now do the work every time: webpack marks the
loader non-cacheable in zero mode, Metro always scans. **Phase 2 should make this
cheap by persisting the per-module plan CSS beside the existing plan cache and
rehydrating it in the plugin, instead of re-running the transform.** The
warm-rebuild receipt in each integration's receipts file is that change's
regression test.

**The zero contract is a property of an entry graph, not of a project.** Metro's
frontend plans every project source by directory walk. Judged per file, the app's
own `tamagui.config.ts`, the generated island entry, and unrelated control
fixtures all violate the contract while being entirely legitimate. Metro now
applies the zero transform only to modules reachable from the bundle's entry.

**Bridge ids must be unique across modules.** A per-module index collides between
modules and duplicates across webpack's server and client compilations. Ids are
now derived from the root-relative module path, and the manifest merges by id.

**Loader and plugin cannot share module-level state.** The webpack plugin is
imported as ESM while webpack resolves the loader through the CJS entry, so a
module-scoped registry gives them different objects and the artifact silently
loses everything the loader wrote. The registry is process-level.

### Section 10 assertions, per integration

All eight hold on all three integrations, except that assertion 7 (server HTML)
is Next-only by nature. Assertion 2 is checked by identity of `useState`,
`createElement`, and React's client-internals object, not by identity of the
namespace object: webpack hands `import * as React` a per-context namespace
wrapper, so comparing wrappers is a check that fails on a correct build.

### The styled scoping probe, answered

The nonblocking probe from this section is resolved and its answer strengthens
the erasure design. With one app-local `const Card = styled(View, {...})` used
only in lowered JSX, in a module with another live export:

- before erasure, an ordinary compiled Vite build drops the `Card` *binding* but
  keeps the call as a bare effectful expression statement, and retains 85
  Tamagui modules;
- after erasure, the same fixture emits zero Tamagui modules, no styled options
  object, and the neighbouring export still works.

So bundler shaking does not cover this leg on Vite either. Compiler reference
removal is required everywhere, not only on Metro.

### One fixture, three integrations: keep them isolated

The fixture builds the same source through all three integrations, and twice it
produced green receipts that described a different integration's build.

- Next and Metro both published the CSS artifact and the island bundle to
  `public/`, so whichever built last silently decided what the *other*
  integration's assertions read. Metro now publishes to its own directory
  through the `zeroPublicDir` option.
- A root `babel.config.cjs` added for Metro broke the Next build in the same
  fixture: Next's Babel loader rejects `.cjs`, and any root babel config switches
  Next off SWC entirely. Metro now carries its presets inside its own
  `metro-babel-transformer.cjs` with `configFile: false`.

Both are the same shape as an assertion that cannot fail: the check runs, it
passes, and it was never looking at the thing it claims to describe. A fourth
integration must get its own publish directory and must not add a config file at
the fixture root that another integration also reads.

### Integration-specific constraints found

- **Metro has no externals mechanism.** The island bundle redirects `react`,
  `react-dom`, and `react/jsx-runtime` through generated shim modules via
  `resolver.resolveRequest`; those read the same handoff the generated loader
  publishes.
- **Metro islands are a second bundle request in a separate process**, so the CSS
  coordinator hands island fragments over on disk: the island build writes its
  fragment, the zero build refuses to finalize until every declared fragment is
  present.
- **Next 16 defaults to Turbopack.** The webpack adapter needs `next build
  --webpack`, matching this document's note that the CLI/Turbopack path must
  implement the same gates before it advertises the mode.

## Phase 2 record: global CSS artifact ownership

Evidence added after Phase 2 ran. Every figure below is a build, a browser run,
or a control that was executed; the fixture is `code/tests/zero-runtime` and the
receipts are in its `.tamagui/zero` directory.

### The compiled-global-CSS tier is live, and this is what it is worth

**READ.** `outputCSS` was already wired through the Vite web path before this
phase: `loadTamaguiFromModules` calls `writeTamaguiCSS`, and a `full`-runtime
Vite build of the fixture wrote a 934,134-byte artifact. What was missing was
the ownership: nothing derived `TAMAGUI_DID_OUTPUT_CSS` and nothing proved the
artifact was real, current and loaded. Both integrations now do.

Same fixture, same entry, same imported artifact, with
`TAMAGUI_DOES_SSR_CSS='mutates-themes'` as the ordinary-tier control:

| integration | ordinary tier | flag derived | Δ gzip |
| --- | ---: | ---: | ---: |
| Vite | 110,360 | 107,347 | **−3,013** |
| Next webpack | 190,868 | 188,240 | **−2,628** |

Both removed the same rules: 4 `is_View` occurrences and 8 `:root` blocks left
the JavaScript, matching the foundation's 6→2 and 8→0 counts exactly. The
foundation measured −2,928 on its own fixtures; these bracket it.

### The three failure modes, and the proof each check can fail

Missing, stale and unimported are three separate causes, so they are three
separate diagnostics from one shared checker
(`code/compiler/static/src/zero/ownership.ts`). Each has a control that produces
that exact state and each control fails the build naming its own reason, on both
Vite and Next:

- **unimported**: an entry that never imports the artifact. Nothing simulated.
- **missing**: a fixture plugin deletes the artifact after it is generated.
- **stale**: the same plugin rewrites it with different bytes.

Two more artifact-load controls, both proven to fail:

- a zero build whose entry graph has no HTML entry never receives the plugin's
  stylesheet link, so it now fails instead of shipping stripped JavaScript with
  no replacement;
- `TAMAGUI_DOES_SSR_CSS='mutates-themes'` in zero mode fails with rule 4, and on
  the compiled-global tier it refuses the claim and keeps the runtime generator,
  which the browser confirms: the provider's injected sheet is 0 bytes with the
  flag and 934,134 bytes without it, from the same source and the same entry.

### What the browser proves

The compiled-global fixture renders with JavaScript CSS generation absent:
`.is_View`, `:root` variables, `.font_body`, `.t_dark` and compiler atomic rules
from two different app modules all reach the loaded stylesheets, computed styles
are correct, and a nested `Theme` really switches. The zero fixture's island
rule (`width:137px`) is in the same artifact and applies. 27 Playwright
assertions across five projects.

### Correction: webpack hides most of a production graph

**READ.** `compilation.modules` reports one `ConcatenatedModule` in place of
everything scope hoisting merged. Reading only the top level found `_app` but
not the page that imported a contract violation, so the live-reference control
built past the compiler gate and only tripped the graph gate. Every webpack walk
now flattens concatenated modules. The zero build's module count went from 131
to 134 with the same 0 forbidden, so the forbidden-module gate was seeing three
fewer modules than shipped.

### Correction: an identity hash must be canonical

**READ.** `hashBridgeManifest` used plain `JSON.stringify`, so the same manifest
hashed differently depending on object key insertion order. A manifest that made
a round trip through a cache came back key-sorted and produced a different
artifact identity, which reads as a real change. The manifest is canonicalized
before hashing and before it is written to a receipt.

### The warm-cache optimisation

Phase 1 forced a full re-run every build because the caches skipped exactly the
work that fills the artifact. Both integrations now cache again without the
divergence, and both receipts assert the reuse actually happens, so a
speedup that silently stops engaging fails the receipt rather than passing it.

- **Metro** publishes a CSS sidecar beside the plan cache in the same
  transaction, carrying config CSS, per-module atomic CSS, bridge rules and the
  bridge manifest for that exact plan generation. A warm build rehydrates it; a
  missing or mismatched sidecar sends the build to a full scan. Median of three
  cold/warm pairs: **41,492 ms cold, 15,624 ms warm**.
- **Webpack** carries the same facts on `module.buildInfo`, which webpack
  restores with the cached module, so there is one cache rather than two that
  could disagree. Contract violations ride it too: without that, a warm build
  would drop a violation the cold build failed on. `this.cacheable(false)` is
  gone.

The receipts caught a real regression while this was being written: before the
identity canonicalization above, the warm Metro rebuild changed the artifact
identity and the receipt failed. That is the proof it can.

### Zero-runtime development, which was silently broken

**READ.** Development inlined `'zero'` and ran reference erasure, but the Vite
plugin's zero half was `apply: 'build'`, so nothing served the config CSS and
nothing built the islands. The first probe of `vite dev` looked correct, and it
was reading the Next build's published output out of `public/`. With `public/`
moved aside the same probe reported `display: block` on a `View`, no compiler
atomic rules, zero style tags, and a 404 for the island bundle.

Development now serves what it strips. The config half of the artifact is
published at the same href production uses, the islands are built once at
startup and served by the dev server, and per-module atomic rules stay on Vite's
own `.tamagui.css` modules, where the importer owns the ordering and hot
replacement already works. That is the one dev/production difference and it is
the transport, not the contract. The fixture's Vite `publicDir` is now off, so a
dev assertion cannot be answered by another integration's published output.

Next and Metro development remain unvalidated for zero mode. Neither was changed
and neither should be advertised until it has its own receipts.

### Honest limits

- **Metro cannot decide "unimported".** It emits a JS bundle and owns no HTML or
  CSS module pipeline, so it verifies that the published copy exists and matches
  the artifact it generated, and cannot verify that the page links it. Next zero
  has the same limit for its `public/`-published copy: the design's "import the
  normalized outputCSS module" works for the compiled-global tier, where the
  content is final before the compilation reads it, but a zero artifact is not
  final until its islands are built. The compiled-global tier is where the
  import check is real, and it is checked there on both Vite and Next.
- The island loader still ensures its stylesheet at runtime. On a correct build
  it never fires, and the Playwright assertion that no island-injected link
  exists still holds. Phase 3 made that recovery loud and documented it as the
  one accepted runtime recovery in this mode; see section 10.

## Phase 3 record: the compiler contract, erasure, and both gates

Evidence added after Phase 3 ran. Every claim is a build, a browser run, or a
control that was executed; the fixture is `code/tests/zero-runtime` and the
receipts are in its `.tamagui/zero` directory.

### Every rule has a control, and every control fails

**READ.** Section 5's rule map is live. Each rule has one behavioral fixture in
`src/rules/` and the authored fix beside it, so each control has an independent
variable rather than only a failure:

| Rule | Fixture | Fails with | Its fix |
| --- | --- | --- | --- |
| 1 | `<View {...boxProps} />`, a *static* spread | `Rule 1 local/unsafe-style-spread` | explicit props |
| 2 | `const Which = isWide ? View : Text` | `Rule 2 zero/live-tamagui-reference`, naming the expression | one literal component |
| 3 | `fontFamily={runtimeFont}` | `Rule 3 local/dynamic-style-value`, naming the prop | `fontFamily="$body"` |
| 4 | `<View theme="dark" />` | `Rule 4 local/unsupported-target` | a static `<Theme name>` wrapper |
| 5 | `animateOnly={['opacity']}` | `Rule 5 local/unsupported-target` | a static CSS transition |
| 6 | `<ZStack />`, which declares `neverFlatten` | `Rule 6 local/unsupported-target` | `<View position="relative">` |
| 7 | `useTheme()` | `Rule 7 zero/design-state-read`, naming the API | a static color |

All seven violating builds fail printing section 5's exact message. All seven
fixed builds succeed with an empty forbidden-module list and zero Tamagui
modules, so each pair differs in one authored fact.

Four more controls, all proven to fail, and all naming their own reason:

- a bare side-effect `import '@tamagui/core'` fails with `zero/side-effect-import`
  rather than being erased, because its effects are unknown;
- a config whose driver is not the CSS driver fails at config level with the
  fixed rule 5 message, while the same fixture on `animationsCSS` builds green;
- an exported app-local `styled()` that some untransformed module still reads as
  a value fails the build-wide erased-export gate, which names the importer;
- the `mutates-themes` and no-HTML-entry controls from Phase 2 still fail.

### One violation list, three integrations, one order

**READ.** The multi-file fixture puts four violations across two modules behind a
third. Vite, Next/webpack and Metro each report all four, in the identical order,
with identical rule numbers, files, lines and columns:

```text
src/rules/multi/alpha.tsx 7:31 rule 1 local/unsafe-style-spread
src/rules/multi/alpha.tsx 8:7  rule 4 local/unsupported-target
src/rules/multi/beta.tsx  7:5  rule 6 local/unsupported-target
src/rules/multi/beta.tsx  8:7  rule 3 local/dynamic-style-value
```

Each integration also writes that list as `<name>.violations.json` before it
fails, which is what makes `report` and `enforce` comparable rather than a claim.

### `report` runs the same analysis and exits successfully

**READ.** The same fixture built with `zeroRuntime: 'report'` exits 0 and emits a
byte-identical `violations` array. It keeps the full runtime: 288,910 bytes of
JavaScript against the zero build's React baseline, no erasure, no artifact
ownership, no island builds, and `TAMAGUI_RUNTIME` stays `'full'`.

Two honest limits of `report`:

- it runs the mode-aware compiler host, so a site zero mode rejects does not
  lower in a report build either. Its output is a working full-runtime build,
  but it is not byte-identical to an ordinary compiled build at those sites;
- config-level rejections (`mutates-themes`, a non-CSS driver, a native target)
  stay `enforce`-only hard errors. `report` does not list them.

### The two gates have separate independent variables

**READ.** The opaque-access control reaches `getTokens` through a dynamic import,
which has no import declaration for the compiler-local accounting to attribute.
Its `violations.json` records **0** compiler violations while the module-graph
gate fails with 8 forbidden modules on Vite and 171 on Metro, each naming its
importer chain. The receipt asserts both halves, so a compiler-local gate that
started catching this would fail the receipt rather than quietly making the
graph gate redundant.

### Exported `styled()` erasure, and the gate that makes it safe

**READ.** An exported app-local `styled()` used only in lowered JSX inside its own
module is erased, the module's neighbouring live exports still work, and the zero
graph carries no Tamagui module.

That erasure is only sound because every importer in the entry graph was itself
transformed, which no single module can see, so it is checked once per build. The
escape control is a `.ts` module, which the zero transform never runs on, reading
the same exported binding as a value: the build fails naming the untransformed
importer. Without the gate the bundler fails later with a missing-export message
that says nothing about why the export is missing.

### The animated-number leaf

**READ.** The four public animated-number hooks moved to
`@tamagui/animations-css/animated-number`, which imports React and React DOM at
value level and Tamagui only as types. `createAnimations` consumes the same
functions, so there is one implementation.

A fixture that imports `useAnimatedNumber` and `useAnimatedNumberStyle` from the
public `tamagui` barrel builds a zero graph whose only Tamagui module is
`animations-css/dist/esm/animated-number.mjs`: the compiler rewrote those two
specifiers to the leaf before import cleanup, so no barrel enters the graph. In
the browser the hook animates a literal host element and its completion callback
runs.

Phase 5 still owns the rest of that work: the `createComponent` and
`createTamagui` guards, and the three-artifact gzip measurement (full driver,
zero without AnimatedNumber, zero with one hook).

### Two contract errors section 5 does not have a rule for

A bare side-effect Tamagui import and a static import of a declared island are
erasure-level contract errors, not rule-map entries. The failure format requires
a rule number, so both carry rule 6, because rule 6's resolution is also theirs:
move the owning module to a declared full-runtime island. Their codes
(`zero/side-effect-import`, `zero/static-island-import`) are what identifies
them, and both have controls.

### Corrections Phase 3 forced

These are the parts that were wrong when written and were found by running them.

**A driver check that reads only `animationDrivers` cannot fail.** That field is
set only for a multi-driver config; an ordinary single-driver config resolves to
`animations` and leaves it `undefined`. The first config-level rule 5 check
iterated the map, so it passed on every single-driver config, including a
`motion` driver whose `outputStyle` is `inline`. It now reads the resolved
driver as well, and the control proves it.

**A flattened webpack walk reports the same module twice.** The multi-file
control reported 8 violations for 4 sites: a module concatenated into one chunk
and standalone in another appears twice in the flattened walk. Per-module CSS is
keyed by resource and survived that, so nothing before this control could see
it. The walk now visits each resource once.

**A `closeBundle` check replaces the real build error.** Vite runs `closeBundle`
even when the build already failed, so the zero tier's own no-HTML-entry check
was reporting a missing stylesheet link on builds that failed for a completely
different reason. It now records the failure from `buildEnd(error)` and stays
quiet.

**The erased-export gate has to run before the bundler resolves exports.** Placed
in `generateBundle`, it never ran on the build it exists for: rolldown had
already failed on the missing export, so the gate saw an empty importer map and
passed. It runs in `buildEnd` now, and it refuses to pass when the module it is
asked about is not in the graph it was handed, because an empty result there is
not evidence of no importers.

**`report` must run the same mode-aware host as `enforce`.** With the host's
zero-mode diagnostics gated on `enforce`, report mode silently dropped every rule
1 site and emitted a shorter list than the mode it is supposed to preview.
