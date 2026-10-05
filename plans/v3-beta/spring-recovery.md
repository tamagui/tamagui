# Current beta recovery

## Owner direction

2026-10-04 Honolulu, 2026-10-05 UTC: Nate said, "for tamagui its for v3 beta ofc and one for v2 beta ofc" (original human turn in `tm show prompts m20266`). The replacement assignment authorizes a detached Sol medium manager with Muse Max Spark contributor assistance for existing essentials/native work and CI. Integration targets `v3-beta`. Main and stable releases retain their owner gates. No new look or public API belongs to this lane.

## Ownership and boundaries

- Manager and CI owner: `p61058`, replacing startup failure `p61036`, whose prompt never arrived.
- Operations: `p60562`. Assigned substantive protected review: `p60786`.
- Public formatting assistance may use a verified fixed subscription Muse Max Spark contributor account. Tamagui styling, variants, themes, compiler, and private downstream source/evidence stay with Sol.
- Preserve parked site claims, Bento design work, deferred campaigns, existing Contrast native87 ownership, and every Air32 lane.
- Workers deliver focused validation and pushed branches, preserve evidence outside their worktree, clean only owned resources, then finish. The manager owns downstream CI.

## Assessment

RAN: fetched `origin/v3-beta` at `ba31b9ffe0291aad963e042298748649d68b5d6e`. Local main is clean and stays on main. Fleet listing reports complete and has no other live Tamagui implementation owner. Failed launch `p61036` is exited; `tm show prompts` reports no user turns.

RAN: `v3/ci-green` has no commits absent from current beta. Its sheet renderer repairs and prior CI work need no second integration.

RAN: Checks run `37230632301` fails formatting in `code/tamagui.dev/components/ComponentPreview.tsx` and the zero-runtime starter islands JS size limits. Typecheck passed. Registry `37230632294`, Detox `37230632465`, and Maestro `37230632553` succeeded at the same SHA. Release `37230632291` succeeded. This does not establish that Checks is green.

RAN: the historical native selection task `t-mu0hqgw9-17za0` predates the finish plan's recorded selection fix. Reassess current source before treating that stale task as unfinished. The launch-site task remains blocked on owner access and held claims. No broad native or design campaign is resumed from historical notes.

## Delivery gates

1. Repair the formatting failure without changing rendered behavior.
2. Diagnose the actual islands size growth against the owning source and retained CI artifacts. Preserve assertions and thresholds. A supported source repair needs a failing baseline, passing candidate, and appropriate runtime controls. Do not blindly update a size baseline.
3. Route a protected proposal and assembled repair once to `p60786`, keeping core source out of Muse packets.
4. Serialize branch integration, push only the approved beta target, and verify required Checks, native workflows, registry, and beta artifact contents. Record actual validation and remaining limitations.

## Current state

Assessment complete; formatting and size repairs are being assigned. No source change, beta push, or main/stable action has occurred.

## Protected islands size lane

Owner: `tm/spring-v3-size`; task `t-muuquhxo-17go0`. CI owner `p61058`;
proposal and assembled substantive reviewer `p60786`. No helpers.

RAN: downloaded starter receipts from Checks `37230632301` at
`ba31b9ffe029`. The separately emitted islands exceed all three unchanged
zero-byte thresholds. All page JavaScript counts remain equal to the committed
baseline. No page or island contains the forbidden artifact families.

| measurement | Vite island gzip | Next island gzip | Metro island gzip |
| --- | ---: | ---: | ---: |
| committed ceiling | 73,341 | 73,359 | 124,079 |
| last green `37176904590`, `980b3a3803` | 73,341 | 73,347 | 124,077 |
| first red `37222343320`, `e4e3d2c91b` | 73,369 | 73,379 | 124,109 |
| current CI `37230632301`, `ba31b9ffe029` | 73,379 | 73,393 | 124,115 |
| local current source, Node 24.16.0 | 73,379 | 73,393 | 124,115 |
| media fix removal control, same local toolchain | 73,351 | 73,361 | 124,082 |
| shorthand fix removal control, same local toolchain | 73,369 | 73,379 | 124,109 |
| final shared-tail candidate, same local toolchain | 73,340 | 73,352 | 124,062 |

INFERRED: the media render-emission fix `5d22564c09` causes most growth.
It is the only executable core change between the last green and first red
artifacts. The later style shorthand repair `0f45a93b6b` accounts for the
remaining source change. This attribution would be refuted if removing only
the media fix under the same local toolchain failed to recover its growth.
Removal is a diagnostic control, never a proposed repair: synchronous render
emission violates React's render contract.

TESTED: removing only the media fix recovers 28/32/33 gzip bytes. The new
`mediaRenderEmission.web.test.tsx` guard fails in both `updates` and
`first-render` modes under that control: emission records `[true]` for
`emittedDuringRender`, versus the required `[false]`. The test additionally
requires synchronous subscription emission inside the publish call's `act`,
pending-state adoption on the next render, and no redundant unchanged emission.
Source was restored after the control; no behavior regression is proposed.

TESTED: removing only the shorthand fix exactly reproduces the first red CI
artifact's three island counts, recovering 10/14/6 gzip bytes from current
source. The existing style-piece shorthand test fails in that control because
`py`, `jc`, and `ai` remain untranslated. The restored current source passes
22 tests across the new render-emission test, keyed media subscriptions, media
sibling isolation, enter-transition emission, and style pieces. These controls
support both source changes' behavior and account for the observed growth.

Proposal sent to `p60786` before implementation: share `useMedia` snapshot
change detection's emission/update tail, preserving defaults-first behavior,
key-scoped subscription checks, pending state, first changed key diagnostics,
deferred render emission and synchronous effect/subscription emission. The
current code repeats state updates and allocates a separate emission wrapper.
Preserve the intentional media and shorthand fixes, all baselines and assertions.

Validation planned: pinned-node six-build baseline, media removal control,
candidate size gate, media and shorthand runtime tests, starter browser contract,
and a render-emission negative control that must fail with the removed fix.
Evidence is retained outside the managed worktree at
`/tmp/spring-v3-size-evidence`. The dependency build covers the starter's 123
workspace build tasks because this managed worktree had no existing dist files.
The primary checkout remains on main.

`p60786` approved the bounded proposal on 2026-10-05 UTC, frozen verdict
`pro128`, SHA `cfbcc6607e3c617d8e1b4e285a8fa8523d48db0b43a07a900ae62a90101b7380`.
The review independently read the hook, actual compiled duplication and guard,
and asserted the raw removal-control receipts under Node 24.16.0. It requires
an assembled candidate review before integration and preserves the media and
shorthand fixes. The local candidate shares the snapshot update/emission tail:
whole-state identity for first-render mode, pending-or-last-state comparison for
key mode, unchanged empty-key snapshot, first-key debug diagnostics, and emitter
capture before scheduling remain intact. It removes the separate per-instance
emission wrapper and duplicate state updates.

RAN: candidate package JS build and all 22 focused media/shorthand tests pass.
The initial starter browser attempt failed before testing behavior because
Playwright's pinned Chromium executable was absent. Installing that executable
is required before accepting any browser result.

RAN: the final candidate passes the unchanged six-build `measure.mjs` gate on
Node 24.16.0 with all thresholds still zero. Relative to current source it saves
39/41/53 gzip bytes in Vite/Next/Metro islands. Page JavaScript, CSS and artifact
family results match the same local baseline. Local Metro island CSS measures
4,490 bytes in both baseline and candidate; the CI receipt's 4,846-byte CSS is
not copied into a local baseline. Only the island JavaScript comparison is
claimed to match CI exactly.

Two intermediate candidates retained the required behavior but still exceeded
some ceilings, so neither was accepted. The final candidate also drops a
redundant empty-key guard: an empty iteration already returns `lastState` via
the shared unchanged check before any emission or mutation. READ: `getMedia`
is a side-effect-free direct store getter. This removes a duplicate branch
without adding allocations; the per-mount emission wrapper is also removed.

TESTED: final core web suite, 98 files and 685 tests pass, with 2 files and 3
tests already skipped. Final core native suite, 41 files and 428 tests pass,
with 7 existing expected failures and 9 existing skipped tests. The 24 focused
tests additionally cover emitter capture at scheduling time in both modes.
No skips or expected failures were introduced. The first broader web attempt
could not resolve the unbuilt `@tamagui/tailwind` package; building that test
dependency allowed the unchanged suite to pass.

RAN: official Chromium full-browser installation stalled during archive
extraction under Node 24.16.0. The owned downloader and installer were stopped
after saving their downloaded ZIP, `lsof` and process sample evidence. The
official pinned headless-shell installation completed under host Node 25.9.0;
browser tests and all size measurements still run under Node 24.16.0. The
unchanged starter browser contract passes all 12 tests across Vite, Next and
Metro, including CSS first paint, transitions, theme switches, island mounting,
and runtime inline width/hover behavior.

TESTED: a second negative control changes only the queued callback to look up
the emitter from the current context when the microtask runs. Both new capture
tests fail because the originally scheduled emitter receives no call. The
final source was restored byte-for-byte afterward (SHA-256
`037dea4cf306396d69b725543e087ae159fbe8a3be3f944d0a83c1ade6da396c`).
This guards the review's emitter-capture requirement in addition to the original
render-time and shorthand negative controls.

Final source/test scope is `useMedia.tsx` and
`mediaRenderEmission.web.test.tsx`; the measurement script, baseline, thresholds,
existing tests, stylesheet and public APIs are unchanged. Focused formatting
and diff whitespace checks pass. Assigned assembled review and branch push are
the remaining worker delivery gates. `p61058` owns serialized beta integration
and CI; local success is not a claim that future Linux CI has passed.
