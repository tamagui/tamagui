# Design: DOM lowering pass ordering and parent display resolution

Written by Lane E, 2026-07-31, at the manager's request. This settles the two
decisions `plans/v3-dom-native-lowering-scope.md` marked as the ones not to
guess at (its items B and C), gives a verdict on the descriptor seam (item A),
and ends with the beta-scope recommendation. Nothing here is built; line
references are at `0cca09f47e`.

Everything below was read from the source, not the docs:
`code/compiler/compiler-core/src/lower.ts` and `output.ts`,
`code/compiler/static/src/domStructuralPass.ts` and `compilerHost.ts`,
`code/core/dom/src/tables/*`, `code/core/web/src/dom/contract.ts`,
`primitives.native.tsx`, and generated `html.tsx`.

## Decision 1: pass ordering

### The facts that decide it

1. **Tag rewriting is already candidate work for every regular component.**
   The flatten path in `compilerHost.ts` emits the opening and closing tag
   edits itself, in the same transactional result as the style edits
   (`compilerHost.ts:1125` for web, `:1208` for native). The structural pass
   doing tag rewrites for DOM elements is not a parallel architecture; it is a
   workaround for DOM elements not being resolvable as candidates. Fix the
   resolvability (Decision 3 below) and the workaround has no reason to exist.

2. **The candidate machinery is already transactional and already verifies
   overlap.** Each candidate commits all edits or none (`lowerModule`,
   `lower.ts:210`), edits must sit inside the element span
   (`editsAreCandidateLocal`), must not overlap committed edits
   (`overlapsCommitted`), and the final plan is re-validated at apply time
   (`validateSourceEdits` throws on any range overlap). Structural edits get
   none of this per-element treatment: they commit first, unconditionally.

3. **Two writers on one element cannot be made safe by ordering rules.** The
   structural pass writes `component.span`/`closingSpan`; the style path
   writes exactly the same spans. Any scheme where both passes edit one
   element needs a merge protocol over JSX ranges, and the existing
   infrastructure correctly treats overlap as an error, not something to
   resolve. The failure mode of "keep DOM elements in `module.elements` and
   let both passes run" is not corruption (the guards throw or bail loudly);
   it is a guaranteed `local/overlapping-edit` bailout on every DOM element,
   with which pass wins decided by commit order. That is the wrong-by-
   construction shape.

### The design: DOM elements are ordinary lowering candidates

One writer per element, decided by classification, never by arrival order:

- `host.resolveComponent` returns a real `LoweringComponent` for every
  element with `html` provenance, built from the generated per-tag descriptor
  (Decision 3). Unknown tags and `native: 'none'` tags also resolve, so their
  rejection flows through the normal bailout channel with a diagnostic
  instead of being silently skipped by a `null` return.
- `host.lowerCandidate` grows a DOM branch that emits **all** rewrites for
  the element in one transactional result: tag spans (primitive local on
  native, literal tag on web), style flattening (element defaults + display
  emulation + tag defaults + author styles), prop renames, and the
  literal-text wrapping edits (child entry spans are inside the element span,
  so `editsAreCandidateLocal` already admits them).
- `domStructuralPass` stops emitting source edits entirely. What survives of
  it is analysis and identity: tag classification, nesting validation, and
  the table content hash. The hash must stay in the plan identity
  (`structuralPassHash` today); if the pass is deleted outright, the same
  hash moves into the host's contribution to plan identity. Either is fine;
  losing table changes from cache identity is not.
- Primitive import injection moves to candidate `imports`, which are already
  deduplicated by content string and appended once (`lower.ts:333`,`:344`),
  the same mechanism the native flatten path uses for its `require()` lines.

### The invariant that makes double-rewrite impossible

> Every source edit inside an element's span is emitted by exactly one
> `lowerCandidate` call, the one for that element, and a candidate's owned
> region is its own span **minus the spans of descendant element entries**.

The first half holds by construction once no module-level pass emits
element-span edits. The second half closes the one real hole found in this
read: element spans nest, so `editsAreCandidateLocal` as written would let a
parent candidate edit inside a nested child element's range. In JSX form the
current emission never does (tag spans, prop entry spans, and literal-text
child spans are all disjoint from nested element spans by the grammar), but in
compiled `jsx`/`jsxs`/`createElement` form `compiledPropsContent` rewrites the
**whole** `propsSpan`, and a compiled `children:` property lives inside
`propsSpan`. A parent whole-props rewrite there swallows nested element spans
today; the nested candidate then bails on `overlapsCommitted`, order-dependent.

So the invariant gets enforced mechanically, not assumed:

- extend `editsAreCandidateLocal` to also reject any edit overlapping a
  child entry span of kind `element`. Direct children suffice; the exclusion
  is inductive (an edit that avoids every direct child span cannot reach a
  grandchild span). This is a few lines in an existing guard and turns
  "unlikely" into "checked per candidate, rejected transactionally before
  commit".
- the DOM branch in compiled form must therefore edit per-entry spans (the
  same strategy the JSX path uses) whenever `propsSpan` contains element
  children; whole-props replacement is only legal when it contains none.
  Regular components in compiled form have the same latent forfeit today
  (parent commits, nested candidate bails); the strengthened guard makes that
  a visible per-candidate diagnostic instead of an ordering accident.

`overlapsCommitted` and `validateSourceEdits` remain exactly what they are
now: verifiers that turn a violated invariant into a loud failure. They are
never the resolution mechanism.

### Bailout severity splits by target, and that is the contract

- **Web**: a DOM candidate that cannot lower (dynamic style it cannot prove)
  bails and leaves the element untouched. `html.*` on web is a real runtime
  component that renders the literal tag, so the runtime path is a correct
  fallback. This is the same opportunistic semantics every regular candidate
  has.
- **Native**: there is no runtime path. The primitives are hookless and
  contentless by design, and `contract.ts` pins "compiler required on native,
  missing compiler is a build failure". A DOM candidate bailout on native is
  therefore a **build-failing diagnostic naming the reason**, never a
  silently-unstyled primitive. This extends the existing rule from "compiler
  absent" to "compiler present but cannot resolve", which is the campaign
  line: unsupported input is a diagnostic, never a silent approximation.

One deliberate relief valve keeps that strictness livable: a *dynamic style
handle* on native does not have to bail. React Native accepts style arrays, so
the compiler can always emit `style={[STATIC, <author expr>]}` where `STATIC`
carries everything the compiler owns (element defaults, display emulation, tag
defaults) and the author's handle composes after it at runtime. Only inputs
that would change what `STATIC` must contain (see Decision 2, dynamic
`display`) are hard diagnostics.

### Rejected alternatives

- **Structural pass invokes style lowering for its elements** (scope doc
  option two): inverts ownership, duplicates the transaction/validation/stats
  machinery inside a pass, and hides candidate edits from `lowerModule`, so
  stats, diagnostics routing, and the overlap verifiers all stop covering
  them.
- **Both passes edit with priority rules**: see fact 3. Overlap stays an
  error; ownership becomes exclusive instead.

### Consequences to plan for

- **The tuple moves.** DOM elements entering the candidate path increment
  `found` (and `lowered`/`bailed`). The pinned `found: 2,556` baseline shifts
  by exactly the DOM fixture element count; that is a coordinated rebaseline
  with the tuple owner in the same change, not drift.
- **A web bug gets fixed by construction, and it is worth naming now**: the
  current pass rewrites `html.*` to a literal tag on web *unconditionally*
  (`domStructuralPass.ts:203`). Generated `html.*` on web are ordinary
  Tamagui components that accept regular style props (stated in `html.tsx`
  itself), so today `<html.a color="red">` compiles to `<a color="red">` and
  the style prop lands on the DOM as a junk attribute whenever the compiler
  runs. Candidate ownership makes the web tag rewrite conditional on the same
  analysis as the styles, which removes this class of bug entirely.

## Decision 2: parent display resolution

### What actually depends on the parent

The emulation constants are corrections for CSS defaults React Native does not
have, and the correct set for an element is a function of two inputs: the
element's own display and its parent's **resolved** display. A block element
in block flow needs `flexShrink: 0` and relies on the parent's
`alignItems: stretch`; the same element as a flex item needs CSS flex-item
defaults (`flexShrink: 1`) that differ from RN's. That is why
`NATIVE_BLOCK_DEFAULTS` cannot be applied from the tag table alone, and why
RSD reads a display-inside context per element at runtime.

Three cases, three rules:

### R1. Same-module parent, static display: resolve statically

The analyzer computes the parent chain from `module.elements` (spans nest;
the parent is the smallest element whose span strictly contains the child's —
the same derivation `domStructuralPass` uses for nesting diagnostics today,
so no new tree machinery). Parent resolved display = tag default display,
overridden by a statically-resolved authored `display` if present. This is
the overwhelmingly common case in DOM-mode code, which is written as `html.*`
subtrees.

### R2. Component boundary: a defined block-flow context, in the contract

When the element is the root of its module-local DOM subtree, the parent is
whatever renders the component, and no compiler can see through that. The
rule: **a component boundary establishes block flow formatting context.**
The subtree root is compiled as if its parent were a block container, which
is exactly the semantics CSS gives the initial containing block.

This is deliberately **not** classified as unsupported input, and the
campaign line is the reason why, applied precisely: the line forbids *silent
approximation of inputs the design refuses*. A component root is fully
supported input whose semantics the contract *defines*, the same way CSS
defines the root element's context rather than erroring on it. Defined,
documented, deterministic, conformance-tested is not silent.

The one real deviation this creates: placing a component's DOM subtree
directly inside a flex container in *another* module gives the subtree root
block-child corrections where the browser would give it flex-item behavior.
The remedy is already in the contract: style handles compose through props
and merge as RN style arrays, so the call site (which statically knows its
own flex context) passes the flex-item corrections down
(`<Card style={flexItem} />`). That goes in the compatibility table with a
conformance fixture pinning both sides: the boundary default, and the
handle-composition remedy.

Why not the alternatives:

- **Diagnostic at the boundary** would make every component-rooted DOM
  element a build error. Component composition is the normal case, not an
  edge; a design that bans it is not a design.
- **Runtime context** (RSD's answer) re-adds a per-element context read and
  ends the hookless-primitive design whose whole measured claim (4.03
  objects, 236 B, bare-element parity) is that the compiler resolved this
  statically. Paying the RSD cost per element to avoid documenting a boundary
  rule buys the wrong thing with the expensive budget.

### R3. Dynamic `display` on native: build diagnostic

If the element's own `display` is not statically resolvable to a single value
(a dynamic expression, or a clause-bearing value like `'flex sm:block'`),
the compiler cannot choose the emulation set, and every escape from that is a
disguised runtime resolver: emitting both default sets behind a runtime
switch is a fallback fork, and deferring to the primitive is the RSD model
again. So on native, `display` on a DOM element accepts exactly one static
value, and anything else is a build diagnostic naming the constraint (web is
untouched; browsers do display natively). This is the genuine
unsupported-input case, and it gets the campaign treatment: a diagnostic,
never an approximation. If a real need for breakpoint-conditional display on
native DOM appears, it is a design item for the media system, not a quiet
widening here.

A child whose *parent* has the R3 diagnostic needs no rule of its own: the
build already failed at the parent.

### One correction to land with the build

`nativeBacking.ts:11` currently says the block/flex constants "are applied by
the primitives, not by the tag table, because they depend on the parent's
resolved display". That contradicts `contract.ts` and this design: the
primitives are hookless and apply nothing; the *compiler* applies these using
statically resolved parent display per R1/R2. The comment predates the
hookless primitives and must be rewritten when this lands, or it will send
the next reader to the wrong layer.

## Decision 3 (the seam question): agree, with one precision

Agreed that the generated tables are the source of truth and the compiler
must consume a generated equivalent rather than a second hand-built table.
The precision worth adding, from reading what `lowerCandidate` actually
needs: the descriptor alone is not a `staticConfig`, and it does not need to
be. Compose it the way `html.tsx` itself does:

- **Per-tag data** (backing, `isText`, `isInput`, default props including the
  display-keyed web reset and tag defaults, implicit role): a second emission
  target of the existing `generate-html.ts`, pure data, importable by the
  static package exactly like `TAGS`/`ATTRIBUTES` already are, and hashed
  into plan identity alongside the other tables.
- **Base config behavior** (style prop validity, resolution): the host
  already holds a loaded core; take `viewStaticConfig`/`textStaticConfig`
  from it and spread the descriptor over them, which is literally the
  generated `html.tsx` recipe (`{...viewStaticConfig, componentName: tag,
  defaultProps: {...}}`).

Do **not** resolve descriptors through the runtime module registry (looking
up the generated `html.div` component's `staticConfig` from the loaded
bundle): it couples plan cache identity to loaded-module state that cannot be
hashed, which is the exact confound the table `versionHash` exists to
prevent. With the generated-table seam, item A is the day, not the week; I
agree with the estimate and with who should build it (the tables' owner).

## Recommendation: native DOM mode is out of the v3 beta

My read as the person who would build it, alongside OPUS's:

**Ship the beta with native DOM mode explicitly gated**: the current
`contract.ts` posture (not functional, entry points say so) hardened into an
explicit native build error naming post-beta status. Web DOM mode ships,
minus the unconditional-rewrite bug named above, which should be fixed
regardless of this decision.

Reasons, in order of weight:

1. **The honest minimum is a campaign.** A + B + C from the scope doc, plus
   this design's guard changes to shared candidate machinery
   (`editsAreCandidateLocal`, bailout severity by target), plus D's schema
   ripple. Every piece touches the lowering path the flat-value compiler
   ships on; that is churn in the beta's hottest shared surface during
   stabilization.
2. **"Functional with gaps" is the one state the campaign refuses.** Between
   not-functional-and-says-so and fully-lowered there is no honest
   intermediate for native layout: partial emulation renders *almost* like
   the browser, which is a silent approximation shipped at scale. The gate we
   have is the correct interim product.
3. **Nothing in the beta's headline depends on it.** Flat values, the
   Tailwind frontend, web DOM, and the codemod are all independent of native
   DOM lowering. The tuple rebaseline this design forces is also cleaner
   taken after the beta's numbers freeze.

What makes the post-beta build fast is exactly what is now done: the tables
exist and are pinned, the two hard decisions are settled above, the seam is
generated data, and the guard changes are small and testable in isolation.

## Findings surfaced by this read (for the manager, not scheduled)

1. Web `html.*` with style props is broken under the compiler today
   (unconditional literal-tag rewrite, `domStructuralPass.ts:203`; details in
   Decision 1). Worth a pinned failing fixture even before any of this lands.
2. Compiled-form whole-props replacement can swallow nested candidate
   elements' spans, making nested lowering order-dependent for *regular*
   components too (`compilerHost.ts:195`). The strengthened
   `editsAreCandidateLocal` in Decision 1 covers it; until then it is a
   latent forfeit, not a corruption.
3. The `nativeBacking.ts` header comment assigns block/flex emulation to the
   primitives, contradicting `contract.ts`. Doc-only, but it points the next
   builder at the wrong layer.
