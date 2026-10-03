# v3 beta polish wave, 2026-09-11

Source: owner walkthrough of https://tamagui-tamagui-pr-4124.up.railway.app (branch `v3-beta`, PR #4124).

Everything below lands on `v3-beta` in the shared checkout at `~/tamagui`. Disjoint file sets per lane,
so lanes commit narrowly with explicit pathspecs. Nobody rebases anybody else.

## Lanes

| Lane | Owner | Scope |
| --- | --- | --- |
| A | claude (opus, this session) | animation driver regressions, select/slider/tooltip perf, motion noRerenders validation |
| B | agy (gemini) | site chrome: topbar, homepage, Contrast font, naming renames |
| C | agy (gemini) | docs IA: sections, page removals, native docs merge, elevation removal |
| D | claude | component styling: checkbox, switch, toggle, group, accordion, toast, list-item, popover, tabs |
| E | grok (research, read only) | shadcn switch/checkbox/toggle recipe, base-ui roving focus vs focus scope |

## Validation

- dev server: `cd code/tamagui.dev && bun run dev` (port printed in log; usually 8081)
- root watch build for package changes: `bun run watch` at repo root
- before done, at REPO ROOT: `bun run lint` and `bun run check`
- UI claims need a playwright screenshot or a DOM assertion, never "should work"
