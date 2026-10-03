# Launch site reconciliation, 2026-10-03

The corrected bundle claim holds on published beta 1564.1 for the measured
small app. The portal branch is superseded by source already on v3-beta.
Approved hero and docs source is merged, but production still renders v2 and
the v3 preview lacks the approved containment and newer documentation.
Publication remains open because Railway CLI is unauthorized and the failed
build log is unavailable. No deployment or beta release was triggered here.

## Source and branch receipts

**RAN:** fetched origin, read `plans/v3-beta`, the m18637/s6895 session evidence,
and task `t-murcewif-b5g0` before running a new experiment.

| Ref | SHA | Disposition |
| --- | --- | --- |
| fetched origin/main | `0eb99e3fc61537988500268a607b157496985bf0` | untouched |
| fetched origin/v3-beta | `564ffb43648b08adc091e17b6587fdbd66556796` | source for beta 1564.1 |
| origin/tm/site-claims | `74f2d8d51f6f3d92106cf41a3751a8e292c2e467` | original review branch, 3 commits ahead and 50 behind beta |
| origin/tm/one-portal-setup | `9230f0bb3df50374cc2c5ef486998fd516d128c3` | superseded, no touched-file diff from beta |
| this review branch | `tm/launch-site-2026-10-03` | based on fetched beta; claims held for Nate |

**RAN:** the review branch carries the existing site-claims commits as
`36a96e4150`, `ae502d75e0`, and `2670ff014b`. The original branch is preserved.
The primary checkout remains on its existing main branch. A managed worktree
was created from fetched origin/main and then based on origin/v3-beta; its
unrelated main lockfile commit was excluded before carrying the site work.

**TESTED:** npm reports `@tamagui/core`, `@tamagui/tailwind`, and `tamagui` beta
as `3.0.0-beta.1564.1`. [Release 37119865613](https://github.com/tamagui/tamagui/actions/runs/37119865613)
succeeded. The run object's head SHA is main because `workflow_run` executes the
default branch's workflow; its checkout step actually selects
`564ffb43648b08adc091e17b6587fdbd66556796`. All 15 packed `@tamagui/core/src`
files byte-match that source, with per-file hashes in
[core-published-content.json](./launch-site-2026-10-03-evidence/core-published-content.json).
[Checks 37118998498](https://github.com/tamagui/tamagui/actions/runs/37118998498)
succeeded for that beta source. Release workflow is active; its beta job and
trigger agree between main and beta. Nate's decision to retain automatic beta
publication is respected; the workflow was not edited.

## Fresh small-app measurement

**RAN:** the previous s6895 harness measured the local tip
`728da51995cf2d52e7911621651263e77d3e2c9d`, not beta 1551 or today's beta.
Re-attribution of its saved artifacts and its browser probe still pass.
The historical receipts remain in `code/comparisons/tailwind-bundle/receipts`.

**TESTED:** reused that harness with generated identical app bodies, published
Tamagui beta 1564.1, and the retained rival/tool dependencies. Built each arm
sequentially in both React-excluded and complete-app modes, then ran
`attribute.ts` and `probe.ts` for each mode. The current Tamagui emitted JS hash
is identical to the historical fixture's hash, despite the newer package source.
Fresh receipts identify the packages actually present in their source maps.

| Arm | JS gzip, shared React excluded | Complete-app JS gzip | CSS gzip, shared React excluded |
| --- | ---: | ---: | ---: |
| Tamagui core, beta 1564.1 | 16,899 bytes | 75,766 bytes | 3,163 bytes |
| NativeWind 5.0.0-preview.4 / react-native-css 3.0.7 | 23,924 bytes | 82,560 bytes | 1,806 bytes |
| Uniwind 1.11.0 | 40,485 bytes | 99,067 bytes | 1,713 bytes |

Shared React exclusion externalizes React, React DOM, and scheduler equally.
React Native Web 0.21.2 remains in NativeWind and Uniwind. Tamagui core does not
use it. App code and bundler helpers remain in all three totals. These are gzip
level 9 complete emitted-file totals, excluding maps and HTML. CSS is separate.
No router, UI kit, animation driver, or speed-benchmark controls are present.
The Tamagui client config contains `themes:{}`; light/dark theme definitions are
in extracted CSS. Attribution rejects optional UI/theme/portal/animation packages.

**RAN:** standalone gzip for the framework source-map spans is 16,211 bytes
for Tamagui, 382 for NativeWind's web adapter, and 2,289 for Uniwind. NativeWind's
web arm primarily uses Tailwind CSS and React Native Web; the adapter-only
number must not be presented as its complete platform cost. The largest rival
package rows are React Native Web (16,369 / 16,606 standalone gzip) and Uniwind's
culori dependency (14,501). All package/module rows, output hashes, and exact
versions are in these fresh receipts:

- [Tamagui](./launch-site-2026-10-03-evidence/results-tamagui-no-react.json)
- [NativeWind](./launch-site-2026-10-03-evidence/results-nativewind-no-react.json)
- [Uniwind](./launch-site-2026-10-03-evidence/results-uniwind-no-react.json)
- [React-excluded browser](./launch-site-2026-10-03-evidence/results-probe-no-react.json)
- [Complete-app browser](./launch-site-2026-10-03-evidence/results-probe.json)

Standalone and marginal package gzip columns are non-additive because packages
share the compressor's dictionary. Uniwind emits its existing sourcemap warning;
package attribution is approximate, while complete emitted-file totals and hashes
are exact. Tamagui uses 58.3% less JS than Uniwind in this fixture. An application
under 30KB is not promised: the complete app is 75,766 JS bytes with React/DOM.
The blog now pins its statement to beta 1564.1, names scheduler exclusion, and
links this receipt. The prose/hero claim changes remain on the review branch.

**TESTED:** six browser runs across the two bundling modes verify a working
counter, matching card padding/gap/radius, font size/weight, and black/white colors,
plus both Tamagui CSS themes. No page errors. React-excluded pages receive one
shared local React/DOM baseline via the existing probe's import map.

### Reproduction and capacity

**RAN:** local sample: 45.35% CPU idle, about 5GB unused memory and 225GiB disk
available. ci-64 sample: 26.78% idle, 34GB unused memory and 753GiB available.
All six builds were admitted through the existing heavy gate with a two-core
reservation, sequentially. No helpers or paid services were used.

The fresh fixture lives on ci-64 at
`/Users/macbookpro/Library/Caches/tamagui-launch-site-20261003`.
It copies `prepare.ts`, `attribute.ts`, `probe.ts`, and `build-config.ts` from the
existing s6895 harness. `prepare.ts` generates the app bodies. Its root
`node_modules` points to the retained comparison dependencies at
`/Users/macbookpro/Library/Caches/tamagui-v3-numbers/cmp/node_modules`.
The Tamagui arm has its own installed packages pinned to beta 1564.1 plus
React/DOM 19.2.3; its manifest and lockfile are checked in with this receipt.
Vite 8.2.2, Tailwind 4.3.0, vite-plugin-rnw 0.0.12, and the rival versions above
are retained from the original experiment. Reinstalling rivals changes the experiment.

```sh
# from the fresh fixture directory, each arm separately and sequentially
cd tamagui
BUNDLE_EXCLUDE_REACT=1 bash /Users/macbookpro/contrast/scripts/heavy.sh --cores 2 -- bun ../node_modules/vite/bin/vite.js build
cd ../nativewind
BUNDLE_EXCLUDE_REACT=1 bash /Users/macbookpro/contrast/scripts/heavy.sh --cores 2 -- bun ../node_modules/vite/bin/vite.js build
cd ../uniwind
BUNDLE_EXCLUDE_REACT=1 bash /Users/macbookpro/contrast/scripts/heavy.sh --cores 2 -- bun ../node_modules/vite/bin/vite.js build
cd ..
BUNDLE_EXCLUDE_REACT=1 bun attribute.ts tamagui nativewind uniwind
BUNDLE_EXCLUDE_REACT=1 bun probe.ts
# repeat without BUNDLE_EXCLUDE_REACT for the complete-app receipts
```

Logs on ci-64: `/tmp/launch-site-*-beta1564-build.log`,
`/tmp/launch-site-*-beta1564-complete-build.log`,
`/tmp/launch-site-current-attribute.log`, and
`/tmp/launch-site-current-complete-attribute.log`.

## Portal branch reconciliation

**TESTED:** `git diff origin/v3-beta origin/tm/one-portal-setup -- code/core/native
code/tamagui.dev/data/docs/core/native.mdx` is empty. Both branch commits'
changes are already represented by `2947e13a6db58c6ef2a2868e02dcd27151937b11`
on beta. No cherry-pick, API addition, or portal source change is needed.

**RAN:** read both setup modules, components, exports, and docs. `setup-teleport`
continues to require react-native-teleport and preserves its PortalProvider.
`setup-one-portal` explicitly uses One.UI.Portal and One.UI.PortalHost with a
host-filling style. Both use the existing setup guard and portal state. Docs
instruct the app to select one setup. Teleport remains supported and unchanged.
This lane did not rerun native portal runtime tests or change the public API.

## Hero, docs, skills, and deployed site

**TESTED:** `HomeStyleToggle.tsx` and all reusable skills have no diff from the
approved/reviewed `4f07152c69` source. The source has `whiteSpace="pre"` and
`overflowX="auto"`, exactly the previously approved containment repair. Its
original 869-route production build, 10 hero states, and 94-file docs/skills
review are recorded in `README.md`; those are historical validations.

**RAN:** reviewed the 14 docs files changed since that audit against current
source. These cover icons/CLI generation, native portal setup, Sheet native
renderer contract, focusOnIdle's true default, migration examples, starter
choices, and LSP availability wording. Source checks include
`FocusScope.tsx`, `nativeSheet.native.tsx`, native portal exports,
`create-tamagui/src/templates.ts`, and CLI icon generation. Skills are unchanged.

**TESTED:** a fresh Babel/grammar check of changed docs parsed 74 TS/JS code
blocks and diagnosed 26 literal JSX style values. It produced no unexpected
findings. Both explicitly documented v2 `$` examples were required to produce
`v2-dollar-prefix`; malformed `p="hover::4"` produced a diagnostic as a negative
control. Nine illustrative fragments cannot parse as whole programs and were
read separately. Historical v2, token migration, and upgrade pages were read
as comparisons, not classified as active v3 programs. This is a delta audit,
not a fresh full-site build. [Audit receipt](./launch-site-2026-10-03-evidence/docs-delta-audit.json).

**RAN:** current production `https://tamagui.dev` returns 200 with Cloudflare and
Railway response headers, hydrates without page errors, and displays the v2
"Write less / runs faster" homepage, including `$gtSm` and `$background` examples.
Its `/api/health` returns `{"status":"ok"}`. The PR preview also returns 200 and
healthy JSON, renders the v3 hero, and still advertises a "Rust compiler".
[Deployed page observations](./launch-site-2026-10-03-evidence/deployed-pages.json).

**TESTED:** actual PR preview, both syntax tabs at 320/390/768/1024/1440px.
All ten states hydrate and switch without page errors, but all lack the source's
`white-space: pre; overflow-x: auto`. At 320px each code sample is 432px tall
inside a 430px panel, extending 27px below its bottom. At 390px Tailwind extends
9px below the panel. The verification intentionally exits nonzero on this gap.
Fourteen real docs routes return 200, headings/code, and no browser errors;
Native lacks setup-one-portal and Sheet lacks "Native system renderers".
[Preview runtime receipt](./launch-site-2026-10-03-evidence/preview-runtime.json).

**INFERRED from these browser observations and source comparisons:** neither
endpoint demonstrates publication of the approved current beta site. Their exact
source SHAs cannot be recovered from the health endpoint, which only returns
status. Do not label the preview as beta 1551, beta 1564, or e2fba9852d.

**RAN:** inspected `Dockerfile`, `scripts/ci-build-app.sh`,
`scripts/ci-serve.sh`, `code/tamagui.dev/railway.toml`, and site Vite configuration.
The existing container builds workspace JS then the app, serves One on `$PORT`,
and uses `/api/health` readiness. Its private Bento source is pinned in the
Dockerfile; Bento is outside this lane and was not changed.

**RAN:** `railway whoami` on this machine returns
`Unauthorized. Please login with railway login`. No login, credentials read,
service reconfiguration, or deploy was attempted. The known failed preview
deployment is `e5d29292-6c18-43ea-a510-dfec25e69032` from task `t-murcewif-b5g0`.
[Failed deployment log destination](https://railway.com/project/e0ff22cb-e629-4371-91c1-90743e2a036f/service/c14f5c41-a8f8-4046-baae-e7dbe1569976?id=e5d29292-6c18-43ea-a510-dfec25e69032&environmentId=854c748d-2301-4323-9972-70c9a4deb6e6).
The prior owner already requested that log. Its build failure cause remains
unverified, so no speculative Docker/site fix was made.

## Delivery and remaining steps

The corrected claims, current receipts, and this reconciliation are held on the
pushed review branch for Nate. No main merge, new visuals, new API, downstream
changes, workflow dispatch, or release was made. Scoped TS/TSX formatting and
lint plus `git diff --check` pass. Lint uses beta lockfile's oxlint 1.85.0;
the primary checkout's older 1.56.0 cannot read beta's excludeFiles setting.

The assembled launch owner owns review/CI disposition. Site publication needs
an already authorized Railway owner to retrieve the failed log and identify its
concrete cause, deploy the approved hero/docs source, then verify the deployed
SHA and rerun the same containment/docs checks. Exact production source and
successful v3 publication are still blockers; the bundle and portal reconciliation
are closed. Nate's approval still holds the corrected subjective claim copy.
