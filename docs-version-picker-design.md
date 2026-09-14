# Docs Version Picker Design

## Current State

- Component docs are versioned by file name under `code/tamagui.dev/data/docs/components/<component>/<version>.mdx`.
- Intro, core, and guide docs are single files under `code/tamagui.dev/data/docs/{intro,core,guides}`.
- Tailwind docs are a route variant. `/tailwind/...` re-exports the normal docs routes and flips code examples through the `tailwind` MDX transform.
- The visible source-version picker only appears inside component `Highlights`, so pages without component highlights cannot switch versions.

## v1 Content Audit

- v1 component content exists in the current repo for many components as `1.x.mdx` files.
- v1 intro/core/guide content is not present as versioned files. It is recoverable from git history, but the current docs tree replaced those files in place during the v2 docs refresh.
- The docs versioning pattern appears in the v2 docs rewrite around `51bc677683 docs: update documentation and site for v2`; older intro/core/guides were not copied into a versioned archive then.

## Goals

- Put one version/syntax picker in the docs header area for all docs routes.
- Keep canonical latest URLs unchanged:
  - `/ui/sheet`
  - `/docs/intro/styles`
  - `/docs/core/tokens`
  - `/docs/guides/how-to-upgrade`
- Keep source-version URLs for component docs:
  - `/ui/sheet/2.0.0`
  - `/ui/sheet/1.0.0`
- Use query parameters for docs sets that do not have route-level versioned files yet:
  - `?version=v2`
  - `?version=v1`
  - `?syntax=tailwind`
- Treat Tailwind as a syntax dimension of v3, not as a separate docs universe. The `/tailwind/...` routes should continue working, but the picker should link to the same content model.

## Data Model

Add a small docs-version helper module:

- `DOCS_VERSIONS = ['v3', 'v2', 'v1']`
- `DOCS_SYNTAXES = ['tamagui', 'tailwind']`
- `getDocsVersionState({ pathname, search })`
  - Returns `{ version, syntax, canonicalPath, isComponentDoc, sourceVersion }`.
  - Component docs derive `sourceVersion` from the URL segment or latest version file.
  - Non-component docs derive `version` from `?version=...`, defaulting to `v3`.
- `getDocsVersionHref({ pathname, version, syntax })`
  - Preserves the current page when possible.
  - For component pages, maps v3 to `/ui/<name>` when `3.0.0.mdx` exists, v2 to `/ui/<name>/2.0.0`, and v1 to the newest `1.x` file.
  - For intro/core/guides, sets or removes `?version=...`.
  - For tailwind syntax, sets `?syntax=tailwind` on normal docs URLs and keeps `/tailwind/...` routes as backwards-compatible aliases.

## Routing Plan

1. Add optional version-aware slug helpers in the docs loaders.
2. Keep existing route files, but pass version/syntax state to `DocsPageFrame`.
3. Move the picker into `DocsPageFrame`, above page content and beside the quick-nav area on desktop.
4. Keep the existing component picker only as a compatibility wrapper or remove it from `Highlights` to avoid duplicate controls.
5. Add seed v3 component docs for APIs that changed in v3:
   - Sheet
   - Dialog
   - Popover
   - Select
   - FocusScope
6. Leave full v1 intro/core/guide resurrection as follow-up content work. The picker can show v1/v2 for those routes, but if a page has no archived file it should render the current page with a small "latest available content" note rather than 404.

## Verification

- Header picker on a component page: `/ui/sheet`.
- Header picker on an intro page: `/docs/intro/styles`.
- Tailwind syntax variant: `/docs/intro/styles?syntax=tailwind` and `/tailwind/intro/styles`.
- Confirm source links and edit links point to the resolved MDX file.
- Capture Playwright screenshots for the three paths above.
