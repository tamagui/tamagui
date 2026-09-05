# V3 style engine checkpoint 0 receipts

Checkpoint: ruler and pool

Date: 2026-08-27

Engine source commit: `18d49275e860d673c60e83a744be4b3931a959b8`

No engine source changed in this checkpoint. Fixture source hashes make the
measurement reproducible even though the measurement infrastructure and this
receipt land after the engine commit.

## Environment

| item | value |
| --- | --- |
| machine | `pro-64.local`, Apple arm64 |
| platform | macOS 26.5.1, build 25F80, Darwin 25.5.0 |
| Bun | 1.3.14 |
| Node | 25.9.0 |
| bundler | Vite 8.2.2 with Rolldown |
| minifier | Vite default `oxc` |
| compression | `node:zlib` `gzipSync`, level 9, run by Bun through `attribute-bundle-gzip.ts` |
| React treatment | `react`, `react/jsx-runtime`, and `react-dom/client` external |
| constants | `NODE_ENV=production`, `TAMAGUI_TARGET=web`; `EXTRACT`, `IS_STATIC`, `TAMAGUI_DID_OUTPUT_CSS`, and `TAMAGUI_ENABLE_STYLE_TOKEN_PROVENANCE` unset |
| source maps | enabled for attribution, excluded from compressed totals |

Fixture source SHA-256:

| fixture | hash |
| --- | --- |
| public `View` | `f9449b8a406369ff7486c8d9c76574428a932872dc28399ee1df5287e94a400b` |
| processor artifact | `06be6fca4b74efd0d98869f3c87a6c69863e5727e7ac6c2c1f8aaba3d0a38c4a` |
| generated prop corpus | `1eef702fd69dcd8853822326f024df6e1ebbcf63adcc978e69c84a99226bcee5` |

## Ruler

The public fixture retains a real styled `View` and covers ordinary values,
shorthands, tokens, clause strings, conditional objects, state, media, theme,
platform, group, container, transforms, variants, compounds, transition
discovery, and atomic CSS. Its opaque global input prevents the bundle from
precomputing the authored props.

The processor fixture imports `getSplitStyles` directly. It supplies config,
static component metadata, theme, component state, media state, group and
container state, animation-driver metadata, and host callbacks as inputs. It
invokes the production entry with opaque props and retains its result on
`globalThis`. React hooks, providers, portals, component construction, theme
storage, and animation-driver implementations are outside this artifact.
Grammar, frontend support, token and shorthand routing, property normalization,
transforms, atomic rules, variants, compounds, and output completion remain in
the artifact. Moving those implementations between source files cannot remove
them from this ruler.

Exact build command, run from `code/comparisons/tamagui-bench` once for each
mode named below:

```sh
NODE_ENV=production TAMAGUI_TARGET=web VITE_CONFIG_NATIVE_IGNORE_WARNING=true bunx vite build --mode <mode> --sourcemap --outDir /tmp/checkpoint0-<mode> --emptyOutDir
```

Exact direct-compression command, run from the repository root:

```sh
bun code/comparisons/attribute-bundle-gzip.ts /tmp/checkpoint0-<mode> --filter=__complete_artifact_only__
```

| artifact | mode | complete gzip |
| --- | --- | ---: |
| public `View` | `checkpoint-public-view` | 44,295 |
| processor | `checkpoint-processor` | **21,321** |
| legacy core union in the public fixture | `checkpoint-public-view` | 41,359 |
| phase-IV-a parser-cluster union in the public fixture | `checkpoint-public-view` | 4,770 |

**TESTED** - the processor source fixture returned 25 class-name entries, 26
rules, one forwarded host prop, and no inline style for its CSS-output input:

```sh
NODE_ENV=production TAMAGUI_TARGET=web bun -e "await import('./code/comparisons/tamagui-bench/src/checkpoint-processor.ts');const out=globalThis.__checkpoint0ProcessorResult;if(!out||!Object.keys(out.classNames).length||!Object.keys(out.rulesToInsert).length)throw new Error('processor fixture did not emit CSS output');console.log(JSON.stringify({classNames:Object.keys(out.classNames).length,rules:Object.keys(out.rulesToInsert).length,viewProps:Object.keys(out.viewProps).length,hasStyle:Boolean(out.style)}))"
```

The 21,321-byte processor result is the directional checkpoint-3 gate. It is a
complete artifact, not a sum of marginals.

## Section 4 baseline re-derivation

The four Tamagui rows use the same production build, external list, minifier,
and gzip command as the ruler. Each entry retains the named public value on
`globalThis`; the styled row evaluates `styled(View, {})`. Values differ from
the unsourced claims because this receipt measures current tip with a named
fixture and toolchain.

| row | old unsourced claim | current gzip | disposition |
| --- | ---: | ---: | --- |
| Tamagui `View` | 34,004 | 33,502 | reproduced, replace the old value |
| `styled(View, {})` | 35,650 | 35,058 | reproduced, replace the old value |
| `@tamagui/web` `TamaguiProvider` export | 6,085 | 5,360 | reproduced, replace the old value |
| `@tamagui/web` `TamaguiRoot` export | 4,525 | 3,991 | reproduced, replace the old value |
| StyleX `props` call | 848 | n/a | **deleted-unsourced** |
| StyleX namespace retained | 1,735 | n/a | **deleted-unsourced** |

Modes, in table order, are `baseline-view`, `baseline-styled-view`,
`baseline-provider`, and `baseline-root`. There is no StyleX fixture or StyleX
dependency in `code/comparisons`, and the two claimed values have no command or
source revision. This checkpoint does not invent a competing-package ruler, so
both StyleX rows are deleted.

## Deletion pool

Exact commands:

```sh
bun code/comparisons/attribute-bundle-gzip.ts /tmp/checkpoint0-checkpoint-public-view --core
bun code/comparisons/attribute-bundle-gzip.ts /tmp/checkpoint0-checkpoint-public-view --parser-cluster=phase-iv-a
bun code/comparisons/attribute-bundle-gzip.ts /tmp/checkpoint0-checkpoint-public-view --deletion-pool
```

`parser-cluster-manifest.json` now owns the deletion-family selectors beside the
existing relocation-guarded cluster selectors. Each row removes its selected
generated spans once and gzips the remaining public chunk once. Rows overlap
and must not be summed.

| family | marginal gzip |
| --- | ---: |
| `directStyle` runtime module | 5,590 |
| `propMapper` runtime module | 1,955 |
| `getSubStyle` | 310 |
| lifecycle scanners | 287 |
| frontend preprocessing and frontend programs | 89 |
| compound matcher chains, including `joinChains` | 335 |
| `overriddenContextProps` runtime writes | 190 |
| `nativeOnlyProps` | 322 |

The measured parser-cluster union is 4,770 gzip. The directStyle and propMapper
module marginals are gross declaration prices; replacement plumbing remains in
the final artifact, so they are not forecasts.

## Paired corpus timing

The generator adds fixed `zero-props` (`View`, `{}`) and `one-prop` (`View`,
`{ opacity: 1 }`) controls. The benchmark interleaves workspace V3 and installed
Tamagui 2.6.2 within every round, alternating which version runs first.

Exact commands:

```sh
bun code/comparisons/generate-get-split-styles-prop-corpus.ts
NODE_ENV=production TAMAGUI_TARGET=web bun code/comparisons/benchmark-get-split-styles.ts --label=checkpoint-0-18d49275e8 --output=code/comparisons/output/checkpoint-0-get-split-styles.json
```

Seed is `0x5e1757a1`. There were 3 warmups, 11 measured rounds, and at least
20,000 operations per scenario per round. Values are median ns/op with sample
standard deviation in parentheses.

| scenario | props/op | V3 | paired V2 | V3/V2 |
| --- | ---: | ---: | ---: | ---: |
| zero props | 0.00 | 233.3 (54.7) | 513.9 (120.5) | 0.454x |
| one prop | 1.00 | 574.7 (80.9) | 1,373.0 (210.7) | 0.419x |
| plain props | 2.28 | 2,932.9 (574.9) | 4,075.6 (655.1) | 0.720x |
| clause strings | 5.46 | 11,568.8 (2,051.0) | 9,576.4 (2,128.5) | 1.208x |
| conditional objects | 8.00 | 7,676.1 (1,363.3) | 4,537.9 (804.7) | 1.692x |
| variant props | 2.84 | 3,856.3 (679.0) | 3,319.2 (580.2) | 1.162x |
| shorthand-heavy | 5.30 | 6,512.6 (2,074.9) | 7,390.9 (1,403.2) | 0.881x |
| style-prop-heavy | 7.57 | 15,367.8 (3,134.9) | 14,568.1 (3,174.6) | 1.055x |
| total corpus | 2.56 | 3,883.5 (532.8) | 4,510.4 (1,996.2) | 0.861x |

The zero-to-one difference is 341.3 ns for V3 and 859.1 ns for V2 in this
paired run. This decomposes the first-property contribution from fixed call
overhead. It does not claim a linear per-prop slope.

## Clause-string CPU and allocation profile

Exact command:

```sh
bun code/comparisons/profile-hotpath.ts --scenario=clause-string --label=checkpoint-0-18d49275e8 --output=code/comparisons/output/hotpath/checkpoint-0-18d49275e8-clause-string-extract0.json
```

The `clause-string` profile name maps to the existing `flat` runtime fixture,
which combines flat clause strings, variants, twelve compound variants, state,
media, transition discovery, and runtime atomic emission. Profile settings are
3 warmups, 20 measured iterations, scale 200, 100 microsecond CPU sampling, and
1,024-byte heap sampling. The result file records host count, renders,
dispersion, ranked source frames, and ranked allocation frames.

The fixture mounts 200 hosts and performs 400 renders per measured iteration.
Mount median was 11.5 ms and update median was 11.8 ms. Heap sampling found
13,647,834 bytes per iteration, or 34,119.6 bytes per render. The largest
allocation sources per iteration were `directStyle.mjs` at 7,820,166 bytes,
`getSplitStyles.mjs` at 1,375,060 bytes, `createComponent.mjs` at 422,243
bytes, `expandStyles.mjs` at 302,800 bytes, and `propMapper.mjs` at 183,021
bytes. React DOM accounted for 1,139,568 bytes.

The leading engine CPU sources per iteration were `directStyle.mjs` at 12.822
ms, `getSplitStyles.mjs` at 1.488 ms, `scanFlatValue.mjs` at 1.190 ms,
`useComponentState.mjs` at 0.775 ms, `createComponent.mjs` at 0.599 ms, and
`propMapper.mjs` at 0.444 ms. The leading named engine CPU frames were
`directStyle.mjs:699` at 4.997 ms, `directStyle.mjs:344` at 2.145 ms,
`directStyle.mjs:733` at 1.992 ms, `directStyle.mjs:583` at 1.668 ms,
`scanFlatValue.mjs:42` at 1.132 ms, and `directStyle.mjs:381` at 0.892 ms.
Minified symbol names are recorded verbatim in the JSON profile and are not
treated as stable identities.

The allocation samples directly expose wrapper growth through native `push`
(849,786 bytes per iteration), condition membership through native `Set`
(114,593 bytes), and the directStyle clause pipeline through its four largest
frames (7,680,005 bytes combined). Source inspection, rather than sampled
symbol names, identifies `sort`, `source.slice`, string-key construction,
`joinChains`, and `Object.getOwnPropertyDescriptors`; the table below records
their stable source identities.

Frames and allocation sources that must disappear or materially collapse after
the rebuild:

| current work | current source | required outcome |
| --- | --- | --- |
| condition records, wrapper arrays, string condition identity | `directStyle.ts` clause resolution and emission | call-stack scalar condition state; wrappers and identity strings only for winning CSS output |
| per-clause `Set` work | lifecycle/program bookkeeping in `directStyle.ts` and `getSplitStyles.tsx` | one component-state mask and neutral output slots |
| transform `sort` | `directStyle.ts:1584-1601`, `getSplitStyles.tsx:1529-1556` | one authored-order transform accumulator |
| `source.slice` per modifier | `compoundScanHandler` and clause handlers | scanner passes scalar spans to the sink |
| `joinChains`, split/includes/join, and Cartesian wrapper arrays | `getSplitStyles.tsx:210-239` | numeric compound arena |
| `Object.getOwnPropertyDescriptors` | `getSplitStyles.tsx:1664-1750` (`getSubStyle`) | deleted with accepted substyles |

## Layered-scanning violations

Clause pass means identifying conditional clauses and modifiers. Payload pass
means interpreting the winning CSS value or completed output. These are the
current violations against one clause scan plus at most one payload scan.

| site | pass | current work and disposition |
| --- | --- | --- |
| `code/core/style-grammar/src/clauseIdentity.ts:194` | clause | definition-time `clauseIdentityScanner`; keep as the definition-time scan |
| `code/core/web/src/hooks/useComponentState.ts:121` | clause | lifecycle prepass over the same authored string; delete |
| `code/core/web/src/helpers/getSplitStyles.tsx:166` | clause | compound matcher scan; fold into the contribution cursor |
| `code/core/web/src/helpers/propMapper.ts:215` | clause | variant-clause scan; fold into the contribution cursor |
| `code/core/web/src/helpers/directStyle.ts:2029` | clause | emission scan; becomes the sole runtime clause scan |
| `code/core/web/src/hooks/useComponentState.ts:104-114` | clause | hand-written conditional-object key scan; delete with the lifecycle prepass |
| `code/core/web/src/helpers/directStyle.ts:800-817` | payload | `resolveEmbeddedTokens` regex scans words and reconstructs the payload; share the payload scanner |
| `code/core/web/src/helpers/directStyle.ts:819-879` | payload | `normalizeTransitionNames` walks the payload and slices/rebuilds it; share the payload scanner |
| `code/core/web/src/helpers/directStyle.ts:1156-1177` | payload | `splitComponents` walks and slices CSS components, with repeated callers; share the quote/parenthesis/escape primitive and scan once |
| `code/core/web/src/helpers/getVariantExtras.tsx:41` | payload | `font_*` class regex rescans completed class text; carry font identity as scalar output state |
| `code/core/web/src/helpers/getSplitStyles.tsx:1448,1464` | output payload | joins class wrappers, then splits the same string for RNW; populate the RNW map from the same class cursor |
| `code/core/web/src/helpers/propMapper.ts:30-53` | clause | `appendFlatClause` reconstructs a clause string for the wrapped component to parse again; pass structured clauses across the HOC boundary |

## Presence-context identity

**READ** - source has one context constructor:
`code/core/use-presence/src/PresenceContext.tsx:4-5` exports
`PresenceContext = React.createContext(null)`. Animation drivers import
`ResetPresence` and `usePresence` from `@tamagui/use-presence`; `PresenceChild`
imports `PresenceContext` from that package; and `@tamagui/animate-presence`
re-exports the package. No consumer package constructs another presence context.

**TESTED** - built ESM and CJS package graphs preserve that identity. The
following probes returned `true`:

```sh
NODE_ENV=production node --input-type=module -e "const own=await import('./code/core/use-presence/dist/esm/index.mjs');const animate=await import('./code/ui/animate-presence/dist/esm/index.mjs');console.log(own.PresenceContext===animate.PresenceContext)"
NODE_ENV=production node -e "const own=require('./code/core/use-presence/dist/cjs/index.cjs');const animate=require('./code/ui/animate-presence/dist/cjs/index.cjs');console.log(own.PresenceContext===animate.PresenceContext)"
NODE_ENV=production bun -e "const own=await import('@tamagui/use-presence');const animate=await import('./code/ui/animate-presence/dist/esm/index.mjs');console.log(own.PresenceContext===animate.PresenceContext)"
```

Bun resolves a direct relative ESM file and the package export under different
conditions, so comparing those two deliberately loaded formats creates two
module instances. The package-to-consumer check above is the built-package
identity that applications use.

## Behavior inventory and knip gate

`plans/getSplitStyles-behavior-inventory.md` now carries a current-tip ownership
map and marks its earlier stop-consolidation decision as superseded by the final
V3 style-engine plan. Historical sections remain regression provenance.

**READ** - the §14 knip gap remains open. `@tamagui/web` uses broad barrel
exports, so files reachable only through the barrel appear used to knip. A
passing `bun run check` therefore does not prove that core has no unreferenced
files. This checkpoint records the gap and does not weaken the gate or add a
second unused-code checker.

## Validation

**TESTED** - both required repository-root gates exited successfully:

```sh
bun run lint
bun run check
```

`bun run lint` reported only five existing warnings outside the changed files.
`bun run check` passed dependency, unused-dependency, Tamagui, reference, path,
standalone DOM-type, and LSP-pin checks.

The direct attribution commands in this receipt exited successfully and
returned the recorded results. `bun test
code/comparisons/attribute-bundle-gzip.test.ts` currently reports eight failures
because subprocesses launched from that Bun test file return their expected
exit codes with empty captured output streams. Running the identical generated
fixture and CLI command outside the test runner returns the expected output.
This output-capture failure affects the existing core, legacy-members, and
parser-cluster cases, including paths unchanged by this checkpoint.
