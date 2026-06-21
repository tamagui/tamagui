# CSS Utility Coverage Comparison

✅ Full | ⚠️ Partial | 🌐 Web-only | ❌ None

## Summary

| Framework | Full | Partial | Web-only | None | Total | Coverage % |
|-----------|------|---------|----------|------|-------|------------|
| **tamagui** | 85 | 4 | 19 | 34 | 142 | 68.0% |
| **tailwind** | 0 | 0 | 136 | 6 | 142 | 47.9% |
| **nativewind** | 82 | 17 | 40 | 3 | 142 | 77.8% |
| **uniwind** | 51 | 16 | 0 | 75 | 142 | 41.5% |

## Layout

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **display** | ✅ | 🌐 | ⚠️ | ⚠️ | RN only supports flex natively |
| **position** | ✅ | 🌐 | ⚠️ | ⚠️ | RN lacks fixed/sticky |
| **top/right/bottom/left** | ✅ | 🌐 | ✅ | ✅ |  |
| **inset** | ✅ | 🌐 | ✅ | ✅ |  |
| **z-index** | ✅ | 🌐 | ✅ | ✅ |  |
| **overflow** | ✅ | 🌐 | ✅ | ⚠️ |  |
| **aspect-ratio** | ✅ | 🌐 | ✅ | ✅ |  |
| **box-sizing** | ✅ | 🌐 | ⚠️ | ⚠️ |  |
| **isolation** | ✅ | 🌐 | 🌐 | ❌ |  |
| **visibility** | ❌ | 🌐 | ⚠️ | ❌ | Tamagui uses opacity/display instead |
| **float** | ❌ | 🌐 | 🌐 | ❌ | Not applicable to RN flexbox model |
| **clear** | ❌ | 🌐 | 🌐 | ❌ |  |
| **columns** | ⚠️ | 🌐 | 🌐 | ❌ |  |
| **object-fit** | 🌐 | 🌐 | ✅ | ❌ | Also available as Image resizeMode on native |
| **object-position** | 🌐 | 🌐 | ⚠️ | ❌ |  |

## Flexbox

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **flex-direction** | ✅ | 🌐 | ✅ | ✅ |  |
| **flex-wrap** | ✅ | 🌐 | ✅ | ✅ |  |
| **flex** | ✅ | 🌐 | ⚠️ | ⚠️ | RN flex only takes a single number |
| **flex-grow** | ✅ | 🌐 | ✅ | ✅ |  |
| **flex-shrink** | ✅ | 🌐 | ✅ | ✅ |  |
| **flex-basis** | ✅ | 🌐 | ✅ | ⚠️ |  |
| **justify-content** | ✅ | 🌐 | ✅ | ✅ |  |
| **align-items** | ✅ | 🌐 | ✅ | ✅ |  |
| **align-self** | ✅ | 🌐 | ✅ | ✅ |  |
| **align-content** | ✅ | 🌐 | ✅ | ✅ |  |
| **gap** | ✅ | 🌐 | ✅ | ✅ |  |
| **order** | ✅ | 🌐 | 🌐 | ❌ |  |

## Grid

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **grid-template-columns** | 🌐 | 🌐 | 🌐 | ❌ |  |
| **grid-column** | 🌐 | 🌐 | 🌐 | ❌ |  |
| **grid-row** | 🌐 | 🌐 | 🌐 | ❌ |  |
| **grid-template-areas** | 🌐 | 🌐 | 🌐 | ❌ |  |
| **grid-auto-flow** | ❌ | 🌐 | 🌐 | ❌ |  |
| **place-content/items/self** | ❌ | 🌐 | 🌐 | ❌ |  |

## Spacing

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **padding** | ✅ | 🌐 | ✅ | ✅ |  |
| **margin** | ✅ | 🌐 | ✅ | ✅ |  |
| **padding-block/inline (logical)** | ✅ | 🌐 | ✅ | ❌ | NativeWind v5 maps ps/pe to RN paddingStart/End (RTL aware) |
| **margin-block/inline (logical)** | ✅ | 🌐 | ✅ | ❌ | NativeWind v5 maps ms/me to RN marginStart/End (RTL aware) |
| **space-between** | ❌ | 🌐 | ✅ | ✅ | Tamagui uses gap instead |

## Sizing

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **width** | ✅ | 🌐 | ✅ | ✅ |  |
| **height** | ✅ | 🌐 | ✅ | ✅ |  |
| **min-width / max-width** | ✅ | 🌐 | ✅ | ✅ |  |
| **min-height / max-height** | ✅ | 🌐 | ✅ | ✅ |  |
| **size (width + height)** | ⚠️ | 🌐 | ✅ | ⚠️ | Tailwind v4 / NativeWind v5 size-* sets width+height together; Tamagui uses separate $w/$h |
| **inline-size / block-size** | ✅ | 🌐 | ❌ | ❌ |  |

## Typography

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **font-family** | ✅ | 🌐 | ✅ | ✅ |  |
| **font-size** | ✅ | 🌐 | ✅ | ✅ |  |
| **font-weight** | ✅ | 🌐 | ✅ | ✅ |  |
| **font-style** | ✅ | 🌐 | ✅ | ✅ |  |
| **color** | ✅ | 🌐 | ✅ | ✅ |  |
| **text-align** | ✅ | 🌐 | ✅ | ✅ |  |
| **text-transform** | ✅ | 🌐 | ✅ | ✅ |  |
| **text-decoration** | ✅ | 🌐 | ✅ | ⚠️ |  |
| **letter-spacing** | ✅ | 🌐 | ✅ | ✅ |  |
| **line-height** | ✅ | 🌐 | ✅ | ✅ |  |
| **line-clamp** | ✅ | 🌐 | ✅ | ❌ |  |
| **white-space** | ✅ | 🌐 | 🌐 | ❌ |  |
| **word-break** | ✅ | 🌐 | 🌐 | ❌ |  |
| **text-overflow** | 🌐 | 🌐 | ⚠️ | ❌ | Tamagui uses numberOfLines prop |
| **text-indent** | ❌ | 🌐 | 🌐 | ❌ |  |
| **vertical-align** | ✅ | 🌐 | 🌐 | ❌ |  |
| **font-variant-numeric** | ⚠️ | 🌐 | ⚠️ | ❌ |  |
| **text-shadow** | ✅ | 🌐 | ⚠️ | ❌ | Tailwind v4 added text-shadow utilities; NativeWind v5 maps to RN textShadow* (single shadow only) |

## Backgrounds

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **background-color** | ✅ | 🌐 | ✅ | ✅ |  |
| **background-image** | 🌐 | 🌐 | 🌐 | ❌ |  |
| **background-position** | 🌐 | 🌐 | 🌐 | ❌ |  |
| **background-size** | 🌐 | 🌐 | 🌐 | ❌ |  |
| **background-repeat** | 🌐 | 🌐 | 🌐 | ❌ |  |
| **background-clip** | 🌐 | 🌐 | 🌐 | ❌ |  |

## Borders

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **border-width** | ✅ | 🌐 | ✅ | ✅ |  |
| **border-color** | ✅ | 🌐 | ✅ | ✅ |  |
| **border-style** | ✅ | 🌐 | ✅ | ⚠️ |  |
| **border-radius** | ✅ | 🌐 | ✅ | ✅ |  |
| **border-width (logical)** | ✅ | 🌐 | ✅ | ❌ | NativeWind v5 maps border-s/border-e to RN borderStartWidth/borderEndWidth |
| **outline** | ✅ | 🌐 | ✅ | ❌ |  |
| **ring** | ❌ | 🌐 | ✅ | ✅ | Tamagui can achieve this with boxShadow |
| **divide** | ❌ | 🌐 | ✅ | ❌ |  |

## Effects

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **opacity** | ✅ | 🌐 | ✅ | ✅ |  |
| **box-shadow** | ✅ | 🌐 | ⚠️ | ⚠️ | NativeWind v5 maps shadow-* to RN 0.76+ boxShadow; still differs from CSS spread/inset |
| **mix-blend-mode** | 🌐 | 🌐 | 🌐 | ❌ |  |
| **cursor** | ✅ | 🌐 | 🌐 | ❌ |  |
| **pointer-events** | ✅ | 🌐 | ✅ | ❌ |  |
| **user-select** | ✅ | 🌐 | 🌐 | ❌ |  |

## Filters

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **filter (blur, brightness, etc)** | 🌐 | 🌐 | 🌐 | ❌ |  |
| **backdrop-filter** | 🌐 | 🌐 | 🌐 | ❌ |  |

## Transforms

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **transform** | ✅ | 🌐 | ✅ | ✅ |  |
| **translate** | ✅ | 🌐 | ✅ | ✅ |  |
| **scale** | ✅ | 🌐 | ✅ | ✅ |  |
| **rotate** | ✅ | 🌐 | ✅ | ✅ |  |
| **skew** | ✅ | 🌐 | ✅ | ✅ |  |
| **transform-origin** | ✅ | 🌐 | ✅ | ❌ |  |
| **perspective** | ✅ | 🌐 | ⚠️ | ❌ |  |
| **backface-visibility** | ✅ | 🌐 | ✅ | ❌ |  |

## Transitions & Animation

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **animation** | ✅ | 🌐 | ✅ | ⚠️ | NativeWind v5 runs real CSS @keyframes (incl. custom keyframes) on native; Tamagui uses pluggable drivers |
| **transition-property** | ❌ | 🌐 | ✅ | ⚠️ | NativeWind v5 backs transition-* with real CSS transitions on native; Tamagui driver handles automatically |
| **transition-duration** | ❌ | 🌐 | ✅ | ⚠️ |  |
| **transition-timing-function** | ❌ | 🌐 | ✅ | ⚠️ | Tamagui configures this per-animation driver |
| **enter/exit styles** | ✅ | ❌ | ❌ | ❌ | Tamagui-specific: AnimatePresence + enterStyle/exitStyle |

## Interactive States

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **hover** | ✅ | 🌐 | ✅ | ❌ | Uniwind has no hover (mobile-focused) |
| **press / active** | ✅ | 🌐 | ✅ | ✅ |  |
| **focus** | ✅ | 🌐 | ✅ | ✅ |  |
| **focus-visible** | ✅ | 🌐 | 🌐 | ❌ | NativeWind v5 focus-visible is a web-only pseudo (no native equivalent) |
| **focus-within** | ✅ | 🌐 | 🌐 | ❌ |  |
| **disabled** | ✅ | 🌐 | ✅ | ✅ |  |
| **group hover/press** | ❌ | 🌐 | ✅ | ❌ | Tamagui uses group prop on parent + grouping |
| **peer variants** | ❌ | 🌐 | ✅ | ❌ | NativeWind v5 improved group-*/peer-* tracking |
| **has variant** | ❌ | 🌐 | 🌐 | ❌ | New in Tailwind v4; NativeWind v5 supports has-* on web only (no native :has()) |

## Responsive & Media

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **breakpoints** | ✅ | 🌐 | ✅ | ✅ |  |
| **dark mode** | ✅ | 🌐 | ✅ | ✅ | NativeWind v5 dark: uses native @media (prefers-color-scheme: dark) |
| **combined media + pseudo** | ✅ | 🌐 | ✅ | ❌ |  |
| **container queries** | 🌐 | 🌐 | ✅ | ❌ | NativeWind v5 ships full container-query support (@container + container-type) on web and native; Tamagui containerType is web-only |
| **prefers-reduced-motion** | ❌ | 🌐 | ⚠️ | ❌ | NativeWind v5 reads RN AccessibilityInfo reduce-motion on native |

## Platform

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **web-specific styles** | ✅ | 🌐 | ✅ | ✅ | Tailwind is web-only by default |
| **native-specific styles** | ✅ | ❌ | ✅ | ❌ |  |
| **ios-specific styles** | ✅ | ❌ | ✅ | ✅ |  |
| **android-specific styles** | ✅ | ❌ | ✅ | ✅ |  |
| **safe area insets** | ❌ | ❌ | ✅ | ✅ | Tamagui uses useSafeAreaInsets hook |

## Pseudo Elements

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **::before / ::after** | ❌ | 🌐 | ⚠️ | ❌ |  |
| **::placeholder** | ❌ | 🌐 | ✅ | ❌ |  |
| **::selection** | ❌ | 🌐 | 🌐 | ❌ |  |
| **first-child / last-child** | ❌ | 🌐 | ✅ | ❌ |  |

## Tables

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **border-collapse** | ❌ | 🌐 | 🌐 | ❌ |  |
| **border-spacing** | ❌ | 🌐 | 🌐 | ❌ |  |
| **table-layout** | ❌ | 🌐 | 🌐 | ❌ |  |

## SVG

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **fill** | ❌ | 🌐 | ⚠️ | ❌ |  |
| **stroke** | ❌ | 🌐 | ⚠️ | ❌ |  |
| **stroke-width** | ❌ | 🌐 | ⚠️ | ❌ |  |

## Interactivity

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **scroll-behavior** | ❌ | 🌐 | 🌐 | ❌ |  |
| **scroll-snap** | ❌ | 🌐 | 🌐 | ❌ |  |
| **touch-action** | 🌐 | 🌐 | 🌐 | ❌ |  |
| **resize** | ❌ | 🌐 | 🌐 | ❌ |  |
| **appearance** | ❌ | 🌐 | 🌐 | ❌ |  |
| **caret-color** | ✅ | 🌐 | ⚠️ | ❌ |  |
| **accent-color** | ❌ | 🌐 | 🌐 | ❌ |  |
| **will-change** | 🌐 | 🌐 | 🌐 | ❌ |  |

## Accessibility

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **sr-only** | ❌ | 🌐 | ✅ | ❌ |  |
| **forced-color-adjust** | ❌ | 🌐 | 🌐 | ❌ |  |

## Design Tokens & Theming

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **design tokens** | ✅ | 🌐 | ✅ | ✅ |  |
| **theme switching** | ✅ | 🌐 | ✅ | ✅ | Tamagui has nested theme support with sub-themes |
| **sub-themes / component themes** | ✅ | ❌ | ❌ | ⚠️ | Tamagui unique: deeply nested component-aware themes |
| **arbitrary values** | ✅ | 🌐 | ✅ | ❌ | NativeWind v5 improved arbitrary calc()/clamp() handling |
| **CSS variables / custom properties** | 🌐 | 🌐 | ✅ | ❌ | NativeWind v5 implements Tailwind v4 @theme + var() resolution on web and native; Tamagui var() is web-only (uses tokens on native) |
| **color opacity modifier** | ⚠️ | 🌐 | ✅ | ⚠️ | NativeWind v5 fully supports the /N opacity modifier (was partial in v4) |
