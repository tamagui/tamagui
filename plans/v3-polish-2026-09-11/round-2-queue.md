# v3 polish round 2 queue

Requests from the 2026-09-11 session, in the order given. Closed out at the end
of the session; every lane is stopped.

| # | Item | Owner | Status |
|---|------|-------|--------|
| 1 | GitHub + "Copy agent prompt" hero buttons: drop the grey fill (only "no border" was asked for) | claude | done |
| 2 | Hero CTAs: less gap between Style / Components, smaller arrow, arrow top-aligned | claude | done |
| 3 | Bento / Takeout / AddEven promo buttons: 8px shorter | claude | done |
| 4 | Intro paragraph line-height too big; report on whether the default scale is at fault | claude | done, the scale was at fault |
| 5 | Delete the "web-only apps need react-native as a dev dependency" notice (types are inlined now) | claude | done, `a9def8b71c` |
| 6 | Notice background much weaker, site wide | claude | done, `a9def8b71c` |
| 7 | /docs/intro/agents: cut the fluff, rewrite so it reads well | agy | done, `8322da78dd`, then folded into its parent by `6a8f4873f5` |
| 8 | Docs nav: fold Style > Components > Props into View & Text | agy | done, `6a8f4873f5` |
| 9 | Light-mode site buttons read too dark; write up what the v6 config is doing | claude | done, `6ddcd2bfa0` then widened to both ramps |
| 10 | Left sidebar version select must cover the core docs too, and adapt properly; grok reviews | agy + grok | done, `07d2023224` and `72a3c568e9` |
| 11 | Docs should show both the typed and the string style, like the Styling page does | agy | not verified, no commit found |
| 12 | Notice has stray bottom padding on a single-line notice | claude | done, `a9def8b71c` |

## Still open

- **Item 9 is closed.** `light-mode-buttons.md` has the measurements. Both neutral
  ramps had one bad step and both are fixed. What is still open there is the three
  in-band spikes left in the tinted themes, which nobody has complained about.
- **Item 11.** No commit touches it. Either it was dropped when the docs
  restructure landed or it was never started.
- **mdx inline links.** `MDXComponents.tsx` pins them to `Theme name="gray"`.
  Whether they should take the accent theme instead was never decided.
- **`v3-style-rename`.** Unmerged branch, no decision.

## Notes

- Item 1's fill came from the site `Button` default (`backgroundColor: 'background ...'`
  inside the `Button` sub-theme). `borderless` only ever removed the border, so the
  fill was never added by the CTA work, it was the component default showing through.
  Fixed by putting both buttons on the existing `variant="quiet"`.
- Item 3: the buttons were 40px (7px padding each side, plus a 36px `minHeight`
  floor from the size-3 token). `py={3} minH={0}` puts them at 32px.
- Item 4 turned into the font work. The site config was calling `createInterFont`
  and layering a table of per-size overrides on top of it, including
  `transform: { 6: 'uppercase' }`, which uppercased every heading at size 6 or
  below sitewide because tamagui resolves a size key to the nearest one at or
  below it. That is where the docs eyebrows (INSTALL, QUICK START, CONTENTS) came
  from. Both the site config and the shipped `@tamagui/create-system-font`
  defaults are now one accelerating-ratio equation instead of a hand-written
  table, and `v5-fonts.ts` pins the old tables so a v5 app does not resize.
- `code/tamagui.dev/tamagui.generated.css` is a checked-in build artifact holding
  the font scale as CSS variables. Editing a font config does nothing on the site
  until `bun run build` regenerates it. This cost an hour.
</content>
</invoke>
