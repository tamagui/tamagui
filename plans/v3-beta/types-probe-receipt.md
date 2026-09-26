# V3 real-app editor type probe receipt

## Verdict

**TESTED** The current built v3 object types completed every requested editor
surface in both real application graphs. Every expected entry was present, no
checked internal component field leaked, the wrong variant value produced one
`TS2322`, and every warm median was below 4 ms through TypeScript's in-process
LanguageService API.

**RAN** Team Machine contributed 852 configured roots and 5,026 program source
files. Chat contributed 2,311 configured roots and 8,339 program source files.
The repository scans found 227 Team Machine files and 566 Chat files importing
`tamagui` or `@tamagui/*`.

**INFERRED** This is direct evidence for the semantic work VS Code asks
TypeScript to perform. The latency numbers exclude the JSON protocol and editor
rendering overhead of a `tsserver` subprocess, so they are not end-to-end VS
Code UI measurements.

## Inputs and method

**RAN** The probe used Team Machine GUI at
`620e11a4ec38c128d8a460cae014a16892c4771d` and an exact tracked archive of Chat
at `42cd3ff0a9f2b2552fa69e151573b6a5f666e27a`. Chat itself was not modified. Its
archive was installed at `/tmp/chat-types-probe.QqacOt` with lifecycle scripts
disabled.

**RAN** Both apps used TypeScript 5.9.3. The v3 runs overlaid their copied
compiler configuration with these paths:

```json
{
  "tamagui": ["/Users/n8/tamagui/code/ui/tamagui/types"],
  "@tamagui/*": [
    "/Users/n8/tamagui/code/core/*/types",
    "/Users/n8/tamagui/code/ui/*/types",
    "/Users/n8/tamagui/code/packages/*/types",
    "/Users/n8/tamagui/code/compiler/*/types"
  ]
}
```

**RAN** The measured v3 declarations were built from Tamagui revision
`52eb8aa6bc0ad6f05ed1ea4cee67102ca97750b7`. The build also regenerated an
uncommitted `Sheet.d.ts` change from another active source change. The probe
records dirty mapped declaration files in its JSON output. That Sheet elevation
change does not participate in the `View`, `Button`, `styled.dynamic`, or
`.resolve` types measured here.

**TESTED** Each editor run loaded four real files before issuing requests
against a virtual `.tamagui-v3-types-probe.tsx` inside the app. The synthetic
file was never written to either app. It covers a blank `styled(View, { | })`
definition, three union values, `styled.dynamic<SizeTokens>`, inline `View` and
`Button` JSX, variant props, `.resolve` props, and an invalid variant value.

**RAN** Both app configurations enable `onlyAllowShorthands`, so the third
union-valued style probe uses the configured `items` shorthand for
`alignItems`. A repository scan found no `html.div` use in either target, so the
conditional DOM probe was not run.

## Editor results

**TESTED** These are medians of five measured requests after one unmeasured
warm-up. Counts are the completion entry counts returned by the LanguageService.
`Missing` and `junk` are counts, and all zeroes are asserted by the script's
exit status.

| position | required entries | Team count | Team median | Chat count | Chat median | missing | junk |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `styled(View, { \| })` | `position`, `display`, `items`, `variants` | 380 | 2.52 ms | 380 | 2.81 ms | 0 | 0 |
| `position: "\|"` | `absolute`, `relative` | 6 | 1.69 ms | 6 | 2.18 ms | 0 | 0 |
| `display: "\|"` | `none`, `flex` | 8 | 2.24 ms | 8 | 3.11 ms | 0 | 0 |
| `items: "\|"` | `center`, `flex-start` | 6 | 2.53 ms | 6 | 2.17 ms | 0 | 0 |
| `styled.dynamic((value, { \| }))` | `tokens`, `theme`, `font`, `fontFamily` | 5 | 0.74 ms | 5 | 0.75 ms | 0 | 0 |
| `<View \| />` | `children`, `position`, `display`, `items` | 378 | 1.55 ms | 378 | 1.89 ms | 0 | 0 |
| `<Button \| />` | `size`, `circular`, `disabled`, `variant`, style props | 401 | 1.45 ms | 401 | 2.31 ms | 0 | 0 |
| `.resolve((props) => props.\|)` | `size`, `tone`, `children`, style props | 378 | 1.80 ms | 378 | 2.32 ms | 0 | 0 |

**TESTED** The dynamic callback value had QuickInfo `(parameter) value: Size`
at 0.53 ms in Team Machine and 1.19 ms in Chat. The resolver parameter retained
`size?: Size` and `tone?: "neutral" | "critical"` at 0.74 ms and 1.67 ms,
respectively.

**TESTED** `<DefinitionProbe tone={123} />` produced exactly one semantic
diagnostic in each graph: `TS2322`, because `number` is not assignable to the
`neutral | critical` variant value. Median diagnostic latency was 0.10 ms in
Team Machine and 0.57 ms in Chat.

**TESTED** The styled-definition junk check treats `contextProps`,
`defaultVariants`, and `variants` as public styled options. At JSX and resolver
positions it checks those names plus `staticConfig`, `baseStyle`,
`defaultProps`, `parentStaticConfig`, `validStyles`, `styleable`, and other
static component machinery as leaks. No checked leak appeared.

## Full TypeScript builds

**RAN** The v3 rows use temporary copies of each app's configuration with the
paths above, `noEmit`, `incremental: false`, and `extendedDiagnostics`. The
synthetic editor file is excluded. Wall time is measured around the compiler
process.

| app and types | wall | TypeScript total | files | types | instantiations | diagnostics |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Team Machine, local v3 | 7.90 s | 7.68 s | 5,071 | 259,756 | 1,002,057 | 108 |
| Chat, installed v2.4.6 | 18.28 s | 17.99 s | 8,290 | 611,449 | 3,676,556 | 2 |
| Chat, local v3 | 14.14 s | 13.87 s | 8,441 | 610,102 | 2,783,828 | 422 |

**RAN** Relative to Chat's installed v2 types, the local v3 run used 892,728
fewer instantiations, a 24.28% reduction. Its measured wall time was 22.66%
lower and its type count was 0.22% lower.

**INFERRED** The performance comparison is directional rather than a clean
passing-build benchmark. Chat is still v2 source, and the v3 overlay correctly
reports 420 additional migration diagnostics while continuing through the
whole graph.

## Full-build gaps handed to r16625

**RAN** Team Machine's installed beta has two unrelated `react-native-gpui`
`Diff` import errors. The current local v3 types add these migration or generic
API errors:

- `tamagui/features/animations-gpui/createAnimations.ts:177`: `AnimationDriver`
  rejects `isReactNative` with `TS2353`. The missing contextual type then
  produces seven `TS7006` errors and one `TS7031`.
- `interface/tm/Button.tsx:139`: `createStyledHOC` accepts a callback whose
  `ref` parameter is optional, while the app callback requires
  `Ref<TamaguiElement>`. This produces `TS2345`, followed by the ref assignment
  `TS2322` at line 159.
- The remaining 96 `TS2322` errors are dominated by source migration and
  generic composition sites. Examples include longhand `userSelect` under the
  app's shorthand-only configuration, widened `size: string`, and
  `RefCallback<unknown>` props spread into components requiring
  `Ref<TamaguiElement>` at `interface/tm/Composer.tsx:108`.

**RAN** Chat's v3 overlay reports 422 diagnostics: 313 `TS2322`, 51 `TS2353`,
21 `TS2820`, 11 `TS2339`, nine `TS2305`, and 17 across the remaining codes.
The first failures show v2 source spellings such as `$body` where v3 expects
`body`, plus old responsive and token value shapes. The installed v2 control's
two `TS2353` diagnostics are unrelated `can` fields in load-test and SDK setup
code.

**INFERRED** None of these failures has a sound local fix in
`code/core/web/src/types.tsx` or component prop declarations. Fixing the Team
Machine callback/ref cases requires a generic API decision, while the style and
Chat failures require app migration. No Tamagui type source or `test-d` file was
changed for this probe.

## Exact commands

**RAN** Setup, corpus checks, and builds:

```sh
cd /Users/n8/tamagui
sed -n '1,260p' AGENTS.md
sed -n '1,260p' CONTRIBUTING.md
sed -n '1,260p' plans/v3-beta/finish-line.md
sed -n '1,280p' plans/v3-beta/single-function-variants.md
sed -n '1,320p' plans/v3-type-performance.md
sed -n '1,320p' plans/v3-static-types-feasibility.md
(cd code/core/web && bun run build)
(cd code/ui/tamagui && bun run build)
mktemp -d /tmp/chat-types-probe.XXXXXX
(cd /Users/n8/chat && git archive --format=tar HEAD | tar -x -C /tmp/chat-types-probe.QqacOt)
(cd /tmp/chat-types-probe.QqacOt && bun install --frozen-lockfile --ignore-scripts)
rg -l "from ['\"](?:tamagui|@tamagui/)" --glob '*.{ts,tsx}' /Users/n8/team-machine/gui | wc -l
rg -l "from ['\"](?:tamagui|@tamagui/)" --glob '*.{ts,tsx}' /Users/n8/chat | wc -l
rg -n "\bhtml\.div\b" --glob '*.{ts,tsx}' /Users/n8/team-machine/gui /Users/n8/chat
```

**RAN** Final editor measurements:

```sh
bun scripts/probe-types.ts --app=team-machine --mode=v3 --runs=5 --json-out=/tmp/team-machine-v3-editor-receipt.json
bun scripts/probe-types.ts --app=chat --mode=v3 --app-root=/tmp/chat-types-probe.QqacOt --runs=5 --json-out=/tmp/chat-v3-editor-receipt.json
```

**RAN** Full compiler measurements:

```sh
bun scripts/probe-types.ts --app=team-machine --mode=v3 --runs=5 --tsc --json-out=/tmp/team-machine-v3-types-receipt.json --tsc-log=/tmp/team-machine-v3-types-receipt.log
bun scripts/probe-types.ts --app=chat --mode=v3 --app-root=/tmp/chat-types-probe.QqacOt --runs=5 --tsc --json-out=/tmp/chat-v3-types-receipt.json --tsc-log=/tmp/chat-v3-types-receipt.log
bun scripts/probe-types.ts --app=chat --mode=v2 --app-root=/tmp/chat-types-probe.QqacOt --tsc --json-out=/tmp/chat-v2-types-receipt.json --tsc-log=/tmp/chat-v2-types-receipt.log
```

## Repository validation

**RAN** `bun run typecheck` passed at the repository root. `bun run lint`
passed with five pre-existing warnings, and `bun run check` passed all seven
workspace checks.

**RAN** `bunx oxfmt --check scripts/probe-types.ts
plans/v3-beta/types-probe-receipt.md` passed, and `git diff --check` found no
whitespace errors in either file.

**RAN** The diff contains no change to Tamagui type source or a component prop
declaration, so the conditional `code/core/web` test-d suite was not required.
