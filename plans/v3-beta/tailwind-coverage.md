# Tamagui Tailwind coverage remainder

Claimed utilities live in `@tamagui/style-grammar` and compile on web and native. This file is the web-only leftover: classes the grammar leaves as passthrough because they are not expressible as React Native style, or because they belong to the official Tailwind engine by design.

The comparison worker had not sent a matrix when this was written. The list is the remainder after closing the named gaps (`text-*` color/size/align, `font-*`, `size-*`, corner radius, side borders, axis insets).

## Claimed (web and native)

Sizing (`w-*`, `h-*`, `size-*`, min/max, fractions, `full`/`auto`/`screen`), spacing (`p-*`/`m-*` including sides and axes, `gap-*`), flex and alignment, typography (`text-*` size/color/align, `font-*` family/weight, `leading-*`, `tracking-*`, italic/underline/transform), color (`bg-*`, `color-*`, `text-*`, `border-*` color), radius (`rounded-*` including `t/r/b/l` and `tl/tr/bl/br`), borders (`border`, `border-*` width/color on sides and `x`/`y`), position (`inset`, `inset-x`/`inset-y`, `top`/`right`/`bottom`/`left`, `z-*`), opacity, overflow, object-fit, pointer-events, transforms (`rotate`, `scale`, `translate-x`/`translate-y`), aspect-ratio, group and container markers.

`text-*` order: configured fontSize token, then alignment keywords (`left`/`center`/`right`/`justify`/`start`/`end`), then configured color. Arbitrary `text-[14px]` is fontSize, `text-[#fff]` is color.

## Web-only passthrough

| Candidate family | Why it stays passthrough |
| --- | --- |
| `grid-*`, `col-*`, `row-*`, `auto-cols-*`, `auto-rows-*` | Yoga has no CSS grid |
| `columns-*`, `break-*` | Multi-column layout is CSS-only |
| `float-*`, `clear-*` | No float in React Native |
| `backdrop-*` | No backdrop-filter on native |
| `blur-*`, `brightness-*`, `contrast-*`, `grayscale-*`, `hue-rotate-*`, `invert-*`, `saturate-*`, `sepia-*`, `drop-shadow-*` | CSS `filter` has no RN style equivalent we claim |
| `mix-blend-*`, `bg-blend-*`, `isolation-*` | Compositing is CSS-only |
| `from-*`, `via-*`, `to-*`, `bg-gradient-*` | Gradient stops are CSS background-image |
| `space-x-*`, `space-y-*` | Child/sibling selector, not a style on the node |
| `divide-x-*`, `divide-y-*`, `divide-*` | Same, borders on children via CSS |
| `ring-*`, `ring-offset-*` | Extra box-shadow layers Tailwind owns; use `shadow-[…]` for a claimed shadow |
| `outline-*` | Intentionally unmapped (see parity gate removed list) |
| `cursor-*`, `select-*`, `appearance-*`, `resize-*` | Pointer/form chrome, web-only |
| `placeholder-*`, `file:*`, `caret-*`, `accent-*` | Form pseudo-elements, web-only |
| `list-*`, `sr-only`, `not-sr-only` | Markup/accessibility CSS, not RN View style |
| `object-*` position | `objectPosition` is unmapped; `object-fit` is claimed |
| `overscroll-*`, `scroll-m-*`, `scroll-p-*` | Scrollport CSS, not RN style |
| `snap-*` | CSS scroll snap |
| `underline-offset-*`, `decoration-*` color/style/thickness | Partial text-decoration CSS; line itself is claimed (`underline`) |
| `indent-*`, `align-*` (vertical-align), `whitespace-*`, `break-words`, `truncate`, `hyphens-*` | Text layout CSS Yoga does not share 1:1 |
| `content-*` (CSS `content`) | Generated content |
| `peer-*`, `has-*`, `in-*`, `group-has-*` | Selector variants outside the modifier registry |
| `data-*`, `aria-*`, `[&>*]`, arbitrary variants | Official Tailwind selector syntax |
| `forced-colors:`, `print:`, `supports:*`, `starting:` | Web media/at-rules we do not register |
| `animate-*`, `animation-*` | Tamagui animation is a prop (`animation="quick"`), not a CSS keyframes class |

Unrecognized classes pass through on web so the official engine can emit them. Native drops them (one development warning per candidate).
