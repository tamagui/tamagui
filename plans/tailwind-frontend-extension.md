# Tailwind frontend extension (private)

Think-through. Not a public API. Do not document.

Regular Tamagui must not pay for Tailwind-only tricks. `@tamagui/tailwind` already plugs in through `StyleFrontend` on the component (`resolveClassName` in the existing className walk). Core View keeps `regularStyleFrontend = {}`. No global registry.

Nate: experimental-but-working RN (gradients, outline) is valid to implement as real engine props. Weird multi-class features stay in Tailwind mode. No second pass over class strings. Core can be extended privately. Outline is the obvious first 1:1 slice.

## Why not `styled.dynamic` / `.resolve`

That was the first instinct: compose `from`/`via`/`to` at resolve time, because we already have dynamic styles.

Do not use it here.

- `.resolve` runs for that component on every render, even when the className has no gradient or ring.
- Putting it on core View makes every Tamagui tree pay. Putting it on a special Tailwind component type leaks Tailwind-only props into the styled() API.
- The className walk already has the candidates. A resolver would re-derive them.
- Gradient/ring composition is "several class tokens become one CSS value", not "a typed variant becomes styles". Wrong layer.

The cost Nate was worried about (resolve on every render) is real if we go that way. The className walk is already paid. Add nothing that scans the string again, and add nothing on the regular frontend path.

## What already exists

`getSplitStyles` tokenizes `className` once (space split, no regex) and calls `styleFrontend.resolveClassName(candidate, config, sink)`. Claimed candidates become ordinary props on the shared cursor. Last contribution wins. Unclaimed candidates stay raw className on web, drop on native.

That is the plug-in. Empty descriptor: one property read, no call.

Missing today:

- Tailwind prefix rows for engine props we already have (outline).
- A way to compose several candidates into one CSS value (`from` + `via` + `to` → one `backgroundImage`).

## Two buckets

### 1. One class, one engine prop

Prefix maps onto props the engine already understands. They belong in `@tamagui/style-grammar` the same way `border` and `shadow` already do, not as renderer features and not as a new hook.

| Class | Engine prop we already have |
| --- | --- |
| `outline-2`, `outline-red-500`, `outline-solid`, `outline-offset-2`, bare `outline` | `outlineWidth`, `outlineColor`, `outlineStyle`, `outlineOffset` (RN 0.77+. Tamagui already expands the CSS `outline` shorthand. Native types are solid/dotted/dashed.) |
| `shadow-sm` | `boxShadow` (RN CSS shadows). Named sizes are V6 tokens, not engine tables. Prefix `shadow` is already in the grammar. |
| `grow-1`, `basis-full` | already mapped (`flexGrow`, `flexBasis`) |
| `blur-sm` / `filter` | `filter` later. Partial native. Same 1:1 pattern, with diagnostics where RN is incomplete. |

Cost: one hash lookup per candidate, already paid. No `finishClassName`. No bag.

Outline is this bucket. Same shape as `border` (width vs color on one prefix, style as whole classes, offset as its own prefix). CSS `outline="2px solid red"` as a style prop is a different authoring path and already works.

`outline-hidden` is not CSS `outline-style`. Leave it unclaimed until a composer exists. `outline-none` is `outlineStyle: none`.

### 2. Several classes, one CSS value (composers)

Cannot be a shorthand. `from-red-500` is not a CSS property. These only make sense in Tailwind mode.

| Classes | Composed engine value |
| --- | --- |
| `bg-linear-to-r from-red-500 via-white to-blue-500` | `backgroundImage: linear-gradient(...)` (RN gradient parser 0.83+, stable name 0.87). `backgroundSize/Position/Repeat` stay web-only until RN un-experimentals them. |
| `ring-2 ring-blue-500` | a `boxShadow` stack (sometimes outline). Composer, not a new RN prop. Ring + named `shadow-*` must stack, not clobber. |

Not in scope: `space-x`, `divide-x` (child combinators). Those are not a value rewrite.

## Hook shape (private, only if bucket 2 needs it)

Keep it on the descriptor the package already freezes onto the component.

Preferred if it works: compose on the fly inside `resolveClassName`. Each composer class updates a tiny bag and re-sinks the composed prop. Last-wins already handles order. No new core hook. Conditionals (`hover:from-red-500` with base `bg-linear-to-r`) need a bag per modifier key, then sink that condition's `backgroundImage`.

If a walk can end with a pending compose that was never re-sunk (should not happen if every composer class sinks), add:

- `finishClassName?(sink)` after the last candidate in the existing loop

Core cost of the optional hook: one property read on the descriptor that Tailwind components already have, plus one call. Regular frontend leaves it unset. The loop is the same space-split. No second pass.

Do not pass the class string into finish. The bag was filled during the walk.

Implementation notes if we add it:

- Bag lives on a stack in the Tailwind frontend module, not in core. Nested `getSplitStyles` is possible, so a single module global is not enough.
- `hover:from-*` / `sm:via-*` must not smash the base gradient. Key the bag by the candidate's modifier string.
- `bg-linear-to-r` after `from`/`to` still wins direction and re-sinks. Last-wins of the composed string, not of the parts.
- `from-*` without any gradient image does not emit. Same as Tailwind.
- No documented export. No third-party plugin registry.

## Weight

- Core View: still `regularStyleFrontend = {}`. No composer tables, no from/via/to names.
- Tailwind View: pays the walk it already pays. Composer bag is a handful of fields, allocated only if a composer class is seen (or, if we are lazier, at the start of a Tailwind className walk).
- Outline/shadow prefix tables live in style-grammar next to `border`/`shadow`, because that is the shared candidate spelling the converter also uses. They are not renderer code.
- Shared grammar keeps CSS properties (`outlineWidth`, `backgroundImage`). It does not keep `from-red-500`.

## What this gets us

Already engine, missing class spelling (bucket 1):

- Outline utilities on web and native, no core render change.
- Named shadows once V6 `boxShadow` tokens exist (prefix already there).
- Filter utilities later, same 1:1 pattern.

Needs the Tailwind-only bag (bucket 2):

- Gradient utilities that emit the CSS string we already support, only in Tailwind mode.
- Ring as boxShadow composition, only in Tailwind mode.
- Ring + shadow stacking.

Regular Tamagui `backgroundImage="linear-gradient(...)"` and `outlineWidth={2}` keep working with no Tailwind code on the path.

## What this does not get us

- Masks, grid, scrollbars, `caret-color` as if they were native.
- A public plugin API.
- `calc()` / CSS variables on native.
- `space-x` / `divide-x`.
- Avoiding the existing per-candidate parse. That walk is the cost of className. The extension must not add another.
- Default-unit `rotate` (`45` → `45deg`). That is an engine value rule, like `px` for lengths. Separate from this.
- `N/D` fractions. Engine `<length-percentage>` rewrite. Separate proposal.

## Hunt list (for AGY)

- finishClassName vs composing on the fly. Prefer on-the-fly if `hover:from` is correct.
- last-wins of `from`/`via`/`to` vs `bg-linear`.
- ring vs outline collision (`ring-2` vs `outline-2` are different props).
- whether outline prefixes belong in shared grammar like border (yes: they are 1:1 CSS longhands, converter needs them).
- bundle weight if composer tables stay in `@tamagui/tailwind` (they must).

## Slice order

1. Outline prefixes in style-grammar. Landed.
2. from/via/to + `bg-linear-to-*` in `@tamagui/tailwind/src/compose.ts`. On-the-fly, WeakMap keyed by sink, no bag on `p-4`.
3. ring-* as `boxShadow`, stacked with arbitrary `shadow-[...]`. Never outline.
4. Do not start fractions or default-unit rotate from this plan.
