# The two neutral ramps each break once

Landed. All numbers are RAN: measured off the built theme pack and the
regenerated `tamagui.generated.css`. Steps are CIE L\*, which is the axis the eye
actually reads; HSL lightness is quoted where the ramp itself is.

## Strict monotonicity is the wrong target

Worth settling first, because it was the premise going in. A 12-step scale is not
supposed to have evenly growing steps. The steps sit in role bands (1-2 page
background, 3-5 component fills, 6-8 borders, 9-10 solid, 11-12 text) and the
boundaries between bands are meant to jump. Radix, measured in L\*:

| | steps |
| --- | --- |
| radix gray light | 1 3 3 3 2 4 7 **17** 4 12 **30** |
| radix slate dark | 4 5 4 3 4 6 10 5 5 **22** 21 |

Radix reverses direction nine times in the light ramp alone, and its single
biggest step is at 8 to 9, the border-to-solid boundary. So "every step bigger
than the last" would be a worse scale, not a better one.

The defect worth chasing is a spike **inside** a band: a step more than 1.5x both
its neighbours, which breaks a smooth run rather than marking a boundary. That
test found 10 across the site's 12 root themes. Two of them were the neutrals.

## What was wrong

Both neutral ramps had exactly one, and they mirror each other.

| light | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| lightness | 100 | 97 | 93 | **85** | 80 | 70 | 59 | 45 |
| L\* step | | 2.8 | 3.5 | **7.4** | 7.1 | 9.1 | 10.9 | 13.6 |

| dark | 4 | 5 | 6 | 7 | 8 | 9 |
| --- | --- | --- | --- | --- | --- | --- |
| lightness | 14 | 20 | 27 | **40** | 47 | 52 |
| L\* step | | 7.0 | 8.0 | **13.9** | 7.2 | 5.1 |

Light drops 8 lightness points at step 4 where its neighbours move 4 and 5. Dark
jumps 13.9 L\* at step 7 where its neighbours move 8.0 and 7.2. Both land inside a
band, so whatever sits on them reads a step further from the page than it should:
in light the default button fill, table cells, code blocks and preview blocks; in
dark the hover borders and focus fills.

## The correction

`color-4` 85% to **88%**, `color-7` 40% to **36%**. Each is the value that puts
its sequence back in order without moving the step after it:

| | steps after |
| --- | --- |
| neutral light | 2.8 3.5 4.6 7.1 9.1 10.9 13.6 15.7 11.5 7.0 12.8 |
| neutral dark | 3.6 2.9 4.9 7.0 8.0 9.8 11.4 5.1 14.4 12.1 18.0 |

Both now pass the spike test. Neither new value collides with an existing step in
either ramp, so no two steps merge.

Applied in `code/packages/tamagui-dev-config/src/themes.ts`, not in
`@tamagui/themes/v5-subtle`. That pack is v5 compat and must keep rendering v5
apps identically, the same constraint that made `v5-fonts.ts` pin its scales.

## Correction: the first version of this fix had a hole

The light fix landed first, scoped by name to "light-named themes that resolve to
a light background". That missed both places the same ramp shows up under a
different name:

- **Every root carries both ramps.** The opposite scheme's lives under `accent-*`.
  So `light.color-4` moved to 88% while `dark.accent-4` stayed at 85%, and the two
  copies of one step disagreed.
- **The accent theme swaps them again.** `light_accent` holds the dark ramp under
  `color-*`, and `dark_accent` holds the light ramp under `color-*`. A name test
  keyed on `light`/`dark` gets both backwards.

Two earlier claims in this document were also wrong and are gone: that the button
fill sits on `color-4` (it is `background` on `light_Button`, an independent key
that merely held the same value), and that this retires `MAX_LIGHT_BORDER_GAP`
(33 tinted light themes have a border more than 8 points below their background,
`light_yellow` by 21; the cap stays).

## How it is scoped now

One substitution by value over every non-tinted theme, both strings at once. By
value rather than by key, because sub-themes carry resolved values and no ramp at
all, so there is no `color-4` on `light_Button` to match. Across the whole object
rather than by name, because of the two misses above.

Inside the non-tinted family each string has exactly one meaning. Gray is
desaturated like the neutrals and genuinely collides, so tinted names come out
first, held per object because several names share one: `dark_brand` **is** the
light palette and `light_brand` **is** the dark one. Deciding per name split those
objects and the generated CSS emitted a second copy of every `.t_dark_brand*`
selector with the two copies disagreeing.

**Order matters.** The substitution runs before `softenLightBorder`, which derives
a capped border from the background. On a 93% surface that cap lands on 85%
itself, so running it first would hand its own output back to the substitution and
pull those borders three points off the cap.

## Verification

| check | result |
| --- | --- |
| selector sets in the generated CSS | 232 before, 232 after, same order, zero added or removed |
| `.t_dark --color-7` | 40% to 36% |
| `.t_dark --accent-4` | 85% to 88% |
| light palette `--accent-7` | 40% to 36% |
| light palette `--color-4` | 88%, unchanged |
| `light_gray.color-6` | 85%, untouched |
| `light.border-color` | 89%, still the 97-8 cap |
| `light_surface1.border-color` | 85%, still the 93-8 cap |
| object sharing | `light === dark_brand` and `dark === light_brand` still hold, with equal values |
| spike scan, 12 roots | 10 before, 8 after; both neutrals clean |

## What is left

The 8 remaining spikes are all tinted themes. Five sit on a band boundary and are
the same shape Radix has, so they are fine as they are:

`light_gray` 8-9, `light_red` 8-9, `dark_yellow` 8-9, `dark_green` 8-9,
`light_yellow` 10-11.

Three are genuinely inside a band and would be the next thing to fix, if anyone
cares about the tinted themes: `dark_gray` 7-8 (11.0 against 5.3 and 5.3),
`dark_yellow` 4-5 (steps 4 and 5 are nearly the same color), `dark_green` 2-3.
Nobody has complained about any of them and they are not the page default.

Still open from before: 3 points is what the light ramp allows, so if the button
should be lighter still, that means taking `light_Button` off the ramp step rather
than moving the ramp again. And `light_level2_Button` resolves to `background` 93
on a `light_level2` surface that is also 93, because v5 ships no Button sub-theme
at that level and the lookup falls back to the parent. A button inside a level2
surface has no fill of its own at rest. Neither is touched here.
