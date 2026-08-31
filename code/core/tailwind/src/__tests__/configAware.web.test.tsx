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
})

describe('config-aware media (WEB) — a custom breakpoint round-trips', () => {
  test('a tablet clause keeps the shared conditional spelling', () => {
    const cls = className(`<View padding="tablet:10px" />`)
    expect(cls).toContain('tablet:p-[10px]')
    expect(CFG.media.tablet).toEqual({ minWidth: 900 })
    expect(flat(cls).padding).toEqual({ tablet: '10px' })
  })
})
