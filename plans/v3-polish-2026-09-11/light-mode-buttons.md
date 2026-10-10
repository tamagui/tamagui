# v5-subtle: nine scales each broke once

Landed in `@tamagui/themes/v5-subtle` itself. All numbers are RAN: measured off
`generated-v5-subtle.ts` and the regenerated `tamagui.generated.css`. Steps are
CIE L\*, which is the axis the eye actually reads; HSL lightness is quoted where
the ramp itself is.

`@tamagui/themes/v5` is untouched, deliberately. It stays the byte-exact compat
anchor for a v5 app; subtle is the opinionated pack and can be corrected.

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
its neighbours, which breaks a smooth run rather than marking a boundary. Plus
the degenerate case, two adjacent steps holding the same color. Across the pack's
28 root themes that found nine distinct broken ramps.

## What changed

Eight ramp steps retuned and one duplicate broken up. Each new value is the one
that evens out the run it sits in, computed rather than eyeballed.

| ramp | step | was | now |
| --- | --- | --- | --- |
| neutral light | color4 | 85% | **87%** |
| neutral dark | color7 | 40% | **37%** |
| `light_yellow` | color2 | `hsla(0, 0%, 100%)` | **`hsla(56, 61%, 95%)`** |
| `light_orange` | color4 | 85% | **86%** |
| `dark_gray` | color8, color9 | 38%, 43% | **34%, 41%** |
| `dark_yellow` | color4 | 8% | **10%** |
| `dark_green` | color2 | 9% | **10%** |
| `dark_purple` | color8 | 50% | **45%** |
| `dark_teal` | color4 | 12% | **13%** |

The two neutrals are the ones the site runs on, and they mirror each other. Light
dropped 8 lightness points at step 4 where its neighbours moved 4 and 5; dark
jumped 13.9 L\* at step 7 where its neighbours moved 8.0 and 7.2. Both land inside
a band, so whatever sits on them read a step further from the page than it
should: in light the default button fill, table cells, code blocks and preview
blocks, in dark the hover borders and focus fills.

`light_yellow` was the worst of the rest. color1 and color2 were both pure white,
so the theme had eleven distinct values for twelve steps and, because `background`
is color2 and `backgroundHover` is color1, a yellow surface had no hover step at
all.

| ramp | steps before, then after |
| --- | --- |
| neutral light | 2.8 3.5 **7.1** 4.6 9.1 10.9 13.6 15.7 11.5 7.0 12.8 |
| | 2.8 3.5 **5.3 6.4** 9.1 10.9 13.6 15.7 11.5 7.0 12.8 |
| neutral dark | 3.6 2.9 4.9 7.0 8.0 **13.9** 7.2 5.1 14.4 12.1 18.0 |
| | 3.6 2.9 4.9 7.0 8.0 **10.6 10.5** 5.1 14.4 12.1 18.0 |
| `light_yellow` | **0.0** 5.1 5.9 6.2 5.8 6.1 11.4 11.3 10.7 26.5 15.9 |
| | **2.4 2.7** 5.9 6.2 5.8 6.1 11.4 11.3 10.7 26.5 15.9 |
| `light_orange` | 1.8 2.3 **5.3** 3.5 4.9 5.0 7.6 7.5 3.9 8.6 25.1 |
| | 1.8 2.3 **4.5 4.3** 4.9 5.0 7.6 7.5 3.9 8.6 25.1 |
| `dark_gray` | 3.8 3.5 3.8 3.3 5.0 5.3 **11.0** 5.3 4.8 22.5 20.1 |
| | 3.8 3.5 3.8 3.3 5.0 5.3 **6.8 7.4 6.8** 22.5 20.1 |
| `dark_yellow` | 2.0 2.5 **0.9** 7.8 4.2 9.9 9.2 36.9 7.6 6.9 12.1 |
| | 2.0 2.5 **4.0 4.8** 4.2 9.9 9.2 36.9 7.6 6.9 12.1 |
| `dark_green` | **2.7 6.7** 4.3 7.1 4.9 6.5 8.0 12.9 4.0 11.6 14.8 |
| | **4.2 5.3** 4.3 7.1 4.9 6.5 8.0 12.9 4.0 11.6 14.8 |
| `dark_purple` | 2.3 6.3 4.6 3.2 5.2 6.8 **10.2 1.5** 5.0 22.2 15.9 |
| | 2.3 6.3 4.6 3.2 5.2 6.8 **5.8 5.9** 5.0 22.2 15.9 |
| `dark_teal` | 2.7 4.9 4.4 **8.4** 5.3 6.6 7.7 12.4 4.7 11.8 14.3 |
| | 2.7 4.9 **6.1 6.8** 5.3 6.6 7.7 12.4 4.7 11.8 14.3 |

## Why the edit is not simply "change nine strings"

`generated-v5-subtle.ts` holds one deduplicated `colors` pool and every theme
references it by index, so an index is a value, not a role. Editing one in place
moves every theme that happens to land on that value. Three of the nine collided:

- **85%** is the neutral light color4 *and* `light_gray` color6. Gray keeps 85%
  on a new pool entry; the shared slot became 87%.
- **38%** is `dark_gray` color8 *and* `light_neutral`/`dark_neutral` color11. The
  neutral family keeps the slot; dark_gray moved to a new entry at 34%.
- **pure white** is `light_yellow` color2 and roughly a hundred other references,
  color1 among them. Only the five refs that resolve from color2 moved.

That last split needed the role of each key, which `light_yellow` cannot supply
because its color1 and color2 were identical. `light_blue` has the same node
shape, so its keys name the roles: `color2`, `background` and `backgroundActive`
derive from color2, while `color1` and `backgroundHover` derive from color1.

The pool also makes the fix reach places a per-theme edit would miss. Every root
carries both schemes, the opposite one under `accent*`, and the `_accent` and
`_Tooltip` subthemes hold the ramp reversed, so the same step appears under four
different key names. They all share the index, so they all move together.

## The site config got simpler

`tamagui-dev-config/src/themes.ts` was patching these two neutral steps by value
after the fact, because the pack was treated as frozen. That is gone. The
substitution is now provably dead: 40% no longer exists in the pool and 85%
survives only inside the gray family, which the patch excluded anyway.
`softenLightBorder` stays, it does a different job.

## Verification

| check | result |
| --- | --- |
| resolved values across all 390 theme names | 273 refs changed, every one of them the ten intended values, nothing else |
| roots with an in-band spike or a duplicated step | 28 before had 9, now 0 |
| selector sets in the generated CSS | 232 before, 232 after, same order, zero added or removed |
| `.t_dark --color-7` | 40% to 37% |
| `.t_dark --accent-4` | 85% to 87% |
| light palette `--color-4` | 85% to 87% |
| `light_gray.color6` | 85%, untouched |
| `light_neutral.color11` | 38%, untouched |
| `light_yellow.backgroundHover` | still pure white, now a step above `background` |
| light palette `border-color` | 89%, still the 97-8 cap |
| `bun run check` at the repo root | green |

## What is left

Nine spikes remain and all nine are at a band boundary, the same shape Radix has:
`light_gray`, `light_red`, `light_pink`, `light_purple`, `dark_yellow`,
`dark_green`, `dark_orange` and `dark_teal` at 8-9, and `light_yellow` at 10-11.
Those are the border-to-solid and solid-to-text jumps and they are meant to be
there.

Two things this does not touch. `light_level2_Button` resolves to `background` 93
on a `light_level2` surface that is also 93, because v5 ships no Button subtheme
at that level and the lookup falls back to the parent, so a button inside a level2
surface has no fill of its own at rest. And `light_yellow` color9 is lighter than
color8, because a saturated yellow solid is bright; Radix yellow does the same.
