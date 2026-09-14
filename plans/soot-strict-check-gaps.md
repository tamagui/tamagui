# Report: `tamagui check --strict` gaps found on the Contrast (soot) v3 migration

Filed from ~/soot by the v3 migration health session (r23359). Evidence labels:
RAN = executed here, INFERRED = follows from what ran.

## Resolution

All seven gaps are resolved in Tamagui:

- strict diagnostics validate embedded color names in compound values;
- the project checker reports and skips nested Tamagui projects;
- Git-backed project checks honor ignored files;
- the codemod preserves numeric gap values as CSS lengths when merging clauses;
- runtime numeric warnings compare token values and handle unitless or empty categories;
- conditional-only list values share the grammar's payload-shape validation;
- Vite evaluation configs do not trigger the duplicate-instance fallback warning.

## 1. Multi-token payloads are never validated

RAN: `@tamagui/style-grammar/dist/esm/tooling/toolingDiagnostics.mjs` gates
`unknown-payload-value` on `isSingleBareToken(payload)`, so any payload with
whitespace is skipped. `boxShadow="0 16px 44px shadow-3"`,
`boxShadow="hover:0 16px 50px shadow-3"`, `outline="focus-visible:2px solid
color8"` carry a token that the runtime resolves through the theme and tokens,
but a typo there (`shadow3`, `shadw-3`) reports nothing. soot has 65 such
`shadow-N` sites in 31 files and the checker reports zero of them, right or
wrong. A checker that silently skips the class where typos are most likely will
let that class regrow after a migration.

Suggested fix: tokenize multi-token payloads for the properties whose grammar
carries a color slot (boxShadow, textShadow, outline, border, background) and
validate each bare identifier slot with the same candidate set.

## 2. Nested projects are checked against the root config

RAN: `@tamagui/language-service/dist/esm/check.mjs` walks every `.tsx/.jsx`
under the root, skipping only `node_modules`, `dist`, `build`, `out`,
`coverage`, `.git`, `.next`, `.expo`, `.tamagui`, and validates all of them
against the ONE artifact at `<root>/.tamagui/tamagui.config.json`.
`examples/app-finance` in soot has its own `tamagui.build.ts` and defines a
`display` font, so the root run reports 28 false `unknown value "display" for
fontFamily` errors. The exit code is 1, so the check cannot be used as a gate in
any monorepo with a second config.

Suggested fix: when the walk enters a directory that owns a `tamagui.build.ts`
(or a config path resolved the same way the CLI resolves the root one), either
check that subtree against its own artifact or skip it and say so in the
summary.

## 3. The walk ignores `.gitignore`

RAN: `scripts/debug/app-input-value-probe/preview.tsx` is gitignored in soot and
still produced 2 `v3 tokens have no "$" prefix` errors. Scratch files that are
never shipped fail the gate. Suggested fix: honor `.gitignore` when the root is
a git repository, or expose `--exclude`.

## Runtime note

The runtime `unknown color "shadow-6", did you mean "shadow6"?` warning
(getSplitStyles) suggests from theme keys. Every in-repo config at soot HEAD
resolves `shadow-1..8`, and only a stale pre-merge `.tamagui/*.mjs` artifact
carried `shadow1..8`; INFERRED the warning came from a dev server that had not
reloaded the config. Not a checker bug, but it is the class gap 1 would have
caught at authoring time had the key actually been wrong.

## 4. A bare number in a clause silently changes meaning, and neither tool says so

RAN: the soot v3 migration merged `gap={32}` plus `$lg={{ gap: 46 }}` into
`gap="32 lg:46"`. In the v3 grammar a bare `32` is the space token (128px),
so six home, dev and factory sections rendered 128/192/224px gaps where
production has 32/48/56px (RAN: computed-gap histogram, local vs
contrast.dev, before and after adding `px`). `tamagui check --strict` accepts
the string because `32` is a real token, and the runtime is silent for the
same reason. Only `46` warned, because it is not a token.

This is not a checker bug so much as a migration hazard, but a codemod that
turns numeric literals into clause payloads must write `px` (or keep the
number out of the string). If the migration tool in `@tamagui/cli` does this
merge, that is where to fix it. Fixed in soot at c8b01fb1fc.

## 5. The `numeric-token` runtime warning points at the wrong token and fires for token-less categories

RAN (`@tamagui/web/dist/esm/helpers/getSplitStyles.mjs`, the `numeric-token`
branch): for numeric keys it measures distance by key number, for other keys
by value. `gap="46"` therefore suggests `"44"`, which is 176px, when the
nearest token by value is `"11"` or `"12"` (44px/48px). Compare by value for
every key.

RAN: `zIndex="xl:1"` warns `zIndex="1" was passed to CSS as-is with px units`
although the emitted CSS is the correct `z-index:1`, soot's config defines no
zIndex tokens, and the suggested `1px` form emits invalid `z-index:1px`. Skip
the warning when the category has no tokens, and never mention px for zIndex.

## 6. Conditional-only multi-part payloads warn although the CSS is right

RAN: `boxShadow="hover:0 16px 50px shadow-3"` emits the correct hover rule and
still warns `has multiple values after its first conditional`; prefixing
`none` removes the warning with identical output. If the parse is unambiguous
(it produced the right rule), the warning should not fire; if it is not, the
message should say what was dropped. Fixed on the soot side at 6dd4c5f4ef.

## 7. "Using global config fallback" in every One dev server (INFERRED)

Seen by the owner in the soot dev server terminal right after a `[compiler]`
line. RAN: `@tamagui/vite-plugin/dist/esm/plugin.mjs` inlines
`@tamagui/config|core|slider|web` into the evaluation environment
(`inlineEvaluationTamaguiPackage`), so the module runner owns a second
`@tamagui/web` instance whose `createTamagui` sets `globalThis.__tamaguiConfig`.
RAN: `@tamagui/web/dist/esm/config.mjs` warns when an instance reads the global
before it has called `setConfig` itself, checked 500ms later. INFERRED: the SSR
environment's instance reads the global first (its config module,
`contrast-internal-ui/tamagui.config`, sits in `ssr.noExternal` and imports
`tamagui` as a node external), which is enough to fire the warning even though
both instances end up with the same config. Not reproduced in a fresh process
here; the dev server belongs to the owner. A decisive probe is
`NODE_OPTIONS=--import=<preload that patches console.warn with a stack>` on a
fresh `bun dev`. If confirmed, the plugin should either externalize
`@tamagui/web` in the evaluation environment or silence the fallback warning
when the global was set by the plugin's own evaluation.
