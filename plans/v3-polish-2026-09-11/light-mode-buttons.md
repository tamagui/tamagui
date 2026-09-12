# Light mode buttons are dark, and it is not the v6 config

All numbers below are RAN: measured with playwright against the running site on
:8095, light scheme, `/docs/intro/introduction`. `L` is relative luminance on a
0-100 scale, which is what the eye actually reads, not HSL lightness.

## Short version

You are right, and "up 1" is the right instinct. The button fill sits on
`color-4`, which is on the far side of the single biggest step in the light ramp.
It is not a v6 setting. The site does not use `@tamagui/config/v6` colors at all.

## The light ramp

| token | hex | L | step down from previous |
| --- | --- | --- | --- |
| `color-1` | `#ffffff` | 100 | |
| `color-2` | `#f7f7f7` | 93.0 | 7.0 |
| `color-3` | `#ededed` | 84.7 | 8.3 |
| `color-4` | `#d9d9d9` | 69.4 | **15.3** |
| `color-5` | `#cccccc` | 60.4 | 9.0 |
| `color-6` | `#b3b3b3` | 45.1 | 15.3 |

The page background is `color-2` (`#f7f7f7`). The 3 to 4 step is nearly twice the
steps on either side of it, and the button fill lands on the far side of it. So
the button is not one step off the page, it is two steps off the page and the
second step is the outsized one: 23.6 luminance points total.

That is the whole bug. `color-4` is disproportionately dark for its position in
the ramp, and the button fill is the most visible thing standing on it.

## What the button actually resolves to

Measured inside the `Button` sub-theme scope:

| state | hex | L | |
| --- | --- | --- | --- |
| rest | `#d9d9d9` | 69.4 | |
| hover | `#ededed` | 84.7 | 15.3 lighter than rest |
| press | `#cccccc` | 60.4 | 9.0 darker than rest |

This ordering is correct and should stay. Hover lightens, press darkens, and the
rest fill starts below the page background so hover has room to move toward it
without reaching it. Hover at 84.7 is still 8.3 points clear of the 93.0 page, so
the button stays a distinct shape under the cursor.

Anything that lifts the rest state has to keep that structure. Shifting the
triple up a step does not: rest would land on `color-3` (84.7) and hover would
have to go to `color-2` (93.0), which is the page background exactly, so the
button would dissolve into the page on hover.

## Where it comes from

Not v6. `code/packages/tamagui-dev-config/src/themes.ts` lines 1-2:

```ts
import { toV6Themes } from '@tamagui/config/v6-base'
import { themes as v5Themes } from '@tamagui/themes/v5-subtle'
```

The site deliberately keeps the v5-subtle palette and only borrows v6's theme-key
grammar. So the values are v5's, and `@tamagui/config/v6`'s own colors are not in
play. Changing the v6 preset would do nothing here.

Worth knowing: this exact ramp step has already bitten the site once, and there is
a comment in that same file saying so:

> V5's light gray ramp puts `border-color` on color4, twelve lightness points
> below a 97% background, so every card, input and code block on the site is
> outlined in `#d9d9d9`.

That was fixed with a `MAX_LIGHT_BORDER_GAP = 8` cap on borders. The button fill
is the same `#d9d9d9` and the same root cause, in a slot the cap does not reach.

## What I would change

Smooth the 3-to-4 step in the light ramp, rather than moving the button off
`color-4`. Its neighbours step 8.3 and 9.0, so `color-4` should sit around L 76
instead of 69.4. Every state then rises together and the ordering is untouched:
rest lifts about 7 points, hover stays on `color-3`, press stays on `color-5`.

This is the same fix as the border-gap cap, applied to the ramp itself instead of
to one consumer, so it also retires that cap's reason for existing. It repaints
everything else standing on `color-4`, which is the risk and the point: the
border cap exists because that token is wrong for more than just buttons.

I have not derived the hex or checked what else moves. Say go and I will measure
every `color-4` consumer on the site first, then land it.

## What I did not check

Whether the dark scheme has the mirror problem. Every number here is light only.
