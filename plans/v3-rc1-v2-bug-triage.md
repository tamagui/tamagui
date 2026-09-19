# V3 RC1: v2 bug triage

Date: 2026-09-19

This is a release-focused pass over the 71 open issues, biased toward crashes,
production-only correctness bugs, and fixes that can land safely on v2/main and
then be forward-ported to v3-beta.

## Landed or in the merge queue

| Issue | Status | Evidence |
| --- | --- | --- |
| [#4193 Reanimated remount crash](https://github.com/tamagui/tamagui/issues/4193) | Already fixed on main and v3-beta; issue closed | Primitive return values from Reanimated are guarded before touching `onStart`; the native regression is in `ReanimatedInitialUpdater.native.test.tsx`. |
| [#4163 native ScrollView `onScroll`](https://github.com/tamagui/tamagui/issues/4163) | Merged in [#4221](https://github.com/tamagui/tamagui/pull/4221) and forward-ported to v3-beta | Removed `onScroll` from the native web-prop skip map. Native split-style regression: 21 passed with 7 expected failures on main; 24 passed with 7 expected failures on v3. |
| [#4152 Tooltip keyboard focus](https://github.com/tamagui/tamagui/issues/4152) | Merged in [#4222](https://github.com/tamagui/tamagui/pull/4222) and forward-ported to v3-beta | Reproduced on the webpack dev server. Floating focus/blur handlers were generated but lost during `asChild` composition; they are now composed on `PopoverTrigger`. Focus open/blur close regression passes, and related Tooltip suites pass 7/7 on both branches. |
| [#4217 Android Button disabled reset](https://github.com/tamagui/tamagui/issues/4217) | Merged in [#4223](https://github.com/tamagui/tamagui/pull/4223) and adapted for v3-beta | Preserves contributor @boiboif's authorship from #4219. Native regression passes 3/3 on both branches; v3's `useButton` also emits an explicit false accessibility state. |

## Fixed issues closed during this pass

These were closed with a reporter-facing note and concrete regression evidence
rather than consuming RC work again.

| Issue | Current evidence | Recommendation |
| --- | --- | --- |
| [#4146 vertical Slider drifts after scrolling](https://github.com/tamagui/tamagui/issues/4146) | Main uses track-relative web pointer coordinates and has three browser regressions. All 3 passed against the dev server after rebuilding `@tamagui/slider`. | Closed. |
| [#4031 swapped forwarded ref receives no host](https://github.com/tamagui/tamagui/issues/4031) | Fixed by `26eb212569`; `composedRef.web.test.tsx` covers ref identity handoff. | Closed. |
| [#4000 Button `maxFontSizeMultiplier`](https://github.com/tamagui/tamagui/issues/4000) | Fixed by `1842ec2b55`, covered by native Button tests, and verified by the reporter. | Closed. |
| [#3314 Dialog accessibility](https://github.com/tamagui/tamagui/issues/3314) | Dialog content now exposes the dialog role/modal semantics; the follow-up reports a clean axe result and spec-compliant focus. | Closed. |
| [#3998 iOS Button `cursor` crash](https://github.com/tamagui/tamagui/issues/3998) | The internal Text cursor is web-gated and a native regression asserts it is not emitted. | Ask the reporter to confirm the broader Fabric-prop portion, then close if clean. |

## Must investigate before RC1

Ordered by release risk, not by age.

1. [#4194 compiler conditional-style corruption](https://github.com/tamagui/tamagui/issues/4194): production extraction can silently select the wrong styles when an element has multiple conditionals. The report includes a root-cause analysis and says a patch already exists downstream. This is the highest-priority follow-up because dev renders correctly while production renders incorrectly.
2. [#3996 v2 Reanimated Sheet crash](https://github.com/tamagui/tamagui/issues/3996): iOS crashes while switching a Sheet between modal and inline with the Reanimated driver. There is a standalone reproduction. Retest on the current v2 tip and Reanimated 4 before deciding whether #4193 also covered part of it.
3. [#4165 native portal setup crash](https://github.com/tamagui/tamagui/issues/4165): current v2.7.6 report on Expo 57/RN 0.86 for both iOS and Android. Verify whether the documentation names the wrong package (`react-native-portal` versus `react-native-teleport`) before changing runtime code.
4. [#3079 Theme undefined/subtheme crash](https://github.com/tamagui/tamagui/issues/3079): old report but repeatedly confirmed. Reproduce against v2.7.x; if current, add the transition as a core native test before changing Theme state logic.
5. [#3978 nested Sheet teleport z-index](https://github.com/tamagui/tamagui/issues/3978), [#3468 nested Sheet unmount](https://github.com/tamagui/tamagui/issues/3468), and [#3427 Sheet scroll starts drag](https://github.com/tamagui/tamagui/issues/3427): treat these as one native Sheet/portal pass so fixes do not fight each other.

## Small next wins

- [#4192 docs search mouse navigation](https://github.com/tamagui/tamagui/issues/4192): recent, clear web reproduction, and likely isolated to result click/pointer handling. Good site-only follow-up.
- [#3628 Select does not close when selecting the active item](https://github.com/tamagui/tamagui/issues/3628): narrow interaction contract; reproduce and add one browser test.
- [#3957 Android TV Button press](https://github.com/tamagui/tamagui/issues/3957): likely a focused native event-prop fix, but it needs an Android TV reproduction before changing Button semantics.
- [#3338 Tooltip crash](https://github.com/tamagui/tamagui/issues/3338) and [#3558 Toast navigation crash](https://github.com/tamagui/tamagui/issues/3558): both are crash reports but old enough that current-tip reproduction is the first task.

## RC1 recommendation

Do not block RC1 on the full historical backlog. Block it on #4194 and on a
current-tip result for #3996/#4165. Run one focused native
Sheet/Reanimated/portal matrix; the interaction fixes from this pass are already
on main and v3-beta with regressions at both layers.
