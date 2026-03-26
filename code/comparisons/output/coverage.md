# CSS Utility Coverage Comparison

✅ Full | ⚠️ Partial | 🌐 Web-only | ❌ None

## Summary

| Framework | Full | Partial | Web-only | None | Total | Coverage % |
|-----------|------|---------|----------|------|-------|------------|
| **tamagui** | 85 | 2 | 7 | 44 | 138 | 64.9% |
| **tailwind** | 132 | 0 | 0 | 6 | 138 | 95.7% |
| **nativewind** | 71 | 25 | 38 | 4 | 138 | 74.3% |
| **uniwind** | 51 | 11 | 0 | 76 | 138 | 40.9% |

## Layout

| Utility | Tamagui | Tailwind | NativeWind | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **display** | ✅ | ✅ | ⚠️ | ⚠️ | RN only supports flex natively |
| **position** | ✅ | ✅ | ⚠️ | ⚠️ | RN lacks fixed/sticky |
| **top/right/bottom/left** | ✅ | ✅ | ✅ | ✅ |  |
| **inset** | ✅ | ✅ | ✅ | ✅ |  |
| **z-index** | ✅ | ✅ | ✅ | ✅ |  |
| **overflow** | ✅ | ✅ | ✅ | ⚠️ |  |
| **aspect-ratio** | ✅ | ✅ | ✅ | ✅ |  |
| **box-sizing** | ✅ | ✅ | ⚠️ | ⚠️ |  |
| **isolation** | ✅ | ✅ | 🌐 | ❌ |  |
| **visibility** | ❌ | ✅ | ⚠️ | ❌ | Tamagui uses opacity/display instead |
| **float** | ❌ | ✅ | 🌐 | ❌ | Not applicable to RN flexbox model |
| **clear** | ❌ | ✅ | 🌐 | ❌ |  |
| **columns** | ⚠️ | ✅ | 🌐 | ❌ |  |
| **object-fit** | ❌ | ✅ | ✅ | ❌ | Tamagui uses Image resizeMode |
| **object-position** | ❌ | ✅ | ⚠️ | ❌ |  |

## Flexbox

| Utility | Tamagui | Tailwind | NativeWind | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **flex-direction** | ✅ | ✅ | ✅ | ✅ |  |
| **flex-wrap** | ✅ | ✅ | ✅ | ✅ |  |
| **flex** | ✅ | ✅ | ⚠️ | ⚠️ | RN flex only takes a single number |
| **flex-grow** | ✅ | ✅ | ✅ | ✅ |  |
| **flex-shrink** | ✅ | ✅ | ✅ | ✅ |  |
| **flex-basis** | ✅ | ✅ | ✅ | ⚠️ |  |
| **justify-content** | ✅ | ✅ | ✅ | ✅ |  |
| **align-items** | ✅ | ✅ | ✅ | ✅ |  |
| **align-self** | ✅ | ✅ | ✅ | ✅ |  |
| **align-content** | ✅ | ✅ | ✅ | ✅ |  |
| **gap** | ✅ | ✅ | ✅ | ✅ |  |
| **order** | ✅ | ✅ | 🌐 | ❌ |  |

## Grid

| Utility | Tamagui | Tailwind | NativeWind | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **grid-template-columns** | 🌐 | ✅ | 🌐 | ❌ |  |
| **grid-column** | 🌐 | ✅ | 🌐 | ❌ |  |
| **grid-row** | 🌐 | ✅ | 🌐 | ❌ |  |
| **grid-template-areas** | 🌐 | ✅ | 🌐 | ❌ |  |
| **grid-auto-flow** | ❌ | ✅ | 🌐 | ❌ |  |
| **place-content/items/self** | ❌ | ✅ | 🌐 | ❌ |  |

## Spacing

| Utility | Tamagui | Tailwind | NativeWind | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **padding** | ✅ | ✅ | ✅ | ✅ |  |
| **margin** | ✅ | ✅ | ✅ | ✅ |  |
| **padding-block/inline (logical)** | ✅ | ✅ | ⚠️ | ❌ |  |
| **margin-block/inline (logical)** | ✅ | ✅ | ⚠️ | ❌ |  |
| **space-between** | ❌ | ✅ | ✅ | ✅ | Tamagui uses gap instead |

## Sizing

| Utility | Tamagui | Tailwind | NativeWind | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **width** | ✅ | ✅ | ✅ | ✅ |  |
| **height** | ✅ | ✅ | ✅ | ✅ |  |
| **min-width / max-width** | ✅ | ✅ | ✅ | ✅ |  |
| **min-height / max-height** | ✅ | ✅ | ✅ | ✅ |  |
| **inline-size / block-size** | ✅ | ✅ | ❌ | ❌ |  |

## Typography

| Utility | Tamagui | Tailwind | NativeWind | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **font-family** | ✅ | ✅ | ✅ | ✅ |  |
| **font-size** | ✅ | ✅ | ✅ | ✅ |  |
| **font-weight** | ✅ | ✅ | ✅ | ✅ |  |
| **font-style** | ✅ | ✅ | ✅ | ✅ |  |
| **color** | ✅ | ✅ | ✅ | ✅ |  |
| **text-align** | ✅ | ✅ | ✅ | ✅ |  |
| **text-transform** | ✅ | ✅ | ✅ | ✅ |  |
| **text-decoration** | ✅ | ✅ | ✅ | ⚠️ |  |
| **letter-spacing** | ✅ | ✅ | ✅ | ✅ |  |
| **line-height** | ✅ | ✅ | ✅ | ✅ |  |
| **line-clamp** | ✅ | ✅ | ✅ | ❌ |  |
| **white-space** | ✅ | ✅ | 🌐 | ❌ |  |
| **word-break** | ✅ | ✅ | 🌐 | ❌ |  |
| **text-overflow** | ❌ | ✅ | ⚠️ | ❌ | Tamagui uses numberOfLines prop |
| **text-indent** | ❌ | ✅ | 🌐 | ❌ |  |
| **vertical-align** | ✅ | ✅ | 🌐 | ❌ |  |
| **font-variant-numeric** | ⚠️ | ✅ | ⚠️ | ❌ |  |
| **text-shadow** | ✅ | ✅ | ❌ | ❌ |  |

## Backgrounds

| Utility | Tamagui | Tailwind | NativeWind | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **background-color** | ✅ | ✅ | ✅ | ✅ |  |
| **background-image** | 🌐 | ✅ | 🌐 | ❌ |  |
| **background-position** | ❌ | ✅ | 🌐 | ❌ |  |
| **background-size** | ❌ | ✅ | 🌐 | ❌ |  |
| **background-repeat** | ❌ | ✅ | 🌐 | ❌ |  |
| **background-clip** | ❌ | ✅ | 🌐 | ❌ |  |

## Borders

| Utility | Tamagui | Tailwind | NativeWind | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **border-width** | ✅ | ✅ | ✅ | ✅ |  |
| **border-color** | ✅ | ✅ | ✅ | ✅ |  |
| **border-style** | ✅ | ✅ | ✅ | ⚠️ |  |
| **border-radius** | ✅ | ✅ | ✅ | ✅ |  |
| **border-width (logical)** | ✅ | ✅ | ⚠️ | ❌ |  |
| **outline** | ✅ | ✅ | ✅ | ❌ |  |
| **ring** | ❌ | ✅ | ✅ | ✅ | Tamagui can achieve this with boxShadow |
| **divide** | ❌ | ✅ | ✅ | ❌ |  |

## Effects

| Utility | Tamagui | Tailwind | NativeWind | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **opacity** | ✅ | ✅ | ✅ | ✅ |  |
| **box-shadow** | ✅ | ✅ | ⚠️ | ⚠️ | RN shadow implementation differs from CSS |
| **mix-blend-mode** | 🌐 | ✅ | 🌐 | ❌ |  |
| **cursor** | ✅ | ✅ | 🌐 | ❌ |  |
| **pointer-events** | ✅ | ✅ | ✅ | ❌ |  |
| **user-select** | ✅ | ✅ | 🌐 | ❌ |  |

## Filters

| Utility | Tamagui | Tailwind | NativeWind | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **filter (blur, brightness, etc)** | 🌐 | ✅ | 🌐 | ❌ |  |
| **backdrop-filter** | ❌ | ✅ | 🌐 | ❌ |  |

## Transforms

| Utility | Tamagui | Tailwind | NativeWind | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **transform** | ✅ | ✅ | ✅ | ✅ |  |
| **translate** | ✅ | ✅ | ✅ | ✅ |  |
| **scale** | ✅ | ✅ | ✅ | ✅ |  |
| **rotate** | ✅ | ✅ | ✅ | ✅ |  |
| **skew** | ✅ | ✅ | ✅ | ✅ |  |
| **transform-origin** | ✅ | ✅ | ✅ | ❌ |  |
| **perspective** | ✅ | ✅ | ⚠️ | ❌ |  |
| **backface-visibility** | ✅ | ✅ | ✅ | ❌ |  |

## Transitions & Animation

| Utility | Tamagui | Tailwind | NativeWind | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **animation** | ✅ | ✅ | ⚠️ | ⚠️ | Tamagui uses pluggable animation drivers (CSS, reanimated, motion, native) |
| **transition-property** | ❌ | ✅ | ⚠️ | ❌ | Tamagui animation driver handles this automatically |
| **transition-duration** | ❌ | ✅ | ⚠️ | ❌ |  |
| **transition-timing-function** | ❌ | ✅ | ⚠️ | ❌ | Tamagui configures this per-animation driver |
| **enter/exit styles** | ✅ | ❌ | ❌ | ❌ | Tamagui-specific: AnimatePresence + enterStyle/exitStyle |

## Interactive States

| Utility | Tamagui | Tailwind | NativeWind | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **hover** | ✅ | ✅ | ✅ | ❌ | Uniwind has no hover (mobile-focused) |
| **press / active** | ✅ | ✅ | ✅ | ✅ |  |
| **focus** | ✅ | ✅ | ✅ | ✅ |  |
| **focus-visible** | ✅ | ✅ | ⚠️ | ❌ |  |
| **focus-within** | ✅ | ✅ | 🌐 | ❌ |  |
| **disabled** | ✅ | ✅ | ✅ | ✅ |  |
| **group hover/press** | ❌ | ✅ | ✅ | ❌ | Tamagui uses group prop on parent + grouping |
| **peer variants** | ❌ | ✅ | ✅ | ❌ |  |

## Responsive & Media

| Utility | Tamagui | Tailwind | NativeWind | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **breakpoints** | ✅ | ✅ | ✅ | ✅ |  |
| **dark mode** | ✅ | ✅ | ✅ | ✅ |  |
| **combined media + pseudo** | ✅ | ✅ | ✅ | ❌ |  |
| **container queries** | ❌ | ✅ | ⚠️ | ❌ |  |
| **prefers-reduced-motion** | ❌ | ✅ | ⚠️ | ❌ |  |

## Platform

| Utility | Tamagui | Tailwind | NativeWind | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **web-specific styles** | ✅ | ✅ | ✅ | ✅ | Tailwind is web-only by default |
| **native-specific styles** | ✅ | ❌ | ✅ | ❌ |  |
| **ios-specific styles** | ✅ | ❌ | ✅ | ✅ |  |
| **android-specific styles** | ✅ | ❌ | ✅ | ✅ |  |
| **safe area insets** | ❌ | ❌ | ✅ | ✅ | Tamagui uses useSafeAreaInsets hook |

## Pseudo Elements

| Utility | Tamagui | Tailwind | NativeWind | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **::before / ::after** | ❌ | ✅ | ⚠️ | ❌ |  |
| **::placeholder** | ❌ | ✅ | ✅ | ❌ |  |
| **::selection** | ❌ | ✅ | 🌐 | ❌ |  |
| **first-child / last-child** | ❌ | ✅ | ✅ | ❌ |  |

## Tables

| Utility | Tamagui | Tailwind | NativeWind | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **border-collapse** | ❌ | ✅ | 🌐 | ❌ |  |
| **border-spacing** | ❌ | ✅ | 🌐 | ❌ |  |
| **table-layout** | ❌ | ✅ | 🌐 | ❌ |  |

## SVG

| Utility | Tamagui | Tailwind | NativeWind | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **fill** | ❌ | ✅ | ⚠️ | ❌ |  |
| **stroke** | ❌ | ✅ | ⚠️ | ❌ |  |
| **stroke-width** | ❌ | ✅ | ⚠️ | ❌ |  |

## Interactivity

| Utility | Tamagui | Tailwind | NativeWind | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **scroll-behavior** | ❌ | ✅ | 🌐 | ❌ |  |
| **scroll-snap** | ❌ | ✅ | 🌐 | ❌ |  |
| **touch-action** | ❌ | ✅ | 🌐 | ❌ |  |
| **resize** | ❌ | ✅ | 🌐 | ❌ |  |
| **appearance** | ❌ | ✅ | 🌐 | ❌ |  |
| **caret-color** | ✅ | ✅ | ⚠️ | ❌ |  |
| **accent-color** | ❌ | ✅ | 🌐 | ❌ |  |
| **will-change** | ❌ | ✅ | 🌐 | ❌ |  |

## Accessibility

| Utility | Tamagui | Tailwind | NativeWind | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **sr-only** | ❌ | ✅ | ✅ | ❌ |  |
| **forced-color-adjust** | ❌ | ✅ | 🌐 | ❌ |  |

## Design Tokens & Theming

| Utility | Tamagui | Tailwind | NativeWind | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **design tokens** | ✅ | ✅ | ✅ | ✅ |  |
| **theme switching** | ✅ | ✅ | ✅ | ✅ | Tamagui has nested theme support with sub-themes |
| **sub-themes / component themes** | ✅ | ❌ | ❌ | ⚠️ | Tamagui unique: deeply nested component-aware themes |
| **arbitrary values** | ✅ | ✅ | ✅ | ❌ |  |
