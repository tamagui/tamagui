# V3 static types: what can be typed, what it costs, what it must not be

Lane O1, 2026-07-31. Question from Nate: can at least some v3 types work
statically, for the statically-known subset of tailwind class strings and/or
Tamagui-mode flat value strings, with working autocomplete?

Answer in one line: **yes for single-value strings, no for class lists**, and
the reason is not type performance, it is that TypeScript string completions
replace the whole string literal.

Reproduce everything below from
`<session-scratch>/static-types/` (generators `vocab.gen.ts`,
`fixture.gen.ts`, `scaling.gen.ts`, `flat.gen.ts`, `validator.gen.ts`,
`realistic.gen.ts`; harnesses `measure.sh`, `tsserver-probe.mjs`,
`ls-probe.mjs`).

## The vocabulary, measured against the real default config

Generated from the actual `code/core/style-grammar/src/registry.ts` crossed with
`@tamagui/themes/v4`:

| set | size |
| --- | --- |
| whole-class utilities (`flex-1`, `italic`, …) | 94 |
| base candidates (whole + every prefix x its token category) | 3,842 |
| modifiers: state 14, media 14, platform 7, theme 294 | 329 |
| base x one modifier | 1,264,018 |

TypeScript's union limit is 100,000 constituents. One modifier level already
exceeds it 12x, and the grammar allows chains (`dark:hover:sm:`). Confirmed, not
estimated: the template-literal form of that cross product fails to compile.

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

Fable's "no measurable cost at 2,000 classes across 300 sites" is the
**matching** column above. Once the fixture uses realistic multi-class strings
the same union is 0.75ms/site, which at 300 sites is +0.22s on a 0.47s baseline.

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

`bg` returns csstype's CSS color keyword set (`Window`, `WindowFrame`,
`currentColor`) with no theme tokens, while its own longhand returns 950 tokens.
The space shorthand `p` is fine, so this is specific to the color chain, not to
shorthands in general. Neither prop validates: `<View bg="$nope-not-a-token" />`
and `<View backgroundColor="$nope-not-a-token" />` both typecheck today, which is
`(string & {})` working as designed.

Repro: `realistic/r3-core-today/` in the scratch dir.

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

1. Fix `bg` losing its 950 token completions while `backgroundColor` keeps them.
   Users get less autocomplete for using the shorthand the docs recommend. This
   is worth more than anything else in this document and costs nothing in type
   performance.
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
