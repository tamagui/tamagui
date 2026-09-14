# Tamagui v3 beta release-readiness audit

Branch: `audit/v3-release-readiness` based on `origin/v3-beta` at `1fb82c1856`
(`test(kitchen-sink): prevent Maestro overscroll under navigation bar`, Team-Machine-Session p43094).
Date: 2026-09-14. Method: read only. No product code changed, no checks executed,
no publish, tag, dispatch, push, or merge performed.

## Headline

All five CI lanes are green at the exact head `1fb82c1`, and the automatic beta
cut for that head has published: npm `tamagui@3.0.0-beta.1310.1` on dist-tag
`beta` (published 2026-09-14T02:27Z, after Release run `34798638325` succeeded).
There is no CI red left to fix for this head.

The beta is therefore shipped, but shipping is not the same as safe to support.
Four independent proofs are stale or missing at this head, and they are listed
as blockers below. Everything else is a follow-up.

## How the beta cut works (verified from current source)

* `.github/workflows/release.yml` (both branches carry the trap comment: GitHub
  evaluates `workflow_run` from the default branch, so the `on:` block and the
  `beta` job must match `main` for the automation to run what `v3-beta` says).
* On every green `Checks` push run for `head_branch == v3-beta`, the `beta` job
  publishes automatically. No human dispatch, no version commit, no tag back to
  `v3-beta` (docs `scripts/v3-release-dry-run.md` confirms: no version commit
  or tag is written back).
* Version is `3.0.0-beta.<GITHUB_RUN_NUMBER>.<GITHUB_RUN_ATTEMPT>`
  (release.yml `candidate` step). Dist-tag resolves to `beta` via
  `scripts/release-publish-tag.ts` (`3.0.0-beta.N` label `beta` is in
  `KNOWN_PRERELEASE_TAGS`; unknown prereleases throw rather than fall through
  to `latest`). Observed npm state matches: `latest` 2.7.7, `beta`
  3.0.0-beta.1310.1.
* There is no manual user-gated beta publish command in current source. The beta
  is automatic. Any manual `bun scripts/release.ts --beta ...`, workflow
  dispatch, or tag push is a release and needs the user's direct explicit
  permission every time (release skill). This audit states no such command.
* The verified no-publication preview path is the G1 harness, which has no
  publish code path and only writes commands (`scripts/v3-release-dry-run.ts`
  `--release-preview`; help text: "Verify everything, write publish commands,
  and STOP before publish"):

```sh
bun scripts/v3-release-dry-run.ts \
  --base <release-staging-base-sha> \
  --canary <g0-canary-dir> \
  --packer npm \
  --release-preview \
  --version 3.0.0-beta.0 \
  --tag beta
```

`scripts/release.ts --dry-run` also skips install, build, checks, version
writes, and publish per its flag gates (lines ~464-525), but the G1 harness is
the path whose help contract promises no publish execution path at all.

## CI receipts at head `1fb82c1` (all 2026-09-14, all `completed/success`)

* Checks push `34797686413` (16m32s): changes, grammar-conformance, checks,
  playwright-browsers, v3-zero-runtime fixture, v3-zero-runtime starter,
  v3-ssr-hydration, unit-tests, integration-tests 1/3 2/3 3/3,
  integration-tests-webkit. Proof: `gh run view 34797686413 --repo
  tamagui/tamagui --json jobs`.
* Test iOS Native (Maestro) push `34797686755` (30m41s): Build, Run Maestro
  Tests (iphone-17, exports=true). Proof: `gh run view 34797686755 ...`.
* Native Tests (Detox) push `34797686810` (34m39s): Build Android App, Build One
  Production Native Bundles, Validate iOS Detox Shards, Build iOS App, iOS
  Detox 1/4 2/4 3/4 4/4, Android Detox Tests.
* Registry push `34797686513` (1m50s): web, expo, generate.
* LSP Binaries workflow_dispatch `34799678814` (5m53s): all eight targets
  (darwin-arm64/x64, win32-arm64/x64, linux x64/arm64 gnu, linux x64/arm64 musl)
  plus publish to npm.
* Release workflow_run `34798638325` (18m49s, headBranch main per the
  documented `workflow_run` misdirection): Publish v3 beta success, Dispatch
  the language server beta success, canary/stable jobs skipped.
* Worker evidence: p42653 (`v3-checks-repairs`, scope tamagui-v3-beta) repaired
  strict types, font/button contracts, create-tamagui picker, zero-runtime
  baselines, borderStyle parity, Tailwind brand descendants, TS7 gates, native
  font metrics, and drove the branch from red to 25/26 with Maestro cancelled.
  p43094 (`tamagui-v3-maestro-ci`) root-caused the Maestro red to
  `centerElement: true` overshooting under the navigation bar, removed it from
  Sheet/Toast/AlertDialog/Select/Tabs flows, validated `maestro check-syntax`,
  pushed `1fb82c1`, and owned CI to terminal green (watcher w-c570, 34m39s).
  Maestro syntax proof: `~/.maestro/bin/maestro check-syntax` over
  `code/kitchen-sink/flows/` in that session.

## Release gate matrix

| Gate | Current receipt | Freshness | Missing evidence | Exact command or runtime proof | Owner surface | Dependency | Blocking |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Build (frozen install, force build, dist check) | Checks `checks` job green at head; p42653 ran `bun run build` + `scripts/measure.mjs` locally before pushing | 2026-09-14 (CI), 2026-09-13/14 (local reports) | No build log pinned in this report (single `gh run view --log-failed` fetch policy respected; job conclusion is the receipt) | `gh run view 34797686413 --repo tamagui/tamagui --json jobs --jq '.jobs[]'` | `package.json` scripts, `scripts/release.ts` build gate | None | No |
| Typecheck | Same `checks` job green; TS7 port commits `d6996740b9`, `02031355f6`, `00e4ab09e8`, `6fd983875a`, `57e9588ae2` at head | 2026-09-14 | Same as build (conclusion receipt, not log text) | Same as build | `bun run typecheck`, strict fixtures | None | No |
| Lint (oxlint plugin path) | Same `checks` job green; `253a77db5b` consolidated valid-flat-values coverage onto oxlint plugin path | 2026-09-14 | Same as build | Same as build | `bun run lint`, `eslint-plugin` consolidated path | None | No |
| Unit tests | `unit-tests` job green at head; p42653 reports 66 component tests, 20 core-web files / 98 assertions, 167 web tasks green locally before push | 2026-09-14 | Focused local counts are worker-reported, not re-fetched here | `gh run view 34797686413` (unit-tests: success) | `code/ui/components-test`, `code/core/core-test` | playwright-browsers job | No |
| Integration suites (web shards + webkit) | integration-tests 1/3 2/3 3/3 green, integration-tests-webkit green at head | 2026-09-14 | None | Same Checks run | `code/kitchen-sink` web tests | changes + playwright-browsers jobs | No |
| Native Detox iOS + Android | `34797686810` all 9 jobs green (iOS 4/4 shards, Android suite, both app builds, bundle build, shard validation) | 2026-09-14 | None | `gh run view 34797686810 --repo tamagui/tamagui --json jobs` | `.github/workflows/test-native.yml`, `code/kitchen-sink` Detox suites | App builds | No |
| Native Maestro iOS | `34797686755` Build + Run Maestro Tests green; root cause (centerElement overscroll) fixed in `1fb82c1` across 5 flows; syntax validated in p43094 | 2026-09-14 | None at head. Note: p42653-era run had this job cancelled; p43094 re-owned it to green | `gh run view 34797686755 ...`; flows diff `git diff e570c1c6e3..1fb82c1 -- code/kitchen-sink/flows/` | `.github/workflows/test-ios-native.yml`, `.github/scripts/run-maestro-flows.sh`, `code/kitchen-sink/flows/` | iOS app build | No |
| Registry (web / expo / generate) | `34797686513` all 3 jobs green | 2026-09-14 | None | `gh run view 34797686513 ...` | `.github/workflows/registry.yml`, shadcn skin sources | None | No |
| LSP binaries (8 targets + npm publish) | `34799678814` all 9 jobs green | 2026-09-14 | Dispatch used `workflow_dispatch`; the Release-run LSP dispatch for this head also succeeded | `gh run view 34799678814 ...` | `.github/workflows/lsp-build.yml`, `code/lsp` | Release beta version output | No |
| create-tamagui | p42653 reports picker test repaired, full suites 20/20 locally; Checks green at head | 2026-09-13/14 | Suite result is worker-reported; no standalone create-tamagui CI job enumerated at head | `ls code/core/create-tamagui` (exists); rerun owner suite before citing counts | `code/core/create-tamagui` | None | No (follow-up: pin receipt) |
| Zero-runtime CSS + style optimization | Both v3-zero-runtime jobs green at head (fixture via `bun run receipts`, starter via `node scripts/measure.mjs`); production CSS minified with gzip ceiling held (+0 bytes per p42653) | 2026-09-14 | Receipt JSON not re-read here; ceiling values live in CI artifacts | `gh run view 34797686413` (both zero-runtime jobs: success) | `code/tests/zero-runtime`, `code/starters/zero-runtime` | playwright-browsers job | No |
| Compiler output (grammar + static) | grammar-conformance green at head (generated Rust tables current, parser passes vectors) | 2026-09-14 | None | Same Checks run | `code/compiler`, Rust parser vectors | None | No |
| Web / native parity | Detox both platforms + Maestro iOS + web/webkit integration all green at head; p42653 corrected DOM borderStyle parity (`none`, `hidden`) | 2026-09-14 | Parity claim rests on suite greenness, not a dedicated parity report at head | CI runs above; `getSplitStyles` area had local uncommitted edits (see hygiene note) | `code/core/web/src/helpers/getSplitStyles.tsx`, native style resolution | Detox + Maestro + integration | No |
| V3 converter round trips | No receipt found at head | Stale: referenced in older plans, not in head CI job list | Converter round-trip pass/fail at `1fb82c1` | Owner to name the command (likely under `code/compiler` or codemod packages); run gated, not run here | Converter / codemod packages | None | **Blocker (evidence)** |
| Tokens, themes, media, borders, shadows | Recent fixes at head: borderStyle `none`/`hidden` parity, v6 brand theme descendants in Tailwind defaults, v6 native font branch metrics pin (`f329e4a2be`); Checks green | 2026-09-14 | No per-namespace gate output; correctness rests on unit/integration greenness | `git log --oneline origin/v3-beta -12` shows the fix commits | `code/core/config*`, `code/core/themes`, DOM/native style mapping | Unit + integration jobs | No (follow-up: enumerate namespace checks) |
| Animation namespaces | Reanimated driver fix history referenced in Aug readiness doc; no animation red at head | Mixed (fix older, greenness current) | No animation-specific receipt at head beyond suite green | Detox + integration green | `@tamagui/animations-reanimated`, removed `@tamagui/animations-moti` (rejected by G1 audit) | Detox device runs | No |
| Tailwind defaults | `6fd983875a`-era fix added missing v6 brand theme descendants to bundled Tailwind defaults; TS7 CLI resolution fixed | 2026-09-14 | Bundled-defaults diff not re-read here | `git show 57e9588ae2 --stat`-class inspection by owner | Tailwind default bundle, v6 scales | CLI tests (37 per p42653) | No |
| Package metadata + publish inclusion | `files` allowlist present (`src`, `types`, `dist`, platform shims); G1 audit rejects tests/fixtures/caches/traversal/missing export targets/undeclared deps/`workspace:` leakage and removed v3 packages | Current source | No G1 `release-preview.json` at head (see blockers) | `node -p "require('./code/ui/tamagui/package.json').files"`; G1 harness for the full proof | Every public `package.json`, `scripts/v3-release-dry-run-lib.ts` audit | G1 preview run | **Blocker (evidence)** |
| Version + dist-tag behavior | Verified: `3.0.0-beta.<run>.<attempt>` + `beta` tag; npm shows `beta` 3.0.0-beta.1310.1, `latest` untouched at 2.7.7; unknown prereleases throw | 2026-09-14 | None for the mechanism; per-package version uniformity across all 170+ packages proven only by the publish run itself | `npm view tamagui dist-tags --json`; `scripts/release-publish-tag.ts` | `release.yml` candidate step, `computePublishTag` | Green Checks + Release run | No |
| Changelog + docs | Upgrade guide exists (`code/tamagui.dev/data/docs/guides/how-to-upgrade.mdx`, 18 steps); July state doc and Sept 4 launch review exist but are assessments, one explicitly noting stale sections | Stale for release purposes | No beta changelog at head; no single current release narrative | `ls docs/` in this worktree (no root CHANGELOG.md) | `docs/`, `code/tamagui.dev/data/docs` | Owner sign-off on narrative | **Blocker (evidence)** |
| Downstream install into real apps | `code/tests/v3-canary` exists with G0 web/native contract (`g0:web`, `g0:native`, Metro iOS export + tariff-free install assertions); G1 harness copies canary to /tmp and installs staged tarballs with `TAMAGUI_PACKED_CANARY=1` | Harness current, last run receipt stale | No G0/G1 run receipt at `1fb82c1` (last packed preview cited: `b0bf3f7bef`, ~Aug, hundreds of commits behind) | G1 command quoted above; canary `ls code/tests/v3-canary` | `code/tests/v3-canary`, `scripts/v3-release-dry-run*.ts` | G1 serial lane (coordinator-gated heavy lane) | **Blocker (evidence)** |
| Supported platforms | iOS (Detox 4/4 + Maestro), Android (Detox suite + app build), web Chromium (3 shards), webkit, SSR/hydration, Expo (registry expo job) | 2026-09-14 | Android Maestro is not a claimed lane (Maestro lane is iOS); no new device-matrix claim beyond CI | Runs cited above | Workflows listed above | Device CI | No |
| Release mechanics integrity | Beta auto-cut succeeded for this head (`34798638325`); OIDC trusted publishing (no npm token); bootstrap script exists for the seven v3 names absent from main's release set (`bun scripts/bootstrap-v3-beta-oidc.ts`, plan then `--execute`) | 2026-09-14 (cut); bootstrap state unverified | Two verifications outstanding: (a) `on:` + `beta` job parity between `main` and `v3-beta` copies of `release.yml` (the documented silent-failure trap); (b) trusted-publisher + first-publish state of the seven v3 names | `git diff origin/main:.github/workflows/release.yml origin/v3-beta:.github/workflows/release.yml` (read only); `bun scripts/bootstrap-v3-beta-oidc.ts` plan output (read only, no `--execute` without owner) | `.github/workflows/release.yml` on both branches, npm trusted publishers | Actions health | **Blocker (verification)** |

## Plan to reach safe beta (ordered)

1. Verify `release.yml` main/v3-beta parity (read only, minutes): run the
   documented diff and confirm every hunk outside the `on:` block and `beta`
   job. If a hunk lands inside those regions, the automation is not running
   what `v3-beta` says, and that outranks everything below.
2. Confirm the seven v3 package names' npm bootstrap + trusted-publisher state
   (read only plan first): `bun scripts/bootstrap-v3-beta-oidc.ts` without
   `--execute`. The head already published `3.0.0-beta.1310.1`, so this is
   likely closed, but it has not been positively confirmed in this audit.
3. Rerun the G1 packed preview at the exact head through the serial heavy lane
   (coordinator-gated; not run here): G1 command above with the G0 canary.
   This closes package inclusion, tarball inventory, isolated install, ESM/CJS
   entrypoints, browser + react-native conditions, and G0 web/native in one
   receipt, and produces the exact publish commands for owner authorization.
4. Produce the V3 converter round-trip receipt at the head (bounded; owner
   names the canonical command).
5. Write the beta changelog entry and pin the single current release narrative
   (supersede July state doc sections the Sept 4 review already flagged stale).
6. Pin the create-tamagui 20/20 and per-namespace (tokens/themes/media/
   borders/shadows/animation/Tailwind) receipts by job name so the next audit
   cites CI, not worker reports.
7. Decide the disposition of open draft PR 4212 (`feat/v3-lineheight-multiplier`
   onto `v3-beta`): land before or explicitly after beta support starts, so it
   does not become an unreviewed delta on a supported line.
8. Plan the merge-back of `v3-beta` into `main`: 2335 commits ahead, 8 behind
   (merge-base `53672953b1`). Beta support is sustainable only with a dated
   merge-back or an explicit decision to keep the lines apart.

Desirable follow-ups (not beta-safety): refresh public performance claims to
match measured artifacts (28,797 gzip-9 bytes vs 28,821 ceiling; clause-string
nuance from the Sept corpus); keep the one-path docs promise for existing apps
(Config v5 first, v6 separately); local hygiene below.

## Hygiene notes (not blockers)

* The primary checkout `/Users/n8/tamagui` sits on local `v3-beta` at
  `e570c1c6e3`, one commit behind `origin/v3-beta` (`1fb82c1`), with
  uncommitted modifications (regenerated-looking `*.d.ts` outputs plus
  `code/core/web/src/helpers/getSplitStyles.tsx` and
  `code/core/web/src/helpers/webPropsToSkip.native.ts`). Untouched by this
  audit. Owner may want to confirm those two source files are intentional
  before they ride any future commit.
* This audit worktree (`/Users/n8/.worktrees/tamagui-v3-release-audit`, branch
  `audit/v3-release-readiness`) tracks `origin/v3-beta` and contains only this
  report as a new commit. Not pushed, not merged, per instructions.
* `gh` budget respected: status polling avoided (`gh run watch` never used);
  conclusions read from `--json jobs` listings plus the two session records.

## Exact release statement

No manual release command is given because none exists for the beta line: the
cut is automatic on green `Checks`, version `3.0.0-beta.<run>.<attempt>`,
dist-tag `beta` (observed `3.0.0-beta.1310.1`). Any manual publish, workflow
dispatch, tag push, or version commit needs the user's direct explicit
permission and was not performed.
