# DOM mode: compile-time DOM authoring for native

Implementation detail for `v3-evolution.md`. The master plan owns sequencing
and acceptance. DOM mode depends on the new shared compiler IR and native
frontend.

## Locked direction

- No unified runtime component that inspects children to choose Text vs View.
- No per-render string detection or automatic runtime wrapping.
- No React Strict DOM dependency.
- Literal tags decide the native backing at compile time.
- Direct literal string/number children of View-backed tags may be wrapped at
  compile time for zero render cost.
- Dynamic children retain normal React Native constraints and errors.

Web source remains literal DOM. Native source is rewritten to Tamagui-owned DOM
behavior primitives.

## Semantics reference

React Strict DOM is the strongest prior art and is used as a semantics/test
reference:

- View-backed tags and Text-backed tags are distinct.
- DOM block/flex defaults differ from React Native defaults.
- Text style inheritance and CSS variables need explicit native behavior.
- DOM events, refs, nesting, and scrolling do not map perfectly to RN.

We adopt proven semantics where they fit Tamagui, but use Tamagui's existing
theme/media/pseudo/style machinery rather than running a parallel StyleX/RSD
runtime.

## V1 tag set

### View-backed structure

`div`, `section`, `main`, `header`, `footer`, `nav`, `ul`, `ol`, `li`.

### Text-backed

`span`, `p`, `h1`-`h6`, `label`, `strong`, `em`, `code`.

### Basic interactive/media

`button`, `a`, `img`, `input`, `textarea`.

The tag/attribute table is data shared by compiler tests and `@tamagui/dom`.
Unsupported tags are left untouched on web and produce a native compile
diagnostic/bailout.

## Native rewrite

The compiler:

1. Recognizes literal lowercase tags in the shared element IR.
2. Injects only the required imports from `@tamagui/dom/native`.
3. Rewrites tags to the classified primitive.
4. Maps supported attributes/events (`onClick -> onPress`, `href`, `alt`,
   common `aria-* -> accessibility*`, `id`, roles).
5. Wraps a direct literal string/number child in the DOM text primitive when
   its parent is View-backed.
6. Emits compile-time warnings for statically knowable invalid Text/View
   nesting or unsupported attributes.
7. Bails rather than inventing behavior for an uncertain structural rewrite.

`jsx()`/`jsxs()`/`createElement()` input is supported through the shared
compiler IR, so DOM mode can run after user plugins.

## Native runtime primitives

`@tamagui/dom` owns only behavior that cannot be erased at compile time:

- DOM-mode block/flex defaults scoped to rewritten elements;
- inherited text-style context when values are dynamic;
- accessibility/event adapters;
- Linking/press behavior for anchors/buttons;
- image/input/textarea host behavior;
- development nesting diagnostics that require runtime knowledge.

It does not inspect resolved children for strings. Prefer compiler propagation
for statically known inherited text styles, then use the minimal context path
for dynamic values.

## Known semantic gaps

1. CSS block flow and RN flex defaults differ. DOM-mode View primitives apply
   web-like defaults without changing ordinary Tamagui View behavior.
2. Inline layout is not a general RN capability. Mixed dynamic text/View
   children are documented limitations.
3. DOM bubbling, `preventDefault`, and pointer events do not have perfect RN
   equivalents. Map the supported semantic subset and warn on the rest.
4. HTMLElement refs exceed the current Fabric host API. V1 exposes only the
   proven subset.
5. Third-party libraries rendering DOM must also pass through the DOM compiler
   to run natively.

## Explicitly deferred

- `overflow:auto|scroll -> ScrollView` structural rewriting;
- `select`/`option`;
- form submission semantics;
- broad HTMLElement ref emulation;
- runtime rescue of dynamic strings;
- taking an RSD/StyleX runtime dependency.

These become separate packets only after a concrete fixture requires them.

## Implementation packets

### 1. Mapping contract

Create the shared tag/attribute/event table and conformance cases. Compare the
selected behavior with RSD source/tests and React Native upstream. No runtime
code yet.

### 2. Compiler rewrite

Add web no-op/native rewrite adapters to the shared IR, import injection,
literal child wrapping, and diagnostics. Snapshot source + transformed output
and execute the transformed native fixture.

### 3. `@tamagui/dom` primitives

Implement the minimal View/Text/interactive behavior and dynamic inheritance
path. Ordinary Tamagui primitives must be unaffected when DOM mode is off.

### 4. Integrated fixture

The same source renders on web and native with:

- structure + headings/text;
- direct literal text inside a View-backed tag;
- theme/text inheritance;
- button/anchor press behavior;
- image accessibility;
- input/textarea change/focus;
- a deliberate dynamic invalid-text case that still fails natively.

## Acceptance

- Web output remains semantic literal DOM.
- Native output uses the expected host primitives and accessibility/event
  props.
- Layout defaults and text inheritance match the selected conformance table.
- Direct literal text works without a runtime child scan.
- Dynamic invalid text is not silently rescued.
- Compiler diagnostics identify unsupported tags/attrs/nesting.
- DOM mode adds no per-render work to ordinary Tamagui components.

## References

- `plans/v3-evolution.md` — master execution contract
- `plans/compiler-oxc.md` — shared IR and native frontend
- `~/github/react-strict-dom` — semantics/test reference only
- React Native Text and Fabric host-instance documentation
