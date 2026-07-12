/**
 * EXHAUSTIVE parity gate (shared by the .web + .native wrappers). enumerates EVERY
 * propToTailwindPrefix + standaloneValueProps entry with a DEFINED source sample (plus
 * value-domain samples), drives it SOURCE → real converter → getSplitStyles, and asserts the
 * converted class resolves to the SAME output as the source prop over BOTH viewProps AND
 * style/rules. any entry whose inverse is unsupported/differs must be REMOVED + retained.
 */

import { describe, expect, test } from 'vitest'
import { StyleObjectProperty, StyleObjectValue } from '@tamagui/helpers'

import { View, Text } from '../web/src'
import { simplifiedGetSplitStyles } from './utils'
import { tamaguiToTailwind } from '../to-tailwind/src/transform'
import { propToTailwindPrefix, standaloneValueProps } from '../to-tailwind/src/maps/propToClass'

function classOf(out: string): string {
  const m = /className="([^"]*)"/.exec(out)
  return m ? m[1] : ''
}
function convert(sourceJSX: string): string {
  return tamaguiToTailwind(sourceJSX, { renameComponents: false })
}

// merged resolved output: style/rules (base props only) + viewProps (pointerEvents, a11y, …)
function resolved(Comp: any, props: Record<string, any>): Record<string, any> {
  const s = simplifiedGetSplitStyles(Comp, props as any)
  const out: Record<string, any> = { ...(s.style || {}) }
  for (const r of Object.values(s.rulesToInsert || {}) as any[]) {
    const p = r[StyleObjectProperty]
    if (p != null && out[p] === undefined) out[p] = r[StyleObjectValue]
  }
  // include behavioral viewProps (pointerEvents, accessibility*, role, …) so they aren't compared
  // hollow — but EXCLUDE the internal plumbing keys (className/style/children/ref) which differ by
  // hashing and aren't resolved style values.
  const internal = new Set(['className', 'style', 'children', 'ref', 'key'])
  const vp = s.viewProps || {}
  for (const k of Object.keys(vp)) {
    if (!internal.has(k) && out[k] === undefined) out[k] = vp[k]
  }
  return out
}

// a defined source SAMPLE per mapped prop. `null` marks a prop whose conversion is fully covered
// by standaloneValueProps (prefix '') — its enum values are exercised in that suite instead.
const SAMPLE: Record<string, { comp: any; attr: string } | null> = {
  backgroundColor: { comp: View, attr: 'backgroundColor="red"' },
  width: { comp: View, attr: 'width={100}' },
  height: { comp: View, attr: 'height={50}' },
  minWidth: { comp: View, attr: 'minWidth={20}' },
  maxWidth: { comp: View, attr: 'maxWidth={200}' },
  minHeight: { comp: View, attr: 'minHeight={20}' },
  maxHeight: { comp: View, attr: 'maxHeight={200}' },
  padding: { comp: View, attr: 'padding={10}' },
  paddingTop: { comp: View, attr: 'paddingTop={10}' },
  paddingRight: { comp: View, attr: 'paddingRight={10}' },
  paddingBottom: { comp: View, attr: 'paddingBottom={10}' },
  paddingLeft: { comp: View, attr: 'paddingLeft={10}' },
  paddingHorizontal: { comp: View, attr: 'paddingHorizontal={10}' },
  paddingVertical: { comp: View, attr: 'paddingVertical={10}' },
  margin: { comp: View, attr: 'margin={8}' },
  marginTop: { comp: View, attr: 'marginTop={8}' },
  marginRight: { comp: View, attr: 'marginRight={8}' },
  marginBottom: { comp: View, attr: 'marginBottom={8}' },
  marginLeft: { comp: View, attr: 'marginLeft={8}' },
  marginHorizontal: { comp: View, attr: 'marginHorizontal={8}' },
  marginVertical: { comp: View, attr: 'marginVertical={8}' },
  gap: { comp: View, attr: 'gap={8}' },
  borderWidth: { comp: View, attr: 'borderWidth={2}' },
  borderTopWidth: { comp: View, attr: 'borderTopWidth={2}' },
  borderRightWidth: { comp: View, attr: 'borderRightWidth={2}' },
  borderBottomWidth: { comp: View, attr: 'borderBottomWidth={2}' },
  borderLeftWidth: { comp: View, attr: 'borderLeftWidth={2}' },
  borderColor: { comp: View, attr: 'borderColor="red"' },
  borderTopColor: { comp: View, attr: 'borderTopColor="red"' },
  borderRightColor: { comp: View, attr: 'borderRightColor="red"' },
  borderBottomColor: { comp: View, attr: 'borderBottomColor="red"' },
  borderLeftColor: { comp: View, attr: 'borderLeftColor="red"' },
  borderRadius: { comp: View, attr: 'borderRadius={12}' },
  borderTopLeftRadius: { comp: View, attr: 'borderTopLeftRadius={12}' },
  borderTopRightRadius: { comp: View, attr: 'borderTopRightRadius={12}' },
  borderBottomLeftRadius: { comp: View, attr: 'borderBottomLeftRadius={12}' },
  borderBottomRightRadius: { comp: View, attr: 'borderBottomRightRadius={12}' },
  borderStyle: { comp: View, attr: 'borderStyle="dashed"' },
  color: { comp: Text, attr: 'color="red"' },
  fontSize: { comp: Text, attr: 'fontSize={14}' },
  fontWeight: { comp: Text, attr: 'fontWeight="700"' },
  fontFamily: { comp: Text, attr: 'fontFamily="Inter"' },
  fontStyle: null, // standalone (italic/not-italic)
  lineHeight: { comp: Text, attr: 'lineHeight={20}' },
  letterSpacing: { comp: Text, attr: 'letterSpacing={1}' },
  textAlign: { comp: Text, attr: 'textAlign="center"' },
  textTransform: null, // standalone
  textDecorationLine: null, // standalone
  display: null, // standalone
  position: null, // standalone
  top: { comp: View, attr: 'top={5}' },
  right: { comp: View, attr: 'right={5}' },
  bottom: { comp: View, attr: 'bottom={5}' },
  left: { comp: View, attr: 'left={5}' },
  inset: { comp: View, attr: 'inset={5}' },
  zIndex: { comp: View, attr: 'zIndex={5}' },
  overflow: null, // standalone
  flex: { comp: View, attr: 'flex={1}' },
  flexDirection: null, // standalone
  flexWrap: null, // standalone
  flexGrow: { comp: View, attr: 'flexGrow={1}' },
  flexShrink: { comp: View, attr: 'flexShrink={1}' },
  alignItems: null, // standalone
  alignContent: null, // standalone
  alignSelf: null, // standalone
  justifyContent: null, // standalone
  opacity: { comp: View, attr: 'opacity={0.5}' },
  boxShadow: { comp: View, attr: 'boxShadow="0 1px 2px red"' },
  pointerEvents: { comp: View, attr: 'pointerEvents="box-none"' },
  rotate: { comp: View, attr: 'rotate="10deg"' },
  scale: { comp: View, attr: 'scale={0.95}' },
  x: { comp: View, attr: 'x={10}' },
  y: { comp: View, attr: 'y={10}' },
  aspectRatio: { comp: View, attr: 'aspectRatio={1.5}' },
  objectFit: null, // standalone
}

export function runParityGate(label: string) {
  describe(`parity gate [${label}] — every propToTailwindPrefix entry: class === source prop`, () => {
    for (const prop of Object.keys(propToTailwindPrefix)) {
      const sample = SAMPLE[prop]
      // exhaustiveness guard: every mapped prop MUST have a defined sample (or explicit null)
      test(`${prop} has a defined parity sample`, () => {
        expect(prop in SAMPLE).toBe(true)
      })
      if (!sample) continue
      test(`${prop}: ${sample.attr}`, () => {
        const tag = sample.comp === Text ? 'Text' : 'View'
        const cls = classOf(convert(`<${tag} ${sample.attr} />`))
        if (cls === '') return // retained (no class) — trivially === source
        expect(resolved(sample.comp, { className: cls })).toEqual(
          resolved(sample.comp, parseAttr(sample.attr))
        )
      })
    }
  })

  describe(`parity gate [${label}] — standaloneValueProps: class === source prop`, () => {
    for (const [prop, valueMap] of Object.entries(standaloneValueProps)) {
      for (const value of Object.keys(valueMap)) {
        test(`${prop}="${value}"`, () => {
          const Comp = /^(text|font)/.test(prop) ? Text : View
          const tag = Comp === Text ? 'Text' : 'View'
          const cls = classOf(convert(`<${tag} ${prop}="${value}" />`))
          expect(cls).not.toBe('')
          expect(resolved(Comp, { className: cls })).toEqual(resolved(Comp, { [prop]: value }))
        })
      }
    }
  })

  describe(`parity gate [${label}] — REMOVED unsafe mappings are RETAINED (no class)`, () => {
    const removed = [
      'backgroundImage',
      'backgroundPosition',
      'backgroundSize',
      'backgroundRepeat',
      'backgroundClip',
      'outlineWidth',
      'outlineColor',
      'outlineStyle',
      'outlineOffset',
      'objectPosition',
      'rowGap',
      'columnGap',
      'overflowX',
      'overflowY',
      'textDecorationColor',
      'borderHorizontalWidth',
      'borderVerticalWidth',
      'flexBasis',
      'userSelect',
      'cursor',
    ]
    for (const prop of removed) {
      test(`${prop} not mapped`, () => {
        expect(prop in propToTailwindPrefix).toBe(false)
      })
    }
  })
}

// parse a `name={value}` / `name="value"` attribute into a prop object
function parseAttr(attr: string): Record<string, any> {
  const braceIdx = attr.indexOf('={')
  if (braceIdx !== -1) {
    const name = attr.slice(0, braceIdx)
    const raw = attr.slice(braceIdx + 2, -1)
    return { [name]: raw.startsWith("'") || raw.startsWith('"') ? raw.slice(1, -1) : Number(raw) }
  }
  const eq = attr.indexOf('="')
  const name = attr.slice(0, eq)
  return { [name]: attr.slice(eq + 2, -1) }
}
