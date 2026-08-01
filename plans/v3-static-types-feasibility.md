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

Neither prop validates: `<View bg="$nope-not-a-token" />` and
`<View backgroundColor="$nope-not-a-token" />` both typecheck today, which is
`(string & {})` working as designed.

### Why `bg` has no tokens

Not a bug in the shorthand chain. v6 deliberately remaps it:
`code/core/shorthands/src/v6.ts:10` is `bg: 'background'`, where v4 and v5 were
`bg: 'backgroundColor'`. That is the flat-value background family doing its job,
since `bg="url(x.png) $color1"` has to reach `backgroundImage` too.

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
token union is exercised, 1,000 `bg={'$token'}` sites:

| `bg` type | completions | of which tokens | tsc check |
| --- | --- | --- | --- |
| `Properties['background']` (today) | 216 | 0 | 0.46s |
| `ColorTokens \| Properties['background']` | **1,166** | **950** | **0.36s** |

It is free, and slightly faster: with the tokens in the union a `$token` value
now hits the literal-to-union fast path instead of scanning past
`Properties['background']`. `no-repeat center` and `url(x.png) $color1` both
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
- both arms survive in the entry list: `$color1`, `$background`, `no-repeat`,
  `center`, `round`, `repeat-x`, `border-box`, `transparent`, `currentColor`.
- `bg="no-repeat center"`, `bg="url(x.png) $color1"`, `bg="$color1"`,
  `bg="$color1 hover:$color5"`, `bg="linear-gradient(red, blue)"` and
  `bg="#ff0000"` all typecheck.
- `@tamagui/web` type tests 93 passed / no type errors, core-test web 475
  passed, core-test native 198 passed, style-grammar 403 passed.

No regression test was added on purpose. The failure mode is "the token arm
disappears from the union", and no assignability test can see that: with
`Properties['background']` carrying `(string & {})`, `expectTypeOf<'$color1'>()`
passes whether or not the tokens are there. A test that stays green when the
thing is broken is worse than none. Catching this needs constituent inspection
through the checker API, which is what `typeshape.mjs` in the scratch harness
does; promoting that into a vitest case is a real option if `ColorKeys` and the
web-only style props start moving.

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
0.22ms per prop instance and makes `bg="hover:$color5"` complete correctly. That
is affordable and it is a real gain over today.

Two concrete follow-ups, in priority order:

1. Give `background` a color-aware value type so `bg` regains theme tokens
   (`ColorTokens | Properties['background']`, prototyped above). Users get less
   autocomplete for using the shorthand the docs recommend. It is worth more
   than anything else in this document and it measures free.
2. If clause-level completion in Tamagui mode is wanted, add
   `` `${StateModifier}:${Token}` `` to the color and space categories only, and
   hold the line there. Media (14) and theme (294) modifiers multiply the same
   union again, and theme alone would take the color prop to 39,000 members,
   which is the 8MB payload region.

Neither of these is a className change, and neither needs codegen.

## What would need to be true to revisit

A className union becomes worth it only if TypeScript gains token-scoped
replacement spans for string completions, or if the grammar drops to single-class
strings. Neither is on the table. Everything else in this document is a
consequence of those two facts.
