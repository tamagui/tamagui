# V3 web engine consolidation

The runtime program pipeline did not survive the consolidation. It parsed flat
values into an IR, hashed and cached that IR, then evaluated or lowered it in a
second pass. The runtime now scans and emits inside the existing prop traversal.

## Implemented path

- Ordinary scalar props bypass structural mapping and enter the direct emitter.
- Variant output, style objects, safe-area values, variables, structured values,
  and frontend-produced values enter the same emitter after their component-aware
  expansion.
- A flat string is scanned once. The scan tracks quote and parenthesis depth,
  recognizes top-level modifier boundaries, resolves each payload, and writes its
  native style or final web atomic rule immediately.
- Web class generation hashes the final atomic identity because SSR and hydration
  need deterministic class names. The hash is not a parser cache key.
- Pre-parsed frontend values use the same emitter. Their IR was created outside
  the component runtime and is consumed directly without runtime parsing or a
  lowering pass.
- Platform clauses use containment specificity. `androidtv` matches `android`,
  `tv`, and `native`; `tvos` matches `ios`, `tv`, and `native`. The most specific
  platform wins independently of authored order. Orthogonal state clauses retain
  authored-order behavior.
- Native theme clauses preserve `DynamicColorIOS` and dynamic theme access.
- Token provenance remains development-only and is carried through direct
  emission. Production performs no provenance work.
- Transition values map Tamagui property names while scanning. The browser parses
  the resulting CSS. Runtime transition validation, reserialization, and the
  native transition parser are outside the default web graph.
- Numeric z-index values are literals. The style-grammar `z` entry has no token
  category, and the direct runtime does not consult the z-index token scale.

## Deleted runtime surface

- `programCache`
- `evaluateAccumulatedPrograms`
- `lowerAccumulatedPrograms`
- transition alignment and serialization in `@tamagui/web`
- the grammar runtime adapter in `grammarConfig`
- legacy resolution after a successful flat-value contribution
- the scalar `styleState.style` to atomic-CSS flush
- `usedKeys` arbitration between the two former paths

The built `@tamagui/web` JavaScript has no executable import of
`@tamagui/style-grammar`. Type-only imports remain for the frontend contract.

## Correctness record

The following passed after the direct path and z-index changes:

- core native: 24 files passed, 1 skipped; 227 passed, 7 expected failures,
  9 skipped
- core web excluding the timing test while fleet benchmarking is paused:
  57 files, 443 passed, 1 skipped, 1 todo
- iOS: 26 passed
- Android TV: 12 passed
- tvOS: 12 passed
- token provenance: 7 passed, 1 skipped
- `@tamagui/web`: 89 runtime tests and its typecheck
- `@tamagui/style-grammar`: 382 passed
- `@tamagui/web` and `@tamagui/style-grammar` package builds

## Remaining gates

Fleet benchmarking is paused. When it reopens:

1. Apply the product commit to `validate/v3-web-flatten`.
2. Run the production four-arm harness with the web machine lock held.
3. Report whole-app gzip and measured Tamagui-attributable gzip. The attribution
   plugin gzips source-map-attributed minified output spans, including one combined
   Tamagui stream, so the number is not inferred from rendered source share.
4. Report same-run V2 and V3 simple and group medians for the uncompiled web path.
5. Run the runtime native arm with the native machine lock held and compare every
   retained initial-render scenario against same-run V2 controls.
6. The release gate is Tamagui-attributable web JavaScript below 30 KB gzip and
   uncompiled simple and complex initial render faster than V2 on web and native.

No size or speed conclusion is recorded until those runs finish.
