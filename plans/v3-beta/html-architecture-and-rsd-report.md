# Tamagui V3: Web-First Architecture, React Strict DOM Comparison, and Component Kit Separation

Authored 2026-09-14 for Nate.

---

## 1. Executive Summary

This report delivers the analysis and architecture proposals requested regarding:
1. **React Strict DOM (RSD) vs Tamagui `html.*`**: An exact comparison of prop contracts, missing properties, compile-time diagnostics, and styling capabilities.
2. **Web-Aligned `html.*` Contract**: Eliminating `elevation` (since Android New Architecture supports `boxShadow`), deprecating React Native proprietary keys (`writingDirection`, `textAlignVertical`, `includeFontPadding`), and establishing a clean separation where `View`/`Text` remain React Native-aligned while `html.*` is 100% web-aligned.
3. **Incremental `--to-html` Migration**: A dedicated, file-by-file codemod enabling developers to convert `View`/`Text` components to `html.div`/`html.span` at their own pace.
4. **Package Architecture**: Separating the 50+ UI primitives into a standalone `@tamagui/components` package, establishing `@tamagui/web` as the first-class styling foundation, and keeping the monolithic `tamagui` package strictly for backwards compatibility.
5. **CSS Grid on Native Runtime**: Key takeaways from the Claude Opus CSS Grid research.

---

## 2. React Strict DOM (RSD) vs Tamagui `html.*`: Detailed Parity & Comparison

Tamagui already maintains an exhaustive conformance suite in `code/core/dom` pinned against Meta's `react-strict-dom@0.0.55`.

### A. What Props RSD Has That Tamagui Omitted (And Why)

| RSD Feature / Prop | RSD Behavior | Tamagui `html.*` Position | Rationale |
| --- | --- | --- | --- |
| `data-layoutconformance` | Escape hatch to opt native subtree into W3C layout | **Omitted** | Tamagui targets one unified layout model everywhere; an ad-hoc migration toggle is unnecessary. |
| `selected` on `html.option` | Accepted in allowlist, untyped | **Omitted** | React warns on `selected` on options (steering developers to `value`/`defaultValue` on `<select>`). |
| `onSelectionChange` | Typed on `input` and `textarea`, warns as unsupported on native | **Omitted** | Not a standard React DOM event; does nothing on web and warns on native. |
| Function children (`children={(props) => ...}`) | Passes native resolved props to a render function | **Omitted** | Leaks private native implementation details and breaks static compiler text hoisting. |
| Universal text props on void elements (`autoCapitalize`, `inputMode` on `div`) | Typed on every single element | **Restricted to `input` / `textarea`** | Declaring text-entry props on `div` or `article` has zero effect; typing them only creates false affordances. |
| `children` on void elements (`br`, `hr`, `img`) | Types children as `ReactNode` on void elements | **Typed as `never`** | Nesting children in void tags is invalid HTML and fails on native. Tamagui flags this at compile time. |

### B. What Tamagui Has That RSD Lacks

1. **Flat Values & Conditional Strings**: Tamagui accepts responsive and theme-driven conditional strings directly (`bg="background hover:background-hover"`, `p="4 sm:6 lg:8"`), which compile to atomic CSS or evaluate at runtime. RSD requires verbose `stylex.create` objects.
2. **Shorthand Props**: Tamagui supports ergonomic shorthands (`mx`, `my`, `px`, `py`, `gap`, `bg`, `w`, `h`, `f`, `ai`, `jc`). This makes migrating React Native developers feel natural while outputting standard CSS logical properties (`marginBlock`, `marginInline`).
3. **Multi-Value CSS Shorthands**: Tamagui supports standard CSS strings (`margin: "10px 20px"`, `border: "1px solid var(--border)"`, `boxShadow: "0 2px 4px rgba(0,0,0,0.1)"`).
4. **Compile-Time Diagnostics vs Silent Failure**:
   - If a tag cannot be supported on native (e.g. `select`, `option`), Tamagui produces a clear compile-time error naming the tag. RSD silently renders a blank `View` or `Text` with no picker behavior.
   - Invalid nesting (e.g. interactive elements inside buttons) is caught by Tamagui at build time.
5. **Universal Resets**: RSD relies on the host browser stylesheet for tag defaults (bold headers, monospace code), meaning a CSS reset strips them on web while native stays styled. Tamagui injects consistent, identical element defaults on both web and native.
6. **Optimizing Compiler (`@tamagui/static`)**: Flattens DOM trees, extracts styles into atomic CSS sheets, and removes runtime JS overhead. RSD relies on StyleX, which does not flatten component trees.

---

## 3. Style Props Contract: React Native Base vs Web-First HTML

Nate's intuition is spot-on:
- **`View` and `Text`**: Keep aligned with React Native base props (`ViewStyle`, `TextStyle`). This preserves 100% drop-in compatibility for existing React Native and Tamagui V1/V2 apps.
- **`html.*` Primitives (`html.div`, `html.span`, `html.article`, etc.)**: 100% web-aligned contract.

### Changes Implemented & Proposed for `html.*`:

1. **Remove `elevation` on HTML elements**:
   - Android New Architecture (RN 0.81+) has native support for `boxShadow`.
   - `boxShadow` is the standard web property. If an author wants Android-only material elevation, they can use `<View elevation={4} />` or a native platform override.
2. **Deprecate React Native Proprietary Keys on HTML styles**:
   - `writingDirection`: Deprecated in favor of standard CSS `direction: 'ltr' | 'rtl'`.
   - `textAlignVertical`: Deprecated in favor of standard CSS `verticalAlign` (inline) or flex `alignItems` (container).
   - `includeFontPadding`: Deprecated/omitted (CSS uses font bounding metrics).
   - `marginHorizontal` / `marginVertical`: Deprecated in favor of `marginInline` / `marginBlock` (or shorthands `mx` / `my`).
   - Legacy 4-part shadows (`shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`): Deprecated in favor of single `boxShadow` strings.
3. **Handling `direction` vs Variant Collisions**:
   - `direction` is occasionally used as a component variant prop (e.g. `direction="horizontal" | "vertical"`).
   - Because `html.*` is a pure DOM element without opinionated default variants, `direction="ltr" | "rtl"` maps cleanly to the CSS `direction` style property.
   - For custom components built with `styled()`, variant definitions take precedence over style props as they always have in Tamagui.

---

## 4. The `--to-html` Incremental Migration Codemod

Rather than a global, risky repository-wide transform, provide an isolated, file-by-file codemod:

```bash
# Run dry-run report on a single file or directory
npx tamagui migrate --to-html src/components/Card.tsx

# Apply changes in place
npx tamagui migrate --to-html --write src/components/Card.tsx
```

### What the Codemod Transforms:
1. **Imports**:
   - `import { View, Text } from 'tamagui'` -> `import { html } from 'tamagui'` (or `@tamagui/web`).
2. **JSX Elements**:
   - `<View>` -> `<html.div>` (or `<html.section>`, `<html.nav>` based on heuristics or comments).
   - `<Text>` -> `<html.span>` or `<html.p>`.
3. **Property Rewrites**:
   - `marginHorizontal` -> `marginInline` (or `mx` if project uses shorthands).
   - `marginVertical` -> `marginBlock` (or `my`).
   - `paddingHorizontal` -> `paddingInline` (or `px`).
   - `paddingVertical` -> `paddingBlock` (or `py`).
   - `numberOfLines={2}` -> `lineClamp={2}` (or `style={{ WebkitLineClamp: 2 }}`).
   - `elevation={4}` -> `boxShadow="0 2px 4px rgba(0,0,0,0.15)"`.
   - `shadowColor/Offset/Opacity/Radius` -> consolidated into a single `boxShadow` string.
4. **Safety Guarantee**:
   - Any component containing custom ref callbacks, animated driver bindings, or React Native-specific event handlers (`onResponderMove`) is flagged in the dry-run report and skipped unless forced.

---

## 5. Package Architecture: First-Class Web & Component Kit Separation

Currently, the monorepo has:
- `@tamagui/web`: The core styling engine (`styled`, `createComponent`, themes, tokens, `@tamagui/web/dom`).
- `@tamagui/core`: Re-exports `@tamagui/web` and adds RN `View`/`Text` types.
- `@tamagui/ui`: Unstyled behavior-first UI primitives.
- `tamagui`: The monolithic package re-exporting `@tamagui/core` + 50 styled UI components (`Button`, `Sheet`, `Select`, `Dialog`, etc.).

### The Problem:
- Developers who just want the style system install `tamagui` and get 50 component dependencies they don't use.
- The documentation mixes basic styling with complex composite components, muddying the mental model.
- Bundle sizes for minimal web apps are larger than necessary unless tree-shaking is flawless.

### The New Architecture:

```
┌───────────────────────────────────────────────────────────────┐
│                    tamagui (Metapackage)                      │
│            Backwards-compatible convenience bundle            │
│       Re-exports: @tamagui/core + @tamagui/components        │
└───────────────┬───────────────────────────────┬───────────────┘
                │                               │
                ▼                               ▼
┌───────────────────────────────┐ ┌─────────────────────────────┐
│       @tamagui/core           │ │    @tamagui/components      │
│  React Native compatibility   │ │   Full UI Component Kit     │
│    Typed View, Text, Stacks   │ │  Button, Dialog, Sheet, etc.│
└───────────────┬───────────────┘ └─────────────┬───────────────┘
                │                               │
                ▼                               │
┌───────────────────────────────┐               │
│       @tamagui/web            │◄──────────────┘
│  Universal Style Engine       │
│  html.* primitives, styled()  │
│  Tokens, Themes, CSS Compiler │
└───────────────────────────────┘
```

### The Three Tiers:

1. **Tier 1: `@tamagui/web` (Universal Style Foundation)**
   - First-class styling engine for web and modern cross-platform apps.
   - Exports: `html.*`, `styled()`, `createTamagui()`, `Theme`, `useTheme()`, `useMedia()`.
   - Zero React Native dependencies. Compiles to atomic CSS on web and optimized views on native.

2. **Tier 2: `@tamagui/core` (Cross-Platform / React Native Layer)**
   - Extends `@tamagui/web` with classic React Native components: `View`, `Text`, `XStack`, `YStack`, `ZStack`.
   - For teams migrating from React Native or building cross-platform apps with standard RN primitives.

3. **Tier 3: `@tamagui/components` (The Component Kit)**
   - Independent package containing all 50+ styled, accessible UI components: `Button`, `Dialog`, `Sheet`, `Select`, `Tabs`, `Accordion`, `Input`, `Slider`, `Toast`, etc.
   - Built on top of `@tamagui/web` (or `@tamagui/core`), fully decoupled from the core style package.

4. **Tier 4: `tamagui` (Backwards-Compatibility Umbrella)**
   - Re-exports `@tamagui/core` and `@tamagui/components`. Existing projects upgrading from v1/v2 continue to work with zero import changes.

### Documentation Restructuring:
- **Core / Style Docs**: Focus on `@tamagui/web` (or `@tamagui/core`) as the style foundation.
- **Component Docs**: Positioned as `@tamagui/components`, showing clean imports (`import { Dialog } from '@tamagui/components'`).

---

## 6. CSS Grid on Native Runtime (Key Findings from Opus Research)

The Claude Opus worker (`m14461`) completed an exhaustive investigation of CSS Grid on React Native and Yoga. Key takeaways:

1. **Upstream Status**:
   - Yoga CSS Grid Part 1 (types only) was merged in March 2026.
   - Parts 2–9 (layout algorithm, auto-placement, bindings) remain unmerged in open PRs.
   - Stock React Native main rejects `display: "grid"` and silently degrades to a flex column with a console warning.
   - First Yoga Grid release will defer `repeat()`, `auto-fit`, `auto-fill`, and shorthands.

2. **Tamagui Runtime Emulation**:
   - A bounded runtime emulation inside Tamagui's native runtime can reproduce the most common grid patterns (`repeat(N, 1fr)`, gaps, `span k`, full-width rows) with **0.29px accuracy** against Yoga.
   - Uses negative-margin flex-wrap wrapping with percentage-calculated cell widths (`width: (100 * span / N - 0.001)%`).
   - Overhead: **Zero for non-grid components** (single `display` property check). For grid containers, processing takes ~0.19ms for 30 items.
   - Multi-value margin/padding already expands on native at near-zero cost (<1µs). One bug found: `gap: "10px 20px"` was not expanded, which is a one-line fix.
   - Recommendation: Implement the Tier-1 emulation in Tamagui's native runtime so `display: "grid"` works out of the box instead of silently breaking on iOS and Android.

---

## 7. Next Actions

1. **Add `@deprecated` tags to RN props in `code/core/web/src/dom/styleTypes.ts`** (`elevation`, `writingDirection`, `marginHorizontal/Vertical`, `shadow*`).
2. **Implement `--to-html` sub-command** in `@tamagui/cli` or `@tamagui/codemod-flat-values` for safe single-file conversions.
3. **Register / scaffold `@tamagui/components`** package in `code/ui` re-exporting the component suite.
4. **Implement Tier-1 Grid runtime emulation** and fix the `gap: "10px 20px"` expansion.
