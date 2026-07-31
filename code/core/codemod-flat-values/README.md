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
`Button.tsx` skin. Its acceptance test checks every clean program by parsing it back
through `@tamagui/style-grammar`; outcome counts deliberately move when the grammar,
platform capabilities, or component types change.

A positional argument that matches no file exits 2 with no report, so a typo in a
migration path can never read as a clean corpus.

## What it converts

A conversion site is one style object: a JSX attribute list, a `styled()` config, or
a single variant branch. Everything comes from `@tamagui/style-grammar` — the value
parser, the legacy condition converter, the clause merge, and the property/unit
tables — so a converted program is spelled exactly the way the runtime and the
compiler read it back.

Only Tamagui bindings convert. A JSX tag or a `styled` callee has to resolve, through
module specifiers, to an import from `tamagui`/`@tamagui/*`, a re-export chain ending
in one, or a value built by a Tamagui factory. Emotion's `styled`, a local `styled`
helper, a `react-native` component, and an intrinsic tag are all left alone —
`hoverStyle` and `$token` mean nothing to them.

- Condition objects become clauses on the longhand's program:
  `bg="$surface" hoverStyle={{ bg: '$surfaceHover' }}` becomes
  `bg="surface hover:surfaceHover"`.
- v1 platform conditions (`$web`, `$ios`, …) become platform modifiers, and v1
  camelCase media keys resolve to their V6 kebab-case names. The V6 built-in theme
  names use one explicit rename table, so `$backgroundHover` becomes
  `background-hover`. User-defined names keep their authored spelling.
  `$backgroundActive` is the one non-mechanical migration: v3 removed it, so it
  becomes `background-press`, matching the corrected active-state component defaults.
- Group conditions split the way V3 splits them: `$group-card-hover` becomes
  `group-hover/card:`, and a container size (`$group-card-maxMd`) becomes
  `@max-md/card:` plus `container containerName="card"` on the element that declares
  the group. That element has to be proven, never inferred: a JSX ancestor declaring
  the group takes the container silently, a single declaration elsewhere in the file
  takes it under `unproven-container-group`, and anything else stays authored
  (`ambiguous-container-group`, `container-group-not-declared`). Declaring a
  container changes containment, so it never lands on a `group` this pass cannot tie
  to the condition.
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

## Conversion assessment

Syntax alone cannot make a conversion safe. Before suggesting a program, the codemod
asks the shared conversion contract whether the property can carry clauses, whether
every clause evaluates on every target implied by the file name, and whether the
component's TypeScript prop type accepts the style.

- **clean** means all three checks passed. A shared `.tsx` file must work on web and
  native; `.web.tsx` and `.native.tsx` require only their named target.
- **needs-relocation** means the syntax is valid but the authored target or host cannot
  evaluate it. The report keeps the legacy condition authored and prints the contract's
  remedy. For example, `exitStyle` stays driver-evaluated in a shared file because
  `exit:` has no web selector, while text-only styles on a View move to Text or
  `html.*`.
- **unknown-host** means the component is provably Tamagui but its TypeScript type does
  not expose enough component identity and style-prop information to verify the host.
  The report keeps the source authored for review instead of calling it clean.
- **ineligible** means the property has no flat clause spelling. Transform and React
  Native shadow part props stay authored, with a remedy that points to the `transform`,
  `boxShadow`, or `textShadow` composite.

The type-aware host lookup is shared with `@tamagui/language-service`; the codemod does
not import or evaluate an app's runtime config.

Ordering is never traded for a bigger diff. A program merges only when every
contribution still beats and loses to the same things it did, so an opaque spread or
an unconverted condition object between two contributions leaves the later ones
authored (`condition-order-not-preservable`, `base-order-not-preservable`). Spreading
an object literal writes its members out, and a nested spread or an unreadable key
inside it stays exactly where it was authored and orders the merge like any other
spread. An unconvertible nested condition counts every longhand under it, at any
depth, as something its member can still set.

## Apply mode

Clause-free tokens now become base-only programs: `p="$4"` becomes `p="4"` and
resolves config-first through the same flat engine as a value with modifiers.
For `x` and `y`, this also applies the v3 category cutover: the legacy `$4`
resolved through the size scale, while flat `4` resolves through the space scale.
If a custom config gives those scales different values, the rendered offset changes
by design and those rows need review during migration.

All three runtime gates are closed. This tool remains report-only until users approve
an apply/write mode; runtime support no longer blocks it.

Values belonging to another migration are listed separately and left untouched:
`legacy-transition-value` (the v1 animation config shapes), `structured-native-value`
(`shadowOffset`, raw `transform` arrays), and `dynamic-string-value` (an open string
type that could still hold a `$token` at runtime, which only a human can confirm).

## Flag codes

A flag means a human decides. Every code the tool can emit:

| code | meaning |
| --- | --- |
| `legacy-token-dot-path` | `$1.5` and friends need one flat token name |
| `legacy-token-constant` | the token lives in a module constant (`const RADIUS = '$6'`), so the constant is what migrates |
| `unproven-container-group`, `ambiguous-container-group`, `container-group-not-declared` | the element that has to declare the query container is not provable from this file |
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
| plus any code from the shared converter | `unsupported-legacy-value`, `legacy-condition-object`, `ambiguous-legacy-group`, `legacy-composite-shorthand` |

`unsupported-legacy-value` covers the token-context refusals: a `$` mixed with quoted
or unquoted `url()` content is literal CSS the resolver never reads as a token
candidate, so the value is reported rather than rewritten. Base values and clause
payloads go through the same shared converter, so they always agree on that.

## `legacyConditionObjects`

The report counts the files whose sites all converted: those have no legacy condition
object left. The setting lives in your own `createTamagui` call and this tool never
edits it, so the report names the files still holding one instead.
