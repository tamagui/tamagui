# Any explicit `size` on Button or Input renders a frame shorter than its own text

Found while chasing `ButtonSkin.test.tsx:106`. That test is stale, but the
behavior underneath it is genuinely broken, and the broken part is bigger than
the test. **Do not make the test pass.**

## Measured

Kitchen sink, default (native) driver, v6 config:

| component | frame height | text height | fits? |
| --- | --- | --- | --- |
| `<Button>` (no size) | 44px | 23px | yes |
| `<Button size="5">` | 20px | 24px | **overflows by 4px** |
| `<Button size="3">` | 12px | 21px | **overflows by 9px** |
| `<Input size="3">` | 12px | 21px line-height, 14px font | **cannot fit** |

Measured by comparing each frame's `getBoundingClientRect().height` against its
deepest text node's, not by eyeballing a screenshot.

## Why

`code/core/size/src/index.ts:23`:

```ts
export const defaultTokenSizePolicy: TokenSizePolicy = {
  size: 44,      // a raw number, not a token key
  space: '4',
  radius: '4',
  fontSize: '4',
}
```

with the comment "the raw frame height works across token scales; the other
metrics retain each config's token-defined platform values". So the **default**
frame height deliberately bypasses the token scale, and that is why an unsized
Button is a sane 44px.

An **explicit** size does not get that treatment. `resolveSizeToken` returns the
policy value only when the value is `true`; otherwise it passes the value
through, and `resolveTokenSize` then reads `tokens.size[key]`. Under v6 that
scale is tailwind spacing:

```
1: 4px   2: 8px   3: 12px   4: 16px   5: 20px   6: 24px
8: 32px  10: 40px  12: 48px
```

So `size="3"` asks for a 12px-tall button. To get the default 44px you would
have to write `size="11"`.

Both consumers use it as a frame height:

- `ui/tamagui/src/components/Button.tsx:42` `height: frame.size` (and :85-89 for
  the `circular` variant)
- `ui/input/src/shared.tsx:43` `height: frame.size`

`ui/shapes/src/getShapeSize.tsx` also uses the resolver, but a `Square size="5"`
being 20px square is the correct meaning there, so shapes are fine.

## Why the test is stale AND the behavior is broken

`ButtonSkin.test.tsx:106` expects `52px` for `size="5"`, and its comment says
"$5 -> size token 52". That is the v5 scale, the same v5-epoch staleness a2965
found in `domCompiledRuntime.native`'s rgba expectation. So the expectation is
wrong.

But the received value is wrong too. Updating the test to expect `20px` would
lock in a button whose text does not fit, which is exactly the kind of
assertion-shaped-to-current-output this repo has already had to clean up. Leave
it failing until the mapping is decided.

## The decision that is not mine

How should `size` map to a frame height in v6? Two coherent answers:

1. **`size` indexes the spacing scale** as it does today, so `size="11"` is the
   44px default and `size="3"` is a deliberately tiny 12px control. Nothing is
   broken except ergonomics and the test, but every v5 call site
   (`size="4"`, `size="5"`) silently becomes a broken control, and no
   documentation makes 11 an obvious default.
2. **Frame components resolve height through a component ramp** so small/medium/
   large land on usable heights, matching the intent already encoded in the
   policy's raw 44.

This is a public API decision for two headline components during a beta, so it
needs the owner rather than a lane picking one. It also has migration weight:
under option 1 every existing `<Button size="4">` in user code silently becomes
16px tall.

## Not investigated

`ButtonUnstyled.test.tsx:28` is a separate defect and is untouched: at rest the
variant merge is correct (`borderLeftWidth` 2px, `borderColor` green), and it
fails only **under press**, where `borderColor` is `rgb(153,161,175)`
(`#99a1af`, gray-400) instead of the parent variant's `press:transparent`.
Neither the child's base green nor the parent's press value survives, so the
base skin's press style appears to win. That points at how a child re-declaring
a variant key merges the parent's *conditional* sub-values.
