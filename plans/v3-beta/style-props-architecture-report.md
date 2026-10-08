# Tamagui V3: Style Props Architecture, Dynamic CSSOM Discovery, and Bundle Optimization

Authored 2026-09-14 for owner review.

## current property coverage audit, 2026-10-06

Owner direction: V3 must not require the web prefix; widen prop support to
basically most of them and just drop unsupported ones on native, with
improvement in general across every visible style property.

The repair extends the existing recognition tables with857 CSS names and93
unitless-number entries generated from csstype3.2.3. Public View/Text props and
the native-free DOM contract use that canonical CSS interface around their
existing overrides. Native recognizes unsupported names to consume them while
retaining its supported style table and existing mappings. The value path covers
style objects, arrays, pieces and resolvers. Explicit variants, HOC/inline props,
context values and component validStyles keep their declared owners.

Existing authoring owners need separate classification: container's boolean/
string query API, transition's animation interface, v6 content as alignContent,
r/x/y and transform vocabulary. This repair preserves those meanings. Browser
support for obsolete/vendor properties and CSS value parsing are separate from
emitting a canonical declaration. These probes make no native-device paint claim.

RAN installed baseline canary1791311846573: plain textWrap already emits CSS
and drops on native. Across857 Text inputs,619 browser and629 native inputs
forward as raw props. At29333576d6,295 of497 standard CSS keys are absent from
both source style bases. Width123, fontSize24 and opacity0.4 are positive native
controls. Runtime and type failures reproduced before each repair include
nested unsupported CSS, logical border-side outputs, CSS axis-name renaming,
Microsoft atomic prefixes, View's Text-only selectable mapping, and boolean
receiver props overwritten by newly widened CSS types.

RAN87f1894631: the complete136-package family build,74 browser regressions,
106 native regressions,13 style-parity and HOC type checks, root lint and root
checks pass. Exact archive SHA256:
1f1f1d6140f4a430d2d7845cb0cc48d2a8e8fc27ea13f46ba045f02b43d15252.
After local installation in isolated Contrast,3428 cases per platform
(View/Text, direct/style) have zero pipeline exceptions and unexpected authored
CSS host props. Browser output has zero unrepresented non-owner names. Native
output has zero unsupported authored styles, invalid style fields or invalid
host fields. Fresh public inventory covers all857 names with zero diagnostics.
Six actual Chrome computed-value controls and eight accepted heading/outline
fixtures pass at1280x960 and390x844, DPR3. WebP90 evidence remains private.

RAN coherent beta integration f0c7d1c115, built from identical package source
at99e031b61d:136-package build,78 browser regressions,106 native regressions,
30 style/HOC/styled type checks and lint pass. A fresh root dependency check
failed because its CLI executable was undeclared. Declaring the workspace CLI
creates the executable through a frozen install; the complete root check and
lint pass. The single semantic context/default declaration matches the built
archive. Five formatting-only declaration changes remain excluded.

RAN installed source f0c7d1c115: all857 names remain in public types with zero
diagnostics. Both3428-case browser/native output matrices pass. The repaired
boolean context/default type and runtime controls pass, with width123 as the
positive supported-style control. Before repair those type controls failed
with TS2322 and web emitted the invalid fill-opacity:true rule.

RAN cost against content-verified installed canary1791311846573: three unchanged
supported workloads have identical style/host outputs. Sixteen alternating
rounds of5000 calls after10000 warmup calls yield baseline/draft medians in
microseconds: View direct7.177/7.102, Text direct3.631/3.595, View style-object
6.655/6.693. Changes are-1.05%,-0.99%,+0.57%; overlapping samples do not establish
a speedup. This is Bun getSplitStyles with fake native hosts, with no device
paint or speed claim. The self-contained native test bundle grows from544145
to564930 raw bytes and118769 to122955 gzip bytes:20785 raw/4186 gzip bytes
added (3.82%/3.52%). The registry's ESM module is22641 raw/4241 gzip bytes.
Published canary verification and downstream npm-family delivery remain pending.
Owner:p65570 / qa-taste; CI:ci-fleet r62735; review:none.

The owner's latest direction stops shares. The five-row acceptance plan and receipts
are in Contrast's plans/contrast/qa/v3-style-props.md and its private evidence.
The earlier CSSOM and conditional-export design below remains a proposal from
its original author; it is not implemented or remeasured by this repair.

---

## 1. Executive Summary & Verdict

Owner question: whether Tamagui can eliminate the static `validStyleProps` table to shave client bundle size while simultaneously achieving 100% Web CSS alignment, and how `styled()` can cleanly route props between styles, components, and host DOM/Native attributes.

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

Owner note: the HTML and native implementations could diverge here.

Yes, they **must** diverge here, and diverging is a huge win for both sides:

| Target | Platform Reality | Optimal Architecture |
| --- | --- | --- |
| **Web (`@tamagui/web` / `html.*`)** | Browser has full CSSOM and CSS engine. | **Dynamic Cached CSSOM Discovery (0 KB)**.<br>Supports all 685 CSS properties automatically. |
| **Native (`@tamagui/core` / `View` / `Text`)** | Yoga has strict, finite layout properties.<br>Unknown props crash `RCTView`. | **Strict Static Yoga Table (~80 props)**.<br>Keeps native runtime safe and minimal. |
| **Server (Node SSR)** | Headless, no DOM, unconstrained bundle size. | **Comprehensive W3C Static Dictionary**.<br>Ensures perfect SSR atomic extraction. |

Previously, Tamagui forced one compromised table onto all platforms: Native was shipped web-only property names, while Web was burdened with static dictionary bloat and React Native quirk properties (`elevationAndroid`, `shadowOffset`, etc.). Splitting them fixes both.

---

## 6. Strategy 4: Strict `styled()` & DOM Attribute Whitelisting

Owner question: make styled more strict by requiring a whitelist for props outside the ones it already takes.

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
