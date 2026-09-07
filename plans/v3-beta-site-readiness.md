# V3 beta site readiness

Surveyed 2026-09-07 against `af69016eaac955ee6068f5e5fd1c339f13350d92`.
The site fixes in this change are ready for review; the branch still needs its Sheet
CI failures resolved before a release recommendation.

## Remaining release work

1. Fix the current Sheet failures and obtain green Checks on the assembled candidate.
   [Checks 34007826277](https://github.com/tamagui/tamagui/actions/runs/34007826277)
   failed on the surveyed SHA. The readiness worker read failures in:
   - `code/sandbox/tests/sheet-late-open.test.ts`
   - `code/sandbox/tests/sheet-unmount-when-hidden.test.ts`
   - `code/kitchen-sink/tests/SheetWebKeyboard.test.tsx`
   - `code/kitchen-sink/tests/SheetWebKeyboardAutoFocus.test.tsx`
   - `code/kitchen-sink/tests/SheetDragResist.animated.test.tsx`

   These are CI observations, not a diagnosis that the tests or Sheet implementation
   is at fault. Reproduce them before choosing a fix. Do not relax the assertions.
   [Detox](https://github.com/tamagui/tamagui/actions/runs/34007826463),
   [Maestro](https://github.com/tamagui/tamagui/actions/runs/34007826416),
   [Registry](https://github.com/tamagui/tamagui/actions/runs/34007826275), and
   [LSP Binaries](https://github.com/tamagui/tamagui/actions/runs/34007828715)
   passed on the same SHA.

2. Complete the separate LSP release if it is part of the beta promise.
   `npm view @tamagui/lsp version --json` returned E404 at survey time;
   `@tamagui/lsp-darwin-arm64` returned `0.0.0-bootstrap.0`. This only verifies
   that one platform leaf, not the other seven. `.github/workflows/lsp-build.yml`
   owns the release order: all eight platform packages, then the umbrella.
   It requires an explicit dispatch with `publish: yes`, and user release approval.

3. Cut the beta after the assembled candidate passes Checks. The user authorized
   the beta release, upgrading Team Machine to it, and publishing the resulting OTA.
   The active `.github/workflows/release.yml` publishes automatically when Checks
   succeeds for a push to `v3-beta`. Validate fixes on a review branch first.

## Fixes in this change

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
  focus can reopen popovers and tooltips.
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

Prefer the concrete CI and package-release work above to another broad refactor before
beta. The docs navigation now has one source of syntax authority, and the engine fixes
address the observed SSR and keyboard failures directly.

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

The worker's broad default kitchen-sink run still had 14 Sheet failures, one SelectSkin
retry, 5 skips, and 689 passes. It used the earlier popup fix; the final focused suites
above validate the corrected dismissal behavior. The Sheet failures remain release work.
