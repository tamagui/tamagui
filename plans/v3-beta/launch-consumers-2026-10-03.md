# Tamagui launch consumer acceptance, 2026-10-03

Owner: launch-tamagui-consumers (s8065). Parent: r54299.
Scope: chat, takeout, 3pc. Review occurs with the assembled launch.

## Package and machine selection

- RAN: fetched origin/v3-beta and read README.md, finish-line.md and the chat/takeout migration receipts before editing.
- RAN: queried npm registry metadata. `tamagui@beta` was `3.0.0-beta.1564.1`, published 2026-10-03T11:39:38.378Z. Every consumer is being pinned to this exact published set.
- RAN: inspected fleet load through `tm exec`. Air-32 has all three source checkouts; its two CPU samples were 77.4% and 73.16% idle, with about 6 GiB physical memory unused and 131 GiB disk available. Heavy jobs use `tm window run heavy`, one builder slot. CI-64 is excluded and lacks the consumers.
- RAN: isolated all consumers under `~/.worktrees/<project>-launch-consumer` on air-32. Shared main checkouts and dirty 3pc feature work remain untouched. Evidence is prepared on `launch/tamagui-consumers-2026-10-03` from Tamagui origin/v3-beta; no main or board changes.

## Recovered work

| Consumer | Recovered source | Observation |
| --- | --- | --- |
| chat | `origin/upgrade/one-v2-tamagui-v3`, `a5cdfe82b8c014f2b458d0d1bfcc71e53b40146d` | incorporates the historical origin/v3 migration plus later v3 fixes; beta 1351.1 before this lane |
| takeout | `origin/beta/one-tamagui-v3-rolldown`, `d614d5b3457147feac22f9a48080deb4d3a4b3b6` | beta 1386.1 before this lane, but v2 style syntax remains; reconciling with proven origin/v3 649b2a0e |
| 3pc | `origin/main`, `d9d7e9ca` | v2 canary dependency set, no recovered v3 branch; isolated from dirty feature checkout |

Historical validation stays in the original migration receipts. It does not validate the current beta.

## Current evidence

Work in progress. Final commands, runtime proof, remaining blockers, and pushed SHAs will be recorded here before close-out.

### Pushed consumer acceptance

- TESTED: chat `ae4e71aae` on `origin/launch/tamagui-v3-consumer`: full TypeScript, production web build (128 pages), existing public launch verifier (10 surfaces, 36 internal links, 90 sitemap locations), and login input value/focus/height checks passed. Final capture `/tmp/launch-chat-login.png` on air-32; side-by-side validation capture was shared directly from this lane. The input is explicitly sized to the existing v5 metrics rather than passing a retired numeric skin size.
- TESTED: Takeout `fc4a639b` on `origin/launch/tamagui-v3-consumer`: full `bun check`, production web build (all 20 docs), 75 unit tests and four existing login integration tests passed. The production build used `ALLOW_MISSING_ENV=1` for local validation only. No production credentials or state were changed.
- RAN: Takeout source recovery copied 147 proven migration files only where the newer selected base still matched the old migration baseline exactly; 14 newer files were preserved. The published codemod and targeted API edits handled the remaining source.
- RAN: 3pc dependency dedupe check found 127 Tamagui packages at beta1564.1. The published codemod rewrote 218 files. Its local generated icons replace the discontinued lucide-icons-2 dependency; themes remain v5 through config-v5. Remaining acceptance is being run on the isolated branch.
- RAN: fresh native exports exposed missing consumer entry/Metro wiring in the recovered newer branches. The historical receipt already includes the required wiring; it is being reapplied and checked against the current published set.
