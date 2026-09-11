# bailout lever audit

## Summary

- **READ:** The checked-in metric is accurate: 2,595 candidates across 253 files, 2,078 lowered, 517 bailed, and 340 `component runtime contract` entries. The 340 class-name diagnostics add up exactly to 340.
- **READ:** The runtime probe does not support one blanket conclusion. `className="probe-xyz"` reaches the DOM for Button, Input, Label, Card, and XGroup. It does not reach the DOM for ListItem.
- **INFERRED:** A retained behavior HOC can mechanically receive compiler-generated classes through the existing partial-extraction return (`flattened: false`), but the current path is not a safe generic tier for behavior HOCs. Its safety gate deliberately excludes the runtime style sources that would decide whether the generated class wins or loses.
- **READ:** A controlled one-component probe measured Button versus a host element. In this happy-dom harness, Button took 4.8399 ms of Profiler mount work versus 0.5279 ms for the host, and 0.1906 ms median update work versus 0.0007 ms. This is a relative probe, not a production-browser budget.
- **READ:** The recorded 19.3 ms `Group hover` result is from an older artifact at commit `398b93155b08c96d8b080953fe8efebe5734e2db`. A fresh production run at the audit SHA reported compiler `bailed 0` for the benchmark module and measured 0.7 ms mount and 2.1 ms rerender for the group workload. Bailout rate does not explain that old gap.

## Findings

### F1. The 340-element metric is real, but className forwarding is component-specific  [severity: high] [size: M] [label: READ]

- Evidence: `code/compiler/static-tests/tests/fixtures/bailoutMetric.expected.json` reports:

  ```json
  {
    "files": 253,
    "found": 2595,
    "lowered": 2078,
    "flattened": 2060,
    "styled": 55,
    "bailed": 517
  }
  ```

  The same file reports `"component runtime contract": 340`, and a `jq` sum of every reason containing `does not accept className` is `340`. The largest component counts are Button 206, Input 45, Label 23, ListItem 12, and XGroup 8. **READ:** `code/compiler/static/src/compilerHost.ts:1132-1135` computes `acceptsClassName` as `acceptsClassName !== false && !neverFlatten && !context`; `:1336-1342` bails before any later lowering path with `${component.key} does not accept className`.

- **READ:** The runtime probe passed one tree through the built web packages and printed the following raw HTML. The `probe-xyz` token is present on Button, Input, Label, Card, and XGroup, and absent from the ListItem `<li>`:

  ```text
  RAW_HTML=<span aria-hidden="true" hidden="" data-tamagui-config-revision="1346665106" data-tamagui-config-revision-parts="{&quot;media&quot;:&quot;2088666861&quot;,&quot;themeNames&quot;:&quot;801574318&quot;,&quot;themeVariables&quot;:&quot;559364601&quot;,&quot;tokens&quot;:&quot;200528947&quot;,&quot;fonts&quot;:&quot;301787118&quot;,&quot;shorthands&quot;:&quot;2146910233&quot;}"></span><span class="t_light _dsp_contents"><span class=" t_light is_Theme" style="color: var(--color); display: contents;"><span class="_dsp_contents  font_body"><button type="button" role="button" tabindex="0" data-disable-theme="true" class="is_ButtonFrame is_View _ai-1980109838 _fd-1289797684 _fw-1500538156 _jc-658029924 probe-xyz"><span class="is_ButtonText is_Text _fg-169839738 _fs-1866857425">hi</span></button><input tabindex="0" data-disable-theme="true" class="is_View font_body _tt-297848483 _ff-398910644 _fw-672061085 _ls-1643456874 _fs-893655883 _c-533586090 _h-60943763 _btlr-1578772308 _btrr-2029095411 _bbrr-1743091777 _bblr-1036763128 _ow-218240270 _mw-325727330 probe-xyz" name="Input"><label id="«r5»" data-disable-theme="true" class="is_Label is_Text font_body _tt-745650234 _ff-1640205464 _fw-1379533702 _ls-870375212 _fs-183738666 _lh-555991973 _c-1572260098 _bc-999768323 _d-1870371365 _ai-1980109838 _us-1298334435 _c-895109907 probe-xyz">label</label><li role="listitem" data-disable-theme="true" class="is_ListItem is_View _ai-1980109838 _jc-874768870 _fw-1500538156 _w-132203642 _mw-2068604972 _ox-1551223136 _oy-936289697 _fd-1289797684 _mh-676972991 _pr-319136095 _pl-599719854 _pt-641597123 _pb-581967491 _g-1880271148"><span class="is_ListItemText is_Text font_body _tt-745650234 _ff-1640205464 _fw-1640205464 _fs-1866857425 _mw-2068604972 _ox-1551223136 _oy-936289697 _to-1313165794 _ws-46073318 _c-492933209">item</span></li><div class="is_Card is_View _fd-1155724988 _btlr-1578772308 _btrr-2029095411 _bbrr-1743091777 _bblr-1036763128 _p-1627881459 probe-xyz">card</div><div data-disable-theme="true" class="is_GroupFrame is_View _btlr-1578772308 _btrr-2029095411 _bbrr-1743091777 _bblr-1036763128 _fd-1289797684 probe-xyz">group</div></span></span></span>
  ```

  **READ:** The exact captured `ListItemText` class segment in the probe log was `font_body _tt-745650234 _ff-1640205464 _fw-1379533702 _ls-870375212 _fs-1866857425 _mw-2068604972 _ox-1551223136 _oy-936289697 _to-1313165794 _ws-46073318 _c-492933209`; the relevant observation is that it contains no `probe-xyz`.

- **INFERRED:** The ListItem result is consistent with its source. `code/ui/list-item/src/ListItem.tsx:171-186` destructures `processedProps = useProps(propsIn)` and builds `frameProps` from `rest` at `:214-218`; the raw `propsIn` object is not used for the forwarded frame props. Button takes the safer shape: `code/ui/button/src/Button.tsx:193-199` builds `frameProps` from raw `propsIn`, and `:246-281` returns those props to `ButtonFrame`, so `className` survives its fixed internal-prop deletion list.

- Why it matters: The 340 count is a count of compiler contract bailouts, not a count of className bugs. Five of the six requested components prove that runtime className forwarding works; ListItem proves that forwarding is not universal. Removing the bailout for all 340 would silently change behavior for at least one shape that currently drops the raw className.

- Proposed change: none in this read-only audit. Treat the 340 as a retained-runtime opportunity only after component-by-component forwarding and style-source evidence. The current metric and diagnostic naming should not be interpreted as proof that className is lost.

- Risk / what could make this wrong: The probe used the web runtime and the checked-in built packages after a cold repository build. A native render or a component-specific skin could have different forwarding behavior. The raw web output is still direct evidence for the requested Q1.

### F2. The existing partial path is a narrow mechanism, not a safe generic HOC tier  [severity: high] [size: L] [label: INFERRED]

- Evidence: `code/compiler/static/src/compilerHost.ts:1672-1677` reaches partial extraction only after the class-name bailout at `:1336-1343`. When reached, `:1721-1731` constructs `partialProps` from static call-site entries and `:1751-1779` returns edits with `flattened: false`, which is exactly the mechanical shape of “retain the component, add compiler classes.”

- **INFERRED:** A generic behavior HOC cannot be admitted to that path without proving all of the following runtime interactions. Each one can produce wrong output:

  1. **Atomic specificity and insertion order.** `compilerHost.ts:1139-1141` explicitly records the hazard: splitting retained runtime sources into equal-specificity atomic classes lets stylesheet insertion order decide the winner. `cssOwnersConflict` at `:575-589` only compares owners visible in the candidate’s call-site dynamic and static entries. It does not prove that a behavior HOC’s later frame render, context provider, or runtime variant will not write the same property.
  2. **The HOC’s own styled frame.** Button is `createStyledHOC(ButtonFrame, ...)` at `code/ui/button/src/Button.tsx:289-295`; `ButtonFrame` is a `styled(View, ...)` definition with `context`, role, render, and frame styles at `:48-66`. `createStyledHOC` copies the wrapped static config and sets `neverFlatten: true` at `code/core/web/src/createStyledHOC.tsx:62-69`. A compiler class added to the retained outer component can compete with the frame’s atomic classes, and the current partial owner calculation does not model the frame’s runtime insertion timing.
  3. **Context-provided styles.** `ButtonFrame` uses `ButtonContext`, and Card and ListItem use `createStyledContext` in `code/ui/card/src/Card.tsx:11-14` and `code/ui/list-item/src/ListItem.tsx:47-55`. Button computes a `textContext` and places it in a provider at `code/ui/button/src/Button.tsx:212-280`. Those values are runtime inputs to the retained frame and can override or add styles after the compiler has emitted a call-site class.
  4. **Variants selected at runtime.** `partialStaticConfig` at `compilerHost.ts:1249-1256` deliberately strips `defaultProps`, `defaultVariants`, `compoundVariants`, and `variants` before computing owners and partial classes. The retained component still resolves those sources later. A variant or compound variant that owns the same CSS property can win by insertion order, while a default variant can contribute a style missing from the compiler class.
  5. **Styled-definition defaults are merged later.** The partial branch only sees `partialProps` from call-site entries. The full path does `core.getDefaultProps` and merges `defaultProps` with call-site `props` at `compilerHost.ts:1827-1839`, after the partial branch. Handoff section 23 records the concrete version of this ordering hole: compiler lowering read call-site props before `completeProps` merged styled-definition defaults, so definition-level animation props were dropped by ordinary compilation. Relaxing the `partialRuntimeSafe` gate would reintroduce the same class of omission for any default style.
  6. **Behavior code can rewrite or discard props.** Button calls `useProps(propsIn)` at `Button.tsx:157-162` but forwards a raw-props copy at `:193-199`. ListItem forwards `rest` from `processedProps` at `ListItem.tsx:171-186` and `:214-222`, which is why the Q1 probe loses `className`. The compiler sees a static component descriptor, not the arbitrary prop transform inside each behavior function. A generated class can therefore be attached to a retained component whose behavior does not forward it to the eventual host.
  7. **Theme and media state remain runtime inputs.** `lowerCandidate` resolves the call-site class using static props, while the retained component calls `useThemeWithState`, `useMedia`, `useComponentState`, and `useSplitStyles` in `code/core/web/src/createComponent.tsx:814-855`. The compiler already treats theme boundaries as a runtime bailout at `compilerHost.ts:1589-1638`. A retained HOC can read a changed theme or media state and emit a competing style after the class was computed.

- **INFERRED:** The answer to Q2 is therefore “mechanically possible for a proven forwarding HOC, unsafe as a generic middle tier.” The existing partial path can add classes while keeping the component, but it does not carry enough information to establish the required ordering and forwarding proof for the 340 entries. The current `partialRuntimeSafe` exclusions are doing real correctness work, rather than merely leaving performance on the table.

- Why it matters: A bad middle tier would render successfully while applying the wrong color, spacing, variant, theme value, or animation. That is harder to detect than a visible bailout and can vary with first-use CSS order.

- Proposed change: none in this read-only audit. The evidence does not support a broad implementation opportunity. A component-specific tier would require a new proof contract for forwarding and every runtime style source.

- Risk / what could make this wrong: A future HOC descriptor could explicitly enumerate its forwarded style props, frame styles, context writes, defaults, and variant ownership. That could make a constrained tier sound. The current descriptors and runtime code do not provide that proof.

### F3. One bailed Button has measurable runtime cost, but the 19.3 ms group result is not bailout work  [severity: high] [size: M] [label: READ]

- Evidence: The temporary Vitest probe compared `<Button className="probe-cost" padding={8}>hi</Button>` with a host `<button className="probe-cost" style={{padding: 8}}>hi</button>` under the same `TamaguiProvider`. It ran 100 forced rerenders after 10 warmups. Raw output:

  ```text
  COST button mountProfilerMs=4.8399 updateProfilerMedianMs=0.1906 updateWallTotalMs=52.4143 updateWallPerRenderMs=0.5241 phases=100
  COST host mountProfilerMs=0.5279 updateProfilerMedianMs=0.0007 updateWallTotalMs=28.4336 updateWallPerRenderMs=0.2843 phases=100
  ```

- **READ:** The source explains the work represented by that difference. A retained component executes `createComponent` and its runtime hooks, including `useComponentState` at `code/core/web/src/createComponent.tsx:522-590`, `useThemeWithState` and `useMedia` around `:814-855`, and `useSplitStyles` at `:855-870`. `useSplitStyles` calls `getSplitStyles` and schedules `insertStyleRules` at `code/core/web/src/helpers/getSplitStyles.tsx:1681-1692`. A flattened host bypasses those component style-resolution hooks and receives the emitted class directly. Button also retains its behavior render and nested ButtonText, as shown in the raw Q1 markup.

- **INFERRED:** In the controlled probe, the Button minus host differences are approximately 4.31 ms of Profiler mount work, 0.19 ms of median render-phase update work, and 0.24 ms per forced rerender in wall-clock work. These are upper-bound-ish component comparisons because the Button has real behavior and a nested text element; they are not a claim that every one of the 340 entries costs the same.

- **READ:** The production hot-path profile for the current compiled group workload reported:

  ```text
  mount median 0.7ms  update median 2ms
  allocation 612200 bytes/iteration, 382.6 bytes/render over 1600 renders (sampled @1024B)
  allocation bytes/iteration by source
     316661  node_modules/react-dom/cjs/react-dom-client.production.js
      53488  code/comparisons/tamagui-bench/src/index.tsx
      52320  node_modules/react/cjs/react-jsx-runtime.production.js
        108  code/core/web/dist/esm/createComponent.mjs
  ```

  The compiled group output contains literal `div` elements with generated classes. The current production benchmark also logged `[tamagui] compiler stats: 1 modules with candidates` followed by `found 14 · lowered 14 (flattened 11, partial 3, styled 0) · bailed 0`.

- **READ:** A fresh production benchmark at the audit SHA `de0d19404fdad9b4af1ae7bc13ab7bc9cf5a8001` used Chromium 145 on an Apple M3 Max with 200 items, 3 retained samples, and 2 warmups. Its group summary was:

  ```text
  Tamagui v3 compiled: mount mean 0.7000 ms, rerender mean 2.1000 ms
  Tailwind:            mount mean 0.6000 ms, rerender mean 2.5333 ms
  Inline:              mount mean 1.3667 ms, rerender mean 3.3667 ms
  ```

- **READ:** The old checked-in HTML says `Group hover` mount is 19.3 ms for Tamagui v3 compiled and 1.3 ms for Tailwind at `code/comparisons/output/benchmarks.html:26-33`, but the same metadata identifies commit `398b93155b08c96d8b080953fe8efebe5734e2db`, while the audit is at `de0d194...`. `plans/v3-beta-campaign-plan.md:228-232` only establishes Gate 4 as a benchmark gate; it does not make that old artifact a receipt for this SHA.

- **INFERRED:** The bailout rate does not explain the old 19.3 ms group result. The workload source uses only `View` with literal style props in `code/comparisons/tamagui-bench/src/index.tsx:64-96`; the fresh compiler receipt says `bailed 0`, and the production profile’s style-engine allocation is effectively absent. The evidence points to changed or stale benchmark conditions and ordinary React DOM / host workload costs. This audit does not identify one exact cause for the old artifact, so 19.3 ms should not be priced against the 340 HOC bailouts.

- Why it matters: The opportunity is real at the component level. A runtime Button pays for behavior plus style resolution on every render. It is not the explanation for the named Gate 4 group benchmark, which is a fully lowered host workload in the fresh receipt.

- Proposed change: none in this read-only audit. Reprice the bailout opportunity with component-specific production-browser profiles, and keep the group benchmark as a separate compiler or harness investigation.

- Risk / what could make this wrong: The one-component cost probe is happy-dom, and the fresh benchmark used only 3 retained samples. The old and fresh benchmark artifacts also differ in commit, browser build inputs, and sample counts. Those limits affect the absolute milliseconds, but they do not change the direct observation that the fresh group compiler stats have zero bailouts.

## Ideas (speculative, not findings)

### I1. A constrained HOC proof could be evaluated separately

**IDEA:** If a future descriptor can prove raw className forwarding, enumerate frame and context style owners, account for defaults and variants, and define insertion order, measure that small HOC subset independently. The current evidence does not justify treating all 340 contract bailouts as one lever.
