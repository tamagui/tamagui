# Small Tailwind app bundle measurement

This fixture builds the same card, two text elements, and a working counter with
Tamagui core, NativeWind v5, and Uniwind. All three use Vite production builds with
minification, bundled React 19.2.3 and React DOM 19.2.3, and hidden source maps.
There is no router, Expo bootstrap, benchmark runner, UI kit, or animation driver.
The Tamagui arm compiles its View/Text elements and keeps the core provider. Its
light/dark theme definitions are generated into CSS; its client config has
`themes: {}` and reads those themes from the stylesheet.

NativeWind uses the individual View/Text adapters that its installed Babel
plugin emits for named React Native imports. Uniwind uses its public individual
View/Text adapters. Each arm includes its actual web dependencies; React Native
Web is reported separately from the styling framework. Tailwind's CSS pipeline
also generates classes retained by the Tamagui compiler.

## Reproduce the measured inputs

The retained comparison checkout on the `ci-64` machine is
`/Users/macbookpro/Library/Caches/tamagui-v3-numbers/cmp`. It contains the original
campaign's dependencies and locally packed Tamagui `3.0.0-tip.728da51995` packages.
That version is a local build from `v3/launch-numbers`, not an npm release. This
harness reuses those retained installed inputs rather than mixing in the
primary checkout's packages. The JSON receipts identify the versions by reading
the package manifest beside each source file actually present in the output.

From this directory in a fresh checkout on that machine:

```sh
bun prepare.ts
bun link-cache.ts /Users/macbookpro/Library/Caches/tamagui-v3-numbers/cmp
cd tamagui
bash /Users/macbookpro/contrast/scripts/heavy.sh --cores 2 -- bun ../node_modules/vite/bin/vite.js build
cd ../nativewind
bash /Users/macbookpro/contrast/scripts/heavy.sh --cores 2 -- bun ../node_modules/vite/bin/vite.js build
cd ../uniwind
bash /Users/macbookpro/contrast/scripts/heavy.sh --cores 2 -- bun ../node_modules/vite/bin/vite.js build
cd ..
bun attribute.ts tamagui nativewind uniwind
bun probe.ts
```

Run builds sequentially. `prepare.ts` generates all app bodies from one template.
The generated app directories, dependencies, builds, and fresh results are
ignored. Checked-in receipts preserve the measured output hashes and every
source-map package/module row. On another machine, copy the retained dependency
checkout first and pass that path to `link-cache.ts`. Installing current npm
versions changes the experiment and must be reported as a new measurement.

## Reading the bytes

Every measurement in the receipts is **RAN**, with its command included. Total
JS and CSS bytes are gzip level 9 of complete emitted files, summed over files.
No dependencies are externalized and no diagnostic chunks alter the build.
Maps and HTML are excluded from JS/CSS totals. Source-map spans cover every byte,
including an explicit row for unmapped bundler code.

Per-package **standalone gzip** compresses that package's minified spans in
output order. **Marginal gzip** is `gzip(bundle) - gzip(bundle without those
spans)`. Neither column adds up to the total: gzip shares its compression
dictionary across packages. They describe compression inputs, not independently
downloaded files or executable bundles after deleting code. The group rows use
the union of all spans in a group, never a sum of package marginals. Original
source mappings are approximate at minifier mapping boundaries, as with other
source-map explorers; emitted-file totals and hashes are exact. Uniwind 1.11.0 emits a source-map warning
for its injected `Uniwind.__reinit` call in `config/config.js`. Its package-level
attribution is approximate; the generated call is assigned to Uniwind or the
explicit unmapped row, and its complete-file gzip total is unaffected.

`probe.ts` serves the production artifacts, clicks the counter, checks matching
padding, gap, radius, font size/weight, and colors, and checks both Tamagui CSS
themes. It fails on page errors. `attribute.ts` also fails if Tamagui ships the
full UI provider, portal, theme pack, CSS animation driver, or theme definitions
in its client config.

## Why the earlier post had 88,928 / 25,864

**RAN:** read the prior lane's `sheet.md`, `data.md`,
`web-tip/benchmarks.json`, app config, and attribution plugin through `tm exec
ci-64`. The earlier build was a multi-scenario speed benchmark, with React/DOM,
the benchmark controls, the full `tamagui` provider, a CSS animation driver, and
two tiny light-theme values. Its total JS was 88,928 bytes at gzip's default
level 6. The receipt itself says the React/DOM baseline was about 62 KB.

**RAN:** its 25,864-byte framework number came from another build. The cached
attribution plugin externalized packages outside `tamagui`, `@tamagui/*`, and the
Tamagui color normalizer, then compressed an isolated framework chunk. The
receipt includes portal, `@tamagui/animations-css`, animation helpers, theme
hooks, and CSS-generation code. It excludes React/DOM and app code. The plugin
currently on `tm/site-claims` is different: it splits React and other dependency
chunks rather than externalizing them. Reusing that checkout's method would
not reproduce the old receipt.

**INFERRED from those reads:** 88,928 was an app total, not a Tamagui core cost.
The earlier fixture's theme object was only two values, so removing a large
theme pack cannot explain that total. The new figure describes a smaller,
core-only app and uses a uniform bundler; it does not revise the speed
benchmark's original artifact retroactively.

**RAN:** with this small app, importing NativeWind's CommonJS component barrel
produced 142,634 bytes of JS; importing the individual View/Text adapters
produced 82,560. Read `react-native-css/dist/module/babel/react-native.js`:
`handleReactNativeImport` emits those individual paths for named imports.
The original campaign used the barrel and Expo/Metro. The new comparison uses
the named-import output and Vite, so it should not attribute the old excess to
the styling runtime.

## Measured results

**RAN:** the commands above produced 75,766 bytes of JavaScript for Tamagui core,
99,067 for Uniwind, and 82,560 for NativeWind. Tamagui core ships about 23.5% less
JavaScript than Uniwind in this fixture. Its separately compressed runtime spans
are 16,342 bytes; React and React DOM are included in each app total.

Open [the report](./report.html) for every package, source module, output hash,
and command. [Browser receipts](./receipts/probe.json) record the matching styles,
working counters, and both CSS theme checks.
