# V3 static types: what can be typed, what it costs, what it must not be

Lane O1, 2026-07-31. Question from Nate: can at least some v3 types work
statically, for the statically-known subset of tailwind class strings and/or
Tamagui-mode flat value strings, with working autocomplete?

Answer in one line: **yes for single-value strings, no for class lists**, and
the reason is not type performance, it is that TypeScript string completions
replace the whole string literal.

Reproduce everything below from `/private/tmp/claude-501/-Users-n8--worktrees-tamagui-v3-flat/110548ab-b716-49f3-b69d-3914cebfcace/scratchpad/static-types/`
(session scratch, so copy it out if you need it to survive; the generators are
self-contained and only read this worktree). Generators `vocab.gen.ts`,
`fixture.gen.ts`, `scaling.gen.ts`, `flat.gen.ts`, `validator.gen.ts`,
`realistic.gen.ts`, `matrix.gen.ts`, `bgcost.gen.ts`; harnesses `measure.sh`,
`tsserver-probe.mjs`, `ls-probe.mjs`, `typeshape.mjs`, `settle.mjs`.

## The vocabulary, measured against the real default config

Generated from the actual `code/core/style-grammar/src/registry.ts` crossed with
`@tamagui/themes/v4`:

| set | size |
| --- | --- |
| whole-class utilities (`flex-1`, `italic`, …) | 94 |
| base candidates (whole + every prefix x its token category) | 3,842 |
| modifiers: state 14, media 14, platform 7, theme 294 | 329 |
| base x one modifier | 1,264,018 |

TypeScript's 100,000-constituent limit applies to unions it *computes*, which is
what a template-literal cross product is. Hand-written literal unions are not
capped: a 110,000-member one compiles (it just gets expensive, see below). One
modifier level exceeds the computed limit 12x, and the grammar allows chains
(`dark:hover:sm:`). Confirmed, not estimated: the template-literal form of that
cross product fails to compile.

```
lib.ts(4179,41): error TS2590: Expression produces a union type that is too
complex to represent.
```

and tsserver then returns **0 completions** for that prop. So the full grammar as
a union is off the table for a reason TypeScript enforces itself.

## Autocomplete does fire, and it is useless past the first token

Driven through tsserver `completionInfo` (`tsserver-probe.mjs`), cursor inside
the JSX string attribute. The `replaces` column is the `replacementSpan` text,
which is what accepting an entry overwrites.

| variant | cursor at | entries | round trip | replaces |
| --- | --- | --- | --- | --- |
| `className?: string` (today) | anywhere | **0** | 8ms | n/a |
| 94-member union + `(string & {})` | `"` | 94 | 9ms | `""` |
| 3,842-member union | `"` | 3,842 | 25ms | `""` |
| 3,842-member union | `"flex-1 ` | 3,842 | 13ms | `"flex-1 "` |
| 3,842-member union | `"hover:` | 3,842 | 20ms | `"hover:"` |
| 3,842-member union | `"bg-` | 3,842 | 10ms | `"bg-"` |
| 57,630-member union | `"flex-1 bg-c` | 57,630 | **861ms** | `"flex-1 bg-c"` |
| `Base \| \`${Base} ${string}\`` | `"flex-1 ` | 3,842 | 17ms | `"flex-1 "` |

Two facts fall out of that table.

**The replacement span always covers the entire string literal.** At
`"flex-1 bg-c"` the entry list is the same 3,842 bare candidate names and
accepting `bg-color1` rewrites the attribute to `"bg-color1"`, dropping
`flex-1`. There is no entry named `flex-1 bg-color1`, and there cannot be: the
two-class template `` `${Base} ${Base}` `` is 14.7M constituents, and we already
have TS2590 proof at 1.26M. What tsserver reports is the span and the entry
names; an editor computes its filter word from that span, so the practical
result is that the list filters against `flex-1 bg-c` and empties out before it
ever gets the chance to be wrong.

**The list-shaped template literal buys nothing.** `` Base | `${Base} ${string}` ``
returns exactly the finite arm, the same 3,842 entries with the same whole-literal
span. TypeScript enumerates the union arm and ignores the open-ended one.

This is the whole verdict for `className`. A class string is a list, so the
useful case is completing the second, third, fourth token, and that case is
structurally unreachable from the type system. Tailwind IntelliSense is a
language service for this reason, not because nobody tried types.

## Where the type-check cost is actually paid

The cost is not paid at declaration. It is paid once per usage site whose string
does **not** match a union member, because TypeScript's literal-to-union fast
path misses and it falls through to a scan before landing on `(string & {})`.

Isolated fixture, 1,000 usage sites, `tsc --extendedDiagnostics` check time:

| union size | strings that ARE members | realistic multi-class strings |
| --- | --- | --- |
| none (`string`) | 0.06s | 0.06s |
| 3,842 | 0.14s | **0.81s** |
| 53,788 | 0.59s | **10.50s** |
| 110,000 | 1.57s | **23.88s** |

Marginal cost per non-matching site: 0.75ms at 3,842, 10.4ms at 53,788, 23.8ms
at 110,000. Linear in sites, linear in union size. Every real className is a
space-separated list, so real code sits entirely in the right-hand column.

Same experiment against the real `@tamagui/tailwind` type background, 500 sites:

| className type | Types | check | total tsc |
| --- | --- | --- | --- |
| `string` (today) | 4,185 | 0.09s | 0.75s |
| 3,842-member union | 12,068 | 0.50s | 1.16s |
| 57,630-member union | 119,645 | 6.45s | 7.10s |

0.82ms and 12.7ms per site respectively, matching the isolated numbers, so the
cost is a property of the union and not of the surrounding types. Multiply by
your own site count: a partial-prefix grep finds at least 2,209 style-prop
attribute sites in `code/tamagui.dev`, so an app at that density pays roughly 2s
of extra tsc per full check for a 3,842-member union and roughly 30s for the
cross-product version.

### Reconciling with the LanguageService-only numbers

Fable measured `getCompletionsAtPosition` in-process and got 87ms at 40,000
entries, which looked free. Both measurements are right and they measure
different halves:

| union size | in-process compute | JSON payload | tsserver round trip |
| --- | --- | --- | --- |
| 94 | 0.2ms | 13KB | 1-9ms |
| 3,842 | 1.5ms | 519KB | 13-25ms |
| 57,630 | 23ms | **8.2MB** | **880ms** |

The compute is cheap at every size. The payload is what an editor pays, once per
completion request, and 8.2MB per keystroke is the wall. Any envelope claim has
to be stated against the round trip, not the checker call.

### The gap depends on the syntactic shape, which is why it did not reproduce

a2662 measured the same member versus non-member comparison in a plain call
argument (`Box({ className: '...' })`) at a 3,842 union and saw no gap. That
result is correct and so is mine. Holding the union (53,788) and the strings
fixed and varying only the shape, 1,000 sites, tsc check time:

| shape | member | multi-class | non-member single token |
| --- | --- | --- | --- |
| `const x: ClassName = '…'` | 0.08s | 4.14s | 4.00s |
| `Box({ className: '…' })` | 2.46s | 6.45s | 6.34s |
| `<View className={'…'} />` | 0.54s | **10.76s** | **12.19s** |
| `<View className="…" />` | 2.80s | 12.50s | 14.88s |

Two things follow. The trigger is **non-membership, not multi-token-ness**: a
single token that is not in the union costs the same as a three-class string.
And JSX attributes, which is how className is actually written, are the worst
shape by a wide margin.

Sweeping a2662's own harness over union size (`settle.mjs`, their `universe()`,
their call shape, 1,000 sites, total program ms) shows where it turns on:

| union | member | multi-class | non-member single |
| --- | --- | --- | --- |
| 3,842 | 623 | 563 | 506 |
| 20,000 | 1,491 | 1,776 | 1,743 |
| 53,788 | 3,381 | 4,129 | 4,016 |
| 80,000 | 4,761 | 7,756 | 6,991 |

So at 3,842 in a call argument there is genuinely no gap, which is the exact
corner that harness measured. It appears above ~20,000 there, and it appears at
3,842 in JSX (0.14s versus 0.81s, the scaling table above).

One measurement trap worth recording: running that harness from the tamagui
worktree pulls the repo's `@types/**` into every program, which pushes the
baseline to ~4.5s with 124 unrelated errors and buries the signal completely.
`types: []` is required for any of these numbers to mean anything.

## The conditional-type validator: real, cheap, and no autocomplete

A recursive conditional type over the space-separated list validates far more of
the grammar than any union can express, because it never materializes a cross
product. `variants/v6c-validate-extended` accepts

`flex-1 bg-color1 hover:bg-color2 lg:p-4`, `w-[220px] p-[3.5rem]`,
`bg-color1/50`, `group-hover/card:bg-color1`, `@sm:p-4 @lg/sidebar:p-8`,
`dark:hover:bg-color1`, a 30-class string, plus `dynamic`, `cn(...)`, ternaries
and template literals

and rejects exactly the bad ones:

```
probe.tsx(15,27): error TS2322: Type '"flex-1 bg-nope"' is not assignable to
  type '"unknown tamagui class: bg-nope"'.
probe.tsx(16,27): error TS2322: Type '"hvr:bg-color1"' is not assignable to
  type '"unknown tamagui class: hvr:bg-color1"'.
```

Cost at 200 sites: 0.14s check, 34,605 instantiations, against a 0.04s baseline.
That is 18x cheaper than the 53,788-member union while covering more grammar.

It is still not the answer, for three reasons. tsserver returns **1** completion
entry at every cursor (the error string type itself), so autocomplete goes from
poor to actively wrong. It requires `View` to become
`function View<const C extends string>(...)`, which changes the component's
public type. And it duplicates candidate parsing in a third place after the
compiler and the planned language service, against the design record's own rule.

## What is expressible, exactly

Expressible as a finite union, derived from config with no codegen:

- the 94 whole-class utilities (fixed, registry-owned)
- `${prefix}-${token}` for every registry prefix with a `tokenCategory`, using
  the token unions core already computes (`GetTokenString<keyof Tokens['space']>`
  and friends, `types.tsx:1827-1912`). Measured at
  `variants/v11-derived-notcodegen`: 0.62s check at 1,000 sites with no build
  step, the same range as the generated union's 0.81s; the derived form is a
  little smaller because it omits the convenience spellings (fractions,
  percentages, sizing keywords)
- per-prop flat values in Tamagui mode: a token union per category
- one modifier level on a *single* prop's token union
  (`` `${State}:${ColorToken}` `` = 1,950 members)

Not expressible, and each one alone forces the `(string & {})` fallback:

- arbitrary values `w-[220px]`, `bg-[#fff]`, `p-[calc(100%-2rem)]`, unbounded
- color opacity suffixes `bg-color1/50`: multiplies the color set by 101; the
  codebase already hit TS2590 here and left the comment at `types.tsx:1876-1878`
- named group and container modifiers `group-hover/card:`, `@sm/sidebar:`: the
  name is user-chosen, unbounded
- the modifier namespace at all for className: 329 x 3,842 = TS2590
- modifier chains `dark:hover:sm:`
- **any string with more than one token in it**, which is every class list and
  every multi-clause flat value

Also worth knowing before anyone tries the derived form: `grammarEntries` is
annotated `readonly GrammarEntry[]` (`registry.ts:38`) so its literal types are
already widened away. Type-level derivation from the registry needs that changed
to `= [...] as const satisfies readonly GrammarEntry[]`, or a small hand-written
prefix-to-category map type, which is cheaper anyway.

## What v3 does today, measured

`className` is `string` (`code/core/tailwind/src/types.ts:163`), so tailwind
mode has **zero** completions and zero validation. Confirmed: 0 entries at every
cursor against the real package.

Tamagui mode is `FlatStyleValue<T> = T | (string & {})`
(`code/core/web/src/types.tsx:2116`) and is inconsistent. With the v3-canary
config:

| prop | entries | of which tokens |
| --- | --- | --- |
| `backgroundColor=""` | 1,101 | 950 |
| `p=""` | 501 | 495 |
| `bg=""` | **216** | **0** |
| `ColorTokens` directly | 1,098 | 950 |

Neither prop validates: `<View bg="nope-not-a-token" />` and
`<View backgroundColor="nope-not-a-token" />` both typecheck today, which is
`(string & {})` working as designed.

### Why `bg` has no tokens

Not a bug in the shorthand chain. v6 deliberately remaps it:
`code/core/shorthands/src/v6.ts:10` is `bg: 'background'`, where v4 and v5 were
`bg: 'backgroundColor'`. That is the flat-value background family doing its job,
since `bg="url(x.png) color1"` has to reach `backgroundImage` too.

The gap is that `background` never got a theme-aware value type to go with the
remap. It is declared `background?: Properties['background']`
(`code/core/web/src/types.tsx:2382`, in `interface ExtraStyleProps`) and
`'background'` is absent from `ColorKeys` (`types.tsx:37-53`), so
`ThemeValueGet<'background'>` is `never` and `WithThemeValues` takes its
no-theme branch. Inspecting the contextual type of the JSX attribute directly
(`typeshape.mjs`, which reads `checker.getContextualType`):

| attribute | union constituents | string literals |
| --- | --- | --- |
| `<View backgroundColor="">` | 1,112 | 1,101 |
| `<Text color="">` | 1,112 | 1,101 |
| `<View bg="">` | **220** | **216** |

The 216 are `Properties['background']` keywords (`Window`, `WindowFrame`,
`round`, `center`), which is the CSS `background` shorthand's own value set, so
the symptom is exactly what the remap implies.

Two other props read as broken and are not. `<View width="">` and
`<View borderRadius="">` return 0 completions because under v6 they are not
props at all (`Property 'width' does not exist`), which is `onlyAllowShorthands`
behaving as configured. `<View color="">` returns 0 for the same reason; `color`
on `Text` is healthy at 1,101 literals.

Repro: `realistic/r3-core-today/` and `realistic/r4-bg-proposal/` in the scratch
dir.

### The fix, prototyped and measured

Give `background` a color-aware type that keeps its CSS shorthand arm:

```ts
// code/core/web/src/types.tsx:2382
background?: ColorTokens | Properties['background']
```

Measured by shadowing that prop onto the real component so the real config's
token union is exercised, 1,000 `bg={'token'}` sites:

| `bg` type | completions | of which tokens | tsc check |
| --- | --- | --- | --- |
| `Properties['background']` (today) | 216 | 0 | 0.46s |
| `ColorTokens \| Properties['background']` | **1,166** | **950** | **0.36s** |

It is free, and slightly faster: with the tokens in the union a `token` value
now hits the literal-to-union fast path instead of scanning past
`Properties['background']`. `no-repeat center` and `url(x.png) color1` both
still typecheck.

Do not do this by adding `'background'` to `ColorKeys`. That routes it through
`GetThemeValueForKey`, whose `Exclude<T[K], string>` erases the CSS shorthand
arm, so you would trade the position and repeat keywords away to get the tokens.

One trap found while prototyping: `ColorTokens | ThemeValueFallbackColor` used
directly collapses to a single non-union constituent and returns **0**
completions. The real prop types are not affected (they compose it inside
`WithThemeValues`, and `backgroundColor` measures healthy above), but it makes
that alias a bad thing to hand-write into a prop type.

### Landed

Shipped in `53fe77bd9a`, `code/core/web/src/types.tsx` plus the rebuilt
`code/core/web/types/types.d.ts`. Verified against the real built package, not
the shadow prototype:

- `<View bg="">` returns 1,166 completions, 950 of them theme tokens, up from
  216 and 0. `backgroundColor` (1,101) and `Text.color` (1,101) unchanged.
- both arms survive in the entry list: `color1`, `background`, `no-repeat`,
  `center`, `round`, `repeat-x`, `border-box`, `transparent`, `currentColor`.
- `bg="no-repeat center"`, `bg="url(x.png) color1"`, `bg="color1"`,
  `bg="color1 hover:color5"`, `bg="linear-gradient(red, blue)"` and
  `bg="#ff0000"` all typecheck.
- `@tamagui/web` type tests 93 passed / no type errors, core-test web 475
  passed, core-test native 198 passed, style-grammar 403 passed.

### Known coverage gap, and the tool that closes it

No regression test was added, on purpose, and this is a recorded gap rather than
an oversight.

The failure mode is "the token arm disappears from the prop's union". No
assignability test can see it. Every style prop type ends in `| (string & {})`,
so `expectTypeOf<'color1'>().toExtend<BgType>()` passes whether or not the
token literals are present, and the prop keeps typechecking while autocomplete
is dead. That is a test that stays green while the thing is broken, which is
worse than no test. It is also not hypothetical: this exact failure shipped
unnoticed in `bg`, and nothing went red.

Seeing it requires asking the checker what the contextual type actually
contains. `scripts/inspect-style-prop-types.mjs` does that: point it at a probe
file with string-literal attributes and it reports union constituents, string
literals, and how many of those are `$`-prefixed tokens.

```
$ node scripts/inspect-style-prop-types.mjs probe.tsx bg,backgroundColor --expect-tokens
View.bg                 constituents= 1171  stringLiterals= 1166  tokens= 950  templates=1
View.backgroundColor    constituents= 1112  stringLiterals= 1101  tokens= 950  templates=2
OK: every inspected attribute carries theme token literals (config augmentation: 26 members)
```

**The probe file must import the app's tamagui config.** Token unions come from
the `TamaguiCustomConfig` augmentation, so a probe that only imports components
reads as zero tokens on every prop, which is byte-for-byte what the real
regression looks like. The script checks `TamaguiCustomConfig` for members
before it asserts anything about tokens, and separates the two outcomes:

| exit | meaning |
| --- | --- |
| 0 | every inspected attribute carries token literals |
| 1 | token regression, in a program that is genuinely augmented |
| 2 | usage error (bad args, no tsconfig, no matching attributes) |
| 3 | the probe is not usable, so the run proves nothing |

Verified in all four directions against the real build, not by reasoning:

- correct probe, current build: exit 0, 950 tokens on `bg`, `backgroundColor`
  and `Text.color`
- pre-`53fe77bd9a` shape (`bg?: Properties['background']`) with the config
  imported: **exit 1**, 219 constituents, 216 string literals, 0 tokens
- probe missing the config import: **exit 3**, reporting the missing
  augmentation, not a token regression. This reproduces the false alarm exactly
  (`View.bg no contextual type`, `backgroundColor` 160 constituents / 0 tokens)
- attribute that is not a prop of the component (`<View width="">`): **exit 3**,
  reporting a broken probe

The 1-versus-3 split is the point. A guard that cries wolf on a misplaced probe
gets muted by the third person who hits it, and a muted guard is worse than no
guard.

Promote it into a vitest case when `ColorKeys` (`types.tsx:37-53`), the
`ExtraStyleProps` web-only style props, or the shorthand-to-longhand map start
moving. Those are the three edits that can silently drop a token arm, and today
none of them would turn anything red.

## Sweep: is `bg` the only one?

`bg` lost its tokens because a shorthand remap was not reflected in the type
layer. That is a class, not a one-off, so the whole style prop surface was
audited rather than spot-checked. Measured at `ec95f05965`.

The authority is the runtime, not the type layer: `tokenCategories` in
`code/core/helpers/src/tokenCategories.ts` and `defaultTokenCategories` in
`code/core/web/src/helpers/propMapper.ts` are what decide, at runtime, which
props resolve a theme token. Any prop in those tables whose type carries no
token arm is the bug, by definition.

Two passes, because the first one over-reports:

1. diff the runtime tables against the type-level key sets (`ColorKeys`,
   `SpaceKeys`, `SizeKeys`, `ZIndexKeys`, and the `` `border${string}Radius` ``
   pattern)
2. probe every prop the runtime token-resolves with
   `scripts/inspect-style-prop-types.mjs`, because several props carry tokens
   through a direct declaration (`blockSize?: SizeTokens | number`) rather than
   through a key set, and the diff alone reports those as false gaps

| category | runtime props | key-set gap | real gaps after probing |
| --- | --- | --- | --- |
| color | 20 | 4 | **4** |
| space | 46 | 7 | 0 (all 7 declared directly) |
| size | 12 | 6 | 0 (all 6 declared directly) |
| radius | 9 | 9 | 0 (matched by the pattern, not a list) |
| zIndex | 1 | 0 | 0 |

### Found and fixed

Four color props resolve theme colors at runtime and offered none in the types.
They typechecked the whole time through `(string & {})`, which is why nothing
ever went red:

| prop | before | after |
| --- | --- | --- |
| `caretColor` | 201 constituents, 199 literals, **0 tokens** | 950 tokens |
| `textDecorationColor` | 4 constituents, 0 literals, **0 tokens** | 950 tokens |
| `borderEndColor` | 4 constituents, 0 literals, **0 tokens** | 950 tokens |
| `borderStartColor` | 4 constituents, 0 literals, **0 tokens** | 950 tokens |

All four now match `backgroundColor` and `color` exactly. Fixed by adding them
to `ColorKeys` (`types.tsx:37-56`), which is the correct route **here** and was
the wrong route for `background`: the documented trap is that
`Exclude<T[K], string>` erases the other arm, and `background` needed its CSS
shorthand keyword arm (`no-repeat`, `center`) preserved. These four are pure
color longhands whose other arm is `ColorValue`/csstype color, which
`ThemeValueFallbackColor` supplies anyway. Verified rather than assumed:
`caretColor` keeps `red`, `blue`, `transparent` and now matches `backgroundColor`
keyword-for-keyword. `currentColor` and `auto` are absent from every tamagui
color prop including the pre-existing ones, so that is a separate, older
question and not something this change introduced.

Isolated from a concurrent change: a2763 was adding `${state}:${token}` clause
forms to the color and space value types in the same file, which inflates the
constituent totals. Probing the pre-fix types in the *same* program shows them
still at 0 tokens while the fixed props read 950, so the token arm is this
change and not theirs.

### Deliberately not findings

- **composite CSS shorthands** (`border`, `borderBlock`, `borderInline`,
  `outline`, `boxShadow`, `filter`, `mask`, `backgroundImage`, `textEmphasis`,
  `borderImage`, `transformOrigin`) carry 6 to 33 preset literals and no tokens.
  That is deliberate: they take composite values like `1px solid border-color`,
  where a token cross-product is exactly the combinatorial explosion this
  document argues against. Preset hints are the right design.
- **enum and numeric shorthands** (`items`, `justify`, `self`, `select`,
  `grow`, `shrink`, `text`) have no tokens because they take no tokens.
- **`gridRowGap`, `gridColumnGap`** look like space props and are not in the
  runtime space table, so the types correctly offer no tokens. Fixing these
  would have made the types claim something the runtime does not do.

### Reported, not fixed: the `content` collision

`content` is both a v6 shorthand (`content: 'alignContent'`,
`code/core/shorthands/src/v6.ts`) and a style prop
(`content?: Properties['content']`, `types.tsx`). The type layer resolves the
prop to the CSS `content` property (2 constituents, no `alignContent`
keywords), while `getSplitStyles.tsx:763-767` expands any key present in the
shorthand map unconditionally, so at runtime `content` always becomes
`alignContent` and the CSS property is unreachable through it.

Same family as `bg`: a shorthand remap the type layer does not reflect.

**Ruled (a2662): the CSS `content` style prop goes, `content` types as the
alignContent shorthand.** The type is advertising behavior that cannot happen,
which is the same lie as `bg` offering zero tokens, pointed the other way. CSS
`content` only does anything on `::before`/`::after`, which style props do not
target, so nothing real is lost. Beta is when to fix this, before people depend
on the broken shape.

The change is four lines, removing the declaration from `ExtraStyleProps`:

```ts
-  /**
-   * Web-only style property. Will be omitted on native.
-   */
-  content?: Properties['content']
```

Verified against the real type machinery without editing the contended file, by
shadowing the post-change type as `WithThemeValues<StackStyleBase>['alignContent']`:

| `content=""` | constituents | string literals | completions offered |
| --- | --- | --- | --- |
| today | 2 | 0 | **none at all** |
| after removal | 11 | 8 | `unset`, `flex-start`, `flex-end`, `center`, `stretch`, `space-between`, `space-around`, `space-evenly` |

For comparison the unshadowed sibling shorthands sit at `items` 6 literals and
`justify` 7, so 8 is the expected shape for `alignContent`.

Non-breaking, verified by compiling both sides: `content="center"` and
`content="space-between"` compile (and now autocomplete), and anything written
against the old CSS-content typing, `content="'hello'"` or
`content="url(x.png)"`, still compiles through `(string & {})`. Runtime
behavior does not change at all, because `getSplitStyles` already expanded the
shorthand unconditionally in every one of those cases.

Held, not landed: the beta candidate is frozen at `fa3f27be45` for the
conformance matrix, and `types.tsx` has three lanes in it. The patch is
generated against the frozen candidate and verified to apply cleanly both to it
and to the current working tree with the other two lanes' changes present. It
needs a `@tamagui/web` types rebuild when sequenced.

## The integration surface, if it were done anyway

Where a typed subset would attach, and what it touches:

- `code/core/tailwind/src/types.ts:163`, `TailwindStyleProps.className`.
  The single attachment point for tailwind mode.
- `code/core/tailwind/src/types.ts:180`, `TailwindVariantDefinitions`,
  whose matcher values are class strings, and `types.ts:184`
  `TailwindCompoundVariant.style`. Both must take the same type or a variant
  body gets less checking than a `className` prop, which is worse than neither.
  Narrowing that index signature from `string` to a union breaks assignability
  from any `Record<string, string>` built elsewhere, so it needs the same
  `| (string & {})` escape.
- `code/core/tailwind/src/styled.tsx:28`, `baseClassName: string`, same
  treatment.
- `code/core/web/src/types.tsx:2116`, `FlatStyleValue<T>` for Tamagui mode. It
  flows through `WithThemeValues` (`:2118`), `WithShorthands` (`:2149`),
  `WithPseudoProps`, `WithMediaProps`. Those are all value-preserving mapped
  types, so `(string & {})` survives them today.

The one hazard to watch in that chain is `Exclude<T[K], string>` at `:2124`. It
strips string members out of the platform value type, and it would strip a
literal candidate union to `never` if one were ever routed through `T[K]`
instead of alongside it.

`styled()` itself needs no change: variants, compound variants, and the parent
recovery types (`GetTailwindVariantProps`) are generic over the definitions
object and do not inspect the value type.

None of this needs codegen. The token unions already exist and are config-driven
through `TamaguiCustomConfig` augmentation, so the candidate union can be a
derived type in the tailwind package.

## Recommendation

**Leave `className` as `string`.** Every version of the typed subset costs real
tsc time on every usage site, and returns completions that are wrong the moment
a class string has two classes in it, which is nearly all of them. The design
record's call (`plans/dom-tailwind-flat-values.md`, "Types and editor tooling")
holds, and now it holds with numbers behind it. The vocabulary belongs to the
language service, which can scope its replacement span to the token under the
cursor, which is the one thing types cannot do.

**Spend the effort on the Tamagui-mode flat props instead.** That is where a
union genuinely works: values are frequently a single token, single tokens *hit*
the union fast path, and whole-literal replacement is the correct behavior for a
single-token value. Measured at 1,000 sites, two props per site:

| prop type | values | check |
| --- | --- | --- |
| token union only (today's shape) | single token | 0.07s |
| token union only | two clauses | 0.23s |
| token + `` `${State}:${Token}` `` | single clause | 0.19s |
| token + `` `${State}:${Token}` `` | two clauses | 0.50s |

So adding state-modifier clause forms to the color and space props costs about
0.22ms per prop instance and makes `bg="hover:color5"` complete correctly. That
is affordable and it is a real gain over today.

Two concrete follow-ups, in priority order:

1. **Approved (Nate, 2026-08-01).** Give `background` a color-aware value type
   so `bg` regains theme tokens (`ColorTokens | Properties['background']`,
   prototyped above). Users get less autocomplete for using the shorthand the
   docs recommend. It is worth more than anything else in this document and it
   measures free. The earlier veto covered clause subsets only, never this.
2. **Revised ruling (Nate, 2026-08-01): one modifier level is approved, but
   only if it covers every fixed prefix family at once.** The original
   color/space-only `` `${StateModifier}:${Token}` `` proposal was vetoed
   because it offered `hover:` and nothing else, which is not worth a compile
   cost. The shape that earns it spans state, media and platform together, so
   the list that appears is `hover:`, `sm:`, `web:` and their siblings rather
   than one family.

Sizing that, from the vocabulary table above: state 14 + media 14 + platform 7
= 35 fixed modifiers, against the 14 the measured prototype used. A color prop
goes from the measured 1,950 members to roughly 4,875. That is comfortably
inside TypeScript's 100,000-constituent limit, and it is **2.5x a union whose
cost was measured at 0.19s (single clause) and 0.50s (two clauses) per 1,000
sites**. Nobody has measured the 35-modifier form. Do that before shipping it:
union size and check time are not linearly related, and the two-clause row is
where this gets expensive.

Theme modifiers stay out. There are 294 of them, they are config-dependent
rather than registry-fixed, and folding them in takes a color prop to about
45,700 members. Group and container modifiers stay out for the reason they
always did: the name is user-chosen and unbounded.

Everything else in the original ruling stands. `className` remains `string`,
modifier chains (`dark:hover:sm:`) stay untyped, arbitrary values and opacity
suffixes still force `(string & {})`, and the language service still owns
token-scoped completion and validation, because a whole-literal replacement
span cannot do it.

## What would need to be true to revisit

A className union becomes worth it only if TypeScript gains token-scoped
replacement spans for string completions, or if the grammar drops to single-class
strings. Neither is on the table. Everything else in this document is a
consequence of those two facts.
