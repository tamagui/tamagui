# Scope: the DOM native lowering pass

Written by Lane D, 2026-07-31, to answer one question before anyone commits to
building it: **is this a session or a campaign?**

**Verdict: a campaign, not a session.** Two of the six work items are design
decisions with correctness risk rather than implementation, and one is a schema
change that ripples into generated code and the conformance suite. A minimum
subset that gets native DOM from *not functional* to *functional with gaps* is
about half of it and is separable — see the end.

Nothing here is built. This is the read of the code, with the parts I verified
marked as such.

## What is actually missing

`lowerModule` runs the structural pass, replaces `module` with its output, then
iterates `module.elements` doing style lowering. Two facts, both read from the
source:

1. `domStructuralPass` removes DOM elements from `module.elements` after
   rewriting them (`elements: module.elements.filter(...)`), and style lowering
   runs after. DOM elements never reach it.
2. Even if they did, the loop starts `host.resolveComponent(element, …)`, which
   builds its result from a real `staticConfig` resolved from a `styled()`
   definition or an imported Tamagui component. A raw `html.div` has neither, so
   it resolves to `null` and the element is skipped.

So "stop deleting them" is necessary and nowhere near sufficient.

## The six work items

### A. A resolvable descriptor per tag — *medium, with a real shortcut*

`resolveComponent` needs to return something for a DOM element: valid styles for
the backing, `isText`, the tag's default props.

The shortcut is that this data already exists in generated form. `html.tsx` is
generated from the same tables and already emits, per tag, exactly a
`staticConfig` spread plus `Component`, `isInput`, the element defaults, and a
separate React display name. The compiler could consume an equivalent generated
table rather than inventing a second source of truth. That is the difference between
this item being a day and a week, and it is the strongest argument for whoever
builds this to be the person who owns the tables.

### B. Pass ordering, and the edit-conflict question — *hard, a design decision*

Two options, both with a real problem:

- **Keep DOM elements in `module.elements`** and let style lowering handle them.
  Clean in principle. But `domStructuralPass` is already emitting source edits
  for the same JSX ranges (tag rewrite, primitive injection), and style lowering
  emits its own. The infrastructure clearly cares about this — `validateSourceEdits`,
  `overlapsCommitted` and `editsAreCandidateLocal` all exist — so two passes
  rewriting one element needs the overlap rules worked out, not assumed.
- **Have the structural pass invoke style lowering itself** for its elements.
  Avoids overlap but duplicates the lowering entry point and puts DOM-specific
  ordering knowledge inside a pass that should not need it.

This is the item I would not want anyone to guess at. It is where a wrong choice
produces corrupted output rather than a missing feature.

### C. Parent display resolution — *hard, needs tree context the loop does not have*

Emulating `display: block` needs the element's own display **and its parent's
resolved display** — that is what `NATIVE_BLOCK_DEFAULTS` being applied
conditionally means. `module.elements` is a flat list. `domStructuralPass`
already computes nesting (it reports invalid nesting), so the knowledge exists
in that pass but not in the style loop, and it would have to be threaded.

There is also a static/dynamic split: an author can set `display` dynamically,
and the compiler cannot resolve the parent chain through a component boundary.
Both need a defined answer — most likely a diagnostic — rather than a silent
default. React Strict DOM solves this with a runtime context precisely because
it is not always statically knowable; doing it at build time means deciding what
happens when it is not.

### D. `AttributeRow` schema extension — *medium, ripples outward*

The current row cannot express the cases the mapping actually needs:

| case | what it needs |
|---|---|
| `tabIndex` → `focusable` | inversion (`focusable = !tabIndex`) |
| `disabled` | fan-out to `disabled`, `focusable`, and `editable` on text entry |
| `readOnly` → `editable` | per-tag branching plus inversion |
| `aria-hidden` | a conditional Android companion (`importantForAccessibility`) |
| `aria-live: off` | value mapping to `none` |
| `type` on `input` | branching into `keyboardType` and `secureTextEntry` |

Whatever shape this takes has to be consumed by the prop-interface generator and
checked by the conformance suite, so it is not a local change. It should be
designed **with** item B rather than before it, because the emission shape
determines what the schema has to express.

### E. Value-level native diagnostics — *small*

Unsupported tags, props and nesting are already rejected. Unsupported *values*
are not.

### F. Tests that would have caught this — *small, and the most overdue*

The existing DOM tests assert runtime behaviour and types. Nothing asserts
transformed output for the native path beyond one snapshot, which is exactly why
a contract describing unimplemented lowering survived review. Any work here
should pin the emitted style object per tag, not just the primitive name.

## The minimum viable subset

If the goal is to stop shipping something that does not render correctly, rather
than to complete the design:

**A + B + C** gets element defaults and block emulation onto the element. That
is the difference between *not functional* and *functional with known gaps*.
D and E can follow independently, and F should ride along with whatever lands.

That subset is still not a session, because B and C are both design decisions.
But it is a coherent first piece with a testable end state, which the whole
thing is not.

## One thing to decide first, cheaply

Before any of this: **is native DOM mode in scope for the V3 beta at all?**

The web path works and is tested. The native path needs the above. If native DOM
can ship after the beta, this becomes a well-scoped follow-on with no schedule
pressure, and the honest interim position is the one now recorded in
`contract.ts` — native DOM mode is not functional, and the entry points say so.
That is a cheaper decision than building to a date.
