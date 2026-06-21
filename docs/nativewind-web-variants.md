# NativeWind v5 web variants — investigation + deferred decision

Investigated 2026-06-21. Filed for future revisit when the v2 ship list narrows. Not on the v2-perf sprint.

## Top finding

**NativeWind v5 on web does nothing for `peer-*` / `has-*` / `not-*` / `nth-*`.** All four are pure Tailwind v4 ahead-of-time CSS, shipped as a static stylesheet, applied by the browser via standard className. The "v5 runtime" on web (`react-native-css/src/web/api.tsx`, ~120 lines) is a `useCssElement` wrapper that forwards `className` to react-native-web. Grepping the entire `src/web/` tree for `peer|has|nth|sibling` returns only `className: "style"` — there is no variant logic in NativeWind on web.

NativeWind's contribution to these variants on web is zero.

## Per-variant mechanism

Selectors captured from Tailwind v4's generated stylesheet at runtime:

| Variant | Generated CSS | Source |
|---|---|---|
| `peer-checked:text-red-500` | `&:is(:where(.peer):checked ~ *)` | Tailwind v4 |
| `has-[input:checked]:bg-yellow-200` | `&:has(:is(input:checked))` | Tailwind v4 |
| `not-[.dark]:text-green-500` | `&:not(:is(.dark))` | Tailwind v4 |
| `nth-[2n]:bg-gray-200` | `&:nth-child(2n)` | Tailwind v4 |

All four:
- Generated AOT by Tailwind v4 at build time (`@tailwindcss/vite` scans templates, emits exactly the selectors used)
- Shipped as a static stylesheet — no runtime JS interprets them
- Pure CSS selectors — the browser's CSS engine does all the matching

### How `peer-*` actually works

Sibling combinator. Pattern: `&:is(:where(.peer):checked ~ *)` — "match this element when an earlier sibling has class `.peer` and is `:checked`." Inherited CSS limitations: only matches forward (later siblings see the peer) and only within same parent.

## Real test results

Test harness at `~/tamagui-flat-styles/code/comparisons/nativewind-bench/src/variants.tsx`. Playwright driver hit `peer-checked`, `has-[input:checked]`, `not-[.dark]`, `nth-[2n]`. **13/13 assertions passed** including checkbox-toggle round-tripping (peer/has fire and revert) and `:not(.dark)` confirming element-itself test (NOT ancestor).

## Native fallback handling

NativeWind's native compiler (`react-native-css/src/compiler/selectors.ts`, 505 lines) walks the lightningcss AST and produces a JSON stylesheet. Unsupported selector forms (sibling combinators, `:has`, `:nth-child`) are simply not converted to `ClassNameSelector` — they fall through with no error, no warning. On native the variant becomes a no-op. NativeWind's own answer for sibling tracking on native is "lift to state."

## Strategic read for Tamagui

Cost to ship these on web is near zero — Tamagui already has a static CSS extractor. The work is "add prop-level syntax that emits the right selector at build time"; the browser does the rest.

Three options for exposing them:

```tsx
// Option A — prop style (matches existing $hover/$press)
<View peerChecked={{ color: '$red10' }} />

// Option B — namespace style (matches existing $group-row-hover)
<View $peer-checked={{ color: '$red10' }} />

// Option C — already works in tw-mode if tailwind classes pass through
<View className="peer-checked:text-red-500" />
```

Option C may already work in flat-styles `tw-mode` since Tailwind classes pass straight to Tailwind v4. Worth a `curl` check before designing A/B.

### Per-variant value call (2026)

- **`peer-*` and `has-*`** — ship on web. Real ergonomic wins (checkbox-toggle UI, "parent reacts to child" patterns). Cheap to extract. Native: lift to state (same as NW).
- **`not-*`** — cheap polish for dark-mode escape hatches.
- **`nth-*`** — defer. Everyone reaches for `index % 2` in JS now. Saves almost nothing over `index === 1 && className=...`.
- **Native parity for any of these** — not worth the engineering. Sibling/has tracking in JS = expensive + rare demand.

## Source citations

- NativeWind v5 web entry: `~/github/nativewind/src/index.tsx` (re-exports from `react-native-css`)
- NativeWind v5 tailwind plugin (native `@map` only): `~/github/nativewind/src/plugin.tsx:10-48`
- react-native-css web runtime: `~/github/react-native-css/src/web/api.tsx:38-69`
- react-native-css web View wrapper: `~/github/react-native-css/src/components/View.tsx:11-22`
- Native compiler entry: `~/github/react-native-css/src/compiler/compiler.ts:46+`
- Native selectors (no `:has`/`:nth-child` support): `~/github/react-native-css/src/compiler/selectors.ts`
- Test harness: `~/tamagui-flat-styles/code/comparisons/nativewind-bench/src/variants.tsx` + `variants.html`
- Test driver: `/tmp/variants-test.mjs`

## Decision (2026-06-21)

Deferred. The v2-perf round already won on the headline coverage + bench numbers without these. Revisit when (a) someone asks for them, (b) the v2 ship list has bandwidth, or (c) we're sweeping the tw-mode parser for full Tailwind feature parity. If picked up, start with Option C verification (cheap) before building Option A/B.
