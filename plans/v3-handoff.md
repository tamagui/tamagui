# V3 remaining work — handoff brief

You are the coordinator for finishing Tamagui V3. This file is your full
contract: the agent that wrote it will not be reachable. The design of record
is `plans/dom-tailwind-flat-values.md` in this repo (synced 2026-07-29 from
main; treat it as authoritative). Read it fully before delegating anything.

## Where things stand (2026-07-29)

All on branch `v3-beta` in this worktree (`~/.worktrees/tamagui-v3-flat`),
unpushed. Landed and adversarially reviewed today:

- `code/core/style-grammar/`: the universal value parser, per-longhand
  programs, clause-level merge (revised Decision 21), program hashing,
  web lowering (program-block CSS, subject-anchored `:where()` selectors),
  native evaluation (last-matching-clause), legacy condition conversion,
  background family split, transform family. 311 tests. Dependency-free.
- Runtime wiring in `@tamagui/web` (lanes W1–W5): contribution inside the
  existing `getSplitStyles` forward pass, web class flush with a
  resolved+lowered memo, native evaluation with `programStates` driving
  event attachment, `legacyConditionObjects` routing old condition objects
  through the program engine (the engine-contraction A/B test bed).
- Tests: `code/core/core-test/flatValuePrograms.web.test.tsx` (16),
  `flatValuePrograms.native.test.tsx` (12), `transformFamily.web.test.tsx`,
  `legacyConditionGate.*.test.tsx`, SSR determinism, kitchen-sink
  playwright `FlatValuePrograms.test.tsx`. Suites: 311 grammar / 766 web /
  405 native, all green at `a71b8c6c99`.
- Codemod corpus run: 1483 files clean / 220 flagged.

## Reserved lanes — do not touch

Another agent owns these; it works in this same checkout on `v3-beta`:

1. The engine contraction (deleting legacy condition machinery from
   `getSplitStyles` / `getCSSStylesAtomic` behind A/B proof).
2. Group and container clause evaluation on native (createComponent tree
   wiring and measurement).
3. The compiled static fast path (Decision 24: compiler emits plain
   elements when every contribution is static).
4. The dev-throw-on-parse-errors cutover behavior (it lives in the files
   below).

Files that agent has exclusive write access to — never edit them:

- `code/core/web/src/helpers/getSplitStyles.tsx`
- `code/core/web/src/createComponent.tsx`
- `code/core/web/src/helpers/contributePrograms.ts`
- `code/core/web/src/helpers/lowerAccumulatedPrograms.ts`
- `code/core/web/src/helpers/evaluateAccumulatedPrograms.ts`
- `code/core/web/src/helpers/grammarConfig.ts`
- `code/core/web/src/helpers/getCSSStylesAtomic.tsx`

`code/core/style-grammar/` is shared: you may add new modules and new
exports, but do not change the semantics of existing files. If a task truly
needs an existing-file change there, log it in `plans/v3-handoff-log.md`
with the exact needed change and work around it for now.

In `@tamagui/static`, the other agent will add flat-value extraction in new
modules. Your DOM compiler work (tag classification, text wrapping) must
also live in new modules with the smallest possible hook edits in shared
plugin files, committed immediately after they go green so the collision
window stays small.

## Your work list, highest value first

Acceptance for every item: typecheck + the three suites above stay green,
new behavior gets integration-style tests following the existing patterns
(no string-existence tests), and the work is committed. Plan section
references are to `plans/dom-tailwind-flat-values.md`.

1. **Codemod completion.** Drive the 220 flagged files toward zero:
   implement migration rules for the remaining flag categories, re-run the
   corpus, and write the V3 breaking-change and codemod guide (plan Phase
   6 item 1). The transform family is landed, so `enterStyle={{scale}}`
   style flags now have a target to migrate to. The codemod's final step
   disables `legacyConditionObjects`.
2. **`@tamagui/tailwind` isolation (plan Phase 2).** Remove global
   `styleMode` from public types and runtime branches, extract the narrow
   shared runtime entry, move candidate parsing into `@tamagui/tailwind`
   backed by `style-grammar`, remove `tailwind-merge`, move the Vite
   integration to `@tamagui/tailwind/vite`, add graph and type-entry
   isolation tests.
3. **DOM contract (plan Phases 3–4, "Tamagui DOM contract" section).**
   Check in the tag/attribute/event/native-backing tables, generate the
   explicit prop interfaces, implement the minimum native semantic
   primitives, expose `html.*` from core and tailwind, add `tamagui/dom`
   and `@tamagui/core/dom`, implement `style()` on the style grammar,
   member-expression compiler recognition, literal text wrapping, and the
   diagnostics. Follow the validation matrix in the plan ("DOM" and
   "Types" under Validation). This is the largest lane; split it across
   several agents by sub-area and keep the conformance tables as the
   source of truth.
4. **Cutover config items.** In the v6 default config: `bg` becomes the
   background family prop (Decision 14); `x`/`y` bind the space token
   category via `defaultTokenCategories`; kebab-case built-in names
   (Decision 15, "V6 candidate naming" section).
5. **Lint and editor tooling (plan Phase 5 item 6).** The ESLint rule,
   canonical formatting, and language-service completions, all backed by
   `style-grammar` — never a second parser.
6. **Transitions (plan "Web-aligned transitions", design item 3).** The
   native capability matrix and migration of the array and per-property
   preset object forms; preset resolution is decided as config-first
   identifiers.
7. **Reactive safe-area on native (design item 12).** Subscription-based
   inset updates replacing the non-reactive `getInsets()` accessor, plus
   the not-set-up diagnostic.
8. **Validation debt.** A Text-based font-face swap E2E test; a real-app
   streaming SSR + code-splitting fixture (React-level determinism is
   already proven, this is the app-level proof); WebKit re-check of the
   program-block probe as kitchen-sink tests.
9. **Design drafts (write into `plans/v3-handoff-log.md`, do not decide
   unilaterally where the plan marks it open):** the complete built-in
   condition list and collision policy (design item 5); the minimum
   native DOM ref API (item 8).

## Operating rules

- Fleet: spawn mostly **opus at high effort** for implementation, plus
  some **codex gpt-5.6-sol at high** for well-specified medium work. Never
  spawn Fable. Use `agentbus spawn`; sub-agents inherit your session model
  only on some harnesses, so always pass `--model`/`--effort` explicitly.
- Watch machine load: this laptop is in active use. Keep concurrent heavy
  agents to ~3–4. Check load before each wave; if load exceeds ~2.5x
  cores, pause spawning and investigate orphaned dev processes.
- Adversarially review every large piece (spawn a separate opus reviewer);
  fix findings at the root.
- Hot-path rules (plan "Hot-path code rules") apply to anything under the
  runtime render path: plain for loops, no per-render closures or
  allocations, memoize per-program/per-config data, zero cost when unused.
- Git: commit with explicit pathspecs only (`git add a b && git commit --
  a b`), one coherent item per commit, one-line conventional messages.
  Another agent shares this checkout: never `git reset`/`stash`/`checkout
  .`/`clean`, never amend, never rebase here. **Never push. Never publish
  or release anything. Never dispatch release workflows.** Both are
  user-permission-only.
- Never switch this worktree off `v3-beta`, and never touch the primary
  checkout at `/Users/n8/tamagui` (it stays on `main`; read-only for you).
- Tests: run suites to log files (`> /tmp/name.log 2>&1`), read the file;
  never pipe through head/tail/grep. Rebuild packages after changing them
  (`bun run build` in the package dir) or run `bun run watch` at repo root
  in the background.
- GitHub API budget is ~60/hr shared across all agents; avoid `gh` unless
  necessary, never `gh run watch`.
- Keep a running log in `plans/v3-handoff-log.md` (create it): per item,
  what landed (commit SHAs), what's blocked, design notes. This is the
  only channel the reserving agent and the user will read.

Suite commands, from the worktree root:

- grammar: `cd code/core/style-grammar && bun run test`
- web: `cd code/core/core-test && bun run test:web`
- native: `cd code/core/core-test && bun run test:native`
- kitchen-sink playwright: see `CLAUDE.md` testing guide.
- codemod corpus: see `code/core/codemod-flat-values/`.

Check `CONTRIBUTING.md` and root `package.json` scripts rather than
guessing commands.
