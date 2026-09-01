# Design: v3 variants, component resolvers, and style pieces

Status: agreed direction (Nate + Fable review session, 2026-08-31). Phase 1
(engine core: layer renumbering, styled.dynamic carriers, .resolve chain,
types, tests) landed in @tamagui/web; the phase 2 list below is handed to a
Sol xhigh worker. This resolves the "single-function variants" bullet left
open in `web-core-split.md`.

## Motivation

- v2 variant machinery (spread keys, `'Size | number'` resolver matching,
  getVariantExtras, compound-variant workarounds) is the largest source of
  runtime complexity and type slowness in styled().
- Inline variant functions are typed before the component's complete props
  exist, which forced hacks like SizableText mutating its own staticConfig to
  add an `any` variant that reads sibling props.
- Zero-runtime (v4 goal) needs statically-knowable style output. StyleX's
  model (static keys, dynamic values via CSS variables) is the reference.

## The API

One concept, a statically-shaped style fragment, produced at three arities:

```ts
import { style, styled } from '@tamagui/web'

// zero inputs: a piece. compiled at definition, applied via the style prop
const cardActive = style({ backgroundColor: 'blue10', borderColor: 'blue10' })

const Thing = styled(View, {
  variants: {
    // exact variants: unchanged, clause-capable
    regular: { true: { opacity: 0.8 } },

    // value -> piece. branded, per-clause invoked, so responsive values work
    size: styled.dynamic<SizeTokens | number>((value, env) => ({
      width: value,
      height: value,
    })),

    // bare declaration: typed, consumed, styled by the component resolver
    tone: styled.dynamic<'neutral' | 'critical'>(),
  },
}).resolve((props, env) => ({
  // props -> piece. props is the COMPLETE styled component prop type
  backgroundColor: props.tone === 'critical' ? env.theme.red10 : undefined,
  opacity: props.disabled ? 0.5 : undefined,
}))
```

- `env` is `{ tokens, theme, font, fontFamily }` for both callback forms.
  Never props for `styled.dynamic`; that separation is what makes per-clause
  invocation sound.
- `.resolve` returns a NEW component, never mutates. One resolver per styled
  layer; a child adds its own. It replaces compoundVariants and every
  sibling-prop-reading variant.
- `style()` has no `.resolve` and no inputs. A parametric piece is
  `styled.dynamic`; a props-dependent piece is a component `.resolve`.
- Branded helpers compose: `styled.dynamic(fn)` returns a callable branded
  function usable as a variants entry AND callable inside `.resolve` or other
  dynamic bodies. getFontSized becomes one shared branded helper.
- Token strings are bare in v3 (no `$`).

## Precedence

Flat tiers, matching the engine's existing source-layer model (renumbered):

```
0 base styles < 1 variants (definition order) < 2 component resolvers
  < 3 callsite style props < 4 style prop
```

- Within a tier, last wins. Resolver chain runs parent-first, so a child
  resolver beats its parent's.
- Child-over-parent inside each tier comes from styled() flattening order, as
  today. We keep the flat model: all variants beat all base styles regardless
  of depth. The reviewed per-depth interleave (parent resolver < child base)
  fights the flattened single-pass engine and changes behavior; parked as an
  open decision, default is flat.
- defaultVariants: a default applies at the variant tier; a caller value for
  the same prop replaces it entirely (never merges). Existing
  baseVariantProps machinery already implements this.
- Clause values: exact variants and `styled.dynamic(fn)` accept clause
  strings, invoked per payload. Props consumed only by `.resolve` accept the
  bare T; responsive behavior goes in returned values, which may themselves
  be clause strings.
- undefined in any resolver/dynamic output means absent (falls through to
  lower tiers). See extraction caveat below.

## Static shape rule (extraction contract, not runtime law)

A conforming body: one object-literal return per return site, static keys,
scalar/local-const expressions, structured leaf values (shadowOffset) fine,
conditionals via undefined values. Forbidden: spreads into the returned
literal, computed keys.

- Compositional: a conforming body may return a call to another BRANDED
  resolver; the static key set is the union over return sites. Recursion
  forbidden, depth capped. Branding makes this local analysis: each
  `styled.dynamic(...)` call is validated once at its definition site
  (dev-mode runs the body with proxied inputs and warns early).
- Enforcement: violations deopt extraction and warn in dev/lint. Never a
  runtime error. Two lanes:
  - Lane A (exists): the compiler evaluates the real resolver in its sandbox
    at callsites with statically-known props. Works for any body.
  - Lane B (v4 zero-runtime): static keys + CSS variables for dynamic values.
    Only conforming bodies qualify. `style()` in compiler mode errors when
    not statically analyzable; that is the zero-runtime contract.

### The undefined/CSS-var masking problem (must be designed before lane B)

`opacity: var(--x)` with `--x` unset resolves via IACVT to `unset`, which is
NOT absent: it can win the cascade over a lower tier's atomic class for the
same key. Per key, lane B must either fold a statically-known lower-tier
value into `var(--x, fallback)` or deopt that key to runtime. Piece
representation must therefore be a per-key map (subtractable), never one
opaque className string.

## style() pieces

```ts
type StylePiece = {
  className: string
  [pieceSymbol]: { byKey: Record<string, string>, styleObject: StaticShapeStyle }
}
```

- Runtime mode: resolve + insert rules once at module eval. Dev warns when
  called during render. Compiler mode: replace the call with the piece
  literal, rules go to the CSS file.
- Accepted at exactly one engine point: the `style` prop
  (`style={piece}`, `style={[a, cond && b]}`, last wins). Pieces inherit the
  style prop's tier, so no new cascade rules exist.
- Native / JS drivers: resolve `styleObject` against the active theme, cached
  per (piece, theme).
- Staged rollout:
  1. internal: precompile every styled component's base layer (runtime-mode
     parity with compiled baseClassName). Note: the old next.md motivations
     are mostly stale; v3 already caches the defaultProps split
     (styleStaticConfigCore.ts) and text-nested defaults are gone. The live
     win is that baseStyle keys re-walk contributeProp every pass
     (getSplitStyles.tsx:1214).
  2. public: piece-typed props replace `accept: 'style'`
     (activeStyle on Checkbox/Toggle/Tabs, ScrollView contentContainerStyle).
  3. parked for v4: pieces as variant values, auto-spread, composition
     algebra.

## accept is removed

Four call sites, two patterns:

- `'style'` object props (Checkbox/Toggle/Tabs activeStyle, ScrollView
  contentContainerStyle): become `StylePiece`-typed props; the component
  forwards into its frame's `style` prop (Checkbox already spreads
  conditionally today, accept is nearly dead weight there). Native
  contentContainerStyle resolves the piece against theme in the RN compat
  layer.
- token scalars (Input placeholderTextColor/selectionColor/cursorColor/
  selectionHandleColor: 'color'): web becomes real CSS (::placeholder,
  caret-color, ::selection) emitted as style keys; native keeps a mapping in
  core's RN compat tables next to processStyleColors.
- Escape hatch if ever needed: `useStyle(piece)` (piece in, resolved object
  out). Never resurrect the v2 arbitrary-object useStyle.
- Wins: one branch out of the getSplitStyles hot path (lines 889, 913), the
  accept type machinery out of web, large .d.ts shrinkage.

## No v2 compat

Decided (Nate, 2026-08-31): no compat resolver package. Rewrite every in-repo
usage of legacy functional variants (spread keys, VariantSpreadFunction
bodies, getVariantExtras consumers) to styled.dynamic/.resolve directly, then
delete the legacy variant-function machinery from the engine. The
web-core-split carrier seam still exists, but nothing v2-shaped ships
through it.

## Migration inventory (ui kit)

- getFontSized, getElevation, getSizedElevation, inputSizeVariant,
  textAreaSizeVariant: rewrite as branded dynamics/conforming helpers;
  incremental-build bodies become single literals with undefined values;
  getElevation's isAndroid spread becomes a ternary value.
- SizableText fontFamily any-variant staticConfig mutation: becomes the
  component .resolve (reads sibling size/fontSize, inherit escape).
- Compound-variant style hacks: audit for prop-hook chains, move to .resolve.

## Implementation plan

1. (Fable, this session) Engine core in @tamagui/web:
   - named source-layer constants + renumbering (style 3->4, props 2->3,
     resolver=2)
   - styled.dynamic carrier (brand symbol, callable), variant dispatch
     handling carriers (bare = consume, fn = per-clause invoke with env)
   - .resolve chained method, resolver chain on staticConfig surviving
     flatten, execution after the props walk at layer 2 through the normal
     normalize/emit path
   - base types (StyledDynamic<T>, resolve method typing), type tests,
     core-test runtime tests
2. (Sol xhigh handoff) Finish:
   - style() pieces + style-prop acceptance + base-layer precompile
   - accept removal + the four call-site migrations + Input color CSS
   - ui-kit functional-variant migration per inventory
   - compiler lane A support for resolver chains (static-resolve/compilerHost)
   - dev-mode shape validation at branded definition sites
   - kitchen-sink + core-test coverage, repo-root lint/check green

## Open decisions

- Per-depth tier interleave (parent resolver < child base) vs flat tiers:
  shipping flat, revisit only with a concrete case.
- Whether `.resolve` skipping via compiler-derived read sets is worth it
  before lane B (cost is one resolver run per style pass; measure on the
  styled-view fixture before optimizing).
- Where styled.dynamic lives after the web/core split (web for now; moves
  behind the variants carrier contract in split phase 1).
- Optional value-level domain for pre-generation
  (`styled.dynamic({ scale: 'size' }, fn)`), reserved, not built.
