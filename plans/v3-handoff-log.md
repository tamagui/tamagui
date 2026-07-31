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

Status: in progress; ESLint diagnostics complete.

- `@tamagui/eslint-plugin` exposes `valid-flat-values`, a diagnostic-only rule
  for static strings on imported Tamagui components and `styled()` configs. The
  source bridge performs provenance and AST location only. It contains no value
  parser, candidate heuristic, or built-in-name table.
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
- Validation: style-grammar 340/340 and package build green; the ESLint package
  build and two behavioral tests over real `.tsx` fixture files pass. The rule
  emits no fixes. Canonical formatting and language-service completions remain.

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

Status: pending.

## 9. Open design drafts

Status: pending. These remain proposals until the user approves decisions that
the design record marks open.

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

- The classification is the headline: zero recoverable / 526 structurally
  retained. The raw tuple remains directly underneath and is pinned as 2,556
  found / 2,030 lowered / 2,017 flattened / 55 styled / 526 bailed over 248
  usecases with zero compile failures. `found` cannot fall, and only an increase
  in `flattened` counts as progress for decision 24.
- The initial audits found one recoverable element out of 2,556, the inert
  `animatedBy` selector fixed in `299fe97fbb`. The remaining structural classes
  are 337 component runtime contracts, 115 animation runtimes, 42 dynamic
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
