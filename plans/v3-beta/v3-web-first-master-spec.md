# Tamagui V3: Web-First Master Architecture & Technical Resolutions

> **Author**: Antigravity (Tamagui V3 Manager)  
> **Date**: 2026-09-14  
> **Status**: Final Master Spec & Opus Review Brief  
> **Branch**: `origin/v3-beta`  

---

## 1. Executive Summary & The Web-First Vision

Tamagui V3 establishes a unified, high-performance styling architecture that brings web standards to the forefront while preserving 100% interoperability with the React Native ecosystem.

Historically, universal UI libraries forced a compromise: either accept React Native's limited style prop naming (`marginHorizontal`, `writingDirection`, `elevation`) across all platforms, or invent proprietary wrappers that fail to interoperate with existing ecosystems.

In Tamagui V3, we establish a clean, uncompromising **Two-Tier Contract**:

1. **`View` and `Text` (Pure React Native Contract)**:
   - Preserves 100% alignment with React Native's base prop surface (`writingDirection`, `elevation`, `marginHorizontal`, `marginVertical`, `numberOfLines`, etc.).
   - **No deprecation warnings**: Code written for React Native remains clean, idiomatic, and warning-free.
2. **`html.*` (`html.div`, `html.span`, `html.p`, etc.) (Clean W3C Web Contract)**:
   - 100% aligned with W3C web CSS styling and DOM attributes (`direction: 'ltr' | 'rtl'`, `boxShadow`, `marginInline`, `marginBlock`, `verticalAlign`, `accentColor`, etc.).
   - Backed by native primitives (`View`, `Text`, `TextInput`) on iOS/Android via `@tamagui/dom`, matching or exceeding React Strict DOM (RSD) conformance without any runtime dependency on StyleX or Meta tooling.

---

## 2. Deep-Dive Answers to Open Technical Questions

### A. What is `data-layoutconformance` in React Strict DOM?

In React Strict DOM (RSD), `data-layoutconformance` is an opt-in escape hatch:
```tsx
<html.div data-layoutconformance="strict">...</html.div>
```

#### Why does Meta have it?
- Legacy React Native (Yoga) has historical differences from W3C Flexbox:
  - Default `flexDirection` in Yoga is `column`; CSS Flexbox is `row`.
  - Box sizing in Yoga has historically mimicked `border-box`, while standard CSS defaults to `content-box`.
  - Percentage dimensions, aspect ratios, and padding handling have had subtle differences across older Yoga versions.
- When Meta migrates massive brownfield surfaces (e.g., Facebook Marketplace, Ads Manager) from React Native to React Strict DOM, existing components often rely on legacy Yoga layout bugs or quirks.
- RSD uses `data-layoutconformance="strict"` on subtrees to tell the native layout runtime: *"Do not apply legacy React Native layout quirks here; enforce strict W3C Flexbox layout rules."*

#### Tamagui Resolution:
- **Omitted from Tamagui DOM contract**: Tamagui universal apps do not carry legacy Meta-specific brownfield layout splits. Tamagui targets a single, consistent layout model (`display: flex` defaults cleanly across web and native).

---

### B. Function Children (`children={(props) => ReactNode}`)

In RSD, components accept a function as children:
```tsx
<html.div width={300} height={200} aria-label="Interactive Map">
  {(nativeProps) => <NativeMapView {...nativeProps} />}
</html.div>
```

#### Why is this essential?
In the React Native ecosystem, many critical components come from 3rd-party libraries (e.g. `react-native-maps`, `react-native-video`, `react-native-camera`, native charts). These components:
1. Accept standard React Native props (`style: ViewStyle`, `onLayout`, native accessibility props).
2. Completely choke on web DOM attributes (`className`, `aria-label`, DOM event handlers).

If an author builds a universal screen with `html.div`, they cannot wrap a 3rd-party native component unless the container passes resolved native props down.

#### How Tamagui Adopts It:
In `createComponent.tsx`:
```tsx
if (typeof children === 'function') {
  // On web: passes { className, style, id, 'aria-label': ... }
  // On native: passes { style: resolvedNativeStyle, accessibilityLabel, onLayout, ... }
  return children(resolvedPlatformProps)
}
```
This enables zero-friction, 100% universal interop with any native library in the ecosystem.

---

### C. The CSS Reset Mystery: JavaScript vs CSS

Nate requested clarity on how Tamagui resets element styles compared to React Strict DOM, and whether resets belong in JavaScript or CSS.

#### 1. How Tamagui Works Today:
Tamagui currently handles resets in three distinct places:
1. **`@tamagui/dom` (JavaScript `defaultProps`)**:
   In `code/core/dom/scripts/generate-html.ts` and `src/tables/tags.ts`:
   ```ts
   export const DISPLAY_WEB_RESET = {
     block: { margin: 0, padding: 0 },
     inline: { margin: 0, padding: 0, textDecorationLine: 'none' },
     'inline-block': { margin: 0, padding: 0, borderStyle: 'solid' },
   }
   ```
   Every generated `<html.*>` component receives these resets in JS `defaultProps`.
2. **`createDesignSystem.ts` (Injected CSS Stylesheet)**:
   Injects zero-specificity rules for the core primitives:
   ```css
   :where(.is_View) {
     display: flex;
     align-items: stretch;
     flex-direction: column;
     flex-basis: auto;
     box-sizing: border-box;
     min-height: 0;
     min-width: 0;
     flex-shrink: 0;
   }
   :where(.is_Text) {
     display: inline;
     box-sizing: border-box;
     word-wrap: break-word;
     white-space: pre-wrap;
     margin: 0;
   }
   ```
3. **`code/core/web/reset.css` (Optional Static Stylesheet)**:
   Contains global rules like `* { box-sizing: border-box }` and `:where(p, input, textarea, button, ul, ol, li) { all: unset; box-sizing: border-box; }`.

#### 2. How React Strict DOM Works:
- RSD injects atomic StyleX classes on web for `margin: 0, padding: 0`.
- **The RSD Asymmetry**: For text formatting, RSD relies on the browser's user-agent stylesheet for web (e.g. `<b>` relies on browser bold, `<em>` relies on browser italic), but explicitly injects `fontWeight: 'bold'` on native!
- If an author uses a standard web CSS reset (e.g. Tailwind reset), RSD's `<b>` and `<h1>` elements lose their bolding on web while staying bold on native.

#### 3. The Recommended Architecture:
Putting `{ margin: 0, padding: 0 }` in JS `defaultProps` on every `html.*` component adds CPU overhead: every uncompiled component must process these props through `getSplitStyles` on every render.

**The Solution**: Move tag resets to zero-specificity CSS in `createDesignSystem.ts`:
```css
:where(div, p, span, h1, h2, h3, h4, h5, h6, ul, ol, li, a, button) {
  margin: 0;
  padding: 0;
  border-width: 0;
  border-style: solid;
  box-sizing: border-box;
}
```
- **0 JS runtime overhead**: No prop splitting or reconciliation in JS.
- **0 specificity (`:where(...)`)**: Any Tamagui style prop, atomic class, or custom class immediately overrides it.
- **Identical rendering**: Consistent baseline across web and native.

---

## 3. Package Architecture & Bundle Size Optimization

### The Four-Layer Package Strategy

```
┌────────────────────────────────────────────────────────┐
│                   tamagui                              │
│  (Backwards-compatible umbrella: core + UI + themes)   │
└───────────────────────────▲────────────────────────────┘
                            │
┌───────────────────────────┴────────────────────────────┐
│              @tamagui/ui (or /components)              │
│  (50+ unstyled primitives: Dialog, Popover, Sheet...)  │
└───────────────────────────▲────────────────────────────┘
                            │
┌───────────────────────────┴────────────────────────────┐
│                   @tamagui/core                        │
│  (React Native bridge: View, Text, RN types, Pan)      │
└───────────────────────────▲────────────────────────────┘
                            │
┌───────────────────────────┴────────────────────────────┐
│                   @tamagui/web                         │
│  (Ultra-light web styling engine: getSplitStyles, html)│
└────────────────────────────────────────────────────────┘
```

1. **`tamagui`**: Monolithic package maintained for backward compatibility. Re-exports `@tamagui/core`, `@tamagui/ui`, and default themes.
2. **`@tamagui/ui` (or `@tamagui/components`)**: Intermediate package containing all 50+ UI primitives (Accordion, Alert Dialog, Button, Card, Dialog, Popover, Select, Sheet, Tabs, etc.). Does NOT force `@tamagui/core` down consumers' throats.
3. **`@tamagui/core`**: The React Native bridge. Holds `View`, `Text`, React Native prop tables (`elevation`, `marginHorizontal`), and native responder/gesture bindings.
4. **`@tamagui/web`**: Pure, lightweight web-first styling engine (`getSplitStyles`, `createComponent`, atomic CSS caching, media queries, `html.*`).

---

### Slimming `@tamagui/web`: The Hard Numbers

Empirical audit (`bundle-size-ledger.md` & `web-core-split.md`) measured the gzip impact of slimming `@tamagui/web`:

| Component / Layer | Baseline | Optimization | Savings (Gzip) |
| :--- | :--- | :--- | :--- |
| **Valid Style Props Table** | ~7.2 KB (685 static keys) | Dynamic CSSOM Discovery (`styleCache.get`) | **-1,060 B** (and 2.28× faster) |
| **React Native Prop Tables** | RN-specific mappings | Moved to `@tamagui/core` | **-320 B** |
| **Variants Runtime** | Built-in variants engine | Extracted to `@tamagui/variants` carrier | **-806 B** |
| **Element Layout Hook** | `use-element-layout` | Moved to `@tamagui/core` | **-1,313 B** |
| **Pseudo-State Listeners** | JS hover/press listeners | Pure CSS for class-emitting elements | **-801 B** |
| **Total Target Web Bundle** | **26.88 kB gzip** | Fully trimmed `@tamagui/web` | **~19.46 kB gzip (-28%)** |

#### Dynamic CSSOM Discovery Benchmark Results (700,000 lookups):
- Static dictionary lookup: `21.86 ns/op` (~7 KB static bundle weight)
- Direct un-cached DOM probe: `115.00 ns/op`
- **Cached DOM lookup (`styleCache.get(prop)`): `9.57 ns/op` (2.28× FASTER, 0 KB bundle weight)**!

---

## 4. Incremental `--to-html` Codemod Specification

To allow developers to incrementally adopt `html.*` file-by-file without breaking existing codebases, we specify a standalone codemod:

```bash
bun tamagui codemod to-html ./src/features/dashboard/Header.tsx
```

### Transform Rules:
1. **Element Mapping**:
   - `View` -> `html.div`
   - `Text` -> `html.span` (or `html.p` if block text)
2. **Prop Mapping**:
   - `writingDirection: 'ltr' | 'rtl'` -> `direction: 'ltr' | 'rtl'`
   - `marginHorizontal: X` -> `marginInline: X`
   - `marginVertical: Y` -> `marginBlock: Y`
   - `paddingHorizontal: X` -> `paddingInline: X`
   - `paddingVertical: Y` -> `paddingBlock: Y`
   - `elevation: N` -> `boxShadow: '...'` (matching Material elevation specs)
3. **Import Updates**:
   - Updates imports: `import { View, Text } from 'tamagui'` -> `import { html } from 'tamagui'` (or `@tamagui/core`).

---

## 5. CSS Grid Native Runtime Strategy

Based on Opus research in `plans/v3-beta/grid-native-runtime-report.md`:
1. **Tier 1 (Universal Flexbox Emulation)**:
   - Covers 90% of UI grids: `gridTemplateColumns="repeat(N, 1fr)"` and `gap={X}`.
   - Compiles down to flex-wrap containers with computed percentage widths (`width: calc(100% / N - gap)`).
   - Zero native runtime dependencies; works immediately on all iOS/Android engines.
2. **Tier 2 (Yoga Grid Bridge)**:
   - Modern Yoga layout engines (RN 0.74+) include experimental CSS Grid support.
   - Wire native Yoga grid properties directly where supported, falling back gracefully to Flexbox emulation.

---

## 6. Review Brief & Handoff to Claude Opus

We hand this specification to the Claude Opus reviewer agent with the following specific review instructions:

1. **Validate Dynamic CSSOM Discovery**:
   - Confirm SSR/hydration safety for `styleCache.get(prop)` when DOM is not available during server-side rendering.
2. **Validate Zero-Specificity CSS Resets**:
   - Confirm that `:where(...)` reset rules in `createDesignSystem.ts` cleanly override browser user-agent stylesheets without leaking into third-party non-Tamagui elements.
3. **Review Package Boundary Mechanics**:
   - Verify that `@tamagui/web` can export `html.*` and the style engine without creating circular dependencies when `@tamagui/core` re-exports it.
