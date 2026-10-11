# Named control sizes

Status: approved 2026-09-03. Replaces the "control ramp" in `@tamagui/size`.

## Decision

Every component that takes `size` accepts the same five named sizes: `xs sm md
lg xl`. A named size is a recipe of tokens, never a pixel table. The config owns
the table; skins read it. Height is never set for a named size. It falls out of
the font's line-height plus vertical padding, so text, icon, and frame stay
aligned by construction.

Token keys (`size="$4"`, `size="4"`) keep the v2 meaning: one index applied to
every scale (`font.size[4]`, `tokens.space[4]`, `tokens.radius[4]`, and
`minHeight: tokens.size[4]`). Under the v5 config that is the 44px button it
always was. Under the v6 config `tokens.size[4]` is 16px, the same as
`<Square size="$4" />`. That is honest and documented. The ramp that quietly
rewrote v6 `size="$4"` into 44px is deleted.

`size={number}` on a control is a dev error that resolves to the default size.
Numbers stay pixels on shapes (`Square`, `Circle`, `Avatar`).

Text components already speak tailwind's own scale (`xs sm base lg xl 2xl ...
9xl`), because v6 fonts merge `tailwindFontSize` and `tailwindLineHeight` on top
of the numeric keys. A control's recipe points at those same font keys, so
`<Button size="md">` text is `<Paragraph size="sm">` text, exactly the shadcn
pairing (`h-9 text-sm`). Text keeps `base` rather than `md` because tailwind
users know `text-base`; there is no `text-md` to mirror.

## The generic package

`@tamagui/size` exports one resolver and the types. No tables, no policy, no
`createSizeTable`.

```ts
export type SizeSpec = {
  /** font.size / font.lineHeight key, resolved against the component's font */
  fontSize: string
  /** tokens.space keys */
  paddingX: string
  paddingY: string
  /** tokens.radius key */
  radius: string
  /** tokens.space key for gap between icon and text; defaults to paddingY */
  gap?: string
  /** icon px override; default rounds the font size up to the 4px grid */
  icon?: number
}

export type Sizes = { default: string } & Record<string, SizeSpec>

export type ResolvedSize = {
  /** the named size, or the token key */
  name: string
  /** spread onto the frame */
  frame: {
    paddingHorizontal: Variable | number
    paddingVertical: Variable | number
    gap: Variable | number
    borderRadius: Variable | number
    /** token path only (v2 semantics) */
    minHeight?: Variable | number
  }
  /** spread onto the text */
  text: { fontSize: Variable | number; lineHeight?: Variable | number }
  /** px */
  icon: number
  /** lineHeight + 2 * paddingVertical for a named size; tokens.size[k] for a token. px, excludes border */
  controlHeight: number
}

export const resolveSize = (
  value: SizeTokens | number | true | undefined,
  env: { tokens: TokensParsed; font?: Font; sizes?: Sizes }
): ResolvedSize
```

Rules inside `resolveSize`:

- `true` or `undefined` resolves `sizes.default`.
- A key present in `sizes` resolves the recipe. Missing `sizes` or an unknown
  name that is also not a token key is a dev error and resolves the default.
- Otherwise the value is a token key: strip `$`, index every scale with it.
- The icon default is `Math.ceil(fontSizePx / 4) * 4`: 12 for 12, 16 for 14 and
  16, 20 for 18. That is shadcn's `size-3` for `text-xs` and `size-4` for
  `text-sm`.
- The font is `env.font` (the component's `fontFamily`), falling back to the
  config default font. Passing `fontFamily` is how a caller says "size this
  against the heading font".

`env` in `styled.dynamic` gains `sizes` (from `config.sizes`). `SizeContext`
stays as is.

## Config

`createTamagui({ sizes })` is a new top level key, passed through raw like
`settings`. `@tamagui/config/v6` and `/v5` each ship a table. Values are token
keys, so the same recipe renders correctly under any config that has those
keys.

### v6 (tailwind keys)

| name | fontSize | line | paddingX | paddingY | radius | icon | control height |
| ---- | -------- | ---- | -------- | -------- | ------ | ---- | -------------- |
| xs   | xs 12    | 16   | 2 = 8    | 1 = 4    | sm 4   | 12   | 24             |
| sm   | sm 14    | 20   | 3 = 12   | 1.5 = 6  | md 6   | 16   | 32             |
| md   | sm 14    | 20   | 4 = 16   | 2 = 8    | md 6   | 16   | 36             |
| lg   | base 16  | 24   | 6 = 24   | 2 = 8    | md 6   | 16   | 40             |
| xl   | lg 18    | 28   | 8 = 32   | 2.5 = 10 | lg 8   | 20   | 48             |

Default `md`. Control height excludes the 1px border, so a bordered button
renders 2px taller than the shadcn `h-*` it mirrors (`h-6 h-8 h-9 h-10 h-12`).
Accepted: the border is part of the frame's own style, and named sizes never
set height.

### v5 (numeric keys)

| name | fontSize | paddingX | paddingY | radius |
| ---- | -------- | -------- | -------- | ------ |
| xs   | 2        | 2        | 1-5      | 2      |
| sm   | 3        | 3        | 2        | 3      |
| md   | 4        | 4        | 2        | 4      |
| lg   | 5        | 5        | 2-5      | 5      |
| xl   | 6        | 6        | 3        | 6      |

Default `md`. v5 space is `sizeToSpace(size)`, so `2 = 7px`, `2-5 = 10px`,
`3 = 13px`. Measure at implementation time and adjust a step if a size looks
wrong; the keys above are the starting point, the rendered result is the spec.

## Per component

Every size variant becomes `resolveSize(val, env)` and spreads `frame` or
`text`. No component reads `tokens.size` for a control any more.

| component                       | frame                               | text          | other                                            |
| ------------------------------- | ----------------------------------- | ------------- | ------------------------------------------------ |
| Button                          | `...frame`, `width: 'auto'`         | `...text`     | icon = `icon * scaleIcon`; circular = `controlHeight` square, `padding: 0` |
| Input / TextArea                | `...frame`                          | `...text`     | delete `inputSizeKeys`                           |
| Select trigger / item / native  | `...frame`                          | `...text`     | native: keep the `paddingRight` for the chevron  |
| Tabs tab                        | `...frame`                          |               |                                                  |
| ListItem                        | `...frame`                          | title `...text`, subtitle one font key smaller |                     |
| Label                           |                                     | `...text`     | delete the `lineHeight: tokens.size` hack        |
| Card                            | `padding: frame.paddingHorizontal`, `borderRadius` |  |                                                |
| Toggle item                     | `width/height: controlHeight`, `borderRadius` |     |                                                  |
| Checkbox / RadioGroup item      | `width/height: icon`, radius `max(3, icon/5)` |     |                                                  |
| Switch                          | track `height: icon + 2`, `width: icon * 2`; thumb `icon` |  | md = 18x32, shadcn's `h-[1.15rem] w-8`  |
| Slider                          | thumb `lineHeight`; track `paddingY`|               | md = 20 thumb, 8 track                           |
| Progress                        | `height: paddingY`                  |               | read the current variant first                   |
| Avatar                          | named = `controlHeight` square      |               | numbers and size tokens stay px / `tokens.size`  |
| Tooltip                         |                                     | default font one key smaller |                                   |
| Dialog / Popover / Accordion / facets | `padding: '4'`, `borderRadius: '4'` (both configs: 16-18px, 9px) |  | delete `defaultTokenSizePolicy` |
| Square / Circle / Spacer        | unchanged                           |               | shapes, not controls                             |

## Deleted

- `controlSizes`, `resolveControlSize`, `defaultTokenSizePolicy`,
  `resolveSizeToken`, `resolveTokenSize`, `createSizeTable` and its types.
- `inputSizeKeys` in `@tamagui/input`.
- `ControlSizeRampCase` and `ControlSizeRamp.test.tsx`, replaced by
  `ControlSizesCase` and `ControlSizes.test.tsx`.
- The control ramp section of `how-to-upgrade.mdx`, replaced by the named
  sizes section.

## Tests

`ControlSizes.test.tsx` (kitchen-sink, default driver) renders every named size
for Button, Input, Select trigger, Tabs tab, ListItem, Toggle, Checkbox, Radio,
Switch, Label, Avatar and asserts, per size:

- every frame is at least as tall as its own text box
- Button, Input and Select trigger share a height at the same size
- Button icon width equals the recipe's icon px
- heights increase monotonically from xs to xl
- `size="$4"` under v6 renders a 16px min-height (token path stays honest)

`code/core/size/tests` covers `resolveSize` for named, default, token, unknown
name, and number inputs against a minimal config.

## Lanes

- A (owner): `@tamagui/size`, `createTamagui` `sizes`, `StyledDynamicEnv.sizes`,
  v5 and v6 tables, Button, Select, kitchen-sink case and test. Lands first.
- B: Input, Tabs, Label, ListItem, Card, Tooltip, Dialog, Popover, Accordion,
  facets.
- C: Toggle, Slider, Checkbox, RadioGroup, Switch, Progress, Avatar.
- D: docs (`how-to-upgrade.mdx`, `surface/3.0.0.mdx`, each component page's
  size prop), `code/tests/v3-canary`, `components-test/Size.*.test.tsx`,
  bundle ledger entry.

B, C and D start after A lands. `REVIEW: none - reviewed as part of the named
sizes assembly` for B, C and D; the assembled result gets one review.
