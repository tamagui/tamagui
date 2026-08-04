# The two theme failures do not share a cause

`StyledHOCNamed:10` and `StyledButtonTheme:9` were isolated together as class (b)
regressions because both are theme resolution failing on web. They are two
different things, and only one of them is a bug.

## StyledHOCNamed:10 — real gap: componentName sub-themes are not implemented

`styled(Label, { name: 'MyLabel', color: 'color' })` should resolve the
hand-written theme `light_MyLabel: { color: 'red' }` at `tamagui.config.ts:382`.
It renders the base default `rgb(3,7,18)` instead, and the element has **no theme
class at all**.

Instrumenting every `Theme` render on that page:

```
name=light      componentName=undefined  -> resolved=light
name=undefined  componentName=undefined  -> resolved=light
name=undefined  componentName=MyLabel    -> resolved=light   <-- ignored
```

`themeable.tsx:48-51` threads the component name into a `Theme` wrapper as
`filteredProps.componentName`, and `createComponent.tsx` passes it on as
`themeStateProps.componentName`. **The resolver never reads it.**
`hooks/useThemeState.ts` is 671 lines with zero occurrences of `componentName`,
and `hooks/useTheme.tsx` has none either. Its name search at
`useThemeState.ts:622` is gated on `if (name)` and walks `parentParts` to build
`${base}_${name}` — using the theme *name* prop only. With no `name` the function
returns null, so a component-named `Theme` is a no-op.

Positive control for that absence: the same files do read the sibling props
(`disable` appears three times in `useThemeState.ts`, `useTheme.tsx` reads
`props.name`), so the search was capable of finding `componentName` had it been
used.

So component-name sub-themes (`light_<ComponentName>`) are a v2 capability that
v3's theme resolver does not implement. The test is right and should stay red.

**This is a feature-level change to the theme engine, not a small fix.** The
narrow version is: in the resolver, when `name` is absent and `componentName` is
present, try `${parentName}_${componentName}` and use it if it exists. That
restores the documented behaviour and is a no-op for configs that define no
component themes. It is late-beta engine work and wants the theme owner's call
rather than a lane deciding it, which is why it is written up rather than done.

## StyledButtonTheme:9 — not a naming failure, and possibly not a bug

The button resolves `light_green_level2` while the reference `View` resolves
`light_green`, so their backgrounds differ (green-50 vs green-100). That is not
the `componentName` path. The same instrumentation shows an **explicit** render:

```
name=green    componentName=undefined   -> resolved=light_green
name=undefined componentName=ButtonFrame -> resolved=light_green   (no change)
name=level2   componentName=undefined   -> resolved=light_green_level2  <-- here
```

Something in the Button path renders `<Theme name="level2">`, and
`light_green_level2` is a real theme in this config (the tint tree defines
`level2`..`level4`). The `componentName=ButtonFrame` wrapper resolves to
`light_green` unchanged, i.e. it is inert exactly as the first finding predicts.

So the button sits on a deliberate level-2 surface. The test asserts

```ts
expect(styles.backgroundColor).toBe(referenceStyles.backgroundColor)
```

against a plain `View` on the level-1 surface. **I called this assertion
epoch-proof earlier because it is relational, and that reasoning was incomplete:
a relational assertion is immune to token values moving, but not to one side
gaining a surface level the other does not have.** Whether Button *should* apply
`level2` is a design question I cannot settle from the test, so I have not
touched it.

Someone who owns the Button skin should decide between: the level-2 surface is
intended and the test should compare against a level-2 reference, or the level is
unintended and the Button should not apply it. Do not "fix" it by changing the
expected colour to green-50, which would pin whatever the button currently does.

## Why they looked like one thing

Both are "a themed component resolves the wrong theme on web", both are
user-facing, and both were isolated from the same run. The discriminator was
instrumenting `Theme` itself and reading the resolved name per render, rather
than reasoning from the computed colours. One turned out to be a prop the
resolver ignores; the other an extra theme the resolver applies correctly.
