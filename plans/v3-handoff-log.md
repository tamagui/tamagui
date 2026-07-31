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
- Open, and blocking nothing yet: `bun.lock` at HEAD does not register
  `code/core/codemod-flat-values`, which is already committed, so
  `bun install --frozen-lockfile` fails at HEAD. The working tree also carries
  the `@tamagui/config` -> `@tamagui/style-grammar` edge and `@tamagui/dom`.
  Three lanes, one file: it needs a single coordinated commit.

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

Status: pending.

## 6. Transitions

Status: pending.

## 7. Reactive safe-area on native

Status: pending.

## 8. Validation debt

Status: pending.

## 9. Open design drafts

Status: pending. These remain proposals until the user approves decisions that
the design record marks open.

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
