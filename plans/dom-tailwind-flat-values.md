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
11. The compiler requirement for DOM authoring is platform-scoped. On web,
    `html.*` from regular Tamagui renders the literal tag at runtime like any
    Tamagui component, with the compiler as the usual optimizer. On native,
    the compiler is required: tag classification, primitive injection, and
    literal text wrapping are build-time structural rewrites, and a missing
    compiler is an explicit native build failure (native always runs through
    a bundler, so this costs nothing in practice). Standalone `tamagui/dom`
    with `style()` is compile-only on both platforms; zero-runtime output is
    its identity. There is no runtime child scan on native in any mode.
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
    container and `@sm/card:` targets a named container. `@sm:` applies the
    same condition the `sm` media key describes, measured against the
    container instead of the viewport — same comparison direction, no
    inversion, matching what `@container` emission already does today.
    Container sizes are the size-measuring subset of the media keys:
    interaction keys like `hoverNone`/`pointerCoarse` register no `@` form.
    Config creation derives the subset and the query tables, so a
    meaningless or missing container query is a config-time error, never a
    lowering-time throw.
19. Style prop values need no bracket or underscore escaping. A top-level
    colon is never valid inside a CSS value, so conditional clauses are
    detectable unambiguously and the base/payload segments are plain CSS
    component values. Bracketed arbitrary values belong to the Tailwind
    className frontend only, where class names cannot contain spaces.
20. Identifiers inside values resolve config-first: a configured
    token/variable name wins, otherwise the identifier is literal CSS.
    CSS-wide keywords are reserved and cannot be configured names.
21. Merging preserves the v1 model, generalized from values to programs. A
    prop's value expands to one program per contributed CSS longhand, and
    within a longhand the merge unit is the CLAUSE, keyed by its exact
    modifier set (base is the empty set). A later contribution replaces only
    the clauses whose condition sets it restates; other clauses survive, and
    new condition sets append after survivors so last-match-wins holds. This
    is v1's true semantics (`hoverStyle` was a separate prop, so a JSX `bg`
    override never killed the styled hover) and matches tailwind-merge
    (`hover:bg-*` is its own conflict group). Revised 2026-07-29 from
    whole-program replacement, which would have made every call-site base
    override silently destroy a styled component's state styling.
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
25. Safe-area insets are built-in variables: `safe-area-top`,
    `safe-area-right`, `safe-area-bottom`, `safe-area-left`, usable anywhere
    a length is. Web lowers to `env(safe-area-inset-*)`. Native resolves
    through the existing `@tamagui/native` safe-area state fed by
    `react-native-safe-area-context`; using them without that setup is a
    one-time development diagnostic, never a silent zero.

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

The resolver's mechanical contract, so one implementation serves both
platforms:

- A payload is scanned as CSS tokens. Candidate identifiers are ident tokens
  anywhere in the payload, including inside function arguments
  (`linear-gradient(135deg, accent, blue)` resolves `accent`), but never
  inside strings, never inside an unquoted `url()` body, never a function
  name, and never a `--*` custom-property reference, which stays literal.
- Bare numbers resolve config-first only for properties bound to a numeric
  token category (space, size, radius, z-index), and per component value:
  `p="4 8"` resolves both, `boxShadow="0 2px"` resolves neither because
  box-shadow binds no numeric category. Numbers with units are always
  literal.
- Lookup order is the property's bound categories first, then the unified
  variables namespace (design item 11). A miss is literal CSS; typos in
  literal positions are the compiler's and language service's job, never a
  runtime guess.
- Resolution produces one segmented representation — static text runs plus
  reference nodes — with two serializers: web joins references as
  `var(--name)` so theme switches stay zero-re-render, native looks
  references up through the granular theme subscription at evaluate time.
- The opacity suffix on a resolved color reference serializes on web as
  `color-mix(in srgb, var(--name) NN%, transparent)`, and on native as an
  alpha-composed color computed at lookup. On web this keeps opacity
  variants theme-reactive without generating per-alpha variables.

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

Two theme-matching rulings from the W3 review (2026-07-29):

- A theme modifier matches when it is a name-boundary prefix of the active
  theme: `dark:` matches active `dark_blue`, `dark_blue:` does not match
  active `dark`. The legacy `$theme-*` check was exactly inverted (clause
  startsWith active theme, no name boundary, so `darkish` matched `dark`);
  that was a bug, the new rule is authoritative on both platforms, and the
  migration guide must note that converted `$theme-*` objects can change
  meaning in those edge cases.
- Scheme nesting divergence is pre-existing and accepted: web's descendant
  matching (legacy `.t_dark .x` and the program encoding's
  `:where(.t_dark *)` alike) matches an outer `dark` through an inner
  `light` wrapper, while native matches the component's resolved nearest
  theme. CSS cannot express nearest-ancestor-wins with classes alone;
  revisit only if container style queries become baseline enough to carry
  theme names.

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

Composition SCALES existing alpha, because that is what web's
`color-mix(in srgb, var(--x) NN%, transparent)` does (browser-verified:
`#00000033` at 50% computes to alpha 0.1). Known adoption-time fix: core's
current `normalizeColor.native.ts` REPLACES alpha (`opacity ?? rgbaVal.a`),
so it diverges from web for any color that already carries alpha; the native
adoption of the grammar serializers must land the scale behavior there.

### Non-string and dynamic values

Unconditional values keep their natural representation (`opacity={0.5}`,
`zIndex={2}`); conditional values use a string program
(`opacity="0.5 disabled:0.4 hover:1"`). React Native object and array values
that lack a faithful CSS-shaped replacement require the explicit migration
table; legacy structured values are never converted by guesswork.

Literal programs compile completely. Dynamic programs built from template
strings use the shared runtime parser unless the surrounding entrypoint is
compile-only. Standalone DOM is compile-only and reports dynamic structures
that cannot be lowered safely.

The boundary in detail. The compiler and the runtime host the same
`@tamagui/style-grammar` functions; there is one pipeline, two hosts:

1. `parseValue` splits the string;
2. family props split per-longhand (`splitBackgroundValue`);
3. clause payloads resolve config-first (token/variable names to `var()`
   references on web, to subscription lookups on native), color opacity
   applies;
4. contributions merge (`mergePrograms`);
5. web lowers to a program block (`lowerProgram` + hash); native evaluates
   (`evaluateProgram`).

The compiler runs 1-5 for everything it can prove static and emits the CSS
and class names at build time, culminating in the plain-element fast path
(decision 24). A prop whose string is not statically known bails to the
runtime for that prop as a whole: there is no partial compilation of one
program, so a template string with a dynamic payload makes the entire prop
runtime-parsed.

The runtime cache sits after step 2 and covers steps 1-2: one map keyed by
`property + '\\0' + input` holding the per-longhand `ParsedValue`s or the
parse error. Two facts make this cache immortal per config: theme switching
never invalidates it, because web resolution produces variable references
and native resolves through the granular theme subscription at evaluate
time, and state/media changes never invalidate it, because clauses are data,
not resolved branches. Config creation stamps a revision; the revision is
part of the program hash and a config swap resets the cache wholesale.
Template strings that embed changing values produce new keys each render, so
the cache has a size cap and resets completely when it overflows — a reset
re-parses on demand and changes nothing observable. No LRU bookkeeping.

Diagnostics: in development a parse error throws at the component, naming
the prop, the full authored string, and the caret index from
`ValueParseError`. In production the prop is dropped and one `console.error`
is emitted per cached key, so a render loop cannot spam. Payloads emitted
into CSS at runtime pass the same value sanitization as today's dynamic
styles; hashed class names are css-safe by construction. The compiler
records the config revision it compiled against, and the runtime warns in
development when its config revision differs from a precompiled module's —
an integrity check, not a fallback path.

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

- A later `backgroundColor="red"` replaces the `backgroundColor` program's
  BASE clause; its `hover:` clause and the `backgroundImage` program both
  survive.
- A variant's `bg: 'red'` contributes at its position in the forward pass
  and replaces the clauses it restates, base here.
- `p="4 sm:6"` followed by `px="2"` expands to four padding longhand
  programs, and `px` replaces the left and right BASE clauses; their `sm:`
  clauses survive.

Within a longhand, replacement is per clause, keyed by the exact modifier
set: `styled(View, { bg: 'gray hover:blue' })` overridden at the call site
with `bg="red"` replaces the base clause and keeps the hover — exactly what
v1 did with its separate `hoverStyle` prop, and what tailwind-merge does by
giving `hover:bg-*` its own conflict group. Restating a condition set
replaces that clause (`bg="red hover:red"` replaces both); a new condition
set appends after the survivors, so `dark:hover:` authored later beats an
inherited `hover:` when both match. Wiping inherited conditions requires
restating them; that is the same trade Tailwind users live with, and design
systems that need a hard reset expose a variant. The rule is uniform at
every level — styled base, variant, spread, JSX, `style` prop — no
level-boundary special cases.

The merged program is still ONE program: one class name hashed from the
merged clause list, one contiguous block, one native evaluation. Only the
merge rule is finer than whole-program; the encoding, hashing, and
evaluator are untouched.

The family expansion table, which records the longhand each kind of value
contributes to for `bg` and the other multi-property families, is the only
merge knowledge in the system, and it lives in the shared grammar package.
This is also why `tailwind-merge` is removable: for owned values, per-longhand
forward merging reproduces everything it did.

### The transform family

Designed against the RN survey's Transforms section
(`plans/react-native-style-capabilities.md`); this was the codemod dry-run's
top migration blocker (259 flags, mostly `enterStyle.scale`/`y`).

`x`, `y`, `scale`, and `rotate` stay first-class props, each one program
with independent clause replacement: `scale="1 enter:0.9"` is the flat
spelling of today's `enterStyle={{ scale: 0.9 }}`. On web they lower to the
CSS individual transform properties. Where two programs share one CSS
property — `x` and `y` both feed `translate` — the programs own per-axis
custom properties and one static rule composes them
(`translate: var(--t-x, 0) var(--t-y, 0)`; the clause rules set `--t-x`
per state). Transitions keep working because changing a custom property
triggers transitions on the property consuming it, so
`transition: translate 200ms` animates a hover-driven `--t-x` flip; no
`@property` registration is required for that path. `scaleX`/`scaleY` ride
the same trick on `scale`, and `scale` itself EXPANDS to both axis programs
exactly like `padding` expands to four sides: uniform scale is both axes at
one value, a later `scaleX` replaces just its axis program, and no two
mechanisms ever write the CSS `scale` property — the collision is
impossible by construction and forward merge composes correctly. The
uniform case pays the var indirection; the compiler may emit the direct
property when it can prove no axis program coexists.

`x` and `y` bind the space token category (numeric config-first resolution,
`x="4"` is the space token exactly like `p="4"`); a bare non-token number
is a diagnostic on both platforms, never silently coerced to points or
degrees, keeping web/native parity. `translate3d` with zero Z decomposes;
non-zero Z is a diagnostic naming the missing `translateZ`.

Everything else — skews, 3D rotations, `perspective`, `matrix` — belongs to
the raw `transform` property as one ordinary program. Composition order is
CSS's: translate, rotate, scale, then `transform`, and native composes one
array in exactly that fixed order from each program's evaluation (never
sorted, never derived from object iteration). A raw transform string parses
once into the supported array representation; Animated and Reanimated
always receive arrays. Unsupported functions and units (`turn`, `matrix3d`,
`translateZ`, six-number `matrix()`, relative units) are diagnostics, never
forwarded to RN's lossy string parser, and axis-percentage strings like
`translateX(10%)` are never emitted as RN strings because stable RN parses
them to points. `transformOrigin` stays independent of family ordering on
both platforms.

Validation: the var-composed transition claim is browser-verified
(2026-07-29, Chromium: a hover-driven `--t-x` flip reads ~50px at the
midpoint of a 400ms linear `transition: translate`). Remaining before this
locks: a native fixture proving the composed array matches today's v1
output for the common `x`/`y`/`scale` cases.

Runtime integration shape (the getSplitStyles wiring): the forward pass
accumulates programs in one Map keyed by longhand, delete-then-set per
contribution, in exactly the order it already walks styled bases, variants,
and authored props. At the end of the pass, web asks each program for its
class name and inserts the block only when that name is new — lowering is
skipped entirely on repeat names, so the steady-state cost per program is
one hash plus one Set check. Native evaluates each program against active
conditions. A parsed program's clause modifiers are an exact dependency
list, so native subscribes only to the media keys, theme scopes, and group
states its programs actually reference — the generalization of the "group
props require a stable prop key" optimization, derived per element from
data instead of per component from heuristics.

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

The encoding itself is drafted below as the program block encoding; the
streaming/code-splitting prototype is remaining design work item 2.

#### The program block encoding

One invariant makes the encoding simple: after per-longhand merging, an
element carries exactly one program per CSS longhand, and lowering never
emits a CSS shorthand property (families expand before lowering). Two
distinct program classes on one element therefore never target the same
longhand, so stylesheet order BETWEEN programs is semantically irrelevant.
Order only matters WITHIN a program, and a program always lowers as one
contiguous block.

Each (longhand, program, config revision) hashes to one deterministic class
name. The block emits the clauses in authored order, with every condition
wrapped in `:where()` so each rule's specificity is exactly the subject
class, `(0,1,0)`:

```css
/* bg="red hover:green dark:gray dark:hover:blue" — backgroundColor program */
._bc-x1a2b3{background-color:red}
._bc-x1a2b3:where(:hover){background-color:green}
._bc-x1a2b3:where(.t_dark, .t_dark *){background-color:gray}
._bc-x1a2b3:where(.t_dark, .t_dark *):where(:hover){background-color:blue}
```

- Every condition anchors on the subject, Tailwind-group style. State
  modifiers are `:where(:hover)` on the subject; ancestor-scoped conditions
  use the descendant form inside the subject's `:where()`: themes are
  `:where(.t_dark, .t_dark *)` (is-or-within), groups are
  `:where(.t_group_card:hover *)`, enter is
  `:where(.t_unmounted, .t_unmounted *)`. Because each ancestor condition is
  an independent "within" test, nesting order between them never matters and
  no ancestor-permutation selectors exist (a theme class strictly between a
  group and the subject just works). Media modifiers wrap the rule in
  `@media`; chained media modifiers nest (`@media A { @media B { … } }`),
  which is AND for arbitrary query texts. Specificity never moves.
- Declarations are compact (`{background-color:red}`), matching the
  existing emitter's byte-lean output.
- `exit:` never lowers to CSS: exit is animation-driver territory (there is
  no exited-state class in the DOM to select), so a web `exit:` clause is a
  compiler/runtime diagnostic naming the driver, exactly like other
  cannot-lower conditions. `enter:` lowers through the `.t_unmounted`
  scheme.
- Rule/selector injection through payloads is structurally impossible at
  this layer because the parser rejects a top-level `{`, `}`, or `;` — those
  tokens are never valid in a CSS component value. Value-level validation of
  resolved payloads has exactly one owner, the resolution step, same as
  today's dynamic styles; lowering emits verbatim by contract.
- With equal specificity everywhere, the cascade reduces to source order
  inside the block, which is authored clause order, so the last matching
  clause wins — the exact program semantics native evaluates in JS.
- The block inserts atomically: printed contiguously in SSR output, inserted
  as a run of `insertRule` calls appended at the sheet end on the client.
  Because cross-program order is irrelevant, append-at-end is always safe,
  and any interleaving of streaming chunks or code-split bundles is safe:
  a class name fully determines its block, so duplicate arrival is
  idempotent and dedup is a name check.

This deletes the current encoding's entire specificity apparatus:
`:root`-repetition priority ladders and pseudo-rule `!important` in
`getCSSStylesAtomic`, and `.cls.cls` doubling for longhand-over-shorthand
precedence (impossible by construction once shorthand properties are never
emitted). Interop with non-Tamagui CSS (Tailwind passthrough layer, app
stylesheets, any remaining react-native-web output) is ordered by cascade
layers, one `@layer` statement instead of per-rule specificity tricks —
extending the layer wrapping that tailwind mode already uses today.

Inline `style` and dynamic non-string values keep their existing paths: the
style attribute outranks any class, and dynamic payloads resolve through the
runtime parser cache, not through new CSS.

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

### Safe-area variables

Four built-in variables cover device safe areas:

```tsx
<View pt="safe-area-top" pb="safe-area-bottom sm:0" />
```

On web they lower to `env(safe-area-inset-top)` and friends: pure CSS, always
available, and composable with literal CSS math
(`pt="calc(env(safe-area-inset-top) + 16px)"` stays valid as a plain value).

On native they resolve through the existing `@tamagui/native` safe-area state
(`import '@tamagui/native/setup-safe-area'` plus the user's
`SafeAreaProvider`), which is fed by `react-native-safe-area-context`. Two
requirements on that path:

- resolution must be reactive: insets change on rotation and on foldables,
  so style values subscribe like theme values. The current `getInsets()`
  accessor is documented non-reactive and Sheet has already hit it being
  unexpectedly disabled; the variable path needs the granular-subscription
  treatment, not that accessor.
- using a safe-area variable without the native setup emits a one-time
  development diagnostic naming the setup import. It never silently
  resolves to zero.

Landed 2026-07-29 on `v3-beta`: the safe-area state is a subscribable store
(`subscribe`/`getInsets`/`hasSafeAreaSetup`), fed by a tracked hook that
pushes provider context changes into the store, with Sheet consuming it via
`useSyncExternalStore`. One wiring fact for the variables adoption:
`react-native-safe-area-context` has no out-of-React subscription, so the
store only receives rotation updates while some component renders the
tracked hook — the variables layer must mount one tracker (in the Tamagui
provider when safe-area setup ran), not assume the store self-updates.

The Tailwind frontend gets `pt-safe-area-top` automatically through token
naming. Tailwind core has no safe-area utilities (community plugins use
`pt-safe`); the explicit names are the one spelling here.

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

Native cannot promise every CSS behavior. See
`plans/react-native-style-capabilities.md` for the current per-version and
per-platform survey (targeting RN ≥ 0.82 removes all New Architecture
branching). Known difficult areas include:

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

- on web, regular-Tamagui `html.*` is runtime-correct; the compiler is the
  usual optimizer, never a gate;
- on native, any `html.*` usage requires the DOM compiler, which cannot bail
  to an untransformed runtime: a missing compiler is an explicit native build
  failure;
- standalone `tamagui/dom` is compile-only on both platforms;
- published libraries using DOM mode on native must be precompiled or
  included in dependency compilation;
- literal text wrapping happens at compile time;
- unsupported native semantics produce actionable diagnostics;
- ordinary `View` and `Text` retain their established runtime path.

`@tamagui/tailwind` is compiler-led on both platforms. On web, compilation is
inherent: unclaimed classes only become CSS through the official Tailwind
engine at build time. On native, the bundler plugin (Metro, One) claims and
filters candidates at build time, and native builds always run through a
bundler. Dynamic class values require a statically bounded compiler
representation or the documented runtime parser owned by the Tailwind
package. Core never pays that cost in either case.

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

First corpus numbers (2026-07-29 dry-run spike over kitchen-sink usecases
plus the Button skin): 1702 conversion sites, 1411 clean (83%), 291
flagged. The flag distribution reorders priorities: `legacy-transform-part`
dominates at 259 (presence animations lean on `enterStyle.scale`/`y`
everywhere), making the transform family design the single biggest
migration blocker. Next largest real pattern: a static conditional merging
onto a dynamic base (`opacity={active ? 0.5 : 1}` plus a hover object) —
convertible in principle as a template literal, since dynamic strings are a
designed runtime path; the codemod should learn that emission. Spreads,
nested styled styles, and dynamic condition shapes are correctly
unconvertible and stay flagged for hands.

Conversion is purely mechanical, with no second value representation: a
legacy object entry becomes a clause on the longhand's program, and raw
numeric values spell as CSS lengths (`hoverStyle={{ p: 4 }}` contributes
`hover:4px`, unitless properties contribute `String(n)`). This is faithful
because the native serializer already lowers plain CSS lengths to unitless
React Native numbers — `p="4 hover:18px"` requires that regardless — so the
px-vs-unitless property table is shared, not converter-specific. Legacy
transform-part entries (`scale`, `rotate` inside condition objects) are
excluded from v1 conversion with a diagnostic until the transform family
design lands.

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

### Skins and the registry

Canonical skins are single-sourced in regular Tamagui flat-value syntax. The
Tailwind-syntax rendering of a skin is derived, never hand-maintained: both
frontends lower to the same IR, so the shared grammar converts a flat-value
definition to className candidates deterministically (the existing
`to-tailwind` converter is the starting point). The registry generator and
the docs mode toggle both render from the one source file.

The current object-syntax skins migrate through the standard V3 codemod. They
are statically local by construction (no spreads, no dynamic condition
objects), which makes them the ideal first codemod corpus and its acceptance
fixture.

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

The getSplitStyles wiring decomposes into five lanes, in order (the grammar
package side of each is already landed on `v3-beta` as of 2026-07-29). The
existing structure maps cleanly: `classNames` is already keyed per property,
and the `styleState.style` accumulation with `usedKeys` is the program Map
with raw values in place of parsed programs.

- W4 first, the bridge: the runtime parse cache module
  (property+input keyed, cap-and-reset) and the resolver view adapter from
  `createTamagui` output (token maps and theme keys to one `lookup(name)`
  with `var()` names for web).
- W1: program accumulation in styleState — one `contributeProgram` path fed
  by styled bases, variants, and authored props in the existing forward
  order; families split before accumulation.
- W2: web flush — new class names lower and insert as contiguous blocks,
  repeat names skip lowering entirely; `classNames[longhand] = programClass`.
- W3: native evaluation with granular subscriptions derived from the union
  of clause modifiers across accumulated programs.
- W5: the `legacyConditionObjects` gate in the prop loop, feeding converted
  clauses through the same `contributeProgram` path.

W1 and W2 are hot-path core surgery and get the closest review; W4 is
self-contained and precedes them.

### Hot-path code rules

Everything under getSplitStyles, createComponent, the parser, and the
evaluators is hot-path and written to these rules, reviewed as part of every
change there:

- plain `for` loops over iterator methods; no `.map`/`.forEach`/spread in
  per-render code;
- no closures allocated per call — module-level functions taking explicit
  arguments;
- no fresh objects/Sets per render for data that is static per program or
  per config: classification, dependency lists, and resolved+lowered output
  memoize on the program identity and config revision, so a stable program
  costs one Map hit per render;
- zero cost when the feature is unused: a component with no flat values
  pays one property read.

The parse-cost benchmark plus a render-loop benchmark referee changes here;
claims are measured, never asserted.

### The engine contraction

The program model is not a layer beside the engine; at cutover it deletes a
large slice of it, in V3, not v4. Because `legacyConditionObjects` gates
input parsing only (decision 23) and old condition objects convert to
program clauses at the loop entry, the condition machinery inside
getSplitStyles dies even while the compat setting exists:

- the pseudo-object blocks and `getSubStyle` recursion;
- the media-object sub-style path and media importance ordering;
- `usedKeys` importance tiers (base-only remains, which is a seen-check);
- the `:root`-repetition specificity ladders, pseudo `!important`, and
  `.cls.cls` doubling in `getCSSStylesAtomic`;
- `$theme-*` / `$platform-*` / `$group-*` prop-key parsing.

Two unifications complete it: a clause-less value is a base-only program
and a base-only program block IS an atomic class, so `getCSSStylesAtomic`
and `lowerProgram` become one emitter; and the payload identifier lookup
absorbs `getTokenForKey`, so resolution happens in exactly one place. The
loop contracts to: expand shorthand, parse (cached), contribute program,
lower or evaluate once after the pass.

Gate: the contraction must show up as a measured reduction in
`@tamagui/web` bundle size and in getSplitStyles branch count, reported
beside the existing bundle gate — the flat-value engine plus deletions must
net smaller than today's core, not larger.

W1+W2 landed 2026-07-29 (adversarially reviewed, fixes applied same day).
W3 landed the same day: native evaluation with the last-matching-clause
rule, interaction states surfaced through `programStates` so createComponent
attaches the right events, referenced media keys riding the existing
`hasMedia` subscription, and the theme chain matched by progressive
underscore prefixes. W3 v1 skips group and container clauses on native with
a development note each (component-tree wiring and measurement are plan
item 4). W5 is in progress as the engine-contraction test bed: with
`legacyConditionObjects` on, old condition objects convert to clauses and
run through the program engine instead of the legacy machinery, so the two
engines can be A/B-compared on the same test suites before the deletion.
Staging contract while the migration runs: only clause-bearing string values
divert to programs, and only where the class flush can express them —
noClass/animated-inline configurations keep the legacy path untouched until
W3. Two accepted staging limitations, both resolved by the cutover rather
than by more machinery: mixing a program with a legacy condition object on
the SAME longhand (`backgroundColor="red hover:blue"` plus
`$sm={{ backgroundColor }}`) gives the legacy class the win through its old
specificity ladder — the codemod never produces that mix, and W5's
`legacyConditionObjects` gate will warn on it; and the `bg` config shorthand
expands to `backgroundColor` before the program hook, so the background
family split (url + color in one value) currently requires authoring
`background` — the v6 config makes `bg` the family prop itself.

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
3. Execute the engine contraction (see "The engine contraction" under
   Programs and merging): delete the recursive condition paths, unify the
   two CSS emitters and the two resolvers, and report the bundle and
   branch-count reduction. Legacy objects keep working through input
   conversion, never through the old machinery.
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

1. The runtime and compiler boundary for dynamic value strings is designed
   (see "Non-string and dynamic values": one pipeline two hosts, post-split
   cache keyed by property+input, config-revision invalidation only,
   cap-and-reset overflow, throw-in-dev/drop-once-in-prod). First numbers
   (2026-07-29, M-series laptop, `style-grammar/bench/parse-cost.mjs`):
   cached path ~71ns, plain parse ~47ns, six-clause worst-case parse
   ~844ns, evaluate 45-107ns — sub-microsecond everywhere, so the
   per-render-behind-cache model holds with wide margin even at 5-10x
   device slowdown. Remaining: confirm cache-hit rate on the T7 native
   harness once the pipeline is wired into getSplitStyles.
2. The web CSS encoding for per-longhand programs is drafted (see "The
   program block encoding"): equal specificity via `:where()`, source-order
   cascade within an atomically inserted block, order-free cross-program
   dedup by hashed class name. Browser-validated 2026-07-29 in headless
   Chromium: theme+state chains resolve by last-matching-clause, a plain
   clause after an `@media` block wins at equal specificity, and
   runtime-appended blocks behave identically regardless of cross-program
   insertion order (7/7 probe assertions). WebKit re-check rides the
   kitchen-sink webkit CI project when this lands as tests. Remaining:
   prototype streaming SSR and code splitting in a real app.
3. The CSS transition native capability matrix and the migration of the
   existing array and per-property preset object forms (preset resolution
   itself is decided: config-first identifiers).
4. Native container-query measurement timing, initial render behavior, and
   performance gates for explicit query containers.
5. The complete built-in condition list and collision policy for common
   configs.
6. How `style()` conditionally composes multiple handles while preserving
   whole-program replacement.
7. The structured React Native value migration table — led by the transform
   family (`scale`/`rotate`/`x`/`y` as flat `transform` values plus their
   condition behavior), which the 2026-07-29 codemod dry-run measured as
   the largest migration blocker by far (259 of 291 flags).
8. The minimum native DOM ref API.
9. The exact dependency-precompilation metadata and error experience.
10. Which dynamic regular Tamagui cases require the compiler in V3.
11. The variables unification: one configured namespace covering today's
    tokens and theme values, composite values included, designed together
    with the grammar's identifier resolution.
12. Reactive native safe-area resolution: subscription-based inset updates
    (rotation, foldables) replacing the non-reactive `getInsets()` accessor,
    plus the not-set-up diagnostic.

Each prototype must end with one chosen path. The implementation must not ship
multiple equivalent syntaxes or runtime fallback paths.

## References

- `plans/react-native-style-capabilities.md` — RN 0.78→0.87 style-prop survey
  (2026-07): what the flat grammar can claim natively, per-platform gaps
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
