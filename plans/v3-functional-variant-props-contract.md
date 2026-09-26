# V3 functional variant props contract

Status: declined after runtime probes and repository audit. `extras.props`
keeps its current merged contract. This record authorizes no implementation.

## Decision

Narrowing `extras.props` to the caller record buys no deletion or allocation
win. `mergeComponentProps` must still create `nextProps` for style resolution,
compound matching, state, and forwarded view props. `getVariantExtras` must
still provide tokens, theme, fonts, context, and props. Giving variants a
different record wherever styled context exists requires a second props
representation and another render allocation.

The honest expectation is zero CORE benefit trending toward a small regression,
plus one render allocation for context-bearing components. That does not
justify a public API break where user variants that read a default or inherited
context prop would silently start seeing `undefined`. `extras.props` therefore
stays merged and mutable exactly as it is today.

The proposal lasted too long because its original justification had already
disappeared. It began as a way to remove a Proxy. The only Proxy was dead
`IS_STATIC` source with no producer in compiler-core, static, loader,
vite-plugin, metro-plugin, or codemod paths. Deleting it was correct and moved
production CORE by zero bytes because the production build already removed the
branch. That deletion justifies no further contract change.

Two of the three claimed internal migrations also did not exist, and the named
external break did not exist. The actual cost was only established after asking
what code and allocation the change removed. This decision should not be
reopened without a one-variable runtime and CORE price.

## Current contract and all props sources

`createComponent.tsx` calls
`mergeComponentProps(defaultProps, styledContextValue, propsIn)` before
`getSplitStyles`. The resulting ordinary object has caller values over inherited
styled-context values over component defaults. Functional variants receive that
record as `extras.props`.

Functional variants can observe four sources:

1. caller props, including later caller siblings;
2. component defaults and default variants folded into
   `staticConfig.defaultProps` by `styled()`;
3. inherited styled-context values merged by `createComponent`;
4. a temporary media or pseudo style overlay written onto `styleState.props` by
   `getSubStyle.tsx:1690-1692`.

The fourth source was absent from the original audit. It is behaviorally pinned
by `getSplitStyles.native.test.tsx:44-70`: a media functional variant sees the
overlaid `kind=danger` instead of the caller's `kind=info`. A global
defaults-plus-original-caller record would silently remove that behavior.

Prior variant output does not enter `extras.props`. A later variant cannot read
a prior variant's returned `opacity` or arbitrary key through `props`. Prior
output can change `extras.fontFamily` and `extras.font`, which is a separate
state channel and remains pinned.

`extras.props` is mutable. A runtime probe mutated the record, deleted a later
prop, and prevented that later variant/style contribution from running. A newly
inserted key was not visited by the active `for...in`. No repository variant
intentionally relies on mutation, enumeration, retention, freezing, property
ownership, or descriptors, but external code may rely on the documented merged
record.

## Corrected repository audit

The earlier proposal claimed three internal dependencies. Runtime probes
reduced that to one:

- `StyledContextTokens` reads a context-provided `gap` through `extras.props`.
  It is the one genuine inherited-context dependency.
- `TextArea` does not receive `rows=3` through default props. That value is
  output of its `unstyled:false` variant, and the wrapped sizing resolver sees
  `rows` and `size` as `undefined` today. There is no migration to perform.
- `SizableText` does not receive `size=$true` through default props. It is
  variant output, and the resolver already falls back to `$true`. There is no
  migration to perform.

The owner also challenged the reported `SurfaceRow` break. The challenge was
correct. `styled.tsx` folds ordinary styled options, inherited defaults,
default variants, child defaults, and child default variants into
`staticConfig.defaultProps`. A runtime read observed
`SurfaceRow.staticConfig.defaultProps.kind === 'row'`, and all eight call sites
receive it through `mergeComponentProps`. That break is withdrawn.

Under the narrower hypothetical change that dropped only inherited styled
context at the `createComponent` merge, the repository has one migration:
`StyledContextTokens` would read `extras.context.gap`. The media/pseudo overlay
would survive because it happens later. Even this narrow change still needs a
second props representation, removes no code, adds allocation, and breaks the
public merged-props contract for external users. It remains declined.

Tabs has no independent bug. Missing `unstyled` and `unstyled=false` produce
the same behavior. A descendant that defaults `unstyled` to true is simply
another reason the merged contract matters.

## Separate larger breaking change

Disallowing variants from returning nested variant keys or other style results
is a separate proposal. It could simplify recursive variant resolution and
parent-variant tracking, but it breaks documented variant chaining, issue 3669,
variant-produced styled context, and the existing `VariantsOrder` and
`StyledContextTokens` cases. Static combinations would need to become
`compoundVariants`, and context changes would need explicit providers or HOCs.

No evidence collected here establishes that this larger break is worth its
compatibility cost. It is not part of the engine-consolidation campaign and is
not authorized by this document.
