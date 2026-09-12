# Light mode buttons are dark, and it is not the v6 config

Landed. All numbers are RAN: measured off the built theme pack and the
regenerated `tamagui.generated.css`. `L` is HSL lightness where the ramp is
quoted directly, and relative luminance where steps are compared, because that
is what the eye reads.

## What was wrong

V5's neutral light ramp, in HSL lightness:

| token | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| lightness | 100 | 97 | 93 | **85** | 80 | 70 | 59 | 45 |
| step | | 3 | 4 | **8** | 5 | 10 | 11 | 14 |

Every step grows except that one. It spikes to 8 and drops back to 5. In relative
luminance the same cliff reads 8.3, **15.3**, 9.0.

It is the only one. I checked every light theme in the pack: `light_gray`,
`light_blue`, `light_red`, `light_yellow` and `light_green` all step evenly, and
only the neutral `light` theme trips an automated "this step is more than 1.5x
both its neighbours" test. The shipped v3 default (`@tamagui/config/v6`) does not
have it either, so this was a v5-pack problem and not something v3 ships.

## The correction

`color-4` moves from 85% to 88%. That is the value that puts the sequence back in
order, and it leaves `color-5` exactly where it already sits:

| | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| lightness | 100 | 97 | 93 | **88** | 80 | 70 | 59 | 45 |
| luminance step | | 7.0 | 8.3 | **10.1** | 14.2 | 15.3 | 14.6 | 13.4 |

88% is also where the independent target landed: a relative luminance of 76,
picked to sit between its neighbours, converts to 88.6% lightness.

Applied in `code/packages/tamagui-dev-config/src/themes.ts`, not in
`@tamagui/themes/v5-subtle`. That pack is v5 compat and must keep rendering v5
apps identically, the same constraint that made `v5-fonts.ts` pin its scales.

## Two corrections to what this document used to say

**The button fill was never `color-4`.** It is `background` on the `light_Button`
sub-theme, an independent key that merely held the same 85%. Sub-themes carry no
ramp, only resolved values. So the fix had to move both, and a change to
`color-4` alone would have done nothing to the button.

**This does not retire `MAX_LIGHT_BORDER_GAP`.** The old note claimed the cap
existed only because of this ramp step. Reading the raw pre-cap values: 33 tinted
light themes have a border more than 8 points below their own background and are
genuinely moved by the cap, `light_yellow` by 21. The cap stays.

## Why the substitution is by value, and scoped per object

Inside the neutral light palette, 85% always means the fourth step of the ramp,
so matching on the value catches the sub-themes that have no `color-4` key to
match on. Identifying the palette first is what keeps that safe. Three themes
would have been corrupted by a blind value substitution:

| theme | key at 85% | what it is |
| --- | --- | --- |
| `light_gray` | `color-6` | a legitimate sixth step of a different ramp |
| `light_brand` | `accent-4` | an accent on a dark fill (brand inverses) |
| `light_Tooltip` | `color-9` | the *text* color on a dark tooltip |

Two conditions seed the set, and each catches what the other misses: the name
test excludes the tints, and a `background` lightness over 50 excludes the
light-named themes that resolve to dark fills.

**Membership is then held per object, not per name.** Several names share one
theme object, and `dark_brand` *is* the light palette, because brand inverses.
Deciding per name split that object in two: the generated CSS emitted a second
copy of every `.t_dark_brand*` selector, and the two copies disagreed about
`color-4`. Seeding the set by name and applying it by object identity keeps the
aliases together. The check that catches a regression here is that the CSS diff
changes declaration bodies only and no selector text at all.

## What moved

56 themes in the neutral light family, in three shapes:

| count | example | keys |
| --- | --- | --- |
| 27 | `light_surface2` | `background` (this is the button fill) |
| 28 | `light_surface1` | `background-press`, `border-color`, `border-color-hover` |
| 1 | `light` | `color-4`, `border-color-focus` |

Site code reading `color-4` directly, all of which lighten by one ramp step:
`SimpleTable`, `MDXComponents` code blocks, `InlineTabs`, `DocsCollapsible`,
`DocsQuickNav` (an SVG stroke), `PropsTable`, `IconStack`, `ComponentPreview`,
`BentoComponentItem`, `CodeWindow`, `CustomTabs`, `StepExportCode`, and a
text-shadow in `app.css`.

## Result

Verified by resolving the variable chain in the regenerated
`tamagui.generated.css`, not from the source config:

| | before | after |
| --- | --- | --- |
| button rest | 85 | **88** |
| button hover | 93 | 93 |
| button press | 80 | 80 |
| page background | 97 | 97 |
| `light` border (capped) | 89 | 89 |

Rest lifts 3 lightness points, 5.1 in luminance. Hover still lightens and press
still darkens, which is the convention and was never the problem.

## The one thing left open

3 points is what the ramp allows. Pushing `color-4` further, to 90, would make
step 3-to-4 equal 3 and step 4-to-5 equal 10, which is the same cliff inverted.
So if the button should be lighter still, that is a separate decision: move the
`light_Button` background off the ramp step rather than move the ramp. I have not
done that, because it trades a smooth ramp for one component.

Also unchecked: whether the dark scheme has a mirror problem. Every number here
is light only.

## Unrelated thing worth writing down

`light_level2_Button` resolves to `background` 93 on a `light_level2` surface
whose background is also 93, because v5 ships no Button sub-theme at that level
and the lookup falls back to the parent. A button inside a level2 surface has no
fill of its own at rest. That is not this bug and I have not touched it.
