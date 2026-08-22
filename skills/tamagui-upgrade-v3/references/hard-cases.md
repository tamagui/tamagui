# Hard-case recipes: what the codemod flags, and how to rewrite it

Each pattern below stays authored after `--write` and appears in the report.
These are the rewrites. Token names in examples are placeholders; use the
app's configured names.

## Ternaries over token literals

```tsx
// v2
<View bg={active ? '$color3' : 'transparent'} />
```

A tree of string literals is rewritten by the codemod in place:

```tsx
<View bg={active ? 'color3' : 'transparent'} />
```

Dynamic scalars stay expressions in v3; only conditions move into strings.
Nothing to do beyond verifying the diff. Only a branch whose type the checker
cannot prove gets flagged (`unprovable-dynamic-value`, `dynamic-string-value`),
and then you either tighten the type or confirm the value never holds a
legacy `$` spelling at runtime.

## Dynamic values inside condition objects

```tsx
// v2
<View hoverStyle={{ bg: disabled ? undefined : '$surface-hover' }} />
```

The condition is static but the payload is runtime. Lift the branch outside
the clause; a clause-only value needs no base:

```tsx
<View bg={disabled ? undefined : 'hover:surface-hover'} />
```

When the same shape repeats, it is a variant:

```tsx
const Row = styled(View, {
  variants: {
    interactive: {
      true: { bg: 'hover:surface-hover' },
    },
  } as const,
})

<Row interactive={!disabled} />
```

## Whole condition props as runtime expressions

```tsx
// v2
<View hoverStyle={onPress ? hoverBg : undefined} />
<View $group-item-press={visibleStyle} />
```

Same lift: the branch selects between flat strings per affected property.
If the referenced object lives in a constant, migrate the constant to flat
values first, then inline or select it per property. One object holding many
properties becomes one flat string per property; if that spreads too wide,
make it a variant on the component instead.

## Conditional spreads carrying style objects

```tsx
// v2
<View {...(isActive && { bg: '$blue10', hoverStyle: { bg: '$blue11' } })} />
```

Convert the object's members; keep the spread and its position:

```tsx
<View {...(isActive && { bg: 'blue-500 hover:blue-600' })} />
```

The spread's position in the attribute list is load-bearing: later
contributions replace only the base or exact clauses they restate. Never move
a spread across other style props during migration. The codemod refuses to
merge across an opaque spread (`condition-order-not-preservable`); after you
convert the spread object's values by hand, re-run the report to confirm the
site is clean.

## Functional variants

```tsx
// v2
variants: {
  step: (val: number) => ({
    x: val * 10,
    enterStyle: { opacity: 0 },
  }),
}
```

The function stays; its returned values migrate like any style object:

```tsx
variants: {
  step: (val: number) => ({
    x: val * 10,
    opacity: 'enter:0',
  }),
}
```

Numbers computed at runtime stay numbers (raw platform values). Only make a
computed value a string when it needs a clause or a token.

## Tokens behind module constants and maps

```tsx
// v2
const RADIUS = '$6'
const DOT_COLORS = { ok: '$green10', warn: '$yellow10' }
```

The codemod flags the use site (`legacy-token-constant`) but the constant is
what migrates:

```tsx
const RADIUS = '6'
const DOT_COLORS = { ok: 'green-500', warn: 'yellow-500' }
```

Then check every consumer of the constant, including non-Tamagui consumers
that may have depended on the `$` spelling.

## Tokens embedded in composite strings

```tsx
// v2
<View boxShadow="0 0 10px $shadowColor" outlineColor="$blue10" />
```

Named tokens become bare names, resolved config-first inside the value:

```tsx
<View boxShadow="0 0 10px shadow-color" outlineColor="blue-500" />
```

A numeric token inside a composite (`legacy-numeric-composite-token`) has no
name to resolve in place; substitute its resolved CSS value.

## Shadow and transform part conditions

Part props (`shadowColor`, `shadowRadius`, `textShadowOffset`, `skewX`,
`rotateY`, ...) accept plain values but cannot carry clauses. A condition on a
part moves to the composite, and you author the complete value for each
state; the tool never guesses the sibling parts:

```tsx
// v2
<View shadowColor="$shadowColor" shadowOffset={{ width: 0, height: 2 }} shadowRadius={8}
  hoverStyle={{ shadowColor: '$blue10' }} />

// v3
<View boxShadow="0 2px 8px shadow-color hover:0 2px 8px blue-500" />
```

## `exitStyle` in shared or web files

`exit:` clauses evaluate on native only; web has no exited-state selector, so
exit remains animation-driver territory. In `.native.tsx` the conversion is
clean. In shared or web files, keep `exitStyle` authored:

```tsx
<View opacity="0.5 enter:0" exitStyle={{ opacity: 0 }} />
```

The mirror image: component-tier states (`open`, `checked`, `invalid`) lower
on web but have no native source yet, so shared usage relocates to `.web.tsx`.

## `x` and `y` scale cutover

Legacy `$4` on `x`/`y` resolved through the size scale; flat `4` resolves
through space. With the default configs these agree; a custom config with
different size and space values changes the rendered offset by design. The
report marks converted `x`/`y` rows; review them against the app's scales.

## Group size conditions become containers

```tsx
// v2: on a descendant of the element declaring group="card"
<Text $group-card-maxMd={{ display: 'none' }} />

// v3
<Text display="@max-md/card:none" />
```

The element declaring the group must also declare the query container:

```tsx
<View group="card" container containerName="card">
```

Declaring a container changes CSS containment, so the codemod only does this
when the owning ancestor is provable in the same file. The
`unproven-container-group` and `ambiguous-container-group` flags mean you
find the declaring element yourself and verify layout after adding
`container` to it. Plain state groups (`$group-card-hover` to
`group-hover/card:`) need no container.

## Runtime theme generation

`mutateThemes`, custom user palettes, and generated theme sets are config-side
work the codemod never touches. Migrate them with the config phase: v6 theme
keys are kebab-case, palette-step names are gone, and any theme built at
runtime must emit the same vocabulary the static config does, or every flat
value referencing it silently falls back to literal CSS.
