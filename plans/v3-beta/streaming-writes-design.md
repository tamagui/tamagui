# Streaming writes: deleting the neutral frame

Owner mandate (Nate via r4674, 2026-08-28): the neutral frame / deferred
completion is on trial. Null hypothesis is V2's shape: stream every
contribution at write time, keep one winner integer per property, emit CSS
immediately, replace in place. Every piece of retained machinery must name the
failing test that requires it, or be deleted.

## The winner rule

V2's entire cascade was `usedKeys[key] > importance ? skip : write`. V3
already computes a strictly better integer: the packed condition
(precedence*256 + flags). Streaming state:

- `flatUsed: Record<string, number>` mapping property -> winning importance,
  threaded once per pass (never copied, unlike V2's per-pseudo spreads).
- importance = 0 for base, precedence+1 for an active condition.
- write: `if ((flatUsed[p] || 0) > imp) return; apply; flatUsed[p] = imp` —
  later write wins ties, exactly the current sequence tie-break.

## Concept mapping (what replaces what)

| today | streaming |
| --- | --- |
| frame entry + slot array per property | nothing: compare-on-write against `flatUsed` |
| completion winner loop (`completeStyleFrame`) | nothing: winner already applied |
| CSS slot combination (`completeFrameCSS` + `registerSlot`) | immediate per-(property, identity) class emission; precedence encoded via `slotClassRepetitions` specificity repetitions, cascade resolves order |
| repeat-write in-place entry mutation | rebuild + replace that (property, identity) class slot; identity cache makes displacement a lookup |
| weak styled-default restore | presence check on `flatUsed` (write only if absent) |
| tombstone retraction | `delete style[p]` + mark `flatUsed[p]` at the retracting importance |
| enter/exit key collection | unchanged: collects while streaming (already flag-based) |
| cursor selector/wrapper text fields | computed only at CSS emission; streaming state is the packed number |

## Residue candidates (keep ONLY with a named defending test)

1. Compound output anchors after the last selecting prop
   (`compoundVariants.web.test.tsx`, ordering cases): compounds cannot stream
   at first sight. Trial: keep the arena, and ALSO try a simpler post-pass —
   compounds contribute at loop end with importance from their condition; if
   the corpus and suite agree, the arena falls too.
2. Transition longhand grouping into one record
   (`baseTierFrame.web.test.tsx` grouped-transition pin, transition suites):
   longhands must merge into one CSS record. Minimal: a per-pass transition
   record, streamed into, emitted once at end — a record, not a frame.
3. Border-style synthetic defaults (`borderStyleDefault` tests): the default
   must yield to an authored style arriving LATER in the pass. Minimal: keep
   the request list, resolve at end against `flatUsed` — a list, not entries.
4. Web shadow parts accumulate into one boxShadow (`shadow` suites): already
   a packed record (bdba), streams fine, emit at end.
5. HOC transported clause replay: replays into the same streaming writes; no
   frame dependency.

## What deletes

`StyleFrameEntry`, `flatFrame`, `frameWrite`, `frameWriteInline`,
`completeStyleFrame`, most of `completeFrameCSS`/`registerSlot` (single-slot
emission helper stays), the base tier just added (3ced8c4af7 — it exists to
cheapen the frame; no frame, no tier), FRAME_TOMBSTONE, frameSequence, and
the cursor's deferred selector/wrapper width where emission-time computation
covers it.

## Output-shape change

One class per (property, condition identity) instead of one combined class
per property. Same rendered cascade (repetition-encoded precedence, the
existing `slotClassRepetitions`). classNames keys gain identity suffixes for
conditional contributions, as V2's `${key}${PROP_SEP}${pseudo}` did. Compiler
snapshots and class-asserting tests move with it; rendered-output pins must
not change.

## Decision rule

Implement, run the full behavior matrix, then paired corpus + micro + size
against base d48e1adc0b AND against tier-1 3ced8c4af7. Data picks the winner;
the loser's commit is reverted. Gate remains: beat base on BOTH processor
gzip and corpus timing.
