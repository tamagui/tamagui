/**
 * MAPPING-TABLE PARITY GATE.
 *
 * The converter's mapping tables are safe only if EVERY entry's inverse equals the source
 * prop+value. This gate drives EACH standaloneValueProps entry (and a representative set of
 * propToTailwindPrefix entries) SOURCE → real converter → runtime, and asserts the converted
 * class resolves to the SAME style as the SOURCE PROP applied directly (representation-agnostic:
 * compares resolved(class) to resolved(prop), so it holds on web and native). It also asserts
 * props whose mapping was REMOVED are RETAINED (no className, no dead class).
 */

import { beforeAll, describe, expect, test } from 'vitest'
import { defaultConfig as v6 } from '@tamagui/config/v6'
import { StyleObjectProperty, StyleObjectValue } from '@tamagui/helpers'

import { View, Text, createTamagui } from '../web/src'
import { simplifiedGetSplitStyles } from './utils'
import { tamaguiToTailwind } from '../to-tailwind/src/transform'
import { standaloneValueProps, propToTailwindPrefix } from '../to-tailwind/src/maps/propToClass'

beforeAll(() => {
  createTamagui({
    ...(v6 as any),
    settings: { ...(v6 as any).settings, styleMode: 'tailwind' },
  } as any)
})

function convert(sourceJSX: string): string {
  return tamaguiToTailwind(sourceJSX, { renameComponents: false })
}
function classOf(out: string): string {
  const m = /className="([^"]*)"/.exec(out)
  return m ? m[1] : ''
}
// merged resolved style (base props) — works on web (atomic rules) and native (inline)
function styleObj(Comp: any, props: Record<string, any>): Record<string, any> {
  const s = simplifiedGetSplitStyles(Comp, props as any)
  const out: Record<string, any> = { ...(s.style || {}) }
  for (const r of Object.values(s.rulesToInsert || {}) as any[]) {
    const p = r[StyleObjectProperty]
    if (p != null && out[p] === undefined) out[p] = r[StyleObjectValue]
  }
  return out
}

describe('parity — standaloneValueProps: class resolves === source prop', () => {
  for (const [prop, valueMap] of Object.entries(standaloneValueProps)) {
    for (const value of Object.keys(valueMap)) {
      test(`${prop}="${value}"`, () => {
        const Comp = /^(text|font)/.test(prop) ? Text : View
        const tag = Comp === Text ? 'Text' : 'View'
        const cls = classOf(convert(`<${tag} ${prop}="${value}" />`))
        expect(cls).not.toBe('') // standalone enums are all convertible
        // resolved(converted class) must equal resolved(source prop applied directly)
        expect(styleObj(Comp, { className: cls })).toEqual(styleObj(Comp, { [prop]: value }))
      })
    }
  }
})

describe('parity — representative propToTailwindPrefix entries: class === source prop', () => {
  // non-token values so web CSS var vs px-literal representations don't diverge
  const cases: [any, string, any][] = [
    [View, 'backgroundColor', 'red'],
    [View, 'width', 100],
    [View, 'height', 50],
    [View, 'padding', 10],
    [View, 'margin', 8],
    [View, 'borderRadius', 12],
    [View, 'opacity', 0.5],
    [View, 'zIndex', 5],
    [View, 'aspectRatio', 1.5],
    [View, 'gap', 8],
    [Text, 'color', 'red'],
    [Text, 'fontSize', 14],
    [View, 'borderWidth', 2],
  ]
  for (const [Comp, prop, value] of cases) {
    test(`${prop}=${JSON.stringify(value)}`, () => {
      const tag = Comp === Text ? 'Text' : 'View'
      const attr = typeof value === 'string' ? `${prop}="${value}"` : `${prop}={${value}}`
      const cls = classOf(convert(`<${tag} ${attr} />`))
      expect(cls).not.toBe('')
      expect(styleObj(Comp, { className: cls })).toEqual(styleObj(Comp, { [prop]: value }))
    })
  }
})

describe('parity — REMOVED unsafe mappings are RETAINED (never a dead/wrong class)', () => {
  const removed: [string, string][] = [
    ['backgroundImage', 'linear-gradient(red, blue)'],
    ['backgroundPosition', 'center'],
    ['backgroundSize', 'cover'],
    ['backgroundRepeat', 'no-repeat'],
    ['outlineWidth', '{2}'],
    ['outlineColor', 'red'],
    ['outlineStyle', 'solid'],
    ['objectPosition', 'center'],
    ['rowGap', '{10}'],
    ['columnGap', '{11}'],
    ['overflowX', 'scroll'],
    ['overflowY', 'scroll'],
    ['textDecorationColor', 'red'],
  ]
  for (const [prop, val] of removed) {
    test(`${prop} retained`, () => {
      const attr = val.startsWith('{') ? `${prop}=${val}` : `${prop}="${val}"`
      const out = convert(`<View ${attr} />`)
      expect(out).not.toContain('className')
      expect(out).toContain(`${prop}`)
      expect(prop in propToTailwindPrefix).toBe(false)
    })
  }

  test('boxShadow="none" is retained (only the arbitrary shadow form converts)', () => {
    const out = convert(`<View boxShadow="none" />`)
    expect(out).not.toContain('className')
    expect(out).toContain('boxShadow="none"')
  })
})
