# V3 type performance and the statically-typed string subset

Measured 2026-07-31 on air-24. Both results are reproducible; the harnesses are
described below so a later run can confirm or refute them.

## Method

One identical fixture compiled against each type surface: v2 is `main`
(`~/tamagui`), v3 is branch `v3-beta`. Both checkouts resolve `tamagui` to their
own package and both run TypeScript 5.9.3, so the compiler is not a variable.
Every fixture compiles with zero errors on both sides, runs are interleaved so
machine load lands on both equally, and timings are the median of 3.

Two fixture shapes were used deliberately, because a single shape would not
distinguish a real improvement from an artifact of one authoring style:

- **shape A**, `styled()` definitions with variants plus a usage site each;
- **shape B**, ordinary app code — JSX with many style props, no `styled()`.

## Result: v3 typechecks user code faster, in both shapes

Shape A, per component pair:

| components | v2 check | v3 check | v3 is |
|---|---|---|---|
| 10 | 0.25s | 0.18s | 1.39x faster |
| 25 | 0.43s | 0.29s | 1.48x faster |
| 50 | 0.80s | 0.44s | 1.82x faster |

Marginal cost per component pair falls from **15.4ms to 8.6ms**. The advantage
widens as the fixture grows, so it compounds with app size rather than being a
fixed startup win.

Shape B, per screen: 1.25x faster at 10 screens, 1.36x at 40.

Both shapes favour v3, so the win is real. It is not, however, the order of
magnitude that "we simplified the types a lot" might suggest — it is roughly
1.3x to 1.8x depending on what the code looks like.

## The mechanism is not fewer types

In shape A, v3 instantiations went **up** 26% (61,873 to 78,225 at 50
components) while check time fell 45%. In shape B they went **down** (5,050 to
4,388). So the simplification did not win by creating fewer types; it won by
making each one cheaper to evaluate.

The instantiation growth is therefore specific to the `styled()` / variants /
`GetProps` machinery rather than general to the type surface.

Tracing it further shows the headline is hiding a genuine regression.
Decomposed at 50 pairs: plain definitions cost 45,226 instantiations in v3 vs
17,160 in v2; definitions plus variants 59,328 vs 24,202; plus `GetProps`
65,113 vs 38,640. But JSX usage adds only 13,112 in v3 against 23,233 in v2.

So **v3 is more expensive per `styled()` definition and cheaper per JSX use**,
and because ordinary app code is JSX-heavy the cheaper side dominates the
totals. Marginal cost per styled pair at definition time is ~1,186
instantiations in v3 against ~481 in v2, a 2.47x regression that the canonical
total masks. It is linear rather than an imminent depth failure, but for a
component-definition-heavy codebase it is a real scaling risk, not benign.

The identified culprit is `GetStyledOptionsAcceptedProps`: an unresolved
`Context` conditional expands `InferStyledOptionsProps`. In a controlled
experiment over 100 `styled()` calls, replacing that conditional with
`InferStyledProps &` the existing `GetStyledContextProps` took instantiations
from 53,716 to 21,156 — a saving of 32,560. Per-declaration tracing agrees: on
a plain no-variant fixture the inner options object costs 75ms in v3 against
15ms in v2.

That fix is the first place to spend further type-performance effort.

Memory was too noisy to report (v2 166MB vs v3 207MB at 50 components, but v2
203MB vs v3 165MB at 25). That is GC timing, not a result.

## A note on `typecheck:perf`

The existing `typecheck:perf` test (`code/core/monorepo-test`) runs a whole-repo
typecheck normalized against a JS baseline. It is not the right instrument for a
v2-versus-v3 comparison, because v3 has packages v2 does not, so it partly
measures "there is more code now" rather than type cost. It remains useful as a
regression guard within a single branch.

## Statically-typed class strings: feasible, and it autocompletes

Today class strings and flat value strings are typed as plain `string`, so no
completions are possible. The question was whether the statically known subset
can be typed without breaking the open-ended form.

The shape that works is a literal union with an escape hatch:

```ts
type ClassProp = 'p-4' | 'bg-red-500' | /* ...known subset... */ | (string & {})
type WithModifier = `hover:${Known}` | `focus:${Known}` | (string & {})
```

Driving TypeScript's real `getCompletionsAtPosition` — the same API editors and
`tsserver` use, so this is evidence rather than inference:

| union size | completions offered | latency |
|---|---|---|
| 500 | 500 | 28ms |
| 2,000 | 2,000 | 34ms |
| 8,000 | 8,000 | 46ms |
| 20,000 | 20,000 | 75ms |

Template-literal modifier forms complete correctly too (`hover:` expands to
`hover:p-4` and friends), 40,000 entries at 87ms.

**It is non-breaking.** A string outside the union still typechecks with zero
diagnostics at every size, because of `(string & {})`. Existing code does not
have to change.

### Cost by union size

Full typecheck across 300 usage sites, against a plain `string` baseline of
473ms: 500-member union 393ms, 2,000 405ms (both inside the noise), 8,000 571ms,
20,000 953ms. So by size alone a curated subset in the low thousands is free and
the whole Tailwind space is what costs.

That framing turned out to be the wrong question.

### `className` autocomplete does not work, for a structural reason

The completions above are real but unusable for `className`, and the reason is
not performance. **A completion's `replacementSpan` covers the entire string
literal**, and no completion entry ever contains a space.

Verified directly: with the cursor after `bg-re` in `className='p-4 bg-re'`, the
service returns 3,842 entries whose replacement span is `{start, length: 9}` —
covering the whole of `p-4 bg-re`. Accepting `bg-red-500` therefore rewrites the
attribute to `"bg-red-500"` and silently deletes `p-4`.

Completing the second class of a list would require entries that are whole
lists, and those are not expressible: a two-class template is ~14.7M
constituents, and TypeScript raises TS2590 well before that — measured at
1.26M, where the type returns zero completions. The list-shaped
`` Base | `${Base} ${string}` `` returns only the finite arm, so it buys nothing.

Class lists are structurally unreachable from the type system. This is precisely
why Tailwind IntelliSense is a language-service extension rather than a set of
types.

There is also an editor-transport cost that the in-process measurement hides:
the numbers above are `getCompletionsAtPosition` called in-process. Over the
real tsserver round trip a 40,000-entry response is an 8.2MB payload taking
~880ms. At 3,842 entries it is 519KB and 13-25ms, which is fine.

One claim did not reproduce and is recorded as unsettled: that non-member
multi-class values miss the literal-to-union fast path and cost dramatically
more (reported 0.59s vs 10.50s at a 53,788 union). An independent run at 1,000
sites showed no such gap — 526ms for member values vs 506ms for multi-class at
3,842, and 1,255ms vs 1,358ms at 20,000. The disagreement is probably down to
template-literal arms in the union under test. It does not change the
conclusion, which rests on the replacement-span result.

### Conclusion: leave `className` as `string`, spend it on flat props

Tamagui-mode flat values are where this pays off, because those values are
frequently a *single* token, which does hit the union fast path. Measured at
1,000 sites with 2 props each: token union with single-token values 0.07s;
adding `` `${State}:${Token}` `` clause forms 0.19s. So making `bg="hover:$color5"`
complete costs roughly 0.22ms per prop instance. Stop before media and theme
modifiers — theme alone takes the color prop to about 39,000 members.

Attachment points, if this is built: tailwind mode has one,
`TailwindStyleProps.className` in `code/core/tailwind/src/types.ts`, and the
variant definitions beside it would have to move together or a variant body gets
weaker checking than a plain prop. Tamagui mode goes through
`FlatStyleValue<T>` in `code/core/web/src/types.tsx`, which is carried by
value-preserving mapped types, so the escape hatch survives them. The token
unions are already config-driven through `TamaguiCustomConfig` augmentation, so
the subset can be derived rather than code-generated.

Two hazards to respect: narrowing the variant-definition index signature from
`string` to a union breaks assignability from any `Record<string, string>` built
elsewhere and needs the same `| (string & {})` escape; and `Exclude<T[K], string>`
in the core chain would strip a literal union to `never` if a candidate union
were ever routed through `T[K]` instead of alongside it.

### A real autocomplete bug found on the way

With the v3 config, `backgroundColor=""` offers 1,101 completions including 950
tokens, but the `bg` shorthand offers 216 with **zero** tokens — it falls back to
csstype's CSS color keywords (`currentColor`, `Window`, `WindowFrame`). `p=""` is
fine at 501. So it is the color chain specifically, and users get worse
autocomplete for using the shorthand the docs recommend. Fixing it costs nothing
in type performance.

## Reproducing

Harnesses live in the session scratchpad rather than the repo, since they
generate fixtures into a checkout:

- `gen-typeperf.py <checkout> <n>` — shape A fixture
- `gen-typeperf2.py <checkout> <n>` — shape B fixture
- `measure-typeperf.py` — interleaved v2/v3 run, writes `typeperf-results.json`
- `autocomplete-probe.mjs <unionSize>` — completions via the LanguageService
- `static-types-cost.mjs` — typecheck cost by union size

One trap worth recording: the pre-push hook runs `oxfmt --check` over the whole
working tree including untracked files, so a generated fixture directory left in
a checkout will fail an unrelated push.
