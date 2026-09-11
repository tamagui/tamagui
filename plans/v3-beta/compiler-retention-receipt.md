# Compiler retention receipt

The three retention defects recorded in `plans/v3-compiler-retention-follow-ups.md`,
fixed and measured. Written 2026-09-01 on `v3-beta`.

## Result

The checked kitchen-sink flatten metric, measured as a clean A/B at one tree
(same worktree, same kitchen-sink corpus, only the compiler change toggled):

| | before | after |
| --- | --- | --- |
| candidates found | 2,979 | 2,979 |
| lowered | 2,108 | 2,136 |
| **flattened** | **2,094** | **2,126** (+32) |
| **bailed** | **871** (29.2%) | **843** (28.3%) (-28) |

By bailout reason, every row that moved:

| reason | before | after | delta |
| --- | --- | --- | --- |
| `local/dynamic-style-value: Style prop backgroundColor could not be safely extracted` | 10 | 1 | -9 |
| `local/dynamic-style-value: Style prop color could not be safely extracted` | 8 | 0 | -8 |
| `local/dynamic-style-value: Style prop bg could not be safely extracted` | 4 | 0 | -4 |
| `local/dynamic-style-value: Style prop bg could not be evaluated` | 3 | 0 | -3 |
| `local/dynamic-style-value: Style prop fontWeight could not be safely extracted` | 2 | 0 | -2 |
| `local/dynamic-style-value: Style prop color could not be evaluated` | 2 | 1 | -1 |
| `local/dynamic-style-value: Style prop borderColor could not be safely extracted` | 1 | 0 | -1 |
| `local/dynamic-style-value: Style prop size could not be safely extracted` | 1 | 0 | -1 |
| `local/unsupported-target: Theme boundary candidates remain on the runtime path` | 5 | 6 | +1 |

The other 835 bailouts are unchanged. The single `+1` is a hole this work
closed rather than opened: see "theme" below.

Structural classes: `dynamic value` 79 -> 50, `theme boundary` 5 -> 6,
everything else identical (`component runtime contract` 688, `animation
runtime` 35, `runtime event mapping` 22, `unevaluated spread` 8).

The metric is native-blind. Item 3 is a native-only change and contributes
nothing to these numbers; its evidence is the executable controls in
`code/compiler/static-tests/tests/nativeClausePrograms.native.test.tsx`.

### The numbers in the follow-ups doc are not the baseline

`v3-compiler-retention-follow-ups.md` cites 2,645 found / 2,128 flattened / 497
bailed, and the checked fixture matched that. Both were already stale before
this work: `b587feeccf` (on-demand component-package discovery) makes the
compiler find components it previously did not resolve, which moved candidates
found from 2,645 to 2,979 and `Button` retention from 211 to 534. That drift is
not measured here and is not this work's to explain; the A/B above brackets only
the compiler change, with the discovery rework held fixed on both sides.

`tests/fixtures/bailoutMetric.expected.json` is updated to the post-change
state, so it absorbs both. Four newly-discovered kitchen-sink components
(`FixtureField`, `FixtureFieldLabel`, `FixtureFieldDescription`,
`FixtureFieldError`, all `styled(Field.*)`) needed justifications in the
metric's `structurallyRetainedComponents` map before the test could classify
them; with those added, RECOVERABLE is 34 on both sides of the A/B, the same
value it had before the discovery rework.

## 1. False-valued special props

`asChild`, `disableOptimization` and `themeInverse` each asked whether the prop
was PRESENT. `asChild={false}` requests no Slot, `disableOptimization={false}`
opts out of nothing, and `themeInverse={false}` opens no boundary, so all three
retained a component for behavior nobody asked for.

The rule now reads the materialized value. A prop is active when its value is
truthy, or when any entry for that name is one the compiler could not evaluate
(a later duplicate wins, so the last entry decides and any unevaluated entry
makes the answer unknown). The same read covers a statically materialized
spread, because the value comes out of the merged prop set rather than the
entry list.

An inert value has to leave the element as well: `createComponent` consumes
these props and never forwards them, so a flattened `<div>` would otherwise
carry an unknown attribute. They join the ignored-prop set the emit path
already uses for style props, and drop from both direct props and spreads.

`theme` keeps presence semantics — any theme name selects a theme — but now
also retains when its value is dynamic. That was a hole: the branch only
consulted statically materialized props, so `<View theme={name}>` flattened and
silently dropped the boundary. Closing it is the `+1` theme-boundary bailout
above.

Controls: `tests/e3-lowerer.web.test.ts`, "component-only props read their
value, not their presence" — each prop's inert value flattens and its active
value retains, the same keys inside a materialized spread do the same, a
duplicate makes the last value decide, and an unevaluated value retains for all
four names.

## 2. Opaque dynamic style values

**There is no safe inline-style rule for a genuinely opaque value, and the
corpus barely contains one.**

Why no rule: on web every string style value goes through the config value
grammar before it reaches CSS — token and theme lookup, safe-area variables,
embedded tokens, the `/NN` opacity modifier. Numbers skip it entirely and get
`px` appended per property. So the resolved value depends on the value's
runtime type and content, which is exactly what an opaque expression withholds.
The control is in `tests/e3-lowerer.web.test.ts`, "an unproven value stays on
the runtime path because the grammar is not identity": the same authored
`backgroundColor` resolves to `var(...)` for `"$color"` and to a literal for
`"rgb(1,2,3)"`, so no single emission of the raw expression can be right for
both, and `backgroundColor={color}` correctly keeps its component while its
static siblings still lower to classes.

What the evidence did support: almost every real bailout in this class was not
opaque at all. Every one of the 29 recovered sat on an element whose blocking
value was a template literal wrapping a static branch program —
`` backgroundColor={`${active ? 'red10' : 'blue10'}`} `` and
`` bg={`${open ? 'color4' : 'color3'} hover:color4`} `` are the two shapes that
dominate kitchen-sink, and the bare-ternary siblings beside them (a
`fontWeight={isActive ? '700' : '400'}` on the same element) were held back with
them. The branch evaluator did not look inside template literals, so a two-value
program read as an unknown value.

The rule now: a template literal is a decision tree once every value it
interpolates is one. Each interpolation is evaluated exactly, or distributed as
a branch tree whose leaves are folded back into the surrounding quasis, and
each step spends a level of the existing depth budget so a wide template refuses
instead of expanding. A leaf whose value is `undefined` is refused: in this IR
that marks the falsy left operand of `&&`, whose string form is the operand
itself.

Nothing downstream is new — the leaves reach the per-branch web class lowering
and the per-branch native style lowering that already existed for a bare
ternary, so duplicate-prop order and the retained/atomic winner are the ones
those paths already prove. Controls: a template-wrapped ternary produces
byte-identical output and identical CSS to the ternary it wraps (including with
quasis around the hole, where `` `${a?'x':'y'} hover:green` `` matches
`a ? 'x hover:green' : 'y hover:green'`); two holes in one value multiply into a
four-leaf tree; a spread authored after the program wins and leaves both
branches empty, while a spread authored before it never reaches the element.

Residue, all of it genuinely unproven or structural: `width={containerWidth}`,
`left={p + 20}` (`+` on an unproven operand can concatenate), `x={positions[index]}`
(transform family, which owns no same-named CSS property), and four
`` `${flag ? 'color8' : undefined}` `` sites whose falsy leaf is not a value the
compiler may stringify.

## 3. Native clause programs

The blanket rule was: any flat-clause value anywhere on a native candidate
retains, because resolving one in the compiler would freeze the build machine's
state into the bundle. That is right for every clause kind but one.

A native bundle knows exactly one thing about its platform: it is not web. So
`web:` can never match there and a bare `native:` always does — `platformMatches`
answers those two from `isWeb` alone, with no device input. Every other modifier
is live at render: media and container queries measure, theme and group clauses
read context, state and lifecycle clauses track the component, and the device
platforms (`ios`, `android`, `tv`, `tvos`, `androidtv`) are not known until the
bundle runs.

The compiler now classifies each clause value against the modifier registry
rather than resolving it through the runtime. A value folds when every clause is
either a chain naming `web` (dead here whatever else it names) or exactly
`native:` (always matched). Platform clauses all rank the same, so the last
matching one wins and any of them beats the unconditional base; a value whose
only clause is dead contributes no style at all. Anything else keeps the
element, with the message unchanged.

The reduction is applied to the merged call-site props and, identically, inside
the per-branch props a conditional builds. That second half is also a
correctness fix: a conditional leaf is a clause program too, and the per-branch
path resolved leaves through the full pipeline without ever consulting the
clause guard, so `` backgroundColor={`${a ? 'red' : 'blue'} hover:green`} `` on
native would have baked the build machine's hover state into every branch. It
now retains.

Still retained, deliberately: a clause written in the styled definition's base
style or in a variant definition, because this element cannot rewrite the
definition it inherits; and the structured clause-object form, whose ordering
semantics this change does not establish.

Controls, one per subset, in
`tests/nativeClausePrograms.native.test.tsx`: `"red web:blue"` compiles to the
same native style as `"red"`, `"red native:blue"` to the same as `"blue"`,
`"red web:hover:blue"` to the same as `"red"`, `"web:blue"` to the same as no
prop at all, `"red native:blue native:green"` to the same as `"green"`, and the
same reduction inside every branch of a conditional element. Twelve live values
— two pseudo states, both lifecycle clauses, media, theme, group, container,
three device platforms, and a live modifier chained onto a static one — each
keep the element byte-identical, as does a clause inside a styled definition.

## Reproducing

```sh
cd code/compiler/static && bun run build
cd ../static-tests && bun run test:bailout-metric
```
