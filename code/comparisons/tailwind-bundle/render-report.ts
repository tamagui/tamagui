import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const root = import.meta.dirname
const escape = (value: unknown) =>
  String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
const bytes = (value: number) => value.toLocaleString('en-US')
const reports = ['tamagui', 'uniwind', 'nativewind'].map((arm) =>
  JSON.parse(readFileSync(join(root, 'receipts', `${arm}-no-react.json`), 'utf8'))
)
const row = (cells: unknown[]) =>
  `<tr>${cells.map((cell) => `<td>${escape(cell)}</td>`).join('')}</tr>`
const fullReports = ['tamagui', 'uniwind', 'nativewind'].map((arm) =>
  JSON.parse(readFileSync(join(root, 'receipts', `${arm}.json`), 'utf8'))
)
const summary = reports
  .map((r) => row(['RAN', r.arm, bytes(r.totalJsGzipBytes), bytes(r.totalCssGzipBytes)]))
  .join('')
const details = reports
  .map(
    (r) => `<section><h2>${escape(r.arm)}</h2>
<p>RAN: ${bytes(r.totalJsGzipBytes)} bytes of JavaScript, ${bytes(r.totalCssGzipBytes)} bytes of CSS, gzip level 9.</p>
<table><thead><tr><th>Group</th><th>Standalone gzip</th><th>Marginal gzip</th></tr></thead><tbody>
${r.groups.map((g) => row([g.name, bytes(g.standaloneGzipBytes), bytes(g.marginalGzipBytes)])).join('')}</tbody></table>
<details><summary>Every package and version</summary><table><thead><tr><th>Package</th><th>Version</th><th>Standalone gzip</th><th>Marginal gzip</th></tr></thead><tbody>
${r.packages.map((p) => row([p.name, r.versions[p.name]?.join(', ') || 'generated', bytes(p.standaloneGzipBytes), bytes(p.marginalGzipBytes)])).join('')}</tbody></table></details>
<details><summary>Exact emitted files</summary><pre>${escape(JSON.stringify({ js: r.chunks, css: r.css }, null, 2))}</pre></details>
${r.clientConfig ? `<details><summary>Client config: themes removed from JS</summary><pre>${escape(r.clientConfig)}</pre></details>` : ''}
</section>`
  )
  .join('')
const commands = `cd code/comparisons/tailwind-bundle
bun prepare.ts
bun link-cache.ts /Users/macbookpro/Library/Caches/tamagui-v3-numbers/cmp
cd tamagui
BUNDLE_EXCLUDE_REACT=1 bash /Users/macbookpro/contrast/scripts/heavy.sh --cores 2 -- bun ../node_modules/vite/bin/vite.js build
cd ../nativewind
BUNDLE_EXCLUDE_REACT=1 bash /Users/macbookpro/contrast/scripts/heavy.sh --cores 2 -- bun ../node_modules/vite/bin/vite.js build
cd ../uniwind
BUNDLE_EXCLUDE_REACT=1 bash /Users/macbookpro/contrast/scripts/heavy.sh --cores 2 -- bun ../node_modules/vite/bin/vite.js build
cd ..
BUNDLE_EXCLUDE_REACT=1 bun attribute.ts tamagui nativewind uniwind
BUNDLE_EXCLUDE_REACT=1 bun probe.ts`
writeFileSync(
  join(root, 'report.html'),
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Tailwind web bundle audit</title>
<style>body{font:16px/1.5 system-ui,sans-serif;max-width:1050px;padding:24px;margin:auto;color:#202124;background:#fff}h1{font-size:28px}h2{font-size:22px}table{border-collapse:collapse;width:100%;margin:16px 0;font-variant-numeric:tabular-nums}th,td{text-align:left;border-bottom:1px solid #ddd;padding:8px}th{background:#f3f4f5}section{border-top:1px solid #ddd;margin-top:28px}pre{overflow:auto;background:#f3f4f5;padding:16px;font-size:12px}summary{cursor:pointer;padding:8px 0}p{max-width:85ch}</style>
<h1>Tailwind web bundle audit</h1><p>Tamagui core ships ${bytes(reports[0].totalJsGzipBytes)} bytes of gzipped JavaScript versus Uniwind's ${bytes(reports[1].totalJsGzipBytes)} in the same small app, ${((1 - reports[0].totalJsGzipBytes / reports[1].totalJsGzipBytes) * 100).toFixed(1)}% less. React, React DOM, and scheduler are externalized in all three builds. React Native Web and all other required dependencies stay bundled. Tamagui has no React Native Web. Theme definitions are in CSS. All three apps have the same card, two text elements, and a working counter.</p>
<p>These are separate small-app production builds, using Vite 8.2.2 and React 19.2.3. They replace the blog's comparison with a uniform bundler and minimal imports. The earlier figures described a larger speed-benchmark app, with a full UI provider and animations for Tamagui, and Expo/Metro plus a component barrel for NativeWind.</p>
<table><thead><tr><th>Evidence</th><th>App</th><th>Total JS gzip bytes</th><th>Total CSS gzip bytes</th></tr></thead><tbody>${summary}</tbody></table>
<p>All table measurements are RAN with the commands below. File totals are exact. Package/group standalone gzip compresses its minified source-map spans alone; marginal gzip deletes those spans and measures the difference. Both columns are non-additive because gzip shares a dictionary. Only React, React DOM, and scheduler are externalized. No manual chunks alter the build. Uniwind injects a config initialization without a source map, so its package attribution is approximate; complete-file totals remain exact.</p>
${details}<section><h2>Reproduce</h2><p>Run these commands sequentially in a fresh checkout on ci-64. The retained comparison cache contains locally packed Tamagui 3.0.0-tip.728da51995, NativeWind 5.0.0-preview.4 with react-native-css 3.0.7, Uniwind 1.11.0, and React Native Web 0.21.2. Installing current npm versions changes the experiment.</p><pre>${escape(commands)}</pre>
<details><summary>Separate complete-app builds, with React and React DOM bundled</summary><table><thead><tr><th>Evidence</th><th>App</th><th>Total JS gzip bytes</th><th>Total CSS gzip bytes</th></tr></thead><tbody>${fullReports.map((r) => row(['RAN', r.arm, bytes(r.totalJsGzipBytes), bytes(r.totalCssGzipBytes)])).join('')}</tbody></table><p>These totals are separate builds. They are not subtracted to calculate the comparison above.</p></details>
<p>The JSON receipts list every mapped module, actual package versions, and output SHA-256 hashes. The production browser probe checks the counter, matched computed styles, light/dark theme CSS, and page errors. The Tamagui attribution check rejects full UI, theme packs, animation drivers, and theme definitions in client JS.</p></section></html>`
)
