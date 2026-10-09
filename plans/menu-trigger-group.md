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

## Delivery

Published from v3-beta SHA `39f4c06c6b2dad1fa18278f0e965e6e571e3d342` as `3.0.0-0.canary.1791300370752`. RAN: npm tarball source files, emitted Menu ESM and exported declarations match the validated local bytes exactly; `releaseSourceCommit` matches the landed SHA. Consumer owner s13101 was sent the verified version. Gemini reviewer r62295 approved after a mounted browser probe covering hover, group isolation, arrows, submenus, RTL and Escape.

Release run 37485064844 succeeded. Checks run 37485065043 failed on the new fixture's legacy token syntax, an unrelated shell-quote advisory, and starter size baselines. The fixture is corrected to V3 flat tokens without changing the corpus assertion. The coordinator owns routing the dependency advisory, and tamagui-v3-size owns the size gate. Native jobs were cancelled; Registry and LSP passed. Evidence and recording are retained in `~/.team-machine/evidence/menu-trigger-group/`.
