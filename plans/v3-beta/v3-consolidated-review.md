# V3 web style engine: consolidated review

Date: 2026-08-27

Consolidates four reviews of
[`v3-web-style-engine-one-pass.md`](../v3-web-style-engine-one-pass.md) plus
Nate's direction, into one document. Supersedes
[`opus-feedback.md`](./opus-feedback.md),
[`grok-feedback.md`](./grok-feedback.md),
[`gemini-feedback.md`](./gemini-feedback.md), and
[`nate-grok-opus-review.md`](./nate-grok-opus-review.md). Everything is checked
against the source on `v3-beta` or a checked-in receipt. Claim labels follow the
agent contract.

---

## The goal, restated

**The numbers in the plan were made up.** 3,000 gzip, 5x, 25,000, 20,000, 250:
none is derived from a measurement, and agents must not optimize against them as
if they were.

The actual goal is narrower and harder to game: **rebuild the style loop from
scratch so `directStyle` and `getSplitStyles` are one careful pass.** Size and
speed are the expected consequence and the reported receipt, not the acceptance
test.

This matters because a made-up number is worse than no number. It sends work
toward whatever is easiest to shave, and it fails at the last checkpoint with no
diagnostic. The last campaign already demonstrated the pattern: six checkpoints,
a forecast that missed in both directions, and a final note that "the model
priced gross declaration deletion but underpriced the retained plumbing that
replaces it."

### Replace numeric gates with structural invariants

Every one of these is checkable, meaningful, and cannot be met by shaving
something unrelated:

1. Every authored string is walked by exactly one character loop per pass.
2. Exactly one conditional-object discriminator exists in the codebase.
3. Exactly one transform accumulator exists.
4. No `sort`, `split`, `join`, `Array.prototype.includes`, regex, or
   `Object.keys` on the render path.
5. No per-clause heap record. Condition state is call-stack locals.
6. `directStyle.ts` does not exist.
7. Component styling does not import `propMapper`.
8. One contribution entry point. No frontend-program channel, no separate
   variant-clause channel.
9. Output completion never re-reads an authored prop.
10. Strict compiled mode contains no style-engine spans.
11. The forward pass reads no render-invariant value inside the per-prop loop.
    No `staticConfig`, `styleProps`, `driver`, `conf`, `accept`, `asChild`, or
    `isHOC` reads in the loop body; they are resolved once above it.

Keep the byte and timing numbers as **reported receipts on every checkpoint**,
with a same-run V2 control. Report them, do not gate on them. The one directional
gate worth keeping: the processor artifact must fall materially at the rebuild
checkpoint, and no broad runtime scenario regresses outside paired noise.

If a number is wanted later, measure the processor artifact first and set it from
that pool. Not before.

---

## What rev 2 of the plan fixed

Worth naming so nobody re-litigates:

- **The processor artifact replaces the source manifest.** "A real minified
  bundle, not a source-map row or hand-maintained manifest. Moving code to
  another file cannot move it outside the ruler." Strictly better than the
  manifest bucketing two reviews proposed, and it dissolves the
  which-declarations-count argument.
- **`extras.props` settled without a Proxy or a public break.** Materialize the
  merged record only for components with a functional variant; everything else
  streams four sources directly.
- **Compound arena redesigned.** Geometric growth, indices only, no live frame
  holds a typed-array reference, watermark release, unbounded Cartesian
  products. The matrix pins nested growth past the original binding while an
  outer frame is live.
- **Neutral output frame with two finalization policies.** The scanner no longer
  chooses CSS versus inline. This is the correct fix for a real divergence in the
  current code (see "The CSS and inline paths run different code" below).
- **One frontend path** deletes `preprocessProps`,
  `STYLE_FRONTEND_PREPROCESSED`, and `frontendProgram`, removing the third
  contribution entry point.
- **Checkpoint 2, move immutable work out of render**, is new and is the
  highest-value structural item in the document.
- **The five-modifier limit is pinned correctly** ("five succeed, six fail"),
  matching the enforced throw at `clausePrecedence.ts:160-164`.

---

## Decisions taken

Recorded so implementation does not reopen them.

| question | decision |
| --- | --- |
| Conditional object values | **Keep.** They are essential. The work is to do them well, not to remove them. |
| Transform order | **Authored order.** Neither current path does this. See below; it is a bug, not a design choice. |
| `group` losing its query container | **Accept.** If you want a container, declare `container` separately. |
| A style write propagating to styled context | **Drop it.** `createStyledContext` is the supported path. |
| Token provenance | **Keep, dev-only.** Already correctly gated. Needs a code review and proof it shakes out. |
| Numeric targets | **Not gates.** Reported receipts only. |
| `data-*` to `dataSet` shim | **Remove.** `data-*` is the API. |
| `accessibility*` on web | **Remove the web-side work**, keep pass-through, fix the types. The aria-to-native adapter already exists and stays. |

---

## Nate's cross-cutting critique: stop over-narrowing at runtime

> "we are over-careful on things doing like `Object.is` this and that and
> `typeof` and all these checks to narrow at runtime. the truth is we don't need
> to safeguard everything crazy. let our users decide."

This is correct and it is measurable. **RAN**, counts across the four hot files
(`getSplitStyles.tsx`, `directStyle.ts`, `propMapper.ts`, `createComponent.tsx`):
94 `typeof`, 19 `Array.isArray`, 17 `isVariable`, 8 `hasOwnProperty`, 3
`Object.is`.

Not all of those are slop. A `typeof value === 'string'` that chooses between the
scanner and the object adapter is the actual dispatch and has to stay. The rule
that separates them:

**A check that decides what to do is dispatch. A check that protects against
input a user should not send is a tax on everyone who sends correct input.**

The canonical example, and it is worse than a stray check:

**READ** `getSplitStyles.tsx:111-116`. `compoundMatcherMatches` uses `Object.is`.
Against `===`, that differs only for `NaN` and `-0`. **READ**
`code/core/core-test/compoundVariants.web.test.tsx` and its `.native` sibling:
both contain a test named *"compound matchers use `NaN` for scalars and readonly
arrays"*, asserting that `compoundVariants: [{ amount: Number.NaN }]` matches a
prop of `NaN`.

So NaN-equality semantics in compound variant matching are a **pinned behavior**.
It puts a function call where an operator belongs, in the hottest compound loop,
on both platforms, forever, for a thing no application does.
`mergeFlatTransforms:1537` carries the same `Object.is` for `scaleX`/`scaleY`.

The audit to run as part of the rebuild:

- **Delete the check and its pin** where the guarded input is not something a
  reasonable app produces. `NaN` compound matchers qualify. Say so in the
  changelog and move on.
- **Hoist the check out of render** where it guards a definition-time constant.
  `overriddenContextProps` re-derives four `staticConfig` values and runs two
  linear array scans per winning style write; all of it is constant per
  `styled()`.
- **Keep the check** only where it is real dispatch or where being wrong
  corrupts output rather than throwing a clear error.

Ban the pin, not just the check. Otherwise the next rebuild reintroduces
`Object.is` to make a test pass.

---

## The prop loop re-evaluates per-render constants on every prop

Nate, on the `data-*` shim: "not sure what this is but on every prop can
definitely be removed, it doesn't change in a single render call."

That is right, and it is not one site. **READ** the forward pass
`contributeProp` (`getSplitStyles.tsx:645-1250`). Every one of these is
invariant for the whole render and is re-evaluated per prop:

| line | expression | note |
| --- | --- | --- |
| 744 | `getDefaultProps(staticConfig)` | a **function call per prop**. The helper is `(staticConfig) => staticConfig.defaultProps`, used once. |
| 830-833 | `staticConfig.isReactNative \|\| (styleProps.isAnimated && driver?.isReactNative && !driver.View?.acceptRenderProp)` | Nate's catch. Every operand invariant. |
| 913 | `(styleProps.isAnimated \|\| staticConfig.isHOC) && driver?.isReactNative` | |
| 931 | `asChild === 'except-style' \|\| asChild === 'except-style-web'` | two string compares per prop |
| 936-943 | `isHOC`, `parentVariants`, `disablePropMap` combinations | |
| 743, 701, 755 | `asChild`, `accept`, `!noSkip && !isHOC` | |
| 789-792 | `driver?.animations`, `driver?.outputStyle === 'css'` | |
| 813, 823, 1044, 1070, 1151 | `isValidStyleKey(key, validStyles, accept)` | called **five times per pass**, two of three arguments invariant |
| 1039, 1072, 1129 | `!isHOC && ...`, `isHOC && parentStaticConfig?.variants?.[keyInit]` | |

`isValidStyleKey` compounds with an earlier finding: **READ**
`getSplitStyles.tsx:438-447`, its body is `key in validStyles || (isWeb && (five
string compares for the transition longhands)) || (accept && key in accept)`.
Move the transition keys into `webOnlyStylePropsView` / `webOnlyStylePropsText`
and every one of those five call sites drops the five compares.

This is a **different and cheaper class** than the plan's checkpoint 2
("move immutable work out of render"). That one needs definition-time compiled
metadata and a revisioned registry. This one is pure hoisting: compute a handful
of booleans once above the loop and read them inside. No new machinery, no
cache, no definition-time step, no behavior change.

It is also probably the larger immediate win, because it multiplies by every prop
of every component on every render, whereas definition-time compilation pays back
once per component definition.

Add it as an explicit item: **the forward pass computes its render-invariant
decisions once, before the loop.** Make it a structural invariant, since a
reviewer can check it by reading the loop body for reads of `staticConfig`,
`styleProps`, `driver`, `conf`, `accept`, `asChild`, and `isHOC`.

## Transform order is a bug, not a decision

Nate: "I thought we do it the order we're given it, that's how we do everything."

That is the right model and **neither path does it**:

- **READ** `directStyle.ts:1589`: `Object.keys(direct.flatLegacyTransforms).sort()`.
  Pure alphabetical over authored property names, so `rotate, scale, x, y`.
- **READ** `getSplitStyles.tsx:1531-1561`: fixed head `x, y, rotate, scale`, then
  `keys.sort(sortString)` for the rest.

Transform composition is not commutative, so the web class path and the
native/inline path already render the same input differently. This is a live
correctness bug that nobody filed because it only shows up when you compare
platforms.

The fix is the same as the cleanup: **preserve authored order in one
accumulator**, which deletes both sorts, deletes the alphabetical tiebreak, and
matches the "one authored traversal" principle the plan is built on. It also
removes the quadratic re-emit at `directStyle.ts:1584-1601`, where every
transform part triggers a fresh `Object.keys` + `sort` + `map` and a complete
re-emission of the `transform` property.

`x`/`y` still lower to `translateX`/`translateY`. Equal `scaleX`/`scaleY`
compression to `scale` is a separate question; if it survives, it survives
without `Object.is`.

Call the order change a breaking change in the notes and pin it with a rendered
assertion on both platforms.

---

## Object values: keep, and here is what "done well" means

The plan is right to keep them. The reason it gives ("already tokenized input")
is not the real one, and getting the reason right makes the implementation
smaller.

**Objects are the only way to put a runtime, non-string value under a
condition:**

```tsx
<View bg={{ default: props.color, hover: props.hoverColor }} />
```

You cannot interpolate a `Variable`, a theme object, or an arbitrary runtime
value into a flat string. `hoverStyle` is gone in v3, so there is no other escape
hatch. That is the contract, and it should be written down so nobody adds
object-only features and lets the two syntaxes drift.

Three facts that make the adapter genuinely small:

1. An object's **keys** are clause chains, scanned once.
2. An object's **values** are already values and are never scanned as clauses.
   **READ**: `contributeStyleObject` passes `payload` straight to
   `resolveClauseChain` as `raw`; `emitValue` runs token resolution on it, not
   clause parsing.
3. Conditional **structured** payloads are already refused.
   `directStyle.ts:2160` warns "conditional X needs its composite property;
   dropping it" for shadow and legacy transform parts.

So the honest cost of object support is **one discriminator in one place**. It
feels expensive today only because it is written three times and forked in four
files:

- `directStyle.ts:2084` `isConditionalStyleObject`
- `getSplitStyles.tsx:176-182`, inline inside `matcherChains`
- `getSplitStyles.tsx:199` `isConditionalObjectValue`
- plus the object branch and hand-rolled character loop at
  `useComponentState.ts:97-115`

Gemini's concern that `Variable` instances would be misclassified is already
handled: `directStyle.ts:2253-2258` guards `!Array.isArray(value) &&
!isVariable(value)` before the object branch. The detection is already simple.
It is just duplicated.

On structured leaves (`shadowOffset`, `textShadowOffset`, `transform: []`): these
are React Native's StyleSheet API, they are leaves that never enter clause
parsing, and web already has the string form. **READ**: `boxShadow` is a valid
style prop (`validStyleProps.ts:259`) handled at `directStyle.ts:1871`, and
`emitWebShadow` composes the RN `shadow*` parts into `box-shadow`. So on web you
already write `boxShadow="0 10px 20px rgba(0,0,0,.3)"`. Dropping `shadow*` is an
RN-parity question, not a styling one, and belongs in the web-alignment audit
below rather than here.

---

## New workstream: web API alignment

Nate: "I don't need us to be a superset of React Native anymore or want that. I
want us to be more like React Strict DOM aligned, even React is going this way."

Most of this is already built. The audit's job is to finish it and to fix the
types, which are the part that actually still costs.

### The web-to-native adapter already exists and is correct

**READ** `code/core/web/src/dom/html.native.tsx:47-69` and
`htmlRuntime.native.tsx:103-131`. Web APIs are authored and mapped onto RN props
on native:

- `aria-label` -> `accessibilityLabel`, `aria-labelledby` ->
  `accessibilityLabelledBy`, `aria-modal` -> `accessibilityViewIsModal`;
- `aria-busy` / `aria-checked` / `aria-disabled` / `aria-expanded` /
  `aria-selected` -> `accessibilityState.*`;
- `aria-valuemin` / `max` / `now` / `text` -> `accessibilityValue.*`;
- `aria-hidden` -> `accessibilityElementsHidden` plus
  `importantForAccessibility`; `aria-live` -> `accessibilityLiveRegion`;
- `tabIndex` -> `focusable`, `readOnly` -> `editable`, `disabled` -> `disabled`
  plus `focusable` plus `accessibilityState.disabled`;
- explicit `'no native equivalent'` entries for the aria attributes RN cannot
  express.

That is the React Strict DOM model, already shipped. Keep it. **There is no web
`focusable` adapter and none is needed**; the only `focusable` in core is the
native mapping above.

### `createDOMProps` is not Tamagui core

**READ**: `code/core/web` has **zero** imports of `react-native-web-internals`
and no `react-native-web` dependency. Only three packages depend on it:
`react-native-web-lite`, itself, and `compiler/static` (build time). So
`createDOMProps/index.tsx` (427 lines, roughly 45 `accessibility*` -> `aria-*`
mappings, `AccessibilityUtil.propsToAriaRole`) is never on Tamagui core's render
path. That is why `V3_BETA_MEASUREMENT_STATE.md` records
`react-native-web-internals` as absent from every retained bench arm.

Removing that mapping is a **react-native-web-lite decision**, defensible now
that we are not aiming to be an RN superset, and worth **zero bytes for a normal
Tamagui app**. Nobody should forecast core size from it.

### What is actually left in core

**One runtime item.** `getSplitStyles.tsx:826-840` converts `data-*` back into
`dataSet` when the host is an RNW component (`staticConfig.isReactNative`, or an
RN animation driver whose View does not accept a render prop). It sits on the
per-prop loop, costing a `startsWith('data-')` plus a static-config and driver
check on every prop. **Decision: remove it.** `data-*` is the API; an RNW host
that ignores it is that host's problem.

**One type item, and it is the real cost.** The public prop unions still carry
the `accessibility*` surface (`types.tsx:2721-2727` documents the mapping) plus
`RNExclusiveTypes.ts` (responder handlers, `onLayout`, `onTextLayout`,
`focusable`, `dir`, `href`, `hrefAttrs`, `rel`, `download`, `elevationAndroid`).
Roughly 45 accessibility props in every component's prop union is a real
contributor to TypeScript performance, which is its own tracked problem in
[`v3-type-performance.md`](../v3-type-performance.md). This is where the win is.

The only `accessibility*` reference in `code/core/web/src` runtime is a label
fallback at `createComponent.tsx:1865-1866`.

### Proposed shape

1. `aria-*`, `role`, `data-*`, and `tabIndex` are the authored API. Documented as
   such.
2. Native keeps the existing adapter. It is correct and complete.
3. `accessibility*` keeps passing through at runtime so nothing breaks silently,
   but does no web-side work, with a development `console.error` naming the
   `aria-*` replacement.
4. Remove them from the public types, or mark `@deprecated`, so the editor leads
   people to the web spelling and the prop union shrinks.
5. Delete the `dataSet` reverse shim from `getSplitStyles`.
6. Docs, a skill, the migration guide, and the blog post carry the mapping table.
   `code/compiler/static-tests/tests/webAlignment.web.test.tsx` already exists as
   the pin.

Separate campaign from the style engine. It shares no failure mode with the loop
rebuild and must not share a checkpoint with it. The only piece that belongs in
the engine work is deleting the `dataSet` branch from the prop loop.

---

## Four things still wrong in the plan

### 1. Fixed numeric condition slots walk back what already shipped

Lines 254-256 still say "fixed numeric slots for the existing maximum of five
non-platform conditions."

**READ** `v3-handoff-log.md:5875`, describing checkpoint IV-a, which is on disk
today:

> "`directStyle` now resolves a clause through one call-stack-only
> `resolveClauseChain` loop. The heap `Condition` record, `getCondition`, the
> direct collect-then-emit loop, the canonical and kind arrays, the per-clause
> `Set`, and the grammar-config precedence bridge are gone."

That was worth -362 CORE. Fixed slots on the frame reintroduce the shared mutable
state IV-a deleted, and they corrupt on same-frame nesting: `sm:$v` returning
`{ color: 'hover:red' }` evaluates the inner clause while the outer condition is
live. Three reviews have flagged this and revision 3 of the previous plan settled
it.

Fix: say **call-stack locals**, which is what ships. Delete the sentence.

### 2. Checkpoint 3 is not as atomic as it claims

The argument is that any partial split keeps a forbidden rescan. True for the
scanner, sink, and output completion. Not true for three things bundled into the
same commit:

- the presence and lifecycle hook protocol, which is orthogonal to how strings
  are scanned;
- the transform accumulator, a self-contained replacement of four merge systems;
- the compound arena, which consumes clauses without changing how they are
  produced.

Each is independently landable, reversible, and gate-able. Peeling them off
leaves the genuinely atomic core: scanner, property sink, variant traversal,
output completion, and the `directStyle.ts` deletion.

The risk history supports this. `26ee0b751a` moved one decision into the emitter
and opened a motion-driver regression that neither the core web suite nor the
pinning test caught. That was a small change. A single commit containing the
entire engine has no bisect story at all.

### 3. The font-family contradiction is live

Line 294 says "preserve the font-family pre-read." The stop conditions say a
second traversal is a stop.

Gemini located this in the props loop. It is not there:
`getSplitStyles.tsx:998-1005` updates `styleState.fontFamily` **inside** the prop
loop ("before variants run, after each variant"), so there is no second props
traversal. The real pre-read is of the **variant result object**, because font
size tokens depend on which family is selected, and a variant result can carry
getters. The prior review already flagged the read-count hazard.

Gemini's fix is the right one: **keep the unresolved token identifier in the
output slot and resolve it during output completion**, once the family is known.
That removes the double read, removes the getter hazard, and satisfies the stop
condition.

### 4. Shorthand versus longhand output slots are unspecified

The plan says one slot per property and condition identity, and never says how
shorthands relate to longhands. `padding={10} px={20} paddingLeft={30}` has to
resolve deterministically, and on the CSS path two slots emitting independently
is a cascade hazard.

Specify: **shorthands expand into canonical leaf slots during the pass**, tagged
with authored sequence, so later leaf contributions cleanly overwrite earlier
expanded ones with no intermediate object.

---

## The CSS and inline paths run different code

The plan's neutral frame fixes this, but it should say what it is fixing.

**READ** `directStyle.ts:1127-1141`. On web with `flatShouldDoClasses`, every
`emitProperty` routes into `directAtomic` and **returns before `merge` is ever
called**.

Consequences today:

- `mergeStyle` (`getSplitStyles.tsx:1569`) never runs on the web class path. Not
  for conditionals, not even for base styles.
- Therefore the `overriddenContextProps` sniff at `:1579-1601` is
  **native-and-inline only**, while every platform pays four `staticConfig`
  re-derivations and two `Array.prototype.includes` linear scans per winning
  style write. This is the mechanism Nate decided to drop, and the fact that it
  already does nothing on web is the argument for dropping it.
- Same for `recordStyleTokenProvenance`, which is dev-only anyway.

So the CSS and inline paths do not merely serialize differently; they execute
different amounts of code and produce different side effects. Any rebuild has to
state that as the thing being unified.

---

## Deletion pool

What a careful rebuild actually removes. All verified in current source.

| what | where | note |
| --- | --- | --- |
| 5 `scanFlatValue` sites, 4 on the render path | `clauseIdentity.ts:194`, `useComponentState.ts:121`, `getSplitStyles.tsx:166`, `propMapper.ts:215`, `directStyle.ts:2029` | plus a 6th hand-rolled character loop at `useComponentState.ts:104-114`. One `bg="hover:blue"` on a component with compounds is walked four times. Handlers are module-scope since III-a, so this is walks, not allocations. |
| 3 copies of the conditional-object discriminator | `directStyle.ts:2084`, `getSplitStyles.tsx:176-182`, `getSplitStyles.tsx:199` | |
| 4 transform systems, 2 with different output order | `directStyle.ts:1584` (quadratic re-emit), `getSplitStyles.tsx:1529`, `:1804`, `:1718-1752` | see "Transform order is a bug" |
| `getSubStyle`, a v2 leftover | `getSplitStyles.tsx:1664` | `pressStyle`, `hoverStyle`, and `pseudoDescriptors` appear **zero** times in the file. It survives only for `accept: 'style' \| 'textStyle'`, and for that one case still calls `propMapper`, still runs `Object.getOwnPropertyDescriptors` per call, and still has a four-deep nested transform loop whose inner `for..in` breaks after the first key. |
| 2 different functions named `normalizeStyle` | `helpers/normalizeStyle.ts` and `getSplitStyles.tsx:1823` | different behavior, same name, same package |
| transition keys hardcoded 3x | `getSplitStyles.tsx:441-445`, `:688-698`, `directStyle.ts:1567` | `validStyleProps.ts` has **no** transition keys and already exports `webOnlyStylePropsView` / `webOnlyStylePropsText`. One table entry replaces three hand lists. |
| compound matching, 9 levels of nesting | `getSplitStyles.tsx:220-240` | `joinChains` does `split` / `includes` / `join` per pair, per compound, per render, matching or not. The `FlatFrame` bench scenario has twelve compound variants. |
| `overriddenContextProps` per-write sniff | `getSplitStyles.tsx:1579-1601` | decided: drop. Also delete `originalContextPropValues` (`propMapper.ts:446`). |
| `Object.is` in compound matching and scale compression | `getSplitStyles.tsx:113,115,1537` | delete the `NaN` pins in `compoundVariants.{web,native}.test.tsx` with it |
| frontend program channel | `helpers/frontendProgram.ts` | the plan already deletes it; name `@tamagui/tailwind` as the affected consumer |
| `data-*` to `dataSet` reverse shim | `getSplitStyles.tsx:826-840` | decided: remove. A `startsWith` plus a static-config and driver check on every prop. |

Token provenance stays, dev-only. Two follow-ups: prove it actually shakes out
(the re-export at `getSplitStyles.tsx:72` keeps the module reachable from the
public graph), and code review it, since its only current consumer is its own
test at `core-test/getSplitStyles.tokenProvenance.native.test.tsx`.

---

## Gemini triage

| point | verdict |
| --- | --- |
| A, object discriminator | Mostly already implemented. `Variable` and array guards exist at `directStyle.ts:2253-2258`. The defect is three copies, not a missing guard. |
| B, five-condition limit | **Wrong.** `clausePrecedence.ts:160-164` throws above `grammarMaxNonPlatformDepth = 5`. The limit is real and enforced, and rev 2 pins it correctly. The quoted line is from a superseded revision. |
| C, font-family pre-read | Real contradiction, mis-located. It is a variant-result pre-read. The proposed fix is right. |
| D, shorthand versus longhand slots | **Real and unaddressed.** See item 4 above. |
| E, `avoidReRenders` discrete-prop hand-off | **Real, with a prior incident.** `V3_BETA_MEASUREMENT_STATE.md` records that `26ee0b751a` broke exactly this: hover/press-conditioned discrete props on the motion driver applied and stuck, root-caused to a stale 18-prop hand copy of `nonAnimatableStyleProps` in `animations-motion`. Pin is `DriverConditionedDiscrete.animated.test.tsx`. |
| 2A, non-colon fast path | Already implemented at `directStyle.ts:2012-2027`. |
| 3B, unified grammar tables | Plausible, unmeasured. A deletion-pool row, not a forecast. |
| 3D, `usePresence` bundling risk | Real and unaddressed. Unconditional `usePresence` pulls the package into every app. |

---

## Prior-campaign context, corrected

The previous campaign's summary line reads "net zero at this precision," which
has been misread as proof consolidation does not pay. **READ**, the per-checkpoint
receipts in `v3-handoff-log.md:5155-5930`:

| checkpoint | what it did | CORE | cluster |
| --- | --- | ---: | ---: |
| III-a | scanner signature, module-scope handlers | **-81** | |
| III-b | shared clause identity | +48 | |
| III-c0a/b/c/d | grammar semantic corrections | +7 | +6 |
| III-c1 | runtime normalization | | +55 |
| III-c2 | compiled vocabulary and invalidation | **+520** | **+440** |
| III-d | tooling leaves the app graph | **-520** | **-440** |
| IV-b | per-clause refusal, a new feature | **+308** | **+407** |
| IV-a | one clause resolver | **-362** | **-338** |

Three consolidation checkpoints delivered **-963**. Deliberate feature and
semantics work in the same sequence added about **+883**. The net zero is those
two facing each other.

Two lessons:

- **Never ship new behavior in the same ledger as a consolidation win.** Group
  and container separation, refusal semantics, and the web-alignment audit each
  need their own receipt.
- **The largest single lever was moving code out of the app graph** (III-d,
  -520), larger than the fusion checkpoint. Still mostly unused: `parseValue`
  absent from the runtime graph, native lowering behind `TAMAGUI_TARGET`, CSS
  generation behind `TAMAGUI_DID_OUTPUT_CSS`.

And the experiment this plan proposes has never run. That campaign consolidated
the clause parser and resolver layer. It never touched emitter and splitter
fusion, `getSubStyle`, `propMapper`'s role, the transform systems, compound
matching, or the five scan sites.

The audit line in `V3_BETA_MEASUREMENT_STATE.md` ("replacing the rest of
`getSplitStyles` with `directStyle` cannot remove bytes") is **INFERRED from a
source and call-graph audit, not measured**, and scopes to the splitter's
component semantics: prop forwarding, HOC, `asChild`, `viewProps`, class
assembly, the React insertion effect. That half is genuinely irreducible and
belongs outside the processor artifact.

---

## Sequence

Largely the plan's, with checkpoint 3 unbundled and the audits separated.

**0. Ruler and pool.** Build the public and processor fixtures. Measure the
processor artifact. Build the deletion-pool table with real marginals. Run
`profile-hotpath.ts` on the clause-string scenario and name the frames that must
die. Add 0-prop and 1-prop scenarios to decompose fixed per-call overhead. No
engine code.

**1. Group and container split.** Independent, lands immediately. Needs the
migration note: `group="card"` emits `container-name: card` today, so `@sm/card:`
resolves against a group. Removing the coupling breaks that, and the answer is
that you declare `container` separately.

**2. Move immutable work out of render.** As written in the plan. Highest-value
structural item.

**2b. Cheap independent wins, one commit each.** Hoist the render-invariant
decisions out of the per-prop loop. Transform accumulator with authored order.
`useComponentState` prepass deletion. Transition keys into `webOnlyStyleProps`.
The duplicated refusal block. The double `resolveClauseChain` on an object's
first key (`directStyle.ts:2090` then `:2177`). `joinChains` without `split` /
`join`. `Object.is` and its `NaN` pins. `overriddenContextProps` deletion. The
`data-*` to `dataSet` shim.

None of these needs the rebuild to land first, none changes grammar or cascade,
and together they are likely most of the measurable time win.

**3. Rebuild the loop.** Scanner, property sink, variant traversal, output
completion, `directStyle.ts` deleted. One assembled unit.

**3b. Presence and lifecycle hook protocol.** Separable.

**3c. Compound arena.** Separable.

**4. Specialize the web artifact.** Note that this is mostly already done: the
compiled arm tree-shakes the entire emitter, with `getSplitStyles`,
`createComponent`, and `propMapper` absent and `directStyle` down to 50 marginal
gzip for `platformMatches` only. It needs a pin so it stays done, plus the
`TAMAGUI_DID_OUTPUT_CSS` work.

**Separate campaigns, not checkpoints here:** theme and provider removal, and the
web API alignment audit.

---

## Still missing from the plan

- **Compiler and runtime lockstep.** Any change to atomic class identity,
  transform order, or clause precedence must change identically in the compiler,
  or mixed compiled and runtime apps get hydration mismatches and a wrong
  cascade. `parserAgreement.web.test.tsx` and `code/comparisons/conformance`
  belong at every emission-changing checkpoint, not only checkpoint 1.
- **What happens when a gate fails.** Say who decides and whether the answer is
  to change the target or the design. This stalled the campaign twice.
- **Native risk named per checkpoint.** This is titled a web plan and the engine
  is shared. `getSplitStyles.native.test.tsx` and the ios/tvos/androidtv variants
  should be listed explicitly.
- **SSR and hydration class-name stability.** One line, but it is the failure that
  ships silently.
