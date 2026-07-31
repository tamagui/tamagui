# V3 beta breaking changes and flat-values migration

> Review draft. This document is not published. It describes the behavior in
> the `v3-beta` tree on July 31, 2026. The proposed engine contraction is
> separated from the behavior that has landed.

V3 moves conditional styles into the value of the property they change. It
also adopts the v6 built-in config vocabulary, makes identifier resolution
config-first, and removes several web-only accidents from the cross-platform
style contract.

The migration tool currently produces a report. It never edits source files or
configuration.

## Start with the v6 config

Use the v6 default config as the base for new V3 configuration:

```tsx
import { defaultConfig } from '@tamagui/config/v6'
```

The v6 themes rename every multi-word built-in theme key to kebab case. The
runtime does not provide camelCase aliases because a user config could define
both spellings.

| Previous key | V3 flat value |
| --- | --- |
| `accentBackground` | `accent-background` |
| `accentColor` | `accent-color` |
| `colorHover` | `color-hover` |
| `colorPress` | `color-press` |
| `colorFocus` | `color-focus` |
| `backgroundHover` | `background-hover` |
| `backgroundPress` | `background-press` |
| `backgroundFocus` | `background-focus` |
| `borderColor` | `border-color` |
| `borderColorHover` | `border-color-hover` |
| `borderColorFocus` | `border-color-focus` |
| `borderColorPress` | `border-color-press` |
| `outlineColor` | `outline-color` |
| `placeholderColor` | `placeholder-color` |
| `colorTransparent` | `color-transparent` |
| `shadowColor` | `shadow-color` |

For example, the legacy token reference `$borderColorHover` becomes the flat
value `border-color-hover`.

`backgroundActive` is removed rather than renamed. The codemod maps
`$backgroundActive` to `background-press`. This is the only built-in row that
changes meaning: V3 uses the corrected press-state component default rather
than preserving the old active name.

All 16 replacement names above exist in the base light and dark themes in
`@tamagui/config/v6`. Their previous spellings and `backgroundActive` do not.
Child themes inherit missing values through their theme-name chain.

## Write flat values

A flat value has an optional base followed by zero or more conditional clauses:

```txt
value  := base? clause*
clause := modifier (":" modifier)* ":" payload
```

The last matching clause wins. Multiple modifiers in one clause are combined:
`dark:hover:blue10` requires both the dark theme and hover state.

```tsx
// legacy
<View
  bg="$background"
  hoverStyle={{ bg: '$backgroundHover' }}
  $theme-dark={{ bg: '$blue10' }}
  p="$4"
  $sm={{ p: '$6' }}
/>

// V3
<View
  bg="background hover:background-hover dark:blue10"
  p="4 sm:6"
/>
```

Quoted values use config-first resolution even when they have no clause:

```tsx
p="4" // configured space token
p={4} // raw platform value: CSS pixels on web, points on native
```

For an ordinary identifier, a configured name wins over a same-spelled CSS
literal. A name missing from the relevant config category remains literal CSS.
The reserved identifiers in the next section are always literal.

The current web and native engines support clause merging across styled
defaults, variants, shorthands, and call-site values. A later contribution
replaces only the base or exact clause it restates:

```tsx
const Card = styled(View, {
  bg: 'gray hover:blue',
})

// base becomes red; the styled hover clause remains blue
;<Card bg="red" />
```

Named container queries are also wired on both platforms:

```tsx
<View container containerName="card">
  <Text width="100% @sm/card:50%" />
</View>
```

On web, `containerName="card"` emits `container-name: card` and supplies the
configured container type when no explicit type is authored.

### Platform limits to keep visible

The raw `transform` property is one ordinary flat program on web and native:

```tsx
<View transform="skewX(10deg) hover:skewX(20deg)" />
```

The first-class transform-family props `x`, `y`, `scale`, `scaleX`, `scaleY`,
and `rotate` also accept clauses. Flat `x` and `y` values bind the space scale.
Legacy `$` values for `x` and `y` used the size scale, so review converted
offsets when a custom config gives its size and space tokens different values.

Legacy `exitStyle` works on web through the animation driver. A flat `exit:`
clause currently evaluates on native, while web lowering rejects it because
there is no web exit selector. Converting shared `exitStyle` to `exit:` is
therefore a behavior regression. The codemod now keeps `exitStyle` authored in
a shared or web file and reports `needs-relocation`. The same conversion is
clean in a `.native.tsx` file. `enter:` supports both targets.

The inverse limit applies to component-tier states such as `open`, `checked`,
`highlighted`, and `invalid`: web can lower their attribute selectors, while
native cannot source them until the behavior packages feed component state.
Shared source therefore needs relocation to `.web.tsx`. Plain interaction
states, media, themes, platforms, containers, and `enter` support both targets.

## Run the report-only codemod

Run the tool from a Tamagui checkout:

```bash
cd code/core/codemod-flat-values

bun run dry-run \
  --report /tmp/flat-values-report.md \
  path/to/src

bun run dry-run \
  --report /tmp/flat-values-report.md \
  --json /tmp/flat-values-report.json \
  path/to/src
```

Read both the summary and each flagged site. A successful command means the
report was generated. It does not mean every site converted.

The codemod converts only bindings it can prove come from Tamagui. It handles:

- JSX style props on Tamagui components;
- `styled()` configuration, variant branches, and compound-variant branches;
- clause-free `$token` values and condition objects for states, themes, media,
  platforms, groups, and containers;
- all built-in name replacements in the table above;
- static values, numeric values with their required units, and dynamic values
  whose string or numeric shape is provable;
- named group-size conditions when it can prove which group declaration must
  become the query container;
- authored ordering and same-longhand clause merging, including values
  contributed through different shorthands.

For example, an actual report from the current tree produced:

```tsx
// before
const Frame = styled(View, {
  bg: '$background',
  hoverStyle: { bg: '$backgroundHover' },
  variants: {
    padded: {
      true: {
        p: '$4',
        $sm: { p: '$6' },
      },
    },
  },
})

// suggested
const Frame = styled(View, {
  bg: 'background hover:background-hover',
  variants: {
    padded: {
      true: {
        p: '4 sm:6',
      },
    },
  },
})
```

The report reparses every suggested value with the same grammar used by the
runtime. It leaves the authored code in place if it cannot preserve ordering
or prove a target.

### What clean means

The report assesses three independent facts before it calls a suggestion
clean:

1. the property can carry a flat program;
2. every clause evaluates on every target implied by the file name;
3. the component's TypeScript prop type accepts the property.

A shared `.tsx` file requires web and native support. `.web.tsx` and
`.native.tsx` require only the named target.

The other outcomes keep the unsafe source authored:

- `needs-relocation`: the property and syntax are valid, but the target or
  known host cannot evaluate the result;
- `unknown-host`: the component is provably Tamagui, but TypeScript no longer
  exposes enough component type information to verify the style;
- `ineligible`: the property has no flat clause spelling;
- syntax and ordering flags: the tool cannot produce an equivalent program.

For shared `exitStyle`, the current report says:

```text
- **needs-relocation: opacity**: "exit:" cannot lower to web CSS — there is no exited-state class in the DOM to select; exit is animation-driver territory. Remedy: keep the driver-evaluated pseudo prop, or move this usage to a .native.tsx file.
```

It can still convert an independent `enterStyle` at the same site:

```tsx
// before
<View
  opacity={0.5}
  enterStyle={{ opacity: 0 }}
  exitStyle={{ opacity: 0 }}
/>

// report suggestion
<View opacity="0.5 enter:0" exitStyle={{ opacity: 0 }} />
```

The default corpus measurement on July 31, 2026 found 1,768 sites: 1,484 clean,
155 `needs-relocation`, 126 `unknown-host`, 3 `ineligible`, and 1 with a syntax
flag. Before the type-aware lookup, only 387 hosts, or 21.89%, were
structurally provable. Reusing the language-service TypeScript lookup
established 1,640, or 92.76%. It resolved 526 of 538 YStack sites, 241 of 244
XStack sites, and every Square and Paragraph site.

Earlier that day, the same corpus reported every site as convertible. The
composed property, target, and host checks now name 155 sites that would
produce code which cannot evaluate where the author put it. The first
type-aware lookup pass actually found 156. Classification review confirmed
155 and found one type-surface error: the runtime and `stylePropsTextOnly`
accepted `textDecoration` on Text while the Text component prop type omitted
it. The public type and a runtime/type parity test were fixed before this final
measurement, moving exactly that site from `needs-relocation` to clean.

The 128 unresolved host identities are a coherent review list rather than 128
different failures: 88 use compound members such as `Menu.Item`, 17 are
explicit type-erasing casts in one live-slot fixture, 4 are `styled()` calls
over unknown bases, and 19 are direct components, mostly icon hosts. Two of
those 128 have a determined target failure, so the contract's precedence gives
them `needs-relocation`; the remaining 126 appear as `unknown-host`.
Compound-member resolution is a known tooling limit and the dominant
follow-up target. An `unknown-host` result on a component such as `Menu.Item`
means the codemod could not follow that member access to its host type; it does
not imply the component itself is invalid.

## Move part-prop conditions to their composite

Some React Native part props keep their plain legacy value path, but they have
no per-part flat clause spelling. The runtime drops clause-shaped values on
these props with a development diagnostic, and the codemod refuses to convert
their condition objects.

Move shadow part conditions to a complete `boxShadow` or `textShadow` value:

| Legacy part | Composite that owns the condition |
| --- | --- |
| `shadowColor` | `boxShadow` |
| `shadowOffset` | `boxShadow` |
| `shadowOpacity` | `boxShadow` |
| `shadowRadius` | `boxShadow` |
| `textShadowColor` | `textShadow` |
| `textShadowOffset` | `textShadow` |
| `textShadowRadius` | `textShadow` |

```tsx
// legacy part condition
<View
  shadowColor="$shadowColor"
  shadowOffset={{ width: 0, height: 2 }}
  shadowRadius={8}
  hoverStyle={{ shadowColor: '$blue10' }}
/>

// manual migration: each payload is a complete shadow
<View boxShadow="0 2px 8px shadow-color hover:0 2px 8px blue10" />
```

The tool cannot reconstruct a complete shadow from one conditional part
without deciding how its sibling offset, radius, opacity, and color should
combine. That decision belongs to the author.

The same rule applies to transform parts outside the first-class family:

| Legacy part | Composite that owns the condition |
| --- | --- |
| `perspective` | `transform` |
| `skewX`, `skewY` | `transform` |
| `matrix` | `transform` |
| `rotateX`, `rotateY`, `rotateZ` | `transform` |

For a conditional `shadowColor`, the current report says:

```text
- **ineligible: shadowColor**: "shadowColor" is a part prop with no flat clause spelling. Remedy: move the condition onto `boxShadow`.
```

The corresponding transform diagnostic names `transform`, and text-shadow
parts name `textShadow`.

## Rename reserved config tokens

The flat resolver reserves these CSS identifiers:

```txt
inherit
initial
unset
revert
none
auto
transparent
currentColor
```

`createTamagui()` now rejects a token in any category whose name matches one
of these values, case-insensitively. Such a token could never be reached
because the resolver must interpret the name as literal CSS.

For `tokens.color.transparent`, config creation reports:

> `Token tokens.color.transparent takes a reserved CSS-wide keyword name. These always resolve as literal CSS ("transparent"), so this token could never be referenced. Rename it.`

The v6 default config exposed both cases that matter during migration:

- `tokens.color.transparent` was removed. Write the literal `transparent`; it
  resolves to the same CSS value without a token.
- `tokens.radius.none` was removed. Tailwind's `rounded-none` remains a
  candidate spelling, but it is not a config token. Rename a custom zero-radius
  token to a non-reserved name such as `zero`.

Search custom token categories for every reserved name before creating the V3
config. This rule also rejects names such as `tokens.size.auto`.

## Move text-only styles off `View`

`View` no longer accepts `color`, `textDecorationColor`, or
`textShadowColor`. React Native has no `View` text color, while the old web
path accidentally allowed `color` to inherit through the DOM. V3 follows the
cross-platform type contract: the runtime drops these props on a non-text host
and logs a development warning.

Move the style to the text component:

```tsx
// before: worked only through web inheritance
<View color="red">
  <Text>Warning</Text>
</View>

// cross-platform
<View>
  <Text color="red">Warning</Text>
</View>
```

If the DOM inheritance is intentional and the component is web-specific, use
the DOM contract explicitly:

```tsx
<html.div color="red">Web content</html.div>
```

The TypeScript surface already rejected these text-only props on `View`; this
change makes runtime behavior agree with the types and native behavior.

The codemod now uses the same TypeScript-aware host lookup as the language
service. A proven View keeps the condition authored and reports, for example:

```text
- **needs-relocation: color**: "color" is not a valid style on View — the runtime drops it. Remedy: move this style to a component that accepts it (a Text-based component, or html.* on web).
```

## Other work the codemod leaves to you

The tool deliberately does not:

- write or apply source changes;
- edit the `createTamagui()` config or change
  `settings.legacyConditionObjects`;
- convert a local `styled` helper, a React Native component, or an intrinsic
  element without proven Tamagui provenance;
- guess through computed keys, opaque spreads, runtime-built condition
  objects, or an ordering barrier;
- convert conditional non-style props such as `numberOfLines`;
- choose a query-container owner when ancestry or the group declaration is
  ambiguous;
- invent a flat name for a dot-path token such as `$1.5` or rewrite a token
  held behind an unproven module constant;
- flatten raw structured values such as a transform array or `shadowOffset`
  object;
- migrate legacy transition configuration shapes;
- guess whether an open `string` type contains a token at runtime;
- convert group-presence conditions that name neither a state nor a size;
- convert the shadow and transform part conditions listed above;
- claim a clean host when TypeScript cannot establish the component prop
  surface.

The report separates manual flags from inventory that belongs to another
migration. Preserve authored code until each flagged decision is made.

`legacyConditionObjects` defaults to `true` in the current beta, which converts
eligible legacy condition objects at the style loop entry. Setting it to
`false` keeps the old condition machinery. The report tells you which files
still contain legacy objects, but the tool never changes this setting and the
setting itself is not proof that migration is complete.

## Current specificity change

Ordinary V3 base atomic rules use a single class selector with specificity
`(0,1,0)`. Previous ordinary base rules used `:root .class`, with specificity
`(0,2,0)`. A consumer rule with one class now ties an ordinary Tamagui base
rule, so stylesheet order decides the winner.

Audit custom CSS that depended on Tamagui base rules winning regardless of
source order. Doubled longhand-over-shorthand selectors remain in place, and
the legacy pseudo and media specificity ladders have not been removed.

## Generated class names for alias modifiers

V3 hashes the canonical modifier spelling when it generates a program class.
Aliases still author and lower the same way, but they now share the canonical
spelling's class name. In particular, `active:` hashes as `press:`, and an
alias inside a group modifier canonicalizes too:

```txt
backgroundColor="red active:blue"           -> _bc-1119250615
backgroundColor="red press:blue"            -> _bc-1119250615
backgroundColor="red group-active/card:blue" -> _bc-1493322902
backgroundColor="red group-press/card:blue"  -> _bc-1493322902
```

Those concrete names come from the `r1` test config revision; application
names also include their own config revision. The emitted rule text and
rendered behavior are unchanged. Snapshot tests that pin generated class names
must rebaseline once. Custom CSS keyed directly to a generated Tamagui class
must update too, though generated names are private implementation details and
consumer CSS should prefer a stable authored class or selector.

## Migration checklist

1. Import the v6 config and rename custom references to the 16 built-in names.
2. Rename or remove every reserved config token.
3. Generate the codemod report for one source directory.
4. Apply clean suggestions manually, reviewing `x` and `y` against custom
   space and size scales.
5. Resolve `needs-relocation`: keep shared `exitStyle` driver-evaluated or move
   the use to native-only source, move web-only component states to
   `.web.tsx`, and move text-only View styles to a text or DOM host.
6. Review `unknown-host` sites before changing them.
7. Rebuild shadow and transform part conditions as complete composites.
8. Move text-only styles from `View` to `Text`, or use `html.*` for deliberate
   web DOM behavior.
9. Typecheck and build.
10. Exercise states, media, themes, groups, containers, transforms, and
    presence behavior on every platform the code supports.
11. Re-run the report and resolve every remaining outcome, flag, and inventory
    row.
12. Audit consumer CSS for the base-specificity change.
13. Rebaseline snapshots or consumer CSS that pins generated classes for
    `active:` or `group-active/*` aliases.

## Proposed only: engine contraction

The full engine contraction has not been approved or landed. Current V3 beta
behavior still includes the legacy pseudo-object path, media importance
ordering, specificity ladders, and legacy theme, platform, and group prop-key
parsing.

If the contraction is approved, those legacy internal paths are planned for
deletion after the program engine replaces them. The migration guide must then
be revised from the resulting code and measurements. Do not change application
code based on that proposed deletion today.

## Draft verification record

The claims in this draft were checked against the following current-tree
contracts:

- `code/core/style-grammar/src/v6ThemeNames.ts` and the built
  `@tamagui/config/v6` themes for every built-in rename;
- `code/core/codemod-flat-values/src/builtInNames.ts` and a real codemod report
  containing all 16 renames, `backgroundActive`, styled values, variants,
  platform/theme/group conditions, and refused part props;
- `code/core/style-grammar/src/programEligibility.ts` for the complete
  part-to-composite table;
- `code/core/style-grammar/src/clauseCapability.ts` and the codemod's
  type-aware language-service host lookup for every clean, relocation,
  unknown-host, and ineligible outcome;
- `code/core/style-grammar/src/valueTypes.ts` and
  `code/core/web/src/createTamagui.ts` for reserved identifiers and the exact
  config error;
- `code/core/config/scripts/generate-v6-tailwind-defaults.ts` for the v6
  `transparent` and `none` removals;
- focused web integration tests for flat programs, transforms, eligibility,
  reserved tokens, and text-only `View` props;
- focused native integration tests for flat programs, transforms, and
  eligibility;
- a rebuilt real-browser CSS-driver presence test proving that legacy
  `exitStyle` keeps the element mounted, transitions opacity, and unmounts only
  after the web transition;
- a direct style-grammar lowering probe showing that `active:` and `press:`
  emit `_bc-1119250615`, while `group-active/card:` and `group-press/card:`
  emit `_bc-1493322902`, with identical rule text in each pair;
- the default-corpus host coverage and outcome measurement above.

The web verification passed 46 tests in five files. The native verification
passed 43 tests in three files. The probe logs record their UTC start and
finish times and exact branch heads.
