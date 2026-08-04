# The two theme failures are stale expectations

`StyledHOCNamed:10` and `StyledButtonTheme:9` both failed because their tests
described the theme model before the v3 surface-level decision. Neither failure
identifies a theme-engine regression.

## StyledHOCNamed: component themes were removed intentionally

The fixture expected `styled(Label, { name: 'MyLabel' })` to select a
hand-written `light_MyLabel` theme. V2.6.3 implemented that lookup by combining
the current theme name with `componentName`. V3 removed this runtime behavior in
`5cd416790a` (`perf(web): remove runtime component themes`).

The product decision is recorded in `next.md` and
`plans/v3-beta-campaign-plan.md`: component themes give way to explicit
`theme="surface1-3"` sub-themes. `plans/surface-levels.md` also states that
whole-subtree component-state theming will not be rebuilt.

The red test therefore pinned a removed feature. The `StyledHOCNamed` test,
usecase, registration, and its `light_MyLabel` fixture theme are deleted.

The original removal left `componentName` flowing into theme resolution even
though `useThemeState` no longer reads it. That dead path is removed from
`ThemeProps`, `themeable`, `createComponent`, `usePropsAndStyle`, and
`ThemeDebug`. Component names remain available where they still have meaning:
static configuration, global default props, generated component classes, and
development diagnostics.

## StyledButtonTheme: Button rises one surface level by design

Instrumentation showed the copied Button skin entering an explicit
`<Theme name="level2">`. Its frame correctly resolved `light_green_level2`
while the old reference View resolved `light_green`.

This is the intended v3 behavior. `plans/v3-composable-theme-levels.md` says a
skin that should visually rise above its parent, such as Button, enters
`level2` by default. The same plan uses Button as the concrete composition
example and requires the copied Button skin to enter `level2`.

The test now compares Button with a View inside the same explicit `level2`
boundary. It remains relational and verifies the intended surface behavior
without pinning a generated color value.
