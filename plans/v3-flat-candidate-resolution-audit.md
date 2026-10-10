# V3 flat-value and Tailwind candidate resolution audit

Date: 2026-07-30

Branch: `v3-beta`

Audit baseline: `3c94f0bbb98e`

Status: wrong-value findings closed by `114a015a73`; group and container
implementation remains open

## Conclusion

The flat-value path and the Tailwind candidate path agree when they consume the
same style-grammar registry, config projection, or family table. Every
wrong-value divergence found in this audit occurs where candidate parsing or
candidate reconstruction implements a second resolution rule.

The root cause is concrete:

1. `@tamagui/style-grammar` candidate parsing classifies names and modifiers
   without consuming the shared modifier and value-resolution contracts.
2. `@tamagui/tailwind` reconstructs candidate values through legacy `$` values
   and repeats modifier classification in its frontend.
3. The reconstructed props eventually rejoin the shared renderer, but name
   precedence, opacity validation, and modifier kind may already have changed.

Candidate spelling remains its own concern. Bracket decoding, fractions,
conveniences, whole utilities, and safe refusal of ambiguous or unknown classes
are legitimate candidate-layer decisions. Token meaning, opacity meaning, and
the global modifier namespace are shared semantics.

## Shared-contract ruling

> the candidate layer may decide WHICH property and WHICH name a class spelling means; it may never decide what a name RESOLVES TO or which kind a modifier IS.

This is the boundary for the follow-up. A candidate may choose a property from
its prefix and a name from its class spelling. From that point onward, the
property-scoped lookup owns the reference, the shared opacity parser owns the
suffix, and the shared modifier registry owns every modifier kind.

The follow-up consumed three style-grammar contracts:

1. **Name resolution:** candidates use the property-scoped lookup already used
   by flat payloads. Reconstructing a legacy `$name` is removed because it sends
   the name through `getTokenForKey()` and its theme-before-token order.
   Authored legacy `$token` values retain that order until the later contraction
   absorbs `getTokenForKey()`.
2. **Opacity suffix:** one exported parser validates integer percentages from 0
   through 100 and returns a diagnostic for every invalid suffix. The candidate
   regex and legacy clamp are removed. Out-of-range input is never recovered by
   changing it to a different opacity.
3. **Modifier kinds:** candidate classification and frontend reconstruction use
   `registry.get()`. Their private kind tables and ordering are removed.

## What mismatched package versions look like

The original token/theme probe mixed the Tailwind frontend source at
`3c94f0bbb9` with `@tamagui/web` and `@tamagui/style-grammar` dist built two
minutes earlier. That made version skew a plausible explanation, but a coherent
rebuild reproduced the difference. The actual cause was the candidate's legacy
`$name` reconstruction under an active theme.

An installed app can still produce this general symptom when its lockfile
resolves the Tailwind frontend, web runtime, and style grammar to mismatched
versions. A shared contract cannot prevent two versions of its implementation
from being installed, but it reduces the seams where skew can change meaning.
When a user reports a class and an equivalent flat prop resolving differently,
package-version alignment and lockfile state still belong in the diagnostic
pass. They were not the cause of this finding.

## What a false parity guarantee looks like

The first parity test configured both `tokens.color.collision` and
`themes.light.collision`, named the active theme `light`, but passed
`undefined` as the theme object to `getSplitStyles()`. The colliding theme value
was therefore never in scope. Candidate and flat output agreed only because the
test did not activate the collision it claimed to exercise.

The valid-opacity case also compared only whether both rules contained `50%`.
It stayed green while the rules mixed over different variables. The suite now
activates its named theme and compares the full emitted rules, inline style, and
view props byte for byte. A collision test must put both meanings in scope; a
parity test must compare the whole observable result.

## Parent-marker forms verified against Tailwind 4.3

The parent spellings were checked against the installed Tailwind 4.3 compiler
before defining the Tamagui projection:

| Tailwind spelling | Tailwind capability | Tamagui projection |
| --- | --- | --- |
| `group` | unnamed group marker | `group={true}` |
| `group/card` | group marker named `card` | `group="card"` |
| `@container` | unnamed `inline-size` container | `container={true}` |
| `@container/layout` | `inline-size` container named `layout` | `containerName="layout"` and `containerType="inline-size"` |
| `@container-size` | unnamed `size` container | `containerType="size"` |
| `@container-size/layout` | `size` container named `layout` | `containerName="layout"` and `containerType="size"` |

All six forms project without losing a name or container type. On web the raw
class remains so Tailwind can emit its selectors and container declarations.
The projected props establish the Tamagui group or container context, including
the native context that has no CSS fallback. Descendant candidates carrying a
Tamagui value cannot rely on raw passthrough and must enter the shared program
path.

The native parent-plus-descendant probe also exposed a pre-existing runtime
gap. Container-only components created `@` and `@name` context entries but
mounted `GroupContext.Provider` only when a `group` prop was present. A direct
injected-context test could prove that a descendant evaluated `@size`; it could
not prove that a real container parent provided or updated that context.
`e41f60ff93` closes the provider guard for every container prop form.

One separate no-op remains visible in the subscription bookkeeping and was not
the cause of that gap. Container evaluation reports context keys such as
`@layout` and referenced size names such as `sm` separately. The subscriber
correctly attaches the `@layout` listener and uses the full size set for its
layout calculation, then also attempts a listener lookup for `sm`. No provider
publishes a context under that size name, so the second lookup cannot subscribe.
This redundant iteration should not be mistaken for the provider bug when the
subscription representation is simplified later.

## Paths compared

### Flat-value path

1. `code/core/web/src/helpers/grammarConfig.ts`
   `createGrammarRuntimeContext()` creates the shared config view, modifier
   registry, property-scoped token lookup, theme namespace, and font maps.
2. `code/core/style-grammar/src/resolvePayload.ts` scans CSS-shaped payloads,
   applies the reserved-ident gate, resolves references, and validates color
   opacity.
3. `code/core/web/src/helpers/contributePrograms.ts` expands shorthands and
   families, records `fontFamily` scope, and contributes longhand programs.
4. The shared web lowering or native evaluator serializes those programs.

### Tailwind candidate path

1. `code/core/style-grammar/src/config.ts` projects config names through
   `createGrammarConfigView()`.
2. `code/core/style-grammar/src/candidate.ts` parses a class, classifies its
   modifiers, chooses a property entry, and decides whether the value is a token,
   arbitrary value, enum, or convenience.
3. `code/core/tailwind/src/candidate.ts` converts the parsed candidate to flat
   `$modifier:prop` keys while keeping the selected config-first name bare.
4. `code/core/tailwind/src/frontend.ts` reads modifier kinds from the shared
   registry and reconstructs the corresponding condition object.
5. Those reconstructed props enter the shared renderer.

## Resolution matrix

| Question | Flat-value behavior | Candidate behavior | Verdict |
| --- | --- | --- | --- |
| Property to token category | Uses the style-grammar registry first, with runtime-only aliases only for spellings absent from the registry | Uses the same style-grammar registry entries and config view | Agree |
| Reserved CSS ident | `resolvePayload()` keeps it literal before lookup | Config creation rejects a token with that name, so a candidate convenience cannot be overridden | Agree after `0f330bb77e` and `5590190a81` |
| Exact token versus same-named theme key | Bound token category wins, then the unified theme namespace | Candidate emits the bare name into the same property-scoped lookup | Agree after `114a015a73` |
| Color `/NN` opacity | One parser accepts an integer from 0 through 100 | Candidate consumes the same parser and leaves invalid attempts unresolved | Agree after `114a015a73` |
| State, media, platform, and theme modifier name | Shared registry priority is state, media, platform, theme | Candidate parser and frontend call the same registry | Agree after `114a015a73` |
| Group and container modifier | Shared registry recognizes `group-*` and `@size[/name]` | Candidate parser recognizes neither; group reconstruction code is unreachable from a class and no container branch exists | Missing candidate implementation |
| Config shorthand | Config view carries the shorthand; program contribution expands through shared longhand tables | Candidate finds the configured prefix, reconstructs the expanded prop, then enters shared contribution | Agree |
| Directional border and radius | Shared border and longhand family tables | Candidate imports `borderSideSuffix` and `radiusCornerProps` from style-grammar | Agree |
| Safe-area name | Shared safe-area lookup and runtime resolution | Candidate imports the same safe-area classifier, then shared runtime resolves it | Agree |
| Configured font family and `font_*` scope | Flat contribution records the family token and active family for submap lookup | Candidate reconstructs ordinary `fontFamily`; the same contribution code records scope | Agree |
| Font submap categories | Active/default family resolves size, weight, line-height, and letter-spacing | Config projection exposes the same submaps; `fontWeight` joined this projection in `3c94f0bbb98e` | Agree |
| Bracket arbitrary value | Takes ordinary CSS-shaped payload text and resolves identifiers within it | Decodes Tailwind bracket and underscore syntax, with native-safe number coercion | Designed spelling difference |
| Sizing, fraction, percentage, generic-font, and whole-class convenience | Author supplies the resulting CSS or prop value | Candidate owns the compact Tailwind spelling and expands it | Designed candidate convenience |
| Ambiguous prefix | Property name already fixes the flat-value family | Candidate refuses a class that could mean two configured families | Designed safe refusal |
| Unknown or wrong-category candidate | Flat runtime keeps a literal miss and tooling diagnoses it | Candidate passes the class through instead of guessing | Designed ownership boundary |
| Theme key outside a color candidate family | Unified namespace can resolve after a bound-category miss | Candidate only admits theme keys as color names | Deliberate safe claim restriction in current code |

## Wrong-value findings and closures

### 1. Exact token and theme key use opposite precedence

The flat lookup in `createGrammarRuntimeContext().getLookup()` follows the
documented mechanical contract:

1. configured family or bound token category;
2. safe-area variable where applicable;
3. sibling-category mismatch check;
4. unified theme namespace.

Candidate tokenization converts an exact configured token back to `$name`.
`getTokenForKey()` reads `theme["$name"]` and then `theme["name"]` before the
property's token category. A collision therefore changes the selected variable
according to the authoring surface.

Probe result with `tokens.color.$collision = "#112233"` and
`themes.light.collision = "#445566"`:

```text
flat backgroundColor="collision" -> var(--c-color-collision)
candidate bg-collision           -> var(--collision)
```

The same precedence applies beyond color. Any candidate that reconstructs a
bound token as a legacy `$name` can encounter a same-named theme key.

Closure: candidate reconstruction now keeps config-first names bare. The shared
property lookup selects the bound category before the theme namespace. Authored
legacy `$name` values intentionally retain their theme-first behavior until the
contraction's D4 resolver unification removes `getTokenForKey()`.

### 2. Candidate opacity is a second parser

`resolvePayload()` recognizes `/NN` only after a resolved color and accepts only
integer percentages from 0 through 100. Candidate parsing uses
`/\d+(?:\.\d+)?/` to remove the suffix for token membership, and the Tailwind
adapter preserves the same decimal syntax. Legacy `getTokenForKey()` converts
with `Number()` and clamps to `[0, 1]`.

Observed results:

```text
slate-500/50
  flat      -> color-mix(... 50% ...)
  candidate -> color-mix(... 50% ...)

slate-500/50.5
  flat      -> literal slate-500/50.5
  candidate -> color-mix(... 51% ...)

slate-500/150
  flat      -> literal slate-500/150
  candidate -> full configured color
```

The valid case agrees. Invalid input silently changes value only through the
candidate path.

Closure: candidate classification and adaptation consume
`splitColorOpacitySuffix()`. Invalid attempts remain literal, and valid suffixes
enter the same property-scoped color lookup as flat values.

### 3. Candidate modifier parsing bypasses the global registry twice

`createModifierRegistry()` owns one global namespace and registers kinds in this
order:

1. state;
2. media;
3. platform;
4. theme.

`modifierKind()` in `style-grammar/src/candidate.ts` checks state, media, theme,
then platform. `parseFlatModifierProp()` in `tailwind/src/frontend.ts` repeats
the same different order.

With a theme named `web`, the shared registry keeps the platform meaning and
reports that the theme name was ignored. The candidate parser accepts
`web:p-4`, and the frontend reconstructs:

```json
{
  "$theme-web": {
    "padding": "$4"
  }
}
```

The parser and frontend therefore agree with each other while disagreeing with
the authoritative registry.

Closure: both candidate classification and frontend reconstruction call
`registry.get()`. Platform/theme collisions now retain the registry's platform
meaning.

## Group and container ruling

This is missing implementation rather than a documentation correction.

Evidence:

1. `plans/dom-tailwind-flat-values.md` explicitly gives the regular and Tailwind
   frontends the same `group-hover[/name]:` and `@size[/name]:` modifier
   spellings.
2. The shared modifier registry already parses both forms.
3. The Tailwind frontend contains group reconstruction code, which shows that
   group conditions were intended to reach it from candidate parsing.
4. Candidate `modifierKind()` cannot classify a group or container modifier.
   The frontend also has no container reconstruction branch.
5. Web passthrough cannot supply the general fix because configured Tamagui
   token values are intentionally not mirrored into Tailwind's theme. Native
   has no CSS-engine passthrough for these conditions.

Parent marker classes such as `group/card` and `@container` can remain
official-Tailwind concerns where they contain no Tamagui value. Descendant
variants whose base is a configured Tamagui candidate need the shared modifier
semantics.

### Candidate-side scope after the contracts land

Classification must recognize these descendant modifier spellings through the
shared registry:

- unnamed and named group state: `group-hover:` and `group-hover/card:`;
- Tamagui native group states such as `group-press/card:`;
- unnamed and named container size: `@sm:` and `@sm/layout:`;
- chains such as `sm:dark:group-hover/card:` and
  `@sm/layout:group-hover/card:`.

Recognition must retain the registry's collision result. A configured media,
theme, or platform name that collides with one of these spellings cannot acquire
a second kind in candidate parsing. Only media keys that the shared registry
accepts as container sizes may acquire an `@` form.

The frontend work is:

1. give the existing group reconstruction branch a candidate path that can
   reach it;
2. add container reconstruction through the shared program representation;
3. preserve the parsed modifier names while asking the registry for their
   kinds;
4. remove private kind tables and branches that become unreachable once the
   shared path is authoritative, while moving their behavior coverage to the
   shared contract.

The representation for the container branch depends on the incoming contracts.
It must feed the shared flat program rather than inventing another legacy
condition spelling.

Parent capability markers remain a separate ownership question:

- `group/card` and `@container` contain no Tamagui property or value and may
  remain official-Tailwind passthrough;
- `group-hover/card:bg-token` and `@sm:bg-token` contain a configured Tamagui
  candidate and require the shared Tamagui modifier and resolution contracts.

Required behavior coverage:

- pure candidate classification for unnamed, named, chained, and invalid group
  and container modifiers;
- collision cases that compare candidate classification with
  `createModifierRegistry()`;
- web and native round trips for configured token values under group and
  container conditions;
- refusal of an `@` modifier for a media key that does not measure size;
- preservation of passthrough for unknown modifier spellings.

## Agreements checked

The audit deliberately checked the seams that had already produced bugs:

- Every candidate-bound registry property now returns the same runtime token
  category. The parity coverage includes border widths, `fontFamily`, and
  `fontWeight`.
- Border width/color and font family/weight collisions are rejected at the
  candidate prefix instead of choosing a family.
- Reserved CSS idents stay literals at the flat layer. Config creation prevents
  candidate tokens from assigning those spellings a second meaning.
- State aliases use the shared vocabulary. `active` canonicalizes to `press`.
- Configured media, theme, and platform names come from the same config
  projection. They agree when no namespace collision exists.
- Config shorthands resolve before longhand expansion in both paths.
- Directional border and radius expansions import the shared registry tables.
- Safe-area conveniences import the shared safe-area table.
- Font-family candidates rejoin shared contribution before scope is recorded,
  so web `font_*` classes and native active-family lookup use the same code.
- Arbitrary candidates rejoin shared contribution after candidate-specific
  decoding and coercion.
- Unknown names, wrong-category names, unsupported selector variants, and
  ambiguous overloaded prefixes are refused or passed through. They are not
  silently assigned a different Tamagui value.

## Designed candidate-layer differences

These differences do not redefine a shared name or value:

- brackets and underscore decoding for values that cannot contain spaces in a
  class;
- unitless and `px` arbitrary-value coercion so React Native receives numbers;
- sizing keywords and fractions such as `w-full`, `w-auto`, and `w-1/2`;
- percentage conveniences such as `opacity-50` and `scale-95`;
- generic font conveniences such as `font-sans`;
- whole-class bundles and enums such as `flex-1` and `items-center`;
- negative-value spelling and refusal on properties without negative support;
- safe refusal when one candidate prefix and value could name two configured
  token families;
- passthrough for syntax the Tamagui candidate grammar does not own.

## Reproduction commands

Run these from `code/core/tailwind`. They only create configs and call the local
runtime. They do not publish, release, dispatch a workflow, or mutate package
manifests.

### Token/theme precedence

```sh
bun -e '
import { defaultConfig as v6 } from "@tamagui/config/v6";
import { StyleObjectProperty, StyleObjectValue } from "@tamagui/helpers";
import { createTamagui } from "@tamagui/web";
import { tailwindStyleFrontend } from "./src/frontend";
import { View } from "./src/index";
import { splitTailwindStyles } from "./src/__tests__/utils";

const tokens = {
  ...v6.tokens,
  color: { ...v6.tokens.color, $collision: "#112233" },
};
const themes = {
  ...v6.themes,
  light: { ...v6.themes.light, collision: "#445566" },
};
const config = createTamagui({ ...v6, tokens, themes });
const resolve = (props) => {
  const result = splitTailwindStyles(View, props, {
    theme: config.themes.light,
    themeName: "light",
  });
  const out = { ...(result.style || {}) };
  for (const rule of Object.values(result.rulesToInsert || {})) {
    const prop = rule[StyleObjectProperty];
    if (prop != null && out[prop] === undefined) {
      out[prop] = rule[StyleObjectValue];
    }
  }
  return out;
};
const candidateProps = tailwindStyleFrontend.preprocessProps(
  { className: "bg-collision" },
  config
);
console.log({
  candidateProps,
  flat: resolve({ backgroundColor: "collision" }),
  candidate: resolve(candidateProps),
});
'
```

### Opacity validation

```sh
bun -e '
import { defaultConfig as v6 } from "@tamagui/config/v6";
import { StyleObjectProperty, StyleObjectValue } from "@tamagui/helpers";
import { createTamagui } from "@tamagui/web";
import { tailwindStyleFrontend } from "./src/frontend";
import { View } from "./src/index";
import { splitTailwindStyles } from "./src/__tests__/utils";

const config = createTamagui(v6);
const resolve = (props) => {
  const result = splitTailwindStyles(View, props, {
    theme: config.themes.light,
    themeName: "light",
  });
  const out = { ...(result.style || {}) };
  for (const rule of Object.values(result.rulesToInsert || {})) {
    const prop = rule[StyleObjectProperty];
    if (prop != null && out[prop] === undefined) {
      out[prop] = rule[StyleObjectValue];
    }
  }
  return out;
};
for (const opacity of ["50", "50.5", "150"]) {
  const value = `slate-500/${opacity}`;
  const candidateProps = tailwindStyleFrontend.preprocessProps(
    { className: `bg-${value}` },
    config
  );
  console.log({
    value,
    candidateProps,
    flat: resolve({ backgroundColor: value }),
    candidate: resolve(candidateProps),
  });
}
'
```

### Modifier collision

```sh
bun -e '
import { defaultConfig as v6 } from "@tamagui/config/v6";
import {
  createGrammarConfigView,
  createModifierRegistry,
  parseCandidate,
} from "@tamagui/style-grammar";
import { createTamagui } from "@tamagui/web";
import { tailwindStyleFrontend } from "./src/frontend";

const config = createTamagui({
  ...v6,
  themes: { ...v6.themes, web: v6.themes.light },
});
const view = createGrammarConfigView(config);
const modifiers = createModifierRegistry(view);
console.log({
  registryKind: modifiers.registry.get("web"),
  diagnostics: modifiers.diagnostics,
  parsedCandidate: parseCandidate("web:p-4", view),
  candidateProps: tailwindStyleFrontend.preprocessProps(
    { className: "web:p-4" },
    config
  ),
});
'
```

### Focused existing tests

```sh
cd ../style-grammar
bun x vitest --run \
  src/__tests__/candidate.test.ts \
  src/__tests__/modifierRegistry.test.ts \
  src/__tests__/resolvePayload.test.ts
```

Audit result: 3 files passed, 98 tests passed.

## Implementation boundary

The durable fix should preserve this division:

- Shared contracts own token category, exact-name precedence, reserved idents,
  opacity validity and meaning, and modifier kind.
- Candidate code owns class spelling, brackets, conveniences, bundles, and
  ambiguity refusal.
- Candidate reconstruction must not change a name's selected reference or a
  modifier's kind before the prop reaches shared contribution.
- Behavior tests should compare final web and native values from flat props and
  equivalent candidates, including invalid inputs and namespace collisions.
- The three shared contracts landed before candidate consumption changed.

The original audit made no source fix. The follow-up closed the three
wrong-value findings while leaving the separately ruled group/container work
open.
