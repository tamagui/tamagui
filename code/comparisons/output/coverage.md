# CSS Utility Coverage Comparison

_Tamagui flat-styles vs Tailwind CSS v4 vs NativeWind v5 vs Uniwind. Support is judged by whether a **named style prop / utility** does the right thing, not whether a raw value can be smuggled through `style={{}}`._

**Legend:** ✅ Full (works web + native) | ⚠️ Partial (works but with real caveats) | 🌐 Web-only | ❌ None

## Summary

Coverage % is weighted: Full = 1.0, Partial = 0.5, Web-only = 0.5, None = 0. It rewards breadth; for the cross-platform story read the **Full** column (web + native) below.

| Framework | Full (web+native) | Partial | Web-only | None | Total | Coverage % |
|-----------|-------------------|---------|----------|------|-------|------------|
| **Tamagui** | 79 | 11 | 28 | 31 | 149 | 66.1% |
| **Tailwind** | 0 | 0 | 142 | 7 | 149 | 47.7% |
| **NativeWind v5** | 74 | 24 | 45 | 6 | 149 | 72.8% |
| **Uniwind** | 51 | 19 | 0 | 79 | 149 | 40.6% |

## Cross-platform coverage (web + native)

The number that matters most for a write-once-render-everywhere library is how many utilities work **fully on both web and native** (✅), excluding anything that is web-only (🌐). Tailwind is excluded here because it does not target native at all.

| Framework | Fully cross-platform | of total | Share |
|-----------|----------------------|----------|-------|
| **Tamagui** | 79 | 149 | `███████████░░░░░░░░░` 53% |
| **NativeWind v5** | 74 | 149 | `██████████░░░░░░░░░░` 50% |
| **Uniwind** | 51 | 149 | `███████░░░░░░░░░░░░░` 34% |

**Tamagui** leads cross-platform with **79** fully-supported utilities vs **NativeWind v5**'s 74. NativeWind closes the gap on web-leaning CSS features but marks several native paths experimental (transitions/animations) or web-only (space/divide, peer, structural selectors, sr-only a11y wiring).

## Layout

_Coverage: Tamagui 73% · Tailwind 50% · NativeWind v5 70% · Uniwind 37%_

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **display** | ✅ | 🌐 | ⚠️ | ⚠️ | **⚠️ NativeWind v5, Uniwind:** Tamagui: `$dsp` is a named prop; `flex`/`none` work cross-platform, other values (block/grid/contents) web-only. RN natively only has flex + none, so NativeWind/Uniwind map flex/hidden and ignore the rest on native. |
| **position** | ✅ | 🌐 | ⚠️ | ⚠️ | **⚠️ NativeWind v5, Uniwind:** Tamagui: `$pos` named prop; absolute/relative/static cross-platform, fixed/sticky web-only (RN has no fixed/sticky positioning). NativeWind/Uniwind map absolute/relative on native and drop fixed/sticky. |
| **top/right/bottom/left** | ✅ | 🌐 | ✅ | ✅ |  |
| **inset** | ✅ | 🌐 | ✅ | ✅ |  |
| **z-index** | ✅ | 🌐 | ✅ | ✅ |  |
| **overflow** | ✅ | 🌐 | ✅ | ⚠️ | **⚠️ Uniwind:** Tamagui: `$ov` named prop, cross-platform (visible/hidden/scroll). RN ignores overflow:scroll on Android for clipping. Uniwind: only overflow-hidden documented. |
| **aspect-ratio** | ✅ | 🌐 | ✅ | ⚠️ | **⚠️ Uniwind:** Tamagui: `$aspectRatio` cross-platform. Uniwind docs note aspect-ratio has "limited support". |
| **box-sizing** | ✅ | 🌐 | ⚠️ | ⚠️ | **⚠️ NativeWind v5, Uniwind:** Tamagui: `$bxs` named prop, maps to RN 0.77+ boxSizing (New Architecture) so border-box/content-box both work cross-platform. RN defaults to and only supports border-box, so NativeWind/Uniwind box-border is a no-op and box-content is unsupported on native. |
| **isolation** | ✅ | 🌐 | 🌐 | ❌ | Tamagui: `$isolation` maps to RN 0.77+ isolation (New Architecture) for native stacking contexts; NativeWind `isolate` is web-only. |
| **visibility** | 🌐 | 🌐 | ⚠️ | ❌ | **⚠️ NativeWind v5:** Tamagui: `$visibility` exists via RN-web on web only; on native there is no visibility, idiomatic Tamagui uses `$o={0}` (opacity) or conditional render. NativeWind `invisible` maps to opacity:0 on native (collapse is web-only). |
| **float** | ❌ | 🌐 | 🌐 | ❌ | Not applicable to RN flexbox model |
| **clear** | ❌ | 🌐 | 🌐 | ❌ |  |
| **columns** | 🌐 | 🌐 | 🌐 | ❌ | Tamagui: `$columnCount` is a typed prop but CSS multi-column only renders on web; RN has no multi-column layout. Uniwind explicitly lists `columns-*` as unsupported. |
| **object-fit** | 🌐 | 🌐 | ✅ | ❌ | Tamagui: `$objectFit` is web-only; on native use the Image component `resizeMode`/`objectFit` prop directly. NativeWind v5 maps object-* to the Image objectFit prop, so it works on native too. |
| **object-position** | 🌐 | 🌐 | ⚠️ | ❌ | **⚠️ NativeWind v5:** Tamagui: `$objectPosition` web-only. NativeWind partially maps object-position on native (limited values). |

## Flexbox

_Coverage: Tamagui 96% · Tailwind 50% · NativeWind v5 92% · Uniwind 83%_

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **flex-direction** | ✅ | 🌐 | ✅ | ✅ |  |
| **flex-wrap** | ✅ | 🌐 | ✅ | ✅ |  |
| **flex** | ✅ | 🌐 | ⚠️ | ⚠️ | **⚠️ NativeWind v5, Uniwind:** Tamagui: `$f` plus separate `$fg`/`$fs`/`$fb` give full control cross-platform. On native, RN flex is a single number, so the CSS `flex: grow shrink basis` shorthand (e.g. flex-auto/flex-initial) does not map cleanly; NativeWind/Uniwind support flex-1 but the multi-value shorthands are web-leaning. |
| **flex-grow** | ✅ | 🌐 | ✅ | ✅ |  |
| **flex-shrink** | ✅ | 🌐 | ✅ | ✅ |  |
| **flex-basis** | ✅ | 🌐 | ✅ | ⚠️ |  |
| **justify-content** | ✅ | 🌐 | ✅ | ✅ |  |
| **align-items** | ✅ | 🌐 | ✅ | ✅ |  |
| **align-self** | ✅ | 🌐 | ✅ | ✅ |  |
| **align-content** | ✅ | 🌐 | ✅ | ✅ |  |
| **gap** | ✅ | 🌐 | ✅ | ✅ | Tamagui: `$gap`/`$columnGap`/`$rowGap` are named props, cross-platform via RN 0.71+ flexbox gap. All four support it natively now (RN 0.71+ added row/column gap to flexbox); pre-0.71 needed a margin workaround. |
| **order** | 🌐 | 🌐 | 🌐 | ❌ | Tamagui: `$order` is a typed prop but flex `order` only affects web layout; RN flexbox ignores order (paint order = child order). Web-only for everyone. |

## Grid

_Coverage: Tamagui 42% · Tailwind 50% · NativeWind v5 50% · Uniwind 0%_

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **grid-template-columns** | 🌐 | 🌐 | 🌐 | ❌ | CSS grid only exists on web; RN has no grid layout engine. Tamagui exposes `$gridTemplate*` as typed props but they no-op on native. All RN approaches require manual flex layout or a list component instead. |
| **grid-column** | 🌐 | 🌐 | 🌐 | ❌ |  |
| **grid-row** | 🌐 | 🌐 | 🌐 | ❌ |  |
| **grid-template-areas** | 🌐 | 🌐 | 🌐 | ❌ |  |
| **grid-auto-flow** | 🌐 | 🌐 | 🌐 | ❌ | Tamagui: `$gridAutoFlow` is a typed prop but renders web-only (RN has no grid). |
| **place-content/items/self** | ❌ | 🌐 | 🌐 | ❌ |  |

## Spacing

_Coverage: Tamagui 80% · Tailwind 50% · NativeWind v5 90% · Uniwind 60%_

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **padding** | ✅ | 🌐 | ✅ | ✅ |  |
| **margin** | ✅ | 🌐 | ✅ | ✅ |  |
| **padding-block/inline (logical)** | ✅ | 🌐 | ✅ | ❌ | NativeWind v5 maps ps/pe to RN paddingStart/End (RTL aware) |
| **margin-block/inline (logical)** | ✅ | 🌐 | ✅ | ❌ | NativeWind v5 maps ms/me to RN marginStart/End (RTL aware) |
| **space-between** | ❌ | 🌐 | 🌐 | ✅ | Tamagui has no `space-*` className; the idiomatic equivalent is `$gap` (cross-platform). NativeWind v5 marks space-x/space-y as web-only (it injects a `> * + *` sibling selector that has no native equivalent) and recommends gap on native. Uniwind lists space-x/y as supported. |

## Sizing

_Coverage: Tamagui 83% · Tailwind 50% · NativeWind v5 75% · Uniwind 75%_

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **width** | ✅ | 🌐 | ✅ | ✅ |  |
| **height** | ✅ | 🌐 | ✅ | ✅ |  |
| **min-width / max-width** | ✅ | 🌐 | ✅ | ✅ |  |
| **min-height / max-height** | ✅ | 🌐 | ✅ | ✅ |  |
| **size (width + height)** | ⚠️ | 🌐 | ⚠️ | ⚠️ | **⚠️ Tamagui, NativeWind v5, Uniwind:** The `size-*` shorthand (sets width+height together) shipped in Tailwind v3.4. Tamagui has no single shorthand: use `$w`/`$h` (both cross-platform, so the capability exists, just two props). NativeWind v5 docs only enumerate `w-*`/`h-*` as Full on native; `size-*` native support is undocumented/unconfirmed. |
| **inline-size / block-size** | 🌐 | 🌐 | ❌ | ❌ | Tamagui types `$inlineSize`/`$blockSize` as size-token props but they only resolve on web (RN has no inlineSize/blockSize style props; use `$w`/`$h`). On native, writing-mode is effectively LTR/TTB so logical == physical anyway. |

## Typography

_Coverage: Tamagui 82% · Tailwind 50% · NativeWind v5 79% · Uniwind 50%_

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
| **white-space** | 🌐 | 🌐 | 🌐 | ❌ | Tamagui: `$whiteSpace` is a web-only text prop (tree-shaken on native). On native, text wrapping is controlled by `numberOfLines` and container width, not white-space. |
| **word-break** | 🌐 | 🌐 | 🌐 | ❌ | Tamagui: `$wordWrap` (`ww` shorthand) is web-only. RN has no word-break control; it breaks at whitespace or character based on platform text engine. |
| **text-overflow** | 🌐 | 🌐 | ⚠️ | ❌ | **⚠️ NativeWind v5:** Tamagui uses numberOfLines prop |
| **text-indent** | ❌ | 🌐 | 🌐 | ❌ |  |
| **vertical-align** | ✅ | 🌐 | ⚠️ | ❌ | **⚠️ NativeWind v5:** Tamagui: `$verticalAlign` maps to RN 0.71+ verticalAlign on Text (auto/top/bottom/middle), so it works cross-platform. NativeWind `align-*` is largely a web inline-element concept; RN only honors a subset on Text. |
| **font-variant-numeric** | ⚠️ | 🌐 | ⚠️ | ❌ | **⚠️ Tamagui, NativeWind v5:** Tamagui: `$fontVariant` maps to RN fontVariant array; RN supports a subset (tabular-nums, oldstyle-nums, lining-nums, etc.) cross-platform but not the full CSS font-variant-numeric grammar. NativeWind maps the common numeric variants to RN fontVariant, same subset limitation. |
| **text-shadow** | ✅ | 🌐 | ⚠️ | ❌ | **⚠️ NativeWind v5:** Tailwind text-shadow utilities are new in v4.1; NativeWind v5 maps to RN textShadow* (single shadow only). Tamagui `$textShadow` + offset/radius/color are cross-platform via RN textShadow* props. |
| **text-wrap (balance / pretty)** | 🌐 | 🌐 | 🌐 | ❌ | Tailwind `text-balance` (text-wrap: balance) and `text-pretty` shipped in v3.4. Tamagui `$textWrap` is a web-only prop. RN text layout has no balance/pretty algorithm, so all are web-only (NativeWind passes them through on web only). |

## Backgrounds

_Coverage: Tamagui 58% · Tailwind 50% · NativeWind v5 58% · Uniwind 17%_

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **background-color** | ✅ | 🌐 | ✅ | ✅ |  |
| **background-image** | ⚠️ | 🌐 | ⚠️ | ❌ | **⚠️ Tamagui, NativeWind v5:** Tamagui: `$backgroundImage` maps to RN 0.76+ experimental_backgroundImage, so CSS gradients (linear/radial) render on native; raster url() background images stay web-only (use the Image component on native). NativeWind v5 similarly maps gradient utilities to RN 0.76+ backgroundImage; url() backgrounds remain web-only. |
| **background-position** | 🌐 | 🌐 | 🌐 | ❌ |  |
| **background-size** | 🌐 | 🌐 | 🌐 | ❌ |  |
| **background-repeat** | 🌐 | 🌐 | 🌐 | ❌ |  |
| **background-clip** | 🌐 | 🌐 | 🌐 | ❌ |  |

## Borders

_Coverage: Tamagui 81% · Tailwind 50% · NativeWind v5 88% · Uniwind 44%_

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **border-width** | ✅ | 🌐 | ✅ | ✅ |  |
| **border-color** | ✅ | 🌐 | ✅ | ✅ |  |
| **border-style** | ✅ | 🌐 | ✅ | ⚠️ |  |
| **border-radius** | ✅ | 🌐 | ✅ | ✅ |  |
| **border-width (logical)** | ✅ | 🌐 | ✅ | ❌ | NativeWind v5 maps border-s/border-e to RN borderStartWidth/borderEndWidth |
| **outline** | ✅ | 🌐 | ✅ | ❌ | Tamagui: `$outline*` named props map to RN 0.77+ outline / outlineColor / outlineWidth / outlineOffset (New Architecture), so outlines render cross-platform. NativeWind v5 maps outline-* to the same RN props. |
| **ring** | ⚠️ | 🌐 | ⚠️ | ❌ | **⚠️ Tamagui, NativeWind v5:** Tamagui has no `ring` shorthand but the same effect is a one-liner via `$bxsh` (box-shadow), which works cross-platform on RN 0.76+. NativeWind ring is box-shadow-based, so on native it inherits the RN boxShadow limitations (no inset). Uniwind: ring not documented. |
| **divide** | ❌ | 🌐 | 🌐 | ❌ | divide-* injects a `> * + *` sibling border. NativeWind v5 lists divide-width as web-only (no native sibling selector). Tamagui has no divide equivalent; idiomatic approach is a `<Separator>` component between children. |

## Effects

_Coverage: Tamagui 83% · Tailwind 50% · NativeWind v5 67% · Uniwind 25%_

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **opacity** | ✅ | 🌐 | ✅ | ✅ |  |
| **box-shadow** | ✅ | 🌐 | ⚠️ | ⚠️ | **⚠️ NativeWind v5, Uniwind:** NativeWind v5 maps shadow-* to RN 0.76+ boxShadow; still differs from CSS spread/inset |
| **mix-blend-mode** | 🌐 | 🌐 | 🌐 | ❌ |  |
| **cursor** | 🌐 | 🌐 | 🌐 | ❌ | Tamagui: `$cur` (cursor) is accepted as a prop on native without error but only renders on web/web-of-RN; touch platforms have no cursor. Effectively web-only for everyone. |
| **pointer-events** | ✅ | 🌐 | ✅ | ❌ | Tamagui: `$pe` maps to the core RN View pointerEvents prop (cross-platform). NativeWind maps pointer-events-* to the same RN prop. Uniwind: not documented. |
| **user-select** | ✅ | 🌐 | ⚠️ | ❌ | **⚠️ NativeWind v5:** Tamagui: `$ussel` (userSelect) maps to RN 0.71+ userSelect on Text/View, so none/text/auto work cross-platform. NativeWind select-* maps to the same RN prop; select-all is web-only. |

## Filters

_Coverage: Tamagui 50% · Tailwind 50% · NativeWind v5 50% · Uniwind 0%_

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **filter (blur, brightness, etc)** | ⚠️ | 🌐 | ⚠️ | ❌ | **⚠️ Tamagui, NativeWind v5:** Tamagui: `$filter` maps to RN 0.76+ filter, so blur/brightness/contrast/etc. render on native — but some filters (e.g. drop-shadow) are Android 12+ only and behavior differs from CSS. NativeWind v5 maps filter utilities to the same RN 0.76+ prop with the same platform caveats. |
| **backdrop-filter** | 🌐 | 🌐 | 🌐 | ❌ | Tamagui: `$backdropFilter` is web-only. RN has no backdrop-filter; native blur-behind effects need a dedicated component (e.g. expo-blur / @react-native-community/blur). |

## Transforms

_Coverage: Tamagui 100% · Tailwind 50% · NativeWind v5 94% · Uniwind 63%_

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

_Coverage: Tamagui 70% · Tailwind 40% · NativeWind v5 40% · Uniwind 40%_

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **animation** | ✅ | 🌐 | ⚠️ | ⚠️ | **⚠️ NativeWind v5, Uniwind:** Tamagui: `animation="..."` plus enter/exit styles, cross-platform via pluggable drivers (CSS on web; Reanimated/Moti/RN-Animated on native). NativeWind v5 `animate-*` is marked experimental on native (it now delegates to Reanimated CSS animations, RN 0.81+ / New Arch only). Uniwind animations are Pro-tier (paid) and Reanimated-backed. |
| **transition-property** | ⚠️ | 🌐 | ⚠️ | ⚠️ | **⚠️ Tamagui, NativeWind v5, Uniwind:** Tamagui has no `transition-*` class; instead any prop change on a component with an `animation` driver animates automatically (cross-platform). NativeWind v5 transition-* is experimental on native (Reanimated-backed, RN 0.81+ / New Arch). Uniwind transitions are Pro-tier. |
| **transition-duration** | ⚠️ | 🌐 | ⚠️ | ⚠️ | **⚠️ Tamagui, NativeWind v5, Uniwind:** Tamagui sets duration through the animation driver config (e.g. spring/timing presets) rather than a `duration-*` class. NativeWind v5 duration-* is part of its experimental native transition support. |
| **transition-timing-function** | ⚠️ | 🌐 | ⚠️ | ⚠️ | **⚠️ Tamagui, NativeWind v5, Uniwind:** Tamagui configures easing per-animation driver (e.g. cubic-bezier on CSS, spring on Reanimated) rather than an `ease-*` class. NativeWind v5 ease-* is part of its experimental native transition support. |
| **enter/exit styles** | ✅ | ❌ | ❌ | ❌ | Tamagui-specific: AnimatePresence + enterStyle/exitStyle |

## Interactive States

_Coverage: Tamagui 55% · Tailwind 50% · NativeWind v5 73% · Uniwind 32%_

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **hover** | ✅ | 🌐 | ✅ | ❌ | Tamagui `hoverStyle` / `$hover:` fires wherever a pointer exists (web + RN desktop/trackpad via onHoverIn); inert on touch like everywhere. NativeWind hover behaves the same. Uniwind explicitly lists `hover:` as unsupported (no RN equivalent in its model). |
| **press / active** | ✅ | 🌐 | ✅ | ✅ |  |
| **focus** | ✅ | 🌐 | ✅ | ✅ |  |
| **focus-visible** | 🌐 | 🌐 | 🌐 | ❌ | Tamagui: `focusVisibleStyle` / `$focusVisible:` is registered only on web (it depends on the `:focus-visible` pseudo). NativeWind focus-visible is likewise web-only. No framework has a native equivalent (RN has no keyboard-vs-pointer focus distinction). |
| **focus-within** | 🌐 | 🌐 | 🌐 | ❌ | Tamagui exposes `focusWithinStyle` but it relies on the `:focus-within` pseudo, so it only takes effect on web; RN has no focus-within. Use a named `group` + focus state for a native equivalent. |
| **disabled** | ✅ | 🌐 | ✅ | ✅ |  |
| **group hover/press/focus** | ✅ | 🌐 | ✅ | ⚠️ | **⚠️ Uniwind:** Tamagui: mark the parent `group` (or `group="card"`) and style children with `$group-hover:`, `$group-card-hover:`, `$group-press:`, `$group-focus:` — implemented via a JS state emitter so it works cross-platform (web + native). NativeWind v5 group-* tracks parent state on native. Uniwind: group-active/focus is Pro-tier (free no-ops); group-hover never (no native hover). |
| **peer variants** | ❌ | 🌐 | 🌐 | ❌ | peer-* needs a CSS sibling selector. NativeWind v5 supports peer-* on web only — there is no native sibling-tracking model. Tamagui has no peer concept; the closest pattern is lifting shared state to a parent `group` or to React state. Uniwind: not supported. |
| **has variant** | ❌ | 🌐 | 🌐 | ❌ | has-* (`:has()` parent-selector) shipped in Tailwind v3.4. NativeWind v5 supports has-* on web only (no native `:has()`); Tamagui and Uniwind have no equivalent — track the condition in JS/state instead. |
| **not variant** | ❌ | 🌐 | 🌐 | ❌ | The `not-*` variant is new in Tailwind v4.0 and relies on the CSS `:not()` selector — web only. NativeWind has no native `:not()` model; Tamagui/Uniwind have no equivalent (invert the condition in JS). |
| **nth variant** | ❌ | 🌐 | 🌐 | ❌ | The `nth-*` variant is new in Tailwind v4.0 (CSS `:nth-child()`) — web only. RN has no structural pseudo-classes, so NativeWind is web-only here and Tamagui/Uniwind have no equivalent; compute from the list index in JS. |

## Responsive & Media

_Coverage: Tamagui 67% · Tailwind 50% · NativeWind v5 75% · Uniwind 33%_

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **breakpoints** | ✅ | 🌐 | ✅ | ✅ |  |
| **dark mode** | ✅ | 🌐 | ✅ | ✅ | NativeWind v5 dark: uses native @media (prefers-color-scheme: dark) |
| **combined media + pseudo** | ✅ | 🌐 | ✅ | ❌ |  |
| **container queries** | ✅ | 🌐 | ✅ | ❌ | Tamagui: container queries are the `group` system combined with media keys — mark a parent `group="card"` and use `$group-card-$sm:` style keys. On web this uses real CSS container queries (containerType); on native it measures the parent and applies styles via the group emitter, so it works cross-platform (the `untilMeasured` prop exists to avoid flashes before first measure). NativeWind v5 also supports `@container` on native, implemented via onLayout measurement (size-based only, not CSS containment). Tailwind is web-only; Uniwind: not documented. |
| **container query units (cqw/cqh)** | ❌ | 🌐 | ❌ | ❌ | cqw/cqh/cqi/cqb are CSS length units tied to a real CSS containment context (Tailwind v4 via arbitrary values). Tamagui and NativeWind implement container *queries* differently (JS measurement / group emitter) and do not expose container-relative length units; use a measured value or a breakpoint instead. |
| **prefers-reduced-motion** | ❌ | 🌐 | ⚠️ | ❌ | **⚠️ NativeWind v5:** Tamagui has no `$motion-reduce` style key; honor it imperatively (read the reduce-motion setting and swap the `animation` prop / disable animations). NativeWind v5 maps motion-reduce: to `prefers-reduced-motion` on web and RN AccessibilityInfo.isReduceMotionEnabled on native. |

## Platform

_Coverage: Tamagui 80% · Tailwind 10% · NativeWind v5 100% · Uniwind 80%_

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **web-specific styles** | ✅ | 🌐 | ✅ | ✅ | Tailwind is web-only by default |
| **native-specific styles** | ✅ | ❌ | ✅ | ❌ |  |
| **ios-specific styles** | ✅ | ❌ | ✅ | ✅ |  |
| **android-specific styles** | ✅ | ❌ | ✅ | ✅ |  |
| **safe area insets** | ❌ | ❌ | ✅ | ✅ | No Tamagui style key for safe areas; use the `useSafeAreaInsets()` hook and feed values into `$pt`/`$pb` (one extra line). NativeWind and Uniwind both ship first-class safe-area utilities; Uniwind also has `-safe-or-*` / `-safe-offset-*` variants. |

## Pseudo Elements

_Coverage: Tamagui 13% · Tailwind 50% · NativeWind v5 63% · Uniwind 0%_

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **::before / ::after** | ❌ | 🌐 | 🌐 | ❌ | Generated content has no RN equivalent (no pseudo-element box). NativeWind v5 only ships `content-none` and it is web-only. Tamagui has no before/after; render an extra element instead. Uniwind lists before:/after: as unsupported. |
| **::placeholder** | ⚠️ | 🌐 | ✅ | ❌ | **⚠️ Tamagui:** Tamagui Input/TextArea expose `placeholderTextColor` (the one RN-supported placeholder style) cross-platform, but not arbitrary placeholder typography. NativeWind v5 rewrites `placeholder:` to the RN placeholderTextColor prop. Uniwind lists placeholder: as unsupported. |
| **::selection** | ❌ | 🌐 | 🌐 | ❌ |  |
| **first / last / odd / even child** | ❌ | 🌐 | 🌐 | ❌ | Index-based child selectors need a CSS structural pseudo (:first-child / :nth-child). NativeWind v5 removed native support ("future version") — web-only. Tamagui has none; pass the index in JS (`index === 0 && {...}`). Uniwind: not supported. |

## Tables

_Coverage: Tamagui 0% · Tailwind 50% · NativeWind v5 50% · Uniwind 0%_

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **border-collapse** | ❌ | 🌐 | 🌐 | ❌ |  |
| **border-spacing** | ❌ | 🌐 | 🌐 | ❌ |  |
| **table-layout** | ❌ | 🌐 | 🌐 | ❌ |  |

## SVG

_Coverage: Tamagui 0% · Tailwind 50% · NativeWind v5 100% · Uniwind 0%_

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **fill** | ❌ | 🌐 | ✅ | ❌ | NativeWind v5 maps fill-* to the react-native-svg `fill` prop (colors resolve, incl. /N opacity), so it works on native. Tamagui has no SVG className utilities — pass `fill`/`stroke` props directly to @tamagui/lucide-icons or react-native-svg. |
| **stroke** | ❌ | 🌐 | ✅ | ❌ | NativeWind v5 maps stroke-* to the react-native-svg `stroke` prop on native. Tamagui: pass `stroke` directly to the icon/SVG component. |
| **stroke-width** | ❌ | 🌐 | ✅ | ❌ | NativeWind v5 maps stroke-width to react-native-svg `strokeWidth` on native. |

## Interactivity

_Coverage: Tamagui 15% · Tailwind 45% · NativeWind v5 40% · Uniwind 0%_

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **scroll-behavior** | ❌ | 🌐 | 🌐 | ❌ |  |
| **scroll-snap** | ❌ | 🌐 | 🌐 | ❌ |  |
| **touch-action** | 🌐 | 🌐 | 🌐 | ❌ | Tamagui: `$touchAction` is a web-only prop. On native, gesture handling is done with the gesture system (PanResponder / react-native-gesture-handler), not a style. |
| **resize** | ❌ | 🌐 | 🌐 | ❌ |  |
| **appearance** | ❌ | 🌐 | 🌐 | ❌ | appearance-none resets browser-native control chrome — a web-only concept. RN controls are already custom-rendered, so there is nothing to reset. Tamagui: none. |
| **field-sizing** | ❌ | 🌐 | ❌ | ❌ | field-sizing-content/fixed is new in Tailwind v4.0 and maps to the CSS `field-sizing` property (web only). RN auto-grows a TextInput via the `multiline` + onContentSizeChange pattern instead. Tamagui/NativeWind/Uniwind have no field-sizing utility. |
| **scroll-timeline / scroll-driven animation** | ❌ | ❌ | ❌ | ❌ | Tailwind v4 has no built-in scroll-timeline utility (only arbitrary `[animation-timeline:...]` or a community plugin). On native, scroll-driven effects use Animated.event / Reanimated useAnimatedScrollHandler. No framework here ships a first-class scroll-timeline utility. |
| **caret-color** | 🌐 | 🌐 | ⚠️ | ❌ | **⚠️ NativeWind v5:** Tamagui: `$caretColor` is registered only for the web target. On native, RN exposes caret color via the TextInput `cursorColor` (Android) / `selectionColor` props, not a style prop — NativeWind partially bridges this. |
| **accent-color** | ❌ | 🌐 | 🌐 | ❌ |  |
| **will-change** | 🌐 | 🌐 | 🌐 | ❌ | Tamagui: `$willChange` is a web-only GPU hint. RN has no will-change; native rasterization hints are platform-specific (e.g. shouldRasterizeIOS / renderToHardwareTextureAndroid). |

## Accessibility

_Coverage: Tamagui 0% · Tailwind 50% · NativeWind v5 50% · Uniwind 0%_

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **sr-only** | ❌ | 🌐 | ⚠️ | ❌ | **⚠️ NativeWind v5:** NativeWind v5 `sr-only` only emits the visual-hide style on native (1x1, absolute, clipped) — it does NOT wire accessibilityElementsHidden / importantForAccessibility / aria-hidden, so the semantics differ from web. `not-sr-only` is web-only. Tamagui has no sr-only utility; use the RN accessibility props (`accessible`, `aria-hidden`, `accessibilityLabel`) directly. |
| **forced-colors / forced-color-adjust** | ❌ | 🌐 | 🌐 | ❌ | Forced-colors is a web/OS high-contrast feature. Tailwind v4 ships the `forced-colors:` variant + `forced-color-adjust-*` (both since v3.4); NativeWind exposes them web-only. RN has its own high-contrast handling, so no native style mapping. Tamagui: none. |

## Design Tokens & Theming

_Coverage: Tamagui 79% · Tailwind 43% · NativeWind v5 79% · Uniwind 79%_

| Utility | Tamagui | Tailwind | NativeWind v5 | Uniwind | Notes |
|---------|---------|----------|------------|---------|-------|
| **design tokens** | ✅ | 🌐 | ✅ | ✅ |  |
| **theme switching** | ✅ | 🌐 | ✅ | ✅ | Tamagui has nested theme support with sub-themes |
| **color-scheme** | 🌐 | 🌐 | 🌐 | ⚠️ | **⚠️ Uniwind:** The CSS `color-scheme` property (Tailwind v4 `scheme-*` utilities, new in v4.0) tells the browser to theme built-in UI (form controls, scrollbars). Tamagui sets color-scheme on web automatically when you switch to a dark `<Theme>`; on native there is no equivalent property (RN controls follow the app theme directly). Uniwind exposes light/dark theming but `scheme-*` breadth is undocumented. |
| **sub-themes / component themes** | ✅ | ❌ | ❌ | ⚠️ | **⚠️ Uniwind:** Tamagui unique: deeply nested component-aware themes |
| **arbitrary values** | ✅ | 🌐 | ✅ | ✅ | Tamagui takes any raw value directly as a prop ($bg="rgb(...)") — no bracket escape hatch needed. NativeWind v5 improved arbitrary calc()/clamp() handling. Uniwind bundles the real Tailwind v4 oxide compiler, so bracket arbitrary values parse; calc() resolves on web, limited on native. |
| **CSS variables / custom properties** | ⚠️ | 🌐 | ✅ | ⚠️ | **⚠️ Tamagui, Uniwind:** Tamagui: the design-token system ($color, $4, theme values) IS the cross-platform var() equivalent — on web tokens compile to real CSS custom properties (`var(--...)`), on native they resolve to JS values. Raw `var(--x)` string literals only work on web. NativeWind v5 implements Tailwind v4 `@theme` + `var()` resolution on web AND native (its runtime resolves custom properties). Uniwind theming exists but var()/@theme breadth is less documented. |
| **color opacity modifier** | ⚠️ | 🌐 | ✅ | ✅ | **⚠️ Tamagui:** Tamagui has no inline `/N` modifier — use a theme alpha token (`$color05`, `$blue10`) or an explicit rgba()/hsla() value. NativeWind v5 fully supports `/N` cross-platform (Tailwind v4 compiles it to color-mix(); v5 ships a runtime color-mix resolver). Uniwind supports `/N` in its examples. |

## Notable gaps

For each framework, the most impactful utilities it does **not** support (None or, for native, Web-only) that at least one competitor does. Sorted roughly by how commonly the feature is used.

### Tamagui

- **visibility** (Layout) — web-only here; NativeWind v5 partial
- **object-fit** (Layout) — web-only here; NativeWind v5 full
- **object-position** (Layout) — web-only here; NativeWind v5 partial
- **space-between** (Spacing) — no support; Tailwind 🌐, NativeWind v5 🌐, Uniwind full
- **text-overflow** (Typography) — web-only here; NativeWind v5 partial
- **prefers-reduced-motion** (Responsive & Media) — no support; Tailwind 🌐, NativeWind v5 partial
- **safe area insets** (Platform) — no support; NativeWind v5 full, Uniwind full
- **color-scheme** (Design Tokens & Theming) — web-only here; Uniwind partial
- **sr-only** (Accessibility) — no support; Tailwind 🌐, NativeWind v5 partial
- **fill** (SVG) — no support; Tailwind 🌐, NativeWind v5 full

### Tailwind

- **enter/exit styles** (Transitions & Animation) — no support; Tamagui full
- **native-specific styles** (Platform) — no support; Tamagui full, NativeWind v5 full
- **ios-specific styles** (Platform) — no support; Tamagui full, NativeWind v5 full, Uniwind full
- **android-specific styles** (Platform) — no support; Tamagui full, NativeWind v5 full, Uniwind full
- **safe area insets** (Platform) — no support; NativeWind v5 full, Uniwind full
- **sub-themes / component themes** (Design Tokens & Theming) — no support; Tamagui full, Uniwind partial

### NativeWind v5

- **isolation** (Layout) — web-only here; Tamagui full
- **space-between** (Spacing) — web-only here; Uniwind full
- **enter/exit styles** (Transitions & Animation) — no support; Tamagui full
- **color-scheme** (Design Tokens & Theming) — web-only here; Uniwind partial
- **sub-themes / component themes** (Design Tokens & Theming) — no support; Tamagui full, Uniwind partial
- **inline-size / block-size** (Sizing) — no support; Tamagui 🌐, Tailwind 🌐
- **container query units (cqw/cqh)** (Responsive & Media) — no support; Tailwind 🌐
- **field-sizing** (Interactivity) — no support; Tailwind 🌐

### Uniwind

- **isolation** (Layout) — no support; Tamagui full, Tailwind 🌐, NativeWind v5 🌐
- **visibility** (Layout) — no support; Tamagui 🌐, Tailwind 🌐, NativeWind v5 partial
- **object-fit** (Layout) — no support; Tamagui 🌐, Tailwind 🌐, NativeWind v5 full
- **object-position** (Layout) — no support; Tamagui 🌐, Tailwind 🌐, NativeWind v5 partial
- **padding-block/inline (logical)** (Spacing) — no support; Tamagui full, Tailwind 🌐, NativeWind v5 full
- **margin-block/inline (logical)** (Spacing) — no support; Tamagui full, Tailwind 🌐, NativeWind v5 full
- **line-clamp** (Typography) — no support; Tamagui full, Tailwind 🌐, NativeWind v5 full
- **text-overflow** (Typography) — no support; Tamagui 🌐, Tailwind 🌐, NativeWind v5 partial
- **vertical-align** (Typography) — no support; Tamagui full, Tailwind 🌐, NativeWind v5 partial
- **font-variant-numeric** (Typography) — no support; Tamagui partial, Tailwind 🌐, NativeWind v5 partial
