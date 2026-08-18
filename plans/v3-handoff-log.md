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

Status: landed. Corrected 2026-07-30 by the verification lane — this said
"pending" with no body while the seam was already in the tree, and a plan
status was reported to the user off that line.

- The subscribable inset store landed in `62e8541d22`, replacing the
  module-eval capture. `code/ui/sheet/src/useSafeAreaInsets.native.ts` reads
  it rather than a snapshot.
- The style seam completed in `b2e0a5c084` (27 files): `SafeAreaTracker.tsx`
  and `SafeAreaTracker.native.tsx`, `resolveSafeArea{,.native}.ts` and
  `resolveSafeAreaVariable{,.native}.ts`, wired through `TamaguiProvider`,
  `createComponent`, `getSplitStyles`, `propMapper` and `useProps`.
- `925e338d2f` moved setup out of module load, and `0cca09f47e` added the
  lazy-subscription probe.
- Verified: `safeAreaVariables.native.test.tsx` 3 passed.
- One open caveat, recorded in `plans/v3-pre-push-gate-audit.md`: that suite is
  order-dependent under `--sequence.shuffle`, failing intermittently with
  `Cannot read properties of undefined (reading 'listeners')`. The trigger is
  environment-dependent rather than seed-deterministic. Whether the test's
  assumption that the subscription global already exists is stale, or the
  runtime should create it lazily, is still undecided.

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
  fell from `:root .cls` (0,2,0) to `.cls` (0,1,0), so consumer single-class
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

### P0-2 closed: program eligibility is one contract, the widening landed (Lane E)

The root fix: `programEligibility`/`legacyPartComposite` in style-grammar is
the one owner of "does a flat clause value on this prop evaluate". The runtime
consumes it in `contributeStylePrograms` (the private `rnTranslatedShadowProps`
set and the inline transform-part check are deleted). The codemod and ESLint
must consume the same export before converting/blessing a condition — routed
to their lane; until then the codemod still emits clause spellings for part
props that now diagnose.

Behavior, all red-first tested and green on every gate (core web 430, native
186, static native 47+1 expected fail, static web 110, webpack 20, tailwind
460/271):

- RN part props (shadow parts, non-family transform parts): a clause-shaped
  string drops with a dev diagnostic naming the composite (`boxShadow`,
  `textShadow`, `transform`); plain values keep their legacy pipelines.
- `pointerEvents` is now a style key on BOTH platforms (RN >= 0.71 style
  spelling; the native verbatim-forward fork at getSplitStyles and the
  webOnlyStyleProps/webPropsToSkip special-casing are deleted). Clause values
  evaluate via programStates on native and lower to pointer-events rules on
  web. Consumer-visible: native hosts now receive `style.pointerEvents`
  instead of the deprecated View prop.
- Native `boxShadow`/`textShadow` strings flow WHOLE into the program engine
  (the propMapper pre-parse that mangled clause text into the color component
  is gone); evaluation parses the winning payload to RN object format, and
  textShadow expands to its RN longhands post-evaluation. The pinned
  rnStyleAlignment RN-format contract is unchanged.

### Web html.* style props fixed; compiled-form nesting scoped (Lane E)

Finding 1 (from the DOM design read) landed at `5e59fea19b`, red-first: the
structural pass no longer rewrites an html.* element to a literal tag on web
when it carries anything outside the strict DOM prop tables (a style prop, or
a spread the pass cannot see through) — those elements keep the runtime
component path, which renders the element resets and style props correctly.
Strict-DOM-only elements still rewrite (pinned). Kept elements stay in
`module.elements` for the future DOM candidate lowering; the pass versionHash
bumped to v2 so no stale plan survives.

Finding 2 (compiled-form whole-props replacement swallowing nested candidate
spans, `compilerHost.ts:195`) is scoped, not fixed, per the manager:

- **Forfeit, never corruption — confirmed structurally.** Whichever of the
  two candidates commits first wins; the second bails on `overlapsCommitted`
  transactionally, and if overlapped edits ever reached the final plan,
  `validateSourceEdits` throws at apply time (build error, not bad output).
  Either order the emitted source stays valid with the losing element simply
  un-lowered.
- **Share of the bailed population: zero.** The full 254-usecase metric run
  (found 2,580 / bailed 528, RECOVERABLE 0) contains no
  `local/overlapping-edit` at all — the forfeit needs compiled
  jsx/jsxs/createElement form with a nested candidate inside `propsSpan`, and
  the corpus is authored JSX with per-entry spans. Latent hazard for
  post-transpile pipelines only; the strengthened `editsAreCandidateLocal`
  (DOM design doc, Decision 1) removes even that, scheduled with the DOM
  candidate work.
- Metric note for the tuple owner: the corpus grew a file (253 -> 254, +5
  found/lowered/flattened, bailed unchanged) — the pinned totals in
  `bailoutMetric.web.test.tsx` need that rebaseline from whoever added the
  usecase; my changes moved nothing (bailed identical, no new reason lines).

### RN-internals pins to re-check on any React Native upgrade (Lane E)

`code/core/web/src/helpers/parseNativeStyle.ts` now carries React Native's
OWN acceptance grammar, copied verbatim with citations, at the pinned 0.83.2:
the linear-gradient angle and direction regexes and the position rule
(px -> numeric points, % -> string, anything else invalidates) from
`react-native/Libraries/StyleSheet/processBackgroundImage.js`, and the
deliberate lowercase-exact `inset` match agreeing with `processBoxShadow.js`.
Matching the platform exactly beats approximating it, and it makes these a
pinned dependency on RN internals: whoever bumps React Native diffs those two
files against our copies. The decline rule (design record, parse-order
section): where we decline, the raw string flows through to RN's own parser —
verify that fallthrough still exists after any parser change.

The audited surface, property by property, as of `5f34f18f70` — a complete
statement of where our parser stands relative to the platform:

- gradient DIRECTION: RN's `LINEAR_GRADIENT_ANGLE_UNIT_REGEX` and
  `LINEAR_GRADIENT_DIRECTION_REGEX` verbatim (signed/leading-decimal angles,
  case-insensitive keywords).
- gradient POSITIONS and TRANSITION HINTS: a `getPositionFromCSSValue` mirror
  (px -> parseFloat points, % -> string, else invalid) plus RN's case-4 hint
  rule (a lone position between stops is `{color:null, positions:[n]}`; a
  hint first, last, or adjacent to another hint declines the whole parse).
  Stops classify each token by what it IS — the three fixed misreads
  (direction, position, hint) were one assumption, "any unrecognized token
  is a color", in three costumes.
- shadow DIMENSIONS: signed and leading-decimal already handled by Number;
  px/dp unit strip case-insensitive.
- `inset`: RN-exact lowercase match, DELIBERATELY unwidened — RN's own
  processBoxShadow is lowercase-exact, and being looser than the platform is
  the tighter error inverted.
- COLORS: verbatim passthrough; `processColor` is the authority.

### Transition record clarified; two open items from the 39-row audit (Lane E)

Decision, made deliberately per the manager: the record's "both forms lower
into one IR" meant shorthand + longhands (its surrounding context) and item
4's alignment path fulfils it at runtime — but three readers took it as
CSS-plus-legacy, so the record now says explicitly that legacy array and
per-property forms stay driver-consumed in v3 (they carry spring/driver
configuration the IR deliberately does not model), with
`migrateLegacyTransition` a codemod-side prototype, no runtime caller by
design. The commitment-without-caller pattern is named in the record after
its third instance.

Open items this leaves, neither urgent:
- `{ default: '100ms', duration: 50 }` — accepted by the public driver
  normalizer, rejected by the IR. Recorded as the compat edge any future
  legacy-through-IR routing must handle first; one row, exactly the shape
  that becomes a bug report.
- transitionProperty naming a Tamagui-only spelling (`y`, other transform
  family props): the CSS emission would produce a `transition` on a property
  name CSS does not know, so it silently never fires. The transition wiring
  (held for the animations review) needs property normalization to the CSS
  targets (the `--t-*` axis variables or `transform`) or a diagnostic — added
  to that review's scope rather than patched mid-hold.

### Transition wiring rework after the animations review (Lane E, held tree)

The review's blocker was real and its premise correction accepted: conditional
transition clauses SHIP at HEAD through the program engine, so the wiring's
scope fence rested on a false assumption. Rework, in the held (uncommitted)
tree: clause-bearing `transition` strings keep the shipped program path
byte-identically (regression-guarded — the review's own HEAD hash
`_t-1443386560` re-emits); the alignment accumulator owns only clause-free
contributions and YIELDS with a note when a program owns the property;
clause-bearing longhands diagnose and drop; the longhand intercept carries
the same `!noSkip && !isHOC` gate as the shorthand block (the review's
775/837 asymmetry — one element never gets two transition owners);
`transitionProperty` spellings normalize (transform family ->
`effectiveProperty`, camelCase -> kebab) per the reviewer's
normalize-not-diagnose recommendation.

NAMED FOLLOW-UP (v1 limit, documented in alignTransitions' header): base
transitions parse through the transition IR while conditional and pseudo-prop
transitions parse through the value grammar and pseudo extraction — two
parsing rules for one property. The follow-up is one grammar owning both;
neither side gets quietly extended to cover the other.

## 13. Variant clause single-pass rework and skins batch (2026-08-10)

Four commits landed on local `v3-beta` (not yet pushed), tree clean:

- `cae9c5e2a2` feat(core): resolve variant prop condition clauses in a single inline pass
- `cef386c4dd` fix(animations-motion): normalize WAAPI diff values and animate without scope
- `f8ab79c8c0` feat(tamagui): ship skinned control components from the tamagui package
- `c0bbd16c5a` site: adopt tamagui package skins and fix demo route lookup

### Variant clause parsing was rewritten before commit

The previous (uncommitted) implementation parsed `density="compact sm:roomy"`
with `@tamagui/style-grammar` `parseValue` on every render, then built a Map of
per-property program objects with clause arrays and a marker Symbol that
getSplitStyles special-cased in two places. That violated the one-parse rule in
CONTRIBUTING.md ("Style value parsing: one parse per unique value") and the
single-forward-pass requirement, and it silently dropped any variant value
containing a colon that failed to parse (`aspect="16:9"` would dev-throw).

The committed design instead:

- `resolveVariants` (propMapper.ts) lexes the value in ONE inline charCode
  for loop, the same lexing `contributeStyleString` uses (quotes, paren depth,
  top-level whitespace words, last top-level colon splits modifiers from
  payload). No parseValue, no registry, no Map, no program objects.
- Each clause's resolved entries carry the raw modifier source as `entry[3]`
  (`PropMappedValue` is now `[key, value, original?, conditionSource?][]`).
  Base-segment entries carry nothing and flow the completely normal path.
- getSplitStyles' propMapper callback routes clause entries to
  `contributeVariantClauseValue` (directStyle.ts): one `getCondition` per
  entry, `emitValue` gated on `condition.emit && (condition.active || web
  class gen)`. Same emission semantics the program version had.
- HOC pass-through and nested-variant cases reduce a clause back to flat-value
  string form via `appendFlatClause` (`"20 sm:40"`), so the wrapped component
  or downstream string parser applies it with zero new object types crossing
  component boundaries. Non-string-representable values dev-warn and drop.
- A variant defining a literal colon key (`"16:9"`) exact-matches before any
  clause lexing.

Do not reintroduce a runtime `parseValue` call or a second scanner here; extend
this inline lexer or the cached-parse representation instead.

### createStyledHOC must keep props deferred

`styled(Input, {...})` in FieldDemo hit TS2590 (union too complex). Two causes,
both fixed:

- createStyledHOC's return type now keeps the base component's `Props`
  (TamaDefer) when `CustomProps` is empty, so styled() composes it lazily.
- Annotating the render function's props parameter (e.g.
  `function Input(props: GetProps<typeof InputFrame>)`) makes TS infer
  `CustomProps` AS that whole concrete type, which defeats the deferral.
  Render params must stay unannotated (contextual typing supplies the type)
  unless the HOC genuinely adds custom props. Input/TextArea were fixed;
  future skins must follow this or downstream styled() calls explode.

`tamagui` also re-exports the `Popover` ref-handle type again (skin file
declares `export type Popover = UiPopover`), keeping `useRef<Popover>` working.

### Validation state at handoff

READ (ran, output confirmed): all core-test suites green (web 454, native 265,
ios, androidtv, tvos, token provenance), full repo `./scripts/typecheck.sh`
green, root `bun run lint` green.

NOT validated: kitchen-sink Playwright suites (including all four animated
drivers), tamagui.dev build, native Detox. The animations-motion change
(normalize WAAPI diff values, animate via `animateMotionValue` on the node
instead of the scope-bound `animate`) has NO runtime validation yet; the
updated Accordion motion test and MenuSubStyled motion test are its intended
gates.

Named follow-ups, none blocking:

- No test covers the HOC clause pass-through (`styled(Input)` inside Field
  exercises it) or nested-variant clause reduction; add coverage when touching.
- Conditional variant clauses on non-style props (e.g. a variant setting
  `numberOfLines`) are dropped with a dev warning, same as the program version.
- `getCondition` runs once per resolved property per clause; a per-styleState
  condition cache would cut that to once per clause if profiling ever shows it.

## 14. Runtime native `html.*`, Theme inline values, zero-runtime design (2026-08-17)

Three blocks landed on `v3-beta` and the zero-runtime mode moved from an
unanswered question to an accepted design. Tip after this batch: `bef1786a76`.

- `73c96de6c4` feat(core): render html.* through the dom primitives at runtime on native
- `fe4a03e3b8` / `e40ee469cf` / `0904fa3c1f` Theme inline values, merged as `d374146ee1`
- `b03c4d0e01` / `19252e97bb` / `bef1786a76` the zero-runtime design document

Validation at the merged tip, READ: core-test web 465 passed, core-test native
292 passed with 7 expected-fail, `./scripts/typecheck.sh` passed,
`domHtmlRuntime.native` 24/24, `domCompiledRuntime.native` 4/4.

### `html.*` works at runtime on native, and why it did not before

Three independent causes, none of them the one the symptom suggested:

- `writingDirection` was never in the valid style props
  (`@tamagui/helpers` `nonAnimatableTextOnlyProps`), though it is in
  `TextStylePropsBase` and `expandStyle` already had a web mapping. So `dir`
  renamed correctly and then got classified as a non-style prop, reaching the RN
  host as something it ignores. `compilerHost` now carries a table-driven rule:
  a dom attribute whose `nativeProp` renames to a valid style key is aliased into
  the style props before the split.
- `onClick` was destructured out of `viewProps` and only invoked inside the
  `TAMAGUI_TARGET === 'web'` press branch, so native dropped it before the
  primitive. Separately, `webPropsToSkip.native.ts` puts the whole web event
  family into `skipProps`, which would drop it earlier still in a real Metro
  bundle. Both are fixed by a new `StaticConfig.neverSkipProps`, GENERATED into
  `html.native.tsx` from the EVENTS table (every row with `native !== 'none'`)
  and honored at both `skipProps` sites in `getSplitStyles`.
- The DOM-shaped ref facade was already correct. `createDOMRefCallback` wraps the
  host instance, and `react-test-renderer`'s default `createNodeMock` returns
  null, so the callback received null. The TEST harness was wrong, not the
  runtime. The compiled path would have failed identically.

Do not hand-maintain a second copy of the event list and do not special-case
individual prop names at the `skipProps` sites. The table is generated from
`code/core/dom/src/tables/` and that is the only source of truth.

`domCompiledRuntime.native.test.tsx` now asserts runtime/compiled parity
directly: the same authored tree is compiled-and-executed and rendered through
`html.native`, and the normalized host trees are compared. It records two
divergences rather than hiding them (`suppressHighlighting` on Text,
`objectFit` on img reach the host only at runtime, because the compiler reads
defaultProps for their styles). That drop is compiler-wide for all flattened
Tamagui Text, not DOM-specific.

### Theme inline values

Theme values are now props on `<Theme>` itself, scoped by its theme prop, with
theme targeting through the value grammar's own modifier
(`<Theme background="blue4 dark:blue2">`). There is no `values` object and no
`themes` map. `plans/variables.md` carries the full surface; its 2026-08-16
section at the top is the binding one.

The cache under `getInlineValuesFromProps` is a WeakMap keyed by `conf.themes`
holding an inner Map bounded at 10,000 with clear-on-limit, reusing the existing
pattern in `code/core/simple-hash/src/index.ts`. Two properties are load
bearing and easy to break:

- the no-value path returns `null` after one `for...in` over reserved props and
  allocates nothing, so a plain `<Theme name="dark">` pays no per-render cost.
  Measured: 0 retained bytes across 10.1M calls.
- cache keys are length-delimited and type-aware, so numeric `123.456` does not
  collide with the string `'123.456'`.

`values` is not in `reservedThemeProps`, so a prop named `values` is read as an
ordinary theme key. Anything written against the old `<Theme values={{...}}>`
shape is wrong and will silently mean something else.

### Zero-runtime: guards do not create module absence, erasure does

This is the finding worth carrying forward, because the obvious design is wrong.

The natural approach is a first-statement `process.env.TAMAGUI_RUNTIME === 'zero'`
guard that throws, letting each bundler fold the body away and drop its imports.
Measured, with a barrel-import fixture and a mandatory negative control
(fixture and logs recorded under the campaign scratchpad):

- **Metro 0.83.7 does not drop them.** All three marker deps survive in the zero
  build exactly as in the full build. The literal folds and the throw is present
  in the minified output, and the imports remain anyway. Metro fixes its
  dependency graph at resolution time, before minification, and does no
  export-level shaking.
- **webpack 5.108.4 does drop them, but its success state still ships a stub**
  of about 154 bytes containing the throw, so the guarded module id remains in
  the module graph. Any gate defined as "no forbidden module ids" therefore fails
  in the guard model's best case.
- A first fixture was inconclusive because webpack's ordinary used-export
  analysis removed everything in both builds before the guard mattered. If a
  control cannot discriminate, it proves nothing; the fixture was rebuilt to keep
  the guarded module genuinely observable.
- No bundler drops an unused module-scope call to an imported function by
  default, so an app-local `const Card = styled(View, {...})` in a module with
  other live exports survives and drags the component runtime in, even for code
  that fully follows the contract.

The mechanism that does work is compiler reference ERASURE before the bundler
records dependencies, which zero mode can do safely because every use either
lowered or the build already hard-failed. Removing the reference is exactly what
made the Metro markers disappear in the probe. Guards remain only as a secondary
loud failure for Vite and webpack, and no byte-removal claim is made for Metro.

### Test resolution gap, repo-wide

READ: in `code/core/core-test` under `TAMAGUI_TARGET=native`, and in
`code/compiler/static-tests`, `./webPropsToSkip` resolves to the WEB variant
(`Object.keys(webPropsToSkip).length === 0`), even though
`code/packages/vite-plugin-internal/src/getConfig.ts` lists `.native.ts` and
`.native.tsx` first for the default native branch. A pre-existing comment in that
file already notes `vitest isnt doing .native.js`.

The consequence is broader than one prop list: a class of native-only module
behavior is not exercised by any suite, so "native tests pass" is weaker evidence
than it looks for anything that differs by platform extension. Treat a passing
native suite as insufficient proof for `.native.ts` behavior until this is fixed.

**Root cause, found 2026-08-17.** Vite concatenates the extension arrays
contributed by each plugin config. The Tamagui plugin contributes its WEB
extension list, and the native-test extensions are appended after it, so the web
entries win relative-import resolution before the native entries are ever
reached. `optimizeDeps` alone gets a native-first list, which is why the config
looks correct in isolation. Probe receipt: a native core run and a native
compiler-static run both loaded
`code/core/web/src/helpers/webPropsToSkip.ts`, the web variant.

**And fixing it is not a one-line change.** Trialing `disableResolveConfig` for
the Tamagui plugin on native does produce a native-first resolved list, and the
core native suite then fails 5 files: one suite-load failure plus 9 test
failures across refs, native fast-path links, Tailwind Dimensions, stable-style
rendering, and color expectations. Those areas have been running against WEB
variants all along. Either those 9 tests assert web behavior while claiming to
be native, or the product is genuinely wrong on native in those areas. Nobody
has established which, and that question is the actual work here. Do not flip
the resolution without budgeting for it.

### Named follow-ups

- `primitives.native.tsx`'s four `DOMRuntime*Frames` do not declare
  `neverSkipProps`, so on the COMPILED path a native element with a runtime style
  program plus `onClick`/`onChange` still drops the handler. The fix is to
  generate the event table into a leaf module that both `html.native.tsx` and
  `primitives.native.tsx` import, since the table is currently a module-local
  const and a direct import would create a cycle.
- `img` `objectFit: 'fill'` is a web-only style key, so native never turns it
  into `resizeMode` and `expandStyle`'s native `objectFit` case is unreachable.
- `hidden={dynamic}` on a dom tag is consumed by the compiler with nothing static
  to lower and is silently dropped. The static-value diagnostic added in this
  batch covers only style-lowering attributes.
- The public name for the Theme inline-values API is an open owner decision. The
  only source flip point is the exported alias at
  `code/core/web/src/views/Theme.tsx:53`; the `.d.ts` regenerates from a build.

## 15. Zero-runtime Phase 1, Variables removal, engine audit (2026-08-17, later)

Continues section 14. Written partly so a reader can tell finished work from
work in flight, and so known-open items are not rediscovered as findings.

### Zero-runtime mode: design accepted, Phase 1 proven on all three integrations

`plans/v3-zero-runtime-mode.md` is the accepted design. It went through review
and two findings changed it materially:

- **Guards do not create module absence; compiler reference ERASURE does.** The
  original design stripped subsystems with a first-statement
  `process.env.TAMAGUI_RUNTIME === 'zero'` guard and expected each bundler to
  fold the body and drop its imports. Measured, that fails three ways: Metro
  fixes dependencies at resolution time and does no export-level shaking;
  webpack's success case still ships a stub containing the throw, so the module
  id remains in the graph and the design's own module-absence gate fails in its
  best case; and no bundler drops an unused module-scope `styled()` call, so an
  app-local `const Card = styled(View, {...})` in a module with other live
  exports drags the runtime in even for compliant code. Erasure is the
  mechanism; guards remain only as a loud secondary failure on Vite and webpack,
  and no byte-removal claim is made for Metro.
- **Static theme context does not cross an island boundary by itself.** An
  island's provider starts at its own defaultTheme, and `Portal` re-themes
  portaled content from JS theme state (`Portal.tsx` reads `useThemeName()` and
  re-applies it), so a Sheet island inside a zero root `<Theme name="dark">`
  portals light content onto a dark page: green build, both gates pass, wrong
  colors. Fixed with a compiler-generated theme bridge carried in the island
  manifest.

Phase 1 is complete and proven on Vite, Next/webpack and Metro web. Fixture,
receipts scripts and both gate controls live in `code/tests/zero-runtime/`.
A zero entry ships at the React baseline with zero Tamagui modules, against
95,490 gzip and 85 Tamagui modules for the same entry built full-runtime.

Four bugs Phase 1 found, all fixed at the source, worth knowing because each is
a shape that recurs:

1. **Erasure was not evidence-based.** The planner asked for each imported
   binding's references; the API returns nothing for an import binding in an
   unlinked single-module project, so "no references" was read as "dead" and
   every Tamagui import was erased unconditionally. The Vite fixture happened to
   lower everything, so its output was correct BY LUCK; Next's negative control
   exposed it as a ReferenceError at prerender. The fix counts occurrences from
   the AST and deliberately OVER-counts shadowed names, because over-counting
   keeps an import that could have dropped while under-counting ships a
   ReferenceError.
2. **Warm-cache builds silently lost the CSS artifact**, on both webpack and
   Metro: the loader/scan that collects per-module atomic CSS is skipped on a
   rebuild, so a second build emitted an artifact missing every rule while still
   deriving `TAMAGUI_DID_OUTPUT_CSS`. Correctness-first fix forces the re-run;
   making it cheap without reintroducing the divergence is Phase 2 work.
3. **The zero transform ran on Tamagui's own dist**, because the webpack loader
   guarded only on a `node_modules` substring and workspace packages resolve
   outside `node_modules` in this monorepo.
4. **The zero contract is a property of an ENTRY GRAPH, not a project.** Metro
   plans every project source by directory walk, so judged per file the app's own
   config, the generated island entry and unrelated control fixtures all
   "violate" the contract: 16 violations on a correct build. Any per-file
   enforcement is wrong.

Two fixture-hygiene traps of one class, two integrations sharing a directory
fighting over a file: Metro and Next both published to `public/`, so whichever
built last silently decided what the OTHER integration asserted; and a Metro
babel config at the fixture root disabled Next's SWC entirely. Publish
directories are isolated now. A fourth integration must take its own directory
and must not add a config file at the fixture root that another integration
reads.

Also worth carrying: **oxfmt honours the ROOT `.gitignore` only.** A nested
`.gitignore` does nothing, which has now broken root lint twice from this
fixture's generated output. Generated directories go in the root file.

### `<Variables>` is gone; `<Theme>` inline values are the whole API

There is no separate component. Theme values are props on `<Theme>`, scoped by
its theme prop, with theme targeting through the value grammar's own modifier.
`<Variables>` was never publicly released and is removed outright rather than
deprecated, so nothing documents it and no migration note exists anywhere by
deliberate decision.

Two things a future reader will otherwise get wrong:

- The **config** `variables` key (`createTamagui({ variables: {...} })`) is a
  DIFFERENT feature and it stays. It is what makes `$focusRingColor`-style keys
  behave like theme keys everywhere. Its similar name makes it an easy
  accidental deletion.
- `values` is not in `reservedThemeProps`, so a prop named `values` is read as an
  ordinary theme key. Anything written against the old `<Theme values={{...}}>`
  shape silently means something else.

A real defect was found and fixed here: theme rules carry an id-level anchor
(`:not(#t_theme_full_name)`, specificity 1,2,0) while the base inline-value rule
was `:root .tvar_x` (0,2,0), and both classes land on ONE span, so
`<Theme name="dark" background="#0b2545">` silently ignored the authored value.
Every selector family in `getVariablesCSSRules` now shares the same anchor, which
raises the whole ladder while preserving its base/themed/scheme order. Do not
"simplify" that anchor away.

### Engine bundle audit: the growth is capability, not fat

Byte-level post-minify audit of `directStyle` and `getSplitStyles` against the V2
baseline, using the existing attribution harness.

- `directStyle` was +5,520 gzip marginal against V2. Five mechanical wins removed
  **115 gzip bytes** (2.08%), and each also removed an allocation without adding
  a render pass, scanner or per-render allocation.
- The remaining 5,405 is feature weight: composite emitters 1,236, condition
  precedence and routing 1,123, atomic merge and rule identity 932, generic value
  routing 656, token/theme/safe-area semantics 606.
- **`getSplitStyles` has no defensible deletion and is already 112 gzip SMALLER
  than its V2 counterpart.** It is the file people assume is bloated. It is not.
  This is recorded so nobody re-audits it.

Closing the remaining gap from these two modules would require dropping a
capability, which is a product decision. The measured levers are elsewhere:
wiring `outputCSS` through the vite plugin was measured at −2,928, and
zero-runtime mode removes the whole 44,899 of Tamagui-attributable JS.

### In flight right now, NOT gaps

- Block 2 Phase 2, productionizing global CSS artifact ownership, plus
  zero-runtime dev mode (Phase 1 shipped production builds only).
- A V2-counterpart measurement answering "V2 had most of these features, so why
  is V3 bigger": per-group v3-vs-v2 byte mapping, and whether any V2-era helper
  still ships alongside `directStyle` doing the same work.

### Known open items, deliberately not yet done

- **Native vitest resolution.** Vite concatenates the extension arrays each
  plugin config contributes, so the Tamagui plugin's WEB list wins relative-import
  resolution before the native-test extensions are reached. Correct native-first
  resolution makes 5 core-native files fail with 9 test failures across refs,
  native fast-path links, Tailwind Dimensions, stable-style rendering and colors.
  Those areas have been running against web variants all along. Either those
  tests assert web behavior while claiming native, or the product is wrong on
  native there, and establishing which IS the work. Do not flip the resolution
  without budgeting for it.
- The zero-runtime fixture's playwright suite and receipts scripts are not wired
  into CI yet, deliberately, until the fixture stops moving at the end of block 2.
- Block 2 Phases 3 through 7 are designed but not implemented.
- Two tests are load-sensitive and each produced one false failure under parallel
  builds: `motionDriverConversion` (10x ceiling, hit 11.93x) and
  `safeAreaVariables.native` (5s limit, hit 10s). Re-run in isolation before
  treating either as a regression, and never raise a threshold to make one pass.

### The V2-counterpart measurement, and what it means for anyone golfing the engine

Read this before spending effort shrinking `directStyle` or `getSplitStyles`.

The obvious objection to calling directStyle's remaining 5,405 gzip "feature
weight" is that V2 shipped most of those features too. Measured, group by group,
same fixtures and same gzip level 9 and the same source-map span subtraction on
both sides, each V2 group computed as ONE union deletion rather than a sum of
per-function marginals:

| group | V3 directStyle | V2 counterpart | V3 − V2 |
| --- | ---: | ---: | ---: |
| composite emitters | 1236 | 623 | +613 |
| condition routing | 1123 | 2696 | **−1573** |
| atomic merge | 932 | 1057 | −125 |
| value routing | 656 | 980 | −324 |
| token semantics | 606 | 563 | +43 |

Marginals over shared generic code, so they are not additive and there is no
total. **Three of the five groups are smaller in V3 than the V2 code that bought
the same capability.** V3 routes state, media, group, container, theme and
platform conditions in 1,123 bytes where V2 spent 2,696.

The V2 counterparts are genuinely deleted, not shipping alongside. Confirmed from
the emitted source map rather than by reading imports: `createMediaStyle`,
`pseudoDescriptors`, `getGroupPropParts`, `isActivePlatform`, `isActiveTheme`,
`getTokenForKey` and `resolveCompoundTokens` have zero occurrences in the V3
chunk.

Things that LOOK like duplication and are not: `getCSSStyleAtomic`/
`getStyleObject` (246), `createAtomicRules` (392), `expandStyle` (596) and
`transformsToString` (55) all still emit, but `directStyle` calls them. They are
one shared generator, not two engines. The unused `getCSSStylesAtomic` wrapper
owns zero generated spans and is already tree-shaken.

Real duplication that does still ship, total 436 gzip: object/fallback composite
normalization (`styleToCSS` + `fixStyles` + `normalizeShadow`, 365) which
parallels directStyle's shadow/border emission for a different input
representation, and the `getSplitStyles` inline web-animation atomic mirror (70)
which reproduces direct identity for the inline-animation driver case. Removing
either means unifying the object/fallback and direct-string input paths. That is
a real refactor, not the deletion of a dead legacy engine.

**Consequences for engine size work:**

- Mechanics-only golfing inside condition routing, atomic merge or value routing
  targets code that is ALREADY leaner than V2's. Do not spend there.
- A pass over `directStyle` removing genuinely dead mechanics has already been
  done and yielded 115 gzip (2.08% of the gap) across five changes, every one of
  which also removed an allocation. Assume that seam is close to exhausted.
- `getSplitStyles` has no defensible deletion and is 112 gzip smaller than its V2
  counterpart. It is the file people assume is bloated. It is not.
- The genuine growth is elsewhere and has no V2 counterpart at all: the clause
  grammar (style-grammar runtime 1,936, plus directStyle's parser 378, plus
  propMapper's conditional-variant parser 212) and the inline variables system
  (`variables.mjs` 2,347). `directStyle` is only 5,520 of the 11,467 whole-chunk
  gap.
- A byte win that adds a per-render allocation, an extra pass, or a second
  scanner is a regression, not a win. The clause parser is already a single-pass
  charCode loop and is not a target.
- If you measure differently from the method above, your numbers cannot be
  compared to anything in this record and the exercise is wasted.
## 16. Core golf: hot-path allocation, and what the byte seams are actually worth (2026-08-17, later still)

A code-golf pass over all of core, on `v3-golf` off `v3-beta`. Batch 1 is the
allocation work plus two small byte wins. The headline is uncomfortable and is
stated plainly: **batch 1 costs +93 gzip and buys a measured 29.7% reduction in
runtime allocation per component render.** That is a deliberate trade, not a
miss.

### The compiled path already allocates nothing; every allocation number is the runtime path

READ, Chrome HeapProfiler sampling at 1024B with
`includeObjectsCollectedBy{Major,Minor}GC` so garbage counts and not just
retained: on the COMPILED path (`extract=1`, animated, 400 renders)
`@tamagui/web` allocates **54 bytes per iteration, total**. Anyone reasoning
about engine allocation needs this first, because it means the compiler already
takes it to zero when it can flatten, and every optimization below applies only
to apps and code paths the compiler did not lower.

### The engine rebuilt atomic CSS it had already inserted

`insertStyleRules` inserts the FIRST rule set it sees for an identifier and
discards every later one. The direct path nonetheless rebuilt every atomic rule
string on every render of every component, so in steady state that work was
~100% waste, and it was the single biggest allocator in the engine.

Fixed by reusing the whole atomic identity keyed on the identifier. Measured,
heavy scenario, 840 component renders per iteration:

| arm | bytes/iteration | per component render |
| --- | ---: | ---: |
| before | 9,521,824 / 9,476,918 | 11,309 |
| rules cache | ~7,511,000 (4 runs) | 8,942 |
| identity cache | 6,672,976 / 6,693,365 | 7,956 |

**−29.7% overall; `getCSSStylesAtomic` alone −78%** (3,386,321 → 734,605). The
simple scenario moves −28.4%. Render time, quoted only inside matched windows
because the machine had other tenants: mount median 9.05 → 6.40 → 5.05 ms,
update 7.15 → 5.05 → 4.00 ms. A DUPLICATED-ARM control (the identical dist run
under two labels in one interleave) put the noise floor at ≤0.2 ms mount and
≤0.1 ms update, so the gains sit well outside it.

Byte cost, assembled and measured against the pristine baseline:
`getCSSStylesAtomic` +110, `getSplitStyles` +14, whole bundle +93.

The cache is bounded at 10,000 with the same clear-on-limit pattern as
`simple-hash`, and it clears when the config identity changes, because media
queries and shorthands come from config and an identifier built under one config
says nothing about rules under another.

**The correctness premise was tested, not asserted.** `identifier -> rules` is
only safe if two different rule sets can never share an identifier.
`core-test/atomicIdentifierRuleIdentity.web.test.tsx` covers 13 clause shapes and
five properties, and each cache key got its own NEGATIVE CONTROL: keying on
`shortProp` instead of the full identifier fails 2 of 5, keying the inner map on
`identityKey` instead of the identity fails 2 of 5, both with the exact symptom a
wrong cache produces in the product ("clause hover: is missing selector :hover",
"reused the identifier already emitted for clause"). A cache here fails silently
by serving another clause's CSS, so do not weaken those tests.

### Seams that are exhausted, recorded so nobody re-audits them

- **`createComponent` is at parity with V2: +157** (3,971 vs 3,814). It is the
  largest single declaration in the whole bundle (3,578 gzip in one function) and
  had never been size-audited, which makes it a standing temptation. It is not
  bloated.
- **`use-element-layout` (1,359) is neither growth nor dead code.** It is within
  60 of V2, and `core/src/runtime.tsx` runs `setupHooks` at module scope with a
  `usePropsTransform` that calls `useElementLayout` for every DOM element, so it
  is live per-element code. A first reading suggested it was retained only by a
  barrel re-export; that was wrong.
- **`propMapper`'s conditional-variant parser (216) and `tokenCategoryByProperty`
  (280) are done.** The parser is already the required single forward charCode
  pass, and the table compresses 1,347 min bytes to ~280, so shortening its
  encoding is near-worthless; only removing entries would pay.
- **The 436-gzip object-vs-string duplication is not the cheap win it looks
  like.** Measured per declaration, the object side is ~348 (`styleToCSS` 205,
  `normalizeShadow` 51, `fixStyles` 49, border table 43) and the directStyle side
  ~215, and unification can only delete ONE of them, so the ceiling is ~215-348
  rather than 436. They are not one algorithm written twice: `directStyle` emits
  incrementally as each shadow part streams in, `styleToCSS` is a batch pass over
  a complete object. Collapsing them needs an end-of-properties pass, which is
  exactly the extra-pass shape this campaign counts as a regression, and it
  changes `boxShadow` emission order and therefore atomic rule identity. The one
  genuinely free piece is the border-defaults table, which exists identically in
  both `directStyle` and `expandStyles` on web, worth ~30-43.

### The next measured lever: DECLINED, with the reason

`directAtomic` is now the biggest single Tamagui allocator: **1,266,794 bytes per
iteration, 19% of everything the heavy scenario allocates**, almost entirely the
per-contribution signature string plus the `DirectAtomic` record. Hoisting the
identity cache up into `directAtomic` so the signature string is built only on a
miss would recover roughly 0.6 MB/iteration (INFERRED from ~6,700 calls times
~90-byte strings, NOT measured). It costs a three-level Map in `directStyle` and
would thrash on genuinely dynamic values such as an animated width. **Declined
by the campaign (p25843, 2026-08-17): a three-level Map that thrashes on animated
values is the exact regression shape the brief warns about.** Do not re-propose it
without first showing the thrash does not happen for dynamic values; the measured
0.6 MB is the ceiling, not the expected win.

Also flagged and not taken: `simple-hash`'s `${hashMin}:${strIn}` cache key is
0.66 ms/iteration of self time and one string allocation per call.

### Measurement notes that cost time to learn

- **The harness is deterministic to the byte across worktrees.** Control: the
  baseline commit rebuilt in a separate throwaway worktree with its own
  `bun install` reproduced **104,768 exactly**. So a whole-bundle total delta is
  trustworthy; per-module `marginalGzip` still drifts ±11 on untouched modules
  because gzip shares a dictionary across the chunk.
- **Validate an assembled batch in a DETACHED worktree at the batch tip.** The
  shared golf worktree carries other lanes' in-flight edits, and measuring there
  silently mixes them into your delta.
- **`profile-getsplitstyles.ts` was profiling everything.** It sent `?skip=` to
  select a scenario; `shared/bench.ts` reads `?scenario=` and has never read
  `skip`, so since that rename every run profiled ALL FIVE scenarios and labelled
  the result with one scenario's name. Fixed. Any pre-existing number from that
  tool is suspect, including its "theme-prep-uses = 70% of render" row, which is
  an artifact of where its interval marker sits.
- `attribute-bundle-gzip.ts` now takes `--within=<module>` and buckets the same
  marginal-gzip method per top-level declaration, which is how the dead seams
  above were identified.

### Inline theme values: splitting alone does nothing, and no env flag fixes Metro

The owner's question was whether `variables.mjs` (2,347 gzip) can be made
dead-code-eliminable, so an app that never writes an inline theme value ships
none of it. That would be worth more than any internal golf of the file, and the
internal golf bears that out: a full allocation-and-bytes pass over it returned
**−16 gzip on `variables.mjs` and −19 on `createVariables.mjs`, 35 total.**

Measured first, with a dedicated fixture whose only theme use is
`<Theme name="dark">` and zero inline values (74,823 gzip total): **the entire
module is retained, 2,293 marginal / 6,722 min bytes**, plus `useThemeState`
1,616 and `Theme` 791. `Theme.tsx` calls `getInlineValuesFromProps` on every
enabled render, so the static edge is real and rollup cannot shake it.

Three mechanisms were then built and measured:

| mechanism | result |
| --- | --- |
| leaf/heavy split alone | 74,823 → 74,815. **No useful effect**, both modules retained (heavy 1,941, leaf 328) |
| split + compile-time opt-out, Vite/Rollup | 74,823 → **71,077, −3,746**, heavy module ABSENT |
| split + opt-out, Next/webpack | 144,213 → **139,677, −4,536**, heavy reduced to a 37-byte stub |
| same literal-folded flag, Metro 0.83.7 | 2,245,105 → 2,245,001, **−104 only**; module retained with all three inline markers in both builds |

This reproduces section 15's finding on new ground: **guards do not create module
absence, and splitting is necessary groundwork with no useful effect by itself.**
Metro fixes its dependency graph before minification, so no env flag removes it
there; webpack's best case still ships a stub.

**DECIDED by the owner, 2026-08-17: not scheduled. No compiler DCE, no env
flag.** Neither mechanism ships and neither should be re-proposed.

A generic public env guard is out because it pays off on two bundlers of three
and leaves the API carrying a flag that does not do what its name implies on
native. The compiler/resolver route is ALSO out, and that was the recommendation
this campaign originally carried: reliably proving NON-USE of something tied to
`<Theme>` is not sound, because a spread (`<Theme {...props}>`) defeats static
detection, so the compiler would fail open too often for the win to be bankable.

**Logged as a potential future optimization, owner-initiated only:** the one
shape that works is to not tie inline values to `<Theme>` at all, but to a
separate component (working name `ThemeUpdate`) that tree-shakes away when
nobody imports it, since absence of an import IS the proof and nothing has to be
proven un-used. Prize is the ~3,700-4,500 gzip measured above. It revisits the
settled `<Theme>` inline-props API, so do not start it off the back of this
entry.

Full measurements, the per-bundler fixture layout, and the exact opt-out wiring
are recorded in `code/comparisons/V3_INLINE_VALUES_DCE.md`, so if the
`ThemeUpdate` idea is ever picked up nobody rebuilds them.

**Do not collapse the three reference resolvers.** They look like one function
written three times and they are not: the CSS path resolves theme keys to live
CSS `var()`s, merged inline values resolve sibling then parent theme then tokens,
and config variables resolve config siblings before theme then tokens. Only the
theme/token suffix is shared, and factoring just that suffix was trialled and
INCREASED output, so it was reverted.

## 17. Zero-runtime Phase 3: the compiler contract, erasure, and both gates (2026-08-17)

Continues section 15. Block 2 Phase 3 is implemented and proven on Vite,
Next/webpack and Metro web. The full record with per-rule receipts is the
"Phase 3 record" section of `plans/v3-zero-runtime-mode.md`; this is what a
future reader needs that is not obvious from the code.

### Rule classification belongs to the site, not to a string match

`BailoutReason` now carries an optional `zeroRule` and `zeroMessage`, and a
default rule per bailout code fills in the rest. That matters because
`local/unsupported-target` covers roughly thirty distinct reasons in
`compilerHost.ts`, from "does not accept className" to "animateOnly". Matching
its message text to pick a rule would have been a second source of truth that
drifts the moment someone rewords a diagnostic. Four sites set an explicit rule
today (theme boundary, three animation paths); everything else takes its code's
default.

`blocking` is the other half. `plan.diagnostics` mixes diagnostics that stopped
a candidate from lowering with ones recorded next to a SUCCESSFUL lowering (a
text style prop dropped from a non-text component, for instance). Only the first
kind is a zero violation: the second leaves no runtime behind. Reporting the
whole list would have failed builds that are correct.

### Erasure runs only on a module with no violations, and that ordering is load bearing

`transformZeroModule` collects the plan's violations first and skips erasure
entirely when there are any. Without that, one bad element reports twice: once
with its real rule, and once as a generic surviving-reference error from
erasure. It also means erasure's own licence is never in doubt, which is the
whole reason it is allowed to delete references at all.

### Three shapes of "a check that cannot fail" showed up in one phase

Worth carrying because each looked fine while being written:

- **Reading a field only one config shape populates.** `animationDrivers` is set
  only for a multi-driver config, so a config-level driver check that iterated it
  passed on every ordinary single-driver config. Nothing failed; the check was
  simply never asked a question.
- **An empty graph query reading as a pass.** The erased-export gate ran in
  `generateBundle`, which never runs when the bundler already failed. It got an
  empty importer map and passed on exactly the build it exists to catch. It now
  runs in `buildEnd`, and it refuses to pass when the module it is asked about is
  not in the graph it was handed.
- **A late hook masking the real error.** Vite runs `closeBundle` even on a
  failed build, so the zero tier's no-HTML-entry check was replacing genuine
  build errors with a wrong one. Anything asserted in `closeBundle` needs the
  `buildEnd(error)` flag first.

### `report` mode is a preview, not an ordinary build

It runs the same mode-aware compiler host, so a site zero mode rejects does not
lower in a report build either. The output is a working full-runtime build, not
a byte-identical copy of an ordinary compiled build. Gating the host on
`enforce` was tried first and made report emit a shorter list than the mode it
previews, which is worse than useless.

Config-level rejections stay enforce-only: a non-CSS driver, `mutates-themes`,
and a native target are hard errors, and `report` does not list them.

### The animated-number leaf exists now, but Phase 5 still owns the rest

`@tamagui/animations-css/animated-number` is a real module with a package export
subpath, and `createAnimations` consumes it, so there is one implementation of
the rAF/spring engine rather than two. Phase 3 needed it because its acceptance
is that the fixture resolves to the leaf with no public barrel in the graph.
Phase 5 still owes the `createComponent`/`createTamagui` guards and the
three-artifact gzip measurement.

The leaf's path must keep the string `animated-number` in it: the zero graph
gate's allowlist is a regex on the module id, and renaming the file to
`animatedNumber.tsx` would make every zero build containing it fail.

### The fixture grew a rules tier

`code/tests/zero-runtime/src/rules/` holds one module per rule plus the authored
fix beside it, and `TAMAGUI_ZERO_RULE` picks which one builds. Its HTML document
is generated into `.tamagui/rules/` by the fixture's own vite config, because
the zero tier injects its stylesheet link into an HTML entry and a module-only
entry fails by design. A new rule fixture is two files and one row in
`RULE_CONTROLS` in `scripts/zero-receipts.mjs`.

### Standing trade: runtime performance beats small bundle size

Owner, 2026-08-17, ratifying the first core golf batch and generalizing it:
"i would definitely take significant performance wins for small bundle size
improvement 10/10 times."

Treat this as the default. A measured hot-path or allocation win justifies a
small gzip regression, and you do not need to ask before taking it.

What it does NOT change:

- **The measurement bar is unchanged.** Before/after receipts are still required,
  measured the same way on both sides. "This should be faster" is not a
  performance win, and a regression you did not measure is not a small one. The
  trade is only available to a change whose both halves are quantified.
- **It does not authorize behavior changes.** The suites remain the gate. If a
  perf win requires changing an assertion, that is a behavior change and it stops
  being a free trade.
- **It is not symmetric, and this is the part people get backwards.** Taking
  bytes to gain runtime speed is now the default. Taking runtime cost to save
  bytes is still a REGRESSION, not a win: a "smaller" refactor that adds a
  per-render allocation, an extra pass, or a second scanner is rejected on those
  grounds regardless of what it does to gzip. Both halves of that rule point the
  same way, toward runtime performance; they are not in tension.
- "Small" is doing real work in that sentence. A large regression for a marginal
  win is not what was ratified, and the honest thing when the ratio looks bad is
  to report both numbers and ask.

Context that makes the trade sensible here: the engine audit found that
`directStyle`'s five mechanical wins removed allocations AND bytes together, so
the two goals mostly do not conflict. This directive governs the minority of
cases where they do.

## 19. Zero-runtime Phase 4: the providerless root and compiled static Theme (2026-08-17)

Continues section 17. Block 2 Phase 4 is implemented and proven on Vite,
Next/webpack and Metro web. The per-receipt record is the "Phase 4 record"
section of `plans/v3-zero-runtime-mode.md`; this is what a future reader needs
that the code does not say.

### An island provider stamps the document, and that is a page-wide fact

`ThemeProvider` adds `t_<defaultTheme>` to `document.documentElement` or
`document.body`, per the `addThemeClassName` setting. That is correct for an app
root and wrong for anything mounted inside a page it does not own. The
zero-runtime island entry is exactly that, so one dark island re-themed an entire
zero page from an async chunk, and did it silently: the compiled `<Theme
name="light">` span was correct, and `:root.t_dark .tvar_x` matched from above it
anyway.

`ThemeProviderProps.isSubtreeRoot` is the fix and the generated island entry sets
it. Anyone mounting a second `TamaguiProvider` inside an existing Tamagui page
wants the same flag; without it the inner provider silently re-themes the outer
one's modals, portals, and anything reading a variable from `html`.

The general lesson is worth more than the fix: an assertion about a subtree can
pass while a document-level write makes it meaningless. The Phase 1 island
receipts were all green with this bug because that fixture had no theme of its
own to lose.

### Three things had to become one implementation, not two

The compiled `<Theme>` span has to be indistinguishable from the runtime's or the
same authored tree renders differently in the two modes. That meant sharing:

- `reservedThemeProps` (now `@tamagui/helpers`, re-exported by `@tamagui/web`),
- `resolveThemeName` (extracted from `getNewThemeName`'s pure body),
- `getThemeClassNames` (extracted from `Theme.tsx`).

Writing the parity down is what found two real defects in Phase 1's lowering: the
compiled span had no `display: contents`, so it was a layout box the runtime span
is not, and no `color`, so `currentColor` differed. Neither had a failing test,
because nothing had asked what the compiled span was supposed to be.

### A warn-and-drop runtime cannot be a build-time check

`getInlineValuesFromProps` warns and drops a clause it cannot use, which is right
for a render. A compiler that calls it and takes the result inherits the drop, so
`<Theme background="#112233 hover:#445566">` would have compiled green with the
modifier gone. The design says an element modifier is a hard error; the code
would have said otherwise.

It now takes an optional issue sink. The runtime passes none and keeps warning;
the compiler passes one and turns each issue into rule 3. The clause loop, the
diagnosis text, and the modifier classification stay in one place; only the
disposition differs. A caller that passes a sink also bypasses the layer memo,
because a cache hit reports nothing.

This is the fourth shape of "a check that cannot fail" this campaign has found,
and the first one where the check was borrowed rather than written.

### Rule 8 exists because a remediation is part of a diagnostic

`zero/side-effect-import` and `zero/static-island-import` carried rule 6 for one
reason: the failure format needs a number and rule 6 was the closest. Its
remediation, "move the owning module to an island", fixes neither, and sending a
developer to do island work that cannot help is worse than a generic message.
Rule 8 covers module-level imports that defeat the zero graph and carries a
remediation per code.

### Next generated its owned CSS artifact too late

The compiled-global tier generated its artifact in the client compilation only,
while Next resolves the app module that imports it in both compilations at once.
A build whose artifact did not exist yet could fail with `Module not found`
instead of writing it. It surfaced as an intermittent failure of the
stale-artifact receipt, which runs directly after the control that deletes the
file.

Generation is now once per build process, awaited by every compilation before it
resolves modules. The per-compilation alternative is worse than it looks: a later
compilation would recreate a file the build had deliberately invalidated, which
would leave the missing and stale controls unable to fail.

### Byte-versus-speed, since the directive landed mid-phase

Phase 4 did not have to make that trade. The theme bridge already carries
normalized layers computed at build time, so the island's provider replays them
without running `parseValue` in the client, and nothing in this phase moved work
from build time to runtime to save bytes. The one added per-element cost is the
compiled span's `style` attribute, which buys runtime parity rather than speed.
Zero fixture at the end of the phase: 58,862 bytes gzip of JavaScript over a
React baseline, 17,803 bytes gzip of CSS, 16 emitted modules, no Tamagui module.

## 20. Zero-runtime Phase 5: the guards and the animated-number leaf (2026-08-18)

Continues section 19. Block 2 Phase 5 is implemented. The per-receipt record is
the "Phase 5 record" section of `plans/v3-zero-runtime-mode.md`; this is what a
future reader needs that the code does not say.

### The honest AnimatedNumber number, since the design asked for it by name

An app that imports the animated-number hooks in zero mode pays **1,090 gzip**,
measured as the whole-chunk difference between two builds of one module that
differ only by those hooks. Per-module attribution puts the leaf at 944 in that
bundle and 860 in the foundation's bench.

The recorded pre-split figure for `createAnimations` was 2,344. Post-split, in
the same bench with the same command, the two modules together attribute 2,342,
of which 860 is the leaf and 1,482 is the component animation machinery. **So
about a third of the driver survives an AnimatedNumber import, and claiming the
whole 2,344 drops would have been false.** The design predicted this and refused
the claim in advance; the measurement agrees with the refusal.

Two things about the method matter more than the numbers:

- **A full-runtime build of a module that never imports its config ships no
  driver.** `useAnimationDriver` resolves off parsed config at runtime, so the
  only static path to `createAnimations` runs through the config. The first
  full-driver artifact built here came out the same size as the zero build with
  zero animation modules in it, which reads like an enormous saving and is
  actually an empty control. The fixture had to gain
  `import '../../tamagui.config'` before it measured anything.
- **Whole-chunk deltas and attributed marginals answer different questions.** The
  full artifact is 78,476 against the zero pair's 57,659 and 58,749, but most of
  that gap is config parsing and CSS generation, not animation. Only the
  attribution decomposes it. Quoting the chunk delta as the animation saving
  would inflate it by an order of magnitude.

### The guards' receipt is behavioral, and both halves run

`createComponent` and `createTamagui` open with the literal
`process.env.TAMAGUI_RUNTIME === 'zero'` comparison and throw. Section 4's
position is unchanged and was not re-derived: erasure creates module absence,
guards do not, and Metro gets no byte-removal claim.

That leaves the question of what a guard receipt can even assert without being
vacuous. The answer used here is a test that calls each function twice, once
under each literal, so the passing case proves the failing case was caused by the
guard rather than by anything else in a large function. Disarming both guards
fails both tests. The island builds are the same fact from the other side: an
island entry is a client bundle full of `createComponent` calls running under
`'full'`, and it renders.

### Absence is cheap to assert and easy to make meaningless

Three of this phase's builds assert an empty or one-element Tamagui module list.
None of them means anything without the containment half, so the receipts build a
fourth artifact, unminified, and fail if it does **not** contain
`createAnimations` and `createTamagui`.

That control also could not prove what it was first asked to. It does not contain
`createComponent`, because the compiler lowered the module's only Tamagui
component and the renderer has no importer even with the full runtime. The check
was wrong, not the build. Component-renderer containment lives on the Phase 1
negative control and the Phase 4 compiled-global probe, and asking a fixture for a
fact it cannot have is how a control ends up quietly relaxed instead of moved.

### Presence is observable synchronously, and that is the whole assertion

The island's exit animation is the one animation behavior the zero work could
plausibly disturb, and "the sheet closes" is not a test of it. A discrete click
flushes React before `page.evaluate` returns, so the DOM at that instant is what
the runtime decided for the closed state: with presence the exiting subtree is
still visible with a real box, then travels, then goes `visibility: hidden`.

Two candidate controls did not discriminate and are recorded so nobody retries
them. Removing `transition="quick"` from the Sheet changes nothing, because the
Sheet animates regardless. Waiting for the frame to leave the DOM never fires: it
stays mounted and hidden. The control that works is rendering the sheet as
`{open && <Sheet/>}`, which tears the subtree down on the same commit.

### The rules tier gained two fixtures and the fixture map gained a full lane

`src/rules/animated-number.absent.tsx` and `src/rules/animated-number.full.tsx`
exist only for the measurement; keep them byte-identical to `animated-number.tsx`
apart from the one line each is supposed to differ by, or the delta stops meaning
what the record says it means. `TAMAGUI_ZERO_FIXTURE=rules-full` is a new fixture
key that builds a rule module as ordinary compiled Tamagui.

`src/rules/transition.tsx` is not a measurement fixture: it is the static
transition behavior receipt, and it uses the config preset `medium` rather than a
literal duration string on purpose, so the browser reporting `0.3s` proves the
compiler resolved the preset against the config.

## 21. Zero-runtime Phase 6: the demoted DOM surfaces and a plan-cache fix (2026-08-18)

Block 2's DOM demotion, plus the cache-correctness bug Phase 5 found and could
not validate inside its own phase. Both landed on `v3-beta`.

- `9ecd0a80ab` fix(metro-plugin): hash and seed only authored project sources
- `269c8aad10` feat(core): deprecate the standalone DOM entries and export the
  recommended html from tamagui
- `1233f7b194` test(dom): cover every DOM import path, the deprecation hint, and
  a regular web client's module graph

### `@deprecated` only works on a declaration

Worth knowing before anyone tries to deprecate a module entry point again. A tag
on a module's top JSDoc does nothing. A tag on a re-export alias
(`/** @deprecated */ export { x } from './y'`) does nothing. Only a tag on the
declaration itself produces the hint, and it then flows through `export *` to
every alias. Probed with the TypeScript API before writing any of it.

The consequence is that you cannot deprecate an entry point for outside importers
without deprecating it for your own. That is why `@tamagui/dom` has no tag: its
exports are the generated tables, nine files in this repo import them, and one of
those is `dom/html.tsx`, the implementation of the API the deprecation is meant
to point people toward.

Also, the hint is a language-service suggestion, not a compiler diagnostic.
`ts.Program` has no public `getSuggestionDiagnostics`; use
`ts.createLanguageService(...).getSuggestionDiagnostics(file)`, which is what an
editor calls and what the test asserts, alongside zero semantic diagnostics.

### `import { html } from 'tamagui'` was broken, and a control caught it

`tamagui`'s root re-exports an explicit allowlist from `@tamagui/core` (the file
says why: overlap with `ViewProps` and friends). `html` was missing from it, so
the frontend the plan recommends everywhere did not exist under the name it
recommends, while `@tamagui/core` and `@tamagui/web` both had it. It surfaced
because the deprecation fixture asserts regular `html.*` carries *no* hint, so it
had to resolve it; a fixture that only checked the deprecated imports would have
been green. Fixed by adding `html` to the allowlist.

### Absence checks need the thing to be reachable first

The `@tamagui/dom` graph receipt looked fine on the first attempt and proved
nothing. The fixture authored `<html.div {...spread}>`, the compiler lowered it
anyway, the build emitted 13 modules, and the runtime `html.*` module was not in
the graph at all. Of course the tables were absent. The check only became real
once a tag was selected at runtime (`wide ? html.section : html.article`), which
puts `core/web/dist/esm/dom/html.mjs` in the graph and makes the absence a claim
about that module's imports. The receipt now asserts that module's presence and
throws its own message if it is missing.

### The Metro plan cache was invalidated by other bundlers' output

Phase 5's flaked receipt was real and this is its cause. `walkProjectSources`
feeds the plan cache's options hash and excluded build output by exact directory
name, so `dist-metro`, `dist-full`, `public/` and `out/` all contributed their
emitted JS. Content-hashed filenames mean every unrelated web rebuild re-keyed
the cache, and every Metro build then rescanned the project.

The walk now honours the project's ignore configuration with git's semantics
(every `.gitignore` from the repo root down, patterns relative to their own
directory, via the `ignore` package). `node_modules` stays skipped structurally,
because it is the externality boundary the resolver already draws and it has to
hold in a project with no `.gitignore` at all.

Two things this changes for anyone working on that file:

- a project that does not declare its output directory in a `.gitignore` gets it
  walked, by design. The declaration is the contract.
- `ios/` and `android/` are no longer excluded by name. Expo prebuild ignores
  them wholesale and the bare React Native template ignores `ios/Pods` and the
  gradle build directories, so the declaration covers the real cases.

Receipts: a temp project's options hash went `f6fbb65e…` to `b1899cbc…` on
renaming one emitted file before the fix, and is stable after. Running
`metro-receipts` with a background writer re-emitting content-hashed files into
`dist-full/assets` reproduces Phase 5's exact failure on the old walk and passes
on the new one.

### Baselines at `1233f7b194`

core-test web 468 passed / 2 skipped / 1 todo; core-test native 293 passed / 7
expected fail / 9 skipped; static-tests native 79, web 165, webpack 20;
`domHtmlRuntime.native` 24/24; metro-plugin 6; `@tamagui/dom` package 36 plus its
type tests; zero-runtime Playwright 41/41; `bun run receipts` exit 0 across all
three integrations; root typecheck, lint, `check:deps`, `check:dom-types` and
`check:exports:web` clean.

## 22. Zero-runtime Phase 7: theme-variable collapsing, hydration, and the starter (2026-08-18)

Block 2's last phase, and with it the block is implemented. The per-receipt
record is the "Phase 7 record" section of `plans/v3-zero-runtime-mode.md`; this
is what a future reader needs that the code does not say.

- `ed9f40f366` fix(core): collapse equivalent theme color spellings onto one
  CSS variable
- `79e79b1eea` site: regenerate theme css, 709 to 577 theme variables
- `83071aa3e0` test(zero-runtime): prove the SSR hydration premise
- `79753ce1b4` feat(starters): add the contract-compliant zero-runtime starter

### The collapse is free in every tier this mode is about, and 2,109 gzip in one

`359e29cc83` was right to drop `normalize-css-color` from the web style path,
and that win stands. What it also removed was the collapsing of equivalent color
spellings onto one variable, which cost `code/tamagui.dev/tamagui.generated.css`
132 duplicate variables and 662 gzip.

The restored collapse keys the variable map on the parsed color rather than on
the spelling, and only the KEY is canonical: the emitted declaration keeps the
first spelling registered. So the artifact came out at 34,376 gzip, 405 BELOW
where it sat before the regression, rather than merely returning to it.

The byte question people will ask is where the parser now ships. Measured, same
fixture entry on both sides: a build that owns an `outputCSS` artifact is
byte-identical, content hash included, because the whole CSS generator folds
away behind `TAMAGUI_DID_OUTPUT_CSS`; a build that generates theme CSS in the
browser gains 2,109 gzip. Zero-runtime mode and every compiled-global-CSS app
are in the first group. There is no way to split the difference without giving a
server and a client different variable identity, so do not go looking for one.

### Keying a color map on the parsed integer is a bug with a real collision

`rgba(0, 0, 0, 0.039)` parses to the 32-bit integer 10, and a `space` token
whose value is the number 10 lands on the same map key, so the theme value
silently resolves to `var(--c-space-4)`. The key is written as `#rrggbbaa`,
which is itself a color spelling and therefore unreachable as a raw non-color
value. `themeVariableCollapsing.web.test.tsx` fails on the integer key and
passes on the hex key, so that assertion is a control and not decoration.

### The collapse costs exact spelling on one hydration path, and colors are the guarantee

The premise the foundation flagged is now measured rather than inferred. Same
config on both sides, which is what every app in this repo does, hydrates clean:
no recoverable errors, probe markup identical, zero spelling and zero color
differences, with four spellings of one color in the config.

On the names-only client theme projection, where the client rebuilds theme
values out of the document CSS, the collapse changes the answer. Before it, the
round-trip returned every spelling exactly. After it, four of five keys come
back spelled differently and every one is the same color, because several keys
now share one variable and `white` lands on a color token spelled `#ffffff`.
That information is genuinely not in the CSS any more.

The consequence is bounded: an app would have to hand-write that projection AND
render a raw theme value string into markup. Nothing in this repo produces the
projection. But if someone later builds a theme-pruning client config, this is
the thing that breaks, and the fix is not to canonicalize on the client, which
is the dependency the owner ruled out.

### One page cannot render with two configs, and that ate a control

A second `createTamagui` in the same page does not take over global theme state.
A "client config" built alongside a server config renders the SERVER config's
values, so every render assertion against it is vacuous: the first mismatch
control reported no hydration error while the two configs genuinely differed.
The control that works changes the server PAYLOAD instead, which is what a
divergence looks like from the client's side anyway. Anyone writing another
hydration fixture should start there rather than rediscovering it.

Also, jsdom cannot host any of this. It returns `""` from
`getComputedStyle(body).getPropertyValue('--x')` and reformats a rule's
`cssText`, and both are load bearing for the read-back path.

### `code/starters/zero-runtime` exists now, and it is the number to quote

The foundation's Phase 0 asked for a contract-compliant starter and nothing had
written one. It is one source tree built through Vite, Next webpack and Metro
web, with a narrowed two-theme config, a static CSS transition, static theme
switching, and one modal-sheet island. `bun run measure` builds all six
combinations and writes `receipts.json`; `bun run test` runs one Playwright spec
against all three servers.

All six qualified: 0 compiler violations, 0 forbidden modules, 0 Tamagui modules
in every graph. **2,714 gzip of CSS** for a real screen, against 17,243 on an
unnarrowed v6 config. Narrowing is the whole CSS story and the starter shows how.

Three things to carry forward about the numbers:

- Next's JavaScript figure (138,979) includes Next's own framework, main,
  webpack-runtime and polyfill chunks. Compare it to another Next app, never to
  Vite's 58,178. Blending the three would describe an app nobody built.
- Metro's island bundle is 381,006 gzip against 90,413 on Vite, 4.2x, and 772
  Metro modules. INFERRED from the Phase 1 finding that Metro does no
  export-level shaking. The fixture's island shows the same ratio, so it is
  pre-existing.
- Byte figures come from the emitted files at `gzip -9`. The plugins' own graph
  receipts report a different subset per integration, and a table whose columns
  came from three different sources is not a comparison.

### Two defects worth fixing, found by building a real app

- **A `transition` in a `styled()` definition emits nothing and reports
  nothing.** READ: `transition="medium"` on a plain `View` emits the rule; the
  same value in a `styled(View, {...})` definition, or passed to that styled
  component at its call site, emits no transition CSS and the build stays green
  with 0 violations. In zero mode nothing recovers it at runtime, so the
  transition silently does not happen. This is the warn-and-drop shape Phase 4
  ruled out, arrived at by omission rather than by choice.
- **Identical atomic rules are emitted per element, not per artifact.** Two
  elements carrying `transition="medium"` put the same `._t-1731853650{...}`
  rule into the artifact twice.

And one trap for whoever writes the next fixture or example: an app whose own
package is named `@tamagui/*` fails the zero graph gate, because
`isTamaguiModuleId` reads the nearest package.json name and every module in that
app then looks like Tamagui's. The starter is named `zero-runtime-starter` for
that reason, like `zero-runtime-fixture` before it.

### Baselines at `79753ce1b4`

core-test web 471 passed / 2 skipped / 1 todo; core-test native 293 passed / 7
expected fail / 9 skipped; static-tests native 79, web 165, webpack 20;
metro-plugin 6; zero-runtime Playwright 45/45; `bun run receipts` exit 0 across
all three integrations; starter `measure` exit 0 across all six builds and its
Playwright 12/12; root typecheck, lint, `check:deps`, `check:dom-types` and
`check:exports:web` clean.

## 23. Zero-runtime Phase 8: block 2 close-out (2026-08-18)

Block 2 is closed. The per-receipt record is the "Phase 8 record" section of
`plans/v3-zero-runtime-mode.md`; this is what a future reader needs that the
code does not say.

### Phase 7's first defect was mis-scoped in both directions

Worth carrying forward because the correction changed what got fixed, not just
how it was described.

Phase 7 reported that a `transition` written in a `styled()` definition **or**
passed to that styled component at its call site emits nothing. READ, ordinary
compiled Tamagui in a real browser: **the call site was never broken.** Only the
`styled()` definition drops it. The call site is therefore the regression guard
for the fix rather than a second symptom, and it is a better oracle than
anything written from first principles, because it is the identical value going
through the same compiler on the same element.

Phase 7 also left the scope question open, and the answer was the load-bearing
one: **ordinary compiled Tamagui does not recover it either.** So it was never a
zero-mode bug. The runtime is fine (uncompiled, all three shapes emit the
transition); the compiler drops the prop and then flattens the element to a
`div`, so there is no runtime left to recover it in any tier.

The generalisation: `compilerHost.ts` decided lowering from call-site props
while `completeProps` merged the styled definition's defaults 350 lines later.
Every prop in `runtimeAnimationProps` had that hole. In zero mode `animateOnly`
in a styled definition **built green**, which is a missed VIOLATION, not a
missed emit. The gate that exists to make contract breaches unshippable had a
hole in it.

### A probe of a prop that does not exist cannot fail informatively

The most reusable thing in this phase, and it cost a false finding sent onward
before it was caught.

Asked to check the blast radius on `enterStyle` and `exitStyle`, the sweep
probed them, found them dropped in every compiled build, and reported that
enter/exit animations do not run anywhere. They are V2 prop names. V3 does not
implement them (`enterStyle` appears nowhere in `code/core/web/src`) and
expresses the same thing as clause modifiers, `opacity="1 enter:0 exit:0"`,
which `directStyle.ts:354` resolves into `.t_unmounted` / `.t_exiting` CSS.
`tsc` rejects the old spelling. Re-probed with the real shape, both positions
and both tiers were already correct.

Green meant "not implemented". Red would also have meant "not implemented". The
result could not discriminate, and it looked exactly like a finding. This is the
control-that-cannot-fail trap one level up: validating the behavior of a thing
before validating that the thing exists. One grep before the first build would
have settled it.

Retract immediately and loudly when this happens. The false claim had already
been forwarded; reporting it within minutes is what limited the damage to one
message rather than a block 3 planning item and an owner-level architecture
decision about a feature that works.

### Deduping compiled CSS is only safe because the runtime already does it

Atomic rules were emitted once per element. The obvious fix, dropping later
duplicates, is NOT obviously safe: rules at equal specificity are ordered by
position, and a global first-wins dedupe can move a media rule ahead of a base
rule that a third element carries alongside it. Constructing that case takes two
elements and one shared clause.

What settles it is that the runtime has always done exactly this. READ:
`insertStyleRule.tsx`'s `shouldInsertStyleRules` skips an identifier already in
the sheet (`maxToInsert` defaults to 1) and appends the rest in first-use order.
So first-wins in the compiler makes the two paths agree; any ordering hazard is
pre-existing and shared. Anyone tempted to "fix" the ordering should change both
or neither.

It is worth **13 gzip bytes** on the starter (11,944 raw to 11,750, 2,745 gzip
to 2,732). Gzip compresses a repeated rule almost perfectly. The gain is CSSOM
size, not transfer. Do not quote it as a bundle win.

Cross-module duplicates are a KNOWN LIMIT, ruled on 2026-08-18, and the ruling
matters more than the limit. `ZeroCSSArtifact` holds each module's CSS as one
joined string that a user's `wrapExtractedCSS` may have wrapped in anything, so
deduping there means parsing strings back into rules, which can silently corrupt
output. The robust version changes the plan schema (`css: string` to
`cssRules: string[]`), invalidating Metro's plan cache and touching all three
integrations, for 2 rules and 57 raw bytes on the starter.

Do not open that schema for this alone. Pick it up only as a rider: if the plan
schema is ever revised for another reason, the rules are a list at that point
and cross-module dedupe falls out nearly free, since the artifact would hold
rule arrays and `css()` would compose them through the same `Set` that
`lowerModule` already uses.

### The zero graph gate matched a name; ownership is the rule that holds

An app named `@tamagui/*` failed the gate because `isTamaguiModuleId` read the
nearest package.json name. The fix is not a carve-out list: Tamagui reaches a
build as a resolved dependency, so its modules are owned by a **different**
package.json than the one being built. `checkZeroGraph` takes the project ROOT
and excludes the package that owns it.

Not the entries, and that is worth knowing before anyone "simplifies" it back:
webpack's entry for a Next app is `node_modules/next/dist/client/next.js`, which
belongs to `next`. An entry-derived project reads `next` as the project, so the
exclusion silently does nothing on Next while looking correct on Vite and Metro.
`ZeroRuntimeResolved` carries `root` for this.

Forbidden modules now also name their owning package, which the path often does
not show: `@tamagui/web` resolves to `code/core/web/dist/...` here.

### A receipt can be green because a build artifact from another day is lying around

Wiring the fixture into CI found that `dist-hydration` was never built by
`bun run receipts` at all. Phase 7 built it by hand, and the hydration
Playwright project passed every day since against that leftover directory. On a
fresh checkout there is no server to preview, and Playwright reports that as a
webServer failure, which reads as CI infrastructure flaking rather than as the
hydration premise going untested. So a premise this campaign recorded as closed
was resting on a stale artifact nobody would have questioned.

The standard this sets, and it applies to any receipt anyone claims is green:
**clear every ignored artifact and run the exact sequence cold before believing
it.** `git clean -nXd` lists what to remove (keep `node_modules`), then run the
package script the way CI runs it. Nothing else finds this class of failure,
because the passing run and the vacuous run are indistinguishable from the
outside.

### Erasure-reported rules cannot share a module with lowering-reported rules

Found while extending per-rule coverage to Next and Metro, and it constrains any
future rule fixture. Erasure runs only on a module with **no** violations
(section 17), so a module carrying a compiler-local violation never reaches it.
Putting rules 2, 5 and 7 in one module yields only rule 5, and 5 violations
looks like a working fixture, which is why this nearly shipped as a passing
control. The multi-file fixture is five modules for that reason.

### CI, and the two things it must not do

`v3-zero-runtime` runs the fixture and the starter on **separate runners**. Not
cosmetic: the Metro receipts key their plan cache on the project's own sources,
so another integration building in the same root re-keys it mid-run (section
21), and `motionDriverConversion` and `safeAreaVariables.native` measure real
time, so they must not share a runner with 45 minutes of bundling. If either
goes unreliable in CI, isolate it further. Do not raise a threshold.

### Not fixed, and not in this block's scope

The Vite island publish writes both `tamagui-islands/DetailsIsland.js` and
`tamagui-islands/tamagui-islands/DetailsIsland.js`. The page fetches the first
and never the second. Recorded in Phase 7, still true, harmless, and nobody has
looked at why. Carried forward as an open item on 2026-08-18 rather than chased
during close-out.

## 24. Block 3 wave A: the block-2 review's three follow-ups (2026-08-18)

Campaign manager handover: p25848 hit a Claude account spend limit and p26422
took over the same mandate. Block 2 stays closed; its assigned review returned
APPROVE WITH NOTES and the three notes are folded in here, self-validated, no
re-review.

### The report-mode receipt was vacuous on Next and Metro, and the code said so

Both `next-receipts.mjs` and `metro-receipts.mjs` read the enforce and report
violation lists from the SAME filename, relying on read-ordering: the enforce
file is read before the report build overwrites it. The existing comment even
documents the collision. What was missing is that nothing asserted the second
read came from the report build at all, so a report build that never reached
analysis leaves the enforce file in place and every assertion below passes
against the enforce build's own output. `sameViolations` is then trivially true.

Fixed by asserting `multiReportViolations.mode === 'report'` before the
comparison. Vite is genuinely unaffected: it reads
`vite-dist-multi.violations.json` and `vite-dist-multi-report.violations.json`,
two distinct files.

Considered and rejected: giving the report build its own `outDir` so the
collision cannot happen. `outDir` is derived (`path.join(root, ZERO_OUT_DIRNAME)`)
with no override, so this would mean adding an override to the public
experimental zero config purely for a test fixture's benefit. The assert gives
the check a real independent variable at a fraction of the cost.

### Bumping the plan version alone would have left the Metro cache reading stale plans as valid

`LOWERED_MODULE_PLAN_VERSION` moved 1 to 2 because the plan.css shape changed in
`1d855ece47` and the version did not follow. But `compilerCache.ts:351` guarded
with a hardcoded `entry.plan.version !== 1`, a second copy of the same number.
Bumping the constant on its own would have left that guard accepting version-1
plans forever, which is the exact failure the bump exists to prevent. The guard
now reads `LOWERED_MODULE_PLAN_VERSION`, so there is one owner.

`METRO_COMPILER_CACHE_VERSION` went 4 to 5 in the same commit. It namespaces the
cache directory (`v4/blobs`, `v4/manifest.json`), so a fresh directory means a
plan-version change lands on empty state instead of reporting every stale entry
through `cacheCorrupt`. That path degrades to a warning and a recompile rather
than a build failure, so this is about not printing corruption warnings at every
user who upgrades, not about correctness.

The bump propagates as designed: `ZERO_COMPILER_VERSION` is `zero-1/plan-2`,
which is what makes a compiler change invalidate zero caches too.

### `root` is now required on `checkZeroGraph`

All seven call sites already passed it (vite-plugin, metro-plugin zeroSerializer,
loader TamaguiPlugin, and four in `zeroGraph.web.test.ts`), so making it required
is mechanical. It removes the state section 22 describes, where an entry-derived
project silently reads `next` as the project on Next while looking correct on
Vite and Metro.

### Item 9 needed no work

The plan lists "wire `core-test/flatValueProgramsStreaming.web.test.tsx` into CI"
as open. It is already wired. `vitest list` collects all 7 of its tests under the
`*.web.test.ts*` glob that `core-test`'s `test:web` script expands, and CI runs
that script through `bun turbo run test:web --filter='!@tamagui/kitchen-sink'`.
The full suite is green at 62 files / 475 tests. Checked by listing collected
tests rather than grepping the run output, because vitest does not print passing
filenames and the grep would have read as absence either way.

### Validation

`bun run typecheck` passed. compiler-core, static and metro-plugin all rebuilt
clean. metro-plugin `test:web` 6/6, static-tests `test:web` 20/20, core-test
`test:web` 475 passed.

### Carried forward, not chased

`bun run build` regenerates `code/tamagui.dev/tamagui.generated.css` with ~180
changed lines. It predates this unit (`79e79b1eea`) and is not block-3 work.

### The stash stack is shared with the user's, and a freeze instruction nearly ate his work

Recorded because it cost real recovery work and the next manager will otherwise
reach for the same instruction.

A cross-campaign benchmark lane needed a clean tree for about an hour. The
campaign manager told its four workers to "stash your own files, by explicit
path". Three did. That instruction was wrong, and the reason is worth stating
exactly: **`refs/stash` is not per-worktree.** It lives in the shared git common
dir (`/Users/n8/tamagui/.git`), so every worktree on the machine shares one
stash stack, and this one already held 29 of the owner's own stashes going back
months on other branches.

Three agent holds went onto that stack. Then the pops happened concurrently and
by index. `stash@{0}` means whatever is on top RIGHT NOW, so as each pop
succeeded every other worker's idea of its own index went stale. One pop took
`18d859fec0`, `WIP on main: b86317e74c fix(compiler): retain css-only transition
extraction for flattened components`, which belonged to the owner, dropped it,
and the worker reported it as another lane's hold. Two of the three workers
reported pops that had not happened the way they described.

Recovery, for anyone who has to repeat it: a popped stash's commit object
survives unreferenced until gc, so nothing is lost if you move fast.
`git fsck --unreachable` lists them, stash commits are recognisable by a subject
of `WIP on <branch>:` or `On <branch>:`, and `git update-ref refs/recovered/<x>
<sha>` pins them out of gc's reach. Restoring one to the stack is
`git update-ref -m "<original subject>" refs/stash <sha>`, which is what
`git stash store` does under the hood and does not touch the working tree. The
entry comes back at `stash@{0}` rather than its original position; content is
byte-identical, verified by diffing against the working-tree copy before moving
anything.

Two of the owner's files were left staged in the index by the pops
(`plans/v2-toggle-accordion-autoheight-review.md` and
`plans/v3-overnight-achievements-2026-07-13.md`). They were unstaged and left on
disk rather than deleted: provenance for the second one could not be established
with certainty, and unstaging is reversible where deleting is not.

**The rule now, for every worker in this campaign: never use `git stash` in a
shared checkout.** Park work on a narrow WIP commit by explicit pathspec. Worth
knowing that the repo guardrail already refuses `git stash` for Claude sessions
but did not stop the Codex workers, so the protection is uneven across harnesses
and cannot be relied on to catch this.

The lane work itself was never at risk: item 3 was committed, items 2 and 6 were
in the tree, items 4 and 5 had authored nothing. That was confirmed against the
stash objects rather than from the workers' own reports, which is what surfaced
the two inaccurate ones.

### Item 3 landed: the bailout diagnostic now names the term that actually failed

`9503af1d71`. The compiler's derived predicate is renamed to `canFlatten`, and
the bailout picks its message from whichever of the three terms failed, in the
same order as the AND: `acceptsClassName === false`, then `neverFlatten`, then
`context`. The public `staticConfig.acceptsClassName` field is untouched and is
still what the predicate reads. Renaming that would be a breaking change to
public surface and was explicitly out of scope.

Verified against the regenerated metric rather than the worker's summary: zero
rows still claim `does not accept className`, and the former 206 Button rows now
read `Button is never flattened (behavior HOC)`.

**Two things about that metric that anyone quoting it needs to know.** The
regenerated fixture is not a like-for-like successor to the audited one, so the
before/after numbers cannot be subtracted:

- The corpus grew from 253 files to 265, and found elements from 2,595 to 2,645.
  Other campaign work added files the scanner picks up.
- `animation runtime` bailouts fell from 81 to 34, which has nothing to do with
  this change. That is `0d28fe6707` (reading a `styled()` definition's animation
  props when deciding lowering) finally showing up in a baseline that had been
  stale since before it landed. Total bailed fell 517 to 497 for the same
  reason, not because this diagnostic fixed anything.

The diagnostic change itself moves no element between lowered and bailed. It
only relabels. `component runtime contract` went 340 to 346, which is corpus
growth.

Also worth noting for the plan's own record: section 1.2 inferred Button fails
on both `neverFlatten` and `context`. It does, and the ordering reports
`neverFlatten` first, so `provides a styled context` does not appear in the
metric at all. That is correct behaviour, not a missing branch.

### Gate 4 verdict, for the record

Received from p25843 at `93950e9540`: the published 15x mount gap is gone. Mount
`medianPairedRatio` 1.464x with a spread wide enough that it is not publishable
as a precise figure, and rerender 0.826x in v3's favour. Item 10 closes when
p26092's republished artifacts and the staleness guard land. A precision re-run
is optional and owner-gated. Already relayed to the owner; recorded here only so
the campaign has it.

### Item 6 landed: production now gets the same message development does

`997c6c4914`. All ten of section 2.7's messages route through one new
`code/core/web/src/helpers/formatDiagnostic.ts`. Each keeps its stable machine
code and gains the component, the received value, and one recovery action.

The part worth understanding is what it did to the prod/dev split, because it is
the opposite of what "add more text" usually means. The old shape was a ternary:

    process.env.NODE_ENV !== 'production' ? <long explanation> : 'Err0'

That fork is **deleted**, not extended. One message now ships in both builds.
This is the plan's complaint fixed at the source: production was where the user
had the least context and got the least text, and a second branch would have
kept that asymmetry while adding weight to both sides.

**It costs bytes and that is the deliberate trade.** On the same 9-module
minified entry: 166,676 raw / 59,221 gzip before, 170,818 / 60,291 after, so
**+4,142 raw and +1,070 gzip**. Anyone reading a size regression on
`@tamagui/web` around this commit should stop here rather than hunting. The
dev-only diagnostics (portal host, native matchMedia, presence state) still
strip out of the production build, so the cost is only the messages that
genuinely ship.

Item 10 of the list, the debug warning that could dump an unbounded serialized
object, is bounded rather than relabelled: values cap at 160 characters, objects
stop at depth 2, arrays show 5 entries, keys show 6, and circular references
resolve to `[Circular]` instead of throwing.

The Sheet package has no test script, so its three snapPoint messages are
covered only by an ad-hoc run. That run shows one failure, a `Sheet.Root !== Sheet`
identity assertion. It is not from this change: the commit's entire sheet diff is
three `console.warn` string replacements plus an import, with no path to a
component identity or an export.

**Sequencing note for item 2.** This landed while the size-ceiling lane was still
generating its baselines. Any baseline measured before `997c6c4914` is stale by
1,070 gzip, and committing one would fail the gate it is meant to define. The
lane was told to regenerate at a tip containing it and to record the measured SHA
in the baseline file.

### Item 10 landed: the benchmark artifact is honest about what it is

`2ab3e6bc4b`, exactly three files: the runner, `benchmarks.json`,
`benchmarks.html`. The lane ran through p25843 and returned on completion.

The artifact is stamped with the SHA it measured (`93950e9540`), the date, the
machine, browser and Bun versions, `randomSeed: 72002`, the shuffle policy
("framework/scenario tasks reshuffled independently in every warmup and sample
round"), `dirty: false`, and a byte-identical workload hash. It also carries a
`publicationQualification` string saying in plain words that absolute
millisecond timings are not publishable, because the start gate excluded
measurement-apparatus and agent-harness CPU, and that only same-round paired
ratio medians support directional reading. The idle-probe exception and who
authorized it are recorded in the artifact itself rather than in someone's
memory.

**The staleness guard is a real check, verified by running the control rather
than by reading the code.** `bun run-benchmarks.ts --check-current` against the
committed artifact at a moved tip prints
`is HISTORICAL: it benchmarks 93950e9540..., while current tip is 2ab3e6bc4b...`
and exits 0, which is the correct outcome for a correctly-labelled historical
file. Removing `metadata.currency` and re-running exits **1**. So the guard has
an independent variable and can fail. The artifact was then restored from git's
own blob and confirmed byte-identical to the committed version. A guard that
only ever passes would have looked exactly the same from the outside.

There is a second failure branch: an artifact declaring historical data while
`benchmarks.html` lacks `data-benchmark-currency="historical"` throws. The two
files cannot drift apart silently.

Wave A is now complete except items 2, 4 and 5.

### Item 5 landed: the scanner divergences are now pinned, and two of them are defects

`705610ace6`, plus item 6's follow-up `e8cdd8adae` which added the generated
formatter declarations the first commit omitted.

`code/core/core-test/parserAgreement.web.test.tsx` runs the canonical
`valueParser` against the three runtime scanners over a corpus extracted into
`code/core/style-grammar/src/__tests__/valueCorpus.ts`, which the existing fuzz
test now reuses rather than carrying its own copy. Five divergences are pinned as
behaviour tests with the source lines that cause them. None of them assert on
source text.

**Two are real product defects, recorded here so wave B does not rediscover
them:**

- **D4, user-visible.** `hasFlatModifier` has no invalid-character branch, so a
  value the style scanner throws away still puts the component on the
  should-enter path. `'0; enter:1'` fails the canonical parse and yields no
  style, and the component still renders an enter frame for a style that never
  arrives. This is a rendering bug, not just a parser inconsistency.
- **D3.** The canonical parser treats a top-level backslash as an escape
  (`valueParser.ts:230`); neither runtime scanner has that branch. Both read the
  escaped colon as a clause separator and fail to resolve the result.
  `directStyle` drops the whole declaration including the base it had already
  scanned, and throws outright in a development build; `propMapper` drops only
  the clause.
- D5 is the same shape, less severe: both scanners refuse an unregistered
  modifier, but the prop path loses the base it had already scanned while the
  variant path keeps it.

**Deliberately not fixed in wave A.** The plan's sequencing in section 1.1 is
agreement tests first, then converge the three scanners onto one shared scanner,
which is item 12 in wave B. That convergence is the fix for D3, D4 and D5
together. Patching one scanner now would fix a symptom, add a fourth behaviour
to reconcile, and make the convergence harder. The tests are what make it safe
to attempt at all.

D4 should be named explicitly in the wave B brief, since a wrong enter frame is
the kind of thing a user reports as an animation bug with no idea it started in
a value parser.

## 25. Wave A complete, and a CSS injection defect found on the way (2026-08-18)

All eleven items closed at `d7c620bd5b`. Item 9 needed no work: the streaming
test was already collected by the glob CI runs and already green.

| item | commit | what landed |
| --- | --- | --- |
| 2 | `bf0bb4b082` | committed size baselines, CI gate, one-directional ceiling |
| 3 | `9503af1d71` | bailout reports the real reason; zero rows still claim className |
| 4 | `d7c620bd5b` | differential first slice over `getComputedStyle` longhands |
| 5 | `705610ace6` | parser agreement; five divergences pinned, three are defects |
| 6 | `997c6c4914`, `e8cdd8adae` | one diagnostic formatter; prod/dev fork deleted |
| 10 | `2ab3e6bc4b` | historical benchmark artifact plus a staleness guard |

Receipts taken at the tip by the manager rather than relayed: root typecheck
exit 0, core-test web 63 files / 483 passed, core-test native 29 files / 293
passed with 7 expected fail.

### The injection defect, D2

`code/core/web/src/helpers/directStyle.ts:1509` returns early when a value holds
no top-level colon and emits it verbatim. The scanner that refuses top-level
`;`, `{` and `}` never runs on that path.

That check is not a style preference. `valueParser.ts:14-19` says why those
characters are refused, in its own words: refusing them "is what makes rule and
selector injection through a payload structurally impossible in the web
lowering, which emits payloads verbatim by contract". So the guarantee is
written down, and this path does not hold it.

Reproduced and pinned: `backgroundImage="none;}.injected{opacity 0"` emits one
rule carrying two selector blocks.

**It is CSS injection, not XSS**, and nobody should escalate it as script
execution. What it yields is arbitrary selectors and declarations in the page
stylesheet, which covers UI redressing and the attribute-selector plus
`background-image` pattern that exfiltrates DOM content. It is reachable from
any user-controlled string that reaches a style prop, which is an ordinary thing
for an app to do with an image URL or a CMS-supplied color.

**Deliberately not fixed yet, and it should not wait for wave B.** The plan
routes scanner divergences into item 12's convergence, which is right for D3,
D4 and D5 because those are correctness inconsistencies. This one is a security
boundary that is documented as holding and does not, so it was escalated to
p25843 for its own item. The fix is local: the early return must run the same
character check before emitting.

### The other two defects, which do wait for the convergence

- **D4** `hasFlatModifier` has no invalid-character branch, so a value the style
  scanner discards still puts the component on the should-enter path. It renders
  an enter frame for a style that never arrives, which a user reports as an
  animation bug with no idea a value parser caused it.
- **D3** the canonical parser treats a top-level backslash as an escape and
  neither runtime scanner does; `directStyle` drops the whole declaration and
  throws in development, `propMapper` drops only the clause.

### Two worker claims that did not survive checking

Both were caught by verifying against artifacts rather than reading reports, and
both would have gone into a report to the owner as fact.

- Item 3's regenerated metric is **not** comparable to the audited one. The
  corpus grew from 253 files to 265, and `animation runtime` bailouts fell 81 to
  34 because of `0d28fe6707`, which had been landed but unmeasured. Total bailed
  moving 517 to 497 is that, not this change. The diagnostic only relabels.
- Item 6 costs **+4,142 raw / +1,070 gzip** in production, on purpose. It
  deletes the `NODE_ENV !== 'production' ? long : 'Err0'` ternary so production
  stops getting bare codes. Anyone reading a size regression on `@tamagui/web`
  around that commit should stop there.

### The injection defect became item 5b, ahead of wave B

Ruled by p25843 on 2026-08-18: a documented security guarantee that fails
outranks the wave sequencing, and the fix is small and local. Scope is four
things and no more: run the top-level `;{}` scan at the `directStyle.ts:1509`
early return before `emitValue`; flip the pinned D2 test from asserting the
injection to asserting refusal, red before and green after; one bounded sweep of
`directStyle.ts` and every other web-lowering emit path for further fast paths
that emit verbatim, with a refusal test pinned for each path found **including
the clean ones**, since a path with no test cannot be shown to be safe later;
and no widening into D3, D4 or D5, which stay in item 12's convergence.

5b is reviewed as part of wave B's single assigned review rather than
standalone, and must be named explicitly in that review's scope.

**Released exposure: none.** p25843 checked directly (READ): `directStyle.ts`
and `style-grammar` do not exist on `main`, so no published v2 package carries
this. The v3-beta fix closes it, and no release action is needed. Worth
recording because "is this shipped" is the first question anyone will ask.

## 26. Wave B, first four items (2026-08-18)

### Item 20: the duplication had already drifted into bugs

`7c0b9a02cf`. One shared `loadCompilerProject` in `@tamagui/static` now owns
root/target/component normalization, flags and generation, project validation
and the zero CSS rule. Resolution stays in adapter callbacks, which was the
whole design constraint: each bundler genuinely resolves differently and that
difference is real, while the normalization around it was copied four times.

The shape is right: the integrations lost 220 lines and the shared entry gained
73. Duplication removed rather than a layer added.

Writing down what each integration did BEFORE touching anything is what made the
item worth doing, because three of the differences were bugs nobody had noticed:

- **Next stripped zero CSS in report mode from its zero hook, but its own warmup
  load did not.** Two paths in one integration disagreeing about the same
  policy.
- **Metro stripped CSS for report** as well, same class of bug.
- **Component default, ordering and dedup had drifted** between integrations.
  Now one core-first unique list.
- Duplicate outer sync config merges in Next and Metro were removed.

Preserved as deliberate, and worth naming so nobody "simplifies" them later:
Vite's async build config with ModuleRunner resolve/import and its tracked
evaluation deps; Next's synchronous bootstrap and its CSS hook doing no
resolution; Metro's platform-driven web/native choice, its sequential platform
resolver, its report-and-continue on resolution failure, and its hashing of
CSS/modules/tool versions for generation.

Validated end to end: `bun run receipts` exits 0 across Vite, Next and Metro,
with all three negative controls failing as intended. That run also exercises
the report-mode assert added earlier in this campaign, and both Next and Metro
report `sameViolations=true` through it.

### Items 13, 14, 18

- **13, `a9013c24a5`.** Docs for root `html.*`, the compiler tier ladder, and
  zero-runtime mode, plus sidebar routes. Verified by rendering all three pages,
  not just by writing files. Two things checked on review: it does not
  reintroduce `<Stack>`, which item 1 had just removed, and its flatten
  condition states all three terms (accepts `className`, not a `neverFlatten`
  behaviour HOC, provides no styled context). That last point matters, because
  it is the corrected predicate from item 3 rather than the single-term framing
  that mislabelled 340 bailout rows.
- **14, `da3b46454b`.** Native animations-motion returns a typed
  `AnimationDriverStub<A>`; the `@ts-expect-error` is genuinely gone rather than
  relocated.
- **18, `35c4764f9a`.** Native vitest resolution assertion, proved by failing
  first on the broken ordering (`nativeIndex 12`, `webIndex 4`). Seven of the
  nine handoff failures were test-harness defects, not product defects: native
  resolution was selecting the ESM fake-react-native whose hosts return null.
  Two were genuinely stale web expectations, since native `normalizeColor`
  canonicalizes `red` to `rgb(255,0,0)`.

### An interface change turned the shared tree red, which is worth a rule

Item 20 briefly narrowed `CompilerProject.projectInfo` to require non-optional
`components`, leaving `code/core/cli/src/build.ts:196` (a committed caller)
unconverted. Root typecheck then failed for every other worker, and one spent
time reporting it as a mystery failure before it was traced.

`origin` was never broken; only the shared working tree was, transiently. That
distinction is the useful part: in a shared checkout an uncommitted interface
change is effectively a broadcast, so **change an interface and update every
caller in the same unit**, by grepping rather than assuming. Every worker brief
now carries that line.

The narrowing was reverted rather than patched. It was never needed for item 20,
and satisfying it had required casting `projectInfo as CompilerProject['projectInfo']`
after a runtime guard. TS narrows the properties after such a guard but does not
retype the containing object as an intersection at a return boundary, so the
cast was structural, not incidental. Dropping the unnecessary interface change
beat keeping a cast to justify it.
