# Android verdict on a8d156b150

## Pre-batch baseline on 077ab3cb2f

The temporary `v3-android-baseline` branch triggered Detox run `30912958881`
at the exact pre-batch SHA `077ab3cb2f4da52bb475d7a796fbb8330f67f0e0`.
The Android jobs actually ran: the build passed, Android Detox failed, and the
suite tally was `8 failed, 3 skipped, 23 passed, 31 of 34`.

All five failures still present on 41af were already failing before the batch:
`Accordion`, `GroupPressTransitionMatrix`, `NativeMixedDriver`, `PointerEvents`,
and `PressStyleNative.noRngh`. The baseline additionally failed
`CompilerExtraction`, `CompilerTernaryActive`, and `ThemeChangeBasic`, all of
which are green on the current candidate. The batch therefore did not create
any of the current stable failures and fixed three baseline failures.

`PressStyleScrollStuck` passed the baseline in 31.995 seconds and passed again
on 41af, leaving its d371 failure as a single flaky observation rather than a
regression. `AdaptLiveSlotSpike` also passed the baseline. The temporary branch
was deleted after the result was recorded. Its failed log was fetched once to
`/tmp/android-baseline-30912958881-failed.log`.

## Workflow-filter run on 41af737b54

Detox run `30909721267` completed with the Android build green and exactly five
failing Android suites: `Accordion`, `GroupPressTransitionMatrix`,
`NativeMixedDriver`, `PointerEvents`, and `PressStyleNative.noRngh`.
`PressStyleScrollStuck` passed after its single failure on d371, so it must not
be classified as a regression. `AdaptLiveSlotSpike` also passed again. This is
the first run in the series containing only the five stable failures.

## Compiler fixture fix on d3719b077c

Detox run `30907237343` validated the refreshed
`CompilerTernaryActive.native.tsx` fixture. The test executed its renamed
compiler-bailout assertion and passed in 20.949 seconds. The Android build also
passed.

Android Detox still failed with six suites. Relative to d90:

- `CompilerTernaryActive` moved from fail to pass, which is the intended fix
- `AdaptLiveSlotSpike` moved from fail to pass again, consistent with its flake
- `PressStyleScrollStuck` appeared as a new failing suite
- the other five failures were unchanged

The current attribution is five stable failures, one new
`PressStyleScrollStuck` observation, and `AdaptLiveSlotSpike` passing again.
`AdaptLiveSlotSpike` has now flipped across four completed runs, so Android has
a demonstrated flake. `PressStyleScrollStuck` has only one observation and
must not be called a regression without another data point. The stale-fixture
fix from a2989 is what moved `CompilerTernaryActive` to green.

The failed log was fetched once to `/tmp/android-30907237343-failed.log`.

## Third data point on d90f563b81

Detox run `30903584203` completed after the integration push. The Android build
passed. Android Detox returned to `7 failed, 3 skipped, 24 passed, 31 of 34`
suites, with the exact original seven-suite set. `AdaptLiveSlotSpike` was the
only suite to change relative to the 9d4 run: it failed again after passing the
previous run. The three data points therefore confirm six stable failures and
one flaky suite rather than a source-change regression between these tips.

## Follow-up on 9d4a0c05b1

Detox run `30899085947` reached terminal failure at 01:05 on 2026-08-04. The
Android build passed and Android Detox reported `6 failed, 3 skipped, 25
passed, 31 of 34` suites.

The failing-suite set changed by exactly one suite from the seven-suite
baseline below:

- unchanged failures: `Accordion`, `CompilerTernaryActive`,
  `GroupPressTransitionMatrix`, `NativeMixedDriver`, `PointerEvents`, and
  `PressStyleNative.noRngh`
- removed failure: `AdaptLiveSlotSpike`
- added failures: none

`AdaptLiveSlotSpike` ran all four tests to `[OK]` and the suite passed in
77.329 seconds on the follow-up. The other six failures reproduced. This gives
the requested second data point: the failure set is not identical, but its only
movement is the already-known flaky `AdaptLiveSlotSpike` suite passing on this
run. The six-suite remainder is stable across both tips.

The follow-up failed log was fetched once to
`/tmp/android-30899085947-failed.log`. The baseline log remains in a2971's
scratchpad as `android-fail.log`.

The first Android run to complete in this campaign. Recorded here because the
agent messaging channel was blocked when it landed, and this is the answer to a
question that had been open all day.

## Result

Detox run `30890722211`, terminal at 23:01:25. Job-level, read from the run's
own jobs rather than the run's rolled-up conclusion:

| job | result |
| --- | --- |
| Build Android App | **success** |
| Android Detox Tests | **failure** |

**Android builds.** The build job is green. The Detox test job is what failed.
Largest tally in the log: `Test Suites: 7 failed, 3 skipped, 24 passed, 31 of 34
total`.

Timeline, from the watcher: queued 22:11 through ~22:36, in_progress from 22:36,
terminal 23:01. It sat queued for roughly 25 minutes before doing any work, and
an earlier run on `077ab3cb2f` sat queued over an hour and never started before
its watcher expired.

## Failing tests, deduped

- animates height and opacity to both targets without a Fabric driver error (x2)
- opens, reverses, and closes through intermediate numeric heights (x2)
- closes the default-open item through an intermediate height
- keeps fit Sheet.ScrollView stable through keyboard open, close, and scroll
- media card press survives keyboard-driven sheet movement
- optimized and non-optimized text should match colors in both states (x2)
- `pa-ca` / `pa-cp` / `pp-ca` / `pp-cp`: child reverts to default when press ends
  off-element
- renders every cell and the release target (x2)
- should fire pointerDown and pointerUp on tap (x2)
- candidate slot exposes target context, accessibility label, and native
  input/press focus path
- should benchmark optimized vs non-optimized with shuffled median samples

## This does not attribute anything

Android has not completed a run all day, so **there is no baseline**. This is not
the "base contains the variable" problem that bit three attributions today; it is
worse, because there are no arms at all. Whether these seven suites are today's
regressions or have been red for a week cannot be read off this run.

What it does establish: Android builds, Android runs, and this is its current
failure set.

The cheapest way to attribute is one Detox run on `077ab3cb2f`, which was
`origin/v3-beta` immediately before the batch merge, and a diff of the failure
sets.

## A link I checked and did not make

Several names read like intermediate-frame assertions ("intermediate numeric
heights", "intermediate height", "animates height and opacity"), which is exactly
the shape of the enter-animation cluster in
`plans/v3-enter-animations-dont-run-on-js-drivers.md`, and native is one of the
three drivers that shows zero intermediate frames there.

I pulled the actual failure detail before claiming the connection. The Accordion
one fails with:

```
Test Failed: '(view has effective visibility <VISIBLE> and
view.getGlobalVisibleRect() covers at least <75> percent of the view's area)'
doesn't match the selected view.
     Got: was null
```

That is a view-matcher miss, not a frame assertion. **So these are not linked to
that cluster.** The test names suggested a connection the evidence did not
support.

## Log

Fetched once with `gh run view 30890722211 --log-failed`, 13MB, and grepped
locally. One `gh` call. Anyone wanting a specific failure's detail should grep
that file rather than spend another call against the ~60/hr budget.
