# Menu.TriggerGroup

Nate, 2026-10-06, relayed by coordinator: "we would have to implement that ... we may just have to have a different name ... group is a container ... we can come up with a name like trigger group."

Add Menu.TriggerGroup as the container for menubar triggers. Menu.Group remains the menu item container. Support separate Menu roots and multiple triggers sharing one root. Hover switches only while a menu in the same group is open, closes the previous menu, and anchors at the hovered trigger before showing content. Disabled triggers are skipped. Keyboard left/right moves between enabled triggers, wraps, respects direction, and preserves submenu navigation. Escape returns focus to the active trigger; outside interaction ends hover switching. Native platform menus retain their existing behavior.

Reference: https://www.radix-ui.com/primitives/docs/components/menubar
Prior art: contrast-ui MenuImpl.tsx and held commit 517d52f691.

Validation: failing kitchen-sink behavior test first, focused menu regressions, package build, hover recording. Delivery: v3-beta only, canary tarball inspected; this session owns the CI watch, tamagui-v3-size owns size-gate reds. One assigned Gemini reviewer reads the landed SHA.

## Implementation and validation

The group owns a trigger registry and the active entry. Hover checks one active ref; it does not subscribe every toolbar trigger to each menu's open state. Group focus updates its tab stop. Arrow navigation filters enabled entries and orders them by DOM position. Grouped web menus are non-modal, and outside interactions on sibling triggers are cancelled before dismissing content. The shared root records the active group for portalled content. Existing Menu.Group and native menu adapters are unchanged.

RAN: before implementation, the physical-hover test opened File and moved the pointer to Edit; `content-Edit` was absent at the visibility assertion. Baseline log: `~/.team-machine/evidence/menu-trigger-group/baseline-failure.log`.

TESTED: 36 Playwright tests passed with one worker and zero retries: MenuTriggerGroup (7), MenuAccessibility (13), MenuMultiTrigger (5), MenuHoverKeyboardBugs (5), MenuSubKeyboardFocus (6). Group coverage includes independent roots, shared controlled content and descriptor preparation, group isolation, disabled-trigger skipping, wrapping, roving tab stops, RTL, submenu arrows, Escape focus, and outside dismissal.

RAN: `bun run build` in code/ui/menu emitted web/native JS and declarations successfully. Focused oxlint and oxfmt checks passed. Cost: one group context, refs and registry per group, plus a group lookup at each trigger; no global toolbar subscription or additional positioning layer.

RAN: frame probe across six sibling transitions sampled 961 visible frames; maximum horizontal error against each active trigger was 0.40625 CSS pixels. Frame samples and recording sources are retained in `~/.team-machine/evidence/menu-trigger-group/`. The seven group cases also passed through a browser on pro-64 against this worktree's server after the fixture frame styling and incoming v3-beta web fix were built.
