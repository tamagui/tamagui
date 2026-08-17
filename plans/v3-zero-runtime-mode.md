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

No new bundle measurement was made for this design. Every byte figure below is
relayed from `plans/v3-web-zero-runtime.md`, with that source named beside it.

## Decisions

1. Zero-runtime is a web production mode of regular Tamagui. The same source
   may build for web in zero-runtime mode and for native with the regular
   runtime. Block 1 therefore remains the native behavior for `html.*`.
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
   function. Reaching either one is a compiler or bundle-gate failure. Their
   full bodies and the imports used only by those bodies must disappear after
   constant folding.
6. The seven authoring rules are hard build errors. The compiler prints the
   complete, deterministic per-site list. There is no retained-component
   fallback.
7. `acceptsClassName` remains the authority for whether a component is allowed
   in the zero graph. A package list is documentation, never a second source of
   truth.
8. Islands are full-runtime entry graphs built in a separate bundler invocation
   with `TAMAGUI_RUNTIME='full'`. A dynamic import produced inside the same
   zero-runtime compilation is not an island in the first experimental release.
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
| `'zero'` | The compiler and artifact gates have established a zero-runtime web production graph. |

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

Zero-runtime uses `'zero'` only for production web compilations. Development
and report builds use `'full'` so hot config and CSS updates remain functional,
while the compiler still reports or enforces the authoring contract. Production
is the byte and correctness gate.

### Vite plugin

`code/compiler/vite-plugin/src/plugin.ts` does the following in its config and
build hooks:

1. Resolve `experimental.zeroRuntime` from the same loaded
   `TamaguiBuildOptions` used by the compiler.
2. In the dedicated config-evaluation environment, inline
   `process.env.TAMAGUI_RUNTIME` as `'full'`. Config evaluation must retain
   `createTamagui` and CSS generation even when the client graph is zero.
3. In a production web client, generate the config portion of `outputCSS` from
   the fully evaluated config before application transform begins. A missing
   `outputCSS` path is a configuration error in zero mode.
4. Collect each compiler plan's atomic CSS into the same plugin-owned artifact
   in deterministic module-id order. Zero production transforms do not inject
   the ordinary per-module `.tamagui.css` imports. Expose the combined file as
   one virtual CSS module and inject one import into each declared zero entry.
   The JavaScript stripping fact and its complete replacement asset therefore
   cannot diverge.
5. Inline these exact definitions in the client environment:

```ts
{
  'process.env.TAMAGUI_RUNTIME': JSON.stringify('zero'),
  'process.env.TAMAGUI_DID_OUTPUT_CSS': JSON.stringify('1'),
}
```

6. Development, report, native, and full-runtime island builds inline
   `'full'`; they do not claim `TAMAGUI_DID_OUTPUT_CSS` unless that individual
   build also passed the compiled-global-CSS artifact gate.
7. In `generateBundle`, inspect Rollup chunk module ids and importer chains.
   Fail if a zero entry reaches a forbidden Tamagui module or if its generated
   CSS asset is absent.

This closes the Vite gap described in the measured foundation. Vite's current
per-module atomic CSS virtual modules remain in the ordinary tiers. Zero
production combines those rules with the base, root, font, and theme rules in
one entry artifact.

### Next plugin

`code/compiler/next-plugin/src/withTamagui.ts` and
`code/compiler/loader/src/TamaguiPlugin.ts` own the equivalent webpack path:

1. `loadTamaguiBuildConfigSync` supplies the public mode to the loader and
   plugin. The plugin's pre-compilation hook writes the config portion of
   `outputCSS`; the loader contributes compiler atomic CSS to the same ordered
   collector.
2. `DefinePlugin` receives the direct literal definitions above. Production
   server and client compilations use the same literal so SSR does not execute
   a runtime path the client removed. Development and report use `'full'`.
3. Before sealing, the plugin emits the combined config-plus-atomic artifact.
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
2. The transformer appends one Babel visitor to `args.plugins`. The visitor
   replaces only the exact AST member expression
   `process.env.TAMAGUI_RUNTIME` with `'zero'` for a production `platform=web`
   zero entry and with `'full'` for native, development, report, and island
   entries. This applies to application code and transformed dependencies.
3. Metro web zero mode requires `outputCSS`. After planning the entry graph, the
   frontend writes config CSS plus every plan's atomic CSS in deterministic
   module-id order, then verifies that the entry graph imports that exact file.
   A missing, stale, or unimported artifact is a build error.
4. The plugin wraps Metro's serializer. Before delegating to the configured
   serializer, it inspects `graph.dependencies` and importer paths for the same
   forbidden-module gate. The repo's pinned Metro serializer is used when no
   custom serializer was supplied. This must be a named, version-pinned import,
   not a feature-detection chain.
5. Native Metro builds always inline `'full'`. Block 1's runtime DOM mapping and
   regular theme/media machinery remain available.
6. An island is a second Metro bundle request with `'full'` and its own entry.
   It is not another module in the zero bundle graph.

### Artifact identity

Every integration records this tuple in its cache/build identity:

```text
runtime literal
target
config generation/hash
generated CSS content hash
compiler implementation version
sorted island entry list
```

Changing any member invalidates lowering plans and the bundle cache. The CSS
path alone is insufficient because the content can change in place.

## 4. What gates where

The guards below deliberately contain the full `process.env` expression at the
use site. No `const isZeroRuntime`, config lookup, helper function, or runtime
global sits between the bundler and the comparison.

| Subsystem | Files and import boundary | Exact foldable guard | Zero-mode result | DCE proof required before landing |
| --- | --- | --- | --- | --- |
| Runtime style engine, Cluster A | `createComponent.tsx`; imports of `getSplitStyles`, `directStyle`, `propMapper`, `validStyleProps`, safe-area resolution, and `@tamagui/style-grammar/runtime` | `if (process.env.TAMAGUI_RUNTIME === 'zero') { throw new Error(...) }` as the first statement of `createComponent` | The full function body is unreachable. Every value import referenced only by that body disappears with it. A residual call fails loudly. | Vite/Rollup module graph, webpack module graph, and Metro serializer graph contain none of the named modules in the zero entry. A negative-control full build must contain them. |
| Config parsing and CSS generation, Cluster B | `createTamagui.ts`; `createDesignSystem.ts`, `insertStyleRule.tsx`, `variables.ts`, font registration, token creation, media configuration, animation normalization | The same direct guard as the first statement of `createTamagui`; existing `if (!process.env.TAMAGUI_DID_OUTPUT_CSS)` guards remain for the intermediate tier | Client config imports must tree-shake. Reaching `createTamagui` is a hard error. Config evaluation runs in a separate `'full'` environment and produces CSS. | The Vite, Next, and Metro zero production web graphs omit the config/CSS modules. The config-evaluation graph contains them, proving the control can fail. The generated CSS hash must match the config result. |
| Component runtime, Cluster C | The remainder of `createComponent.tsx`, `useComponentState.ts`, `useThemeState.ts`, `getThemeProxied.ts`, `useTheme.tsx`, styled contexts | `createComponent`'s direct guard owns the branch; direct calls to forbidden hooks get compiler diagnostics | No component hook path remains in the zero graph. Static `Theme` is compiler syntax and becomes host markup plus classes. | Module graphs omit the hook/context files. An executable fixture switches static theme classes without importing a provider. |
| Provider and root injection | `views/TamaguiProvider.tsx`, `ThemeProvider.tsx`, `TamaguiRoot.tsx` | No fallback guard. Their use is illegal in a zero graph and the compiler reports it. | The zero root is ordinary React markup. Generated CSS is loaded by the bundler integration. | Bundle graph rejects these modules and prints their importer chain. |
| Media runtime | `hooks/useMedia.tsx`, `helpers/mediaState.ts`, `matchMedia` and component media subscriptions | Owned by the two top-level guards; `useMedia` is also a rule 7 diagnostic | Media clauses remain CSS. No matchMedia listener or per-component subscription ships. | Graph absence plus a Playwright viewport fixture proving emitted CSS still changes computed style. |
| Theme runtime and mutation | `useThemeState.ts`, `getThemeCSSRules.ts`, `_mutateTheme.ts`, `registerCSSVariable.ts`, Block 3 Theme runtime | Owned by both top-level guards; artifact tier retains existing `TAMAGUI_DID_OUTPUT_CSS` guards | Static theme classes and direct theme-value props survive as CSS. Theme mutation and JS theme reads fail. | Graph absence, static theme-switch browser fixture, and a mutation negative control that must fail the compiler. |
| Component animation machinery, Cluster D | `createComponent.tsx`, `useComponentState.ts`, `@tamagui/animations-css/createAnimations`, `@tamagui/animation-helpers`, `@tamagui/use-presence`, `@tamagui/use-element-layout` | Component paths sit after the `createComponent` guard. `createAnimations` gets its own first-statement `if (process.env.TAMAGUI_RUNTIME === 'zero')` branch returning only the animated-number surface. | Static transitions are CSS. Presence, enter/exit orchestration, driver selection, layout measurement, WAAPI completion, and non-CSS drivers disappear. | Graphs omit every named module except the optional animated-number leaf. Static transition and AnimatedNumber browser fixtures run separately. |
| CSS animated-number leaf | New leaf in `@tamagui/animations-css`, re-exported through regular Tamagui and targeted by compiler import rewrite | No guard in the leaf. Reachability is the opt-in. | `useAnimatedNumber`, `useAnimatedNumberStyle`, `useAnimatedNumbersStyle`, and `useAnimatedNumberReaction` survive when imported. | A bundle with no hook omits the leaf. A bundle with one hook contains only the leaf plus React/React DOM dependencies and runs its completion test. |
| Native runtime DOM mapping | Block 1's `html.native.tsx`, `htmlRuntime.native.tsx`, primitives, and generated `@tamagui/dom` tables | No zero guard because native receives `'full'` | Runtime native `html.*` continues to map supported non-style DOM props and reject unsupported behavior. | Native runtime-versus-compiler conformance fixtures compare host props and rejection behavior per generated table row. |

**READ, relayed from `plans/v3-web-zero-runtime.md` section 5:** Cluster A is
about 16.5 KB gzip and is one value-level import unit because `directStyle`
imports the style-grammar runtime and the mapper/safe-area helpers. Cluster B is
about 3.5 KB gzip after the color-normalization removal. Cluster C is about
7 KB gzip. Cluster D is about 4 KB gzip. These are inventory figures, not new
measurements and not additive release promises.

### DCE acceptance, not source-shape confidence

The direct comparisons are necessary but do not prove the bytes disappeared.
Each integration must produce a machine-readable module graph for two builds of
the same fixture:

- zero build: the forbidden modules are absent;
- full negative control: the same fixture deliberately retains one runtime
  component and the modules are present.

If the negative control cannot make the check fail, the check is invalid. The
implementation also records gzip from the emitted chunks, but module absence is
the correctness gate.

**READ, relayed from `plans/v3-web-zero-runtime.md` section 3:** the existing
`TAMAGUI_DID_OUTPUT_CSS` direct guards removed 2,928 bytes gzip after the color
change. That proves this expression shape is foldable in the measured Vite
fixture. **INFERRED:** the new direct literal guards should fold the same way.
The three integration probes above are still required because that inference
does not prove webpack or Metro behavior.

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
| 4. Static themes and static config | Detectable at config evaluation, at every recognized `Theme` name and direct theme-key-prop site, at `TamaguiProvider`, and for imports/calls of the theme mutation API. A name may be a literal or a statically enumerable conditional over literal names. The compiler parses static theme and platform modifiers in each direct prop value with Block 3's value grammar. An element modifier such as `hover:` or `sm:` is a hard error because it cannot describe a subtree value. Indirect mutation hidden inside opaque third-party code is only visible to the bundle gate. | `Zero-runtime rule 4: <DETAIL> requires runtime theme or config state. Theme names and modifier targets must be statically enumerable, Theme value props and config must be build-time data, and runtime mutation belongs in a full-runtime island.` |
| 5. CSS animation driver only | Detectable from evaluated config and from `animatedBy`, `transition`, lifecycle, and animation props. Static CSS transitions lower. Non-CSS drivers, dynamic driver choice, presence lifecycle, and layout-driven animation fail. | `Zero-runtime rule 5: <DETAIL> requires a component animation runtime. Use a static CSS transition or move this module to a full-runtime island.` |
| 6. Lowerable components only | Detectable after component resolution. `compilerHost.ts` already derives `acceptsClassName` from `staticConfig.acceptsClassName`, `neverFlatten`, and context. This boolean is the only authority. | `Zero-runtime rule 6: <COMPONENT> does not lower to one host element with className and is island-only. Move this module to a declared full-runtime island.` |
| 7. No JavaScript reads of design state | Detectable for direct, aliased, namespace, and re-exported references whose module provenance reaches `useMedia`, `useTheme`, `getTokens`, `useTokens`, `getVariableValue`, `getToken`, `getTokenValue`, `useConfiguration`, or theme mutation exports. A computed property hidden behind opaque code may only reach the bundle gate. | `Zero-runtime rule 7: <API> reads Tamagui design state in JavaScript. Express the condition in CSS or move this module to a full-runtime island.` |

The config-level rule 5 message is fixed as:

```text
[tamagui zero-runtime] Rule 5: createTamagui animations must resolve to the CSS driver. Driver <NAME> has outputStyle=<VALUE>. Remove it from the zero entry or move its consumers to a full-runtime island.
```

The provider message is fixed as:

```text
[tamagui zero-runtime] Rule 4: TamaguiProvider is not used by a zero-runtime root. The bundler loads generated CSS and the compiler lowers static Theme nodes. Remove this provider or make this entry full-runtime.
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
`TamaguiProvider`. It imports the same generated CSS artifact with
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
has one transformed body in a module graph. `createComponent.tsx`,
`createTamagui.ts`, and their transitive imports have the same ids when reached
from the zero entry and an ordinary lazy island. The zero path needs those
bodies folded away, while the island needs them intact. An importer-sensitive
Babel, Rollup, or webpack transform cannot assign both bodies to one id;
transform caching and dependency deduplication converge on that id again.

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
host integration and imports the already generated CSS artifact with runtime
injection disabled.

This is the least proven part of the design. It must be prototyped before any
large runtime surgery. The acceptance fixture has one static zero page and one
Sheet island. It must prove all of the following in Vite, Next, and Metro web:

- the initial zero graph contains no forbidden Tamagui module;
- loading the island does not create a second React instance;
- the island renders and animates with the full runtime;
- theme classes and CSS variables agree across the boundary;
- the zero entry still uses one CSS artifact;
- an illegal static import from zero code to the island fails.

If an integration cannot produce that evidence, its first release supports
`true` and `'report'` but rejects `{ islands }` with an explicit unsupported
integration error. It must not quietly turn an island into an ordinary async
chunk.

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
but do not yet remove subsystems. This phase also owns the minimum shared
artifact path needed by that fixture: evaluate config in the full environment,
combine its config CSS with the fixture's compiler atomic CSS, import that one
artifact from the zero entry and island, disable island runtime CSS injection,
and derive `TAMAGUI_DID_OUTPUT_CSS='1'` only after both entries resolve the
artifact. This is fixture-scoped proof that the two graphs can share CSS.

Validation:

- the six island assertions in section 10;
- a full negative control that makes the forbidden-module graph check fail;
- cache invalidation when only the runtime literal or island list changes.

This phase is a hard gate. Failure changes the integration availability, not
the all-or-nothing contract.

### Phase 2: productionize global CSS artifact ownership

Generalize Phase 1's minimum artifact path to all entries and to the
compiled-global-CSS tier. Wire the Vite web path to `writeTamaguiCSS`, connect
Next and Metro validation, add deterministic multi-module collection and cache
identity, and keep `TAMAGUI_DID_OUTPUT_CSS` integration-owned.

Validation:

- missing, stale, and unimported artifacts each fail;
- base `.is_View`, root variables, font rules, theme rules, and compiler atomic
  rules appear in the loaded CSS;
- the compiled-global-CSS fixture renders correctly with JavaScript CSS
  generation absent;
- `TAMAGUI_DOES_SSR_CSS='mutates-themes'` keeps the ordinary tier live and
  rejects zero mode.

### Phase 3: implement the compiler contract and both gates

Add mode-aware diagnostics to the shared compiler result, aggregate all sites
in each integration, enforce `acceptsClassName`, and add the final module-graph
gate.

Validation:

- one behavioral fixture per rule fails before its fix and prints the exact
  message;
- a multi-file fixture reports every violation in deterministic order;
- `'report'` emits the identical JSON and exits successfully;
- a residual non-JSX `useTheme` import passes the local JSX accounting but
  fails the bundle graph, proving the second gate has an independent variable.

### Phase 4: remove provider and compile Theme

Move `reservedThemeProps` to the side-effect-free shared helper described in
section 6. Teach the compiler to classify static Block 3 `Theme` nodes with
that table, then lower `name` plus direct theme-key props and their
theme/platform value modifiers into markup and CSS. Remove `TamaguiProvider`
from the zero starter.

Validation:

- static light/dark switching and nested static themes in Playwright;
- direct theme-value props change descendant computed styles;
- theme modifiers select the expected static rule without a runtime theme read;
- dynamic name and dynamic theme-value negative controls fail rules 4 and 3,
  respectively;
- the provider/config modules are absent from every zero graph.

### Phase 5: add the runtime guards and split CSS AnimatedNumber

Add the direct guards to `createComponent`, `createTamagui`, and
`createAnimations`. Extract the optional animated-number leaf and implement the
zero-mode import rewrite for the four hooks.

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

### Phase 7: hydration premise and end-to-end size gate

Before relying on static theme CSS for release, add the mixed-color-spelling
hydration check named in the foundation for the earlier
`normalizeThemeValue` removal. This belongs here because zero mode removes the
runtime generator that might otherwise hide a server/client mismatch.

Then build the contract-compliant starter through all three web integrations.
Record JavaScript gzip, CSS gzip, compiler violation count, forbidden module
count, and first render/theme switch behavior. Do not promote the mode if any
integration lacks its graph receipt or artifact identity.

## 12. Answers to the six open questions in the foundation

1. Compiler theme reachability is not required for the first release. App
   authors narrow the existing config. Revisit only with representative
   adoption evidence.
2. An island has its own provider in a separately compiled full-runtime entry.
   Sharing a provider with the zero root is rejected.
3. The CSS-custom-property dynamic-value escape is deferred until a greenfield
   report proves enough recoverable sites to justify the new contract.
4. `TAMAGUI_DOES_SSR_CSS='mutates-themes'` is the existing declaration for
   runtime theme mutation. It blocks stripping and zero mode. It is not the
   mode switch.
5. A strict zero build gives the coherent story for removing
   `getSplitStyles`: every component call site lowers, `createComponent` is
   unreachable, and the final graph proves it. Ordinary compiled Tamagui keeps
   the prop walker because residual call sites remain valid.
6. The mixed-color-spelling hydration test is a prerequisite in Phase 7. It is
   small, but zero mode must not depend on the unverified premise.

## 13. Main risks

| Risk | Current confidence | Required deciding evidence |
| --- | --- | --- |
| Separate full-runtime islands across Vite, Next, and Metro web while sharing React and CSS | **GUESS:** architecture chosen, no fixture has proven it | Phase 1 end-to-end island fixture in each integration |
| Metro serializer graph gate and AST literal injection | **GUESS:** existing transformer and serializer seams appear sufficient | Emitted Metro web graph with a full negative control |
| Direct early guards remove every body-only value import in webpack and Metro | **INFERRED:** Vite's existing CSS guard folds, but the larger bodies are untested | Per-bundler machine-readable module graphs, zero and full control |
| AnimatedNumber leaf keeps existing completion and linked-style behavior without config/provider | **INFERRED from current method boundaries** | Existing browser completion test retargeted to the leaf plus new gzip receipts |
| Static Block 3 Theme can replace every zero-root provider use | **GUESS until Block 3 lands in this worktree** | Nested theme, direct theme-value props and modifiers, SSR, hydration, and class-switch fixtures |
| Config narrowing is sufficient without theme reachability analysis | **INFERRED from the measured 17,243 to 2,592 byte authoring result** | Contract-compliant starter feedback and CSS transfer measurement |

The weakest link is the island build architecture. It is deliberately first in
the sequence because one module id cannot supply a folded body to the zero
entry and a full body to an ordinary lazy island. No runtime guard,
importer-sensitive transform, or per-component fallback is allowed to hide that
conflict.
