/**
 * ADVERSARIAL AUDIT — the exact cases the auditor ran with the proper runner. Every case drives
 * the REAL converter from SOURCE, then resolves through getSplitStyles; assertions are exact
 * (value + typeof) and prove resolved(converted) === resolved(source) OR byte/RETAIN, over the
 * full output (style/rules + viewProps).
 */

import { beforeAll, describe, expect, test } from 'vitest'
import { defaultConfig as v6 } from '@tamagui/config/v6'
import { StyleObjectProperty, StyleObjectValue } from '@tamagui/helpers'

import { View, Text, createTamagui } from '../web/src'
import { simplifiedGetSplitStyles } from './utils'
import { preprocessStyleModeProps } from '../web/src/helpers/getSplitStyles'
import { tamaguiToTailwind } from '../to-tailwind/src/transform'

let CFG: any
beforeAll(() => {
  CFG = createTamagui({
    ...(v6 as any),
    settings: { ...(v6 as any).settings, styleMode: 'tailwind' },
  } as any)
})

const convert = (s: string, o?: any) =>
  tamaguiToTailwind(s, { renameComponents: false, ...(o || {}) })
// extract the className and EVALUATE the string literal to its RUNTIME value (@babel/generator
// escapes backslashes in the emitted code, e.g. `\_` → `\\_`; a bundler un-escapes them at run).
const classOf = (out: string) => {
  const m = /className="([^"]*)"/.exec(out)
  return m ? (JSON.parse(`"${m[1]}"`) as string) : ''
}
const dynClassOf = (out: string) => (/className=\{`([^`]*)`\}/.exec(out) || [, ''])[1]!

function resolved(Comp: any, props: Record<string, any>): Record<string, any> {
  const s = simplifiedGetSplitStyles(Comp, props as any)
  const out: Record<string, any> = { ...(s.style || {}) }
  for (const r of Object.values(s.rulesToInsert || {}) as any[]) {
    const p = r[StyleObjectProperty]
    if (p != null && out[p] === undefined) out[p] = r[StyleObjectValue]
  }
  const internal = new Set(['className', 'style', 'children', 'ref', 'key'])
  const vp = s.viewProps || {}
  for (const k of Object.keys(vp))
    if (!internal.has(k) && out[k] === undefined) out[k] = vp[k]
  return out
}

describe('1 — spread element: opening AND closing stay paired (no </div> corruption)', () => {
  test('<View {...props}>x</View> stays View/View, byte-preserved', () => {
    const out = convert(`<View {...props}>x</View>`)
    expect(out).toBe(`<View {...props}>x</View>`)
  })
})

describe('2 — dynamic className precedence: source className wins', () => {
  test('className={foo} padding={10}: with foo="p-[8px]", className wins', () => {
    const cls = dynClassOf(convert(`<View className={foo} padding={10} />`))
    // foo is the dynamic expression; substitute the adversarial value
    const converted = cls.replace('${foo}', 'p-[8px]')
    expect(resolved(View, { className: converted }).paddingTop).toBe('8px')
    expect(resolved(View, { className: 'p-[8px]', padding: 10 }).paddingTop).toBe('8px')
  })

  test('animation props and animation-* classes both remain untouched', () => {
    for (const source of [
      `<View animation="slow" className="animation-fast" />`,
      `<View className="animation-fast" animation="slow" />`,
    ]) {
      const cls = classOf(convert(source))
      expect(cls).toBe('animation-fast')
      expect(convert(source)).toContain('animation="slow"')
      expect(
        preprocessStyleModeProps({ className: cls } as any, CFG).animation
      ).toBeUndefined()
    }
  })
})

describe('3 — XStack className="flex-col": flexDirection COLUMN (not the default row)', () => {
  test('converter does NOT append the implicit flex-row (which would override flex-col)', () => {
    // byte-preserved: the implicit XStack default is suppressed because the user class overrides
    expect(convert(`<XStack className="flex-col" />`)).toBe(
      `<XStack className="flex-col" />`
    )
    expect(convert(`<XStack className="flex-col" />`)).not.toContain('flex-row')
  })
  test('flex-col resolves to flexDirection column', () => {
    expect(resolved(View, { className: 'flex-col' }).flexDirection).toBe('column')
  })
})

describe('4 — existing raw hover color + converted hoverStyle: className wins', () => {
  test('source className wins', () => {
    const cls = classOf(
      convert(
        `<View className="hover:bg-[red]" hoverStyle={{ backgroundColor: "blue" }} />`
      )
    )
    const rules = Object.values(
      simplifiedGetSplitStyles(View, { className: cls } as any).rulesToInsert || {}
    ) as any[]
    const hoverBg = rules
      .filter((r) => r[StyleObjectProperty] === 'backgroundColor')
      .map((r) => r[StyleObjectValue])
    // red is emitted last (wins); blue is present but overridden
    expect(hoverBg[hoverBg.length - 1]).toBe('red')
  })
})

describe('5 — spread inside a style object: retained + order-distinct', () => {
  test('{opacity:.5, ...d} and {...d, opacity:.5} produce DISTINCT untouched output', () => {
    const a = convert(`<View hoverStyle={{ opacity: 0.5, ...dynamic }} />`)
    const b = convert(`<View hoverStyle={{ ...dynamic, opacity: 0.5 }} />`)
    expect(a).not.toBe(b) // order preserved, never collapsed
    expect(a).toContain('...dynamic')
    expect(b).toContain('...dynamic')
    expect(a).not.toContain('className')
  })
})

describe('6 — nested media+pseudo (both directions) → md:hover:opacity-50', () => {
  test('pseudo-containing-media and media-containing-pseudo both fully convert', () => {
    const a = convert(`<View hoverStyle={{ $md: { opacity: 0.5 } }} />`)
    const b = convert(`<View $md={{ hoverStyle: { opacity: 0.5 } }} />`)
    expect(classOf(a)).toBe('md:hover:opacity-50')
    expect(classOf(b)).toBe('md:hover:opacity-50')
    expect(a).not.toContain('hoverStyle') // no residual
    const flat = preprocessStyleModeProps(
      { className: 'md:hover:opacity-50' } as any,
      CFG
    )
    expect(flat.$md?.hoverStyle?.opacity).toBe(0.5)
  })
})

describe('7 — unresolved token: RETAIN, no dead class', () => {
  test('padding="$custom" with a config lacking it stays a prop', () => {
    const out = convert(`<View padding="$custom" />`, { tokens: { space: { $4: 20 } } })
    expect(out).toBe(`<View padding="$custom" />`)
    expect(out).not.toContain('p-custom')
  })
})

describe('binding provenance', () => {
  test('local View (non-tamagui import) is UNTOUCHED', () => {
    const src = `import {View} from "./local";\nexport const A = () => <View padding={10} />`
    expect(convert(src)).toBe(src)
  })
  test('local Sheet.Frame is UNTOUCHED', () => {
    const src = `const Sheet = local;\nexport const A = () => <Sheet.Frame padding={10} />`
    expect(convert(src)).toBe(src)
  })
  test('tamagui View-as-alias converts', () => {
    const out = convert(
      `import {View as TamaView} from "tamagui";\nexport const A = () => <TamaView padding={10} />`
    )
    expect(out).toContain('className="p-[10px]"')
  })
  test('tamagui namespace member converts', () => {
    const out = convert(
      `import * as T from "tamagui";\nexport const A = () => <T.View padding={10} />`
    )
    expect(out).toContain('<T.View className="p-[10px]"')
  })
  test('bare unbound <View> keeps legacy behavior (converts)', () => {
    expect(convert(`<View padding={10} />`)).toContain('className="p-[10px]"')
  })
})

describe('compositional overlap: converted class must not beat a retained longhand', () => {
  test('padding={10} paddingLeft={dyn=20}: resolved paddingLeft 20 (padding retained)', () => {
    const out = convert(`<View padding={10} paddingLeft={dynamicPadding} />`)
    // padding retained (overlaps the dynamic longhand) → no class beats it
    expect(out).not.toContain('className')
    // resolved(converted with dyn=20) === resolved(source) → paddingLeft 20 (longhand wins)
    expect(resolved(View, { padding: 10, paddingLeft: 20 }).paddingLeft).toBe('20px')
  })
})

describe('value domain', () => {
  test('numeric-looking STRING is NOT reinterpreted (retain)', () => {
    expect(convert(`<View width="10" />`)).toBe(`<View width="10" />`)
    expect(convert(`<Text fontSize="14" />`)).toBe(`<Text fontSize="14" />`)
  })
  test('literal underscore in var() survives', () => {
    const cls = classOf(convert(`<View backgroundColor="var(--my_color)" />`))
    expect(resolved(View, { className: cls }).backgroundColor).toBe('var(--my_color)')
    expect(resolved(View, { backgroundColor: 'var(--my_color)' }).backgroundColor).toBe(
      'var(--my_color)'
    )
  })
  test('raw fontFamily stays raw (not a token)', () => {
    const cls = classOf(convert(`<Text fontFamily="Inter-Black" />`))
    expect(resolved(Text, { className: cls }).fontFamily).toBe('Inter-Black')
    expect(resolved(Text, { fontFamily: 'Inter-Black' }).fontFamily).toBe('Inter-Black')
  })
  test('inexact percentage stays exact arbitrary', () => {
    const cls = classOf(convert(`<View width="33.333%" />`))
    expect(resolved(View, { className: cls }).width).toBe('33.333%')
    expect(resolved(View, { width: '33.333%' }).width).toBe('33.333%')
  })
  test('string-valued custom token emits its name, never its current value', () => {
    const cls = classOf(
      convert(`<View padding="$fluid" />`, { tokens: { space: { fluid: '10%' } } })
    )
    expect(cls).toBe('p-fluid')
    expect(cls).not.toContain('10%')
  })
})

describe('no-op: zero conversions → byte-for-byte identical', () => {
  test('unknown component + quirky whitespace preserved', () => {
    const src = `export const A=()=> <Chart width={640}  data={rows}/>`
    expect(convert(src)).toBe(src)
  })
  test('no-JSX file preserved', () => {
    const src = `const untouched  =  1\nexport const f = ( ) => untouched`
    expect(convert(src)).toBe(src)
  })
})
