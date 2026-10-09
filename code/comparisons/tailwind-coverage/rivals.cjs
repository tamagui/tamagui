// compiles every class in tailwind's registry through nativewind and uniwind for ios.
// writes out/rivals.json: { registry, css: {class: cssProps}, cssText, nativewind, uniwind },
// where each library maps a class to the { keys, vars, values } its runtime receives
const fs = require('fs')
const { compile: twCompile, __unstable__loadDesignSystem } = require('@tailwindcss/node')
const tw = require('tailwindcss')
const { compile: rnCss } = require('react-native-css/compiler')
const path = require('path')
const out = (name) => path.join(__dirname, 'out', name)
fs.mkdirSync(out(''), { recursive: true })
// uniwind keeps its css compiler private to its metro transformer; expose it from a copy
const transformer = path.join(__dirname, 'node_modules/uniwind/dist/metro/transformer.cjs')
const harness = path.join(path.dirname(transformer), 'coverage-harness.cjs')
fs.writeFileSync(harness, `${fs.readFileSync(transformer, 'utf8')}\nexports.compileNativeCSS = compileNativeCSS;\n`)
const { compileNativeCSS } = require(harness)
;(async () => {
  const theme = fs.readFileSync(require.resolve('tailwindcss/theme.css'), 'utf8')
  const ds = await tw.__unstable__loadDesignSystem(`${theme}\n@tailwind utilities;`)
  const registry = ds.getClassList().map(([c]) => c)
  const cssList = ds.candidatesToCss(registry)
  const css = {}
  registry.forEach((c, i) => {
    const text = cssList[i] || ''
    const props = [...text.matchAll(/(?:^|[;{\s])(-?-?[a-z][a-z0-9-]*)\s*:/g)].map((m) => m[1]).filter((p) => !p.startsWith('--') && p !== 'syntax' && p !== 'inherits' && p !== 'initial-value')
    css[c] = [...new Set(props)]
  })
  const build = async (extra) => (await twCompile(`@import "tailwindcss";\n${extra}`, { base: __dirname, onDependency() {} })).build(registry)

  // nativewind v5: tailwind css -> react-native-css compiler
  const nwSheet = rnCss(await build('@import "nativewind/theme";')).stylesheet()
  const nativewind = {}
  for (const [cls, rules] of nwSheet.s || []) {
    const keys = new Set()
    const vars = new Set()
    const values = {}
    for (const rule of rules) {
      for (const d of rule.d || []) {
        if (Array.isArray(d)) {
          const k = Array.isArray(d[1]) ? d[1].join('.') : d[1]
          keys.add(k)
          if (typeof d[0] !== 'object') values[k] = d[0]
        } else for (const [k, v] of Object.entries(d)) keys.add(k), (values[k] = v)
      }
      for (const v of rule.v || []) vars.add(v[0])
    }
    nativewind[cls] = { keys: [...keys], vars: [...vars], values }
  }

  // uniwind: tailwind css -> uniwind native processor, evaluated like its runtime
  const uwJs = compileNativeCSS({ platform: 'ios', themes: ['light', 'dark'], polyfills: {} }, await build('@import "uniwind";'))
  const uwOut = new Function('rt', `return ${uwJs}`)({ colorScheme: 'light', rem: 16, insets: { top: 0, left: 0, right: 0, bottom: 0 }, screen: { width: 402, height: 874 }, fontScale: 1, orientation: 'portrait', rtl: false, hairlineWidth: 1 / 3 })
  const uniwind = {}
  for (const [cls, rules] of Object.entries(uwOut.stylesheet)) {
    const keys = new Set()
    const vars = new Set()
    const values = {}
    for (const rule of rules)
      for (const [k, v] of rule.entries || []) {
        ;(k.startsWith('--') ? vars : keys).add(k)
        if (k.startsWith('--')) continue
        // uniwind stores each value as a function of the custom properties in scope
        try {
          values[k] = typeof v === 'function' ? v({}) : v
        } catch {}
      }
    uniwind[cls] = { keys: [...keys], vars: [...vars], values }
  }
  const cssText = Object.fromEntries(registry.map((c, i) => [c, cssList[i] || ""]))
  fs.writeFileSync(out('rivals.json'), JSON.stringify({ registry, css, cssText, nativewind, uniwind }))
  fs.writeFileSync(out('registry.json'), JSON.stringify(registry))
  console.log(registry.length, Object.keys(nativewind).length, Object.keys(uniwind).length)
})()
