# getSplitStyles behavior inventory

This inventory defines the behavior that emitter consolidation must preserve. It
is evidence for implementation, not a description of the preferred design.

Checkpoint 0 refreshed the inventory against `18d49275e860d673c60e83a744be4b3931a959b8`
on 2026-08-27. Historical line references below remain provenance for the commit
where each observation was made. The current-tip map in the next section is the
source of truth for implementation checkpoints.

## Evidence method

**READ** - `git log --follow -- code/core/web/src/helpers/getSplitStyles.tsx`
found 698 commits back to 2021-10-13. The rename chain is
`packages/core/src/helpers/getSplitStyles.tsx` to
`packages/web/src/helpers/getSplitStyles.tsx` to the current path. I inspected
bug-fix diffs, same-commit tests, the current splitter and direct emitter, and
ran runtime probes after two source passes.

**READ** - The repository search
`rg -i 'getSplitStyles|directStyle|style emitter|emitter parity|behavior inventory|parity matrix' code/comparisons plans`
returned 590 hits. The closest prior artifacts are
`code/comparisons/V3_BETA_MEASUREMENT_STATE.md`,
`plans/v3-web-zero-runtime.md`, `plans/v3-perf.md`, and
`plans/v3-phase5-followups.md`. They establish size, call-graph, performance,
and test-topology facts. None of those four combines fix history, regression
tests, and current directStyle parity. This file supplies that missing cross
reference.

**READ** - `12f7e0e981` removed the program contribution/evaluation/lowering
backend and routed ordinary host values, variants, and frontend values through
directStyle. The remaining getSplitStyles code is the public component
splitter: it orders contributions, dispatches variants, routes accepted
substyles, forwards props, hands styles to animation drivers, merges parent
results, assembles host output, and schedules CSS insertion. Moving that code
between modules would not remove its behavior.

## Decision

The earlier decision to stop consolidation is superseded by
`plans/v3-beta/v3-style-engine-plan.md`. DirectStyle is the ordinary value
emitter, but the current tree still has several render-path scans, transform
systems, contribution channels, and output completion paths. Checkpoint 3
rebuilds them as one pass in `getSplitStyles.tsx` and deletes `directStyle.ts`.
This inventory now records behavior that must survive that rebuild. It does not
protect the current module boundary or the duplicated mechanics.

**READ** - current-tip ownership is:

| behavior | current source | rebuild disposition |
| --- | --- | --- |
| authored source ordering, style-prop position, HOC/asChild forwarding, host props, and final output assembly | `getSplitStyles.tsx:450-1477` | preserve behavior in the single forward pass |
| ordinary clause resolution and property emission | `directStyle.ts:1984-2039` and its helpers | move into `getSplitStyles.tsx`; delete the file |
| variant resolution and reconstructed HOC clauses | `propMapper.ts:30-53, 81-366` | preserve variant behavior, delete reconstruction and component-runtime use of `propMapper` |
| conditional-object discrimination | `directStyle.ts:2084-2183`, `getSplitStyles.tsx:176-207`, and `useComponentState.ts:97-115` | keep the public behavior through one discriminator |
| compound matching and Cartesian chain assembly | `getSplitStyles.tsx:111-240` | preserve matching and authored order through compiled metadata and the compound arena |
| lifecycle discovery | `useComponentState.ts:68-124` | move into the sole style pass; delete the prepass |
| accepted style/textStyle substyles | `getSplitStyles.tsx:701-711, 1664-1750` | remove with `accept: 'style' | 'textStyle'`; token-category `accept` remains |
| transforms | `directStyle.ts:1584-1601`, `getSplitStyles.tsx:1529-1556, 1664-1750, 1804+` | replace with one authored-order accumulator |
| styled-context write propagation | `getSplitStyles.tsx:1579-1601`, `propMapper.ts:438-446`, and `createComponent.tsx:1033-1042` | remove; `createStyledContext` is the supported path |
| class assembly and RNW conversion | `getSplitStyles.tsx:1417-1470` | preserve output behavior without join-then-split or wrapper arrays |

**READ** - the current processor artifact is the size ruler for the rebuild.
Source-file marginals in this inventory are diagnostic only. Moving code across
files cannot satisfy the gate because the complete minified processor bundle is
compressed directly.

The status words below mean:

- **YES**: current directStyle produces the same behavior, with a named test or
  probe.
- **PARTIAL**: directStyle owns the value emission but getSplitStyles still owns
  required routing or final assembly.
- **NO**: a current runtime branch has no directStyle equivalent.
- **UNCLEAR**: source inspection could not settle runtime ownership. These are
  blockers until a probe settles them.

## Blocking list

| Status | Case | Evidence and consequence |
| --- | --- | --- |
| **NO** | Inline shadow, text-shadow, and border-default lowering | **READ** - directStyle's `emitWebShadow`, `emitWebTextShadow`, and `emitBorderStyleDefault` run only when `flatShouldDoClasses` (`directStyle.ts:769-780`, `1064-1110`, `1188-1209`). The inline path is completed later by `fixStyles` and `styleToCSS` (`getSplitStyles.tsx:1103-1114`). Removing those helpers now drops inline lowering. |
| **Deliberate ownership change, tested** | Defaults introduced by `fixStyles` after direct emission | **READ** - runtime probe: inline animated `{ borderTopWidth: 2 }` returns inline `{ borderTopWidth: 2, borderTopStyle: 'solid' }` with no `borderTopStyle` class. The removed post-pass from `f018940468` promoted the added discrete property. The replacement contract keeps the same final output and `disableAnimationProps` routes `borderTopStyle` through Motion's discrete path. This drops historical class placement deliberately. The justification depends on the default being derived once from an unconditioned width, with no apply/revert transition. If that default becomes conditional, this ruling expires. Driver ownership is observable through the exported runtime set, and tests assert it. |
| **NO** | Accepted `style` and `textStyle` substyles | **READ** - `getSplitStyles.tsx:565-575` routes these to `getSubStyle`; `getSubStyle` performs prop mapping, normalization, transform conflict resolution, token tracking, and `fixStyles` (`1518-1624`). directStyle never receives these substyles. |
| **PARTIAL** | Style-prop arrays and authored position | **READ** - `mergeStylePropAtCurrentPosition` (`469-500`) owns array order, falsy entries, HOC forwarding, normalization, and the RNW `$$css` branch. directStyle owns only the individual non-RNW contributions. |
| **NO** | RNW `$$css` class-map orchestration | **READ** - the current branch clears earlier direct atomics and copies the class map (`480-483`). `git log -S '$$css'` traced the old promotion guard through `f018940468`, `d55c126924`, and `26ee0b751a`. No existing core or kitchen-sink test contained `$$css`, so I added a runtime result probe. A later RNW map removes the earlier Tamagui rule and wins; a later Tamagui value replaces the map class and emits its own rule. directStyle cannot preserve that without the wrapper's map detection and clearing step. |
| **PARTIAL** | Transform assembly | **READ** - directStyle emits transform-family values. `mergeFlatTransforms` still creates the final native/inline transform array and canonical order (`getSplitStyles.tsx:1123-1132`, `1383-1432`), and `getSubStyle` resolves transform conflicts (`1572-1609`). These final operations are outside directStyle. |
| **NO, lower priority** | `parentSplitStyles` promotion | **READ** - direct API probe: a child receiving `parentSplitStyles.style.display = 'flex'` returns inline display and no display class, while the removed post-pass promoted it. **READ** - a search of every non-dist production `getSplitStyles` and `useSplitStyles` caller plus the identifier found that every repository caller passes null/undefined or omits it. The search found the declaration, body, and all call sites, so an internal producer would have appeared. This is an exported-API difference without a repository-internal ordinary component path. Preserve it when the same fix can do so, but do not distort the design for this case alone. |
| **YES for its tested arm only** | Unconditioned non-animatable styles under inline animation | **READ** - `26ee0b751a` moved the `f018940468` promotion into directStyle. After rebuilding `@tamagui/web` and checking built content, `DriverDisableAnimationProps.animated.test.tsx` selected all four projects: Motion ran 3/3 and CSS/native/Reanimated produced their nine authored skips. The test does not establish cross-driver parity. |
| **NO in directStyle, covered by the Motion driver** | Active conditioned non-animatable values under an inline driver | **READ** - current directStyle promotes only `!condition`; an active `hover:` discrete value remains inline. The old post-pass promoted the final active value. A first attempted directStyle promotion failed because avoid-rerender listeners consume inline style, not class/rule output. Motion now derives its discrete set from `nonAnimatableStyleProps` and clears a vanished discrete group. After rebuilding the driver, the browser test observed hover cursor/borderStyle apply immediately and revert while opacity animated, 1/1. |

## Inline lowering history

The surviving code is `styleToCSS` in
`getCSSStylesAtomic.ts:160-200`, `fixStyles` and `borderDefaults` in
`expandStyles.ts:4-46`, and `normalizeShadow.ts:3-20`.

| Commit | What failed and trigger | Test that pins it | directStyle today |
| --- | --- | --- | --- |
| `1d2914da290` | **READ** - final style repair ran only in selected emission branches. The fix applied `fixStyles` to both the main inline result and accepted substyles in all cases. | No same-commit regression test. | **NO** for the finalizer. Its derived border default remains inline by deliberate ruling and is handed to Motion's discrete path. |
| `33f19163fc9` | **READ** - box/text shadow offsets and radii needed web `px` normalization; the new raw text-shadow helper suppressed the all-zero case. | No same-commit regression test. | **PARTIAL** - class shadow lowering exists; inline still uses the helper. |
| `5cef857570e` | **READ** - enter/exit substyle shorthands were not expanded and text-shadow offset/color normalization regressed. The fix made `getSubStyle` expand shorthands with the active config and corrected atomic shadow normalization. | No same-commit dedicated test. | **PARTIAL** for shadow emission, **NO** for substyle shorthand routing. |
| `43d4ea0aa8e` | **READ** - shadow generation regressed when optional radius/color/offset members were absent or zero. | Same commit added `Shadows.test.tsx` and `Shadows.tsx`; the current test asserts the computed box shadow. | **PARTIAL**. |
| `4e54441dabb` | **READ** - `shadowColor` plus `shadowOpacity` failed to put opacity into the generated shadow color. | Same commit added getSplitStyles unit `shadowColor + shadowOpacity`; the current descendant is `getSplitStyles.web.test.tsx:444`. | **PARTIAL**. |
| `baa15d15b35` | **READ** - normalization left undefined shadow members and formatted opacity incorrectly. The fix deleted absent members and normalized numeric opacity. | No same-commit test. | **PARTIAL**. |
| `e68c40abde2` | **READ** - `normalizeShadow` defaulted opacity too early and overwrote opacity carried by a color. | No same-commit test. | **PARTIAL**. |
| `0c8aa325d57` | **READ** - the web combination path forgot opacity and did not normalize the color consistently. | Updated the existing `shadowColor + shadowOpacity` assertion. | **PARTIAL**. |
| `bc4b97c8e9b` | **READ** - a web CSS variable used as `shadowColor` could not have opacity applied by ordinary color parsing. The fix used `color-mix` and distinguished null from zero. | No same-commit test. | **PARTIAL**. |
| `e225cb93252` | **READ** - moved web shadow opacity fully to CSS `color-mix`, retaining default opacity 1. | Later shadow tests pin the final computed result, not this commit alone. | **PARTIAL**. |
| `e77789c90c3` | **READ** - setting a border width without a style produced no visible border on web. It introduced width-to-solid defaults. | Current `tokenCategoryParity.web.test.tsx` pins global and side width defaults. | **PARTIAL** - class defaults only. |
| `817814c5f67` | **READ** - native edge widths incorrectly used unsupported per-edge border-style properties. Native needs the global `borderStyle`. | Current native border tests pin the merged result. | **PARTIAL**. |
| `b67aba3be7e`, `211e0424149` | **READ** - the first change regressed solid defaults on web by gating the table to native; the second restored the shared loop. | No dedicated same-commit test; current token-category tests cover it. | **PARTIAL**. |

**READ probe** - ordinary getSplitStyles class and inline paths both finish with
`textShadow: 0px 0px 0px red`, `boxShadow: 0px 0px 0px red`, and solid side
borders. Calling exported raw `styleToCSS` on an unnormalized all-zero text
shadow instead produces `{}`. The reachable splitter paths normalize zero to
`0px` first, so the raw suppression is not their output. If `styleToCSS` remains
public, its raw behavior is a separate compatibility decision.

## Accepted substyle history

| Commit | What failed and trigger | Test that pins it | directStyle today |
| --- | --- | --- | --- |
| `1b0bc4d8b1b` | **READ** - an accepted/pseudo/media substyle transform replaced the whole parent transform, losing nonconflicting transform keys. | No same-commit test. | **NO**. |
| `91dda47474a` | **READ** - a media transform was accumulated with the base transform. Base `x=-100` plus media `x=50` became `-50` instead of replacing the same axis with `50`; resize also had to restore base. | Same commit added `TransformMediaQueryMerge.test.tsx` and its usecase. | **NO** for substyle conflict handling. |
| `2cd76238af3` | **READ** - allocation rewrite of the conflict scan retained the replace-same-key/preserve-other-keys rule. | The transform media test remains the behavior pin. | **NO**. |
| `68436e5048e` | **READ** - functional variants inside a media/pseudo substyle saw stale parent props instead of media-resolved sibling variant props. | Same commit added core test `functional variants see media-resolved sibling variant props`. | **NO**. |
| `962d07755be` | **READ** - overlaying substyle props could write through read-only/frozen parent props and throw. | Same commit added `pseudo styles can override read-only parent props`. | **NO**. |
| `cbd95b721df`, `ba18bca0041` | **READ** - the allocation-saving prototype view reintroduced the frozen-parent failure when `Object.assign` performed `[[Set]]`; defining the substyle's own descriptors fixed it. | The `962d...` test is the strongest current pin; `ba18...` did not add another. | **NO**. |
| `13dde9d1214` | **READ** - accepted/context styles lost authored token strings and propagated resolved CSS variables, breaking nested context tokens. | Same commit added `styledContextTokens.web.test.tsx`, `StyledContextTokens.test.tsx`, and its usecase. | **NO** for substyle original-value tracking. |

The code to preserve is the prototype props view at
`getSplitStyles.tsx:1528-1537`, the `try/finally` restoration at `1538-1570`,
the transform conflict loops at `1572-1609`, and original-value storage at
`1611-1623`.

## Style prop, className, and authored order history

| Commit | What failed and trigger | Test that pins it | directStyle today |
| --- | --- | --- | --- |
| `9fc3c8761d` | **READ** - main `style` props were skipped when the same key had already appeared in tracked styles. | Existing getSplitStyles tests were updated, but no dedicated new case. | **PARTIAL**. |
| `43a64dd8c49` | **READ** - falsy entries in an array style prop caused a runtime crash. | No same-commit test. | **NO** for array traversal. |
| `78b0beec203` | **READ** - deeply nested `styleable(styled(styleable(styled(RNWView))))` failed to pass its style through. | Same commit added `StyledRNW.test.tsx` and `StyledRNW.tsx`. | **NO** for HOC/RNW routing. |
| `43b9664b3d` | **READ** - RNW array semantics were wrong: later entries failed to overwrite earlier entries, and the `$$css` check read the wrong variable. | No same-commit test; the new authored-position result probe covers both directions. | **NO** for map detection/traversal; individual later Tamagui contribution remains directStyle-owned. |
| `45cd97ece89` | **READ** - a style prop was not transformed to web-compatible values on web and was not forwarded correctly on native. It introduced the local `normalizeStyle` finalizer. | A sandbox usecase changed in the commit; no dedicated test. | **PARTIAL**. |
| `0602a38324b` | **READ** - animated array styles iterated `props.length` instead of `styleProp.length`, so entries did not merge. | A sandbox case changed; no dedicated regression test. | **NO** for traversal. |
| `259af6676c5` | **READ** - `useProps` did not receive final merged `className` and `style`; assembly moved into getSplitStyles. | No same-commit dedicated test. | **NO** for host assembly. |
| `0e475f058c4`, `9f23a047161` | **READ** - helper preprocessing reordered props, and later the special style handling still ran at the wrong time. Both fixes preserved authored position. | `0e475...` updated ComplexVariants plus core/static tests; `9f23...` had no dedicated case. | **PARTIAL**. |
| `e12195e9d28` | **READ** - v3 grouped styles by source/tier instead of honoring the forward authored order. A later className/style/direct prop could lose to an earlier contribution. | Same commit added an integration assertion where `className` precedes `backgroundColor` and the later Tamagui value wins; compound tests also changed. | **PARTIAL** - directStyle respects contribution order, getSplitStyles supplies it and changes class/inline mode at raw class boundaries. |
| `bb1240ff0ce` | **READ** - restoring forward order initially displaced styled defaults incorrectly. The fix reinjected conditioned styled defaults at the styled-base position. | Current flat-value and integration fixtures cover styled precedence. | **PARTIAL**. |
| `6ac479c7d1f` | **READ** - frontend passthrough classes were applied at the wrong cascade position. They must occupy styled-base position and force later Tamagui contributions inline. | Same commit updated `MixedCascadeCase.tsx`; no dedicated test file in the commit. | **PARTIAL**. |

The code to preserve is `mergeStylePropAtCurrentPosition` at `469-500`, raw
class handling at `585-600`, style handling at `602-605`, and final class/style
assembly at `1264-1365`.

## Transform and parent merge history

| Commit | What failed and trigger | Test that pins it | directStyle today |
| --- | --- | --- | --- |
| `37e02657804`, `88335f3646d`, `0b5cd252893` | **READ** - early advanced transform merging fixed duplicate/conflicting transform output and a cache race. | Historical compiler/core transform tests; current transform-family tests supersede their output shapes. | **PARTIAL**. |
| `6688a66d83f`, `f0e7f3a9fd5` | **READ** - flat transform props could be merged twice or parsed as className data on native. | Current native transform tests. | **PARTIAL**. |
| `011b38a59bf`, `5a3f6207121` | **READ** - pseudo transforms were lost on inline/native paths and transform order was not preserved while merging pseudos. | Current native transform-family and media tests. | **PARTIAL**. |
| `5a998407182` | **READ** - media styles merged flat transforms inconsistently. | Current `TransformMediaQueryMerge.test.tsx` and transform-family suites. | **PARTIAL**. |
| `1b0bc4d8b1b`, `91dda47474a` | **READ** - substyle transforms clobbered or accumulated with base transforms. | Dedicated transform media integration test. | **NO** for substyle merge. |
| `12f7e0e981` | **READ** - direct emitter migration retained final native/inline transform composition in getSplitStyles and established the current canonical family order. | `transformFamily.native.test.tsx` pins translate, rotate, scale, raw-transform tail, axis replacement, and equal-axis scale collapse; web companion tests pin CSS variables/classes. | **PARTIAL**. |
| `13bd3818714` | **READ** - using config rather than the contextual animation driver stringified transforms incorrectly for Reanimated. | No same-commit dedicated test. | **NO** for driver selection; getSplitStyles resolves the contextual/explicit driver at `321-326`. |

**READ** - the current order is translate x/y, rotate, equal-axis scale collapse
or scaleX/scaleY, then sorted remaining flat keys, then any raw transform array.
The native transform-family test asserts this exact result. The parent merge at
`1135-1152` fills only keys absent from both current inline style and current
class names.

## Component orchestration history

These behaviors are not competing style emission. They are the splitter's
public contract around the emitter.

| Commits | Bug and trigger | Current pin | directStyle today |
| --- | --- | --- | --- |
| `5895da5a31e`, `57240369442` | **READ** - `asChild` leaked component defaults, then still leaked global View/Text defaults, overwriting the child. | Same-lineage core asChild tests and `MenuAsChildPosition.test.tsx`; the latter was added with `572403...`. | **NO**. |
| `ea1941adc26` | **READ** - older asChild output added web defaults even though Tamagui/RN children already supply their own. | Current asChild default tests. | **NO**. |
| `393dce784eb`, `13f4b5d3dc8`, `8f3fc537f2a`, `84ae1d781c3` | **READ** - HOC plus nested styled/variant/pseudo combinations lost or overwrote styles; the last commit also covered animations and SSR. | Same-commit `StyledButtonVariantPseudo.test.tsx`, `ButtonUnstyled.test.tsx`, and `StyledButtonVariantPseudoMerge` usecase/test. The current `.animated` merge test runs CSS only. | **NO** for HOC/variant routing. |
| `18351915ce6`, `35102ff8b58`, `78b0beec203` | **READ** - deeper styled/styleable chains let inner defaults beat outer variants or dropped RNW style props. | Same-commit `ButtonCustom.test.tsx`, `StyledStyleableInputVariant.test.tsx`, and `StyledRNW.test.tsx`. | **NO**. |
| `40dc718dcc3`, `68436e5048e` | **READ** - functional variants did not see the current accumulated props, first for prior expanded variants and later for media-resolved sibling props. | ButtonCircular lineage and the dedicated core media/sibling variant test. | **NO** for dispatch/props view; directStyle only emits returned values. |
| `94c120ddd1a`, `13dde9d1214`, `8db8062a694` | **READ** - variant-resolved styled-context values did not propagate, color/token values reached children in resolved rather than authored form, and color propagation was incomplete. | Same-commit `VariantsOrder.test.tsx`, `StyledContextTokens.test.tsx`, and core token test. | **NO** for context propagation. |
| `3228bd85093` | **READ** - `disabled` set aria state but did not reach the wrapped input/textarea, leaving TextArea editable. | Same commit changed `NewInputBasic.test.tsx` and usecase. | **NO** for host prop forwarding. |
| `2c822f5cfb7`, `f04c56713d3` | **READ** - `testID` disappeared when RN animation drivers or HOC wrappers needed RNW `Animated.View` to forward it. | `AnimatePresenceEnterExit.animated.test.tsx` covers the RN driver path; the HOC extension has no same-commit test. | **NO**. |
| `8d2503e5a96` | **READ** - native `tabIndex={0}` did not set `accessible`, so the node was not exposed as intended. | Same-commit native/core tests; current native splitter contains the assertion. | **NO**. |
| `9b0beb8b446` | **READ** - nested media/platform query styles were unsupported or selected the wrong branch/order. | Same commit added `getSplitStyles.nestedMedia.test.tsx`; its current native descendant has ten platform/media/order cases. | **PARTIAL** - directStyle evaluates clauses; getSplitStyles supplies media, platform, and state context. |
| `31b5cd4294a` | **READ** - `numberOfLines` inside media/platform props was treated as style and failed to reach the host. | Same commit added `NumberOfLinesMediaQuery.test.tsx` and usecase. | **NO** for accepted/pass-through routing. |
| `ca26eed7805` | **READ** - flat named-group pseudo syntax silently did nothing rather than becoming the group condition object. | Same commit added `flatGroupSyntax.web.test.tsx`. | **PARTIAL**. |
| `f7ad9132c59`, `efcbae1e986`, `a25474a78e0` | **READ** - CSS rules could be recalculated on hydration or fail to be inserted, including multiple runtime rules such as pointer-events expansions. | Current SSR suites and rule-insertion tests. | **NO** for insertion-effect lifecycle; directStyle creates rule objects only. |
| `d89a7dd3c25` | **READ** - CSS-capable animation drivers did not receive the font class, producing the wrong font metrics. | No same-commit dedicated test. | **NO** for final class assembly. |
| `d72c69d7c98` | **READ** - the internal `passThrough` control prop leaked to the host. | No same-commit dedicated test. | **NO**. |

## Animation-specific history and test-arm audit

| Commit | What failed and trigger | Pin and its actual driver coverage | directStyle today |
| --- | --- | --- | --- |
| `f0189404687` | **READ** - an inline animation driver received discrete/non-animatable base properties. The fix promoted them to atomic classes so the driver did not manage them, preserving server atomic identity. | Same commit added `DriverDisableAnimationProps.animated.test.tsx` and usecase. Despite the filename, its own guard skips CSS, native, and Reanimated. Only Motion runs its three tests. | **YES** for unconditioned values on the Motion-observed path after `26ee0b751a`; conditioned and post-finalizer values are separate rows in the blocking list. |
| `d55c1269244` | **READ** - the promotion broke RNW animation drivers because RNW `Animated.View` does not forward `className`. | Same commit changed the above test to skip Reanimated. That skip records the limitation but does not execute the RNW path. | **YES by guard inspection**, not by that test: directStyle checks `!animationDriver?.isReactNative`. |
| `f8e8ac07a9c` | **READ** - promoted classes could have a different atomic identity from the server-rendered class, causing hydration mismatch. | Covered indirectly by the Motion test's class behavior; no dedicated identity assertion was added. | **YES by source and rebuilt-content inspection**: directStyle owns the signature. |
| `26ee0b751a` | **READ** - moved the above decision from the post-pass into directStyle and removed the second atomic emission. | Rebuilt-content verification plus Motion 3/3. Core web suites in the originating validation did not run this integration test. | **YES with the limitations above**. |
| `0b560a41789` | **READ** - conditioned discrete values remained inline after `26ee`, but Motion's stale hand-copied discrete list omitted keys such as cursor and the cleanup path did nothing when the last discrete group vanished. Values could stick after unhover. | `DriverConditionedDiscrete.animated.test.tsx` runs Motion only. After rebuilding Motion, the behavior test observed immediate apply and revert during an opacity animation. | **NO** in directStyle by design; the runtime contract is covered by the driver handoff. |
| `19b430e1fa` | **READ** - makes the new ownership contract observable: every `nonAnimatableStyleProps` key, including `borderTopStyle` and `cursor`, must be in Motion's exported `disableAnimationProps` set. If false, `getMotionAnimatedProps` sends the property to Motion's animated path. | Same Motion-only file; 2/2 passed after this assertion landed. | Enforces the driver side of the deliberate ownership change. |
| `13bd3818714` | **READ** - a contextual Reanimated driver was ignored, causing transforms to be stringified for the wrong consumer. | No same-commit test. | **NO** for driver selection. |
| `d89a7dd3c25` | **READ** - CSS animation drivers lost the font class. | No same-commit test. | **NO** for class handoff. |
| `0b2b364b757` | **READ** - transition values inside pseudo styles were not routed to animation timing. | Same commit added `AnimationTiming.animated.test.tsx` and `PseudoTransition.animated.test.tsx`. Both skip the native driver. `AnimationTiming` also has retries in the existing file. | **PARTIAL** - directStyle emits transition values; splitter and driver own routing/timing. |
| `6edf3b81cd7` | **READ** - `scaleX`/`scaleY` were missing from animatable defaults, so enter styles lacked a stable opposite state. | Same commit modified `AnimationBehavior.test.tsx`, now `.animated`; it skips native and has an additional per-scenario skip. | **PARTIAL**. |

The broad `.animated.test.tsx` suffix is therefore not evidence that every
driver ran. Any consolidation change must quote project results and skips,
rather than report only the file as green.

### Provenance of the Motion bug

**READ** - the stale discrete list and missing cleanup both predate
`26ee0b751a`:

- `c5bf179c2b828ab768dc9acf0ad6018fd4dbaa4a`, 2025-06-28, introduced the
  hand-maintained `disableAnimationProps` list.
- `a9343fe67c6ba9bd629bdb40e77bed01df4d2c9e`, 2025-07-01, introduced the
  no-rerender `if (dontAnimate)` update block without a branch for a vanished
  group.
- `cbee18ab45e2e3c0665528df0211ce3b93ff0882`, 2025-07-20, extracted
  `removeRemovedStyles`, but its caller still ran only for a truthy next group.
- `f0189404687`, 2026-02-28, masked the driver bug by promoting the final active
  discrete value to a class. On avoid-rerender updates the style listener does
  not carry class/rule output, so conditioned values silently failed to apply.
- `26ee0b751a`, 2026-08-22, limited early emitter promotion to unconditioned
  values. That sent conditioned values inline again and exposed the old Motion
  failure as a value that applied and then stuck.

The slimming change exposed a pre-existing driver defect. It did not introduce
the stale list or cleanup hole. Restoring conditioned class promotion would
restore the masked failure on avoid-rerender components, so the driver fix is
the replacement behavior.

## Boundary if unification is revisited

**READ** - directStyle is already the sole ordinary value emitter. The current
work stops here. If the remaining per-output-path forks are reconsidered later,
the implementation may absorb only these responsibilities while their tests
remain green:

- condition parsing, precedence, token/config resolution, and ordinary atomic
  CSS generation;
- class-path shadow/text-shadow/border defaults, once inline output is handled
  in the same implementation;
- non-animatable promotion, once conditioned values and post-finalizer defaults
  have runtime coverage;
- transform-family value emission, while retaining one final array/class
  assembly step for native and inline consumers.

**READ** - it may not delete accepted-substyle semantics, style/RNW/HOC routing,
authored contribution order, prop forwarding, styled context propagation,
animation driver selection/handoff, parent fill semantics, class assembly, or
React rule insertion. Those operations have user-visible regression history
and no directStyle equivalent today.

## Validation receipts

- **READ** - `bun run build` in `code/core/web` completed and the rebuilt ESM
  and CJS output contained directStyle's non-animatable promotion while the
  rebuilt getSplitStyles output did not contain the removed post-pass.
- **READ** - exact four-project invocation of
  `DriverDisableAnimationProps.animated.test.tsx`: 12 scheduled, Motion 3
  passed, CSS/native/Reanimated 9 skipped by the file, exit 0.
- **READ** - after rebuilding `@tamagui/animations-motion`,
  `DriverConditionedDiscrete.animated.test.tsx --project=animated-motion`
  first passed its behavior case 1/1. At `19b430e1fa`, the same Motion arm
  passed 2/2 with the canonical-list ownership assertion.
- **READ** - retained build-only harness at `19b430e1fa`, all four web arms,
  seed 73129: compiled V3 86,637 gzip versus V2 96,018; runtime V3 109,086
  versus V2 95,669. Runtime V3 stays 40 gzip below the pre-26 109,126.
- **READ** - current-output emitter probes first passed 3/3. They exercised
  final class/inline shadow and border outputs, raw zero text-shadow behavior,
  post-`fixStyles` animation output, direct `parentSplitStyles` output, and
  both authored-order directions around an RNW `$$css` map.
- **READ** - I changed the ordinary `fixStyles` observation into a class-placement
  negative control. It failed because the finalizer leaves `borderTopStyle`
  inline. After the ownership ruling, `emitterParity.web.test.tsx` now asserts
  the final `{ borderTopWidth: 2, borderTopStyle: 'solid' }` output plus
  `disableAnimationProps.has('borderTopStyle')`. The file passes 3/3. This
  records the deliberate transition from class ownership to Motion's discrete
  path without rewriting the historical `DriverDisableAnimationProps` test.
