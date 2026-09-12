# Light mode buttons are dark, and it is not the v6 config

All numbers below are RAN: measured with playwright against the running site on
:8095, light scheme, `/docs/intro/introduction`. `L` is relative luminance on a
0-100 scale, which is what the eye actually reads, not HSL lightness.

## Short version

You are right, and "up 1" is exactly the right instinct. The button fill sits on
`color-4`, which is on the far side of the single biggest step in the light ramp.
It is not a v6 setting. The site does not use `@tamagui/config/v6` colors at all.

There is also a second thing you did not ask about: the hover state is inverted.
The button gets **lighter** on hover, not darker.

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

## What the button actually resolves to

Measured inside the `Button` sub-theme scope:

| state | hex | L |
| --- | --- | --- |
| rest | `#d9d9d9` | 69.4 |
| hover | `#ededed` | 84.7 |
| press | `#cccccc` | 60.4 |

Hover is 15.3 points **lighter** than rest. On a light page the convention is
that hover darkens slightly, so this reads as the button going flat or
disappearing under the cursor rather than responding. Press then jumps 24 points
down from hover. The three states are not ordered.

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

Shift the whole triple up one step. This fixes the darkness and the inverted
hover in one move:

| state | now | proposed |
| --- | --- | --- |
| rest | `#d9d9d9` (69.4) | `#ededed` (84.7) |
| hover | `#ededed` (84.7) | `#d9d9d9` (69.4) |
| press | `#cccccc` (60.4) | `#cccccc` (60.4) |

Rest becomes one step off the page instead of two. Hover darkens instead of
lightening. Press keeps its current value and still reads as the firmest state.

The alternative is to cap the light ramp's 3-to-4 step the way the border gap is
already capped, which fixes every consumer of `color-4` at once rather than the
button alone. That is the more correct fix and the riskier one, since it repaints
anything else sitting on `color-4`. I would do the button triple first and look at
a ramp cap separately.

Say the word and I will make the change. I have not touched it yet.

## What I did not check

Whether the dark scheme has the mirror problem. Every number here is light only.
