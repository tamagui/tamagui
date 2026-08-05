# V3 final conformance matrix

Status: prepared on 2026-07-31. Execute after Phase 6 item 4 is committed.

Final audited SHA: `af0896eee3`, audited 2026-08-01. All 24 gates exit 0,
post-build tracked dirt zero, both shuffled order gates 5/5.

This is the release-facing procedure for Phase 6 item 5. It replaces warm-tree
suite totals and package-level claims with one isolated reading of one commit.
The result is authoritative only for the SHA printed by the audit.

## Execute it

From any checkout containing the target commit:

```sh
./scripts/gate-audit.sh <sha>
```

The script:

1. resolves the exact commit before creating anything;
2. creates a detached worktree at that commit and refuses a pre-existing path;
3. installs with the frozen lockfile into that worktree;
4. performs one root build before measuring source and dist consumers;
5. reports tracked post-build changes before running tests;
6. verifies that the matrix's CI tasks are executable in Turbo's actual task
   graph;
7. runs the gates below in order, writing one complete log per command;
8. runs the core web and native suites in shuffled order five times;
9. exits nonzero if a gate, graph check, or checkout-integrity check fails.

The logs and tab-separated summary are under
`<audit-worktree>/.gate-logs/`. Keep that worktree until the report has been
reviewed. The script prints the exact removal command when it finishes.

Accept the run only when all of these are true:

- the SHA printed at the start is the release candidate;
- post-build tracked dirt is exactly
  `code/tamagui.dev/tamagui.generated.css`, which postinstall rewrites;
- zero declaration files changed;
- both Turbo graph checks pass;
- every command exits zero;
- every count matches the final baseline recorded below;
- every shuffled iteration passes.

An exit-zero suite with fewer tests is a baseline change, not a pass. Inspect
the log and explain the missing tests before updating the table.

The first run after item 4 establishes the final baseline. Accept each initial
count only after explaining its difference from the last coherent reference.
Every later rerun must match the established final baseline exactly.

## What topology means

The root build is mandatory because package exports resolve to `dist` in many
tests. The labels below distinguish the code actually executed:

- **source**: the test imports the package's `src` files directly;
- **dist**: the test reaches a package export or explicit built entry;
- **mixed**: the package under test is source, while one or more workspace
  dependencies come through built exports;
- **artifact**: the test exercises emitted declarations, compiler output, or a
  real bundle.

A source probe is not evidence for a dist suite, and a dist suite is not
evidence that an unbuilt source edit works. This is why the root build precedes
every gate.

## Local isolated matrix

The CI column describes `.github/workflows/checks.yaml` at the prepared tree.
`web graph` means the package has an executable `test:web` node in the exact
Turbo command CI runs. `native graph` means it is one of the three filtered
native nodes. `explicit` means the workflow runs it outside Turbo.

| Order | Gate | Topology measured | CI |
| ---: | --- | --- | --- |
| 0 | frozen install and root build | source compiled to all tracked declarations and package dist outputs | distributed task dependencies; CI has no single root-build command |
| 1 | frozen-lockfile dry run | manifests and lockfile only | install action |
| 2 | v6 config defaults | config generator and tests from source, generated defaults from source, `@tamagui/themes/v5` through dist | explicit |
| 3 | `@tamagui/build` | published JS entry scripts against fixture packages and real filesystem operations, including symlinks | web graph |
| 4 | root lint | complete source and tracked generated files | explicit |
| 5 | root typecheck | source against declarations reproduced by step 0 | explicit |
| 6 | style grammar | source-direct Vitest files | web graph |
| 7 | DOM contract | source tables, generated source types, and the TypeScript conformance project | web graph |
| 8 | ESLint plugin | plugin source with style-grammar through dist | web graph |
| 9 | language service | packaged CJS plugin from rebuilt dist plus the source host resolver test | web graph |
| 10 | flat-values codemod | codemod source and subprocesses with language-service and style-grammar through dist | web graph |
| 11 | core web | test source with `@tamagui/core` and dependencies through browser package exports | web graph |
| 12 | core native | test source aliased to built `@tamagui/core/native-test` (`dist/test.native.cjs`) | native graph |
| 13 | components web | test source with core and UI packages through browser exports | web graph |
| 14 | components native | test source with built core native-test and UI package exports | native graph |
| 15 | static web | test source driving built compiler/core package exports and checking emitted output | web graph |
| 16 | static native | test source driving built compiler/core native exports and checking emitted output | native graph |
| 17 | webpack | real webpack plus `tamagui-loader`, built package exports, and rendered emitted bundle | web graph |
| 18 | Tailwind web | Tailwind frontend source with web, core, and style-grammar through built exports | web graph |
| 19 | Tailwind native | Tailwind frontend source with native-target built exports | no |
| 20 | Tailwind typecheck | source types against rebuilt declarations | no |
| 21 | to-tailwind | converter source with shared grammar through built exports | web graph |
| 22 | web package | package source tests plus Vitest typecheck against rebuilt declarations | web graph |
| 23 | core native shuffled, five runs | same built native-test topology as order 12, randomized file order | no |
| 24 | core web shuffled, five runs | same browser-export topology as order 11, randomized file order | no |

The four suites added to CI on 2026-07-31 are now verified as real Turbo nodes:

- `@tamagui/style-grammar#test:web`;
- `@tamagui/codemod-flat-values#test:web`;
- `@tamagui/eslint-plugin#test:web`;
- `@tamagui/language-service#test:web`.

Before that manifest change they appeared as `<NONEXISTENT>` and CI never ran
them.

## Baselines

The final baseline column stays pending until item 4 is committed and this
script runs at the resulting SHA. The reference column is evidence for
triage, not permission to accept a lower count. Counts withdrawn because of
warm transform caches are excluded.

| Gate | Last coherent reference | Final baseline |
| --- | --- | --- |
| CI task graph | prepared tree: 23 executable web tasks, 3 executable native tasks | 23 executable web tasks, 3 executable native tasks |
| post-build dirt | isolated `4fdcd94500`: one postinstall CSS file, zero declarations | **zero** tracked files rewritten, declarations included |
| frozen-lockfile | isolated `4fdcd94500`: exit 0 | exit 0 |
| v6 config defaults | rebuilt package at `f4804dec80`/`d781941bbf`: 5 tests, 18,387 assertions | exit 0; 6 tests / 1 file |
| build package | rebuilt package at `d616ebc451`: 19 tests | 19 tests / 1 file |
| lint | isolated `4fdcd94500`: exit 0, warnings only | exit 0, warnings only |
| typecheck | isolated `4fdcd94500`: exit 0 after declarations reproduced cleanly | exit 0, zero errors |
| style grammar | fully rebuilt at `114a015a73`: 373 tests / 21 files | 381 tests / 23 files |
| DOM contract | rebuilt package at `0c82653e85`: 17 conformance tests plus typecheck | 24 tests / 2 files |
| ESLint plugin | rebuilt package at `d0d8b73ab6`: 4 tests | 4 tests / 1 file |
| language service | rebuilt package at `0192c1f8e2`: 3 tests | 3 tests / 2 files |
| codemod | rebuilt dependencies at `78029931a7`: 66 tests, 444 assertions | 90 tests / 2 files |
| core web | isolated `4fdcd94500`: 414 passed / 47 files; current total intentionally unset | 469 passed, 2 skipped, 1 todo / 55 files + 1 skipped |
| core native | isolated `4fdcd94500`: 177 passed, 7 expected failures, 11 skipped / 21 files; current total intentionally unset | 222 passed, 7 expected fail, 9 skipped / 24 files + 1 skipped |
| components web | no coherent current total recorded | 46 tests / 9 files |
| components native | rebuilt package at `0b284b80bb`: 36 tests / 13 files | 36 tests / 13 files |
| static web | fresh compiler builds at `5e59fea19b`: 113 passed | 144 passed, 2 skipped / 16 files + 1 skipped |
| static native | fresh compiler builds at `5e59fea19b`: 47 passed, 1 expected failure | 48 passed / 4 files |
| webpack | fresh compiler builds at `5e59fea19b`: 20 passed | 20 passed / 1 file |
| Tailwind web | fully built at `114a015a73`: 462 tests / 20 files | 456 tests / 19 files |
| Tailwind native | fully built at `114a015a73`: 273 tests / 4 files | 275 tests / 4 files |
| Tailwind types | fully built at `114a015a73`: exit 0 | exit 0; 456 tests / 19 files |
| to-tailwind | rebuilt package at `9291a06298`: 63 tests | 63 tests / 2 files |
| web package | isolated `4fdcd94500`: 90 tests / 8 files, no type errors | 81 tests / 8 files, no type errors |
| core order gates | five runs each, zero failures required; prior intermittent ordering evidence is not a baseline | 5 shuffled runs each, zero failures |

Do not use the reported `430/186`, `434/186`, or `450/188` core totals. They
were withdrawn after a transform-cache audit showed two pre-existing reds were
hidden at every coherent state in that window. Red-first mutation evidence
from the same work remains valid, but those suite totals do not.

### Why the final baseline moved from the reference column

Two counts went DOWN, and per this document a smaller exit-zero suite is a
baseline change rather than a pass. Both were source-counted before acceptance:

- **Tailwind web 462 → 456.** `flatGroupSyntax.web.test.tsx` and its 3 legacy
  `$group` adapter tests were deleted, legacy-only cases were dropped from
  `adversarialAudit`, `mode` and `partition`, and 2 flat group/container parity
  tests were added in `configAware.native`. Deliberate V2 coverage removal.
- **web package 90 → 81.** `styledNonStyleProps.test-d.ts` and its 12 legacy
  media/pseudo type tests were deleted; `stylePropParity.test-d.ts` adds 3.
  Net −9 with the file count unchanged. Deliberate contract replacement.

Several went UP, which needs recording so a later run does not read the higher
number as drift:

- **static web 113 → 144 / 17 files.** The package globbed `tests/*.web.test.tsx`
  and this script repeated that glob, so `e3-lowerer.web.test.ts` (27 tests) and
  `e2-parity.web.test.ts` (7) had never run anywhere. The glob now lives only in
  the package, as `test:web:files`, and this script calls it.
- **core web 414 → 469, core native 177 → 222.** `constants.web.test.ts` was
  invisible to `*.web.test.tsx`, and `getSplitStyles.nestedMedia.test.tsx` had
  no platform infix so no script matched it at all. Both now run.
- **style grammar 373 → 381, codemod 66 → 90, DOM contract 17 → 24.** Tests
  added during the sigil rip.

Do not repeat a package's test glob in this script. A copied pattern silently
stops matching when the original changes, and that is exactly how the static
gate spent its life reporting 110 tests while the package ran 144.

## CI reachability verified from the task graph

The preparation command was the same web graph CI runs:

```sh
bun turbo run test:web --filter='!@tamagui/kitchen-sink' --dry=json
```

At the prepared tree it contains 23 executable web tasks. The native command:

```sh
bun turbo run test:native \
  --filter=@tamagui/static-tests \
  --filter=@tamagui/core-test \
  --filter=@tamagui/components-test \
  --dry=json
```

contains exactly the three expected native tasks. `gate-audit.sh` repeats both
checks inside the pinned worktree and fails if a matrix task becomes
`<NONEXISTENT>`.

The web graph also runs these packages outside the local V3 matrix:

- `@tamagui/cli`;
- `@tamagui/create-system-font`;
- `@tamagui/expo-router-starter`;
- `@tamagui/input`;
- `@tamagui/theme-builder`;
- `@tamagui/v3-canary`;
- `create-tamagui`;
- `integration`;
- `next15-plus-cli-optimize`;
- `sandbox`;
- `test-next-turbopack`.

Their CI result is still required. They stay outside the local script so this
matrix remains the V3 contract audit instead of becoming a second
implementation of the whole workflow.

## Deliberately outside `gate-audit.sh`

These are knowingly unmeasured by the local isolated run:

1. **Root dependency audit and reference check.** The Checks job runs
   `bun audit` and `bun run check`; the local script's frozen install, lint,
   typecheck, and matrix do not replace those results.
2. **`code/tests/integration` Playwright.** Its tests start dev or preview
   servers and require installed browsers. Turbo CI runs it as
   `integration#test:web`; the local script does not.
3. **Kitchen-sink Playwright.** The `integration-tests` CI job installs
   browsers and runs three shards against a server. V3 pull requests force
   this job even when the dependency-tree detector would skip it.
4. **V3 SSR hydration Playwright.** CI runs the five selected sandbox files
   for V3 pull requests.
5. **Bundle delta.** CI builds the kitchen sink at both the pull request head
   and base SHA, then compares raw and gzip JS/CSS totals. The comparator warns
   on a gzip increase but does not fail, so the reviewer must explain and
   approve any increase. There is no fixed byte baseline.
6. **Core platform variants other than `test:web` and `test:native`.** The
   token-provenance, iOS, tvOS, and Android TV package scripts are not in this
   matrix or the filtered native CI command.
7. **Device suites.** Detox, Maestro, and physical platform behavior belong to
   their workflows and are not implied by a green unit matrix.

The release report must list the CI run covering items 1 through 5. If any is
skipped, call it unmeasured. Do not turn a missing result into a green result.

## Final report template

After the isolated run and CI finish, replace every pending baseline and add:

```text
Audited SHA:
Audit UTC start and finish:
Audit worktree:
Unexpected post-build tracked files:
Local matrix result:
CI Checks run:
Kitchen-sink Playwright run:
SSR hydration run:
Bundle delta run and raw/gzip change:
Known unmeasured areas:
```

Keep the logs until the release decision is recorded.
