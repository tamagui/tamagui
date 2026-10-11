# Task brief: `settings.optimizeFor` — first-render vs updates (v3-beta)

Branch: `v3-beta`. Work in this checkout (`/Users/n8/tamagui`), no worktree.
Other agents are active in this checkout: stage/commit ONLY files you author,
with explicit pathspecs (`git add a b && git commit -m "..." -- a b`). Never
`git reset` / `stash` / `checkout .`. Do not push or release.

## Goal

Add a Tamagui setting:

```ts
optimizeFor?: 'updates' | 'first-render'
```

- `'updates'` (current behavior, default on web): granular per-component
  theme/media subscriptions so theme and media changes re-render only the
  components that used the changed values.
- `'first-render'` (recommended default on native, but do NOT flip any default
  in this task — add the setting only, both platforms default to `'updates'`):
  skip as much per-render subscription/tracking machinery as possible. Theme
  or media changes may re-render more broadly (e.g. everything under the
  provider/root), but each component render does dramatically less work and
  runs fewer hooks-adjacent allocations.

Ship it only if the win is real: the acceptance bar is a measurable reduction
in per-component render work in the `'first-render'` mode (see Validation).
If after implementation the profiler shows no meaningful delta, report that
honestly instead of shipping a no-op setting.

## Why this exists

v3 landed the automatic half of this tradeoff already:

- lazy theme subscription (`aeded02b11`) — components don't subscribe until a
  theme value is actually read via the tracking proxy
- manual useReducer+useEffect theme store (`dd3eceb8b6`)
- one tracking Proxy per component, stabilized closures (`040caa316d`)
- over-render guard test in `code/core/core-test` (`b6b0097f61`) — keep it green

What did NOT land is the explicit opt-out: even a component that never causes
a granular update still pays for the tracking proxy plumbing, the keys-read
bookkeeping, the subscription decision logic, and media key tracking on every
render. `'first-render'` should skip that work wholesale.

## Where the work is

All in `code/core/web/src` (native shares this code):

- `src/types.tsx` — `GenericTamaguiSettings` (~line 1115). Add `optimizeFor`
  with full TSDoc explaining the tradeoff. Existing perf settings nearby for
  style reference: `fastSchemeChange`, `disableSSR`, `mediaQueryDefaultActive`.
- `src/hooks/useThemeState.ts` — subscription machinery;
  `shouldSubscribeToTheme` at ~line 252, subscribe branch ~line 166. In
  `'first-render'` mode, don't do per-key tracking; subscribe (cheaply,
  unconditionally or at the root) so theme changes still work, just coarsely.
- `src/hooks/getThemeProxied.ts` — the tracking-getter Proxy (built ~line 110,
  cached per-theme at ~line 78). In `'first-render'` mode return the plain
  theme object (or a non-tracking cheap wrapper) instead of the tracking proxy.
  Careful: the proxy also handles `$`-prefixed keys / `.get()` /`.val` access
  conventions — whatever you return must keep the public `useTheme()` API
  identical. Behavior parity of the returned values is required; only the
  *tracking* should disappear.
- `src/hooks/useMedia.tsx` — per-key media tracking (keys-touched bookkeeping,
  `useSyncExternalStore`-style granular updates). In `'first-render'` mode a
  component should subscribe to media at whole-object granularity (or root),
  skipping the per-key touched-set allocation and comparison work.
- `src/hooks/useComponentState.ts` + `src/createComponent.tsx` — check what
  per-render work exists purely to support granular updates and gate it.

Read the setting once via the same pattern other settings use
(`getSetting('optimizeFor')` — see `src/config.ts` / existing `getSetting`
usages). It is a startup-level setting: it's fine to read it lazily at
first render, but do not support flipping it at runtime — document that.

Rules of engagement (from repo contract):

- Hooks order must be identical between the two modes — same hooks called,
  they just do less work internally. No conditional hook calls keyed on the
  setting (it can't change at runtime, but keep the code shape uniform anyway
  so fast-refresh and lint stay happy).
- KISS, one path per mode, no feature-detection forks beyond the single
  setting check. Lowercase comments.
- Rebuild after edits: `cd code/core/web && bun run build` (or run
  `bun run watch` at repo root in the background).

## Validation (required, in order)

1. `cd code/core/web && bun run build` clean; then repo typecheck of
   dependents you touched.
2. Existing tests: `cd code/core/core-test && bun run test` (or the repo's
   test script — read package.json, don't guess). The over-render guard test
   from `b6b0097f61` must stay green in default (`'updates'`) mode.
3. Add a test: with `optimizeFor: 'first-render'`, `useTheme()` values and
   media queries still resolve correctly, and a theme change still visually
   applies (coarse re-render is fine and expected).
4. Measure: `code/comparisons/profile-getsplitstyles.ts` harness
   (`cd code/comparisons/tamagui-bench && EXTRACT=0 npx vite --port 9106`,
   scenarios `simple|rich|heavy`). Record before/after numbers for both modes
   in your handoff. The bar: `'first-render'` should show a clear per-render
   win vs `'updates'` on the theme/media-using scenarios; `'updates'` mode
   must show zero regression.

## Handoff

Commit on `v3-beta` with a one-line conventional message, explicit pathspecs.
Then send one compact agentbus message to your manager (session
`ab-mrjsawij-54337`): outcome, files changed, before/after numbers, honest
gaps. Also append a short results section to `plans/v3-perf.md` under Lane A.
