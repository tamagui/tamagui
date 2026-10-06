# PR 4248 port to v3-beta

2026-10-06 owner direction, relayed by the assigned parent: "yes, let's port the stuff".

Port #4237, #4239, #4233, #4244, #4241 and #4240 from PR 4248 where beta still
reproduces the reported behavior. Adapt tests to beta's lifecycle clauses and
component names. Keep beta's existing Pressability and animation architecture.
For #4245, retain its existing adapter fallback and fix the native trigger style
only. Each issue gets a separate commit with validation evidence.

CI and canary artifact owner: tamagui-issue-pr-review-handoff (m21288).
Delivery requires a v3-beta push, Checks and canary artifact content verification.

## Reproduction and scope

Baseline: origin/v3-beta `302078aa92`. Source: PR #4248, branch fix/oct-issues.
Native regressions use rebuilt `@tamagui/core/native-test`; browser regressions
use rebuilt animation driver dist. Fixture syntax uses beta lifecycle clauses.

| Issue | Baseline observation (RAN) | Port |
| --- | --- | --- |
| #4237 | no spring after first measure when completion callback drops | direct jump and timer, adapted Sheet.Container regression |
| #4239 | keyword-width exit completion count stays 0 | reject sizing keywords in descriptors and seeds, scenario 56 |
| #4233 | CSS exit frames include intermediate opacity, test passes | regression only; beta already captures settled mounted CSS properties |
| #4244 | pooled grant and delayed release keep coordinates, test passes | regression only; beta's real React Native Pressability persists both events |
| #4241 | native menu trigger has two responder claimers | shared runtime context; observer owns no responder; long-press timing, cancellation and cleanup |
| #4240 | first popover open has intermediate opacity, test passes | adapted regression only; beta already carries initial values into seeds |
| #4245 | ContextMenu native trigger drops width from its style | preserve native trigger style only; leave adapter fallback intact |

The four changed behaviors fail before their repairs and pass after rebuilding.
The other three regressions pass on unchanged beta runtime code, so their PR
runtime patches are omitted. The first-open browser recorder waits for the
animation's settled opacity instead of ending before a slow click dispatch.

Native validation: focused SheetFirstOpen, SheetPortal, SheetReanimated,
SheetNativeRenderer and Button suites 17/17 pass; Android regression checks
custom delay, long press, short press, cancellation, finalization and unmount;
ContextMenuTriggerStyle and MenuNoAdapter suites 2/2 pass. Android validation is
a mocked native runtime test, with no device run.

Final validation (RAN): ExitCompletion, AnimatePresenceEnterExit and
PopoverFirstOpenEnter finish with 72 passed and 6 existing driver-specific skips across
CSS, Reanimated and Motion, with one
worker and retries disabled. Root `bun run lint` passes with two existing
warnings; root `bun run check` passes. Fresh installation initially lacked the
CLI bin link; reinstalling after the workspace build repaired it. The root CLI
check reports no root config artifact and skips its flat-value check; dependency,
unused-dependency, reference, path, published web type and LSP pin checks pass.

Rebuilt changed targets: sheet, native, web, core (including native-test bundle),
animations-reanimated and context-menu. No beta runtime changes are needed for
#4233, #4240 or #4244. No changes target main.

Exact web totals: CSS 26 passed; Reanimated 24 passed and 2 skipped; Motion
22 passed and 4 skipped. Existing scenarios 51 and 53 skip non-CSS drivers;
Motion also skips scenarios 10 and 11. These totals supersede the scheduled
counts in the earlier validation commit bodies. No skip was added by the port.
