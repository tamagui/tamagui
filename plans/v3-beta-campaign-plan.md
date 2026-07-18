# v3 beta-readiness campaign — execution plan

Owner: lead/manager session (branch `v3-kit-restructure`, off `origin/v3-beta`).
Coordinator: `ab-mrp10baa-67081` (relays user natew). Tracking task `t-mrph1lep-1ike0`.
Anchor: `docs/reviews/v3-beta-review-2026-07-17.md` (verdict HOLD; user agrees with all issues).

Status: EXECUTING — user gave FULL GREEN LIGHT (do the whole plan + every
review-doc finding/blocker). Q1 RESOLVED (styled default, see below). Campaign
base CORRECTED to `5418244f4a` (= current `origin/v3-beta` = the exact reviewed
SHA); the initial worktrees were accidentally cut from a stale local ref 125
commits behind, now rebased squad-wide onto `5418244f4a`.

---

## 1. Target package architecture

Current: `tamagui` (`code/ui/tamagui`) is an umbrella that star-exports every
`@tamagui/<component>` package plus core `createTamagui`/views. In v3-beta those
component packages are behavior-first but MIXED: Button/Sheet/Select are (mostly)
unstyled, while Dialog, Slider, Toggle, Input, ListItem, Toast, Accordion still
embed colors/radii/padding/elevation. v2-look skins are duplicated across
kitchen-sink, demos, and canary. No shadcn registry exists.

Target layers (FINAL — STYLED default, unstyled opt-in, KIT dropped):

1. **`@tamagui/ui` (new, org-scoped) — UNSTYLED, the single component source.**
   The behavior/structural-only primitives. Finish the C4 sweep so every
   primitive is genuinely unstyled behind a reviewed structural-style allowlist
   (layout, hit targets, positioning, focus, native interaction only). Opt-in via
   `@tamagui/ui` or the **`tamagui/unstyled` subpath** (re-exports `@tamagui/ui`).
2. **`tamagui` (base package) — STYLED default, v2-compatible.**
   `import { Button } from 'tamagui'` → the STYLED v2-look component; public API
   surface unchanged. The styled components live HERE (no separate package): each
   = the `@tamagui/ui` unstyled primitive + a default skin layered on top, ONE
   component definition. Aesthetics stripped from the behavior packages land in
   this skin layer.
3. **Registry — shadcn-compatible, fully DRY.** Generated FROM tamagui's styled
   (unstyled + skin) source — the SAME single skin definition tamagui uses. "The
   copy-paste thing should be the same thing" = registry items ARE that source,
   no duplication.

DESIGN DECISION (W4 proposes, lead reviews before the fleet sweep): the exact
`styled = unstyled + skin` layering mechanism — how the skin is defined once, how
`tamagui` presents it styled, and how the registry extracts it DRY. Likely
idiomatic `styled(UiButton, { ...default skin/variants })`.

### RESOLVED — Q1 (STYLED default, unstyled opt-in; KIT dropped)

`import { Button } from 'tamagui'` = STYLED (v2-compatible). Do NOT make
`tamagui` unstyled. `@tamagui/ui` = unstyled single source; `tamagui/unstyled`
re-exports it. NO separate KIT package — the styled components live in `tamagui`
= `@tamagui/ui` + default skin (one definition). Styled default, unstyled opt-in.

### RESOLVED (provisional) — Q2 ("atom one")

Proceed with "atom one" as a sensible MINIMAL BASE default for the unstyled path
for now. Flagged for the user to refine later; not a blocker.

---

## 2. DRY registry generation

- KIT component source files are the single source. A codegen script
  (`scripts/generate-registry.ts`) reads each KIT component + a small per-component
  manifest (files, npm deps, peer/native requirements, token/theme assumptions)
  and emits a shadcn-schema `registry.json` + per-item JSON.
- The SAME generator emits the mechanically-checked copies consumed by
  kitchen-sink, demos, canary, and starters — a CI check fails if any copy drifts
  from KIT source.
- CI: install the generated registry into a blank web app and a blank Expo app,
  build, and run an interaction smoke (per review §1.3 recommendation).

## 3. Docs toggle (UNSTYLED / STYLED / TAILWIND)

- Existing infra to extend, NOT replace: `features/docs/docsCodeMode.tsx`
  (`CodeMode = 'tamagui' | 'tailwind'`, localStorage + listener store) and the
  server-side `features/docs/isTailwindMode.ts` (cookie / `/tailwind` route /
  `tailwind.` subdomain / `?syntax=` param) + `syntaxCookie.ts`.
- Extend `CodeMode` to `'unstyled' | 'styled' | 'tailwind'`. `styled` replaces the
  old default (`tamagui`) and drops the old "bring your own styling"; `unstyled`
  renders `@tamagui/ui` usage; `tailwind` MUST drive the EXISTING tailwind path
  (set the same `syntaxCookie` / use `/tailwind` + subdomain) so TAILWIND is a
  different route to the same switcher, not a parallel system.
- One consistent toggle across ALL component docs pages.

## 4. Prioritized blockers → workstreams

P0 (blocks beta / central claim):
- L1 — three-layer contract (packaging + KIT + registry + docs). THE big one. GATED.
- R1 — native CI not green (Android launch + failure swallowing, iOS compiler
  benchmark red, One prod bundles absent).
- R2 — Expo starter consumes raw behavior Button; placeholder `true` tests.
- R3 — G1 does not certify the exact publish bytes.

P1:
- C1 Dismissable pointer-event bookkeeping; C2 CSS exit timer vs real completion;
  C3 CSS animated-number wrong value + no rAF cleanup; C4 nested Button semantics;
  D1 migration docs contradict APIs; A1 shared component-state vocabulary;
  P2 Vite serialized compile / no caches; P3 Metro duplicate Babel + cache churn;
  P4 Motion runs full splitter per value; P5 render-path allocations (ref-clone).

P2:
- D2 Popover `aria-controls`; P6 Tailwind default footprint; bundle governance
  (fail on thresholds, narrow subpath entries).

## 5. Careful performance pass (first-class workstream)

User flagged a concrete "huge no": the universal component clones the whole props
object just to strip `ref` — `code/core/web/src/createComponent.tsx:256`
(`const { ref: forwardedRef, ...propsIn } = propsInWithRef`), allocating a new
object every render.

Fix direction (user's): do NOT clone to delete `ref`. Read `ref` off the incoming
props and skip it NATURALLY in the existing split-styles pass (that pass already
iterates every prop to separate style vs non-style; `ref` is simply skipped there
and never forwarded, no copy). Then broaden into a careful hot-path allocation
hunt: the dead `baseProps` merge (P5), `Object.entries` materialization in
`getSplitStyles` when no compound variants exist (P5), Motion per-value splitter
(P4), CSS ticker allocations (C3). Measure before/after with a real render
profile, not micro-benchmarks alone.

## 6. Squad assignment (bounded, non-overlapping, own worktrees)

Each parallel worker gets its OWN `~/.worktrees/<name>` worktree (heavy file
overlap — never two workers mutating the same checkout). Claude workers = Opus;
Codex workers = Sol. Never Fable. Effort scaled to difficulty.

START NOW (packaging-agnostic, cannot be invalidated by incoming feedback):
- **W1 perf** (Opus, xhigh) — ref-clone skip-in-split-styles, dead `baseProps`
  merge, `getSplitStyles` no-compound fast path. Area: `code/core/web`.
- **W2 correctness/a11y** (Opus, high) — C1 Dismissable, C4 nested Button,
  D2 Popover aria-controls. Area: `code/ui/{dismissable,button,popover}`.
- **W3 correctness/animation** (Sol, high) — C2 CSS exit real completion,
  C3 animated-number value + cleanup, P4 Motion split hoist. Area:
  `code/core/{animations-css,animations-motion}`.
- **W7 native-CI/release** (Sol, high) — R1 Android AppCompat launch + remove
  `continue-on-error`/failure swallowing, iOS compiler benchmark stabilize,
  R3 G1-as-release-artifact, R2 starter smokes. Area: `.github/workflows`,
  `scripts`, `code/starters`.

GATED WAVE — NOW LAUNCHING (green light; base `5418244f4a`; each own worktree):
- **W4 packaging+state** (Opus, xhigh) — `@tamagui/ui` (unstyled single source) +
  C4 aesthetic sweep (aesthetics → tamagui's skin layer) + styled `tamagui` =
  `@tamagui/ui` + skin (one definition) + `tamagui/unstyled` subpath + A1 shared
  state vocabulary (folded here so ALL component-source mutation stays in one
  worktree — no races on `code/ui/*`). PROPOSE the skin-layering mechanism +
  pilots to lead before the fleet sweep. Area: `code/ui/*`,
  `code/core/style-grammar`. Checkpoint per sub-phase.
- **W5 registry** (Opus, high) — DRY shadcn registry generated from tamagui's
  styled (unstyled + skin) source + install-into-blank web/Expo CI. Reads the
  skin source (no component mutation → no race). Builds generator + CI harness in
  parallel; coordinates with lead for the skin-layering shape.
- **W6 docs+migration** (Opus, high) — 3-mode toggle (unstyled/styled/tailwind)
  wired into the EXISTING `isTailwindMode`/`syntaxCookie` switcher; D1
  migration-doc fixes with compiled fixtures. Area: `code/tamagui.dev` only
  (renders `@tamagui/ui`/KIT, does not mutate them → no race).

De-prioritized to the very end (per user): v2-vs-v3 performance comparison (P1
benchmark matrix with a v2.4.6 column).

## 7. Migration order / risk

1. Land packaging-agnostic fixes (W1/W2/W3/W7) on branches — low risk, high value.
2. Resolve OPEN QUESTIONS 1 & 2, then W4 establishes `@tamagui/ui` + KIT
   boundaries (highest-churn, highest-risk — single worker, own worktree).
3. W5 registry + W6 docs follow once KIT exists (they consume it).
4. Reassemble, validate each layer (typecheck/build + web/native interaction),
   then native CI + G1 truthful-evidence pass.
5. Do NOT push/publish without explicit coordinator/user approval — land locally
   on branches, report for review.
