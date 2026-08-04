# v3 deep-engine lane checkpoint, 2026-08-03 (session 2)

Branch `v3/engine-native-parity` (worktree `/Users/n8/.worktrees/v3-engine-native`),
merged forward to `v3-beta` @ `09b3131b84`. Coordinator a2943. Predecessor
checkpoint: `plans/v3-metro-lowering-2026-08-03.md` (read it first; its traps
still apply). Items: A native runtime parity gap, B theme values in compiled
native output, C domCompiledRuntime.native, D conditional font variants, plus
the starter-discovery defect adjudicated mid-session (below).

## Starter discovery defect: FOUND, FIXED, LANDED (`b89a246648`)

a2952 reported plan-lookup `no-entry` for workspace dist modules on a starter
iOS export. Adjudicated with a bundle receipt, READ (reproduced in this
worktree, metro-plugin dist verified schema 4 first): clean-cache
`expo export:embed --platform ios --minify false` of `code/starters/expo-router`
produced 2257 plan-misses (all `no-entry`, including the starter's own
`app/*.tsx`), ZERO `__TamaguiNative` markers in the bundle, and a plan manifest
containing exactly ONE entry: `node_modules/expo-router/entry.js`.

Root cause (READ `frontend.ts #scan`): graph discovery was BFS from Metro
`entryFiles` following scanned imports, and external (node_modules) deps are
never followed. expo-router's entry lives in node_modules and reaches app
source only through `require.context`, which an import scan cannot see, so the
BFS died at depth 0. The bench app never hit this because its entry `index.js`
is project source. Consequence stated plainly: until this fix, the compiled
gate receipt (V3 4.37x) was taken on a topology no default Expo app has —
**v3 had no evidence of compiled-native benefit for real users**, and 4.37x
must not be quoted as a user-facing number for pre-fix builds.

The fix: `#scan` seeds its roots with a walk of `projectRoot` for
compiler-source files, in addition to entry BFS. Walk prunes `node_modules`,
`ios`, `android`, `dist`, `build`, `coverage`, `types`, `web-build`, and every
dot-directory. Walk-seeded files are speculative: compile failures there are
silent (if the bundle really includes one, the transformer's plan-miss warning
still fires — that signal is unchanged). The walked file list is hashed into
`scanOptionsHash`, so adding/removing project files invalidates the plan cache
correctly. Workspace packages still enter via imports exactly as before (the
resolver realpaths before its node_modules test).

Acceptance receipt post-fix, READ: plan-miss 2257 -> 0; bundle markers
0 -> **114** `__TamaguiNative`; manifest 1 -> 2328 entries; monorepo typecheck
green; metro-plugin tests 5/5 with a new regression test verified to FAIL on
pre-fix code (frontend.ts swapped back: 1 failed / 4 passed).

Dist scope, settled for a2952: workspace dist lands in compiler scope VIA REAL
IMPORTS, never via walk. `Separator.native.js` plans clean with `found: 0`
because a pure styled() definition file has nothing to lower — the app usage
sites lower instead (`app/(tabs)/index.tsx`: 9 found / 7 flattened). Dist
lowering itself is proven by ToastComposable.native.js (3 lowered),
Switch.native.js and SheetScrollView.native.js carrying real edits. Starter
aggregate: 52 found / 22 flattened / 30 bailed (mine the bail list for item D).

Walk-cost timing (drained window, busiest-of-three 85.35% idle before; two
independent A/B pairs 10 min apart agreeing within 1s): steady-state warm
builds 7s pre-fix vs 7s post-fix — per-build walk overhead below 1s
resolution. Plan-cache-cold builds 13s pre-fix vs 40-41s post-fix; the +27s is
NOT walk overhead, it is one-time plan GENERATION for 2328 modules where the
broken pre-fix discovery planned 1 (~12ms/module), paid only on plan-cache
invalidation. First-ever builds (cold npx/haste) are minutes in either arm and
were not A/B'd. Caveat recorded: one post-run idle sample read 61.9% about a
minute after the last build; the cross-pair agreement is the evidence the
numbers are clean.

Scaling baseline for whoever optimises plan generation later: ~12ms/module,
LINEAR in graph size (2328 modules -> ~27s). A 10k-module app pays roughly two
minutes on every plan-cache invalidation (config edit, dependency change), and
the documented cache-staleness workaround (clear Metro cache after config
changes) triggers exactly that replan — the workaround is not free and the
known-issues entry should say so.

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
working: frozen `"color":"#f9fafb"` etc. replaced by live theme reads);
**the real starter bundle carries 11 live `_theme[...].get()` reads inside
`_withStableStyle` wrappers** (item B demonstrating itself in production
output). New `tests/themedFlatten.native.test.tsx` renders compiled output
under TamaguiProvider and asserts backgroundColor flips light->dark on theme
change; the modifier-bailout test passes, the theme-switch test was being
fixed (assertion shape, not behavior) when the timing window opened.

NOT yet done for item B: finish that test run; run full static-tests
web+native; rebuild + re-run metro-plugin tests (they exercise compilerHost
output); commit; then the item-2 housekeeping updates in
`plans/v3-engine-status-2026-08-03.md`.

## Traps (new ones this session; predecessor's all still apply)

- The starter workspace hoists expo to the MONOREPO root: `export:embed` needs
  `--entry-file /abs/path/to/root/node_modules/expo-router/entry.js`; the
  starter-local relative path does not resolve.
- Plan blobs nest under a `plan` key: read `blob.plan.edits`, not
  `blob.edits` — the top level always has an empty-looking shape and reads as
  "zero edits everywhere" (cost me one wrong enumeration).
- `MetroCompilerCache.read` returns null on miss, not undefined.
- Timing needs a drained machine AND your own processes settled: my first
  samples read 72% idle from my own just-finished vitest run; three
  longer samples (top -l 3 -s 2) minutes later read 85%+.

## Queue after this (unchanged priorities)

1. Item A: v3 native runtime 30.01ms vs v2 26.71ms (~12%), compiled 6.87 vs
   5.68 (~21%), from the validated warmup-smoke gate. Profile on a settled
   tree. Note the native-engine research doc's observation: after item B,
   every themed flattened component costs a wrapper + context read + theme
   subscription — that is V2's ceiling too, but check it is not v3-worse.
2. Item C: domCompiledRuntime.native 'white' vs 'rgba(255,255,255,1)' —
   pre-existing, still failing, untouched this session.
3. Item D: conditional font variants (`supportsNativeDynamicStyles` admits
   only opacity, compilerHost ~1548). The starter's 30 bailed elements are a
   real-world corpus to mine.
