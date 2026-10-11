---
name: tamagui-v6-config
description: Tamagui v6 theme system: the light/dark/accent/brand/inverse/level/active theme family, the background-active one-off key, and recipe-tree authoring with createV6Config. Use when choosing a theme for a surface, building a selected/emphasis state, or authoring a custom v6 colors pack.
metadata:
  version: 3.0.0
---

# Tamagui v6 Config Skill

The v6 colors pack is themes plus the palette they generate from. Most apps
take the default pack (`@tamagui/config/v6`) as-is; a custom pack keeps the
same theme family so every component and every agent keeps working.

## 1. The Theme Family

Every name below nests under both roots (`light_*`, `dark_*`). A short name
in `<Theme name="...">` or the `theme` prop resolves against the parent theme
first and walks up until it finds a match.

| Theme | What it is | Reach for it when |
| --- | --- | --- |
| `light` / `dark` | The base: neutral ground, `background` one rung off the extreme (50 light, 950 dark) so hover has somewhere paler to go | The page and everything on it |
| `accent` | Brand palette, `tint` treatment: a subtle brand wash (bg 100/900, type a few rungs away at 700/200) | Content areas with a brand tint: callouts, info panels |
| `brand` | Emphasis: by default the scheme flip, the same theme as `inverse` | On/off controls (checked checkbox, on toggle), tooltips, primary buttons. The separate name is what a design system redefines when it wants its own emphasis look: the `bold` treatment grounds on the strongest brand rung instead (600 light, 500 dark) |
| `inverse` | Flips the scheme | Opposite-scheme surfaces. Same values as `brand` until a design system redefines `brand` |
| `black` / `white` | Pins a scheme outright, from any parent | A menu that must read dark over a light page, wherever it mounts |
| `level2` / `level3` / `level4` | Steps the surface away from the page ground: deeper in light, paler in dark, one rung per level | Layered surfaces: cards over the page, popovers over cards |
| `active` | The selected state: `background` one rung toward white from resting, every hover/press/focus shift pinned to resting, the `color-1..11` ramp untouched | Selected rows, checked cards, current navigation items |

Level notes: tint grounds mid-ramp, so its levels walk the type along with the
surface and top out at three real steps. Bold is already the loudest surface
in the system, so it does not nest: levels under it are a no-op.

`active` exists at the root (`light_active`, `dark_active`) with level
children. Nested deeper, the name walk falls back to the nearest active
ancestor: `active` inside a tinted or leveled surface resolves to the root
active theme, not a tinted one.

## 2. Selected State Done Right

A selected surface swaps onto the `active` theme. The `theme` prop must ride
the props, never a variant: variants resolve into styles after the theme is
chosen, so a variant cannot swap it. Keep the key present with a null value
so toggling never re-parents the subtree:

```tsx
<Frame theme={selected ? 'active' : null} bg="background" />
```

The `hover:` / `press:` background clauses on the component stay as authored:
under the active theme they resolve to the same value as `background`, which
is what keeps a selected surface steady instead of flickering on hover. Press
feedback still comes through `opacity`, outside the theme.

## 3. The State-Key Rule

`background-hover`, `background-press`, `background-focus` (and the
`border-color-*` / `color-*` families) exist only under their matching
condition. Never use one as a base value: `background-press` as a resting
fill inverts its meaning and breaks the moment the theme, not the state,
should own the value.

```tsx
bg="background hover:background-hover press:background-press"  // right
bg="background-press"                                          // wrong
```

For a selected fill without a theme swap, each theme carries
`background-active`: the same rung the active theme grounds on, usable as a
one-off. Under the active theme it equals `background`.

## 4. Authoring a Pack

A pack is a recipe tree plus a `getTheme` over scale tables, composed with
`createV6Config`:

```tsx
import { createV6Config } from '@tamagui/config/v6'

const v6 = createV6Config({ themes: createMyThemes(), colorTokens })
```

Recipes merge down the tree: a child states only what changes
(`inverse` flips `scheme`, `active` sets the `active` marker) and inherits
the rest, so the marker survives deeper nesting. Scales live in
`Record<treatment, Record<scheme, Record<level, ThemeScale>>>`; `raise`
walks the background and border families one ladder rung per step, and
`background-active` rides along so levels keep the one-rung relationship.
`ramp` maps the palette onto `color-1` (nearest the background) through
`color-11` (nearest the type), reversing for dark schemes and deep-grounded
scales. Static packs check in their output: run the package's `generate`
script after touching the tree and keep the generated file in sync.

A custom treatment (a page ground with its own hover direction, a brand
emphasis surface) adds one entry to the scales record and one branch name to
the tree. It inherits `levels()`, `active`, and the state-key rule for free.
