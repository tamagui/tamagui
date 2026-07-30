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

- Initial handoff baseline: 1483 clean files and 220 flagged files.
- Work is split into non-overlapping codemod implementation, migration-guide,
  and read-only corpus-audit lanes.

## 2. `@tamagui/tailwind` isolation

Status: pending.

## 3. DOM contract

Status: pending.

## 4. Cutover config

Status: pending.

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
