import { chromium, webkit } from '/Users/n8/tamagui/node_modules/playwright/index.mjs'
import { readFileSync, writeFileSync } from 'node:fs'
const { styles, attrs, events } = JSON.parse(readFileSync(process.argv[2], 'utf8'))
const tamaguiNonStyle = [
  'theme',
  'group',
  'render',
  'asChild',
  'transition',
  'animation',
  'size',
  'disabled',
  'hidden',
  'content',
  'translate',
  'width',
  'height',
  'direction',
  'color',
  'filter',
  'zoom',
  'inset',
  'span',
  'order',
  'x',
  'y',
  'r',
  'd',
  'all',
  'src',
  'alt',
  'title',
  'name',
  'value',
  'type',
  'role',
  'open',
  'scale',
  'rotate',
  'cursor',
  'fill',
  'stroke',
  'toString',
  'constructor',
  'hasOwnProperty',
  'cssText',
  'length',
  'parentRule',
  'cssFloat',
  'item',
  'getPropertyValue',
  'setProperty',
  '0',
]
const out = {}
for (const [name, bt] of [
  ['chromium', chromium],
  ['webkit', webkit],
]) {
  const b = await bt.launch()
  const p = await b.newPage()
  await p.setContent('<div></div>')
  out[name] = await p.evaluate(
    ({ styles, attrs, events, extra }) => {
      const s = document.createElement('div').style
      const all = []
      for (const k in s) if (isNaN(+k)) all.push(k)
      const ownKeys = new Set(all)
      const styleMissing = styles.filter((k) => !(k in s))
      const attrHits = [...attrs, ...events].filter((k) => k in s)
      const extraHits = extra.filter((k) => k in s)
      // benchmark: realistic key mix of 80 unique keys, 700k lookups
      const keys = styles
        .slice(0, 60)
        .concat([
          'id',
          'className',
          'onClick',
          'aria-label',
          'data-foo',
          'children',
          'style',
          'ref',
          'key',
          'testID',
          'theme',
          'group',
          'render',
          'asChild',
          'transition',
          'size',
          'disabled',
          'hidden',
          'role',
          'tabIndex',
        ])
      const table = {}
      for (const k of styles) table[k] = true
      const cache = new Map()
      const N = 700000
      const seq = new Array(N)
      for (let i = 0; i < N; i++) seq[i] = keys[((i * 2654435761) >>> 0) % keys.length]
      const bench = (fn) => {
        let hits = 0
        for (let r = 0; r < 3; r++) for (let i = 0; i < N; i++) if (fn(seq[i])) hits++
        const t = performance.now()
        for (let i = 0; i < N; i++) if (fn(seq[i])) hits++
        return (((performance.now() - t) * 1e6) / N).toFixed(2)
      }
      const staticIn = bench((k) => k in table)
      const domIn = bench((k) => k in s)
      const cached = bench((k) => {
        let v = cache.get(k)
        if (v === undefined) {
          v = k in s
          cache.set(k, v)
        }
        return v
      })
      const staticMap = new Map(styles.map((k) => [k, true]))
      const staticMapGet = bench((k) => staticMap.get(k) === true)
      return {
        enumerated: all.length,
        styleMissing,
        attrHits,
        extraHits,
        ns: { staticIn, domIn, cached, staticMapGet },
        sample: all,
      }
    },
    { styles, attrs, events, extra: tamaguiNonStyle }
  )
  out[name].version = b.version()
  await b.close()
}
const cr = new Set(out.chromium.sample),
  wk = new Set(out.webkit.sample)
out.onlyChromium = [...cr].filter((k) => !wk.has(k))
out.onlyWebkit = [...wk].filter((k) => !cr.has(k))
for (const n of ['chromium', 'webkit']) delete out[n].sample
writeFileSync(process.argv[3], JSON.stringify(out, null, 1))
console.log(
  JSON.stringify(
    {
      ...out,
      onlyChromium:
        out.onlyChromium.length + ' e.g. ' + out.onlyChromium.slice(0, 40).join(' '),
      onlyWebkit:
        out.onlyWebkit.length + ' e.g. ' + out.onlyWebkit.slice(0, 40).join(' '),
    },
    null,
    1
  )
)
