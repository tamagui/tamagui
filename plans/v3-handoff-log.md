# V3 handoff running log

Updated: 2026-07-29

Branch: `v3-beta`

## Coordination constraints

- Never edit the seven exclusive `@tamagui/web` runtime files listed in
  `plans/v3-handoff.md`.
- Do not enter the engine-contraction, native group/container evaluation,
  compiled static fast-path, or parse-error cutover lanes.
- `code/tamagui.dev/tamagui.generated.css` was already modified by another
  session when this work began and remains outside this work.
- Never push, publish, release, or switch this worktree away from `v3-beta`.

## 1. Codemod completion

Status: in progress.

- Initial handoff baseline: 1,483 clean and 220 flagged.
- Work is split into non-overlapping codemod implementation, migration-guide,
  and read-only corpus-audit lanes.
- Read-only audit corrected the unit: 1,703 conversion sites across 235 files,
  with 1,483 clean sites and 220 flagged sites in 96 files. The 220 sites carry
  297 flag records.
- Audit projection after safe static rules: about 10 manual or design-blocked
  sites, plus 37 structured transition/native-value sites assigned to their
  later design lanes.
- Audit found the existing codemod suite red because the documented opt-in
  transform switch no longer matches the shared legacy converter. V3 needs one
  unconditional transform-family migration path.
- Design-blocked cases currently include plain group-presence conditions and
  conditional behavior props such as `numberOfLines`; the codemod must diagnose
  these rather than inventing syntax.
- Breaking-change and codemod guide landed initially in `a4da453b60` at
  `code/tamagui.dev/data/docs/guides/flat-values.mdx`, with the docs route
  registered. The site test suite passed and the rendered route was checked on
  the local docs server.
- Adversarial runtime review did not approve that first guide commit. Four
  headline examples document intended semantics that the current runtime does
  not yet provide: clause-free config-first values, same-key styled/call-site
  clause merging, web programs containing `exit:`, and conditional raw
  `transform`. The guide must distinguish shipped behavior from the design
  target before item 1 closes.
- The highest-risk codemod rule is clause-free token removal: today `p="$4"`
  resolves through the legacy path while `p="4"` does not. The apply path must
  preserve or flag clause-free `$` tokens until the runtime cutover owns
  config-first resolution for them.
- Codemod implementation landed in `07becfa503` with follow-ups
  `d1b4369ae1` (source import and formatting) and `63e0fbf458` (structured-value
  merge-order accounting). The report preserves clause-free tokens
  and unsupported authored order, converts static conditions/groups/variants
  and provable dynamics, removes the stale `--transforms` split, rejects unknown
  CLI options, and inventories transition/native structured values for later
  lanes. It deliberately remains report-only because applying all output is not
  safe before the clause-free and same-key merge runtime cutovers.
- Coordinator validation: codemod typecheck passed; 29 behavioral tests passed
  with 201 assertions; the default corpus reports 1,775 sites, 320 converted,
  1,435 waiting on runtime support, and 20 flagged. Four of 237 corpus files
  still contain a legacy condition object after the proposed conversions.
- Combined branch gates after the codemod packet and reserved-lane commits:
  style grammar 313/313, core web 770 passed (1 skipped, 1 todo), core native
  409 passed (7 expected failures, 11 skipped).
- After the later reserved runtime commits, the coordinator reran the expanded
  style-grammar suite at 319/319. Web and native will be rerun after the active
  guide and Tailwind packets settle so the gate does not race shared source.
- Remaining runtime gates on an apply/write migration are outside this lane and
  must close upstream: clause-free config-first resolution; `containerName`
  reaching the host; and same-key styled/call-site clause merging before
  `mergeComponentProps` discards the styled value. The codemod preserves and
  reports those cases instead of emitting broken source.
- Exact clause-free handoff for the reserved runtime: once the regular value
  path is ready to use the universal resolver, remove the
  `hasClauses`/`return false` short-circuit in `contributePrograms.ts` so a
  parsed clause-free string contributes its base and resolves configured bare
  names and numeric strings config-first. This is the gate behind the 1,435
  waiting corpus sites; changing only `propMapper` would leave two value
  pipelines and would not satisfy the design.
- The shared-grammar numeric-token dependency closed in `2dba8e410f`:
  `legacyConditions.ts` now accepts numeric token names such as `$6`, `$8`, and
  `$10`. The corpus is back to 20 genuinely flagged sites rather than the 23
  produced by the transient restrictive guard.
- Adversarial codemod review found six actionable correctness gaps and is not
  yet approved: `$` rewriting inside `url()`, nested spreads being erased,
  unknown nested conditions failing to block reordering, file-wide group
  container inference, missing Tamagui import provenance, and missing inputs
  returning a false-ready report. A dedicated Opus fix lane owns these before
  the item closes.
- All six actionable review findings were fixed in `5a9cc90864`. Coordinator
  rerun: typecheck passed; 46 behavioral tests passed with 279 assertions;
  missing inputs and unknown options both exit 2; the default corpus reports
  1,773 sites, 320 converted, 1,433 waiting on runtime support, and 20 flagged.
  The two-site reduction comes from ancestor-proven container handling rather
  than file-wide group inference.
- The 20 remaining flags resolve to 12 kitchen-sink use-case files rather than
  runtime or package source. A bounded manual-migration packet owns the token
  constants and dot-path token names, three group-presence cases, the unknown
  height condition and its ordering barrier, three conditional
  `numberOfLines` entries, and the dynamic `focusStyle` spread. It must rerun
  the corpus and preserve each use case at runtime before those flags can be
  called closed.
- Manual migration of those 12 use cases landed in `bed9c8cb73`. The
  coordinator reran the default corpus at 1,758 sites: 323 converted proposals,
  1,435 waiting on runtime support, and zero flagged. Focused kitchen-sink
  validation passed 19 default Playwright tests and five motion-driver tests;
  the layout stress fixture reported zero event-loop delay warnings. Direct
  runtime probes verified all four height-breakpoint colors, the legacy
  `$1.5`/`$2.5` spacing values, focused-input margin, and resolved theme colors.
  The changed lines pass oxlint and the isolated typecheck comparison; the
  project-wide kitchen-sink typecheck still has 147 pre-existing theme-name and
  missing-build-output errors outside this packet.
- The reviewed guide correction landed in `275894d208`. It now separates
  current beta behavior from the V3 target, documents every open runtime gate,
  matches the final report-only CLI and flag table, removes fixed corpus
  counts, and gives only source spellings that work on the current branch.
  Independent readback covered the full 558-line document. Validation compiled
  its MDX in styled, unstyled, and Tailwind modes, returned HTTP 200 from the
  route loader, passed 75 site unit tests, and passed the focused web, native,
  and codemod gates. The full site build remains blocked outside this guide by
  missing generated legacy color declaration imports through
  `app/test+spa.tsx`.

## 2. `@tamagui/tailwind` isolation

Status: in progress.

- Reserved-lane dependency: completing isolation requires removing the
  `styleMode`/`tailwind-merge` path from `getSplitStyles.tsx` and its preprocessing
  call from `createComponent.tsx`. Those files remain exclusive to the reserving
  agent. This coordinator will build the separate package/compiler/type graph
  around that cut and will not edit the reserved files.
- Read-only repository mapping is complete in
  `/tmp/v3-tailwind-isolation-plan.md`. The target is a package-selected
  frontend rather than a global mode: `@tamagui/tailwind` owns candidate
  adaptation and its root/type surface, `@tamagui/tailwind/vite` owns the
  scanner/compiler integration, and a narrow neutral internal runtime entry
  keeps `@tamagui/web` free of a dependency on Tailwind.
- Implementation is split into three non-overlapping packets: runtime/type
  seam and Tailwind root; Vite/compiler move; then global caller cleanup,
  declarations, and graph proof. The first packet is active. Its protected-file
  handoff will name the descriptor and preprocessing hook required from the
  reserving agent without editing either exclusive file.
- Lane A landed in `0f3fb09a9c`: the neutral descriptor/internal entries,
  distinct frontend View/Text factories, object-only regular `styled()`,
  class-first Tailwind `styled()`, className-only Tailwind style types, candidate
  adaptation backed by `style-grammar`, and web/native/type tests. Its
  adversarial review returned changes required. The blocking findings are a
  built-ESM setup import that was elided while CJS retained it, missing tracked
  declarations and internal-subpath fallback files, and incorrect last-authored
  ordering when a later candidate restates a shorthand. A dedicated Lane A
  repair packet also owns narrowing the internal declaration graph and keeping
  passthrough classes out of normalized `baseStyle`.
- Exact protected-file handoff for item 2: in `createComponent.tsx`, remove the
  global style-mode preprocessor, read the immutable descriptor from static
  config, and call `preprocessProps` once at the existing hoisted location
  before `useComponentState`. Unify the descriptor's
  `STYLE_FRONTEND_PREPROCESSED` marker with the private
  `STYLE_MODE_PREPROCESSED` check so props cannot be tokenized twice. In
  `getSplitStyles.tsx`, remove the embedded Tailwind
  candidate/cache/static-normalization code and `tailwind-merge`, then dispatch
  static normalization and the preprocessed marker through the descriptor
  while retaining the shared value-program engine. The unknown-class path must
  also run `flushForwardStylesToClasses()` and set `shouldDoClasses = false`
  for descriptor-selected components; that cascade-preserving switch is
  currently gated only by the global mode. Core `className` becomes raw
  interoperability only.
- Lane B is active with non-overlapping ownership of
  `@tamagui/tailwind/vite`, the base Vite-plugin extraction, shared config
  loader, compiler/static callers, and integration fixtures. It cannot edit
  the Lane A manifest/runtime/type paths or any protected file.
- Lane T runtime verification proved the ESM/CJS setup, tracked fallback
  entries, authored shorthand ordering, and passthrough partition fixes. The
  declaration-width finding remained open: resolving the shipped Tailwind type
  entry still loaded regular web `types`, `styled`, `View`, and `Text`
  declarations. The follow-up narrows the private wrappers and gives the
  Tailwind frontend its own non-style component surface; a resolver-level graph
  test now proves those regular declarations are absent. Rebuilt Tailwind gates
  pass 70 web/type tests and 13 native tests. Core native passes 411 with 7
  expected failures and 11 skips; the shared core web gate currently has one
  Lane V config/theme mismatch in `tailwindThemeColor.web.test.tsx`.
- Lane T removed the remaining global-mode CSS generation/insertion branches,
  the icon-only reconstruction path, mode settings from owned fixtures, and the
  three obsolete mode test workspaces. Conformance now imports `View` and
  `Text` from `@tamagui/tailwind`, and the migration/docs surfaces describe
  package-selected frontends. The public `StyleMode` setting and core tests
  that exercise `preprocessStyleModeProps` remain until Lane E lands the
  protected `createComponent`/`getSplitStyles` descriptor cut; removing them
  earlier makes the protected source fail to build. The unconditional
  `tailwind-merge` import and `@tamagui/web` dependency are blocked on the same
  protected cut.
- The private runtime subpaths now have separate proof for both real resolution
  routes. `5ef3a87b6e` removed `.d.ts`-only tsconfig mappings that Bun tried to
  execute. `d3362dfd6a` pins the monorepo's tracked compatibility shims and the
  ESM/CJS package-export artifacts independently, including their exact
  resolved paths and installed platform hooks.
- Runtime and declaration graphs are pinned in `d18a70fa1d` and `9fe56b609e`.
  The Tailwind web graph has 152 modules and reaches only the private core/web
  runtime entries. It excludes the regular core root, the web root, the native
  media driver, Tailwind Vite, `tailwindcss`, and `@tailwindcss`. The regular
  core runtime and type entries cannot reach `@tamagui/tailwind`. The graph
  probe exposed an unconditional native media-driver import in the shared web
  runtime; platform-splitting that setup removed 24 modules from the Tailwind
  web graph while preserving the `.native` setup path. Tailwind web/type gates
  pass 74 tests across eight files.
- The descriptor-cut remainder landed in `1242a90d00`, `43053d812c`,
  `9e4e03e74e`, and `4d89c707f4`. `@tamagui/web` no longer exposes
  `settings.styleMode` or depends on `tailwind-merge`; config and to-tailwind
  are test-only dev dependencies of `@tamagui/tailwind`. Of the 423 failures
  exposed by the protected cut, 419 moved to the Tailwind package. Four
  specifications were deliberately retired: one required `tailwind-merge` to
  delete an earlier unknown class instead of preserving authored order, and
  three mixed a class-string base with object/function styles even though core
  `styled()` is now object-only and Tailwind `styled()` is class-only. Two
  additional global mode-toggle tests left with the setting. A fourth native
  hybrid test was green before removal, so it was not part of the 423.
  Whole behavior files moved, producing 641 package-owned tests including
  their already-green converter and retention siblings; together with the
  package's existing 87 tests, its final gates are 458 web/type and 270 native
  tests (728 total).
- Icon reconstruction did not move: `helpers-icon` no longer accepts or
  reconstructs `className`, `@tamagui/tailwind` exports no icon wrapper, and no
  reconstruction caller remains. The nine deleted icon assertions therefore
  described behavior that is genuinely gone.
- With the new dev dependencies installed, the focused runtime, declaration,
  and built-artifact isolation gate passes 9/9. The shipped Tailwind graph
  contains neither dev dependency and still excludes the regular core/web
  roots, native media driver, Vite frontend, `tailwindcss`, and
  `@tailwindcss`. After deliberate web/core rebuilds, the reduced core suites
  pass 391 web tests (2 skipped, 1 todo) and 168 native tests (7 expected
  failures, 11 skipped); their removed population now lives in the package
  gates above.

## 3. DOM contract

Status: in progress.

- Lane D landed the `@tamagui/dom` package in `0c82653e85`: the tag, attribute,
  event, native-backing and compatibility tables, plus the pinned React Strict
  DOM snapshot they are checked against. RSD stays a conformance oracle, never a
  dependency. Package builds, typechecks under `isolatedDeclarations`, and its
  17 conformance tests pass.
- `scripts/extract-rsd-snapshot.ts` regenerates the pin
  (react-strict-dom 0.0.55 @ `c877f5c19b`) from a checkout. It captures the tag
  set with each tag's native backing, ref element and props type, the runtime
  prop allowlist, every strict props type, the `AriaRole`/`AutoComplete`/input
  `type` unions, and RSD's own default element styles for web and native.
- The conformance test compares the tables against that snapshot and requires
  `COMPATIBILITY` to claim exactly the differences it finds: an unclaimed
  difference and a claim that is no longer true both fail. So the compatibility
  record cannot drift in either direction, and moving the pin reports what
  changed by name. Verified by mutation: eleven separate corruptions of the
  tables and of the compatibility record each produce a failure.
- Every structural column matched the oracle already. Two style gaps were real
  and are fixed: `code`, `kbd` and `pre` were missing the `fontSize: 1em` that
  cancels the browser's smaller default size for monospace text, and the
  display reset (`margin`, `padding`, `borderStyle`, `textDecorationLine`) was
  being applied on native, where there is no browser stylesheet to undo and
  every key is a per-element cost for nothing. It is `DISPLAY_WEB_RESET` now.
  Counted, not estimated: the reset added 2 style keys on 29 tags and 3 on the
  other 20, so 118 across the 49-tag surface, mean 2.41 per element — keys
  React Native would carry through style resolution and the props diff while
  restating a value that is already its default. The per-key runtime cost needs
  the native primitives to exist, so it is benchmarked with item 3 rather than
  asserted here. Both fixes are pinned against the oracle, not just applied:
  re-adding the reset on native, or dropping the `1em`, each fails the
  conformance suite.
- The generated strict prop interfaces landed in `22a38e7258`.
  `scripts/generate-props.ts` emits `src/props.ts` from the tables: one
  `StrictDOMPropsBase` with everything every tag accepts, eleven element
  interfaces extending it, a `data-*` index signature, the `AriaRole`,
  `AutoComplete` and `InputType` unions, and a `StrictDOMPropsByTag` map. A test
  regenerates the file and fails if the checked-in copy is stale, so it cannot
  be hand-edited into drift.
- Two table columns were needed and are additive: `AttributeRow.perTag` carries
  the per-element type and note for the props that genuinely differ by element
  (`type` on a button is not `type` on an input; `value` on `li` is a number),
  and `HTML_INPUT_TYPES` sits beside `NATIVE_INPUT_TYPES` because web accepts
  all nineteen while native renders nine. Nothing renamed.
- Type behavior is tested by `tsc`, not asserted: `src/__tests__/props.test-d.ts`
  runs under `bun run test:types` and every negative case is a
  `@ts-expect-error`, so the build breaks the moment an error it expects stops
  happening. It covers element-specific props reaching only their own element,
  the per-element `value`/`type` narrowings, aria value sets, `data-*`
  passthrough, capture-phase props being rejected, event payload shapes, and
  the content model deciding children. Six mutations of `props.ts` were each
  caught. Note for anyone adding type tests elsewhere: the root `tsconfig.json`
  excludes `**/__tests__`, and `extends` inherits `exclude`, so a type-test
  project has to clear it or tsc silently checks nothing. This suite did exactly
  that for its first run.
- Type performance, measured rather than assumed, since the plan makes it an
  acceptance criterion and rejects intersecting React's `HTMLAttributes`.
  430 typed element usages (43 tags x 10), `tsc --noEmit --diagnostics`,
  7 runs each: the DOM contract checks in 0.06-0.07s with 1,810 types and
  **0** generic instantiations; the same file written against React's
  `JSX.IntrinsicElements` checks in 0.10s flat with 1,580 types and 274
  instantiations. So the explicit interfaces check about 1.4x faster and
  instantiate nothing, at the cost of 230 more declared types. Declaration
  emit is 17.9 KB for `props.d.ts`, 20.5 KB for the package.
- The native primitives landed in `70f670c1ba`: `DOMView`, `DOMText`,
  `DOMImage` and `DOMTextInput` in `code/core/web/src/dom/`, with
  `contract.ts` stating exactly what the compiler must emit for each. That
  contract is what CODEX-2's native fixture targets.
- The design point: because the compiler is required on native, almost nothing
  about a DOM element is a runtime decision. The compiler picks the primitive,
  flattens the styles with the `display: block`/`flex` emulation already
  applied, renames every prop to its react native name, applies the implicit
  role and wraps literal text. So a primitive owns only what cannot exist
  before the event or the instance does: adapting an event payload, and the
  ref. That leaves **no hooks and no context reads on any path**. React Strict
  DOM reads a display-inside context and a text-ancestor context per element
  behind several hooks because it has no compiler to ask; nested react native
  Text already inherits text styles on its own, and the display emulation is
  known statically, so neither context has to exist here.
- The tests call the primitives as plain functions rather than rendering them.
  Two reasons: the fake react native the native suite runs against renders
  every host to null, so a render tree would assert nothing; and a component
  that used a hook would throw when called outside a renderer, which makes all
  16 tests a standing proof of the hook-free property.
- Per-element cost, measured (`cd code/core/dom && bun run bench:native`,
  bun 1.3.14, darwin arm64, 10,000 elements per sample, 15 samples after 5
  warmup). Read the heap columns, not the nanoseconds: the timing spread
  between samples is larger than the gap between the cases, so the medians rank
  nothing and are reported with their deviation rather than dressed up. The JSC
  heap counters repeat to two decimals across runs:

  | case | objects/element | bytes/element |
  |---|---:|---:|
  | `DOMView`, no handlers (ships) | 4.03 | 236 B |
  | `DOMText`, no handlers (ships) | 4.03 | 235 B |
  | bare `jsx(View, props)` | 4.03 | 235 B |
  | `jsx(View, { ...props })` | 7.03 | 347 B |
  | `createElement(View, props)` | 7.03 | 363 B |
  | `DOMView`, with `onClick` | 9.04 | 444 B |

  So the primitive costs exactly what the bare react element costs — the
  wrapper is free — and writing it the obvious way, `<View {...props} />`,
  would add 3 objects and about 112 B to every element on screen. That is why
  the primitives call `jsx` with the props object they were handed instead of
  spreading it; a test asserts the identity, which is what caught the
  `createElement` copy in the first place.
- `@tamagui/web` now depends on `@tamagui/dom`. The imports are type-only so
  nothing enters the runtime graph, but the emitted declarations reference it,
  so a consumer resolving `@tamagui/web`'s types needs it present. One line in
  `code/core/web/package.json`; it needs a `bun.lock` entry in the coordinated
  lockfile commit below.
- Gate note, not caused by this lane: web reads 763 passed / 54 files, against
  the 771 / 55 baseline. `98d743b29f` deleted `iconStyleMode.web.test.tsx`
  (9 tests) as part of removing the global style-mode callers, and
  `2e47f650ea` net-added one, so 771 - 9 + 1 = 763 and 55 - 1 = 54. The
  baseline is stale, nothing regressed. Native is 427 passed / 22 files,
  which is the 411 / 21 baseline plus this lane's 16 tests in one new file.
- `html.*` landed in `9d763fb3a9`, exported from `@tamagui/core`. On web each of
  the 49 tags is an ordinary Tamagui component rendering the literal element,
  so it takes the regular Tamagui style props plus the strict DOM props for
  that tag; on native every member throws a message naming the tag and saying
  the compiler did not run, which is the specified missing-compiler failure
  rather than a silent approximation.
- It is generated into `code/core/web/src/dom/html.tsx` by
  `@tamagui/dom scripts/generate-html.ts`, not written by hand and not reading
  the tables at runtime. Reading them at runtime would put `@tamagui/dom` in
  `@tamagui/web`'s runtime graph for every app that imports `html`, which is
  exactly the boundary CODEX-2's graph tests are meant to prove. A test
  regenerates both files and a second one asserts every `@tamagui/dom` import
  in them is `import type`.
- Nine web render tests in `code/core/core-test/domHtml.web.test.tsx` cover it
  end to end: the real semantic tags reach the document, text nests inside a
  block element, the element defaults apply, an author's style prop beats them,
  element-specific props reach the DOM node, and a button click fires.
- A real gap found while wiring the defaults, worth Lane E's attention because
  it is in the style surface rather than in this lane: **Tamagui resolves no
  style property named `wordWrap`/`overflowWrap`, `listStyle` or `resize`**.
  Verified through `getSplitStyles`, not by reading the allowlist — `objectFit`
  is absent from `validStyles` and still resolves, so the allowlist is not the
  authority. An unresolved style prop is not a silent no-op: it falls through
  to `viewProps` and reaches the element as an attribute, which is a react
  warning and still no styling. RSD sets all three, so they came out of the
  table and are recorded in `compatibility.ts` with the reason. `listStyle`
  turned out not to matter — every view-backed element carries
  `.is_View { display: flex }`, so an `li` is never `display: list-item` and no
  marker is generated — but the other two are genuine cosmetic gaps that only
  close by teaching the style pipeline the property names.
- Gate baselines moved again, and again not from this lane: 15 Tailwind suites
  are staged for deletion out of `core-test` as CODEX-2 isolates the package's
  test dependencies, which is why the web file count fell to 45. Separately,
  four web tests and one native test in `compoundVariants` and
  `flatGroupSyntax` now fail; they passed in this lane's full run earlier and
  the failures arrived with `3eb37b44b4`, the descriptor-dispatch commit. Both
  belong to their own lanes; this lane's own suites are green.
- `id` no longer renames, fixed in `c3e76f8e02`. Reading CODEX-2's new
  `domLowering.native.test.tsx` against the contract showed its lowering
  matching the tables everywhere — the right primitives, literal text wrapped
  only inside View-backed tags, diagnostics on `onScroll` and `select` — except
  that it passes `id` straight through where the table said to rename it to
  `nativeID`. The compiler was right and the table was wrong: react-native
  0.83.2's `View.js`, `Text.js` and `TextInput.js` all accept `id` and assign it
  to `nativeID` themselves, checked in the source rather than in the types.
- The obvious follow-on is wrong and the table now says so. React Native also
  accepts many `aria-*` props directly, which makes fourteen rows look like
  redundant renames that could stop building nested `accessibilityState` and
  `accessibilityValue` objects. But it accepts them **inconsistently per host**:
  `View.js` translates thirteen, `Text.js` only seven, and neither handles
  `aria-modal`, `aria-posinset` or `aria-setsize`. One attribute row has to hold
  for every backing a tag can lower to, so the legacy mapping every host accepts
  unconditionally is the correct one and stays. Recorded in the attributes
  header with the verification method, because the aliases existing makes the
  mapping look redundant on inspection and the failure mode is quietly breaking
  text-backed tags.
- Closed: the `bun.lock` gap this lane raised is fixed. HEAD had no entry for
  `code/core/codemod-flat-values` despite that package.json being committed, so
  `bun install --frozen-lockfile` had been failing at HEAD for two days.
  `46126a42d1` registered the workspace edges, including
  `@tamagui/web` -> `@tamagui/dom` and the compiler's own edge; verified with
  `bun install --frozen-lockfile --dry-run`, which now exits 0.
- The `tamagui/dom` and `@tamagui/core/dom` entries landed in `150dae7259`,
  with `@tamagui/web/dom` underneath them. Both resolve and export exactly
  `html` and `style` — the compiler needs these specifiers to exist because
  import provenance is how it tells the three frontends apart, and two of the
  three did not exist before this.
- The standalone entry is **compile-only on both platforms**, so every member
  throws. That is not a stub standing in for a runtime: a `style()` handle is
  an opaque compiled value with no runtime form, and the tags carry no style
  props to resolve, so there is nothing for a runtime to do. Reaching one means
  the compiler did not run, and the error says so and names the tag or the
  call. This is the second missing-compiler failure, alongside `html.*` on
  native from item 4.
- `style()` (design item 6's implementable half) takes the same
  style-definition grammar as `styled()` with the component argument removed,
  and returns one opaque handle per call rather than a namespace of named
  sub-objects. The design record's own example — including
  `backgroundColor: 'surface hover:surface-hover'` — typechecks against it.
- Seven behaviour tests in `domEntries.web.test.tsx` and 27 type assertions in
  `code/core/web/src/dom/standalone.test-d.ts` pin it. The type file carries
  the isolation property, which is the one worth keeping: a standalone tag
  rejects `backgroundColor`, the `bg` shorthand, `hoverStyle` and `className`,
  so the separate entry cannot quietly regrow the regular style surface. The
  behaviour file separately asserts the entry re-exports no `createComponent`,
  `styled`, `getSplitStyles`, `View` or `Text`, since a barrel that did would
  reconnect the frontend graphs the design record keeps apart.
- Worth knowing for anyone adding type tests to `@tamagui/web`: its
  `tsconfig.json` excludes `**/*.test-d.ts`, so `tsc -p` does not check them
  and a broken assertion there looks green. They are checked by the package's
  own `bun run test:web` (`vitest --typecheck`, 8 files / 90 tests including
  this lane's), which is not in the fleet gate list but should be. Verified by
  mutation both ways — this is the second time in this lane that a type-test
  file silently was not being checked, and both times only a deliberate error
  found it.
- Design items 6 and 8 are the two the design record marks open and the fleet
  plan marks a user decision. Both proposals are written up in item 9 below:
  the native ref API recommends the React Native public instance plus the HTML
  tag name and two per-tag polyfills, built only when a ref was passed, and
  rejects RSD's viewport-scaled metrics; the `style()` composition recommends
  compile-time resolution per contested property with a build error when the
  handle list is not literal. `compatibility.ts` now describes the ref
  behaviour that ships today rather than the proposed one.
- Compiler Phase 3 landed in `a2f8b5a31e`, `9a6e6861a5`, `151310f38a`, and
  `6cc3d8961f`. An imported `html` binding now retains its provenance through
  JSX, `jsx`/`jsxs`, and both `createElement` forms; unrelated member targets
  keep the previous rejection. The structural pass reads the one
  `@tamagui/dom` table set, rewrites web elements to literal semantic tags, and
  injects the selected `DOMView`/`DOMText`/`DOMImage`/`DOMTextInput` primitive
  on native.
- Literal text wrapping uses an additive `literalOrigin` bit preserved by
  compiler-core. Its predicate is intentionally narrow: string, number,
  boolean, or null AST literals and JSXText have literal origin; template
  literals, constant-folded expressions, and values reached through bindings
  do not. View-backed tags wrap direct string and number literals in
  `DOMText`; a child that might render unwrapped text produces the native
  unsupported-child diagnostic instead of passing through.
- The proof is at the output and runtime boundaries rather than by source
  inspection. Exact output snapshots cover web and native forms, diagnostics
  cover an unsupported prop, tag, dynamic text child, and invalid nesting, and
  the webpack fixture renders `main`, `h1`, `nav`, and `a` in the DOM. Esbuild
  metafiles for both transformed fixtures show the real native
  `@tamagui/core/dom` entry and no React Strict DOM or StyleX module. After a
  deliberate web/core rebuild, static web passes 110 tests with two skips and
  webpack passes 20/20; the focused web/native/normalization set passes 8/8.

### CORRECTION (2026-07-31): item 3 overstated what is shipped

CODEX-2's independent review of this lane found two P0s. I verified both in the
compiler source and the pinned snapshots rather than taking the report, and
**both are correct**. What follows above them in this item is accurate about
design and inaccurate about status; these two entries govern.

**P0-1 — `style()` has no compiler implementation, so Phase 4 item 7 is NOT
shipped.** `domStructuralPass` matches `provenance.importedName === 'html'` and
nothing else, so an imported `style()` call is never recognised. A valid
`tamagui/dom` module keeps its top-level `style()` call through lowering and
throws when evaluated. The tests I wrote assert the runtime throw and the types.
Both pass. Neither would notice the missing pass, because nothing asserts
transformed output. The entry is importable, its types are real, and the
frontend does not function end to end.

**P0-2 — the native contract described lowering that does not happen.** Verified
in `domLowering.native.test.tsx`'s pinned snapshot: a lowered element is
`<__TamaguiDOMView id="main">` with **no style prop at all**. No tag defaults,
no `display: block` emulation, no prop renames, no implicit role. The mechanism
is that `domStructuralPass` removes DOM elements from `module.elements` at the
end of its run and style lowering executes after that, so DOM elements never
reach it. `NATIVE_ELEMENT_DEFAULTS`, `NATIVE_BLOCK_DEFAULTS`,
`NATIVE_FLEX_DEFAULTS`, `tag.role` and `attribute.nativeProp` have **no compiler
consumer at all**.

**Why P0-2 is the serious one, stated plainly against my own earlier claim.**
The primitives use no hooks and read no context, and I reported that as a
structural advantage over React Strict DOM, which reads a display-inside and a
text-ancestor context per element. That design is correct *only behind the
precondition that the compiler resolved the work statically*. It does not. So
today a DOM element on native renders with React Native's own defaults instead
of block-flow semantics, and the advantage is unproven rather than won. The
per-element measurement (4.03 objects, 236 B, identical to a bare React
element) remains a true measurement of the wrapper; the justification I attached
to it does not currently hold.

`contract.ts` and `standalone.ts` now carry this status at the top, because the
source is where the next reader looks.

## 4. Cutover config

Status: in progress.

- Lane V config packet landed in `d1e39772e5`: v6 `bg` expands to the
  `background` family, the inherited v5 semantic theme names are replaced by
  one explicit 16-entry kebab-case table, and the old camelCase keys are absent
  from the resulting v6 themes. User-defined config names are untouched and no
  runtime casing alias exists.
- The shared overloaded-family target validator is exported from
  `@tamagui/style-grammar`; a resolved candidate must contribute to the authored
  property or returns a `candidate-property-mismatch` diagnostic consumable by
  both compiler and runtime. Style-grammar passes 322/322 and its package build
  passes.
- Lane E owns the remaining protected-file wiring: `x`/`y` must override
  `defaultTokenCategories` to `space`, and the runtime/compiler candidate
  resolver must call the shared target validator. The manager routed both exact
  changes.
- Lane V's follow-up derives the authoritative surface by taking the runtime
  union of uppercase keys across every v5 theme: 17 source names, comprising 16
  mechanical kebab-case replacements and removed `backgroundActive`. The shared
  zero-dependency table contains the 16 replacements; the config test compares
  every row and value against every v5 theme, rejects every remaining uppercase
  key, and confirms both `backgroundActive` and `background-active` are absent.
  The codemod has 17 rows because it maps legacy `backgroundActive` directly to
  `background-press`.
- The consumer sweep used exact per-name and Tailwind-candidate `rg -P` searches
  across the repository, then reviewed every hit in theme templates, component
  defaults, tests, fixtures, and docs. Generated v5 theme files were inspected
  as derived legacy surfaces; `code/tamagui.dev/tamagui.generated.css` was
  deliberately excluded and never staged. The live misses were the v3 canary
  Select and flat-values guide, fixed in Lane V, plus `to-tailwind`, routed to
  CODEX-2. The guide's legacy input remains intentional. No other source
  consumer surface was left uncovered.
- Item-1 gates: config 5/5 with 18,387 exhaustive assertions, focused theme-color
  web regression 8/8, codemod 47/47, package builds and codemod typecheck green;
  corpus 1,758 total / 323 converted / 1,435 waiting / 0 flagged. Full web is
  temporarily blocked on the active style-mode cleanup in
  `tailwindMode.web.test.tsx` and `tailwindArbitrary.web.test.tsx`.
  The initial `componentProps.web.test.tsx` attribution probe was invalid
  because core-test loads package build output rather than the reverted source;
  its `_bg-red` to `_bc-1418911449` expectation belongs to Lane E's designed
  config-first cutover. The focused theme-color regression imports web and
  Tailwind source directly and ran after a deliberate config rebuild.

## 5. Lint and editor tooling

Status: in progress; ESLint diagnostics and canonical formatting complete.

- `@tamagui/eslint-plugin` exposes `valid-flat-values` for static strings on
  imported Tamagui components and `styled()` configs. The source bridge
  performs provenance and AST location only. It contains no value parser,
  candidate heuristic, built-in-name table, or local formatter.
- A new style-grammar tooling diagnostic composes the universal parser, shared
  payload scanner, config-derived candidate vocabulary, candidate-target
  validator, and v6 replacement/removal tables. Target validation runs only
  when the scanner proves the whole payload is one candidate atom, so a color
  reference embedded in a composite box-shadow is not mistaken for a
  box-shadow candidate.
- The rule requires the actual grammar config projection. A configured user
  name that matches an old built-in remains valid, and config-specific media
  names remain registered. This keeps the rule aligned with the broad
  `FlatStyleValue<T>` type contract: parseable raw strings are admitted, while
  grammar errors and configured candidate mismatches are diagnosed by the same
  engine the runtime consumes.
- The first v6-config corpus pass covered 250 real source files and reported
  `Button.tsx`'s `$borderColor` at line 82 as the first real finding, followed
  by its other unconverted v6 built-in names. The full pass found 141 obsolete
  built-in name uses and six config-sensitive `@maxMd` spellings. The source
  corpus has not had the report-only codemod applied, so these migration
  findings do not contradict the codemod's 1,753 clean converted suggestions.
- Canonical formatting prints the parser's IR without changing payload text,
  modifier order, or clause order. Every test parses the authored and canonical
  strings and requires identical IR, then requires the canonical result to be
  idempotent. The ESLint rule autofixes only that proven spelling difference;
  grammar, target, and obsolete-name diagnostics remain fix-free. The codemod's
  existing `printProgram` export now delegates to the same formatter rather than
  retaining a second printer.
- Validation: style-grammar 355/355 and package build green; the ESLint package
  build and three behavioral tests over real `.tsx` fixture files pass; the
  codemod remains 47/47 with typecheck green. Language-service completions
  remain.

## 6. Transitions

Status: prototype complete.

- New style-grammar modules lower the CSS shorthand and all five longhands into
  one transition IR with CSS defaults, exact config-first preset resolution,
  and diagnostics for malformed or unrepresentable input. Duration-shaped
  values keep CSS semantics even when a legacy config has a same-named preset.
  Legacy array, per-property object, enter/exit, delay, and spring-override
  forms migrate into the same IR; CSS serialization returns no value for
  preset/lifecycle state rather than dropping driver configuration.
- The native matrix is conservative and sourced from
  `plans/react-native-style-capabilities.md`: RN 0.82 covers the baseline
  transform/opacity and filter path; RN 0.84 adds only the explicitly recorded
  continuous and discrete backend properties, with cursor limited to iOS; RN
  0.85 claims only the verified representative layout property, `width`.
  Filter functions are platform-, RN-, and Android-API-gated. CSS globals,
  custom properties, step/linear-stop timing, negative delays,
  `allow-discrete`, unsupported/discrete properties, and `all` without concrete
  changed properties produce diagnostics instead of native approximations.
- Native wiring has a hard precondition: the caller must pass a configured or
  detected React Native minor. `reactNativeMinor` is required and has no
  default; wiring must never add a literal fallback just to satisfy the type. An
  unknown version is a diagnostic, not a guess. At the repository's RN 0.83
  baseline, a runtime probe of `backgroundColor 200ms` returns
  `native-transition-property` with “requires React Native 0.84 or newer.”
- Validation: focused transition tests 13/13, full style-grammar 335/335, and
  the style-grammar package build passes with rebuilt declarations.

## 7. Reactive safe-area on native

Status: pending.

## 8. Validation debt

Status: complete. All four items closed — streaming SSR and code splitting,
the end-to-end streamed response, font-face swap, and the WebKit re-check.

- Streaming SSR and code splitting, design item 2's remaining half, landed in
  `a67adb6250` (`flatValueProgramsStreaming.web.test.tsx` plus a kitchen-sink
  fixture). The design record is updated.
- The gap that made this worth doing: `flatValueProgramsSSR.web.test.tsx`
  already collects the stream's chunks, then asserts against
  `chunks.join('')`. A block split across a chunk boundary joins back
  together, so that assertion passes either way and the contiguity claim was
  never actually tested. What a browser cares about is that a block never
  arrives in pieces, because a half-applied program is a visibly wrong style
  until the rest lands. The new test checks the chunks themselves, and because
  a check for something that never happens proves nothing, its detector is
  first run against a synthetic split so it is shown to notice.
- The browser half is the part that could not be faked in node. The encoding's
  claim is that cross-program order is irrelevant, so appending at the end of
  the sheet is safe and interleaving code-split bundles is safe — that is a
  claim about what a browser *resolves*, and rule text cannot check it.
  `ProgramBlockDeliveryCase` loads a genuine webpack chunk on click, bringing
  one program the page already had and one it had never seen. The test reads
  computed styles before and after and pins three things: already-resolved
  elements do not move when late blocks append, a late-arriving program
  resolves identically to an early one at base and hover, and the shared
  program stays one class carrying exactly two rules rather than a re-inserted
  duplicate.
- Verified by mutation, per the standard: giving the late chunk a different
  shared program fails two tests, changing its hover value fails one, and a
  wrong rule count fails the counter. All green again after restore, and the
  neighbouring `FlatValuePrograms` and `MixedCascade` suites still pass.
- Font-face swap E2E landed in `63daa99aee`. `FontLanguageSwapCase` plus four
  playwright tests. The mechanism is `FontLanguage`, which puts a
  `t_lang-<name>-<language>` class on a wrapper against the per-language font
  rules `createDesignSystem` emits from a `name_language` font key. Kitchen-sink
  had no language variants at all, so the fixture adds a `body_ja` whose family
  *and* metrics differ from `body`.
- The claim under test is deliberately not "the family name changes", which a
  swap carrying none of the face with it would also satisfy. It is that `$3`
  means the ja face's own size and line height inside the wrapper: 20/30 where
  the default face is 13/22. Also pinned: the swap works at runtime on the same
  element, and it is scoped — an element outside the wrapper does not move.
- Adding to the shared kitchen-sink config was proven safe rather than argued.
  Ran `FlatValuePrograms`, `MixedCascade`, `ProgramBlockDelivery`,
  `VariantFontFamily` and `ParagraphSpanFontInheritance` at HEAD and again with
  the variant: 18 passed both times, and a direct probe of a default Text and
  View returned byte-identical family, size and line height. One real hazard was
  checked on the way: the shared `.font_*, .is_View` reset is built from the
  alphabetically *first* font key, so a variant sorting before `body` would have
  changed the font reset for every View on the page. `body_ja` sorts after.
- A trap for the next person writing a font fixture, which cost a detour here:
  setting `fontSize="$3"` alone does not derive a line height from the face's
  mapping. The first version of this fixture read the same line height for both
  faces and looked exactly like a swap bug; asking for `lineHeight="$3"`
  explicitly showed the swap was correct all along. A fixture that omits it
  produces a convincing false positive.
- Unrelated divergence surfaced while fixing the program-block fixture, recorded
  here because it is a real inconsistency rather than a test problem: **`View`
  accepts `color` at runtime and resolves it, but the type surface rejects it.**
  Evidence: `<View color="rgb(70, 80, 90) hover:rgb(100, 110, 120)">` renders a
  div carrying `_c-1418528521` with computed `color: rgb(70, 80, 90)`, while the
  same line fails the root typecheck because `color` is a text style prop. One
  of the two is wrong — either View should carry `color` and the types should
  admit it, or it should not and the runtime should diagnose instead of quietly
  resolving. Routed to Lane E behind the contraction; the fixture now uses a
  `Text`, which is the honest host for the prop.
- The WebKit program-block re-check landed. `ProgramCascadeCase` plus a
  `webkit-programs` playwright project matching `ProgramCascade` and
  `ProgramBlockDelivery`, so both files now run under Safari's engine as well as
  Chromium. **6 passed under WebKit**, so the encoding resolves identically in a
  second engine: equal specificity through `:where()`, source order deciding,
  and a late code-split block not disturbing what is already resolved. WebKit
  had to be installed locally to run it (`npx playwright install webkit`); it
  was absent, which is worth knowing before anyone claims this ran.
- The mutation that matters: reshuffling the clause order in the program —
  moving `hover:` after `dark:hover:` without changing any value — fails under
  WebKit. Source order is the entire claim of the encoding, so a test that
  passed under a reshuffle would prove nothing about it.
- **A design-record claim needs correcting.** Item 2 lists "a plain clause after
  an `@media` block wins at equal specificity" among the validated probe
  assertions. That is true of the CSS encoding, and the original probe was raw
  CSS, but it is **not reachable from the authored flat syntax**: a clause
  payload is space-greedy, so a base clause written after a conditional is
  absorbed into that conditional's payload rather than becoming its own clause.
  Verified at the grammar rather than inferred — `parseValue('hover:blue red')`
  returns `ok: true` with `base: null` and `payload: 'blue red'`.
- That failure is silent, which is the part worth acting on.
  `backgroundColor="sm:green red"` parses clean, emits a program class, and the
  element renders **transparent at every viewport**: the payload `green red` is
  invalid for `background-color` so the browser drops the declaration, and there
  is no base rule because `base` is null. No diagnostic at parse, lowering or
  runtime — checked the browser console. The design record's own rule is that
  unsupported input is a diagnostic, never silence, so this is a gap rather than
  a documented limitation. Grammar is not this lane's, so it is routed rather
  than fixed here.
- The streaming server landed, so the gap this lane wrote down is closed rather
  than carried. `code/tests/integration` now has a small SSR server that streams
  `renderToPipeableStream` output into a real response, a `streaming.html` build
  input so the streamed document hydrates from a real client bundle, and three
  playwright tests. Measured, not assumed: shell bytes arrive at ~9ms and the
  suspended content at ~540ms **on the same response**.
- The load-bearing assertion is that the shell is painted and resolved while the
  late content **does not yet exist**. Everything else here would still pass
  against a buffered document, because buffering produces a byte-identical
  result — so that one assertion is the only thing standing between this and a
  test that silently stops testing streaming. Proved by mutation: swapping
  `onShellReady` for `onAllReady` fails exactly it, with `late-shared` counting
  1 where 0 was expected, and nothing else.
- The other two mutations (changing the shared program's value, changing the
  late-only program's value) each fail too, and all three restore green.
- One bug of my own found while building it, worth noting because it would have
  been intermittent and blamed on the product: the server wrote 200 headers
  before opening the static file, so any 404 threw `ERR_HTTP_HEADERS_SENT` out
  of the stream's error handler and killed the server mid-suite. Later tests
  then failed with connection-refused, which looks nothing like the real cause.
  Fixed by resolving the file before writing any header.
- Also added `dist-ssr-streaming/` to that package's `.gitignore` alongside the
  existing entries, so the new build output cannot be read as source by tools
  that walk the tree — the same thing that had `dist-ssr` being linted.
- Not caused by this lane, verified by reverting to HEAD and re-running: the
  existing `simple.integration.test.js` dev-mode test fails on a Tailwind
  `@container grid` element computing `display: flex` instead of `grid`. It
  fails identically with this lane's edits removed, so it is pre-existing and
  belongs to the Tailwind isolation work.
- Tailwind isolation reproduced the same result in both Vite development and
  production builds and traced the browser cascade. `TamaguiProvider` injects
  `config.getCSS()` unlayered, including `.is_View { display: flex }`, while
  the compiler correctly emits the grammar-owned `display: grid` atom inside
  `@layer tamagui`. An unlayered normal rule wins over every layered normal
  rule regardless of selector specificity. The Tailwind scanner is correct to
  withhold a duplicate `.grid`, and removing the compiler layer would violate
  the intended cascade.
- The same missing layer interop affects authored order when a raw Tailwind
  utility follows a Tamagui prop: the unlayered Tamagui background rule beats
  the later `bg-blue-500` utility in Tailwind's layer. Both computed-style
  assertions live in the D3 `fixme`; the rest of each integration path remains
  active.
- This is the runtime layer interop explicitly left unimplemented at
  `plans/dom-tailwind-flat-values.md:940-951`, so it remains blocked on D3
  rather than receiving a fixture-only workaround. The integration assertion
  is a named `fixme` with D3 as its unblocker; the rest of the development,
  production, HMR, and hydration coverage still runs.
- The node half proves the bytes are right and the browser half proves late
  insertion resolves right, but nothing yet drives a real streamed response
  into a real browser end to end. Font-face swap E2E and the WebKit
  program-block re-check are also still open.

## 9. Open design drafts

Status: pending. These remain proposals until the user approves decisions that
the design record marks open.

### Open question — should `fontSize` derive line height from the face? (Lane D, found 2026-07-30)

Not part of this campaign and not proposed for change here; recorded so it is a
decision someone makes rather than a surprise someone hits.

Setting `fontSize="$3"` alone does not take the line height from the font face's
own mapping. Evidence, from building the font-face swap fixture: with only
`fontSize="$3"`, the default face and the `ja` face both computed
`line-height: 23px` while their families and font sizes swapped correctly
(13px vs 20px). Adding `lineHeight="$3"` produced 22px and 30px, the two faces'
own values, and the swap was correct all along.

So a caller who sets only `fontSize` and swaps faces gets **the new face's
glyphs at the previous face's metrics**. That is a plausible-looking wrong
result rather than an obviously broken one, which is the bad kind: it cost this
lane a detour and nearly produced a false bug report against the swap itself.

The argument against changing it is real too — it is long-standing behaviour,
`fontSize` and `lineHeight` are independent style props everywhere else, and
making one imply the other is breaking. The decision is whether the ergonomic
trap is worse than the inconsistency. Whoever takes it should know the failure
mode is silent.

### Design item 8 — the minimum native DOM ref API (Lane D proposal)

**Recommendation: expose the React Native public instance, add the HTML tag
name and two per-tag polyfills, and only when a ref was passed. Do not scale
metrics.**

The facts first, because they narrow the decision a lot. React Native 0.83.2
ships `ReactNativeElement extends ReadOnlyElement extends ReadOnlyNode`, and
between them they already implement every member React Strict DOM's own
compatibility table marks as natively supported: `childNodes`, `firstChild`,
`lastChild`, `nextSibling`, `previousSibling`, `parentNode`, `parentElement`,
`ownerDocument`, `nodeType`, `nodeValue`, `textContent`, `isConnected`,
`contains()`, `compareDocumentPosition()`, `getRootNode()`, `hasChildNodes()`,
`children`, `childElementCount`, `firstElementChild`, `lastElementChild`,
`nextElementSibling`, `previousElementSibling`, `id`, `clientWidth/Height/
Left/Top`, `scrollWidth/Height/Left/Top`, `getBoundingClientRect()`,
`setPointerCapture()`, `hasPointerCapture()`, `releasePointerCapture()`,
`focus()`, `blur()`, and `offsetWidth/Height/Left/Top/Parent`. Read from the
installed source, not from the table.

So the documented subset is nearly free. What RSD's per-element wrapper adds on
top is only three things, and they should be judged separately:

1. **The HTML tag name.** `ReadOnlyElement.tagName` returns
   `NativeDOM.getTagName(node)`, which is the native view name — `RCTView`, not
   `DIV`. This is the one thing the instance genuinely cannot know, because the
   tag is compile-time information. It is also the cheapest and most common way
   to assert what you got hold of. **Take it.**
2. **Two per-tag polyfills.** `HTMLImageElement.complete`, and
   `selectionStart` / `selectionEnd` / `setSelectionRange()` on an input or
   textarea. Both are cases where a documented DOM property has a real React
   Native equivalent under a different name. **Take them**, on those tags only.
3. **Viewport-scaled metrics.** RSD multiplies its measurements by a viewport
   scale factor. **Reject.** It bakes an app-level concern into every element,
   and a rect in React Native units is honest — converting is the app's job,
   and an app that wants RSD's behaviour can do it at the call site.

Shape and cost: one `Object.create(instance)` carrying the tag name and, for
`img`/`input`/`textarea`, the polyfill accessors. It is built in the ref
callback, so an element with no ref allocates nothing — the same rule the
primitives already follow, and the reason `DOMView` with no handlers measures
identical to a bare React element. Before this lands it needs the same
objects-per-element measurement the primitives got; the claim above is a design
argument, not a number.

What ships today is the pass-through: the ref reaches the host untouched, so
`tagName` reports the native view name and neither polyfill exists.
`compatibility.ts` describes that, not this proposal.

### Design item 6 — conditional composition of `style()` handles (Lane D proposal)

**Recommendation: resolve composition at compile time, per contested property,
and make a handle list the compiler cannot see a build error.**

The problem is narrow but real. A handle holds one compiled program per
property, and the design record excludes clause-level deep merging: a later
program replaces an earlier one whole. On web a handle is class names, and two
handles that both set `color` produce two classes whose winner is decided by
stylesheet source order, not by the order they appear in `style={[a, b]}`. So
array order and cascade order disagree, and the guarantee breaks exactly where
authors expect it to hold — a conditional override.

Three approaches were considered and rejected:

- **Runtime property-keyed replacement.** Walk the handles per render, last
  write wins per property, emit the surviving classes. This is what
  `tailwind-merge` does, which the design record already refuses as a
  dependency, and it puts a per-element object walk on the render path for a
  question that is fully answerable at build time.
- **Forbid overlap.** Reject any array where two handles set the same property.
  Zero runtime cost and trivially correct, but conditional override is the
  entire point of composing handles, so it removes the feature rather than
  designing it.
- **Precompute every combination.** Emit one merged handle per subset of the
  conditional handles. Correct, and fine at two handles, but it is `2^N` whole
  handles for a feature whose whole appeal is stacking a few more.

The proposal is the third one restricted to where it is actually needed. The
compiler sees the array literal and knows which properties each handle sets:

- a property only one handle sets is emitted as an unconditional class, with no
  lookup at all — the common case, and free;
- a property more than one handle sets is **contested**, and gets a small table
  indexed by which conditional handles are enabled, holding the whole winning
  program class for each combination.

So the runtime cost is proportional to the number of contested properties
rather than to the number of properties, it is zero when handles do not
overlap, and whole-program replacement is preserved exactly because the table
stores whole program classes and never merges clauses. The combinatorics stay
small because they only cover contested properties.

The degenerate case has a clean answer: if the handle list is not a literal the
compiler can read, that is a build error on both platforms. Standalone
`tamagui/dom` is already specified as compile-only on web and native, so this
adds no new constraint — and the alternative is exactly the runtime walk the
first rejected option describes.

## 10. Decision-24 static fast path

Status: complete for the current corpus. The component-lowering designs remain
parked for an explicit architecture decision.

- The classification is the headline: zero recoverable / 528 structurally
  retained. The raw tuple remains directly underneath and is pinned as 2,575
  found / 2,047 lowered / 2,032 flattened / 55 styled / 528 bailed over 253
  usecases with zero compile failures. `found` cannot fall, and only an increase
  in `flattened` counts as progress for decision 24.
- The tuple moved only because three committed browser-delivery fixtures joined
  the measured corpus: `MixedCascadeCase`, `ProgramBlockDeliveryCase`, and
  `ProgramBlockDeliveryLate`. Together they add nine found elements, eight
  flattened elements, and one structurally retained Button. No existing
  candidate disappeared or changed classification.
- Two later browser fixtures account exactly for the next corpus-only move:
  `FontLanguageSwapCase` adds six found, five lowered, five flattened, and one
  structurally retained Button; `ProgramCascadeCase` adds four found, four
  lowered, and two flattened. No existing candidate disappeared or changed
  classification.
- The initial audits found one recoverable element out of 2,556, the inert
  `animatedBy` selector fixed in `299fe97fbb`. The remaining structural classes
  are now 339 component runtime contracts, 115 animation runtimes, 42 dynamic
  values, 21 runtime event mappings, six unevaluated spreads, and five theme
  boundaries.
- The animation audit covered every original candidate: 39 enter, exit, or
  presence lifecycles; 53 dynamic animation targets; 19 pseudo, media, theme,
  or group-driven targets; two `onTransition` callbacks; two static-looking
  elements whose theme, hydration, Configuration, or Presence inputs are
  runtime-observable; and the one inert selector now fixed.
- Dynamic values and unevaluated spreads retain runtime resolution and authored
  duplicate-prop precedence. Press events retain Tamagui responder mapping.
  Theme boundaries retain provider state. These are runtime contracts rather
  than compiler opportunities.
- The metric pins both the six structural classes and the complete component
  allowlist. A new `does not accept className` component is classified as
  recoverable and fails the test instead of silently entering the structural
  denominator. Each pinned component carries its specific HOC, custom-host, or
  styled-context justification in the report.
- The styled-context investigation disproved the initial high-volume
  hypothesis. `Button`, `Input`, `Label`, `ListItem`, and `XGroup` are behavior
  HOCs whose runtime work exceeds context resolution. The seven Card-family
  cases do not justify context-island transactions. Both the context-island
  design and the larger explicit component-lowering descriptor are parked in
  `plans/decision-24-component-lowering.md` pending an architecture decision.

## 11. Clause-free config-first cutover (Lane E)

Status: landed (this commit). The `hasClauses` short-circuit in
`contributePrograms.ts` and the `indexOf(':')` gate in `getSplitStyles.tsx` are
gone: every string style value contributes per-longhand base-only programs, and
numeric values on the six transform-family props do too (canonical
translate/rotate/scale composition). x/y bind the space token category via
`defaultTokenCategories`; the grammarConfig x/y workaround is deleted.

Two regressions the orphaned diff carried, fixed at the source:

- RN shadow props (`shadowColor`, `shadowOffset`, `shadowOpacity`,
  `shadowRadius`, `textShadowColor`, `textShadowOffset`, `textShadowRadius`)
  are excluded from program contribution: they are not CSS longhands, and
  `styleToCSS` combines them from plain style values.
- An unresolvable base payload (`boxShadow="0 0 10px $nonexistent"`) ships raw
  with the dev warning instead of silently dropping the whole value.

The collision-precedence rule for config-first resolution is already in the
design record ("Identifiers resolve config-first", the two determinism rules:
CSS-wide keywords are reserved at config creation; a configured name always
wins over a same-spelled CSS literal). It is now pinned by
`flatValuePrograms.web.test.tsx` "a configured name wins over the same-spelled
CSS literal".

### Updated test expectations, before -> after, with the decision

All follow from three decisions: (a) config-first resolution of clause-free
strings (design record, "Identifiers resolve config-first"); (b) a clause-free
value is a base-only program, so class names are hashed program classes and
noClass/native evaluation writes resolved native-parity values; (c) the v6
x/y-bind-space decision routed 2026-07-30.

- `flatValuePrograms.web` "clause-less strings keep the existing path byte for
  byte" -> "clause-free strings are base-only programs resolving config-first"
  (decision b; the old test pinned the pre-cutover staging rule).
- `compoundVariants.web` caller override `backgroundColor 'black'` -> `'#000'`
  (decision a: `black` is a configured color token).
- `compoundVariants.web` base-object overrides `paddingTop '8px'`/`radius
  '2px'` -> `8`/`2`; variant values `width '20px'`/`height '10px'`/
  `borderTopWidth '1px'` -> `20`/`10`/`1` (decision b: noClass evaluation
  writes numeric values; React DOM px-ifies at render).
- `compoundVariants.native` caller override `'black'` -> `'#000'` (decision a).
- `getSplitStyles.web` "styled with variants" `classNames { color: '_col-red' }`
  -> program class `/^_c-/` plus rule-content assertion `color:red`
  (decision b, naming only).
- `getSplitStyles.web` "shadowColor + shadowOpacity": unchanged — restored by
  the shadow-prop exclusion fix.
- `legacyConditionGate.web`: base class regex `not /^_bc-/` -> base program
  class allowed, with a stronger assertion that the base program block contains
  no `:hover` clause when `legacyConditionObjects: false` (the gate covers
  condition objects only, decision b).
- `rnStyleAlignment.web` boxShadow inset `'inset 0 2px 4px black'` ->
  `'inset 0 2px 4px var(--black)'` (decision a).
- `shorthandVariables.web` border/outline passthrough (`'1px solid red'`,
  `'none'` as whole strings) -> per-longhand program values
  (`borderTopWidth '1px'`, `borderTopStyle 'solid'`, `outlineStyle 'none'`),
  matching the already-green `$sm` media split tests in the same file
  (decision b; the border family splits composite values).
- `shorthandVariables.web` `$nonexistent` cases: unchanged — restored by the
  raw-base-payload fix.
- `componentProps.web` snapshot `_bg-red` -> `_bc-1418911449`, and
  `_tr-translateX01303033` -> `_tx-…` + `_t-…` axis/composition classes
  (decision b, naming only; rule bodies are `background-color:red` and the
  `--t-x` axis variable + shared `translate` composition).
- `transformFamily.web`/`transformFamily.native` "clause-less keeps legacy
  path" -> clause-free values compose through the family in canonical CSS
  order (decision b; translateX/translateY commute and uniform scale commutes
  with rotate, so rendering matches legacy for the common cases).
- `transformFamily.web` "program displaces legacy uniform scale" -> "scaleX
  program merges over an earlier plain uniform scale" (decision b: the plain
  uniform scale is now a base program on both axes; decision-21 merge
  restates the X base).
- `tailwindRoundTrip.native` fontWeight `'700'` -> `700` (decision b; RN >=
  0.76 accepts numeric fontWeight, repo pins RN 0.83).
- `tailwindAnimation.web` translate-x/y and `tailwindArbitrary.web` scale/rotate
  utilities: legacy atomic `transform` rule -> `--t-*` axis programs plus the
  shared composition rule (decision b, styleMode-era files slated for removal
  in Tailwind isolation item 4).
- `tailwindMode.web` (styleMode-era, slated for deletion in Tailwind isolation
  item 4): `_bg-` prefix -> `_bc-` program class with rule-content assertion;
  the three unknown-class tests now assert the evaluated inline
  `style.backgroundColor` (the cascade-preserving switch flips classes off when
  unknown classes are present) — value assertions, not weakened.

Gate numbers after this commit (rebuilt @tamagui/web immediately before both
runs): web 763 passed / 1 skipped / 1 todo / 54 files; native 411 passed /
7 expected fail / 11 skipped / 21 files. The population deltas vs the
`e43e37c917` baselines are prior committed cross-lane changes (Lane T removed a
mode-test workspace file) plus test consolidations above, not silent losses.
Parse-cost and render-loop benchmarks follow as their own commit.

### Lane E owed follow-ups (recorded 2026-07-31)

- Mixed legacy-vs-program kitchen-sink fixture: one element carrying a program
  base plus a `legacyConditionObjects: false` pseudo object, computed-style
  asserted in a real browser. The structural argument for why the cascade
  cannot flip is in the specificity ruling (legacy tiers all sit above
  (0,1,0)); this fixture pins it.
- v3 release notes MUST call out the base-specificity drop: Tamagui base rules
  fell from `:root .cls` (0,1,1) to `.cls` (0,1,0), so consumer single-class
  overrides now tie and resolve by stylesheet order (design record, "The
  program block encoding", consumer-visible consequence note).
- Parse-cost + render-loop benchmark for the cutover (own commit).

## 12. Clause-free codemod finalization (Lane V)

Status: complete; report-only posture unchanged.

- The codemod now emits authored `$token` bases as base-only programs under
  Lane E's landed config-first semantics. A clause no longer has to activate the
  rewrite. Base and clause payloads still use the same shared converter, and
  ordering barriers continue to keep same-property conditions on their authored
  side of a spread.
- Lane E reviewed and approved the conversion semantics against commit
  `2e47f650ea`: clause-free strings always contribute programs, base and clause
  payloads resolve through the same runtime path, and independently ordered
  properties may migrate without moving a blocked condition.
- The default corpus moved from 1,758 sites / 323 converted / 1,435 waiting /
  0 flagged to 1,753 sites / 1,753 converted / 0 waiting / 0 flagged. Of the
  former 1,435 waiting sites, 1,430 now convert. The other five were not legacy
  syntax. The dynamic classifier previously treated any printed-text difference
  as a token rewrite. Its printer normalizes quote style, so five token-free
  expressions acquired rewrite text, marked their sites as legacy, and then
  entered the old `clause-free-token` waiting bucket despite consuming no
  `$token`. They were two Accordion rotations, one MediaQueriesV5 responsive
  color, one ReanimatedEmitterLatchCase color, and one StyleProp pointer-events
  expression. Classification now requires an actual `$token` candidate, so
  those five are correctly absent rather than counted as conversions.
- This corpus contains zero `container-name-not-wired` sites after the earlier
  manual container migration. That is a statement about these 234 fixture
  files, not evidence that the runtime gate is closed. User code needing
  same-key clause merging across `mergeComponentProps` or `containerName` on
  the host would still receive an unsafe suggestion today. Those capabilities
  remain Lane E items 6 and 7, so a fully converted corpus does not authorize
  apply mode. Enabling writes remains a user decision.
- `x`/`y` token rewrites also apply the v3 category change by design: legacy
  `x="$4"` and `y="$4"` resolved through size, while flat `x="4"` and `y="4"`
  resolve through space. Custom configs whose size and space scales differ must
  review those migrated offsets.
- Validation from the final source state: codemod 47/47 with 241 assertions,
  typecheck green, and the default corpus 1,753/1,753/0/0 with 38 legacy
  transition values and two structured-native values retained only in the
  separate migration inventory.

## 12. Tailwind descriptor cut, protected-file half (Lane E)

Status: landed (this commit). `createComponent` reads the immutable
`styleFrontend` descriptor from static config and calls its `preprocessProps`
once at the hoisted location before `useComponentState`; components without a
descriptor pay one property read. `getSplitStyles` dispatches static
normalization through `styleFrontend.normalizeStaticConfig`, honors the
unified `STYLE_FRONTEND_PREPROCESSED` marker (the old `STYLE_MODE_PREPROCESSED`
is gone, so props cannot be tokenized twice), and the unknown-class
cascade-preserving switch (`flushForwardStylesToClasses()` +
`shouldDoClasses = false`) is now gated on the descriptor instead of the
global mode. Physically deleted from `getSplitStyles`: `isTailwindModeEnabled`,
the class-plan cache, `preprocessTailwindClassName`, `parseStaticStyle`,
`normalizeStaticConfigStyles`, `preprocessStyleModeProps`,
`preprocessFlatProps`, `parseFlatModifierProp`, `tailwindClassToFlatProp`,
`tailwindSizingValue`, and the `tailwind-merge` import. Core `className` is
raw interop only.

Expected red until the Tailwind-isolation remainder lands (routed to that
lane, same window): the styleMode-era core-test files
(`tailwind*.web/native.test.tsx`, `flatGroupSyntax.web.test.tsx`, the
class-string-styled tests inside `compoundVariants.*.test.tsx` which also
import the deleted `normalizeStaticConfigStyles`), the
`settings.styleMode` public type, the `tailwind-merge` dependency entry in
`@tamagui/web`, and one assertion in the tailwind package's
`frontend.web.test.tsx` ("unknown class passed through verbatim") that pinned
the pre-cut gap where package components missed the cascade switch. Suites
outside that set: web 501 passed with all 262 failures inside the named
files; native 266 passed with all 161 failures inside the named files;
tailwind package 73/74 with the one named assertion.

### Cutover performance measurement (Lane E, own commit as agreed)

Parse cost (`cd code/core/style-grammar && bun run bench`, Bun 1.3.14
darwin/arm64): plain value parse 48.1 ns; two-clause 364 ns; six-clause
870 ns; steady-state cache hit (key build + Map.get) 72.2 ns. A clause-free
string parses once per distinct (property, value) and then pays the 72 ns
cache hit per render.

Render loop (`RENDER_BENCH=1 TAMAGUI_TARGET=web npx vitest --run
--disable-console-intercept --config
../../packages/vite-plugin-internal/src/vite.config.ts
renderLoopBench.web.test.tsx` in `code/core/core-test`; jsdom, 20,000
iterations after 2,000 warmup, three runs, spread under 4%):

- numbers only, 3 props (plain path): 17.3–17.9 µs/op
- clause-free strings, 3 props (base-only programs): 16.9–17.3 µs/op
- one clause program (hover): 7.8–8.0 µs/op
- transform numerics, 3 props (family programs + composition): 19.5–20.2 µs/op

Steady-state, routing clause-free strings through programs costs no more than
the legacy plain path for the same prop count (the string case measures at or
slightly below the numeric case); the transform-family numeric case carries
~10% over plain numerics for the axis-variable composition, on the same order
as the values it replaced. Numbers are from one machine in jsdom and referee
relative cost, not absolute browser cost.

### Rule: rebuild downstream declarations after a public type-surface change

Downstream packages (`code/ui/text`, `code/ui/button`, `code/ui/tamagui`,
`code/demos`, and anything else emitting tracked `types/`) bake RESOLVED prop
unions into their declaration output. A change to a public prop type surface
(e.g. the `FlatStyleValue` widening in `WithThemeValues`) leaves those baked
unions stale until each package rebuilds, and the resulting TS2322 errors
point at the consumer (Button) rather than the surface that moved. Before
reading meaning into typecheck errors after a type-surface change, rebuild the
downstream packages and commit their regenerated declarations. Same shape as
the stale-dist runtime confound: the artifact you are measuring must be built
from the source you are reasoning about.

AMENDED 2026-07-31 (the half-lesson): the first application of this rule only
rebuilt the four packages whose staleness ERRORED (the Button TS2322s). But a
widening leaves an INCOMPLETE stale declaration that compiles fine — it just
silently omits the new capability. That is worse than an error, because it
does not surface. A sweep found 17 tracked `code/ui/*/types/*.d.ts` +
`code/core` declarations where `FlatStyleValue` was absent from Input,
TextArea, Sheet, Checkbox, Switch, RadioGroup, Spinner, Tooltip, Field,
AlertDialog and Dialog — the headline v3 authoring feature missing from most
of the component library's public types, while root typecheck exited 0 by
resolving cross-package types THROUGH those stale declarations. So the rule is:
a public type-surface change requires rebuilding EVERY downstream package that
bakes the resolved union, not only the ones whose staleness happens to error;
find the set by rebuilding and letting git show it, never by guessing which
packages error. And a green typecheck run against unrebuilt declarations is not
evidence — it is validating the code against declarations the code no longer
generates.

### Candidate-target validator wired into the runtime resolver (Lane E)

The shared `resolveCandidateTarget` from `@tamagui/style-grammar` now backs the
payload identifier lookup: on a bound-category miss, an identifier-shaped name
found in a sibling token category is an overloaded-family mismatch — a dev
`candidate-property-mismatch` diagnostic plus a resolution miss (the value
ships as visible literal CSS), never a silent bind through the variables
namespace. Bare numeric names stay literal on unbound categories per the
design, and properties with no bound category keep full access to the unified
variables namespace. Pinned by the flatValuePrograms test "an
overloaded-family mismatch is a diagnostic, never a silent bind".

### Fallback-category conversion, tranche 1 (Lane E item 4)

`textDecoration` and the logical `borderBlock`/`borderInline` shorthands left
the legacy refusal set. New style-grammar module `textDecorationFamily`
(line/style/color split; line keywords accumulate as a list; thickness
lengths error so the value stays legacy). `borderFamilyTargets` gained the
two logical rows splitting into CSS logical longhands. Additive edits to
existing style-grammar files (`borderFamily.ts` table rows,
`legacyConditions.ts` refusal set now `font` only, `index.ts` export line) —
flagging per the shared-file rule. `textDecoration`, `borderBlock`,
`borderInline` are now valid style keys (`@tamagui/helpers`
`validStyleProps`), so they route through the engine instead of leaking to
the DOM as attributes. Native: textDecoration evaluates to the three RN
longhand props; logical border longhands are diagnosed and dropped (RN has no
logical border properties — no silent physical approximation). `font` remains
the one unsplit composite; its micro-syntax split is the next tranche along
with the exotic transform parts. Gates: grammar 346, web 395 + web-package
type tests 90/90 (the tsconfig-excluded suite), native 170, all green.

### Fallback-category conversion, tranche 2 (Lane E item 4)

The raw `transform` property is now one ordinary program — the design's home
for skews, 3D rotations, perspective, and matrix
(`transform="skewX(10deg) hover:skewX(20deg)"` lowers to transform rules on
web and parses once into the RN array on native, family entries composing
first). A legacy transform PART prop beside a transform program is a dev
diagnostic and drops — the `transform` property replaces its whole function
list, so composing the two would invent an order CSS does not define. Part
props alone keep their legacy flatTransforms path (they have no per-part flat
spelling by design).

The `font` shorthand split landed as the new `fontShorthand` style-grammar
module (positional micro-syntax: optional style/weight heads, `size/line-
height`, verbatim family tail; ambiguous `normal`, small-caps, stretch and
system keywords error so those values stay legacy). The
`unsplitCompositeShorthands` refusal set is GONE — every resetting composite
now has a family split. `font` is a valid text style key.

FIXTURE-EROSION RULING (per the manager's question): decision (a). Mixed
legacy-vs-program cascade is a transitional scenario that ends when the
contraction physically deletes the legacy condition machinery; the
kitchen-sink `MixedCascadeCase` pin now stands on a legacy transform PART
prop inside `hoverStyle` — a source that never converts by design, so it
cannot erode from further family work. When the contraction lands, that test
failing is the designed signal to retire the fixture, not a regression.

Still owed on this lane's queue: overflowWrap/resize as style keys (OPUS's
leak-to-DOM set), nested platform chains, then the contraction (item 5).

Gates: grammar 350, core web 403 / 46 files, core native 172, kitchen-sink
MixedCascade 2/2 in a real browser, all green with fresh package builds.

### Item 4 close-out: platform chains pinned, leak-to-DOM keys closed (Lane E)

Nested platform chains already convert — the `visit` recursion in
`convertLegacyConditionProp` composes `$platform-ios > $sm > hoverStyle` into
one multi-modifier clause; the brief's "refuses conversion" claim was stale.
Now pinned by "composes nested platform chains outer to inner" in the
legacyConditions grammar tests. With that, item 4's category list is done:
every fallback category either converts (families, transform program, platform
chains) or is a deliberate legacy remainder with a diagnostic (transform part
props, unconvertible values).

OPUS's leak-to-DOM set: `overflowWrap`, `wordWrap` (its legacy alias), and
`resize` are now web view style keys, so authored values become styles instead
of unknown DOM attributes. `listStyle` deliberately skipped per OPUS's finding
(`.is_View` forces `display:flex`, no marker ever renders); if a plain-list
use case appears it belongs with the DOM contract's `html.*` work.

### Contraction stage 1: base atomic rules at flat specificity (Lane E)

The legacy base atomic selector dropped its `:root` prefix: base rules from
the plain-value path now sit at the same flat class specificity as program
blocks (the `.cls.cls` doubling for longhand-over-shorthand keys is retained
— its impossible-by-construction precondition only holds once the style prop
stops carrying CSS shorthand properties). The SSR sheet scanner is
unaffected: it identifies theme rules by the `.tm_xxt` marker, not the atomic
prefix. This extends the already-ruled consumer-visible base-specificity drop
(design record note + release-notes item) to the plain-value rules. The
pseudo `!important` tier and media ladders are untouched — they are legacy
condition machinery, held for the user decision.

### Ruling: `color` does not belong to View (Lane E)

OPUS's type/runtime divergence resolved in the TYPES' favor. The runtime
admission was an accident of table reuse: `stylePropsView` spread
`tokenCategories.color` — a VALUE-binding table — into the host-validity
table, dragging in the three text-only props (`color`,
`textDecorationColor`, `textShadowColor`). RN has no View color and no CSS
inheritance, so a View `color` renders on web only — the silent per-platform
divergence shape. The web-inheritance use case belongs to the DOM contract's
`html.*`. Fix: the View table now spreads the color category minus the three
text-only props, and a text-only style prop on a non-text host is a dev
diagnostic + drop instead of leaking to the DOM as an unknown attribute
(cold path, two `in` checks only after a key already failed validity). Five
engine tests that used `color` on View as a convenience moved to Text or
`backgroundColor` — including one mechanical host switch in
`tailwindThemeColor.web.test.tsx` (CODEX-1's file, flagged). The type surface
is unchanged: it was already right.

### `containerName` reaches the host (Lane E, codemod apply gate 3)

`containerName` is a web style key now, so `containerName="card"` emits
`container-name: card` (through the program path like any string value), and
a named container pairs with the default `container-type` (settings
`webContainerType`, else `inline-size`) whenever no explicit type is
authored — a name without containment matches no size queries. The boolean
`container` shorthand and the context/native measurement side were already
wired. This clears the codemod's `container-name-not-wired` pending: the
`@…/name` queries the migration emits now have a real container to match.
Remaining apply gate: same-key styled/call-site clause merging (Lane E item 6).

### Same-key styled/call-site clause merging (Lane E, codemod apply gate 2 — the last one)

`styled(View, { bg: 'gray hover:blue' })` overridden by a call-site
`bg="red"` now keeps the styled hover: clause-bearing string defaults are
computed once per static config (WeakMap, null for the common no-clause case,
one map hit per render), and when a call-site value displaced one at the
`mergeComponentProps` level, the styled value re-enters the forward pass at
the styled-base position where the ordinary decision-21 program merge
restates only the base. Pinned web (rule content) and native (state
evaluation) in the flatValuePrograms tests. With `containerName` landed
earlier, ALL THREE runtime gates on the codemod apply mode are now closed —
flipping apply on is purely the user's call.

### Diagnostic: base swallowed by a space-greedy clause payload (Lane E)

OPUS's WebKit re-check found `backgroundColor="sm:green red"` rendering
transparent at every viewport with no diagnostic: the clause payload is
space-greedy by design, so a base written AFTER a conditional joins that
conditional's payload (base stays null), and the browser drops the resulting
two-color declaration. RULING: the greedy absorption STAYS — payload
component lists (`boxShadow="inset 0 2px red"`) depend on it and the parser
cannot know per-property component grammars — the silence goes. New
style-grammar module `payloadShape` (`validatePayloadShape`): a
multi-component payload on a single-value longhand is a
`multi-component-single-value` diagnostic, with the base-after-conditional
hint when the program has no base; an explicit list-valued-longhand set
(boxShadow, transform, fontFamily, …) keeps legitimate component lists
clean. Per the design's one-owner rule the validator lives in the resolution
layer for the runtime, the compiler, and the ESLint rule to share — CODEX-1
should wire the lint rule to it rather than growing a second opinion. The
runtime consumes it in the parse-cache compute step: once per distinct
(property, input), both platforms, dev-only, zero hot-path cost. Pinned by
grammar unit tests and a web integration test.

### Lint and editor tooling complete (Lane V)

- The ESLint rule now consumes `validatePayloadShape` after shorthand
  expansion. `bg="sm:green red"` reports the same
  `multi-component-single-value` diagnostic as the runtime, while the real
  source fixture keeps a list-valued `boxShadow` clause clean. Shape,
  grammar, target, and obsolete-name diagnostics remain fix-free.
- `@tamagui/language-service` reads and watches the compiler-generated config;
  it carries no fallback vocabulary. Candidate, target, modifier, and cursor
  boundaries all come from `@tamagui/style-grammar`. The runtime scanner owns
  optional source spans, while the ordinary render parse path allocates none.
- JSX completion sites require the component type's existing `staticConfig`
  marker, then TypeScript contextual assignability. Import spelling is not an
  identity authority: a plain `@tamagui/logo` component with a string `color`
  prop receives no Tamagui candidate completion, while View, Text, and styled
  components do. Styled configuration sites additionally require `styled` from
  the core flat-value export surfaces; `@tamagui/tailwind` variant matchers are
  explicitly outside that set and receive no flat candidate completion.
- TypeScript does not expose a cooked-to-authored offset map for string
  escapes. The first delivery therefore declines escaped literals whenever
  `literal.text` differs from the authored slice. This includes encoded clause
  delimiters such as `hover\x3ared`, preventing a completion replacement from
  deleting a runtime clause.
- Serialized config format `themeFields: "values-only"` lives in the sibling
  `tamaguiConfigMetadata` namespace. That exact version needs no theme cleanup;
  a present unknown format is rejected. Unversioned legacy artifacts alone
  drop the injected `id` field. Regressions pin both sides: stale `id` is absent
  while `surface` survives, and a legitimate versioned theme key `mode` whose
  values equal the containing theme names survives.
- The package exposes the CommonJS factory shape tsserver loads, including a
  root shim that unwraps the compiled default export. Its behavioral test
  instantiates a real TypeScript language service through the packaged name,
  exercises base, payload, modifier, host/type, escape, and config-reload
  paths, then verifies the config watcher closes.
- Final focused gates: style-grammar 369/369 plus package build, ESLint 3/3
  plus package build, and language service 2/2 including its package build.

### Font reset selects the explicit default (Lane V)

- `createDesignSystem` now derives the shared `.font_*, .is_View` reset from
  normalized `settings.defaultFont`, never alphabetic font-key order. An
  explicit default that does not exist errors during config creation instead
  of silently omitting the reset.
- The regression adds an incomplete `aaa` font that sorts before `body`; it
  failed before the fix and now leaves the reset unchanged. Browser probes
  before and after were byte-identical for Text (Inter, 13px/22px) and View
  (Inter, 16px/23px), `FontLanguageSwap` passed 4/4 at detached pre-fix HEAD
  and 4/4 after, `createTamagui.web.test.tsx` passed 9/9, and the final web
  package build passed.

### Geometric shorthand slot semantics implemented (Lane E, review finding)

The adversarial pass found a design-vs-implementation gap in the value
pipeline: the design promises `p="4 8"` distributes per CSS slot
("per component value: p='4 8' resolves both"), but every side received the
whole payload and the browser silently dropped the invalid declaration —
broken BEFORE the cutover too (the legacy expansion mapped the full string to
every longhand). Fix at two coordinated points sharing one algorithm: new
grammar module `geometricShorthand` (slot patterns over the PARSED value, so
bases and clause payloads distribute independently and `p="4 8 sm:6"` is
correct; slash syntax and oversized payloads error rather than misassign),
wired in the parse cache; and `propMapper` now routes geometric-shorthand
STRING values whole into the program engine instead of pre-expanding them
(numbers keep the legacy per-longhand expansion, `safe` keeps its earlier
special case). Pinned by grammar unit tests plus web and native integration
tests. Root lint is now clean repo-wide (payloadShape test formatted).

### Reserved CSS idents rejected at config creation (Lane E, review P1)

The determinism rule ("configuring a token with a reserved CSS-wide keyword
name is a config-time error") is now enforced: `createTamagui` throws,
case-insensitively, for any token named in `reservedCssIdents`
(style-grammar). Unconditional, all modes — the token would be unreachable
(the resolver short-circuits reserved idents before any lookup), so allowing
it means silent misrender. Pinned by `reservedTokenNames.web.test.tsx`.

The validation immediately caught the shipped v6 config: `color.$transparent`
(removed — value-identical through the reserved-literal path) and
`radius.$none` (removed — its flat spelling `radius="none"` was already
emitting invalid `border-radius:none`). Generator updated with the generated
file. Manager ruling recorded in the design record ("Identifiers resolve
config-first"): reserved holds at every resolution layer; `rounded-none`,
`w-auto`, `m-auto` become candidate-layer conveniences.

EXPECTED RED, routed to the Tailwind lane by the manager: `configAware.web` /
`configAware.native` construct a config with `size.$auto: 321` and pin it
beating the `w-auto` convenience — the premise this ruling reverses. Both
suites fail at their `beforeAll` createTamagui call until that lane lands the
new premise (suites otherwise green: tailwind web 454/19 files pass beside it,
native 265/3).
