# v3 beta: web values, native units, and life after breakpoints

Proposal, 2026-08-05. Companion to `plans/dom-tailwind-flat-values.md` (the flat
value grammar) and `plans/react-native-style-capabilities.md` (what RN can do).

Three asks drive this:

1. allow more web style props and values in shared code;
2. get off breakpoint-driven responsive design, which steps in coarse jumps;
3. decide which of the 2026 CSS crop is worth first-class support.

## The rule that decides most of it

**Web-only PROPERTIES are safe to allow everywhere. Web-only VALUES are not.**

A property native does not understand degrades to nothing happening. A value
native does not understand degrades to invalid layout input: Yoga gets `"50vw"`
where it wanted a number or a percentage, and you get a thrown style error or a
zero, at runtime, on device.

So: promote every property, drop it on native at the style layer, warn once in
dev. Promote a value only after native can compute it, or after we have
decided what it degrades to. That splits the work into a cheap mechanical
change and a small runtime feature.

Two values get an explicit exception, below.

## Where things stand (verified 2026-08-05)

**Safe area is done.** `propMapper.ts:86` handles the first-class `safe` value,
`directStyle.ts` resolves `safe-area-*` variables, web lowers to
`env(safe-area-inset-*)`, native reads the subscribable store in
`@tamagui/native/safeAreaState`, and both `createComponent.tsx:1553` and
`useProps.tsx:139` subscribe, so rotation updates re-render. That closes
remaining design item 12 in the flat-values plan. On `main` the only trace is a
`helpers/resolveSafeArea.ts` with zero call sites and a comment referencing a
`propEdges` table that does not exist, which should be deleted so nobody wires
it by accident.

**`rem` is already implemented on native.** `resolveRem.native.ts` (landed
`062302c8a4`, Dec 2025) multiplies by `settings.remBaseFontSize ?? 16` and by
`PixelRatio.getFontScale()`. It is wired at `propMapper.ts:99`, `:103` and
`:345`. Web's `resolveRem.ts` is a no-op, since browsers do it. So the "should
rem track OS font scale" question is already answered in the shipped code: it
does, always, with no setting to turn it off.

Two bugs in it, both native-only, both worth fixing as part of this work
(traced by reading the file and running its regex):

- `isRemValue` is `value.includes('rem')`. Any string style value containing
  that substring is routed into the resolver, and the resolver returns `0` when
  it finds no `<number>rem` token. `fontFamily="Bremen"` resolves to `0`. This
  runs before any key-specific handling in `propMapper`, so it applies to every
  string value on native.
- the multi-value branch sums every `rem` term it finds and ignores everything
  else, so it is not arithmetic. `calc(1rem + 2rem)` gives 48 by luck,
  `calc(2rem - 1rem)` gives 48, and `calc(1rem + 10px)` gives 16 with the
  `10px` silently gone.

The fix for both is the same shape as the units work below: match a real unit
suffix instead of a substring, and refuse an expression instead of guessing at
one.

**Web-only props today leak to the host view.** `validStyleProps.ts:282` folds
`webOnlyStylePropsView` in only when `TAMAGUI_TARGET === 'web'`. On native those
keys are therefore not style keys, so `getSplitStyles` falls through and puts
them in `viewProps`, and they are forwarded to the RN host component as props.
`backdropFilter="blur(8px)"` in a shared file becomes a prop on a Fabric view.
It is ignored by luck, not by design.

**Units are typed but web-only.** `types.tsx:1662` already has a
`WebOnlySizeValue` union covering `vw/dvw/lvw/svw`, `vh/dvh/lvh/svh`, `calc()`,
`min()`, `max()`, `min-content`, `max-content`. The types promise a split the
runtime enforces by accident.

**RN has not shipped math or viewport units.** Searched 2026-08-05: no shipped
`calc()`/`clamp()`/`min()`/`max()` in RN core, no viewport units, the community
proposal (discussions-and-proposals#576) is still open.

## Part 1: promote every web property, drop it on native

Replace the `TAMAGUI_TARGET` fork in `validStyleProps.ts` with one table that
carries a target bit per property. This is the property-tier twin of
`style-grammar/src/clauseCapability.ts`, which already does this for modifiers
and already names PROPERTY as a separate dimension it does not own.

- one `validStyles` table on both platforms, each entry `both | web | native`;
- on native a web-only property is a valid style key, resolves normally, and is
  dropped by the native serializer. It never reaches the host view, which is
  strictly better than today;
- dev warns once per property name, never per instance, naming the property and
  the platform;
- the compiler strips web-only properties at build time for native targets, so
  the runtime check costs nothing in shipped apps;
- types drop `AddWebOnlyStyleProps` (`types.tsx:1529`) and the `$platform-web`
  widening. The props are simply always there;
- `@tamagui/eslint-plugin` gets an opt-in rule for teams that want shared files
  to stay strictly cross-platform.

Cost to state plainly: native bundles carry the web-only key table (~1-2KB of
keys) unless the compiler runs. That is a real regression against the bundle
gates in the flat-values plan and should be measured, not assumed away.

### The two value exceptions: `position: fixed` and `display: grid`

`position` and `display` exist on both platforms with values only web
understands. The flat grammar has an honest spelling for this already:

```tsx
<View position="absolute web:fixed" display="flex web:grid" />
```

That stays available and stays the recommended form for anything nuanced. But
requiring it for these two is worse than mapping them, because of what the
alternative degrades to:

- **`position: fixed` maps to `absolute` on native.** Dropping the declaration
  leaves RN's default `relative`, which does not just look wrong, it re-flows
  every sibling. `absolute` is what a fixed element becomes inside a
  full-screen root anyway, so it renders the intended thing in the common case.
- **`display: grid` maps to `display: none` on native.** There is no partial
  credit here. Falling back to `flex` stacks every grid child in one direction
  and produces a confidently broken layout that reads as a Tamagui bug.
  Hiding it fails visibly, at the element, and the author sees immediately that
  the layout needs a native branch.

Both warn once in dev naming the mapping. This is a narrow, documented
exception to "no silent native approximation" in the flat-values plan, and the
warning is what keeps it from being silent. Any other web-only value on a
shared property stays a diagnostic pointing at the `web:` clause.

## Part 2: units on native, and where the line is

The grammar already resolves a payload into static runs plus reference nodes
with two serializers. Native gets more units, and does not get a math engine.

**Add: the viewport family.** `vw vh vmin vmax`, and `dvh svh lvh dvw svw lvw`
which all collapse to the same number on native since no browser chrome exists
(document that). `@tamagui/use-window-dimensions` already exposes the
subscribable store this rides, and the safe-area work already established the
subscribe-and-re-render pattern for a viewport-ish input.

Do it at the existing `rem` call site, not next to it. Today native runs
`value.includes('rem')` on every string style value; the replacement is one
unit-suffix match that returns which unit and the number, so adding five more
units costs nothing beyond the branch. That is also the fix for the
`"Bremen"` bug.

**Add: `em` and `lh`.** Both are free once font size and line height are
resolved in the same pass, which they are.

**Do not add: `calc()`, `min()`, `max()`, `clamp()` on native.** A general math
evaluator means parsing an expression string on the style hot path, and the
grammar's own bench (flat-values plan, remaining item 1) puts a six-clause
worst-case parse at ~844ns before adding one. Native pays this per value per
render behind a cache that a dynamic expression is least likely to hit. Web
keeps all four as pass-through strings, where the browser does the work for
free. On native they are a dev diagnostic.

This is a real capability gap and it should be written on the tin: math
expressions are a web-only value. If RN ships `calc()` we hand the string
through instead of evaluating it, which is a deletion rather than a rewrite.

**Do not add: `min-content`, `max-content`, `fit-content()`, `stretch`, and
`ch ex cap ic`.** Web-only, dropped with a diagnostic. `ch` is the loss that
stings, since `max-width: 65ch` is the correct way to set a text measure, and
approximating it as `0.5em` would be a lie in exactly the fonts people care
about. See open questions.

**Percentages stay as they are.** Yoga handles a bare `%`. The thing that does
not work is a percentage inside math, which is moot now that math is web-only.

## Part 3: what replaces breakpoints

Breakpoints are not dated as a mechanism. They are dated as the DEFAULT. Current
practice is four layers, and three of them are within reach.

**1. Fluid values, so type and space interpolate instead of stepping.** Since
native has no `clamp()`, `fluid()` is a config helper that produces a structured
value, not a CSS string:

```ts
// config
'text-lg': fluid(18, 24, { from: 380, to: 1280 })
// web:    clamp(1.125rem, 1rem + 0.53vw, 1.5rem), in a custom property
// native: { min, max, from, to } evaluated as three multiplies against
//         window width, on the same subscription vw uses
```

No parser on either side. Web resize costs zero re-renders because the value
lives in a custom property. Native recomputes on `Dimensions` change, which in
practice means rotation. This is the whole reason a general math evaluator is
not needed: the one expression shape people actually want fluidly is known at
config time.

Hard constraint: fluid values cannot go in the `size` token scale. Component
sizing does token arithmetic (`getSize('$true', { shift: -2 })`) and that math
needs numbers. Allow fluid in the variables namespace and the font size scale,
and make it a config-time error in `tokens.size`.

**2. Container queries as the default responsive unit.** A component should
respond to the space it was given, not to the window. The machinery is mostly
there: `createMediaStyle.ts` already emits `@container`, flat-values decision 18
gives it the `@sm:` spelling, and decision 17 stops groups from paying for
containers they never query. Container units are the missing half: `w="@sm:50cqi"`
is the thing people want and cannot express today. `cqw cqi cqh cqb cqmin cqmax`
resolve against the nearest query container, and against the small viewport when
there is none, which is the CSS spec's own rule rather than a fallback we
invented.

**3. Intrinsic layout that needs no query at all.** The web's auto-fit grid
(`repeat(auto-fit, minmax(min(20rem, 100%), 1fr))`) has a flexbox equivalent
Yoga supports: `flexWrap: 'wrap'` on the parent plus a flex basis on children.
Without `min()` on native the cross-platform spelling is a plain basis
(`flexBasis: 320`) rather than `min(20rem, 100%)`, which differs only when the
container is narrower than the basis. Worth a wrapping-grid primitive in the UI
kit that encodes the correct pair per platform once, instead of asking every
app to rediscover it.

**4. Media queries for what they are actually for:** `pointer`, `hover`,
`prefers-reduced-motion`, `prefers-color-scheme`, print, and genuine page-level
layout switches. The media config's `touchable`/`hoverable` entries are already
this. The width ladder from `xxxs` to `xxl` stays, it just stops being the first
tool in the docs.

The docs rewrite matters as much as the code. The responsive guide should open
with fluid values and containers, and reach breakpoints on page two.

## Part 4: new web features worth first-class support

Ranked by what they buy, with support checked 2026-08-05.

**1. Anchor positioning.** Baseline as of January 2026 (Chrome 125+, Firefox
147+, Safari 26). `next.md` already wants to eject floating-ui because it is
huge. On web this is that path: Popover, Tooltip, Select, Menu, and
DropdownMenu positioned by the browser. `@position-try` flipping wants Safari
18.4+, so the browser floor decision gates it. Biggest available bundle win.

**2. `@starting-style` plus `transition-behavior: allow-discrete`.** Baseline
since 2024. Lets the CSS driver do enter animations and `display: none`
transitions with no JS presence dance for the simple cases. Directly relevant to
the `enter:`/`exit:` clauses in the grammar.

**3. Container style queries.** Became Baseline newly available in May 2026.
The flat-values plan deferred nearest-ancestor theme matching with "revisit only
if container style queries become baseline enough to carry theme names". They
now are, standards-wise. Whether they are inside Tamagui's browser floor is a
separate call, but the deferred item should be reopened.

**4. `scrollbar-width` / `scrollbar-color`.** Baseline since December 2025.
Straight props on ScrollView, Sheet, and Select content.

**5. Small wins:** `text-wrap: balance | pretty` for headings, `:user-invalid`
(Baseline widely available May 2026) as a `user-invalid:` modifier for form
state, `contrast-color()` (Baseline April 2026) for automatic foreground on an
arbitrary background, `field-sizing: content` for auto-growing TextArea.

**6. Progressive enhancement only, behind an opt-in setting:**
`text-box-trim` / `text-box-edge` (Chrome 133+, Safari 18.2+, Firefox has not
shipped) is the correct fix for the vertical-centering fudge factors in every
Button and ListItem, and it degrades to today's rendering.

**Do not adopt:** `if()`, `@function`, `corner-shape`, `interpolate-size` /
`calc-size()`, `sibling-index()`. All Chromium-only in mid-2026, and each one
means shipping a second path for the same behavior.

## Sequencing

1. **Fix the two `rem` bugs.** They are live on `main` and `v3-beta` today and
   the unit-suffix match is the same code the next item needs.
2. **Capability inversion** (Part 1), including the `fixed` and `grid` mappings
   and the drop-on-native step. Small, mechanical, unblocks shared-file
   authoring and fixes the current prop leak.
3. **Viewport units plus `em`/`lh` on native** (Part 2), on the subscription the
   safe-area work already established.
4. **`fluid()` plus config validation, and the responsive docs rewrite.**
5. **Container units**, once the container-query measurement gates in
   flat-values remaining item 4 are green.
6. **Web feature props**: anchor positioning first, then `@starting-style`,
   scrollbars, and the small wins.

Items 1 through 4 are the beta. Items 5 and 6 can land during beta without
breaking anything, since every one is additive.

## Open questions

1. **`ch` and text measure.** Web-only with a diagnostic is honest but loses the
   one good way to set a line length. Alternative: a `text-measure` variable that
   is `65ch` on web and a font-metric-derived number on native. That needs a
   native font metrics source Tamagui does not have today.
2. **Should `remBaseFontSize` scaling by `PixelRatio.getFontScale()` be
   opt-out?** It is unconditional today. Scaling layout with the user's OS font
   preference is the accessibility win that moved Tailwind v4 to rem, but it
   also double-scales anything applied to `fontSize`, since RN already scales
   text. Worth deciding deliberately now that it is written down rather than
   leaving it as an accident of the original PR.
3. **Native bundle cost of the capability table** when the compiler is not
   running. Needs a number against the flat-values bundle gates.
4. **Browser floor.** Anchor positioning, container style queries, and
   `:user-invalid` all sit at "Baseline newly available", which is a policy
   question about supported browsers, not a capability question.
5. **How loud should the math diagnostic be?** `calc()` in a shared file is the
   most likely thing an app hits after this lands, and the message needs to name
   `fluid()`, the `web:` clause, and a plain number as the three real options.
