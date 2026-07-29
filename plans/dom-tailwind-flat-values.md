# Tamagui DOM, Tailwind, and flat conditional values

## Status

Design plan, July 2026. Revised 2026-07-29: universal value grammar (colon
clause detection over CSS component values), per-longhand program merging,
value variables, migration compat setting, and the compiled static fast path.
This consolidates the current direction for:

- regular Tamagui and its future inline style syntax;
- the separate `@tamagui/tailwind` frontend;
- Tamagui-owned DOM components aligned with React Strict DOM;
- the standalone `tamagui/dom` entry;
- compiler, runtime, type, bundle, and migration boundaries.

The design is intentionally compiler-led. V2 applications receive an explicit
V3 codemod, while DOM and Tailwind authoring get strict package and compiler
boundaries.

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
12. Conditional styling moves into individual property values in v3. The
    property supplies the utility family. Values use one universal grammar for
    every property: a CSS-shaped base plus top-level `modifier:` clauses.
    Modifier spellings match Tailwind exactly.
13. The new flat value grammar does not use `$`. The V3 migration codemod
    removes it from statically known token values. Raw numeric JSX values keep
    their existing pixel behavior.
14. In v3, `bg` stops being a fixed alias for `backgroundColor` and becomes the
    complete background candidate family. A resolved color candidate still
    writes only `backgroundColor`; it does not lower blindly to the resetting
    CSS `background` shorthand.
15. Built-in names in the V6 default config use kebab-case wherever a name has
    multiple parts. The flat authoring syntax uses those names without `$`.
16. Group variants use Tailwind's exact modifier spelling: `group-hover:` for
    an unnamed group and `group-hover/card:` for a named group.
17. Groups and query containers are independent. `group` exposes parent state
    and does not establish a size container. On regular Tamagui components,
    boolean `container` is the shorthand for an unnamed
    `containerType="inline-size"` container. Named and full-size containers use
    `containerName` and `containerType`.
18. Plain responsive modifiers such as `sm:` are viewport media queries. The
    `@` prefix is reserved for container queries: `@sm:` targets the nearest
    container and `@sm/card:` targets a named container.
19. Style prop values need no bracket or underscore escaping. A top-level
    colon is never valid inside a CSS value, so conditional clauses are
    detectable unambiguously and the base/payload segments are plain CSS
    component values. Bracketed arbitrary values belong to the Tailwind
    className frontend only, where class names cannot contain spaces.
20. Identifiers inside values resolve config-first: a configured
    token/variable name wins, otherwise the identifier is literal CSS.
    CSS-wide keywords are reserved and cannot be configured names.
21. Merging preserves the v1 model, generalized from values to programs. A
    prop's value expands to one program per contributed CSS longhand; a later
    contribution to the same longhand replaces that whole program. Clause-level
    deep merging never happens.
22. Configured variables may hold composite values (a full box-shadow list),
    parsed at config time by the same value parser. A variable covers one
    property's value; multi-property presets remain variants and `styled()`.
23. V3 ships a `legacyConditionObjects` compatibility setting. Old condition
    objects parse into the same IR with a development warning. The setting
    gates input parsing only, and v4 removes it together with the old parsers.
24. When every contribution is statically known, the compiler emits a plain
    element and skips the runtime component path entirely. Closing the
    rendering-cost gap to plain CSS is a stated deliverable of the flat-value
    work, not an optimization afterthought.

## Product shape

### Regular Tamagui

```tsx
import { View, Text, html, styled } from 'tamagui'

const Card = styled(View, {
  p: '4',
  bg: 'surface hover:surface-hover',
})

export function Example() {
  return (
    <html.main p="4">
      <html.h1 color="color">Account</html.h1>
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

The V3 style direction changes how conditions are written, while the package
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
  backgroundColor: 'surface hover:surface-hover',
})

const heading = style({
  color: 'color',
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
<html.div p="4" bg="surface hover:surface-hover" />

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

## Web-aligned transitions

V3 should align timing-transition authoring with the CSS `transition` shorthand
and its five longhands:

- `transitionProperty`;
- `transitionDuration`;
- `transitionTimingFunction`;
- `transitionDelay`;
- `transitionBehavior`.

The leading shorthand direction is:

```tsx
// CSS defaults fill in property=all, timing=ease, delay=0s, behavior=normal
transition="200ms"

// complete CSS shorthand, including per-property transitions
transition="opacity 150ms ease-out, transform 250ms cubic-bezier(0.2, 0, 0, 1) 50ms"
```

The expanded form uses the real web longhands rather than a second
Tamagui-specific object:

```tsx
transitionProperty="opacity, transform"
transitionDuration="150ms, 250ms"
transitionTimingFunction="ease-out, cubic-bezier(0.2, 0, 0, 1)"
transitionDelay="0ms, 50ms"
transitionBehavior="normal"
```

Configured animation-driver presets remain useful for springs and shared
product motion:

```tsx
transition="quick"
transition="bouncy"
```

Preset resolution is the universal config-first identifier rule, not a
transition-specific mechanism: an exact single identifier matching a
configured animation key is a preset. Every other string follows the CSS
transition grammar. CSS global values and reserved transition keywords cannot
be animation preset names. Duration-shaped values such as `200ms` always use
CSS semantics, even if a legacy config has a same-named preset. The V3 codemod
must rename or expand a colliding preset when its configured easing differs
from the CSS default.

Both forms lower into one transition IR containing property, duration, timing
function, delay, and behavior. The CSS driver serializes that IR without
changing supported web semantics. Native timing drivers translate supported
durations and easing functions. Spring presets remain driver configuration
rather than pretending to be CSS.

Native does not silently approximate unsupported web behavior. Examples that
need capability diagnostics include unsupported properties, `steps()`, and
`allow-discrete`. The native capability table and the migration of the existing
array and per-property preset object forms require a focused prototype before
the V3 contract is locked.

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

### The universal value grammar

Every style prop value parses with one grammar:

```txt
value  := base? clause*
clause := modifier (":" modifier)* ":" payload
```

`base` and `payload` are ordinary CSS component-value sequences: spaces,
commas, functions, strings, and slashes are all legal. The parser recognizes a
clause boundary only at a top-level `modifier:` (or `@modifier:`) chain. This
is unambiguous because a top-level colon is never valid inside a CSS value;
colons only occur inside strings, `url()`, and function parentheses. No
bracket or underscore escaping exists in this frontend:

```tsx
<View
  p="4 sm:6"
  bg="red-500 hover:blue-500 dark:hover:blue-700"
  w="full md:42rem"
  boxShadow="0 2px 8px #0003 hover:0 4px 16px #0004, 0 0 2px red"
  transform="scale(1) hover:scale(1.05)"
/>

<View bg="linear-gradient(135deg, red, blue) hover:linear-gradient(135deg, pink, cyan)" />
```

A payload extends until the next top-level modifier chain. Because valid CSS
cannot contain a bare top-level colon, an unregistered modifier such as
`hver:` is a hard parse error, never silent passthrough.

Parsing follows CSS component-value rules: track balanced functions, blocks,
strings, URLs, and escapes; preserve whitespace inside base and payload;
recognize modifiers only at the top level. An empty payload is a parse error;
clearing uses property values with defined semantics (`none`, `transparent`,
`initial`, `unset` where supported). The compiler and the runtime share one
parser implementation and one test corpus.

Identifiers resolve config-first: an identifier or number token that names a
configured token or variable resolves through the config; anything else is
literal CSS, exactly as bare `bg="red"` has worked since v1. Removing `$`
changes the lookup from prefixed to config-first, not the model. Two rules
keep resolution deterministic:

- CSS-wide keywords (`inherit`, `initial`, `unset`, `revert`, `none`, `auto`,
  `transparent`, `currentColor`) are reserved: configuring a token with one of
  these names is a config-time error.
- A configured name always wins over a same-spelled CSS literal. Config
  creation warns when a token shadows a property-relevant CSS keyword.

The prop binds the candidate family before resolution, so values share the
modifier registry, token resolution, family tables, and ordered style IR with
`@tamagui/tailwind`. The two frontends deliberately differ in value spelling:
className values cannot contain spaces, so the Tailwind frontend keeps
Tailwind's bracket-and-underscore arbitrary-value rules
(`shadow-[0_2px_8px_#0003]`), while this frontend takes plain CSS.

Group state uses Tailwind's modifier grammar unchanged. A group exposes parent
state and does not make the parent a size container:

```tsx
// unnamed group
<View group>
  <Text color="muted group-hover:foreground" />
</View>

// named group
<View group="card">
  <Text color="muted group-hover/card:foreground" />
</View>
```

The equivalent Tailwind frontend marks the named parent with `group/card` and
uses the same `group-hover/card:` modifier on descendants. Tamagui-specific
native states extend the same shape, for example `group-press/card:`. Variants
remain stackable, such as `sm:dark:group-hover/card:foreground`.

Viewport and container conditions have different spellings:

```tsx
// viewport sm plus card hover
color="muted sm:group-hover/card:foreground"

// nearest container sm plus parent hover
color="muted @sm:group-hover:foreground"

// named layout container sm plus named card group hover
color="muted @sm/layout:group-hover/card:foreground"
```

The `@` prefix does not mean media in general. Tailwind uses ordinary `sm:`,
`md:`, and related modifiers for viewport media. Only container query variants
use `@sm:`, `@md:`, `@max-md:`, and their named forms.

The parent capabilities are explicit and can be combined on one element:

```tsx
// regular Tamagui
<View group="card" container />

// Tailwind Tamagui
<View className="group/card @container" />
```

On regular Tamagui base components, `container` is boolean-only:

```tsx
// nearest unnamed inline-size container
<View container />

// named inline-size container
<View container containerName="layout" />

// named container that queries both axes
<View containerName="layout" containerType="size" />
```

`container` lowers to `containerType="inline-size"` and does not create a
container name. An explicit `containerType` replaces the shorthand and cannot
be supplied together with `container`. `containerType="size"` corresponds to
Tailwind's `@container-size`; adding `containerName="layout"` corresponds to
the `/layout` modifier.

The boolean shorthand belongs only to regular Tamagui components. Tailwind
Tamagui uses `@container`, and standalone `style()` retains the actual CSS
`container`, `containerName`, and `containerType` properties. Native treats the
regular props as semantic query-container configuration.

This changes current Tamagui behavior, where `group="card"` also emits
`container-name: card` and defaults `container-type` to `inline-size`. V3
removes that coupling so hover-only groups do not pay container setup or native
measurement costs.

Raw CSS needs no escape hatch in this frontend: `w="117px md:344px"` and full
gradient values are plain values under the universal grammar. Bracketed
arbitrary values (`w-[117px]`, `bg-[linear-gradient(...)]`) remain the escape
hatch of the Tailwind className frontend, where whitespace cannot appear
inside a class. CSS custom properties keep CSS syntax:
`bg="var(--my-background)"`.

Raw JSX numbers remain raw platform values, including the existing numeric
pixel behavior:

```tsx
p={16}
w={117}
```

A numeric string resolves config-first, so `p="4"` resolves the configured `4`
token while `p={4}` stays 4 pixels. That quoted-versus-raw distinction is a
documented rule and a lint-rule target, since on the aligned v6 config the two
differ by 4x. Conditional raw values are plain CSS lengths, for example
`p="4 hover:18px"`.

### Conditions

Modifiers form one registry assembled from built-ins and Tamagui config:

- state: `hover:`, `press:`, `focus:`, `focus-visible:`, `focus-within:`,
  `disabled:`, `checked:`, `selected:`, `open:`, `invalid:`, plus `enter:`
  and `exit:` for presence;
- themes: `dark:`, `light:`, and configured theme conditions;
- media: configured media names such as `sm:`;
- platform: `web:`, `native:`, `ios:`, `android:`;
- group and container modifiers as specified above.

Modifiers chain as an AND: `dark:hover:blue-500` applies when both hold.

There is one global condition namespace. Duplicate configured names are
reported when the config is created; the implementation must not silently
choose between a theme, media, platform, or state condition sharing a name.
Theme modifiers reuse Tamagui's established theme inheritance rules for
matching. The flat syntax does not invent a second definition of whether a
parent theme condition matches a child theme.

### Color opacity

Color values take a slash opacity suffix, matching Tailwind:

```tsx
bg="green/50 hover:green/80"
```

Rules:

- the suffix is an integer percentage from 0 through 100;
- it is recognized only directly after a resolved color token;
- applying it to a non-color token is a compiler diagnostic;
- token alpha composition must behave identically on web and native.

### Non-string and dynamic values

Unconditional values keep their natural representation (`opacity={0.5}`,
`zIndex={2}`); conditional values use a string program
(`opacity="0.5 disabled:0.4 hover:1"`). React Native object and array values
that lack a faithful CSS-shaped replacement require the explicit migration
table; legacy structured values are never converted by guesswork.

Literal programs compile completely. Dynamic programs built from template
strings use the shared runtime parser unless the surrounding entrypoint is
compile-only. Runtime parsing is cached by property, program, and config, and
dynamic values receive the same validation and injection protections as
existing dynamic styles. Standalone DOM is compile-only and reports dynamic
structures that cannot be lowered safely.

### V6 candidate naming

The Tailwind-derived V6 palette already uses kebab-case names such as
`slate-500`. The remaining inherited semantic theme and token names should
follow the same convention:

```txt
backgroundHover  -> background-hover
backgroundPress  -> background-press
borderColorHover -> border-color-hover
placeholderColor -> placeholder-color
```

This makes the same configured value read consistently in both frontends:

```tsx
// regular Tamagui
bg="background hover:background-hover"

// Tailwind Tamagui
className="bg-background hover:bg-background-hover"
```

Underlying config storage may still use `$` until the token representation is
migrated, but `$` is absent from the new flat candidate syntax. The V3 codemod
converts built-in camelCase names to their V6 kebab-case replacements.
User-defined names retain their authored spelling, with kebab-case recommended
for new configuration. The parser must not guess camelCase-to-kebab-case
aliases at runtime because two configured names could collide.

`bg` is a candidate family, not a direct alias for the CSS `background`
shorthand. The candidate resolver determines whether a value contributes
`backgroundColor`, `backgroundImage`, `backgroundPosition`, or another
background property. This avoids the reset behavior of emitting
`background: ...` for every ordinary color. Family expansion feeds the
per-longhand program model described in "Programs and merging".

Overloaded Tailwind families require property validation. For example,
`fontSize="xl"` and `color="red-500"` both bind to the `text-*` family, then
verify that the resolved candidate contributes to the property named by the
prop. A mismatched candidate is a compiler diagnostic.

The selected syntax is the universal value grammar:

```tsx
bg="red-500 hover:blue-500"
bg="linear-gradient(135deg, #f00, #00f) hover:linear-gradient(135deg, #00f, #f00)"
```

This removes `$` and uses one parser for every property. Two earlier
directions are rejected: keeping `$` in candidate atoms, and requiring
bracketed Tailwind arbitrary-value spellings inside prop values. The bracket
requirement fell to the colon observation: since clause boundaries are
detectable in plain CSS without escaping, CSS-shaped values are the one
primary spelling rather than a fallback beside a candidate grammar.

### Types and editor tooling

The candidate grammar must not become an exhaustive TypeScript template
literal union. Property types retain their existing raw value type plus a broad
string:

```ts
type FlatStyleValue<T> = T | (string & {})
```

Candidate, token, modifier, and target validation live in the compiler and a
Tamagui language service backed by the same value-grammar engine. A TypeScript
language-service plugin riding tsserver is an acceptable first delivery
vehicle before a standalone LSP server. The same engine also backs an ESLint
rule, so validation reaches lint-driven workflows (CI and agent loops) that
never see editor diagnostics. TypeScript can expose small finite unions where
they remain cheap, but type performance takes priority over exhaustive string
validation.

## Programs and merging

Merging preserves the v1 model: shorthands expand to longhands and
contributions merge forward in authored order. The flat grammar generalizes
the unit of contribution from a value to a program.

Within one program, clauses evaluate left to right and the last matching
clause wins: in `bg="red hover:green dark:gray dark:hover:blue"`, dark mode
plus hover yields `blue`.

A prop's parsed value expands into one program per resolved CSS longhand.
`bg="url(x.png) surface hover:surface-hover"` produces a `backgroundImage`
program (`url(x.png)`) and a `backgroundColor` program
(`surface hover:surface-hover`). The established forward pass then applies
unchanged, over programs:

- A later `backgroundColor="red"` replaces the `backgroundColor` program
  wholesale, hover clause included, while the `backgroundImage` program
  survives.
- A variant's `bg: 'red'` contributes a new `backgroundColor` program at its
  position in the forward pass and replaces the earlier one.
- `p="4 sm:6"` followed by `px="2"` expands to four padding longhand
  programs, and `px` replaces the left and right ones.

Replacement is always whole-program per longhand. Clause-level deep merging
never happens: preserving a base program's hover behavior under an override
requires restating the complete program. This keeps styled bases, variants,
spreads, and JSX overrides predictable.

The family expansion table, which records the longhand each kind of value
contributes to for `bg` and the other multi-property families, is the only
merge knowledge in the system, and it lives in the shared grammar package.
This is also why `tailwind-merge` is removable: for owned values, per-longhand
forward merging reproduces everything it did.

### Web lowering

Independent atomic classes cannot represent authored clause order by
themselves: HTML class order does not control the cascade, and selector
specificity can override source order. The compiler therefore lowers a
complete program together. Fixed requirements, whatever the exact CSS
encoding turns out to be:

- all clauses of one program have equal effective specificity;
- emitted rule order preserves program order;
- identical programs deduplicate through a hash covering the property,
  program, and relevant config identity;
- server and client hashing is deterministic;
- native evaluation uses the same last-matching-clause rule.

The encoding itself, across runtime insertion, streaming SSR, and code
splitting, is remaining design work item 2.

## Value variables

This is not a new system. It is the existing V3 variables system, reached
through the grammar's config-first identifier resolution: theme keys are
already CSS custom properties on web, the config declares custom variables,
the `<Variables>` primitive patches them inline per subtree, and native rides
the granular theme subscription. The grammar's identifier lookup resolves
into that one system:

```tsx
boxShadow="glow hover:glow-strong"
transition="quick"
bg="surface"
```

Tailwind v4 reaches the same idea through `@theme` namespaces (`--shadow-glow`
generating `shadow-glow`). Here the prop already supplies the family, so the
bare name is enough, and the Tailwind frontend surfaces the same configured
value as `hover:shadow-glow`.

The one extension is that a variable may hold a composite value such as a
full box-shadow list. Composite definitions are parsed at config time for
validation and to find embedded variable references (a shadow whose color is
a theme value); they are not decomposed into legacy per-part props. Web emits
nested custom properties (`--shadow-glow: 0 0 20px var(--accent)`), so theme
switches stay zero-re-render. Native passes the composed value straight
through: React Native supports `boxShadow`, `textShadow`, and
`backgroundImage` directly, and the platform resolve path already handles
them; embedded references resolve through the same granular theme
subscription as every other native value.

The themes-and-tokens-to-variables unification (remaining design work item
11) and the grammar are one design: the grammar's identifier resolution is
the variables lookup.

A variable holds one property's value. Multi-property presets (a named look
combining shadow, border, and scale) are never value-grammar expansions; they
remain variants and `styled()`. Expanding several properties from inside one
prop's program would break per-longhand merging.

## Relationship to Tailwind

Property-scoped candidates and Tailwind classes lower into the same ordered IR:

```tsx
// regular Tamagui
bg="red hover:green dark:hover:blue"

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

- core `View` contains zero className-frontend modules: no candidate-class
  parsing, no `tailwind-merge`, no Tailwind build integration. The shared
  value parser and modifier registry are core modules with their own measured
  budget, since regular Tamagui parses dynamic flat values at runtime;
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

V3 makes the flat value grammar canonical. There is one resolution engine and
one IR; during migration there are two accepted input spellings, one of them
deprecated.

The `legacyConditionObjects` setting keeps the old condition objects
(`hoverStyle`, `pressStyle`, `$theme-*`, `$platform-*`, media and group
objects) parsing into the same IR with a development warning. The setting
gates input parsing only; it never forks resolution, ordering, or output. New
apps default to off. The migration guide enables it for incremental
migration, the final codemod step turns it off, and v4 removes it together
with the old parsers. The compiler understands both spellings for as long as
the setting exists.

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
  bg="surface hover:surface-hover dark:surface-dark"
/>
```

Group migration distinguishes parent state, viewport media, and container
queries:

```tsx
// existing: group hover only
<View group="card">
  <Text $group-card-hover={{ color: '$foreground' }} />
</View>

// V3
<View group="card">
  <Text color="group-hover/card:foreground" />
</View>

// existing: nearest group container size plus hover
<View group>
  <Text $group-sm-hover={{ color: '$foreground' }} />
</View>

// V3
<View group container>
  <Text color="@sm:group-hover:foreground" />
</View>
```

The codemod adds the boolean `container` prop only when descendants use a group
size condition. Pure `$group-hover` and `$group-card-hover` cases remain
groups without containers. Existing viewport media combined with group state
becomes `sm:group-hover/card:`, without `@`.

Named legacy group-container queries preserve their name during migration:
`$group-card-sm-hover` becomes
`@sm/card:group-hover/card:foreground`, and the parent receives
`group="card" container containerName="card"`. New code should normally use
the nearest unnamed container and reserve the repeated named form for cases
that require disambiguation.

The codemod can convert statically local cases. It must report cases where:

- base and conditional values are spread from different objects;
- variants partially modify an inherited property program;
- computed property names hide the affected property;
- dynamic theme, platform, media, or group objects cannot be resolved;
- structured React Native values lack a CSS-shaped equivalent.

V3 deprecates the old condition-object path behind `legacyConditionObjects`
with a codemod and diagnostics; v4 removes it.

### Background shorthand migration

In v3, `bg` changes from an alias for `backgroundColor` to the complete
background candidate family. Ordinary color uses remain mechanically
migratable:

```tsx
// current
bg="$surface"

// exact scoped-candidate direction
bg="surface"
```

The compiler resolves each candidate to its actual background contribution. It
must not emit the CSS `background` shorthand for every value because that would
reset separately authored background image, position, size, repeat, attachment,
origin, and clip values.

The migration tool can remove `$` from statically known token values, convert
conditional objects into modifier clauses, and emit raw literals as plain CSS
values. It reports dynamic strings and spreads whose meaning cannot be
resolved locally.

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

1. Define the property/candidate/condition/value IR.
2. Implement property-scoped parsing through the shared Tailwind candidate
   engine.
3. Define the modifier registry and duplicate-name diagnostics.
4. Prove identical ordering on web and native.
5. Add parser fuzz cases for arbitrary values, CSS punctuation, nesting,
   strings, URLs, and escapes.

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

1. Implement the universal value parser: CSS component values, top-level
   clause detection, config-first identifier resolution, reserved words.
2. Implement per-longhand program expansion and the forward program merge.
3. Parse and lower literal programs; define and cache runtime parsing for
   permitted dynamic strings.
4. Land `legacyConditionObjects`, lowering the old condition objects into the
   same IR with deprecation diagnostics.
5. Make the compiler emit plain elements, skipping the runtime component
   path, when every contribution is static. Track the bailout rate on
   kitchen-sink as a standing metric; the group-workload benchmark gap is the
   target evidence.
6. Add compiler diagnostics, canonical formatting, the ESLint rule, and
   language-service completions backed by the same engine.
7. Build the static codemod for `$`, camelCase V6 built-ins, and conditional
   objects; its final step disables `legacyConditionObjects`.
8. Migrate representative internal components.
9. Measure type, runtime, CSS, and bundle effects.

### Phase 6: complete the V3 migration

1. Publish the V3 breaking-change and codemod guide.
2. Finish structured native value migration rules.
3. Remove old recursive condition paths after repository migration.
4. Align transition shorthand and longhand behavior.
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
- multi-word base and payload boundary detection against adjacent clauses;
- chained conditions;
- condition namespace collisions;
- reserved CSS-wide keywords and token-shadowing config diagnostics;
- last-matching-clause behavior;
- whole-program per-longhand replacement through styled bases, variants,
  spreads, and JSX props, including family props overridden by longhand props;
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

### Native runtime performance

Native RSD and DOM-polyfill work is sensitive to small amounts of per-element
overhead. React Strict DOM PR #512 reports roughly a five percent improvement
in its benchmark from changes that appear locally small:

- do not create or attach a callback ref when no ref was passed;
- replace stacked callback/ref hooks with one memoized callback;
- reuse default image props when no aspect-ratio style must be added.

Final passes over Tamagui DOM and RSD-aligned code must treat every hook,
callback ref, wrapper object, style array, default-prop object, context read,
and tag-specific polyfill on the generic native host path as a measured cost.
Optional behavior must not allocate or subscribe when the corresponding prop
or feature is absent.

The native benchmark gate covers:

- mount and update time for large `html.div`, `html.span`, `View`, and `Text`
  trees;
- retained memory after mount, update, unmount, and remount;
- components with and without refs, styles, events, inheritance, and
  tag-specific polyfills;
- Hermes or a documented jitless proxy in addition to ordinary Node.js;
- comparison with the pinned RSD fixture and with Tamagui's direct native
  primitives.

Record the benchmark command, device or runtime, sample size, variance, and
before/after numbers. Bundle size alone cannot approve a native DOM-path
change.

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
- no bracket or underscore escaping in style prop values;
- no multi-property expansion inside the value grammar;
- no clause-level deep merging of property programs;
- no public `strict-dom` product or entrypoint name.

## Remaining design work

These decisions need focused prototypes before implementation is considered
locked:

1. The runtime and compiler boundary for dynamic value strings, including
   the cache key and development diagnostics.
2. The web CSS encoding for per-longhand programs: equal effective
   specificity, preserved program order across runtime insertion, streaming
   SSR, and code splitting, with deterministic server/client hashing.
3. The CSS transition native capability matrix and the migration of the
   existing array and per-property preset object forms (preset resolution
   itself is decided: config-first identifiers).
4. Native container-query measurement timing, initial render behavior, and
   performance gates for explicit query containers.
5. The complete built-in condition list and collision policy for common
   configs.
6. How `style()` conditionally composes multiple handles while preserving
   whole-program replacement.
7. The structured React Native value migration table.
8. The minimum native DOM ref API.
9. The exact dependency-precompilation metadata and error experience.
10. Which dynamic regular Tamagui cases require the compiler in V3.
11. The variables unification: one configured namespace covering today's
    tokens and theme values, composite values included, designed together
    with the grammar's identifier resolution.

Each prototype must end with one chosen path. The implementation must not ship
multiple equivalent syntaxes or runtime fallback paths.

## References

- [React Strict DOM common props](https://facebook.github.io/react-strict-dom/api/html/common/)
- [React Strict DOM HTML compatibility](https://facebook.github.io/react-strict-dom/api/html/)
- [React Strict DOM CSS compatibility](https://facebook.github.io/react-strict-dom/api/css/)
- [React Strict DOM component guide](https://facebook.github.io/react-strict-dom/learn/components/)
- [Tailwind state variants](https://tailwindcss.com/docs/hover-focus-and-other-states)
- [Tailwind responsive and container-query variants](https://tailwindcss.com/docs/responsive-design#container-queries)
- [CSS Syntax Module Level 3](https://www.w3.org/TR/css-syntax-3/)
- [CSS transition shorthand](https://developer.mozilla.org/en-US/docs/Web/CSS/transition)
- [CSS Transitions Level 2](https://www.w3.org/TR/css-transitions-2/)
- [React Strict DOM PR #512: avoid ref overhead when not needed](https://github.com/react/react-strict-dom/pull/512)
- `styledHtml` introduction: commit `ab8517c5e4`
