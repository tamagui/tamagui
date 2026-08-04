# Five pre-existing kitchen-sink component failures on v3-beta

Handoff. These five playwright tests fail on `v3-beta` and were **not** caused by
the main -> v3-beta sync. Nobody owns them. They are component-level (button
skins, dialog scoping, sheet adapt), which is what a tester touches in the first
ten minutes, so they rank above most of what is left in the beta cut.

## The five

All in `code/kitchen-sink/tests/`, all on the `default` playwright project:

| test | file:line |
| --- | --- |
| a styled child merges its own definition of a parent variant | `ButtonUnstyled.test.tsx:28` |
| applies circular and explicit token sizes from the copied skin | `ButtonSkin.test.tsx:106` |
| scoped dialogs work | `DialogScoped.test.tsx:9` |
| dialog scopes are isolated | `DialogScoped.test.tsx:43` |
| content is visible in dialog at wide viewport | `DialogSheetAdaptResize.test.tsx:15` |

Each fails on its first attempt and again on retry, so they are deterministic,
not flaky.

Run them with:

```sh
cd code/kitchen-sink
NODE_ENV=test npx playwright test --project=default --reporter=list \
  tests/ButtonUnstyled.test.tsx tests/ButtonSkin.test.tsx \
  tests/DialogScoped.test.tsx tests/DialogSheetAdaptResize.test.tsx
```

## Why the sync is ruled out

An A/B on every file the sync changes that is in kitchen-sink's runtime path:
`code/core/web/src/config.ts` (the `getTokenObject` rework),
`code/core/web/src/_withStableStyle.tsx`, and
`code/compiler/static/src/extractor/concatClassName.ts`. Reverted all three to
`4ac01cd6e7`, rebuilt `@tamagui/web` + `@tamagui/core` + `@tamagui/static`, re-ran
the same tests, restored.

Both arms failed on the same five. `ButtonSkin` is the interesting one: it is the
"token sizes" test and `getTokenObject` is the token resolution path, so it was
the strongest suspect, and it fails identically with the change reverted.

The sync's only other kitchen-sink change is one new usecase
(`TooltipStaticClobberCase`) plus a single added line in `usecases/index.web.ts`;
that registry file was diffed against v3-beta and loses no registration.

A sixth test, `InputRef.test.tsx:21`, failed once in one arm and passed on retry.
That is a flake, not a finding.

## Rules for anyone running this suite

**Never judge `OnLayoutStress.test.tsx` under load.** Its four tests assert
`IO delay should be < MAX_IO_DELAY_MS` and callback counts after fixed
`waitForTimeout` budgets. They are perf gates. They were run at 2.9% idle on a
three-agent box and all four failed, which says nothing about the code. Check
idle from the busiest of several `top -l 2` samples before trusting them. Every
other kitchen-sink failure here is deterministic and tolerates load fine.

**Kill the webpack dev server between runs.** Playwright starts its own on port
9000 and refuses to run if one is already listening:
`Error: http://localhost:9000 is already used`. This killed a whole A/B run,
where both arms exited 1 without executing a single test. Two matching non-zero
exits that mean nothing look exactly like a clean null result. Either check
`lsof -nP -iTCP:9000 -sTCP:LISTEN` first, or set `REUSE_SERVER=1`.

**`@tamagui/core` ships bundled dist that inlines `@tamagui/web`.** Building with
`--filter=@tamagui/web` alone leaves `code/core/core/dist/native.cjs` and
`test.native.cjs` holding the old inlined copy, and everything importing
`@tamagui/core` silently loads stale code. This cost an hour: a source change was
verified present in `web/dist` while a runtime probe dumped the old function body
out of the loaded module. Any A/B on a `core/web` source file must rebuild both
packages, or it will measure the old artifact and report that the change did
nothing.

**A fresh worktree needs `bun install` twice.** Workspace bin links are only
created once the packages have a `dist`, so `install` -> `build` -> `install`.
Otherwise `bun run check` dies with 127 on `./node_modules/.bin/tamagui`.
`.github/actions/install` does exactly this.

**Builds and test runs dirty the working tree.** A root build deletes
`code/packages/build/__tests__/fixtures/subpath-only-package/types/feature.d.ts`
(harmless, its test rebuilds it) and rewrites several `tamagui.generated.css`
files; the `next-turbopack` suite rewrites its own `src/` fixtures. Restore them
rather than committing them.

## Related, not part of this

Also pre-existing on v3-beta and owned elsewhere:

- `static-tests` `domCompiledRuntime.native`, `expected 'white' to be
  'rgba(255,255,255,1)'`. Routed to the engine lane. The sync's `getTokenObject`
  change was cleared as a cause by the same A/B method.
- `next15-plus-cli-optimize` `tests/exports.unit.test.ts` x2. The received output
  gains `font_heading`/`font_body` classes, a shared `_ff-` hash across both
  families, extra font longhands on the `h1`, and a changed `_c-` hash. That
  pattern is consistent with the v6 font and palette migration rather than with
  the compiler nondeterminism this test has a history of. Do not refresh those
  snapshots without settling that first.
- `@tamagui/expo-router-starter` `test:web`. Root-caused elsewhere: the starter's
  `app/(tabs)/_layout.tsx` still reads v5 keys (`theme.red10.val`,
  `theme.borderColor.val`) while its config is `@tamagui/config/v6`.
