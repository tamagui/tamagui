# Tamagui V3: Style Props Architecture, Dynamic CSSOM Discovery, and Bundle Optimization

Authored 2026-09-14 for Nate.

## current property coverage audit, 2026-10-06

Nate: "We should make sure that V3 doesn't require this web prefix";
"We're trying to widen the support for props to basically most of them and we
just drop it on native". He requested an audit and improvement "in general
across every property that you can see style property".

RAN installed canary1791311846573: plain `textWrap="balance"` emits browser CSS
and drops from native style and host props. Width123, fontSize24 and opacity0.4
remain on native; `userSelect` and `textOverflow` retain their host mappings.
RAN all857 keys in csstype3.2.3 through the installed Text style pipeline:
619 forward as raw browser props and629 as raw native props, with no pipeline
exceptions. Explicit `accentColor="red"`, `animationDelay="100ms"`,
`counterReset="section"` and `textWrapStyle="balance"` reproduce both gaps.
RAN public source types at29333576d6:295 of497 standard CSS keys are absent
from both style bases. The source inventory has0 semantic diagnostics with
the fresh native type exports and installed consumer dependency types.

The repair expands the existing static recognition path using metadata
generated from the same csstype interface used by the public types. Browser
View and Text accept CSS properties directly; native retains its host-valid
style tables and consumes unsupported CSS names without forwarding them.
Native text mappings, variants, custom props and existing shorthands keep
their owners. The v6 `content` shorthand maps to `alignContent`, so that
name remains an authoring collision to judge separately. `transition` is
also owned by the animation interface. The `container` prop keeps its existing
boolean/string container-query API, including its native layout context;
its CSS longhands retain their existing style owner. These exceptions are recorded rather
than claimed as ordinary CSS emission.

The generated registry also records numeric CSS properties that need no
length unit. Metadata adds bundle bytes and startup dictionary entries;
measure the compiled size and prop-splitting cost before closing the repair.
RAN source coverage on the draft: all857 CSS names are present in both public
style bases with zero semantic diagnostics. The first family build exposed
TS2430 in `IconStyleProps`: its existing size-token `strokeWidth` is wider than
the newly inherited CSS property. The icon interface now explicitly owns that
override. The direct style-base extenders were searched; no other source
interface extends either base directly. The next family build reached119 tasks
and exposed TS2322 in TooltipSimple because CSS `container` had overwritten the
public container-query prop. RAN a source probe: `container={true}` fails on
both View and Text. The CSS extensions now exclude shared non-style prop owners,
and the public type guard requires all857 CSS names through the final prop
surface while separately preserving the boolean/string `container` contract.
The intersection audit found `container` as the only shared non-style collision.
RAN the repaired source probe: both boolean container assignments and prop
forwarding compile, all857 names remain public, and there are zero diagnostics.
Built-artifact and downstream runtime
validation are still pending.
RAN the next build: the complete family and browser regression suite pass.
The native suite fails eight assertions. A separate probe of the exact built
native bundle isolates the gap: direct CSS props drop, while `style` object
values bypass host-property validation. The shared value contribution path now
drops unsupported CSS across style objects, arrays, pieces and resolvers while
preserving context-only values. RAN existing HOC and `inlineProps` receiver
controls: both forward their owned `fillOpacity` prop. The original custom
receiver assertion used a bare `styled()` callback, which native treats as a
native host; the regression now asserts the actual ownership precondition.
RAN a source probe: widening CSS made a boolean `accentColor` variant fail with
TS2322. The public type composition now lets declared variant values own the
name; the repaired source probe has zero diagnostics. Native and browser runtime
variant guards are included. Built checks for these repairs are pending.
The earlier CSSOM and conditional-export design below remains a proposal.
Owner: p65570 / qa-taste, branch `tm/qa-taste-style-props`; Contrast acceptance
and receipts are in `plans/contrast/qa/taste-qa.md` and its production evidence.

---

## 1. Executive Summary & Verdict

Nate asked whether Tamagui can eliminate the static `validStyleProps` table to shave client bundle size while simultaneously achieving 100% Web CSS alignment, and how `styled()` can cleanly route props between styles, components, and host DOM/Native attributes.

### Key Findings & Benchmarks:
1. **Dynamic Client Discovery works and is 2.2× faster than the current static dictionary**:
   - In modern browsers, `document.createElement('div').style` exposes all **685 standard CSS properties** natively.
   - Direct lookup (`prop in div.style`) takes **115 ns**.
   - With a tiny in-memory cache (`styleCache.get(prop)`), lookup drops to **9.57 ns** (compared to **21.86 ns** for the current static object).
   - **Client bundle size savings: 100% of the dictionary strings are eliminated on web (saves ~7 KB raw today, and prevents adding 15–20 KB of full CSS spec strings).**
2. **SSR vs Client Separation is clean with modern package exports**:
   - Modern bundlers (One, Vite, Next.js, Webpack 5) support `exports.browser` vs `exports.node` / `exports.react-server`.
   - The client bundle uses dynamic CSSOM discovery (0 KB).
   - The SSR server bundle imports the static W3C CSS dictionary where bundle size has zero client impact.
3. **Web and Native must diverge here**:
   - Web has a native CSS engine and can dynamically validate 685+ CSS properties.
   - React Native (Yoga) crashes or throws redbox warnings if unknown props reach `RCTView`. Native requires a lean, strict ~80-property Yoga table.
   - Splitting `validStyleProps.ts` (web dynamic) and `validStyleProps.native.ts` (strict Yoga) is the optimal path for both platforms.

---

## 2. The Problem: The Cost of `validStyleProps`

In Tamagui's core pipeline, `getSplitStyles` evaluates every prop passed to every component to determine its destination:
1. **Style props**: Extracted into atomic CSS classNames (web) or resolved style objects (native).
2. **Component/variant props**: Consumed by Tamagui (`theme`, `size`, `variant`, `asChild`, `media`, `pressStyle`, etc.).
3. **Pass-through props**: Forwarded to the underlying DOM node (`id`, `aria-*`, `data-*`, `onClick`) or native host view.

### The Bundle Cost:
- Current table in `@tamagui/helpers` has **282 unique style property words** taking **~7 KB** of source strings.
- At runtime, `toStylePropsObject` splits these strings and instantiates large in-memory objects on boot.
- The full Web CSS specification (CSSStyleDeclaration, CSSType, SVG presentation attributes, logical properties, CSS Grid, container queries) contains **685 properties**.
- Expanding the static table to 100% web coverage would bloat client bundles by **15–20 KB** of pure string constants.

---

## 3. Strategy 1: Dynamic Client CSSOM Discovery (`CSSStyleDeclaration`)

Every modern browser engine (Chromium, WebKit, Gecko) implements the CSSOM specification, where `CSSStyleDeclaration` exposes camelCase property accessors for all supported CSS properties.

### Empirical Validation in Chromium (RAN):
Probing `document.createElement('div').style`:
- **CSS Properties (all return `true`)**: `color`, `backgroundColor`, `fontSize`, `lineHeight`, `paddingInline`, `marginBlock`, `boxShadow`, `filter`, `gridTemplateColumns`, `aspectRatio`, `containIntrinsicSize`, `animationTimeline`.
- **Non-Style Props (all return `false`)**: `id`, `className`, `onClick`, `disabled`, `aria-label`, `data-foo`, `customProp`.
- **Total Properties Discovered**: **685 CSS properties** with zero hardcoded strings.

### Performance Benchmark (700,000 lookups in Chromium):

| Lookup Strategy | Total Time (700k ops) | Time per Lookup | Relative Performance | Client Bundle Cost |
| --- | --- | --- | --- | --- |
| **Current Static Record** (`prop in validStyles`) | 15.30 ms | **21.86 ns** | Baseline (1.0×) | ~7 KB (grows to 20 KB) |
| **Direct DOM** (`prop in div.style`) | 80.50 ms | **115.00 ns** | 5.2× slower | **0 KB** |
| **Cached DOM** (`Map.get` with lazy DOM probe) | 6.70 ms | **9.57 ns** | **2.28× FASTER** | **~250 bytes (code only)** |

### The Cached Discovery Pattern:

```ts
// code/core/web/src/helpers/validStyleProps.client.ts
const styleElement = typeof document !== 'undefined' ? document.createElement('div').style : null
const styleCache = new Map<string, boolean>()

// Built-in fixed shorthands (fixed set, ~20 keys, 200 bytes)
const shorthands = {
  mx: true, my: true, px: true, py: true,
  bg: true, w: true, h: true, f: true,
  ai: true, jc: true, bc: true, br: true,
  // ...
}

export function isValidStyleKeyWeb(key: string): boolean {
  let valid = styleCache.get(key)
  if (valid !== undefined) return valid

  valid = (shorthands[key] === true) || (styleElement !== null && key in styleElement)
  styleCache.set(key, valid)
  return valid
}
```

**Why Cached DOM is faster than static objects**:
A dynamic app typically uses 60–100 unique style properties throughout its lifetime. The `styleCache` `Map` stays small, fits into L1 CPU cache, and the V8/JSC JIT compiles `styleCache.get` into a monomorphic fast-path taking under 10 nanoseconds.

---

## 4. Strategy 2: Server-Side Rendering (SSR) & Modern Bundler Exports

In Node.js or Bun during SSR, `document` does not exist. However, server bundle size does not impact web client performance (it never leaves the server).

Modern bundlers (Vite, One, Next.js, Webpack 5) resolve conditional exports:

```json
// code/core/helpers/package.json
{
  "exports": {
    ".": {
      "browser": "./dist/esm/validStyleProps.browser.mjs",
      "react-server": "./dist/esm/validStyleProps.server.mjs",
      "node": "./dist/esm/validStyleProps.server.mjs",
      "default": "./dist/esm/validStyleProps.mjs"
    }
  }
}
```

### Eliminating Hydration Mismatches:
- If a prop was treated as a style on the server but as an attribute on the client (or vice versa), React flags a hydration mismatch.
- **Solution**: The server static dictionary is built directly from the W3C CSS specification. Since modern browsers implement the standard spec, any standard CSS property evaluates to `true` on both server and client.
- Vendor-prefixed or experimental properties that a specific older browser lacks will simply pass through or evaluate safely.

---

## 5. Strategy 3: Web vs Native Divergence

Nate noted: *"I mean this is another one where I guess the HTML and the native could diverge right"*

Yes, they **must** diverge here, and diverging is a huge win for both sides:

| Target | Platform Reality | Optimal Architecture |
| --- | --- | --- |
| **Web (`@tamagui/web` / `html.*`)** | Browser has full CSSOM and CSS engine. | **Dynamic Cached CSSOM Discovery (0 KB)**.<br>Supports all 685 CSS properties automatically. |
| **Native (`@tamagui/core` / `View` / `Text`)** | Yoga has strict, finite layout properties.<br>Unknown props crash `RCTView`. | **Strict Static Yoga Table (~80 props)**.<br>Keeps native runtime safe and minimal. |
| **Server (Node SSR)** | Headless, no DOM, unconstrained bundle size. | **Comprehensive W3C Static Dictionary**.<br>Ensures perfect SSR atomic extraction. |

Previously, Tamagui forced one compromised table onto all platforms: Native was shipped web-only property names, while Web was burdened with static dictionary bloat and React Native quirk properties (`elevationAndroid`, `shadowOffset`, etc.). Splitting them fixes both.

---

## 6. Strategy 4: Strict `styled()` & DOM Attribute Whitelisting

Nate asked: *"we could make styled more strict in a sense that's an option. We could say you have to whitelist props that are not the ones that we have take."*

### Why Props Leak to DOM Elements:
When an author writes:
```tsx
const Card = styled(html.div, {
  backgroundColor: 'surface',
})

// Usage:
<Card myFilter="active" title="User Card" />
```
`title` is a valid HTML attribute (should pass through).
`myFilter` is an ad-hoc component prop. Because it's not a style and not a variant, Tamagui currently passes it to the DOM: `<div myfilter="active">`, producing React console warnings.

### The Solution with `@tamagui/dom`:
Tamagui already has the complete, authoritative HTML attribute tables in `code/core/dom/src/tables/attributes.ts` (`StrictDOMProps`).

In `styled()` for HTML elements:
1. **Style check**: `isValidStyleKey(prop)` -> extracted into CSS.
2. **Variant check**: `prop in staticConfig.variants` -> processed by Tamagui.
3. **HTML attribute check**: `prop in htmlElementAttributes[tagName]` -> forwarded to DOM node.
4. **Unknown prop**:
   - In Development: Emits diagnostic / warning (`Unknown prop 'myFilter' passed to html.div. If this is a custom prop, declare it as a variant or use data-*`).
   - In Production: Filtered out, preventing DOM attribute pollution.

---

## 7. Recommended Implementation Plan

1. **Step 1: Implement Dynamic Browser Export in `@tamagui/helpers`**
   - Add `validStyleProps.browser.ts` using the cached `document.createElement('div').style` pattern.
   - Configure conditional `package.json` exports (`browser` vs `node` vs `react-native`).
   - Verifiable saving: Shaves ~7 KB of string dictionary from every web client bundle.
2. **Step 2: Streamline `validStyleProps.native.ts`**
   - Restrict the native style prop table strictly to Yoga-supported layout and React Native style properties (~80 props).
   - Drop all web-only strings from native bundles.
3. **Step 3: Connect HTML Attribute Whitelisting in `styled()`**
   - Hook `@tamagui/dom` attribute tables into `getSplitStyles` for `html.*` elements to eliminate DOM attribute leaks.
