# Tamagui DOM, Tailwind, and flat conditional values

## Status

Design plan, July 2026. This consolidates the current direction for:

- regular Tamagui and its future inline style syntax;
- the separate `@tamagui/tailwind` frontend;
- Tamagui-owned DOM components aligned with React Strict DOM;
- the standalone `tamagui/dom` entry;
- compiler, runtime, type, bundle, and migration boundaries.

The design is intentionally compiler-led. Existing Tamagui remains compatible,
while new DOM and Tailwind authoring get strict package and compiler boundaries.

## Decisions

1. `tamagui` and `@tamagui/core` remain regular Tamagui.
2. There is no `@tamagui/inline` package.
3. Tailwind authoring lives in `@tamagui/tailwind`.
4. There is no unified inline-and-Tailwind mode and no global `styleMode`.
5. Tamagui owns its DOM implementation. React Strict DOM is the semantic
   reference and conformance oracle, not a runtime dependency.
6. DOM components are available from regular Tamagui and Tailwind roots.
7. Standalone DOM is available from `tamagui/dom` and
   `@tamagui/core/dom`.
8. The standalone style API is `style()`, not `css.create()`.
9. `style(definition)` uses the same style-definition grammar as
   `styled(Component, definition)`, with the component argument removed.
10. `tailwind-merge` is removed from Tamagui.
11. New DOM authoring always requires the compiler. It cannot bail to an
    untransformed runtime path.
12. Conditional styling moves into individual property values. It is opt-in
    during v3 and planned as the default style syntax in v4.
13. Tamagui tokens keep the `$` sigil.

## Product shape

### Regular Tamagui

```tsx
import { View, Text, html, styled } from 'tamagui'

const Card = styled(View, {
  p: '$4',
  bg: '$surface :hover($surfaceHover)',
})

export function Example() {
  return (
    <html.main p="$4">
      <html.h1 color="$color">Account</html.h1>
      <Card>Content</Card>
    </html.main>
  )
}
```

The lower-level equivalent remains:

```tsx
import { View, Text, html, styled } from '@tamagui/core'
```

Regular Tamagui retains:

- shorthand and longhand style props;
- tokens, themes, media, variants, groups, and animations;
- `styled()`;
- existing `View`, `Text`, and component behavior;
- runtime correctness for existing non-DOM components.

The v4 style direction changes how conditions are written, while the package
and component model remain familiar.

### Tailwind Tamagui

```tsx
import { View, Text, html, styled } from '@tamagui/tailwind'

export function Example() {
  return (
    <html.main className="p-4 bg-surface">
      <html.h1 className="text-color">Account</html.h1>
      <View className="p-4 hover:bg-surface-hover">Content</View>
    </html.main>
  )
}
```

`@tamagui/tailwind` owns:

- Tailwind-style `className` authoring;
- class-oriented component and `styled()` types;
- the Tamagui candidate grammar;
- compiler integration;
- its Tailwind and Vite integration.

It shares the renderer, config, tokens, themes, events, refs, accessibility,
animations, and normalized style output with core. It does not import the
`@tamagui/core` root or its inline-style frontend.

### Standalone Tamagui DOM

```tsx
import { html, style } from 'tamagui/dom'
// lower-level alias: @tamagui/core/dom

const root = style({
  display: 'flex',
  padding: 16,
  backgroundColor: '$surface :hover($surfaceHover)',
})

const heading = style({
  color: '$color',
  fontSize: 24,
})

export function Example() {
  return (
    <html.main style={root}>
      <html.h1 style={heading}>Account</html.h1>
    </html.main>
  )
}
```

`style()` creates one style handle per call. It does not return a namespace
containing named sub-objects.

Conceptually:

```tsx
styled(Component, definition)
style(definition)
```

Both consume the same style-definition grammar. `styled()` binds the
definition to a component, while `style()` returns an opaque compiled handle
for the DOM `style` prop.

The standalone entry contains:

- strict DOM component props;
- `html.*`;
- `style()`;
- opaque compiled style handles and their conditional composition;
- the minimum DOM behavior runtime needed after compilation.

It contains neither regular Tamagui style props nor the Tailwind parser.

The public name is Tamagui DOM or DOM mode. The word `strict` describes the
contract but is not part of the entrypoint or product name.

## One runtime, three frontends

```text
regular Tamagui props ──────┐
                            │
Tailwind class candidates ──┼─> shared property/condition/value IR
                            │                 │
DOM style() definitions ────┘                 ├─> web CSS and semantic tags
                                              └─> native style records and primitives
```

The shared runtime owns:

- config, tokens, themes, and media state;
- component state and contexts;
- events, refs, accessibility, and focus behavior;
- animations;
- normalized style output;
- DOM tag classification and semantic adapters.

The frontends own only authoring syntax, types, parsing, and compiler lowering.

## Styling contracts

Each strict DOM component receives exactly one styling language based on its
import source.

| Import | DOM styling language |
|---|---|
| `tamagui`, `@tamagui/core` | regular Tamagui style props |
| `@tamagui/tailwind` | Tailwind `className` |
| `tamagui/dom`, `@tamagui/core/dom` | `style()` handles |

Examples:

```tsx
// regular Tamagui
<html.div p="$4" bg="$surface :hover($surfaceHover)" />

// Tailwind
<html.div className="p-4 bg-surface hover:bg-surface-hover" />

// standalone DOM
<html.div style={root} />
```

The strict inline DOM types reject Tailwind `className`. The strict Tailwind
DOM types reject Tamagui style props. Standalone DOM accepts compiled style
handles rather than either frontend.

Ordinary Tamagui components may retain raw `className` and `style` where needed
for existing web and React Native interoperability. Core never interprets a
raw `className` as Tamagui Tailwind syntax.

## Flat conditional values

### Goal

All conditional styling belongs to the individual property value. Top-level
style definitions stay flat.

The new form replaces:

- `hoverStyle`, `pressStyle`, `focusStyle`, and other pseudo-style objects;
- `$theme-*` sub-objects;
- `$platform-*` sub-objects;
- media, group, and container sub-objects;
- recursively nested combinations of those objects.

Canonical form:

```tsx
bg="$red :hover($green) :light($color1/50) :dark:hover($color2/20)"
```

Compact input may be accepted:

```tsx
bg="$red:hover($green):dark:hover($blue)"
```

Documentation and formatting always use one space before each conditional
clause:

```tsx
bg="$red :hover($green) :dark:hover($blue)"
```

This is a property-centered conditional program. It reaches a similar
intermediate representation to StyleX and React Strict DOM conditional value
objects, with a surface that composes naturally through JSX props.

### Grammar

```txt
program   = base-value? clause*
clause    = condition+ "(" property-value ")"
condition = ":" registered-condition
```

Example parse:

```ts
[
  { when: [], value: '$red' },
  { when: ['hover'], value: '$green' },
  { when: ['light'], value: '$color1/50' },
  { when: ['dark', 'hover'], value: '$color2/20' },
]
```

A program may omit its base:

```tsx
bg=":hover($green)"
```

Empty clauses are invalid:

```tsx
// compile error
bg="$red :hover()"
```

Property values with defined semantics handle clearing. Examples include
`none`, `transparent`, `initial`, or `unset` where supported. Empty
parentheses do not mean deletion.

### CSS-aware parser

The parser cannot split on colons, whitespace, commas, slashes, or
parentheses. All appear in valid CSS values:

```tsx
background="linear-gradient(to right, red 0%, blue 100%)"
shadow="0 2px 8px rgb(0 0 0 / 20%) :hover(0 4px 16px rgb(0 0 0 / 30%))"
backgroundImage="url(https://example.com/a:b)"
width="calc(100% - var(--sidebar-width))"
fontFamily="'IBM Plex Sans', sans-serif"
```

Parsing follows CSS component-value rules:

1. Track balanced functions, blocks, strings, URLs, and escapes.
2. Preserve whitespace inside property values.
3. Recognize a clause only at the top level.
4. Require `:<registered-condition>(` before interpreting text as a clause.
5. Validate the payload according to the owning style property.

The compiler and runtime parser share one implementation and one test corpus.

### Conditions

Conditions form one registry assembled from built-ins and Tamagui config.

Initial categories:

- state: `hover`, `press`, `active`, `focus`, `focusVisible`,
  `focusWithin`, `disabled`, `checked`, `selected`, `open`, `invalid`;
- themes: `light`, `dark`, and configured theme conditions;
- media: configured media names;
- platform: `web`, `native`, `ios`, and `android`;
- group and container conditions.

Simple conditions use bare registered names:

```tsx
opacity="1 :disabled(0.5)"
display="flex :sm(grid)"
bg="$surface :dark($surfaceDark)"
```

Conditions compose as an AND chain:

```tsx
bg="$surface :dark:hover($surfaceDarkHover)"
```

Parameterized group or container conditions need one canonical form. The
current proposed spelling is:

```tsx
bg="$surface :group[card]:hover($surfaceHover)"
```

There is one global condition namespace. Duplicate configured names are
reported when the config is created. The implementation must not silently
choose between a theme, media, platform, or state condition with the same
name.

Exact theme matching semantics must reuse Tamagui's established theme
inheritance rules. The flat syntax must not invent a second definition of
whether a parent theme condition matches a child theme.

### Ordering and replacement

Within one property program, clauses are evaluated left to right. The last
matching clause wins:

```tsx
bg="$red :hover($green) :dark($gray) :dark:hover($blue)"
```

When dark mode and hover are active, `$blue` wins.

A later property contribution replaces the entire earlier property program.
It does not recursively merge clauses:

```tsx
const Card = styled(View, {
  bg: '$surface :hover($surfaceHover)',

  variants: {
    danger: {
      true: {
        bg: '$red',
      },
    },
  },
})
```

The `danger` variant removes the earlier hover behavior. Preserving a
conditional behavior requires restating the complete property program:

```tsx
bg="$red :hover($redHover)"
```

This atomic property replacement is intentional. It makes component props,
variants, spreads, and overrides predictable without recursive object merging.

### Web lowering

Ordinary independent atomic classes cannot represent authored clause order.
The order of class names in HTML does not control the CSS cascade, and selector
specificity can override source order.

The compiler therefore lowers a complete property program together. One
possible output is a hash shared by identical property programs:

```css
._bg_ab12 {
  background: var(--red);
}

._bg_ab12:where(:hover) {
  background: var(--green);
}

:where(.dark) ._bg_ab12 {
  background: var(--gray);
}

:where(.dark) ._bg_ab12:where(:hover) {
  background: var(--blue);
}
```

Requirements:

- all clauses for one property program have equal effective specificity;
- emitted rule order preserves the program order;
- identical property programs deduplicate;
- the hash includes the property, program, and relevant config identity;
- server and client hashing is deterministic;
- native evaluation uses the same last-matching-clause rule.

The exact CSS encoding may differ, but these semantics are fixed.

### Tokens and opacity

Tamagui tokens keep `$`:

```tsx
bg="$green"
```

Real CSS custom properties retain CSS syntax:

```tsx
bg="var(--green)"
```

Bare `--green` is not the token syntax. In CSS, `--green` names a custom
property declaration and is not itself a value. Keeping `$` makes the
cross-platform Tamagui token distinct from a web-only CSS variable.

Color-token opacity uses:

```tsx
bg="$green/50"
```

Initial rule:

- the suffix is an integer percentage from 0 through 100;
- it is recognized only directly after a color token;
- applying it to a non-color token is a compiler diagnostic;
- token alpha composition must behave identically on web and native.

### Non-string values

Unconditional values keep their natural representation:

```tsx
opacity={0.5}
zIndex={2}
```

Conditional values use a string program:

```tsx
opacity="0.5 :hover(1)"
zIndex="2 :focus(3)"
```

The v4 direction prefers CSS-shaped strings for structured styles:

```tsx
transform="scale(1) :hover(scale(1.05))"
boxShadow="0 2px 8px #0003 :hover(0 4px 16px #0004)"
```

React Native object and array values that lack a faithful CSS-shaped
replacement require an explicit migration table. Legacy structured values
must not be converted by guesswork.

### Dynamic programs

Literal programs compile completely:

```tsx
bg="$surface :hover($surfaceHover)"
```

Dynamic programs require the shared runtime parser unless the surrounding
entrypoint is compile-only:

```tsx
bg={`${base} :hover(${hover})`}
```

Runtime parsing is cached by property, program, and config. Dynamic values
receive the same validation and injection protections as existing dynamic
styles.

Standalone DOM is compile-only and reports dynamic structures that cannot be
lowered safely. Existing regular Tamagui components remain runtime-correct
during the v3 migration. Whether ordinary v4 components require compilation
is a separate release-level decision.

### Types and tooling

The full grammar must not be modeled as a recursive TypeScript template
literal union. That would recreate the styled type-performance problem.

The public property type remains broad:

```ts
type ConditionalStyleValue<T> = T | (string & {})
```

Validation belongs in:

- compiler diagnostics;
- config validation;
- an editor language service;
- a formatter that emits the canonical spaced form;
- development-only diagnostics for runtime-parsed values.

TypeScript may provide lightweight token or condition suggestions, but type
performance takes priority over exhaustive validation.

## Relationship to Tailwind

The inline conditional language and Tailwind lower into the same ordered IR:

```tsx
// regular Tamagui
bg="$red :hover($green) :dark:hover($blue)"

// Tailwind Tamagui
className="bg-red hover:bg-green dark:hover:bg-blue"
```

Both become:

```ts
[
  { property: 'backgroundColor', when: [], value: '$red' },
  { property: 'backgroundColor', when: ['hover'], value: '$green' },
  { property: 'backgroundColor', when: ['dark', 'hover'], value: '$blue' },
]
```

Shared internals include:

- property and shorthand normalization;
- token and opacity parsing;
- condition registration and validation;
- ordered contribution resolution;
- target capability diagnostics;
- web and native emission.

The two public syntaxes do not import one another.

## Tailwind merging

`tailwind-merge` is removed completely.

For Tamagui-owned candidates:

```tsx
<View className="p-2 p-4" />
```

The Tailwind frontend emits ordered contributions. Tamagui's resolver makes
the later padding contribution win.

Unknown classes are preserved for official Tailwind on web:

```tsx
<View className="grid-cols-2 grid-cols-3" />
```

Tamagui does not attempt to merge candidates it does not own. Applications
that dynamically compose unknown Tailwind utilities can install and call
`tailwind-merge` themselves. It is never a dependency of core or
`@tamagui/tailwind`.

`@tamagui/tailwind/vite` owns:

- official Tailwind scanning;
- passthrough candidate compilation;
- CSS layer ordering;
- filtering Tamagui-owned candidates;
- Tailwind build dependencies.

## Tamagui DOM contract

### Why Tamagui owns it

Wrapping official React Strict DOM would combine two component and style
runtimes.

Official RSD currently owns:

- StyleX compilation and style merging;
- native media queries, pseudo states, transitions, variables, and inherited
  styles;
- View/Text selection and text-child wrapping;
- accessibility and event translation;
- block-flow emulation;
- ref and DOM API adaptation.

Tamagui already owns equivalents for much of this. A wrapper would also have
to reconcile:

- RSD's StyleX-only `style` contract;
- RSD's rejection of `className`;
- Tamagui's optimized class output;
- both Babel/compiler transforms;
- duplicate native state and style processing;
- RSD's React Native version requirements.

Official RSD remains useful as:

- the semantic reference;
- a pinned prop, element, style, and native-compatibility matrix;
- a source of conformance fixtures;
- a comparison oracle for web output and supported behavior.

It is not a production dependency.

### Elements and props

The first complete target is the same 49 `html.*` elements exposed by RSD,
with explicit element-specific prop interfaces.

The strict contract targets:

- approximately 145 named RSD props plus `data-*`;
- all supported non-deprecated ARIA props;
- RSD's element-specific anchor, button, image, input, label, list, select,
  textarea, and related contracts;
- RSD's event policy;
- a documented web and native compatibility table.

RSD deliberately excludes capture-phase JSX event props. DOM mode follows that
strict contract. Capture listeners require the underlying event target API
where the target supports it.

Ordinary Tamagui components may expose a broader web-only prop surface. Those
props carry clear `@platform web` JSDoc and do not weaken strict DOM mode.

The initial web-only prop gap found in regular Tamagui included:

- `onAuxClick`;
- `onFocusIn` and `onFocusOut`;
- `onFullscreenChange` and `onFullscreenError`;
- `onGotPointerCapture` and `onLostPointerCapture`;
- `onPointerEnter` and `onPointerLeave`;
- `onPointerOut` and `onPointerOver`;
- requested capture handlers such as `onKeyDownCapture` and
  `onWheelCapture`.

The regular component expansion should use explicit generated or curated
interfaces. Intersecting every Tamagui component with React's complete
`HTMLAttributes` is rejected until a type-performance benchmark proves it
safe.

### Styles

The July 2026 comparison found:

| Surface | Concrete style keys |
|---|---:|
| Official RSD | 148 |
| Tamagui View on web | 244 |
| Tamagui Text on web | 263 |
| Tamagui View on native | 187 |
| Tamagui Text on native | 202 |

At that snapshot, Tamagui covered 139 of RSD's 148 style names on web and 131
on native. Some apparent gaps were API-shape differences:

- RSD uses raw transition properties while Tamagui uses animation drivers and
  `transition`;
- RSD uses conditional objects while existing Tamagui uses pseudo-style
  objects;
- RSD treats `pointerEvents` as a style while Tamagui exposes it as a prop.

The flat conditional-value syntax brings Tamagui closer to RSD's
property-centered model without adopting StyleX handles as the regular
Tamagui authoring syntax.

Native cannot promise every CSS behavior. Known difficult areas include:

- grid and general inline layout;
- fixed and sticky positioning;
- `calc()` and `clamp()` where React Native cannot evaluate them;
- list markers and browser form behavior;
- some transition and animation properties;
- DOM inheritance and custom-property behavior;
- mixed dynamic Text/View children.

Unsupported behavior gets a compile diagnostic. DOM mode does not silently
invent an approximation.

### Native tag lowering

Tags are classified at compile time as View-backed, Text-backed, interactive,
media, input, or unsupported.

The compiler:

1. Recognizes imported `html.tag` bindings using module provenance.
2. Supports JSX, compiled `jsx`/`jsxs`, and `createElement` forms through the
   shared element IR.
3. Injects only the native DOM primitives used by the file.
4. Maps supported attributes and events.
5. Wraps direct literal string and number children of View-backed tags at
   compile time.
6. Reports statically knowable invalid Text/View nesting.
7. Reports unsupported tags, props, styles, and structures.

The runtime does not scan resolved children to rescue dynamic strings.
Dynamic children retain normal React Native constraints and errors.

Native primitives own only behavior that cannot be erased:

- DOM block and flex defaults;
- dynamic inherited text styles;
- accessibility and event adapters;
- anchor and button behavior;
- image, input, textarea, and select host behavior where supported;
- development diagnostics requiring runtime knowledge.

### Refs and events

DOM-shaped refs and events exceed React Native host capabilities in places.
The contract is the proven subset, documented per tag and platform.

V1 does not promise:

- a complete `HTMLElement` implementation;
- browser form submission on native;
- download behavior;
- file inputs;
- exact DOM bubbling for every event;
- browser dialogs;
- all ARIA relationships on native.

Compatibility expands only through concrete fixtures and conformance tests.

## Compiler contract

Import provenance selects the frontend:

| Binding source | Compiler interpretation |
|---|---|
| `tamagui`, `@tamagui/core` | DOM plus regular Tamagui props |
| `@tamagui/tailwind` | DOM plus Tailwind candidates |
| `tamagui/dom`, `@tamagui/core/dom` | DOM plus `style()` handles |

All lower to:

```text
typed html element
→ validate tag, props, styles, and nesting
→ classify native backing primitive
→ normalize ordered property programs
→ emit target output
```

Example:

```tsx
<html.main p="$4">Hello</html.main>
```

Approximate web output:

```tsx
<main className="_p4">Hello</main>
```

Approximate native output:

```tsx
<DOMView style={styles.p4}>
  <DOMText>Hello</DOMText>
</DOMView>
```

Rules:

- any `html.*` usage requires the DOM compiler;
- the compiler cannot bail to an untransformed DOM runtime;
- a missing compiler produces an explicit development or build failure;
- published libraries using DOM mode must be precompiled or included in
  dependency compilation;
- literal text wrapping happens at compile time;
- unsupported native semantics produce actionable diagnostics;
- ordinary `View` and `Text` retain their established runtime path.

`@tamagui/tailwind` is also compiler-led. It does not ship the Tailwind parser
inside every rendered component. Dynamic class values require a statically
bounded compiler representation or a documented Tailwind-package runtime
cost. Core never pays that cost.

## Package and export boundaries

Conceptual exports:

```json
{
  "tamagui": {
    ".": "regular Tamagui plus html",
    "./dom": "standalone DOM plus style()"
  },
  "@tamagui/core": {
    ".": "regular Tamagui plus html",
    "./dom": "standalone DOM plus style()",
    "./internal-runtime": "private shared implementation boundary"
  },
  "@tamagui/tailwind": {
    ".": "Tailwind Tamagui plus html",
    "./vite": "Tailwind build integration"
  }
}
```

`@tamagui/core/internal-runtime` is implementation plumbing, not another user
package. Its exact name is not public API unless package tooling requires an
export.

Barrels must not reconnect the frontend graphs. Runtime exports and type
exports require separate bundle and declaration checks.

## Type architecture

### Regular core

Core keeps its regular component prop graph and removes global styling-mode
branches.

Flat conditional values add a broad string alternative to each style
property. They do not create recursive condition object types or exhaustive
template literal unions.

### Tailwind

Tailwind components expose normal component behavior plus:

```ts
type TailwindStyleProps = {
  className?: string
}
```

Their style types do not instantiate the regular Tamagui shorthand, pseudo,
media, theme, and variant prop graph.

### Standalone DOM

```ts
type DOMProps = StrictHTMLProps & {
  style?: CompiledStyle | readonly ConditionalCompiledStyle[]
}
```

CSS property checking happens at the `style()` call. It is not intersected
into every JSX tag.

### Generated strict DOM props

Generate explicit interfaces from a checked-in semantic table. The generated
surface must:

- preserve element-specific props;
- add all agreed ARIA and `data-*` support;
- omit unsupported and capture-phase JSX props from strict DOM;
- carry platform JSDoc where behavior differs;
- avoid importing React's complete `HTMLAttributes` into every component.

Type performance is an acceptance criterion, not a post-implementation cleanup.

## Bundle evidence and budgets

### Historical probes

The July 2026 probes used tiny minified production bundles with React and
React Native externalized. Browser export conditions were used for web, and
the module graph was checked for `.native` files.

Corrected `View` results:

| Configuration | Web gzip |
|---|---:|
| main `@tamagui/web` | 24.3 KB |
| v3-beta as shipped | 43.9 KB |
| v3-beta with `tailwind-merge` externalized | 35.6 KB |
| v3-beta with `tailwind-merge` and style grammar externalized | 31.5 KB |

The v3-beta browser bundle contained zero `.native` modules. It did contain
the Tailwind pipeline even when Tailwind mode was disabled at runtime.

Measured contributors:

- `tailwind-merge`: about 8.3 KB gzip;
- shared style grammar: about 4.1 KB gzip before the parser embedded in
  `getSplitStyles`;
- v3-beta total cost over main: about 19.6 KB gzip.

The expected v3-beta result after fully removing Tailwind from core was
approximately 25 to 30 KB gzip.

The same probe, with StyleX externalized, measured official RSD `html.div` at
about 3.4 KB gzip on web and 15.8 KB on native. Those numbers describe RSD
glue rather than the complete StyleX requirement.

Current `styledHtml` added about 1 KB gzip to an existing Tamagui graph.
Layering official RSD on Tamagui added roughly 3.3 KB on web and 15.4 KB on
native in that probe, while also duplicating runtime responsibilities.

These measurements are comparison evidence, not permanent budgets. The final
implementation gets fresh repeatable probes.

### Bundle gates

Required gates:

- core `View` contains zero Tailwind grammar, parser, merger, or build modules;
- Tailwind `View` contains zero regular inline-style frontend modules;
- standalone DOM contains neither frontend;
- compiled DOM web output has effectively zero general style runtime;
- DOM native includes only primitives required by the tags used;
- root and type barrels do not reconnect isolated graphs;
- no `.native` modules enter a browser-conditioned probe;
- no StyleX or React Strict DOM code enters production bundles.

Initial targets:

- regular core returns to the 25 to 30 KB gzip range in the established probe;
- compiled DOM adds less than 2 KB gzip on web to an existing Tamagui app;
- compiled DOM adds less than 8 KB gzip on native before app-used semantic
  primitives;
- any miss triggers a design review rather than silently raising the budget.

## Migration

### Inline to Tailwind

Package imports define the mode:

```tsx
import { View as InlineView } from '@tamagui/core'
import { View as TailwindView } from '@tamagui/tailwind'
```

Both use the same provider and config:

```tsx
const config = createTamagui({
  tokens,
  themes,
  media,
})
```

Migration:

1. Add `@tamagui/tailwind`.
2. Keep existing components unchanged.
3. Convert one component or file.
4. Switch that file's component imports to `@tamagui/tailwind`.
5. Continue until the intended surface is converted.
6. Remove temporary mixed imports.

There is no global switch and no combined mode.

### Conditional objects to flat values

V3 introduces an explicit opt-in. The opt-in applies coherently to a package
or compiler configuration so a component does not have two competing
condition systems.

Examples:

```tsx
// existing
<View
  bg="$surface"
  hoverStyle={{ bg: '$surfaceHover' }}
  $theme-dark={{ bg: '$surfaceDark' }}
/>

// flat values
<View
  bg="$surface :hover($surfaceHover) :dark($surfaceDark)"
/>
```

The codemod can convert statically local cases. It must report cases where:

- base and conditional values are spread from different objects;
- variants partially modify an inherited property program;
- computed property names hide the affected property;
- dynamic theme, platform, media, or group objects cannot be resolved;
- structured React Native values lack a CSS-shaped equivalent.

V3 documentation marks conditional objects as legacy after the new syntax is
proven. V4 plans to make flat values the canonical syntax and remove the old
condition object path on a release schedule with a codemod and diagnostics.

### DOM adoption

Existing `View` and `Text` code does not need to migrate.

DOM adoption is explicit:

```tsx
import { html } from 'tamagui'
```

Libraries that publish `html.*` source either publish compiled output or
declare that consumers must compile the dependency.

## Implementation sequence

### Phase 1: lock the shared IR

1. Define the property/condition/value IR.
2. Implement the CSS-aware conditional-value parser.
3. Define the condition registry and duplicate-name diagnostics.
4. Prove identical ordering on web and native.
5. Add parser fuzz cases for CSS punctuation, nesting, strings, URLs, and
   escapes.

### Phase 2: isolate Tailwind

1. Remove global `styleMode` from public types and runtime branches.
2. Extract the narrow shared runtime entry.
3. Restore core `getSplitStyles` to regular Tamagui responsibilities.
4. Move candidate parsing into `@tamagui/tailwind`.
5. Remove `tailwind-merge`.
6. Move Vite and official Tailwind integration to
   `@tamagui/tailwind/vite`.
7. Add graph and type-entry isolation tests.

### Phase 3: prove DOM lowering

1. Add member-expression recognition for imported `html.div`.
2. Prove JSX, `jsx`/`jsxs`, and `createElement` normalization.
3. Rewrite a web fixture to literal semantic tags.
4. Rewrite a native fixture to placeholder DOM primitives.
5. Wrap direct literal text at compile time.
6. Prove one unsupported prop and one invalid-nesting diagnostic.
7. Verify no RSD or StyleX code enters either bundle.

### Phase 4: implement the DOM contract

1. Check in the tag, attribute, event, native-backing, and compatibility
   tables.
2. Generate explicit prop interfaces.
3. Implement the minimum native semantic primitives.
4. Expose regular-Tamagui `html` from core.
5. Expose Tailwind `html` from `@tamagui/tailwind`.
6. Add `tamagui/dom` and `@tamagui/core/dom`.
7. Implement `style()` on the same style grammar as `styled()`.
8. Add missing-compiler failures.

### Phase 5: introduce flat values

1. Add the v3 opt-in.
2. Parse and lower literal conditional programs.
3. Cache runtime parsing for regular Tamagui migration cases.
4. Add compiler diagnostics and canonical formatting.
5. Build the static codemod.
6. Migrate representative internal components.
7. Measure type, runtime, CSS, and bundle effects.

### Phase 6: prepare v4

1. Publish the conditional-object deprecation schedule.
2. Finish structured native value migration rules.
3. Remove old recursive condition paths after repository migration.
4. Make flat conditional values canonical.
5. Re-run all prop, style, DOM, bundle, and type conformance gates.

## Validation

### Compiler

- source and transformed-output fixtures for every frontend and target;
- execution tests for transformed web and native fixtures;
- import-provenance tests that reject unrelated `html` objects;
- dependency-compilation and missing-compiler tests;
- deterministic server/client hash tests;
- negative tests for unsupported native semantics.

### Flat values

- CSS component values containing colons, spaces, commas, slashes, strings,
  URLs, functions, and nested parentheses;
- chained conditions;
- condition namespace collisions;
- last-matching-clause behavior;
- whole-property replacement through styled bases, variants, and JSX props;
- web and native parity;
- color token opacity and invalid non-color opacity;
- dynamic parsing cache behavior;
- hostile dynamic values cannot inject selectors or rules.

### DOM

One shared source fixture covers:

- semantic structure, headings, and text;
- direct literal text inside a View-backed tag;
- dynamic invalid text remaining an error;
- theme and inherited text styles;
- button and anchor interaction;
- image accessibility;
- input, textarea, and select behavior where supported;
- focus, keyboard, pointer, and accessibility events;
- refs within the documented subset;
- an unsupported feature diagnostic.

Compare supported behavior with a pinned official RSD fixture. Differences are
recorded in the compatibility table.

### Types

- element-specific positive and negative tests;
- ARIA and `data-*` coverage;
- strict rejection of capture-phase JSX props in DOM mode;
- regular Tamagui web-only props with platform JSDoc;
- Tailwind components do not instantiate regular inline style types;
- standalone DOM checks style properties at `style()`;
- declaration emit size and TypeScript diagnostic-time baselines.

### Bundles

Repeat the established minified gzip probes for:

- core `View`;
- Tailwind `View`;
- regular core `html.div`;
- Tailwind `html.div`;
- standalone DOM `html.div` plus one `style()` handle;
- native equivalents;
- combined imports to measure incremental cost.

Record module graphs with every number.

## Explicit exclusions

- no React Strict DOM runtime dependency;
- no StyleX runtime or StyleX compiled-object protocol;
- no promise of drop-in compatibility for third-party RSD packages in v1;
- no `@tamagui/inline`;
- no combined inline-and-Tailwind mode;
- no global style-mode switch;
- no `tailwind-merge` dependency;
- no runtime child scan that rescues dynamic strings;
- no silent native approximation for unsupported DOM or CSS behavior;
- no exhaustive conditional grammar encoded in TypeScript;
- no dual `$token` and `--token` syntax;
- no public `strict-dom` product or entrypoint name.

## Remaining design work

These decisions need focused prototypes before implementation is considered
locked:

1. The exact group and container condition spelling.
2. The complete built-in condition list and collision policy for common
   configs.
3. How `style()` conditionally composes multiple handles while preserving
   whole-property replacement.
4. The structured React Native value migration table.
5. The minimum native DOM ref API.
6. The exact dependency-precompilation metadata and error experience.
7. Whether ordinary regular Tamagui requires compilation in v4.

Each prototype must end with one chosen path. The implementation must not ship
multiple equivalent syntaxes or runtime fallback paths.

## References

- [React Strict DOM common props](https://facebook.github.io/react-strict-dom/api/html/common/)
- [React Strict DOM HTML compatibility](https://facebook.github.io/react-strict-dom/api/html/)
- [React Strict DOM CSS compatibility](https://facebook.github.io/react-strict-dom/api/css/)
- [React Strict DOM component guide](https://facebook.github.io/react-strict-dom/learn/components/)
- [Tailwind state variants](https://tailwindcss.com/docs/hover-focus-and-other-states)
- [CSS Syntax Module Level 3](https://www.w3.org/TR/css-syntax-3/)
- `styledHtml` introduction: commit `ab8517c5e4`
