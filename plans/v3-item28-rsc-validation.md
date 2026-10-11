# Item 28: RSC-safe zero entry, validation and design proposal

Written 2026-08-19 against `bf31ec9977`. The owner's 2026-08-18 reframing lifted
the hold for VALIDATION only: answer three questions, probe rather than reason,
write a proposal, change no code beyond probes. That is what this is. Nothing
here is implemented and nothing should be until the owner signs off, same gate
as item 29.

Claims are labeled **READ** (I ran it, receipt inline), **INFERRED** (follows
from named readings), or **GUESS** (fits the shape, unverified).

## The short version

The zero mode already produces exactly the artifact RSC wants: a client bundle
with **no Tamagui runtime in it at all**. The blocker is not the output, it is
that the SOURCE graph an RSC server evaluates cannot even be loaded today, and
it fails on the first import for a reason that has nothing to do with zero mode.

Also worth saying plainly before anything else: **there is no RSC path in this
repo to fix**. The zero fixture is Next **pages** router, built with `--webpack`.
No `app/` directory exists. So this is a greenfield design question, not a
repair.

## Q1: are the zero entry's modules importable from RSC as-is?

**No, and the first failure is one line in a constants package.**

**READ.** `node --conditions=react-server` (the condition an RSC bundler
resolves with), importing `tamagui` from `code/starters/zero-runtime`:

```
FAILED tamagui
SyntaxError: Named export 'useEffect' not found.
file:///…/code/core/constants/dist/esm/constants.mjs:1
import { useEffect, useLayoutEffect } from "react";
```

Same import with no condition: `LOADED tamagui: 445 exports`. So the graph is
fine in an ordinary server render and dies specifically under `react-server`.

The offending line is `code/core/constants/src/constants.ts:13-15`:

```ts
export const useIsomorphicLayoutEffect: typeof useEffect = isServer
  ? useEffect
  : useLayoutEffect
```

React's server build does not export hooks, so in ESM this fails at MODULE LOAD,
not at call time. `@tamagui/constants` is otherwise a bag of platform booleans
(`isWeb`, `isServer`, `isClient`, …) and nearly every package imports it, so this
single binding gates the entire graph.

**Scale of the wider pattern, READ.** Packages whose built ESM imports React
hooks at module scope:

| package | files |
| --- | ---: |
| `@tamagui/web` | 18 |
| `@tamagui/sheet` | 12 |
| `@tamagui/floating` | 8 |
| `z-index-stack`, `animate-presence` | 4 each |
| `portal`, `use-element-layout` | 3 each |
| 9 more packages | 2 each |
| `select`, `core`, `native`, `react-native-web-internals` | 1 each |

Do not read that table as "20 packages to fix". In an RSC graph a client
component is never loaded server-side at all; it is replaced by a reference. The
table is the map of what must end up on the client side of the boundary, and
`@tamagui/constants` is the one entry that is on the WRONG side today.

### The output is already right, which is the encouraging half

**READ**, `code/starters/zero-runtime/receipts.json`: `"tamaguiModules": []`,
`"forbiddenModules": 0`, `"compilerViolations": 0`.

Verified against the artifact rather than trusting the receipt. Counts in
`dist-vite/assets/index-B5_hyt-y.js`:

| fingerprint | occurrences |
| --- | ---: |
| `createComponent` | 0 |
| `getSplitStyles` | 0 |
| `TamaguiProvider` | 0 |
| `TamaguiRoot` | 0 |
| `useTheme` | 0 |
| `insertStyleRule` | 0 |
| `styled(` | 0 |

The compiler genuinely erases the runtime. So the RSC question is entirely about
**when** resolution happens: if the Tamagui compiler runs as a bundler transform
before the server graph is evaluated, the `tamagui` imports are gone before the
`react-server` condition can reject them. **INFERRED** from the two readings
above; not probed end to end, because no RSC path exists here to probe.

### One correction to the audit's premise

The audit records `TamaguiRoot` as ordinary markup that keeps `TamaguiProvider`
back-compat. **READ**, `code/core/web/src/views/TamaguiRoot.tsx:26-31`: it calls
`React.useState` and `React.useEffect`. It is a client component. It is also
absent from the zero bundle (0 occurrences above), so zero mode does not depend
on it, but any proposal that plans to render it on the server is wrong.

## Q2: is single-config a hard prerequisite, or independent?

**Structurally a prerequisite, for a reason `plans/v3-single-config-loading.md`
did not have to consider.**

That doc names two failure classes and says the dangerous one is **split state**:
`createTamagui` ran in one copy of core while a different copy does the reading,
so the reader has empty module-local token and media state, and no throw inside
`createTamagui` can catch it because the second copy never calls anything.

RSC produces exactly that condition **by construction**. An RSC app has two
module graphs (the server graph resolved with `react-server`, the client graph
without), so there are two core instances whether or not anyone made a mistake.

Today's mitigation cannot bridge them. **READ**,
`code/core/web/src/config.ts:27-62`, `getConfigFromGlobalOrLocal` falls back to
`globalThis.__tamaguiConfig`, with a comment saying it exists for "vite ssr
bundling where multiple copies of tamagui may exist" and a dev warning ending
"This is handled automatically, but likely causes issues!". Server and client
graphs in RSC do not share a `globalThis`, so the fallback is not merely ugly
there, it is inert.

So: **do not schedule an RSC lane before single-config lands.** Doing it in the
other order means building on the fallback the single-config design already
identifies as papering over the worst outcome in the codebase.

## Q3: what exactly is the client boundary?

Zero mode has already drawn it, and the answer is the island.

**READ**, `code/starters/zero-runtime/src/islands/DetailsIsland.tsx`, whose own
comment states the rule: "a modal sheet needs a portal, measurement and the
animation runtime, none of which the zero graph can contain. It is built as its
own full-runtime entry and mounted through the generated loader." It is emitted
separately as `dist-vite/tamagui-islands/DetailsIsland.js` (267,512 bytes raw)
while the main bundle carries no runtime at all.

Mapping that onto RSC, the boundary is:

- **Server side**: everything the compiler lowers to class names. `styled()`
  results, literal components, build-time style values, static transitions. The
  emitted markup plus `tamagui-zero.css`. No Tamagui module needs to load.
- **Client side (`"use client"`)**: every declared island, plus `TamaguiRoot`
  and `TamaguiProvider` for full-runtime consumers, plus anything in the
  20-package table above that an island actually reaches.
- **The one thing on the wrong side today**: `@tamagui/constants`, because
  `useIsomorphicLayoutEffect` drags React hooks into a module that server-side
  code legitimately wants for `isWeb` / `isServer`.

## Proposal

Smallest change that makes an RSC lane possible, in dependency order. **No code
until the owner signs off.**

1. **Split `useIsomorphicLayoutEffect` out of `@tamagui/constants`.** The
   constants themselves are server-safe; only that one binding is not. Moving it
   to its own module (or a `./hooks` subpath) makes constants importable under
   `react-server` and unblocks the first failure. This is the only change here
   that is worth doing on its own merits regardless of RSC, since a constants
   package importing React is wrong anyway.
2. **Land single-config first** (Q2). RSC guarantees two core instances, and the
   `globalThis` fallback cannot bridge server and client graphs.
3. **Then, and only then, build a real RSC fixture**, an `app/` router variant
   of the zero starter, and re-run the Q1 probe against it end to end. Every
   claim in Q1's "output is already right" section is INFERRED across the
   compile/evaluate seam and needs one real RSC build to become READ.
4. **Declare the boundary explicitly** rather than discovering it: islands and
   `TamaguiRoot`/`TamaguiProvider` get `"use client"`; the lowered output gets
   nothing.

`TamaguiProvider` back-compat is a hard constraint throughout, per the owner.
Nothing in the above removes or reshapes it; it simply lands on the client side
of the boundary, which is where it already effectively lives.

## What this validation did NOT establish

Stated plainly so nobody quotes this further than it goes:

- **No end-to-end RSC build was run**, because no RSC path exists in the repo.
  Step 3 exists precisely to close that.
- **The compiler-runs-before-evaluation claim is INFERRED**, not probed. It is
  the assumption the whole approach rests on, and it is the first thing
  step 3 must confirm.
- **`@tamagui/constants` is the FIRST blocker, not provably the only one.** The
  probe stops at the first failing module by construction. Fixing it will
  surface whatever is behind it, and the 20-package table says there is more.
