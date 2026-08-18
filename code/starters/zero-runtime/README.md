# Zero-runtime starter

A contract-compliant zero-runtime Tamagui app, built through Vite, Next
(webpack) and Metro web from one source tree. It is the app the end-to-end size
gate measures, and it is meant to be copied.

## What "contract-compliant" means here

`src/Dashboard.tsx` and `src/Screen.tsx` follow the seven authoring rules:
literal components, build-time style values, statically enumerable theme names,
a static CSS transition, no prop spread, no provider, and no JavaScript read of
design state. The one piece that needs a runtime, a modal sheet with a portal
and measurement, lives in `src/islands/DetailsIsland.tsx` and is built as its
own full-runtime entry.

`tamagui.config.ts` narrows the config to two themes and five color tokens.
That narrowing is the CSS-size lever the mode gives an app: the v6 default pack
ships 128 themes and 306 color tokens, and theme CSS is what a zero-runtime
build transfers instead of JavaScript.

## Measuring it

```sh
bun run measure
```

Builds each integration twice, once with no declared island and once with one,
and writes `receipts.json`. Every figure is gzip level 9 over the emitted
files, so the three integrations are measured the same way. The script exits
non-zero if any tier fails to build, ships a forbidden Tamagui module, or
reports a compiler violation.

```sh
bun run test
```

Runs the same Playwright spec against all three builds: first paint from the
generated stylesheet, the static CSS transition, theme switching, and the
island mounting on demand.

## Measured, 2026-08-18

JavaScript is the gzip of every script the page loads. On Next that includes
Next's own framework, main, webpack-runtime and polyfill chunks, which is why
its figure is not comparable to the other two; it is comparable to another Next
app. CSS is the one generated artifact. The island is a separate download that
only a user interaction pulls, so it is never folded into the page figure.

| Integration | Tier | Modules | Tamagui modules | Forbidden | Violations | JS gzip | CSS gzip | Island JS gzip |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Vite | base | 16 | 0 | 0 | 0 | 58,178 | 2,714 | - |
| Vite | islands | 17 | 0 | 0 | 0 | 59,124 | 2,745 | 90,413 |
| Next webpack | base | 132 | 0 | 0 | 0 | 138,979 | 2,714 | - |
| Next webpack | islands | 135 | 0 | 0 | 0 | 140,015 | 2,745 | 90,103 |
| Metro web | base | 13 | 0 | 0 | 0 | 60,150 | 2,714 | - |
| Metro web | islands | 14 | 0 | 0 | 0 | 60,916 | 2,883 | 381,006 |

Zero Tamagui modules in every graph: the page's JavaScript is React, the
renderer, and this app.

## Known rough edges

- A `transition` written inside a `styled()` definition emits no transition CSS
  and reports no violation. Author it at the call site, as `Dashboard.tsx`
  does.
- Metro's island bundle is about 4.2x the gzip of the same island on Vite or
  Next, because Metro does no export-level shaking, so the island carries every
  module of every package it touches.
