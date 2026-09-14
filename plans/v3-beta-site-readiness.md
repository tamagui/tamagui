# V3 beta site readiness

Surveyed 2026-09-07 against `af69016eaac955ee6068f5e5fd1c339f13350d92`.
The assembled candidate fixes the observed site, SSR, keyboard, and Sheet failures.
The user authorized the beta release, upgrading Team Machine to that exact version,
and publishing its OTA. Merge after the candidate passes CI. The active release
workflow publishes automatically when Checks succeeds for a push to `v3-beta`.

## Release boundary

The LSP has a separate release workflow if it is part of a later release promise.
At survey time `@tamagui/lsp` returned E404 and `@tamagui/lsp-darwin-arm64` returned
`0.0.0-bootstrap.0`; the other seven leaves were not checked. Its workflow publishes
all eight platform packages before the umbrella. This beta does not include that
separate release.

## Fixes in this change

- Keep the web Sheet drag surface at `flexBasis="auto"` so fit-height content is
  measured instead of collapsing to zero and remaining offscreen.
- Point SVG package metadata at the built ESM/CJS files and resolve sibling Bento
  imports through the site's declared dependency roots.
- Give all docs syntax modes the same shell and picker. Use URLs as syntax authority,
  including query canonicalization before static HTML selection. Preserve syntax in
  internal links, browser history, and transformed code.
- Widen the article area, reduce prose and sidebar spacing, wrap mobile bundler cards,
  and align package-manager tabs with a single Copy button.
- Put tab label font styles on Text and consume icon-only props before rendering a View.
- Restore roving focus across Tabs, ToggleGroup, and RadioGroup, including the missing
  `asChild` focus/blur forwarding. Server HTML exposes the group as the entry stop.
  Preserve actual popup dismissal reasons so Escape stays closed and ordinary keyboard
  focus can reopen popovers and tooltips. Ordinary popovers open on activation;
  hoverable popovers and explicit `disableFocus={false}` retain focus-open behavior.
- Let inherited theme scopes follow the document scheme before hydration. Explicitly
  authored schemes remain scoped, including nested same-scheme themes. Runtime and
  compiler-generated theme classes follow the same rule.
- Preserve CSS variables in web inline styles, so production output responds to the
  document theme without hydration. Explicit literal resolution for animation drivers
  and native resolution remain supported.

## Follow-up worth investigating

The installed `@vxrn/color-scheme` implementation stores `forceScheme` in module-level
state during provider rendering. That suggests a possible concurrent SSR request leak,
but no concurrent-request probe was run and this site does not pass `forceScheme`.
Test it upstream in One before adopting that API for request-specific themes.

## Local validation

- Root `bun run lint`, `bun run check`, and `bun run typecheck` pass.
- Core web suite: 630 passed, 3 existing skips. Native style resolver: 17 passed.
- Theme scope regressions: 10 passed, including embedded providers and changing an
  explicit same-name theme back to inheritance. Compiled zero-runtime themes: 6 passed.
- Kitchen-sink focused browser suites: 22 passed with retries disabled (roving focus,
  tab text sizing, focus scope, and dismissal stacking).
- Production site: 24 browser checks passed across the full run and the corrected
  homepage accessible-name selectors. Coverage includes all docs syntax modes,
  transformed code, SPA navigation/history, query redirects, clipboard contents,
  homepage SSR/keyboard behavior, and dark styles before and after hydration.
- Production build generated the homepage and docs route set (784 static routes).
- Styled-view bundle on pinned Node 24.16.0: 28,821 gzip bytes, passing the unchanged
  28,821-byte ceiling. The corrected implementation also removes a redundant resolver
  cache check and avoids splitting a theme name repeatedly for wrapper classes.

- Sheet fix: the two sandbox regressions passed after failing on the baseline;
  14 WebKit Sheet checks, 94 default/CSS checks, and 117 Reanimated/Motion checks
  passed with retries disabled. The suites retained their existing skips.
- Registry generation and strict drift validation pass for all 44 blank-app copies.
- Popover keyboard follow-up: 54 Popover/Tooltip checks pass across the web
  animation drivers; Enter and Space assert the closed, focused state before opening.
  A runtime probe also verifies Tooltip keyboard focus, Escape, and focus reentry.
