# Adapt PR-A live slot spike

Status: web proof passed; state-preservation characterized; iOS conformance
runs in the extended Tamagui CI gate.

Scope: spike proof for the revised Adapt r2 design. The Adapt core
implementation lands after this gate passes.

Proof paths:

- Harness: `code/kitchen-sink/src/usecases/AdaptLiveSlotSpikeCase.tsx`
- Web proof: `code/kitchen-sink/tests/AdaptLiveSlotSpike.test.tsx`
- iOS CI proof: `code/kitchen-sink/e2e/AdaptLiveSlotSpike.test.ts`

What is under test:

- Candidate live-publish slot renders a source-authored element once in the
  target subtree, with no portal.
- Dialog-parent, source-wrapper, and target contexts all flow to the rendered
  content.
- Web role/ARIA and focus loop are correct in the target-rendered content.
- iOS target-rendered content is covered by the extended CI conformance path
  rather than a local Detox run. The CI Detox case includes the load-bearing
  native scenario: the candidate live slot renders content as plain children
  inside an inline `Sheet.Frame` with `modal={false}` and no portal, then taps a
  button and edits an input in that content to prove native touch-coordinate
  mapping works.
- State preservation across inactive/active adapt transitions is characterized
  against current v2 Adapt.

Web result:

- Command:
  `PLAYWRIGHT_CHANNEL=chrome PORT=9017 NODE_ENV=test npx playwright test tests/AdaptLiveSlotSpike.test.tsx --project=default --workers=1 --retries=0`
- Result: 3 passed.
- Slot/reap note: `launchReaped` was not available on PATH in this shell, so
  the process table was checked after the run. No Playwright remote-debugging
  Chrome or port-9017 listener remained; only the user's existing Chrome app was
  present.
- Context/a11y/focus proof: passed. The candidate slot content rendered exactly
  once under `[data-slot-target="true"]`, not under the source branch. It saw
  parent Dialog context (`dialog-parent-ok`), source-wrapper context
  (`portal-wrapper-ok`), and target context (`target-context-ok`). The rendered
  content exposed role `dialog`, `aria-modal="true"`, `aria-labelledby`, and
  `aria-describedby`. The focus probe auto-focused the input and trapped/looped
  Tab and Shift+Tab between the input and button.
- Live-publish proof: passed. Updating the published `revision` prop while
  active updated the target-rendered content from `revision: 0` to `revision: 1`
  without changing the mounted content instance.
- State preservation characterization method: the harness renders two side by
  side probes, current v2 `AdaptParent`/`Adapt.Contents` and the candidate
  live-publish slot. Each probe renders the same `StateProbe`: a mount instance
  id held in a ref plus a local `count` state. The interaction script starts in
  the inactive/source position, clicks each probe's increment button to set
  `count` to 1, records the instance ids, toggles both probes into the adapted
  target position, records count and instance again, toggles both back to the
  inactive/source position, and records count again. The assertion is conditional:
  if v2 preserves count at either transition point, the candidate must also
  preserve it. This measures v2 first; the candidate is not allowed to assume
  v2 loses state.
- State preservation result: current v2 and candidate are equivalent for this
  transition. Actual observation:
  `{"v2":{"before":"v2 instance: 1","adapted":"v2 instance: 3","countAfterAdapt":"v2 count: 0","countAfterReturn":"v2 count: 0"},"slot":{"before":"slot instance: 2","adapted":"slot instance: 4","countAfterAdapt":"slot count: 0","countAfterReturn":"slot count: 0"}}`.
  Measured v2 behavior was a remount/reset when moving inactive -> adapted
  (`v2 instance: 1` -> `v2 instance: 3`, `v2 count: 1` -> `v2 count: 0`) and
  remained reset after returning inactive. The candidate also remounted/reset
  and did not lose more state than v2, so it satisfies the PR-A "no worse than
  v2, documented" bar.
- Reland note: once the Adapt core implementation is on the same branch, a live
  "v2" probe also runs the new implementation. The committed regression tests
  therefore pin the measured v2 baseline above and compare the candidate slot
  against those recorded values instead of re-measuring v2 live.

iOS result:

- Local Detox was not run. Per the PR-A gate update from Nate/CTO, native
  conformance is handled by the extended Tamagui CI gate across the v2 -> v3
  branches. If the extended CI gate is not live when the core PR is ready, this
  is HOLD-for-infra for core landing, not N/A.
