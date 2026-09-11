# Decision-24 component lowering proposals

Status: parked for an explicit architecture decision. Neither proposal is an
active implementation plan.

## Evidence

The kitchen-sink metric currently reports 2,556 found / 2,029 lowered / 2,016
flattened / 55 styled / 527 bailed. Of those bailouts, 337 come from components
whose runtime structure cannot be erased by the current compiler contract.

The largest entries are:

| Count | Component | Loaded static config |
| ---: | --- | --- |
| 203 | `Button` | behavior HOC, `neverFlatten`, styled size context |
| 45 | `Input` | behavior HOC, `neverFlatten`, no styled context |
| 23 | `Label` | behavior HOC, `neverFlatten`, no styled context |
| 12 | `ListItem` | behavior HOC, `neverFlatten`, styled size/variant/color context |
| 8 | `XGroup` | behavior HOC, `neverFlatten`, no styled context |
| 7 | `Card` and `StyledCard` | pure styled frames, `neverFlatten` because of styled size context |

Styled-context resolution therefore cannot unlock the main `Button`, `Input`,
`Label`, or `XGroup` volume. Their HOCs execute behavior beyond style and
context lookup.

## Parked context-island lowering

A pure styled frame can consume a styled context while resolving its own
variants and provide overridden context values to descendants. Flattening one
element in isolation can change either side of that contract.

A correct compiler implementation would:

1. Build a parent-first context environment for nested, statically materialized
   elements.
2. Merge default values, inherited context, and authored props in runtime order.
3. Propagate resolved context overrides to descendants using the exact context
   object identity.
4. Preflight the whole context island and commit every element atomically.
5. Retain the runtime path for an unshadowed ancestor context key, a dynamic
   context prop, a dynamic child expression, an unresolved component boundary,
   or any descendant consumer that cannot flatten.

Removing the provider while a dynamic consumer remains would freeze or lose the
value that the consumer reads at runtime. Flattening a consumer with an
unshadowed key would ignore a provider mounted outside the compiled module.

The current corpus offers seven Card-family cases. One is a leaf and six need
descendant propagation. Recovering at most 0.3% of the 2,556 elements does not
justify transactional context-island machinery today.

If revisited, proof must include:

- transformed-output tests for a leaf and a parent/consumer island;
- negative output tests for dynamic ancestors, values, children, and consumers;
- identical class hashes from compiler and runtime `getSplitStyles`;
- webpack DOM snapshots proving a static Card size reaches `Card.Header`;
- a webpack snapshot proving a dynamic consumer retains the runtime provider.

## Parked explicit component-lowering descriptor

Recovering behavior HOCs requires an explicit, versioned contract supplied by
the component package. The compiler cannot infer arbitrary hook and render
function behavior from `StaticConfig`.

### Required descriptor semantics

A descriptor would have to encode:

- supported targets and the semantic host selected from static props and
  compiler-visible context;
- style-frame identity and the exact default/variant inputs passed to it;
- prop projection, omission, renaming, and accessibility adaptation;
- child expansion, including text wrappers and ordered icon slots;
- context reads, provider writes, scope rules, and values propagated to each
  generated child;
- event, ref, effect, state, and hook predicates that force runtime retention;
- generated imports and a stable version hash for compiler caches;
- an actionable retention reason when any predicate fails.

The descriptor should be declarative and JSON-safe. Executing arbitrary
component code in the compiler would reproduce runtime React evaluation,
introduce target-dependent side effects, and make cache identity unreliable.
If the declarative form cannot express a component, that component retains its
runtime path.

### Button requirements

`Button` alone would require the descriptor to reproduce:

- `button`, `span`, or `a` host selection from nesting, role, disabled state,
  and the authored `render` prop;
- disabled, `aria-disabled`, role, and tab-index projection;
- literal-child wrapping in `ButtonText`;
- icon and icon-after resolution in the correct order;
- `ButtonNestingContext`, text `ButtonContext`, and named-size context
  propagation;
- a runtime bailout for responder events, refs, dynamic icons or children,
  external context values, and any hook-dependent branch.

Many of the 203 Button occurrences contain `onPress`, dynamic children, icons,
theme boundaries, or nesting-sensitive behavior. The count is a theoretical
ceiling, not an expected metric improvement.

### Cost and benefit

The descriptor creates a public compiler ABI that each participating component
must maintain beside its runtime implementation. It also requires grouped edit
transactions for generated child trees, target-specific conformance work, and
ongoing review whenever runtime behavior changes.

The benefit is a principled path for selected library components to reach plain
elements without teaching the compiler component names. Button plus its styled
wrappers represents roughly 210 current bailouts before the runtime-required
occurrences are removed from that ceiling.

### Required proof

Before shipping a descriptor for Button:

- output fixtures must cover every host-selection and prop-projection branch;
- webpack DOM snapshots must cover text wrapping, icons, disabled state, links,
  nested buttons, size propagation, and authored class names;
- interaction tests must prove every event-bearing case retains runtime
  behavior;
- dynamic context, child, icon, render, ref, and theme cases must retain the
  original component byte-for-byte;
- compiled and runtime style programs must have identical class hashes and CSS;
- the raw metric tuple must keep `found` fixed while `flattened` rises.

