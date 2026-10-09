# runtime testing and validation

## Summary

- **KNOWN-OPEN, highest impact:** the native Vitest resolver is web-first after Vite merges plugin configuration. I counted 64 platform-suffixed test files in the four native-looking roots. A relative-import graph probe found 20 of them reach a local module where the current resolver chooses the base/web file before a native sibling. The handoff's direct repro remains 5 core-native files and 9 failures when native-first resolution is enabled.
- `html.*` has a useful native smoke suite, but it tests 10 of 49 exported tag entries. It asserts only `ref.tagName`, one direct HTML event (`onClick`), and one compiled-runtime text-input event (`onChange`). The other event mappings and most ref facade methods are unasserted.
- CI's unit matrix is jsdom/Vitest plus headless Chromium/WebKit. iOS Detox and Maestro run simulators, Android Detox runs an emulator only on main and release branches. There is no physical-device CI. The conformance pixel harness is not called from any workflow.
- The Tailwind conformance harness is real and valuable, with a same-tree oracle comparison, but it is Tailwind-specific and manually staged. It does not provide general web/native component parity or a CI gate.
- The kitchen-sink suite gives high-risk dialog, sheet, select, menu, popover, focus, and dismiss behavior substantial web coverage. Of the 61 `code/ui` packages, 36 have a named kitchen-sink integration path, 9 appear only indirectly through another component, and 16 have no matching integration test/usecase in the search scope.
- Test health has many intentional and conditional skips. I found 65 skip sites in kitchen-sink tests/e2e, 7 in core/compiler, no `.only`, and 161 direct emitted-source assertions across 15 compiler test files. Besides the two handoff-known load-sensitive tests, `OnLayoutStress`, `MotionLinkedBenchmark`, and elapsed animation timing checks can fail when a busy runner delays frames.

## Findings

### F1. Native Vitest resolves web variants before native variants  [severity: high] [size: M] [label: KNOWN-OPEN]

- Evidence: `code/packages/vite-plugin-internal/src/getConfig.ts:54-69` defines the native-first extension list, and its native-test plugin returns it at `:83-107`. However, `code/compiler/vite-plugin/src/plugin.ts:734-747` defines the Tamagui plugin list starting with `.web.mjs`, `.web.js`, `.web.jsx`, `.web.ts`, and `.web.tsx`. The handoff records the merge behavior and the observed result at `plans/v3-handoff-log.md:1782-1813`.
- Verification: I built both relevant local packages and ran a Vite `resolveConfig` probe with the actual plugin extension arrays. The final array began with the 12 web/base entries and only then contained `.native.tsx`, `.native.ts`, `.native.js`, and `.native.jsx`; the measured indexes were `webIndex: 0`, `nativeIndex: 12`. This independently reproduces the resolver ordering rather than relying only on the handoff.
- Scope: `find code -type f` found 64 platform-suffixed test files, excluding snapshot files: 36 under `code/core/core-test`, 10 under `code/compiler/static-tests/tests`, 14 under `code/ui/components-test`, and 4 under `code/core/tailwind`. The filtered native CI command runs the first three roots, 60 files by this count (`.github/workflows/checks.yaml:133-137`).
- Impact measurement: a static relative-import graph probe over those 64 files found 20 files that reach at least one ambiguous local import for which the current final extension order selects a base/web file before a native sibling: 17 core-test, 2 static-tests, and 1 Tailwind file. This is a lower-bound graph metric, not a claim that every assertion in those 20 files is web-only. Package exports and aliases can add cases. The handoff's stronger direct observation remains 5 core-native files and 9 failures after forcing native-first resolution, covering refs, native fast-path links, Tailwind Dimensions, stable-style rendering, and colors.
- Why it matters: a green native test can currently certify the wrong implementation. Fixing the resolver is not a test-only change because the known 9 failures must be triaged into stale web expectations versus native product defects.
- Proposed change: make the native resolution order authoritative at the source, then run the three filtered native suites and the four Tailwind native files separately. Record each of the 9 failures with a product/test decision. Add a resolver assertion that fails when a native config's final extension list has a web extension before a native extension.
- Risk / what could make this wrong: the graph scan is intentionally conservative and cannot prove all package-level resolution. The 5-file/9-failure measurement is the established handoff repro and should be treated as the triage budget, not extrapolated to all 64 files.

### F2. Native `html.*` coverage is a smoke slice, not a mapping contract  [severity: high] [size: M] [label: READ]

- Evidence: `code/core/dom/src/tables/nativeBacking.ts:23-103` defines 49 native HTML entries across View, Text, Image, and TextInput backings. `code/core/web/src/dom/html.native.tsx:1355-1405` exports all 49 entries. The direct suite `code/core/core-test/domHtmlRuntime.native.test.tsx:84-100` renders only `div`, `p`, `span`, `img`, and `input` in its backing test. Across the file's JSX, the directly exercised entries are `a`, `div`, `h1`, `img`, `input`, `li`, `p`, `span`, `textarea`, and `ul`, 10 of 49. `optgroup`, `option`, and `select` are exercised only as the unsupported dynamic-tag error case at `:326-333`.
- Mapping inventory (source backing and direct `domHtmlRuntime.native` coverage):

| tag | native backing | direct test |
| --- | --- | --- |
| `a` | Text | yes |
| `article` | View | no |
| `aside` | View | no |
| `b` | Text | no |
| `bdi` | Text | no |
| `bdo` | Text | no |
| `blockquote` | View | no |
| `br` | Text | no |
| `button` | View | no |
| `code` | Text | no |
| `del` | Text | no |
| `div` | View | yes |
| `em` | Text | no |
| `fieldset` | View | no |
| `footer` | View | no |
| `form` | View | no |
| `h1` | Text | yes |
| `h2` | Text | no |
| `h3` | Text | no |
| `h4` | Text | no |
| `h5` | Text | no |
| `h6` | Text | no |
| `header` | View | no |
| `hr` | View | no |
| `i` | Text | no |
| `img` | Image | yes |
| `input` | TextInput | yes |
| `ins` | Text | no |
| `kbd` | Text | no |
| `label` | Text | no |
| `li` | View | yes |
| `main` | View | no |
| `mark` | Text | no |
| `nav` | View | no |
| `ol` | View | no |
| `optgroup` | unsupported native select | error path only |
| `option` | unsupported native select | error path only |
| `p` | Text | yes |
| `pre` | Text | no |
| `s` | Text | no |
| `section` | View | no |
| `select` | unsupported native select | error path only |
| `span` | Text | yes |
| `strong` | Text | no |
| `sub` | Text | no |
| `sup` | Text | no |
| `textarea` | TextInput | yes |
| `u` | Text | no |
| `ul` | View | yes |

- Event evidence: the source has 44 event rows in `code/core/dom/src/tables/events.ts:37-174`. The direct HTML suite tests `onClick` to Press at `domHtmlRuntime.native.test.tsx:309-317`, and rejects unsupported `onWheel` and invalid `onKeyDown` at `:344-355`. `domRuntimeContext.native.test.tsx:237-294` tests compiled-frame `onClick` for View/Text/Image and `onChange` for TextInput. It also tests internal hover/focus/active context transitions at `:205-235`. There is no direct assertion for native HTML `onInput`, image `onLoad`/`onError`, successful `onKeyDown`, pointer/touch, mouse, focus/blur, or scroll forwarding.
- Ref evidence: `code/core/web/src/dom/primitives.native.tsx:142-235` exposes `nodeName`, `tagName`, native focus/measure methods when present, scaled geometry, image `complete`, and input/textarea selection fields. The only HTML ref assertion is `ref.current?.tagName === 'DIV'` at `domHtmlRuntime.native.test.tsx:319-323`. No test asserts `nodeName`, cleanup to null, `getBoundingClientRect`, scale handling, `complete`, selection, or focus/measure method binding.
- The named `DOMRuntime*Frames` follow-up is already fixed on this SHA: `primitives.native.tsx:557-594` now puts `neverSkipProps: domEventProps` on all four frames. The compiled runtime test at `domRuntimeContext.native.test.tsx:237-294` would fail if those handlers were dropped, because it invokes the forwarded `onPress`/`onChange` and expects each callback once. This is closed coverage evidence, not an open bug. It still does not exercise a Metro-produced compiled bundle.
- Why it matters: a new tag can be wired to the wrong primitive without failing; handler regressions can pass for untested events; and the DOM-shaped ref promise is much larger than the one asserted property.
- Proposed change: make one table-driven native runtime contract from `NATIVE_BACKING`, with every exported tag, representative literal child behavior, one supported/unsupported case, and event/ref cases selected from the event table. Keep the 49-tag test cheap by asserting the actual backing primitive and metadata rather than snapshots.
- Risk / what could make this wrong: some entries intentionally share exactly the same implementation, so a generated table test should avoid pretending every tag has unique behavior. The gap is the absence of a contract that the full mapping table stays wired, not evidence that all 39 untested tags are currently broken.

### F3. Conformance is real but Tailwind-specific and outside CI  [severity: high] [size: M] [label: READ]

- Evidence: `code/comparisons/conformance/PLAN.md:8-15` describes 122 single-source cases rendered as real Tailwind v4, Tamagui web, and Tamagui native on an iOS simulator. It records 115/122 web and 116/120 native results. `run.ts:4-6,29-31,130-153` captures screenshots and pixel-diffs Tailwind oracle versus Tamagui web with a 1% diff allowance. `run-native.ts:1-12,27-29,97-114,160-214` compares native iOS crops against the real Tailwind oracle with a 6% allowance.
- CI verification: `rg` over `.github/workflows` found no invocation of `code/comparisons/conformance/run.ts`, `run-native.ts`, or `pixelmatch`. The matrix explicitly marks Tailwind native as `no` at `plans/v3-final-conformance-matrix.md:98-100`, and says device suites are separate from the green unit matrix at `:245-249`.
- What it asserts: same authored Tailwind class tree, same oracle, rendered geometry, screenshots, and diff percentages. It does not assert general Tamagui component behavior, event order, focus scopes, dismissal, refs, or HTML runtime tags. It also skips inherent model differences such as margin collapse and text rasterization, documented in `PLAN.md:47-56`.
- What is missing: there is no general test that a normal Tamagui tree produces equivalent web and native visual or semantic output. The existing harness is a good model for one parity family, not a component-library conformance gate.
- Proposed change: first wire the existing report-producing web/native conformance command into a scheduled or explicitly selected CI job with artifacts and a pinned simulator. Then add a small runtime parity matrix for high-risk primitives (dialog, sheet, select, popover, menu, input, `html.*`) that checks state transitions and refs, not only pixels.
- Risk / what could make this wrong: pixel equality across web and native is inherently bounded by font rasterization and layout models. The harness already documents those limits, so a useful general story should compare normalized geometry and semantics for selected cases rather than demand browser/native pixel identity everywhere.

### F4. CI covers host runtimes and simulators, not physical devices  [severity: high] [size: M] [label: READ]

- Evidence: `.github/workflows/checks.yaml:133-137` runs web unit tests and the three filtered native Vitest packages on `ubuntu-latest`. The kitchen-sink integration job runs `npx playwright test` in three shards on Ubuntu at `:201-247`, with Chromium and WebKit browser dependencies installed at `:87-89`. These are jsdom/Vitest and headless browser execution, not React Native device execution.
- iOS: `.github/workflows/test-native.yml:110-124,284-292` builds and runs Detox on `macos-15` iPhone 16 simulators, with two simulated devices on main and one elsewhere. `.github/workflows/test-ios-native.yml:181-209` runs Maestro flows against an iOS simulator. `docs/using-ios.md:3-18,31-45` documents Detox, and `:84-90` says native tests can take screenshots. These suites cover app-level gestures, keyboard/sheet behavior, navigation-like flows, and selected screenshot artifacts, but they are simulator tests.
- Android: `.github/workflows/test-native.yml:578-584,641-660` uses `reactivecircus/android-emulator-runner` with API 31, Pixel 4, x86_64, and software graphics. The job condition is main, `v*`, or `rn82`, so it is not a PR gate. It is an emulator, not a physical Android device.
- Package wiring: `code/kitchen-sink/package.json:20-39` exposes iOS Detox, Android Detox, and Maestro scripts, but its aggregate `test:native` invokes iOS Detox and Maestro only. CI's Android workflow calls its own emulator job separately.
- Gap: there is no physical iOS or Android device in these workflows, no Android PR gate, and no native component integration job that exercises the full 61-package UI surface. The native unit matrix is still a host-side test runner even when it resolves native modules.
- Proposed change: keep the fast host tests, add a small PR device gate on one iOS simulator and one Android emulator for the high-risk interaction matrix, and run the broader Detox/Maestro suite on main. Treat physical-device validation as a release or scheduled lane if hardware becomes available.
- Risk / what could make this wrong: a simulator/emulator is still valuable native execution and catches many layout, gesture, keyboard, and lifecycle bugs. The claim is specifically that it does not cover physical hardware-specific behavior such as GPU, touch sampling, IME, accessibility services, or vendor differences.

### F5. High-risk components have web integration tests, but 16 UI packages have no named kitchen-sink path  [severity: med] [size: M] [label: READ]

- Method: I counted 61 package manifests under `code/ui/*/package.json`. I searched all `code/kitchen-sink/tests` and `code/kitchen-sink/src/usecases` files for package names, component names, test names, and demo names. “Named” means the package/component has an explicit test or usecase path. “Indirect” means it is exercised only as an implementation dependency of another named component. This search could have seen a positive path because it covered both the integration tests and usecase source, but it cannot prove that every transitive package is behaviorally exercised.

| package | status | representative evidence or gap |
| --- | --- | --- |
| `accordion` | named | `Accordion.test.tsx`, `AccordionNativeDriver.test.tsx` |
| `adapt` | named | `DialogSheetAdapt*`, `SelectAdaptSheetUnmount*`, `AdaptLiveSlotSpike` |
| `alert-dialog` | none found | no matching kitchen-sink test/usecase found |
| `animate-presence` | named | `AnimatePresenceEnterExit.animated.test.tsx` |
| `animate` | named | animation behavior and transition suites |
| `avatar` | none found | no matching kitchen-sink test/usecase found |
| `button` | named | `BuildAButton`, `ButtonCircular`, `ButtonSkin`, focus tests |
| `card` | none found | no matching kitchen-sink test/usecase found |
| `checkbox-headless` | none found | Checkbox coverage is skin/demo-level |
| `checkbox` | named | `ActiveStateBackground`, `StyledCheckboxTheme`, web component tests |
| `collapsible` | indirect | exercised through accordion behavior, no named collapsible path |
| `collection` | indirect | used by menu/select internals, no named collection path |
| `components-test` | infrastructure | test package, not a user component |
| `context-menu` | none found | no matching kitchen-sink test/usecase found |
| `create-menu` | indirect | menu implementation dependency, no named package path |
| `dialog` | named | `DialogFocusScope`, `DialogNested`, `DialogOpenControlled`, pointer/presence suites |
| `dismissable` | named | `DismissLayerStacking`, `DismissableLayerToggle` |
| `elements` | indirect | shared element machinery, no named package path |
| `field` | named | `FieldForm`, `FieldReactHookFormBridge` |
| `focus-guard` | indirect | covered through focus-scope/dialog behavior |
| `focus-scope` | named | `PopoverFocusScope`, `FocusScopeNoFocus`, dialog focus tests |
| `focusable` | named | menu accessibility and focus-scope suites |
| `form` | named | `FormButtonType`, `FieldForm`, input/form suites |
| `group` | named | `GroupUseCases`, group pseudo and toggle-group tests |
| `image` | named | `ImageTokenStyle`, native image coverage |
| `input` | named | `NewInputBasic`, events, refs, focus, text shorthand |
| `label` | named | field/select/input integration paths |
| `linear-gradient` | none found | no matching kitchen-sink test/usecase found |
| `list-item` | named | `ListItem.test.tsx` |
| `menu` | named | 20+ menu focus, keyboard, dismiss, position, submenu suites |
| `popover` | named | popover focus, scoped, hover, position, dismiss suites |
| `popper` | indirect | positioned by menu/popover, no named package path |
| `portal` | named | nested dialog, sheet, menu, z-index paths |
| `progress` | named | `Progress.animated.test.tsx` |
| `radio-group` | none found | no matching kitchen-sink test/usecase found |
| `radio-headless` | none found | no matching kitchen-sink test/usecase found |
| `react-native-web` | named | `StyledRNW.test.tsx` |
| `remove-scroll` | indirect | exercised by modal/menu surfaces, no named package path |
| `roving-focus` | indirect | exercised through menu keyboard behavior, no named package path |
| `scroll-view` | named | sheet scroll/keyboard/overflow suites |
| `select` | named | focus, keyboard nav, typeahead, positioning, multiple, adapt suites |
| `separator` | named | `Separator.test.tsx` |
| `shapes` | none found | no matching kitchen-sink test/usecase found |
| `sheet` | named | drag, snap, keyboard, overlay, scroll lock, animation suites |
| `slider` | named | `SliderForm`, `SliderStyled` |
| `spacer` | none found | no matching kitchen-sink test/usecase found |
| `spinner` | named | `SpinnerCustomColors.test.tsx` |
| `stacks` | named | broad XStack/YStack use plus layout/style tests |
| `switch-headless` | indirect | exercised through Switch, no named headless path |
| `switch` | named | `SwitchStyled`, active-state tests |
| `tabs-headless` | indirect | exercised through Tabs, no named headless path |
| `tabs` | named | `TabsActivation`, `TabsOnInteraction`, hover suites |
| `tamagui` | named | kitchen-sink aggregate package is the integration surface |
| `text-test` | none found | no matching kitchen-sink test/usecase found |
| `text` | named | text/html/style and broad rendered-tree tests |
| `toast` | named | `Toast`, `ToastMultiple` |
| `toggle-group` | named | `ToggleGroup`, filled-active, XGroup, active-props suites |
| `tooltip` | named | animation, rapid-switch, group, multi-trigger, positioning suites |
| `ui` | none found | umbrella package has no named integration path |
| `visually-hidden` | none found | no matching kitchen-sink test/usecase found |
| `z-index-stack` | named | `StackZIndex`, nested overlay tests |

- Risk weighting: this is a reasonable web integration story for dialog, sheet, select, popover, menu, focus, and dismiss behavior. The largest component gap is platform depth, not the lack of a dialog test: those tests run in Playwright web projects, while only selected native e2e flows exercise native behavior.
- Proposed change: add explicit component-package ownership metadata to the kitchen-sink test manifest, then require one named integration case for each public package with interaction or platform behavior. Prioritize `alert-dialog`, `context-menu`, `radio-group`, headless control packages, `visually-hidden`, and `linear-gradient` only after the high-risk native interaction matrix is in CI.
- Risk / what could make this wrong: aggregate `tamagui` imports make package attribution difficult. The table deliberately distinguishes named coverage from indirect coverage instead of claiming that an indirect dependency is unused.

### F6. Skips and source-string assertions reduce the suite's signal  [severity: med] [size: M] [label: READ]

- Skip evidence: scoped `rg` over `code/core`, `code/compiler`, `code/ui`, `code/kitchen-sink/tests`, and `code/kitchen-sink/e2e` found 65 kitchen-sink skip sites and 7 core/compiler skip or todo sites. Examples include the whole `ThemeMediaAnimation.test.tsx` suite (`:5`), whole `TamaguiSiteMotion` describe block (`:18`), `PopoverInitialPosition` (`:11`), a CI-wide skip for `PopoverHoverableStress` (`:136`), and multiple driver-conditional skips in `SheetAnimation`, `AnimationBehavior`, `FocusWithinStyle`, and `ExitCompletion`. Core/compiler examples are `componentProps.native.test.tsx:12,23`, `getSplitStyles.web.test.tsx:372`, `webAlignment.web.test.tsx:326`, `create-tamagui/test/starters.test.ts:38`, and `babel.web.test.tsx:799`.
- Search result: no `.only` occurrences were found in the same test globs. Conditional skips are not all defects, but the suite has enough disabled surface that the CI result is not a complete behavioral statement.
- Source-string evidence: direct assertions against generated source (`output.code`, `output.js`, `fullOutput`, or equivalent) occur in 15 compiler test files with 161 matching assertion lines. Examples are `code/compiler/static-tests/tests/domConformance.native.test.tsx:43-57`, `domPlatformFixture.test.tsx:34-51`, `e3-lowerer.web.test.ts:157-164`, `flatten.native.test.tsx:88-92`, and `babel.web.test.tsx:416-445`. These assert fragments such as `<__TamaguiDOMView`, `className`, `onClick`, or the absence of `style({`) rather than executing the emitted behavior. The repo audit rules classify these source-string checks as worthless and each occurrence is therefore a finding.
- Wiring evidence: `code/core/core-test/renderLoopBench.web.test.tsx:1-9,29-31` is explicitly a benchmark gated by `RENDER_BENCH`, and the matrix marks shuffled native/web suites as not CI at `plans/v3-final-conformance-matrix.md:103-104`. The conformance harness is also outside workflows (F3). These are useful local tools but unmeasured in normal CI.
- Why it matters: disabled suites and emitted-text assertions can stay green while the runtime behavior is wrong. Source-string tests are especially weak for the runtime half because they do not prove handler forwarding, refs, layout, or native host behavior.
- Proposed change: report skip counts by reason in CI, remove stale skips or convert them into issue-linked test cases, and replace the highest-value emitted-string assertions with executable transforms followed by React/runtime assertions. Do not hide a test by increasing thresholds or making a skip unconditional.
- Risk / what could make this wrong: some compiler tests intentionally guard an intermediate representation. The finding is about their use as runtime confidence, and the audit count is a direct inventory of the assertion shape, not a claim that every compiler string assertion should disappear immediately.

### F7. Several tests use load-sensitive wall-clock or performance ceilings  [severity: med] [size: M] [label: READ]

- Known-open tests: the handoff records `motionDriverConversion` with a 10x ceiling that observed 11.93x and `safeAreaVariables.native` with a 5-second runner limit that observed 10 seconds at `plans/v3-handoff-log.md:1973-1978`. The workflow itself explains that CPU contention makes those measurements unreliable at `.github/workflows/checks.yaml:300-305`.
- Additional wall-clock or ratio-shaped assertions found by searching test files for `performance.now`, `Date.now`, elapsed/duration variables, and numeric timing matchers:

| test | assertion / threshold | load sensitivity |
| --- | --- | --- |
| `code/kitchen-sink/tests/OnLayoutStress.test.tsx:10,93-94,148-149,171-172,193-194,229,301-302` | fails when measured IntersectionObserver delay exceeds `100ms`; the file configures three retries because it calls itself flaky in CI at `:43-45` | high; machine and browser scheduling affect the measured delay |
| `code/kitchen-sink/tests/MotionLinkedBenchmark.animated.test.tsx:20-28` | requires browser performance entry duration `< 2000ms` | medium/high; this is an actual performance ceiling under shared runners |
| `code/kitchen-sink/tests/TransformMediaQueryMerge.test.tsx` companion `TransitionEnterExit.animated.test.tsx:282-309` | requires measured exit `< 500ms`, and enter duration greater than exit | medium; event-loop contention can inflate elapsed time |
| `code/kitchen-sink/tests/AnimationBehavior.animated.test.tsx:51-91,142-186` | compares measured animation durations to `700ms` and `600ms` expectations | medium; intended animation behavior is mixed with wall-clock observation |
| `code/kitchen-sink/tests/DialogSheetAdaptUnmount.animated.test.tsx:187-221,272-299,362-418` | compares elapsed exit/enter windows against `300ms`, `350ms`, and `400ms` | medium; frame and scheduler delays can change the observed completion time |
| `code/kitchen-sink/tests/SheetAnimation.animated.test.tsx:323-344,398-421` | compares measured 100ms versus 1000ms animation durations with an absolute `250ms` gap | medium; the relative semantic assertion is useful, but the measurement remains browser-load dependent |

- The `TransformMediaQueryMerge` name is a geometry test; the elapsed threshold is in its companion `TransitionEnterExit` file. I found no additional native unit test with a source-level numeric elapsed assertion beyond the two handoff-known cases. Several other tests use `waitForTimeout` as synchronization, which is a flake risk but not a threshold assertion by itself.
- Proposed change: isolate performance tests onto dedicated jobs or mark them informational, capture raw measurements as artifacts, and use event/state completion signals for behavior tests. Keep the semantic animation assertions, but remove wall-clock gates where they do not measure the product contract. Never raise a threshold as the fix.
- Risk / what could make this wrong: an actual performance ceiling may be the intended contract. In that case it needs a controlled runner, repeated distributions, and a documented independent variable. A shared parallel CI worker is not a stable benchmark.

### F8. Visual and accessibility coverage exists in narrow places, with no broad regression story  [severity: med] [size: M] [label: READ]

- Visual evidence: `code/kitchen-sink/tests/StyleValidation.test.tsx:257` has one Playwright `toHaveScreenshot` assertion. Native Detox e2e uses `takeScreenshot` in selected tests such as `code/kitchen-sink/e2e/Accordion.test.ts:92,137,256`, `PressStyleNative.test.ts:99,148,203`, and `NativeRegistryCorrectness.test.ts:44`. These screenshots are artifacts for selected flows, not a broad baseline diff suite. The Tailwind pixel harness is covered in F3 and is not CI-wired.
- Accessibility evidence: `code/ui/components-test/package.json:22` includes `vitest-axe`; `Checkbox.web.test.tsx:16,84-85,117-118,134-135` has three axe assertions. Native `html.*` tests assert mapped accessibility props at `domHtmlRuntime.native.test.tsx:207-300`, and kitchen-sink Popover tests check accessibility attributes. I found no broad axe pass over dialogs, sheets, menus, selects, tooltips, or the kitchen-sink route, and no native accessibility-service assertion in the workflows.
- Why it matters: visual regressions in native geometry and overlay state can pass unit tests, while accessibility regressions can pass if only props are inspected rather than the platform accessibility tree and keyboard/focus behavior.
- Proposed change and cost: the cheapest useful version is a small Playwright axe suite over the existing high-risk dialog, sheet, select, menu, popover, and tooltip fixtures, plus 4 to 8 stable screenshots for open, closing, focus-trapped, and keyboard states. Run it in the existing kitchen-sink web job and upload diffs. Add one iOS Maestro/Detox accessibility identifier and focus/announcement flow for each high-risk primitive when the native suite is already running. This is roughly M, with baseline review and ongoing screenshot maintenance.
- Risk / what could make this wrong: axe cannot inspect native platform semantics, and screenshot baselines can become noise if animations and fonts are uncontrolled. Use reduced motion, deterministic fonts, state-based waits, and a small baseline set.

## Ideas (speculative, not findings)

### I1. Generate the native HTML mapping contract from the source tables

Generate a test matrix from `NATIVE_BACKING`, `html.native.tsx`, and `EVENTS`, while keeping assertions about actual rendered host primitives and callbacks. This would make additions to the mapping table create an intentional test review without writing 49 bespoke tests.

### I2. Add a native-resolution sentinel fixture

Create one fixture with both `thing.tsx` and `thing.native.tsx`, import it through the same Vitest plugin stack used by core tests, and assert which file ran. This would make the Vite plugin merge-order regression fail before native behavioral failures become confusing.

### I3. Treat conformance reports as artifacts before making them a hard gate

Run the existing web/native Tailwind harness on a scheduled workflow, upload its report and diffs, and collect a few runs. Once the diff distribution is stable, gate the selected cases. This keeps font and simulator variance visible without turning an uncalibrated pixel threshold into a red build.
