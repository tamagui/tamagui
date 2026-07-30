# Flat-values codemod

Converts existing Tamagui style syntax to V3 flat property values and reports what
it cannot convert. It writes a Markdown report (and optionally JSON), and never
touches the source files it scans or the config it talks about.

```sh
cd code/core/codemod-flat-values
bun run dry-run                              # the default corpus
bun run dry-run --report /tmp/report.md path/to/src another/file.tsx
bun run dry-run --json /tmp/report.json      # machine readable, used by the tests
bun src/index.ts --help
```

The default corpus is `code/kitchen-sink/src/usecases` plus the canonical
`Button.tsx` skin, which is also the acceptance fixture: 1775 conversion sites, 320
converted, 1435 waiting on runtime support, 20 flagged.

## What it converts

A conversion site is one style object: a JSX attribute list, a `styled()` config, or
a single variant branch. Everything comes from `@tamagui/style-grammar` — the value
parser, the legacy condition converter, the clause merge, and the property/unit
tables — so a converted program is spelled exactly the way the runtime and the
compiler read it back.

- Condition objects become clauses on the longhand's program:
  `bg="$surface" hoverStyle={{ bg: '$surfaceHover' }}` becomes
  `bg="surface hover:surfaceHover"`.
- v1 platform conditions (`$web`, `$ios`, …) become platform modifiers, and v1
  camelCase media keys resolve to their V6 kebab-case names. Token names are emitted
  verbatim: no shipped config has kebab-case built-in token names yet.
- Group conditions split the way V3 splits them: `$group-card-hover` becomes
  `group-hover/card:`, and a container size (`$group-card-maxMd`) becomes
  `@max-md/card:` plus `container containerName="card"` on the element that declares
  the group.
- A base value only folds into a program when a clause would otherwise need a second
  attribute of the same name. `opacity={0.5}` plus `enterStyle={{ opacity: 0 }}`
  becomes `opacity="0.5 enter:0"`, while a numeric or dynamic value nothing conditions
  on is left exactly as authored.
- A dynamic value converts when its units and token spellings are provable: a tree of
  literals is rewritten in place (`active ? '$red10' : '$blue10'`), and an expression
  whose type the checker can prove interpolates into the program
  (`` backgroundColor={`${GREEN} disabled:${GREY}`} ``).
- Variant and compound-variant branches convert as their own style objects, so a
  branch contributes at its own position in the forward pass. No base is invented for
  a condition-only branch: with clause-level merge (decision 21)
  `exitStyle={{ x: 10 }}` is exactly `x="exit:10px"`, which keeps whatever base the
  styled component, variant, or call site defined — the same thing the v1 prop did.

Every program the report suggests is parsed back with the real value parser and merged
with the real clause merge before it is printed. A program that does not read back
identically is reported (`emitted-program-mismatch`, `emitted-value-invalid`) instead
of suggested.

Ordering is never traded for a bigger diff. A program merges only when every
contribution still beats and loses to the same things it did, so an opaque spread or
an unconverted condition object between two contributions leaves the later ones
authored (`condition-order-not-preservable`, `base-order-not-preservable`).

## What it will not convert yet

**A `$token` only loses its `$` when its program has at least one clause.** That is
exactly the condition under which the value reaches the flat engine and resolves
config-first: `contributePrograms` returns early when a value has no clauses, and the
legacy resolver only resolves `$`-prefixed strings. Stripping a clause-free `p="$4"`
to `p="4"` today produces `padding-top: 4` on web (invalid, dropped) and
`paddingTop: "4"` on native (a string). Those values stay authored and are counted
under `clause-free-token`; they convert in one more pass once config-first resolution
covers the clause-free path.

`containerName` does not reach the host yet, so the named container query this
migration emits (`@max-md/card:`) has nothing to match. Those sites carry
`container-name-not-wired`.

For the same reason this tool has no apply/write mode. Applying today's output would
require both of the above, plus same-key clause merge across `mergeComponentProps`
(a call-site `bg="red"` currently replaces a styled `bg: 'gray hover:blue'` whole,
which decision 21 says it must not).

Values belonging to another migration are listed separately and left untouched:
`legacy-transition-value` (the v1 animation config shapes), `structured-native-value`
(`shadowOffset`, raw `transform` arrays), and `dynamic-string-value` (an open string
type that could still hold a `$token` at runtime, which only a human can confirm).

## Flag codes

A flag means a human decides. Every code the tool can emit:

| code | meaning |
| --- | --- |
| `legacy-token-dot-path` | `$1.5` and friends need one flat token name |
| `legacy-token-name` | a `$` that names no token |
| `legacy-token-constant` | the token lives in a module constant (`const RADIUS = '$6'`), so the constant is what migrates |
| `value-reparses-as-program` | the converted string would read back as something other than one base value |
| `legacy-group-presence` | `$group-card` with no state or size styles every descendant unconditionally and has no flat spelling |
| `unknown-legacy-condition` | the condition name is not a registered spelling (a media key missing from the V6 defaults, for one) |
| `unregistered-legacy-condition` | a registered shape whose parameter is not registered |
| `non-style-condition-entry` | a conditional non-style prop (`numberOfLines`) has no flat target |
| `dynamic-legacy-condition` | the condition object is built at runtime (spread, computed key, non-literal) |
| `unprovable-dynamic-value` | a condition needs the base value, whose type cannot be proven |
| `dynamic-condition-value` | a value inside the condition object is not statically known |
| `non-css-style-value` | a condition needs a base that is `true`, `false`, or `null` |
| `empty-style-value` | a condition needs a base that is always nullish |
| `structured-native-value`, `legacy-transition-value` | a condition needs a value from another migration |
| `condition-order-not-preservable`, `base-order-not-preservable` | merging would move a value past something that can also set it |
| `computed-property` | a computed key hides the affected style property |
| `emitted-program-mismatch`, `emitted-value-invalid` | the printer failed its own re-parse; this is a codemod bug |
| plus any code from the shared converter | `legacy-transform-part`, `unsupported-legacy-value`, `legacy-condition-object`, `ambiguous-legacy-group`, `legacy-composite-shorthand` |

## `legacyConditionObjects`

The report counts the files whose sites all converted: those have no legacy condition
object left. The setting lives in your own `createTamagui` call and this tool never
edits it, so the report names the files still holding one instead.
