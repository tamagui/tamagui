# Tamagui v3 evolution: master plan

2026-07-12. Consolidates the owner design sessions of this week into one plan.
Detail lives in the sibling docs: `tailwind-full-syntax.md`, `compiler-oxc.md`,
`dom-mode.md`. This doc owns the rulings, the open forks, and sequencing.

## Vision

One styling language with Tamagui semantics and a Tailwind-compatible surface;
components deconstructed into behavior (ours) + skin (user-owned files);
a core whose blessed forms are statically compilable; a compiler that is
robust to real-world codebases because it is an optimizer, never a
requirement.

## Rulings (owner-confirmed)

### Styling language

- **className grammar is all-Tamagui**: a class is
  `<shorthand or prop>-<token name or value>`. Bare numeric values on
  token-scale props are TOKEN names (`p-4` → `$4`). Arbitrary `[..]` for raw
  values. No Tailwind ×4 scale in the parser.
- **Tailwind compatibility happens at the config layer**: v6 config aligns its
  numeric token scales to Tailwind's values (finishing what
  `v6-base.ts` promises — spacing scale, palette, named sizes). On v6,
  `p-4` = Tailwind's 16px because the token IS 16.
- **Hybrid tailwind mode**: our parser claims + consumes what it recognizes;
  everything else passes through — web gets full Tailwind v4 via the official
  engine (`@layer`-ordered vs our atomic CSS), native drops unrecognized with
  a dev warning. The hand-rolled parser is scoped to the tamagui grammar
  forever; the passthrough absorbs the long tail. See
  `tailwind-full-syntax.md`.
- **styled() accepts class strings anywhere a style object is valid** (base,
  variant values, compoundVariants). Static at creation → scanner-visible,
  compilable, zero render cost. Functional variants return objects only
  (dynamic class construction defeats the scanner).

#### "token-first", precisely (this is the thing to be unambiguous about)

The numeric part of a utility class is a **tamagui token NAME**, not a Tailwind
scale index. `p-4` means `padding="$4"` — it resolves through the config's
`space.$4` token, exactly as the prop `padding="$4"` does. It is NOT `4 × 4px`
Tailwind math. The parser has ONE resolution path (the token system); it never
does Tailwind's ×0.25rem arithmetic.

Examples:
- `p-4` → `padding="$4"` — the config token. 16px on an aligned v6 config, or
  20px if your config sets `space.$4 = 20`. (Under the OLD parser at
  `5a011ff4fb`, `p-4` was a hardcoded `16px` regardless of config — that is
  what token-first removes.)
- `rounded-8` → `borderRadius="$8"`; `z-4` → `zIndex="$4"`; `gap-2` → `$2`.
- `bg-color5` → `backgroundColor="$color5"` (theme value — already name-based;
  this direction already worked, token-first makes the numeric props match it).
- Raw, non-token values use the arbitrary escape: `p-[16px]`, `w-[200px]`,
  `h-[calc(100%-2px)]`. So you are never forced through a token.

Why "first" (what it buys):
- **One meaning**: `p-4` (class) and `padding="$4"` (prop) resolve identically,
  so the styling language has no split personality between className and props.
- **Lossless round-trip**: the `to-tailwind` converter emits `p-4` from
  `padding="$4"` and back with no convert-time pixel baking — that baking (e.g.
  `$4`→`p-4`→16px when `$4` was really 18px) was the exact bug class the audit
  caught.
- **Config-portable**: a shared component's `p-4` means "the CONSUMER's `$4`",
  so it adapts to any downstream config instead of hardcoding pixels.

**Tailwind muscle-memory (`p-4` = 16px) is satisfied at the CONFIG layer, not
in the parser**: v6 aligns `space.$4` to 16px (one place, web + native,
user-customizable). Change the token and both `p-4` and `padding="$4"` move
together. This is why the two rulings ("token-first parser" + "config-level
Tailwind alignment") are one design, not two.

**Who claims `p-4` under hybrid tailwind**: our parser claims ANY class matching
the tamagui grammar (`<shorthand/prop>-<token|value>`) and resolves it
token-first; it does NOT forward those to Tailwind. Only classes we don't
recognize (`grid-cols-3`, `backdrop-blur-md`, container queries, `data-*`
variants…) pass through to the official Tailwind engine on web. `p-4` overlaps
both systems; token-first + config alignment is precisely what makes that
overlap seamless. On a NON-aligned config, `p-4` follows THAT config's `$4` —
intended, config-honest behavior, not a Tailwind pixel guarantee.

### Variants / core API

- **TS-style variant keys**: `'Size | number': (val, ctx) => styles` replaces
  `'...size'`, `':number'`, `':string'`, `':boolean'`, and the global `'...'`
  (→ `'any'`; its only two users, Spacer and SizableText, dissolve anyway).
  Exact keys win first, then type keys in declaration order. Token type names
  shorten: `Size`, `Space`, `Color`, `Radius`, `ZIndex`, `FontSize`
  (old `*Tokens` names remain as type aliases). Typed via template-literal
  types; the key registry is closed, so no TS-scope collisions.
- **`createVariantResolver('Size | number', fn)`** — pure typing helper for
  standalone/reusable resolvers (presets in `@tamagui/size`, user-defined
  scales). No enforcement role.
- **compoundVariants** (CVA-style): `[{ ...matchers, style }]`, applied after
  simple variants, array order wins, static by construction. Kills the main
  reason functional variants read `extras.props` (e.g. chat's
  `buttonCircularVariant`).
- **Context keys auto-accepted as props** on styled components with a
  `context`: consumed, typed, forwarded — no more `emptyVariants` hacks.
- **Static mode is a documented restriction, not machinery**: functional
  variants that read `props`/`theme` simply stay runtime (compiler bails as
  today). Static-only apps are a niche (motion driver is mainline); don't
  over-invest.

### Components

- **Deconstruction**: behavior (hooks where possible — `useButton`; headless
  parts where not — Sheet/Select) + user-owned copy/paste skin files.
  Mechanics styles (absolute-fill, gesture bindings) live in behavior parts;
  ALL aesthetics live in the skin file. Kills `unstyled`, `TAMAGUI_HEADLESS`,
  and the `createX(parts)` factory pattern (composition + dev warnings
  instead; `createSheet`'s wiring refactors into `Sheet.Root/Overlay/Content/
  Handle` behavior components).
- **Size is skin, not framework**: sizing tables/resolvers live in the skin
  file (chat's named-size constants pattern is the model). `@tamagui/size`
  ships preset resolvers + `SizeContext` (propagation primitive). Web can
  later propagate via CSS vars set by the frame's compiled variant (zero
  context re-renders); native keeps context under the same API.
- **Icon sizing follows text**: a userland lookup keyed by the same size
  names, per chat's `iconSizes` — behavior needs to provide nothing.
- **`animation` prop is dead in v3** (`transition` is the prop). Non-style
  component props (`transition`, `animateOnly`, `size`) stay props; the
  className parser never claims them.
- **DOM mode**: no runtime string detection (owner ruling). Compile-time
  wrapping of literal string children + tag-driven native mapping only. See
  `dom-mode.md`.

### Compiler

See `compiler-oxc.md` for full detail. Rulings:

- New extractor written against the shared ESTree/TS-ESTree AST shape;
  parser engine swappable (`oxc` | `yuku`). Purpose-built for tamagui.
- **Cross-file compilation is the headline capability**: a project-wide
  analysis service (yuku-analyzer candidate) owning the parsed+linked graph;
  vite queries in-process; metro uses a main-process pre-pass writing a
  content-hash cache (workers are isolated).
- **Robustness rules**: (1) accept compiled JSX (`jsx()`/`createElement`)
  as input and run last, after user plugins; (2) never resolve modules
  ourselves — delegate to the host bundler's resolver; (3) bailout is the
  contract (optimizer, never a requirement) + a "why didn't this extract"
  diagnostics mode.
- ModuleRunner (Vite 8) replaces the homegrown esbuild config loader on vite;
  esbuild loader remains scoped to metro/webpack/next.

## Open forks

1. **Yuku analyzer spike**: does `definitionOf`/`referencesOf` handle the real
   `getStaticBindingsForScope` cases (imported token constants, aliased
   imports, spread configs)? Benchmark cold+warm whole-project link. API
   looked young in a first probe. Outcome decides how much of the phase-2
   port shrinks.
2. **Tailwind hybrid spike**: wire official `compile()` + oxide scanning into
   the vite plugin behind the claim-then-passthrough split; prove `@layer`
   ordering vs our atomic CSS and measure the dual-emitter overlap on a real
   app.
3. **Shipped default skins: named sizes vs token sizes.** Chat says named,
   the library says tokens. Resolvers support both; the default skins must
   pick.
4. **Grammar vs shippable hash.** The ruled token-first grammar (`p-4` → `$4`,
   no ×4 scale) is NOT implemented at `5a011ff4fb`, which still resolves `p-4`
   through the old ×4 scale. Decide: finish + land the token-first rework onto
   #4126 before it merges, or merge #4126 as an interim styleMode and do
   token-first + hybrid passthrough together in the v3 styling wave. Starting
   point either way: the worker's parked unstaged edits (`ab-mriepohz-90715`,
   uncommitted, unvalidated).

## Sequencing

- **v3 beta window (API-breaking, do now)**: variant key syntax +
  compoundVariants + context-props-as-props + remove global `'...'` +
  `animation` removal. One core wave, mechanical migrations.
- **During beta**: v6 numeric scale alignment to Tailwind; deconstruction
  pilots (Button from chat patterns, Sheet decomposition, then Select as the
  hard case); `@tamagui/size`.
- **Parallel tracks (don't block beta)**: tailwind hybrid wiring; compiler
  rewrite (ModuleRunner first, then engine spike); dom-mode compile pass
  (after the new extractor exists).
- **#4126** (`fix/v6-styleMode-theme-colors`, off `v3-beta`) is validated and
  gate-green at `5a011ff4fb`, but its runtime parser still uses the OLD ×4
  scale, NOT the ruled token-first grammar — a safe interim, not the target
  (fork #4). Its `to-tailwind` converter is a separate migration codemod,
  orthogonal to the hybrid direction, and can ship on its own track. Stop
  extending the parser toward broad tailwind coverage; the hybrid passthrough
  replaces that catch-up game.

## References

- `plans/tailwind-full-syntax.md` — hybrid ruling + registry reference
- `plans/compiler-oxc.md` — oxc vs yuku, cross-file service, robustness rules
- `plans/dom-mode.md` — RSD findings, compile-only ruling
- `~/github/chat/src/interface/buttons/` — the component patterns model
- `~/github/yuku`, `~/github/react-strict-dom` — studied sources
