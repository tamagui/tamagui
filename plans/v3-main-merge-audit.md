# Auditing the main→v3-beta merge of 34 commits

Run by the verification lane, 2026-07-30, alongside the Codex lane's cherry-pick.

The question asked was: for each of the 34 commits on `origin/main` after
`66ec2bcd558d`, is the disposition right — and in particular, does a
SUPERSEDED call mean the fix is actually in, or only that the diff no longer
applies?

**Those are two different claims and the difference is where the risk is.**
Three of the four commits touching the pipeline this campaign rewrote were
judged SUPERSEDED. All three judgements are correct that the diff cannot be
cherry-picked. All three are wrong that the bug is handled. It is not, and one
of them is worse on v3-beta than it was on main.

## The headline: v3-beta bakes the build machine's media state into native styles

Measured, not read. Probe: `styled(View, { width: 10, $<key>: { width: 999 } })`
compiled for native through `CompilerFrontend`, default test config, in a clean
worktree at `d6b071694a` with its own `bun install --frozen-lockfile` and build.

| media key | native output | diagnostic |
|---|---|---|
| `$xs` `$sm` `$md` `$lg` `$xl` | `style={{"width":999}}` — applied **unconditionally** | none |
| `$xxs` `$gtXs` `$gtSm` `$gtMd` `$gtLg` | `style={{"width":10}}` — **dropped** | none |

The compiler resolves the media block against `getMedia()` as it stands on the
build machine — `{xl:true, lg:true, md:true, sm:true, xs:true, gt*:false}` — and
freezes the result. On a tablet, `$gtLg` styles never apply. On a phone,
`$xl`/`$lg`/`$md` styles apply when they should not. Every case folds to a raw
`__TamaguiNativeView` and emits **zero diagnostics**.

The same happens to pseudos. `styled(View, { width: 10, pressStyle: {...} })`
folds to a raw RN View and drops `pressStyle` silently — a pressable component
loses its press feedback with nothing said. The *inline* form
`<View width={10} pressStyle={...} />` bails correctly.

### Root cause, one location

`code/compiler/static/src/compilerHost.ts:1095`:

```ts
if (
  platform === 'native' &&
  Object.keys(props).some((name) => name.startsWith('$') || name.endsWith('Style'))
) {
  return bailout(input, 'local/unsupported-target',
    'Native pseudo, media, and theme variants remain on the runtime path')
}

const defaultProps = core.getDefaultProps(component.staticConfig) ?? {}
const completeProps = core.mergeProps(defaultProps, props)
const split = resolveSplitStyles(completeProps, component.staticConfig)
```

The guard tests `props` — the JSX attributes — and runs *before* `defaultProps`
is merged on the next line. Media and pseudo keys arriving from the `styled()`
definition are invisible to it. `resolveSplitStyles` then receives them in
`completeProps`, resolves them against build-time media state, and flattens.

### The fix, demonstrated rather than proposed

Moving the guard below the merge and testing `completeProps` instead of `props`:

- all ten media keys bail with `local/unsupported-target` and stay on the
  runtime path, where the runtime resolves media per device;
- `pressStyle` on a `styled()` definition bails;
- inline behaviour is unchanged.

Gates in the same worktree after the change, all green and all matching the
`plans/v3-pre-push-gate-audit.md` baselines:

| Gate | Result |
|---|---|
| static-tests native | 32 passed / 3 files |
| static-tests web | 110 passed, 2 skipped / 14 files |
| webpack | 20 passed / 20 |

**Those green suites are not evidence the fix is safe**, and should not be read
as such. They pass because they do not cover the path — see below.

### What it costs

Ten representative real usages (`View`, `View` + token, `YStack`, `Text`,
`SizableText`, `Button`, `Card`, `Input`, `Separator`, `Spacer`) compiled for
native, before and after: **byte-identical**. Every one of those that bails,
bails for a different reason already (theme tokens, variants), and the three
that flatten (`plain View`, `YStack`, `Spacer`) still flatten.

So the measured cost on stock components is zero. Stated honestly: that sample
does not contain the population the change actually moves. What moves is
user-authored `styled()` definitions carrying media or pseudo defaults with no
theme token and no other bailout trigger — and every one of those is currently
being mis-compiled, so moving it to the runtime path is a correction, not a
regression.

### Why no gate caught it

There is not a single `styled(` call in any native compiler test:
`babel.native.test.tsx`, `flatten.native.test.tsx`, `domLowering.native.test.tsx`.
The styled-definition native lowering path has **zero coverage**. Three
silent-wrong-output defects live in it.

This is the same shape as the grammar suite CI had never run: the suite is
green, the number looks like coverage, and the path it would have to touch is
not in it.

## Two copies of core, confirmed

`a4ce4e9bdb`'s premise is not hypothetical on v3-beta. In one extraction
process:

```
@tamagui/core/native -> code/core/core/dist/native.cjs
  mediaQueryConfig = ["xl","lg","md","sm","xs","xxs","gtXs","gtSm","gtMd","gtLg","gtXl","motionReduce","motionSafe"]
@tamagui/core        -> code/core/core/dist/cjs/index.cjs
  mediaQueryConfig = []
```

Two copies, one configured, same process. And the fix is absent verbatim:
`code/core/web/src/helpers/mediaState.ts` still declares module-local
`mediaQueryConfig` and `mediaKeys`, `hooks/useMedia.tsx` still has module-local
`mediaKeysOrdered`, `config.ts` still has module-local `tokensMerged`.

**Stated plainly so it is not over-read:** the split is confirmed, but it is
*not* shown to be what causes the styled() drop above. The copy the native
lowering requires (`@tamagui/core/native`) is the populated one. These are two
separate defects that happen to look alike. Landing `a4ce4e9bdb` must not be
recorded as fixing the media freeze.

## Disposition, formed independently

Formed before reading the Codex lane's, from the diffs and the current v3-beta
tree.

### Take

| Commit | Why |
|---|---|
| `a4ce4e9bdb` | absent verbatim; two-copy condition confirmed live |
| `3725665561` popper | landed as `1522cf58bc` |
| `08cdf5426b` `20ed7b6a7e` `763cca923b` `5db015bc32` | landed squashed as `6d87a60095` |
| `dc864c1e37` `d9d33b9707` image | landed as `54dfda22e4` |
| `2b2c08f422` + `61c9f61369` | landed as `2ddcfb0611` |
| `eb1542a35f` docs | landed as `d6b071694a` |
| `2d3bf61f40` | absent, and a real gap — see below |
| `74103bdeee` | absent across 9 manifests — see below |

### Reimplement, not superseded

`14a82ba1c7`, `5bd95d0eb3`, `39d7ba357a`. Their diffs target
`createExtractor.ts` and `extractToNative.ts`, both deleted in the v3 rewrite,
and their tests use an `output.ast` the v3 `extractForNative` no longer returns.
None of it is cherry-pickable. The behaviour they protect — #4133 media
conditions on native, #4149 deoptimized props surviving — is broken on v3-beta
as documented above.

### Superseded, genuinely

`c31ce2ccf0`, `8e7e3f9837`, `5a9bd94302` are already present identically in
`.github/workflows/release.yml`. `a8d4cd0b04` was superseded by `e8e24ca17c`,
which deleted v1 Button as part of the v3 component contract.

`ef92d54e38` is structurally moot: v3-beta's `RadioGroupIndicatorFrame` is
`styled(View, { name })` with no variants, and `pressTheme` has zero hits
repo-wide. Worth noting separately that v3-beta has no behavioural RadioGroup
test at all — that is a coverage gap, not a merge action.

### Two calls worth arguing about

**`2d3bf61f40` — canary from any branch.** On v3-beta today,
`.github/workflows/release.yml` still requires current `main` and a full green
CI for every dispatched release including canary, and still pushes a version
commit to `main`. The "Require current main and successful full CI" step has no
`if:`, the branch assertions in "Validate release source and select baseline"
are unconditional, and "Push release commit" has no guard. This is the exact
wedge the commit removes, and it is a live constraint on release operations.

**`74103bdeee` — npm package metadata.** Absent across nine manifests:
`repository.url` still lacks the `git+` prefix in `code/core/core`,
`code/core/web`, `code/packages/native-ci`, `code/packages/react-native-web-lite`,
`code/ui/tamagui`; `bin` is still in non-canonical form in `code/core/cli`,
`code/core/create-tamagui`, `code/packages/bento-get`, `code/packages/build`.
The release-side stamping moved from `scripts/release.ts` to
`scripts/v3-release-dry-run-lib.ts`'s `createTemporaryPackManifest`, which still
writes the un-prefixed URL — while `scripts/bootstrap-v3-beta-oidc.ts` already
uses `git+`. So the repo disagrees with itself in the generator that actually
produces published manifests. Given this repo publishes through npm trusted
publishing, the repository field feeds provenance. I have **not** verified that
the un-prefixed form breaks provenance attestation; flagging it as worth
settling, not as a proven break.

### Drop

The four version bumps (`9dfc97ad62`, `e2f8bce3c4`, `4da363463e`, `cbb7a0803a`)
would rewrite ~180 manifests onto v2 numbering.

`3f86c5ecc4`, `14e33777e3`, `c4638bebb7` target `scripts/cache-npm-webauth.cjs`,
which does not exist on v3-beta; `scripts/release.ts` batches publishes six at a
time and recovers via `isPublished()` registry checks plus `--republish`. One
piece is genuinely absent — `c4638bebb7`'s tarball reuse on republish; v3-beta
does `fs.remove(tmpDir)` unconditionally. That is robustness, not correctness.

## Reproducing

The probes are in the session scratchpad, not the repo. The shape:

```ts
// code/compiler/static-tests/tests/<name>.native.test.tsx
import { extractForNative } from './lib/extract'
const out = await extractForNative(`
  import { styled, View } from 'tamagui'
  const Box = styled(View, { width: 10, $gtLg: { width: 999 } })
  export function Test() { return <Box /> }
`)
// out.code folds to __TamaguiNativeView with width:10, out.diagnostics is []
```

Run with:

```
cd code/compiler/static-tests
INCLUDE_CSS_COLOR_NAMES=1 npx vitest \
  --config ../../packages/vite-plugin-internal/src/vite.config.cjs.ts \
  --run --dangerouslyIgnoreUnhandledErrors tests/<name>.native.test.tsx
```

`vitest` swallows `console.log` under this config — write to a file from inside
the test instead. That cost a run to notice.

## What would close this

1. Move the native bailout guard below the `mergeProps` call and test
   `completeProps`. One line, demonstrated above.
2. Add `styled()` cases to the native compiler tests. Any of them fails today.
   Confirm each fails before the guard fix and passes after, rather than
   asserting on output shape.
3. Decide separately whether the right long-term answer is bailing or emitting
   conditional native styles. Bailing is correct and cheap now; it is not
   obviously the end state for native media support.
