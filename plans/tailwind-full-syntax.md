# Tailwind hybrid: official v4 for the unclaimed web surface

Research and implementation detail for `v3-evolution.md`. The master plan owns
sequencing and acceptance. This file owns the hybrid boundary.

## Product contract

Tamagui parses the Tamagui grammar first. Any class it can prove is a
configured shorthand/prop plus an accepted token/value is claimed, consumed,
and resolved through Tamagui on web and native. Everything else is passthrough:

- web: the official Tailwind v4 engine generates the rule;
- native: the class is dropped with one development warning per candidate;
- later, an optional build-time native registry may support a measured subset.

Examples:

| candidate | owner | reason |
| --- | --- | --- |
| `p-4` | Tamagui | `p` is a shorthand and `$4` exists in `space` |
| `bg-color5` | Tamagui | configured theme/token value |
| `hover:p-4` | Tamagui | Tamagui modifier + claimed base |
| `grid-cols-3` | Tailwind web | no Tamagui prop grammar |
| `backdrop-blur-md` | Tailwind web | web-only long tail |
| `data-[state=open]:grid` | Tailwind web | official variant syntax |

`p-4` is token-first: it means `padding="$4"`, not Tailwind arithmetic. The v6
default config aligns `$4` to 16px, so the default result feels identical while
remaining configurable and cross-platform.

Both class-enabled modes use this exact pipeline. `styleMode: 'tailwind'`
exposes className-only styling types; `styleMode: 'tamagui-and-tailwind'` also
exposes Tamagui style props. There is no second parser or Tailwind integration
for either mode. `styleMode: 'tamagui'` leaves ordinary className passthrough
alone and does not claim utility candidates.

## One grammar, no dual emission

`@tamagui/style-grammar` is the shared, dependency-free owner of candidate
classification. Runtime parsing, `to-tailwind`, the compiler, and the bundler
candidate filter all consume that package.

The official scanner may discover every source candidate, but the Tamagui Vite
plugin filters the candidate list before calling Tailwind `build()`:

```text
source candidates
  -> classifyCandidate(candidate, config view)
     -> claimed Tamagui: runtime/compiler only; do not send to Tailwind
     -> passthrough: send to official Tailwind compiler
```

This filtering is required. Letting Tailwind emit rules for claimed classes
would create duplicate CSS, unclear precedence, and exactly the “two styling
systems for `p-4`” problem the hybrid design is meant to avoid.

The generated grammar table is also the audit surface. It marks direct
prop/token spellings and the small set of retained conveniences (`w-full`,
fractions, percentage opacity, and similar). No new Tailwind convenience is
hand-implemented just because Tailwind supports it; unclaimed syntax belongs to
the official engine.

## Vite implementation

Add an official-engine service to `@tamagui/vite-plugin`:

1. Require/pin Tailwind v4 for hybrid mode. A missing/incompatible version is a
   clear startup error, not a silent fallback.
2. Use Tailwind's compiler and scanner APIs. Keep the dependency behind one
   adapter plus a canary suite because parts of the programmatic API are not
   public.
3. Scan static source strings, including static class strings in `styled()`.
4. Filter claimed candidates with the active Tamagui config.
5. Build CSS only for passthrough candidates and update incrementally on HMR.
6. Emit into a deterministic layer after Tamagui atomics so call-site
   passthrough classes win over styled defaults and call-site props.
7. Do not inject preflight. An app opts into Tailwind base styles through its
   stylesheet.

No Tamagui-token-to-`@theme` mirror is needed for claimed classes: token classes
never reach Tailwind. An app may still define independent Tailwind theme values
for passthrough classes in its own CSS.

### Dynamic classes

- Claimed Tamagui candidates may be assembled dynamically because the runtime
  parser owns them.
- Passthrough Tailwind candidates follow Tailwind's static discovery rules.
  They must appear literally or be safelisted through the official mechanism.
- Functional `styled()` variants return style objects. Static variant values
  may be class strings and are scanner-visible.

This is one deliberate boundary, not a fallback heuristic.

## Precedence

There are two cases:

1. A claimed class is consumed into Tamagui props/styles. The shared Tamagui
   precedence contract applies.
2. A passthrough class remains on the DOM. Cascade layer ordering makes it win
   over base/styled Tamagui output at the call site.

Tests must cover extracted and runtime Tamagui styles, SSR/hydration, duplicate
property candidates, variant-injected classes, and user `className` order.

## Native contract

V3 beta does not compile arbitrary Tailwind CSS to React Native. It provides:

- full token/theme/dynamic support for the claimed Tamagui grammar;
- a deduplicated development warning for each unclaimed class;
- a production drop with no invalid `className` forwarding.

An optional later native registry would scan passthrough candidates, compile
them with the official engine, translate mappable declarations to RN style
objects, and generate a module. It must not grow the Tamagui runtime parser or
become a v3-beta blocker.

## Shovel-ready spike

Build a real Vite fixture with:

- `p-4 bg-color5` (claimed Tamagui);
- grid and container query utilities;
- `backdrop-blur`;
- `data-*` and arbitrary variants;
- an app-owned Tailwind theme value;
- static classes inside `styled()` variants/compound variants;
- SSR plus client hydration and HMR.

Acceptance:

1. Every surface paints correctly in development and production.
2. Token/theme changes update claimed classes without a Tailwind rebuild.
3. Generated Tailwind CSS contains zero claimed candidates.
4. Call-site passthrough classes win deterministically.
5. No hydration/console errors.
6. Report raw/gzip CSS size against the same app without passthrough classes.
7. Tailwind adapter canary compiles a fixed long-tail candidate list.

If filtering cannot prevent duplicate claimed rules, stop with the minimal
fixture. Do not ship dual ownership.

## Bundler order

1. Vite is the first official-engine frontend.
2. Webpack/Next receive adapters after the Vite contract is stable.
3. Metro does not need Tailwind for the v3-beta native contract; it only needs
   the Tamagui grammar/compiler. A native Tailwind registry is separate work.

## Non-goals

- Reimplementing Tailwind variants/utilities in `getSplitStyles`.
- Making arbitrary Tailwind web CSS work on native in the first release.
- Injecting a second token/theme source for classes Tamagui already owns.
- Keeping a manual Tailwind plugin path beside the embedded hybrid path.
- Supporting dynamic passthrough candidates beyond official Tailwind rules.

## References

- `plans/v3-evolution.md` — master execution contract
- Tailwind programmatic API discussion: tailwindlabs/tailwindcss#16581
- `@tailwindcss/oxide` and `@tailwindcss/vite`
- NativeWind/Uniwind sources for a possible later native registry
