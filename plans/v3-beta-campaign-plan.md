# v3 beta-readiness campaign — execution plan

Owner: lead/manager session (branch `v3-kit-restructure`, off `origin/v3-beta`).
Coordinator: `ab-mrp10baa-67081` (relays user natew). Tracking task `t-mrph1lep-1ike0`.
Anchor: `docs/reviews/v3-beta-review-2026-07-17.md` (verdict HOLD; user agrees with all issues).

Status: PLAN — reported early to coordinator for incoming user feedback before deep
package migration begins. Packaging/registry/docs workstreams are GATED on that
feedback. Packaging-agnostic workstreams (perf, correctness, native-CI) start now.

---

## 1. Target package architecture

Current: `tamagui` (`code/ui/tamagui`) is an umbrella that star-exports every
`@tamagui/<component>` package plus core `createTamagui`/views. In v3-beta those
component packages are behavior-first but MIXED: Button/Sheet/Select are (mostly)
unstyled, while Dialog, Slider, Toggle, Input, ListItem, Toast, Accordion still
embed colors/radii/padding/elevation. v2-look skins are duplicated across
kitchen-sink, demos, and canary. No shadcn registry exists.

Target three layers (per user direction):

1. **`@tamagui/ui` (new) — the unstyled layer.** One home for "everything
   unstyled": the behavior/structural-only primitives. Finish the C4 sweep so
   every primitive here is genuinely unstyled behind a reviewed structural-style
   allowlist (layout, hit targets, positioning, focus, native interaction only).
   The official **`tamagui` package API surface stays UNCHANGED** — `tamagui`
   re-exports from `@tamagui/ui`, so `import { Button } from 'tamagui'` keeps the
   same names/types; the components merely physically originate in `@tamagui/ui`.
2. **KIT (`@tamagui/kit`, new) — the styled/preset layer.** A real published
   package NEXT TO `tamagui` (NOT living in kitchen-sink). The single canonical
   source of the v2-matching styled components. kitchen-sink, demos, canary,
   docs, and starters all consume KIT — zero duplication.
3. **Registry — shadcn-compatible, fully DRY.** Generated FROM the KIT source
   (single source of truth), not hand-duplicated. "The copy-paste thing should
   be the same thing" = registry items ARE the KIT component source.

### OPEN QUESTION 1 (needs user feedback before packaging starts)

Does `import { Button } from 'tamagui'` resolve to the UNSTYLED `@tamagui/ui`
behavior primitive (v3-beta semantics preserved) or to the STYLED KIT component
(v2 look)? Lead reading: "API surface unchanged" = tamagui keeps exporting the
same names/types and continues to export the behavior primitives (re-exported
from `@tamagui/ui`); KIT is the opt-in v2-look package. This matches the v3 plan
("components become behavior primitives"). The alternative — `tamagui` stays the
v2 STYLED experience and unstyled moves to `@tamagui/ui` — is a very different
migration. Confirm which.

### OPEN QUESTION 2

"Unstyled default = atom one" (user's words). Interpreting as: the unstyled
docs/default baseline is a single minimal base ("atom one"). Need the concrete
intent — is "atom one" a named base theme/preset, a design reference, or just
"a sensible minimal base"? Treating as a sensible minimal base for now.

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

GATED on user feedback (packaging decision):
- **W4 packaging** (Opus, xhigh) — `@tamagui/ui` + `@tamagui/kit` boundaries;
  finish C4 aesthetic sweep across the fleet. Area: `code/ui/*`, new packages.
- **W5 registry** (Opus, high) — DRY shadcn registry generated from KIT + CI
  install-into-blank-app. Depends on KIT existing.
- **W6 docs+migration** (Opus, high) — 3-mode toggle + tailwind-switcher
  integration; D1 migration-doc fixes with compiled fixtures; A1 shared state
  vocabulary. Area: `code/tamagui.dev`, `code/core/style-grammar`.

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
