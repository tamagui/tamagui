# Lane C: docs information architecture and content

Repo: `~/tamagui`, branch `v3-beta`, shared checkout. Work directly on `v3-beta`.

You own: `code/tamagui.dev/data/docs/**`, `code/tamagui.dev/features/docs/docsRoutes.tsx`,
`code/tamagui.dev/features/docs/DocsQuickNav.tsx`, `code/tamagui.dev/features/docs/Highlights.tsx`,
`code/tamagui.dev/features/docs/DocsVersionPicker.tsx`, `code/tamagui.dev/features/docs/SourceVersionSwitcher.tsx`,
and the `elevation` removal in `code/ui/*` / `code/core/*`.

You do NOT own: the homepage, the topbar, the site font, `code/demos/*`, or any animation driver code.
Another lane owns those. Report anything you find there instead of changing it.

REVIEW: none - reviewed as part of the v3 polish wave.

## Tasks

### 1. Delete the HTML Elements package entirely

`@tamagui/elements` at `code/ui/elements`. Remove the package, its docs
(`code/tamagui.dev/data/docs/components/html-elements/`), its sidebar entry in `docsRoutes.tsx`
(`{ title: 'HTML Elements', route: '/ui/html-elements' }`), and every import/reference across the repo
including `package.json` deps, the `tamagui` barrel package re-exports, and lockfile entries.
No backwards compat, no deprecation shim. Grep for both `@tamagui/elements` and `html-elements`.
Check `code/tamagui.dev/data/docs/core/html-primitives.mdx` too: that one documents core's DOM
primitives, which is a different thing. Keep it, but make sure it does not link to the deleted page.

### 2. React Strict DOM section on `/ui/intro`

On `code/tamagui.dev/data/docs/components/intro/*.mdx` (the `/ui/intro` page), make React Strict DOM
the FIRST section after Install. Title it exactly:

    React Strict DOM for React Native

Content: Tamagui's UI components follow the React Strict DOM model, DOM-shaped elements and props that
render to real native views on native. Pull the accurate description from
`code/tamagui.dev/data/docs/core/html-primitives.mdx` and `code/core/web/src/dom/` rather than inventing
claims. Verify what is actually true before you write it.

### 3. Native docs page rewrite: `/ui/native`

File: `code/tamagui.dev/data/docs/components/native/2.0.0.mdx`. It is ugly. Fix:

- **Bullets do not indent.** This is a site-wide markdown rendering bug, not a content bug. Find the
  list renderer (`code/tamagui.dev/components/UL.tsx` and `LI.tsx`, wired through
  `code/tamagui.dev/features/docs/MDXProvider.tsx`) and give list items real indentation and marker
  alignment. Nested lists must indent further. Fix it in the renderer so every docs page benefits.
- **Stray large gap above the `Portal` heading.** Track down what inserts it (likely a `<Notice>` or
  heading margin rule) and remove it.
- **Remove the `# Native Integrations` h1.** The page already gets its title from frontmatter. No
  docs page should render its own h1. Check whether other pages do this too and remove those as well.
- **Never use a package name as a heading.** `## @tamagui/native Package` becomes something like
  `## Setup`. Same rule anywhere else in the docs.
- Keep the install snippet, just not as the section title.

### 4. Merge the native docs into one place, linked from both sections

The Native page should be reachable from the UI docs sidebar AND the core/style docs sidebar. Add it to
both sections in `docsRoutes.tsx`. Also fold in the native optimized-runtime story: the package is
`@tamagui/native-registry` (`code/core/native-registry`), described as "zero-re-render style updates via
Fabric ShadowTree commits". Document it on this page under its own section and mark ONLY that section
experimental. The component integrations (portal, gesture handler, menus, toast, gradient) are not
experimental, so do not carry an experimental banner over the whole page.

DO NOT merge the `@tamagui/native-registry` npm package into `@tamagui/native` yet. It is a Nitro native
module with C++, an Android gradle project and a podspec, and folding it into `@tamagui/native` would
force every consumer of the JS-only setup helpers to autolink a native module. That decision is pending
with the owner. Docs merge only.

### 5. Rename the Z-Index page

`/ui/z-index` title becomes `Stacking (zIndex)`. Update the frontmatter title, the `docsRoutes.tsx`
entry, and any inbound links. Keep the URL.

### 6. New `Base` sidebar section

In `docsRoutes.tsx`, the `ui` section currently has an untitled top group holding Install, Stacks,
Surface, Headings, Text, Native, Z-Index. Restructure to:

- Top untitled group keeps the general guides: `Install`, `Native`, `Stacking (zIndex)`.
- New group labeled `Base`, placed directly ABOVE the `Forms` group, containing:
  `Stacks`, `Surface`, `Headings`, `Text`, `ScrollView`, `Group`, `FocusScope`.
- Remove `ScrollView`, `Group`, `FocusScope` from the `Functional` group.

### 7. RovingFocusGroup

Investigate whether `RovingFocusGroup` (`code/ui/roving-focus`) should be documented inside the
FocusScope page rather than as its own sidebar entry. Look at what Base UI does for the equivalent
(it has a `Composite` primitive for roving focus, separate from focus trapping). Read
`code/ui/focus-scope/src` and `code/ui/roving-focus/src` and decide from the actual APIs: focus
trapping and arrow-key roving are different concerns, so if they are genuinely separate, keep them
separate and say so. If you merge them, put RovingFocus as a section on the FocusScope page and keep a
redirect from `/ui/roving-focus`. Report your reasoning either way. Do not delete the package.

### 8. Remove `elevation` entirely

The `elevation` variant on stacks (`code/ui/stacks`, and wherever `elevation` is declared as a variant
or expanded in `code/core/web/src/helpers/expandStyle.ts`). Remove the implementation, the types, the
docs (`code/tamagui.dev/data/docs/components/stacks/*.mdx` props table), and every internal usage in
`code/tamagui.dev`, `code/demos`, `code/sandbox`, `code/kitchen-sink`, and the starters under
`code/starters` (skip anything under a `build/` or `dist/` directory, those are build output). No
backwards compat, no deprecation warning. Replace internal usages with an explicit `shadow`/`boxShadow`
token where the visual mattered, and just drop it where it did not. Run `bun run typecheck` at the
repo root when you are done.

### 9. Remove the Styled / Unstyled / Headless tab switcher from docs pages

Four pages carry a `<Tabs id="type" defaultValue="styled">` three-way switcher at the top:
`checkbox`, `radio-group`, `switch`, `tabs` (the `3.0.0.mdx` files, and the older versioned files
should be left alone since they document shipped versions). Remove the switcher from the 3.0.0 files
only. Keep the styled demo as the hero. Where the headless variant is genuinely useful, show it as a
plain code block in the Usage section further down the page instead of as a hero tab.

### 10. Spacing regressions

- The `Highlights` / Features bullet list (`code/tamagui.dev/features/docs/Highlights.tsx`) has far too
  much gap between items and between the list and its title. Tighten both.
- The `View source` / `View on npm` / `Report an issue` row at the bottom of component pages has too
  much gap. Find it (likely `code/tamagui.dev/features/docs/DocsPageFrame.tsx` or a component page
  layout) and tighten it.

### 11. Version picker chevron

`code/tamagui.dev/features/docs/DocsVersionPicker.tsx` (and/or `SourceVersionSwitcher.tsx`): the version
select is missing its chevron. Restore it.

### 12. `CONTENTS` right-rail styling

`code/tamagui.dev/features/docs/DocsQuickNav.tsx`: the `CONTENTS` label and the vertical rule running
down the left of the list are both too loud. Make both noticeably subtler (a lower-contrast color
token), in both light and dark.

## Validation you must do

- Run the site: `cd code/tamagui.dev && bun run dev`.
- Load every page you touched in headless playwright and screenshot it. For `/ui/native` specifically,
  screenshot before and after so the bullet indentation fix is visible.
- `bun run typecheck` at the repo root after the elevation removal and the elements deletion.
- At repo root: `bun run lint` and `bun run check`. `bun run check` runs knip and will catch an orphaned
  file left behind by the package deletion. Fix findings in files you touched; report ones you did not.

## Reporting

Label every causal claim RAN / TESTED / INFERRED / GUESSED. Commit narrowly with explicit pathspecs,
one-line messages, `docs:` or `site:` prefix (these should not hit the changelog) except the elevation
removal and the elements deletion which are real breaking changes and should read
`feat(stacks)!: remove elevation` and `feat!: remove @tamagui/elements`. Pull with
`git fetch && git merge --ff-only origin/v3-beta` before committing. Push when green. Report back with
what changed, files, validation, and what is still open.
