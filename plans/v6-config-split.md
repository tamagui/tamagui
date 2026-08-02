# v6 config split: aligned base + swappable colors

## Problem

`@tamagui/config/v6` bundled the Tailwind-aligned shorthands/scales together with the
generated 289-color Tailwind palette, while its themes were still the v5 themes generated
from the v5 (radix-ish) palettes. Colors are the divergent piece: people want v5 colors,
Tailwind colors, or their own — and themes must be generated FROM the chosen colors, not
just renamed tokens.

## Design

Follow the `@tamagui/themes/v5` (static) vs `v5-builder` (runtime generation) precedent.
One swap seam: a colors pack `V6Colors = { themes, colorTokens? }` consumed by
`createV6Config(colors)`. Shorthands/scales/settings/fonts/media never diverge — they live
in one base module shared by every entry.

Entries in `@tamagui/config`:

| entry | contents | pulls |
| --- | --- | --- |
| `v6` | `defaultConfig` = base + Tailwind colors: 289 color tokens + themes statically generated FROM the Tailwind palette. Exports the `colors` pack + base pieces. | static only |
| `v6-classic` | `defaultConfig` = base + the v5 color story: `@tamagui/themes/v5` generated themes, no color tokens (colors live in themes, like v5). | static only, no Tailwind palette/themes |
| `v6-base` | the aligned pieces alone: `shorthands`, scale `tokens`, `fonts`, `media`, `settings`, `selectionStyles`, `createV6Config`, `V6Colors`. For pre-generated bring-your-own colors. | static only, no themes at all |
| `v6-builder` | `tailwindPalettes` (all 25 family ramps), `createTailwindThemes()` (feeds Tailwind ramps into `createV5Theme`), re-exports `@tamagui/themes/v5-builder`. | `@tamagui/theme-builder` (kept out of static entries) |

Theme generation is wired through the existing pipeline: `createTailwindThemes` calls
`createV5Theme` (same templates/extras/computed values), so the theme SHAPE (color1-12,
accent, shadows, surfaces, children names gray/blue/red/yellow/green/orange/pink/purple/
teal/neutral) is identical between packs — only values change. Swapping palettes never
changes theme names or keys.

Generated artifacts (config package, committed):

- `v6-tailwind-scales.generated.ts` — space/size/radius/zIndex/fontSize/lineHeight from
  the pinned tailwindcss theme.css (existing checksum mechanism, carries `tailwindSource`)
- `v6-tailwind-colors.generated.ts` — the 289-color srgb palette (playwright conversion,
  same checksum header). Split from scales so `v6-classic`/`v6-base` never carry the
  palette on Metro.
- `v6-tailwind-themes.generated.ts` — static themes generated from the Tailwind palette
  via `tamagui generate-themes ./src/v6-tailwind-themes.generate.ts` (same mechanism as
  `@tamagui/themes` generated-v5).

Supporting changes:

- `@tamagui/themes` gains a `./v5-tokens` subpath so `v6-base` can use the v5 numeric
  radius scale without dragging the generated v5 themes onto native.
- `v5-settings.ts` module extracted from `v5-base.ts` (settings + selectionStyles) so
  `v6-base` doesn't import `v5-base` (which pulls v5 themes). `v5-base` re-exports it
  unchanged.

## Default palette choice

Base `v6` defaults to Tailwind colors: v6 exists for Tailwind alignment, and
`styleMode: 'tailwind'` class parity (`bg-blue-500`) requires the Tailwind color tokens.
v5 colors are one import away (`@tamagui/config/v6-classic`), and the fix over the old
state is that v6's themes are now actually generated from the Tailwind palette.

## Docs

- new `docs/core/config-v6.mdx` — the v6 config page (entries, changes from v5)
- new `docs/core/config-v6-colors.mdx` — color customization end to end: classic/v5
  colors, Tailwind colors, bring-your-own palette, generating themes from each
- registered in `features/docs/docsRoutes.tsx` under Configuration
