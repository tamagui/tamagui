# Composable theme levels for v3

2026-08-02. Status: partially superseded. This plan supersedes only the
relative-level deferral in `plans/surface-levels.md`. Its "Builder API"
section, the luminance-direction enforcement, and the emit-only-valid-paths
rule are superseded by `plans/v6-theme-creation.md`, which is the current
design for theme generation. The relative-level semantics, dedup approach,
size assertion, and acceptance condition here still apply.

## Decision

The base theme is implicit level 1. A nested theme named `level2` raises the
current subtree by one visual level. Repeating that boundary raises it again:

```tsx
<Theme name="brand">
  <Page backgroundColor="$background">
    <Theme name="level2">
      <Footer backgroundColor="$background">
        <Button>Continue</Button>
      </Footer>
    </Theme>
  </Page>
</Theme>
```

Button enters `level2` internally and styles its frame only with generic theme
keys:

```tsx
function Button(props: ButtonProps) {
  return (
    <Theme name="level2">
      <ButtonFrame
        backgroundColor="$background"
        borderColor="$border-color"
        hoverStyle={{
          backgroundColor: '$background-hover',
          borderColor: '$border-color-hover',
        }}
        pressStyle={{
          backgroundColor: '$background-press',
          borderColor: '$border-color-press',
        }}
        {...props}
      />
    </Theme>
  )
}
```

This is an ordinary nested theme boundary. It does not restore v2 component
themes and it generates no `Button` theme names.

In the example above, the footer resolves to level 2. Button asks for
`level2` again, so its full path resolves to level 3:

```txt
light_brand
light_brand_level2
light_brand_level2_level2  -> same values as light_brand_level3
```

The same composition applies under dark mode, accent, inverse, neutral, and
caller-defined color families. `brand` is an example family name, not a
reserved theme feature.

## Why the level is a theme

Changing visual depth affects a coordinated group of semantic values:

```txt
background
background-hover
background-press
background-focus
border-color
border-color-hover
border-color-press
border-color-focus
color
color-hover
color-press
color-focus
placeholder-color
outline-color
shadow-color
```

Numbered semantic keys such as `background2`, `background-hover2`, and
`border-color2` would duplicate that vocabulary at every level. A level theme
instead rebinds the existing generics as one operation. Skins keep using the
same generic keys at every depth.

The palette remains one reusable 12-step light/dark pair. Levels select and
rebind entries from that pair. They do not interpolate or compress a second
palette.

## Composition table

There are four absolute value maps per family and appearance. Generated names
form every path whose increments remain within level 4:

| Resolved level | Accepted path suffixes |
| --- | --- |
| 1 | base theme, with no suffix |
| 2 | `level2` |
| 3 | `level3`, `level2_level2` |
| 4 | `level4`, `level2_level3`, `level3_level2`, `level2_level2_level2` |

`level2` means one level above the current context. `level3` means two levels
above it, and `level4` means three levels above it. This makes a skin's default
`level2` boundary composable without teaching the skin its parent's absolute
level.

The builder must emit only paths that resolve through level 4. It must report
an unresolved level composition clearly during development. A skin used at
level 4 must stay at the current level rather than requesting another one.

## Size model

The complete graph costs eight names per color family and appearance, but only
four distinct theme value maps. Compared with the four direct level names,
composition adds four aliases:

```txt
level2_level2
level2_level3
level3_level2
level2_level2_level2
```

The current v3 runtime already deduplicates raw themes by appearance and value.
Names with identical maps share one parsed theme and one CSS variable
declaration block; CSS adds selectors for the aliases. Generated static theme
modules likewise point multiple properties at the same value constant. Preserve
that behavior and add a size assertion around generated output so composition
cannot accidentally duplicate variable blocks.

Removing v2 component-theme aliases creates substantially more room than these
four level aliases consume. Do not add a general recursive name generator. The
four-level composition table is the complete supported graph.

## Builder API

Palette data, semantic mapping, and the caller-owned family name remain
separate:

```ts
const themes = {
  ...defaultThemes,
  ...createV6Theme('brand', {
    palette: tailwindPalettes.blue,
    template: boldSurfaceThemeTemplate,
  }),
}
```

`boldSurfaceThemeTemplate` is an exported, copyable default. An application can
spread it and replace the scale or semantic maps without opting into a reserved
`brand` concept.

The template owns light and dark mappings for levels 1 through 4. For every
level and appearance, generation must resolve actual colors and enforce:

```txt
luminance(background-hover) > luminance(background)
luminance(background) > luminance(background-press)
```

Hover always becomes lighter and press always becomes darker. Palette index
direction alone is not sufficient because light and dark ramps can be stored in
opposite orders. Borders and other interactive generics must move consistently
with the background mapping.

## Surface and skin behavior

`Surface level={2}` enters `<Theme name="level2">`; levels 3 and 4 enter their
matching relative boundaries. A bare Surface stays at the current level. Its
facets continue to read generics as described in `plans/surface-levels.md`.

A skin that should visually rise above its parent, such as Button, enters
`level2` by default and uses generic theme keys. A skin that should remain
flush with its parent does not create a level boundary. Callers must be able to
disable a skin's default rise for the deepest supported surface.

Color-derived shadow values, including `shadow-color`, belong in the level
theme. Shadow geometry and opacity stay in the copied Surface or skin level
mapping unless v3 gains scalar shadow generics that work on both web and native.
Do not encode a platform-specific shadow object in the color theme.

## Implementation path

1. Replace the v5-backed v6 builder with a v6-native palette and template
   mapper. Keep static v6 imports free of the builder.
2. Add the four absolute light/dark level maps and generate the finite alias
   table above for every requested family.
3. Use the existing theme deduplication path so aliases share parsed values and
   CSS declarations. Do not add special runtime arithmetic when exact generated
   names already satisfy parent-chain resolution.
4. Update the copied Surface fixture to treat its numeric level as a relative
   theme boundary.
5. Update the copied Button skin to enter `level2` by default and use only
   generic keys. Do not generate component-theme names.
6. Document one nested panel example showing its Button resolving one level
   higher.

Likely owning files on the current v3 config branch include
`code/core/config/src/v6-builder.ts`, the v6 generated-theme input and output,
the v6 config exports, focused builder tests, the copied Surface and Button
skins, and the v6 color/theme documentation. Confirm current ownership before
editing because v3 work is landing concurrently.

## Validation

1. Render the same nested example on web and native in light and dark mode.
   Verify base, panel, and Button resolve levels 1, 2, and 3 respectively.
2. Resolve `level3` and `level2_level2` and verify every generic has the same
   runtime value. Do the same for all four level-4 paths.
3. Inspect generated CSS and verify aliases share a declaration block while
   retaining every required selector.
4. Measure the generated static module and CSS before and after. Record the
   raw and gzip deltas in the implementation handoff.
5. Run the luminance-direction and foreground-contrast matrix across every
   built-in palette in both appearances and all four levels.
6. Exercise hover and press on the nested Button. Hover must be lighter than
   rest and press must be darker than rest in both appearances.
7. Verify borders remain visible at every level and shadow treatment increases
   only where the copied skin requests elevation.

## Acceptance condition

The landing-page pattern works without numbered surface tokens or component
themes: an outer family theme establishes the bold brand surface, a nested
`level2` panel moves all its generics together, and a Button's own `level2`
boundary composes to level 3. The generated bundle contains four value maps per
family and appearance, with finite deduplicated aliases for the other valid
paths.
