# Tailwind mode: full v4 syntax via the official compiler

Research plan, July 2026. Goal: users can write any Tailwind v4 class. On web
everything works because the official Tailwind engine generates the CSS. On
native, the subset that maps to RN styles works and the rest is silently
dropped (dev warning). We stop hand-maintaining a Tailwind reimplementation.

## Where we are today (v2-tailwind branch)

- `code/core/web/src/helpers/getSplitStyles.tsx` parses `className` at runtime
  with hand-rolled maps (`tailwindUtilityMap`, `tailwindClassToFlatProp`,
  `tailwindPropPrefixes`, ~400 lines). Recognized classes become Tamagui props
  and flow through our style pipeline; unrecognized classes pass through in
  `className`.
- `code/core/to-tailwind` is the reverse direction (tamagui props → tailwind
  classes), separate concern, unaffected here.
- Consequence: "if we support it, it works." Coverage is whatever we ported.
  Variants, arbitrary values, container queries, `data-*` variants, `@theme`
  values etc. only work insofar as we reimplemented them. That is the thing
  users complain about and it is an unwinnable catch-up game.

## What the ecosystem gives us now

- **Tailwind v4 has a real programmatic API.** `compile(css, { loadStylesheet })`
  from the `tailwindcss` package returns a compiler; `compiler.build([...candidates])`
  emits CSS for exactly those class names. There is also
  `__unstable__loadDesignSystem()` with `parseCandidate()` /
  `candidatesToCss()` (used by tailwind-merge, prettier-plugin, intellisense).
  Marked internal/undocumented but stable enough that the whole tooling
  ecosystem depends on it. Source: tailwindlabs/tailwindcss discussion #16581.
- **The scanner is separate and reusable.** `@tailwindcss/oxide` (Rust) does
  candidate extraction from source files; `@tailwindcss/vite` wires it up.
- **This architecture is proven on native.** NativeWind v5 (still preview,
  targets tw v4) and Uniwind (stable, tw v4 only, bundler-plugin based, no
  babel) both work by compiling real Tailwind CSS at build time and converting
  the resulting CSS declarations to RN styles in a generated registry. Uniwind
  in particular validates the "official compiler + CSS-to-RN interop, no
  runtime parser" shape and benchmarks ~2x faster than NativeWind.

## OWNER RULING (2026-07-12): hybrid — our engine first, tailwind for the rest

Our parser claims what it recognizes (tamagui grammar: token names, theme
values, our shorthand/prop classes); a claimed class is CONSUMED (converted to
props, removed from the emitted className) and styles through tamagui's
theme-reactive pipeline on web AND native. Everything unrecognized passes
through untouched: on web the official tailwind engine covers it (full v4
syntax, zero catch-up), on native it drops with a dev warning (registry for
the RN-mappable subset can come later). Claim-then-passthrough is deterministic
— each class lives in exactly one system, so there is no cascade fight beyond
ordering our atomic CSS vs tailwind's @layer output.

Consequences:
- The hand-rolled parser is KEPT, scoped to the tamagui grammar — we stop
  extending it toward full-tailwind coverage (that catch-up game is what this
  plan kills; the passthrough absorbs the long tail).
- Users customize themes/tokens through tamagui config; `bg-color5`/`p-4`
  resolve as tamagui tokens. The `p-4` = 16px tailwind expectation is met by
  the v6 config aligning its numeric scales to tailwind values (config-level
  alignment, not parser special-casing).
- The "delete the hand-rolled parser" verdict below is superseded; the
  registry architecture below remains the reference for the optional native
  tailwind-subset support later.

## Original proposal (superseded by the hybrid ruling above, kept for the
registry/native reference)

Ownership split: **Tailwind owns class → CSS. Tamagui owns themes/tokens and
the native pipeline.**

### Web

1. Stop converting recognized tailwind classes into Tamagui props on web.
   `className` passes through to the DOM untouched.
2. CSS generation comes from the official engine. Two options:
   - (a) tell users to add `@tailwindcss/vite` alongside the tamagui plugin;
   - (b) embed `compile()` + oxide scanning inside `@tamagui/vite-plugin` so
     tailwind mode is zero-config.
   Recommend (b) as the default with (a) documented as an escape hatch, since
   we need the compiler instance anyway for native and for theme interop.
3. Theme interop: generate an `@theme` layer from the tamagui config (tokens →
   `--color-*`, `--spacing-*`, media breakpoints → `--breakpoint-*`) so
   `bg-background`, `text-color`, `p-4` resolve to tamagui theme CSS variables
   and stay theme-reactive. Tamagui themes already emit CSS variables on web,
   so this is mostly a naming mapping, generated once at build.
4. Precedence: tamagui-generated atomic CSS and tailwind utilities must have a
   deterministic order. Emit tailwind output into a cascade layer
   (`@layer`, v4 is layer-native) ordered relative to tamagui's stylesheet.
   Decide and document: className beats props or props beat className (v4
   layers make either enforceable; recommend className wins since it reads as
   an override at the call site).

### Native

1. Build-time registry, same shape as uniwind: oxide scans source →
   candidates → `compiler.build(candidates)` → parse the emitted CSS
   (lightweight-css or postcss) → declarations → RN style objects → emit a
   generated JS module mapping class name → style (+ variant metadata:
   media query, hover/press/focus, dark/light).
2. Runtime: `getSplitStyles` in tailwind mode does a registry lookup per class
   instead of parsing. Media/pseudo variants map onto tamagui's existing media
   and pseudo systems (we already have drivers for both, which is our edge
   over nativewind). Classes with no RN-mappable declarations are dropped;
   `process.env.NODE_ENV=development` warns once per class.
3. Theme variables: v4 emits `var(--...)` heavily. Resolution table generated
   from the same `@theme` mapping; runtime resolves through the active tamagui
   theme, so `bg-background` is dynamic per theme on native too.
4. Delete the hand-rolled maps in `getSplitStyles.tsx` once the registry path
   passes the existing `core-test/tailwindMode.web.test.tsx` suite plus a new
   native conversion suite. One path only: the runtime parser does not stay as
   a fallback. Dynamically constructed class names that never appear in source
   don't work, which is the same rule tailwind itself imposes on web, so it is
   teachable and expected.

### Bundler coverage

Vite first (embeds cleanly via the plugin). Metro needs the same registry
generation step in `@tamagui/metro-plugin`; the scanner and compiler are plain
node APIs so nothing is vite-specific except the wiring. Webpack/Next after.

## Gotchas / open questions

- The tailwind programmatic API is officially internal. Pin the version,
  vendor a thin wrapper, add a CI test that compiles a canary class list so a
  minor tailwind bump can't silently break us. (tailwind-merge and prettier
  live with this fine.)
- CSS → RN conversion has real edge cases: shorthand expansion (`border`,
  `inset`), units (rem-based spacing scale → numeric px via a root font size
  constant), `calc()` (drop or partially evaluate), transforms syntax,
  gradients (drop), `space-x-*` child selectors (unsupported on native, drop).
  Steal test cases from nativewind's and uniwind's interop suites.
- Class merging: two classes setting the same property (`p-2 p-4`) resolve by
  CSS order on web; the native registry must apply in candidate order to
  match. Also decide how `styled()` variants that inject className compose.
- SSR: class pass-through makes SSR simpler on web (no extraction needed for
  tailwind classes), but check hydration interplay with tamagui's inline style
  path.
- Compiler (static extraction) interplay: extracted tamagui props become
  tamagui atomic classes while tailwind classes ride alongside; the cascade
  layer ordering must hold for both.

## Phases

1. **Spike (small):** embed `compile()` in the vite plugin, generate the
   `@theme` mapping from a tamagui config, render kitchen-sink tailwind pages
   with full v4 syntax on web. Proves theme interop + precedence.
2. **Native registry:** scanner + build + CSS→RN conversion + generated
   module + `getSplitStyles` lookup. Port `tailwindMode` tests, add native
   conversion tests.
3. **Kill the hand-rolled parser**, wire metro, docs. Ship as the tailwind
   mode (it replaces the current behavior rather than sitting next to it).

## References

- https://github.com/tailwindlabs/tailwindcss/discussions/16581 (programmatic v4)
- https://uniwind.dev/vs-nativewind and https://docs.uniwind.dev/ (registry architecture)
- https://www.nativewind.dev/v5 (tw v4 preview status)
