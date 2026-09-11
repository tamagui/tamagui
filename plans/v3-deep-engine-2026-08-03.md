# v3 deep-engine lane checkpoint, 2026-08-03 (session 2)

Branch `v3/engine-native-parity` (worktree `/Users/n8/.worktrees/v3-engine-native`),
merged forward to `v3-beta` @ `09b3131b84`. Coordinator a2943. Predecessor
checkpoint: `plans/v3-metro-lowering-2026-08-03.md` (read it first; its traps
still apply). Items: A native runtime parity gap, B theme values in compiled
native output, C domCompiledRuntime.native, and D conditional font variants.


## Cache-key staleness: instance 4 of a repeating defect pattern

**Pattern: a cache keyed without an input that changes the output.** Instances
so far: (1) platform-ambiguous config bundle cache (web pass loaded the native
bundle), (2) `simpleHash` cached by input string but not `hashMin`, (3) metro
lowering plans guarded by compiled-hash that depended on unshared Babel
options, and now (4) **Metro's transform cache key omits the lowering-plan
generation**: `transformer.getCacheKey()` covers the cache schema version and
user-babel key only, and Metro's per-module key is global-baseHash +
file-sha1. So a plan change without a source change (edit tamagui.config.ts,
or edit a component library file that changes dependents' plans) reuses stale
transforms silently. Check cache keys FIRST when output is mysteriously stale.

Decision (a2943 sign-off): NOT fixed in beta 3. Global generation in the key
would retransform everything on any plan change (dev-loop collapse); Metro has
no per-module key hook (READ `metro/src/DeltaBundler/Transformer.js`:
`fullKey = baseHash + sha1`), so per-module scoping is architecturally
impossible. Post-beta option (b): bridge `getCacheKey` reads the manifest
generation at Transformer construction — fixes CLI/warm-rebuild staleness,
leaves live-dev-session staleness, one full retransform on first build after a
plan change, plus a narrow edit-build-revert-build wrong-reuse edge.
**Disclosure shipped now**: sent to a2952 for beta known-issues — after
changing Tamagui config, restart Metro with a cleared cache (`expo start -c`).

## Item B (theme values in compiled native output): implementation COMPLETE, validation in progress

The working tree held an uncommitted implementation from the stopped duplicate
session a2962 (committed as `555cd12cc8`, plus its native-engine research doc
in `plans/v3-native-engine-2026-08-03.md` as `eccbca3aa0`). Design matches the
settled V2-replication direction; verified against the actual V2 source
(`npm pack @tamagui/static@2` -> 2.6.3 `extractToNative.ts`, unpacked in the
session scratchpad):

- V2 `splitThemeStyles` split any still-`$`-prefixed string value out of the
  resolved style and emitted `theme.<key>.get()` per key inside
  `_withStableStyle(..., hasThemeKeys, hasMediaKeys)`. v3 replicates this with
  a compile-time sentinel: `resolveValues: 'except-theme'` makes
  `configuredValue` (directStyle.ts) return `theme:<key>` for
  theme-backed lookups (`themeRef.ts` owns the sentinel), and compilerHost
  (~1731) splits sentinel keys out of the hoisted style into
  `{ "<styleKey>": _theme["<themeKey>"]?.get() }` with `hasThemeKeys: true`.
- Strictly better than V2 where V2 was broken: opacity modifiers
  (`background/50`) bail the element to the runtime path (V2 would have
  emitted `theme['color/50'].get()`, a miss). DOM-tag native output and
  partial-extraction item styles also bail conservatively.
- Function variants that read `theme` via extras still freeze (propMapper
  resolves the raw first-theme Variable). V2 had the same hole; not a parity
  violation. Documented, not fixed.
- My additions this session: `rotate` with a theme sentinel no longer silently
  drops the property (flows to the style so the compiler bails to runtime);
  `tokenVariable` fills a reused module-level lookup object instead of
  allocating per call (it is on the runtime style hot path — relevant to
  item A).
- v3 is sigil-less: theme refs are written `bg="background"`, not
  `$background`. A `$`-prefixed string is a plain literal now.

Receipts so far: 3 native snapshots updated (each diff verified as the split
working: frozen `"color":"#f9fafb"` etc. replaced by live theme reads). New
`tests/themedFlatten.native.test.tsx` renders compiled output
under TamaguiProvider and asserts backgroundColor flips light->dark on theme
change; the modifier-bailout test passes, the theme-switch test was being
fixed (assertion shape, not behavior) when the timing window opened.

NOT yet done for item B: finish that test run; run full static-tests
web+native; rebuild + re-run metro-plugin tests (they exercise compilerHost
output); commit; then the item-2 housekeeping updates in
`plans/v3-engine-status-2026-08-03.md`.

## Traps (new ones this session; predecessor's all still apply)

- Plan blobs nest under a `plan` key: read `blob.plan.edits`, not
  `blob.edits` — the top level always has an empty-looking shape and reads as
  "zero edits everywhere" (cost me one wrong enumeration).
- `MetroCompilerCache.read` returns null on miss, not undefined.
- Timing needs a drained machine AND your own processes settled: my first
  samples read 72% idle from my own just-finished vitest run; three
  longer samples (top -l 3 -s 2) minutes later read 85%+.

## Item A RESOLVED at root cause: v3 double-rendered every native mount

Found via a node full-mount harness (react-test-renderer over both arms' real
dists, shared workspace React; harness at session scratchpad
`engine-bench/mount-bench.cjs` — rebuild it from this description if gone).
React Profiler phase counts, READ: v3 = {mount: N, nested-update: N},
v2 = {mount: N}. Mechanism: `useMedia` gave the first render the SSR-defaults
object (`initState`) while `getSnapshot()` returns the live `getMedia()`
object; the pre-paint sync layout effect compared REFERENCES, saw a change on
every mount, and forceUpdated — cascading a second full render of every
tamagui component below the provider, unconditionally, in every v3 native app.
Native has no hydration; the defaults-first render is web-only. Fix
`74917f51c5` gates it on isWeb; profiler shows mounts only after.

State this plainly: the mount BENCHMARK barely saw this defect, because React
flushes nested updates after the commit — after the bench's mount-timer layout
effect — so the second render burned POST-mount frame time the metric never
measured. The fix not moving the benchmark much does not mean the fix did not
matter; it removed a full extra render per mount that every real v3 native app
was paying in frame time.

Two engine-level fixes from cpu-profile attribution (`c74b487f8c`):
- `getSplitStyles` built its result with 4 conditional spreads; each transpiles
  to an ownKeys/defineProperty helper chain (~9% of engine self-time per
  call). Now a literal + conditional assignments.
- Sigil-less v3 word-scanned literal color strings (`rgb(99,102,241)`) through
  `resolveEmbeddedTokens` on every element (~5%). `letterFreeCallPattern`
  skips single function-call literals whose args contain no letters.
Harness result: engine microbench went from ~17% slower than v2 to ~11%
faster; full-mount simple went from 11.7 vs 6.8ms to statistical parity.

### Device gate re-run (branch-scoped, 74917f51c5, quiet window both ends)

```
V2 3.51x (23.16ms runtime -> 6.60ms compiled)
V3 4.36x (25.12ms runtime -> 5.76ms compiled)   36 cases, identities verified
```

Established: the 1.5x effectiveness bar passes with margin on both sides.
NOT established, recorded honestly: the compiled flip (v3 13% ahead within-run)
and the remaining 8.5% runtime delta are both inside the smoke's demonstrated
per-arm cross-run variance — V2 compiled moved +16% across two quiet runs on
byte-identical code, and the two compiled arms moved OPPOSITE directions
across the same run pair, which disproves common-mode drift cancellation via
interleaving. The 12-sample retained campaign on the MERGED tree is the
quotable instrument; nothing from the smoke goes in front of a tester.

Traps: build identity digests git HEAD — ANY commit invalidates all four
arms' embedded IDs; build all four at the measurement HEAD, always (one gate
run was aborted by the runner's validity check learning this). The existing
`output/v3-native-compiler-evidence.json` still validates (fixture SHAs
unchanged) but should be regenerated on the merged tree for the campaign.

## Item C RESOLVED: stale test expectation from the v5 config epoch

Not a product bug. The domCompiledRuntime.native `rgba(255,255,255,1)`
expectation encoded the v5 themes' `white: 'rgba(255,255,255,1)'` key (v5
themes source line ~251), which sigil-less lookup resolved through the theme.
`d7dd3efa06` (v5 removal) switched the static-tests config to v6, which has no
`white` key, so 'white' ships as a literal — exactly like the SAME test's
`color: 'red'` -> 'red' expectation, which was the control in plain sight.
The INCLUDE_CSS_COLOR_NAMES env in test scripts never had a code consumer at
any point checked; red herring. Fixed assertion in `8a136b1d28`.
**static-tests native fully green 62/62.**

## Hydration verification (for the useMedia isWeb gate)

Dev project: 12/12 both arms. Prod project (TEST_MODE=prod — a bare playwright
run only executes the dev project, per playwright.config mode selection; a
dev-only green is NOT prod clearance): both arms show the IDENTICAL single
failure — the known hydration-drivers.test.ts:73 composed-matrix diff owned by
a2971 — plus 6 passes. The fix is neutral on web dev and prod. Re-verify on
the merged tree after the batched push (owed to a2943).

## Item D RESOLVED on both platforms: static-branch conditionals lower per-branch

Pipeline: compiler-core gained a `conditional` MaterializedValue kind
(`evaluateConditionalExpression` in evaluate.ts recovers branch values when the
test resists evaluation but both branches evaluate; materializeValue produces
it with the would-be bailout preserved so any consumer that cannot use it
treats it exactly as a bailout). `lower.ts` treats non-static spreads as
unsafe and passes the value kind to `canLowerDynamicStyleProp`.

NATIVE (`cc6f779021`): each branch resolves through the FULL resolveSplitStyles
pipeline over completeProps, so cross-key effects are captured (a fontFamily
switch carries its own fontWeight/lineHeight into the branch); the diff vs the
base style becomes `expressions[i] ? {trueDiff} : {falseDiff}` inside the
`_withStableStyle` style array, with only the TEST expression in
`_expressions`. Variants are eligible too (a non-style viewProps difference
between branches bails). Opacity keeps the leaner inline-expression form.
Conservative bails: branch removes a base key, theme sentinel inside a diff,
two conditionals contributing the same key.

WEB (`9a15837246`): single-conditional elements fully flatten — classes shared
by both branches stay static, each branch's remainder becomes one
`(test) ? "a" : "b"` className segment via the existing program-class
machinery. Each font family still ships its OWN size scale (`.font_heading
{--f-size-5:13px}` vs `.font_body {--f-size-5:16px}` in generated CSS); what
is family-independent is only the indirection — the atomic class says
`font-size:var(--f-size-7)` and the active `font_*` class scope decides the
value. So a conditional fontFamily flips ONLY its `font_*` marker and the
whole per-family scale follows — this EXCEEDS v2, which re-baked resolved
pixel values into each branch. Theme-token branches resolve to `var(--*)` classes,
so they stay theme-live. Elements with 2+ conditionals keep the prior web
partial-extraction path (a shared class intersection across branch
combinations is not computed). The fonts.web and babel.web pins that kept the
gap visible now assert the lowering; the webpack DOM snapshots changed
class ORDER only, with their own computed-style assertions green.

The campaign-plan example (`fontFamily={n ? 'body' : 'heading'}`, 16 of 52
homepage bailouts) now lowers on web and native. Full sweep green: static-tests
web 157 / native 64 / webpack 20, metro-plugin 5, monorepo typecheck.

## Queue

1. After the batched push lands: support the 12-sample retained native
   campaign on the merged tree (regenerate compiler evidence first; rebuild
   all four bench apps at the measurement HEAD).
2. Function variants reading theme via extras still freeze (shared V2
   limitation, documented in item B section).
3. Web multi-conditional elements stay on partial extraction (see item D
   notes) — possible future work, low value.
