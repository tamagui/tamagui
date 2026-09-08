# v3 beta quality pass, 2026-09-07

Reviewed from `770f204ac0` on the shared `v3-beta` checkout. No size ceilings,
test budgets, or assertions were relaxed. The release push is authorized by Nate;
publishing and registry verification follow the checks below.

## Changes

| Area | Commit | Result |
| --- | --- | --- |
| Runtime | `79c635dc64` | Break the scanner/canonical-modifier import cycle that crashed Metro island initialization. Keep the public reexports. |
| Bundles | `f9478cd3a7` | Import component skins from their owning packages, regenerate registry copies, and give island wrappers the existing provider through `tamagui/provider`. Remove a duplicate Set entry. |
| Compiler | `73972f1e52` | Index extracted CSS rules once per element, preserving ordering and theme specificity; remove a redundant Vite array spread. |
| CLI | `8b56a11e57` | Load current configs for strict checks, diagnose misspelled `bg` payloads, fail on missing configs, correct generated API guidance, and use argument-based subprocess calls and glob discovery in upgrade. |
| Docs/skills | `7667dd5ca7` | Correct named-size context and conditional variant examples, ThemeUpdate/defaultProps guidance, settings syntax, presence values, and strict-check instructions. |
| Declarations | `08ae209bf5` | Regenerate four stale declaration files against the strict style types already on the branch. |

## Size and performance

**RAN**, Node 24.16.0, zlib 1.3.1-e00f703, gzip level 9. The control was the
untouched starting tip rebuilt on the same machine; the candidate includes the
Metro cycle fix. All six starter size tiers pass their unchanged ceilings.

| Fixture | Before, bytes | After, bytes | Delta |
| --- | ---: | ---: | ---: |
| Metro island | 228,222 | 120,772 | -107,450 (-47.1%) |
| Vite island | 71,664 | 71,929 | +265 |
| Next island | 71,869 | 71,853 | -16 |
| Styled View | 28,801 | 28,820 | +19 |

Styled View is 76,703 raw bytes, with **one gzip byte of headroom** under the
unchanged 28,821 ceiling. The bundle ledger contains the detailed receipt.

**TESTED**, all 12 starter browser cases across Vite, Next, and Metro: loaded
first paint, generated CSS transitions, theme switching, and interactive island
mounting. A real Metro browser probe caught `TypeError: s is not a function` in
`parseFlatValue` before the cycle fix; the same interaction passes afterward.

**RAN**, the harvested runtime corpus with Node/tsx, 11 rounds and 3 warmups:
CSS-copy/serialization experiments moved v3/v2 total from 1.732 to 1.751, with
identical checksum 29,124,914. Those experiments were reverted. Concurrent
builds and Node's server-side CSS-collection path limit these timings; no render
speed improvement is claimed. The benchmark now prints its environment caveat.

**TESTED**, extracted CSS indexing in isolation: execute the actual before/after
`extractedStyleArtifacts` function bodies with the same rule records and assert
deep equality of class names and CSS. Node 24.16.0, 9 interleaved rounds, first
2 discarded, 1,000 calls per arm per round, median ns/call:

| Rules per element | Before | After |
| --- | ---: | ---: |
| 8 | 8,479 | 2,632 |
| 32 | 65,266 | 10,135 |
| 128 | 769,522 | 43,497 |

These are synthetic helper timings, not end-to-end build timings. The complete
static web/native and Vite suites validate the assembled extraction behavior.

## Validation

- **RAN** root `bun run lint`, `bun run check`, and
  `./node_modules/.bin/tsc -b code/kitchen-sink`: clean. Lint retains two
  existing test-fixture warnings (unreachable code and a sparse array).
- **TESTED** core suite: web 630 passed; native 339 passed, 7 expected failures;
  token provenance 7 passed; iOS 25 passed; Android TV 12; tvOS 12. Existing
  skipped tests remain skipped. Published web types: 92 passed.
- **TESTED** style grammar: 544 passed; CLI: 37 passed, including a fresh-project
  subprocess that rejects a typo, accepts its correction, and fails after config
  deletion even when a generated artifact exists.
- **TESTED** static compiler: web 267 passed, webpack 20, native 109 plus one
  expected failure; Vite plugin 17; Metro plugin 7. Existing skips unchanged.
- **TESTED** registry: 21 tests / 60 assertions; all 22 registry items current.
- **RAN** kitchen-sink CLI `check --strict`: 525 files, no flat-value problems.
  `generate-prompt`, `setup`, `migrate --from v2`, and `upgrade --dry-run` run.
  A separate project with a real `^2.7.7` dependency exercises the upgrade dry
  run and verifies its package manifest remains unchanged.
- **RAN** stock-v6 TypeScript probe for the compound context and five complete
  skill examples: clean. Skill validator: `Skill is valid!`.
- **RAN** package builds and whole-workspace JS/type builds before validation.

## Deliberately retained

- Runtime CSS insertion experiments without a repeatable win were reverted.
- `@tamagui/ui` remains a public barrel. Component skins and island wrappers now
  avoid traversing it; removing the public entry would break existing imports.
- V5 config packs, legacy numeric font/radius aliases and token-key control
  sizes remain supported APIs. Historical migration examples keep their v2
  syntax. Theme hierarchy underscores remain distinct from kebab-case v6 theme
  value keys.
- Prop-named token-domain duplication remains as recorded in the size ledger;
  changing lookup semantics would exceed this cleanup and risks custom configs.
- The compiler's compatibility oracle remains covered by its existing suites.
  No additional extraction rewrite or Babel/loader architecture change was
  justified by a failing runtime case during this pass.

- **RAN** the extra `code/ui/tamagui` circular-dependency advisory: it reports
  nine type-only cycles (eight declaration cycles and the explicit
  `import type { ThemeKeys }` edge in `theme-update.ts`). The unpinned Madge
  command includes declaration edges. This advisory remains failing; no check
  exclusions or type architecture changes were added to silence it. Runtime
  initialization is independently exercised by the three starter integrations.
