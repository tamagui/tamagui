/**
 * CONFIG-AWARE converter → runtime round-trip (WEB).
 *
 * The converter is a GENERAL tool run on arbitrary apps: token membership and media
 * pass-through MUST come from the app's ACTUAL config, while values stay runtime-owned. This file
 * builds a CUSTOM config (custom token values/names, a font named `sans`, and a custom `tablet`
 * breakpoint) and proves the converter, given that config, produces classes that resolve to the
 * CUSTOM values at runtime — i.e. it read the passed config.
 */

import { beforeAll, describe, expect, test } from 'vitest'
import { defaultConfig as v6 } from '@tamagui/config/v6'
import { tamaguiToTailwind } from '@tamagui/to-tailwind'

import { createTamagui } from '@tamagui/web'
import { resolveTailwindClassName } from '../candidate'
import { View } from '../index'
import { resolvedStyle, splitTailwindStyles } from './utils'

// custom config: overridden token scales + an extra media key
const tokens = {
  ...(v6 as any).tokens,
  space: { ...(v6 as any).tokens.space, 4: 20 }, // default is 16 → prove we use 20
  zIndex: { 4: 40 },
}
const media = { ...(v6 as any).media, tablet: { minWidth: 900 } }
const fonts = { ...(v6 as any).fonts, sans: (v6 as any).fonts.body }
const convertOpts = { renameComponents: false as const, tokens, fonts, media }

let CFG: any

beforeAll(() => {
  CFG = createTamagui({
    ...(v6 as any),
    tokens,
    fonts,
    media,
  } as any)
})

function className(sourceJSX: string): string {
  const out = tamaguiToTailwind(sourceJSX, convertOpts)
  const m = /className="([^"]*)"/.exec(out)
  return m ? m[1] : ''
}
function flat(cls: string): Record<string, any> {
  return resolveTailwindClassName(cls, CFG)
}
function styleFlat(props: Record<string, any>): Record<string, any> {
  const s = splitTailwindStyles(View, props, {
    theme: (CFG.themes as any).light,
    themeName: 'light',
  })
  return resolvedStyle(s)
}
describe('config-aware tokens (WEB) — class names follow runtime-owned values', () => {
  test('space.4: padding="4" → p-4 → direct-token parity', () => {
    const cls = className(`<View padding="4" />`)
    const fromClass = styleFlat({ className: cls }).paddingTop
    const fromProp = styleFlat({ padding: '4' }).paddingTop
    expect(cls).toContain('p-4')
    expect(tokens.space['4']).toBe(20)
    expect(CFG.tokensParsed.space['4'].val).toBe(20)
    expect(fromClass).toBe(fromProp)
    expect(typeof fromClass).toBe('string')
  })

  test('overriding space.4 does not mutate the distinct size.4 domain', () => {
    const cls = className(`<View width="4" />`)
    expect(cls).toContain('w-4')
    expect(tokens.size['4']).toBe(16)
    expect(CFG.tokensParsed.size['4'].val).toBe(16)
    expect(styleFlat({ className: cls }).width).toBe(styleFlat({ width: '4' }).width)
  })

  test('zIndex="4" → z-4 → configured token parity', () => {
    const cls = className(`<View zIndex="4" />`)
    expect(cls).toContain('z-4')
    expect(String(styleFlat({ className: cls }).zIndex)).toBe(
      String(styleFlat({ zIndex: '4' }).zIndex)
    )
  })

  test('auto stays a flat literal while w-auto is a candidate-layer convenience', () => {
    const cls = className(`<View width="auto" />`)
    expect(cls).toContain('w-auto')
    expect(flat(cls).width).toBe('auto')
    expect(styleFlat({ width: 'auto' }).width).toBe('auto')
    expect(styleFlat({ className: cls }).width).toBe('auto')
  })

  test('fontFamily.sans wins font-sans and resolves the configured token', () => {
    const cls = className(`<View fontFamily="sans" />`)
    expect(cls).toContain('font-sans')
    expect(flat(cls).fontFamily).toBe('sans')
    expect(styleFlat({ className: cls }).fontFamily).toBe(
      styleFlat({ fontFamily: 'sans' }).fontFamily
    )
  })

  test('outline and shadow use their prop-named token domains', () => {
    expect(tokens.space['2']).toBe(8)
    expect(tokens.outlineWidth['2']).toBe(2)
    expect(styleFlat({ className: 'outline-2' }).outlineWidth).toBe(
      styleFlat({ outlineWidth: '2' }).outlineWidth
    )
    expect(styleFlat({ className: 'shadow-sm' }).boxShadow).toBe(
      styleFlat({ boxShadow: 'sm' }).boxShadow
    )
  })

  test('named and none shadows compose with rings in either authored order on web', () => {
    const shadowFirst = styleFlat({ className: 'shadow-sm ring-2 ring-[blue]' })
    const ringFirst = styleFlat({ className: 'ring-2 ring-[blue] shadow-sm' })
    const noShadow = styleFlat({ className: 'shadow-none ring-2 ring-[blue]' })

    expect(shadowFirst.boxShadow).toBe(ringFirst.boxShadow)
    expect(shadowFirst.boxShadow).toContain('0 1px 3px')
    expect(shadowFirst.boxShadow).toContain('0 0 0 2px blue')
    expect(noShadow.boxShadow).toBe('0 0 0 2px blue')
  })

  test('logical layout candidates reach the rendered web style', () => {
    const fromClass = styleFlat({
      className: 'block-4 inline-1/2 inset-s-4 -inset-be-2',
    })

    expect(fromClass.height).toBe(styleFlat({ blockSize: '4' }).height)
    expect(fromClass.width).toBe('50%')
    expect(fromClass.insetInlineStart).toBe(
      styleFlat({ insetInlineStart: '4' }).insetInlineStart
    )
    expect(fromClass.bottom).toBe(styleFlat({ insetBlockEnd: '-2' }).bottom)
  })

  test('container sizes, zero radii, and transparent colors render on web', () => {
    const fromClass = styleFlat({
      className: 'w-2xl rounded-t-none bg-transparent',
    })

    expect(fromClass.width).toBe(styleFlat({ width: '2xl' }).width)
    expect(fromClass.borderTopLeftRadius).toBe('0px')
    expect(fromClass.borderTopRightRadius).toBe('0px')
    expect(fromClass.backgroundColor).toBe('transparent')
  })

  test('3D transforms, origins, perspective, and order reach the rendered web style', () => {
    const fromClass = styleFlat({
      className: 'rotate-x-45 -rotate-y-12 skew-6 origin-top-right -order-1',
    })
    const direct = styleFlat({
      rotateX: '45deg',
      rotateY: '-12deg',
      skewX: '6deg',
      skewY: '6deg',
      transformOrigin: '100% 0',
      order: -1,
    })

    expect(fromClass).toMatchObject(direct)
    expect(fromClass.transformOrigin).toBe('100% 0')
    expect(String(fromClass.order)).toBe('-1')
  })

  test('3D transform matrix order is stable across class order on web', () => {
    const rotateFirst = styleFlat({ className: 'rotate-x-45 skew-y-6' }).transform
    const skewFirst = styleFlat({ className: 'skew-y-6 rotate-x-45' }).transform

    expect(rotateFirst).toBe(skewFirst)
    expect(rotateFirst).toBe('rotateX(45deg) skewY(6deg)')
  })

  test('perspective stays with the official web engine because it is a parent property', () => {
    expect(flat('perspective-near')).toEqual({ className: 'perspective-near' })
  })

  test('order-none and negative arbitrary order render their exact web values', () => {
    expect(String(styleFlat({ className: 'order-none' }).order)).toBe('0')
    expect(String(styleFlat({ className: '-order-[17]' }).order)).toBe('-17')
  })
})

describe('config-aware media (WEB) — a custom breakpoint round-trips', () => {
  test('a tablet clause keeps the shared conditional spelling', () => {
    const cls = className(`<View padding="tablet:10px" />`)
    expect(cls).toContain('tablet:p-[10px]')
    expect(CFG.media.tablet).toEqual({ minWidth: 900 })
    expect(flat(cls).padding).toEqual({ tablet: '10px' })
  })
})
