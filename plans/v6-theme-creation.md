# v6 theme creation

2026-08-03. Status: accepted design, ready for implementation.

This supersedes the "Builder API" section of `plans/v3-composable-theme-levels.md`.
The relative-level semantics, dedup approach, size assertion, and acceptance
condition in that plan still apply, with three changes decided here: the strict
luminance-direction enforcement is dropped (scales are explicit data), the
"emit only valid paths" rule is replaced by clamping, and level values come from
scale objects rather than templates.

Prior decisions that remain firm: no component themes, no Surface concept,
Tailwind's real 11 shades (50 through 950) with no invented twelfth step, no
interpolation, inverse is an ordinary child theme, nesting stays permissive.

## Summary

One generic generator, `createThemes(tokens, tree, { getTheme })`, rewritten
fresh in `@tamagui/create-theme`. Themes are a tree of small recipes. A single
`getTheme` function resolves each recipe to a plain record of token references.
The output is a flat `Record<name, Record<key, string>>` with resolved values.

Everything Tamagui recommends on top of that (levels, treatments, scales,
inverse) is ordinary exported code and data in the default v6 config, not a
core concept. The core knows nothing about scheme, palette, level, or
treatment.

All v5 generation machinery is deleted: `@tamagui/theme-builder`, masks,
templates, component themes, surface themes, and the v5 entries in
`@tamagui/themes` and `@tamagui/config`. v5 users stay on tamagui v2. v3 is a
fresh start.

## Core API

```ts
createThemes(tokens, tree, { getTheme })
```

- `tree` has exactly the roots `light` and `dark`, plus optional `children`.
  Root names are load-bearing: the runtime infers scheme from the first name
  segment (`light_*` / `dark_*`), and that is the only wiring between the
  generator and runtime scheme handling. Nothing in a recipe ships to runtime.
- A definition is `{ ...recipeFields, values?, children? }`, or a function
  `({ parent }) => definition | null`. `parent` is the resolved parent recipe.
  Returning `null` skips generation of that name.
- A child's recipe is its parent's recipe shallow-merged with its own fields.
  `values` and `children` are the only structural keys; every other field is
  opaque recipe data the core never reads. Users can invent recipe fields
  freely (`contrast: 'high'`) and read them in their own `getTheme`.
- Top-level `children` attach under every root. A definition's own `children`
  attach under exactly that definition. That is the entire nesting semantics.
- `getTheme({ recipe, name, tokens })` returns the theme record. `values` are
  applied on top of its return, for that exact generated theme only. If
  `getTheme` is omitted, each theme is its `values` record alone (the fully
  explicit escape hatch).
- Value strings must be a `tokens.color` name, or parse as a color literal
  (`#…`, `rgb…`, `hsl…`, `transparent`). Anything else is a build error that
  names the nearest token. Resolution happens at generation time, so dedup
  operates on resolved values.
- Identical resolved maps dedupe: names become aliases sharing one parsed
  theme and one CSS declaration block, with extra selectors only.

The two rules users learn:

1. Recipes inherit, values don't. Anything that must survive into descendant
   themes goes in a recipe field; one-theme tweaks go in `values`.
2. Generated names are the flattened tree path: `scheme_color..._levelN`.

Estimated core size: ~250 lines plus types. No masks, no templates, no
reserved names beyond the two roots and the two structural keys.

## Default v6 config

Lives in a fresh `@tamagui/themes` src, statically generated for shipping (the
generator stays out of `@tamagui/config/v6` static imports, same split as
today). Everything below is exported so apps can import-and-override or copy.

The authoring surface is the scales plus the tree, roughly 200 lines total.
The level cross-product (~28 value maps, ~130 names) exists only in generated
output; customizing never means writing levels out by hand, it means editing a
number in a scale object.

### Scales

Scale values: a number is a shade of the current palette; a string is an exact
token name (or color literal). The `normal` scale anchors the neutral base to
`white`/`black`, which is why colored themes need their own `tint` treatment:
absolute strings don't tint.

Shade numbers below are starting points pending the visual pass in Validation.

```ts
export const scales = {
  // the app base: light and dark, anchored to white/black endpoints
  normal: {
    light: {
      1: {
        background: 'white',
        'background-hover': 50,
        'background-press': 'white', // press rests by default, see below
        'background-focus': 50,
        'border-color': 200,
        'border-color-hover': 300,
        'border-color-press': 200,
        'border-color-focus': 300,
        color: 950,
        'color-hover': 950,
        'color-press': 950,
        'color-focus': 950,
        'placeholder-color': 500,
        'outline-color': 400,
        'shadow-color': 'rgba(0,0,0,0.085)',
        'accent-background': 'brand-600',
        'accent-color': 'brand-50',
      },
      2: { background: 50, 'background-hover': 100, 'background-press': 50, 'background-focus': 100, 'border-color': 200 },
      3: { background: 100, 'background-hover': 200, 'background-press': 100, 'background-focus': 200, 'border-color': 300 },
      4: { background: 200, 'background-hover': 300, 'background-press': 200, 'background-focus': 300, 'border-color': 300 },
    },
    dark: {
      1: { background: 950, 'background-hover': 900, 'background-press': 950, color: 50, 'border-color': 800, 'shadow-color': 'rgba(0,0,0,0.3)' /* ... */ },
      2: { background: 900, 'background-hover': 800 /* ... */ },
      3: { background: 800 /* ... */ },
      4: { background: 700 /* ... */ },
    },
  },

  // the bold brand surface: solid fills, on-brand foreground
  bold: {
    light: {
      1: { background: 600, 'background-hover': 500, 'background-press': 600, 'border-color': 700, color: 50, 'placeholder-color': 200, 'outline-color': 400 /* ... */ },
      2: { background: 500 /* ... */ },
      3: { background: 400 /* ... */ },
      4: { background: 300 /* ... */ },
    },
    dark: { /* same shape, tuned in visual pass */ },
  },

  // colored surfaces (accent, red, yellow, green, user-added): soft fill, semantic text
  tint: {
    light: {
      1: { background: 100, 'background-hover': 50, 'background-press': 100, 'border-color': 300, color: 700, 'placeholder-color': 400, 'outline-color': 400 /* ... */ },
      2: { background: 50 /* ... */ },
      3: { background: 200 /* ... */ },
      4: { background: 300 /* ... */ },
    },
    dark: {
      1: { background: 900, color: 300 /* ... */ },
      2: { background: 800 /* ... */ },
      3: { background: 700 /* ... */ },
      4: { background: 600 /* ... */ },
    },
  },
}
```

Levels 2+ spread the previous level and state deltas, plain JS. Each scale
object is the complete customization surface for that treatment: change one
number to change hover direction, press behavior, or border weight everywhere.

Interaction defaults: press stays at rest (skins that want press feedback use
opacity in `pressStyle`), hover moves one step. Both are single-number edits in
the scales. This also removes the old plan's luminance-direction enforcement
and its impossible corner (nothing is darker than 950).

### getTheme

```ts
export function getTheme({ recipe }) {
  const scale = scales[recipe.treatment ?? 'normal'][recipe.scheme][recipe.level ?? 1]
  return {
    ...ramp(recipe.palette, recipe.scheme), // color1 ... color11, scheme-relative
    ...fromShades(recipe.palette, scale),
  }
}
```

`fromShades(palette, scale)` maps numbers to `` `${palette}-${shade}` `` and
passes strings through. `ramp(palette, scheme)` emits the scheme-invariant
scale: `color1` through `color11`, where `color1` is the shade nearest the
background and `color11` nearest the foreground for the current scheme and
palette (light: `color1` = 50 up to `color11` = 950; dark reversed). This is
the core advantage over raw Tailwind: one value adapts to scheme and palette
with no `dark:` pairs. Absolute colors are ordinary tokens (`red-500`) used
directly in styles, never theme keys, so the two vocabularies stay distinct:
theme `color1`-`color11` adapts, token `red-500` never does. The ramp is a
documented superset over Tailwind; an app removes it by dropping `ramp()`
from its `getTheme`.

Customizing is function composition, no API flag:

```ts
// append: tweak on top of the standard resolution
getTheme: (ctx) => ({ ...getTheme(ctx), 'border-color': 'transparent' })
// replace: don't call the default
// one theme only: `values` on that node
```

### levels

Levels are the recommended pattern and the v6 default, not a core feature. The
helper is self-nesting and clamps at `max`; saturation aliases fall out of
dedup rather than needing a second concept:

```ts
export function levels(max = 4) {
  const raise = (by: number) => ({ parent }) => {
    const current = parent.level ?? 1
    const level = Math.min(current + by, max)
    if (level === current) return null // saturated: resolver keeps the parent theme
    return { level, children: levels(max) }
  }
  return { level2: raise(1), level3: raise(2), level4: raise(3) }
}
```

Behavior:

- `level2` means one level above the current context, so a skin's default
  `level2` boundary composes without knowing its absolute level.
  `light_brand_level2_level2` resolves to level 3.
- Past `max`, the clamped recipe equals an existing one, so names like
  `light_red_level3` generate as pure aliases of `light_red_level2` (selectors
  only, no new CSS). Nesting at `max` returns null and the runtime resolver's
  backtracking keeps the parent theme. No development errors; nesting stays
  permissive.
- Clamping emits a few more alias names than the old plan's 8-path table
  (`level2_level4` exists as a clamped alias instead of being omitted). Aliases
  are free at the value level; keep the size assertion to prove it.

### The tree

```ts
export const themes = createThemes(tokens, {
  light: { scheme: 'light', palette: 'gray' },
  dark: { scheme: 'dark', palette: 'gray' },

  children: {
    ...levels(),

    accent: { palette: 'brand', treatment: 'tint', children: levels() },
    brand: { palette: 'brand', treatment: 'bold', children: levels() },

    inverse: ({ parent }) => ({
      scheme: parent.scheme === 'light' ? 'dark' : 'light',
      children: levels(),
    }),

    red: { palette: 'red', treatment: 'tint', children: levels(2) },
    yellow: { palette: 'yellow', treatment: 'tint', children: levels(2) },
    green: { palette: 'green', treatment: 'tint', children: levels(2) },
  },
}, { getTheme })
```

Notes:

- The `scheme` recipe field is only an input to the scales. Runtime scheme
  comes from the name prefix. They coincide for the roots; `inverse` is the
  theme where they intentionally diverge: it lives under `light` but is built
  with the dark scales. Its output is byte-identical to `dark`, so dedup makes
  `light_inverse` share dark's parsed theme and CSS block, and
  `light_inverse_level2` share `dark_level2`. Inverse costs names only. There
  is no `<Theme inverse>` special case in v3; this sub-theme is the whole
  feature.
- Colors get `levels(2)`: one real raised level so a Button inside
  `theme="red"` rises and stays red (`light_red_level2`), everything deeper
  saturates. Without the generated name, the resolver would backtrack to
  `light_level2` and the button would go gray.
- `accent` is the brand palette with the tint treatment: a soft brand surface
  at lightness close to base. `brand` is the same palette bold. The `normal`
  scale's white/black anchors apply only to the neutral base and inverse, so
  no colored theme can pick up a white background. Cross-palette references
  like `accent-background: 'brand-600'` are plain strings because `brand-*` is
  an ordinary token family the app aliases to its ramp.
- `treatment` is a string keyed into `scales`, user-extensible. Apps add
  `subtle` or `outline` by adding a scale set and using it in a recipe.

Approximate size for this default set: ~28 distinct value maps (base 4 +
accent 4 + brand 4 + tint colors 3x2 per scheme; inverse dedupes to zero),
roughly 130 names. Far below v5 with component themes. Keep the generated-size
assertion from the previous plan and record raw/gzip deltas.

## Tailwind alignment

v5's "12-step" light palette was literally `['#ffffff', ...11-shade gray ramp]`
(`v6-builder.ts`). Tailwind ships the same range with honest names: `white`,
`50`-`950`, `black` (`white`/`black` are already in
`v6-tailwind-colors.generated.ts`). Nothing is lost:

- Light level 1 background is `white` with hover dipping into `50`; a raised
  level-2 element starts at `50`/`100`, preserving the "background sits a step
  in so there's room below" behavior of v5's `color2`.
- Dark level 1 background is `950` with `black` available beneath.

The numbered theme keys stay scheme-relative but become 11 steps:
`color1`-`color11` (see `ramp()` above). The split of vocabularies is:
adaptive values come from the theme (`color1`-`color11`, generics), absolute
values come from tokens (`gray-500`). The 12-to-11 renumber goes in the v3
codemod guide; the ends map exactly (`color1` -> `color1`,
`color12` -> `color11`) and the middle compresses by one step, approximate
mapping documented there.

All token/theme references are bare strings (no `$` prefix), matching the v3
`$`-removal direction.

## Types

- The output name union derives from the tree via template literal types;
  theme keys derive from the default `getTheme` return. Both should be
  dramatically simpler than the v5 overloads in
  `theme-builder/src/createThemes.ts`.
- The one hard spot: function children hide their subtree from inference.
  `levels()` ships a hand-written recursive return type bounded at depth 4.
  Prototype this first; it is the riskiest part of the design.
- Keep the generated static output as the type source for the default config
  (as v6 does today), so `@tamagui/config/v6` types don't depend on running
  the generator.

## Deletions

Fresh start. On v3, remove:

- `@tamagui/theme-builder`: entire package (ThemeBuilder, masks, v5
  createThemes, studio helpers, default templates).
- `@tamagui/themes`: all v5 files (`v5-builder`, `v5-templates`, `v5-themes`,
  subtle variants, generated v5 output). Fresh src holds the new default
  config.
- `@tamagui/config`: all v5 entries, and `v6-builder.ts`'s delegation to
  `createV5Theme` (which also removes the prepended `#ffffff` endpoint).
- Component themes: generation is already gone from the new system; also
  remove the runtime component-theme resolution in `useThemeState.ts`
  (`componentName` handling, the uppercase-segment check) as part of the v3
  component-theme removal.
- `@tamagui/generate-themes` (CLI-time compilation): port to the new core or
  drop; the new generator is cheap enough to run at config load, so decide
  when reached.
- tamagui.dev studio: ports to the new system (owner confirmed, 2026-08-03).
  Its output becomes the scales/tree file, replacing generated v5 builder code.

Known dependents to migrate, from a repo grep: `@tamagui/themes` v5 files,
`@tamagui/generate-themes`, `code/kitchen-sink/src/themes/theme.dev.ts`, and
~12 files under `code/tamagui.dev/features/studio`.

## Implementation sequence

1. Core `createThemes` in a rewritten `@tamagui/create-theme` with tests, and
   the `levels()` recursive type prototype. Prove the typing story before
   anything else.
2. Default config in fresh `@tamagui/themes` src: scales, `getTheme`,
   `fromShades`, `ramp`, `levels`, the tree. Static generation. Rewire
   `@tamagui/config/v6` off the v5 path.
3. Migrate kitchen-sink (`theme.dev.ts`), run the visual pass and the size
   assertion.
4. Remove runtime component-theme resolution from `@tamagui/web`.
5. Delete v5 entries and `@tamagui/theme-builder`; port studio; decide
   `generate-themes`.
6. Docs and the codemod guide (`color1-12` rename, removed builder options,
   surface -> level mapping).

## Validation

1. Render a nested example web and native, light and dark: base page, level-2
   panel, Button inside resolving level 3 via its own `level2` boundary.
2. `light_inverse` shares dark's CSS declaration block (inspect generated CSS);
   `light_inverse_level2` shares `dark_level2`.
3. `light_red_level2` is a real map; `light_red_level3`/`level4` are aliases of
   it; a Button inside `theme="red"` renders red, not gray.
4. Size assertion: distinct map count matches the expected ~28; record raw and
   gzip CSS/static-module deltas against current v6 output.
5. Visual pass over the starting scale numbers in both schemes at all levels,
   including bold and tint treatments; tune shades in the scale objects only.
6. Type checks: generated name literals resolve, invalid names and non-token
   strings error (`@ts-expect-error` cases), `values` keys check against the
   theme key union.

## Open items

- Exact shade numbers in all three scale sets are starting points; settle them
  in the step-3 visual pass.
- Alpha variants (`background0`, `background0075`, `color0`, etc.) exist in
  current v6 output via v5 palette padding. Lean: drop from the default and use
  opacity styles or literal rgba where needed; grep kitchen-sink and site usage
  before deciding.
- `shadow-color` ships as literal rgba in the scales; revisit if shadow tokens
  become cross-platform generics.
- `ramp()` keys ship in every theme (11 keys per distinct map); that is what
  makes scheme- and palette-relative styling work everywhere. Revisit only if
  the size assertion flags the cost.
