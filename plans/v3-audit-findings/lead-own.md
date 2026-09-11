# Lead's own findings (p26060)

## L1. Nothing in this repo can fail a build for growing in size [high] [S then M] [READ]

The branch's two largest recent campaigns were about bytes. There is no gate.

- `.github/scripts/compare-webpack-stats.mjs:31-34` — the entire response to a
  gzip increase is `console.log('::warning::Bundle gzip total increased by ...')`.
  The file's only `process.exit(1)` is `usage()` at line 41, for a malformed CLI
  invocation.
- `.github/workflows/checks.yaml:395-430` — the job builds base and head, writes
  `v3-bundle-delta.md`, appends it to `$GITHUB_STEP_SUMMARY`, uploads an
  artifact. Nothing compares against a budget.
- `code/starters/zero-runtime/scripts/measure.mjs:192-202` — the zero starter's
  gate throws on `!tier.built || tier.forbiddenModules > 0 ||
  tier.compilerViolations > 0`. It computes `jsGzip` and `cssGzip` into
  `receipts.json` (lines 177-182) and asserts NO ceiling on either. Even the mode
  whose entire premise is byte size does not gate on bytes.
- Absence check: `grep -rn "gzip|maxSize|sizeLimit" .github/workflows/*.yaml`
  returns nothing. A positive would have been a step comparing a number against a
  stored threshold and failing. There is none.

Why it matters: handoff-log section 16 records the golf campaign recovering 115
gzip across five changes in `directStyle`. One unnoticed import can exceed that,
and nothing would turn red. The July state-of-the-release doc already flagged
this ("bundle-size budgets were specified but never enforced"); it is still true
a month and a full golf campaign later.

Proposed: (S) add a ceiling assertion to `measure.mjs` — the numbers are already
computed and written, so this is a comparison and a throw. (M) give the
kitchen-sink delta job a committed baseline and a fail threshold.

Risk: a hard ceiling produces false failures when a change legitimately adds
capability. Mitigate with a committed baseline file that a PR updates
deliberately, so growth is a reviewed diff rather than a silent drift.

## L2. The compiler's biggest bailout class is reported under a false reason [high] [S] [READ+INFERRED]

`code/compiler/static-tests/tests/fixtures/bailoutMetric.expected.json` measures
253 files: 2,595 elements found, 2,078 lowered, **517 bailed (19.9%)**. 340 of
the 517 are class `component runtime contract`, every one carrying the message
`<Component> does not accept className`. Button alone is 206, Input 45, Label 23.

READ, `code/compiler/static/src/compilerHost.ts:1131-1136`, the predicate behind
that message is a three-term AND:

```
acceptsClassName:
  resolved.staticConfig.acceptsClassName !== false &&
  !resolved.staticConfig.neverFlatten &&
  !resolved.staticConfig.context,
```

It means "is flattenable". The bailout at line 1336-1343 then reports the AND of
three terms under the name of one of them.

INFERRED, from `code/core/web/src/createStyledHOC.tsx:62-68` (spreads the wrapped
component's staticConfig, then sets `neverFlatten: true, isHOC: true`),
`code/ui/button/src/Button.tsx:48-49` (`ButtonFrame = styled(View, { context:
ButtonContext, ... })`) and `code/core/web/src/styled.tsx:637-641` (a plain
styled component gets `acceptsClassName: true`): Button's own
`acceptsClassName` is inherited **true**, and it fails the predicate on the other
two terms. Its `className` also is not in `buttonInternalPropNames`
(`Button.tsx:193-199`), so a caller's `className` flows through `frameProps` into
`<ButtonFrame {...buttonProps} />` at line 291.

So the diagnostic tells a user to fix something that is not broken. Anyone
reading "Button does not accept className" would go add className support to
Button, which is already there, and nothing would change. It also mislabels 340
of 517 rows in the bailout report the campaign uses to steer compiler work.

Proposed: rename the field to what it means (`canFlatten`) and emit the term that
actually failed — "Button is never flattened (behavior HOC)" or "Button provides
a styled context". S-size, and it makes the bailout metric honest.

Verification of the deeper opportunity (is there a tier between flatten and full
runtime, worth 340 elements) is delegated to p26078; see `bailout-lever.md`.

## L3. `styleMode` does not exist on this branch [note, not a finding] [READ]

Recorded because the audit brief named it and it would waste anyone's time.
`grep -rn styleMode code/` returns exactly two hits, both test comments saying it
is gone: `code/core/tailwind/src/__tests__/frontend.web.test.tsx:18` ("no
styleMode: the frontend is selected by the package these components came from")
and `utilities.web.test.tsx:8` ("standard tailwind utilities that styleMode
previously passed through as no-op classes"). The replacement concept is a
"frontend" selected by the originating package.

## L4. The group workload is where v3 loses, and it loses to NativeWind too [high] [L] [READ]

From `docs/v3-beta-state-of-the-release.md:308-333` (M2, Bun 1.3.14, headless
Chromium 145, 200 items / 60 heavy, 10 samples, seed 72002; raw samples in
`code/comparisons/output/benchmarks.json`), mount ms:

| framework | simple | rich | group | heavy | animated |
|---|---:|---:|---:|---:|---:|
| v3 compiled | 0.54 | 0.54 | 19.30 | 18.83 | 15.84 |
| v2.4.6 compiled | 0.47 | 0.51 | 43.81 | 24.85 | 21.49 |
| Tailwind 3.4.19 | 0.70 | 0.79 | 1.28 | 0.95 | 0.75 |
| NativeWind v5 | 2.27 | 1.44 | 7.14 | 4.15 | 2.37 |

v3 compiled wins `simple` outright (0.54 vs Tailwind 0.70) and beats v2 by 2.27x
on group. But group mount is 15x Tailwind and **2.7x NativeWind**, and heavy is
4.5x NativeWind. The campaign named this Gate 4 and deliberately deprioritized it
(decision 6, "benchmarks stay deprioritized to the very end").

This is the one number that undercuts every performance claim v3 wants to make,
and it is the one nobody is working on. Losing to Tailwind on group is arguable
(different capability). Losing to NativeWind, a peer RN styling library, on the
same workload is not.

Premise this rests on, labeled: I have READ the table, not re-run it. The numbers
are a month old (doc dated 2026-07-19) and predate both the golf campaign and
zero-runtime mode. **Re-running the benchmark suite at the current SHA is the
first step of any work here**, because the plan should not be built on a stale
measurement. p26078 is asking whether the bailout rate explains the gap.

## L5. Two vendored react-native-web layers [med] [L] [READ]

`code/core/react-native-web-internals/src` is 76 files / 428K, and
`code/packages/react-native-web-lite` is a second vendored layer that imports it
(19 source files import `react-native-web-internals`, nearly all of them in
`react-native-web-lite`). Both are forks of upstream react-native-web carried in
this repo.

Worth asking, now that v3 has its own style engine, its own `html.*` native
runtime and its own event mapping: how much of these two layers is still doing
work v3 does not already do itself? This is a maintenance-surface question, not a
correctness one, and it is L-size to answer properly. Flagging it as a question
worth scheduling, not as a defect.
