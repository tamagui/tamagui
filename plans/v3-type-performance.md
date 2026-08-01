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
`GetProps` machinery rather than general to the type surface. That is where any
further type-performance work should be aimed.

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

### The cost envelope, which decides the design

Full typecheck across 300 usage sites, against a plain `string` baseline of
473ms:

| union size | check time | vs baseline |
|---|---|---|
| 500 | 393ms | no measurable cost |
| 2,000 | 405ms | no measurable cost |
| 8,000 | 571ms | +21% |
| 20,000 | 953ms | +101% |

So a curated subset in the low thousands is free, and enumerating the entire
Tailwind space is what costs — it would roughly double typecheck time and hand
back the win recorded above. The design conclusion is to type a bounded,
generated subset rather than the whole space.

What is still open: which props take the typed subset, how the subset is
generated from the user's config instead of hardcoded, whether Tamagui-mode flat
value strings can use the same mechanism for their known keyword and token
values, and what the existing `styled()`/variants type machinery does when
`string` becomes a union there.

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
