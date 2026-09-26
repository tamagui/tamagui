# Config-driven control sizing

## Why

Every control skin in `code/ui/tamagui/src/components/` currently hardcodes px ladders
that are, provably, frozen outputs of formulas over tokens the user already configures.
Verified against `code/core/config/src/v6-tailwind-scales.generated.ts`:

```
buttonHeight = lineHeight + paddingBlock*2 + 2   (2 = the frame's 1px border each side)
  xs: 16 + 4*2  + 2 = 26 ✓    sm: 20 + 6*2  + 2 = 34 ✓    md: 20 + 8*2 + 2 = 38 ✓
  lg: 24 + 8*2  + 2 = 42 ✓    xl: 28 + 10*2 + 2 = 50 ✓

buttonIconSize = ceil(fontSize / 4) * 4
  xs: 12 ✓   sm: 16 ✓   md: 16 ✓   lg: 16 ✓   xl: 20 ✓

listItemIconSize = same formula, same five values ✓

checkboxSize / radioSize / switchTrackSize height = round(1.4 * fontSize)
  xs: round(1.4*12)=17 ✓  sm: round(1.4*14)=20 ✓  md: round(1.4*16)=22 ✓
  lg: round(1.4*18)=25 ✓  xl: round(1.4*20)=28 ✓
```

All 5/5 on every table. So a user who retunes their type scale gets bigger text inside
a button whose height and icon do not move. That is the bug.

Second problem: `size` is typed off nothing. Five hand-written identical unions
(`ButtonSize`, `CheckboxSize`, `RadioGroupSize`, `SwitchSize`, `ListItemSize`), each
`'xs' | 'sm' | 'md' | 'lg' | 'xl' | boolean`, with no relation to the config. Adding a
size means editing five files and still getting no autocomplete.

History: `@tamagui/size` used to do this derivation (`resolveSize(val, env)` returning
`{ frame, text, icon, controlHeight }`). It was deleted in `659183a2fb` (-610 lines) and
the formulas were frozen into literal tables. The deletion was right — that package had
two branches (named size vs token key), retry loops, and fallback chains. The formulas
were not the problem. This plan brings back the derivation without the machinery.

## Constraints

- **No new package.** The derivation is ~20 lines and goes in `@tamagui/web` next to the
  other config resolvers. Do not recreate `@tamagui/size`.
- **One path, no fallbacks.** No retry loops, no "try the key then the default then token
  4". A missing size name is a dev-time error, not a silent fallback chain.
- **One ladder, not per-component.** `buttonFrameSize` and `listItemFrameSize` are already
  byte-identical, as are `buttonTextSize` and `listItemTextSize`. Do not add per-component
  keys to config; a component that genuinely differs overrides in its own skin file.
- **Pixels must not move** except where step 4 explicitly says so. The CSS baseline test is
  the check.

## Step 1 — `sizing` in core + `defaultSizing` in v6

### 1a. Types in `code/core/web/src/types.tsx`

```ts
/** one rung of the control ladder: token keys only, never pixels */
export type SizeRecipe = {
  fontSize: string
  paddingInline: string
  paddingBlock: string
  gap: string
  radius: string
}

/** px in, px out: the rules that turn a resolved rung into a control's geometry */
export type SizingDerivations = {
  /** control height without border: the text's line box plus its vertical padding */
  height: (r: { fontSize: number; lineHeight: number; paddingBlock: number }) => number
  /** icon px for a rung */
  icon: (r: { fontSize: number }) => number
  /** the square controls: checkbox box, radio circle, switch track height */
  square: (r: { fontSize: number }) => number
}

export type GenericSizing = {
  default: string
  sizes: Record<string, SizeRecipe>
} & SizingDerivations
```

Add `sizing` to `CreateTamaguiConfig` / `ConfProps` / `InferTamaguiConfig` as a new
generic slot. **Mirror how `settings` (`H extends GenericTamaguiSettings`) already flows
through that chain** — same shape, same position in the inference. This is the part that
makes `TamaguiConfig['sizing']['sizes']` carry the user's literal keys.

### 1b. `SizeName` with the unaugmented fallback

`keyof GenericSizing['sizes']` collapses to `string` when `TamaguiCustomConfig` is empty,
which is the `any`-ish degradation we are removing. Copy the idiom already used by
`AnimationDriverKeys` at `code/core/web/src/types.tsx:1155` ("Falls back to 'default' only
when TamaguiCustomConfig is empty"):

```ts
/** the config's size names; falls back to the v6 ladder when unaugmented */
export type SizeName =
  | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  | Extract<keyof TamaguiConfig['sizing']['sizes'], string>
```

Verify both directions with a type test: an augmented config exposes its own keys
(including a custom `xxl`), an unaugmented one still autocompletes the five defaults and
is **not** `string`.

### 1c. `resolveSizing` in `code/core/web/src/helpers/`

```ts
/** a size name -> its rung resolved to pixels, against the config in `env` */
export const resolveSizing = (name: SizeName | boolean | undefined, env: StyledDynamicEnv) => { ... }
```

Takes the `StyledDynamicEnv` (`{ fonts, tokens, theme, font }`, `types.tsx:3336`) that
`styled.dynamic` already hands callbacks. `true`/`undefined` resolve to `sizing.default`.
Returns the rung's token keys **unresolved** (so `paddingInline` stays `'4'` and the style
system tokenizes it normally) plus the three derived pixel numbers:

```ts
{ name, fontSize, lineHeight, paddingInline, paddingBlock, gap, radius,  // token keys
  height, icon, square }                                                 // px
```

A name absent from `sizing.sizes` throws in dev with the valid names listed. No fallback.

### 1d. `defaultSizing` in `code/core/config/src/v6-base.ts`, exported from `v6.ts`

```ts
export const defaultSizing = {
  default: 'md',
  sizes: {
    xs: { fontSize: 'xs',   paddingInline: '2', paddingBlock: '1',   gap: '1',   radius: 'sm' },
    sm: { fontSize: 'sm',   paddingInline: '3', paddingBlock: '1.5', gap: '1.5', radius: 'md' },
    md: { fontSize: 'sm',   paddingInline: '4', paddingBlock: '2',   gap: '2',   radius: 'md' },
    lg: { fontSize: 'base', paddingInline: '6', paddingBlock: '2',   gap: '2',   radius: 'md' },
    xl: { fontSize: 'lg',   paddingInline: '8', paddingBlock: '2.5', gap: '2.5', radius: 'lg' },
  },
  height: ({ lineHeight, paddingBlock }) => lineHeight + paddingBlock * 2,
  icon:   ({ fontSize }) => Math.ceil(fontSize / 4) * 4,
  square: ({ fontSize }) => Math.round(fontSize * 1.4),
} satisfies GenericSizing
```

Wire it into `createV6Config` so every v6 app has it without opting in. Those rung values
are transcribed from the existing `buttonFrameSize` / `buttonTextSize` tables — do not
re-derive them, copy them, so the pixels are identical by construction.

## Step 2 — replace the five hand-written unions

`ButtonSize`, `CheckboxSize`, `RadioGroupSize`, `SwitchSize`, `ListItemSize` all become
`SizeName | boolean`. Keep the exported aliases (they are public API) but define each as
`SizeName | boolean` rather than restating the union. Update the corresponding
`code/ui/*/types/*.d.ts` files and the three CI app copies under
`apps/ci/blank-{expo,web}/components/tamagui/`.

## Step 3 — Button as the worked example

`code/ui/tamagui/src/components/Button.tsx`:

- Delete `buttonFrameSize`, `buttonTextSize`, `buttonHeight`, `buttonIconSize`,
  `resolveButtonSize`.
- Frame size becomes a `styled.dynamic<SizeName>((val, env) => ...)` variant returning
  `{ paddingInline, paddingBlock, borderRadius, gap, minHeight: height + 2, width: 'auto' }`.
  Keep the existing comments explaining *why* `minHeight` exists (an icon-only button has a
  16px content box where a labelled one has a 20px line box) and why `width` is pinned to
  `auto`. That `minHeight` is load-bearing — `e7581ccea5 "fix: align labelled and icon
  button heights"` is the commit that added it.
- Text size becomes a dynamic returning `{ fontSize, lineHeight }`.
- `circular` keeps its square geometry, sized `height + 2`.
- `ButtonIcon` and the `iconSize` passed to `useButton` both read `resolveSizing(...).icon`
  instead of the deleted px table.

**Validation for this step specifically**, before moving on:

- `bun run build` in `code/ui/tamagui`
- the zero-runtime CSS baseline must not move. It is re-recorded by a script — find it via
  `af577cefd4 "chore(size): re-record the zero-runtime css baseline"`. If it moves, the
  derivation disagrees with the frozen table and that is a real bug, not a baseline to
  re-record.
- `code/kitchen-sink/tests/ControlSizes.test.tsx` passes unchanged.
- a Playwright screenshot of `?test=ControlSizes` before and after, diffed.

Report back at this point if any pixel moved, with which one and by how much.

## Step 4 — ListItem, then Checkbox / RadioGroup / Switch

ListItem is mechanical: same ladder, same `icon` derivation, delete `listItemFrameSize`,
`listItemTextSize`, `listItemIconSize`, `resolveListItemIconPx`.

Also fix the unstyled path: `code/ui/list-item/src/ListItem.tsx:143` passes `propsIn.size`
straight into `getThemedIconSize`, which calls `getFontSize`. The control ladder has `md`
but the type scale has `base`, so an unstyled `size="md"` misses in `getFontSizeToken`,
logs "No font size found md", and falls through to index 0 (12px). Route it through
`resolveSizing` so the control name is translated to a font key first.

Checkbox / RadioGroup / Switch use `square`. **These are the only pixels allowed to move,
and only if the decision below says so.**

> **Resolved by RAN verification** (`scratchpad/verify-ladders.ts`, 15/15 against the real
> v6 scales). An earlier draft of this plan said only checkbox `md` moves 22→20. That was
> wrong. Deriving `square` from the button rung's `fontSize` moves **three of five**:
>
> ```
> md: 22 -> 20      lg: 25 -> 22      xl: 28 -> 25      (xs 17, sm 20 unchanged)
> ```
>
> The offset is not uniform, so "give `square` a step up the font scale" is not
> implementable. The cause: `square` sizes off the raw type scale at the rung's own name
> (`xs→xs, sm→sm, md→base, lg→lg, xl→xl`), while text deliberately steps **down** at `md`
> (`md` text is `'sm'`, 14px) so buttons are not chunky. Two different mappings, which is
> exactly why the two frozen tables disagreed.
>
> **Implement:** an explicit second font key on the rung, e.g.
> `md: { fontSize: 'sm', controlFontSize: 'base', ... }`, with
> `square = round(1.4 * controlFontSize)`. Explicit per rung, one path, and it still works
> for a custom name like `xxl` where an identity mapping onto the type scale has nothing to
> land on. No checkbox/radio/switch pixel moves: 17/20/22/25/28 stays exactly.

Switch track width is `1.9 * height` (per its existing comment); keep that ratio, derive
the width rather than tabling it. `THUMB_INSET` stays 2. The radii 4/5/6/7 in `checkboxSize`
go back to `radius` token keys — 4 is `sm` and 6 is `md`, while 5 and 7 are off-scale
inventions; round to the nearest real token.

Regenerate the registry JSON (`registry/json/r/*.json`) for every skin touched, and keep the
`apps/ci/blank-{expo,web}` copies in sync.

## Step 5 — docs

- **new** `code/tamagui.dev/data/docs/guides/sizing.mdx` — the ladder, the three
  derivations, and the three tiers of override:

  | tier | what you edit | scope |
  |---|---|---|
  | `createTamagui({ sizing })` | your config | global, zero component code |
  | copy from the registry | your own `Button.tsx` | that component |
  | `@tamagui/button` etc. unstyled | everything | full eject, zero styles |

  Say plainly why config earns its place despite tiers 2 and 3: `import { Button } from
  'tamagui'` users have no file to edit, so config is their only lever.
- `core/configuration.mdx` — the `sizing` key, with the `defaultSizing` spread example.
- `guides/how-to-upgrade.mdx` — v2 `size="$4"` to named sizes; control height is derived now,
  not tabled.
- each touched component's `components/*/3.0.0.mdx` — `size` links to the sizing guide
  instead of restating a px table.
- the header comments in each `code/ui/tamagui/src/components/*.tsx` currently explain the
  frozen ladders ("1.4 times the 12/14/16/18/20 icon ladder"). They become wrong; rewrite
  them to describe the derivation.

Repo prose style: no em-dashes, no "not x, y" constructions, no hype. Comments lowercase.

## Definition of done

- `bun run lint` and `bun run check` green **at the repo root**, not just in each package.
  In this shared checkout both see other agents' uncommitted files; fix only the ones this
  change touched and name the rest in the report.
- `bun run typecheck`
- kitchen-sink `bun run test:web`
- the zero-runtime CSS baseline unchanged (or every diff explained)
- committed on a branch with each step its own coherent one-line conventional commit
  (`feat(core):`, `refactor(ui):`, `docs:`). Do **not** merge to main; `~/tamagui` needs the
  owner's word.
