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

## 3. DOM contract

Status: pending.

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

Status: in progress.

- The reproducible per-reason metric landed in `5116482928`. The 2026-07-30
  kitchen-sink tuple is 2,556 found / 2,029 lowered / 2,016 flattened / 55
  styled / 527 bailed over 248 usecases with zero compile failures. The 527
  reasons are 337 components that cannot accept the plain-element path, 116
  animated candidates, 26 dynamic style values unsafe to extract, 21 runtime
  event mappings, 16 non-evaluable style values, six unevaluated spreads, and
  five theme boundaries.
- The styled-context investigation disproved the initial high-volume
  hypothesis. `Button`, `Input`, `Label`, `ListItem`, and `XGroup` are behavior
  HOCs whose runtime work exceeds context resolution. The seven Card-family
  cases do not justify context-island transactions. Both the context-island
  design and the larger explicit component-lowering descriptor are parked in
  `plans/decision-24-component-lowering.md` pending an architecture decision.
