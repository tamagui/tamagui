# v3 string style-prop grammar: toolchain review for the Soot factory

Repo `/Users/n8/tamagui`, branch `v3-beta`, HEAD `7fb616872a`, tree clean at start.
Read-only review. Nothing committed, no branch switched, no release command run.
Every probe lives under gitignored `tmp/` directories listed at the end.

## Verdict in one paragraph

The grammar itself is solid and fast, and the checker really does run in a browser
for about 46 KB gzip. The problem for a factory driven by small LLMs is that
**nothing in the toolchain validates a payload**. TypeScript, the runtime, and
`tamagui check` all agree that `bg="backgroun hover:x"` is fine; it renders as
`background-color: backgroun` and the browser drops the declaration. Modifier
keys are validated everywhere and validated well. Token and literal names are
validated nowhere. That is the one gap that decides whether a factory can ship
generated code unattended, and it is closable in-browser today with an API that
already exists (`completions`), which is why I would call it a risk to design
around rather than a blocker.

One thing I would fix before moving Soot: a `tamagui check` false-positive class
that already fires 6 times on the repo's own kitchen-sink source. On speed I
came in expecting to file a complaint and left without one: measured in a real
browser, the whole corpus renders **0.74-0.82x** of v2, and clause strings cost
about 15% more than v2 objects.

---

## 1. Type strength

### What the type actually is

`code/core/web/src/types.tsx:2127`:

```ts
export type FlatStyleValue<T> = T | FlatStyleObject<T> | (string & {})
```

The design note directly above it (`types.tsx:2080-2087`) is explicit:

> `(string & {})` admits the broad string without collapsing the token/literal
> unions, so autocomplete survives. Candidate and modifier validation is the
> compiler's and language service's job.

`code/core/web/src/flatValueTypes.test-d.ts:44-46` says the same about keys:

> with no user config MediaQueryKey is string, so unknown keys also pass
> here; key validation is the language service's and compiler's job

So the answer to "what does TypeScript reject" is decided by that one union arm.

### Method

**RAN** Five probe files in `code/kitchen-sink/tmp/gprobe/` (gitignored,
confirmed with `git check-ignore -v`), each importing
`../../src/tamagui.config`, so the real `TamaguiCustomConfig` augmentation is in
scope: `onlyAllowShorthands: false`, `allowedStyleValues: 'somewhat-strict'`, the
default media set plus `motionReduce`/`motionSafe`.

```sh
./node_modules/.bin/tsc -p code/kitchen-sink/tmp/gprobe/tsconfig.json
```

TypeScript 6.0.3 (`node_modules/typescript`). `--listFiles` confirms all five
probes are in the program. A negative control (`const x: number = "…"`) in a
sixth file produced `TS2322`, so the program is genuinely being checked.

### Result: strings

**TESTED** Every one of these typechecks with zero diagnostics.

| written | verdict |
| --- | --- |
| `<View padding="4 smm:6" />` | typechecks (unknown media key) |
| `<View bg="backgroun hover:x" />` | typechecks (typo token + junk literal) |
| `<View bg="notacoloratall" />` | typechecks |
| `<View bg="red hoverr:blue" />` | typechecks (unknown modifier) |
| `<View padding="!!!! ::::" />` | typechecks |
| `<View position="absolut" />` | typechecks (misspelled enum) |
| `<View bg="red hover:" />` | typechecks (empty clause) |

The literal-union case is the one worth pausing on. `position` is typed
`FlatStyleValue<'absolute' | 'relative' | 'static' | 'sticky' | 'fixed' |
'unset'>`, and `(string & {})` swallows `"absolut"` all the same. Autocomplete
still offers the four correct spellings, and nothing rejects a fifth.

**TESTED** Numeric/string confusion is also entirely unchecked. All nine of
`p={4}`, `p="4"`, `opacity={0.5}`, `opacity="0.5"`, `opacity="half"`,
`width={100}`, `width="100"`, `width="100px"`, `zIndex="notanumber"` typecheck.

### Result: objects

**TESTED** Object keys ARE checked, with did-you-mean suggestions:

```
p3-typo-object.tsx(7,33): error TS2561: Object literal may only specify known
  properties, but 'hovr' does not exist in type 'FlatStyleObject<…>'.
  Did you mean to write 'hover'?
p3-typo-object.tsx(8,34): error TS2353: … 'smm' does not exist in type …
```

**TESTED** How deep that goes (`p6-object-keys.tsx`):

| key | verdict | why |
| --- | --- | --- |
| `dark` | accepted | correct |
| `dark_blue` | **rejected** | `RootThemeName` strips sub-themes |
| `dark:hover` | accepted | correct |
| `darkk:hover` | **rejected** | first chain segment is checked |
| `dark:hovr` | accepted | gap: only the first segment is a union |
| `group-hover/card` | accepted | correct |
| `group-hovr/card` | **rejected** | correct |
| `ios`, `android`, `web` | accepted | correct |
| `iOS` | **rejected** | correct, case-sensitive |
| `@sm` | accepted | correct |
| `@nope` | accepted | gap: the arm is `` `@${string}` `` |
| `{ hover: 'notacolor' }` | accepted | payloads are `(string & {})` by design |

The two gaps come straight from `FlatClauseName` (`types.tsx:2101-2104`): the
chain arm is `` `${ClauseModifierName}:${string}` `` and the container arm is
`` `@${string}` ``, so neither validates past the first segment.

**TESTED** The type layer has not gone soft in general. `<View paddingg="4" />`
is `TS2322` with `Did you mean 'padding'?`, `<View bg={5} />` and
`<View position={5} />` are both `TS2322`. It is only strings, and only their
contents, that pass.

### For the factory

The object form is strictly stronger than the string form and, per section 4,
marginally faster. If a factory emits Tamagui props, it should emit
`bg={{ default: 'red', hover: 'blue' }}` and get first-segment modifier
validation from `tsc` for free. It will still get nothing on payloads.

---

## 2. Runtime diagnostics

### The code path

`code/core/web/src/helpers/warnOnce.ts` owns the whole story. `warnRefusedValue`
is dev-only, keyed on `refused:${property}=${value}` so each distinct typo
reports once, bounded at 500 keys. Its doc comment is worth reading; it explains
why it warns rather than throws (a style value is an ordinary place to put
untrusted text). Call sites: `getSplitStyles.tsx:2387` (unknown modifier),
`:2431` (scanner refusal), `:3342` (empty clause).

Nothing in the runtime calls `validatePayloadShape` or
`resolveCandidateTarget`. **RAN** `grep -rn validatePayloadShape code/core/web/src
code/core/style-grammar/src code/compiler` returns only the tooling path.

### Probe

**TESTED** `code/core/core-test/tmp/gwarn.web.test.tsx`, run with

```sh
cd code/core/core-test
TAMAGUI_TARGET=web NODE_ENV=development npx vitest --run \
  --config ../../packages/vite-plugin-internal/src/vite.config.ts tmp/gwarn.web.test.tsx
```

against `@tamagui/config-default`, capturing `console.warn` and the emitted CSS
rules (`StyleObjectRules`).

| props | emitted CSS | dev warning |
| --- | --- | --- |
| `padding="4 hover:6"` | `padding:var(--t-space-4)` + hover rule | none |
| `bg="red hoverr:blue"` | `background-color:red` | `backgroundColor="red hoverr:blue" had a segment dropped: unknown modifier "hoverr"` |
| `padding="4 smm:6"` | `padding:var(--t-space-4)` | `… unknown modifier "smm"` |
| `bg="notacoloratall"` | `background-color:notacoloratall` | **none** |
| `bg="backgroun hover:x"` | `background-color:backgroun` + hover `x` | **none** |
| `position="absolut"` | `position:absolut` | **none** |
| `opacity="half"` | `opacity:half` | **none** |
| `zIndex="notanumber"` | `z-index:notanumber` | **none** |
| `padding="background"` | `padding:background` | **none** |
| `bg="red hover:"` | `background-color:red` | `… a conditional clause has no value` |
| `padding="!!!! ::::"` | `padding:!!!!` | `… a conditional clause has no value` |
| `bg="red; color: blue"` | nothing | `… ";" would end the declaration or rule` |
| `bg={{default:'red', hovr:'blue'}}` | `background-color:red` | `backgroundColor="blue" had a segment dropped: unknown modifier "hovr"` |
| `bg="sm:green red"` | `@media(max-width:800px){background-color:green red}` | `… has multiple values after its first conditional. Write the base value before the first conditional.` |

The warnings that exist are good: they name the property, quote the whole
authored value, and say exactly which token caused it. The CSS-injection guard
works and drops the whole value.

The silences are the problem. A hallucinated token becomes a literal CSS
declaration the browser discards. The element renders with the property simply
missing, in dev and in prod, with nothing in the console.

One message is mildly misleading: the object-form warning reports
`backgroundColor="blue"` when the author wrote an object, so the quoted value is
the clause payload rather than what is on screen.

### `p={4}` versus `p="4"`

**TESTED** These are different values, and nothing says so.

```
padding={4}  ->  ._p-1940588895{padding:4px}
padding="4"  ->  ._p-416156015{padding:var(--t-space-4)}
```

**RAN** In `@tamagui/config-default` (`code/core/config-default/src/index.ts:51,87-93`)
`size[4] = 44` and space is `floor(44 * 0.7 - 12)`, so `--t-space-4` is **18px**.
`p={4}` is 4px. Same for `p={6}` (6px) versus `p="6"` (32px) and `p={2}` (2px)
versus `p="2"` (7px).

A model that writes `p={4}` where it meant `p="4"` gets a layout 4.5x tighter,
with no type error, no runtime warning, and no static diagnostic. For a factory
where a smaller model is choosing between JSX numeric braces and string props,
this is the most likely silent-wrong-output failure in the whole surface.

---

## 3. The checking tools

### They do share one grammar

**RAN** The dependency graph is genuinely single-owner:

- `@tamagui/eslint-plugin` (`src/validFlatValues.ts:1-12`) imports
  `extractStyleSitesFromEstree` from `@tamagui/language-service/extract-estree`
  and `diagnoseStyleValueProgram` from `@tamagui/style-grammar/tooling`.
- `npx tamagui check` (`code/core/cli/src/cli.ts:29-38`) calls `checkStyleFiles`
  from `@tamagui/language-service/check`, which builds `createStyleTooling` from
  `./core`, which is `@tamagui/style-grammar/tooling`.
- The tsserver plugin (`code/core/language-service/src/index.ts:9`) imports the
  same `./core`.
- The Rust LSP's tables are generated from the TS grammar.
  **RAN** `cd code/core/style-grammar && bun run check:rust` exits 0, so
  `code/lsp/crates/tamagui-grammar` is in sync at this HEAD.

**RAN** All three suites are green:
`style-grammar` 539 tests / 32 files, `eslint-plugin` 6 tests,
`language-service` 21 tests.

### But the runtime is a second opinion

This is the important caveat to "one grammar". `@tamagui/web` uses
`@tamagui/style-grammar/runtime` (`scanFlatValue`), not `/tooling`, and the two
disagree in both directions:

- Only tooling runs `validatePayloadShape` and `resolveCandidateTarget`. So
  `padding="background"` is a static error and a silent runtime pass.
- Only tooling knows the v6 theme rename table, so `bg="red darkBlue:blue"`
  gets `"backgroundHover" is not a v6 built-in name; use "background-hover"`
  statically and `unknown modifier "darkBlue"` at runtime.

Both directions are defensible. The factory just cannot treat "checker clean" and
"renders correctly" as the same statement.

### What the checker actually catches

**TESTED** `code/kitchen-sink/tmp/gprobe/diag2.mjs`, driving
`createStyleTooling` over `code/kitchen-sink/.tamagui/tamagui.config.json`:

Caught, with exact spans:
- every misspelled modifier, including `@nope`, `grouphover`, `iOS`,
  `dark_blue`, `$sm` (the v2 `$media` spelling)
- empty modifier segments and empty clause payloads
- opacity suffix out of range (`background/150`)
- a known candidate on a property it does not contribute to
  (`fontSize="background"` names all 14 properties `background` does serve)
- v6 theme-name renames and removals

Not caught, all reported `ok`:
- `bg="blu"`, `bg="blue10"`, `bg="$blue10"`, `alignItems="centre"`,
  `fontFamily="bodyy"`, `padding="$4"`, `position="absolut"`, `opacity="half"`

The design reason is in `toolingDiagnostics.ts:361-363`: an unresolved identifier
is legal raw CSS (`grid-area: a/2`), so it is deliberately passed through. That
is the correct call for a hand-written app and the wrong one for an LLM factory,
where a plausible-but-nonexistent token is the single most common error.

### A false-positive class that already fires on this repo

**TESTED** `cd code/kitchen-sink && npx tamagui check --styles-only` reports
**15 problems in 3 files (530 checked)**. Nine are my probe files. The other six
are real kitchen-sink source:

```
src/usecases/HeightMediaQueryOverrideCase.tsx:9:21 error
  "left top" holds 2 values but "transformOrigin" takes one.
```

**TESTED** `transformOrigin="left top"` is legal CSS and renders correctly:
the runtime emits `._to-230429336{transform-origin:left top}` with no warning,
and `transformOrigin="left top hover:center center"` correctly produces both the
base and the hover rule. The checker is wrong.

Cause: `code/core/style-grammar/src/ast/payloadShape.ts:33-59` keeps an allowlist
`listValuedLonghands` of properties whose value is a component list.
`transformOrigin` is missing from it. So is `flex` and so is `aspectRatio`.

**TESTED** Sweeping 29 legal CSS values (`diag4.mjs`), 4 are flagged:

| value | checker | runtime |
| --- | --- | --- |
| `transformOrigin="left top"` | error | `transform-origin:left top` |
| `transformOrigin="50% 50%"` | error | works |
| `flex="1 1 auto"` | error | `flex:1 1 auto` |
| `aspectRatio="16 / 9"` | error | `aspect-ratio:16 / 9` |

The other 25, including `boxShadow="0 2px 4px red"`, `inset="0 auto auto 0"`,
`border="1px solid red"`, `perspectiveOrigin="left top"`, pass correctly.

This matters more for a factory than for a person. A human sees the squiggle,
knows the CSS is fine, and moves on. A factory that gates generated output on
`tamagui check` rejects valid work and, if it feeds the diagnostic back to the
model, teaches it to avoid a correct spelling.

### Can it run in a browser? Yes, proven

`code/core/language-service/src/core.ts:1-6` opens with:

> Browser-safe by contract: no node imports, no typescript imports. Everything
> here works from the serialized config JSON the Tamagui compiler emits, so the
> same engine powers the tsserver plugin, the VS Code extension, the CLI
> checker, and in-browser IDEs.

**RAN** That holds. `grep` for `node:` imports across `core.ts`,
`extract-sucrase.ts`, `extract-estree.ts`, `document.ts` and all of
`style-grammar/src/tooling/` returns nothing. `check.ts` is the node-only shell
(the `readdirSync` walk and the code frames) and `index.ts` is the tsserver
plugin (`node:path` + `typescript`). Neither is on the browser path.
`@tamagui/style-grammar` declares `"dependencies": {}`.

**TESTED** I did not stop at the grep. `code/kitchen-sink/tmp/gprobe/browser/`
bundles `createStyleTooling` + `createDocumentStyleTooling` +
`createSucraseStyleSiteExtractor` + the kitchen-sink config JSON with
`esbuild --platform=browser`, loads it in headless Chromium via Playwright, and
checks a whole generated component source. Result:

```
load+check ms: 63
pageerrors: none
hasProcess: "undefined"
styleProps: 185
colorCandidates: 341
diagnostics:
  "backgroundHover" is not a v6 built-in name; use "background-hover"
  "smm" is not a registered modifier
  "darkk" is not a registered modifier
  the "hover:" clause has no value
  "left top" holds 2 values but "transformOrigin" takes one.   <- the false positive
```

No node builtins, no oxc, no native binary. The sucrase parser is *injected*
(`createSucraseStyleSiteExtractor(parser)`, `extract-sucrase.ts:58`), so a factory
that already has an AST can skip it entirely.

### Bundle cost

**RAN** `esbuild --bundle --format=esm --platform=browser --minify --target=es2020`,
gzip -9:

| entry | minified | gzip |
| --- | ---: | ---: |
| grammar tooling only (`diagnose`/`complete`/`annotate`/`canonicalize`) | 43,279 | **13,662** |
| \+ language-service `core` + `document` + `extract-sucrase` | 55,098 | **18,078** |
| sucrase parser (`sucrase/dist/parser`) | 156,063 | **28,333** |
| `@tamagui/style-grammar/runtime` (for comparison) | 31,625 | 9,811 |

Plus the config data. The kitchen-sink artifact is 3.97 MB raw / 63 KB gzip; the
grammar-relevant slice (`shorthands`, `media`, `themes`, `tokens`, `fonts`) is
1.58 MB raw / **29.9 KB gzip**.

So a factory that checks whole generated files pays ~46 KB gzip of code plus
~30 KB gzip of config. One that checks prop-by-prop and skips sucrase pays
~14 KB + ~30 KB.

**RAN** Throughput (`diagbench.mjs`, node): `createStyleTooling` costs **8.5 ms
once**, then `diagnostics(property, value)` runs at **1,289 ns per value**, about
776,000 values/sec. Checking every prop a factory emits is free.

### The completions API closes the payload gap

**RAN** `tooling.completions(property, value, offset)` returns the full
configured vocabulary from the same browser-safe module:

- `completions('backgroundColor', '', 0)` returns **341** entries, all
  `kind: "configured"` (`accent-background`, `amber-500`, `background`, …)
- `completions('padding', '', 0)` returns **77**
- `completions('backgroundColor', 'red ', 4)` returns **85** modifier entries
  with `insertText` already carrying the trailing `:`
- `completions('backgroundColor', 'red hover:', 10)` returns the 341 payloads
  again, so it is chain-aware

This is the missing token check. A factory can build a per-property allowed set
once at boot from `completions(prop, '')`, and reject a generated payload that is
neither in that set nor a recognized CSS literal. Same package, same config, no
new grammar.

---

## 4. Runtime cost without the compiler

### There is a parse cache

`code/core/style-grammar/src/runtime/scanFlatValue.ts:295-313`:

```ts
const parsedValues = new Map<string, ParsedFlatValue>()
const parsedValuesLimit = 4096
```

Module-level, keyed on the raw string, evicting one entry at a time in insertion
order. The comment explains the single-eviction choice: clearing the whole map
makes an app with more distinct values than the limit rescan nearly everything
per render. The renderer reaches it through
`getConfigRevisionState(conf).parseFlatValue` (`getSplitStyles.tsx:3271`).

Dev and prod use different scanners (`parseFlatValueChecked` vs
`parseFlatValueProduction`); only the checked one produces the refusal
diagnostics from section 2.

### Parse cost per value

**RAN** `code/kitchen-sink/tmp/gprobe/bench/runtime-scan.mjs`, Bun 1.4.0,
darwin/arm64, `NODE_ENV=production`, median of 3 timed loops:

| operation | ns/op |
| --- | ---: |
| warm cache hit, any value | 1.2 – 2.6 |
| cold scan, `"red"` | 27.3 |
| cold scan, `"4"` | 24.8 |
| cold scan, `"red hover:green dark:hover:blue"` | 120.2 |
| cold scan, six clauses | 299.0 |
| cold scan (dev, checked), two clauses | 105.5 |
| cold scan (dev, checked), six clauses | 284.8 |

**RAN** The tooling AST parser (`parseValue`, used by the checker, not by
renders) via `bench/parse-cost.mjs`: plain 64.6 ns, two clauses 400 ns, six
clauses 861.7 ns, evaluate two clauses 155.3 ns, cache key + `Map.get` 29.5 ns.

Note: `bun run bench` in `code/core/style-grammar` is **broken at this HEAD**.
`src/index.ts` is literally `export {}`, so the bench's
`from '../src/index.ts'` throws `SyntaxError: Export named
'createModifierRegistry' not found`. I ran it from a copy with the imports
repointed at the real modules.

### String versus object, same rendered result

**TESTED** `code/core/core-test/tmp/gab.web.test.tsx`, four props with two to
three conditions each, through the real `getSplitStyles` call shape, node
v25.9.0:

| shape | ns/op |
| --- | ---: |
| plain values, no conditions | 16,555 |
| **clause strings** (`bg="red hover:blue press:green"`) | **27,082** |
| **flat objects** (`bg={{default:'red',hover:'blue',press:'green'}}`) | **26,026** |
| clause strings, every value unique per iteration | 27,638 |

Two things follow, and both are good news for a factory:

1. The string form costs **+4%** over the object form. The grammar is not what
   you pay for; conditions are.
2. A completely cold parse cache costs **+2%**. A factory generating unbounded
   distinct strings will not thrash on the 4096-entry limit in any way that
   matters. The receipt's own profile agrees: `parseFlatValue` was 2% of self
   time.

This A/B ran under node with no `document`, which per the next section inflates
v3's absolute numbers. Both arms are inflated the same way, so the +4% and +2%
gaps hold; treat the raw ns as a shape, not a browser figure.

### The v2 comparison: the receipt is right, and node lies

`plans/v3-beta/runtime-corpus-receipt.md` publishes total **0.79x** v3/v2 and
clause strings **1.22x**. I could not reproduce that under node, spent a while
chasing why, and in the end confirmed the receipt by running the corpus in a
real browser.

**RAN** Headless Chromium via Playwright, the corpus benchmark ported to run in
the page (`tmp/gprobe/browser/bench.ts`, bundled with esbuild for the browser),
9 rounds, 3 warmups, real `document`, `NODE_ENV=production`. Two independent
runs, identical checksum 24,964,212 both times:

| scenario | elements | props/op | v3 ns | v2 ns | v3/v2 | run 2 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| zero-props | 1 | 0 | 255 | 180 | 1.417x | 1.238x |
| one-prop | 1 | 1 | 860 | 975 | 0.882x | 0.977x |
| plain-props | 6,745 | 2.28 | 2,501 | 3,400 | 0.735x | 0.740x |
| **clause-strings** | 625 | 5.46 | 8,975 | 7,760 | **1.157x** | 1.134x |
| **conditional-objects** | 14 | 8 | 6,523 | 5,533 | **1.179x** | 1.261x |
| variant-props | 1,674 | 2.84 | 4,142 | 5,575 | 0.743x | 0.797x |
| shorthand-heavy | 345 | 5.3 | 6,487 | 7,941 | 0.817x | 0.970x |
| style-prop-heavy | 540 | 7.57 | 10,575 | 13,528 | 0.782x | 0.825x |
| **total** | 8,948 | 2.56 | 3,487 | 4,280 | **0.815x** | **0.739x** |

That is the receipt's number. v3 is faster than v2 overall in a browser, and the
clause-string scenario costs about 15% more than v2's object equivalent, close
to the receipt's 1.22x.

The v2 control is real v2: `code/comparisons/v2-control/node_modules/@tamagui/web`
is 2.6.2, and the harness asserts `'styledDynamic' in v2Web` is false
(`bench.ts:75`), which is a v3-only export, so a mis-resolution to the workspace
build would throw rather than quietly measure v3 against itself.

**Where my earlier node number came from, and why to ignore it.** Running the
committed `code/comparisons/benchmark-get-split-styles.ts` under node v25.9.0,
21 rounds, gives total **1.470x**, clause-strings 1.797x, conditional-objects
2.126x (a 9-round run agreed at 1.472x). Under Bun the same corpus gives
**0.750x**. So:

| environment | `document` | total v3/v2 |
| --- | --- | ---: |
| headless Chromium (V8) | yes | **0.815x / 0.739x** |
| Bun 1.4.0 (JSC) | no | 0.750x |
| node v25.9.0 (V8) | no | 1.470x |

**INFERRED** Node is the outlier, and the receipt's own closing note explains it:
with no `document`, `flushDirectStyles`/`updateRules` re-run every pass where a
browser pays once per generated class, and v3 does more of that work than v2.
The node figure measures an SSR-ish shape, not what a user's Chrome does. I
earlier put this down to V8 versus JSC; that was wrong, since Chromium is V8 and
lands with Bun.

Two things still worth knowing:

- The committed benchmark's default runtime is node, so anyone who runs it will
  see 1.47x and think the receipt is stale. It is the harness environment that
  is wrong, not the receipt. Worth a note in the receipt or a browser mode in
  the harness.
- Under Bun the current harness cannot run at all: v2's `config-default`
  resolves `@tamagui/animations-react-native` to the workspace v3 build and it
  throws `This animation driver only works on native`.

## 5. Web bundle

### The size gate has zero headroom

**RAN** on the pinned node (`.node-version` is 24.16.0, via
`~/.local/share/mise/installs/node/24.16.0/bin/node`):

```
$ node code/comparisons/check-styled-view-size.mts
baseline-styled-view  raw 76,778  gzip-9 28,821
baseline            gzip-9 28,671  (recorded 2026-09-03 on node 24.16.0, zlib 1.3.1-e00f703)
ceiling             gzip-9 28,821
delta               +150 bytes (+0.52%)
exit 0
```

It passes at exactly the ceiling. The recorded slack is 150 bytes of minifier
noise and all 150 are spent. The next byte of growth in `@tamagui/web` fails CI.

### Attribution

**RAN** Rebuilt the fixture and attributed it:

```sh
cd code/comparisons/tamagui-bench
npx vite build --mode baseline-styled-view --sourcemap --outDir /tmp/tsv-review --emptyOutDir
bun code/comparisons/attribute-bundle-gzip.ts /tmp/tsv-review
```

| module | marginal gzip |
| --- | ---: |
| `@tamagui/web::helpers/getSplitStyles.mjs` | 9,178 |
| `@tamagui/web::createComponent.mjs` | 4,046 |
| `@tamagui/web::hooks/useThemeState.mjs` | 1,609 |
| `@tamagui/style-grammar::runtime/transformAccumulator.mjs` | 222 |
| `@tamagui/style-grammar::runtime/modifierVocabulary.mjs` | 9 |
| TOTAL | 27,826 |

The grammar package shows up as only **231 gzip bytes** because
`plans/v3-beta/bundle-size-ledger.md`'s "structural replacement" moved the
grammar behind `prepareConfigRevision` and rollup inlines the scanner into
`getSplitStyles`. The ledger's older table listed
`style-grammar/runtime/scanFlatValue.mjs` at 779 gzip separately; it no longer
appears as its own module.

**RAN** So I measured the grammar slice standalone, browser platform,
`NODE_ENV=production`, gzip -9:

| slice | minified | gzip |
| --- | ---: | ---: |
| the 19 value-level symbols `@tamagui/web` imports from `/runtime` | 8,076 | **3,383** |
| `parseFlatValue` + `reduceFlatValueIdentity` alone | 5,183 | **2,170** |

These are upper bounds; inside the fixture some of it dedupes against web's own
code. Read it as: the string scanner is roughly 2 KB gzip and the whole grammar
runtime surface roughly 3.4 KB. The ledger puts the v3-versus-v2 fixture gap at
about 3 KB gzip, and attributes it to conditions, precedence, composites and
source layers in `getSplitStyles`, not to the scanner.

### It is unconditional

**RAN** `code/comparisons/tamagui-bench/src/baseline-styled-view.ts` is:

```ts
;(globalThis as any).__checkpoint0Baseline = styled(View, {})
```

No clause string anywhere, and it still carries the whole grammar runtime. There
is no compiler in the factory's picture, so there is no tree-shake. An app that
never writes a clause string pays exactly the same bytes as one that writes
nothing else.

---

## What this means for the Soot factory

**Blocking.** Nothing here is blocking. Every gap has a workaround that uses code
that already ships.

**Design around this, in priority order.**

1. **Build a payload allowlist from `completions`.** Eight lines at factory boot:
   `new Set(tooling.completions(prop, '', 0).completions.map(c => c.value))` per
   property, then reject a generated payload that is neither in the set nor a
   recognized CSS literal (`namedCssColors` and the unitless/length forms are
   already in `@tamagui/style-grammar/runtime`). This is the single highest-value
   thing to build, and it is the only defense against a hallucinated token.
2. **Emit the object form, not the string form.** It gets first-segment modifier
   validation from `tsc`, it is marginally faster (4% on the direct A/B), and it
   makes `dark_blue`, `iOS`, and `hovr` compile errors. Then close the two remaining key gaps yourself:
   validate chain segments past the first, and validate `@container` keys.
3. **Never emit bare numeric braces for space/size props.** Pin the factory to
   the string token form (`p="4"`) or to explicit units (`p="4px"`), because
   `p={4}` and `p="4"` differ by 4.5x with no diagnostic anywhere.
4. **If you gate on `tamagui check`, allowlist `multi-component-single-value`**
   until `transformOrigin`, `flex` and `aspectRatio` are added to
   `listValuedLonghands`. Otherwise the factory rejects correct output.

**Risks worth a decision.**

- Clause strings and conditional objects are the two scenarios where v3 is
  slower than v2 in a browser (about 1.15x and 1.2x), and they are exactly what
  a factory emits most of. Everything else in the corpus is faster, so the
  overall 0.74-0.82x holds only if generated output looks like a normal app. A
  factory that puts a conditional on every prop lands nearer 1.2x than 0.8x.
- The styled-View size gate is at exactly its ceiling. Any further growth in
  `@tamagui/web` fails CI, so there is no room to add runtime validation to the
  render path even if you wanted it there.
- Static and runtime disagree in both directions (payload shape and candidate
  targeting are static-only; the v6 theme rename table is static-only). "Checker
  clean" is not "renders correctly", in either direction.

**Fine, and better than I expected.**

- Modifier validation is complete and consistent across types, runtime, checker,
  eslint and the Rust LSP, and `check:rust` is in sync at this HEAD.
- The browser story is real, not aspirational: 46 KB gzip of code, 30 KB gzip of
  config, 63 ms to load and check a file, 1.3 µs per value.
- The parse cache and the parse itself are non-issues. Cold parses cost 2% over
  warm on a real call shape.
- CSS injection through a style value is blocked, with a clear warning.
- The warnings that do fire are excellent: property, full authored value, and the
  exact offending token.

**Two small repo fixes on the way past.**

- `code/core/style-grammar/bench/parse-cost.mjs` cannot run: it imports from
  `src/index.ts`, which is `export {}`. `bun run bench` is dead.
- `code/kitchen-sink/src/usecases/HeightMediaQueryOverrideCase.tsx` has six
  `tamagui check` errors on valid CSS, so `tamagui check` is not clean on this
  repo's own kitchen-sink.

---

## Probe inventory

Every probe has been removed from the repo. `git status --short` is empty,
HEAD is still `7fb616872a`, and the branch is still `v3-beta`. The sources are
preserved next to this report in `grammar-probes/` so any number above can be
re-run:

| file | what |
| --- | --- |
| `p1..p6*.tsx`, `tsconfig.json` | the tsc type probes (drop into `code/kitchen-sink/tmp/gprobe/`) |
| `diag*.mjs`, `complete.mjs`, `diagbench.mjs` | checker behaviour, completions vocabulary, throughput |
| `bundle-entries/` | esbuild entry points for the browser bundle measurements |
| `runtime-scan.mjs`, `parse-cost.mjs`, `parts.ts` | runtime scanner bench and the repaired tooling parse bench |
| `app.ts`, `run.mjs` | headless-Chromium proof that the checker runs with no node globals |
| `browserbench.ts`, `bench.html`, `runbench.mjs` | the corpus benchmark ported to the browser (goes in `code/comparisons/`, bundled to `bench.js`) |
| `oldbench-prefix-harness.ts` | the pre-fix harness from `86585b406b`, for the node/Bun comparison |
| `gwarn.web.test.tsx`, `gab.web.test.tsx` | runtime diagnostics probe and the string-vs-object A/B (go in `code/core/core-test/tmp/`) |

`bench.html` carries a `window.process` shim. Without it the v2 control throws
`ReferenceError: process is not defined` on load, which is what made my first
browser run time out and is why the node figure stood unchallenged for as long
as it did.
