const fs = require('fs')
const path = require('path')
const { registry, css, cssText, nativewind, uniwind } = require('./out/rivals.json')
// effects react native renders on android only: filter functions other than brightness and opacity, z-axis transforms, caret color
const androidOnly = (c) =>
  /^-?(translate|scale)-z-/.test(c) ||
  /--tw-(blur|contrast|grayscale|hue-rotate|invert|saturate|sepia|drop-shadow)[a-z-]*:|caret-color:/.test(
    cssText[c].split('@property')[0]
  )
const tg = require('./out/tamagui-native.json')
const tgRuntime = require('./out/tamagui-runtime.json')
const rnKeys = new Set(
  fs.readFileSync(path.join(__dirname, 'rn-style-keys.txt'), 'utf8').trim().split('\n')
)
// non-style props a native view or text consumes
// svg paint (react-native-svg reads it from style) and props a view or text consumes
const behavior = new Set([
  'fill',
  'stroke',
  'strokeWidth',
  'numberOfLines',
  'placeholderTextColor',
  'ellipsizeMode',
  'selectable',
  'transitionProperty',
  'transitionDuration',
  'transitionTimingFunction',
  'transitionDelay',
  'transitionBehavior',
  'animationName',
  'animationDuration',
  'animationTimingFunction',
  'animationDelay',
  'animationIterationCount',
  'animationDirection',
  'animationFillMode',
  'animationPlayState',
])
const tamaguiKey = (k) => {
  if (/^(x|y|scale|scaleX|scaleY|rotate)$/.test(k) || k.startsWith('__transform_'))
    return 'transform'
  if (/^__(shadow|ring|insetRing|insetShadow)/.test(k)) return 'boxShadow'
  if (k.startsWith('__gradient')) return 'backgroundImage'
  if (k.startsWith('__filter_')) return 'filter'
  if (k.startsWith('__textShadow')) return 'textShadowOffset'
  const logical = {
    blockSize: 'height',
    inlineSize: 'width',
    minBlockSize: 'minHeight',
    maxBlockSize: 'maxHeight',
    minInlineSize: 'minWidth',
    maxInlineSize: 'maxWidth',
    borderInlineStartWidth: 'borderStartWidth',
    borderInlineEndWidth: 'borderEndWidth',
    borderBlockStartWidth: 'borderTopWidth',
    borderBlockEndWidth: 'borderBottomWidth',
    borderInlineStartColor: 'borderStartColor',
    borderInlineEndColor: 'borderEndColor',
  }
  return logical[k] || k
}
// react native 0.87 StyleSheetTypes.d.ts unions; a value outside them renders nothing
const align = ['flex-start', 'flex-end', 'center', 'stretch', 'baseline']
const rnEnums = {
  display: ['none', 'flex', 'contents'],
  position: ['absolute', 'relative', 'static'],
  overflow: ['visible', 'hidden', 'scroll'],
  flexDirection: ['row', 'column', 'row-reverse', 'column-reverse'],
  flexWrap: ['wrap', 'nowrap', 'wrap-reverse'],
  alignItems: align,
  alignSelf: ['auto', ...align],
  alignContent: [
    'flex-start',
    'flex-end',
    'center',
    'stretch',
    'space-between',
    'space-around',
    'space-evenly',
  ],
  justifyContent: [
    'flex-start',
    'flex-end',
    'center',
    'space-between',
    'space-around',
    'space-evenly',
  ],
  boxSizing: ['border-box', 'content-box'],
  direction: ['inherit', 'ltr', 'rtl'],
  backfaceVisibility: ['visible', 'hidden'],
  borderStyle: ['solid', 'dotted', 'dashed'],
  outlineStyle: ['solid', 'dotted', 'dashed'],
  pointerEvents: ['box-none', 'none', 'box-only', 'auto'],
  isolation: ['auto', 'isolate'],
  cursor: ['auto', 'pointer'],
  mixBlendMode: [
    'normal',
    'multiply',
    'screen',
    'overlay',
    'darken',
    'lighten',
    'color-dodge',
    'color-burn',
    'hard-light',
    'soft-light',
    'difference',
    'exclusion',
    'hue',
    'saturation',
    'color',
    'luminosity',
  ],
  fontStyle: ['normal', 'italic'],
  textAlign: ['auto', 'left', 'right', 'center', 'justify', 'start', 'end'],
  textAlignVertical: ['auto', 'top', 'bottom', 'center'],
  verticalAlign: ['auto', 'top', 'bottom', 'middle'],
  textDecorationLine: ['none', 'underline', 'line-through', 'underline line-through'],
  textDecorationStyle: ['solid', 'double', 'dotted', 'dashed', 'wavy'],
  textTransform: ['none', 'capitalize', 'uppercase', 'lowercase'],
  userSelect: ['auto', 'none', 'text', 'contain', 'all'],
  writingDirection: ['auto', 'ltr', 'rtl'],
  objectFit: ['cover', 'contain', 'fill', 'scale-down', 'none'],
}
const badValue = (values) =>
  Object.entries(values || {}).find(
    ([k, v]) => rnEnums[k] && typeof v === 'string' && !rnEnums[k].includes(v)
  )
const camel = (p) => p.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
// the family a css property or rn key belongs to, so logical and physical forms match
const family = (k) => {
  k = camel(k)
  if (/^(transform|translate|rotate|scale|perspective)/.test(k)) return 'transform'
  if (/^(inset|top|left|right|bottom|start|end)$|^inset/.test(k)) return 'inset'
  if (/^border.*Radius$/.test(k)) return 'borderRadius'
  if (/^border.*Width$/.test(k)) return 'borderWidth'
  if (/^border.*Color$/.test(k)) return 'borderColor'
  if (/^(margin|padding)/.test(k)) return k.match(/^(margin|padding)/)[1]
  if (/^(width|minWidth|maxWidth|height|minHeight|maxHeight)$/.test(k)) return k
  if (/^(boxShadow|textShadow)/.test(k))
    return k.startsWith('box') ? 'boxShadow' : 'textShadow'
  if (/^(gap|rowGap|columnGap)$/.test(k)) return 'gap'
  if (/^flex(Grow|Shrink|Basis)?$/.test(k)) return 'flex'
  if (k === 'backgroundImage') return k
  return k
}
const rnFamilies = new Set([...rnKeys].map(family))
// keys a library's own runtime consumes before react native sees the style
const runtimeKeys = {
  tamagui: new Set(),
  nativewind: new Set([
    'translate',
    'scale',
    'rotate',
    'rotateZ',
    'scaleX',
    'scaleY',
    'translateX',
    'translateY',
    'textShadow',
    'cursorColor',
    'placeholderTextColor',
    'fill',
    'stroke',
    'strokeWidth',
    'contentFit',
    'contentPosition',
  ]),
  uniwind: new Set([
    'translateX',
    'translateY',
    'scaleX',
    'scaleY',
    'textShadow',
    'accentColor',
    'fill',
    'stroke',
  ]),
}
const runtimeFamily = {
  translate: 'transform',
  scale: 'transform',
  rotate: 'transform',
  rotateZ: 'transform',
  scaleX: 'transform',
  scaleY: 'transform',
  translateX: 'transform',
  translateY: 'transform',
  textShadow: 'textShadow',
  cursorColor: 'caretColor',
  accentColor: 'accentColor',
  placeholderTextColor: 'color',
  strokeWidth: 'strokeWidth',
  contentFit: 'objectFit',
  contentPosition: 'objectPosition',
  selectable: 'userSelect',
  numberOfLines: 'webkitLineClamp',
}
const libs = {
  // tamagui: the final native style and props from getSplitStyles; a composer part
  // (from-*, shadow-<color>) has no style alone, so it counts as a modifier when claimed
  tamagui: (c) => {
    const runtime = Object.keys(tgRuntime[c] || {})
      .filter((k) => k !== 'prop:__textMetrics')
      .map((k) => k.replace(/^prop:/, ''))
    if (runtime.length) return { keys: runtime, vars: [], values: tgRuntime[c] }
    if (tg[c] && tg[c].length && tg[c].every(([k]) => k.startsWith('__')))
      return { keys: [], vars: tg[c].map(([k]) => k) }
    return null
  },
  nativewind: (c) => nativewind[c] || null,
  uniwind: (c) => uniwind[c] || null,
}
const result = {}
for (const [lib, get] of Object.entries(libs)) {
  const r = (result[lib] = {
    emitted: 0,
    covered: 0,
    invalidKey: 0,
    dropped: 0,
    modifier: 0,
    examples: { invalidKey: [], dropped: [] },
    coveredSet: [],
  })
  for (const c of registry) {
    const out = get(c)
    if (!out || (!out.keys.length && !out.vars.length)) continue
    r.emitted++
    if (androidOnly(c)) {
      r.androidOnly = (r.androidOnly || 0) + 1
      continue
    }
    const props = css[c] || []
    const keys = out.keys.map((k) => k.split('.')[0])
    if (!props.length) {
      // modifier part (custom properties only): counts when the library consumes it
      r.modifier++
      r.covered++
      r.coveredSet.push(c)
      continue
    }
    const wrong = badValue(out.values)
    if (wrong) {
      r.invalidValue = (r.invalidValue || 0) + 1
      ;(r.examples.invalidValue ||= []).length < 40 &&
        r.examples.invalidValue.push(`${c} -> ${wrong.join(': ')}`)
      continue
    }
    const bad = keys.filter(
      (k) => !rnKeys.has(k) && !behavior.has(k) && !runtimeKeys[lib].has(k)
    )
    if (bad.length || !keys.length) {
      r.invalidKey++
      if (r.examples.invalidKey.length < 40)
        r.examples.invalidKey.push(`${c} -> ${bad.join(',') || '(vars only)'}`)
      continue
    }
    const fams = new Set(keys.map((k) => family(runtimeFamily[k] || k)))
    if (keys.includes('numberOfLines')) (fams.add('overflow'), fams.add('display'))
    // the default solid line needs no key when the class also sets a width
    if (props.length > 1) (fams.add('borderStyle'), fams.add('outlineStyle'))
    const missing = props.filter((p) => rnFamilies.has(family(p)) && !fams.has(family(p)))
    if (missing.length) {
      r.dropped++
      if (r.examples.dropped.length < 40)
        r.examples.dropped.push(`${c} drops ${missing.join(',')}`)
      continue
    }
    r.covered++
    r.coveredSet.push(c)
  }
}
const n = registry.length
for (const [lib, r] of Object.entries(result))
  console.log(lib, {
    emitted: r.emitted,
    covered: r.covered,
    pct: ((100 * r.covered) / n).toFixed(2),
    invalidKey: r.invalidKey,
    invalidValue: r.invalidValue,
    androidOnly: r.androidOnly,
    dropped: r.dropped,
    modifier: r.modifier,
  })
fs.writeFileSync(path.join(__dirname, 'out/score.json'), JSON.stringify(result, null, 1))

// per-family share, the rows the site's coverage table shows
const groups = {
  display: (p) => p[0] === 'display',
  position: (p) => p[0] === 'position',
  'flex-direction': (p) => p[0] === 'flex-direction',
  gap: (p) => /^(gap|row-gap|column-gap)$/.test(p[0]),
  'padding / margin': (p) => /^(padding|margin)(-(top|right|bottom|left))?$/.test(p[0]),
  'width / height': (p) => /^(min-|max-)?(width|height)$/.test(p[0]),
  'background-color': (p) => p[0] === 'background-color',
  'border-radius': (p) =>
    /^border-(top-left-|top-right-|bottom-left-|bottom-right-)?radius$/.test(p[0]),
  'logical props': (p) => /(inline|block)/.test(p[0]) && !/^(display)$/.test(p[0]),
  'box-shadow': (p) => p.includes('box-shadow'),
  text: (p) =>
    /^(font-size|font-weight|letter-spacing|line-height|text-align|color)$/.test(p[0]),
  transform: (p) => /^(translate|rotate|scale|transform)$/.test(p[0]),
  gradients: (p) => p[0] === 'background-image',
  filters: (p) => p.includes('filter'),
}
for (const [name, test] of Object.entries(groups)) {
  const classes = registry.filter((c) => (css[c] || []).length && test(css[c]))
  const cells = Object.entries(result).map(([lib, r]) => {
    const set = new Set(r.coveredSet)
    return `${lib} ${((100 * classes.filter((c) => set.has(c)).length) / classes.length).toFixed(0)}%`
  })
  console.log(name.padEnd(18), String(classes.length).padStart(5), cells.join('  '))
}
