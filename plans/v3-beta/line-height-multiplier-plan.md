# V3 numeric line-height implementation plan

## Recommendation

Make bare numeric `lineHeight` in Tamagui-authored styles a multiplier in V3 on both platforms. Keep numeric entries in font configuration as absolute pixels (native layout points). Support explicit `"24px"` lengths and numeric strings such as `"1.5"` for multiplier font tokens. Preserve that distinction through token resolution, compilation, inheritance, and animation.

Do not infer units from magnitude. `lineHeight={24}` means 24 times the font size; a font-config entry of `1.5` still means 1.5 pixels. A threshold such as 3 or 4 would make the same API change meaning as a value changes and would misclassify legitimate tight leading or unusually large ratios.

Do not tie this change to `styleCompat`, introduce a compatibility setting, or automatically switch the meaning of config numbers in a future config pack. V3 is the component API version; v5/v6 are config-pack versions. Existing v6 fonts still contain numeric pixel scales. The prior v5 comment reserving numbers for future v6 multipliers is an intention that current v6 did not implement. Rewrite that comment to match this contract when implementing.

This is a planning deliverable only. No runtime changes, commits, pushes, messages, or worker launches are authorized here. Review disposition: none for this assignment. The parent owns any subsequent implementation authorization.

## Evidence and what already exists

Inspected source and history at local HEAD `1ea98430307006c8ef4c93a246658b6ca8c4e932`. The checkout also contained unrelated edits, including `getSplitStyles.tsx`; observations of its working copy are distinguished below. Read `CONTRIBUTING.md` and the completed Gemini research from `research-v3-lineheight (r24006)` through `tm show turns` and `tm tail`.

| Evidence | Status and implication |
| --- | --- |
| `14222196b7`, then `d72304a67b` | Historical full implementations. `git log --all -S finalizeNativeTextLineHeight -- code/core/web/src/helpers/getSplitStyles.tsx` returns these two; `d72304a67b` is the later implementation found. Its source has web normalization, native finalization, parent-font context, types, and tests for reversed prop order, variants, conditions, tokens, and style objects. Those tests were read, not rerun in this assignment. |
| `645aea813a` | The merge explicitly says “without lineHeight changes” and explains that the multiplier changes, context, types, and related tests were dropped. Reachability of the historical implementation is not evidence that it shipped. |
| `022f28340a` | Corrects the old migration: React Native `StyleSheet.create` and Shopify Restyle need their original numeric pixel values. It is a migration-scope precedent, not a later multiplier implementation. |
| `b477c45a5f` | Landed px-string support and v5 `toPxScale`/`pinFontToPx`. Current `createVariable` converts px strings to numeric `.val`; `needsPx` is set only on web. It cannot serve as native unit provenance without changing that contract. |
| `f1ec5e6a31` | Landed the immediate web inline fix for numeric strings such as `"0.65"`, with a regression in `getSplitStyles.web.test.tsx`. It does not turn numeric props into multipliers. The dirty working copy simplifies its branch; implementation must start from the then-current owner-approved tip. |
| Current `dom/primitives.native.tsx` | `resolveInheritedTextStyle` carries `lineHeightMultiplier` and recalculates after font-size inheritance. It still emits the ratio itself when font size is missing, uses a separate context from core, and recognizes only numeric ratios. Core has no corresponding finalizer today. |
| Current compiler | `compilerHost.ts` calls `getSplitStyles` with static mode and can lower ordinary native Text directly to React Native. DOM primitives have distinct resolved-style and runtime-style paths. A component-only fix would miss these paths. |
| Current Tailwind adapter | `candidate.ts` turns `leading-8` into the number 32 and `leading-[24px]` into the number 24; arbitrary unitless leading remains a string. A bare-number flip without changing these producers would turn pixel lengths into ratios. |

**RAN:** a read-only source-import probe with `TAMAGUI_TARGET=web bun -e` called `normalizeValueWithProperty`, then `createFont → createVariables → parseFont → registerFontVariables`. Its relevant output was:

```text
normalize(1.5, lineHeight)       = "1.5px"
normalize("1.5", lineHeight)     = "1.5"
normalize("24px", lineHeight)    = "24px"
font numeric 24                 = --probe-lineHeight-pixels:24px
font numeric string "1.5"       = --probe-lineHeight-ratio:1.5
font explicit "24px"            = --probe-lineHeight-explicit:24px
```

The independent variable was authored number versus numeric string versus px string, keeping the property and font pipeline fixed. This confirms the current font CSS distinction and the current numeric-prop normalization gap. It does not establish browser layout, native rendering, or compiler correctness. The probe needed a type cast for the string-valued font definition, exposing a public typing gap.

## Public contract

| Authored input | Web output | Native output with resolved font size 20 |
| --- | --- | --- |
| Tamagui `lineHeight={1.5}` or `style={{ lineHeight: 1.5 }}` | Unitless `1.5` | 30 |
| Tamagui `lineHeight="1.5"`, when it is not a configured token name | Unitless `1.5` | 30 |
| Tamagui `lineHeight="24px"` | `24px` | 24 |
| Font entry `lineHeight: { body: 24 }`, used by its token | Variable containing `24px` | 24 |
| Font entry `lineHeight: { body: "24px" }`, used by its token | Variable containing `24px` | 24 |
| Font entry `lineHeight: { body: "1.5" }`, used by its token | Variable containing unitless `1.5` | 30 |
| Raw React Native Text/StyleSheet or Restyle numeric 24 | Existing host semantics | 24 |

- Apply the Tamagui contract to direct props, shorthands, `style()`, styled base pieces, variants, `styled.dynamic`, `.resolve`, inline style objects/arrays, conditions, lifecycle styles, and Tamagui frontend output.
- Keep current token lookup precedence. V3 uses bare token names; legacy `$4` examples are not the preferred new spelling. A string matching a numeric font-token key still resolves that token. Numeric JSX props are unambiguous ratios. Once a token's value has been found, do not interpret its numeric-string value as another token name.
- Preserve exact lengths through `resolveValues: 'value'`, animation resolution, direct Variable inputs, and font values returned by `getFontSized`. A numeric `.val` from a font Variable remains absolute even though a newly authored numeric prop is relative.
- Preserve `fontSize` semantics and existing default paired font scales. Do not derive a new default line height whenever font size changes; only an authored or inherited multiplier requests that behavior.
- Zero is a valid ratio. Negative or non-finite authored ratios should be diagnosed by existing checked tooling, and must not reach native layout as invalid metrics. Do not add coercion or magnitude-based repair.
- Preserve existing web length/keyword support, including browser-managed `normal`. This work does not promise arbitrary CSS `calc`, percentages, or font-relative units on native. Extend the existing native support/diagnostic contract only where its resolver already has the required information.

## Resolution design

### Preserve units before normalization

Classify the winning line-height contribution while the normal style walk still has its original value or Variable. Keep a compact semantic kind alongside its existing property record: ratio, absolute length, or reset/keyword. Carry the ratio scalar separately from the resolved native line height. Do not reconstruct kind from the final number or from the presence of a token-name string alone.

At font lookup, numeric Variable values are absolute; numeric-string Variable values are ratios; px strings are absolute. This preserves legacy config data without rewriting every custom `createFont` call. Direct font Variable objects from `getFontSized` must use the same classification. If existing record storage can encode the kind, extend it instead of allocating a map/object per property or storing another global WeakMap.

Keep public numeric `.val` values usable for existing arithmetic. Do not change all token numbers into strings or make `getVariableValue` return a wrapper. A caller that explicitly extracts `.val` and authors it as a numeric prop has discarded its token units and must use an explicit px value when migrating. Audit those callers.

`createFont` fills sections but does not own variable creation; `createTamagui` also accepts direct font definitions and `insertFont` creates variables separately. Therefore implementing compatibility solely inside `createFont` is insufficient. Reuse the common font parse/resolution boundary and leave current pixel CSS registration intact.

### Web classes and inline styles

Make numeric authored ratios unitless at the common Tamagui normalization boundary. Preserve explicit lengths and absolute font values when resolving to literals. `getCSSStylesAtomic` and inline emission must consume the same semantic result, including conditional and animation destinations. Keep the immediate numeric-string fix covered.

Audit `stylePropsUnitless` and `unitlessNumberProperties` by consumer before editing them. The latter currently omits `lineHeight` and native DOM `mergeRuntimeStyles` consequently appends px to numbers. Tamagui-authored DOM styles must stop doing that. React Native Web's StyleSheet compiler is a different contract: do not globally make its raw numeric RN styles relative merely because the old branch changed related files.

Avoid special handling based on `noClass`, production CSS insertion, or animation driver. Class identifiers and compiler caches must distinguish ratio 24 from absolute 24px; literal token resolution must not collide with an authored ratio sharing the same number. Check value-to-variable caching as well as atomic rule hashing.

### Native core, DOM, and inheritance

Finalize line height once after the existing contribution pass selects the effective font size and line-height record. Use scalar completion at the end of that pass, with no prop pre-scan or second style traversal. This makes both prop orders and font-size-only condition changes correct.

Extend the existing `ComponentContext` with resolved native font size and inherited line-height kind/value, and have both core and DOM consume that same metric state. Move metric ownership out of DOM's separate `lineHeightMultiplier` field; keep DOM's broader inherited color/font/style handling in its existing path. Extract the shared scalar completion into `code/core/web/src/helpers/nativeTextMetrics.tsx`, with platform isolation through the existing build conventions. This helper has two real consumers and creates no additional context. Do not import all DOM primitives or React Native into the web core graph.

- Parent size 20, ratio 1.5, child size 10, no child line height: parent 30 and child 15. Carrying only the parent's resolved 30 is incorrect.
- Parent absolute line height 30, child size 10: child keeps 30. An absolute override clears any inherited multiplier.
- Parent size 20, child ratio 1.5 without its own font size: child resolves to 30. Carry font size even when the parent has no line-height declaration.
- A child font-size condition must recalculate its inherited ratio; a line-height condition must use the final active font size. No eager per-clause multiplication or multiply-after-merge of an already finalized value.
- Honor `inherit`/`unset` using the parent's semantic state; `initial`/`normal` clears an inherited multiplier through the existing reset contract. Explicit undefined/removal must not leave a stale ratio from a previous render or source layer.
- DOM View-backed tags must continue passing authored inheritable text metrics to descendants. Ordinary core View layout must not accidentally acquire a Text line-height style. Shared metrics must work across core/DOM nesting without erasing their distinct host layout behavior.
- Reuse existing provider placement where possible, compose correctly with focus context and `asChild`, and never nest duplicate metric providers for one element. A native Text ancestor with a known font size must supply it even without a multiplier, so an unsized descendant can author one later.

For a native root that authors a ratio with no known font size, explicitly use and emit font size 14 with the computed line height. The installed RN Fabric `TextAttributes::defaultTextAttributes()` sets 14.0 in `node_modules/react-native/ReactCommon/react/renderer/attributedstring/TextAttributes.cpp`. This is a proposed deterministic root policy, not proof of every native input platform's defaults; explicitly setting both values makes the ratio meaningful. Do not choose an arbitrary config token or pass 1.5 directly to RN as an absolute line height.

For nested raw RN parents, Tamagui cannot read font metrics that exist only inside the host tree. Document that boundary and require the effective font size at the Tamagui boundary when preserving that parent typography. Do not claim universal CSS inheritance through third-party native components. Validate Text and TextInput on both iOS and Android, including font scaling, `allowFontScaling`, `maxFontSizeMultiplier`, and `includeFontPadding`, with no extra manual font-scale multiplication.

The historical finalizer is a useful behavioral reference, but should not be copied wholesale: its missing-size branch passes the ratio through, it carries only parent font size, and its pre-V3 `getSubStyle` finalization does not establish correctness for today's contribution engine.

### Compiler and animation boundaries

`code/compiler/static/src/compilerHost.ts` is the current shared compiler adapter. Old `extractToClassNames.ts`/`extractMediaStyle.ts` paths from the historical implementation are no longer the implementation targets.

- Web static extraction, dynamic inline expressions, partial extraction, and zero-runtime output must emit the same unitless ratios and pixel variables as runtime. Invalidate the relevant compiler cache identity when emitted semantics change.
- Native may precompute `fontSize * ratio` only when both the winning size and all relevant inheritance/conditions are statically known. Preserve the semantic ratio for descendants even if the parent's own line box can be folded.
- A flattened native Text ancestor cannot disappear as a metrics provider when a runtime descendant can inherit from it. Extend the existing compiled native/runtime text path to carry metadata; use the existing bailout mechanism for genuinely unresolved dependencies. Never freeze an unknown inherited font size to the root default during compilation.
- Keep `DOMText`'s resolved native `style` numeric values absolute. Transport pending ratios via the inherited/runtime metadata contract, separate from finalized host styles. Consume that metadata exactly once. The compiler and primitive must change together so their internal protocol cannot double-multiply.
- Dynamic font-size expressions, condition branches, theme-dependent font tokens, and HOCs must retain the dependency between font size and line height. Do not emit independent style expressions that let one update without recalculating the other.
- For native animations, hand drivers numeric destination metrics. If font size animates under a ratio, derive line height from the same animated size, including when the ratio is inherited; animated objects cannot be multiplied in an ordinary JS scalar finalizer. Reuse driver-derived-value support and test each supported driver. A destination-only implementation that fails during the animation is incomplete. If a driver cannot represent this dependency, report that specific unsupported combination before enabling the feature; do not silently run pixel semantics.

## Migration and tooling

Retain numeric font scales in all current packs, including v5 and v6. Keep v5's explicit px wrappers as compatible authored data, but update their explanation. New documentation should prefer `"24px"` for explicit font lengths and `"1.5"` for relative font tokens. A config-number switch provides little benefit compared with the cost of breaking custom fonts and arithmetic consumers.

Extend `@tamagui/codemod-flat-values` and the existing `tamagui migrate` entry, using its binding provenance and reports. The legacy migration must preserve pixels for every proven pre-V3 numeric line-height literal, including values below 4. For example, legacy `{1.5}` becomes `"1.5px"`; an intentional V3 ratio remains `{1.5}` when the source is identified as V3. Migration must distinguish source semantics rather than infer intent from magnitude, and rerunning it must be idempotent.

Cover JSX, styled pieces, variants/resolvers, style objects, shorthand aliases, and numeric dynamic expressions whose type/provenance is known. Preserve a dynamic old pixel expression with explicit units using the codemod's existing expression machinery. Report ambiguous shared objects, extracted token `.val` uses, and untyped dynamic expressions for manual changes. Keep font definitions untouched. Keep raw RN/Restyle definitions untouched, including shared RN StyleSheets; flag a stylesheet also passed to Tamagui for migration at that boundary.

The general shared converter must describe current V3 semantics, while the legacy migration supplies the old pixel interpretation explicitly. Otherwise adding lineHeight to a unitless table could silently remove the codemod's existing pixel suffix. Do not create a second parser or a separate migration executable.

Fix Tailwind producers in the same implementation: `leading-8` stays 32px and `leading-[24px]` stays 24px until final host lowering; `leading-[1.25]` is a ratio on both platforms. Preserve config-aware named leading, `text-*` paired scales, and converter round trips. Extend existing checked diagnostics; a new production warning or standalone oxlint plugin is unnecessary. The grammar/tooling diagnostics can explain that bare numeric props are ratios and how to spell lengths.

Audit numeric consumers of font line heights before advertising relative font tokens. In particular, `resolveTextAreaSize` currently calculates `lines * getVariableValue(fontStyle?.lineHeight)`. A ratio token requires effective font size in that calculation. Resolve it using the same semantic contract, accounting for explicit font-size/line-height overrides, rather than adding another guessed unit rule.

## File map

Paths below are the exact implementation or validation homes identified in this checkout. Files listed for auditing only should change only if the behavior probe demonstrates a gap.

| Area | Files and intended work |
| --- | --- |
| Core resolution | `code/core/web/src/helpers/getSplitStyles.tsx`: preserve kind in existing records and complete native metrics after winners; `helpers/resolveVariableValue.ts`: audit all literal/Variable resolution; `helpers/normalizeValueWithProperty.ts`, `helpers/getCSSStylesAtomic.ts`: unitless web ratios and explicit lengths. |
| Font boundary | `code/core/web/src/insertFont.ts`, `createTamagui.ts`, `createVariables.ts`, `createVariable.ts`, `helpers/registerCSSVariable.ts`: preserve numeric-pixel and string-ratio provenance through direct config and dynamic font insertion, without changing unrelated variable semantics. |
| Core native context | `code/core/web/src/createComponent.tsx`, `contexts/ComponentContext.tsx`, `types.tsx`; new shared `helpers/nativeTextMetrics.tsx`: connect native text providers and scalar completion through the existing ComponentContext. Add fields to its explicit key list as well as its type/defaults. |
| Native DOM | `code/core/web/src/dom/primitives.native.tsx`, `dom/contract.ts`, `dom/htmlRuntime.native.tsx`: share metric state, preserve resolved-host versus authored-style distinction, remove numeric-to-px coercion for authored ratios. |
| Types | `code/core/web/src/types.tsx`: `GenericFont.lineHeight`, `FontLineHeightTokens`, context/record types; `dom/styleTypes.ts`: px and ratio-string forms. Extend `flatValueTypes.test-d.ts`, `stylePropParity.test-d.ts`, `dom/styleTypes.test-d.ts`, and `dom/standalone.test-d.ts`. Keep standalone DOM free of RN type imports and regenerate declarations by building. |
| Unit tables and checked tooling | `code/core/helpers/src/validStyleProps.ts`, `code/core/style-grammar/src/runtime/unitlessNumbers.ts`, `code/core/style-grammar/src/tooling/toolingDiagnostics.ts`: separate Tamagui V3 units from raw RN behavior; audit consumers before table edits. |
| Compiler | `code/compiler/static/src/compilerHost.ts`, `domStructuralPass.ts`; `code/compiler/compiler-core/src/ir.ts`, `materialize.ts`, `lower.ts`, `planCache.ts` only if existing metadata/cache APIs need extension. Reuse shared resolution and preserve text dependency metadata. |
| Tailwind | `code/core/tailwind/src/candidate.ts`, `frontend.ts`, `compose.ts` plus existing `src/__tests__/typography.web.test.tsx`, `candidate.test.ts`, `frontend.native.test.tsx`, `roundTrip.web.test.tsx`, `roundTrip.native.test.tsx`. |
| Migration | `code/core/codemod-flat-values/src/convert.ts`, `grammar.ts`, `expressions.ts`, `provenance.ts`, `report.ts`, `src/index.ts`, `test/index.test.ts`, `README.md`; `code/core/cli/src/migrate.ts` and `tests/migrateCli.test.ts` if source-version selection must be forwarded. |
| Config and arithmetic callers | `code/core/config/src/v5-fonts.ts`, `v6-base.ts`; audit `code/core/get-font-sized/src/index.ts`, `code/ui/text/src/SizableText.tsx`, `code/ui/input/src/shared.tsx` and every `getVariableValue`/`.val` line-height arithmetic caller. |
| Documentation | `code/tamagui.dev/data/docs/guides/how-to-upgrade.mdx`, `data/docs/intro/styles.mdx`, `data/docs/core/configuration.mdx`, `data/docs/core/config-v6.mdx`; explain version distinction, numbers versus strings, migration and native boundaries. |

## Verification gates

Extend existing test homes instead of creating a new test family. First establish a failing behavioral case for numeric multiplier semantics, then run against rebuilt dependencies. Historical test text and the source probe above are evidence for planning, not a passing implementation receipt.

| Gate | Required assertions and existing homes |
| --- | --- |
| Web values and cascade | Extend `code/core/core-test/getSplitStyles.web.test.tsx`, `getStylesAtomic.web.test.tsx`, `fontPxValues.web.test.tsx`, `fontPxInline.web.test.tsx`. Compare number, numeric string, px, numeric font token, string font token, direct Variable and `resolveValues: 'value'`; include reversed prop order, styled variants, flat conditions, pseudo/lifecycle styles, and both class/inline modes. |
| Native metrics | Extend `getSplitStyles.native.test.tsx`, `fontPxInline.native.test.tsx`, `domRuntimeContext.native.test.tsx`, `domHtmlRuntime.native.test.tsx`, `domPrimitives.native.test.tsx`. Assert host numeric values, nesting in both core/DOM directions, absolute overrides, ratio inheritance, missing-root size, font-size-only changes, style arrays and reset behavior. |
| Compiler parity | Extend `code/compiler/static-tests/tests/babel.web.test.tsx`, `babel.native.test.tsx`, `domNormalization.web.test.tsx`, `domConformance.native.test.tsx`, `domCompiledRuntime.native.test.tsx`. Execute compiled output, including mixed compiled/runtime descendants and conditional font-size expressions. Keep static DOM's hook-free path where no inheritance work is required. |
| Browser rendering | Reuse `code/kitchen-sink/src/usecases/StyleCompatCase.tsx` and `tests/StyleCompat.test.tsx` if retained at implementation tip. Assert mounted text, computed line height and nested child size in class and forced-inline/production output. With font size 20, ratios 1.5 and 24 must yield 30px and 480px, while explicit/config 24px remains 24px. These negative controls catch a pixel fallback or threshold heuristic. |
| Animation and native host layout | Extend the existing animation-driver integration cases for font-size and line-height destinations, transitions and inherited ratios. Run actual native multiline Text/TextInput on iOS and Android, including scaling. Assert layout changes and no double scaling, not just snapshots or a JS style object. |
| Migration | Extend codemod and CLI tests with literals below/above 4, dynamic numeric expressions, raw RN/Restyle negative controls, custom numeric font definitions, ratio-string tokens, shared ambiguous style objects and repeat execution. Validate resulting rendered metrics and diagnostics. |
| Consumers | Validate relative-token TextArea rows with local font-size overrides and preserve numeric-font rows; run Tailwind named/arbitrary/spacing leading round trips on both targets. |

Package scripts read for this plan: core tests expose `test:web`, `test:native`, and `test:ios`; compiler tests expose `test:web` and `test:native`. Select files through their existing runners while implementing, then run the affected suites assembled. The compiler runner currently includes retries; use a no-retry invocation for the new correctness receipt rather than treating a retried green as proof. Rebuild changed packages with their declared `build` script first, or use the root watcher. Finish code implementation with root `bun run lint` and `bun run check`, the affected type builds, and browser/native verification. Report unrelated shared-checkout failures without editing their owners' files.

## Performance and bundle constraints

- Follow `CONTRIBUTING.md`: one authored traversal and one parse. Carry scalar line-height metadata while processing existing records and finish it once. No second pass over props, parser, style arrays, or font definitions on every render.
- Keep numeric config compatibility at the config/token boundary; no per-render config cloning or font-scale scans. No magnitude heuristic, global setting lookup, new package, or production diagnostic dependency.
- Native metric context must be platform-isolated. Avoid new providers for plain Views and preserve the compiled DOM common path. Measure a text-heavy native tree as well as the View fixture: context propagation cost will not show up in a View-only bundle test.
- Use `code/comparisons/check-styled-view-size.mts`, `styled-view-size-baseline.json`, `tamagui-bench/src/baseline-styled-view.ts`, and the current ledger procedure on pinned Node 24.16.0. The inspected baseline is 29,342 gzip bytes with a 29,492 ceiling. Compare clean before/after artifacts with the same Node/zlib and rebuilt dependencies; do not treat this moving shared checkout as an untouched control.
- Preserve the recorded ceiling. Do not rebaseline solely to pass. If necessary text behavior exceeds it, provide source-map attribution and an explicit byte-cost decision to the parent. Most native machinery should disappear from the web fixture; web normalization should be a small change.
- Run the existing `code/comparisons/benchmark-get-split-styles.ts` corpus on identical inputs before/after, including text/condition-heavy cases. Verify checksums first. Also measure compiler output and zero-runtime starter graphs to catch a new runtime import introduced by native metadata work.

## Rollout sequence

1. Keep the immediate numeric-string inline correction as the current fix. Confirm its owner has landed the final form before implementing against the shared style engine.
2. Prepare the contract, failing behavioral cases, legacy migration, and unit/provenance representation together. Retain numeric config pixels, including current v6 scales. Audit all absolute-value producers before enabling numeric ratios.
3. Implement web emission, native completion/shared inheritance, compiler metadata, Tailwind producers, types, and arithmetic consumers as one coordinated feature change. Integrate the pieces before deciding they are correct. Do not ship a web-only interval or a native path that silently keeps old units.
4. Migrate proven legacy Tamagui numeric pixel call sites and document manual cases. Keep raw host styling and config numbers compatible. Update docs and generated types in the same feature delivery.
5. Run the assembled matrix, real native layout/animation probes, root checks, and size/performance gates. Record exact revision and artifact results. Resolve any inherited/native animation gap before declaring the contract ready.
6. The parent can then land the validated change through the repository's normal delivery path. An npm beta/canary/stable release remains a separate explicitly authorized action. This assignment does not perform it.

The proposed compatibility boundary is stable: authored numeric styles express a ratio, existing numeric font definitions express lengths, and explicit strings let authors choose either form without changing their whole configuration.
