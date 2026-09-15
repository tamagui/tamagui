# Remove the size concept from core; each styled component owns a plain size variant

Decided by Nate 2026-09-14. Replaces the rejected `plans/typed-user-sizes.md`.

Landed 2026-09-15 on `v3-beta`: lane A tip `27b7fb391a` with review fixes
`f5725d8b5d` and `b0faaf0731`, merged as `f950341de8`, and the integration
fallout fixed in `43f6aadf48` (slider orientation), `e06052bdec` (kitchen-sink
named sizes) and `5e9c4862d9` (input type test), merged as `0742f1a26b`. The
screenshot gate in Validation below could not run: `code/kitchen-sink`'s
`screenshot` script points at a `playwright-screenshot.config.ts` that does not
exist in this repo, and the screenshot test itself still reads paths from
before the repo re-org. Sizes are pinned by unit and computed-style tests
instead.

## Why

`size` was hoisted into a global concept: a `sizes` key on `createTamagui`, the
`@tamagui/size` package (`resolveSize`, `SizeContext`, `SizeSpec`), a `SizeName`
config special case in `types.tsx`, and `styled.dynamic<any>` plumbing. The v6
table is shadcn's `h-9 px-4 py-2 text-sm` copied into config. shadcn keeps that
table inside each component; hoisting it was the mistake. It is untyped, it
bakes font px into compiled CSS instead of `var(--f-size-*)`, and core is moving
toward plain CSS, so a control-sizing recipe does not belong there.

`paddingX` / `paddingY` / `radius` only existed as the recipe's own vocabulary
in `SizeSpec`. They die with it. Variants use real CSS keys.

## Rules

1. Core knows one meaning of `size`: the width/height style prop. Nothing else.
2. `@tamagui/ui` primitives have no `size` prop. An unstyled Input is an input
   whose height is padding plus line height.
3. Each component in `code/ui/tamagui/src/components/*.tsx` (the shadcn
   registry sources) owns its size table inline as a keyed variant. Nothing
   shared between components. Consistency comes from the token scale.
4. Parts agree through a local `createStyledContext` on the frame, exactly how
   `SizeContext` works today, created inside the component file.

## The pattern

```tsx
const ButtonContext = createStyledContext<{ size?: 'sm' | 'md' | 'lg' }>({ size: 'md' })

const ButtonFrame = styled(ButtonBehaviorFrame, {
  context: ButtonContext,
  variants: {
    size: {
      sm: { paddingInline: '3', paddingBlock: '1.5', borderRadius: 'md', gap: '1.5' },
      md: { paddingInline: '4', paddingBlock: '2',   borderRadius: 'md', gap: '2' },
      lg: { paddingInline: '6', paddingBlock: '2',   borderRadius: 'md', gap: '2' },
    },
  } as const,
  defaultVariants: { size: 'md' },
})

const ButtonText = styled(ButtonBehaviorText, {
  context: ButtonContext,
  variants: {
    size: { sm: { fontSize: 'sm' }, md: { fontSize: 'sm' }, lg: { fontSize: 'base' } },
  } as const,
})

const iconSize = { sm: 16, md: 16, lg: 20 }
const ButtonIcon = (props) => {
  const { size } = ButtonContext.useStyledContext()
  return <ButtonBehaviorIcon size={iconSize[size ?? 'md']} {...props} />
}
```

Keyed variants lower per branch in the compiler with no runtime and emit the
font variable, not px (RAN, static-tests harness, 2026-09-14). Variant keys
shadow the width/height meaning of `size`, so `size="4"` on a control is a type
error at 3.0. That is accepted; the upgrade guide already says so for v2 users.
Circular buttons compute height from the same local table (line height plus
padding), not from a resolver.

## Migration story

None for `tamagui` users: `<Button size="sm" />` keeps working. Only the
`size="$4"` and `size={true}` spellings change (`true` becomes the default
variant). Users of `@tamagui/ui` primitives who relied on Input's implicit size
copy the variant from the registry file.

## Delete

- `sizes` from `createTamagui` and from every config (`settings.ts`, `v5-base.ts`,
  `v6-base.ts`, `config-default`), plus `CreateTamaguiProps.sizes`,
  `GenericSizes`, `SizeSpec`, `SizeName`, the `types.tsx:1067` special case,
  and `styledDynamic.ts` passing `conf.sizes`.
- The `@tamagui/size` package and its tests; `SizeContext`, `resolveSize`,
  `TokenSize` re-exports from `@tamagui/core` and `tamagui`.
- `resolveSize` callers: `get-font-sized`, `get-token`, `font-size`,
  `helpers-icon/themed`, `helpers-tamagui/useGetThemedIcon`, `card`, `group`,
  `input/shared`, `list-item`, `shapes/getShapeSize`, `slider`, `spacer`,
  `toggle-group`, `tooltip/TooltipSimple`, `checkbox/CheckboxStyledContext`,
  `label`, `tabs`. Primitives lose `size`; helpers that mapped a size token to
  a px take a number or a font-size key.
- `Size.web.test.tsx`, `Size.native.test.tsx` in components-test, replaced by
  one Button test asserting the sm/md/lg computed styles.
- Docs: size sections in `how-to-upgrade.mdx`, the v5/v6 config docs, and any
  `sizes` mention on tamagui.dev.

## Rewrite (skin components)

Button, Checkbox, RadioGroup, Select, Switch, Tabs, Input, Card, ListItem,
Slider, ToggleGroup. Same numbers as today's v6 table so the skin is visually
unchanged. `Text`/`Paragraph`/`SizableText` keep `size` as the font scale only.

## Validation

- `bun run build` in touched packages, `bun run lint`, `bun run check`,
  `bun run typecheck` at root.
- kitchen-sink Button, Input, Select, Switch cases screenshot-compared before
  and after (same px).
- static-tests: `<Button size="sm">` bails as before (behavior HOC); a bare
  `styled(View, { variants: { size: {...} } })` lowers per branch.
- Registry: `bun run registry:check` green.
