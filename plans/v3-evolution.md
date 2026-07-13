# Tamagui v3 styling and compiler execution plan

2026-07-12. This is the acceptance contract and dispatch queue for the v3
styling, component, and compiler work. It supersedes the exploratory sequencing
in the sibling research docs. Those docs retain implementation background;
when they conflict with this file, this file wins.

The work targets `v3-beta`. It does not authorize an npm publish, tag, release,
or direct push to `v3-beta`/`main`.

## Outcome

V3 is done when all of the following are true on one integrated `v3-beta`
release-staging tree:

1. Class syntax is one token-first Tamagui grammar. The runtime parser,
   `to-tailwind`, the compiler, and the Tailwind candidate filter share the
   same grammar registry rather than maintaining inverse maps by hand.
2. The v6 config aligns its default numeric tokens with Tailwind v4, so the
   token-first meaning of `p-4` naturally yields 16px without parser arithmetic.
3. Variant keys use TS-style unions (`'Size | number'`), support
   `compoundVariants`, accept context keys as props, and allow static class
   strings anywhere a static style object is accepted. The old spread/type-key
   runtime syntax is gone.
4. Components are behavior primitives plus user-owned skins. `unstyled`,
   `TAMAGUI_HEADLESS`, default aesthetic variants, and `createX(parts)` skin
   factories are gone. Size propagation remains available as an opt-in
   primitive, not a framework-owned look.
5. Web hybrid mode gives unclaimed classes to the official Tailwind v4 engine.
   Claimed Tamagui classes are filtered out before Tailwind emits CSS, so a
   class never lives in both systems. Native keeps Tamagui classes and warns
   once for unsupported passthrough classes.
6. The compiler performs cross-file analysis, consumes both JSX and compiled
   JSX calls, delegates resolution to the host bundler, explains bailouts, and
   works in Vite and Metro. A temporary parity switch may exist on a feature
   branch; no user-facing dual-engine fallback ships.
7. DOM mode is compile-only: literal DOM tags map to native primitives and
   literal text is wrapped at compile time. There is no per-render string
   inspection and no React Strict DOM runtime dependency.

## Locked contracts

### Token-first class grammar

The numeric part of a utility class is a token name, never a Tailwind scale
index:

- `p-4` means `padding="$4"`.
- `rounded-8` means `borderRadius="$8"`.
- `z-4` means `zIndex="$4"`.
- `bg-color5` means `backgroundColor="$color5"`.
- Raw values use brackets: `p-[16px]`, `w-[200px]`, `opacity-[0.333]`.

The active config supplies the value. On the aligned v6 config `space.$4` is
16px. If an app changes `space.$4` to 20, both `p-4` and `padding="$4"` become
20. The parser never performs `N * 0.25rem` math.

Claiming is deterministic:

- A class that parses as a configured Tamagui shorthand/prop plus an accepted
  token/value is claimed and consumed by Tamagui.
- A syntactically plausible class with a missing category token is not claimed.
- Tamagui modifiers (`hover:`, `press:`, `focus:`, `enter:`, `exit:`, configured
  media keys) are part of the same grammar.
- Everything else is passthrough. On web the Tailwind engine sees it; on native
  it is dropped with a deduplicated development warning.

Precedence is also one rule: base styled values, simple variants, and compound
variants apply in that order; call-site style props override them; call-site
`className` is last and wins. Attribute order must not change the result.

The three type modes remain one implementation:

| `styleMode` | prop types | class handling |
| --- | --- | --- |
| `tamagui` | Tamagui style props | ordinary class passthrough; no utility claiming |
| `tailwind` | className-only styling | Tamagui grammar first, official Tailwind passthrough on web |
| `tamagui-and-tailwind` | Tamagui props + className | the same class pipeline as `tailwind` |

`tailwind` and `tamagui-and-tailwind` differ only in exposed authoring types;
they do not own separate parsers or bundler paths.

### Shared grammar owner

Create a dependency-free `@tamagui/style-grammar` package. It owns:

- prop/shorthand-to-prefix metadata and token categories;
- modifier parsing and arbitrary-value encoding/decoding;
- `parseCandidate`, `formatCandidate`, and `classifyCandidate`;
- the generated human-readable grammar table used by docs and tests.

It does not import React, Tamagui config objects, Babel, Tailwind, or a bundler.
Callers pass a small config view containing shorthands, media names, and token
names. Runtime value resolution stays in `@tamagui/web`; AST rewriting stays in
`@tamagui/to-tailwind`; official Tailwind compilation stays in the bundler
plugin. Duplicate prefix/modifier registries are deleted as each caller moves.

### Variant matching

Variant maps accept exact values and closed TS-style resolver keys:

```tsx
variants: {
  size: {
    sm: { minHeight: 32 },
    'Size | number': createVariantResolver('Size | number', (value, extras) => ({
      minHeight: value,
    })),
  },
}
```

Rules:

1. Exact keys win first.
2. Union resolver keys are checked in declaration order.
3. Union members come from a closed registry: `Size`, `Space`, `Color`,
   `Radius`, `ZIndex`, `Theme`, `FontSize`, `FontStyle`, `FontTransform`,
   `FontLineHeight`, `FontLetterSpacing`, `number`, `string`, `boolean`, and
   `any`.
4. `createVariantResolver()` is a typing helper only. Runtime matching is owned
   by the variant engine whether the helper is used or not.
5. Functional variants may return style objects and may remain runtime. Static
   class strings are accepted only as static values, not dynamically assembled
   by a resolver.

`Size`, `Space`, `Color`, `Radius`, `ZIndex`, and `FontSize` become the preferred
exported type names. Existing `*Tokens` names remain type aliases for ecosystem
source compatibility; the old variant-key syntax does not remain as a runtime
compatibility path.

`compoundVariants` is CVA-shaped:

```tsx
compoundVariants: [
  { size: ['sm', 'md'], tone: 'critical', style: 'bg-red-9 color-white' },
]
```

All matchers must match resolved props/defaults/context. A matcher may be one
value or a readonly array. Entries apply in array order after simple variants.
Caller props and caller `className` still win.

### Static class strings in `styled()`

The preferred form gives the base class string its own argument and keeps
variants/config in the following object. All strings remain scanner-visible:

```tsx
const Frame = styled(View, 'p-4 rounded-4')

const Button = styled(View, 'items-center justify-center', {
  name: 'Button',
  variants: {
    size: { sm: 'h-8 px-3', md: 'h-10 px-4' },
  },
  compoundVariants: [{ size: 'sm', circular: true, style: 'w-8 p-0' }],
})
```

This is a discriminated overload, not a `string | object` union threaded
through the existing generics:

```ts
styled(Component, styleOptions?, staticConfig?)
styled(Component, baseClassName, styleOptions?, staticConfig?)
```

The second signature infers variants from its third argument. Its optional
fourth argument preserves the rare advanced static config (`accept`, `isText`,
`neverFlatten`, and similar fields) without mixing those fields into ordinary
styled options. The implementation normalizes both signatures into the one
existing styled path. Before runtime work, a focused type fixture must prove
variant inference, `defaultVariants`, invalid-key errors, component prop
inference, and the optional fourth argument. If that overload cannot retain the
same inference quality as the object form without assertions or duplicated
public types, keep the object form canonical instead of accumulating type
machinery.

The compiler treats the class strings as static style input. No render-time
string construction is introduced.

### Component/skin boundary

- Behavior owns accessibility, state, focus, gestures, adapt/portal wiring,
  native platform integration, and structural/mechanical layout required for
  correctness.
- A skin owns colors, typography, radii, padding, visual dimensions, hover/
  press aesthetics, and named size tables.
- Default copy/paste skins use semantic named sizes, following the patterns in
  `~/github/chat/src/interface/buttons`. The values may reference user tokens.
- `@tamagui/size` provides an optional `SizeContext` and reusable token-based
  resolvers. It does not make `size` a universal built-in visual contract.
- Button exposes a behavior hook. Sheet/Select expose already-wired behavior
  parts. No `createButton`, `createSheet`, or `createSelect` assembly factory is
  required to skin them.
- Canonical skins are ordinary source fixtures copied into an app and owned by
  that app. Runtime packages do not import a hidden default skin.

### Compiler boundary

- The extractor is an optimizer. Any uncertain case bails to correct Tamagui
  runtime behavior.
- Source JSX and compiled `jsx`/`jsxs`/`createElement` calls normalize into one
  internal element representation.
- The Tamagui transform runs after user syntax transforms.
- Vite/Metro/webpack own module resolution. The analyzer receives the resolved
  graph; it never guesses aliases, exports, or workspace paths.
- Cross-file analysis is a project service, not per-file recursive loading.
- Vite owns the service in-process. Metro performs a main-process graph prepass
  and writes a content-hash cache read by isolated transform workers.
- A diagnostics mode reports the exact binding/prop/import that caused bailout.

### DOM mode boundary

- Web literal tags remain literal tags.
- Native literal tags are rewritten by the compiler to `@tamagui/dom` behavior
  primitives.
- Direct literal string/number children of View-backed tags are wrapped at
  compile time. Dynamic strings and opaque child components are not inspected;
  invalid native text placement fails exactly as React Native does today.
- The v1 tag set covers ordinary View-backed structure (`div`, `section`,
  `main`, `header`, `footer`, `nav`, `ul`, `ol`, `li`), Text-backed tags
  (`span`, `p`, `h1`-`h6`, `label`, `strong`, `em`, `code`), and the basic
  interactive/image set (`button`, `a`, `img`, `input`, `textarea`).
- Structural rewrites for `overflow -> ScrollView`, `select`/`option`, form
  submission, and broad HTMLElement ref emulation are a later packet, not a
  hidden requirement of v1.

## Current baseline and recovery point

- Local `v3-beta` plan baseline: `b5e47829a8`; it is three commits ahead of
  `origin/v3-beta` at the time this plan was written.
- PR #4126 branch: `fix/v6-styleMode-theme-colors` at `5a011ff4fb`, 32 feature
  commits ahead of its v3 base.
- `~/.worktrees/tamagui-v3` contains the previous worker's parked, unstaged
  token-first attempt in six files. It is incomplete, unformatted, and
  unvalidated. Preserve it as recovery material; do not commit it wholesale or
  discard it before diffing each hunk against packet A1/A2.
- #4126 is gate-green only for the old Tailwind-scale grammar. It is not ready
  to merge until the token-first packets below pass.

## Work graph

```text
A0 shared grammar registry
 ├─> A1 token-first #4126 ─> A2 v6 token alignment ─> D0 web hybrid Tailwind
 └─> D0 candidate filtering

B0 variant engine ─> B1 compound/context/class strings ─> B2 repo migration
                                                     └─> C0 size primitive
                                                          └─> C1 Button
                                                               └─> C2 Sheet
                                                                    └─> C3 Select
                                                                         └─> C4 component sweep

E0 Vite ModuleRunner ─> E1 analyzer decision spike ─> E2 shared IR/graph
                                                 ├─> E3 Vite compiler
                                                 └─> E4 Metro compiler
                                                      └─> F0 DOM v1

All completed lanes ─> G0 integrated canary ─> G1 release dry run ─> owner publish gate
```

`A`, `B`, and `E0/E1` can progress in parallel because their owner files do not
overlap. Heavy validation is serialized on the MacBook Air.

## Dispatch packets

### A0 — one style-grammar registry

**Goal:** establish the single inverse contract before changing semantics.

**Owner surfaces:** new `code/core/style-grammar/`; existing
`code/core/web/src/helpers/getSplitStyles.tsx`;
`code/core/to-tailwind/src/maps/*`; `code/core/to-tailwind/src/transform.ts`.

**Implementation:**

1. Inventory every currently claimed prefix, whole-class utility, modifier,
   arbitrary form, and converter-emitted class.
2. Move metadata and pure parse/format logic into `@tamagui/style-grammar`.
3. Make runtime and converter consume it. Keep runtime config/value resolution
   and Babel transformation outside the package.
4. Generate a grammar table from the registry. Flag every convenience that is
   not a direct prop/token spelling (`w-full`, fractions, percentage opacity,
   etc.) and explicitly keep or drop it. No undocumented Tailwind-isms.
5. Delete the replaced maps; no mirror left “temporarily.”

**Acceptance:** every converter-emittable candidate parses back to the same
prop/category/modifiers; every claim has a value-domain test; the package has no
React/Babel/Tailwind dependency; ESM, CJS, and native export conditions build.

**Resource class:** light/medium. Package builds only.

### A1 — finish token-first on #4126

**Goal:** make #4126 implement the ruled grammar before merge.

**Implementation:**

1. Recover only sound hunks from the parked six-file patch.
2. Remove `defaultTokenScales`, `tokenScale`, and all `N * 4` parser/converter
   paths.
3. Resolve numeric names category-first through the active config. A color token
   cannot satisfy padding; a space token cannot satisfy radius.
4. Emit token names from token props (`padding="$4" -> p-4`). Emit arbitrary
   values from raw numbers/lengths (`padding={16} -> p-[16px]`).
5. Remove `animation-*` reconstruction. `transition`, `animateOnly`, and
   component `size` remain props. `enter:`/`exit:` remain style modifiers.
6. Preserve unresolved props/classes rather than emitting plausible but dead
   output.
7. Update all old ×4 tests to custom-token and aligned-v6 assertions.

**Acceptance:** exact source-prop -> converter -> runtime equality on web and
native, including value and `typeof`; custom configs prove portability; ESM/CJS
built output agrees; packed import/require/react-native consumers agree; the
adversarial partition/precedence suite stays green; grammar table reviewed.

**Required targeted gate:**

```sh
cd code/core/to-tailwind && bun run build && bun run test
cd code/core/web && bun run build
TAMAGUI_TARGET=web bunx vitest --config code/packages/vite-plugin-internal/src/vite.config.cjs.ts --run code/core/core-test/tailwind*.web.test.tsx
TAMAGUI_TARGET=native bunx vitest --config code/packages/vite-plugin-internal/src/vite.config.cjs.ts --run code/core/core-test/tailwind*.native.test.tsx
```

Run the packed-consumer gate from a release-staged tree before publish-clear,
not on every edit.

**Resource class:** medium; native/web suites run sequentially.

### A2 — align the v6 config

**Goal:** make the default config provide Tailwind muscle-memory values while
preserving token-first semantics.

**Owner surfaces:** `code/core/config/src/v6-base.ts`,
`v6-tailwind-tokens.ts`, generated palette/token data, config tests.

**Implementation:**

1. Replace the inherited v5 numeric space/size scales with an explicit v6
   scale derived from the pinned Tailwind v4 design system.
2. Align spacing, size, named radii, z-index names, and the default font-size/
   line-height pairs that have direct Tailwind equivalents. Keep categories
   semantically distinct even when values coincide.
3. Generate palette/default tables from one pinned source and add a drift test;
   do not maintain a second handwritten table.
4. Retain app override behavior: user tokens always win and classes follow the
   resulting config.

**Acceptance:** representative canonical classes match Tailwind v4 values;
`p-4`, `padding="$4"`, and the token value are identical web/native; a custom
`$4` proves no parser hardcode; config ESM/CJS/native packages build.

**Resource class:** medium.

### B0 — TS-style variant resolver engine

**Goal:** land the new matching contract at type and runtime layers.

**Owner surfaces:** `code/core/web/src/types.tsx`,
`helpers/propMapper.ts`, `styled.tsx`, `helpers/mergeVariants.ts`, focused core
type/runtime tests.

**Implementation:**

1. Add preferred token type names and aliases.
2. Define the closed resolver-key registry once and derive TypeScript accepted
   keys from it.
3. Parse trimmed `|` unions, exact-match first, then declaration-order resolver
   matching. `any` is the explicit replacement for global `...`.
4. Add the typed `createVariantResolver()` identity helper.
5. Preserve functional-variant bailout semantics; do not add static-mode
   enforcement machinery.

**Acceptance:** type tests cover every registry member, unions, exact-over-type
precedence, declaration order, boolean/number/string distinctions, and invalid
type names. Runtime tests mirror the same matrix.

**Resource class:** medium.

### B1 — compound variants, context props, and class strings

**Goal:** complete the new authoring API before mechanical migration.

**Implementation:**

1. Add `compoundVariants` to public/static config and merge inheritance.
2. Match resolved direct/default/context values, support scalar/readonly-array
   matchers, and apply array order after simple variants.
3. Make every styled-context key a typed, consumed component prop without
   `emptyVariants` declarations.
4. Add overloads for `styled(Component, baseClassName, styleOptions?,
   staticConfig?)` while preserving `styled(Component, styleOptions?,
   staticConfig?)`. Normalize both into one implementation; do not broaden the
   current generic parameter to `string | object` or duplicate runtime paths.
5. Add base-class, simple-variant, and compound `style` strings. Feed all
   static strings through the shared grammar/compiler path.
6. Teach extraction/static-config serialization the new fields and prove
   runtime/compiler output parity.

**Acceptance:** a compile-only fixture first proves equivalent prop/variant
inference for both overloads, including `defaultVariants`, invalid variants,
and a fourth-argument static config. A single integration fixture then
exercises base object + base class, simple functional/static variants, compound
matches, context-provided matches, and call-site overrides on
web/native/extracted web. No attribute order changes precedence.

**Resource class:** medium.

### B2 — migrate the repository and remove the old path

**Baseline inventory:** 32 source files currently use spread resolver keys, 16
use `:number|:string|:boolean`, and the only true global `...` variants are in
`Spacer` and `SizableText`.

**Implementation:**

1. Mechanically migrate every source use to the new keys.
2. Replace functional variants reading sibling props with `compoundVariants`
   where the style shape is static; leave genuinely dynamic/motion-dependent
   resolvers functional.
3. Remove context-only `emptyVariants` hacks.
4. Delete `SpreadKeys`, `VariantTypeKeys`, `GetVariantValues` legacy branches,
   and `propMapper` lookup of `:${typeof value}` / `...`.
5. Regenerate committed types and grep source + generated output for old keys.

**Acceptance grep:** no variant definitions contain `...size`, another
`...tokenCategory`, `:number`, `:string`, `:boolean`, or bare `...`; no new
`animation` prop exists; core/web and every touched UI package build.

**Resource class:** medium with one final heavy typecheck.

### C0 — opt-in size primitive

**Goal:** preserve coordinated sizing without keeping framework-owned skins.

**Owner surfaces:** replace `code/core/sizable-context/` with
`code/core/size/` (`@tamagui/size`), core exports, icon/tabs callers, pilot
skins. Do not publish both packages as parallel size-context paths.

**Implementation:** expose a generic `SizeContext`, a token-size resolver, and
small typed helpers for a skin-owned frame/text/icon table. Keep the package
component-agnostic. Named-size tables live in skin files. A later web-only
optimization may project the active name into CSS variables, but API
correctness must not depend on it.

**Acceptance:** two independent skins use different named scales through the
same primitive; a token-scale skin also works; changing one does not alter the
other; web/native behavior matches.

**Resource class:** light.

### C1 — Button pilot

**Goal:** prove hook + user skin is simpler than the current all-in-one Button.

**Behavior package owns:** button role/tabIndex, disabled semantics, nested
button behavior, press composition, optional text wrapping, and icon prop
plumbing. Export `useButton` plus styleable structural parts. Do not export a
`createButton` factory.

**Skin owns:** named sizes, frame/text/icon lookup, gap, radius, colors, borders,
hover/press/focus visuals, and variants. Start from the simplified chat Button,
not the current framework default.

**Acceptance:** canonical copy file is standalone in a starter/kitchen-sink
app; it uses only public behavior/size APIs; default, disabled, nested, icon,
text, circular, and custom size flows pass web tests and one native interaction
case; the behavior package contains no aesthetic default or `unstyled` branch.

**Resource class:** medium; one browser job at a time.

### C2 — Sheet decomposition

**Goal:** replace `createSheet({ Container, Background, Handle, Overlay })` with
already-wired behavior parts.

**Behavior parts:** `Sheet.Root`, `Controlled`, `Container`, `Background`,
`Overlay`, `Handle`, and `ScrollView` own context, drag/snap, adapt, overlay
placement warnings, remove-scroll, keyboard, native-sheet, and offscreen
mechanics. Parts are styleable directly.

**Skin owns:** surface color, radius, handle appearance, overlay appearance,
and visual spacing. Delete `createSheet` after the canonical skin and internal
callers migrate.

**Acceptance:** existing Sheet animation/drag/scroll-lock/keyboard/overlay
tests pass against the public parts; a copied skin changes every aesthetic
without re-wiring context; no factory or `unstyled` branch remains.

**Resource class:** heavy validation; serialize animated browser/native cases.

### C3 — Select hard-case pilot

**Goal:** prove the boundary on the component with the densest context/adapt/
positioning behavior.

**Behavior owns:** root/value state, keyboard navigation, typeahead, focus,
floating/adapt/sheet integration, item registration, native select behavior,
and portal structure. Every public part is styleable. The skin owns trigger,
item, indicator, viewport, scroll-button, and typography aesthetics.

**Acceptance:** click-hold, focus scope, keyboard navigation, positioning,
typeahead, and adapt-sheet tests pass; the same behavior package runs two
visually different skins; no aesthetic `unstyled` branch or assembly factory
is needed.

**Resource class:** heavy validation.

### C4 — component inventory sweep

**Baseline inventory:** 54 UI/core source files reference `unstyled`; 39
reference `TAMAGUI_HEADLESS`; 23 exported/internal `createX` factories exist,
though not every factory is a skin factory.

**Implementation:** classify each hit as behavior, aesthetic skin, or unrelated
constructor. Apply the Button/Sheet/Select contract across the remaining UI
packages. Keep real behavior constructors; delete only skin-injection factories.
Move canonical skins into app-owned copy fixtures and update docs/starters.

**Acceptance:** source grep is zero for `TAMAGUI_HEADLESS`; `unstyled` exists
only if a non-skin semantic use is explicitly documented and owner-approved;
no default aesthetic imports leak into behavior packages; starter and kitchen
sink use copied skins.

**Resource class:** several medium packets, then one heavy integration gate.

### D0 — official Tailwind v4 on web, unclaimed classes only

**Goal:** full Tailwind web syntax without duplicate CSS or runtime parser
sprawl.

**Owner surfaces:** `@tamagui/style-grammar`,
`code/compiler/vite-plugin/src/`, real Vite style-mode fixture, core native
warning path.

**Implementation:**

1. Require a pinned Tailwind v4 peer/dependency for hybrid mode; fail clearly if
   it is absent. Do not silently fall back to a second implementation.
2. Use the official compiler/scanner APIs inside the Tamagui Vite plugin.
3. Filter scanned candidates through `classifyCandidate`: claimed Tamagui
   candidates never reach Tailwind `build()`; passthrough candidates do.
4. Do not inject Tailwind preflight. Users opt into base styles in their CSS.
5. Place passthrough utilities in a deterministic layer after Tamagui atomic
   styles so call-site `className` wins.
6. Preserve HMR, SSR, and production CSS behavior. Static `styled()` strings
   participate in scanning. Dynamic unclaimed classes follow Tailwind's normal
   static-discovery limitation.
7. On native, warn once per unclaimed candidate and drop it. Claimed Tamagui
   classes still resolve dynamically through tokens/themes.

**Acceptance:** a real Vite fixture renders grid, container queries,
`backdrop-blur`, `data-*`, arbitrary selectors, and a Tamagui token class in one
tree; token/theme changes remain dynamic; the CSS contains zero claimed
candidate rules; SSR and hydration are clean; production gzip delta is measured
and explained as passthrough utilities only.

**Resource class:** medium/heavy; one Vite/browser lane.

### D1 — optional native Tailwind registry (after D0)

This is not a v3-beta blocker. Only start after web hybrid is shipped and a
concrete native requirement justifies the cost. If started, use the official
compiler output to generate a build-time RN registry for the mappable subset;
do not expand the runtime Tamagui grammar with Tailwind-only syntax.

### E0 — Vite ModuleRunner config/component evaluation

**Goal:** eliminate Vite resolution mismatches before rewriting the extractor.

**Owner surfaces:** `code/compiler/vite-plugin/src/loadTamagui.ts`, plugin
environment setup, the `@tamagui/static` load boundary, static/Vite fixtures.

**Implementation:** create a dedicated Vite environment and evaluate
`tamagui.config`/component modules with ModuleRunner through the user's actual
plugin/resolver pipeline. The esbuild loader remains only in bundler adapters
without ModuleRunner; it is not a Vite fallback.

**Acceptance:** alias + conditional-export + monorepo fixture resolves exactly
the same module in app and compiler; config HMR invalidates correctly; current
static tests stay green; the old Vite-side loader path is deleted.

**Resource class:** medium.

### E1 — analyzer decision spike

**Goal:** decide yuku analyzer vs oxc parser + our scope graph with evidence.

**Spike fixtures:** imported token constants, aliased/re-exported imports,
spread config objects, a cross-package monorepo binding, and a compiled-JSX
consumer. Measure cold whole-project link, single-file warm invalidation,
definition/reference correctness, source maps, and process memory.

**Decision rule:** choose yuku only if all binding fixtures are correct, warm
invalidation is usable, and API gaps do not require maintaining a fork. If it
fails, choose `oxc-parser` plus a Tamagui-owned symbol graph. Parser adapters
target the same ESTree/TS-ESTree interface either way. Record the result in this
plan and delete the losing spike code.

**Resource class:** light/medium; no full repo build.

### E2 — shared element IR and project graph

**Goal:** isolate semantics from parser/bundler details.

**Implementation:**

1. Normalize JSX and `jsx`/`jsxs`/`createElement` calls into one element IR.
2. Port binding resolution and partial evaluation behind explicit interfaces.
3. Add a host resolver interface whose inputs are already-resolved ids.
4. Add content-hash graph/cache invalidation and per-bailout reason codes.
5. Run the current static snapshot corpus through old/new engines on the
   feature branch. Differences require an explicit correctness explanation.

**Acceptance:** parity corpus, compiled-JSX corpus, cross-file fixtures,
incremental invalidation, diagnostics snapshots, and source maps are green.

**Resource class:** medium with a heavy parity gate.

### E3 — Vite compiler frontend

**Goal:** make the new engine the single Vite extractor.

**Implementation:** run as a filtered post transform, use the in-process graph
and Vite resolver, preserve virtual CSS/HMR/SSR caches, then remove the Babel
Vite extractor and any public `engine` switch before merge.

**Acceptance:** static tests plus kitchen-sink extracted web, aliased monorepo
fixture, compiled JSX input, HMR, SSR, diagnostics, and cold/warm performance
report. Correct bailout is allowed; output/runtime divergence is not.

**Resource class:** heavy.

### E4 — Metro compiler frontend

**Goal:** give Metro the same cross-file semantics despite isolated workers.

**Implementation:**

1. Extend `withTamagui` to run/own a main-process scan+link prepass using
   Metro's resolver.
2. Write a versioned, content-hash-keyed cache outside source control.
3. Compose after the user's Babel transformer and consume compiled JSX calls.
4. Workers read cache entries without per-file IPC. Watch invalidation updates
   affected entries atomically.
5. Delete the prior Metro extraction path when parity passes; do not retain a
   fallback engine.

**Acceptance:** custom Babel plugin + path alias + workspace package fixture,
two worker processes reading the same graph, warm edit invalidation, native
bundle execution, diagnostics, and cache corruption recovery are proven.

**Resource class:** heavy; Metro and native validation run alone.

### E5 — webpack/Next adapters and Babel extractor removal

After Vite/Metro stabilize, adapt the shared engine to webpack/Next using their
resolvers. Platform-specific adapters are acceptable; two extractors for the
same adapter are not. Delete Babel extractor/evaluator dependencies once the
last supported adapter moves.

### F0 — compile-only DOM v1

**Goal:** author the supported DOM subset once and run it on web/native.

**Owner surfaces:** new `@tamagui/dom` behavior package, compiler IR native
rewrite, DOM conformance fixtures.

**Implementation:**

1. Encode the locked tag classification and attribute/event map as data shared
   by compiler tests and runtime behavior primitives.
2. Leave web tags untouched.
3. On native, inject imports and rewrite tags; wrap only direct literal text/
   number children of View-backed tags.
4. Match React Strict DOM's documented layout defaults and text inheritance
   semantics where React Native differs, but implement them through Tamagui's
   own primitives. No RSD dependency and no runtime child inspection.
5. Warn at compile time for unsupported tags/attributes/nesting when statically
   knowable. Otherwise bail rather than guess.

**Acceptance:** the same source fixture renders semantic web DOM and native
View/Text/press/input behavior; direct literal text works; dynamic invalid text
still fails natively; event/accessibility mappings and layout defaults have
conformance assertions; no per-render string scan appears in the bundle.

**Resource class:** medium/heavy after E4.

### G0 — integrated canary

Build one small v6 app that deliberately combines every lane:

- custom `$4` and theme tokens;
- claimed token-first classes plus unclaimed Tailwind grid/data/container
  syntax;
- a copied named-size Button skin and a copied Sheet/Select skin;
- TS-style + compound + context variants;
- imported cross-file styled constants compiled through Vite and Metro;
- a supported DOM-mode subtree.

Prove web dev/HMR, web production/SSR/hydration, native Metro bundle/runtime,
typecheck, package exports, and exact style values. This canary is the final
acceptance surface; unit suites cannot substitute for it.

### G1 — release dry run

On the integrated release-staging tree:

1. Build every changed package and committed type output.
2. Pack affected packages and install them in an isolated consumer with no
   monorepo symlinks.
3. Exercise ESM, CJS, browser, and react-native export conditions.
4. Run the canary against only packed packages.
5. Inspect tarballs for missing files, tests, accidental source-only imports,
   duplicate grammar tables, and undeclared dependencies.
6. Produce the exact publish command and artifact/version list, then stop for
   owner authorization.

## MacBook Air execution policy

The bottleneck is build/browser/simulator load, not agent reasoning. Use three
logical lanes but one heavy machine lane.

| class | examples | policy |
| --- | --- | --- |
| light | plan/code review, `rg`, focused unit/type fixture | may overlap |
| medium | one package build, focused Vitest suite, analyzer benchmark | one or two only with healthy load/memory |
| heavy | root typecheck/build, static parity corpus, Vite browser, Metro/native, packed canary | exactly one at a time |

- Keep at most two implementation workers active on non-overlapping owner
  surfaces plus one planning/review coordinator.
- A worker announces only a heavy lane or a substantive blocker/final handoff.
- Before a heavy command, check load/memory and confirm no abandoned watcher,
  Metro, browser, or simulator tree. Stop only processes the lane started.
- Prefer targeted package builds/tests during development. Run the root/full
  matrix once at a wave boundary or in CI, never after every small edit.
- Use one root `bun run watch` only when several consecutive package edits make
  it cheaper; do not run targeted builds concurrently with it.
- Browser and native proof run serially. No parallel Playwright instances and
  no fire-and-forget background harnesses.
- Long checks need captured logs and an owning session; an agent handoff is not
  proof that a process finished.

## Coordination and review contract

- The coordinator owns this acceptance list, planning, diff review, and final
  proof comparison. Workers own implementation packets.
- Give every worker this plan plus one packet id and narrow owner paths. Do not
  relay only a chat summary.
- Use separate worktrees/branches from current `v3-beta`; never branch-switch a
  shared checkout. Continue A1 in the existing #4126 worktree because it owns
  the parked recovery diff.
- A0 and A1 are consecutive commits on the existing #4126 branch; they share
  grammar/parser/converter owner files and must not be split across workers.
- Each packet ends in a coherent commit on its feature branch with exact test
  output and remaining gaps. No unvalidated checkpoint commits.
- Reviewer order: contract/API review, diff review, targeted proof replay, then
  integration. A worker's green summary is not coordinator verification.
- No feature branch lands while its old path/fallback/debug probes/TODOs remain.
- PRs target `v3-beta`. Direct `v3-beta`/`main` pushes, npm publish, tags, and
  release commands remain owner-gated.

## First dispatch queue

1. **A0:** build the shared grammar registry and inverse tests.
2. **A1:** recover/rewrite the parked token-first patch on #4126 and run the
   exact web/native/built/packed gate.
3. **In parallel, E0:** land ModuleRunner evaluation for Vite.
4. **In parallel, B0:** land the resolver-key registry and TS/runtime matching.
5. **A2:** align v6 tokens after A1 semantics are stable.
6. **B1 then B2:** compound/context/class strings, then complete repository
   migration and old-path deletion.
7. **C0/C1:** prove size + Button before touching the component fleet.
8. **D0:** wire official Tailwind using A0's candidate filter.
9. **E1/E2:** choose the analyzer and build the shared graph/IR.
10. **C2/C3** and **E3/E4** proceed on separate owner files, with heavy gates
    serialized.
11. **C4**, then **F0**, then the integrated **G0/G1** closeout.

## Stop conditions

Stop and return to design only if:

- a required upstream behavior contradicts a locked contract;
- the yuku spike fails and the oxc fallback also cannot represent a required
  binding case;
- component behavior cannot be separated from an aesthetic without changing
  observable accessibility/gesture/focus semantics;
- the official Tailwind engine cannot filter claimed candidates without
  emitting duplicate rules; or
- Metro offers no main-process/resolver seam for a correct prepass.

In each case, bring a minimal failing fixture and measured evidence. Do not add
a fallback, compatibility mode, or speculative workaround.

## References

- `plans/tailwind-full-syntax.md` — official-engine hybrid detail
- `plans/compiler-oxc.md` — parser/analyzer and bundler research
- `plans/dom-mode.md` — DOM mapping semantics and limitations
- `~/github/chat/src/interface/buttons/` — named-size/user-skin model
- `~/github/yuku` — analyzer candidate
- `~/github/react-strict-dom` — semantics reference only
