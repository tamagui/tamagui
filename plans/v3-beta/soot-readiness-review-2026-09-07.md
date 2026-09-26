# V3 beta readiness review for moving Soot, 2026-09-07

Reviewed `v3-beta` at `7fb616872a` (2,119 commits past `main`, 1 behind).
Method: my own probes on the built packages plus four bounded read-only
helpers (three Opus xhigh on the grammar toolchain, the LLM-facing skills and
CLI, and engine risk; one Gemini on the Soot inventory). Their reports and raw
probe output are under the session scratchpad; the numbers below are the ones
I either ran myself or re-verified.

Every causal claim is labeled RAN / TESTED / INFERRED / GUESSED.

## Verdict

Move Soot. The engine is in good shape and the remaining problems are all in
the layer between the engine and an LLM writing code, which is exactly the
layer Soot's factory sits in. Fix that layer first (about a week of bounded
work, listed below), then migrate in the order at the end of this document.

What is fine, all RAN by me or a helper this session:

- Lint, `bun run check`, core web (630 passed / 3 skipped) and core native
  (339 passed / 7 expected fail / 9 skipped) are green at tip. Push CI at tip is
  green on Checks, Registry, Maestro and Detox. Numbers match the 09-04 launch
  review exactly, so no regression in three days.
- Fix churn is decaying: 17 fixes on 09-01, 8 on 09-02, 24 on 09-03, then 4,
  3, 2 on 09-05 to 09-07. Core plus web plus style-grammar took 74 of the last
  204 fixes, so that is where the tail will be.
- Code is genuinely migrated. 11 TODOs in all of `code/core/web/src`;
  `styleCompat` is the only real dual path (9 sites) and the v2 residue is one
  line (`web/src/config.ts:83`). v3-beta has fewer unconditional skipped tests
  than main (19 vs 23).
- The in-browser checker exists and works. `@tamagui/language-service`
  `core` + `document` + `extract-sucrase` are node-free, take an injected
  sucrase parser, bundle to about 46 KB gzip including sucrase, load in 63 ms in
  headless Chromium, and diagnose at about 1.3 µs per value. The config
  artifact it needs shrinks from 5.6 MB to about 120 KB once `components` and
  all but two themes are dropped (RAN, my probe in kitchen-sink).
- The runtime parse cache is real (4,096 entries, single eviction) and clause
  strings cost about 4% over the object form on the same call shape. A cold
  cache costs 2%. The grammar is not what you pay for; conditions are.
- Modifier validation is complete and consistent across types, runtime, the
  checker, eslint and the Rust LSP, and `check:rust` is in sync at this HEAD.

## The one problem: typos are silent at every layer

The grammar rule "a configured name wins, anything else is literal CSS" is the
right call for humans and the wrong call for a factory. Nothing in the
toolchain validates a payload. RAN, rendering through built `@tamagui/core`
with `@tamagui/config/v6` in dev mode:

```
bg="backgroun"                 -> ._b-1110801321{background-color:backgroun}   no warning
color="$color11"               -> color:$color11                                no warning (v2 sigil)
color="color11 hover:colr12"   -> hover rule color:colr12                       no warning
w="300"                        -> width:300                                     no warning (invalid unitless CSS)
p="17" / fontSize="17"         -> padding:17 / font-size:17                     no warning
bg="blue10"                    -> background-color:blue10                       no warning (v5 name under v6)
animation="quick"              -> leaks to the DOM as an attribute              no warning (v1 name)
p="4 gtMd:8"                   -> warns: unknown modifier "gtMd"                good
```

The types agree: `FlatStyleValue<T>` is `T | FlatStyleObject<T> | (string & {})`
(`web/src/types.tsx:2127`), so every string typechecks. The checker agrees:
`tamagui check` on the same snippet reports only the `gtMd` modifier. The
helper's probe confirms `blu`, `blue10`, `$blue10`, `alignItems="centre"`,
`fontFamily="bodyy"`, `position="absolut"`, `opacity="half"` all pass the
checker as `ok`.

Also RAN: `p={4}` is 4px and `p="4"` is the space token, a 4.5x difference
under config-default, with no diagnostic anywhere. And a value with six
non-platform conditions throws inside render (`❌ Error 004` in prod,
`clausePrecedence.ts:28-34`). Five is fine.

### Can the types be strict for the single-token case?

The shape works. Replacing the `(string & {})` arm with
`` `${string} ${string}` | `${string}:${string}` `` makes a bare word have to
match the property's own union while anything with a space or colon still
passes. TESTED standalone: `backgroun`, `$color11`, `blue10`, `300` all error;
`background`, `background hover:red10`, `hover:red10`, `#fff`, `rgb(...)` all
pass.

TESTED on kitchen-sink with `tsc -b --force`, it is not a one-liner:

| | baseline | strict arm |
|---|---:|---:|
| user CPU | 46 s | 101 s |
| wall | 45 s | 396 s (contended, agents were building) |
| errors in a probe file | 0 | 3, all false positives on `col=` |

Two reasons. The outer arm is not the only escape hatch: `ThemeValueFallback`
re-admits `string` per category unless `allowedStyleValues` is `strict`, so
`bg="backgroun"` on View still passed, while the `col` shorthand's `T` lost its
theme keys and rejected the valid `color11`. And the template arms roughly
double type-check CPU in this crude form. Reverted; nothing committed.

Recommendation: do it, but gated behind `allowedStyleValues: 'strict'` where
the inner fallbacks are already `never`, fix the `col`/`color` shorthand type,
and measure CPU against the baseline above as an acceptance gate. It is a
bounded task for one Opus agent. Even then it only covers the single-token
case; clause payloads stay open, so the runtime warning and the checker
allowlist below are what actually protect the factory.

Related from Nate: add a setting that picks the string form, the object form,
or both, have the types and checker reject the other form, and have
`generate-prompt` emit examples only in the chosen form (and ask during
`tamagui setup` when both are on). Today there is no such setting; both forms
are always accepted (RAN, grep of `web/src/types.tsx` settings). Same Opus
task, same package.

### Outcome (landed 2026-09-07, commits 96a3e3e39b..382eefc635)

Everything in the next section is done except the Soot migration itself.
The strict single-token types shipped gated on `allowedStyleValues` (any
string or per-category setting; booleans and no setting stay loose), so a
value with no space and no `:` has to be a token, theme value, or a value the
setting allows. RAN: forced kitchen-sink build 37s user CPU against the 46s
baseline, so the arm costs nothing measurable. The first pass rejected
`col="color11"` only because v6 shorthands have no `col`; the real leak was
`(string & {})` inside `Color`, `Size`, and the `background` prop, plus the
`GenericSizes` index signature folding `SizeName` into `string`. Turning it on
surfaced 300 kitchen-sink and demo values still written as v5 palette names
(`red10`, `gray5`, `shadow6`) that resolved to nothing in v6; they are migrated
in the same wave. `settings.styleValueSyntax: 'string' | 'object'` narrows the
types, warns at runtime, and drives `generate-prompt` and the skill.

## Fix before Soot, in order

1. **Runtime dev warnings for the four silent classes.** In `warnRefusedValue`
   territory (`getSplitStyles.tsx:2424`): a `$`-prefixed word (never valid CSS),
   a bare number string on a length prop that is not a token (never valid
   CSS), a bare identifier on a color-category prop that is not a token, theme
   key, named CSS color or the 8 CSS-wide keywords, and the removed prop names
   `animation`, `hoverStyle`, `pressStyle`, `enterStyle`, `exitStyle`. The
   styled-view size gate is at its ceiling (28,821, 0 bytes of headroom), so
   these must live inside `NODE_ENV === 'development'` blocks only.
2. **Checker payload validation as an opt-in.** `tooling.completions(prop, '')`
   already returns the full configured vocabulary per property (341 entries
   for `backgroundColor`, 77 for `padding`). Add a `strictPayloads` option to
   `diagnoseStyleValueProgram` that rejects a bare word not in that set and
   not a CSS literal. Expose it through `tamagui check --strict` and the
   eslint rule. This is the factory's real defense and it is a small change.
3. **Fix the checker false positives** in `payloadShape.ts:33-59`:
   `transformOrigin`, `flex`, `aspectRatio` are missing from
   `listValuedLonghands`, so `tamagui check` reports 6 errors on kitchen-sink's
   own `HeightMediaQueryOverrideCase.tsx` today. A factory gating on the
   checker would reject valid output.
4. **Drop the clause, don't throw,** above `grammarMaxNonPlatformDepth`.
   Warn in dev, ignore in prod.
5. **Rewrite `skills/tamagui/SKILL.md`** from about 4,340 tokens to about
   1,200. The helper verified every API claim; the architecture is right and
   the copyable examples are wrong in exactly the places a small model copies:
   - `gtMd:` is not a media key in any v3 config, and the "media order" rule
     the anti-pattern teaches is not what the runtime implements.
   - 75 longhand props across the bundle, which are type errors under stock
     v6 (`onlyAllowShorthands: true`).
   - `references/animations.md` teaches the removed v2 `transition` array
     and `default` grammar.
   - `<ThemeUpdate borderTopLeftRadius={8}>` is a no-op; ThemeUpdate takes
     theme keys.
   - `color12` does not exist in v6; the ramp is 11 steps.
   - `<Button size="large">` silently falls back to `md`.
   - The upgrade skill's `exitStyle` recipe is wrong: v3 has no `exitStyle`
     handling at all, and `exit:` lowers on web.
   - `html.*`, `tamagui/unstyled`, the qualified `size.4` escape hatch,
     `p={4}` vs `p="4"`, and `tamagui check` are all absent.
   The correct compact grammar already exists at
   `code/tamagui.dev/data/docs/guides/flat-values.mdx` (about 2,050 tokens);
   the skill should carry that and the precedence ladder from
   `setup-prompt.ts:107-111`, and push `styled.dynamic`, `.resolve`,
   compound components and the compiler section into references.
6. **Fix `generate-prompt`.** It emits `backgroundColor="blue5"` on a v6
   project, `if (media.height-lg)` (invalid JS), empty token sections, and a
   components list that is the compiler's discovered-`styled()` list (private
   frames present, `Dialog`/`Sheet`/`Select` absent). About 40% of its output
   is the color dump. It should emit the grammar, media keys with polarity in
   words, the named-size table, the `onlyAllowShorthands` verdict, and the
   barrel's public import surface.
7. **`tamagui migrate --from v2` is missing 7 of the guide's 20 sections**
   (transition grammar, group/container split, named sizes, `defaultProps`,
   imperative Toast, ThemeableStack, active-state colors), and `tamagui
   upgrade` never points at it. Either close the gaps or stop calling it the
   checklist of record.
8. **Two CI gates die on merge to main.** The zero-runtime size gate and
   `v3-ssr-hydration` are gated on `ref_name` starting with `v3`
   (`checks.yaml:391-396, 455-461`). Cheap to fix before the main merge.

Two decisions that are Nate's, not mine:

- **Bundler.** Metro does not tree-shake and the per-component subpaths do
  not help (`tamagui/button` imports the 54-`export *` `@tamagui/ui` barrel).
  Same app, six builds: metro-web island 367,022 gzip vs vite 92,493. On Vite
  it is a 3 KB floor; on Metro it is 275 KB per island. Soot's web is Vite
  (RAN, `vite.config.ts` at the root) so the web side is fine; the Expo app
  and the preview bundler are where this matters.
- **Perf claim, confirmed.** The committed runtime-corpus receipt's 0.79x
  (v3 faster than v2) holds in a real browser: the helper ran the corpus in
  headless Chromium twice (9 rounds, identical checksum) and got 0.815x and
  0.739x total, with clause strings at 1.13 to 1.16x and conditional objects
  at 1.18 to 1.26x. The committed `benchmark-get-split-styles.ts` reports
  1.47x under node because node has no `document`, so the style flush re-runs
  every pass (INFERRED by the helper). Add a browser mode or a note to that
  bench so nobody reads the node number as a regression. For the factory,
  budget clause-heavy re-renders at about 1.15x of v2, not faster.

## Soot migration plan

### Starting position (RAN on `~/soot` main at `317150b3cf`)

| | count |
|---|---:|
| `"$token"` literals in `.tsx` | 14,552 |
| `'$token'` in single quotes | 3,610 |
| `hoverStyle` / `pressStyle` / `focusStyle` | 491 / 401 / 99 |
| `enterStyle` / `exitStyle` | 181 / 144 |
| `$platform-` / `$theme-` / `$group-` | 297 / 93 / 97 |
| `Sheet.Frame` | 68 |
| `ThemeableStack` | 20 |
| `useToastController` | 10 |
| `.styleable(` | 12 |
| `onDidAnimate` | 17 |
| `$true` | 104 |
| `defaultProps` (all senses) | 277 |
| `createTamagui(` owners | 42 (root app, sootsim-engine x2, one per template and example) |

By directory (`$token` + pseudo-object sites): `src` 6,994, `templates`
3,788, `examples` 3,021, `packages` 807, `app` 670, `demos` 56.

The old `v3` branch is 15 commits ahead and 1,760 behind main. It touched
1,098 files; 300 of those changed on main since, and 43 were deleted. Do not
rebase it. Its value is the receipt (`soot-migration-receipt.md`): it proves
the codemod reaches 0 flagged sites on Soot and lists the hand-migration
classes. Rerun the codemod on fresh main.

Soot-side facts that shape the order (RAN by the Gemini helper unless noted):

- **Media polarity flips.** Soot's config chain
  (`packages/contrast-tamagui/src/foundation.ts` over `@tamagui/config/v5`)
  defines `sm`/`md`/`lg` as max-width and `gtSm`/`gtMd` as min-width, plus
  custom `phone` and `shortWide`. Config v6 spells the same idea `max-sm:` and
  makes bare `sm:` min-width. 443 authored media sites (`$md` 267, `$lg` 75,
  `$sm` 61, `$xl` 19, `$phone` 13, `$xs` 6). A blind `$sm` to `sm:` rewrite
  inverts every one of them, and it is exactly the kind of error the checker
  cannot see because both spellings are registered modifiers.
- **769 fractional tokens** (`$0.5`, `$1.5`, `$2.5`, `$3.5`) flag as
  `legacy-token-dot-path`; v6 has decimal space tokens, so map them rather
  than converting to raw px.
- **The space scale moves.** 15 of 16 integer v5 space tokens change value
  under v6 (`6` goes 32px to 24px, `20` goes 186px to 80px). Layouts will
  shift visibly. This is the argument for keeping v5 values frozen in the
  engine-first step.
- **Custom radius tokens** (`compact 9`, `control 13`, `card 16`,
  `overlay 22`, `pill 1000`) must carry over into the v6 config.
- **Wrappers** live in `packages/contrast-ui/src/*` (Dialog, Sheet, Popover,
  Menu, Input, TextArea, Select, Toast, Tabs, Tooltip),
  `packages/contrast-internal-ui/src/*` (Button, ContextMenu, Input, Select,
  RovingTabs), `src/interface/*`, and each template's `interface/` dir.
  `Sheet.Frame` appears in 25 files; `ThemeableStack` and `defaultProps` are
  clean; `$true` and `.styleable` are one site each.
- **The factory's LLM material** is `src/ai/skills/docs/*.md` (30 files;
  `contrast-tamagui-ui.md` is 894 lines and teaches `$token`, `hoverStyle`,
  `$sm={{}}` and `createV5Theme`), `src/ai/examples/generated.ts`,
  `skills/tamagui.md`, `skills/tamagui-text-size.md`, and the `AGENTS.md`
  in all 7 templates, which tell the model to author with `createV5Theme`.
  `src/ai/tools/tamaguiThemeTools.ts` parses the 12-step v5 theme source and
  must move to the v6 builder shape.
- **Three in-browser seams** take generated code: the TypeScript worker
  (`src/features/lsp/worker/tsLsp.worker.ts`) fed by a prebuilt
  `/public/editor-types.json` that must be re-extracted from v3 `.d.ts`; the
  project bundler (`src/bundler/bundlerConfig.ts`) resolving `@tamagui/*` from
  prebuilt `/public/deps-web` and `/public/deps-native` artifacts pinned to
  `config/v5*` in `preview-deps/manifest.ts:517-555`; and the Acorn/Babel
  parse gate in `packages/tool-runtime/src/parser.ts`. There is no Tamagui
  checker hook today; the parse gate is where `strictPayloads` plugs in.
- **Two native runtimes**: `templates/contrast-mobile` (real Expo,
  reanimated driver) and `packages/sootsim-engine` (CanvasKit simulator,
  React Native Animated driver via `config/v5-rn`). Both need their own
  validation lane.

### Phases

1. **Land the eight Tamagui fixes above and cut a beta.** Pin Soot to that
   exact beta across root catalog, nested packages and native fixtures.
   Verify the pin by tarball content, not version string (the release
   pipeline was being repaired through 09-07).
2. **Engine first, design values unchanged.** Run
   `@tamagui/codemod-flat-values --report` over `src packages app`, then
   `--write` in one pass. Hand-migrate the report tail using the upgrade
   skill's hard-cases reference. Keep Config v5 values frozen for this step
   (freeze the generated themes to a static literal if any package still
   imports the v5 builder). Gate: typecheck, `tamagui check --styles-only`,
   `build:prod`, unit, SootSim gate compared against a v2 control run on the
   same day, web light/dark screenshots, iOS simulator smoke (never run on the
   old branch).
3. **Config v6 and the shared wrappers.** Move the root config to
   `@tamagui/config/v6`. This flips media polarity (`sm:` becomes min-width,
   `max-sm:` is the old `sm`), compresses the color ramp to 11 steps, and
   changes the space/size/radius scales, so it must be its own reviewable
   diff. The 443 media sites the codemod wrote as `sm:`/`md:` in step 2 are
   still max-width there because the v5 config defines them that way; this
   step rewrites them to `max-sm:`/`max-md:` and re-adds `phone` and
   `shortWide` to the v6 media map before flipping the config. Rewrite `src/interface/*` (CommandMenu, Notice, dialogs, toast,
   keyboard) against named sizes and `html.*` where the element is plain
   layout. Keep behavior components for menus, dialogs, select and focus.
4. **Templates, examples and demos.** Same codemod, then move them to v6.
   These are the factory's few-shot corpus, so they must read as canonical v3
   by the time the prompts change.
5. **Factory.** Rewrite `src/ai/skills/docs/contrast-tamagui-ui.md` and the
   two `skills/tamagui*.md` from the new `skills/tamagui/SKILL.md`, generate
   the per-project prompt with the fixed `generate-prompt`, and wire the
   in-browser checker (about 46 KB gzip plus a 120 KB trimmed config) with
   `strictPayloads` into the preview bundler's validation step. Pick one
   form (string or object) in `settings` and let the prompt generator
   follow it. Add the generation-side cap of five conditions per clause.
6. **Preview bundler and native.** Repin `preview-deps/manifest.ts` from
   `config/v5*` to v6, drop the v2 stubs in `packages/compat`, and run the
   Expo app on the reanimated driver end to end. Decide Metro vs the current
   bundling for the native preview with the 275 KB island number in hand.

### Validate by hand, because CI cannot

Sheet drag and keyboard lift, native press styles, pointer capture, and
Dialog/Popover/Select at Adapt breakpoints. Those e2e suites are skipped or
retried in CI (`playwright.config.ts:106` retries twice), so green CI is weak
evidence for exactly those surfaces.

## Helper reports

The four helper reports are in `plans/v3-beta/soot-readiness-2026-09-07/`:
`grammar.md`, `skills.md`, `engine.md`, `soot.md`.

## Residue

Helper probe files live under gitignored `tmp/` directories in
`code/kitchen-sink` and `code/core/core-test`, plus three untracked files:
`code/comparisons/.oldbench.tmp.ts`, `code/comparisons/.browserbench.tmp.ts`,
`code/core/style-grammar/src/.gitignore-nope`. Delete them once the browser
corpus bench in `code/kitchen-sink/tmp/gprobe/browser` is no longer wanted.
`code/core/style-grammar` `bun run bench` is broken at this HEAD
(`src/index.ts` is `export {}`).
