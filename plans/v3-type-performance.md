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

The culprit was `GetStyledOptionsAcceptedProps`: an unresolved `Context`
conditional expanding `InferStyledOptionsProps`.

### That regression is now fixed

Landed as `23ce3c0729` on `v3-beta`: `InferStyledOptionsProps` and the
unresolved conditional are deleted, and `StyledOptions` uses
`Partial<InferStyledProps>` plus the existing exact `GetStyledContextProps`
path.

Independently re-measured at 50 component pairs, v2 against v3 after the fix:

| | v2 | v3 before | v3 after |
|---|---|---|---|
| instantiations | 61,873 | 78,225 | **53,617** |
| types | 12,590 | 12,509 | **10,265** |
| check time | 0.74s | — | **0.41s** |

So v3 now sits **13.3% below v2 on instantiations** rather than 26% above, and
18% below on types. The definition-time regression is gone, and v3 is better
than v2 on every counter as well as on wall clock.

Two honest caveats. Wall-clock check time did not move measurably — the ratio
stays about 1.8x before and after — so this fix removed a *scaling risk* for
component-definition-heavy codebases rather than making the common case faster.
And per-declaration tracing does show real work removed: the cold options object
falls from 67ms to 23ms and the first `styled()` declaration from 92ms to 61ms.

Correctness was checked beyond counters: a downstream compile against the built
declarations exercised context defaults, inherited context props, overlapping
size/color, variants, JSX, and `@ts-expect-error` invalid values, with no
unexpected errors.

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

### The cost gap is real but shape-dependent

Two measurements initially disagreed about whether values that are *not* members
of the union cost dramatically more. Both were right; the variable is the
syntactic shape of the usage site. Holding the union (53,788) and the strings
fixed and varying only the shape, 1,000 sites:

| shape | member | non-member |
|---|---|---|
| `const x: ClassName = '…'` | 0.08s | 4.14s |
| `Box({ className: '…' })` | 2.46s | 6.45s |
| `<View className={'…'} />` | 0.54s | 10.76s |
| `<View className="…" />` | 2.80s | 12.50s |

Two things follow. The trigger is **non-membership, not multi-token-ness** — a
single unknown token costs the same as a three-class string. And **JSX
attributes are by far the worst shape**, which is exactly how `className` is
written in practice. A call-argument shape at a 3,842 union shows no gap at all
(which is why one harness saw none); the gap turns on above roughly 20,000
there, but is already present at 3,842 in JSX.

A harness trap worth recording: running this from the repo worktree makes
`ts.createCompilerHost` pull the repo's `@types/**` into every program, which
inflates the baseline to ~4.5s with 124 unrelated errors and destroys the
signal. `types: []` is mandatory.

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

Read straight off `checker.getContextualType` at the JSX attribute:
`<View backgroundColor="">` offers 1,112 constituents with 1,101 string
literals, `<Text color="">` the same — but `<View bg="">` offers 220 with
**zero tokens**, returning `Properties['background']` CSS keywords like
`currentColor` and `WindowFrame`. Users get worse autocomplete for using the
shorthand the docs recommend.

The cause is not the color chain. V6 deliberately remaps the shorthand:
`code/core/shorthands/src/v6.ts` has `bg: 'background'` where V4/V5 had
`bg: 'backgroundColor'`, which is correct — the flat-value background family
needs `bg="url(x.png) $color1"` to reach `backgroundImage`. What is missing is
that `background` never got a theme-aware value type to match the remap. It is
`background?: Properties['background']` in `ExtraStyleProps`
(`code/core/web/src/types.tsx`), and `'background'` is absent from `ColorKeys`,
so `ThemeValueGet<'background'>` is `never` and `WithThemeValues` takes the
no-theme branch.

**Fixed and landed as `53fe77bd9a`** (source plus rebuilt declarations), in
`ExtraStyleProps`:

```ts
background?: ColorTokens | Properties['background']
```

Measured against the real config over 1,000 `bg={'$token'}` sites: 216
completions with 0 tokens becomes 1,166 with 950, and check time *drops* from
0.46s to 0.36s — with tokens in the union a `$token` value hits the
literal-to-union fast path instead of scanning past `Properties['background']`.
`no-repeat center`, `url(x.png) $color1`, `$color1 hover:$color5`,
`linear-gradient(red, blue)` and `#ff0000` all still typecheck. Gates after the
change: web type tests 93, core-test web 475, native 198, grammar 403.

Two traps that shaped the fix, and that any future change here must respect. Do
**not** add `'background'` to
`ColorKeys`: that routes it through `GetThemeValueForKey`, whose
`Exclude<T[K], string>` erases the CSS shorthand arm, trading the
position/repeat keywords away to get the tokens. And `ColorTokens |
ThemeValueFallbackColor` written directly into a prop type collapses to one
non-union constituent and returns zero completions — the real props are fine
because they compose it inside `WithThemeValues`, but that alias must never be
hand-written into a prop type.

Two earlier claims are retracted: `color`, `width` and `borderRadius` are not
broken. `width` and `borderRadius` are simply not props under V6's
`onlyAllowShorthands`, and `color` on `Text` is healthy at 1,101.

### A related type/runtime gap, fixed

`TransitionProp` admitted only `TransitionKeys` — the union of *configured
driver preset names* — while the runtime deliberately accepts raw CSS
transition strings, which is the headline V3 transition feature. The public
type was strictly narrower than the runtime. Landed as `a1e2671de6`:
`TransitionValue = TransitionKeys | (string & {})`, so `transition="200ms"` and
`transition="200ms hover:400ms"` typecheck while preset names stay in
autocomplete. Note that in an unaugmented config `TransitionKeys` already
widens to `string`, so this only bites where a real config narrows it — I did
not reproduce the originally reported TS2322, and the change is recorded as
making the runtime contract explicit rather than as fixing a reproduced failure.

## Modifier-clause template arms: measured, and the answer is a cliff

Measured 2026-08-11 (TS 5.9.3, real vocab: 37 modifiers = 29 media + 8 states,
space = 55 tokens, radius = 13). Question: can `p="4 gtMd:2"` complete from
types alone — base value plus prefixed clauses, one ordering, limited depth —
instead of the language-service plugin? Harness: `flat-prefix-probe.mjs` /
`flat-finite-probe.mjs` (session-local, same method as above: real
`getCompletionsAtPosition`, JSX attribute shape, `types: []`).

Three shapes, three verdicts:

- **Open-payload patterns complete nothing.** `` `${Mod}:${string}` `` and
  `` `${Tok} ${Mod}:${string}` `` produce ZERO completion entries at every
  cursor position — TypeScript does not offer partial-prefix entries from
  template arms containing `${string}` holes. "Type the prefixes with a generic
  string" is therefore a checking tool only, and checking requires dropping
  `(string & {})`, which the open-ended flat grammar cannot afford.
- **Finite expansion works below a size cliff, and the className deletion
  hazard does NOT apply.** Entries are whole strings (`4 gtMd:2`), so accepting
  one after typing `4 gtMd:` preserves the base — unlike className lists, the
  clause space is small enough to enumerate. Radius scale (13×37×13 = 6,747
  entries): correct filtered completions at every stage, 0.9MB payload,
  ~50ms, no TS2590, zero added check cost over 400 JSX sites.
- **Real space scale is over the cliff.** 55×37×55 ≈ 112k members hits TS2590
  and — worse — returns zero completions, deleting even the base-token
  completions that work today. Trimming to state modifiers only (55×8×55 =
  24,695) stays legal but is a 3.5MB tsserver payload per keystroke. Color
  (~1,100 members) is out by orders of magnitude.

So finite arms are viable only where `tok × mod × tok` stays under roughly
10-20k — radius and zIndex qualify; space, size, and color, the props
modifiers are actually used with, do not. A per-prop split (typed clauses on
`rounded`, none on `p`/`bg`) would ship inconsistent autocomplete and was
rejected.

Conclusion: the vocabulary lives in one place — the language-service plugin —
and the setup pain should be attacked at distribution instead (a VS Code
extension contributing `typescriptServerPlugins` loads the plugin into the
bundled tsserver with zero per-project config, the styled-components /
Tailwind model).

### Real editor graph rejects expanded clause hints

Follow-up measured 2026-08-12 against `HeroContainer.tsx` with VS Code's bundled
TypeScript 6.0 server. The isolated fixtures above did not predict the cost of
building JSX prop completions through the real `YStack` type graph. Expanding a
second modifier and finite payloads produced 1,221 `margin` completion entries;
value completion took 3.6 seconds initially and another 3.4 and 2.9 seconds
after successive keystrokes. In VS Code, prop-name completion also returned to
Loading after each character and took about 20 seconds on the active project.

The public type was first reduced to only the first modifier prefix
(``${Modifier}:``). A real tsserver probe at the JSX prop-name cursor then took
191 ms after `m` and 163 ms after `ma`. The value cursor took 98 to 178 ms and
returned 90 entries instead of 1,221.

A narrower follow-up tested only the common second position:
``${FiniteBase} ${Modifier}:``. A direct completion request looked tolerable,
but the real VS Code server stayed at 100 percent CPU rebuilding the contextual
component prop type after edits. The editor repeatedly showed Loading for about
15 seconds, including while typing prop names. The public type therefore keeps
only the first modifier prefix. The language-service plugin owns every position
after a base value. The V5 compatibility declaration fix remains because it
correctly restores the finite `tokens.space` keys without creating clause
cross-products.

When the language-service plugin is loaded, it is authoritative for Tamagui
string values and does not first request TypeScript's expanded base list. It
returns the correctly ranged `sm:` item after a base value. It marks the result
incomplete so VS Code requests the next prefix instead of dismissing the popup
after the zero-length whitespace range. Payload and chained-modifier completion
also belong only to the plugin.
Any future type expansion must be measured at both the prop-name and value
cursors in the real component graph.

## Reproducing

The one harness that guards a live invariant is **committed**, because a tool
that only exists in a session scratchpad cannot guard anything after that
session ends:

- `scripts/inspect-style-prop-types.mjs` — asks the checker what a style prop's
  contextual type actually *contains*, so it can see the token arm silently
  dropping out (landed `ff93f527ef`, hardened `3d3a65c7f9`). Run it as
  `node scripts/inspect-style-prop-types.mjs <probe.tsx> bg,backgroundColor
  --expect-tokens`. Exit 0 passes, 1 is a real token regression, 2 is a usage
  error, 3 means the probe itself is unusable and the run proves nothing.
  **The probe file must import the app's tamagui config** — without it every
  prop reads as zero tokens and the output would otherwise look exactly like
  the regression it exists to catch.

The measurement harnesses were session-local and generate fixtures into a
checkout: `gen-typeperf.py` / `gen-typeperf2.py` (fixture shapes A and B),
`measure-typeperf.py` (interleaved v2/v3 run), `autocomplete-probe.mjs`
(completions via the LanguageService), `static-types-cost.mjs` (cost by union
size).

Two traps worth recording. The pre-push hook runs `oxfmt --check` over the whole
working tree including untracked files, so a generated fixture directory left in
a checkout fails an unrelated push. And running a measurement harness from
inside the worktree makes `ts.createCompilerHost` pull the repo's `@types/**`
into every program, inflating the baseline and destroying the signal — `types:
[]` is mandatory.
