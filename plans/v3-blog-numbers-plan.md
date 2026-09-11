# V3 blog post: the numbers comparison plan

Owner: Nate. Drafted 2026-08-03 by p14401. The v3 announcement must show a
comprehensive, receipt-backed comparison. Nothing in the post may come from a
number that was not produced by a committed harness run on a recorded SHA.

## Two tracks, different deadlines

**Track 1, now, before a usable beta (anti-slop gates):** runtime perf and
bundle size must be measured solid on the cut SHA, not deferred. Concretely:

- Re-run the web benchmark + bundle attribution on the beta cut candidate
  (post direct-emission engine, post V6 config land). The retained artifacts
  predate both `12f7e0e981` (direct emission) and `628e2dc9be` (animated
  lowering), so the recorded 13.2x animated mount and +27.1 KB gzip are stale
  in an unknown direction.
- Produce the retained native V2/V3 record (`code/comparisons/NATIVE_V2_V3.md`).
  Blocked only by a V2-baseline harness smoke failure, not by V3.
- Gate: compiled web animated near 1x vs V2; native compiled mounts at or
  near V2 parity; bundle delta known and either reduced or explicitly
  accepted by Nate with a budget.

**Track 2, after a usable test release:** the full blog matrix below.

## The matrix

Frameworks:

- Tamagui v3 (compiled and runtime arms)
- Tamagui v2.6 (compiled and runtime arms)
- NativeWind v5
- Uniwind
- Tailwind (web only)
- Inline styles / plain React (web), plain React Native (native)

Platforms: web (Chromium, production builds and previews only) and native iOS
(Release builds on simulator; one physical-device spot check before publish).

Metric families:

1. **Runtime performance**: mount, update (same-node), remount across the
   scenario set (simple, rich, group, heavy, transition/animated, themed,
   real-component). Paired differences with CIs, fixed seed, recorded machine.
2. **Bundle size**: web whole-app JS gzip plus the Tamagui-attributable
   minified chunk (the measured-gzip decomposition from
   `V3_BUNDLE_SLIM_MEASUREMENTS.md`), emitted CSS, and native embedded
   `main.jsbundle` raw size.
3. **Compiler abilities**: a capability table (static extraction, partial
   extraction, dynamic values, pseudo/media/theme lowering, transition
   lowering) plus flatten rate on a **version-neutral corpus**. The current
   kitchen-sink config is v3-only (`@tamagui/config/v6`), so a fair corpus
   must be built that both v2 and v3 can compile unchanged. This corpus does
   not exist yet and is the largest missing piece.
4. **Compiler speed**: cold and warm wall-clock for the compile step on the
   shared corpus, per framework that has a compiler (v3, v2, NativeWind,
   Uniwind tooling). No harness exists for this yet.

## What already exists

- Web bench + attribution: `code/comparisons/run-benchmarks.ts` with
  `shared/bundleAttributionPlugin.ts`, measured-gzip chunk decomposition.
- Native runner: `code/comparisons/run-native-v2-v3.ts` plus the four-app
  Release harness; NativeWind/Uniwind/RN native cells already recorded in
  `output/benchmarks-native.json`.
- Behavior-conformance gates that make timing numbers claimable
  (`v3-v2-web-behavior-conformance.json`, native style-signature gates).

## Honesty rules (carried from the validation campaign)

- Byte-identical fixtures for any cross-version cell; record source, config,
  and workload hashes.
- Fixed seed, recorded machine, warmups + retained sample counts stated.
- Label corpus sizes; never present a repetition count as coverage.
- Single-machine intervals are descriptive, not population claims; say so.
- Compiled and runtime arms always shown separately; never blend.
- Every number in the post links to a committed artifact under
  `code/comparisons/output/`.

## Gaps to close for the blog (ordered)

1. Track 1 receipts (blocking beta, listed above).
2. Native scenario coverage beyond simple/themed: rich, group, heavy,
   transition cells for all native frameworks.
3. Version-neutral compiler corpus and the cross-framework capability table.
4. Compiler-speed harness.
5. Physical-device spot check.
6. Draft the post with charts generated from the committed JSON, not
   hand-copied tables.
