/**
 * CONVERTER → FULL NATIVE getSplitStyles round-trip. EXACT value + typeof, NO tolerant helpers.
 *
 * React Native requires NUMBERS for dimensional + typography props (Yoga's parseCSSProperty
 * rejects "Npx" → the value is silently DROPPED; StyleSheetTypes types fontSize/lineHeight/
 * letterSpacing as number). So every converter-emitted [Npx] MUST resolve to a number on native.
 * These tests drive the REAL converter from a SOURCE prop (never a hand-written class) and assert
 * the resolved native `.style` value AND `typeof === 'number'` exactly.
 */

process.env.TAMAGUI_TARGET = 'native'

import { beforeAll, describe, expect, test } from 'vitest'
import { defaultConfig as v6 } from '@tamagui/config/v6'

import { View, Text, createTamagui } from '../web/src'
import {
  getSplitStyles,
  preprocessStyleModeProps,
} from '../web/src/helpers/getSplitStyles'
import { defaultComponentState } from '../web/src/defaultComponentState'
import { tamaguiToTailwind } from '../to-tailwind/src/transform'

let CFG: any
let THEME: any

beforeAll(() => {
  CFG = createTamagui({
    ...(v6 as any),
    settings: { ...(v6 as any).settings, styleMode: 'tailwind' },
  } as any)
  THEME = (CFG.themes as any).light
})

// SOURCE prop → real converter → the className it emits
function toClass(sourceJSX: string): string {
  const out = tamaguiToTailwind(sourceJSX, {
    renameComponents: false,
    tokens: (v6 as any).tokens,
    fonts: (v6 as any).fonts,
    themes: (v6 as any).themes,
    media: (v6 as any).media,
    shorthands: (v6 as any).shorthands,
  })
  const m = /className="([^"]*)"/.exec(out)
  return m ? m[1] : ''
}

// props → resolved FULL native style object
function nativeStyleOf(Comp: any, props: Record<string, any>): Record<string, any> {
  return (
    getSplitStyles(
      props as any,
      Comp.staticConfig,
      THEME,
      'light',
      defaultComponentState,
      { isAnimated: false, resolveValues: 'auto' } as any,
      {} as any,
      { animationDriver: {}, groups: { state: {} } } as any,
      undefined,
      undefined,
      true
    )!.style || {}
  )
}

function nativeStyle(Comp: any, className: string): Record<string, any> {
  return nativeStyleOf(Comp, { className })
}

// SOURCE prop → converter → native style value (full round-trip in one step)
function resolved(Comp: any, sourceJSX: string, styleProp: string): any {
  return nativeStyle(Comp, toClass(sourceJSX))[styleProp]
}

function flat(className: string): Record<string, any> {
  return preprocessStyleModeProps({ className } as any, CFG)
}

describe('native — px-length props resolve to EXACT NUMBERS (RN drops "Npx" strings)', () => {
  test('spacing/sizing tokens', () => {
    const p = resolved(View, `<View padding="$4" />`, 'paddingTop')
    expect((v6 as any).tokens.space.$4).toBe(16)
    expect(p).toBe(nativeStyleOf(View, { padding: '$4' }).paddingTop)
    expect(p).toBe(16)
    expect(typeof p).toBe('number')

    const g = resolved(View, `<View gap="$6" />`, 'gap')
    expect(g).toBe(24)
    expect(typeof g).toBe('number')

    const r = resolved(View, `<View borderRadius="$8" />`, 'borderTopLeftRadius')
    expect(r).toBe(22)
    expect(typeof r).toBe('number')

    const w = resolved(View, `<View width="$10" />`, 'width')
    expect(w).toBe(nativeStyleOf(View, { width: '$10' }).width)
    expect(w).toBe(40)
    expect(typeof w).toBe('number')
  })

  test('named radius token matches the direct Tailwind value', () => {
    const radius = resolved(View, `<View borderRadius="$lg" />`, 'borderTopLeftRadius')
    expect(radius).toBe(nativeStyleOf(View, { borderRadius: '$lg' }).borderTopLeftRadius)
    expect(radius).toBe(8)
    expect(typeof radius).toBe('number')
  })

  test('numeric literals', () => {
    const p = resolved(View, `<View padding={10} />`, 'paddingTop')
    expect(p).toBe(10)
    expect(typeof p).toBe('number')

    const bw = resolved(View, `<View borderWidth={0.5} />`, 'borderTopWidth')
    expect(bw).toBe(0.5)
    expect(typeof bw).toBe('number')
  })
})

describe('native — typography resolves to EXACT NUMBERS (RN StyleSheetTypes number-only)', () => {
  test('named text-base/leading-base use the paired Tailwind defaults', () => {
    const className = toClass(`<Text fontSize="$base" lineHeight="$base" />`)
    const fromClass = nativeStyle(Text, className)
    const fromProp = nativeStyleOf(Text, { fontSize: '$base', lineHeight: '$base' })
    expect(className).toContain('text-base')
    expect(className).toContain('leading-base')
    expect(fromClass.fontSize).toBe(fromProp.fontSize)
    expect(fromClass.fontSize).toBe(16)
    expect(typeof fromClass.fontSize).toBe('number')
    expect(fromClass.lineHeight).toBe(fromProp.lineHeight)
    expect(fromClass.lineHeight).toBe(24)
    expect(typeof fromClass.lineHeight).toBe('number')
  })

  test('fontSize={14} → 14', () => {
    const v = resolved(Text, `<Text fontSize={14} />`, 'fontSize')
    expect(v).toBe(14)
    expect(typeof v).toBe('number')
  })
  test('lineHeight={20} → 20', () => {
    const v = resolved(Text, `<Text lineHeight={20} />`, 'lineHeight')
    expect(v).toBe(20)
    expect(typeof v).toBe('number')
  })
  test('letterSpacing={0} → 0 (not dropped)', () => {
    const v = resolved(Text, `<Text letterSpacing={0} />`, 'letterSpacing')
    expect(v).toBe(0)
    expect(typeof v).toBe('number')
  })
  test('leading-[20px] → 20 number (native); leading-[1.25] unitless stays a web multiplier', () => {
    // px lineHeight is native-valid → number 20
    const px = flat('leading-[20px]').lineHeight
    expect(px).toBe(20)
    expect(typeof px).toBe('number')
    // a UNITLESS multiplier stays a string ('1.25') — a number would px-ify to 1.25px on web
    // (RN has no unitless multiplier; this is web-only semantics, preserved verbatim)
    expect(flat('leading-[1.25]').lineHeight).toBe('1.25')
  })
})

describe('native — unitless props', () => {
  test('aspectRatio={1.5} → 1.5 (unitless number, not 1.5px)', () => {
    expect(toClass(`<View aspectRatio={1.5} />`)).toContain('aspect-[1.5]')
    const v = resolved(View, `<View aspectRatio={1.5} />`, 'aspectRatio')
    expect(v).toBe(1.5)
    expect(typeof v).toBe('number')
  })
  test('zIndex="$10" → 10 number', () => {
    const v = resolved(View, `<View zIndex="$10" />`, 'zIndex')
    expect(v).toBe(nativeStyleOf(View, { zIndex: '$10' }).zIndex)
    expect(v).toBe(10)
    expect(typeof v).toBe('number')
  })
  test('opacity={0.333} → EXACT 0.333 (named form only when exact, else arbitrary)', () => {
    expect(toClass(`<View opacity={0.333} />`)).toContain('opacity-[0.333]')
    expect(resolved(View, `<View opacity={0.333} />`, 'opacity')).toBe(0.333) // never 0.33
    expect(resolved(View, `<View opacity={0.5} />`, 'opacity')).toBe(0.5)
  })
})

describe('native — named enum: fontWeight', () => {
  test('fontWeight={700} → font-bold → RN weight "700"; unknown weight retained', () => {
    expect(toClass(`<Text fontWeight={700} />`)).toContain('font-bold')
    expect(resolved(Text, `<Text fontWeight={700} />`, 'fontWeight')).toBe('700')
    // a non-standard weight is NOT mis-emitted as font-[450] (would set fontFamily) — retained
    const out = tamaguiToTailwind(`<Text fontWeight="450" />`, {
      renameComponents: false,
      tokens: (v6 as any).tokens,
    })
    expect(out).not.toMatch(/font-\[450\]/)
    expect(out).toContain('fontWeight="450"')
  })
})

describe('native — directional borders + per-edge radii (converter-driven)', () => {
  test('borderRightWidth={1} + borderRightColor="$color2"', () => {
    const s = nativeStyle(
      View,
      toClass(`<View borderRightWidth={1} borderRightColor="$color2" />`)
    )
    expect(s.borderRightWidth).toBe(1)
    expect(typeof s.borderRightWidth).toBe('number')
    expect(s.borderRightColor).toBeTruthy()
    expect(s.borderRightColor).not.toBe('color2')
  })
  test('configured rounded-tl-lg radius token round-trips and is consumed', () => {
    expect(CFG.tokensParsed.radius).toHaveProperty('$lg')
    expect(toClass(`<View borderTopLeftRadius="$lg" />`)).toBe('rounded-tl-lg')
    expect(flat('rounded-tl-lg').className).toBeUndefined()
    expect(nativeStyle(View, 'rounded-tl-lg').borderTopLeftRadius).toBe(8)
  })
  test('parser: a missing radius token is passthrough, never guessed', () => {
    expect(CFG.tokensParsed.radius).not.toHaveProperty('$missing-radius')
    expect(flat('rounded-tl-missing-radius').className).toBe('rounded-tl-missing-radius')
    expect(
      nativeStyle(View, 'rounded-tl-missing-radius').borderTopLeftRadius
    ).toBeUndefined()
  })
})

describe('native — responsive media (converter-driven, parser-level structure)', () => {
  test('$md show/hide reconstructs the correct media prop', () => {
    const showCls = toClass(`<View display="none" $md={{ display: 'flex' }} />`)
    expect(showCls).toContain('md:flex')
    expect(showCls).not.toMatch(/max-md/)
    expect(flat(showCls).$md).toEqual({ display: 'flex' })
    const hideCls = toClass(`<View display="flex" $md={{ display: 'none' }} />`)
    expect(flat(hideCls).$md).toEqual({ display: 'none' })
  })
})
