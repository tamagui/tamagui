# v3 clause merge + precedence spec

Status: decided design, ready to implement. Decisions were made by Nate on
2026-08-08 after an empirical Tailwind 4.3.3 probe. Measured evidence lives in
`plans/v3-precedence-tailwind-probe.md` (repro scripts `plans/probe.mjs`,
`plans/twmerge.mjs`). Where this spec deviates from measured Tailwind it says
so explicitly; do not "fix" a deviation to match Tailwind without flagging it.

## The two decisions

### 1. Merge unit is the clause: (property, normalized condition set)

A flat value program like `bg="red sm:blue hover:green"` is a set of clauses
per property. Merging at every layer (styled() defaults -> variants -> props ->
frontend program contributions) replaces per clause slot, never per property:

- Styled `flexDirection="row"` plus a passed `flexDirection="sm:column"` yields
  base `row` + sm `column`. The base persists until another BASE clause
  replaces it. An `XStack` given `sm:column` is still a row below sm. This was
  the missing case that broke the site work; fix it in the shared merge layer,
  never by adding explicit base values at call sites.
- Within one program, a later clause with the same condition set replaces the
  earlier one (`sm:blue sm:green` -> sm is green).
- Condition sets are order-normalized: `dark:sm:` and `sm:dark:` are the SAME
  slot. Measured: Tailwind emits distinct selectors but identical behavior, and
  tailwind-merge 3.6.0 normalizes reordered stacks to one conflict key
  (`twMerge('sm:hover:bg-red-500', 'hover:sm:bg-blue-500')` ->
  `'hover:sm:bg-blue-500'`).
- Plain function components (`<View bg="red" {...props} />`) replace whole
  props by JS semantics. That is out of scope here and intentional; a
  `styleMerge(a, b)` string helper (twMerge equivalent for our syntax) is a
  separate follow-up.

### 2. Precedence across simultaneously active clauses is one fixed sort key

Authoring order NEVER decides precedence across different condition sets (it
only decides last-wins within the same set). No config escape hatch, no
mediaPropOrder equivalent. One rule for everyone, so intuition and LLM output
transfer between projects.

The sort key, compared in order (later-sorting clause wins):

```
(platformRank, depth, categoryRank, withinCategoryRank)
```

1. **platformRank** (outermost, dominates everything): 0 = no platform
   condition; otherwise the existing `grammarPlatformRank` over the clause's
   platform conditions: `native`/`web` = 1, `ios`/`android`/`tv` = 2,
   `tvos`/`androidtv` = 3. Rationale (Nate): "if you're saying native you're
   almost always gonna want to override anything that's not native". So
   `native:x` beats `sm:hover:y` on native, and `ios:x` beats `native:y` on
   iOS. Platform conditions are mutually exclusive at runtime (you are exactly
   one platform), so platform clauses never conflict with each other except
   through the containment groups (`grammarPlatformGroups`), which this rank
   already resolves. On the wrong platform a platform clause is simply
   inactive (and the compiler can drop it per build target).
2. **depth**: the count of non-platform conditions. Deeper wins. `sm:dark:`
   beats any single-condition clause; `sm:dark:hover:` beats `sm:dark:`.
   "More targeted wins" is the rule people already believe CSS has.
3. **categoryRank** breaks depth ties, low to high:
   `media < container < theme < group < state`.
   - media lowest (measured: `dark:` beats `sm:` in both Tailwind dark
     strategies, so theme sits above media).
   - container just above media: a container query is the same shape as media
     but more local, and local beats global.
   - group (ancestor state, `group-hover` etc.) below own state: your own
     hover is more targeted than an ancestor's.
   - state highest (measured: `hover:` beats `dark:` in Tailwind via pseudo
     specificity).
4. **withinCategoryRank**:
   - media: declaration order in the config, later wins. The v6 default config
     is the opinionated one, mobile-first ascending (`sm < md < lg ...`), so in
     practice everyone shares Tailwind's "later breakpoint wins". Measured
     sanity cell: `sm:blue md:green` at md -> green. Same rule for container
     sizes (they derive from the same media keys, see
     `createGrammarConfigView`).
   - theme: a more specific (nested) theme name beats its parent:
     `dark_blue:` beats `dark:`. Sibling themes are mutually exclusive so they
     never tie.
   - state: fixed lifecycle order from the `states.ts` vocabulary, later in
     lifecycle wins: `hover < focusWithin < focus < focusVisible < press`, and
     the component-tier states after interaction states in their table order.
     Measured Tailwind agreement: hover < focus < active(press), later wins on
     tie.
   - group states: same order as states, applied to the group's state.
   - Ties that remain identical after all four keys are the same slot by
     definition (normalized set equality), so last-wins already handled them.

### Named deviation from Tailwind (intentional, keep it)

Tailwind gives a depth-1 STATE clause victory over a depth-2 non-state clause
(`hover:` beats `sm:dark:`) because `:hover` happens to carry CSS specificity
while media/`:where()`-dark carry none. That is an accident of its emission,
not a design. We give it to the deeper clause: `sm:dark:` beats `hover:`.
Every other measured cell agrees between this spec and Tailwind 4.3.3.

Second, smaller deviation: Tailwind has no platform concept; platformRank
dominating depth is ours alone.

## Where it goes in the code

Single source of truth in `@tamagui/style-grammar`
(`code/core/style-grammar/src/`), consumed identically by the runtime driver,
native, SSR, and the compiler. The pieces that exist today:

- `valueTypes.ts` has `ModifierKind = state | theme | media | platform |
  group | container`.
- `config.ts` has `grammarPlatformRank` + `grammarPlatformGroups` (keep,
  becomes key 1).
- `code/core/web/src/helpers/directStyle.ts` already computes a
  `specificity` / `specificityGroup` pair for platform clauses
  (~lines 52, 268-390, 814-818) with a Math.max-and-compare mechanism. This is
  the partial version of this spec: generalize it to the full 4-part key
  rather than adding a second mechanism beside it. One comparator function
  exported from style-grammar; both directStyle and the compiler import it.
  Delete the platform-only path once the general one covers it.
- The clause-defaults merge for styled() lives in
  `code/core/web/src/helpers/getSplitStyles.tsx` (`styledClauseDefaults`,
  ~lines 134-160) with the forward-pass contribution channel in
  `frontendProgram.ts` / `contributeFrontendValue`. The base-persistence bug
  fix lands here.

### Compiled CSS emission (web)

The sort key must be reproducible by static CSS with fully shared atomic
rules, no per-usage selectors:

- Emission order of rules = ascending sort key. That alone resolves every
  equal-specificity comparison (Tailwind's own mechanism).
- Depth must dominate emission order, so encode depth as CSS specificity:
  target selector specificity = `(0, 1 + depth, 0)`. Pseudo-class states
  contribute their level naturally (`.x:hover` is already (0,2,0)); media,
  container, and theme wrappers contribute zero, so pad by repeating the
  atomic class (`.x.x`) until the target is met. Scope theme/group ancestors
  with `:where(...)` so they always contribute zero and padding stays exact.
  The pad depends only on the clause itself, never the usage site, so atomic
  sharing is preserved and there is no selector growth beyond the repeated
  class text.
- platformRank: the compiler knows the build target, so clauses for inactive
  platforms are dropped and never emitted. Surviving platform clauses must
  still dominate every non-platform clause regardless of depth, so their
  specificity needs a floor above the deepest non-platform clause. The
  straightforward encoding is extra class repetitions:
  `1 + depth + platformRank * (maxDepth + 1)` total class levels, where
  maxDepth is the largest non-platform depth the emitter allows. Assert the
  encoding with the parity fixture below and document it where implemented.

### Runtime driver + native

Sort active clauses per property with the shared comparator; apply the last.
No CSS involved, so this side is trivial; the risk is drift, which the shared
fixture kills.

## Fixture table (write this FIRST)

One table module in `code/core/core-test/` feeding all of:
`flatValuePrograms.web.test.tsx`, `flatValuePrograms.native.test.tsx`,
`flatValueProgramsSSR.web.test.tsx`, and a compiler snapshot test asserting
emitted CSS order + selector specificity. Each cell: program string(s), layer
setup (styled defaults vs props), active conditions, expected winning value.
Runtime web, native, SSR, and compiled must all pass the SAME table; parity is
tested, not assumed.

Required named cells:

| # | cell | expect |
|---|---|---|
| 1 | styled `row` + prop `sm:column`, below sm | row (base persists) |
| 2 | same, at sm | column |
| 3 | `red sm:blue sm:green` at sm | green (same-slot last wins) |
| 4 | `sm:blue md:green` at md | green (media declaration order) |
| 5 | `sm:blue dark:green`, sm + dark active | green (theme > media) |
| 6 | `sm:hover:blue md:green`, md + hover | blue (depth > media order) |
| 7 | `sm:dark:blue md:green`, md + dark | blue (depth) |
| 8 | `hover:green sm:dark:blue`, all active | blue (DEVIATION: depth beats state) |
| 9 | `dark:sm:blue` vs `sm:dark:blue` | same slot; later replaces earlier |
| 10 | `blue native:red`, on native / on web | red / blue |
| 11 | `native:red ios:green`, on iOS | green (platform rank) |
| 12 | `native:red sm:hover:blue`, native + sm + hover | red (platform dominates depth) |
| 13 | `dark:blue dark_blue:red`, dark_blue theme active | red (nested theme wins) |
| 14 | `@sm:blue sm:red`, both active | blue (container > media) |
| 15 | `group-hover:blue hover:red`, both active | red (own state > group) |
| 16 | every cell above with program token order reversed | identical winners |

Cells 8, 12, 13, 14 are decisions, not Tailwind mirrors; if implementation
finds a real problem with one, raise it to Nate instead of silently changing
the expectation.

## Validation gates before calling it done

1. Fixture table green on all four surfaces (web, native, SSR, compiled).
2. `bun run build` in changed packages (or root `bun run watch` running),
   typecheck clean.
3. Existing `flatValuePrograms*` and `evaluateProgram`/`mergeFlatValues`
   grammar tests green (`code/core/style-grammar/src/__tests__`).
4. The site regression that started this (styled base disappearing under a
   conditioned override) re-checked in kitchen-sink or the site.
5. Grep for the old platform-only specificity path; it must be gone, not
   coexisting (one mechanism, not two).

## Explicitly out of scope

- `styleMerge` public helper for function-component authors (follow-up).
- Any per-project precedence configuration (rejected by design).
- Changing JSX spread semantics for plain components.
