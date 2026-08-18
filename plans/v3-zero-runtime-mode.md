# V3 zero-runtime mode and DOM package retirement

Status: Block 2 is implemented and closed. Phases 1 through 7 built the mode;
phase 8 closed it out. The design below is the accepted one and still
describes what shipped; each phase's receipts are recorded in its own
"Phase N record" section at the end.

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
| 8. No module-level imports that defeat the zero graph | Detectable at erasure for a bare side-effect Tamagui import and for a static import of a declared island module. Both are module-level facts, not element sites, and neither is fixed by moving the module to an island, so each code carries its own remediation. | `Zero-runtime rule 8: <DETAIL> defeats the zero-runtime graph. <REMEDIATION>` where the two codes are `zero/side-effect-import` (remediation: `Remove it, or import the values this module uses so the compiler can lower and erase them.`) and `zero/static-island-import` (remediation: `Import the generated island loader instead; the island is a separately built entry and the zero graph never contains it.`) |

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
would break direct imports. The standalone subpath declarations receive
`@deprecated` JSDoc directing new code to regular `html.*`.

**`@tamagui/dom`'s own root declarations deliberately do NOT carry the tag, and
this clause originally contradicted the one above it.** Two facts settle it,
both measured in Phase 6. First, TypeScript only surfaces `@deprecated` from the
DECLARATION site: the tag is inert on a module's top JSDoc and inert on a
re-export alias, and it flows through `export *`. Second, `@tamagui/dom`'s
exports are the generated tables, which this same section names as the one source
of truth and names Tamagui's own compiler and runtime as the intended consumer —
nine files import them, one being `dom/html.tsx`, the implementation of the
RECOMMENDED API. So there is no form of the tag that reaches an outside importer
without striking through Tamagui's own internal use of its own tables, including
the recommended frontend's implementation. A hint that fires on internal code
trains people to ignore hints. The ownership clause wins; demotion is carried by
the docs (which reference none of these entries) and by the standalone entries'
own tags. There is no runtime console warning, package-install warning, or
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
a rule number, so Phase 3 gave both rule 6. That was wrong: rule 6's remediation
is "move the owning module to an island", which fixes neither. **Phase 4 added
rule 8 for exactly these two codes, each with its own remediation.** Their codes
(`zero/side-effect-import`, `zero/static-island-import`) are unchanged and both
still have controls.

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

## Phase 4 record: the providerless root and compiled static Theme

Evidence added after Phase 4 ran. Same fixture, `code/tests/zero-runtime`, and
the same three integrations.

### One table, one name resolution, one span

**READ.** `reservedThemeProps` now lives in `code/core/helpers/src/reservedThemeProps.ts`
and is exported through `@tamagui/helpers`, which `@tamagui/web` re-exports, so
its public name is unchanged. The compiler classifies `<Theme>` props with that
table rather than a second list.

Two more pieces had to be shared for the compiled span to mean what the runtime
span means, and both are now single implementations:

- `resolveThemeName(parentName, name, reset, themes)` in `useThemeState.ts`. It
  was the body of `getNewThemeName`, which is pure apart from its cache and
  `getConfig()`. The compiler walks a `<Theme>` chain through the same function,
  so `<Theme name="dark"><Theme name="level2">` compiles to `dark_level2`, the
  name the runtime would have produced, instead of a guess about composition.
- `getThemeClassNames(name, isRoot)` in `@tamagui/helpers`. It was inline in
  `Theme.tsx`'s `getThemeClassNameAndColor`.

The compiled span is now byte-for-byte the composition the runtime emits:

```html
<span class="t_sub_theme t_dark is_Theme tvar_1782898843"
      style="color:var(--color);display:contents">
```

Phase 1's lowering emitted `t_dark is_Theme tvar_…` and no style. Two of those
three differences were real defects, found by writing the parity down:

- **no `display: contents` meant the theme span was a layout box.** Inside a
  flex parent the runtime's span contributes nothing and its child is the flex
  item; the compiled span was an extra flex item.
- **no `color` meant `currentColor` differed** under a compiled theme from the
  same authored tree at runtime.

`variableToString(theme.color)` is `var(--color)` for every theme, so the style
is a constant and the parity costs one attribute.

### A name may be a conditional, and the compiler enumerates it

**READ.** `<Theme name={dark ? 'dark' : 'light'}>` lowers to one span whose
`className` and `style` are the same condition folded over the enumerated
branches. Nested conditionals and a conditional above a nested `<Theme>` take the
product of their branches, capped at 8, past which rule 4 fires naming the count.
The condition's source text is repeated in both attributes, so a condition
containing a call, assignment, `await`, or `new` is rejected rather than
evaluated twice.

Branches that agree collapse, so an ordinary literal `<Theme name="dark">` still
emits a plain string with no ternary.

An island mount under a conditional theme gets one bridge descriptor per branch
and selects its id with the same condition.

### The island provider was re-theming the whole page

**READ, and the most valuable thing this phase found.** `ThemeProvider` writes
`t_<defaultTheme>` onto `document.documentElement` (or `body`, per the
`addThemeClassName` setting). The generated island entry mounts a
`TamaguiProvider` with `defaultTheme` from its bridge, so a page with one dark
island stamped `<html class="t_dark">` from an async chunk.

Everything below it then resolved against dark. `<Theme name="light">` in the
zero page produced a correct `t_light` span, and its subtree still read the dark
values, because `:root.t_dark .tvar_x` matched from above. This was silent: the
Phase 1 island receipts all pass with it, because that fixture's only theme was
the island's own.

`ThemeProviderProps.isSubtreeRoot` fixes it at the source. A provider that
declares itself a subtree root writes no document-level class and carries its
theme on its own node instead. The generated island entry sets it. The receipt
is a Playwright assertion that no `t_*` class reaches `html` or `body` after the
island mounts, which fails on the previous build.

### Rule 8, and why rule 6 was wrong for these two

**READ.** `zero/side-effect-import` and `zero/static-island-import` moved from
rule 6 to rule 8. The codes and their controls are unchanged; the rule number and
the remediation text are what changed, because rule 6 told a developer with a
stray `import '@tamagui/core'` to move the module to an island, which does not
fix it. Rule 8 gives each code its own remediation: remove the import, or import
the generated loader. Both controls still fail and their receipts now assert
`Rule 8 <code>` plus the remediation sentence, on all three integrations.

### Every Phase 4 diagnostic has a control that fails

**READ.** Four new pairs in `src/rules/`, each one authored fact apart:

| Control | Fails with | Its fix |
| --- | --- | --- |
| `<Theme name={themeName}>` from a URL | Rule 4, naming the value | `name={wantsDark ? 'dark' : 'light'}` |
| `<Theme background={runtimeBackground}>` | Rule 3, naming the prop | a literal |
| `<Theme background="#112233 hover:#445566">` | Rule 3, quoting the parser | `dark:#445566` |
| `<TamaguiProvider>` at a zero root | Rule 4 `zero/runtime-provider`, verbatim | a static `<Theme>` |

The `hover:` control is the one that would have been missed. The runtime warns
and drops an unusable clause, so a compiler that called
`getInlineValuesFromProps` and took its result would have built that module
green with the modifier silently gone. `getInlineValuesFromProps` now takes an
optional issue sink: the runtime passes none and keeps warn-and-drop, the
compiler passes one and turns each issue into rule 3. One clause loop, two
dispositions.

`theme` and `themeInverse` already reported rule 4 with the static `<Theme>`
wrapper remediation from Phase 3; its control and exact message assertion are
unchanged.

### What the browser proves

**READ, Playwright, `tests/vite-theme.test.ts`, 5 tests, and the extended island
test.** Every assertion reads computed style or the page's own CSSOM:

- clicking a plain React button switches the compiled subtree between the
  `t_light` and `t_dark` values and back, with an empty `tamaguiModules` list for
  the graph it runs in, so nothing subscribed to anything;
- a nested `<Theme name="level2">` under `<Theme name="dark">` resolves to the
  `dark_level2` values, and not to `light_level2`;
- `<Theme name="dark" background="#0b2545">` puts `--background:#0b2545` on its
  subtree, beating the named theme it sits inside;
- one authored `"#112233 dark:#445566"` compiles to one class used by both
  placements, and the browser reports `rgb(17, 34, 51)` under `t_light` and
  `rgb(68, 85, 102)` under `t_dark`, choosing between two static rules;
- the island's portaled content reports `dark|#0b2545` from `useThemeName()` and
  `useTheme()` inside the portal, which is the JavaScript half of the bridge that
  the computed-CSS assertion cannot see.

The modifier test pins `colorScheme: 'light'`. The config emits a
`prefers-color-scheme` fallback for scheme buckets at the base rule's
specificity, so an unpinned runner decides that assertion instead of the theme
classes under test. That fallback is `getVariablesCSSRules` output and is
identical at runtime; the compiled path does not change it.

### The provider and config modules are absent, and the check can see them

**READ.** The zero graph gate already forbids every Tamagui module, so absence
follows. What was missing was proof the matcher works: the same matcher over an
unminified compiled-global build, which mounts a real `TamaguiProvider` over an
evaluated config, finds 12 modules including `createTamagui.mjs`,
`TamaguiProvider.mjs` and `ThemeProvider.mjs`. Over the zero build it finds none,
in a graph of 16 emitted modules.

### A Next build could fail before generating its own artifact

**READ, found while running the baseline.** The compiled-global tier generated
its owned CSS artifact only in the client compilation. Next builds server and
client together and both resolve the app module that imports the artifact, so a
build whose artifact did not exist yet could fail with
`Module not found: Can't resolve '../.tamagui/global/tamagui-global.css'` on
whichever pass resolved first. It reproduced as an intermittent failure of the
stale-artifact control, which runs right after the missing-artifact control
deletes the file.

`TamaguiPlugin` now generates it once per build process, before any compilation
resolves modules, and every compilation awaits that one generation. Generating it
per compilation instead would have let a later pass recreate a file the build had
deliberately invalidated, which would have made the missing and stale controls
unable to fail.

## Phase 5 record: the runtime guards and the animated-number leaf

Evidence added after Phase 5 ran. Same fixture, `code/tests/zero-runtime`, and
the same attribution harness the foundation used.

### The guards, and the only thing they are allowed to claim

**READ.** `createComponent` and `createTamagui` each open with the literal
`if (process.env.TAMAGUI_RUNTIME === 'zero')` and throw. Nothing sits between the
bundler and the comparison. `createAnimations` got no branch, as decided: it is
reachable only from config evaluation and full-runtime islands, both of which run
under `'full'`.

Section 4 is what these guards are for and it has not moved. Erasure removes the
modules; the guards are a loud secondary failure for a reference that survived,
and the seam Vite and webpack fold a large body at. No byte-removal claim is made
for any of it, and no receipt in this phase treats guard folding as a mechanism.

The receipt is behavioral and runs both halves, in
`code/core/core-test/zeroRuntimeGuards.web.test.tsx`: under the `'zero'` literal
each call throws its own message, and the identical call under `'full'` returns a
component and a parsed config. Disarming both guards (comparing against a literal
nothing sets) fails both tests, so the assertion has an independent variable
rather than a throw that could have come from anywhere.

The island receipts are the other half of the same fact from the opposite side. An
island entry is a real client bundle full of `createComponent` calls, built with
`TAMAGUI_RUNTIME='full'`; if that literal were wrong or missing, every island in
the fixture would throw at module init instead of rendering a sheet.

**READ, what the guards cost an ordinary app: nothing.** The message strings do
not appear in the bench build (`code/comparisons/tamagui-bench`, single-chunk
`gzip -9` 104,783) or in the fixture's own full-runtime build. Every integration
defines the literal as `'full'` outside a zero client, so the comparison folds
and both blocks are dropped. A build with no Tamagui bundler plugin leaves the
`process.env` read in place and ships them; that is the only configuration where
they cost anything.

### What an app that imports AnimatedNumber actually pays

Three artifacts, one authored module, same command, gzip level 9 on the emitted
single chunk (`clientBytes` in `scripts/zero-receipts.mjs`, recorded as
`animationSplit` in `vite-receipts.json`):

| artifact | raw | gzip |
| --- | ---: | ---: |
| full driver: `animated-number.full`, ordinary compiled Tamagui | 246,223 | 78,476 |
| zero, no AnimatedNumber: `animated-number.absent` | 184,101 | 57,659 |
| zero, all four hooks: `animated-number` | 186,904 | 58,749 |

`animated-number.absent` is the identical fixture with the hooks, their style
callbacks and their driving effect removed and nothing else changed, so **1,090
gzip is what a zero app pays for reaching for AnimatedNumber**, whole chunk, with
no other variable moving. The leaf module's own share of that is 944 by
attribution below; the rest is the call sites, which any real use would have too.

The full artifact differs by one more line, `import '../../tamagui.config'`,
because `useAnimationDriver` resolves the driver off parsed config at runtime:
nothing statically imports `createAnimations` until the config does, and a
full-runtime build of this module without its config ships no driver at all and
measures nothing. Its 78,476 therefore carries config parsing and CSS generation
as well as the driver, so the gap to either zero build overstates the animation
saving by a wide margin.

The number that decomposes cleanly comes from the attribution harness,
`code/comparisons/attribute-bundle-gzip.ts`, marginal gzip per original module:

| module | full driver | zero + hooks | zero, no hooks |
| --- | ---: | ---: | ---: |
| `animations-css::createAnimations.mjs` | 1,624 | absent | absent |
| `animations-css::animated-number.mjs` | 903 | 944 | absent |
| `config::animations-css.mjs` | 227 | absent | absent |

**So claiming the whole driver drops for an app that uses AnimatedNumber is
false, and the design was right to forbid it.** Roughly a third of it survives.
What genuinely drops is `createAnimations` plus the config's driver construction.

### The same measurement in the fixture the 2,344 came from

**READ.** The foundation's figure was measured in `code/comparisons/tamagui-bench`
with `EXTRACT=1 npx vite build --sourcemap`, so the post-split modules were
measured there too, same command:

```
marginalGzip  minBytes  module
        1482      4364  @tamagui/animations-css::createAnimations.mjs
         860      2453  @tamagui/animations-css::animated-number.mjs
        2342      6817  TOTAL
```

Single-chunk `gzip -9`: 104,783.

2,342 against the recorded 2,344 for the unsplit `createAnimations`. **INFERRED,
and worth stating as inference:** this is one measurement against a figure taken
at an older commit, so the fair reading is that the split added no meaningful
weight. Treating the two-byte gap as the split's exact cost would be reading more
into it than the method supports. What it does establish directly is how the
driver's cost divides: 860 in the leaf, 1,482 in the component animation
machinery.

### The DCE pair for the animation cluster

**READ.** Absence checks over three builds prove nothing on their own, so the
containment half is a fourth, unminified build of `animated-number.full` whose
emitted module list is read from rolldown's `//#region` markers. It contains
`animations-css/dist/esm/createAnimations.mjs` and `web/dist/esm/createTamagui.mjs`
among 54 Tamagui modules; the receipts fail if it does not.

It does **not** contain `createComponent.mjs`, and that is not a defect: the
compiler lowered the module's only Tamagui component, so the renderer has no
importer even with the full runtime. Component-renderer containment stays where it
already was, on the Phase 1 negative control and the Phase 4 compiled-global probe.

### What the browser proves

**READ, Playwright.** `tests/vite-animated-number.test.ts`, 4 tests, on a graph
whose only Tamagui module is the leaf:

- the four hooks are imported from both the `tamagui` and `@tamagui/core` barrels
  and both rewrite to the leaf, so `tamaguiModules` stays one entry;
- the value animates and its completion callback fires;
- `useAnimatedNumbersStyle` renders a value it hosts and a value it only
  subscribes to, in one call, ending at `translateX(120px) scale(2)`;
- `useAnimatedNumberReaction` is notified more than once before the settle, which
  is what separates a live reaction from a single completion callback.

`tests/vite-transition.test.ts`, 2 tests, static transitions with the component
animation path absent: `transition="medium"` is a config preset, so `0.3s` in the
browser is proof the compiler resolved it against the config rather than copying
an authored string; the box then reads strictly between its two widths partway
through, and settles. That graph ships **no** Tamagui module, not even the leaf.
Both halves discriminate: deleting the prop reports `0s`, and swapping `medium`
for the 80ms `quickest` makes the mid-flight sample read the settled width.

`tests/vite-island.test.ts` gained the presence assertion. A discrete click flushes
React before `evaluate` returns, so what the DOM holds at that moment is what the
runtime decided: the exiting sheet is still visible with a real box, then travels
down, then goes `visibility: hidden` when the exit completes. Rendering the sheet
as `{open && <Sheet/>}` instead makes it fail, so the assertion separates presence
from an immediate teardown rather than just observing that a sheet closes.

The public `useAnimatedNumber` behavior the leaf now backs is unchanged:
`code/kitchen-sink/tests/PublicAnimatedNumber.animated.test.tsx` passes on all
four animation drivers, `animated-css` included.

## Phase 6 record: the demoted DOM surfaces, and one plan-cache fix

Evidence added after Phase 6 ran. Same fixture, `code/tests/zero-runtime`.

### Nothing about the package boundaries moved, which is the point

**READ.** Section 9's grep still returns nothing:

```sh
rg -n --glob '*.mdx' --glob '*.md' --glob '!plans/**' \
  '@tamagui/dom|tamagui/dom|@tamagui/core/dom|Tamagui DOM|DOM mode' \
  code/tamagui.dev docs README.md
```

Exit 1, no matches, so no public page needed a removal edit and none was made.

No export map was narrowed, no runtime warning or throw was added, and no table
was copied anywhere. `code/core/dom/src/__tests__/exports.test.ts` resolves
`@tamagui/dom`, `@tamagui/web/dom`, `@tamagui/core/dom` and `tamagui/dom` under
the default, `browser`, `react-native` and `require` conditions through Node's
own resolver (a child `node --conditions` process per condition set), asserts
every target exists, asserts the native condition is a genuinely different file,
and then loads the three standalone entries and checks they still throw the
compile-only error from `style()` and from a tag. The three entries' export name
sets are compared and must be identical, which is what "alias" means here.

### The deprecation had to go on the declarations, not on the entries

**READ, and it changed the implementation.** A `@deprecated` JSDoc on a module's
top comment produces no hint at all, and a `@deprecated` on a re-export alias
(`/** @deprecated */ export { style } from './base'`) produces no hint either.
Only a tag on the declaration itself reaches the import site, and it does reach
through `export *`. Probed with the TypeScript API on a three-module fixture
before writing anything: suggestion diagnostic 6385 on the tagged symbol, none on
the aliased one, zero semantic errors in both cases.

So the tag lives on `style`, `CompiledStyle`, `ConditionalCompiledStyle`,
`DOMStyleProps` and `StyleDefinition` in `@tamagui/web`'s `dom/standalone.ts`,
and on `html` in the generated `dom/standaloneHtml.ts` (the generator emits it,
`code/core/dom/scripts/generate-html.ts`). Every demoted entry re-exports those,
so one declaration site serves all three aliases.

**`@tamagui/dom` itself got no symbol-level tag, deliberately.** Its exports are
the generated tables, and the same section 9 names Tamagui's own compiler and
runtime as their intended consumer and the tables as the one source of truth.
Nine files in this repo import them; tagging them would strike through
`dom/html.tsx`, which is the *recommended* API's implementation, and would tell
maintainers to stop using the source of truth. Since the alias-level tag is
inert, there is no form of the tag that reaches an outside importer without
reaching those nine. The package's demotion is therefore what the rest of section
9 already says: no product name, no documentation, no recommendation, no new
user-facing API, and out of the web client graph.

### `import { html } from 'tamagui'` did not work

**READ.** Section 9's own public example was broken. `tamagui`'s root re-exports
an explicit allowlist from `@tamagui/core`, and `html` was not on it, so
`import { html } from 'tamagui'` was a TypeScript error and `undefined` at
runtime, while `@tamagui/core` and `@tamagui/web` both exported it. The
deprecation fixture caught it: the control that asserts regular `html.*` carries
no hint failed with "Module 'tamagui' has no exported member 'html'". `html` is
now on the allowlist, and the recommended frontend exists at the recommended
name.

### A regular web client does not carry the tables

**READ**, `domPackageGraph` in `vite-receipts.json`, two new fixture entries
built unminified so rolldown's `//#region` markers are the emitted module list:

| build | runtime `html.*` module | `@tamagui/dom` modules |
| --- | --- | --- |
| `dom-client` | present | none |
| `dom-tables` | present | `dist/esm/tables/tags.mjs` |

`dom-client` selects one of its tags at runtime (`wide ? html.section :
html.article`), so the compiler cannot replace it and
`core/web/dist/esm/dom/html.mjs` is genuinely in the graph. That is the assertion
that lets the absence fail: the tables reach that module as `import type` only,
and a value import would ship them with it. The first build with the tag lowered
in both places emitted 13 modules and no `html.mjs` at all, which would have made
the absence check unfalsifiable.

`dom-tables` is the same client plus one value import of `TAG_NAMES`, and the
matcher finds the package there, so it can detect the package it claims is
absent. Both halves throw with their own message if they come out wrong.

Compiler-side evaluation is unchanged and still loads the tables: the compiler
dom suites pass (`domConformance.native`, `domCompiledRuntime.native` inside
static-tests native 79), `domHtmlRuntime.native` is 24/24, and both new builds
only compile because the compiler read the tables to classify their tags.

### The plan-cache walk hashed build output

This is not a Phase 6 subject; it is the cause behind Phase 5's one flaked
metro-receipts run, verified and fixed here.

`walkProjectSources` in the Metro plugin feeds both the plan cache's options hash
and the speculative-root seed set. It excluded directories by exact name
(`node_modules`, `ios`, `android`, `dist`, `build`, `coverage`, `types`,
`web-build`), so `dist-metro`, `dist-full`, `public/`, `out/` and every other
output directory contributed their emitted JS. Vite and webpack emit
content-hashed filenames, so any unrelated rebuild in the project root changed
the path list and invalidated the cache.

**READ, before the fix**: a temp project with `dist-web/main.a1b2c3.js` produced
options hash `f6fbb65e…`; renaming that one emitted file to `main.d4e5f6.js`
produced `b1899cbc…`. Nothing else changed.

**The rule is now the project's own ignore configuration**, read with git's
semantics: every `.gitignore` from the repository root down to the walked
directory, patterns relative to the file that declares them. It was chosen over
adding names to the list because a name list cannot know that `dist-metro` or
`out` is output, and over excluding only what the plugin writes because the
directory that broke this belongs to a different bundler. Every project already
declares its generated directories in exactly one place. `node_modules` stays
skipped structurally rather than by declaration: it is the same externality
boundary the resolver already draws, and it has to hold in a project with no
`.gitignore`, where the walk would otherwise seed every dependency file as a
speculative root.

**READ, after the fix**: the same rename produces the same hash, and the emitted
bundle is no longer planned, while the authored module still is (the control that
makes a stable hash mean something rather than an empty walk). At the fixture
level, `metro-receipts` was run with a background writer re-emitting
content-hashed files into `dist-full/assets` throughout: it passes with the fix
(`warmBuildReusedPlans: true`) and fails without it with Phase 5's exact message,
"the warm rebuild rescanned, so the warm path proves nothing".

## Phase 7 record: theme-variable collapsing, the hydration premise, and the starter

Block 2's last phase. Three commits on `v3-beta`:

- `ed9f40f366` fix(core): collapse equivalent theme color spellings onto one CSS
  variable
- `79e79b1eea` site: regenerate theme css, 709 to 577 theme variables and 35,443
  to 34,376 gzip
- `83071aa3e0` test(zero-runtime): prove the SSR hydration premise for a
  mixed-color-spelling config
- `79753ce1b4` feat(starters): add the contract-compliant zero-runtime starter
  and its end-to-end size gate

### The collapse is a dedupe key, not a rewrite

`getOrCreateVariable` keyed the auto-variable map on the value's spelling, so
`#333`, `hsl(0, 0%, 20%)` and `hsla(0, 0%, 20%, 1)` each got their own variable.
The fix keys the map on the parsed color instead, written as `#rrggbbaa`, which
is itself a color spelling and therefore can never collide with a raw non-color
value. `registerCSSVariable` uses the same key, so a theme value also collapses
onto a color token that spells the same color differently.

Only the KEY is canonical. The emitted declaration keeps whatever spelling was
registered first, so nothing is rewritten into a longer form; that is why the
artifact came out 405 gzip smaller than it was before `359e29cc83` removed
`normalizeThemeValue`, rather than merely returning to it.

Keying on the parsed integer directly is wrong and the test proves it:
`rgba(0, 0, 0, 0.039)` parses to the 32-bit integer 10, and a `space` token
whose value is the number 10 registers under the same key, so the theme value
silently resolves to `var(--c-space-4)`. Flipping the key to the raw integer
fails that assertion and passes everything else.

**READ, on `code/tamagui.dev/tamagui.generated.css`, regenerated with
`npx tamagui generate-css` and measured with `gzip -9`:**

| | distinct `--t*` variables | canonical color groups | gzip |
| --- | ---: | ---: | ---: |
| before `359e29cc83` (`f2a9f4a533^`) | 577 | 577 | 34,781 |
| at `0d1f49690c` | 709 | 577 | 35,443 |
| after the collapse | 577 | 577 | 34,376 |

132 duplicates removed, none left. The artifact keeps 359 lines and loses
exactly 132 semicolon-separated declarations. Resolving every `var(--t*)`
reference through the auto-variable table and canonicalizing each result, the
before and after artifacts differ on **0** of 154 declaration lines; perturbing
one auto variable by one hex digit makes that same comparison report 62
differing lines, so the zero is a result rather than a check that cannot fail.

### What the collapse costs, per tier, measured

The parser lives where CSS is generated, so a build that owns its CSS artifact
drops it with the rest of the generator, and a build that generates theme CSS in
the browser pays for it.

**READ**, same fixture entry on both sides, `gzip -9` on the emitted chunk:

| Tier | Fixture | Before | After | Delta |
| --- | --- | ---: | ---: | ---: |
| owns an `outputCSS` artifact | `TAMAGUI_ZERO_FIXTURE=global` | 107,837 | 107,837 | **0** |
| generates theme CSS at runtime | `TAMAGUI_ZERO_FIXTURE=rules-full` | 78,646 | 80,755 | **+2,109** |

The two builds are the discriminating pair: both parse the config on the client,
and the only difference is whether `TAMAGUI_DID_OUTPUT_CSS` is derived. The
outputCSS build is byte-identical, content hash included, and contains no color
name from the table; the runtime-CSS build contains them.

**So zero-runtime mode and every compiled-global-CSS app pay nothing, and the
no-compiler tier pays 2,109 gzip for 132 fewer inserted declarations.** That is
the honest shape of the owner's "not by bringing the runtime dependency back to
web": for every tier this mode is about, it is not back. There is no way to have
the collapse in one tier and not the other without an environment fork that
would give a server and a client different variable identity, which is worse
than either number.

### The hydration premise, in a real browser

`code/tests/zero-runtime/hydration.html` plus `src/hydration.tsx` and
`tamagui.hydration.config.ts`. jsdom cannot host this: it returns `""` from
`getComputedStyle(body).getPropertyValue('--x')` and reformats a rule's
`cssText`, and both are load bearing for the path that reads theme values back
out of the document.

The page parses exactly ONE config for rendering. A second `createTamagui` in
the same page does not take over global theme state, so a "client config" built
alongside renders the first config's values and every render assertion is
vacuous. The first attempt at the mismatch control did exactly that and reported
no hydration error at all. The control that works changes the SERVER PAYLOAD
instead, which is what a divergence looks like from the client's side anyway;
React then reports error 418 and corrects the markup.

Four scenarios, one per page load because `scanAllSheets` caches per stylesheet:

- `same-config`, what every app does since the names-only projection has no
  producer: no recoverable errors, no console errors, the probe markup survives
  hydration byte for byte, zero spelling and zero color differences.
- `render-mismatch`: React 418, probe corrected. The render pass can fail.
- `css-roundtrip`, the names-only client projection: every theme value rebuilt
  from the document CSS, zero color differences.
- `css-roundtrip-mismatch`: a perturbed sheet, reported. It has to be a
  DIFFERENT sheet with a different rule count, because `scanAllSheets` caches on
  rule count plus first and last selector and an edited declaration in place is
  answered from the cache.

**The finding, and it is a consequence of the collapse.** On the names-only
projection the client's rebuilt values are the same COLORS but no longer the
same SPELLINGS. Measured on the same fixture with the collapse neutralized and
rebuilt:

| | spelling differences | color differences |
| --- | --- | --- |
| before the collapse | none | none |
| after the collapse | `color`, `borderColor`, `placeholderColor`, `outlineColor` | none |

`rgb(26, 43, 60)`, `hsl(210, 39.5%, 16.9%)` and `rgba(26,43,60,1)` all come back
as `#1a2b3c`, and `white` comes back as the `pureWhite` token's `#ffffff`. The
information needed to spell a particular key's value the way its author wrote it
is genuinely no longer in the CSS once the values collapse.

The consequence is bounded and worth stating exactly: an app that hand-writes a
names-only client theme projection AND renders a raw theme value string into
markup would get a hydration mismatch on that string. Nothing in this repo
produces that projection (foundation, READ), the colors are identical, and the
render half of that combination is not covered by a receipt here, because one
page cannot render with two configs. Do not read the round-trip pass as proving
the render half of the projection path.

### The end-to-end size gate

`code/starters/zero-runtime` is the contract-compliant starter the foundation's
Phase 0 asked for and nothing had yet written: one source tree, built through
Vite, Next webpack and Metro web, with a narrowed two-theme config, a static CSS
transition, static theme switching over two literal names, and one modal-sheet
island. `bun run measure` builds every integration twice, base and islands, and
`bun run test` runs one Playwright spec against all three.

Byte figures come from the emitted files at `gzip -9`, not from the plugins'
bookkeeping: each integration reports a different subset there, and a table
whose columns were measured three ways is not a comparison.

**READ, 2026-08-18, `node scripts/measure.mjs` (exit 0) then `npx playwright
test` (12/12):**

| Integration | Tier | Modules | Tamagui modules | Forbidden | Violations | JS gzip | CSS gzip | Island JS gzip |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Vite | base | 16 | 0 | 0 | 0 | 58,178 | 2,714 | - |
| Vite | islands | 17 | 0 | 0 | 0 | 59,124 | 2,745 | 90,413 |
| Next webpack | base | 132 | 0 | 0 | 0 | 138,979 | 2,714 | - |
| Next webpack | islands | 135 | 0 | 0 | 0 | 140,015 | 2,745 | 90,103 |
| Metro web | base | 13 | 0 | 0 | 0 | 60,150 | 2,714 | - |
| Metro web | islands | 14 | 0 | 0 | 0 | 60,916 | 2,883 | 381,006 |

Qualification, stated per integration and never blended:

| Integration | Base `true` | `{ islands }` |
| --- | --- | --- |
| Vite | qualified: 0 violations, 0 forbidden modules, 0 Tamagui modules, first paint and theme switch from the artifact | qualified: island receipts and the 4 Playwright assertions pass |
| Next webpack | qualified, same receipts | qualified, same receipts |
| Metro web | qualified, same receipts | qualified, same receipts |

`ZERO_INTEGRATION_SUPPORT` therefore stays `{ base: true, islands: true }` for
all three. Nothing here changes it.

Three things the starter's numbers say that the fixture's did not:

- **The CSS is the transferred cost and narrowing controls it.** 2,714 gzip for
  a real screen, against the foundation's 17,243 on an unnarrowed v6 config and
  2,592 on its narrowed one. The narrowing lever is the whole story.
- **Next's JavaScript figure is not comparable to the other two.** It is 138,979
  because it includes Next's framework, main, webpack-runtime and polyfill
  chunks. Compare it to another Next app, not to Vite's 58,178.
- **Metro's island bundle is 4.2x the same island on Vite or Next**, 381,006
  against 90,413 and 90,103, and it is 772 Metro modules against a rolled-up
  chunk. INFERRED, from the Phase 1 finding that Metro does no export-level
  shaking: the island carries every module of every package it touches. The
  fixture's own island shows the same ratio (377,385 against 94,746), so this is
  pre-existing and not something the starter introduced.

### Two defects the starter found

- **A `transition` inside a `styled()` definition emits no transition CSS and
  reports no violation.** READ: `transition="medium"` on a plain `View` emits
  `transition:all 300ms cubic-bezier(0.25, 0.1, 0.25, 1)`; the identical value
  in a `styled(View, {...})` definition, or passed to that styled component at
  its call site, emits nothing and the build stays green with 0 violations. In
  zero mode there is no runtime to recover it, so the transition silently does
  not happen. Whether ordinary compiled Tamagui recovers it at runtime was NOT
  tested. The starter authors the transition on the base component.
- **Identical atomic rules are emitted once per element, not once per artifact.**
  READ: two elements carrying `transition="medium"` put the same
  `._t-1731853650{...}` rule into the artifact twice.

Two smaller observations, both pre-existing and both visible in the fixture:
the Vite island publish writes `tamagui-islands/DetailsIsland.js` and
`tamagui-islands/tamagui-islands/DetailsIsland.js`, a duplicated nesting in the
dist that the page never fetches; and an app whose own package is named
`@tamagui/*` fails the graph gate, because `isTamaguiModuleId` reads the nearest
package.json name and every module in that app then looks like Tamagui's.

### Baselines at `79753ce1b4`

core-test web 471 passed (468 plus this phase's 3) / 2 skipped / 1 todo;
core-test native 293 passed / 7 expected fail / 9 skipped; static-tests native
79, web 165, webpack 20; metro-plugin 6; zero-runtime Playwright **45/45** (41
plus this phase's 4); `bun run receipts` exit 0 across all three integrations;
starter `measure` exit 0 across all six builds and its Playwright 12/12; root
typecheck, lint, `check:deps`, `check:dom-types` and `check:exports:web` clean.

## Phase 8 record: the close-out, and what the starter's two defects turned out to be

Block 2's close-out. It fixed the two defects Phase 7 found, one it found while
looking, wired the fixture and the starter into CI, and extended per-rule
coverage to Next and Metro. The headline is that Phase 7 got the scope of its
first defect wrong in both directions, and finding that out changed what was
fixed.

### Ordinary compiled Tamagui does not recover a `styled()` transition either

Phase 7 recorded the defect and did not test the ordinary compiled path. That
answer decides whether it is a zero-mode bug or an engine-wide one, so it was
the first thing measured.

READ, three boxes in one module differing only in where the transition is
written, built as ordinary compiled Tamagui (`TAMAGUI_ZERO_FIXTURE=rules-full`,
`experimental: {}`, 777 modules, no zero mode anywhere), served, and read in
Chromium. The positive was declared first: the plain `View` case must read
`0.3s` and interpolate, or the probe is broken rather than the engine.

| where the transition is written | before | after |
| --- | --- | --- |
| on a plain `View` (the control) | 0.3s, 156.8px at 120ms | unchanged |
| in a `styled()` definition | **0s, snapped to 200px** | **0.3s, 155.9px at 120ms** |
| at a styled component's call site | 0.3s, 156.8px at 120ms | unchanged |

So Phase 7 was wrong in both directions at once. The call site was never broken,
which makes it the regression guard for the fix rather than a second symptom.
And ordinary compiled Tamagui does not recover the definition case, so this was
never a zero-mode bug.

The runtime is not what is broken. READ: rendered through the pure runtime with
no compiler at all, all three shapes put
`transition: all 300ms cubic-bezier(0.25, 0.1, 0.25, 1)` on the host element.
`styled({ transition })` is a supported authoring shape the engine implements;
the compiler loses it and then flattens the element to a `div`, leaving nothing
to recover it.

### One root cause, and it was never only about `transition`

`compilerHost.ts` decided lowering from the call site's props alone.
`completeProps` merges the styled definition's `defaultProps` about 350 lines
further down, so `animationNames` never saw a definition's animation props and
the lowering proceeded as if they had not been written.

Every prop in `runtimeAnimationProps` had the same hole. READ, one prop per
module, each written once in a definition and once at a call site, built in both
tiers:

| prop in a `styled()` definition | ordinary compiled | the same prop at the CALL SITE |
| --- | --- | --- |
| `transition` (preset) | flattened, prop dropped | emits its `_t-` class |
| `animateOnly` | flattened, prop dropped | RETAINS the component |
| `animation` | flattened, prop dropped | RETAINS the component |
| `animatePresence` | flattened, prop dropped | RETAINS the component |
| `animatedBy` | lowered correctly | lowered correctly |

The call site being correct for the identical value is what makes this
conclusive; no assertion written from first principles would have been as good
an oracle.

`animatedBy` escapes for a reason worth stating exactly, because it is not that
it was handled: the probe used `animatedBy="default"`, which resolves to the
same configured CSS driver either way, so the correct answer and the dropped
answer are identical. INFERRED, not READ. The fix covers it regardless.

**In zero mode all of them built GREEN**, and one of those is a missed
violation, not a missed emit: `animateOnly` in a styled definition shipped a
zero build while the identical value at the call site is a hard Rule 5 error.

The fix merges the component's `defaultProps` into the animation decision with
the same `core.mergeProps` and the same precedence `completeProps` uses below,
so there is one answer to what a prop's value is. Both halves are now receipted:
the emit half by the transition boxes, the report half by `animateOnly`,
`animation` and `animatePresence` each failing their build.

The diagnostic names the origin, which matters more than it sounds:
`animateOnly in the styled() definition of Card requires a component animation
runtime`. Without it an author reads the message against JSX that does not carry
the prop.

One divergence recorded rather than smoothed over: from a styled definition
`animation` and `animatePresence` report Rule 5, while at a call site they
report Rule 2. That is pre-existing. A bare `View` at a call site is
`partialRuntimeSafe`, so it takes the retained-with-runtime-style-program path
and the retained live reference is what Rule 2 catches; a styled component has
`defaultProps`, so it is not `partialRuntimeSafe` and hits the Rule 5 bailout
directly. Rule 5 is the more accurate of the two, so they were not equalised.

### `enterStyle` / `exitStyle` were a false finding, and the lesson generalises

A blast-radius sweep reported that enter/exit animations do not run in any
compiled web build. **That was wrong and is retracted.** `enterStyle` and
`exitStyle` are V2 prop names. V3 does not implement them: the string
`enterStyle` appears nowhere in `code/core/web/src`. V3 expresses the same thing
as clause modifiers on the style value, `opacity="1 enter:0 exit:0"`, resolved
by `directStyle.ts:354` into `.t_unmounted` / `.t_exiting` scoped CSS, with
`codemod-flat-values/src/legacyConditions.ts:15` mapping the old spelling to the
new one. `tsc` rejects the V2 spelling outright.

READ, re-probed with the real V3 shape: `opacity="1 enter:0 exit:0"` is a Rule 5
violation in zero mode and retains the component in ordinary compiled mode, in
both authoring positions. Already correct.

The lesson is worth more than the bug would have been. **A probe of a prop that
does not exist cannot fail informatively.** Green means not-implemented, red
would also have meant not-implemented, so the result carries no information and
looks exactly like a finding. It is the same shape as a control that cannot
discriminate, one level further up: validating the behavior of a thing before
validating that the thing exists. One grep of `code/core/web/src` would have
settled it before any build ran.

### Defect 2 is real, and it is worth 17 gzip bytes on the starter

Identical atomic rules were emitted once per element rather than once per
identifier. The fix is at the source, in `lowerModule`: accumulate rules into a
`Set` instead of an array.

First use wins, which is not a judgement call: it is what the runtime already
does. READ: `insertStyleRule.tsx`'s `shouldInsertStyleRules` skips an identifier
already in the sheet (`maxToInsert` is 1) and appends the rest in first-use
order. So the compiled artifact now matches the runtime's own ordering model
rather than diverging from it, which is a stronger justification than "identical
strings are safe to drop" and was the reason to prefer it over a bucket-aware
reorder.

Measured on the starter's artifact, which is the transferred-bytes question the
defect was raised about:

| | raw | gzip | duplicate rules |
| --- | --- | --- | --- |
| before | 11,944 | 2,745 | 8 |
| after | 11,750 | 2,732 | 2 |

**13 gzip bytes.** Gzip compresses a repeated rule almost perfectly, so the raw
saving of 194 bytes is nearly all it is worth on the wire; the real gain is
fewer CSSOM rules to parse. Do not quote this as a bundle win. On the fixture's
own zero build the same change removed all 13 duplicates.

The remaining 2 are cross-module (`._g-2002439909{gap:16px}` and
`._c-533586090{color:var(--color)}`, shared between `Screen.tsx`, `Dashboard.tsx`
and the island). **They are deliberately not fixed, and the reason is not
laziness.** The artifact holds each module's CSS as one already-joined string,
and by the time it gets there a user's `wrapExtractedCSS` hook may have wrapped
it in anything, `@layer` included. Deduping at that level means parsing those
strings back into rules, which can silently corrupt output for 57 raw bytes.
The robust version is a plan schema change, `css: string` becoming
`cssRules: string[]`, which invalidates Metro's plan cache and touches all three
integrations. That trade is the owner's to make, not a close-out's.

### Defect 3 was a gate bug, not a missing message

An app whose own package is named `@tamagui/*` failed the graph gate because
`isTamaguiModuleId` read the nearest package.json name. The brief allowed a
message instead of a fix "unless you find a principled way to tell an app's own
package from a Tamagui one". There is one, and it needs no name list:
**Tamagui reaches a build as a resolved dependency, so its modules are owned by
a different package.json than the one being built.** `checkZeroGraph` takes the
project root and excludes the package that owns it.

It takes the ROOT rather than deriving it from the entries, and that distinction
was a bug before it was a design. READ: webpack's entry for a Next app is
`node_modules/next/dist/client/next.js`, which belongs to `next`, so an
entry-derived project would have read `next` as the project and the exclusion
would have done nothing on one of the three integrations while looking correct
on the other two. `ZeroRuntimeResolved` now carries `root`, which every
integration already had. `zeroGraph.web.test.ts` has that case as its own test.

The message improved too, for the failures that remain real: each forbidden
module now names its owning package, which the path frequently does not show
(`@tamagui/web` resolves to `code/core/web/dist/...` in this monorepo).

### Coverage beyond Vite, at no extra build

The seven per-rule fixtures and the report-mode receipt were Vite-only. Rather
than 28 more builds, the multi-file fixture grew to cover every rule in one
build, and all three integrations assert the same per-site list through one
shared `scripts/multiFileRules.mjs`.

It needed five modules, not one, and the reason is a real constraint:
**a module that already has a compiler-local violation never reaches reference
erasure**, so the rules erasure reports cannot share a module with the rules the
lowering pass reports. A first attempt put rules 2, 5 and 7 in one module and
got only rule 5; that near-miss is exactly the "control that cannot fail" shape,
since 5 violations would have looked like a working fixture. `delta.tsx` (rule 2)
and `epsilon.tsx` (rule 7) exist for that reason.

Eight sites, rules 1 through 7, in one build per integration. Rule 2 appears
twice at one source position because both `View` and `Text` are live references
on that line, and each unerasable binding is named separately.

Next and Metro also gained the report-mode receipt they lacked: the same control
input, every analysis run, exit 0, and the identical violation list. Both
integrations write their enforce and report receipts to the same hardcoded
filename, so the enforce list is read before the report build runs; that
ordering is what makes the comparison a comparison.

### CI

`v3-zero-runtime` in `.github/workflows/checks.yaml`, a two-entry matrix so the
fixture and the starter get a runner each. That is deliberate on both counts the
brief named: the Metro receipts key their plan cache on the project's own
sources, so a second integration building in the same root re-keys it mid-run;
and `motionDriverConversion` and `safeAreaVariables.native` measure real time, so
they must not share a runner with 45 minutes of bundling. Neither threshold was
touched.

### Baselines at the close-out

core-test web **471 passed** / 2 skipped / 1 todo; core-test native **293
passed** / 7 expected fail / 9 skipped; static-tests native **79**, web **172**
(165 plus this phase's 7), webpack **20**; metro-plugin **6**; zero-runtime
Playwright **46/46** (45 plus this phase's 1); `bun run receipts` exit 0 across
all three integrations, each now asserting all seven rules and its own
report-mode preview; starter `node scripts/measure.mjs` exit 0 across all six
builds and its Playwright **12/12**; root typecheck, lint, `check:deps`,
`check:dom-types` and `check:exports:web` clean.

The starter's CSS moved with the dedupe: base **2,714 to 2,701 gzip**, islands
2,745 to 2,732, Metro islands 2,883 to 2,867. Every other figure in the Phase 7
table is unchanged.
