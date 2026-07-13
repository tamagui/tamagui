# DOM mode: div/span authoring, unified Text/View

Research plan, July 2026. Two related explorations: (1) stop requiring separate
`Text`/`View` components, (2) a compiler mode where users write plain
`<div>`/`<span>` and it runs on native. Independent of tailwind mode, could
ship as a v3 feature, but composes well with it (div + className is the full
"write web, run native" story).

## Ground truth from react-strict-dom (studied source at ~/github/react-strict-dom)

RSD is the strongest prior art. Status: v0.0.55 (npm Jan 2026), repo active
(commits June 2026), moved from `facebook/` to the `react/` org, production
inside Meta (Facebook/Instagram VR reuse ~60% of web files). Still 0.0.x, API
surface deliberately narrow ("strict" subset).

How it actually works on native (from source):

- **They did NOT unify Text and View.** Every HTML tag is statically assigned:
  `div/section/ul/button/...` → View-backed (`createStrictDOMComponent`),
  `span/p/h1-h6/label/b/em/code/...` → Text-backed
  (`createStrictDOMTextComponent`). The tag decides, so users never choose
  Text vs View; they choose div vs span, which they already know from web.
- **Raw string children of View-backed elements are auto-wrapped**:
  `typeof children === 'string'` → wrap in `<TextString>`, an RN `Text` that
  pulls inherited text styles from context
  (`createStrictDOMComponent.js:70`, comment: "Sometimes we can auto-fix this").
  Only direct string children; a mixed array of strings and elements, or a
  child component that itself renders a string, is not fixed.
- **CSS polyfills on native**: `display:block` emulated (flex column,
  flexShrink 0, stretch); `display:flex` gets WEB defaults (flexDirection row,
  flexShrink 1) rather than RN defaults; inherited text styles (color, font*)
  cascade via `ContextInheritedStyles`; CSS custom properties via context;
  em/rem length units; media queries; hover/focus pseudo states; transitions.
  This is a per-element runtime cost (contexts + style resolution hooks),
  which is the main thing Tamagui can do better via compiler + our existing
  media/pseudo/theme systems.
- RN itself still hard-errors on text outside `Text` (no proposal landed as of
  July 2026), so auto-wrapping is the ceiling for runtime solutions.

## Part 1: unified component — OWNER DECISION 2026-07-12: runtime path SKIPPED

Owner call: no runtime string-child detection/auto-wrap — it is slow and
hacky per render; maybe RN upstreams text-outside-Text someday. What survives:

1. **Compile-time wrap only.** Literal string/number JSX children are
   statically visible, so the compiler pass (Part 2) can wrap them in Text at
   build time for free. Dynamic children (`{cond && 'hi'}`, opaque child
   components) are NOT handled and error natively exactly as RN errors today —
   documented limitation, no runtime fallback.
2. **Tag-driven component resolution** stays: in DOM mode the tag decides the
   native backing (span → Text, div → View) using RSD's mapping table.

What we should not attempt: a single component that renders arbitrary dynamic
children correctly in all cases without knowing whether they are text. That
requires render-time inspection of resolved children (impossible for opaque
child components) and RSD, with Meta behind it, drew the same line.

## Part 2: compiler DOM mode (div/span → tamagui)

Compiler transform (fits the planned oxc extractor, see
`plans/compiler-oxc.md`, but works in the babel extractor too):

- **Web**: `<div>`/`<span>` stay literal DOM elements. Nothing to do beyond
  (optionally) extracting static styles as usual. Zero runtime for the DOM
  subset on web is the headline win.
- **Native**: rewrite lowercase JSX elements to Tamagui equivalents via a
  mapping table (borrow RSD's tag classification): `div→View(tag=div)`,
  `span/p/h1-h6→Text` with heading defaults, `img→Image`, `input/textarea→
  TextInput`, `a→Text+Linking`, `button→pressable View`, `ul/ol/li→View+role`,
  `overflow:auto|scroll → ScrollView` (with the child-becomes-
  contentContainerStyle wrinkle), `select/option`, `hr`, `form` (View,
  onSubmit dropped). Attributes map too: `onClick→onPress`, `href`, `alt`,
  `aria-*→accessibility*`, `id`, `data-*` (dropped natively).

### The gotcha catalog (what makes this hard, in order of pain)

1. **Layout defaults differ.** CSS div = block flow; RN View = flex column
   with different flex defaults. RSD's answer: polyfill block, and when
   `display:flex` is set, apply web defaults (row!). We must pick the same
   semantics or DOM mode is a lie. This inverts RN's defaults, so it has to be
   scoped to DOM-mode elements only.
2. **Text style inheritance.** `<div style={{color}}><span>` works via CSS
   cascade on web; native needs the inherited-styles context (or compiler
   propagation when statically resolvable).
3. **Dynamic/mixed children.** `{cond && 'hi'}` inside div: runtime auto-wrap
   covers direct strings; arrays with mixed inline content approximate poorly
   (inline layout does not exist on native). Documented limitation; span for
   real inline needs.
4. **Nesting rules.** Web allows div inside span (invalid but renders); native
   Text cannot contain View on iOS (well, with limits). Strict-mode dev
   warnings, like RSD's.
5. **Events.** onClick/onPointer*/onFocus map to RN responder/pressable
   equivalents with different semantics (bubbling, preventDefault are absent
   natively). Map the common ones, warn on the rest.
6. **Third-party components returning DOM.** Compiler only rewrites literal
   lowercase JSX in user source. A library component rendering `<div>` breaks
   natively unless it also compiles with DOM mode. Same boundary RSD has.
7. **Refs.** Users expect HTMLElement API on div refs. RN 0.7x DOM node APIs
   (`getBoundingClientRect` etc. on Fabric) cover a useful slice; document the
   subset. RSD's `useStrictDOMElement` does exactly this.
8. **overflow scroll → ScrollView** changes component structure (padding vs
   contentContainer, flexGrow), the single hairiest structural rewrite;
   possibly v2 of the feature, requiring explicit ScrollView initially.

### Verdict on feasibility

The compile-side rewrite is mechanical and low-risk (a tag/attr mapping pass).
The correctness burden is the native CSS-emulation runtime (layout defaults,
inheritance, units), and RSD has already specified and battle-tested those
semantics, so we adopt their semantics rather than inventing our own; where
possible we resolve statically in the compiler and skip the runtime cost that
RSD pays per element (contexts, per-render style resolution). That gap
(compile-time resolution of the strict-DOM subset) is exactly Tamagui's
differentiator over RSD and NativeWind.

## Phases

1. **String auto-wrap + inherited text context (runtime, small, v3-safe).**
   Immediate DX win independent of everything else.
2. **DOM mapping runtime** (`@tamagui/dom` or in core behind a flag): tag
   classification table, web-flex defaults for DOM-mode elements, event map.
   Validate against RSD's examples/tests for semantic parity.
3. **Compiler pass** rewriting lowercase JSX for native (babel extractor
   first, oxc later), kitchen-sink page rendering the same source on web +
   native, snapshot both.
4. Later: overflow→ScrollView structural rewrite, form controls, DOM ref API.

## Open questions

- Ship as v3 feature or v2-tailwind-coupled? Phase 1 is v3-safe now; phases
  2-3 make most sense paired with tailwind mode (div + className is the
  combined story).
- Do we take a dependency on react-strict-dom itself for the native runtime
  instead of building one? It is MIT, actively maintained, and we could layer
  the compiler on top. Downsides: stylex-shaped style prop API, 0.0.x churn,
  and our media/pseudo/theme systems would sit unused next to theirs. Leaning
  build-our-own-runtime + adopt-their-semantics, but worth a spike comparing
  bundle/perf.

## References

- https://github.com/react/react-strict-dom (source studied at ~/github/react-strict-dom)
- RSD production status: react-strict-dom discussion #270 (Meta VR apps, ~60% file reuse)
- https://reactnative.dev/docs/text (text-in-Text constraint unchanged)
