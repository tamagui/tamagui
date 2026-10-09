# CSS Grid on the Tamagui native runtime, and runtime shorthand cost

Researched 2026-09-14. Question from Nate: grid is "already up as a PR" to React Native, but Tamagui already runs its own style runtime on native, so why not make grid work whenever you use that runtime? Would it add real overhead? And the same question for multi-value shorthands like `margin: "10px 20px"`.

Claim labels: **RAN** (I ran it, output quoted), **TESTED** (several ways, named), **INFERRED** (from named things I read or ran), **GUESSED** (fits, unverified).

## Verdict

1. **Do it, as a bounded runtime emulation, not as a Yoga patch.** Upstream grid will not be in a React Native release for a while: the Yoga types landed in March, but the layout algorithm is still unmerged PRs as of today. A layout-only wrapper emulation reproduces the most common grid patterns (N equal columns, gap, `span`, `1 / -1`, stretched auto rows) in real Yoga to within 0.29px, in a single layout pass with no measuring (TESTED, section 5).
2. **Overhead is only paid by grid containers.** Components that are not grids pay one property check. A grid container pays O(children) element wrapping plus about 2 to 3x the Yoga layout time of a plain flex-wrap for the same items: 0.19ms vs 0.06ms for 30 items and 2.1ms vs 0.7ms for 300 in wasm Yoga (TESTED). Features that depend on the container's width (`auto-fit`, `minmax(180px, 1fr)`, unequal `fr`, `px` mixed with `fr`) add one extra container render per width change. On the New Architecture that render lands in the same frame (INFERRED, section 5).
3. **Draw a hard line on the rest.** Overlapping cells (`gridArea: "1 / 1"` stacking), `auto`/content-sized tracks, `dense`, and `subgrid` need child measurement or a real grid algorithm. Warn once in dev and don't fake them.
4. **Today's native behavior is the worst option and should change regardless.** v3 types accept `display: "grid"` and pass it to React Native, which cannot parse it and silently falls back to a flex column (RAN + READ, section 2).
5. **Multi-value margin/padding is already done on native** (RAN). `gap: "10px 20px"` is not expanded and reaches RN as an invalid string. That is a one-line fix. The multi-value split costs well under a microsecond. The real cost is the generic string-value path, and literal values get resolved at build time by the compiler anyway (section 6).

## 1. Upstream status: React Native and Yoga

| Piece | State (2026-09-14) | Label |
| --- | --- | --- |
| Original Yoga PR facebook/yoga#1865 (Nishan Bende / intergalacticspacehighway, Expo) | Open. Split into 9 PRs | RAN (`gh`) |
| "CSS Grid 1/9: style types and public API" (yoga#1893 / RN#55876) | **Merged 2026-03-05** (yoga 07524851f5, RN 26cef6414d) | RAN (`gh`) |
| 2/9 to 9/9 (algorithm, benchmark, tests, Java/JS bindings, playground) | All still open. The RN mirrors were closed unmerged 2026-06-03 | RAN (`gh`) |
| Algorithm re-split: "CSS Grid algorithm 1/N: data structures" (yoga#1923 / RN#57459), "2/N: auto-placement" (yoga#1994 / RN#57532) | Open, exported to Meta internal diffs in July (pulled by rozele) | RAN (`gh`) |
| "Fix per-node memory regression caused by Grid styles" (yoga#2018) | Merged 2026-09-04. Moves grid style storage behind a lazy pointer, so non-grid nodes pay 8 bytes | RAN (`gh`) |
| RN `display` prop parser, `react/react-native` main | Accepts only `flex`, `none`, `contents`. `"grid"` logs `Could not parse yoga::Display: grid` and falls back to Flex (`conversions.h:414-434`) | RAN (curl of main) |
| RN props conversion for grid props (`propsConversions.h`, `YogaStylableProps.cpp`, `ReactNativeStyleAttributes.js`) | No grid entries on main | RAN (grep of main) |
| Latest RN releases | 0.87.1 stable, 0.88.0-rc.0 (2026-09-08). No grid layout in either | RAN (`gh api releases`) + INFERRED from the two rows above |
| Scope of the Yoga algorithm when it lands | Template rows/cols, auto rows/cols, start/end lines, `px`/`%`/`fr`/`auto`/`minmax()`. **Deferred:** `grid-template-areas`, `grid-area`, `grid-auto-flow` (dense/column), shorthands, `repeat()`, `auto-fill`/`auto-fit`, `fit-content` | READ (PR #1865 description) |
| Community patch (OgDev-01/react-native-css-grid-patch) | RN 0.83.0-rc.5 only. Requires building RN from source on iOS and Android | READ (repo README) |

Takeaway: the Yoga work is active and staffed at Meta, but only the type/API layer has shipped. The algorithm, the RN prop plumbing, and the `"grid"` display parse are all still missing. Even when it ships, the first version defers `repeat()` and `auto-fit`, and the soot/chat/tamagui.dev code below uses both. When a usable grid reaches a stable RN, and how long until Tamagui's RN floor includes it, I don't know (GUESSED: multiple release cycles).

## 2. What Tamagui does on native today

- `@tamagui/helpers` `validStyleProps.ts` filters grid props on native unless `TAMAGUI_CSS_GRID=1` (commit 47beddce80). The gated list is `gridTemplateColumns gridTemplateAreas gridRow gridRowEnd gridRowGap gridRowStart gridColumn gridColumnEnd gridColumnGap gridColumnStart`. **`gridTemplateRows`, `gridArea`, `gridAutoFlow`, `gridAutoRows`, `gridAutoColumns` are not flat props at all in v3-beta.** Soot works around this with `style={{ gridTemplateRows }}` and a comment saying "grid-area has no flat style prop in v3" (READ).
- `TAMAGUI_CSS_GRID=1` only helps with a patched RN, because stock RN main cannot parse any grid prop (INFERRED from section 1).
- `display` accepts `grid`/`inline-grid` in v3 types (commit fffcaafe2a). On native, `display: "grid"` is **not** filtered: probe output `{"display":"grid","gridTemplateColumns":"repeat(3, 1fr)","gridColumn":"span 2","gap":8} => {"display":"grid","gap":8}` (RAN). RN then parses it as Flex. The user gets a column stack with no Tamagui warning (INFERRED from the RN parser code).
- Downstream workaround: `~/chat/src/interface/grid/Grid.native.tsx` ignores `columns` and `minItemWidth` and renders `<XStack flexWrap="wrap" gap>` (READ). That is the de facto native grid today, and it loses the column count.

Real grid usage in Nate's repos (rg over soot, chat, tamagui.dev, READ):

| Pattern | Examples | Emulation tier |
| --- | --- | --- |
| `repeat(N, 1fr)`, including media clauses like `1fr sm:repeat(2, 1fr) lg:repeat(3, 1fr)` | soot DevFoundations, OpenSection, marketplaceShared | 1 |
| `minmax(0, 1fr)` single column (clamp overflow) | soot Home, threadChatInput, AlwaysVisibleTabsContent | 1 (it means `1fr` plus `minWidth: 0`) |
| `repeat(auto-fit, minmax(180px, 1fr))` | soot RepoSettingsDialog, IntegrationsSettings, tamagui.dev Grid, Studio | 2 |
| `repeat(${columns}, ${width}px)` | chat GlobalReactionPopover | 1 (fixed px) |
| Same-cell stacking for crossfades (`gridTemplateRows: 1fr` plus children at `gridArea: "1 / 1"`) | chat AnimatedSteps, soot WebsiteNav (which already measures heights by hand) | 3 |

## 3. Should Tamagui support grid on native?

Reasons to do it:
- v3's stated position is web-first authoring with RN as a compile target (`plans/v3-beta/web-alignment-steps.md`). Grid is the largest missing layout primitive, and the types already accept it.
- The status quo is silent wrong layout. Anything, even a dev warning, beats it.
- The common patterns above fall into a subset that emulates exactly, in one layout pass (TESTED, section 5).
- Upstream won't cover `repeat()`/`auto-fit` in its first version, so an emulation keeps value after Yoga ships for those two (INFERRED from the PR scope).

Reasons not to, and how to handle each:
- **It is a second implementation that must be deleted once Yoga grid ships.** This conflicts with "one path, no fallbacks". Mitigation: keep it one module behind `display: "grid"` and pick the path at build time from the RN version, never by runtime feature detection. Delete it when Tamagui's RN floor has Yoga grid.
- **Grid is a parent-and-children algorithm, and Tamagui resolves styles per component.** The container has to own its children's placement. Consequences:
  - It can only see grid-item props written on the child element (`<Card gridColumn="span 2" />`), not props baked into a child's `styled()` definition.
  - Fragments must be flattened by hand. `Children.toArray` does not flatten Fragments, but on web a Fragment's children are grid items.
  - Absolutely positioned children must be pulled out of the track view.
  - Virtualized lists must not be grid containers. They own their children, so use `numColumns`.
- **The compiler has to deopt `display: "grid"` containers to runtime on native.** There is precedent: "fix(compiler): deopt native runtime-only props before split". Grid items themselves can still flatten.
- **Partial fidelity is a support burden.** Every construct outside the subset must warn once in dev and render a documented fallback, never an approximation.
- **The native runtime is already slow.** Runtime mount is roughly 4x plain RN (`plans/v3-release-blockers-2026-08-02.md` finding 4). Any cost on the hot path for non-grid components is unacceptable, so the grid check must sit behind the already-resolved `display` value.

## 4. Implementation options

### A. Runtime emulation in createComponent (recommended)

Trigger: after split styles resolve on native (so clauses like `sm:repeat(2, 1fr)` are already picked), `display === "grid"`. Replace the host's children with:

```
<Host {...containerStyle minus grid props}>           // user's box: background, padding, border stay exact
  <View style={{flexDirection:'row', flexWrap:'wrap', marginRight:-colGap, marginBottom:-rowGap}}>   // layout-only
    <View key={child.key} style={{width:`${100*span/N - 0.001}%`, paddingRight:colGap, paddingBottom:rowGap}}>
      {child}                                          // child gets flexGrow:1 (align-self: stretch) via the cell
    </View>
    ...
```

The math is exact: a cell at `k·(W+g)/N` minus a `g` gutter equals CSS `k·(W−(N−1)g)/N + (k−1)g` for equal-fr tracks. The `0.001%` slack absorbs Yoga's float32 percent rounding. Without it, 11 of 308 cases wrapped early, and `0.01%` is too much, with 28 cases off by more than 0.5px (TESTED, section 5).

Tier 1, single pass, no measuring:
- `repeat(N, 1fr)`, equal-fr lists, `minmax(0, 1fr)`
- fixed `px` column lists: cell width in px, no percent needed
- `gap`/`rowGap`/`columnGap`
- `gridColumn: span k`, `gridColumn: 1 / -1` (full row)
- `gridColumnStart`: placement computed in JS, holes as percent `marginLeft`, forced row breaks as zero-height `width:100%` spacer nodes
- `gridAutoRows`/`gridTemplateRows` in px: row index is known from the JS placement
- auto rows stretched to the tallest item (Yoga wrap lines already stretch)
- cell alignment (`justifyItems`/`alignItems`/`*Self`) via the cell's flex alignment

Tier 2, needs the container width: `repeat(auto-fit|auto-fill, minmax(Xpx, 1fr))` (N = ⌊(W+g)/(X+g)⌋), unequal fr, px mixed with fr, `%` tracks with gaps, and `fr` rows inside a definite height.
- Measure the container in `useLayoutEffect`. On the New Architecture that read is synchronous and the update commits before paint (INFERRED from reactnative.dev "Measuring the Layout" and the 0.76 New Architecture post).
- Then set pixel cell widths. After mount, width changes arrive via `onLayout`, which is async and costs one frame on rotation or resize.
- First render uses a guess, for example window width minus the container's own horizontal padding, so the common case needs no correction.

Tier 3, out of scope, dev warning plus documented fallback: same-cell overlap (`gridArea`/explicit `gridRow` collisions), `auto`/`min-content`/`max-content` tracks aligned across rows, `dense`, `column` auto-flow, `subgrid`, `masonry`, `grid-template-areas` with unequal tracks.

Work outside the runtime:
- Add `gridTemplateRows`, `gridArea`, `gridAutoFlow`, `gridAutoRows`, `gridAutoColumns` as flat props, so tier 1 isn't limited to the `style` escape hatch.
- Update the `TAMAGUI_CSS_GRID` gate so tier-1 props pass through on native when emulation is on.
- Add a compiler deopt for grid containers on native.

### B. Patch Yoga/RN with the upstream PR (rejected)

This means carrying yoga#1865 (about 8k lines) plus RN prop plumbing per RN version, and forcing every app to build RN from source on both platforms. That breaks Expo prebuilt and precompiled-core setups (READ, community patch README). A style library can't impose that, and the patch is dead weight once upstream lands.

### C. Custom Fabric component with its own layout (rejected for now)

A `TamaguiGrid` host component whose C++ ShadowNode `layout()` measures children and positions them. RN's `ParagraphShadowNode` does the same thing for inline attachments, so the pattern exists (INFERRED).
- It would cover tier 3 correctly.
- But it needs a native build (no Expo Go) and a grid algorithm we own. Taffy pulls a Rust toolchain into iOS/Android builds, and the Yoga PR code is written against Yoga internals.
- It is also a different binding mechanism from the Nitro registry in `@tamagui/native-registry`.
- Revisit only if tier 3 demand is real and upstream stalls.

### D. Compiler-only transformation (insufficient alone)

The compiler can pre-parse templates and emit the flex container styles. It can't place children, because items are almost always dynamic (`items.map`). It is useful as an optimization on top of A (hoist the parsed track list), not as the mechanism.

## 5. Overhead

### Layout cost and fidelity (TESTED)

Probe: `yoga-layout` 3.2.1 (wasm, the npm build of the same C++ Yoga), pointScaleFactor 3, script `scratchpad/yoga-grid-probe.mjs`. It compares the wrapper tree against a reference CSS grid computation (sparse row auto-placement, spans, row height = tallest item).

```
EPS=0     cases=308 badCases=11 worstDeltaPx=1263.167   (float32 percent rounding wraps early; all at N=12 or g=13)
EPS=0.001 cases=308 badCases=0  worstDeltaPx=0.286
EPS=0.01  cases=308 badCases=28 worstDeltaPx=1.167
negative control (percent width + gap, no compensation): item3 y = 22 css y = 0
layout count=30   emulated=0.193ms  plainWrap=0.056ms
layout count=300  emulated=2.115ms  plainWrap=0.691ms
layout count=3000 emulated=63.314ms plainWrap=33.735ms
```

Cases: widths 320 to 1366, N ∈ {2,3,4,5,6,7,12}, gaps ∈ {0,8,12,13}, 40 items with mixed span 1/2 and varying heights. The negative control shows that the naive `width: 33.33%` + `gap` approach wraps early, so the check can fail.

Layout reading:
- The extra layout-only nodes cost about 2 to 3x Yoga time over a plain wrap, which is under 0.2ms for a typical 30-item grid.
- Native Yoga should be at least as fast as wasm (GUESSED).
- Cell views carry only layout props, so Fabric view flattening should keep them out of the platform view hierarchy. That leaves a ShadowNode plus a Yoga node per item, not a UIView (INFERRED from Fabric's view flattening; not verified on device).

### JS render cost

- Non-grid components: one `display === "grid"` comparison on an already-resolved value (INFERRED, design).
- Grid container: template parse is cached per distinct string. There is one wrapper `View` element per child. The wrappers are plain RN host elements, not Tamagui components, so they don't run getSplitStyles.
- When only the width changes, the container's `props.children` element objects are the same references, so React bails out of re-rendering the children. Only the container and the cells re-render (INFERRED from React's element-identity bailout).
- Per-child wrapping cost: GUESSED at low single-digit µs on V8. Measure it on Hermes in the prototype before claiming anything.

### What to measure in the prototype

On an iOS Release build (the existing `native-class-bench.tsx` harness), a 30- and 200-item grid versus the same items in a hand-written `XStack flexWrap`:
- mount through `useLayoutEffect`
- a width change
- one item's state update, which should not touch siblings

## 6. Multi-value shorthands at runtime

### Behavior on native (RAN)

Probe: `getSplitStyles` on `View`, native target, core-test vitest. Built worktree `tamagui-tw-finish` @ 07c32e3d62 (2026-09-03).

```
{"margin":"10px 20px"}          => marginTop 10, marginRight 20, marginBottom 10, marginLeft 20
{"padding":"4px 8px 12px 16px"} => paddingTop 4, paddingRight 8, paddingBottom 12, paddingLeft 16
{"padding":"$2 $4"}             => paddingTop 7, paddingRight 18, ...    (tokens resolve per component)
{"padding":"4 8"}               => paddingTop 18, paddingRight 46, ...   (bare numbers resolve config-first)
{"inset":"0 10px"}              => top 0, right 10, bottom 0, left 10
{"gap":"10px 20px"}             => gap "10px 20px"                        <- not expanded
```

The v3-beta HEAD (20a3a105f6) code path is the same. `expandStyle.ts` has no `gap` entry in `EXPANSIONS`/`universalExpansions`, and the slot distribution at `getSplitStyles.tsx:3563-3582` only runs for keys that `expandStyle` expands (INFERRED from reading both). RN's `gap` takes a single length, so the string is invalid there (INFERRED).

**Fix:** expand `gap` to `rowGap columnGap` on native when the string contains whitespace. The existing two-slot distribution already maps index 0 to part 0 and index 1 to part 1, which is CSS order. Keep single values as `gap` so the common case doesn't grow to two keys.

### Cost (RAN, V8 JIT, dev build, loaded machine, noisy across two runs)

| Input to getSplitStyles | µs/call |
| --- | --- |
| `margin: 10, padding: 20` (numbers) | 4.2 to 7.0 |
| 8 numeric longhands | 8.6 to 11.4 |
| `margin: "10px", padding: "20px"` (single strings) | 13.3 to 28.4 |
| `margin: "10px 20px"` | 8.6 to 15.5 |
| `padding: "4px 8px 12px 16px"` | 7.8 to 11.4 |
| both multi-value props | 13.5 to 18.5 |
| unique strings every call (cache defeated): `"Npx"` / `"Npx Mpx"` / 4-value / number | 13.7 / 14.8 / 14.0 / 4.2 |
| hand-written 1-to-4 value split + px parse, no Tamagui | 0.31 to 0.42 |

Reading:
- The whitespace split and slot distribution cost under 1µs. A 4-value string is no more expensive than a single `"10px"` string.
- The real tax is the string-value path itself: grammar scan, unit and token resolution. That is about 10µs over a number, paid by any string value.
- Parsed values are cached by string (`style-grammar/src/runtime/scanFlatValue.ts:295`) and resolved values are cached per theme, scope, and property (`getSplitStyles.tsx:2482-2491`). The cache mostly helps when the same strings repeat.
- Hermes has no JIT, so absolute numbers on device will be higher. The multiplier is GUESSED and needs a device run; the ratios should hold.

### Compile time vs runtime

- The compiler resolves literal styles by calling the same `core.getSplitStyles` with `TAMAGUI_TARGET=native` at build time (`compiler/static/src/compilerHost.ts:1449`, READ). So `margin="10px 20px"` on a component that flattens has zero runtime cost. Only dynamic values (`margin={cond ? "4px 8px" : "8px"}` with an unknown `cond`, or props passed through from outside) parse at runtime.
- Recommendation: don't add a separate compile-time expander. The build and runtime already share one implementation, which is the right shape.
- If string values become a measured problem on Hermes, the lever is the shared string path (normalize `"Npx"` to a number earlier), not multi-value handling.

## 7. Recommendations, in order

1. **Now, small:**
   - Expand `gap: "a b"` on native (section 6).
   - Until grid emulation exists, strip `display: "grid"` on native and `warnOnce` in dev naming the dropped grid props, so nothing silently falls back to a flex column.
2. **Prototype tier 1 grid emulation on v3-beta:**
   - One module in `@tamagui/web` native code, entered from createComponent on a resolved `display === "grid"`.
   - Add the missing flat props: `gridTemplateRows`, `gridArea`, `gridAutoFlow`, `gridAutoRows`, `gridAutoColumns`.
   - Extend the `TAMAGUI_CSS_GRID` gate list to match.
   - Add a compiler deopt for grid containers on native.
   - Test with kitchen-sink parity: web CSS grid vs native emulation screenshots across the patterns in the section 2 table.
   - Measure on Hermes per section 5.
3. **Tier 2** (`auto-fit`/`minmax`, unequal fr) after tier 1 is measured. It is the second most common real pattern (soot settings, tamagui.dev Grid).
4. **Tier 3 stays unsupported,** with a dev warning. Tell stacking users to use `position: absolute` plus a measured height, which is what soot WebsiteNav already does.
5. **Exit plan:** when Tamagui's minimum RN has Yoga grid with prop plumbing, pass supported grid props straight through, keep emulation only for `repeat()`/`auto-fit` if Yoga still lacks them, and delete the rest. Pick at build time by RN version.
6. Don't pursue a Yoga patch (B) or a custom Fabric grid (C) now.

## Evidence

- Upstream: `gh pr view` / `gh search prs` on `react/yoga` and `react/react-native`; `gh api repos/react/yoga/commits`; raw `main` sources `conversions.h`, `propsConversions.h`, `YogaStylableProps.cpp`, `ReactNativeStyleAttributes.js`, `CalculateLayout.cpp`.
- Tamagui: v3-beta worktree `~/.worktrees/tamagui-v3-docs-pass2` @ 20a3a105f6 (`helpers/src/validStyleProps.ts`, `web/src/helpers/expandStyle.ts`, `web/src/helpers/getSplitStyles.tsx`, `web/src/dom/styleTypes.ts`, `style-grammar/src/shorthands/geometricShorthand.ts`, `compiler/static/src/compilerHost.ts`).
- Probes: a temporary `core-test/zzProbeGridShorthand.native.test.tsx` in `~/.worktrees/tamagui-tw-finish` (deleted after running; a copy is in this session's scratchpad as `probe.tsx`), and `yoga-grid-probe.mjs` (scratchpad). The v3-beta worktree has no `node_modules` and the v3-site worktree has no built dist, so the runtime probe ran on the newest built v3 worktree.
