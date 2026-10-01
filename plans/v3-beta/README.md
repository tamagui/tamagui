# Tamagui v3 beta launch lane

State: inventory recovered at `cf9c5b1464`; local hero and docs validation in progress.
Next: build the current site, capture its hero on desktop and mobile, fix reproduced
defects, then validate active v3 docs and skills. Publish and public API decisions
remain with Nate. Worktree: `~/.worktrees/tamagui-v3-beta-site-docs`, branch
`v3/site-docs-pass`, owner `lane-tamagui-v3 (r51009)`.

## Acceptance inventory

| Item | State | Evidence | Next |
| --- | --- | --- | --- |
| Site published | pending owner approval | `plans/v3-beta-site-readiness.md` records an earlier 784-route build; this run has not deployed anything | present the validated hero comparison and build result to Nate for a deploy decision |
| Hero fixed | earlier polish landed; current runtime proof pending | `23a65bac74` tightened heading line height; current home is `code/tamagui.dev/app/(site)/index.tsx`; `plans/v3-polish-2026-09-11/round-2-queue.md` closes prior CTA work | capture the actual current production build before editing and fix only reproduced failures |
| Docs and skills pass | substantial v3 migration already landed; fresh audit and build pending | core docs cover flat values, `styled.dynamic`, style pieces, and Tailwind; `plans/v3-beta/finish-line.md` records the earlier docs and skill work | audit active v3 examples against the current grammar, build docs through the site build, run affected type checks |
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
- Tamagui main is Nate-only. No main push, publish, release, release tag, or deploy
  is authorized by this assignment.
- TESTED: both branch copies of `.github/workflows/release.yml` define automatic beta
  publication after a successful push check on `v3-beta`, and
  `gh api repos/tamagui/tamagui/actions/workflows/release.yml` returns `state: active`.
  Push only `v3/site-docs-pass` under this assignment's no-release boundary.

## Validation and close-out

Record commands with exit codes, actual loaded-page assertions, screenshot paths,
the cross-model review, pushed SHA, and remaining blockers here. A current screenshot
must show the real local site, including its code sample and responsive layout.
Historical receipts describe their own source versions and are not fresh validation.

Further optimization candidates: assess the remaining compiler retention and bundle
work only after this lane's hero and docs acceptance is closed; see
`plans/v3-compiler-retention-follow-ups.md` and `plans/v3-beta/bundle-size-ledger.md`.
