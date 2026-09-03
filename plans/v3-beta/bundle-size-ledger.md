# V3 styled View bundle size ledger

## Goal and ruler

- Target `baseline-styled-view` in `code/comparisons/tamagui-bench`.
- Treat Vite's displayed production gzip as the release-facing ruler. The requested ceiling is
  literally `27.00 kB` in that output.
- Record raw JavaScript and Node `gzipSync(..., { level: 9 })` bytes for exact comparisons.
- Keep React externalization, fixture code, source maps, and build settings identical between
  checkpoints.
- Rebuild changed packages before every fixture build. Tests can otherwise resolve stale `dist`.

```sh
cd code/core/style-grammar && bun run build
cd ../web && bun run build
cd ../../comparisons/tamagui-bench
npx vite build --mode baseline-styled-view --sourcemap \
  --outDir /tmp/tamagui-styled-view --emptyOutDir
cd ../../..
bun code/comparisons/attribute-bundle-gzip.ts /tmp/tamagui-styled-view
```

## Final result

| artifact | raw JavaScript | exact Node gzip-9 | Vite display |
| --- | ---: | ---: | ---: |
| V2 comparator | 68,476 | 25,778 | not recorded |
| restored V3 control | 87,423 | 32,546 | 32.86 kB |
| V3 before the config boundary rewrite | 77,185 | 28,929 | 29.29 kB |
| retained V3 | 70,670 | 26,700 | **27.00 kB** |

- **RAN** the retained artifact is `/tmp/tamagui-styled-final-64`.
- **RAN** the retained V3 closes 5,846 of the original 6,768 exact gzip-byte gap to V2 while
  preserving the V3 condition, precedence, composite, family, and transform behavior.
- **RAN** the config-inclusive processor checkpoint emits 43.79 kB raw / 16.68 kB displayed
  gzip and executes successfully. This is a separate dependency slice, not a number to add to
  the styled fixture.

## What made V3 larger

- **RAN** source maps account for 87,114 of 87,423 control bytes and 68,107 of 68,476 V2
  bytes. Fixture and sourcemap glue are effectively unchanged.
- **RAN** deleting all Tamagui-owned generated ranges moves the control from 32,546 to a
  266-byte gzip residual. The V2 residual is 350 bytes.
- **INFERRED** Tamagui runtime code explains essentially the entire regression. React, fixture
  code, and map glue do not.
- **RAN** replacing the complete style-processor island with an opaque function saved about
  9,477 gzip bytes. The missing bytes were executable style-engine logic, not repeated enum
  spellings or diagnostics.
- **RAN** the five largest control regressions were:

| module | V3 marginal gzip | V2 marginal gzip | delta |
| --- | ---: | ---: | ---: |
| `web/helpers/getSplitStyles.mjs` | 8,960 | 3,728 | +5,232 |
| `web/helpers/resolveVariantStyle.mjs` | 1,058 | 0 | +1,058 |
| `style-grammar/runtime/scanFlatValue.mjs` | 779 | 0 | +779 |
| `web/helpers/getCSSStylesAtomic.mjs` | 1,476 | 866 | +610 |
| `web/helpers/mergeVariants.mjs` | 429 | 71 | +358 |

- **INFERRED** the core mistake was ownership. The render-time component graph owned both the
  style interpreter and the code that compiled config-specific grammar facts. V3 legitimately
  added conditions, precedence, composites, and source layers, but each feature arrived as
  another resolver, table, scanner, or emitter reachable from every styled component.
- **RAN** changing object, enum, and diagnostic representations produced small movements. It
  could not explain or recover a multi-kilobyte gzip regression because gzip already compresses
  repeated vocabulary well.

## Structural replacement

- Build config-specific grammar once in `prepareConfigRevision` and expose a compact revision
  state to the renderer.
- Move these implementations behind that boundary:
  - modifier and condition descriptors
  - state selectors and names
  - platform matching
  - token category classification
  - safe-area expansion
  - flat-value scanning
  - static-config normalization
  - variant definition matching
  - property-kind classification
  - transition normalization
  - embedded-token resolution
  - browser composite-value resolution
- Keep `getSplitStyles` as the consumer. It walks authored contributions into compact records,
  then completes each property family once into inline style or CSS.
- Use a conflict-family slot for browser CSS. A shorthand and its longhands share ordering and
  source-layer ownership while retaining separate property records inside the slot.
- Let browsers apply valid CSS shorthands. Keep React Native expansion for native output.
- Preserve transform accumulation because independent `x`, `y`, scale, rotate, and raw transform
  contributions still need last-writer semantics before emission.
- Cache parsed flat strings and static value resolution with bounded maps. Repeated renders can
  skip parsing and token lookup without growing memory without limit.
- Keep detailed parser diagnostics out of the production renderer closure. Checked tooling and
  test paths retain exact diagnostics.

This gives the runtime the V3 behavior without making every styled component import the code
that discovers the grammar from a Tamagui config.

## Measured checkpoint chain

The intermediate rows use Vite's displayed gzip because that was recorded for every build.
Exact raw and gzip bytes are shown only where the artifact receipt retained them.

| checkpoint | Vite gzip | disposition |
| --- | ---: | --- |
| restored V3 control | 32.86 kB | reference |
| two-phase records, parser/cache, atomic and transform cleanup | 31.28 kB | retained |
| one conditional walker and completion ordering | 30.93 kB | retained |
| production parser without diagnostic bookkeeping | 30.51 kB | retained |
| browser-native shorthand and conflict families | 29.45 kB | retained |
| shared ordinary and variant property path | 29.29 kB | config-boundary starting point |
| config-owned metadata | 29.09 kB | retained |
| config-owned condition descriptors | 28.74 kB | retained |
| config-owned token classification | 28.55 kB | retained |
| config-owned safe-area rules | 28.23 kB | retained |
| config-owned flat scanner | 27.87 kB | retained |
| config-owned static-config normalization | 27.61 kB | retained |
| config-owned variant matching | 27.24 kB | retained |
| config-owned property kinds and transitions | 27.10 kB | retained |
| remove remaining renderer state vocabulary | 27.08 kB | retained |
| config-owned embedded-token resolution | 26.97 kB | provisional, missing controls |
| restore family and composite correctness controls | 27.44 kB | correct but too large |
| move composite parsing behind config boundary | 27.04 kB | retained |
| tighten property classification | 27.03 kB | retained |
| avoid allocating an empty cleared style object | 27.02 kB | retained |
| inline the one-use atomic clear | **27.00 kB** | retained |

The provisional 26.97 kB build was not accepted as success. Negative controls found real
source-layer and composite-token bugs. Correctness temporarily raised the fixture to 27.44 kB;
moving the corrected implementation to config preparation recovered those bytes.

## Correctness findings from negative controls

- A higher-layer `borderWidth` cleared the whole border family and lost a styled
  `borderColor`. `clearDirectStyle` now removes only records for the property being replaced.
- Default-record cleanup compared only the family slot. A default for one border property could
  remove a sibling property. Default replacement is now scoped to the exact property.
- An implicit `solid` created for `borderWidth` could claim a newer source layer and replace an
  explicitly authored lower-layer `dashed`. The implicit default no longer claims source
  ownership.
- Browser `border="4 solid white"` emitted an invalid unitless width and resolved color from the
  wrong token domain. Config-owned composite resolution now classifies and resolves each part.
- Browser `padding="4 8"` emitted unresolved component tokens. Multi-value geometric shorthands
  now resolve each component while remaining one valid browser shorthand.
- Clearing the last native style no longer allocates `{}`. The result can be `null`, which is the
  same no-style contract with less work on the hot path.

## Validation

- **TESTED** 94 focused web tests covering flat values, tokenized shorthands, source layers,
  border defaults, explicit border styles, and token categories.
- **TESTED** the complete core web suite: 76 files passed, 2 skipped; 604 tests passed, 3
  skipped, 1 todo.
- **TESTED** the complete core native suite: 30 files passed, 1 skipped; 306 tests passed, 7
  expected failures, 9 skipped.
- **TESTED** all 462 style-grammar tests across 29 files.
- **RAN** the final processor bundle in a VM module. It returned class slots for
  `containerName`, `background`, `padding`, `width`, `height`, `opacity`, and `rotate`, emitted
  seven rule groups, retained the `sm` media dependency, and returned no inline style.
- **RAN** final `@tamagui/web` and `@tamagui/style-grammar` package builds.
- **RAN** root `bun run lint` completed with no errors. It reported existing warnings in
  unrelated sandbox, compiler fixture, and Tailwind contract files.
- **RAN** root `bun run check` passed dependency, unused-dependency, Tamagui, reference, path,
  standalone DOM type, and LSP pin checks.

## Final module ranking

From `/tmp/tamagui-styled-final-64`. Marginals rank closures and do not sum because each
measurement recompresses the same complete chunk after deleting one generated range.

| module | minified bytes | marginal gzip |
| --- | ---: | ---: |
| `getSplitStyles.mjs` | 20,733 | 7,572 |
| `createComponent.mjs` | 11,156 | 3,913 |
| `useThemeState.mjs` | 4,299 | 1,730 |
| `getCSSStylesAtomic.mjs` | 2,844 | 1,189 |
| `resolveVariantStyle.mjs` | 1,110 | 436 |
| `mergeVariants.mjs` | 852 | 372 |

The largest remaining top-level closures inside `getSplitStyles` are `getSplitStyles` itself
(1,282 marginal gzip), `contributeProp` (1,141), `resolveConditionModifier` (650), `emitValue`
(646), and `configuredValue` (614).

## Rejected or superseded experiments

| experiment | measured result | conclusion |
| --- | --- | --- |
| Canonical token-category table in the renderer | +1,262 raw, +306 gzip | The table duplicated property vocabulary already present in validity data. |
| Numeric emit-kind dispatch | Removing it saved 217 raw but only 14 gzip | Direct branches are smaller and clearer. |
| Canonical condition strings | About +199 minified bytes | Compact condition arrays are smaller than rebuilding strings. |
| Full grammar parser inside `mergeVariants` | +183 raw, +73 gzip | It pulled a large dependency closure into a small merge path. |
| Store emitter context on shared state | +66 gzip | Passing the hot local context is smaller. |
| Regex replacement for the checked parser | -7 gzip | Too little gain for a parser correctness rewrite. |
| Algorithmic `expandStyle` replacement | -40 gzip | Added runtime work for a tiny saving. The retained graph removes the web dependency instead. |
| One encoded style-metadata table | -682 raw, only -58 gzip | Gzip already compresses repeated property names. Decode cost was not justified. |
| Local permissive production parser | smaller but unsafe | It accepted malformed or declaration-injecting CSS. Reverted. |
| Preserve longhand class keys until a shorthand appears | about +167 gzip | Dynamic slot aliasing duplicated conflict logic. |
| Deferred border-default queue | about +0.03 kB | A provisional record in the existing slot is smaller and preserves ordering. |
| One merged flat record list | about -0.13 kB | It lost property-family isolation under source-layer replacement. Reverted. |

## Diagnostic tools

- `code/comparisons/audit-top-level-replacements.ts` builds the fixture once per selected
  top-level replacement.
- `code/comparisons/shared/bundleTopLevelReplacementPlugin.ts` replaces one generated
  declaration with an opaque call without editing source.
- `code/comparisons/attribute-bundle-gzip.ts --within=<module>` attributes generated spans to
  top-level declarations using source-map ownership.

These tools turned bundle guesses into falsifiable deletion measurements and should be reused
for any later size regression.

## Correction, 2026-08-31

- **RAN** a fresh V2 2.6.2 comparator, built with the same Vite 8.2.2 as the V3 fixture,
  measures 68,262 raw / 25,523 exact gzip-9. The 25,778 in the result table above is stale and
  high.
- **RAN** V3 at `285813438f` measures 70,562 raw / 26,696 exact gzip-9, so the real remaining
  gap to V2 is **+1,173 gzip bytes (+4.60%)**, not the smaller one the old row implied.
- Both figures are Node 25.9.0 (zlib 1.2.12). `code/comparisons/check-styled-view-size.mts` now
  gates this fixture in CI on the `.node-version` Node 24.16.0 (zlib 1.3.1-e00f703), where the
  same artifact measures 26,733. Gzip bytes only compare within one zlib.

## Baseline update, 2026-08-31: clause-only programs layer over the styled base

The visual parity pass against v2 proved the wholesale-replace semantic wrong: a
clause-only value (`flexDirection="sm:column"` on a styled row) wiped the styled
base entirely, so 15 tamagui.dev call sites rendered column at desktop widths.
The engine now keeps a lower tier's unconditional value when a call-site program
has no base of its own (conditional emissions no longer transfer slot
ownership; a program's base segments emit before its clauses).

- Cost on pinned Node 24.16.0: 26,733 -> 26,889 gzip-9 (+156, +0.58%), from the
  extra layering branch in `ownsSourceLayer` and the two-pass walk in
  `walkConditionalValue`. Includes m11275's flat-path perf work (26,846) plus
  this fix (+43).
- Baseline re-recorded at 26,889, ceiling 27,039.

## Baseline update, 2026-09-01: styled.dynamic and .resolve engine core

Phase 1 of `single-function-variants.md` added the v3 variant machinery to the
runtime: the `styledDynamic` carrier module (brand check, factory, the shared
`getDynamicEnv` builder), the resolver-chain execution block in
`getSplitStyles`, `.resolve` on every component in `createComponent`, and the
source-layer renumbering.

- **RAN** first push measured +536 gzip-9 over the 26,889 baseline. Dedup
  recovered 116: `getVariantExtras` had its fonts/fontFamily/font getter
  bodies duplicated into `getDynamicEnv`; it is now a thin wrapper adding
  `context` and `props` over the one shared builder.
- **RAN** final cost on pinned Node 24.16.0: 26,889 -> 27,309 gzip-9 (+420,
  +1.56%). Attribution: `createComponent` +~190 (the `.resolve` chain
  closure), the rest split between the resolver execution block in
  `getSplitStyles` and the carrier module (`isStyledDynamic`, factory,
  dispatch branches in `resolveVariantStyle`/`mergeVariants`).
- Accepted as feature cost: this is the agreed v3 variant API, and the legacy
  variant-function machinery it replaces (spread keys, function matching,
  `getVariantExtras` consumers) is scheduled for deletion in phase 2, which
  should claw back a chunk of this.
- Baseline re-recorded at 27,309, ceiling 27,459.

## Baseline update, 2026-09-01: v3 variants phase 2

Phase 2 completes the agreed redesign: styled base declarations now use
subtractable `style()` pieces, piece-typed public props replace `accept`, Input
gets its real web/native color-style surface, every in-repo functional variant
moves to `styled.dynamic`/`.resolve`, and the legacy spread/function matching
machinery is deleted.

- **RAN** the pinned styled-view fixture after a complete workspace JS build:
  27,309 -> 28,220 gzip-9 (+911, +3.34%), raw 72,101 -> 74,901 (+2,800).
- **RAN** source-map deletion attribution. The retained cost is concentrated in
  `getSplitStyles` (base-piece application/compilation and resolver-aware
  emission), with smaller additions in `styled` (correct Text/Input validity
  selection), `styledDynamic`, and `style`. Deleting the legacy variant matcher,
  spread-key resolver, and `getVariantExtras` offsets part of that feature cost.
- Accepted as the runtime cost of the reviewed phase-2 API. The base-piece path
  is required for compiler/runtime parity and retains per-key subtraction; the
  Input validity branch is required so text CSS reaches wrapped inputs; and the
  resolver/dynamic path replaces all remaining v2 functional variants. The
  Next/Webpack fixture verifies that base rules still land in CSS and that
  native/web style coverage is preserved.
- Baseline re-recorded at 28,220, ceiling 28,370.

## Baseline update, 2026-09-01: runtime style pass rounds

Two engine rounds from `runtime-corpus-receipt.md` (property classification
memoized once per process; per-pass `flatSlots`, `flatPropertyLayers`, and
`flatAtomics` as Maps) took the corpus replay from 1.33x to 1.22x of v2 on
clause strings with outputs unchanged.

- **RAN** pinned Node 24.16.0: 28,220 -> 28,347 gzip-9 (+127, +0.45%).
- Accepted as the price of the runtime win; baseline re-recorded at 28,347,
  ceiling 28,497.

A third round (clause conditions built once per config revision and class
mode, activated per pass) measured +258 gzip on the same fixture. **RAN** a
quiet-machine ABBA replay (80% idle, 15 rounds each) put its clause-string
ratio at 1.13 and 1.06 against 1.13 and 1.12 without it, conditional objects
and the total flat. No win to pay for, so it was reverted; the baseline stays
at 28,347.

## Baseline update, 2026-09-03: main sync (ref handover #4031, RTL logical properties #3099)

Syncing `main` into `v3-beta` brought in:
- Composed forwarded-ref handover for swapped ref identity (#4031, `createComponent.tsx`).
- React Native RTL style prop renaming to CSS logical properties (#3099, `webRTLRenames` in `getSplitStyles.tsx`).

- **RAN** pinned Node 24.16.0: 28,347 -> 28,671 gzip-9 (+324, +1.14%), raw 75,266 -> 76,451 (+1,185).
- Accepted as the necessary runtime cost of the ref handover fix and CSS logical property mappings.
- Baseline re-recorded at 28,671, ceiling 28,821.

## Measurement, 2026-09-03: tailwind composed-utility trim (no baseline change)

The composed `__*` utilities moved off a per-component `.resolve()` chain onto the
`StyleFrontend` descriptor's `compose` hook, which also deleted the source-layer
flip and the props spread in `getSplitStyles`.

- **RAN** pinned Node 24.16.0: 28,793 gzip-9 against the 28,671 baseline
  (+122, +0.43%), raw 76,806.
- Under the 28,821 ceiling with 28 bytes of headroom, so the baseline is unchanged.
  The fixture is one regular styled `View`, so it prices only the core-side change;
  the tailwind-package deletions do not appear in it.

## Baseline update, 2026-09-03: zero-runtime starter, v6 token expansion

The `codex/tailwind-coverage-audit` merge (`c4e1425d66`) added eleven token
domains to `v6-base.ts` (`width`, `minWidth`, `maxWidth`, `inlineSize`,
`minInlineSize`, `maxInlineSize`, `flexBasis`, `outlineWidth`, `outlineOffset`,
`boxShadow`, `perspective`), taking the v6 pack from 138 configured tokens to
528. Every configured token emits a CSS variable, so the starter's generated
stylesheet grew on all three integrations at once. That merge had never been
built by CI, so the growth first appeared on `63e0d3b258`.

- **RAN** attribution, same machine and pinned Node, `c4e1425d66` (pre-trim)
  against `63e0d3b258`: `jsGzip` identical in all six tiers, `cssGzip` identical
  in all six tiers, `islandJsGzip` -19 vite, -7 next, +36 metro. The whole
  +1,532 cssGzip belongs to the token expansion, not to the compose trim.
- **RAN** the starter gate was `success` on `a4c49e8c3c`, the previous `v3-beta`
  tip, so this is new red, not a carried-over failure.
- Re-recorded from CI's `receipts.json` for `63e0d3b258`, not from a local run:
  metro-web gzip differs between macOS and the Linux runner (locally 4,789 reads
  4,435 and 367,166 reads 366,862), and the same practice is recorded for the
  2026-09-02 metro-web island re-record. `jsGzip` is unchanged in every tier.

Open cost, not addressed here: seven of the new domains each restate all 39
`tailwindSize` entries next to their 13 container entries, so roughly 273 of the
390 new tokens duplicate `size`. The duplication is forced by
`grammarConfig.ts`, where a prop-named token domain replaces the category domain
instead of supplementing it, so `width` cannot declare only the container values.
Making that a fallback would drop those variables, but it changes token lookup
for every prop-named domain in every user config and needs its own review.


## Baseline update, 2026-09-03: zero-runtime starter, token variables get their units

`shouldTokenCategoryHaveUnits` in `createTamagui.ts` listed `size`, `space` and
`radius` by hand, so the eleven token domains the coverage-audit merge added
emitted lengths with no unit: `--c-width-12:48`, and `width: var(--c-width-12)`
is an invalid declaration the browser drops. A category named after a style
property now follows that property's own unit table, the one
`plainValueToPayload` already uses, so those variables carry `px`.

- **RAN** the bug, not a size question: `v3-zero-runtime (fixture)` was red on
  `e68de50ad7` at `vite-transition-differential.test.ts:226`,
  `prop-token-size base width` expecting `48px` and reading `484px`, because the
  dropped declaration let the probe div fill its 484px parent. The whole
  `vite-transition` project passes on `d041c9311a`.
- **RAN** pinned Node 24.16.0: cssGzip +14 on vite (4,064 -> 4,078 base,
  4,068 -> 4,082 islands) and +13 on next-webpack and metro-web base
  (4,083 -> 4,096, 4,088 -> 4,100, 4,083 -> 4,096). `jsGzip` is unchanged in
  every one of the six tiers. `islandJsGzip` +2 on vite, unchanged on next.
- **INFERRED** metro-web/islands is projected, not measured here: that tier is
  the one with the macOS/Linux skew recorded above (CI 4,789 reads 4,435
  locally; CI 367,166 reads 366,862). The local run moved it 4,435 -> 4,449 and
  366,862 -> 366,887, so the CI figures are recorded as 4,789 + 14 = 4,803 and
  367,166 + 25 = 367,191. If CI's gate reports different actuals for that tier,
  correct these two numbers from its `receipts.json` rather than re-measuring
  on macOS.
- **RAN** the styled-view gate is untouched by this: 28,793 gzip-9 against the
  28,821 ceiling, the same byte count the compose trim recorded.
