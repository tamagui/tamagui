# Tamagui v3 stable release

Owner direction, 2026-10-08, quoted by the coordinator: "All right, let's release Tamagui V3. I think the only thing is just to merge it cut the actual right version and I guess I should look over the website ... I think honestly at this point it's good enough we have to make sure Takeout is released and all that".

Owner correction, 2026-10-08, directly to this session: "By the way, yeah don't release it until I say so don't merge it to main do not release it until I say so".

The correction revokes release authorization. Continue preparation and validation on a draft branch. Do not merge main, dispatch releases or publish packages. Do not push v3-beta because that branch automatically publishes canaries and betas. Stable publication and the dependent Takeout upgrade wait for the owner's new explicit word.

## Scope

- Repair v3-beta Checks and beta publication at their causes.
- Carry the twelve main-only v2 fixes into v3 without rewriting shared history.
- Validate Checks, Release, Site, Registry, Detox and Maestro on one beta tip.
- Confirm the stable workflow computes 3.0.0, and record release notes.
- Share the site for owner review once the beta is green.
- Main merge and publication are held for new explicit owner approval, including the coordinator's final steps.
- Verify the published npm tarball's releaseSourceCommit and content, then pin Takeout to exactly 3.0.0, validate and push its branch for coordinator landing.

CI owner: tamagui-v3-release until handoff. REVIEW: none.

## Initial evidence

RAN: origin/v3-beta e1886583a15d37fa9a054916580bdb009b4a786f has 2719 beta-only commits and twelve main-only commits versus origin/main 5918dae347. Checks 37613039998 failed in typechecking, web unit tests, two integration color tests and the zero-runtime starter size baseline. Release 37613040043 was a canary, with beta skipped, and failed because npm accepted but never exposed @tamagui/react-native-use-pressable at the candidate version.

The coordinator confirmed porting the twelve main-only commits with provenance, without a merge or rebase of beta.

## Release path audit

RAN: the failed canary package is now visible at npm with releaseSourceCommit e1886583a15d37fa9a054916580bdb009b4a786f. Its initial upload returned HTTP 202 and retries returned a staged-version conflict. The failure was an availability timeout; the registry eventually exposed the version. The next beta publication remains required.

INFERRED from the release script and current 2.7.7 package manifests: main dispatch with release=major prepares 3.0.0, which publishes to latest. Confirm the merged manifest immediately before dispatch. Stable language-server packages need the separate lsp-build.yml publication path; release.yml only dispatches that path for beta.

RAN source audit: Site builds and deploys v3-beta to the Cloudflare Worker serving v3.tamagui.dev. This source path does not use Railway. It does not deploy on main push, and merging does not move the primary domain. The coordinator owns any primary-domain rollout. The existing launch article is code/tamagui.dev/data/blog/version-three.mdx; preserve its product direction and update stable install examples when publication is real.

The read-only helper audit is /tmp/tamagui-v3-release-audit.md. Its stale claim that current npm availability is unknown is superseded by the exact-version registry read above.

Logs: /tmp/tamagui-v3-checks-37613039998.log and /tmp/tamagui-v3-release-37613040043.log on pro-128. Task: t-muyyq3a3-13ly0.

## Validated receiver fixes

RAN: root typecheck and lint pass. The full core web unit/type suite passes 126 tests. Root checks pass after installing again with built CLI outputs present. Release tag/registry/retry tests pass 18 cases.

TESTED by the assigned color helper: the unchanged StyledIconColor and StyledContextColor browser files pass eight cases with retries disabled. Focused unit regressions pass 88 cases. Undefined context defaults leave styled base values intact; precompiled icon color/fill/stroke props retain their wrapper's declared inline ownership. Evidence: /tmp/tamagui-v3-colors.md and its listed logs.

The HOC signature infers stored component metadata and replaces colliding receiver props before comparing them, preserving deferred parent props when their receiver keys are finite. A generic component receiver retains explicit prop types. Site Link now declares TextProps for its Text receiver.

RAN on the current v3 implementation: Reanimated first-open, keyword-width and exit-completion probes pass 15 cases, with two existing skips and retries disabled. Evidence: /tmp/tamagui-v3-main-animation-before.log. This supports treating the corresponding main fixes as already ported; record all twelve dispositions before readiness.

## Main-only commit provenance

The draft starts from v3-beta e1886583a15d37fa9a054916580bdb009b4a786f. Most main fixes already have v3 implementations. Preserve the v3 implementations and record each original commit here rather than replace them with older v2 code. No merge or rebase of beta was performed.

| Main source commit | Draft disposition and evidence |
| --- | --- |
| b177f5493d8c06f6508f5d6bb726f2088fccdd77 | Ported Next override and lockfile upgrade from 16.3.6 to 16.3.8 after the bundle worker finished. Piscina 4.9.4, proxy-addr 2.0.8 and shell-quote 1.12.0 were already pinned in v3. RAN check:advisories: no critical advisories. |
| 100fa9db2e046079c58bafd33c53d6ca21632e4d | Ported formatter exclusion for committed babel-plugin-fully-specified permanent outputs. |
| caa181eb1b14bbfe850d482a371bc2821f589ae4 | Existing v3 skips unmounted modal children while preserving first-open measurement content. RAN SheetPortal.native.test.tsx, including open/close portal cleanup; retain its nonempty initial measurement assertion. |
| 5545174f9de3cb7182ca1c25daeb363122caa8e9 | Existing v3 starts the shared, intersection-aware slider measurement interval lazily. RAN Slider.web.test.tsx: two passing cases. |
| 2277848cec1fd3f627279f29f0fd61b14b746f59 | Existing v3 initializes sheet position with a direct setValue before driver completion. RAN SheetFirstOpen.native.test.tsx. |
| a147895a4c6972d903b5c3bafa04162e07a1ded8 | Existing v3 excludes CSS keyword sizes from Reanimated values. RAN ExitCompletion.animated.test.tsx, including scenario 56, with retries disabled. |
| f4eb0943bec3a870bdfaeac125e0dc893d0a66ba | Existing v3 captures resting exit styles after enter settles, including undeclared opacity. RAN unchanged AnimatePresenceEnterExit.animated.test.tsx under CSS: nine passing cases, retries disabled. |
| 12d03baa8d7811159f646d142570c443440c1fcb | V3 uses React Native Pressability in place of v2 custom press timers. RAN Button.native.test.tsx pooled-event regression, retaining touch coordinates in long press and press out callbacks. |
| 18f55b8c05fccf9d5e95df7603202059b05a229c | Existing v3 supplies the cross-platform menu when no native adapter exists. RAN MenuNoAdapter.native.test.tsx. |
| 03de486db442460599fc18865efc84a73afd1b96 | Existing v3 leaves native-menu touch ownership to the adapter and implements long press through a shared native context. RAN NativeMenuTriggerPress.android.test.tsx: one passing case. |
| 3afc96324ae66aab824d24feef0ea18bbc72d6e5 | Existing v3 seeds new Reanimated keys from the painted snapshot. RAN PopoverFirstOpenEnter.animated.test.tsx, including first-open frames. |
| 5918dae34703cac917078c9e0d73c58782ec9ab8 | Existing v3 already casts max-content in exit scenario 56. RAN root typecheck and the Reanimated exit-completion case. |

Native evidence: /tmp/tamagui-v3-main-native.log (four files, ten passing cases), /tmp/tamagui-v3-main-android.log (one passing case), /tmp/tamagui-v3-main-slider.log (two passing cases). CSS evidence: /tmp/tamagui-v3-main-css.log (nine passing cases). These unchanged behavioral probes would expose a missing port through failed touch, portal, timer, enter-frame or exit-completion assertions.

## Draft site and registry

RAN: Registry unit tests pass 21 cases, generated artifacts and skin exports are current, 22 items pass schema validation, all 44 authorized consumer copies match, and the native blank-app interaction smoke passes. Evidence: /tmp/tamagui-v3-registry-{test,check,validate,drift,native-smoke}.log.

RAN: the production site builds locally with build:static. Its homepage navigation test exposed outdated expectations: the docs sidebar now opens every section initially and labels the html-primitives route "HTML elements". The draft test explicitly checks initial visibility, closing, reopening and document-preserving navigation with the current label. Build evidence: /tmp/tamagui-v3-site-build.log. No site deployment was performed.

RAN: all seven homepage browser cases pass with one worker and retries disabled against the local production build. Evidence: /tmp/tamagui-v3-site-homepage-fixed.log.

Review captures are /tmp/tamagui-v3-home.webp (1170x2532, 114350 bytes) and /tmp/tamagui-v3-launch.webp (1170x2532, 172586 bytes), captured at 3x density, encoded at WebP quality 90 without resizing, and inspected at original resolution. These show the draft site; the launch article still has its July date and beta install examples. Those publication-dependent edits remain held.

## Bundle-size repair remains open

RAN by the assigned size worker: the canonical CSS metadata now uses the existing toStylePropsObject parser in bounded 128-key chunks. All 857 property keys and 93 unitless keys, their true values and insertion order match the original tables; nine property type/parity cases pass. Module initialization adds a split/insert pass, with no new per-component lookup path. Generated declarations for HOC consumers are rebuilt with the receiver typing repair.

RAN: the final pre-Next-upgrade starter measurement built all six integrations with no forbidden modules, compiler violations or forbidden artifact-family signatures. It still fails the unchanged ceilings: Vite island 77144 versus 73341 gzip bytes; Next island 77265 versus 73359. Metro island 122273 remains below 124079. Page JavaScript matches every ceiling and CSS remains below all ceilings. The observed integrated Vite reduction is 427 gzip bytes; it is not exclusive attribution because parent fixes ran concurrently. Evidence: /tmp/tamagui-v3-size.md, /tmp/tamagui-v3-size-measure-final.log, /tmp/tamagui-v3-size-final-receipts.json.

RAN parent artifact probe under a directly invoked Node 24.16.0: removing the canonical table from a diagnostic copy still leaves 73821 gzip bytes, above the Vite ceiling. Front-coded diagnostic encodings produce 77314 or 77391 bytes, larger than the current encoding. None of these destructive diagnostic transformations was applied to source. This rules out treating table encoding alone as the complete repair. The unchanged measure.mjs must pass before claiming size readiness; it currently does not.

No ceiling, assertion, retry or skip was changed. Source publication and main merge remain held. Checks, Registry, Detox and Maestro can validate a v3-prefixed draft; Release only publishes on a v3-beta push or an explicitly authorized dispatch. Site deployment and npm tarball verification remain pending.
