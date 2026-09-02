# Length-percentage fractions

Proposal. Engine-level value, not a Tailwind class special case.

Today `w-1/2` and `inset-1/2` become `50%` in `@tamagui/tailwind` (`tailwindSizingValue`). The style engine never sees `1/2`. `resolvePayload` treats `4/8` as literal text on purpose, so `width="1/2"` does not work as a Tamagui prop.

Nate's bar: a real engine feature, usable on any matching property, not a hardcoded Tailwind cheat sheet. AGY critiques this before we implement.

## Rule

A whole clause payload that is exactly `N/D` or `-N/D` (integers, `D !== 0`) is a percentage of the same basis CSS already uses for `%` on that property:

```
1/2  →  50%
1/3  →  33.333...%
-1/2 →  -50%
```

It applies only when the property's CSS type is `<length-percentage>` (RN `DimensionValue`). Config tokens still win: if a config actually named a token `1/2`, `width="1/2"` is that token.

This is a spelling of `%`, not a new layout model.

## In

Properties that already accept `%` on both web and native:

- size: `width`, `height`, `minWidth`, `minHeight`, `maxWidth`, `maxHeight`, `flexBasis`, logical size (`inlineSize`, `blockSize`, min/max)
- position: `top`, `right`, `bottom`, `left`, `inset` and logical inset longhands (`insetInlineStart`, `start`/`end` if those are the emitted keys)
- space that CSS allows as `%`: `margin*`, `padding*`, `gap`, `rowGap`, `columnGap`
- translate offsets: `x`, `y` (percentage is relative to the element, same as CSS `translate`)

`1/1` is `100%`. Zero denominator is invalid and does not emit.

Works in clauses: `top="0 sm:1/2"`.

## Out

Anything that is not length-percentage:

- `fontSize`, `lineHeight`, `letterSpacing`, `borderWidth`, `borderRadius`
- `opacity`, `flexGrow`, `flexShrink`, `zIndex`, `rotate`, `scale`
- color `/50` opacity suffixes (`bg="red/50"`). Those stay the existing opacity grammar. Property kind is what distinguishes `red/50` from `1/2`.

Keywords (`full`, `auto`, `screen`, `min-content`) are not this proposal. `full` is a Tailwind catalog word. `auto` is already CSS.

## Engine vs Tailwind frontend

The rewrite lives in the shared value pipeline (`resolvePayload` / evaluate), keyed by property type, not by class prefix.

`@tamagui/tailwind` then stops converting fractions itself. `className="w-1/2"` and `width="1/2"` take the same path. The class grammar still only *claims* prefixes Tailwind actually ships (`w-1/2`, `inset-1/2`, not `p-1/2`). Unclaimed classes stay passthrough. That is frontend catalog, not engine.

So `padding="1/2"` works as 50% padding (valid CSS). `className="p-1/2"` is still not a Tailwind class unless we add it later, which we should not.

## Native

Yoga already accepts `'50%'` for width, height, position, margin, padding, and flex-basis. No new native runtime. Values that would be `%` on web stay `%` on native. Do not turn them into numbers.

## Why not "any pixel value"

`borderWidth` and `fontSize` take px and do not take `%`. A fraction there would be a made-up scale. Length-percentage is the CSS type that already means "px or %". That is the rule.

## Current code to replace

- `code/core/tailwind/src/candidate.ts` `tailwindSizingValue` fraction branch
- `code/core/style-grammar/src/tooling/candidate.ts` `fractionIsValid` + `positionSpaceProps` sizing-keyword path (class-only)

Those become call sites of the engine rewrite, or go away.

## Tests

- `width="1/2"` and `top="1/2"` resolve to `50%` on web and native
- `padding="1/2"` does too (engine), while `className="p-1/2"` stays unclaimed
- `width="1/0"` does not emit
- `bg="red/50"` is unchanged
- `top="0 sm:1/2"` only the sm clause is 50%
- a config token literally named `1/2` still wins
