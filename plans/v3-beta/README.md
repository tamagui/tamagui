# Tamagui v3 beta launch lane

State: the approved hero containment fix and docs pass are merged into `v3-beta`.
Nate decided automatic beta publication stays enabled. Published beta 1564.1
corresponds to source `564ffb4364`. Production still renders the v2 homepage;
the existing v3 PR preview serves older copy and its latest deployment failed.
Current reconciliation, measurements, source provenance, and deployment blockers:
[launch-site-2026-10-03.md](./launch-site-2026-10-03.md).
The historical validation and delivery sections below describe their original run.

## Acceptance inventory

| Item | State | Evidence | Next |
| --- | --- | --- | --- |
| Site published | v3 production publication pending | production renders v2; existing v3 preview is healthy but its latest deployment failed and Railway CLI is unauthorized | obtain the failed build log through an already authorized owner; verify the exact deployed commit after publication |
| Hero fixed | approved source merged into v3-beta | `4f07152c69`; original 10 runtime states pass across five widths | publish approved source through the authorized site deployment path |
| Docs and skills pass | complete for active v3 core, intro, guides, 24 versioned component pages, and reusable skills | 94 files audited, 675 code blocks parsed, 255 literal JSX style values checked with the grammar; four stale prose references repaired; production build and typecheck pass | deploy with the site; preserve intentional v2 migration comparisons and historical docs |
| Chat upgraded | migration exists off main; main still pins `2.7.7` | `plans/v3-beta/chat-migration-receipt.md`; `origin/v3` exists; `finish-line.md` records `531ecfdc0` on beta 917.1 and a later clean native launch after the outline-style fix | preserve existing migration, inspect its current tip, exercise refreshed local packages, then identify integration ownership |
| Takeout upgraded | migration exists off main; main still pins `2.7.7` | `plans/v3-beta/takeout-migration-receipt.md`; `origin/v3` and additional beta migration branches exist; `finish-line.md` records `649b2a0e` on beta 917.1 | compare existing migration branches before selecting work; validate refreshed local packages with `bun release --into <isolated-consumer>` |
| 3pc upgraded | root dependencies still pin v2 canary `2.1.0-1780536257458`; shared checkout has unrelated dirty work | inspected `/Users/n8/3pc/package.json` and tracked working changes | use an isolated worktree, inventory frontend dependencies and codemod report, then exercise local built packages; do not modify the shared checkout |
| Bento about 12 free components, or plain repo | v3 migration already exists; product cut is unverified | `/Users/n8/bento` is on `v3/migrate`, ahead of main by 22 commits; latest `53b8098` converts remaining pseudo-style objects; 173 tracked component paths | inventory public/free components and current migration; Nate chooses any unresolved product scope |

## Recovered ownership and boundaries

- RAN: `tm search --all --since 14d need-get-v3-beta-off`, `tm show record m16473`,
  and `tm show turns m16473` recovered the previous owner's work. That session
  restored v2 main after an accidental v3 fast-forward and reopened v3's PR.
  It did not own the current hero and docs implementation.
- RAN: fetched `origin/v3-beta` and read its recent commits and existing plans.
  `plans/v3-beta/` already contains migration and validation receipts. This README
  adds the launch inventory without restarting their completed work.
- Tamagui main is Nate-only. No main push or stable release is authorized. Approved existing site work may
  deploy only through an already authorized path; new visuals stay on a review branch.
- TESTED: both branch copies of `.github/workflows/release.yml` define automatic beta
  publication after a successful push check on `v3-beta`, and
  `gh api repos/tamagui/tamagui/actions/workflows/release.yml` returns `state: active`.
  The historical run pushed only `v3/site-docs-pass`; the current reconciliation
  preserves automatic beta publication and holds claim copy on its review branch.

## Validation and close-out

- RAN: `bun install --frozen-lockfile` exited 0 (2,797 packages), followed by
  `bun run build:js` and the site's `bun run build:prod`, both exit 0. The baseline
  and repaired builds generated 869 routes. Build logs:
  `/tmp/tamagui-v3-site-before-build.log`, `/tmp/tamagui-v3-site-after-build.log`.
  The build's client scanner reports its all-`f` Postmark placeholder as a possible
  secret; no real credential was added or inspected.
- TESTED: root `bun run typecheck` exited 0 before and after the hero repair.
  `/tmp/tamagui-v3-types-before.log`, `/tmp/tamagui-v3-types-after.log`.
- RAN: strict site grammar check from `code/tamagui.dev`:
  `bun ../../code/core/cli/src/cli.ts check --styles-only --strict`, exit 0,
  `350 files, no flat value problems`. The root wrapper lacks its `.bin/tamagui`
  link in a fresh install; a direct non-strict invocation skips without an artifact,
  so only the strict invocation counts. `/tmp/tamagui-v3-site-grammar-strict.log`.
- TESTED: real production homepage on `http://localhost:8193/` in headless Chrome.
  Asserted HTTP 200, visible heading, hydrated switching between both syntax tabs,
  code bounds, horizontal scrolling at 320px, unchanged panel height on switching,
  document width equal to viewport, and no page errors. All 10 states pass at
  320, 390, 768, 1,024, and 1,440px. `/tmp/tamagui-v3-hero-bounds.json`.
- RAN: before and after screenshots at 320, 390, and 1,440px:
  `/tmp/tamagui-v3-hero-before/`, `/tmp/tamagui-v3-hero-after/`.
  Viewed and shared the quality-90 side-by-side
  `/tmp/tamagui-v3-hero-before-after.webp` through `tm share`.
- TESTED: 13 real docs routes returned HTTP 200, rendered headings and example
  code, and raised no browser page errors. Covered styling, flat values, styled,
  variants, style pieces, Tailwind, Button, Slider, Dialog, Sheet, Surface,
  configuration, and exports. Asserted the corrected content on affected pages.
  `/tmp/tamagui-v3-docs-runtime.json`.
- TESTED: Gemini audited 94 active docs and skill files. The strengthened parent
  AST probe parsed 675 code blocks, checked 255 literal JSX style values using
  `diagnoseStyleValue`, checked legacy condition keys in styled objects, and
  found no unexpected legacy or grammar diagnostics. A deliberately malformed
  `p="hover::4"` produced one diagnostic. The probe exits nonzero on findings or
  traversal failures. Sixty-five incomplete illustrative fragments do not parse
  as whole programs; the line audit covers those. Migration comparison pages
  retain their intentional v2 examples. `/tmp/tamagui-v3-docs-ast-audit.log`.
- RAN: checked the edited docs against `components/facets.tsx`, `insertFont.ts`,
  and the grammar. Corrected Surface generic names, bare font subkeys, the named
  group modifier, and `transition`. Existing reusable skills needed no edits.
- RAN: final site `bun run build:prod` after the documentation corrections exited
  0 and generated 869 routes. `/tmp/tamagui-v3-site-final-build.log`.
- RAN: focused formatter, lint, and `git diff --check` passed. The formatter handles
  the TSX file; the real production MDX build validates the edited documentation.
- TESTED: Gemini's one assembled cross-model review returned PASS after reading
  the full code/docs diff, the before/after, and source implementations, plus a
  fresh 320px Playwright probe of both tabs and live corrected docs. Reviewer:
  `v3-site-docs-review (r51027)`, result `scripts/tmp/v3-site-docs-review.md`.
- RAN: Nate explicitly approved share
  `share-file-r51009-41c117b46abaf5b2-1a0f7b9b832-480dfe832808d97d`.
  That approves the hero visual; it does not approve npm publication or deployment.

The scoped changes add two CSS properties and correct four docs. They add no runtime
helper, dependency, data migration, or public API. Nearby homepage code panels were
checked for the same wrapping issue; `CodeDemoPreParsed` already clips its bounded
source panel. Downstream repos were fetched read-only and their shared working changes
were preserved. The remaining downstream work was intentionally not restarted here.

## Delivery and remaining gates

Inventory commit: `e5c9a93761`, pushed to `origin/v3/site-docs-pass`.
The validated implementation commit follows that inventory on the same branch.
Its parent is the inventory commit; its complete diff is the five site/docs files
and this updated README. Tamagui main remains untouched. The release workflow is
active, so integrating into v3-beta would trigger an npm beta cut. That was the original
integration gate. Nate has since retained automatic beta publication and the
approved hero/docs source is integrated into v3-beta; site deployment remains open.
The lane manager owns any CI monitoring of this branch's Checks run.

Historical receipts describe their own source versions and are not fresh validation.

Further optimization candidates: assess the remaining compiler retention and bundle
work only after this lane's hero and docs acceptance is closed; see
`plans/v3-compiler-retention-follow-ups.md` and `plans/v3-beta/bundle-size-ledger.md`.
