# v3-engine status, 2026-08-03 (wrap-up for machine move)

Branch `v3-engine`, based on v3-beta at 2acce54e05. Two commits ahead, both
pushed, both merge conflict-free into current v3-beta (verified via merge-tree):

- ac514d949a fix(core): support background on native by lowering color values
  to backgroundColor
- efe9fb42ac test(core): lock background contract - web passthrough, native
  color lowering + filtering

## Landed and validated

**background prop (v6 `bg` shorthand maps to `background`)**
- Root cause of the BaseOnly failure: `background` sat in
  `webOnlyStylePropsView` so native dropped ANY value (literal `red` included)
  before value processing. Not a compiler bug, not theme-token specific.
- Fix: `background` moved into shared validStyles
  (code/core/helpers/src/validStyleProps.ts); native lowers a single color
  value to backgroundColor via the existing directStyle branch
  (directStyle.ts ~1178) and drops url()/gradient/multi-part with a dev
  warning (new `!isWeb` guard). Web passes the full shorthand through to the
  CSS `background` property unchanged.
- Validated: next-webpack 8/8 (was 3 failed), core-test full chain green,
  static-tests native 7/7 + web green, contract tests added in
  getSplitStyles.native/web.test.tsx.
- Scope decision (Nate): no native image/gradient support for now. Design
  ladder if picked up later: gradients can be style-only via RN 0.76+
  `experimental_backgroundImage` (RN 0.83 parses linear+radial only, no url() -
  READ from BackgroundImagePropsConversions.cpp); url() needs an injected
  absolute-fill image child which forces position:relative on the host - a
  web-divergence Nate flagged; the clean end state is upstreaming a url() kind
  into RN's backgroundImage style. Repo RN 0.83.2 Yoga engine default is still
  PositionType::Relative (Style.h:734).

**metro-plugin worker plan lookup (2acce54e05, already in v3-beta)**
- Metro hands workers project-relative filenames; plan cache keyed by absolute
  realpaths; every lookup silently missed so compiled builds shipped
  unlowered. Fixed with filename resolution + loud `metro/plan-miss`
  diagnostic + regression test (fails on pre-fix code, verified).
- My end-to-end receipt: clean-cache Metro build of
  code/comparisons/tamagui-bench-native-compiled shipped 19 __TamaguiNativeView
  markers + hoisted styles, zero plan-miss.

## Open items (not resolved, documented for pickup)

1. **Compiled-native gate discrepancy (top priority when perf testing
   resumes).** p14407/W-B rerun on build 72ed46a315 (contains 2acce54e05):
   V3 compiled 0.91x vs runtime at mount (V2: 5.04x), log
   /tmp/v3-wb-rerun-gate-smoke.log - same signature as pre-fix. Conflicts with
   my bundle-level receipt above. Machine was heavily loaded (35% idle) and
   absolutes inflated. Discriminator for whoever picks this up: grep W-B's
   actual shipped bench bundle for `__TamaguiNativeView` (bundle bytes, not
   plans), and check the build log for `metro/plan-miss` warnings - the miss
   path is loud now, so silence + unlowered bundle would mean a THIRD delivery
   defect, plan-miss warnings would mean cache/hash mismatch in their build
   flow. My verified-good build script: scratchpad metro-build.cjs
   (Metro.loadConfig + runBuild from the bench app dir, clean
   node_modules/.cache/tamagui + $TMPDIR/metro-cache first).
2. **Theme values statically inlined in compiled native output.** compilerHost
   resolves against the FIRST theme in config (compilerHost.ts ~824) and inlines
   concrete values, so theme switching won't update fully-flattened components;
   affects backgroundColor same as background. Nate's direction: replicate V2
   extractToNative (splitThemeStyles -> theme.<key>.get() expressions inside the
   _withStableStyle-style dynamic path, per-platform). V2 reference source
   unpacked at scratchpad v2-static/package/src/extractor/extractToNative.ts.
3. **motionDriverConversion.web.test.tsx perf-ceiling test** timed out twice
   under load (7.3s vs 5s ceiling); passed on the same tree earlier today.
   Assumed load flake, unverified on a quiet machine.
