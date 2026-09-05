# Design: split @tamagui/web (light, html-only) from @tamagui/core (v2-shaped)

Status: draft for review. Not scheduled; no implementation has started.

## Motivation

v3's engine rewrite got the styled-view fixture back to ~27.00 kB displayed gzip
(26,700 exact vs v2's 25,778; see `bundle-size-ledger.md`). The next size and
simplicity wins are structural: every web user today pays for variants and for
the React Native prop surface even when they use neither. Meanwhile the package
layering already points the right way: `@tamagui/web` holds the engine and
`html.*`, `@tamagui/core` exists mostly to load RN compat.

## Target layering

- `@tamagui/web`: the engine (getSplitStyles, createComponent, themes, media,
  groups, containers, flat clause values, animation driver seam, styleFrontend
  seam) plus `html.*` only. Web-aligned style props. No variants, no View/Text,
  no RN prop shape. The promoted lightweight product, especially paired with
  `@tamagui/tailwind` through the existing styleFrontend seam.
- `@tamagui/variants`: the current full variant behavior (enumerated branches,
  `'Size | number'` resolver keys, spread functions, mergeVariants parent
  chains, getVariantExtras) as a carrier the engine dispatches through.
- `@tamagui/core`: depends on web + variants. Adds View, Text, the RN style
  prop surface (validStyles tables, shadow props, expandStyle semantics,
  userSelect/testID/numberOfLines mappings), native target support, and a
  `styled()` that accepts a plain `variants: {}` object like v2. Core's public
  API stays essentially v2-shaped.
- `tamagui` (ui kit): on core, unchanged API.

## Why the seams already exist

- Variants: getSplitStyles' only variant knowledge is "key in
  staticConfig.variants -> call staticConfig.variantStyleResolver"
  (getSplitStyles.tsx:870). styled() wires `resolveVariantStyle` in
  unconditionally (styled.tsx:481) and the compiler already swaps in its own
  resolver (compilerHost.ts:1191). Packaging = stop wiring unconditionally.
- html.*: already exists in web (`src/dom/html.tsx`), generated from the
  `@tamagui/dom` strict DOM contract tables. Today it borrows
  viewStaticConfig/textStaticConfig, which is what drags the RN tables in.
- Frontend: `@tamagui/tailwind` already plugs in via the StyleFrontend seam.

## The variants carrier contract

```ts
import { variants } from '@tamagui/variants'
const Button = styled(View, { bg: '$background', variants: variants({...}) })
```

- `variants()` returns the same definitions object, branded, with the runtime
  resolver attached. styled() stores defs on `staticConfig.variants` as today
  and the attached function in the existing `variantStyleResolver` slot.
  Per-declaration, tree-shaken exactly, no global registration to forget.
- Types: the carrier has a phantom props slot computed inside the variants
  package; core-side styled types only unwrap it
  (`Opts extends { variants: VariantCarrier<infer P> } ? Partial<P> : {}`).
  All variant type machinery leaves web's types.
- Parent-aware branch-body typechecking needs a curried form
  (`variants<typeof View>()({...})`) or `satisfies VariantsOf<typeof View>`.
  Core's v2-shaped styled() keeps today's inference because it wraps the
  carrier itself and still knows the parent.
- Flattening is unaffected: the compiler reads `staticConfig.variants` data in
  its own sandbox and injects its own resolver already.
- v2-syntax and single-function variants become alternative resolver packages
  targeting the same carrier contract.

## The two real design problems

1. Style-key acceptance for html.*. The RN `validStyles` tables answer "style
   key or component prop". For html elements, invert it: the `@tamagui/dom`
   contract already generates per-tag prop tables, so the runtime split becomes
   "known DOM prop for this tag (or on*/data-/aria-) -> prop, else
   style-shaped -> style". The engine already reads validity per staticConfig,
   so this is a per-component predicate choice, not an engine fork. Keep the
   `key in obj` hot-path shape; an html static config can carry its generated
   prop table where the RN table sits today.
2. createComponent's pseudo-state machinery. Most of the remaining runtime
   weight after getSplitStyles is createComponent (3.9k marginal gzip) and
   useThemeState (1.7k). For class-emitting web components, hover/press/focus
   are pure CSS; JS listeners are only needed when something must know the
   state (JS-driven animation drivers, group state contexts, enterStyle
   coordination). A light web default that attaches listeners only when needed
   is the second-biggest win and can land as a follow-up phase.

## What web keeps that is not RN compat

x/y/scale/rotate props (they power the CSS variable transform composition),
fonts and the font_ className system, themes, media, group/container queries,
flat clause values, animation driver seam. These are Tamagui features, not
compat.

## Pre-v3 fat-cut audit: measured inventory (2026-08-31, tip c87d57d314)

Priced by deletion measurement (`audit-top-level-replacements.ts`, RAN) and
source-map span attribution (INFERRED) at fixture baseline 26,889 gzip.
Marginals overlap; only the union recompressions below are additive.

- Theme `reset` prop: removed (`7cfefaaa80`). Config-level global
  `defaultProps`: already gone.
- createComponent regions (INFERRED spans): pseudo listener + state plumbing
  801, animation-driver integration 1,123, group/container state contexts 694,
  enter/exit + presence coordination 253, themeShallow handoff 204, RN event
  prop mapping 185.
- useThemeState (whole hook RAN 1,543): getSnapshotImpl 830 RAN, getNextState
  489 RAN, subscription/fanout graph 673, scheme tracking 239, name/cache-key
  machinery 218, inverse accounting 42. No production debug paths survive.
- Modules a light web build can drop or replace: `use-element-layout` 1,313,
  `validStyleProps` 1,060 (only with a generated DOM predicate replacing it),
  `useComponentState` 988 RAN, variants runtime 806, `@tamagui/core` runtime
  wrapper 347, `subscribeToContextGroup` 329, `nativeOnlyProps` 320,
  `Theme.getThemedChildren` 544 RAN.

Floors (single-union recompressions, RAN): cutting the priced create/theme
regions plus the module list saves 6,417 -> implies **20,472** gzip. Also
zero-costing `validStyleProps` behind DOM tables saves 7,422 -> implies
**19,467**. 16 kB is NOT reachable from this feature diet alone; the last
~3.5 kB would have to come from `getSplitStyles` (7,875 marginal),
`getCSSStylesAtomic` (1,224), or media (944) structural work.

Caveat: every CSS-replaces-JS row is conditional on class-emitting DOM
components; user event callbacks, JS animation drivers, group subscribers, and
JS theme-token readers keep needing a narrow opt-in lane.

## Sequencing (each phase gated by fixture measurements)

0. Land the runtime bundle-size gate in CI first (styled-view fixture baseline
   with exact gzip, Node-pinned like `code/starters/zero-runtime/scripts/measure.mjs`).
   Add a second `html-div` fixture gate when web splits.
1. Variants -> `@tamagui/variants` behind the carrier contract. Independent,
   already agreed in principle. Web sheds resolveVariantStyle, mergeVariants,
   variantDefinitionCore, getVariantExtras.
2. Price the RN-shape spans in the web bundle with the deletion tooling
   (`bundleTopLevelReplacementPlugin`) before moving code, so the split is
   costed, not guessed.
3. Move View/Text + RN tables + RN mappings into core; re-base html.* on the
   generated DOM tables; codemod ui packages' `@tamagui/web` imports of
   `styled, View, Text` (and variant-flavored types) to `@tamagui/core`.
4. createComponent pseudo-state diet for class-emitting components.

## Open questions

- Where does core's styled() live: re-export web's with a wrapper (preferred)
  or a separate build with RN branches compiled in via TAMAGUI_TARGET.
- Whether `tamagui` (ui kit) should itself migrate to the carrier syntax or
  keep core's v2-shaped variants option.
- Text inheritance (isText contexts) currently threads through the engine;
  decide how much html.p/span need vs Text.
- Native remains core-only; confirm nothing in web's module graph reaches
  `.native` forks after the move (knip + fixture attribution both check this).
