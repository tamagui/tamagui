# Flat-values codemod

Converts existing Tamagui style syntax to V3 flat property values. Dry-run mode
reports every conversion; `--write` applies every flat-eligible rewrite in one
transaction and records host or target assessments for manual review.

Run it from the root of the project you are migrating. Paths, the report and the
`tsconfig.json` it reads the type information from all resolve from there.

```sh
npx @tamagui/codemod-flat-values ./src                       # dry run
npx @tamagui/codemod-flat-values --json report.json ./src    # machine readable
npx @tamagui/codemod-flat-values --write ./src               # apply safe conversions
npx @tamagui/codemod-flat-values --help
```

Inside this repository the same two runs over the pinned corpus are
`bun run dry-run` and `bun run write` from `code/core/codemod-flat-values`. That
corpus is `code/kitchen-sink/src/usecases` plus the canonical `Button.tsx` skin,
and its acceptance test asserts the migrated corpus has no V1 conversion sites.
Focused fixtures still parse every emitted program back through
`@tamagui/style-grammar`.

A run with no positional argument exits 2, and so does a positional argument that
matches no file, so a typo in a migration path can never read as a clean corpus.

A directory containing `.tamagui-flat-values-ignore` is excluded recursively from
both dry-run and write mode. Use the marker only for intentionally pinned legacy
fixtures, such as the V2 side of a version comparison; application source should be
migrated rather than excluded.

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
- Half-step size tokens are renamed, not dropped. V3 spells a numeric dot-path with a
  dash, so `$0.5` becomes `0-5`, `$1.5` becomes `1-5`, and so on. The values are
  unchanged across the two packs (`0.5`/`0-5` is 1, `1.5`/`1-5` is 4, `2.5`/`2-5` is
  10, `3.5`/`3-5` is 16), so this is a spelling migration with no visual effect. It is
  worth converting rather than flagging because it is the single largest flag category
  on real corpora: on a mid-size app it moved 1007 clean sites to 1212 and dropped
  flagged sites from 279 to 72. A dot-path that is not numeric is a rename nobody can
  derive, so it stays flagged.
- Group conditions split the way V3 splits them: `$group-card-hover` becomes
  `group-hover/card:`, and a container size (`$group-card-maxMd`) becomes
  `@max-md/card:` plus `container="card"` on the element that declares
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
- Variant branches convert as their own style objects, so a
  branch contributes at its own position in the forward pass. No base is invented for
  a condition-only branch: with clause-level merge (decision 21)
  `exitStyle={{ x: 10 }}` is exactly `x="exit:10px"`, which keeps whatever base the
  styled component, variant, or call site defined — the same thing the v1 prop did.
- V2 spread variant keys become typed `styled.dynamic` callbacks for the size,
  space, color, radius, font-size, and z-index token categories. Type keys become
  one `number | string | boolean` dynamic, with `typeof` branches when each body
  is one object-literal return. The report leaves catch-all keys, mixed exact and
  function branches, and sibling-prop reads authored.

Every program the report suggests is parsed back with the real value parser and merged
with the real clause merge before it is printed. A program that does not read back
identically is reported (`emitted-program-mismatch`, `emitted-value-invalid`) instead
of suggested.

The codemod preserves palette-step names such as `blue10` and `red10`. It does
not evaluate the application's runtime config, so it cannot know whether a
custom config still defines them or which absolute shade preserves the design.
Every preserved v5 palette name appears as a non-blocking
`legacy-palette-token` configuration warning in the Markdown and JSON reports.
Write mode still applies the safe syntax conversion, so resolve every warning
before running the converted application. When moving to `@tamagui/config/v6`,
migrate each name manually to an absolute token such as `blue-500`, or enter a
color theme and use its adaptive `colorN` ramp. The v6 defaults do not define
the old palette-step names, and a missing color is dropped without a runtime
warning.

## Conversion assessment

Syntax alone cannot make a conversion safe. Before suggesting a program, the codemod
asks the shared conversion contract whether the property can carry clauses, whether
every clause evaluates on every target implied by the file name, and whether the
component's TypeScript prop type accepts the style.

- **clean** means all three checks passed. A shared `.tsx` file must work on web and
  native; `.web.tsx` and `.native.tsx` require only their named target.
- **needs-relocation** means the syntax is valid but the authored target or host cannot
  evaluate it. Write mode still removes the V1 syntax because V3 has no legacy runtime;
  the report prints the required hand edit. For example, a component-tier web state in
  a shared file moves to `.web.tsx`, while text-only styles on a View move to Text or
  `html.*`.
- **unknown-host** means the component is provably Tamagui but its TypeScript type does
  not expose enough component identity and style-prop information to verify the host.
  Write mode converts the site and leaves the host check in the report for review.
- **ineligible** means the property has no flat clause spelling. Transform and React
  Native shadow part props stay authored, with a remedy that points to the `transform`,
  `boxShadow`, or `textShadow` composite.

The type-aware host lookup is shared with `@tamagui/language-service`; the codemod does
not import or evaluate an app's runtime config. Host validity is a question about the
property rather than its spelling, so a host that types `rounded` accepts `borderRadius`
too: `onlyAllowShorthands: true` omits every longhand a shorthand covers from the
component's prop type, and the conversion resolves an authored shorthand to its longhand
before it asks.

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

All legacy runtime gates are closed. Apply mode is the migration path; there is no
runtime compatibility setting or fallback parser.

## Structured native values

Unconditional React Native objects and arrays keep their authored representation and
do not appear as migration work. When a condition needs the same property in one
string program, the codemod converts only the structures with an explicit,
round-trippable CSS spelling:

- a static `transform` array becomes an ordered CSS transform function list;
- a static `fontVariant` string array becomes a space-separated token list;
- one static React Native `linear-gradient` object becomes `linear-gradient(...)`.

Dynamic and Animated transform entries stay authored under
`structured-transform-dynamic`. Matrix arrays stay authored under
`structured-transform-matrix`, because React Native's matrix array and portable CSS
matrix forms do not have the same shape. A dynamic gradient gets
`structured-background-image-dynamic`; unsupported structured properties use a
property-specific `structured-<property>` code.

Plain `shadowOffset` and `textShadowOffset` objects also stay natural and are not
inventory. If a condition targets one, the shared eligibility contract reports it as
ineligible and points to the complete `boxShadow` or `textShadow` composite. The
codemod never guesses the missing color, radius, opacity, or sibling offset.

Transition arrays, per-property objects, and dynamic references remain authored
because they are supported animation-driver configuration, not flat-value
migration work. An open string type that could still hold a `$token` at runtime
is listed separately as `dynamic-string-value`, which only a human can confirm.

## Flag codes

A flag means a human decides. Every code the tool can emit:

| code | meaning |
| --- | --- |
| `legacy-token-dot-path` | `$1.5` and friends need one flat token name |
| `legacy-numeric-composite-token` | a numeric token embedded in a composite needs its resolved CSS value |
| `legacy-token-constant` | the token lives in a module constant (`const RADIUS = '$6'`), so the constant is what migrates |
| `unproven-container-group`, `ambiguous-container-group`, `container-group-not-declared` | the element that has to declare the query container is not provable from this file |
| `value-reparses-as-program` | the converted string would read back as something other than one base value |
| `legacy-group-presence` | `$group-card` with no state or size styles every descendant unconditionally and has no flat spelling |
| `unknown-legacy-condition` | the condition name is not a registered spelling (a media key missing from the V6 defaults, for one) |
| `unregistered-legacy-condition` | a registered shape whose parameter is not registered |
| `non-style-condition-entry` | a conditional non-style prop (`numberOfLines`) has no flat target |
| `dynamic-legacy-condition` | the condition object is built at runtime (spread, computed key, non-literal) |
| `legacy-condition-in-spread` | a spread the conversion cannot open (`{...(wide && { $sm: … })}`) holds v1 condition keys, named in the flag |
| `unprovable-dynamic-value` | a condition needs the base value, whose type cannot be proven |
| `dynamic-condition-value` | a value inside the condition object is not statically known |
| `non-css-style-value` | a condition needs a base that is `true`, `false`, or `null` |
| `empty-style-value` | a condition needs a base that is always nullish |
| `structured-transform-*` | a transform array is dynamic or has no faithful static function-list spelling; matrix arrays are intentionally included |
| `structured-font-variant-*`, `structured-background-image-*` | a font-variant or gradient structure is dynamic, empty, layered, or unsupported |
| `structured-<property>` | a condition needs an object or array with no verified CSS-shaped migration rule |
| `condition-order-not-preservable`, `base-order-not-preservable` | merging would move a value past something that can also set it |
| `computed-property` | a computed key hides the affected style property |
| `functional-variant-needs-resolve` | the callback reads `extras.props`; use the generated `.resolve` draft |
| `functional-variant-mixed` | exact branches and a function key share one variant |
| `functional-variant-catch-all` | `'...'` needs an explicit value type chosen by the app |
| `functional-variant-type-bodies` | different type-key bodies cannot be combined into safe `typeof` branches |
| `functional-variant-unsupported`, `functional-variant-unsupported-extras`, `functional-variant-styled-import` | the callback, env access, or `styled` import does not have a provable automatic rewrite |
| `emitted-program-mismatch`, `emitted-value-invalid` | the printer failed its own re-parse; this is a codemod bug |
| plus any code from the shared converter | `unsupported-legacy-value`, `legacy-condition-object`, `ambiguous-legacy-group`, `legacy-composite-shorthand` |

## Configuration warning codes

| code | meaning |
| --- | --- |
| `legacy-palette-token` | the conversion preserves a v5 palette-step name that the v6 defaults do not define; choose an absolute palette token or an adaptive `colorN` value |

`unsupported-legacy-value` covers the token-context refusals: a `$` mixed with quoted
or unquoted `url()` content is literal CSS the resolver never reads as a token
candidate, so the value is reported rather than rewritten. Base values and clause
payloads go through the same shared converter, so they always agree on that.

## Remaining manual migration

The report counts the files whose sites all converted: those have no legacy condition
object or flagged functional variant left. V3 has no compatibility setting, so the
report names every file that still needs a hand edit after `--write`.
