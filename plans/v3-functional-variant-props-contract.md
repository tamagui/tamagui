# V3 functional variant props contract

Status: owner decision pending. This document records the current behavior,
repository dependencies, and the smallest coherent v3 break. It authorizes no
implementation.

## Answer

The merged `extras.props` contract is useful, but much less of the repository
depends on it than the public type suggests. Most functional variants use the
variant value plus `tokens`, `theme`, `font`, or `fontFamily`. The direct
repository consumers of `props` mostly read caller siblings, which a
caller-record contract would preserve.

Three internal cases depend on values that did not arrive from that styled
layer's caller: a styled-context gap, TextArea's default `rows=3`, and text
sizing's default `size=true`. All three have direct migrations. No authored
repository variant mutates, enumerates, spreads, retains, freezes, or inspects
property ownership or descriptors on `extras.props`.

A caller-only v3 contract is therefore viable inside this repository. It is
still a public API break because user variants can currently read default or
styled-context values from `extras.props`. Repository usage cannot prove that
external usage is absent.

Narrowing `extras.props` does not remove all prop merging. `mergeComponentProps`
still supplies defaults and styled-context values to style resolution,
compound matching, state, and forwarded view props. `getVariantExtras` still
builds the object that provides tokens, theme, fonts, context, and props. A
claim that this API change deletes either helper would be false.

## Current contract

**READ**: `createComponent.tsx` calls
`mergeComponentProps(defaultProps, styledContextValue, propsIn)` before
`getSplitStyles`. The resulting ordinary object has caller values over context
values over defaults. Functional variants receive that merged record as
`extras.props`.

**READ**: the first functional variant in one split allocates one extras object
plus the `fontFamily` and `font` accessors. The cache is keyed by the fresh
style state, so it does not survive a render. The accessors can read authored
font props more than once, and a returned `fontFamily` getter is read twice by
the current variant resolver.

**READ**: `extras.props` is mutable. A runtime probe mutated the merged record,
deleted a later prop, and prevented that later variant/style contribution from
running. A newly inserted key was not visited by the active `for...in`. There
is no repository variant that intentionally relies on this capability.

**READ**: prior variant output does not enter `extras.props`. A later variant
cannot read a prior variant's returned `opacity` or arbitrary key through
`props`. Prior output can change `extras.fontFamily` and `extras.font`, which is
a separate state channel and must remain pinned.

## Repository consumers

| consumer | reads from `extras.props` | caller-only result |
| --- | --- | --- |
| `get-font-sized` | `fontStyle`, `color`, `debug` | caller siblings survive; default/context values would need an explicit source if they prove behaviorally required |
| `SizableText` | `size`, `fontSize` | caller siblings survive; default `size=true` needs migration |
| `Input` and `TextArea` sizing | `tag`, `rows`, `multiline`, `numberOfLines` | caller siblings survive; TextArea's default `rows=3` needs migration |
| Slider | `orientation` | survives because wrappers explicitly pass orientation |
| Button | `circular`, `size` | normal exported Button survives because its HOC explicitly forwards size |
| Tabs | `unstyled` | current absent value and false are equivalent; a descendant defaulting true would change under caller-only semantics |
| `StyledContextTokens` | context-provided `gap` | needs `extras.context.gap` |

Production variants in Card, Group, ListItem, Shapes, Spacer, Toggle,
elevation, Select, Checkbox, Radio, and most Button and Tabs paths use only the
variant value, tokens, theme, or font accessors.

## Smallest caller-only contract

If the owner approves the v3 break, the narrow contract is:

- `extras.props` is `Readonly<Props>` and is exactly the record supplied by the
  caller to that styled layer before defaults, styled-context merging, or
  frontend rewriting;
- caller key order, descriptors, identity, and all later caller siblings are
  preserved;
- variants must not mutate the record;
- defaults still select variant styles but do not masquerade as caller props;
- styled-context values are read through a correctly typed `extras.context`;
- a HOC establishes a new caller boundary when it constructs and forwards a
  new props object.

The internal migrations are small and independent:

1. `StyledContextTokens` reads `extras.context.gap` and gains a visual/runtime
   assertion that the small and large context gaps produce different widths.
2. The TextArea-specific sizing resolver receives an explicit default row
   count of 3. Ordinary multiline Input keeps its current automatic height.
3. SizableText's font-family resolver receives the known default `size=true`
   explicitly when deciding whether a caller `fontSize` overrides token sizing.

Tabs has no independent bug today. Missing `unstyled` and `unstyled=false`
produce the same result. It becomes a migration only for a styled descendant
whose own default changes `unstyled` to true.

## Separate, larger breaking change

Disallowing variants from returning nested variant keys or other style results
is a different proposal. It could simplify recursion and parent-variant
tracking, but it breaks documented variant chaining, the behavior behind issue
3669, variant-produced styled context, and the existing `VariantsOrder` and
`StyledContextTokens` cases. It should not ride with the caller-record change.

The replacement shape would require static combinations to become
`compoundVariants` and context changes to move to explicit providers or HOCs.
No evidence collected here establishes that this larger break is worth its
compatibility cost.

## Measurement and acceptance

There is no trustworthy one-variable CORE price for caller-only props yet. The
reverted 1a/1b pair changed the fixture and traversal architecture at the same
time, so its gzip movement is not a price for this contract. If approved, the
change needs its own control against the then-current frozen CORE artifact.

Acceptance requires:

- the three internal migrations above;
- functional-variant tests for caller identity, descriptors, later siblings,
  and readonly behavior;
- explicit default/context absence from `extras.props` and presence through
  the intended alternative;
- unchanged prior-output font behavior;
- no Proxy, per-render fallback record, second prop traversal, or extra
  authored getter read;
- a measured CORE result before commit.

The dead static-only `fallbackProps` Proxy is already deleted. Its production
CORE movement was zero because the measured build had already eliminated that
branch.
