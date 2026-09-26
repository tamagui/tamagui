# Finish the v3 beta: tonight's plan (2026-09-14)

State at 19:47: `v3-beta` tip `e1dc4862de`, tree clean, Checks green on the
last full run (`plans/v3-beta-checks-result.md`), latest npm beta 3.0.0-beta.1313.1.
Today produced five spec documents and two code commits (RN prop deprecation
JSDoc in `styleTypes.ts`, `userSelect` to native `selectable`). Everything
else from today is still paper. This is the list that turns it into code, in
the order it should land, with what is deliberately deferred.

## Status of today's plans

| Plan | Landed | Left |
| --- | --- | --- |
| html.* gets a web-only style contract, View/Text keep RN (`html-architecture-and-rsd-report.md` s3) | not landed. `d02dc01467` put `@deprecated` on `dom/styleTypes.ts`, but only `dom/standalone.ts` reads that file; `dom/html.tsx` still types every tag with `TextStylePropsBase` / `StackStyleBase` from `types.tsx`, which are RN `ViewStyle` / `TextStyle` | make `html.tsx` type against `dom/styleTypes.ts` with the RN keys removed (not deprecated), leave View/Text on the RN types; stop html.* borrowing `viewStaticConfig` / `textStaticConfig` |
| `web-alignment-steps.md` step 1 (canonical web types, deprecate RN keys) | JSDoc deprecations only, on the standalone-only file | `direction`, `verticalAlign` mapping to native; remove `includeFontPadding` from the html.* types |
| step 2 (shorthand and logical expansion) | logical props and `inset` already expand in `expandStyle.ts` | verify multi-value strings (`margin: "10px 20px"`, `gap: "10px 20px"`) on native; add if missing |
| step 3 (`tamagui migrate --web-align` codemod) | nothing | defer past beta; document the renames in the upgrade guide instead |
| step 4 / 5 (html.* as primary, positioning copy) | nothing | docs only, one pass |
| Opus review: CSSOM discovery | rejected | drop from master spec |
| Opus review: reset to `:where()` CSS, html.p/h1/pre render inline bug | nothing | fix the inline bug tonight; scope the reset rule to an html.* class |
| Opus review: package split web -> core -> ui -> tamagui | nothing | defer past beta; fix the spec diagram |
| Opus review: function children | rejected | nothing |
| `typed-user-sizes.md` | rejected | replaced by `remove-size-concept.md`, lands tonight |

## Lanes (three workers, one reviewer)

Each lane is a worktree under `~/.worktrees/tamagui-<slug>` off a fresh
`origin/v3-beta`, merges back to `v3-beta` when its gate passes. `REVIEW: one
review of lane A by another model when it finishes; B and C get checks and
runtime validation only.`

### A. Remove the size concept (`remove-size-concept.md`)

Owner: md group, this is mechanical but wide. Does NOT own docs copy beyond
deleting size sections, and does not touch html.* or the reset.

Gate: root `lint`, `check`, `typecheck`; kitchen-sink Button/Input/Select/Switch
screenshots unchanged; `registry:check` green.

### B. html.* web contract, display bug, scoped reset

Owner: md group. First give html.* its own contract: `dom/html.tsx` types
every tag from `dom/styleTypes.ts`, with `elevation`, `marginHorizontal`,
`marginVertical`, `paddingHorizontal`, `paddingVertical`, `shadow*`,
`textAlignVertical`, `includeFontPadding`, `writingDirection` removed from
that file rather than deprecated. View and Text stay on `StackStyleBase` /
`TextStylePropsBase` in `types.tsx`, untouched. html.* hosts stop spreading
`viewStaticConfig` / `textStaticConfig` and get their own static config, which
is what fixes html.p, h1..h6, pre rendering `display: inline` because
hosts carry `is_Text`/`is_View`. Give html.* hosts their own class, generate
`:where(.<class>)` reset rules from the tag display table, remove
`DISPLAY_WEB_RESET` from `generate-html.ts` and `compilerHost.ts`, keep
semantic tag defaults as atomic defaults. Does NOT own the package split or
codemods.

Gate: SSR plus computed-style web test for `p`, `h1`, `span`, `button`, `pre`
asserting web display values; kitchen-sink html cases visually unchanged.

FLAG(decision): the zero-specificity reset means page CSS like `p { margin: 1em }`
reaches html.* on web and not on native. Opus recommends accepting and
documenting it. Lane B proceeds on that assumption unless Nate says otherwise.

### C. Web alignment leftovers and docs

Owner: md group. Native mapping for `direction` and `verticalAlign`; verify
multi-value `margin`/`padding`/`gap` strings expand on native and add the
expansion in `expandStyle.ts` if not; remove `includeFontPadding` from the
public types; one docs pass framing html.* and styled() as the entry points
and listing the RN key renames in the upgrade guide (replaces the codemod for
beta). Correct the master spec: drop CSSOM discovery, fix the ui -> core
dependency diagram, fix the grid formula, note the View -> html.div codemod
must emit `display="flex" flexDirection="column"`. Does NOT touch size or html
reset code.

Gate: native unit tests for the three mappings; `lint`, `check`.

## Merge order

A, then B, then C. After each merge: root `lint`, `check`, `typecheck`, then
push `v3-beta` and read the Checks run once (`plans/v3-beta-checks-result.md`
has the lanes to expect). A red Checks run is fixed on a branch, never on the
tip.

## Deferred past beta, on purpose

- Package split (`@tamagui/web` slimming, html-div size gate, `@tamagui/native`
  out of web's graph, codemod of the 48 ui imports).
- `tamagui migrate --web-align` codemod.
- Full headless `@tamagui/ui` usable with a foreign style library; dropping
  `size` from primitives is the step toward it that ships now.
- PR #4124 (v3-beta into main) is open and conflicting. It is the eventual
  main merge, not a beta gate; resolve it when the beta is cut.

## Landed 2026-09-15

All three lanes are merged to `v3-beta`, plus the follow-up work their reviews
and CI turned up. Nothing is left on a branch, everything below is pushed.

| Work | Commits | Merged |
| --- | --- | --- |
| A. size concept removed (`remove-size-concept.md`) | lane tip `27b7fb391a`, review fixes `f5725d8b5d`, `b0faaf0731` | `f950341de8` |
| B. html.* web contract, display fix, scoped reset | lane tip `dee9212543` | `7041fbcbd7` |
| C. web-alignment leftovers and docs | lane tip `a864942add`, coverage `57abff6a01`, `d0049210c6` | `ef2f2aa1f6`, `93fd7cd0b0` |
| D. inherited-only leading reaches DOM text (CI unit-tests red) | `03a69978d8` | `b6273829ca` |
| E. size-removal fallout: slider orientation, kitchen-sink sizes, input type test | `43f6aadf48`, `e06052bdec`, `5e9c4862d9` | `0742f1a26b` |
| CI unblock: site typecheck, lockfile, webpack pin, registry copies, declarations, css, size baseline | `0e7bf80d46`, `1cf5daf95d`, `23eb160a22`, `83bac8d914`, `28a1068e3b`, `9fe7700110`, `af577cefd4`, `8da7f39d76` | on `v3-beta` |
| Detox: setup-android v4.0.1 (v3 fails `sdkmanager --licenses` on current runners) | `4369bade25` | on `v3-beta` |

Reviews: A reviewed C, B reviewed A (one finding withdrawn after it reproduced
only in that worker's stale clone), a fresh worker reviewed B and found nothing
blocking, and A's own findings became lane C's coverage commits. The final
cleanup pass found no leftovers.

The tip was red before any of this landed: v3-beta had been failing `checks`,
`unit-tests`, `v3-zero-runtime (starter)` and Detox since 19:54 the night
before, on commits this plan did not write.

Deliberate cost, recorded in `bundle-size-ledger.md`: the html.* reset is about
+98 bytes of gzip CSS per graph in the zero-runtime starter, paid even by apps
that never render an html.* element.

## Done means

- All three lanes merged to `v3-beta`. Done, SHAs above.
- Checks green on the tip. Done: `Checks` succeeded on `1d97170016`, with
  `Registry` and `Test iOS Native (Maestro)` green on the same push.
- npm beta published from that run. Done, automatically: the green Checks run
  triggered `Release`, whose `Publish v3 beta` job shipped
  `3.0.0-beta.1341.1` at 2026-09-15T12:50Z. Checked by content, not by version
  string: the published `@tamagui/core` has no `@tamagui/size` dependency and
  no `resolveSize` in its dist.
- `remove-size-concept.md` and this file marked landed with the SHAs. This
  commit.

Still red, on purpose and written down: `Native Tests (Detox)`.
`android-actions/setup-android@v4.0.1` is the newest tag the action has; it
accepts the SDK licenses on current runners but then runs `sdkmanager tools`,
which fails because the legacy `tools` package no longer exists in the SDK
repository. The fix is to stop using the action and accept licenses against the
runner's preinstalled SDK. Detox has been red since before this plan started
and is not part of the Checks gate or the publish path.
