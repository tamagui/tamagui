// compares tamagui native numeric output to tailwind's own css values
const fs = require('fs')
const path = require('path')
const { cssText } = require('./out/rivals.json')
const tg = require('./out/tamagui-runtime.json')
const theme = fs.readFileSync(require.resolve('tailwindcss/theme.css'), 'utf8')
const vars = {}
for (const m of theme.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) vars[m[1]] ||= m[2].trim()
const sub = (v, depth = 0) => {
  if (depth > 8) return v
  return v.replace(
    /var\((--[\w-]+)(?:,\s*([^()]*(?:\([^()]*\))?[^()]*))?\)/g,
    (_, n, fb) =>
      vars[n] != null ? sub(vars[n], depth + 1) : fb != null ? sub(fb, depth + 1) : `?`
  )
}
const num = (raw) => {
  let v = sub(raw).trim()
  let m
  if ((m = v.match(/^calc\(\s*(-?[\d.]+)(rem|px)?\s*\*\s*(-?[\d.]+)\s*\)$/)))
    return +m[1] * (m[2] === 'rem' ? 16 : 1) * +m[3]
  if ((m = v.match(/^calc\(\s*(-?[\d.]+)(rem|px)\s*\*\s*-1\s*\)$/)))
    return -+m[1] * (m[2] === 'rem' ? 16 : 1)
  if ((m = v.match(/^(-?[\d.]+)(rem|px)$/))) return +m[1] * (m[2] === 'rem' ? 16 : 1)
  if ((m = v.match(/^-?[\d.]+$/))) return +v
  return null
}
const camel = (p) => p.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
const sides = ['Top', 'Right', 'Bottom', 'Left']
const targets = (prop) => {
  const c = camel(prop)
  if (prop === 'border-width') return (k) => /^border\w*Width$/.test(k)
  if (prop === 'border-radius') return (k) => /^border\w*Radius$/.test(k)
  if (prop === 'inset') return (k) => ['top', 'right', 'bottom', 'left'].includes(k)
  if (prop.startsWith('inset-')) return (k) => ['top', 'right', 'bottom', 'left'].includes(k)
  if (/^(margin|padding)-(inline|block)/.test(prop)) {
    const b = prop.split('-')[0]
    return (k) => k.startsWith(b)
  }
  const logical = {
    'inline-size': 'width',
    'block-size': 'height',
    'min-inline-size': 'minWidth',
    'max-inline-size': 'maxWidth',
    'min-block-size': 'minHeight',
    'max-block-size': 'maxHeight',
  }
  if (logical[prop]) return (k) => k === logical[prop] || k === camel(prop)
  if (
    /^border-(inline|block)?-?(start|end)?-?width$|^border-(inline|block)-width$/.test(
      prop
    )
  )
    return (k) => /^border\w*Width$/.test(k)
  if (/^border-.*radius$/.test(prop)) return (k) => /^border\w*Radius$/.test(k)
  if (prop === 'gap') return (k) => k === 'gap' || k === 'rowGap' || k === 'columnGap'
  return (k) =>
    k === c ||
    (k.startsWith(c) &&
      /^(Top|Right|Bottom|Left|Start|End|Horizontal|Vertical)$/.test(k.slice(c.length)))
}
const out = []
let checked = 0
for (const [cls, text] of Object.entries(cssText)) {
  const style = tg[cls]
  if (!style || typeof style !== 'object') continue
  const block = text.split('@property')[0]
  const body = block.slice(block.indexOf('{') + 1)
  for (const m of body.matchAll(/(?:^|[;{\s])([a-z][a-z-]*)\s*:\s*([^;{}]+);/g)) {
    const want = num(m[2])
    if (want == null) continue
    const match = targets(m[1])
    for (const [k, got] of Object.entries(style)) {
      if (!match(k) || typeof got !== 'number') continue
      checked++
      if (Math.abs(got - want) > 0.01) out.push(`${cls}\t${m[1]}=${want}\t${k}=${got}`)
    }
  }
}
fs.writeFileSync(path.join(__dirname, 'out/values.txt'), out.join('\n'))
console.log('checked', checked, 'mismatches', out.length)
